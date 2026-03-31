import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";

import { UserProvider } from "@/lib/context/UserContext";

const jakarta = Plus_Jakarta_Sans({ 
  subsets: ["latin"],
  variable: "--font-jakarta",
});

export const metadata: Metadata = {
  title: "Entrega Facilitada | Proptech & Fintech",
  description: "Desocupação de imóveis sem surpresas e custos inesperados.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-br">
      <body className={`${jakarta.variable} bg-[#F8FAFC] font-jakarta antialiased`}>
        <UserProvider>
          <Navbar />
          <main id="app-content" className="max-w-7xl mx-auto px-6 py-8">
            {children}
          </main>
        </UserProvider>
      </body>
    </html>
  );
}
