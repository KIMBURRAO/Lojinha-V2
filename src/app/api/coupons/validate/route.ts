import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest) {
  try {
    const { code } = await req.json();

    if (!code) {
      return NextResponse.json({ valid: false, message: 'Code is required' });
    }

    const coupon = await prisma.coupon.findFirst({
      where: { code: code.toUpperCase() }
    });

    if (!coupon) {
      return NextResponse.json({ valid: false, message: 'Invalid coupon' });
    }

    if (!coupon.isActive) {
      return NextResponse.json({ valid: false, message: 'Coupon is inactive' });
    }

    if (coupon.expiresAt && new Date() > new Date(coupon.expiresAt)) {
      return NextResponse.json({ valid: false, message: 'Coupon has expired' });
    }

    return NextResponse.json({ valid: true, percentOff: coupon.percentOff, discountPercent: coupon.percentOff });
  } catch (error) {
    console.error('Error validating coupon:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
