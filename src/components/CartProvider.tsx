"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface CartItem {
  productId: string;
  name: string;
  slug: string;
  imageUrl: string;
  priceCents: number;
  quantity: number;
  deliveryType: string;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (item: Omit<CartItem, 'quantity'> & { quantity?: number }) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getTotal: () => number;
  getItemCount: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isMounted, setIsMounted] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    setIsMounted(true);
    const savedCart = localStorage.getItem('loja-cart');
    if (savedCart) {
      try {
        setItems(JSON.parse(savedCart));
      } catch (e) {
        console.error('Failed to parse cart', e);
      }
    }
  }, []);

  // Save to localStorage when items change
  useEffect(() => {
    if (isMounted) {
      localStorage.setItem('loja-cart', JSON.stringify(items));
    }
  }, [items, isMounted]);

  const addToCart = (newItem: Omit<CartItem, 'quantity'> & { quantity?: number }) => {
    setItems((prevItems) => {
      const existingItem = prevItems.find((item) => item.productId === newItem.productId);
      
      if (existingItem) {
        return prevItems.map((item) => 
          item.productId === newItem.productId 
            ? { ...item, quantity: item.quantity + (newItem.quantity || 1) } 
            : item
        );
      }
      
      return [...prevItems, { ...newItem, quantity: newItem.quantity || 1 }];
    });
  };

  const removeFromCart = (productId: string) => {
    setItems((prevItems) => prevItems.filter((item) => item.productId !== productId));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    
    setItems((prevItems) => 
      prevItems.map((item) => 
        item.productId === productId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const getTotal = () => {
    return items.reduce((total, item) => total + (item.priceCents * item.quantity), 0);
  };

  const getItemCount = () => {
    return items.reduce((count, item) => count + item.quantity, 0);
  };

  return (
    <CartContext.Provider value={{
      items,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      getTotal,
      getItemCount
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
