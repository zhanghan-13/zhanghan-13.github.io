import type { PostSummary } from './types.ts'

export type DatedPost = Pick<PostSummary, 'id' | 'date' | 'title'> & {
  draft?: boolean
  published?: boolean
  status?: string
}

export interface Month<T extends DatedPost = PostSummary> {
  key: string
  year: number
  month: number
  start: string
  end: string
  count: number
  posts: T[]
}

/** Publishing dates use the author's calendar, independently of the visitor's timezone. */
export function todayInShanghai(now = new Date()): string {
  return new Date(now.getTime() + 8 * 60 * 60 * 1000).toISOString().slice(0, 10)
}

function parseCalendarDate(value: string): Date | null {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return null
  const [year, month, day] = value.split('-').map(Number)
  if (year < 1 || year > 9998) return null
  const date = new Date(0)
  date.setUTCFullYear(year, month - 1, day)
  date.setUTCHours(0, 0, 0, 0)
  return date.getUTCFullYear() === year && date.getUTCMonth() === month - 1 && date.getUTCDate() === day ? date : null
}

function eligiblePosts<T extends DatedPost>(posts: T[], asOf: string): T[] {
  if (!parseCalendarDate(asOf)) throw new RangeError(`Invalid asOf date: ${asOf}`)
  const seen = new Set<string>()
  return posts.filter(post => {
    if (!post.id || seen.has(post.id) || post.draft || post.published === false ||
      (post.status !== undefined && post.status !== 'published') ||
      !parseCalendarDate(post.date) || post.date > asOf) return false
    seen.add(post.id)
    return true
  })
}

export function buildYearMonths<T extends DatedPost>(year: number, posts: T[], options: { asOf?: string } = {}): Month<T>[] {
  if (!Number.isInteger(year) || year < 1 || year > 9998) throw new RangeError('Invalid calendar year')
  const prefix = String(year).padStart(4, '0')
  const months: Month<T>[] = Array.from({ length: 12 }, (_, index) => {
    const month = index + 1
    const key = `${prefix}-${String(month).padStart(2, '0')}`
    const lastDay = new Date(0)
    lastDay.setUTCFullYear(year, month, 0)
    lastDay.setUTCHours(0, 0, 0, 0)
    return { key, year, month, start: `${key}-01`, end: lastDay.toISOString().slice(0, 10), count: 0, posts: [] }
  })
  for (const post of eligiblePosts(posts, options.asOf ?? todayInShanghai())) {
    if (Number(post.date.slice(0, 4)) === year) months[Number(post.date.slice(5, 7)) - 1].posts.push(post)
  }
  for (const month of months) {
    month.posts.sort((a, b) => b.date.localeCompare(a.date) || a.title.localeCompare(b.title, 'zh-CN'))
    month.count = month.posts.length
  }
  return months
}

export function getWritingYears(posts: DatedPost[], asOf = todayInShanghai()): number[] {
  const currentYear = Number(asOf.slice(0, 4))
  const years = eligiblePosts(posts, asOf).map(post => Number(post.date.slice(0, 4)))
  const firstYear = Math.min(currentYear, ...years)
  return Array.from({ length: currentYear - firstYear + 1 }, (_, index) => currentYear - index)
}

/** Open a useful year without hard-coding a sample year; ties prefer the newer year. */
export function getDefaultWritingYear(posts: DatedPost[], asOf = todayInShanghai()): number {
  const counts = new Map<number, number>()
  for (const post of eligiblePosts(posts, asOf)) {
    const year = Number(post.date.slice(0, 4))
    counts.set(year, (counts.get(year) ?? 0) + 1)
  }
  return [...counts].sort((a, b) => b[1] - a[1] || b[0] - a[0])[0]?.[0] ?? Number(asOf.slice(0, 4))
}

export function getMonthStats(months: Month<DatedPost>[]) {
  let total = 0
  let activeMonths = 0
  let maxMonth = 0
  let longestStreak = 0
  let currentStreak = 0
  let previousEnd: string | undefined
  for (const month of [...months].sort((a, b) => a.start.localeCompare(b.start))) {
    const start = parseCalendarDate(month.start)
    const previous = previousEnd ? parseCalendarDate(previousEnd) : null
    if (previous && start && start.getTime() - previous.getTime() !== 86_400_000) currentStreak = 0
    total += month.count
    maxMonth = Math.max(maxMonth, month.count)
    if (month.count > 0) {
      activeMonths += 1
      longestStreak = Math.max(longestStreak, ++currentStreak)
    } else currentStreak = 0
    previousEnd = month.end
  }
  return { total, activeMonths, maxMonth, longestStreak }
}
