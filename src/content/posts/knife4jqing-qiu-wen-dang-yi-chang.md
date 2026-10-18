---
id: "knife4jqing-qiu-wen-dang-yi-chang"
title: "Knife4j请求文档异常"
date: "2024-04-26"
excerpt: "首先说结论，现在knife4j封装的很好，不写任何配置和配置类都可以访问到，也不需要引入swagger和springdoc（knife4j引入，maven会传递），请求文档异常一般是路径和版本问题。我这里遇到的版本问题，版本问题永远是非常严重的问题 springboot版本3.2.5 对应knife"
category: ""
tags: []
wordCount: 190
headings: []
imageOmitted: false
legacySlug: "knife4jqing-qiu-wen-dang-yi-chang"
sourceUrl: "https://www.bugdesigner.cn/archives/knife4jqing-qiu-wen-dang-yi-chang"
---

<article id="content"><p>首先说结论，现在knife4j封装的很好，不写任何配置和配置类都可以访问到，也不需要引入swagger和springdoc（knife4j引入，maven会传递），请求文档异常一般是路径和版本问题。我这里遇到的版本问题，版本问题永远是非常严重的问题</p>
<p>springboot版本3.2.5 对应knife4j4.1.0没问题，4.3.0没有token</p>
<pre><code>&lt;parent&gt;
    &lt;groupId&gt;org.springframework.boot&lt;/groupId&gt;
    &lt;artifactId&gt;spring-boot-starter-parent&lt;/artifactId&gt;
    &lt;version&gt;3.2.5&lt;/version&gt;
    &lt;relativePath/&gt; &lt;!-- lookup parent from repository --&gt;
&lt;/parent&gt;
</code></pre>
<p>引入这一个依赖就可以</p>
<pre><code>&lt;!--        knife4j-jakarta--&gt;
&lt;dependency&gt;
    &lt;groupId&gt;com.github.xiaoymin&lt;/groupId&gt;
    &lt;artifactId&gt;knife4j-openapi3-jakarta-spring-boot-starter&lt;/artifactId&gt;
    &lt;version&gt;4.1.0&lt;/version&gt;
&lt;/dependency&gt;
</code></pre>
<p>注意springboot2和springboot3需要引入的依赖是不一样的，参考官网</p>
<p><a href="https://doc.xiaominfo.com/docs/upgrading/upgrading-to-v4" target="_blank" rel="noopener noreferrer">https://doc.xiaominfo.com/docs/upgrading/upgrading-to-v4</a></p>
</article>
