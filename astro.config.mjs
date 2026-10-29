import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://jackpota.blog',
  trailingSlash: 'always',
  build: { format: 'directory' },
  markdown: { gfm: true, smartypants: false },
});
