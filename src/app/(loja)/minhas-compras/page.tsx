"use client";

import { useState } from "react";
import { formatPrice } from "@/lib/utils";
import { Search, Package, ChevronDown, ChevronUp, Copy, CheckCircle2, Loader2, Calendar } from "lucide-react";

type OrderItem = {
  id: string;
  product: { name: string };
  unitPriceCents: number;
  quantity: number;
  deliveredContent: string | null;
};

type Order = {
  id: string;
  createdAt: string;
  totalCents: number;
  status: "PENDING" | "PAID" | "CANCELED" | "EXPIRED";
  items: OrderItem[];
};

export default function MinhasComprasPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [orders, setOrders] = useState<Order[]>([]);
  const [error, setError] = useState("");
  const [expandedOrders, setExpandedOrders] = useState<Set<string>>(new Set());
  const [copiedContentId, setCopiedContentId] = useState<string | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setLoading(true);
    setError("");
    setSearched(true);
    
    try {
      const res = await fetch("/api/orders/lookup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || "Erro ao buscar pedidos");
      }
      
      setOrders(data.orders || []);
      setExpandedOrders(new Set(data.orders?.slice(0, 1).map((o: Order) => o.id) || []));
    } catch (err: any) {
      setError(err.message);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const toggleOrder = (id: string) => {
    const newExpanded = new Set(expandedOrders);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedOrders(newExpanded);
  };

  const copyContent = (content: string, id: string) => {
    navigator.clipboard.writeText(content);
    setCopiedContentId(id);
    setTimeout(() => setCopiedContentId(null), 2000);
  };

  const getStatusBadge = (status: Order["status"]) => {
    switch (status) {
      case "PAID":
        return <span className="px-3 py-1 bg-neon/10 text-neon border border-neon/20 rounded-full text-xs font-semibold">Aprovado</span>;
      case "PENDING":
        return <span className="px-3 py-1 bg-yellow-500/10 text-yellow-500 border border-yellow-500/20 rounded-full text-xs font-semibold">Pendente</span>;
      case "CANCELED":
        return <span className="px-3 py-1 bg-danger/10 text-danger border border-danger/20 rounded-full text-xs font-semibold">Cancelado</span>;
      case "EXPIRED":
        return <span className="px-3 py-1 bg-text-muted/10 text-text-muted border border-text-muted/20 rounded-full text-xs font-semibold">Expirado</span>;
      default:
        return null;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('pt-BR', { 
      day: '2-digit', month: '2-digit', year: 'numeric',
      hour: '2-digit', minute: '2-digit'
    }).format(date);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <div className="inline-flex items-center justify-center p-4 bg-card rounded-full border border-border text-neon mb-6">
          <Package size={32} />
        </div>
        <h1 className="text-3xl font-bold text-text-primary mb-4">Minhas Compras</h1>
        <p className="text-text-secondary max-w-lg mx-auto">
          Digite o e-mail usado na compra para visualizar seus pedidos e acessar seus produtos digitais.
        </p>
      </div>

      <div className="bg-card border border-border rounded-xl p-6 mb-8">
        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-4">
          <div className="flex-grow">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Seu e-mail de compra..."
              className="w-full bg-background border border-border rounded-lg px-4 py-3 text-text-primary focus:outline-none focus:border-neon focus:ring-1 focus:ring-neon transition-colors"
            />
          </div>
          <button
            type="submit"
            disabled={loading || !email}
            className="flex items-center justify-center px-8 py-3 bg-neon hover:bg-neon-hover text-background font-semibold rounded-lg transition-colors disabled:opacity-70 whitespace-nowrap"
          >
            {loading ? <Loader2 size={20} className="animate-spin mr-2" /> : <Search size={20} className="mr-2" />}
            Buscar Pedidos
          </button>
        </form>
      </div>

      {error && (
        <div className="bg-danger/10 border border-danger/50 text-danger p-4 rounded-xl mb-8 text-center">
          {error}
        </div>
      )}

      {searched && !loading && !error && orders.length === 0 && (
        <div className="text-center py-12 border border-dashed border-border rounded-xl">
          <p className="text-text-muted mb-2">Nenhum pedido encontrado para este e-mail.</p>
          <p className="text-sm text-text-secondary">Verifique se digitou o e-mail corretamente.</p>
        </div>
      )}

      {orders.length > 0 && (
        <div className="space-y-4">
          {orders.map((order) => {
            const isExpanded = expandedOrders.has(order.id);
            return (
              <div key={order.id} className="bg-card border border-border rounded-xl overflow-hidden transition-all">
                <div 
                  onClick={() => toggleOrder(order.id)}
                  className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 cursor-pointer hover:bg-background/50 transition-colors"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-8">
                    <div>
                      <p className="text-xs text-text-muted mb-1 uppercase font-mono">Pedido #{order.id.slice(0, 8)}</p>
                      <div className="flex items-center text-text-primary font-medium gap-2">
                        <Calendar size={16} className="text-text-secondary" />
                        {formatDate(order.createdAt)}
                      </div>
                    </div>
                    <div>
                      {getStatusBadge(order.status)}
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between sm:justify-end gap-6">
                    <div className="text-right">
                      <p className="text-xs text-text-muted mb-1">Total</p>
                      <p className="text-neon font-bold">{formatPrice(order.totalCents)}</p>
                    </div>
                    <button className="text-text-secondary p-2 bg-background rounded-full border border-border">
                      {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                    </button>
                  </div>
                </div>

                {isExpanded && (
                  <div className="p-5 border-t border-border bg-background/30">
                    {order.status === "PENDING" && (
                      <div className="mb-6 p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg text-yellow-500 text-sm flex items-center justify-center gap-2">
                        <Loader2 size={16} className="animate-spin" />
                        Aguardando pagamento para liberar os produtos.
                      </div>
                    )}
                    
                    <h4 className="text-sm font-semibold text-text-primary mb-4 uppercase tracking-wider">Itens do Pedido</h4>
                    
                    <div className="space-y-6">
                      {order.items.map((item) => (
                        <div key={item.id} className="bg-background border border-border rounded-lg p-4">
                          <div className="flex justify-between items-start mb-4">
                            <div>
                              <h5 className="font-medium text-text-primary">{item.product?.name || 'Produto indisponível'}</h5>
                              <p className="text-sm text-text-secondary">Quantidade: {item.quantity} &times; {formatPrice(item.unitPriceCents)}</p>
                            </div>
                            <p className="font-semibold text-text-primary">{formatPrice(item.unitPriceCents * item.quantity)}</p>
                          </div>
                          
                          {order.status === "PAID" ? (
                            item.deliveredContent ? (
                              <div className="mt-4">
                                <p className="text-xs text-text-secondary mb-2 uppercase font-semibold">Conteúdo Liberado:</p>
                                <div className="relative group">
                                  <pre className="bg-card border border-border p-4 rounded-lg text-sm text-text-primary whitespace-pre-wrap font-mono overflow-x-auto">
                                    {item.deliveredContent}
                                  </pre>
                                  <button 
                                    onClick={() => copyContent(item.deliveredContent!, item.id)}
                                    className="absolute top-2 right-2 p-2 bg-background border border-border rounded-md text-text-secondary hover:text-neon hover:border-neon transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100"
                                    title="Copiar conteúdo"
                                  >
                                    {copiedContentId === item.id ? <CheckCircle2 size={16} className="text-neon" /> : <Copy size={16} />}
                                  </button>
                                </div>
                              </div>
                            ) : (
                              <p className="text-sm text-text-muted italic">Nenhum conteúdo digital associado a este produto.</p>
                            )
                          ) : (
                            <div className="mt-2 text-sm text-text-muted flex items-center gap-2">
                              <Package size={16} />
                              Conteúdo bloqueado
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
