"use client";
import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';

export default function AdminProdutoForm() {
  const params = useParams();
  const router = useRouter();
  const isNew = params.slug === 'novo';

  const [loading, setLoading] = useState(!isNew);
  const [categories, setCategories] = useState<any[]>([]);
  const [saving, setSaving] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    categoryId: '',
    price: '',
    originalPrice: '',
    deliveryType: 'FIXED',
    shortDescription: '',
    description: '',
    imageUrl: '',
    fixedDeliveryContent: '',
    isActive: true
  });

  const [stockItems, setStockItems] = useState<any[]>([]);
  const [newStockItems, setNewStockItems] = useState('');

  useEffect(() => {
    fetch('/api/categories', { credentials: 'include' })
      .then(res => res.json())
      .then(data => setCategories(data.categories || data || []));

    if (!isNew) {
      fetch(`/api/products/${params.slug}`, { credentials: 'include' })
        .then(res => res.json())
        .then(data => {
          const p = data.product || data;
          setFormData({
            name: p.name || '',
            slug: p.slug || '',
            categoryId: p.categoryId || '',
            price: p.price ? (p.price / 100).toFixed(2) : '',
            originalPrice: p.originalPrice ? (p.originalPrice / 100).toFixed(2) : '',
            deliveryType: p.deliveryType || 'FIXED',
            shortDescription: p.shortDescription || '',
            description: p.description || '',
            imageUrl: p.imageUrl || '',
            fixedDeliveryContent: p.fixedDeliveryContent || '',
            isActive: p.isActive !== false
          });
          setStockItems(p.stockItems || []);
          setLoading(false);
        });
    }
  }, [isNew, params.slug]);

  const handleChange = (e: any) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    if (name === 'name' && isNew) {
      setFormData(prev => ({
        ...prev,
        slug: value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '')
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    
    const payload = {
      ...formData,
      price: Math.round(parseFloat(formData.price) * 100),
      originalPrice: formData.originalPrice ? Math.round(parseFloat(formData.originalPrice) * 100) : null
    };

    const url = isNew ? '/api/products' : `/api/products/${params.slug}`;
    const method = isNew ? 'POST' : 'PUT';

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        credentials: 'include'
      });
      if (res.ok) {
        router.push('/admin/produtos');
      } else {
        alert('Erro ao salvar');
      }
    } catch (err) {
      alert('Erro ao salvar');
    }
    setSaving(false);
  };

  const handleDelete = async () => {
    if (!confirm('Tem certeza que deseja excluir?')) return;
    try {
      const res = await fetch(`/api/products/${params.slug}`, {
        method: 'DELETE',
        credentials: 'include'
      });
      if (res.ok) router.push('/admin/produtos');
    } catch (err) {
      alert('Erro ao excluir');
    }
  };

  const handleAddStock = async () => {
    if (!newStockItems.trim()) return;
    try {
      const items = newStockItems.split('\n').filter(i => i.trim());
      const res = await fetch(`/api/products/${params.slug}/stock`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items }),
        credentials: 'include'
      });
      if (res.ok) {
        const data = await res.json();
        setStockItems(data.stockItems || data || []);
        setNewStockItems('');
        alert('Itens adicionados');
      }
    } catch (err) {
      alert('Erro ao adicionar estoque');
    }
  };

  if (loading) return <div className="animate-pulse h-64 bg-card rounded-xl"></div>;

  return (
    <div className="max-w-4xl mx-auto pb-12">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-4">
          <Link href="/admin/produtos" className="text-text-secondary hover:text-white">← Voltar</Link>
          <h1 className="text-3xl font-bold">{isNew ? 'Novo Produto' : 'Editar Produto'}</h1>
        </div>
        {!isNew && (
          <button onClick={handleDelete} className="bg-danger/10 text-danger px-4 py-2 rounded-lg hover:bg-danger/20 transition-colors">
            Excluir
          </button>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="bg-card border border-border p-6 rounded-xl space-y-6">
          <h2 className="text-xl font-bold border-b border-border pb-4">Informações Básicas</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-2">Nome</label>
              <input required name="name" value={formData.name} onChange={handleChange} className="w-full bg-background border border-border rounded-lg px-4 py-2 focus:border-neon focus:outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Slug</label>
              <input required name="slug" value={formData.slug} onChange={handleChange} className="w-full bg-background border border-border rounded-lg px-4 py-2 focus:border-neon focus:outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Categoria</label>
              <select required name="categoryId" value={formData.categoryId} onChange={handleChange} className="w-full bg-background border border-border rounded-lg px-4 py-2 focus:border-neon focus:outline-none">
                <option value="">Selecione...</option>
                {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Status</label>
              <label className="flex items-center space-x-2 mt-3">
                <input type="checkbox" name="isActive" checked={formData.isActive} onChange={handleChange} className="w-4 h-4 accent-neon" />
                <span>Produto Ativo</span>
              </label>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Preço (R$)</label>
              <input required type="number" step="0.01" name="price" value={formData.price} onChange={handleChange} className="w-full bg-background border border-border rounded-lg px-4 py-2 focus:border-neon focus:outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Preço Original (R$) - Opcional</label>
              <input type="number" step="0.01" name="originalPrice" value={formData.originalPrice} onChange={handleChange} className="w-full bg-background border border-border rounded-lg px-4 py-2 focus:border-neon focus:outline-none" />
            </div>
          </div>
        </div>

        <div className="bg-card border border-border p-6 rounded-xl space-y-6">
          <h2 className="text-xl font-bold border-b border-border pb-4">Detalhes</h2>
          
          <div>
            <label className="block text-sm font-medium mb-2">Descrição Curta</label>
            <textarea name="shortDescription" value={formData.shortDescription} onChange={handleChange} rows={2} className="w-full bg-background border border-border rounded-lg px-4 py-2 focus:border-neon focus:outline-none" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Descrição Completa</label>
            <textarea name="description" value={formData.description} onChange={handleChange} rows={5} className="w-full bg-background border border-border rounded-lg px-4 py-2 focus:border-neon focus:outline-none" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">URL da Imagem</label>
            <input type="url" name="imageUrl" value={formData.imageUrl} onChange={handleChange} className="w-full bg-background border border-border rounded-lg px-4 py-2 focus:border-neon focus:outline-none mb-4" />
            {formData.imageUrl && <img src={formData.imageUrl} alt="Preview" className="h-32 object-contain bg-background rounded border border-border p-2" />}
          </div>
        </div>

        <div className="bg-card border border-border p-6 rounded-xl space-y-6">
          <h2 className="text-xl font-bold border-b border-border pb-4">Entrega</h2>
          
          <div className="flex space-x-6">
            <label className="flex items-center space-x-2">
              <input type="radio" name="deliveryType" value="FIXED" checked={formData.deliveryType === 'FIXED'} onChange={handleChange} className="accent-neon" />
              <span>Entrega Fixa</span>
            </label>
            <label className="flex items-center space-x-2">
              <input type="radio" name="deliveryType" value="STOCK" checked={formData.deliveryType === 'STOCK'} onChange={handleChange} className="accent-neon" />
              <span>Gestão de Estoque</span>
            </label>
          </div>

          {formData.deliveryType === 'FIXED' && (
            <div>
              <label className="block text-sm font-medium mb-2">Conteúdo de Entrega Fixa</label>
              <textarea name="fixedDeliveryContent" value={formData.fixedDeliveryContent} onChange={handleChange} rows={4} className="w-full bg-background border border-border rounded-lg px-4 py-2 focus:border-neon focus:outline-none font-mono text-sm" placeholder="O que o cliente recebe após comprar..." />
            </div>
          )}

          {formData.deliveryType === 'STOCK' && !isNew && (
            <div className="space-y-6 border-t border-border pt-4">
              <div className="flex justify-between items-center">
                <h3 className="font-bold">Gerenciar Estoque</h3>
                <span className="bg-background px-3 py-1 rounded-full text-sm">
                  {stockItems.filter(i => !i.isUsed).length} Disponíveis / {stockItems.length} Total
                </span>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Adicionar Itens (um por linha)</label>
                <textarea value={newStockItems} onChange={e => setNewStockItems(e.target.value)} rows={4} className="w-full bg-background border border-border rounded-lg px-4 py-2 focus:border-neon focus:outline-none font-mono text-sm mb-2" />
                <button type="button" onClick={handleAddStock} className="bg-neon/20 text-neon px-4 py-2 rounded-lg hover:bg-neon/30 transition-colors">
                  Adicionar Itens
                </button>
              </div>

              {stockItems.length > 0 && (
                <div className="max-h-64 overflow-y-auto bg-background rounded-lg border border-border p-4">
                  <table className="w-full text-sm text-left">
                    <thead><tr><th>Conteúdo</th><th>Status</th></tr></thead>
                    <tbody>
                      {stockItems.map((item, idx) => (
                        <tr key={idx} className="border-t border-border">
                          <td className="py-2 font-mono truncate max-w-xs">{item.content}</td>
                          <td className="py-2">
                            <span className={`px-2 py-1 rounded-full text-xs ${item.isUsed ? 'bg-danger/10 text-danger' : 'bg-neon/10 text-neon'}`}>
                              {item.isUsed ? 'Usado' : 'Disponível'}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
          {formData.deliveryType === 'STOCK' && isNew && (
            <p className="text-text-muted text-sm italic">Salve o produto primeiro para adicionar itens ao estoque.</p>
          )}
        </div>

        <div className="flex justify-end pt-4">
          <button type="submit" disabled={saving} className="bg-neon text-black font-bold px-8 py-3 rounded-lg hover:bg-neon-hover transition-colors disabled:opacity-50">
            {saving ? 'Salvando...' : 'Salvar Produto'}
          </button>
        </div>
      </form>
    </div>
  );
}
