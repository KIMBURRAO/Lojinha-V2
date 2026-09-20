"use client";

import { CartProvider, useCart } from "@/components/CartProvider";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { ReactNode } from "react";

function StoreLayoutInner({ children }: { children: ReactNode }) {
  const { getItemCount } = useCart();

  return (
    <>
      <Header cartItemCount={getItemCount()} />
      <main className="flex-grow pt-[72px]">
        {children}
      </main>
      <Footer />
    </>
  );
}

export default function StoreLayout({ children }: { children: ReactNode }) {
  return (
    <CartProvider>
      <StoreLayoutInner>{children}</StoreLayoutInner>
    </CartProvider>
  );
}
