# Jackpota Blog

Static rebuild of the official Jackpota blog, **https://blogs.jackpota.com** (also served at https://jackpota.blog; canonicals always point to blogs.jackpota.com), migrated from WordPress/Elementor.
Built with [Astro](https://astro.build) and hosted on Cloudflare Workers (static assets). Every push to `main` deploys.

## Writing a post

Add a Markdown file to `src/content/posts/`. The file name is the URL slug (`my-post.md` → `https://jackpota.blog/my-post/`).

```md
---
title: "Post title"
date: "2026-11-01T09:00:00Z"
author: "mike-rossi"              # slug from src/data/authors.json
categories: ["slots"]             # slugs from src/data/categories.json
excerpt: "One-line summary shown on cards."
image:
  src: "/wp-content/uploads/2026/11/my-image.jpg"   # put the file in public/
  alt: "Describe the image"
  width: 1408
  height: 768
seo:
  title: "Post title | Jackpota Blog"
  description: "Meta description, ~150 characters."
draft: false                      # true = not published
---

Body in Markdown…
```

Images go in `public/` (existing WordPress media lives in `public/wp-content/uploads/` at the original URLs).

### Featured image rules

The same featured image is cropped differently in each place it appears (`object-fit: cover`):

| Where | Crop |
| --- | --- |
| Post cards (homepage, categories, related posts) | 3:2 |
| Homepage hero | 16:8.5 |
| Sidebar "Featured" thumbnails | 1:1 (64px) |

So for every new featured image:

- Canvas **1408×768** JPG, under ~250 KB.
- Keep the logo, headline text and any game tiles inside the **safe area: x 170–1240, y 30–738**. That survives the 3:2 crop, which removes 128px from each side, plus a margin.
- Put the strongest visual near the center so the square thumbnail still reads.
- Only background may extend to the edges.
- Before publishing, check the image cropped to 3:2 (x 128–1280).
- Images under `/wp-content/*` are cached for a year, so a changed image needs a **new file name**. Don't overwrite the old one.

## Settings

`src/site.ts` holds the site name, homepage hero post, header/footer links and sidebar promo.

## Search engine indexing

Pages are indexable (`index, follow`). To build a noindexed copy, set `INDEXING=false` in the build environment.

## Commands

| Command | |
| --- | --- |
| `npm install` | install |
| `npm run dev` | local dev server |
| `npm run build` | build to `dist/` |
| `npm run preview` | build and serve on the Cloudflare runtime locally |
| `npm run deploy` | build and deploy with Wrangler |

## SEO parity with the old site

- Same post, category and author URLs (trailing slash), same image URLs.
- Same sitemap files (`/sitemap_index.xml`, `/post-sitemap.xml`, …) so Search Console keeps working.
- `/feed/` serves RSS. Retired WordPress URLs (tags, date archives, empty categories, Elementor templates) 301 to the homepage — see `public/_redirects`.
- `scripts/import-wordpress.mjs` is the one-off importer used for the migration.
