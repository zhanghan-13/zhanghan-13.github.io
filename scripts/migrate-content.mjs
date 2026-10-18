/**
 * One-time migration of the author's recovered Halo articles.
 * Usage: node scripts/migrate-content.mjs <content.json> [aliases.json]
 * The recovered export is local input only. Normal builds read src/content/posts.
 * Article IDs remain stable because Giscus discussions use `post/<id>`.
 */
import { readFileSync, writeFileSync, mkdirSync, existsSync, copyFileSync, statSync } from 'node:fs'
import { dirname, resolve, extname, sep } from 'node:path'
import { fileURLToPath } from 'node:url'
import { createHash } from 'node:crypto'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const sourcePath = process.argv[2]
if (!sourcePath) throw new Error('Usage: node scripts/migrate-content.mjs <content.json> [aliases.json]')
const source = JSON.parse(readFileSync(sourcePath, 'utf8'))
// Original article pages omit categories; later archived category listings
// provide verified memberships that must survive a repeated migration.
const recoveredCategories = JSON.parse(readFileSync(resolve(root, 'scripts/recovered-categories.json'), 'utf8')).articles
const aliasesPath = process.argv[3] || resolve(dirname(sourcePath), 'aliases.json')
const aliases = existsSync(aliasesPath) ? JSON.parse(readFileSync(aliasesPath, 'utf8')) : {}
const postsDir = resolve(root, 'src/content/posts')
const imagesDir = resolve(root, 'public/images')
mkdirSync(postsDir, { recursive: true })
mkdirSync(imagesDir, { recursive: true })
mkdirSync(resolve(root, 'src/data'), { recursive: true })

const allowed = new Set('article section div span p h1 h2 h3 h4 h5 h6 strong b em i u s del blockquote ol ul li code pre a img br hr table thead tbody tfoot tr th td sup sub figure figcaption details summary kbd samp mark dl dt dd colgroup col'.split(' '))
const voidTags = new Set(['img', 'br', 'hr', 'col'])
const siteHosts = new Set(['www.bugdesigner.cn', 'bugdesigner.cn', 'blog.bugdesigner.cn'])
const articleByPath = new Map(source.articles.map(article => [new URL(article.sourceUrl).pathname.replace(/\/$/, ''), article.slug]))
const copied = new Map()
const report = { articles: 0, imageReferences: 0, uniqueImages: 0, imageBytes: 0, missingImages: [], rewrittenLinks: [], droppedLinks: [], articlesWithoutCategory: [], totalWords: 0, codeBlocks: 0, textChecks: [], posts: [] }

