// Mapping: Project=Authentica | Repo=https://github.com/smartnodehub/authentica | Domain=https://authentica-gamma.vercel.app
// File: src/app/sitemap.ts
import type { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  // Noindex during demo; sitemap is minimal and harmless.
  const base = 'https://authentica-gamma.vercel.app';

  return [
    {
      url: `${base}/`,
      changeFrequency: 'weekly',
      priority: 0.5,
      alternates: {
        languages: {
          en: `${base}/?lang=en`,
          fi: `${base}/?lang=fi`,
          et: `${base}/?lang=et`,
        },
      },
    },
    {
      url: `${base}/analyze`,
      changeFrequency: 'weekly',
      priority: 0.4,
    },
    {
      url: `${base}/legal/demo`,
      changeFrequency: 'yearly',
      priority: 0.2,
    },
  ];
}
