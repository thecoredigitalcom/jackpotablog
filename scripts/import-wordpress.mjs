// One-off importer: WordPress REST export (JSON) -> Markdown posts + data files.
// Usage: node scripts/import-wordpress.mjs <export-dir>
// The export dir holds posts.json, categories.json, users.json, media.json, pages.json
// pulled from https://jackpota.blog/wp-json/wp/v2/<type>?per_page=100
import fs from 'node:fs';
import path from 'node:path';
import TurndownService from 'turndown';
import { gfm } from 'turndown-plugin-gfm';

const dir = process.argv[2];
if (!dir) throw new Error('usage: node scripts/import-wordpress.mjs <export-dir>');
const load = (f) => JSON.parse(fs.readFileSync(path.join(dir, f), 'utf8'));

const posts = load('posts.json');
const cats = load('categories.json');
const users = load('users.json');
const media = load('media.json');

const ORIGIN = 'https://jackpota.blog';
const local = (u) => (u || '').replace(/^https?:\/\/jackpota\.blog/, '') || '/';

const decode = (s) =>
  (s || '')
    .replace(/&#8217;|&rsquo;/g, '’').replace(/&#8216;|&lsquo;/g, '‘')
    .replace(/&#8220;|&ldquo;/g, '“').replace(/&#8221;|&rdquo;/g, '”')
    .replace(/&#8211;|&ndash;/g, '–').replace(/&#8212;|&mdash;/g, '—')
    .replace(/&#8230;|&hellip;/g, '…').replace(/&amp;/g, '&').replace(/&nbsp;|&#160;/g, ' ')
    .replace(/&#038;/g, '&').replace(/&quot;/g, '"').replace(/&#039;|&#39;/g, "'")
    .replace(/&lt;/g, '<').replace(/&gt;/g, '>');
const strip = (h) => decode((h || '').replace(/<[^>]+>/g, '')).replace(/\s+/g, ' ').trim();

const td = new TurndownService({ headingStyle: 'atx', bulletListMarker: '-', codeBlockStyle: 'fenced', emDelimiter: '*' });
td.use(gfm);
// Elementor wraps everything in layout divs; keep only the content.
td.remove(['style', 'script', 'noscript']);
// Images: use the full-size local path, keep alt text.
td.addRule('img', {
  filter: 'img',
  replacement: (_c, node) => {
    const src = local(node.getAttribute('src')).replace(/-\d+x\d+(\.\w+)$/, '$1');
    const alt = (node.getAttribute('alt') || '').replace(/\]/g, '');
    return `![${alt}](${src})`;
  },
});

const mediaById = Object.fromEntries(media.map((m) => [m.id, m]));
const catById = Object.fromEntries(cats.map((c) => [c.id, c]));
const userById = Object.fromEntries(users.map((u) => [u.id, u]));

const yaml = (v) => JSON.stringify(v ?? null);

fs.mkdirSync('src/content/posts', { recursive: true });
fs.mkdirSync('src/data', { recursive: true });

for (const p of posts) {
  let html = p.content.rendered
    // Strip WP's no-op weight spans before conversion.
    .replace(/<span style="font-weight: ?400;?">([\s\S]*?)<\/span>/g, '$1')
    // Turn absolute blog links into root-relative links.
    .replace(/https?:\/\/jackpota\.blog\//g, '/')
    // Drop tracking params pasted in from ChatGPT answers.
    .replace(/([?&])utm_source=chatgpt\.com&?/g, '$1').replace(/[?&](?=")/g, '');
  let md = td.turndown(html)
    .replace(/ /g, ' ')
    .replace(/[ \t]+$/gm, '')
    .replace(/\n{3,}/g, '\n\n')
    .trim();

  const y = p.yoast_head_json || {};
  const fm = mediaById[p.featured_media];
  const author = userById[p.author];
  const front = {
    title: strip(p.title.rendered),
    date: p.date_gmt + 'Z',
    modified: p.modified_gmt + 'Z',
    author: author?.slug,
    categories: p.categories.map((id) => catById[id].slug),
    excerpt: strip(p.excerpt.rendered).replace(/\s*\[?…\]?\.*$/, '').replace(/\.{2,}$/, '').trim(),
    image: fm ? { src: local(fm.source_url), alt: fm.alt_text || strip(p.title.rendered), width: fm.media_details?.width, height: fm.media_details?.height } : null,
    seo: {
      title: decode(y.title || ''),
      description: decode(y.description || y.og_description || ''),
    },
    wpId: p.id,
  };
  const lines = ['---'];
  for (const [k, v] of Object.entries(front)) {
    if (v && typeof v === 'object' && !Array.isArray(v)) {
      lines.push(`${k}:`);
      for (const [k2, v2] of Object.entries(v)) if (v2 !== undefined) lines.push(`  ${k2}: ${yaml(v2)}`);
    } else lines.push(`${k}: ${yaml(v)}`);
  }
  lines.push('---', '', md, '');
  fs.writeFileSync(`src/content/posts/${p.slug}.md`, lines.join('\n'));
}

fs.writeFileSync(
  'src/data/categories.json',
  JSON.stringify(
    cats.map((c) => ({ slug: c.slug, name: decode(c.name), description: strip(c.description), wpId: c.id })),
    null, 2,
  ),
);
fs.writeFileSync(
  'src/data/authors.json',
  JSON.stringify(
    users.map((u) => ({ slug: u.slug, name: decode(u.name), bio: strip(u.description), avatar: Object.values(u.avatar_urls || {}).pop(), wpId: u.id })),
    null, 2,
  ),
);
console.log(`Imported ${posts.length} posts, ${cats.length} categories, ${users.length} authors`);
