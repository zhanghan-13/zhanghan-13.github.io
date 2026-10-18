import { test } from 'node:test'
import assert from 'node:assert/strict'
import { load } from 'cheerio'
import { renderLegacyArticle } from './legacy-article.ts'

test('legacy Chinese headings use readable IDs with native targets for previous links', () => {
  const oldId = encodeURIComponent('简历撰写')
  const source = `<article><h3 id="${oldId}"><strong>简历撰写</strong></h3><pre><code>a &lt; b\n\n  c</code></pre><img src="/image.png" alt="图"></article>`
  const result = renderLegacyArticle(source, [{ id: oldId, text: '简历撰写', level: 3 }])
  const $ = load(result.html)
  assert.equal($('h3').attr('id'), '简历撰写')
  assert.equal($('h3').text(), '简历撰写')
  assert.equal($('h3 strong').text(), '简历撰写')
  assert.equal($('.article-anchor-alias').attr('id'), oldId)
  assert.equal($('.article-anchor-alias').attr('data-heading-alias'), '简历撰写')
  assert.equal($('.article-anchor-alias').attr('aria-hidden'), 'true')
  assert.equal($('pre').text(), 'a < b\n\n  c')
  assert.equal($('img').attr('src'), '/image.png')
  assert.deepEqual(result.headings, [{ id: '简历撰写', text: '简历撰写', level: 3 }])
})

test('restored IDs avoid existing targets and preserve literal percent signs and unchanged headings', () => {
  const encoded = encodeURIComponent('前言')
  const result = renderLegacyArticle(`<div id="前言"></div><h2 id="${encoded}">前言</h2><h2 id="前言-2">另一个</h2><h2 id="100%完整">比例</h2><h2 id="hello">Hello</h2>`, [])
  const $ = load(result.html)
  const ids = $('[id]').toArray().map(node => $(node).attr('id'))
  assert.equal(new Set(ids).size, ids.length)
  assert.equal($('h2').first().attr('id'), '前言-3')
  assert.deepEqual($('h2').toArray().slice(1).map(node => $(node).attr('id')), ['前言-2', '100%完整', 'hello'])
  assert.equal($('.article-anchor-alias').length, 1)
})
