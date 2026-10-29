import { getPosts, postUrl } from '../lib/data';
import { urlset } from '../lib/sitemap';
export async function GET() {
  return urlset((await getPosts()).map((p) => ({ loc: postUrl(p), lastmod: p.data.modified || p.data.date, image: p.data.image?.src })));
}
