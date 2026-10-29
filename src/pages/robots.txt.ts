import { SITE } from '../site';
export function GET() {
  const rules = SITE.indexing ? 'Disallow:' : 'Disallow: /';
  return new Response(`User-agent: *\n${rules}\n\nSitemap: ${SITE.url}/sitemap_index.xml\n`, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
}