const entities = {
  amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ', ensp: ' ', emsp: ' ', thinsp: ' ',
  Tab: '\t', NewLine: '\n', ndash: '–', mdash: '—', lsquo: '‘', rsquo: '’', ldquo: '“', rdquo: '”',
  hellip: '…', middot: '·', bull: '•', copy: '©', reg: '®', trade: '™', times: '×', divide: '÷',
  laquo: '«', raquo: '»', zwj: '\u200d', zwnj: '\u200c', shy: '\u00ad',
}
function decodeEntities(value = '') {
  return value.replace(/&(#x[\da-f]+|#\d+|[a-z][a-z\d]+);/gi, (entity, name) => {
    if (name[0] !== '#') return entities[name] ?? entity
    const code = name[1].toLowerCase() === 'x' ? parseInt(name.slice(2), 16) : Number(name.slice(1))
    return code > 0 && code <= 0x10ffff && !(code >= 0xd800 && code <= 0xdfff) ? String.fromCodePoint(code) : '\ufffd'
  })
}
function escapeAttr(text = '') { return text.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;') }
function attributes(tag) {
  const out = {}
  for (const match of tag.matchAll(/([\w:-]+)\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+))/g)) out[match[1].toLowerCase()] = decodeEntities(match[2] ?? match[3] ?? match[4])
  return out
}
function textContent(html) {
  return decodeEntities(html.replace(/<!--[^]*?-->/g, '').replace(/<(script|style|template)\b[^>]*>[^]*?<\/\1\s*>/gi, '').replace(/<[^>]*>/g, ''))
}
function countWords(html) {
  const text = decodeEntities(html
    .replace(/<!--[^]*?-->/g, '')
    .replace(/<(script|style|template)\b[^>]*>[^]*?<\/\1\s*>/gi, ' ')
    .replace(/<(?:\/?(?:address|article|aside|blockquote|dd|div|dl|dt|figcaption|figure|footer|form|h[1-6]|header|hr|li|main|nav|ol|p|pre|section|table|tbody|td|th|thead|tr|ul)\b[^>]*|br\b[^>]*)>/gi, ' ')
    .replace(/<[^>]*>/g, ''))
  const han = text.match(/\p{Script=Han}/gu)?.length ?? 0
  const words = text.replace(/\p{Script=Han}/gu, ' ').match(/[\p{L}\p{N}][\p{L}\p{M}\p{N}]*(?:['’][\p{L}\p{M}\p{N}]+)*/gu)?.length ?? 0
  return han + words
}
function normalizeHref(href, article) {
  if (!href) return ''
  if (href.startsWith('#') || /^mailto:[^\s]+$/i.test(href)) return href
  let url
  try { url = new URL(href, article.sourceUrl) } catch { return '' }
  if (!['http:', 'https:'].includes(url.protocol) || /^(localhost|127\.|0\.0\.0\.0)/i.test(url.hostname)) {
    report.droppedLinks.push({ post: article.slug, reason: 'unsupported-or-local-url' })
    return ''
  }
  if (!siteHosts.has(url.hostname)) return url.href
  const key = 'bugdesigner.cn' + decodeURIComponent(url.pathname).replace(/\/$/, '')
  if (aliases[key]) url = new URL(aliases[key])
  if (!siteHosts.has(url.hostname)) {
    report.rewrittenLinks.push({ post: article.slug, from: href, to: url.href })
    return url.href
  }
  const pathname = decodeURIComponent(url.pathname).replace(/\/$/, '')
  const slug = articleByPath.get(pathname)
  const mapped = slug ? `/posts/${slug}/${url.hash}` : pathname === '' ? '/' : pathname === '/aboutme' ? '/about/' : null
  if (mapped) {
    report.rewrittenLinks.push({ post: article.slug, from: href, to: mapped })
    return mapped
  }
  return url.href
}

function rasterInfo(bytes, extension) {
  if (bytes.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]))) return { extension: '.png', width: bytes.readUInt32BE(16), height: bytes.readUInt32BE(20) }
  if (/^GIF8[79]a$/.test(bytes.subarray(0, 6).toString('ascii'))) return { extension: '.gif', width: bytes.readUInt16LE(6), height: bytes.readUInt16LE(8) }
  if (bytes[0] === 0xff && bytes[1] === 0xd8) {
    let offset = 2
    while (offset < bytes.length - 8) {
      if (bytes[offset] !== 0xff) break
      const marker = bytes[offset + 1]
      if (marker >= 0xc0 && marker <= 0xcf && ![0xc4, 0xc8, 0xcc].includes(marker)) return { extension: '.jpg', width: bytes.readUInt16BE(offset + 7), height: bytes.readUInt16BE(offset + 5) }
      const length = bytes.readUInt16BE(offset + 2)
      if (length < 2) break
      offset += length + 2
    }
    return { extension: '.jpg' }
  }
  if (bytes.subarray(0, 4).toString('ascii') === 'RIFF' && bytes.subarray(8, 12).toString('ascii') === 'WEBP') return { extension: '.webp' }
  throw new Error(`Image bytes are not a supported raster image (${extension})`)
}

