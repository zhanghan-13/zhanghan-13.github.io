import { getCollection } from 'astro:content'
import type { PostSummary } from './types'
import { countWords, getPostBodyHtml } from './post-metrics'

export { countWords, getPostBodyHtml } from './post-metrics'

export async function getPosts() {
  return (await getCollection('posts', ({ data }) => !data.draft))
    .sort((a, b) => b.data.date.localeCompare(a.data.date) || a.id.localeCompare(b.id))
}

export async function getPostSummaries(): Promise<PostSummary[]> {
  return (await getPosts()).map(post => ({
    id: post.id,
    title: post.data.title,
    date: post.data.date,
    excerpt: post.data.excerpt,
    category: post.data.category,
    tags: post.data.tags,
    wordCount: countWords(getPostBodyHtml(post)),
  }))
}

export const postUrl = (id: string) => `/posts/${encodeURIComponent(id)}/`
