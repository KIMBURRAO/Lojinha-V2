"use client";

import { useState } from "react";
import { useCart } from "@/components/CartProvider";
import { useRouter } from "next/navigation";

interface ProductActionsProps {
  product: {
    id: string;
    name: string;
    slug: string;
    imageUrl: string;
    priceCents: number;
    deliveryType: string;
  };
}

export default function ProductActions({ product }: ProductActionsProps) {
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();
  const router = useRouter();

  const handleAdd = () => {
    setQuantity(q => q + 1);
  };

  const handleMinus = () => {
    if (quantity > 1) {
      setQuantity(q => q - 1);
    }
  };

  const cartItem = {
    productId: product.id,
    name: product.name,
    slug: product.slug,
    imageUrl: product.imageUrl,
    priceCents: product.priceCents,
    deliveryType: product.deliveryType,
  };

  const handleAddToCart = () => {
    addToCart({ ...cartItem, quantity });
    alert("Produto adicionado ao carrinho!");
  };

  const handleBuyNow = () => {
    addToCart({ ...cartItem, quantity });
    router.push("/carrinho");
  };

  return (
    <div className="space-y-4">
      {/* Quantity Selector */}
      <div className="flex items-center border border-border rounded-xl w-fit overflow-hidden bg-background">
        <button 
          onClick={handleMinus}
          className="px-4 py-2 text-text-secondary hover:text-text-primary hover:bg-card transition-colors"
        >
          -
        </button>
        <span className="px-4 py-2 min-w-[3rem] text-center font-semibold text-text-primary">
          {quantity}
        </span>
        <button 
          onClick={handleAdd}
          className="px-4 py-2 text-text-secondary hover:text-text-primary hover:bg-card transition-colors"
        >
          +
        </button>
      </div>

      <div className="flex flex-col gap-3">
        <button 
          onClick={handleBuyNow}
          className="w-full bg-neon text-background font-bold uppercase py-4 rounded-xl hover:opacity-90 transition-opacity"
        >
          Comprar agora
        </button>
        <button 
          onClick={handleAddToCart}
          className="w-full border-2 border-neon text-neon font-bold uppercase py-4 rounded-xl hover:bg-neon hover:text-background transition-colors"
        >
          Adicionar ao carrinho
        </button>
      </div>
    </div>
  );
}
