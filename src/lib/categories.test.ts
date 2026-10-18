import { test } from 'node:test'
import assert from 'node:assert/strict'
import { categorySlug, categoryUrl, createCategoryIndex } from './categories.ts'
import type { PostSummary } from './types'

const post = (id: string, category: string): PostSummary => ({ id, category, title: id, date: '2026-01-01', excerpt: '', tags: [], wordCount: 1 })

test('category pages retain empty historical categories and include every published summary exactly once', () => {
  const posts = [post('a', '随笔'), post('b', ''), post('c', '新的分类')]
  const categories = createCategoryIndex(posts)
  assert.equal(categories.find(category => category.name === '算法')?.posts.length, 0)
  assert.deepEqual(categories.flatMap(category => category.posts).map(item => item.id).sort(), ['a', 'b', 'c'])
  assert.equal(categories.find(category => category.slug === 'uncategorized')?.posts[0].id, 'b')
  assert.equal(createCategoryIndex([posts[0]]).some(category => category.slug === 'uncategorized'), false)
})

test('category links preserve historical slugs and safely encode new category names', () => {
  assert.equal(categoryUrl('随笔'), '/categories/sui-bi/')
  assert.equal(categorySlug(''), 'uncategorized')
  assert.match(categorySlug('C / C++'), /^name-[0-9a-f-]+$/)
  assert.notEqual(categorySlug('C / C++'), categorySlug('C / C#'))
  assert.equal(categoryUrl('C / C++').split('/').length, 4)
})