function cleanHtml(article) {
  let imageOmitted = false
  let body = article.bodyHtml || ''
  body = body.replace(/<!--[^]*?-->/g, '')
    .replace(/<(script|style|iframe|object|embed|form|video|audio|svg|math|template)\b[^>]*>[^]*?<\/\1\s*>/gi, '')
    .replace(/<(input|link|meta|source|embed)\b[^>]*\/?\s*>/gi, '')
  body = body.replace(/<\/?([\w:-]+)\b[^>]*>/g, (tag, rawName) => {
    const name = rawName.toLowerCase()
    if (!allowed.has(name)) return ''
    if (tag.startsWith('</')) return voidTags.has(name) ? '' : `</${name}>`
    const attrs = attributes(tag)
    if (name === 'img') {
      report.imageReferences++
      const src = attrs.src || ''
      let candidate
      const recoveryDir = resolve(dirname(article.offlinePath), '..')
      try { candidate = resolve(dirname(article.offlinePath), decodeURIComponent(src.split(/[?#]/)[0])) } catch { candidate = '' }
      if (/^(?:[a-z]+:|\/\/)/i.test(src) || !candidate.startsWith(recoveryDir + sep) || !existsSync(candidate) || !statSync(candidate).isFile() || !/^\.(?:png|jpe?g|gif|webp)$/i.test(extname(candidate))) {
        imageOmitted = true
        report.missingImages.push({ post: article.slug, alt: attrs.alt || '', originalUrl: attrs['data-original-src'] || null })
        return ''
      }
      const bytes = readFileSync(candidate)
      const info = rasterInfo(bytes, extname(candidate))
      const filename = createHash('sha256').update(bytes).digest('hex').slice(0, 20) + info.extension
      if (!copied.has(filename)) {
        copyFileSync(candidate, resolve(imagesDir, filename))
        copied.set(filename, bytes.length)
      }
      const size = info.width && info.height ? ` width="${info.width}" height="${info.height}"` : ''
      return `<img src="/images/${filename}" alt="${escapeAttr(attrs.alt || '')}"${size} loading="lazy" decoding="async">`
    }
    let output = `<${name}`
    if (attrs.id) output += ` id="${escapeAttr(attrs.id)}"`
    if (name === 'a') {
      const href = normalizeHref(attrs['data-original-href'] || attrs.href, article)
      if (href) output += ` href="${escapeAttr(href)}"`
      if (href && /^https?:/.test(href)) output += ' target="_blank" rel="noopener noreferrer"'
    }
    if ((name === 'code' || name === 'pre') && /^language-[a-z\d+-]+$/i.test(attrs.class || '')) output += ` class="${escapeAttr(attrs.class)}"`
    if ((name === 'td' || name === 'th') && /^\d{1,2}$/.test(attrs.colspan || '')) output += ` colspan="${attrs.colspan}"`
    if ((name === 'td' || name === 'th') && /^\d{1,2}$/.test(attrs.rowspan || '')) output += ` rowspan="${attrs.rowspan}"`
    if (name === 'ol' && /^-?\d+$/.test(attrs.start || '')) output += ` start="${attrs.start}"`
    return output + '>'
  })
  let headingIndex = 0
  const occupiedIds = new Set([...body.matchAll(/\bid="([^"]+)"/g)].map(match => decodeEntities(match[1])))
  const headings = []
  body = body.replace(/<h([1-6])([^>]*)>([^]*?)<\/h\1>/g, (_tag, rawLevel, rawAttrs, inner) => {
    headingIndex++
    const attrs = attributes(rawAttrs)
    let id = attrs.id
    if (!id) {
      id = `heading-${headingIndex}`
      while (occupiedIds.has(id)) id += '-section'
      occupiedIds.add(id)
    }
    const sourceHeading = article.headings?.[headingIndex - 1]
    headings.push({ level: Number(rawLevel), id, text: sourceHeading?.text ?? textContent(inner).replace(/\s+/g, ' ').trim() })
    return `<h${rawLevel} id="${escapeAttr(id)}">${inner}</h${rawLevel}>`
  })
  return { body, imageOmitted, headings }
}

for (const article of [...source.articles].sort((a, b) => b.date.localeCompare(a.date))) {
  if (!/^[a-z\d][a-z\d._-]*$/i.test(article.slug)) throw new Error('Unexpected article identifier')
  const { body, imageOmitted, headings } = cleanHtml(article)
  const before = textContent(article.bodyHtml).replace(/\s+/g, ' ').trim()
  const after = textContent(body).replace(/\s+/g, ' ').trim()
  if (before !== after) throw new Error(`Migration changed visible article text: ${article.slug}`)
  const frontmatter = {
    id: article.slug,
    title: article.title,
    date: article.date,
    excerpt: article.excerpt || article.bodyText?.slice(0, 130) || '',
    category: article.categories?.[0]?.name || recoveredCategories[article.slug]?.category || '',
    tags: (article.tags || []).map(tag => tag.name),
    wordCount: countWords(body),
    headings,
    imageOmitted,
    legacySlug: article.slug,
    sourceUrl: article.sourceUrl,
  }
  // JSON literals are valid YAML and avoid punctuation/date coercion in frontmatter.
  const metadata = Object.entries(frontmatter).map(([key, value]) => `${key}: ${JSON.stringify(value)}`).join('\n')
  // Each top-level HTML block starts on a new line; code contents remain untouched.
  const formatted = body.replace(/(<\/(?:p|h[1-6]|blockquote|pre|table|figure|ol|ul|section|div)>)(?=<)/g, '$1\n')
  writeFileSync(resolve(postsDir, `${article.slug}.md`), `---\n${metadata}\n---\n\n${formatted}\n`, 'utf8')
  report.articles++
  report.totalWords += frontmatter.wordCount
  const codeBlocks = (body.match(/<pre\b/g) || []).length
  report.codeBlocks += codeBlocks
  report.textChecks.push({ post: article.slug, unchanged: true })
  if (!frontmatter.category) report.articlesWithoutCategory.push(article.slug)
  report.posts.push({ id: article.slug, wordCount: frontmatter.wordCount, images: (body.match(/<img\b/g) || []).length, codeBlocks, imageOmitted })
}
if (report.articles !== 50 || new Set(source.articles.map(article => article.slug)).size !== 50) throw new Error('Expected 50 unique recovered articles')
report.uniqueImages = copied.size
report.imageBytes = [...copied.values()].reduce((sum, bytes) => sum + bytes, 0)
writeFileSync(resolve(root, 'src/data/taxonomy.json'), JSON.stringify({
  categories: source.taxonomy.categories.map(({ slug, name }) => ({ slug, name })),
  tags: source.taxonomy.tags.map(({ slug, name }) => ({ slug, name })),
}, null, 2) + '\n', 'utf8')
writeFileSync(resolve(root, 'scripts/migration-report.json'), JSON.stringify(report, null, 2) + '\n', 'utf8')
console.log(JSON.stringify({ articles: report.articles, uniqueImages: report.uniqueImages, imageBytes: report.imageBytes, missingImages: report.missingImages.length, rewrittenLinks: report.rewrittenLinks.length, totalWords: report.totalWords, codeBlocks: report.codeBlocks }))
