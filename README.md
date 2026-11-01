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
featured: false                   # true = pinned to the homepage carousel
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
- Characters may bleed off the top or bottom edge (a face peeking in from the top, for example), but keep faces and anything important inside the safe area.

### Featured image creative rules

Every featured image should be the best, most fun image we can make. Each one is unique, built around one character and the post's topic, and looks unmistakably like Jackpota.

**1. Build every image around a character.** Pick a character or hero object that fits the post's topic and show it doing something related to it, like tossing coins onto a Hold & Win board. Use each character only once across the blog, and record it in `brand-assets/README.md`.

**2. Source imagery in this order of preference:**
1. **Jackpota's own imagery:**
   - the brand kit in `brand-assets/`
   - characters and art from Jackpota's promo banners
   - game tiles and art on jackpota.com, especially Jackpota exclusive games and games the post mentions
2. **Official art from game studios, for games available on Jackpota:** take it from the studio's press release or press kit (Playson, Evoplay, Kalamba, Betsoft and so on). Confirm the game is on jackpota.com, and prefer a game the post links to or is about.
3. **Free commercial-license libraries** (Pixabay, or CC0 images marked for commercial use), only for generic props like cards, dice or chips.

Never use Google Images results, fan art, other casinos' creative or anything without clear usage rights.

**3. Use the best quality available.** Use the highest-resolution source you can find, ideally 1000px or more for the hero character, and don't upscale more than about 1.5x. If the kit version is small, look for the studio's original art.

**4. Cut out and blend.**
- Remove backgrounds with `rembg` (model `isnet-general-use`).
- Mask out any logos, titles, badges or text baked into the source art.
- Feather hard edges so the character fades into the background.
- Add a glow in the image's accent color so the character sits in the scene.

**5. Repeat the brand accents on every image:**
- the Jackpota logo (`brand-assets/logo.png`)
- a Baby School headline in white and yellow `#FFCD36`, with green `#1EE05C` accents
- the glowing yellow outline box
- gold coins and the coin stack
- a black background with a colored glow and light rays

**6. Vary from post to post.** Change the layout (text left or right), the glow color (gold, blue, green, red or purple) and the main scene, so neighboring cards never look alike.

**7. Make it fun, in Jackpota promo-banner style** (see `brand-assets/templates/style-reference-wolf.jpg`). Bright full scenes, glossy 3D headline lettering, big glowing characters, and coins and effects everywhere: energy and motion, like flying coins, sparkles, tilted elements and a character that reacts to the scene. Keep it playful, never pushy.

**8. Stay compliant.** Remove or exclude all of these, even when they're in the source art:
- green SC coins and bills, or any other money imagery
- prize amounts, "% more coins" and offer badges
- Free Spins badges
- Play Now and other bonus CTAs
- the word "sweepstakes"

**9. Get approval before publishing.** Share the post title, a 2–3 line summary and the image, and publish only after an OK.

## Homepage carousel

The top of the homepage is a carousel that **always shows 5 posts**:

1. Posts with `featured: true` in their front matter come first, newest first.
2. The newest non-featured posts fill the remaining slots.

To pin a post, add `featured: true` to its front matter. To unpin it, remove the line. If more than 5 posts are featured, only the 5 newest featured posts show. The count lives in `src/site.ts` (`carouselCount`), and the logic is `carouselPosts()` in `src/lib/data.ts`.

## Settings

`src/site.ts` holds the site name, carousel size, header/footer links and sidebar promo.

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
