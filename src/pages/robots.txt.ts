import { SITE } from '../site';
export function GET() {
  const body = SITE.indexing
    ? `User-agent: *\nDisallow:\n\nSitemap: ${SITE.url}/sitemap_index.xml\n`
    : `# Staging / not yet indexed\nUser-agent: *\nDisallow:\n\nSitemap: ${SITE.url}/sitemap_index.xml\n`;
  return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
}
