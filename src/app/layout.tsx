import './globals.css';
import type { Metadata } from 'next';
import Navbar from '@/components/Navbar';

export const metadata: Metadata = {
  title: 'Authentica — Text Analysis (Demo)',
  description: 'Analyze clarity, repetition, and risk signals locally.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <Navbar />
        <main className="has-fixed-nav">{children}</main>
      </body>
    </html>
  );
}
