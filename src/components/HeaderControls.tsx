import { useEffect, useMemo, useRef, useState } from 'react'
import { ArrowUpRight, FileText, Moon, Search, Sun } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Empty, EmptyHeader, EmptyTitle } from '@/components/ui/empty'
import { Input } from '@/components/ui/input'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import type { PostSummary } from '@/lib/types'

export default function HeaderControls({ posts }: { posts: PostSummary[] }) {
  const [dark, setDark] = useState(false)
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const searchButton = useRef<HTMLButtonElement>(null)
  const sorted = useMemo(() => [...posts].sort((a, b) => b.date.localeCompare(a.date)), [posts])
  const keyword = query.trim().toLocaleLowerCase()
  const matching = useMemo(() => sorted.filter(post => `${post.title} ${post.excerpt} ${post.category} ${post.tags.join(' ')}`.toLocaleLowerCase().includes(keyword)), [sorted, keyword])

  useEffect(() => {
    const updateTheme = () => setDark(document.documentElement.classList.contains('dark'))
    updateTheme()
    const observer = new MutationObserver(updateTheme)
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] })
    const handleKey = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault()
        setOpen(value => !value)
      }
    }
    document.addEventListener('keydown', handleKey)
    return () => { observer.disconnect(); document.removeEventListener('keydown', handleKey) }
  }, [])

  const toggleTheme = () => {
    const next = !document.documentElement.classList.contains('dark')
    document.documentElement.classList.toggle('dark', next)
    document.documentElement.style.colorScheme = next ? 'dark' : 'light'
    setDark(next)
    try { localStorage.setItem('zhanghan-theme', next ? 'dark' : 'light') } catch { /* Theme still works when storage is disabled. */ }
  }

  return <TooltipProvider delayDuration={220}>
    <div className="header-actions">
      <Tooltip><TooltipTrigger asChild><Button ref={searchButton} variant="ghost" size="icon-touch" aria-label="搜索文章（Ctrl K）" onClick={() => setOpen(true)}><Search /></Button></TooltipTrigger><TooltipContent sideOffset={6}>搜索文章（Ctrl K）</TooltipContent></Tooltip>
      <Tooltip><TooltipTrigger asChild><Button variant="ghost" size="icon-touch" aria-label={dark ? '切换浅色主题' : '切换深色主题'} onClick={toggleTheme}>{dark ? <Sun /> : <Moon />}</Button></TooltipTrigger><TooltipContent sideOffset={6}>{dark ? '切换浅色主题' : '切换深色主题'}</TooltipContent></Tooltip>
    </div>
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="search-dialog" onCloseAutoFocus={event => { event.preventDefault(); searchButton.current?.focus() }}>
        <DialogHeader><DialogTitle>搜索文章</DialogTitle><DialogDescription>在标题、摘要和标签中查找。</DialogDescription></DialogHeader>
        <label className="sr-only" htmlFor="site-search">搜索关键词</label>
        <Input id="site-search" autoFocus placeholder="搜索一个话题，例如 Redis…" value={query} onChange={event => setQuery(event.target.value)} />
        <p className="search-count" aria-live="polite">{keyword ? `${matching.length} 篇相关内容` : '最近发布'}</p>
        <div className="search-results">
          {(keyword ? matching : matching.slice(0, 6)).map(post => <a href={`/posts/${encodeURIComponent(post.id)}/`} key={post.id} onClick={() => setOpen(false)}><FileText aria-hidden="true" /><span><strong>{post.title}</strong><small>{post.date.replaceAll('-', '.')}{post.category ? ` · ${post.category}` : ''}</small></span><ArrowUpRight aria-hidden="true" /></a>)}
          {matching.length === 0 && <Empty><EmptyHeader><EmptyTitle>没有找到相关文章</EmptyTitle></EmptyHeader></Empty>}
        </div>
      </DialogContent>
    </Dialog>
  </TooltipProvider>
}
