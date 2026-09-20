"use client";
import { useEffect, useState } from 'react';

export default function AdminClientes() {
  const [customers, setCustomers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/customers', { credentials: 'include' })
      .then(res => res.json())
      .then(data => {
        setCustomers(data.customers || data || []);
        setLoading(false);
      });
  }, []);

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Clientes</h1>

      {loading ? (
        <div className="h-64 bg-card rounded-xl animate-pulse"></div>
      ) : (
        <div className="bg-card border border-border rounded-xl overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-background/50 border-b border-border">
              <tr>
                <th className="px-6 py-4 font-medium text-text-secondary">Nome</th>
                <th className="px-6 py-4 font-medium text-text-secondary">Email</th>
                <th className="px-6 py-4 font-medium text-text-secondary">WhatsApp</th>
                <th className="px-6 py-4 font-medium text-text-secondary">Pedidos</th>
                <th className="px-6 py-4 font-medium text-text-secondary">Data de Cadastro</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {customers.map(c => (
                <tr key={c.id} className="hover:bg-background/20 transition-colors">
                  <td className="px-6 py-4 font-medium">{c.name}</td>
                  <td className="px-6 py-4 text-text-muted">{c.email}</td>
                  <td className="px-6 py-4 text-text-muted">{c.phone || '-'}</td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 bg-background border border-border rounded-full text-xs font-medium">
                      {c.orders?.length || 0}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-text-muted">{new Date(c.createdAt).toLocaleDateString('pt-BR')}</td>
                </tr>
              ))}
              {customers.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-text-muted">Nenhum cliente cadastrado.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
