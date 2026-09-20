import { prisma } from "@/lib/prisma";
import CategorySection from "@/components/CategorySection";
import Link from "next/link";

export const revalidate = 60; // Revalidate every minute

export default async function HomePage() {
  const categories = await prisma.category.findMany({
    orderBy: { order: "asc" },
    include: {
      products: {
        where: { isActive: true },
        include: {
          stockItems: {
            where: { isUsed: false }
          }
        }
      }
    }
  });

  return (
    <div>
      {/* Top announcement bar */}
      <div className="bg-neon text-background text-center py-2 text-sm font-semibold uppercase tracking-wider">
        Comunidade #1 de automação com N8N
      </div>

      {/* Hero section */}
      <section className="bg-card border-b border-border py-20 px-4 text-center">
        <h1 className="text-4xl md:text-6xl font-bold uppercase mb-4 text-text-primary">
          Automatize seu negócio com N8N
        </h1>
        <p className="text-lg md:text-xl text-text-secondary mb-8 max-w-2xl mx-auto">
          Os melhores templates, scripts e recursos para decolar sua automação e economizar tempo.
        </p>
        <Link href="#produtos" className="inline-block bg-neon text-background px-8 py-4 rounded-xl font-bold uppercase hover:opacity-90 transition-opacity">
          Explorar Produtos
        </Link>
      </section>

      {/* Categories */}
      <div id="produtos" className="container mx-auto px-4 py-12 space-y-16">
        {categories.map((category) => {
          if (category.products.length === 0) return null;

          const mappedProducts = category.products.map((p: any) => ({
            name: p.name,
            slug: p.slug,
            imageUrl: p.imageUrl,
            priceCents: p.priceCents,
            originalPriceCents: p.originalPriceCents,
            shortDescription: p.shortDescription,
            deliveryType: p.deliveryType,
            stockCount: p.deliveryType === 'STOCK' ? p.stockItems.length : undefined
          }));

          return (
            <CategorySection
              key={category.id}
              title={category.name}
              products={mappedProducts}
            />
          );
        })}
      </div>
    </div>
  );
}
