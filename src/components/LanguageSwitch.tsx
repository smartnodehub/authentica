// Mapping: Project=Authentica | Repo=https://github.com/smartnodehub/authentica | Domain=https://authentica-gamma.vercel.app
// File: src/components/LanguageSwitch.tsx
'use client';

import { usePathname, useSearchParams, useRouter } from 'next/navigation';

export function LanguageSwitch() {
  const pathname = usePathname();
  const sp = useSearchParams();
  const router = useRouter();
  const lang = (sp.get('lang') ?? 'en') as 'en'|'fi'|'et';

  function setLang(next: 'en'|'fi'|'et') {
    const params = new URLSearchParams(sp.toString());
    params.set('lang', next);
    router.push(`${pathname}?${params.toString()}`);
  }

  const btn = (code: 'en'|'fi'|'et', label: string) => (
    <button
      onClick={() => setLang(code)}
      className={`rounded-lg border px-3 py-2 text-sm ${lang===code?'bg-slate-800 border-slate-600':'border-slate-700 hover:bg-slate-800'}`}
      aria-pressed={lang===code}
    >
      {label}
    </button>
  );

  return (
    <div className="flex gap-2">
      {btn('en','EN')}
      {btn('fi','FI')}
      {btn('et','ET')}
    </div>
  );
}
