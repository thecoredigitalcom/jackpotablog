import { getPosts, allCategories, categoryUrl } from '../lib/data';
import { urlset } from '../lib/sitemap';
export async function GET() {
  const posts = await getPosts();
  return urlset(
    allCategories
      .map((c) => ({ c, inCat: posts.filter((p) => p.data.categories.includes(c.slug)) }))
      .filter((x) => x.inCat.length)
      .map((x) => ({ loc: categoryUrl(x.c.slug), lastmod: x.inCat[0].data.modified || x.inCat[0].data.date })),
  );
}
