import { defineCollection } from 'astro:content'
import { z } from 'astro/zod'
import { glob } from 'astro/loaders'

const posts = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/posts', generateId: ({ data, entry }) => String(data.id || entry.replace(/\.md$/, '')) }),
  schema: z.object({
    id: z.string().regex(/^[a-zA-Z0-9_.-]+$/),
    title: z.string().min(1),
    date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
    excerpt: z.string().default(''),
    category: z.string().default(''),
    tags: z.array(z.string()).default([]),
    draft: z.boolean().default(false),
    wordCount: z.number().optional(),
    headings: z.array(z.object({ id: z.string(), text: z.string(), level: z.number() })).default([]),
    imageOmitted: z.boolean().default(false),
    legacySlug: z.string().optional(),
    sourceUrl: z.string().optional(),
  }),
})

export const collections = { posts }
