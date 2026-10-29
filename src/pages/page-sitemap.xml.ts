import { getPosts } from '../lib/data';
import { urlset } from '../lib/sitemap';
export async function GET() {
  const p = await getPosts();
  return urlset([{ loc: '/', lastmod: p[0]?.data.date }]);
}
