import "./globals.css";
import { Tektur } from "next/font/google";
import type { Metadata, Viewport } from "next";

const tektur = Tektur({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "404 Tech",
  description: "An technology store",
};

export const viewport: Viewport = {
  // themeColor: [
  //   { media: "(prefers-color-scheme: light)", color: "#ffffff" },
  //   { media: "(prefers-color-scheme: dark)", color: "#000000" },
  // ],
  colorScheme: "light dark"
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={`${tektur.className} antialiased`}>
        {children}
      </body>
    </html>
  );
}
