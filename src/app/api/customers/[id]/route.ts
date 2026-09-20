import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAdminFromCookies } from '@/lib/auth';

export async function GET(req: NextRequest, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  try {
    const admin = await getAdminFromCookies();
    if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const customer = await prisma.customer.findUnique({
      where: { id: params.id },
      include: {
        orders: {
          include: {
            items: {
              include: { product: true }
            }
          },
          orderBy: { id: 'desc' }
        }
      }
    });

    if (!customer) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    return NextResponse.json(customer);
  } catch (error) {
    console.error('Error fetching customer:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
