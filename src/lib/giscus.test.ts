import { test } from 'node:test'
import assert from 'node:assert/strict'
import { discussionTerm, getCommentState, giscusConfig, receiveDiscussionCount, refreshCommentCount } from './giscus.ts'

const item = (postId: string, comments: unknown, number = 1, category = giscusConfig.categoryId as string) => ({
  title: discussionTerm(postId), number, comments, category: { node_id: category, name: giscusConfig.category },
})
const metadata = (comments = 2, replies = 3) => ({
  repository: { nameWithOwner: giscusConfig.repo }, url: `https://github.com/${giscusConfig.repo}/discussions/1`,
  totalCommentCount: comments, totalReplyCount: replies,
})
const json = (value: unknown, status = 200) => Response.json(value, { status })
const unknown = { count: null, status: 'unavailable' }

test('all articles share one unauthenticated REST request and fresh cached results', async t => {
  const urls: URL[] = []
  t.mock.method(globalThis, 'fetch', async (input: string | URL | Request, init?: RequestInit) => {
    const url = new URL(String(input))
    urls.push(url)
    assert.equal(url.origin, 'https://api.github.com')
    assert.equal(url.pathname, `/repos/${giscusConfig.repo}/discussions`)
    assert.equal(url.searchParams.get('per_page'), '100')
    assert.equal(url.searchParams.get('page'), '1')
    assert.equal(init?.credentials, 'omit')
    assert.equal(new Headers(init?.headers).has('Authorization'), false)
    return json([item('shared-a', 4), item('shared-b', 7, 2), item('loaded-later', 9, 3)])
  })
  const first = refreshCommentCount('shared-a', true)
  assert.equal(refreshCommentCount('shared-b'), first)
  assert.equal(refreshCommentCount('shared-c', true), first, 'force also shares a pending list')
  await first
  assert.deepEqual(getCommentState('shared-a'), { count: 4, status: 'ready' })
  assert.deepEqual(getCommentState('shared-b'), { count: 7, status: 'ready' })
  assert.deepEqual(getCommentState('shared-c'), { count: 0, status: 'ready' })
  assert.deepEqual(getCommentState('loaded-later'), { count: 9, status: 'ready' })
  await refreshCommentCount('loaded-later')
  assert.equal(urls.length, 1)
})

test('only an exact term in the configured category is counted, including REST reply totals', async t => {
  t.mock.method(globalThis, 'fetch', async () => json([
    item('中文 & article', 11),
    item('中文 & article-suffix', 90, 2),
    item('other-category', 50, 3, 'DIC_other'),
    { ...item('prefix', 60, 4), title: `prefix ${discussionTerm('prefix')}` },
  ]))
  await refreshCommentCount('中文 & article', true)
  assert.deepEqual(getCommentState('中文 & article'), { count: 11, status: 'ready' })
  assert.deepEqual(getCommentState('other-category'), { count: 0, status: 'ready' })
  assert.deepEqual(getCommentState('prefix'), { count: 0, status: 'ready' })
  assert.deepEqual(getCommentState('absent'), { count: 0, status: 'ready' })
})

test('pagination reads the entire list before publishing counts or missing-term zeroes', async t => {
  const pages: number[] = []
  t.mock.method(globalThis, 'fetch', async (input: string | URL | Request) => {
    const page = Number(new URL(String(input)).searchParams.get('page'))
    pages.push(page)
    return json(page === 1 ? Array.from({ length: 100 }, (_, i) => item(`page-one-${i}`, i, i + 1)) : [item('page-two', 21, 101)])
  })
  await refreshCommentCount('page-two', true)
  assert.deepEqual(pages, [1, 2])
  assert.deepEqual(getCommentState('page-two'), { count: 21, status: 'ready' })
  assert.deepEqual(getCommentState('page-one-99'), { count: 99, status: 'ready' })

  t.mock.method(globalThis, 'fetch', async (input: string | URL | Request) => {
    const page = Number(new URL(String(input)).searchParams.get('page'))
    return page === 1 ? json(Array.from({ length: 100 }, (_, i) => item(`partial-${i}`, i, i + 1))) : json({ message: 'rate limited' }, 429)
  })
  await refreshCommentCount('partial-absent', true)
  assert.deepEqual(getCommentState('partial-absent'), unknown)
  assert.deepEqual(getCommentState('partial-1'), unknown, 'partial data must not look complete')
  assert.deepEqual(getCommentState('page-two'), unknown, 'a failed refresh must not masquerade as current data')
})

