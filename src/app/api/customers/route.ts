import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAdminFromCookies } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    const admin = await getAdminFromCookies();
    if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const customers = await prisma.customer.findMany({
      include: {
        _count: {
          select: { orders: true }
        }
      },
      orderBy: { id: 'desc' }
    });

    return NextResponse.json(customers);
  } catch (error) {
    console.error('Error fetching customers:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
