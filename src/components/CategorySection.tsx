import ProductCard, { ProductProps } from './ProductCard';

interface CategorySectionProps {
  title: string;
  products: ProductProps[];
}

export default function CategorySection({ title, products }: CategorySectionProps) {
  if (!products || products.length === 0) return null;

  return (
    <section className="my-12">
      <div className="flex items-center mb-6">
        <div className="w-1.5 h-6 bg-neon rounded-full mr-3 shadow-[0_0_8px_var(--color-neon-glow)]"></div>
        <h2 className="uppercase font-bold text-xl text-text-primary tracking-wide">
          {title}
        </h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {products.map((product) => (
          <ProductCard key={product.slug} {...product} />
        ))}
      </div>
    </section>
  );
}
