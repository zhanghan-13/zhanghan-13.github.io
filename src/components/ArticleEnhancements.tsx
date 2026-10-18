import { useEffect, useRef, useState } from 'react'
import { ArticleImagePreview } from './article-image-preview'
import { highlightArticleCode } from '@/lib/article-highlight'
import '@/code-highlight.css'

/** Add reading controls to Astro's static article without rendering its body twice. */
export default function ArticleEnhancements({ postId }: { postId: string }) {
  const rootRef = useRef<HTMLElement | null>(null)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const body = document.querySelector<HTMLElement>('.article-body')
    if (!body) return
    rootRef.current = body
    highlightArticleCode(body)
    // Mount the image enhancer only after its DOM target is available.
    setReady(true)
    return () => { rootRef.current = null }
  }, [postId])

  return ready ? <ArticleImagePreview rootRef={rootRef} articleId={postId} /> : null
}
