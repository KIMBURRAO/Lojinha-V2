"use client";

import Link from 'next/link';
import PriceTag from './PriceTag';
import StockBadge from './StockBadge';

export interface ProductProps {
  name: string;
  slug: string;
  imageUrl: string;
  priceCents: number;
  originalPriceCents?: number;
  shortDescription: string;
  deliveryType: string;
  stockCount?: number;
}

export default function ProductCard({
  name,
  slug,
  imageUrl,
  priceCents,
  originalPriceCents,
  shortDescription,
  deliveryType,
  stockCount
}: ProductProps) {
  const isOutOfStock = deliveryType === 'STOCK' && stockCount === 0;

  return (
    <Link href={`/produto/${slug}`} className="block group h-full">
      <div className="bg-card border border-border rounded-xl overflow-hidden transition-all duration-300 group-hover:border-neon/50 group-hover:-translate-y-1 h-full flex flex-col">
        
        {/* Image Area */}
        <div className="aspect-[4/3] bg-[#111] relative overflow-hidden flex items-center justify-center border-b border-border">
          {imageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img 
              src={imageUrl} 
              alt={name}
              className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <span className="text-4xl text-text-muted">📦</span>
          )}
        </div>

        {/* Body */}
        <div className="p-4 flex flex-col flex-1 gap-3">
          <div className="flex-1">
            <h3 className="font-semibold text-text-primary truncate mb-1" title={name}>
              {name}
            </h3>
            <p className="text-sm text-text-secondary line-clamp-2" title={shortDescription}>
              {shortDescription}
            </p>
          </div>

          <div>
            <StockBadge deliveryType={deliveryType} stockCount={stockCount} />
          </div>
          
          <div className="mt-auto pt-2 border-t border-border flex items-end justify-between">
            <PriceTag priceCents={priceCents} originalPriceCents={originalPriceCents} />
          </div>

          <button 
            className={`w-full py-2.5 rounded-lg font-medium transition-colors mt-2 ${
              isOutOfStock 
                ? 'bg-border text-text-muted cursor-not-allowed' 
                : 'bg-neon hover:bg-neon-hover text-background shadow-[0_0_10px_var(--color-neon-glow)]'
            }`}
            disabled={isOutOfStock}
            onClick={(e) => {
              if (isOutOfStock) e.preventDefault();
            }}
          >
            {isOutOfStock ? 'Indisponível' : 'Comprar'}
          </button>
        </div>
      </div>
    </Link>
  );
}
