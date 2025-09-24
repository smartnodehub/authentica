import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Topbar from "@/components/Topbar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Authentica — Humanizer",
  description: "Humanize AI text with an accessible, clean UI.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} bg-app text-slate-800 dark:text-slate-100`}>
        <Topbar />
        <main className="mx-auto max-w-6xl px-4 sm:px-6 pb-12">{children}</main>
      </body>
    </html>
  );
}
