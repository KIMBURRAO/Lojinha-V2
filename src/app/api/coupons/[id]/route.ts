import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAdminFromCookies } from '@/lib/auth';

export async function PUT(req: NextRequest, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  try {
    const admin = await getAdminFromCookies();
    if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { code, percentOff, isActive, expiresAt } = await req.json();

    const coupon = await prisma.coupon.update({
      where: { id: params.id },
      data: {
        code: code?.toUpperCase(),
        percentOff,
        isActive,
        expiresAt: expiresAt ? new Date(expiresAt) : null
      }
    });

    return NextResponse.json(coupon);
  } catch (error) {
    console.error('Error updating coupon:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  try {
    const admin = await getAdminFromCookies();
    if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    await prisma.coupon.delete({
      where: { id: params.id }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting coupon:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
