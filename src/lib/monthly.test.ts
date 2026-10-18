import { test } from 'node:test'
import assert from 'node:assert/strict'
import { buildYearMonths, getDefaultWritingYear, getMonthStats, getWritingYears, todayInShanghai } from './monthly.ts'
import type { DatedPost } from './monthly.ts'

const fixture = (id: string, date: string, extra: Partial<DatedPost> = {}): DatedPost => ({ id, date, title: id, ...extra })

test('calendar boundaries and leap days retain their publishing month', () => {
  const posts = [fixture('leap', '2024-02-29'), fixture('dec', '2024-12-31'), fixture('jan', '2025-01-01')]
  const previous = buildYearMonths(2024, posts, { asOf: '2025-02-01' })
  const next = buildYearMonths(2025, posts, { asOf: '2025-02-01' })
  assert.equal(previous.length, 12)
  assert.equal(previous[1].end, '2024-02-29')
  assert.equal(previous[1].count, 1)
  assert.equal(previous[11].count, 1)
  assert.equal(next[0].count, 1)
  assert.equal(next[1].end, '2025-02-28')
})

test('draft, duplicate, scheduled and invalid records do not inflate counts', () => {
  const posts = [fixture('same', '2026-10-12'), fixture('same', '2026-10-13'),
    fixture('draft', '2026-10-12', { draft: true }), fixture('private', '2026-10-12', { published: false }),
    fixture('scheduled', '2026-10-12', { status: 'scheduled' }), fixture('future', '2026-10-19'),
    fixture('invalid', '2026-02-30'), fixture('instant', '2026-10-12T00:00:00Z')]
  assert.equal(getMonthStats(buildYearMonths(2026, posts, { asOf: '2026-10-18' })).total, 1)
  assert.equal(getMonthStats(buildYearMonths(2026, posts, { asOf: '2026-10-19' })).total, 2)
  assert.throws(() => buildYearMonths(2026, posts, { asOf: '2026-02-29' }), RangeError)
  assert.throws(() => buildYearMonths(0, posts), RangeError)
})

test('missing and empty months break consecutive writing streaks', () => {
  const months = buildYearMonths(2024, [fixture('jan', '2024-01-01'), fixture('feb', '2024-02-29'), fixture('apr', '2024-04-01')], { asOf: '2024-12-31' })
  assert.deepEqual(getMonthStats(months), { total: 3, activeMonths: 3, maxMonth: 1, longestStreak: 2 })
  assert.equal(getMonthStats(months.filter(month => month.count)).longestStreak, 2)
  assert.deepEqual(getMonthStats([]), { total: 0, activeMonths: 0, maxMonth: 0, longestStreak: 0 })
})

test('available years and default year follow content and the current calendar', () => {
  const posts = [fixture('a', '2023-01-01'), fixture('b', '2024-01-01'), fixture('c', '2024-02-01'), fixture('d', '2025-01-01')]
  assert.deepEqual(getWritingYears(posts, '2027-01-01'), [2027, 2026, 2025, 2024, 2023])
  assert.equal(getDefaultWritingYear(posts, '2027-01-01'), 2024)
  assert.equal(getDefaultWritingYear([...posts, fixture('e', '2025-02-01')], '2027-01-01'), 2025)
  assert.deepEqual(getWritingYears([], '2030-05-01'), [2030])
  assert.equal(getDefaultWritingYear([], '2030-05-01'), 2030)
  assert.equal(todayInShanghai(new Date('2026-12-31T16:01:00Z')), '2027-01-01')
})
