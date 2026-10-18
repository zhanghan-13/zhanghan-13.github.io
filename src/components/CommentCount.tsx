import { useCommentState } from '@/lib/giscus'

export function CommentCount({ postId }: { postId: string }) {
  const { count, status } = useCommentState(postId)
  const label = status === 'loading' ? '评论数正在加载' : status === 'unavailable' ? '评论数暂时无法获取' : `${count} 条评论`

  return <span className="comment-count" data-post-id={postId} aria-label={label}>
    {count === null ? '—' : count} 条评论
  </span>
}

export default CommentCount
