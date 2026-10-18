/** Verify the static output without network requests or access to the recovery archive. */
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs'
import { dirname, join, relative, resolve, sep } from 'node:path'
import { fileURLToPath } from 'node:url'
import { load } from 'cheerio'
import { parse as parseYaml } from 'yaml'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const dist = resolve(process.argv[2] || join(root, 'dist'))
const site = 'https://www.bugdesigner.cn'
const errors = []
const assert = (condition, message) => { if (!condition) errors.push(message) }
if (!existsSync(dist)) throw new Error('No dist directory. Run astro build before verifying the output.')

function walk(directory, extension) {
  return readdirSync(directory, { withFileTypes: true }).flatMap(entry => {
    const path = join(directory, entry.name)
    return entry.isDirectory() ? walk(path, extension) : entry.isFile() && path.endsWith(extension) ? [path] : []
  })
}
function outputPath(pathname) {
  let decoded
  try { decoded = decodeURIComponent(pathname) } catch { return undefined }
  const target = resolve(dist, '.' + decoded)
  if (target !== dist && !target.startsWith(dist + sep)) return undefined
  if (existsSync(target) && statSync(target).isFile()) return target
  const index = join(target, 'index.html')
  if (existsSync(index)) return index
  return undefined
}
function pageUrl(path) {
  let pathname = '/' + relative(dist, path).split(sep).join('/')
  if (pathname.endsWith('/index.html')) pathname = pathname.slice(0, -10)
  return new URL(pathname, site)
}
function parseUrl(value, base, context) {
  try { return new URL(value, base) } catch {
    errors.push(`${context}: invalid URL ${JSON.stringify(value)}`)
    return undefined
  }
}
function isLocalhost(url) { return /^(?:localhost|.*\.localhost|127(?:\.\d+){3}|0\.0\.0\.0|\[::1\])$/i.test(url.hostname) }
function postPath(id) { return `/posts/${encodeURIComponent(id)}/` }

const posts = walk(join(root, 'src/content/posts'), '.md').map(path => {
  const source = readFileSync(path, 'utf8').replace(/^\uFEFF/, '')
  const match = source.match(/^---\r?\n([^]*?)\r?\n---(?:\r?\n|$)([^]*)$/)
  if (!match) throw new Error(`Missing frontmatter: ${relative(root, path)}`)
  const data = parseYaml(match[1])
  if (!data || typeof data.id !== 'string') throw new Error(`Missing stable article ID: ${relative(root, path)}`)
  return { data, body: match[2], path }
})
const published = posts.filter(post => !post.data.draft)
const drafts = posts.filter(post => post.data.draft)
assert(new Set(posts.map(post => post.data.id)).size === posts.length, 'Source articles contain duplicate IDs')
const documents = new Map()
const htmlPaths = walk(dist, '.html')
for (const path of htmlPaths) documents.set(path, load(readFileSync(path, 'utf8')))
let internalLinks = 0
let localImages = 0
let legacyImages = 0
let legacyCodeBlocks = 0

