import { formatPrice, calculateDiscount } from '@/lib/utils';

interface PriceTagProps {
  priceCents: number;
  originalPriceCents?: number;
}

export default function PriceTag({ priceCents, originalPriceCents }: PriceTagProps) {
  const discount = calculateDiscount(originalPriceCents || 0, priceCents);
  const hasDiscount = originalPriceCents && originalPriceCents > priceCents;

  return (
    <div className="flex flex-col">
      {hasDiscount && (
        <div className="flex items-center gap-2">
          <span className="line-through text-text-muted text-sm">
            {formatPrice(originalPriceCents!)}
          </span>
          {discount > 0 && (
            <span className="bg-neon text-background rounded-full px-2 py-0.5 text-[10px] font-bold">
              -{discount}%
            </span>
          )}
        </div>
      )}
      <span className="text-neon font-bold text-xl">
        {formatPrice(priceCents)}
      </span>
    </div>
  );
}
