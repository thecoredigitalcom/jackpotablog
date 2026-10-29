import { getPosts } from '../lib/data';
import { xml, abs } from '../lib/sitemap';
// Same sitemap file names as the old Yoast setup, so Search Console keeps working.
export async function GET() {
  const latest = (await getPosts()).map((p) => p.data.modified || p.data.date).sort((a, b) => +b - +a)[0];
  const maps = ['post-sitemap.xml', 'page-sitemap.xml', 'category-sitemap.xml', 'author-sitemap.xml'];
  return xml(
    `<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${maps
      .map((m) => `<sitemap><loc>${abs('/' + m)}</loc><lastmod>${latest.toISOString()}</lastmod></sitemap>`)
      .join('\n')}\n</sitemapindex>`,
  );
}
