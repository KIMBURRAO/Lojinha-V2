"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      
      if (!res.ok) {
        throw new Error('Login falhou. Verifique suas credenciais.');
      }
      
      router.push('/admin');
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-card border border-border rounded-xl p-8 shadow-2xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-neon mb-2">N8N Store</h1>
          <p className="text-text-secondary">Painel Administrativo</p>
        </div>
        
        {error && (
          <div className="bg-danger/20 border border-danger text-danger px-4 py-3 rounded-lg mb-6 text-sm">
            {error}
          </div>
        )}
        
        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-text-primary text-sm font-medium mb-2" htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-background border border-border rounded-lg px-4 py-3 text-white focus:border-neon focus:outline-none transition-colors"
              required
            />
          </div>
          <div>
            <label className="block text-text-primary text-sm font-medium mb-2" htmlFor="password">Senha</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-background border border-border rounded-lg px-4 py-3 text-white focus:border-neon focus:outline-none transition-colors"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-neon text-black font-bold px-4 py-3 rounded-lg hover:bg-neon-hover transition-colors"
          >
            Entrar
          </button>
        </form>
      </div>
    </div>
  );
}
