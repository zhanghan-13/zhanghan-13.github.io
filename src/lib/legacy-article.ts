import { load } from 'cheerio'

interface ArticleHeading {
  id: string
  text: string
  level: number
}

/** Restore readable fragments without changing the archived source or old links. */
export function renderLegacyArticle(html: string, headings: readonly ArticleHeading[]) {
  const $ = load(html, null, false)
  const ids = new Set($('[id]').toArray().map(node => $(node).attr('id')!))
  const replacements = new Map<string, string>()

  $('h1[id],h2[id],h3[id],h4[id],h5[id],h6[id]').each((_, node) => {
    const heading = $(node)
    const oldId = heading.attr('id')!
    let decoded: string
    try { decoded = decodeURIComponent(oldId) } catch { return }
    if (!decoded || decoded === oldId || /\s/.test(decoded)) return

    let id = decoded
    let suffix = 2
    // Keep every existing target, including non-heading IDs and old aliases.
    while (ids.has(id)) id = `${decoded}-${suffix++}`
    ids.add(id)
    replacements.set(oldId, id)
    heading.attr('id', id)
    heading.prepend($('<span></span>').attr({
      id: oldId,
      class: 'article-anchor-alias',
      'data-heading-alias': id,
      'aria-hidden': 'true',
    }))
  })

  return {
    html: $.html(),
    headings: headings.map(heading => ({ ...heading, id: replacements.get(heading.id) ?? heading.id })),
  }
}
