import { useCallback, useEffect, useSyncExternalStore } from 'react'

export const giscusConfig = {
  host: 'https://giscus.app',
  repo: 'zhanghan-13/blog-comments',
  repoId: 'R_kgDOVOSSnw',
  category: 'Announcements',
  categoryId: 'DIC_kwDOVOSSn84DI31A',
} as const

// Keep the same identifier when the production domain or URL structure changes.
export const discussionTerm = (postId: string) => `post/${postId}`
export type CommentState = { count: number | null; status: 'loading' | 'ready' | 'unavailable' }
const initial: CommentState = { count: null, status: 'loading' }
const states = new Map<string, CommentState>()
const listeners = new Set<() => void>()
const metadataSignatures = new Map<string, string>()
const cacheDuration = 300_000
const pageSize = 100
const maxPages = 20
let counts: Map<string, number> | null = null
let lastAttemptAt: number | null = null
let pending: Promise<void> | null = null
let metadataRefresh: Promise<void> | null = null
let metadataDirty = false

function cachedState(postId: string): CommentState {
  if (counts) return { count: counts.get(discussionTerm(postId)) ?? 0, status: 'ready' }
  return lastAttemptAt === null ? initial : { count: null, status: 'unavailable' }
}

function notifyAll() {
  for (const postId of states.keys()) states.set(postId, cachedState(postId))
  for (const listener of listeners) listener()
}

function isCount(value: unknown): value is number {
  return typeof value === 'number' && Number.isSafeInteger(value) && value >= 0
}

function isDiscussionUrl(value: unknown) {
  if (typeof value !== 'string') return false
  try {
    const url = new URL(value)
    return url.origin === 'https://github.com' && !url.username && !url.password &&
      new RegExp(`^/${giscusConfig.repo}/discussions/[1-9]\\d*$`).test(url.pathname) && !url.search && !url.hash
  } catch { return false }
}

/** Widget metadata is a change signal; REST counts include both comments and replies. */
export function receiveDiscussionCount(postId: string, discussion: unknown): Promise<void> {
  if (!discussion || typeof discussion !== 'object') return Promise.resolve()
  const value = discussion as {
    url?: unknown; title?: unknown; totalCommentCount?: unknown; totalReplyCount?: unknown
    repository?: { nameWithOwner?: unknown }
  }
  if (value.repository?.nameWithOwner !== giscusConfig.repo || !isDiscussionUrl(value.url) ||
      !isCount(value.totalCommentCount) || !isCount(value.totalReplyCount) ||
      (value.title !== undefined && value.title !== discussionTerm(postId))) return Promise.resolve()
  const signature = `${value.url}:${value.totalCommentCount}:${value.totalReplyCount}`
  if (metadataSignatures.get(postId) === signature) return metadataRefresh ?? pending ?? Promise.resolve()
  metadataSignatures.set(postId, signature)

  // A count may change while an earlier list is in flight. Coalesce those signals
  // into a follow-up so a stale response cannot swallow the update.
  metadataDirty = true
  if (!metadataRefresh) metadataRefresh = Promise.resolve().then(async () => {
    if (pending) await pending
    while (metadataDirty) {
      metadataDirty = false
      await refreshCommentCount(postId, true)
    }
  }).finally(() => { metadataRefresh = null })
  return metadataRefresh
}

async function fetchAllCounts(): Promise<Map<string, number>> {
  const next = new Map<string, number>()
  const seenNumbers = new Set<number>()
  for (let page = 1; page <= maxPages; page++) {
    const params = new URLSearchParams({ per_page: String(pageSize), page: String(page) })
    const response = await fetch(`https://api.github.com/repos/${giscusConfig.repo}/discussions?${params}`, {
      credentials: 'omit', signal: AbortSignal.timeout(12_000),
      headers: { Accept: 'application/vnd.github+json' },
    })
    if (!response.ok) throw new Error(`GitHub Discussions request failed: ${response.status}`)
    const data: unknown = await response.json()
    if (!Array.isArray(data) || data.length > pageSize) throw new Error('Invalid GitHub Discussions list')
    for (const item of data) {
      if (!item || typeof item !== 'object' || typeof item.title !== 'string' ||
          !isCount(item.comments) || !Number.isSafeInteger(item.number) || item.number <= 0 ||
          typeof item.category?.node_id !== 'string' || !item.category.node_id || seenNumbers.has(item.number)) {
        throw new Error('Invalid or repeated GitHub Discussion')
      }
      seenNumbers.add(item.number)
      if (item.category.node_id !== giscusConfig.categoryId) continue
      if (next.has(item.title)) throw new Error('Ambiguous Discussion title')
      next.set(item.title, item.comments)
    }
    // Missing terms become zero only after the whole list is known to be valid.
    if (data.length < pageSize) return next
  }
  throw new Error('GitHub Discussions pagination limit reached')
}

export function refreshCommentCount(postId: string, force = false): Promise<void> {
  getCommentState(postId)
  if (pending) return pending
  if (!force && lastAttemptAt !== null && Date.now() - lastAttemptAt < cacheDuration) return Promise.resolve()
  // Defer the work so pending is assigned even if a mocked or unavailable fetch throws synchronously.
  pending = Promise.resolve().then(async () => {
    try { counts = await fetchAllCounts() }
    catch { counts = null }
    finally {
      lastAttemptAt = Date.now()
      pending = null
      notifyAll()
    }
  })
  return pending
}

function subscribe(listener: () => void) {
  listeners.add(listener)
  return () => { listeners.delete(listener) }
}

export function getCommentState(postId: string): CommentState {
  let state = states.get(postId)
  if (!state) { state = cachedState(postId); states.set(postId, state) }
  return state
}

export function useCommentState(postId: string) {
  const snapshot = useCallback(() => getCommentState(postId), [postId])
  const state = useSyncExternalStore(subscribe, snapshot, () => initial)
  useEffect(() => {
    void refreshCommentCount(postId)
    const refresh = () => { if (document.visibilityState === 'visible') void refreshCommentCount(postId) }
    window.addEventListener('focus', refresh)
    return () => window.removeEventListener('focus', refresh)
  }, [postId])
  return state
}

export function useCommentCount(postId: string) { return useCommentState(postId).count }