for (const [path, $] of documents) {
  const url = pageUrl(path)
  const label = url.pathname
  const canonical = $('link[rel="canonical"]')
  assert(canonical.length === 1, `${label}: expected one canonical link`)
  assert(canonical.attr('href') === url.href, `${label}: canonical must be ${url.href}, received ${canonical.attr('href')}`)
  assert($('html').attr('lang') === 'zh-CN', `${label}: missing Chinese page language`)

  // Source tutorials may legitimately contain localhost examples in <pre>.
  // Only actual navigational/resource URLs and executable scripts are checked.
  $('[href], [src], [action], meta[content]').each((_, element) => {
    const node = $(element)
    for (const attribute of ['href', 'src', 'action', 'content']) {
      const value = node.attr(attribute)
      if (!value || !/^(?:https?:)?\/\//i.test(value)) continue
      const reference = parseUrl(value, url, label)
      if (reference) assert(!isLocalhost(reference), `${label}: localhost URL in ${element.tagName}[${attribute}]`)
    }
  })
  $('script').each((_, element) => {
    assert(!/(?:https?:)?\/\/(?:localhost|127\.0\.0\.1|0\.0\.0\.0)(?::|\/|["'])/i.test($(element).html() || ''), `${label}: development server URL in script`)
  })
  const html = readFileSync(path, 'utf8')
  assert(!/[CD]:[\\/](?:projects[\\/](?:bugdesigner-recovery|bugdesigner-halo-preview|personal-site-research)|Users[\\/]AlbertZhang[\\/](?:AppData|\.codex))/i.test(html), `${label}: local recovery/workspace path was published`)

  $('a[href]').each((_, element) => {
    const value = $(element).attr('href') || ''
    const target = parseUrl(value, url, label)
    if (!target || target.origin !== site) return
    internalLinks++
    const destination = outputPath(target.pathname)
    assert(Boolean(destination), `${label}: missing internal link destination ${target.pathname}`)
    if (!destination || !target.hash || !destination.endsWith('.html')) return
    let fragment
    try { fragment = decodeURIComponent(target.hash.slice(1)) } catch {
      errors.push(`${label}: invalid fragment ${target.hash}`)
      return
    }
    if (fragment.startsWith(':~:text=')) return
    const document = documents.get(destination)
    if (!document) return
    const found = document('[id], a[name]').toArray().some(node => document(node).attr('id') === fragment || document(node).attr('name') === fragment)
    assert(found, `${label}: missing anchor ${target.pathname}${target.hash}`)
  })
  $('img[src]').each((_, element) => {
    const node = $(element)
    const target = parseUrl(node.attr('src'), url, label)
    if (!target) return
    const inArticle = node.parents('.article-body').length > 0
    if (inArticle) assert(target.origin === site, `${label}: article image is not local: ${node.attr('src')}`)
    if (target.origin !== site) return
    localImages++
    assert(Boolean(outputPath(target.pathname)), `${label}: missing image ${target.pathname}`)
    assert(node.attr('alt') !== undefined, `${label}: image missing alt attribute`)
  })
  $('script[src], link[rel="stylesheet"][href]').each((_, element) => {
    const value = $(element).attr('src') || $(element).attr('href')
    const target = parseUrl(value, url, label)
    if (target?.origin === site) assert(Boolean(outputPath(target.pathname)), `${label}: missing script or stylesheet ${target.pathname}`)
  })
}

for (const { data, body } of published) {
  const pathname = postPath(data.id)
  const path = outputPath(pathname)
  assert(Boolean(path), `${pathname}: published article has no output HTML`)
  if (!path) continue
  const $ = documents.get(path)
  assert(Boolean($), `${pathname}: article output could not be parsed`)
  if (!$) continue
  const article = $('.article-body')
  assert(article.length === 1, `${pathname}: expected one .article-body container`)
  for (const heading of data.headings || []) {
    assert(typeof heading.id === 'string' && heading.id.length > 0, `${pathname}: heading has no stable ID`)
    assert(article.find('h1,h2,h3,h4,h5,h6').toArray().some(node => $(node).attr('id') === heading.id), `${pathname}: missing source heading ${heading.id}`)
  }
  if (!data.legacySlug) continue
  const source = load(body)
  const originalCode = source('pre').toArray().map(node => source(node).text())
  const generatedCode = article.find('pre').toArray().map(node => $(node).text())
  assert(originalCode.length === generatedCode.length, `${pathname}: code block count changed (${originalCode.length} → ${generatedCode.length})`)
  originalCode.forEach((text, index) => assert(text === generatedCode[index], `${pathname}: code block ${index + 1} text changed during build`))
  const originalImages = source('img').toArray().map(node => source(node).attr('src'))
  const generatedImages = article.find('img').toArray().map(node => $(node).attr('src'))
  assert(JSON.stringify(originalImages) === JSON.stringify(generatedImages), `${pathname}: legacy image references changed during build`)
  legacyImages += originalImages.length
  legacyCodeBlocks += originalCode.length
}
for (const { data } of drafts) assert(!outputPath(postPath(data.id)), `${postPath(data.id)}: draft article was published`)

const rssPath = outputPath('/rss.xml')
assert(Boolean(rssPath), 'Missing /rss.xml')
if (rssPath) {
  const rss = load(readFileSync(rssPath, 'utf8'), { xmlMode: true })
  const links = new Set(rss('item > link').toArray().map(node => rss(node).text().trim()))
  for (const { data } of published) assert(links.has(site + postPath(data.id)), `RSS missing article ${data.id}`)
  for (const { data } of drafts) assert(!links.has(site + postPath(data.id)), `RSS contains draft ${data.id}`)
}

const sitemapRoot = outputPath('/sitemap-index.xml') || outputPath('/sitemap.xml')
assert(Boolean(sitemapRoot), 'Missing sitemap')
const sitemapPages = new Set()
const readSitemaps = new Set()
function readSitemap(path) {
  if (readSitemaps.has(path)) return
  readSitemaps.add(path)
  const xml = load(readFileSync(path, 'utf8'), { xmlMode: true })
  xml('loc').each((_, node) => {
    const value = xml(node).text().trim()
    const target = parseUrl(value, site, relative(dist, path))
    if (!target) return
    assert(target.origin === site, `Sitemap contains foreign URL ${value}`)
    const destination = outputPath(target.pathname)
    assert(Boolean(destination), `Sitemap target does not exist: ${value}`)
    if (!destination) return
    if (xml(node).parent().is('sitemap')) readSitemap(destination)
    else sitemapPages.add(target.href)
  })
}
if (sitemapRoot) readSitemap(sitemapRoot)
for (const { data } of published) assert(sitemapPages.has(site + postPath(data.id)), `Sitemap missing article ${data.id}`)
for (const { data } of drafts) assert(!sitemapPages.has(site + postPath(data.id)), `Sitemap contains draft ${data.id}`)

const summary = { htmlPages: htmlPaths.length, publishedPosts: published.length, unpublishedDrafts: drafts.length, internalLinks, localImageReferences: localImages, legacyImages, legacyCodeBlocks, sitemapPages: sitemapPages.size }
if (errors.length) {
  console.error('Static build verification failed:')
  for (const error of [...new Set(errors)]) console.error(`- ${error}`)
  console.error(JSON.stringify(summary))
  process.exitCode = 1
} else console.log('Static build verification passed: ' + JSON.stringify(summary))
