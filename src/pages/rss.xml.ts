import { SITE } from '../site';
import { getPosts, postUrl, getAuthor } from '../lib/data';
const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
export async function GET() {
  const posts = (await getPosts()).slice(0, 20);
  const items = posts
    .map((p) => {
      const url = new URL(postUrl(p), SITE.url).href;
      return `<item><title>${esc(p.data.title)}</title><link>${url}</link><guid isPermaLink="true">${url}</guid><pubDate>${p.data.date.toUTCString()}</pubDate><dc:creator>${esc(getAuthor(p.data.author)?.name || '')}</dc:creator><description>${esc(p.data.seo.description || p.data.excerpt)}</description></item>`;
    })
    .join('\n');
  return new Response(
    `<?xml version="1.0" encoding="UTF-8"?>\n<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:dc="http://purl.org/dc/elements/1.1/"><channel><title>${SITE.name}</title><link>${SITE.url}/</link><atom:link href="${SITE.url}/feed/" rel="self" type="application/rss+xml"/><description>${esc(SITE.title)}</description><language>en-US</language>\n${items}\n</channel></rss>`,
    { headers: { 'Content-Type': 'application/rss+xml; charset=utf-8' } },
  );
}
