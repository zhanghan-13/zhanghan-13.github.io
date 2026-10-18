import taxonomy from '../data/taxonomy.json' with { type: 'json' }
import type { PostSummary } from './types'

export function categorySlug(name: string): string {
  if (!name) return 'uncategorized'
  // Keep future names containing '/', '%' or punctuation within one static route.
  return taxonomy.categories.find(category => category.name === name)?.slug
    ?? `name-${Array.from(name, character => character.codePointAt(0)!.toString(16)).join('-')}`
}

export const categoryUrl = (name: string) => `/categories/${encodeURIComponent(categorySlug(name))}/`

export function createCategoryIndex(posts: PostSummary[]) {
  const names = new Set([...taxonomy.categories.map(category => category.name), ...posts.map(post => post.category).filter(Boolean)])
  if (posts.some(post => !post.category)) names.add('')
  return [...names].map(name => ({
    name: name || '未分类', slug: categorySlug(name), url: categoryUrl(name),
    posts: posts.filter(post => post.category === name),
  }))
}
