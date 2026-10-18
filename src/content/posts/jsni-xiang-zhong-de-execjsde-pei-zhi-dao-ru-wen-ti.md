---
id: "jsni-xiang-zhong-de-execjsde-pei-zhi-dao-ru-wen-ti"
title: "JS逆向中的execjs的配置导入问题"
date: "2023-11-28"
excerpt: "本文共503字 一定要先这样导入 from functools import partial  # 锁定参数\n<"
category: "爬虫"
tags: ["js逆向"]
wordCount: 170
headings: []
imageOmitted: false
legacySlug: "jsni-xiang-zhong-de-execjsde-pei-zhi-dao-ru-wen-ti"
sourceUrl: "https://www.bugdesigner.cn/archives/jsni-xiang-zhong-de-execjsde-pei-zhi-dao-ru-wen-ti"
---

<article id="content"><p><span>本文共503字</span></p>
<p><span>一定要先这样导入</span></p>
<pre><span><span>from</span> <span>functools</span> <span>import</span> <span>partial</span>  <span># 锁定参数</span></span>
<span><span>import</span> <span>subprocess</span></span>
<span><span>subprocess</span>.<span>Popen</span> <span>=</span> <span>partial</span>(<span>subprocess</span>.<span>Popen</span>, <span>encoding</span><span>=</span><span>"utf-8"</span>)</span>
<span>​</span>
<span><span>import</span> <span>execjs</span></span>
<span><span>import</span> <span>requests</span></span></pre>
<p><span>千万不要导入的很随意，比如</span></p>
<pre><span><span>import</span> <span>execjs</span></span>
<span><span># 固定格式，用于解决windows执行js文件输出汉字乱码问题</span></span>
<span><span>from</span> <span>functools</span> <span>import</span> <span>partial</span>  <span># 锁定参数</span></span>
<span><span>import</span> <span>subprocess</span></span>
<span><span>import</span> <span>requests</span></span>
<span>​</span>
<span><span>subprocess</span>.<span>Popen</span> <span>=</span> <span>partial</span>(<span>subprocess</span>.<span>Popen</span>, <span>encoding</span><span>=</span><span>"utf-8"</span>)</span></pre>
<p><span>我以为先导入完不用管顺序，结果一定是先把subprocess和functools导入，再导入execjs，不然一直报错如下，什么编码问题，文件执行问题，实际上就是上面这个控制台适配没配置上！！！</span></p>
<p><span>UnicodeDecodeError: 'gbk' codec can't decode byte 0xab in position 139: illegal multibyte sequence</span></p>
</article>
