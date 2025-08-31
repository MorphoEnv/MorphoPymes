import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/ui/Navbar";
import Footer from "@/components/ui/Footer";
import ThirdWebProviderWrapper from "@/components/providers/ThirdWebProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "MorphoPymes - DeFi Micro-inversiones para PYMEs",
  description: "Plataforma descentralizada de micro-inversiones que conecta emprendedores latinoamericanos con inversores globales a través de blockchain y ENS.",
  keywords: "DeFi, micro-inversiones, PYMEs, blockchain, Ethereum, ENS, startup, fintech",
  authors: [{ name: "MorphoEnv Team" }],
  openGraph: {
    title: "MorphoPymes - Democratizando las inversiones",
    description: "Invierte desde $10 en PYMEs latinoamericanas con transparencia blockchain",
    type: "website",
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThirdWebProviderWrapper>
          <Navbar />
          <main className="">
            {children}
          </main>
          <Footer />
        </ThirdWebProviderWrapper>
      </body>
    </html>
  );
}
