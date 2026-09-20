import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    const customer = await prisma.customer.findUnique({
      where: { email }
    });

    if (!customer) {
      return NextResponse.json({ orders: [] });
    }

    const orders = await prisma.order.findMany({
      where: { customerId: customer.id },
      include: {
        items: {
          include: { product: true }
        }
      },
      orderBy: { id: 'desc' }
    });

    const safeOrders = orders.map(order => ({
      ...order,
      items: order.items.map(item => ({
        ...item,
        deliveredContent: order.status === 'PAID' ? item.deliveredContent : null
      }))
    }));

    return NextResponse.json({ orders: safeOrders });
  } catch (error) {
    console.error('Error looking up orders:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
