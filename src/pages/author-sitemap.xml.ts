import { getPosts, allAuthors, authorUrl } from '../lib/data';
import { urlset } from '../lib/sitemap';
export async function GET() {
  const posts = await getPosts();
  return urlset(
    allAuthors
      .map((a) => ({ a, mine: posts.filter((p) => p.data.author === a.slug) }))
      .filter((x) => x.mine.length)
      .map((x) => ({ loc: authorUrl(x.a.slug), lastmod: x.mine[0].data.modified || x.mine[0].data.date })),
  );
}
