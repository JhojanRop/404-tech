'use client'
import "./globals.css";
import { Tektur } from "next/font/google";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
// import type { Metadata, Viewport } from "next";
import { CartProvider } from "@/context/CartContext";

const tektur = Tektur({
  subsets: ["latin"],
});

// export const metadata: Metadata = {
//   title: "404 Tech",
//   description: "An technology store",
// };

// export const viewport: Viewport = {
//   // themeColor: [
//   //   { media: "(prefers-color-scheme: light)", color: "#ffffff" },
//   //   { media: "(prefers-color-scheme: dark)", color: "#000000" },
//   // ],
//   colorScheme: "light dark"
// };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={`${tektur.className} antialiased pt-20`}>
        <CartProvider>
          <Header />
          {children}
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}
