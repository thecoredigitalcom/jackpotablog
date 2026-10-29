# Jackpota Blog

Static rebuild of the official Jackpota blog, **https://jackpota.blog**, migrated from WordPress/Elementor.
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

## Settings

`src/site.ts` holds the site name, homepage hero post, header/footer links and sidebar promo.

## Search engine indexing

Pages are `noindex` unless the build runs with the environment variable `INDEXING=true`
(set it on the production Cloudflare build only, so preview builds never get indexed).

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
