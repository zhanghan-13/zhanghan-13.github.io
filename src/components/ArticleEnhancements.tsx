import { useEffect, useRef, useState } from 'react'
import { ArticleImagePreview } from './article-image-preview'
import { ArticleCodeCopy } from './article-code-copy'
import { ArticleHeadingLinks } from './article-heading-links'
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
    // Mount controls only after the article and normalized code are available.
    setReady(true)
    return () => { rootRef.current = null }
  }, [postId])

  return ready ? <>
    <ArticleHeadingLinks rootRef={rootRef} articleId={postId} />
    <ArticleCodeCopy rootRef={rootRef} articleId={postId} />
    <ArticleImagePreview rootRef={rootRef} articleId={postId} />
  </> : null
}
