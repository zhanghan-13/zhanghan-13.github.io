import { useEffect, useMemo, useState } from 'react'
import { ArrowUpRight, Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Empty, EmptyHeader, EmptyMedia, EmptyTitle } from '@/components/ui/empty'
import { Input } from '@/components/ui/input'
import { NativeSelect, NativeSelectOption } from '@/components/ui/native-select'
import type { PostSummary } from '@/lib/types'

export default function ArchiveBrowser({ posts }: { posts: PostSummary[] }) {
  const [filter, setFilter] = useState('')
  const [year, setYear] = useState('all')
  const sorted = useMemo(() => [...posts].sort((a, b) => b.date.localeCompare(a.date)), [posts])
  const years = useMemo(() => [...new Set(sorted.map(post => post.date.slice(0, 4)))].sort((a, b) => Number(b) - Number(a)), [sorted])
  const keyword = filter.trim().toLocaleLowerCase()
  const matching = useMemo(() => sorted.filter(post => (year === 'all' || post.date.startsWith(year)) && `${post.title} ${post.tags.join(' ')} ${post.category}`.toLocaleLowerCase().includes(keyword)), [sorted, year, keyword])

  useEffect(() => {
    const readQuery = () => {
      const query = new URLSearchParams(window.location.search)
      const requestedYear = query.get('year') ?? 'all'
      setYear(years.includes(requestedYear) ? requestedYear : 'all')
      setFilter(query.get('q') ?? '')
    }
    readQuery()
    window.addEventListener('popstate', readQuery)
    return () => window.removeEventListener('popstate', readQuery)
  }, [years])

  const update = (nextFilter: string, nextYear: string) => {
    setFilter(nextFilter)
    setYear(nextYear)
    const url = new URL(window.location.href)
    if (nextFilter) url.searchParams.set('q', nextFilter)
    else url.searchParams.delete('q')
    if (nextYear !== 'all') url.searchParams.set('year', nextYear)
    else url.searchParams.delete('year')
    window.history.replaceState(window.history.state, '', url)
  }

  return <main id="main" tabIndex={-1} className="page archive-page">
    <div className="page-heading"><h1>文章归档</h1><span className="quiet-count">{posts.length} 篇文章</span></div>
    <div className="archive-filters"><label className="sr-only" htmlFor="archive-search">筛选文章标题或标签</label><Input id="archive-search" placeholder="搜索标题或标签…" value={filter} onChange={event => update(event.target.value, year)} /><NativeSelect value={year} onChange={event => update(filter, event.target.value)} aria-label="归档年份"><NativeSelectOption value="all">全部年份</NativeSelectOption>{years.map(value => <NativeSelectOption key={value} value={value}>{value} 年</NativeSelectOption>)}</NativeSelect></div>
    <p className="filter-result" aria-live="polite">{keyword || year !== 'all' ? `找到 ${matching.length} 篇文章` : '按发布时间倒序'}</p>
    {years.map(value => {
      const items = matching.filter(post => post.date.startsWith(value))
      return items.length > 0 && <section className="archive-year" key={value}><h2>{value}<span>{items.length} 篇</span></h2><div>{items.map(post => <a className="archive-row" href={`/posts/${encodeURIComponent(post.id)}/`} key={post.id}><time dateTime={post.date}>{post.date.slice(5).replace('-', '.')}</time><span>{post.title}</span><ArrowUpRight aria-hidden="true" /></a>)}</div></section>
    })}
    {matching.length === 0 && <Empty><EmptyHeader><EmptyMedia variant="icon"><Search /></EmptyMedia><EmptyTitle>没有找到相关文章</EmptyTitle></EmptyHeader><Button variant="outline" onClick={() => update('', 'all')}>清除筛选</Button></Empty>}
  </main>
}
