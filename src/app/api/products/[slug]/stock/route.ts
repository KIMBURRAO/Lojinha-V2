import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAdminFromCookies } from '@/lib/auth';

export async function GET(req: NextRequest, props: { params: Promise<{ slug: string }> }) {
  const params = await props.params;
  try {
    const admin = await getAdminFromCookies();
    if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const product = await prisma.product.findFirst({
      where: { slug: params.slug }
    });

    if (!product) return NextResponse.json({ error: 'Product not found' }, { status: 404 });

    const stockItems = await prisma.stockItem.findMany({
      where: { productId: product.id },
      orderBy: { id: 'desc' }
    });

    return NextResponse.json(stockItems);
  } catch (error) {
    console.error('Error fetching stock:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest, props: { params: Promise<{ slug: string }> }) {
  const params = await props.params;
  try {
    const admin = await getAdminFromCookies();
    if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const product = await prisma.product.findFirst({
      where: { slug: params.slug }
    });

    if (!product) return NextResponse.json({ error: 'Product not found' }, { status: 404 });

    const { items } = await req.json();

    if (!items || !Array.isArray(items)) {
      return NextResponse.json({ error: 'Items array is required' }, { status: 400 });
    }

    const createdItems = await Promise.all(
      items.map(content =>
        prisma.stockItem.create({
          data: {
            productId: product.id,
            content,
            isUsed: false
          }
        })
      )
    );

    return NextResponse.json({ success: true, count: createdItems.length });
  } catch (error) {
    console.error('Error creating stock items:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
