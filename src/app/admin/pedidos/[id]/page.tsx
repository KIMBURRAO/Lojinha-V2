"use client";
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { formatPrice } from '@/lib/utils';
import Link from 'next/link';

export default function AdminPedidoDetalhes() {
  const params = useParams();
  const router = useRouter();
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [confirming, setConfirming] = useState(false);

  const fetchOrder = () => {
    fetch(`/api/orders/${params.id}`, { credentials: 'include' })
      .then(res => res.json())
      .then(data => {
        setOrder(data.order || data);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchOrder();
  }, [params.id]);

  const handleConfirmPayment = async () => {
    if (!confirm('Confirmar pagamento deste pedido?')) return;
    setConfirming(true);
    try {
      const res = await fetch(`/api/orders/${params.id}/confirm-payment`, {
        method: 'POST',
        credentials: 'include'
      });
      if (res.ok) {
        fetchOrder();
      } else {
        alert('Erro ao confirmar pagamento');
      }
    } catch (err) {
      alert('Erro ao confirmar pagamento');
    }
    setConfirming(false);
  };

  if (loading) return <div className="animate-pulse h-64 bg-card rounded-xl"></div>;
  if (!order) return <div>Pedido não encontrado</div>;

  return (
    <div className="max-w-4xl mx-auto pb-12">
      <div className="flex items-center space-x-4 mb-8">
        <Link href="/admin/pedidos" className="text-text-secondary hover:text-white">← Voltar</Link>
        <h1 className="text-3xl font-bold">Detalhes do Pedido</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <div className="bg-card border border-border p-6 rounded-xl">
          <h2 className="text-xl font-bold mb-4 border-b border-border pb-2">Informações do Pedido</h2>
          <div className="space-y-3 text-sm">
            <p><span className="text-text-secondary">ID:</span> <span className="font-mono">{order.id}</span></p>
            <p><span className="text-text-secondary">Data:</span> {new Date(order.createdAt).toLocaleString('pt-BR')}</p>
            <p><span className="text-text-secondary">Total:</span> <span className="font-medium text-neon text-lg">{formatPrice(order.total)}</span></p>
            <p className="flex items-center">
              <span className="text-text-secondary mr-2">Status:</span>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                order.status === 'PAID' ? 'bg-neon/10 text-neon' :
                order.status === 'PENDING' ? 'bg-yellow-500/10 text-yellow-500' :
                'bg-danger/10 text-danger'
              }`}>
                {order.status === 'PAID' ? 'Pago' : order.status === 'PENDING' ? 'Pendente' : 'Cancelado'}
              </span>
            </p>
          </div>

          {order.status === 'PENDING' && (
            <button
              onClick={handleConfirmPayment}
              disabled={confirming}
              className="w-full mt-6 bg-neon text-black font-bold py-3 rounded-lg hover:bg-neon-hover transition-colors disabled:opacity-50"
            >
              {confirming ? 'Confirmando...' : 'Marcar como Pago'}
            </button>
          )}
        </div>

        <div className="bg-card border border-border p-6 rounded-xl">
          <h2 className="text-xl font-bold mb-4 border-b border-border pb-2">Cliente</h2>
          <div className="space-y-3 text-sm">
            <p><span className="text-text-secondary">Nome:</span> {order.customer?.name}</p>
            <p><span className="text-text-secondary">Email:</span> {order.customer?.email}</p>
            <p><span className="text-text-secondary">WhatsApp:</span> {order.customer?.phone || 'Não informado'}</p>
          </div>
        </div>
      </div>

      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="p-6 border-b border-border">
          <h2 className="text-xl font-bold">Itens do Pedido</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-background/50 border-b border-border">
              <tr>
                <th className="px-6 py-4 font-medium text-text-secondary">Produto</th>
                <th className="px-6 py-4 font-medium text-text-secondary">Qtd</th>
                <th className="px-6 py-4 font-medium text-text-secondary">Preço Unit.</th>
                <th className="px-6 py-4 font-medium text-text-secondary">Subtotal</th>
                {order.status === 'PAID' && <th className="px-6 py-4 font-medium text-text-secondary">Conteúdo Entregue</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {order.items?.map((item: any) => (
                <tr key={item.id}>
                  <td className="px-6 py-4 font-medium">{item.productName || item.product?.name || 'Produto'}</td>
                  <td className="px-6 py-4">{item.quantity}</td>
                  <td className="px-6 py-4">{formatPrice(item.price)}</td>
                  <td className="px-6 py-4 font-medium">{formatPrice(item.price * item.quantity)}</td>
                  {order.status === 'PAID' && (
                    <td className="px-6 py-4">
                      {item.deliveredContent ? (
                        <div className="bg-background border border-border rounded p-2 text-xs font-mono max-w-xs break-all whitespace-pre-wrap max-h-32 overflow-y-auto">
                          {item.deliveredContent}
                        </div>
                      ) : (
                        <span className="text-text-muted italic">Nenhum conteúdo</span>
                      )}
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
