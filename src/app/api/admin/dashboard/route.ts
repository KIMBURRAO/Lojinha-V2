import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAdminFromCookies } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    const admin = await getAdminFromCookies();
    if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const now = new Date();
    const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const paidOrdersThisMonth = await prisma.order.findMany({
      where: {
        status: 'PAID',
        paidAt: { gte: firstDayOfMonth }
      }
    });

    const totalSalesThisMonth = paidOrdersThisMonth.reduce((sum, order) => sum + order.totalCents, 0);

    const pendingOrders = await prisma.order.count({
      where: { status: 'PENDING' }
    });

    const totalCustomers = await prisma.customer.count();

    const recentOrders = await prisma.order.findMany({
      take: 5,
      orderBy: { id: 'desc' },
      include: { customer: true }
    });

    // Find products with low or zero stock
    const stockProducts = await prisma.product.findMany({
      where: { deliveryType: 'STOCK', isActive: true },
      include: {
        _count: {
          select: { stockItems: { where: { isUsed: false } } }
        }
      }
    });

    const lowStockProducts = stockProducts.filter(p => p._count.stockItems > 0 && p._count.stockItems < 3);
    const outOfStockProducts = stockProducts.filter(p => p._count.stockItems === 0);

    return NextResponse.json({
      totalSalesThisMonth,
      pendingOrders,
      totalCustomers,
      recentOrders,
      lowStockProducts,
      outOfStockProducts
    });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
