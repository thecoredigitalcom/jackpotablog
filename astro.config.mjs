import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://blogs.jackpota.com',
  trailingSlash: 'always',
  build: { format: 'directory' },
  markdown: { gfm: true, smartypants: false },
});
