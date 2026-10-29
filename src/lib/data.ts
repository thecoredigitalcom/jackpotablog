import { getCollection, type CollectionEntry } from 'astro:content';
import categories from '../data/categories.json';
import authors from '../data/authors.json';

export type Post = CollectionEntry<'posts'>;
export type Category = (typeof categories)[number];
export type Author = (typeof authors)[number];

export async function getPosts(): Promise<Post[]> {
  const all = await getCollection('posts', (p) => !p.data.draft);
  return all.sort((a, b) => b.data.date.getTime() - a.data.date.getTime());
}

export const postUrl = (p: Post) => `/${p.id}/`;
export const getCategory = (slug: string) => categories.find((c) => c.slug === slug);
export const getAuthor = (slug: string) => authors.find((a) => a.slug === slug);
export const categoryUrl = (slug: string) => `/category/${slug}/`;
export const authorUrl = (slug: string) => `/author/${slug}/`;

export const allCategories = categories;
export const allAuthors = authors;

export function readingMinutes(body = '') {
  return Math.max(1, Math.round(body.split(/\s+/).filter(Boolean).length / 220));
}

export function paginate<T>(items: T[], perPage: number) {
  const pages = Math.max(1, Math.ceil(items.length / perPage));
  return Array.from({ length: pages }, (_, i) => ({ page: i + 1, pages, items: items.slice(i * perPage, (i + 1) * perPage) }));
}

export const fmtDate = (d: Date) => d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' });
