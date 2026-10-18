import hljs from 'highlight.js/lib/core'
import bash from 'highlight.js/lib/languages/bash'
import css from 'highlight.js/lib/languages/css'
import dockerfile from 'highlight.js/lib/languages/dockerfile'
import ini from 'highlight.js/lib/languages/ini'
import java from 'highlight.js/lib/languages/java'
import javascript from 'highlight.js/lib/languages/javascript'
import json from 'highlight.js/lib/languages/json'
import nginx from 'highlight.js/lib/languages/nginx'
import properties from 'highlight.js/lib/languages/properties'
import python from 'highlight.js/lib/languages/python'
import sql from 'highlight.js/lib/languages/sql'
import typescript from 'highlight.js/lib/languages/typescript'
import xml from 'highlight.js/lib/languages/xml'
import yaml from 'highlight.js/lib/languages/yaml'

const languages = { bash, css, dockerfile, ini, java, javascript, json, nginx, properties, python, sql, typescript, xml, yaml }
for (const [name, grammar] of Object.entries(languages)) hljs.registerLanguage(name, grammar)
hljs.registerAliases(['vue', 'html'], { languageName: 'xml' })
hljs.registerAliases(['shell', 'sh', 'console'], { languageName: 'bash' })

const highlighted = new WeakMap<HTMLElement, string>()
const noHighlight = /\b(?:no-highlight|nohighlight|language-(?:text|txt|plaintext|none))\b/i

function languageHint(code: HTMLElement, pre: HTMLElement, source: string) {
  const marker = `${code.className} ${pre.className}`.match(/\b(?:language|lang)-([\w+-]+)/i)?.[1]?.toLowerCase()
  if (marker) return hljs.getLanguage(marker) ? marker : null

  // Restored articles lost their language classes. Recognize unambiguous formats
  // before using the deliberately limited language set for the remaining code.
  if (/^\s*(?:(?:public|private|protected)\s+(?:static\s+)?(?:class|interface|void|int|long|boolean|String)\b|static\s+class\b)/m.test(source)) return 'java'
  if (/^\s*(?:async\s+)?def\s+\w+\s*\(/m.test(source)) return 'python'
  if (/^\s*(?:<\?xml|<!--|<[\w-]+(?:\s|>))/m.test(source)) return 'xml'
  if (/^\s*(?:sudo\s+|(?:docker(?:-compose)?|git|npm|pnpm|yarn|scrcpy|yum|apt(?:-get)?)\s)/m.test(source)) return 'bash'
  if (/^\s*(?:graph|flowchart|sequenceDiagram)\b/.test(source)) return null
  if (/^\s*\p{Script=Han}/u.test(source) && (source.match(/\p{Script=Han}/gu)?.length ?? 0) > source.length / 2) return null
  return undefined
}

/** Enhance only block code; inline code and the original text remain untouched. */
export function highlightArticleCode(root: HTMLElement) {
  for (const pre of root.querySelectorAll<HTMLElement>('pre')) {
    let code = pre.querySelector<HTMLElement>(':scope > code')
    if (!code) {
      // Some recovered WordPress blocks contain spans directly under <pre>.
      code = root.ownerDocument.createElement('code')
      code.textContent = pre.textContent
      pre.replaceChildren(code)
    }

    const source = code.textContent ?? ''
    if (highlighted.get(code) === source) continue
    const marker = `${code.className} ${pre.className}`
    const language = languageHint(code, pre, source)
    delete code.dataset.language

    if (noHighlight.test(marker) || language === null || !source.trim()) {
      code.textContent = source
    } else {
      // highlight() escapes the input. Never feed restored HTML to the parser.
      const result = language
        ? hljs.highlight(source, { language, ignoreIllegals: true })
        : hljs.highlightAuto(source, Object.keys(languages))
      code.innerHTML = result.value
      if (result.language) code.dataset.language = result.language
    }

    code.classList.add('hljs')
    code.dataset.highlighted = 'yes'
    pre.tabIndex = 0
    pre.setAttribute('aria-label', '代码块')
    highlighted.set(code, source)
  }
}
