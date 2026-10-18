import { useEffect, useRef, useState } from 'react'
import Giscus from '@giscus/react'
import { Button } from '@/components/ui/button'
import { discussionTerm, giscusConfig, receiveDiscussionCount, receiveDiscussionNotFound, refreshCommentCount } from '@/lib/giscus'
import './comments.css'

export default function Comments({ postId }: { postId: string }) {
  return <CommentSection key={postId} postId={postId} />
}

function CommentSection({ postId }: { postId: string }) {
  const root = useRef<HTMLElement>(null)
  // The server and hydration render agree; the actual preference is read after mount.
  const [dark, setDark] = useState(false)
  const [retrying, setRetrying] = useState(false)
  const [widgetError, setWidgetError] = useState(false)
  const [attempt, setAttempt] = useState(0)

  useEffect(() => {
    const backlink = document.createElement('meta')
    backlink.name = 'giscus:backlink'
    const url = new URL(location.href)
    url.searchParams.delete('giscus')
    url.hash = ''
    backlink.content = url.toString()
    document.head.append(backlink)

    const updateTheme = () => setDark(document.documentElement.classList.contains('dark'))
    updateTheme()
    const observer = new MutationObserver(updateTheme)
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] })
    const receive = (event: MessageEvent) => {
      const iframe = root.current?.querySelector('giscus-widget')?.shadowRoot?.querySelector('iframe')
      if (event.origin !== giscusConfig.host || !iframe || event.source !== iframe.contentWindow) return
      const message = event.data?.giscus
      if (!message || typeof message !== 'object') return
      if (message.discussion) {
        void receiveDiscussionCount(postId, message.discussion)
        setWidgetError(false)
      }
      if (message.error === 'Discussion not found') {
        receiveDiscussionNotFound(postId)
        setWidgetError(false)
      } else if (typeof message.error === 'string' && !message.signOut) setWidgetError(true)
    }
    window.addEventListener('message', receive)
    return () => {
      backlink.remove()
      observer.disconnect()
      window.removeEventListener('message', receive)
    }
  }, [postId])

  async function retry() {
    setRetrying(true)
    setWidgetError(false)
    setAttempt(value => value + 1)
    await refreshCommentCount(postId, true)
    setRetrying(false)
  }

  return <section ref={root} className="comments" id="comments" aria-labelledby="comments-title">
    <header className="comments-heading">
      <h2 id="comments-title">评论</h2>
      <p>使用 GitHub 账号登录评论</p>
    </header>
    {widgetError && <div className="comment-unavailable" role="status">
      <p>评论暂时无法加载</p>
      <Button variant="outline" size="touch" disabled={retrying} onClick={retry}>{retrying ? '正在重试…' : '重新加载'}</Button>
    </div>}
    <Giscus key={attempt} id="giscus-comments" host={giscusConfig.host}
      repo={giscusConfig.repo} repoId={giscusConfig.repoId} category={giscusConfig.category} categoryId={giscusConfig.categoryId}
      mapping="specific" term={discussionTerm(postId)} strict="1" reactionsEnabled="0" emitMetadata="1"
      inputPosition="top" theme={dark ? 'noborder_dark' : 'noborder_light'} lang="zh-CN" loading="eager" />
  </section>
}
