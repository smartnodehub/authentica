// Mapping: Project=Authentica | Repo=https://github.com/smartnodehub/authentica | Domain=https://authentica-gamma.vercel.app
// File: src/app/robots.txt/route.ts
export function GET() {
  const body = `User-agent: *
Disallow: /`;
  return new Response(body, { headers: { 'Content-Type': 'text/plain' } });
}
