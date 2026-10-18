import { test } from 'node:test'
import assert from 'node:assert/strict'
import { activeArticleHeading, articleHeadingFromHash } from './article-toc.ts'

test('native anchor rounding does not leave the preceding chapter selected', () => {
  const headings = [{ id: 'intro', top: 350, offset: 120 }, { id: 'chapter', top: 920.625, offset: 120 }]
  assert.equal(activeArticleHeading(headings, 800, 2000), 'chapter')
  assert.equal(activeArticleHeading(headings, 795, 2000), 'intro')
})

test('selection follows computed offsets after a breakpoint or layout shift', () => {
  const headings = [{ id: 'intro', top: 350, offset: 190 }, { id: 'chapter', top: 920.625, offset: 190 }]
  assert.equal(activeArticleHeading(headings, 730, 2000), 'chapter')
  assert.equal(activeArticleHeading(headings.map(item => ({ ...item, top: item.top + 240 })), 730, 2240), 'intro')
  assert.equal(activeArticleHeading(headings.map(item => ({ ...item, top: item.top + 240 })), 970, 2240), 'chapter')
})

test('explicit anchors distinguish final chapters at the bottom without locking normal scrolling', () => {
  const headings = [{ id: 'intro', top: 100, offset: 120 }, { id: 'middle', top: 1400, offset: 120 }, { id: 'last', top: 1550, offset: 120 }]
  assert.equal(activeArticleHeading(headings, 1000, 1000, 'middle'), 'middle')
  assert.equal(activeArticleHeading(headings, 1000, 1000, 'last'), 'last')
  assert.equal(activeArticleHeading(headings, 900, 1000, 'last'), 'intro')
  assert.equal(activeArticleHeading(headings, 1300, 1700, 'last'), 'middle')
  assert.equal(activeArticleHeading(headings, 1500, 1700, 'middle'), 'last')
  assert.equal(activeArticleHeading([], 0, 0), undefined)
})

test('shareable fragments resolve Unicode, literal percent-encoded legacy ids and malformed fragments', () => {
  const ids = ['前言', '%E5%89%8D%E8%A8%80', '100%完整']
  assert.equal(articleHeadingFromHash('#' + encodeURIComponent(ids[0]), ids), ids[0])
  assert.equal(articleHeadingFromHash('#' + encodeURIComponent(ids[1]), ids), ids[1])
  assert.equal(articleHeadingFromHash('#' + ids[1], [ids[1]]), ids[1])
  assert.equal(articleHeadingFromHash('#100%完整', ids), ids[2])
  assert.equal(articleHeadingFromHash('#does-not-exist', ids), undefined)
  assert.equal(articleHeadingFromHash('', ids), undefined)
})
