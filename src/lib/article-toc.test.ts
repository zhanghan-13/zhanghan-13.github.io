import { test } from 'node:test'
import assert from 'node:assert/strict'
import { activeArticleHeading, articleAnchorProtection, articleHeadingFromHash, articleReadingHash } from './article-toc.ts'

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

test('reading addresses follow the chapter while preserving top and non-article destinations', () => {
  const headings = [{ id: '前言', top: 350, offset: 120 }, { id: 'chapter', top: 920, offset: 120 }]
  assert.equal(articleReadingHash(headings, 0, 1600, '前言', ''), undefined)
  assert.equal(articleReadingHash(headings, 0, 1600, '前言', '#chapter'), '')
  assert.equal(articleReadingHash(headings, 0, 1600, '前言', '#main'), undefined)
  assert.equal(articleReadingHash(headings, 0, 1600, '前言', '#:~:text=example'), undefined)
  assert.equal(articleReadingHash(headings, 230, 1600, '前言', ''), '#' + encodeURIComponent('前言'))
  assert.equal(articleReadingHash(headings, 900, 1600, 'chapter', '#comments'), '#chapter')
  assert.equal(articleReadingHash(headings, 1480, 1600, 'chapter', '#comments'), undefined)
  assert.equal(articleReadingHash(headings, 1500, 1600, 'chapter', '#chapter'), undefined)
  assert.equal(articleReadingHash([], 900, 1600, undefined, ''), undefined)
})

test('reading addresses retain native deep-link compatibility with restored percent-encoded ids', () => {
  const id = '%E5%89%8D%E8%A8%80'
  const headings = [{ id, top: 350, offset: 120 }]
  const hash = articleReadingHash(headings, 400, 1600, id, '')!
  assert.equal(decodeURIComponent(hash.slice(1)), id)
  assert.equal(articleHeadingFromHash(hash, [id]), id)
})

test('comment deep links survive the larger comment scroll margin until scrolling back into the article', () => {
  const headings = [{ id: 'intro', top: 350, offset: 120 }, { id: 'chapter', top: 920, offset: 120 }]
  // Body ends at 1600; comments start after a 56px gap, with 108px root
  // padding and 120px comment margin. The native destination is 1428.
  assert.equal(articleReadingHash(headings, 1428, 1600, 'chapter', '#comments', 1428), undefined)
  assert.equal(articleReadingHash(headings, 1427.2, 1600, 'chapter', '#comments', 1428), undefined)
  assert.equal(articleReadingHash(headings, 1450, 1600, 'chapter', '#comments', 1428), undefined)
  assert.equal(articleReadingHash(headings, 1426, 1600, 'chapter', '#comments', 1428), '#chapter')

  // Mobile uses a 40px gap and 178px root padding. A short page can also
  // clamp the native comment destination to the maximum scroll position.
  const mobile = headings.map(heading => ({ ...heading, offset: 190 }))
  assert.equal(articleReadingHash(mobile, 1342, 1600, 'chapter', '#comments', 1342), undefined)
  assert.equal(articleReadingHash(mobile, 1360, 1600, 'chapter', '#comments', 1342), undefined)
  assert.equal(articleReadingHash(mobile, 1340, 1600, 'chapter', '#comments', 1342), '#chapter')
  assert.equal(articleReadingHash(headings, 1000, 1600, 'chapter', '#comments-title', 1000), undefined)
  assert.equal(articleReadingHash(headings, 998, 1600, 'chapter', '#comments-title', 1000), '#chapter')
})

test('comment protection retains an initially clamped destination after the widget increases page height', () => {
  const headings = [{ id: 'intro', top: 350, offset: 120 }, { id: 'chapter', top: 920, offset: 120 }]
  let protection = articleAnchorProtection(undefined, '#comments', 1000)
  protection = articleAnchorProtection(protection, '#comments', 1428)
  assert.equal(protection?.scrollY, 1000)
  assert.equal(articleReadingHash(headings, 1020, 1600, 'chapter', '#comments', protection?.scrollY), undefined)
  assert.equal(articleReadingHash(headings, 998, 1600, 'chapter', '#comments', protection?.scrollY), '#chapter')

  // A shrinking layout may lower the boundary, while explicit navigation starts
  // a fresh destination (including a repeated navigation to the same hash).
  protection = articleAnchorProtection(protection, '#comments', 950)
  assert.equal(protection?.scrollY, 950)
  assert.equal(articleAnchorProtection(protection, '#comments-title', 1500)?.scrollY, 1500)
  assert.equal(articleAnchorProtection(undefined, '#comments', 1428)?.scrollY, 1428)
  assert.equal(articleAnchorProtection(protection, '#chapter', undefined), undefined)
})
