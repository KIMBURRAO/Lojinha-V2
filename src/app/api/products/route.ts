import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAdminFromCookies } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const categorySlug = searchParams.get('category');

    const products = await prisma.product.findMany({
      where: {
        isActive: true,
        ...(categorySlug ? { category: { slug: categorySlug } } : {})
      },
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

    return NextResponse.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const admin = await getAdminFromCookies();
    if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await req.json();

    const product = await prisma.product.create({
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
        isActive: true,
      }
    });

    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    console.error('Error creating product:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
