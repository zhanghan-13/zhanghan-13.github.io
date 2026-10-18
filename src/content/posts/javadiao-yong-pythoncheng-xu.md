---
id: "javadiao-yong-pythoncheng-xu"
title: "Java调用python程序"
date: "2024-05-14"
excerpt: "我的程序要使用python爬虫来爬取大学教务在线的数据，当然Java也有，但是碍于学习成本还是使用Python爬比较好。 关于爬取但是现在有两种解决方案， 一种是python爬到数据由程序自己写入到指定的数据库 另一种是通过某种方式把python爬到的数据传递给java，由java程序写入到数据库"
category: ""
tags: []
wordCount: 336
headings: []
imageOmitted: false
legacySlug: "javadiao-yong-pythoncheng-xu"
sourceUrl: "https://www.bugdesigner.cn/archives/javadiao-yong-pythoncheng-xu"
---

<article id="content"><p>我的程序要使用python爬虫来爬取大学教务在线的数据，当然Java也有，但是碍于学习成本还是使用Python爬比较好。</p>
<p>关于爬取但是现在有两种解决方案，</p>
<ol>
<li>一种是python爬到数据由程序自己写入到指定的数据库</li>
<li>另一种是通过某种方式把python爬到的数据传递给java，由java程序写入到数据库</li>
</ol>
<p>关于java调用python也有几种解决方案</p>
<ol>
<li>最简单的方式就是通过HTTP接口调用，搭建一个flask应用程序暴露一个接口，java发送http请求即可调用</li>
<li>通过RPC框架，但是要支持python和java通信的</li>
<li>使用Java中的Runtime.exec直接调用</li>
</ol>
<p>这里我的解决方案是选择<code>1+1</code>的方式，理由如下：</p>
<p><strong>写入数据库方面</strong></p>
<p>在我的应用中对数据库的AC（访问控制）并不是特别高，python直接写就可以了，传递过来性能会受影响且程序复杂了。</p>
<p><strong>调用方面</strong></p>
<ul>
<li>RPC框架我没用过支持这两种互相通信的，并且还要接入微服务体系</li>
<li>Java这个调用我感觉不太稳，你要说哪里不太稳，我也说不出来.....</li>
<li>简单来说，我就是想用HTTP多一点?。</li>
</ul>
</article>
