"use client";
import { useEffect, useState } from 'react';
import { formatPrice } from '@/lib/utils';
import Link from 'next/link';

export default function AdminProdutos() {
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [catFilter, setCatFilter] = useState('');

  useEffect(() => {
    Promise.all([
      fetch('/api/products', { credentials: 'include' }).then(r => r.json()),
      fetch('/api/categories', { credentials: 'include' }).then(r => r.json())
    ]).then(([prodData, catData]) => {
      setProducts(prodData.products || prodData || []);
      setCategories(catData.categories || catData || []);
      setLoading(false);
    });
  }, []);

  const filtered = products.filter(p => 
    p.name.toLowerCase().includes(search.toLowerCase()) &&
    (catFilter === '' || p.categoryId === catFilter || p.category?.slug === catFilter)
  );

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <h1 className="text-3xl font-bold">Produtos</h1>
        <Link href="/admin/produtos/novo" className="bg-neon text-black font-semibold px-4 py-2 rounded-lg hover:bg-neon-hover transition-colors">
          + Novo Produto
        </Link>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <input 
          type="text" 
          placeholder="Buscar produto..." 
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="flex-1 bg-background border border-border rounded-lg px-4 py-2 text-white focus:border-neon focus:outline-none"
        />
        <select 
          value={catFilter} 
          onChange={e => setCatFilter(e.target.value)}
          className="bg-background border border-border rounded-lg px-4 py-2 text-white focus:border-neon focus:outline-none"
        >
          <option value="">Todas Categorias</option>
          {categories.map(c => (
            <option key={c.id || c.slug} value={c.id || c.slug}>{c.name}</option>
          ))}
        </select>
      </div>

      {loading ? (
        <div className="h-64 bg-card rounded-xl animate-pulse"></div>
      ) : (
        <div className="bg-card border border-border rounded-xl overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-background/50 border-b border-border">
              <tr>
                <th className="px-6 py-4 font-medium text-text-secondary w-16">Imagem</th>
                <th className="px-6 py-4 font-medium text-text-secondary">Nome</th>
                <th className="px-6 py-4 font-medium text-text-secondary">Preço</th>
                <th className="px-6 py-4 font-medium text-text-secondary">Tipo</th>
                <th className="px-6 py-4 font-medium text-text-secondary">Status</th>
                <th className="px-6 py-4 font-medium text-text-secondary text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.map(p => (
                <tr key={p.id} className="hover:bg-background/20 transition-colors">
                  <td className="px-6 py-4">
                    {p.imageUrl ? (
                      <img src={p.imageUrl} alt={p.name} className="w-10 h-10 object-cover rounded bg-background" />
                    ) : (
                      <div className="w-10 h-10 bg-background rounded flex items-center justify-center text-text-muted text-xs">Sem Img</div>
                    )}
                  </td>
                  <td className="px-6 py-4 font-medium">
                    <Link href={`/admin/produtos/${p.slug}`} className="hover:text-neon">{p.name}</Link>
                    <div className="text-xs text-text-muted">{p.category?.name}</div>
                  </td>
                  <td className="px-6 py-4">{formatPrice(p.price)}</td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 rounded text-xs font-mono bg-background border border-border">
                      {p.deliveryType}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${p.isActive ? 'bg-neon/10 text-neon' : 'bg-danger/10 text-danger'}`}>
                      {p.isActive ? 'Ativo' : 'Inativo'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Link href={`/admin/produtos/${p.slug}`} className="text-text-secondary hover:text-white px-2">
                      Editar
                    </Link>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-text-muted">Nenhum produto encontrado.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
