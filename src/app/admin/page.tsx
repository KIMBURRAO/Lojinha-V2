"use client";
import { useEffect, useState } from 'react';
import { formatPrice } from '@/lib/utils';
import Link from 'next/link';

interface DashboardData {
  stats: {
    monthlySales: number;
    pendingOrders: number;
    lowStock: number;
    outOfStock: number;
  };
  recentOrders: Array<{
    id: string;
    customerName: string;
    date: string;
    total: number;
    status: string;
  }>;
}

export default function AdminDashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/admin/dashboard', { credentials: 'include' })
      .then(res => res.json())
      .then(d => {
        setData(d);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  if (loading || !data) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-8 w-48 bg-card rounded-lg mb-8"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map(i => <div key={i} className="h-32 bg-card rounded-xl"></div>)}
        </div>
        <div className="h-64 bg-card rounded-xl mt-8"></div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        <div className="bg-card border border-border p-6 rounded-xl">
          <p className="text-text-secondary text-sm font-medium mb-1">Vendas do Mês</p>
          <p className="text-3xl font-bold text-neon">{formatPrice(data.stats.monthlySales || 0)}</p>
        </div>
        <div className="bg-card border border-border p-6 rounded-xl">
          <p className="text-text-secondary text-sm font-medium mb-1">Pedidos Pendentes</p>
          <p className="text-3xl font-bold text-yellow-500">{data.stats.pendingOrders || 0}</p>
        </div>
        <div className="bg-card border border-border p-6 rounded-xl">
          <p className="text-text-secondary text-sm font-medium mb-1">Estoque Baixo</p>
          <p className="text-3xl font-bold text-orange-500">{data.stats.lowStock || 0}</p>
        </div>
        <div className="bg-card border border-border p-6 rounded-xl">
          <p className="text-text-secondary text-sm font-medium mb-1">Esgotados</p>
          <p className="text-3xl font-bold text-danger">{data.stats.outOfStock || 0}</p>
        </div>
      </div>

      <h2 className="text-xl font-bold mb-4">Pedidos Recentes</h2>
      <div className="bg-card border border-border rounded-xl overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-background/50 border-b border-border">
            <tr>
              <th className="px-6 py-4 font-medium text-text-secondary">ID</th>
              <th className="px-6 py-4 font-medium text-text-secondary">Cliente</th>
              <th className="px-6 py-4 font-medium text-text-secondary">Data</th>
              <th className="px-6 py-4 font-medium text-text-secondary">Total</th>
              <th className="px-6 py-4 font-medium text-text-secondary">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {data.recentOrders?.map((order) => (
              <tr key={order.id} className="hover:bg-background/20 transition-colors">
                <td className="px-6 py-4 font-mono text-xs">
                  <Link href={`/admin/pedidos/${order.id}`} className="text-neon hover:underline">
                    {order.id.slice(0, 8)}
                  </Link>
                </td>
                <td className="px-6 py-4">{order.customerName}</td>
                <td className="px-6 py-4 text-text-muted">{new Date(order.date).toLocaleDateString('pt-BR')}</td>
                <td className="px-6 py-4 font-medium">{formatPrice(order.total)}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    order.status === 'PAID' ? 'bg-neon/10 text-neon' :
                    order.status === 'PENDING' ? 'bg-yellow-500/10 text-yellow-500' :
                    'bg-danger/10 text-danger'
                  }`}>
                    {order.status === 'PAID' ? 'Pago' : order.status === 'PENDING' ? 'Pendente' : 'Cancelado'}
                  </span>
                </td>
              </tr>
            ))}
            {(!data.recentOrders || data.recentOrders.length === 0) && (
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center text-text-muted">Nenhum pedido recente.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
