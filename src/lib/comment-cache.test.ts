import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readCommentCache, writeCommentCache, type CommentCacheRecord } from './comment-cache.ts'

const repository = 'owner/comments'
const categoryId = 'DIC_category'
const now = 1_800_000_000_000
const duration = 300_000
const record = (counts: Map<string, number> | null = new Map([['post/中文文章', 4], ['post/empty', 0]])): CommentCacheRecord => ({
  counts, attemptedAt: now, retryAt: now + duration,
})
function memoryStorage() {
  const data = new Map<string, string>()
  return {
    data,
    getItem: (key: string) => data.get(key) ?? null,
    setItem: (key: string, value: string) => { data.set(key, value) },
  }
}
function corrupted(value: unknown) {
  const storage = memoryStorage()
  writeCommentCache(storage, record(), repository, categoryId)
  const key = [...storage.data.keys()][0]!
  storage.data.set(key, JSON.stringify(value))
  return storage
}
const serialized = () => ({
  version: 1, repository, categoryId, counts: [['post/a', 4]], attemptedAt: now, retryAt: now + duration,
})

test('a successful cache survives new consumers until its exact retry time', () => {
  const storage = memoryStorage()
  assert.equal(writeCommentCache(storage, record(), repository, categoryId), true)
  const first = readCommentCache(storage, now + duration - 1, repository, categoryId)
  assert.deepEqual(first, record())
  first!.counts!.set('post/中文文章', 99)
  assert.equal(readCommentCache(storage, now + 1, repository, categoryId)?.counts?.get('post/中文文章'), 4)
  assert.equal(readCommentCache(storage, now + duration, repository, categoryId), null)
})

test('failure caches preserve unknown counts and respect a rate-limit reset for at most one hour', () => {
  const storage = memoryStorage()
  const failure = { ...record(null), retryAt: now + 3_600_000 }
  assert.equal(writeCommentCache(storage, failure, repository, categoryId), true)
  assert.deepEqual(readCommentCache(storage, now + duration, repository, categoryId), failure)
  assert.equal(readCommentCache(storage, failure.retryAt, repository, categoryId), null)
  assert.equal(writeCommentCache(storage, { ...failure, retryAt: now + 3_600_001 }, repository, categoryId), false)
})

test('empty successful results remain distinguishable from failed requests', () => {
  const storage = memoryStorage()
  writeCommentCache(storage, record(new Map()), repository, categoryId)
  assert.deepEqual(readCommentCache(storage, now, repository, categoryId)?.counts, new Map())
  writeCommentCache(storage, record(null), repository, categoryId)
  assert.equal(readCommentCache(storage, now, repository, categoryId)?.counts, null)
})

test('keys isolate repository, category and cache schema; embedded identity is also checked', () => {
  const storage = memoryStorage()
  writeCommentCache(storage, record(), repository, categoryId)
  assert.equal(readCommentCache(storage, now, 'other/comments', categoryId), null)
  assert.equal(readCommentCache(storage, now, repository, 'DIC_other'), null)
  writeCommentCache(storage, record(new Map([['post/other', 7]])), repository, 'DIC_other')
  assert.equal(storage.data.size, 2)
  assert.equal(readCommentCache(storage, now, repository, categoryId)?.counts?.get('post/中文文章'), 4)
  for (const change of [{ version: 0 }, { repository: 'other/comments' }, { categoryId: 'DIC_other' }]) {
    assert.equal(readCommentCache(corrupted({ ...serialized(), ...change }), now, repository, categoryId), null)
  }
})

test('bad JSON, missing fields and invalid counts are cache misses, never fake zeros', () => {
  const storage = memoryStorage()
  writeCommentCache(storage, record(), repository, categoryId)
  storage.data.set([...storage.data.keys()][0]!, '{broken')
  assert.equal(readCommentCache(storage, now, repository, categoryId), null)
  for (const counts of [undefined, {}, 0, [['post/a', -1]], [['post/a', 0.5]], [['post/a', '2']],
    [['post/a', Number.MAX_SAFE_INTEGER + 1]], [['post/a', null]], [['post/a', 1], ['post/a', 2]],
    [['post/a', 2, 'extra']], [[null, 1]], [['', 2]], [['a'.repeat(1_025), 2]]]) {
    assert.equal(readCommentCache(corrupted({ ...serialized(), counts }), now, repository, categoryId), null)
  }
  for (const value of [null, [], 'text', {}, { counts: null }]) {
    assert.equal(readCommentCache(corrupted(value), now, repository, categoryId), null)
  }
})

test('entry count is bounded and invalid data is not written', () => {
  const storage = memoryStorage()
  const maximum = new Map(Array.from({ length: 5_000 }, (_, i) => [`post/${i}`, i]))
  assert.equal(writeCommentCache(storage, record(maximum), repository, categoryId), true)
  assert.equal(readCommentCache(storage, now, repository, categoryId)?.counts?.size, 5_000)
  maximum.set('post/overflow', 0)
  assert.equal(writeCommentCache(storage, record(maximum), repository, categoryId), false)
  assert.equal(readCommentCache(corrupted({ ...serialized(), counts: [...maximum] }), now, repository, categoryId), null)
  assert.equal(writeCommentCache(storage, record(new Map([['post/a', NaN]])), repository, categoryId), false)
})

test('timestamps reject unsafe numbers, reversed intervals, long cooldowns and future attempts', () => {
  for (const change of [
    { attemptedAt: -1 }, { attemptedAt: 0.5 }, { attemptedAt: '123' }, { retryAt: null },
    { retryAt: Number.MAX_SAFE_INTEGER + 1 }, { retryAt: now }, { retryAt: now - 1 },
    { retryAt: now + 3_600_001 }, { attemptedAt: now + 30_001 },
  ]) {
    assert.equal(readCommentCache(corrupted({ ...serialized(), ...change }), now, repository, categoryId), null)
  }
  assert.ok(readCommentCache(corrupted({ ...serialized(), attemptedAt: now + 30_000 }), now, repository, categoryId))
  for (const invalidNow of [-1, NaN, Infinity, 0.5]) {
    assert.equal(readCommentCache(corrupted(serialized()), invalidNow, repository, categoryId), null)
  }
})

test('unavailable storage and quota errors do not interrupt rendering or network requests', () => {
  const disabled = {
    getItem: () => { throw new Error('Storage disabled') },
    setItem: () => { throw new Error('Quota exceeded') },
  }
  for (const storage of [null, undefined, disabled]) {
    assert.equal(readCommentCache(storage, now, repository, categoryId), null)
    assert.equal(writeCommentCache(storage, record(), repository, categoryId), false)
  }
})
