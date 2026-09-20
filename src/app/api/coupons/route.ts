import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAdminFromCookies } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    const admin = await getAdminFromCookies();
    if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const coupons = await prisma.coupon.findMany({
      orderBy: { id: 'desc' }
    });

    return NextResponse.json(coupons);
  } catch (error) {
    console.error('Error fetching coupons:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const admin = await getAdminFromCookies();
    if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { code, percentOff, isActive, expiresAt } = await req.json();

    const coupon = await prisma.coupon.create({
      data: {
        code: code.toUpperCase(),
        percentOff,
        isActive,
        expiresAt: expiresAt ? new Date(expiresAt) : null
      }
    });

    return NextResponse.json(coupon, { status: 201 });
  } catch (error) {
    console.error('Error creating coupon:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
