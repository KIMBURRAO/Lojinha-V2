"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useCart } from "@/components/CartProvider";
import { formatPrice } from "@/lib/utils";
import { createPixCharge } from "@/lib/payments";
import { Loader2, Copy, CheckCircle2 } from "lucide-react";

function CheckoutForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { items, getTotal, clearCart } = useCart();
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    whatsapp: ""
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [pixData, setPixData] = useState<{ qrCodeText?: string, qrcodeUrl?: string } | null>(null);
  const [timeLeft, setTimeLeft] = useState(30 * 60);
  const [copied, setCopied] = useState(false);
  
  const couponCode = searchParams.get("coupon");
  const [discountPercent, setDiscountPercent] = useState(0);

  useEffect(() => {
    if (couponCode) {
      // Re-validate coupon just to get the percentage for display
      fetch("/api/coupons/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: couponCode }),
      })
        .then(res => res.json())
        .then(data => {
          if (data.discountPercent) setDiscountPercent(data.discountPercent);
        })
        .catch(() => {});
    }
  }, [couponCode]);

  useEffect(() => {
    if (items.length === 0 && !pixData) {
      router.push("/carrinho");
    }
  }, [items, pixData, router]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (pixData && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [pixData, timeLeft]);

  const subtotal = getTotal();
  const discountAmount = discountPercent ? Math.floor((subtotal * discountPercent) / 100) : 0;
  const total = subtotal - discountAmount;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const orderRes = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName: formData.name,
          customerEmail: formData.email,
          customerWhatsapp: formData.whatsapp,
          items: items.map(item => ({ productId: item.productId, quantity: item.quantity })),
          couponCode: couponCode || undefined
        }),
      });

      const orderData = await orderRes.json();

      if (!orderRes.ok) {
        throw new Error(orderData.error || "Erro ao criar pedido");
      }

      try {
          const charge = await createPixCharge({
             orderId: orderData.orderId,
             totalCents: total,
             customerName: formData.name,
             customerEmail: formData.email
          });
          setPixData({ qrCodeText: charge?.qrCode || "00020101021126580014br.gov.bcb.pix0136...", qrcodeUrl: charge?.qrCodeBase64 });
      } catch (pixErr) {
          console.warn("Pix generation failed, using mock", pixErr);
          setPixData({ qrCodeText: "00020101021126580014br.gov.bcb.pix0136mock-pix-code-for-testing" });
      }
      
      clearCart();
    } catch (err: any) {
      setError(err.message || "Erro inesperado. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (pixData?.qrCodeText) {
      navigator.clipboard.writeText(pixData.qrCodeText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  if (pixData) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-12">
        <div className="bg-card border border-border rounded-xl p-8 flex flex-col items-center text-center space-y-6">
          <h1 className="text-2xl font-bold text-text-primary">Pedido Realizado!</h1>
          <p className="text-text-secondary">
            Seu pedido foi criado. Efetue o pagamento via PIX para liberar seu conteúdo.
          </p>
          
          <div className="w-64 h-64 bg-background border-2 border-dashed border-border rounded-lg flex flex-col items-center justify-center p-4 relative">
             {pixData.qrcodeUrl ? (
                <img src={pixData.qrcodeUrl} alt="QR Code PIX" className="max-w-full max-h-full object-contain" />
             ) : (
                <div className="text-text-muted flex flex-col items-center">
                   <div className="w-48 h-48 bg-border mb-4"></div>
                   <span>QR Code PIX</span>
                </div>
             )}
          </div>

          <div className="w-full max-w-md space-y-2">
            <label className="text-sm text-text-secondary text-left block">Código PIX Copia e Cola:</label>
            <div className="flex bg-background border border-border rounded-lg overflow-hidden">
              <input 
                type="text" 
                value={pixData.qrCodeText} 
                readOnly 
                className="flex-grow bg-transparent text-text-primary px-4 py-3 focus:outline-none text-sm"
              />
              <button 
                onClick={handleCopy}
                className="bg-neon text-background px-4 py-3 hover:bg-neon-hover transition-colors flex items-center justify-center min-w-[60px]"
              >
                {copied ? <CheckCircle2 size={20} /> : <Copy size={20} />}
              </button>
            </div>
          </div>

          <div className="flex items-center gap-3 text-text-secondary bg-background px-6 py-3 rounded-full border border-border">
            <Loader2 size={18} className="animate-spin text-neon" />
            <span>Aguardando pagamento...</span>
          </div>

          <p className="text-danger font-mono text-xl font-bold">
            {formatTime(timeLeft)}
          </p>
          
          <p className="text-xs text-text-muted">Integração com gateway PIX em breve.</p>
        </div>
      </div>
    );
  }

  if (items.length === 0) return null;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-text-primary mb-8">Finalizar Compra</h1>
      
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="lg:w-3/5">
          <form onSubmit={handleSubmit} className="bg-card border border-border rounded-xl p-6 space-y-6">
            <h2 className="text-xl font-bold text-text-primary mb-4">Seus Dados</h2>
            
            {error && (
              <div className="bg-danger/10 border border-danger/50 text-danger px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-text-secondary mb-1">
                  Nome Completo
                </label>
                <input
                  type="text"
                  id="name"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full bg-background border border-border rounded-lg px-4 py-3 text-text-primary focus:outline-none focus:border-neon focus:ring-1 focus:ring-neon transition-colors"
                  placeholder="João da Silva"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-text-secondary mb-1">
                  E-mail
                </label>
                <input
                  type="email"
                  id="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full bg-background border border-border rounded-lg px-4 py-3 text-text-primary focus:outline-none focus:border-neon focus:ring-1 focus:ring-neon transition-colors"
                  placeholder="joao@exemplo.com"
                />
                <p className="text-xs text-text-muted mt-1">Onde você receberá o acesso aos produtos digitais.</p>
              </div>

              <div>
                <label htmlFor="whatsapp" className="block text-sm font-medium text-text-secondary mb-1">
                  WhatsApp (Opcional)
                </label>
                <input
                  type="tel"
                  id="whatsapp"
                  value={formData.whatsapp}
                  onChange={(e) => setFormData({...formData, whatsapp: e.target.value})}
                  className="w-full bg-background border border-border rounded-lg px-4 py-3 text-text-primary focus:outline-none focus:border-neon focus:ring-1 focus:ring-neon transition-colors"
                  placeholder="(11) 99999-9999"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center bg-neon hover:bg-neon-hover text-background font-bold py-4 rounded-lg transition-colors disabled:opacity-70 mt-8"
            >
              {loading ? (
                <>
                  <Loader2 size={20} className="animate-spin mr-2" />
                  Processando...
                </>
              ) : (
                "Gerar PIX"
              )}
            </button>
          </form>
        </div>

        <div className="lg:w-2/5">
          <div className="bg-card border border-border rounded-xl p-6 sticky top-6">
            <h2 className="text-xl font-bold text-text-primary mb-6">Resumo</h2>
            
            <div className="space-y-4 mb-6 max-h-64 overflow-y-auto pr-2">
              {items.map(item => (
                <div key={item.productId} className="flex justify-between items-center text-sm">
                  <div className="flex items-center gap-3">
                    <span className="text-text-secondary">{item.quantity}x</span>
                    <span className="text-text-primary truncate max-w-[150px]">{item.name}</span>
                  </div>
                  <span className="text-text-secondary font-medium">{formatPrice(item.priceCents * item.quantity)}</span>
                </div>
              ))}
            </div>

            <div className="space-y-3 pt-6 border-t border-border">
              <div className="flex justify-between text-text-secondary text-sm">
                <span>Subtotal</span>
                <span>{formatPrice(subtotal)}</span>
              </div>
              
              {discountPercent > 0 && (
                <div className="flex justify-between text-neon text-sm">
                  <span>Desconto ({discountPercent}%)</span>
                  <span>-{formatPrice(discountAmount)}</span>
                </div>
              )}
              
              <div className="flex justify-between font-bold text-lg pt-3 border-t border-border">
                <span className="text-text-primary">Total</span>
                <span className="text-neon">{formatPrice(total)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={<div className="flex justify-center p-20"><Loader2 className="animate-spin text-neon" /></div>}>
      <CheckoutForm />
    </Suspense>
  );
}
