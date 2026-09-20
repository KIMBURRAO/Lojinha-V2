import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-[#111] border-t border-border mt-20 py-12 text-sm text-text-secondary">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8">
        
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-1 font-bold text-xl tracking-wider text-text-primary">
            N8N Store <span className="w-2 h-2 rounded-full bg-neon shadow-[0_0_8px_var(--color-neon-glow)]"></span>
          </div>
          <p className="text-text-muted">
            A sua loja definitiva para soluções digitais e automações de alta qualidade.
          </p>
          <div className="flex gap-3 mt-2">
            <div className="w-8 h-8 rounded-full bg-card border border-border flex items-center justify-center hover:border-neon cursor-pointer transition-colors text-lg">𝕏</div>
            <div className="w-8 h-8 rounded-full bg-card border border-border flex items-center justify-center hover:border-neon cursor-pointer transition-colors text-lg">📷</div>
            <div className="w-8 h-8 rounded-full bg-card border border-border flex items-center justify-center hover:border-neon cursor-pointer transition-colors text-lg">💬</div>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <h4 className="font-bold text-text-primary mb-2">Produtos</h4>
          <Link href="/categoria/automacoes" className="hover:text-neon transition-colors">Automações</Link>
          <Link href="/categoria/scripts" className="hover:text-neon transition-colors">Scripts</Link>
          <Link href="/categoria/contas" className="hover:text-neon transition-colors">Contas Premium</Link>
        </div>

        <div className="flex flex-col gap-3">
          <h4 className="font-bold text-text-primary mb-2">Suporte</h4>
          <Link href="/faq" className="hover:text-neon transition-colors">FAQ</Link>
          <Link href="/contato" className="hover:text-neon transition-colors">Contato</Link>
          <Link href="/status" className="hover:text-neon transition-colors">Status dos Serviços</Link>
        </div>

        <div className="flex flex-col gap-3">
          <h4 className="font-bold text-text-primary mb-2">Legal</h4>
          <Link href="/termos" className="hover:text-neon transition-colors">Termos de Uso</Link>
          <Link href="/privacidade" className="hover:text-neon transition-colors">Política de Privacidade</Link>
          <Link href="/reembolso" className="hover:text-neon transition-colors">Política de Reembolso</Link>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 mt-12 pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center text-xs text-text-muted">
        <p>© {new Date().getFullYear()} N8N Store. Todos os direitos reservados.</p>
        <p className="mt-2 md:mt-0">Feito com ⚡ e Next.js</p>
      </div>
    </footer>
  );
}
