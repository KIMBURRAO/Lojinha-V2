"use client";
import { useEffect, useState } from 'react';

export default function AdminCategorias() {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({ name: '', slug: '', order: 0 });

  const fetchCategories = () => {
    fetch('/api/categories', { credentials: 'include' })
      .then(res => res.json())
      .then(data => {
        setCategories(data.categories || data || []);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => {
      const next = { ...prev, [name]: value };
      if (name === 'name' && !prev.slug) {
        next.slug = value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
      }
      return next;
    });
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, order: Number(formData.order) }),
        credentials: 'include'
      });
      if (res.ok) {
        setFormData({ name: '', slug: '', order: 0 });
        fetchCategories();
      }
    } catch (err) {
      alert('Erro ao adicionar');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Excluir categoria?')) return;
    try {
      const res = await fetch(`/api/categories/${id}`, { method: 'DELETE', credentials: 'include' });
      if (res.ok) fetchCategories();
    } catch (err) {
      alert('Erro ao excluir');
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Categorias</h1>

      <div className="bg-card border border-border p-6 rounded-xl mb-8">
        <h2 className="text-xl font-bold mb-4">Adicionar Nova Categoria</h2>
        <form onSubmit={handleAdd} className="flex flex-col md:flex-row gap-4 items-end">
          <div className="flex-1 w-full">
            <label className="block text-sm font-medium mb-1">Nome</label>
            <input required name="name" value={formData.name} onChange={handleChange} className="w-full bg-background border border-border rounded-lg px-4 py-2 focus:border-neon focus:outline-none" />
          </div>
          <div className="flex-1 w-full">
            <label className="block text-sm font-medium mb-1">Slug</label>
            <input required name="slug" value={formData.slug} onChange={handleChange} className="w-full bg-background border border-border rounded-lg px-4 py-2 focus:border-neon focus:outline-none" />
          </div>
          <div className="w-full md:w-32">
            <label className="block text-sm font-medium mb-1">Ordem</label>
            <input type="number" name="order" value={formData.order} onChange={handleChange} className="w-full bg-background border border-border rounded-lg px-4 py-2 focus:border-neon focus:outline-none" />
          </div>
          <button type="submit" className="bg-neon text-black font-semibold px-6 py-2 rounded-lg hover:bg-neon-hover w-full md:w-auto h-[42px]">
            Adicionar
          </button>
        </form>
      </div>

      {loading ? (
        <div className="h-64 bg-card rounded-xl animate-pulse"></div>
      ) : (
        <div className="bg-card border border-border rounded-xl overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-background/50 border-b border-border">
              <tr>
                <th className="px-6 py-4 font-medium text-text-secondary">Nome</th>
                <th className="px-6 py-4 font-medium text-text-secondary">Slug</th>
                <th className="px-6 py-4 font-medium text-text-secondary">Ordem</th>
                <th className="px-6 py-4 font-medium text-text-secondary text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {categories.map(c => (
                <tr key={c.id} className="hover:bg-background/20">
                  <td className="px-6 py-4 font-medium">{c.name}</td>
                  <td className="px-6 py-4 font-mono text-text-muted">{c.slug}</td>
                  <td className="px-6 py-4">{c.order}</td>
                  <td className="px-6 py-4 text-right">
                    <button onClick={() => handleDelete(c.id)} className="text-danger hover:text-red-400">Excluir</button>
                  </td>
                </tr>
              ))}
              {categories.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-text-muted">Nenhuma categoria.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
