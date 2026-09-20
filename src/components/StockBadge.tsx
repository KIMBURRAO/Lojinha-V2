interface StockBadgeProps {
  deliveryType: string;
  stockCount?: number;
}

export default function StockBadge({ deliveryType, stockCount }: StockBadgeProps) {
  if (deliveryType === 'FIXED') {
    return (
      <div className="inline-flex items-center border border-neon/50 text-neon px-2 py-1 rounded-full text-xs font-medium bg-neon/5">
        ⚡ Entrega Automática
      </div>
    );
  }

  if (deliveryType === 'STOCK') {
    if (stockCount !== undefined && stockCount > 0) {
      return (
        <div className="inline-flex items-center border border-amber-500/50 text-amber-500 px-2 py-1 rounded-full text-xs font-medium bg-amber-500/5">
          📦 Estoque: {stockCount} disponível
        </div>
      );
    }
    
    return (
      <div className="inline-flex items-center border border-red-500/50 text-red-500 px-2 py-1 rounded-full text-xs font-medium bg-red-500/10">
        ❌ ESGOTADO
      </div>
    );
  }

  return null;
}
