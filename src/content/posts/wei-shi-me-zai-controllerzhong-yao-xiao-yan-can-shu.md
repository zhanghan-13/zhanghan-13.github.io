---
id: "wei-shi-me-zai-controllerzhong-yao-xiao-yan-can-shu"
title: "为什么在Controller中要校验参数"
date: "2024-05-10"
excerpt: "最近使用openfeign做了一些远程调用，有一些自己的思考。 最近使用openfeign做了一些远程调用，有一些自己的思考。 微服务项目中常常需要远程调用其他的微服务，这个时候其他的微服务校验参数可能会比较麻烦，并且返回的状态往往也不太好记录（很多时候只想拿个数据，再封装一个Result返回类取的"
category: "后端"
tags: []
wordCount: 203
headings: []
imageOmitted: false
legacySlug: "wei-shi-me-zai-controllerzhong-yao-xiao-yan-can-shu"
sourceUrl: "https://www.bugdesigner.cn/archives/wei-shi-me-zai-controllerzhong-yao-xiao-yan-can-shu"
---

<article id="content"><p>最近使用openfeign做了一些远程调用，有一些自己的思考。     </p>
<p>最近使用openfeign做了一些远程调用，有一些自己的思考。<br>
微服务项目中常常需要远程调用其他的微服务，这个时候其他的微服务校验参数可能会比较麻烦，并且返回的状态往往也不太好记录（很多时候只想拿个数据，再封装一个Result返回类取的话比较麻烦），这个时候直接controller校验即可。</p>
<blockquote>
<p>信息少了：微服务调用失败就返回一个特定的数据，比如操作返回false、获取数据返回空数组，但是这个时候远程的微服务为什么失败可能前端不太好取，有失也有得吧。</p>
</blockquote>
</article>
