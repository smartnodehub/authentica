This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
Siis teeme kohe ära — see aitab sind ja teisi, kui hiljem tuleb uuesti vigu jälitada või projekti laiendada.
Siin on valmis **README.md**, mille saad panna oma repo juurkausta:

````markdown
# Authentica

Authentica on Next.js + OpenAI põhine tekstianalüüsi ja ümberkirjutuse rakendus.

## Projekti seaded

- **Framework**: Next.js 15 (App Router, TypeScript, Tailwind)
- **Hosting**: Vercel
- **Repo**: [github.com/smartnodehub/authentica](https://github.com/smartnodehub/authentica)
- **Domeen (Preview/Prod)**: [authentica-gamma.vercel.app](https://authentica-gamma.vercel.app)

---

## Valminud funktsioonid

### Rewrite (LLM)
- `src/app/api/llm/rewrite/route.ts`
- Kasutab OpenAI `chat/completions` endpoint’i
- Tone valikud: neutral, concise, friendly, formal
- UI komponent: `src/components/LlmRewrite.tsx`

### SEO
- `sitemap.ts` (parandatud property `changeFrequency`)
- `robots.txt` olemas

### API võtmete käsitlus
- OpenAI API key on **keskkonnamuutuja** `OPENAI_API_KEY`
- Kood kontrollib:
  - `trim()` eemaldab alguse/lõpu whitespace’i
  - keelab CR/LF sees (`\n`, `\r`)
  - peab algama `sk-`
- Kui võti puudub või on vale → API vastus: `{ error: "OPENAI_API_KEY invalid or not configured" }`

---

## Build ja lint

### Lokaalselt
```bash
npm run lint
npm run build
````

* `lint` annab selged hoiatused/kriitilised errorid
* `build` kompileerib ja prerenderdab kõik lehed

### Märkus Windowsi kohta

* Logis võib esineda hoiatus:

  ```
  ⚠ Attempted to load @next/swc-win32-x64-msvc …
  ```

  See **ei mõjuta** buildi — Vercelis (Linux) neid vigu ei teki.

---

## Kontrollpunktid

1. **Lint ja build lokaalselt** enne push’i
2. **git push → Vercel deploy**
3. Ava `/api/status` → peab näitama `{"openaiConfigured":true}`
4. Testi **Rewrite** nupu all → peab andma ümberkirjutuse

---

## Olulised õppetunnid

* Env võtmed **ainult** Vercelis või `.env.local` failis (mitte koodis!)
* Kui Authorization headeris tekib viga → kontrolli, et võti on ühel real
* API route’id peavad alati tagastama **selge JSON errori**
* SEO failides peab property olema õige (`changeFrequency` mitte `changefreq`)

---

## Praegune seis

* Rewrite (LLM) töötab
* API key käsitlus turvaline
* Buildid rohelised
* Vercel deploy töötab

````

---

Praktiline samm:  
1. Ava VS Code → projekti juur (`authentica/`).  
2. Tee fail `README.md`.  
3. Kleebi ülaltoodud sisu sisse.  
4. Terminalis:
```powershell
git add README.md
git commit -m "docs: add project overview and error-handling guide"
git push
```
