"use client";
import { useEffect, useState } from 'react';

export default function AdminCupons() {
  const [coupons, setCoupons] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({ code: '', percentOff: '', expiresAt: '', isActive: true });

  const fetchCoupons = () => {
    fetch('/api/coupons', { credentials: 'include' })
      .then(res => res.json())
      .then(data => {
        setCoupons(data.coupons || data || []);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  const handleChange = (e: any) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : (name === 'code' ? value.toUpperCase() : value)
    }));
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        code: formData.code,
        percentOff: Number(formData.percentOff),
        isActive: formData.isActive,
        expiresAt: formData.expiresAt ? new Date(formData.expiresAt).toISOString() : null
      };

      const res = await fetch('/api/coupons', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        credentials: 'include'
      });
      if (res.ok) {
        setFormData({ code: '', percentOff: '', expiresAt: '', isActive: true });
        fetchCoupons();
      } else {
        alert('Erro ao criar cupom');
      }
    } catch (err) {
      alert('Erro ao adicionar');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Excluir cupom?')) return;
    try {
      const res = await fetch(`/api/coupons/${id}`, { method: 'DELETE', credentials: 'include' });
      if (res.ok) fetchCoupons();
    } catch (err) {
      alert('Erro ao excluir');
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Cupons</h1>

      <div className="bg-card border border-border p-6 rounded-xl mb-8">
        <h2 className="text-xl font-bold mb-4">Novo Cupom</h2>
        <form onSubmit={handleAdd} className="flex flex-col md:flex-row gap-4 items-end">
          <div className="flex-1">
            <label className="block text-sm font-medium mb-1">Código</label>
            <input required name="code" value={formData.code} onChange={handleChange} placeholder="EX: PROMO20" className="w-full bg-background border border-border rounded-lg px-4 py-2 focus:border-neon focus:outline-none uppercase" />
          </div>
          <div className="w-32">
            <label className="block text-sm font-medium mb-1">Desconto (%)</label>
            <input required type="number" min="1" max="100" name="percentOff" value={formData.percentOff} onChange={handleChange} className="w-full bg-background border border-border rounded-lg px-4 py-2 focus:border-neon focus:outline-none" />
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium mb-1">Validade (Opcional)</label>
            <input type="date" name="expiresAt" value={formData.expiresAt} onChange={handleChange} className="w-full bg-background border border-border rounded-lg px-4 py-2 focus:border-neon focus:outline-none" />
          </div>
          <div className="flex items-center pb-3">
            <label className="flex items-center space-x-2">
              <input type="checkbox" name="isActive" checked={formData.isActive} onChange={handleChange} className="w-4 h-4 accent-neon" />
              <span className="text-sm">Ativo</span>
            </label>
          </div>
          <button type="submit" className="bg-neon text-black font-semibold px-6 py-2 rounded-lg hover:bg-neon-hover h-[42px]">
            Criar
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
                <th className="px-6 py-4 font-medium text-text-secondary">Código</th>
                <th className="px-6 py-4 font-medium text-text-secondary">Desconto</th>
                <th className="px-6 py-4 font-medium text-text-secondary">Validade</th>
                <th className="px-6 py-4 font-medium text-text-secondary">Status</th>
                <th className="px-6 py-4 font-medium text-text-secondary text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {coupons.map(c => {
                const isExpired = c.expiresAt && new Date(c.expiresAt) < new Date();
                return (
                  <tr key={c.id} className="hover:bg-background/20">
                    <td className="px-6 py-4 font-bold font-mono text-neon">{c.code}</td>
                    <td className="px-6 py-4">{c.percentOff}%</td>
                    <td className="px-6 py-4 text-text-muted">
                      {c.expiresAt ? new Date(c.expiresAt).toLocaleDateString('pt-BR') : 'Sem validade'}
                    </td>
                    <td className="px-6 py-4">
                      {isExpired ? (
                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-500/10 text-gray-500">Expirado</span>
                      ) : c.isActive ? (
                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-neon/10 text-neon">Ativo</span>
                      ) : (
                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-danger/10 text-danger">Inativo</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button onClick={() => handleDelete(c.id)} className="text-danger hover:text-red-400">Excluir</button>
                    </td>
                  </tr>
                );
              })}
              {coupons.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-text-muted">Nenhum cupom cadastrado.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
