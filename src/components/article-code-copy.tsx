import { useEffect, useRef, useState } from 'react'
import type { RefObject } from 'react'
import { createPortal } from 'react-dom'
import { Check, Copy, X } from 'lucide-react'
import { Button } from '@/components/ui/button'

function CopyCodeButton({ code }: { code: HTMLElement }) {
  const [status, setStatus] = useState<'idle' | 'copying' | 'copied' | 'error'>('idle')
  const resetTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)
  const mounted = useRef(false)

  useEffect(() => {
    mounted.current = true
    return () => {
      mounted.current = false
      clearTimeout(resetTimer.current)
    }
  }, [])

  const copy = async () => {
    clearTimeout(resetTimer.current)
    setStatus('copying')
    try {
      if (!navigator.clipboard?.writeText) throw new Error('Clipboard unavailable')
      // textContent preserves whitespace and decodes HTML entities. The control
      // is outside <pre>, so its label can never become part of the copied code.
      await navigator.clipboard.writeText(code.textContent ?? '')
      if (!mounted.current) return
      setStatus('copied')
      resetTimer.current = setTimeout(() => setStatus('idle'), 2000)
    } catch {
      if (mounted.current) setStatus('error')
    }
  }

  const label = status === 'copied' ? '已复制' : status === 'error' ? '重试复制' : '复制'
  const Icon = status === 'copied' ? Check : status === 'error' ? X : Copy
  return <>
    <span className="code-copy-status" role="status" aria-live="polite">
      {status === 'error' ? '复制失败，请手动选择代码' : <span className="sr-only">{status === 'copied' ? '代码已复制' : ''}</span>}
    </span>
    <Button type="button" variant="ghost" size="touch" className="code-copy-button" aria-label={status === 'copied' ? '代码已复制' : '复制代码'} disabled={status === 'copying'} onClick={copy}>
      <Icon data-icon="inline-start" aria-hidden="true" />{label}
    </Button>
  </>
}

/** Keep the article itself static; mount only the controls as React portals. */
export function ArticleCodeCopy({ rootRef, articleId }: { rootRef: RefObject<HTMLElement | null>; articleId: string }) {
  const [targets, setTargets] = useState<{ toolbar: HTMLElement; code: HTMLElement }[]>([])

  useEffect(() => {
    const root = rootRef.current
    if (!root) return
    const blocks: { wrapper: HTMLElement; pre: HTMLElement; toolbar: HTMLElement; code: HTMLElement }[] = []
    for (const pre of root.querySelectorAll<HTMLElement>('pre')) {
      const code = pre.querySelector<HTMLElement>(':scope > code')
      if (!code || pre.parentElement?.classList.contains('article-code-block')) continue
      const wrapper = root.ownerDocument.createElement('div')
      wrapper.className = 'article-code-block'
      const toolbar = root.ownerDocument.createElement('div')
      toolbar.className = 'article-code-toolbar'
      pre.before(wrapper)
      wrapper.append(toolbar, pre)
      blocks.push({ wrapper, pre, toolbar, code })
    }
    setTargets(blocks)
    return () => {
      for (const { wrapper, pre } of blocks) wrapper.replaceWith(pre)
    }
  }, [rootRef, articleId])

  return targets.map(({ toolbar, code }, index) => createPortal(<CopyCodeButton code={code} />, toolbar, `${articleId}-${index}`))
}
