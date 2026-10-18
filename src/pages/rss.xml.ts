import rss from '@astrojs/rss'
import { getPostSummaries, postUrl } from '@/lib/posts'
export async function GET() {
  return rss({
    title: 'ZhangHan', description: 'ZhangHan 的个人博客', site: 'https://zhanghan-13.github.io',
    items: (await getPostSummaries()).map(post => ({ title: post.title, pubDate: new Date(`${post.date}T00:00:00+08:00`), description: post.excerpt, link: postUrl(post.id) })),
    customData: '<language>zh-cn</language>',
  })
}
