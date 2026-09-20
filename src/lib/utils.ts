export function formatPrice(cents: number): string {
  return (cents / 100).toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });
}

export function calculateDiscount(original: number, current: number): number {
  if (!original || original <= current) return 0;
  return Math.round(((original - current) / original) * 100);
}

export function cn(...classes: (string | undefined | false)[]): string {
  return classes.filter(Boolean).join(' ');
}
