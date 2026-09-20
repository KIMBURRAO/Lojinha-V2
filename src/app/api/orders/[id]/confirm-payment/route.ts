import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAdminFromCookies } from '@/lib/auth';

export async function POST(req: NextRequest, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  try {
    const admin = await getAdminFromCookies();
    if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const orderId = params.id;

    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        items: {
          include: { product: true }
        }
      }
    });

    if (!order) return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    if (order.status === 'PAID') return NextResponse.json({ error: 'Order already paid' }, { status: 400 });

    const result = await prisma.$transaction(async (tx) => {
      // 1. Mark order as PAID
      const updatedOrder = await tx.order.update({
        where: { id: orderId },
        data: {
          status: 'PAID',
          paidAt: new Date()
        }
      });

      const stockProductsToCheck = new Set<string>();

      // 2. Process each item
      for (const item of order.items) {
        const product = item.product;
        let deliveredContent = null;

        for (let i = 0; i < item.quantity; i++) {
          if (product.deliveryType === 'FIXED') {
            deliveredContent = product.fixedDeliveryContent;
            
            await tx.orderItem.update({
              where: { id: item.id },
              data: { deliveredContent }
            });

          } else if (product.deliveryType === 'STOCK') {
            const stockItem = await tx.stockItem.findFirst({
              where: { productId: product.id, isUsed: false }
            });

            if (stockItem) {
              await tx.stockItem.update({
                where: { id: stockItem.id },
                data: {
                  isUsed: true,
                  usedInOrderItemId: item.id
                }
              });
              
              const currentItem = await tx.orderItem.findUnique({ where: { id: item.id }});
              const newContent = currentItem?.deliveredContent 
                ? `${currentItem.deliveredContent}\n${stockItem.content}`
                : stockItem.content;

              await tx.orderItem.update({
                where: { id: item.id },
                data: { deliveredContent: newContent }
              });

              stockProductsToCheck.add(product.id);
            } else {
              console.warn(`No stock available for product ${product.id}`);
              const currentItem = await tx.orderItem.findUnique({ where: { id: item.id }});
              const newContent = currentItem?.deliveredContent 
                ? `${currentItem.deliveredContent}\nESTOQUE ESGOTADO - Contate o suporte`
                : 'ESTOQUE ESGOTADO - Contate o suporte';

              await tx.orderItem.update({
                where: { id: item.id },
                data: { deliveredContent: newContent }
              });
            }
          }
        }
      }

      // 3. Check for 0 stock and disable products
      for (const productId of stockProductsToCheck) {
        const remainingStock = await tx.stockItem.count({
          where: { productId, isUsed: false }
        });

        if (remainingStock === 0) {
          await tx.product.update({
            where: { id: productId },
            data: { isActive: false }
          });
        }
      }

      return updatedOrder;
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error confirming payment:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
