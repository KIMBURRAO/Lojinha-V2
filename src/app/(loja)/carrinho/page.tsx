"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useCart } from "@/components/CartProvider";
import { formatPrice } from "@/lib/utils";
import { Trash2, Plus, Minus, ShoppingBag } from "lucide-react";

export default function CarrinhoPage() {
  const { items, removeFromCart, updateQuantity, getTotal } = useCart();
  const [couponCode, setCouponCode] = useState("");
  const [couponState, setCouponState] = useState<{ type: "success" | "error" | null; message: string; discountPercent?: number }>({ type: null, message: "" });
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);

  const subtotal = getTotal();
  const discountAmount = couponState.discountPercent ? Math.floor((subtotal * couponState.discountPercent) / 100) : 0;
  const total = subtotal - discountAmount;

  const handleApplyCoupon = async () => {
    if (!couponCode) return;
    setIsApplyingCoupon(true);
    setCouponState({ type: null, message: "" });
    try {
      const res = await fetch("/api/coupons/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: couponCode }),
      });
      const data = await res.json();
      if (res.ok) {
        setCouponState({ type: "success", message: "Cupom aplicado!", discountPercent: data.discountPercent });
      } else {
        setCouponState({ type: "error", message: data.error || "Cupom inválido." });
      }
    } catch (err) {
      setCouponState({ type: "error", message: "Erro ao validar cupom." });
    } finally {
      setIsApplyingCoupon(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 space-y-6">
        <div className="bg-card p-6 rounded-full border border-border text-neon">
          <ShoppingBag size={48} />
        </div>
        <h1 className="text-2xl font-bold text-text-primary">Seu carrinho está vazio</h1>
        <p className="text-text-secondary text-center max-w-md">
          Parece que você ainda não adicionou nenhum produto ao seu carrinho.
        </p>
        <Link
          href="/"
          className="bg-neon hover:bg-neon-hover text-background font-semibold py-3 px-8 rounded-lg transition-colors"
        >
          Continuar comprando
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-text-primary mb-8">Meu Carrinho</h1>
      
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="lg:w-2/3 space-y-6">
          <div className="bg-card border border-border rounded-xl p-6 space-y-6">
            {items.map((item) => (
              <div key={item.productId} className="flex flex-col sm:flex-row items-center gap-4 py-4 border-b border-border last:border-0 last:pb-0 last:pt-4 first:pt-0">
                <div className="w-24 h-24 bg-background rounded-lg overflow-hidden flex-shrink-0 relative border border-border">
                  {item.imageUrl ? (
                    <Image src={item.imageUrl} alt={item.name} fill className="object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-text-muted">Sem Imagem</div>
                  )}
                </div>
                
                <div className="flex-grow flex flex-col items-center sm:items-start text-center sm:text-left space-y-2 sm:space-y-0">
                  <h3 className="text-lg font-medium text-text-primary">{item.name}</h3>
                  <p className="text-neon font-semibold">{formatPrice(item.priceCents)}</p>
                </div>

                <div className="flex items-center gap-4">
                  <div className="flex items-center border border-border rounded-lg bg-background">
                    <button
                      onClick={() => updateQuantity(item.productId, Math.max(1, item.quantity - 1))}
                      className="p-2 text-text-secondary hover:text-text-primary transition-colors disabled:opacity-50"
                      disabled={item.quantity <= 1}
                    >
                      <Minus size={16} />
                    </button>
                    <span className="w-8 text-center text-text-primary font-medium">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                      className="p-2 text-text-secondary hover:text-text-primary transition-colors"
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                  
                  <button
                    onClick={() => removeFromCart(item.productId)}
                    className="p-2 text-text-muted hover:text-danger transition-colors bg-background rounded-lg border border-border"
                    title="Remover produto"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="lg:w-1/3">
          <div className="bg-card border border-border rounded-xl p-6 sticky top-6">
            <h2 className="text-xl font-bold text-text-primary mb-6">Resumo do Pedido</h2>
            
            <div className="space-y-4 mb-6">
              <div className="flex justify-between text-text-secondary">
                <span>Subtotal</span>
                <span className="text-text-primary">{formatPrice(subtotal)}</span>
              </div>
              
              {couponState.type === "success" && couponState.discountPercent && (
                <div className="flex justify-between text-neon">
                  <span>Desconto ({couponState.discountPercent}%)</span>
                  <span>-{formatPrice(discountAmount)}</span>
                </div>
              )}
              
              <div className="pt-4 border-t border-border flex justify-between font-bold text-lg">
                <span className="text-text-primary">Total</span>
                <span className="text-neon">{formatPrice(total)}</span>
              </div>
            </div>

            <div className="mb-6 space-y-3">
              <label htmlFor="coupon" className="block text-sm font-medium text-text-secondary">
                Cupom de Desconto
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  id="coupon"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                  placeholder="DIGITE SEU CUPOM"
                  className="flex-grow bg-background border border-border rounded-lg px-4 py-2 text-text-primary focus:outline-none focus:border-neon focus:ring-1 focus:ring-neon uppercase transition-colors"
                />
                <button
                  onClick={handleApplyCoupon}
                  disabled={!couponCode || isApplyingCoupon}
                  className="bg-background border border-neon text-neon hover:bg-neon hover:text-background font-medium px-4 py-2 rounded-lg transition-colors disabled:opacity-50 disabled:hover:bg-background disabled:hover:text-neon"
                >
                  {isApplyingCoupon ? "..." : "Aplicar"}
                </button>
              </div>
              {couponState.message && (
                <p className={`text-sm ${couponState.type === "success" ? "text-neon" : "text-danger"}`}>
                  {couponState.message}
                </p>
              )}
            </div>

            <Link
              href={couponCode && couponState.type === "success" ? `/checkout?coupon=${couponCode}` : "/checkout"}
              className="block w-full text-center bg-neon hover:bg-neon-hover text-background font-bold py-4 rounded-lg transition-colors"
            >
              Finalizar Compra
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
