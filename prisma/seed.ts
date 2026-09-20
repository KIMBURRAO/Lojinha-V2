import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // --- Admin ---
  const passwordHash = await bcrypt.hash("admin123", 10);
  const admin = await prisma.admin.upsert({
    where: { email: "admin@loja.com" },
    update: {},
    create: {
      email: "admin@loja.com",
      passwordHash,
    },
  });
  console.log(`✅ Admin created: ${admin.email}`);

  // --- Categories ---
  const catFluxos = await prisma.category.upsert({
    where: { slug: "fluxos-n8n" },
    update: {},
    create: {
      name: "Fluxos N8N",
      slug: "fluxos-n8n",
      order: 1,
    },
  });

  const catTemplates = await prisma.category.upsert({
    where: { slug: "templates" },
    update: {},
    create: {
      name: "Templates",
      slug: "templates",
      order: 2,
    },
  });

  const catMentorias = await prisma.category.upsert({
    where: { slug: "mentorias" },
    update: {},
    create: {
      name: "Mentorias",
      slug: "mentorias",
      order: 3,
    },
  });
  console.log("✅ Categories created");

  // --- Products ---
  const products = [
    {
      name: "Automação WhatsApp + GPT",
      slug: "automacao-whatsapp-gpt",
      shortDescription: "Fluxo completo de atendimento automatizado via WhatsApp integrado com ChatGPT.",
      fullDescription: `## Automação WhatsApp + GPT

Este fluxo N8N conecta o WhatsApp Business API com o ChatGPT para criar um atendimento automatizado inteligente.

### O que está incluso:
- Fluxo N8N completo (.json) pronto para importar
- Documentação de configuração passo a passo
- Suporte para múltiplos atendentes
- Respostas contextuais com IA
- Encaminhamento para atendente humano quando necessário

### Requisitos:
- Conta N8N (self-hosted ou cloud)
- WhatsApp Business API (Evolution API ou Z-API)
- Chave de API do OpenAI

### Como usar:
1. Importe o arquivo .json no seu N8N
2. Configure as credenciais do WhatsApp e OpenAI
3. Ajuste as mensagens de boas-vindas
4. Ative o fluxo e teste!`,
      imageUrl: "/images/products/whatsapp-gpt.svg",
      priceCents: 14700,
      originalPriceCents: 29700,
      deliveryType: "FIXED",
      fixedDeliveryContent: "https://drive.google.com/file/d/example1/view — Baixe seu fluxo N8N aqui. Senha: n8n2024",
      categoryId: catFluxos.id,
    },
    {
      name: "Gerador de Leads Instagram",
      slug: "gerador-leads-instagram",
      shortDescription: "Capture leads automaticamente de comentários e DMs do Instagram com N8N.",
      fullDescription: `## Gerador de Leads Instagram

Automatize a captura de leads do Instagram diretamente para seu CRM ou planilha.

### Funcionalidades:
- Monitoramento automático de comentários em posts
- Respostas automáticas em DM
- Captura de dados do lead (nome, @, e-mail)
- Integração com Google Sheets e CRM
- Filtros por hashtag e palavra-chave

### O que você recebe:
- 2 fluxos N8N complementares
- Template de planilha para leads
- Guia de configuração em vídeo (15min)`,
      imageUrl: "/images/products/leads-instagram.svg",
      priceCents: 9700,
      originalPriceCents: 19700,
      deliveryType: "FIXED",
      fixedDeliveryContent: "https://drive.google.com/file/d/example2/view — Seus 2 fluxos + template de planilha.",
      categoryId: catFluxos.id,
    },
    {
      name: "Dashboard Financeiro Automático",
      slug: "dashboard-financeiro-automatico",
      shortDescription: "Fluxo que puxa dados bancários e gera dashboards no Google Sheets automaticamente.",
      fullDescription: `## Dashboard Financeiro Automático

Tenha visibilidade completa das suas finanças com atualização automática.

### Como funciona:
- Conecta com sua conta bancária via Open Finance
- Categoriza transações automaticamente
- Gera gráficos e relatórios no Google Sheets
- Alertas de gastos por categoria
- Relatório semanal por e-mail

### Incluso:
- Fluxo N8N completo
- Template do Google Sheets com gráficos
- Guia de configuração`,
      imageUrl: "/images/products/dashboard-financeiro.svg",
      priceCents: 19700,
      originalPriceCents: 39700,
      deliveryType: "FIXED",
      fixedDeliveryContent: "https://drive.google.com/file/d/example3/view — Dashboard + Fluxo N8N",
      categoryId: catFluxos.id,
    },
    {
      name: "Template Landing Page N8N",
      slug: "template-landing-page-n8n",
      shortDescription: "Template HTML/CSS responsivo para landing pages com formulário integrado ao N8N.",
      fullDescription: `## Template Landing Page N8N

Landing page moderna e responsiva com integração direta ao N8N.

### Características:
- Design responsivo (mobile-first)
- Formulário de captura integrado
- Animações suaves
- SEO otimizado
- 5 variações de cores

### Arquivos inclusos:
- HTML/CSS/JS da landing page
- Fluxo N8N para processar formulários
- Integração com e-mail marketing`,
      imageUrl: "/images/products/template-landing.svg",
      priceCents: 4700,
      originalPriceCents: 9700,
      deliveryType: "FIXED",
      fixedDeliveryContent: "https://drive.google.com/file/d/example4/view — Template + Fluxo",
      categoryId: catTemplates.id,
    },
    {
      name: "Pack de Templates Notion + N8N",
      slug: "pack-templates-notion-n8n",
      shortDescription: "10 templates Notion com fluxos N8N para automação de produtividade pessoal e empresarial.",
      fullDescription: `## Pack de Templates Notion + N8N

Pacote completo de produtividade com Notion e automação N8N.

### 10 Templates inclusos:
1. CRM de Vendas
2. Gestão de Projetos
3. Base de Conhecimento
4. Controle Financeiro
5. Gestão de Conteúdo
6. Pipeline de Recrutamento
7. Tracker de Hábitos
8. Calendário Editorial
9. OKRs e Metas
10. Meeting Notes

### Cada template inclui:
- Template Notion duplicável
- Fluxo N8N de automação correspondente
- Documentação de uso`,
      imageUrl: "/images/products/notion-pack.svg",
      priceCents: 29700,
      originalPriceCents: 59700,
      deliveryType: "FIXED",
      fixedDeliveryContent: "https://drive.google.com/file/d/example5/view — Pack completo com 10 templates",
      categoryId: catTemplates.id,
    },
    {
      name: "Mentoria Individual N8N — 1 Hora",
      slug: "mentoria-individual-n8n",
      shortDescription: "Sessão individual de 1 hora com especialista N8N. Vagas limitadas!",
      fullDescription: `## Mentoria Individual N8N — 1 Hora

Sessão exclusiva e individual com um especialista em automação N8N.

### O que você pode trazer:
- Dúvidas sobre fluxos específicos
- Revisão da sua arquitetura de automação
- Ajuda para debugar fluxos com problemas
- Consultoria sobre integrações complexas
- Planejamento de automação para seu negócio

### Como funciona:
1. Após a compra, você receberá um link individual para agendar
2. A sessão acontece via Google Meet
3. Você recebe a gravação após a sessão

⚠️ **Estoque limitado**: cada link de agendamento é único e individual.`,
      imageUrl: "/images/products/mentoria.svg",
      priceCents: 19700,
      originalPriceCents: 39700,
      deliveryType: "STOCK",
      fixedDeliveryContent: null,
      categoryId: catMentorias.id,
    },
  ];

  for (const p of products) {
    await prisma.product.upsert({
      where: { slug: p.slug },
      update: {},
      create: p,
    });
  }
  console.log(`✅ ${products.length} products created`);

  // --- Stock Items for Mentoria ---
  const mentoria = await prisma.product.findUnique({
    where: { slug: "mentoria-individual-n8n" },
  });

  if (mentoria) {
    const existingStock = await prisma.stockItem.count({
      where: { productId: mentoria.id },
    });

    if (existingStock === 0) {
      const stockItems = Array.from({ length: 10 }, (_, i) => ({
        productId: mentoria.id,
        content: `https://calendly.com/n8n-mentoria/sessao-individual?slot=${i + 1}&token=unique-${Date.now()}-${i}`,
      }));

      await prisma.stockItem.createMany({ data: stockItems });
      console.log("✅ 10 stock items created for Mentoria");
    }
  }

  // --- Coupons ---
  await prisma.coupon.upsert({
    where: { code: "BEMVINDO10" },
    update: {},
    create: {
      code: "BEMVINDO10",
      percentOff: 10,
      isActive: true,
      expiresAt: new Date("2027-12-31"),
    },
  });

  await prisma.coupon.upsert({
    where: { code: "N8NLOVER20" },
    update: {},
    create: {
      code: "N8NLOVER20",
      percentOff: 20,
      isActive: true,
      expiresAt: new Date("2027-06-30"),
    },
  });
  console.log("✅ Coupons created");

  console.log("🎉 Seed completed!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
