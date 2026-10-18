export type CommentCacheRecord = {
  counts: Map<string, number> | null
  attemptedAt: number
  retryAt: number
}

export type CommentCacheStorage = Pick<Storage, 'getItem' | 'setItem'>

const version = 1
const maxEntries = 5_000
const maxRetryDelay = 3_600_000
const clockSkewAllowance = 30_000
const maxSerializedLength = 6_000_000

function cacheKey(repository: string, categoryId: string): string {
  return `zhanghan:comment-counts:v${version}:${encodeURIComponent(repository)}:${encodeURIComponent(categoryId)}`
}

function isNonNegativeInteger(value: unknown): value is number {
  return typeof value === 'number' && Number.isSafeInteger(value) && value >= 0
}

function validIdentity(repository: string, categoryId: string): boolean {
  return typeof repository === 'string' && repository.length > 0 && repository.length <= 512 &&
    typeof categoryId === 'string' && categoryId.length > 0 && categoryId.length <= 256
}

function validTimes(attemptedAt: unknown, retryAt: unknown): boolean {
  return isNonNegativeInteger(attemptedAt) && isNonNegativeInteger(retryAt) &&
    retryAt > attemptedAt && retryAt - attemptedAt <= maxRetryDelay
}

function parseEntries(value: unknown): Map<string, number> | null {
  if (!Array.isArray(value) || value.length > maxEntries) return null
  const counts = new Map<string, number>()
  for (const entry of value) {
    if (!Array.isArray(entry) || entry.length !== 2 ||
        typeof entry[0] !== 'string' || !entry[0].length || entry[0].length > 1_024 ||
        !isNonNegativeInteger(entry[1]) || counts.has(entry[0])) return null
    counts.set(entry[0], entry[1])
  }
  return counts
}

/** Expired or malformed storage is a cache miss, including stale failure records. */
export function readCommentCache(
  storage: CommentCacheStorage | null | undefined,
  now: number,
  repository: string,
  categoryId: string,
): CommentCacheRecord | null {
  try {
    if (!storage || !isNonNegativeInteger(now) || !validIdentity(repository, categoryId)) return null
    const raw = storage.getItem(cacheKey(repository, categoryId))
    if (!raw || raw.length > maxSerializedLength) return null
    const value: unknown = JSON.parse(raw)
    if (!value || typeof value !== 'object' || Array.isArray(value)) return null
    const record = value as Record<string, unknown>
    if (record.version !== version || record.repository !== repository || record.categoryId !== categoryId ||
        !validTimes(record.attemptedAt, record.retryAt)) return null
    const attemptedAt = record.attemptedAt as number
    const retryAt = record.retryAt as number
    // A small wall-clock adjustment is harmless; a timestamp far in the future
    // must never suppress requests indefinitely.
    if (attemptedAt > now + clockSkewAllowance || retryAt <= now || retryAt > now + maxRetryDelay) return null
    const counts = record.counts === null ? null : parseEntries(record.counts)
    if (record.counts !== null && counts === null) return null
    return { counts, attemptedAt, retryAt }
  } catch {
    return null
  }
}

/** Cache failures as null, not an empty map that would imply zero comments. */
export function writeCommentCache(
  storage: CommentCacheStorage | null | undefined,
  record: CommentCacheRecord,
  repository: string,
  categoryId: string,
): boolean {
  try {
    if (!storage || !validIdentity(repository, categoryId) || !record ||
        !validTimes(record.attemptedAt, record.retryAt)) return false
    if (record.counts !== null && !(record.counts instanceof Map)) return false
    const entries = record.counts === null ? null : [...record.counts]
    if (entries !== null && parseEntries(entries) === null) return false
    const raw = JSON.stringify({
      version, repository, categoryId,
      counts: entries, attemptedAt: record.attemptedAt, retryAt: record.retryAt,
    })
    if (raw.length > maxSerializedLength) return false
    storage.setItem(cacheKey(repository, categoryId), raw)
    return true
  } catch {
    return false
  }
}
