import { load } from 'cheerio'

type PostBody = {
  id?: string
  data: { legacySlug?: string; wordCount?: number }
  body?: string
  rendered?: { html: string }
}

/** Use the same HTML that the reader sees, never Markdown source or stored totals. */
export function getPostBodyHtml(post: PostBody): string {
  const html = post.data.legacySlug ? post.body : post.rendered?.html
  if (typeof html !== 'string') {
    throw new Error(`Article HTML is unavailable for ${post.id ?? 'unknown post'}; keep glob() retainBody enabled and deferRender disabled.`)
  }
  return html
}

/** Full article including code: each Han character and each word/number token counts once. */
export function countWords(html: string): number {
  const $ = load(html, {}, false)
  $('script,style,template,noscript,[hidden]').remove()
  $('br,hr').replaceWith(' ')
  $('address,article,aside,blockquote,dd,div,dl,dt,figcaption,figure,footer,form,h1,h2,h3,h4,h5,h6,header,li,main,nav,ol,p,pre,section,table,tbody,td,th,thead,tr,ul')
    .prepend(' ').append(' ')
  const text = $.text()
  const han = text.match(/\p{Script=Han}/gu)?.length ?? 0
  const words = text.replace(/\p{Script=Han}/gu, ' ').match(/[\p{L}\p{N}][\p{L}\p{M}\p{N}]*(?:['’][\p{L}\p{M}\p{N}]+)*/gu)?.length ?? 0
  return han + words
}
