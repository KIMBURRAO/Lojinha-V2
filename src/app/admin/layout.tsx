"use client";
import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (pathname === '/admin/login') return;

    const checkAuth = async () => {
      try {
        const res = await fetch('/api/admin/dashboard', { credentials: 'include' });
        if (res.status === 401) {
          router.push('/admin/login');
        } else {
          setIsAuthenticated(true);
        }
      } catch (err) {
        router.push('/admin/login');
      }
    };

    checkAuth();
  }, [pathname, router]);

  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  if (!isAuthenticated) {
    return <div className="min-h-screen bg-background flex items-center justify-center text-neon">Carregando...</div>;
  }

  const navItems = [
    { label: 'Dashboard', href: '/admin', icon: '📊' },
    { label: 'Produtos', href: '/admin/produtos', icon: '📦' },
    { label: 'Categorias', href: '/admin/categorias', icon: '📁' },
    { label: 'Pedidos', href: '/admin/pedidos', icon: '🛒' },
    { label: 'Cupons', href: '/admin/cupons', icon: '🏷️' },
    { label: 'Clientes', href: '/admin/clientes', icon: '👥' },
  ];

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/admin/login');
  };

  return (
    <div className="min-h-screen bg-background flex text-text-primary">
      {/* Mobile sidebar toggle */}
      <div className="md:hidden fixed top-0 left-0 w-full bg-card border-b border-border p-4 z-50 flex items-center justify-between">
        <span className="font-bold text-neon">N8N Admin</span>
        <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="text-2xl">
          ☰
        </button>
      </div>

      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-40 w-64 bg-card border-r border-border transform transition-transform duration-200 ease-in-out flex flex-col
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        md:relative md:translate-x-0
      `}>
        <div className="p-6">
          <h2 className="text-xl font-bold text-neon mb-1">N8N Store</h2>
          <p className="text-xs text-text-secondary uppercase tracking-wider">Admin</p>
        </div>

        <nav className="flex-1 px-4 space-y-2 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsSidebarOpen(false)}
                className={`flex items-center px-4 py-3 rounded-lg transition-colors ${
                  isActive ? 'bg-neon/10 text-neon font-medium' : 'text-text-secondary hover:text-white hover:bg-background/50'
                }`}
              >
                <span className="mr-3 text-xl">{item.icon}</span>
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-border">
          <button
            onClick={handleLogout}
            className="w-full flex items-center px-4 py-3 text-danger hover:bg-danger/10 rounded-lg transition-colors"
          >
            <span className="mr-3 text-xl">🚪</span>
            Sair
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 min-w-0 flex flex-col pt-16 md:pt-0 h-screen overflow-y-auto">
        <div className="p-6 md:p-8 flex-1">
          {children}
        </div>
      </main>

      {/* Overlay for mobile */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
    </div>
  );
}
