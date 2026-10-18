import { useEffect, useRef, useState } from 'react'
import type { MouseEvent, RefObject } from 'react'
import { createPortal } from 'react-dom'
import { Check, Link, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import './article-heading-links.css'

function HeadingLink({ url, label }: { url: string; label: string }) {
  const [status, setStatus] = useState<'idle' | 'copied' | 'error'>('idle')
  const [open, setOpen] = useState(false)
  const busy = useRef(false)
  const mounted = useRef(false)
  const resetTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)
  useEffect(() => {
    mounted.current = true
    return () => { mounted.current = false; clearTimeout(resetTimer.current) }
  }, [])

  const copyLink = async (event: MouseEvent<HTMLAnchorElement>) => {
    // Keep native open-in-new-tab and context-menu link copying available.
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return
    event.preventDefault()
    if (busy.current) return
    busy.current = true
    clearTimeout(resetTimer.current)
    try {
      if (!navigator.clipboard?.writeText) throw new Error('Clipboard unavailable')
      await navigator.clipboard.writeText(url)
      if (mounted.current) setStatus('copied')
    } catch {
      if (mounted.current) setStatus('error')
    } finally {
      busy.current = false
      if (mounted.current) resetTimer.current = setTimeout(() => setStatus('idle'), 2500)
    }
  }

  const feedback = status === 'copied' ? '链接已复制' : status === 'error' ? '复制失败，可右键复制链接' : '复制章节链接'
  const Icon = status === 'copied' ? Check : status === 'error' ? X : Link
  return <Tooltip open={open || status !== 'idle'} onOpenChange={setOpen}>
    <TooltipTrigger asChild><Button variant="ghost" size="icon-touch" asChild>
      <a className="heading-permalink" href={url} aria-label={`复制“${label}”章节链接`} onClick={copyLink}><Icon aria-hidden="true" /></a>
    </Button></TooltipTrigger>
    <TooltipContent side="left" sideOffset={4}>{feedback}</TooltipContent>
    <span className="sr-only" role="status" aria-live="polite">{status !== 'idle' ? feedback : ''}</span>
  </Tooltip>
}

export function ArticleHeadingLinks({ rootRef, articleId }: { rootRef: RefObject<HTMLElement | null>; articleId: string }) {
  const [targets, setTargets] = useState<{ slot: HTMLElement; url: string; label: string }[]>([])
  useEffect(() => {
    const root = rootRef.current
    if (!root) return
    const canonical = root.ownerDocument.querySelector<HTMLLinkElement>('link[rel="canonical"]')?.href || location.href
    const headings = [...root.querySelectorAll<HTMLElement>('h1[id],h2[id],h3[id],h4[id],h5[id],h6[id]')]
    const entries = headings.map(heading => {
      const label = heading.textContent?.trim() || '本节'
      const originalLabel = heading.getAttribute('aria-label')
      const slot = root.ownerDocument.createElement('span')
      slot.className = 'heading-link-control'
      const url = new URL(canonical)
      url.search = ''
      // Some restored ids already contain percent escapes. Encode the literal
      // DOM id once, exactly as the table of contents does; never decode it.
      url.hash = encodeURIComponent(heading.id)
      heading.setAttribute('aria-label', originalLabel ?? label)
      heading.append(slot)
      return { heading, originalLabel, slot, url: url.href, label }
    })
    setTargets(entries)
    return () => {
      for (const { heading, originalLabel, slot } of entries) {
        slot.remove()
        if (originalLabel === null) heading.removeAttribute('aria-label')
        else heading.setAttribute('aria-label', originalLabel)
      }
    }
  }, [rootRef, articleId])
  return <TooltipProvider delayDuration={200}>{targets.map(({ slot, url, label }, index) => createPortal(<HeadingLink url={url} label={label} />, slot, `${articleId}-${index}`))}</TooltipProvider>
}
