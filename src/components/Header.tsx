"use client";

import { useState } from 'react';
import Link from 'next/link';

interface HeaderProps {
  cartItemCount: number;
}

export default function Header({ cartItemCount }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-card/80 backdrop-blur-md border-b border-border h-16">
      <div className="max-w-7xl mx-auto px-4 h-full flex items-center justify-between">
        
        {/* Mobile Menu Button */}
        <button 
          className="md:hidden text-text-primary text-xl"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          ☰
        </button>

        {/* Logo */}
        <Link href="/" className="flex items-center gap-1 font-bold text-xl tracking-wider text-text-primary">
          N8N Store <span className="w-2 h-2 rounded-full bg-neon shadow-[0_0_8px_var(--color-neon-glow)]"></span>
        </Link>

        {/* Search */}
        <div className="hidden md:flex flex-1 max-w-md mx-8 relative">
          <input 
            type="text" 
            placeholder="Buscar produtos..." 
            className="w-full bg-[#111111] border border-border rounded-full py-2 pl-10 pr-4 text-sm focus:outline-none focus:border-neon transition-colors"
          />
          <span className="absolute left-3 top-2.5 text-text-muted">🔍</span>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-4">
          <Link href="/suporte" className="hidden sm:flex items-center gap-2 text-text-secondary hover:text-text-primary transition-colors">
            <span className="text-xl">⍰</span>
          </Link>
          
          <Link href="/admin/login" className="hidden sm:block text-sm font-medium hover:text-neon transition-colors">
            Login
          </Link>

          <Link href="/carrinho" className="relative p-2 text-text-primary hover:text-neon transition-colors">
            <span className="text-xl">🛒</span>
            {cartItemCount > 0 && (
              <span className="absolute top-0 right-0 bg-neon text-background text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                {cartItemCount}
              </span>
            )}
          </Link>
        </div>
      </div>
      
      {/* Mobile Menu Dropdown */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-16 left-0 right-0 bg-card border-b border-border p-4 flex flex-col gap-4">
          <input 
            type="text" 
            placeholder="Buscar..." 
            className="w-full bg-[#111111] border border-border rounded-lg py-2 px-4 text-sm focus:outline-none focus:border-neon"
          />
          <Link href="/admin/login" className="text-sm font-medium hover:text-neon">Login</Link>
          <Link href="/suporte" className="text-sm font-medium hover:text-neon">Suporte</Link>
        </div>
      )}
    </header>
  );
}
