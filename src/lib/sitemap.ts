import { SITE } from '../site';
export const xml = (body: string) =>
  new Response(`<?xml version="1.0" encoding="UTF-8"?>\n${body}`, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
export const abs = (p: string) => new URL(p, SITE.url).href;
export const urlset = (items: { loc: string; lastmod?: Date; image?: string }[]) =>
  xml(
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">\n` +
      items
        .map(
          (i) =>
            `<url><loc>${abs(i.loc)}</loc>${i.lastmod ? `<lastmod>${i.lastmod.toISOString()}</lastmod>` : ''}${
              i.image ? `<image:image><image:loc>${abs(i.image)}</image:loc></image:image>` : ''
            }</url>`,
        )
        .join('\n') +
      `\n</urlset>`,
  );
