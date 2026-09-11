import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const work = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/work' }),
  schema: z.object({
    title: z.string(),
    summary: z.string(),
    date: z.coerce.date(),
    status: z.enum(['shipped', 'building', 'archived']).default('shipped'),
    tags: z.array(z.string()).default([]),
    storeUrl: z.string().url().optional(),
    githubUrl: z.string().url().optional(),
    websiteUrl: z.string().url().optional(),
    featured: z.boolean().default(false),
    cover: z.string().optional(),
  }),
});

const words = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/words' }),
  schema: z.object({
    title: z.string(),
    summary: z.string(),
    date: z.coerce.date(),
    draft: z.boolean().default(false),
    tags: z.array(z.string()).default([]),
  }),
});

export const collections = { work, words };
