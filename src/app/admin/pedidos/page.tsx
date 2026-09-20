"use client";
import { useEffect, useState } from 'react';
import { formatPrice } from '@/lib/utils';
import Link from 'next/link';

export default function AdminPedidos() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('ALL');

  useEffect(() => {
    fetch('/api/orders', { credentials: 'include' })
      .then(res => res.json())
      .then(data => {
        setOrders(data.orders || data || []);
        setLoading(false);
      });
  }, []);

  const filtered = orders.filter(o => filter === 'ALL' || o.status === filter);

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Pedidos</h1>

      <div className="flex space-x-2 mb-6 overflow-x-auto pb-2">
        {['ALL', 'PENDING', 'PAID', 'CANCELLED'].map(status => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`px-4 py-2 rounded-lg whitespace-nowrap transition-colors ${
              filter === status ? 'bg-neon text-black font-semibold' : 'bg-card border border-border text-text-secondary hover:text-white'
            }`}
          >
            {status === 'ALL' ? 'Todos' : status === 'PENDING' ? 'Pendentes' : status === 'PAID' ? 'Pagos' : 'Cancelados'}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="h-64 bg-card rounded-xl animate-pulse"></div>
      ) : (
        <div className="bg-card border border-border rounded-xl overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-background/50 border-b border-border">
              <tr>
                <th className="px-6 py-4 font-medium text-text-secondary">ID</th>
                <th className="px-6 py-4 font-medium text-text-secondary">Cliente</th>
                <th className="px-6 py-4 font-medium text-text-secondary">Data</th>
                <th className="px-6 py-4 font-medium text-text-secondary">Itens</th>
                <th className="px-6 py-4 font-medium text-text-secondary">Total</th>
                <th className="px-6 py-4 font-medium text-text-secondary">Status</th>
                <th className="px-6 py-4 font-medium text-text-secondary text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.map(o => (
                <tr key={o.id} className="hover:bg-background/20 transition-colors">
                  <td className="px-6 py-4 font-mono text-xs">
                    <Link href={`/admin/pedidos/${o.id}`} className="text-neon hover:underline">
                      {o.id.slice(0, 8)}
                    </Link>
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-medium">{o.customer?.name}</div>
                    <div className="text-xs text-text-muted">{o.customer?.email}</div>
                  </td>
                  <td className="px-6 py-4 text-text-muted">{new Date(o.createdAt).toLocaleString('pt-BR')}</td>
                  <td className="px-6 py-4">{o.items?.length || 0}</td>
                  <td className="px-6 py-4 font-medium">{formatPrice(o.total)}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      o.status === 'PAID' ? 'bg-neon/10 text-neon' :
                      o.status === 'PENDING' ? 'bg-yellow-500/10 text-yellow-500' :
                      'bg-danger/10 text-danger'
                    }`}>
                      {o.status === 'PAID' ? 'Pago' : o.status === 'PENDING' ? 'Pendente' : 'Cancelado'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Link href={`/admin/pedidos/${o.id}`} className="text-text-secondary hover:text-white px-2">
                      Ver
                    </Link>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center text-text-muted">Nenhum pedido encontrado.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
