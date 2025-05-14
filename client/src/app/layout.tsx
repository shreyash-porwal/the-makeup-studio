import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/header";
import ReduxProvider from "@/store/Provider";
import { Toaster } from "sonner";

const inter = Inter({ subsets: ["latin"] });
export const metadata: Metadata = {
  title: "Aditi's MakeOver",
  description: "Grace in Every Glow...",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className}`}>
        <ReduxProvider>
          <Navbar />
          <Toaster richColors />
          <main className="min-h-screen">{children}</main>
          <footer className="bg-blue-50 py-12">
            <div className="container mx-auto px-4 text-center">
              Made with love by shreyash
            </div>
          </footer>
        </ReduxProvider>
      </body>
    </html>
  );
}
