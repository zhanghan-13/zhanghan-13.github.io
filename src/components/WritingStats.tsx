import { useEffect, useMemo, useRef, useState } from 'react'
import type { KeyboardEvent } from 'react'
import { ArrowRight, CalendarDays } from 'lucide-react'
import CommentCount from '@/components/CommentCount'
import { Badge } from '@/components/ui/badge'
import { Empty, EmptyHeader, EmptyMedia, EmptyTitle } from '@/components/ui/empty'
import { NativeSelect, NativeSelectOption } from '@/components/ui/native-select'
import { Separator } from '@/components/ui/separator'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { buildYearMonths, getDefaultWritingYear, getMonthStats, getWritingYears, todayInShanghai } from '@/lib/monthly'
import { cn } from '@/lib/utils'
import type { PostSummary } from '@/lib/types'

const monthLevel = (count: number) => count === 0 ? 0 : count <= 2 ? 1 : count <= 5 ? 2 : count <= 9 ? 3 : 4

export default function WritingStats({ posts, asOf = todayInShanghai() }: { posts: PostSummary[]; asOf?: string }) {
  const [today, setToday] = useState(asOf)
  const [year, setYear] = useState(() => getDefaultWritingYear(posts, asOf))
  const [selectedMonth, setSelectedMonth] = useState<number | null>(null)
  const grid = useRef<HTMLDivElement>(null)
  const years = useMemo(() => getWritingYears(posts, today), [posts, today])
  const months = useMemo(() => buildYearMonths(year, posts, { asOf: today }), [year, posts, today])
  const stats = useMemo(() => getMonthStats(months), [months])
  const selected = months.find(month => month.month === selectedMonth) ?? months.reduce((best, month) => month.count > best.count ? month : best, months[0])

  useEffect(() => {
    const readQuery = () => {
      const currentDay = todayInShanghai()
      const availableYears = getWritingYears(posts, currentDay)
      const query = new URLSearchParams(window.location.search)
      const requestedYear = Number(query.get('year'))
      const requestedMonth = Number(query.get('month'))
      setToday(currentDay)
      setYear(availableYears.includes(requestedYear) ? requestedYear : getDefaultWritingYear(posts, currentDay))
      setSelectedMonth(Number.isInteger(requestedMonth) && requestedMonth >= 1 && requestedMonth <= 12 ? requestedMonth : null)
    }
    readQuery()
    window.addEventListener('popstate', readQuery)
    return () => window.removeEventListener('popstate', readQuery)
  }, [posts])

  const select = (nextYear: number, month: number | null) => {
    setYear(nextYear)
    setSelectedMonth(month)
    const url = new URL(window.location.href)
    url.searchParams.set('year', String(nextYear))
    if (month === null) url.searchParams.delete('month')
    else url.searchParams.set('month', String(month))
    window.history.replaceState(window.history.state, '', url)
  }

  const onGridKey = (event: KeyboardEvent<HTMLButtonElement>, month: number) => {
    const columns = window.matchMedia('(max-width:640px)').matches ? 6 : 12
    let next = month
    if (event.key === 'ArrowRight') next++
    else if (event.key === 'ArrowLeft') next--
    else if (event.key === 'ArrowDown') next += columns
    else if (event.key === 'ArrowUp') next -= columns
    else if (event.key === 'Home') next = 1
    else if (event.key === 'End') next = 12
    else return
    event.preventDefault()
    grid.current?.querySelector<HTMLButtonElement>(`[data-month="${Math.max(1, Math.min(12, next))}"]`)?.focus()
  }

  return <TooltipProvider delayDuration={220}><main id="main" tabIndex={-1} className="page writing-page">
    <div className="page-heading"><h1>写作统计</h1><NativeSelect aria-label="选择年份" value={year} onChange={event => select(Number(event.target.value), null)}>{years.map(value => <NativeSelectOption key={value} value={value}>{value} 年</NativeSelectOption>)}</NativeSelect></div>
    <dl className="writing-stats"><div><dt>发布文章</dt><dd>{stats.total}<span>篇</span></dd></div><div><dt>更新月份</dt><dd>{stats.activeMonths}<span>月</span></dd></div><div><dt>单月最多</dt><dd>{stats.maxMonth}<span>篇</span></dd></div><div><dt>连续更新</dt><dd>{stats.longestStreak}<span>月</span></dd></div></dl>
    <section className="heatmap-section" aria-labelledby="heatmap-title">
      <div className="section-heading"><h2 id="heatmap-title">每月发文</h2></div>
      <div ref={grid} className="month-grid" aria-label={`${year}年每月发文热力图，共12个月`}>
        {months.map(month => <Tooltip key={month.key}><TooltipTrigger asChild><button type="button" className={cn('month-cell', selected.key === month.key && 'is-selected', month.start > today && 'is-future')} data-level={monthLevel(month.count)} data-month={month.month} aria-pressed={selected.key === month.key} aria-label={`${year}年${month.month}月，${month.start > today ? '尚未开始' : `${month.count}篇`}`} onClick={() => select(year, month.month)} onKeyDown={event => onGridKey(event, month.month)}><span className="month-square" /><span className="month-label">{month.month} 月</span></button></TooltipTrigger><TooltipContent>{year} 年 {month.month} 月 · {month.count} 篇{month.start > today ? ' · 尚未开始' : ''}</TooltipContent></Tooltip>)}
      </div>
      <div className="heatmap-bottom"><div className="heatmap-legend" aria-label="色阶：0、1至2、3至5、6至9、10篇及以上">{['0', '1–2', '3–5', '6–9', '10+'].map((label, level) => <span key={label}><i data-level={level} />{label}</span>)}<span>篇</span></div></div>
    </section>
    <section className="month-detail" aria-live="polite" aria-label="选中月的文章">
      <div className="month-detail-heading"><h2>{year} 年 {selected.month} 月</h2><Badge variant="secondary">{selected.count} 篇文章</Badge></div>
      {selected.count > 0 ? <div className="post-list post-list-compact">{selected.posts.map(post => <article className="post-row" key={post.id}><a className="post-link" href={`/posts/${encodeURIComponent(post.id)}/`}><div className="post-row-content"><h3>{post.title}</h3><div className="post-meta"><time dateTime={post.date}>{post.date.replaceAll('-', '.')}</time>{post.category && <><span aria-hidden="true">·</span><span>{post.category}</span></>}<span aria-hidden="true">·</span><span>{post.wordCount.toLocaleString('zh-CN')} 字</span><span aria-hidden="true">·</span><CommentCount postId={post.id} /></div></div><ArrowRight className="post-arrow" aria-hidden="true" /></a><Separator /></article>)}</div> : <Empty><EmptyHeader><EmptyMedia variant="icon"><CalendarDays /></EmptyMedia><EmptyTitle>暂无文章</EmptyTitle></EmptyHeader></Empty>}
    </section>
  </main></TooltipProvider>
}
