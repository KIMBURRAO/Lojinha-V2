import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "N8N Store — Automações e Produtos Digitais",
  description:
    "A loja nº1 de fluxos de automação N8N, templates e mentorias para sua comunidade de automação.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-background text-text-primary font-sans">
        {children}
      </body>
    </html>
  );
}
