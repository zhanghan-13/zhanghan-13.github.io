import { writeFile, mkdir } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const [id, ...titleParts] = process.argv.slice(2)
if (!id || !/^[a-z0-9][a-z0-9-]*$/.test(id) || !titleParts.length) {
  console.error('用法：npm run new-post -- my-article "文章标题"\n文章 ID 使用小写字母、数字和连字符。')
  process.exit(1)
}
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const date = new Intl.DateTimeFormat('sv-SE', { timeZone: 'Asia/Shanghai' }).format(new Date())
const filename = path.join(root, 'src/content/posts', `${id}.md`)
await mkdir(path.dirname(filename), { recursive: true })
const content = `---\nid: ${JSON.stringify(id)}\ntitle: ${JSON.stringify(titleParts.join(' '))}\ndate: "${date}"\nexcerpt: ""\ncategory: ""\ntags: []\ndraft: true\n---\n\n`
try {
  await writeFile(filename, content, { flag: 'wx' })
  console.log(`已创建草稿：src/content/posts/${id}.md\n完成后填写摘要、分类、标签，并将 draft 改为 false。`)
} catch (error) {
  if (error.code === 'EEXIST') { console.error(`文章 ID 已存在：${id}，未覆盖原文件。`); process.exit(1) }
  throw error
}
