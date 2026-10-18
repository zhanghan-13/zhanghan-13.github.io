---
id: "wakatimeru-he-geng-xin-zi-ji-de-api-key"
title: "WakaTime如何更新自己的API key"
date: "2024-03-12"
excerpt: "wakatime是一个流行的跟踪自己编码时间、文件、语言等的工具。如何配置跟踪是简单的，网上教程说的很明白，也基本是傻瓜式操作。 注册账号 获取API key 安装插件 输入API Key"
category: "教程"
tags: []
wordCount: 212
headings: []
imageOmitted: false
legacySlug: "wakatimeru-he-geng-xin-zi-ji-de-api-key"
sourceUrl: "https://www.bugdesigner.cn/archives/wakatimeru-he-geng-xin-zi-ji-de-api-key"
---

<article id="content"><p><span>wakatime是一个流行的跟踪自己编码时间、文件、语言等的工具。如何配置跟踪是简单的，网上教程说的很明白，也基本是傻瓜式操作。</span></p>
<div>
<div></div>
<div>
<div></div>
<div></div>
<div></div>
<div><span>注册账号</span></div>
<div><span>获取API key</span></div>
<div><span>安装插件</span></div>
<div><span>输入API Key</span></div>
</div>
<div></div>
</div>
<p><span>但是有个情况是初使用者容易困惑的，就是idea安装完插件以后，去其他开发工具如PyCharm安装完不提示自动输入APIkey了。如</span><span><a href="https://github.com/wakatime/jetbrains-wakatime/issues/60" target="_blank" rel="noopener noreferrer"><span>issue60</span></a></span><span>和</span><span><a href="https://github.com/wakatime/jetbrains-wakatime/issues/264" target="_blank" rel="noopener noreferrer"><span>issues264</span></a></span></p>
<p><span>这是因为 wakatime在配置完毕以后会在这个文件</span><span><code>~/.wakatime.cfg</code></span><span>中记录配置信息（~代表用户目录），以后很多IDE就直接从这个配置文件读取就不需要手动配置了，相当于一个公共的配置中心，我们修改API Key直接修改这个文件下的就可以了，更方便。</span></p>
</article>