test('HTTP errors, network errors, and invalid response structures never become zero', async t => {
  const responses = [
    () => json({ message: 'Forbidden' }, 403), () => json({ message: 'Rate limited' }, 429),
    () => json({ message: 'Not Found' }, 404), () => { throw new TypeError('Failed to fetch') },
    () => new Response('not JSON'), () => json({ items: [] }),
    ...[-1, 0.5, '4', null, Number.MAX_SAFE_INTEGER + 1].map(count => () => json([item('invalid', count)])),
    () => json([{ ...item('invalid', 1), category: {} }]),
    () => json([item('duplicate', 1), item('duplicate', 2, 2)]),
  ]
  for (const [index, respond] of responses.entries()) {
    t.mock.method(globalThis, 'fetch', async () => respond())
    const id = `failure-${index}`
    await refreshCommentCount(id, true)
    assert.deepEqual(getCommentState(id), unknown)
  }
})

test('a full twentieth page stops safely instead of declaring the list complete', async t => {
  let calls = 0
  t.mock.method(globalThis, 'fetch', async () => {
    const base = calls++ * 100
    return json(Array.from({ length: 100 }, (_, i) => item(`limit-${base + i}`, 1, base + i + 1)))
  })
  await refreshCommentCount('beyond-safe-limit', true)
  assert.equal(calls, 20)
  assert.deepEqual(getCommentState('beyond-safe-limit'), unknown)
})

test('the shared five-minute cache expires and explicit refresh bypasses it', async t => {
  let now = 2_000_000_000_000
  let calls = 0
  t.mock.method(Date, 'now', () => now)
  t.mock.method(globalThis, 'fetch', async () => { calls++; return json([]) })
  await refreshCommentCount('cache-clock', true)
  now += 299_999
  await refreshCommentCount('cache-other')
  assert.equal(calls, 1)
  now++
  await refreshCommentCount('cache-other')
  assert.equal(calls, 2)
  await refreshCommentCount('cache-other', true)
  assert.equal(calls, 3)
})

test('metadata validates repository, URL, and both counts; REST remains authoritative', async t => {
  let calls = 0
  t.mock.method(globalThis, 'fetch', async () => { calls++; return json([item('metadata-article', 42)]) })
  await refreshCommentCount('metadata-article', true)
  for (const invalid of [
    null, {}, { ...metadata(), repository: { nameWithOwner: 'wrong/repository' } },
    ...['https://evil.test/zhanghan-13/blog-comments/discussions/1', `https://github.com/${giscusConfig.repo}/issues/1`, `https://github.com/${giscusConfig.repo}/discussions/1?x=1`, `https://github.com/wrong/repo/discussions/1`].map(url => ({ ...metadata(), url })),
    { ...metadata(), title: discussionTerm('another-article') },
    ...[-1, 1.5, NaN, Infinity, '7', undefined].map(count => ({ ...metadata(), totalCommentCount: count })),
    ...[-1, 0.5, '3', undefined].map(count => ({ ...metadata(), totalReplyCount: count })),
  ]) await receiveDiscussionCount('metadata-article', invalid)
  assert.equal(calls, 1)
  await receiveDiscussionCount('metadata-article', metadata())
  assert.equal(calls, 2)
  assert.deepEqual(getCommentState('metadata-article'), { count: 42, status: 'ready' }, 'do not substitute widget top-level count or its sum')
  await receiveDiscussionCount('metadata-article', metadata())
  assert.equal(calls, 2, 'repeated periodic metadata must not refetch')
  await receiveDiscussionCount('metadata-article', metadata(2, 4))
  assert.equal(calls, 3, 'a reply-only change also refreshes the total')
})

test('metadata changes during a pending list coalesce into one follow-up refresh', { timeout: 3000 }, async t => {
  let release!: () => void
  let calls = 0
  t.mock.method(globalThis, 'fetch', async () => {
    calls++
    if (calls === 1) await new Promise<void>(resolve => { release = resolve })
    return json([item('metadata-during-fetch', calls === 1 ? 1 : 8)])
  })
  const first = refreshCommentCount('metadata-during-fetch', true)
  await Promise.resolve()
  const update = receiveDiscussionCount('metadata-during-fetch', metadata(1, 1))
  assert.equal(receiveDiscussionCount('metadata-during-fetch', metadata(1, 2)), update)
  assert.equal(receiveDiscussionCount('metadata-during-fetch', metadata(1, 2)), update)
  await Promise.resolve()
  release()
  await Promise.all([first, update])
  assert.equal(calls, 2)
  assert.deepEqual(getCommentState('metadata-during-fetch'), { count: 8, status: 'ready' })
})
