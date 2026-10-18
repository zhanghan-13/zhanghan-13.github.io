import { test } from 'node:test'
import assert from 'node:assert/strict'
import { countWords, getPostBodyHtml } from './post-metrics.ts'

test('counts Han characters, words and numbers while decoding HTML entities', () => {
  assert.equal(countWords('<p>你好，world! 2026</p><p>don&apos;t café e&#x301;lan</p>'), 7)
  assert.equal(countWords('<p>&#x4F60;&#22909;&nbsp;Astro</p>'), 3)
  assert.equal(countWords('<p>👋 ✨ &amp; &lt; &gt;</p>'), 0)
})

test('block elements separate words while inline formatting preserves one word', () => {
  assert.equal(countWords('alpha<div>beta</div>gamma<h5>delta</h5>epsilon<br>zeta<hr>eta'), 7)
  assert.equal(countWords('<table><tr><td>one</td><td>two</td></tr></table><h6>three</h6>'), 3)
  assert.equal(countWords('<p>Type<strong>Script</strong> plain<em>text</em></p>'), 2)
})

test('includes code text but excludes HTML attributes and non-rendered content', () => {
  const html = '<script>ignored script</script><style>ignored style</style><template>ignored template</template><p hidden>ignored hidden</p><!-- ignored comment --><img src="/image-name.png" alt="image description"><pre><code>const value = &quot;中文&quot;; // 123</code></pre>'
  assert.equal(countWords(html), 5)
  assert.equal(countWords('<pre><code>&lt;script&gt;alert(1)&lt;/script&gt;</code></pre>'), 4)
})

test('legacy HTML remains raw HTML and does not take a Markdown renderer result', () => {
  const body = '<p>历史正文</p><pre><code>const value = 1;</code></pre>'
  const post = { id: 'legacy-post', data: { legacySlug: 'legacy-post', wordCount: 999 }, body, rendered: { html: '<p>different rendered output</p>' } }
  assert.equal(getPostBodyHtml(post), body)
  assert.equal(countWords(getPostBodyHtml(post)), 7)
})

test('ordinary Markdown uses rendered visible text instead of syntax, URLs, image alt, or stored counts', () => {
  const post = {
    id: 'new-markdown', data: { wordCount: 999 },
    body: '# 新文章\n\n[Astro 文档](https://docs.astro.build/en/guides/content-collections/)\n\n![截图](https://example.com/image.png)\n\n```js\nconst value = 1;\n```',
    rendered: { html: '<h1>新文章</h1><p><a href="https://docs.astro.build/en/guides/content-collections/">Astro 文档</a></p><p><img src="https://example.com/image.png" alt="截图"></p><pre><code class="language-js">const value = 1;</code></pre>' },
  }
  assert.equal(getPostBodyHtml(post), post.rendered.html)
  assert.equal(countWords(getPostBodyHtml(post)), 9)
})

test('empty articles count zero and missing HTML fails rather than silently counting Markdown source', () => {
  assert.equal(countWords(getPostBodyHtml({ data: {}, body: '', rendered: { html: '' } })), 0)
  assert.throws(() => getPostBodyHtml({ id: 'unrendered', data: {}, body: '[Link](https://example.com)' }), /Article HTML is unavailable for unrendered/)
  assert.throws(() => getPostBodyHtml({ id: 'missing-legacy', data: { legacySlug: 'old' }, rendered: { html: '' } }), /Article HTML is unavailable/)
})
