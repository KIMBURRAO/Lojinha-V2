import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAdminFromCookies } from '@/lib/auth';

export async function GET(req: NextRequest, props: { params: Promise<{ slug: string }> }) {
  const params = await props.params;
  try {
    const product = await prisma.product.findFirst({
      where: { slug: params.slug },
      include: {
        category: true,
        _count: {
          select: {
            stockItems: {
              where: { isUsed: false }
            }
          }
        }
      }
    });

    if (!product) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    return NextResponse.json(product);
  } catch (error) {
    console.error('Error fetching product:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, props: { params: Promise<{ slug: string }> }) {
  const params = await props.params;
  try {
    const admin = await getAdminFromCookies();
    if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await req.json();

    const product = await prisma.product.updateMany({
      where: { slug: params.slug },
      data: {
        name: body.name,
        slug: body.slug,
        shortDescription: body.shortDescription,
        fullDescription: body.fullDescription,
        imageUrl: body.imageUrl,
        priceCents: body.priceCents,
        originalPriceCents: body.originalPriceCents,
        deliveryType: body.deliveryType,
        fixedDeliveryContent: body.fixedDeliveryContent,
        categoryId: body.categoryId,
        isActive: body.isActive,
      }
    });

    return NextResponse.json({ success: true, count: product.count });
  } catch (error) {
    console.error('Error updating product:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, props: { params: Promise<{ slug: string }> }) {
  const params = await props.params;
  try {
    const admin = await getAdminFromCookies();
    if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    await prisma.product.updateMany({
      where: { slug: params.slug },
      data: { isActive: false }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting product:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
