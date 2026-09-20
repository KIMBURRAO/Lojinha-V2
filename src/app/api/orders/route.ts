import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAdminFromCookies } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    const admin = await getAdminFromCookies();
    if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status');

    const orders = await prisma.order.findMany({
      where: status ? { status } : {},
      include: {
        customer: true,
        items: {
          include: { product: true }
        }
      },
      orderBy: { id: 'desc' }
    });

    return NextResponse.json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { customerName, customerEmail, customerWhatsapp, items, couponCode } = await req.json();

    if (!customerEmail || !items || !items.length) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Find or create customer
    let customer = await prisma.customer.findUnique({
      where: { email: customerEmail }
    });

    if (!customer) {
      customer = await prisma.customer.create({
        data: { name: customerName, email: customerEmail, whatsapp: customerWhatsapp }
      });
    } else if (customerName !== customer.name || customerWhatsapp !== customer.whatsapp) {
      customer = await prisma.customer.update({
        where: { id: customer.id },
        data: { name: customerName, whatsapp: customerWhatsapp }
      });
    }

    // Calculate total and apply coupon
    let totalCents = 0;
    const orderItemsData = [];

    for (const item of items) {
      const product = await prisma.product.findUnique({
        where: { id: item.productId }
      });
      if (!product || !product.isActive) {
        return NextResponse.json({ error: `Product ${item.productId} not found or inactive` }, { status: 400 });
      }
      
      const itemTotal = product.priceCents * item.quantity;
      totalCents += itemTotal;
      
      orderItemsData.push({
        productId: product.id,
        quantity: item.quantity,
        unitPriceCents: product.priceCents,
      });
    }

    if (couponCode) {
      const coupon = await prisma.coupon.findFirst({
        where: { code: couponCode.toUpperCase(), isActive: true }
      });

      if (coupon && (!coupon.expiresAt || new Date() <= new Date(coupon.expiresAt))) {
        const discount = Math.floor((totalCents * coupon.percentOff) / 100);
        totalCents -= discount;
      }
    }

    const order = await prisma.order.create({
      data: {
        customerId: customer.id,
        totalCents,
        couponCode: couponCode ? couponCode.toUpperCase() : null,
        status: 'PENDING',
        items: {
          create: orderItemsData
        }
      }
    });

    return NextResponse.json({ orderId: order.id, totalCents }, { status: 201 });
  } catch (error) {
    console.error('Error creating order:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
