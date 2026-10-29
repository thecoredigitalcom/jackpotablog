import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const posts = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/posts' }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    modified: z.coerce.date().optional(),
    author: z.string(),
    categories: z.array(z.string()).default([]),
    excerpt: z.string().default(''),
    image: z
      .object({ src: z.string(), alt: z.string().default(''), width: z.number().optional(), height: z.number().optional() })
      .nullable()
      .optional(),
    seo: z.object({ title: z.string().optional(), description: z.string().optional() }).default({}),
    draft: z.boolean().default(false),
    wpId: z.number().optional(),
  }),
});

export const collections = { posts };
