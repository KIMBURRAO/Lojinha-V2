import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/utils";
import { notFound } from "next/navigation";
import Link from "next/link";
import ProductActions from "@/components/ProductActions";

export default async function ProductPage({ params }: { params: { slug: string } }) {
  const product = await prisma.product.findUnique({
    where: { slug: params.slug },
    include: {
      category: true,
      stockItems: {
        where: { isUsed: false }
      }
    }
  });

  if (!product) {
    notFound();
  }

  const stockCount = product.deliveryType === 'STOCK' ? product.stockItems.length : undefined;

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <div className="text-sm text-text-muted mb-8 flex items-center space-x-2">
        <Link href="/" className="hover:text-text-primary transition-colors">Início</Link>
        <span>&gt;</span>
        <Link href="/" className="hover:text-text-primary transition-colors">Produtos</Link>
        <span>&gt;</span>
        <span className="hover:text-text-primary transition-colors cursor-default">{product.category.name}</span>
        <span>&gt;</span>
        <span className="text-text-secondary">{product.name}</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
        {/* Left: Product Image */}
        <div className="aspect-square rounded-xl bg-card border border-border flex items-center justify-center overflow-hidden relative">
           <img
            src={product.imageUrl}
            alt={product.name}
            className="object-cover w-full h-full"
          />
        </div>

        {/* Right: Product Info */}
        <div className="flex flex-col">
          <h1 className="text-2xl md:text-4xl font-bold uppercase text-text-primary mb-4">
            {product.name}
          </h1>

          <div className="mb-6 flex items-center gap-4">
            <span className="text-3xl font-bold text-neon">
              {formatPrice(product.priceCents)}
            </span>
            {product.originalPriceCents && product.originalPriceCents > product.priceCents && (
              <span className="text-xl text-text-muted line-through">
                {formatPrice(product.originalPriceCents)}
              </span>
            )}
          </div>

          {stockCount !== undefined && (
            <div className="mb-6">
              <span className={`px-3 py-1 text-sm rounded-full font-medium ${stockCount > 0 ? 'bg-green-950 text-neon' : 'bg-red-950 text-red-500'}`}>
                {stockCount > 0 ? `${stockCount} em estoque` : 'Esgotado'}
              </span>
            </div>
          )}

          <div className="text-text-secondary mb-8">
            {product.shortDescription}
          </div>

          <ProductActions 
            product={{
              id: product.id,
              name: product.name,
              slug: product.slug,
              imageUrl: product.imageUrl,
              priceCents: product.priceCents,
              deliveryType: product.deliveryType,
            }}
          />

          {/* Payment Methods Mock */}
          <div className="mt-8 p-4 bg-card border border-border rounded-xl">
             <p className="text-sm text-text-muted mb-2 text-center uppercase">Pagamento Seguro</p>
             <div className="flex justify-center items-center gap-4 text-text-secondary">
               <span className="font-bold">PIX</span>
               <span>VISA</span>
               <span>MASTERCARD</span>
             </div>
          </div>
        </div>
      </div>

      {/* Description */}
      <div className="border-t border-border pt-12 mb-16">
        <h2 className="text-2xl font-bold uppercase mb-6 text-text-primary">Descrição do Produto</h2>
        <div 
          className="prose prose-invert max-w-none text-text-secondary whitespace-pre-line"
          dangerouslySetInnerHTML={{ __html: product.fullDescription }}
        />
      </div>

      {/* Reviews (Mock) */}
      <div className="border-t border-border pt-12">
        <h2 className="text-2xl font-bold uppercase mb-6 text-text-primary">Avaliações</h2>
        <div className="flex items-center gap-8 bg-card border border-border rounded-xl p-8">
           <div className="text-center">
             <div className="text-5xl font-bold text-neon mb-2">4.8</div>
             <div className="text-text-secondary text-sm">127 avaliações</div>
           </div>
           <div className="flex-1 space-y-2">
             {[5, 4, 3, 2, 1].map(stars => (
               <div key={stars} className="flex items-center gap-4">
                 <span className="w-12 text-sm text-text-muted">{stars} estrelas</span>
                 <div className="flex-1 h-2 bg-background rounded-full overflow-hidden">
                   <div 
                     className="h-full bg-neon" 
                     style={{ width: stars === 5 ? '85%' : stars === 4 ? '10%' : '2%' }} 
                   />
                 </div>
               </div>
             ))}
           </div>
        </div>
      </div>
    </div>
  );
}
