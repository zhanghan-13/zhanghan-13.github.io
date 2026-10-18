import { useEffect, useRef, useState } from 'react'
import type { RefObject } from 'react'
import { ChevronLeft, ChevronRight, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogClose, DialogContent, DialogTitle } from '@/components/ui/dialog'
import './article-image-preview.css'

type PreviewImage = { src: string; alt: string }
type Gallery = { images: PreviewImage[]; index: number }

/** Enhances only the images inside an article's sanitized HTML container. */
export function ArticleImagePreview({ rootRef, articleId }: {
  rootRef: RefObject<HTMLElement | null>
  articleId: string
}) {
  const [open, setOpen] = useState(false)
  const [gallery, setGallery] = useState<Gallery>({ images: [], index: 0 })
  const opener = useRef<HTMLImageElement | null>(null)
  const closeButton = useRef<HTMLButtonElement>(null)
  const touchStart = useRef<{ x: number; y: number } | null>(null)

  useEffect(() => {
    const root = rootRef.current
    setOpen(false)
    if (!root) return
    const originalAttributes = new Map<HTMLImageElement, Map<string, string | null>>()
    const attributes = ['role', 'tabindex', 'aria-label', 'aria-haspopup', 'data-image-preview']
    const loadedImages = () => Array.from(root.querySelectorAll('img'))
      .filter(image => image.complete && image.naturalWidth > 0 && Boolean(image.currentSrc || image.src))
    const enhance = () => {
      for (const image of loadedImages()) {
        if (originalAttributes.has(image)) continue
        originalAttributes.set(image, new Map(attributes.map(name => [name, image.getAttribute(name)])))
        image.setAttribute('role', 'button')
        image.setAttribute('tabindex', '0')
        image.setAttribute('aria-label', image.alt.trim() ? `预览图片：${image.alt.trim()}` : '预览图片')
        image.setAttribute('aria-haspopup', 'dialog')
        image.setAttribute('data-image-preview', '')
      }
    }
    const activate = (event: Event) => {
      const image = event.target
      if (!(image instanceof HTMLImageElement) || !originalAttributes.has(image)) return
      if (event instanceof KeyboardEvent && event.key !== 'Enter' && event.key !== ' ') return
      const images = loadedImages()
      const index = images.indexOf(image)
      if (index < 0) return
      event.preventDefault()
      event.stopPropagation()
      opener.current = image
      setGallery({ images: images.map(item => ({ src: item.currentSrc || item.src, alt: item.alt })), index })
      setOpen(true)
    }
    enhance()
    const observer = new MutationObserver(enhance)
    observer.observe(root, { childList: true, subtree: true })
    root.addEventListener('load', enhance, true)
    root.addEventListener('click', activate, true)
    root.addEventListener('keydown', activate, true)
    return () => {
      observer.disconnect()
      root.removeEventListener('load', enhance, true)
      root.removeEventListener('click', activate, true)
      root.removeEventListener('keydown', activate, true)
      for (const [image, previous] of originalAttributes) {
        for (const [name, value] of previous) {
          if (value === null) image.removeAttribute(name)
          else image.setAttribute(name, value)
        }
      }
    }
  }, [rootRef, articleId])

  const move = (offset: number) => setGallery(current => ({
    ...current,
    index: Math.max(0, Math.min(current.images.length - 1, current.index + offset)),
  }))
  const image = gallery.images[gallery.index]

  return <Dialog open={open} onOpenChange={setOpen}>
    <DialogContent
      className="article-image-dialog"
      showCloseButton={false}
      aria-describedby={undefined}
      onOpenAutoFocus={event => { event.preventDefault(); closeButton.current?.focus() }}
      onCloseAutoFocus={event => {
        event.preventDefault()
        if (opener.current?.isConnected) opener.current.focus({ preventScroll: true })
      }}
      onKeyDown={event => {
        if (event.key === 'ArrowLeft') { event.preventDefault(); move(-1) }
        if (event.key === 'ArrowRight') { event.preventDefault(); move(1) }
      }}
    >
      <DialogTitle className="sr-only">图片预览</DialogTitle>
      <div className="article-image-toolbar">
        <span className="article-image-position" aria-live="polite">{gallery.index + 1} / {gallery.images.length}</span>
        <DialogClose asChild><Button ref={closeButton} variant="ghost" size="icon-touch" aria-label="关闭图片预览"><X /></Button></DialogClose>
      </div>
      <div className="article-image-stage"
        onTouchStart={event => {
          touchStart.current = event.touches.length === 1 ? { x: event.touches[0].clientX, y: event.touches[0].clientY } : null
        }}
        onTouchEnd={event => {
          const start = touchStart.current
          touchStart.current = null
          if (!start || event.changedTouches.length !== 1) return
          const dx = event.changedTouches[0].clientX - start.x
          const dy = event.changedTouches[0].clientY - start.y
          if (Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(dy) * 1.5) move(dx < 0 ? 1 : -1)
        }}
        onTouchCancel={() => { touchStart.current = null }}
      >
        {image && <img key={image.src} src={image.src} alt={image.alt} draggable={false} />}
      </div>
      {gallery.images.length > 1 && <nav className="article-image-navigation" aria-label="图片切换">
        <Button variant="outline" size="icon-touch" aria-label="上一张图片" disabled={gallery.index === 0} onClick={() => move(-1)}><ChevronLeft /></Button>
        <Button variant="outline" size="icon-touch" aria-label="下一张图片" disabled={gallery.index === gallery.images.length - 1} onClick={() => move(1)}><ChevronRight /></Button>
      </nav>}
    </DialogContent>
  </Dialog>
}
