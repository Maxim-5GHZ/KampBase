// frontend/app/layout.tsx
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Navbar from "./navbar";
import AuthGuard from "./components/AuthGuard"; // <-- ДОБАВЛЕНО
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "СтудБаза",
  description: "Hot Code Band",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-custom-bg-main`}
      >
        {/* Оборачиваем всё приложение в защиту */}
        <AuthGuard>
          <Navbar />
          <main className="pt-12">{children}</main>
        </AuthGuard>
      </body>
    </html>
  );
}
