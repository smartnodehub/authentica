// Mapping: Project=Authentica | Repo=https://github.com/smartnodehub/authentica | Domain=https://authentica-gamma.vercel.app
// File: src/app/layout.tsx
import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  metadataBase: new URL('https://authentica-gamma.vercel.app'),
  title: 'Authentica — Text Analysis (Demo)',
  description: 'Check clarity, repetition, risk signals and self-overlap locally in your browser.',
  robots: { index: false, follow: false, nocache: true },
  alternates: {
    canonical: '/',
    languages: {
      'en': '/?lang=en',
      'fi': '/?lang=fi',
      'et': '/?lang=et',
    },
  },
  openGraph: {
    title: 'Authentica — Text Analysis (Demo)',
    description: 'Local-only demo: analyze clarity, repetition, risk signals and self-overlap.',
    url: 'https://authentica-gamma.vercel.app',
    siteName: 'Authentica',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-slate-950 text-slate-100 antialiased">
        <div className="mx-auto max-w-5xl px-4 py-8">{children}</div>
      </body>
    </html>
  );
}
