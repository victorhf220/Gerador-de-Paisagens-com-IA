import type { Metadata } from "next";
import "./globals.css";
import { cn } from "@/lib/utils";
import { Toaster } from "@/components/landscape/Toaster";
import { Inter, Source_Code_Pro } from 'next/font/google';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

const sourceCodePro = Source_Code_Pro({
  subsets: ['latin'],
  variable: '--font-source-code-pro',
});

export const metadata: Metadata = {
  title: "Gerador de Paisagens com IA",
  description: "Crie paisagens incríveis com o poder da Inteligência Artificial.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className={`${inter.variable} ${sourceCodePro.variable}`}>
      <body
        className={cn(
          "min-h-screen bg-background font-body antialiased",
          "selection:bg-primary/20"
        )}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
