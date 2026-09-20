import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAdminFromCookies } from '@/lib/auth';

export async function GET(req: NextRequest, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  try {
    const admin = await getAdminFromCookies();
    if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const order = await prisma.order.findUnique({
      where: { id: params.id },
      include: {
        customer: true,
        items: {
          include: {
            product: true
          }
        }
      }
    });

    if (!order) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    const orderItemIds = order.items.map(item => item.id);
    const stockItems = await prisma.stockItem.findMany({
      where: { usedInOrderItemId: { in: orderItemIds } }
    });

    return NextResponse.json({ ...order, stockItems });
  } catch (error) {
    console.error('Error fetching order:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
