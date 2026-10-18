# ZhangHan

个人博客：**https://www.bugdesigner.cn**

Astro 静态页面 + React / shadcn/ui 交互组件，使用 GitHub Actions 自动发布到 GitHub Pages。无需自建服务器。保留已确认的个人介绍、卡片文章列表、按月写作统计、归档、关于页、左侧吸顶目录、图片预览、代码高亮和明暗主题。

## 本地运行

使用 Node.js 24（最低 22.22）：

```sh
npm ci
npm run dev
```

开发地址见终端输出，默认 http://localhost:4321。`npm test` 运行统计、字数和评论计数测试；`npm run build` 检查类型、生成静态网站，并验证内部链接、图片与历史代码内容。

## 写文章

```sh
npm run new-post -- my-article "文章标题"
```

在 `src/content/posts/my-article.md` 写 Markdown 正文。填写标题、上海日历日期、摘要、分类和标签；完成后把 `draft: true` 改为 `draft: false`。草稿不会出现在构建、搜索、RSS 或统计里。推送到 `main` 后，Actions 自动检查并发布。

```yaml
---
id: my-article
title: 文章标题
date: "2026-10-18"
excerpt: 文章摘要
category: 后端
tags: [Java, Redis]
draft: false
---
```

图片放在 `public/images/`，正文引用 `![图片说明](/images/example.png)`。代码块使用 Markdown 围栏并标注语言，如 `java`、`typescript` 或 `bash`。字数从全文自动计算，包含可见代码，中文汉字和英文/数字词各计一。目录按正文标题生成。所有本地图片支持点击预览。

`id` 同时决定 `/posts/<id>/` 地址及评论标识，请在发布后保持不变。不要提交密码、令牌等隐私数据；此仓库为公开网站源码。

## 评论

使用 Giscus，读者通过 GitHub 账号登录；评论保存在公开仓库 [zhanghan-13/blog-comments](https://github.com/zhanghan-13/blog-comments) 的 Announcements 分类。网站本身不保存访问者凭据，也无需服务器或 GitHub 密钥。

文章严格按 `post/<id>` 绑定讨论。GitHub App 仅安装在评论仓库。列表评论数通过公开 Discussions API 读取，包含回复并缓存五分钟；网络或限流失败显示 `—`，不会伪装成 0。

## 内容与维护

初始迁入 50 篇旧博客文章（2023-09-25 至 2025-02-14）、157 张正文图片、153 个代码块，历史 taxonomy 为 7 分类与 91 标签。历史正文保留清洗后的 HTML，放在 Markdown 文件中，`legacySlug` 标识原文迁移；不要给新 Markdown 文章添加该字段。

- `src/layouts/SiteLayout.astro`：网站框架、SEO 与导航。
- `src/components/ProfileIntro.tsx`：个人介绍、头像和社交链接。
- `src/index.css`：已确认设计样式与主题。
- `src/lib/giscus.ts`：评论仓库配置与真实计数。
- `.github/workflows/deploy.yml`：自动构建和部署。
- `scripts/migration-report.json`：首次迁移核对记录。

GitHub 仓库 Settings → Pages 的发布来源应为 GitHub Actions，自定义域名为 `www.bugdesigner.cn`，证书签发后开启 Enforce HTTPS。DNS 中 `www` 的 CNAME 指向 `zhanghan-13.github.io`。Actions 发布不依赖源码里的 CNAME 文件。每次发布的状态在 Actions 的 Deploy website 中查看，失败不会替换当前在线版本。

资料：[Astro GitHub Pages 部署](https://docs.astro.build/en/guides/deploy/github/)、[shadcn/ui](https://ui.shadcn.com)、[Giscus](https://giscus.app/zh-CN)。
