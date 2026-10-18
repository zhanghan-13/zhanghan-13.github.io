---
id: "ru-he-bi-mian-mian-xiang-jian-yu-bian-cheng-pa-chong-zhen-de-wei-fa-ma"
title: "如何避免面向监狱编程，爬虫真的违法吗"
date: "2024-01-18"
excerpt: "爬虫写得好，牢饭吃到饱。 首先大家看到的案例几乎是个例，可以说就算你违法，只要企业不起诉你，还是有很大概率不抓你的，（一般来说这个东西一种程度也是互利共赢的，你爬数据也是变相给对方的数据变的好看了一点）但是天网恢恢，疏而不漏啊。 国内是比较偏向企业的，无论是劳动仲裁，打官司这些的，爬虫也是这样，一般"
category: "教程"
tags: []
wordCount: 853
headings: [{"level":2,"id":"heading-1","text":"爬取什么违法"},{"level":2,"id":"heading-2","text":"案例分享"},{"level":2,"id":"heading-3","text":"常见QA"},{"level":2,"id":"heading-4","text":"建议"},{"level":2,"id":"heading-5","text":"参考文章"}]
imageOmitted: false
legacySlug: "ru-he-bi-mian-mian-xiang-jian-yu-bian-cheng-pa-chong-zhen-de-wei-fa-ma"
sourceUrl: "https://www.bugdesigner.cn/archives/ru-he-bi-mian-mian-xiang-jian-yu-bian-cheng-pa-chong-zhen-de-wei-fa-ma"
---

<article id="content"><p><span>爬虫写得好，牢饭吃到饱。</span></p>
<p><span>首先大家看到的案例几乎是个例，可以说就算你违法，只要企业不起诉你，还是有很大概率不抓你的，（一般来说这个东西一种程度也是互利共赢的，你爬数据也是变相给对方的数据变的好看了一点）但是</span><span><strong><span>天网恢恢，疏而不漏</span></strong></span><span>啊。</span></p>
<p><span>国内是比较偏向企业的，无论是劳动仲裁，打官司这些的，爬虫也是这样，一般我们搞爬虫的别人想搞我们我们几乎是赢不了</span></p>
<h2 id="heading-1"><span>爬取什么违法</span></h2>
<ol>
<li>
<p><span>爬取用户个人隐私信息（手机号、身份证号、家庭住址），还倒卖。—</span><span><strong><span>侵犯公民个人隐私权</span></strong></span></p>
</li>
<li>
<p><span>通过一些手段爬到别人数据库里面的数据（不是公开的）—</span><span><strong><span>非法入侵计算机系统</span></strong></span></p>
</li>
<li>
<p><span>疯狂爬小网站数据，把别人服务器爬崩了，我们给的阈值一般是服务器负载的1/3。—</span><span><strong><span>破坏计算机信息系统</span></strong></span></p>
</li>
<li>
<p><span>大量爬取别人的数据，提供给这个行业目标网站的竞争者。—</span><span><strong><span>不正当竞争</span></strong></span></p>
</li>
<li>
<p><span>Robots.txt协议。防君子不防小人，基本上没几个大网站在这里面写让你爬东西的，本来都不是声明能不能爬，只是为了方便搜索引擎抓取。—但是业界规则，法官有时候会参考这个</span></p>
</li>
</ol>
<h2 id="heading-2"><span>案例分享</span></h2>
<p><span>推荐最高检网站检索爬虫：</span><span><a href="https://www.spp.gov.cn/guestweb/s?siteCode=N000005434&amp;searchWord=%E7%88%AC%E8%99%AB" target="_blank" rel="noopener noreferrer"><span>最高人民检察院 (spp.gov.cn)</span></a></span></p>
<ul>
<li>
<p><span>Linkin案例 </span><span><a href="https://www.infoq.cn/article/fqjnb4jhf58md8drxlwx" target="_blank" rel="noopener noreferrer"><span>五年官司终败诉：爬取领英数据“完全合法”，万亿爬虫大军蠢蠢欲动</span><span><em><span>语言 &amp; 开发</span></em></span><span>Tina_InfoQ精选文章</span></a></span></p>
</li>
<li>
<p><span>国内案例合集：</span><span><a href="https://github.com/HiddenStrawberry/Crawler_Illegal_Cases_In_China" target="_blank" rel="noopener noreferrer"><span>本项目用来整理所有中国大陆爬虫开发者涉诉与违规相关的新闻、资料与法律法规。</span></a></span></p>
</li>
</ul>
<h2 id="heading-3"><span>常见QA</span></h2>
<ol>
<li>
<p><span>Q：伪造UA，换ip，过验证码，逆向算法这些违法吗？</span></p>
<p><span>A：一般认为是不违法的（最高检那个文章说网络公开数据都可以爬，没说绕过会违法），但是需要看你拿这些数据或者这个脚本做了什么。</span></p>
</li>
<li>
<p><span>Q：爬取国外的网站违法吗？</span></p>
<p><span>A：国外的网站国家不管。还有一些黑产灰产，他们也不会起诉我们，但是不要太嚣张</span></p>
</li>
</ol>
<h2 id="heading-4"><span>建议</span></h2>
<ul>
<li>
<p><span>不要给明显是灰产和黑产的人写一些程序，他们什么时候进去，你到时候也会受牵连—</span><span><strong><span>提供侵入、非法控制计算机信息系统程序、工具罪</span></strong></span></p>
</li>
<li>
<p><span>对于盈利。需要安全的话接一些数据采集的单子就可以了，我们接单正常2k以下就可以。2k-1w就慎重了，尽量不要接几w，几十个w的单子</span></p>
</li>
<li>
<p><span>写自动化脚本的时候要注意不要动那些平台的最核心的业务。（拿王者荣耀举例，开挂跟写个自动点赞的脚本官方的力度肯定是不一样的）</span></p>
</li>
</ul>
<h2 id="heading-5"><span>参考文章</span></h2>
<p><span><a href="https://www.spp.gov.cn/spp/llyj/202202/t20220215_544538.shtml" target="_blank" rel="noopener noreferrer"><span>明确越界网络爬虫行为的刑事处罚边界_中华人民共和国最高人民检察院 (spp.gov.cn)</span></a></span></p>
<p><span><a href="https://www.spp.gov.cn/zdgz/202111/t20211101_534081.shtml" target="_blank" rel="noopener noreferrer"><span>网络爬虫无处不在，侵权边界在哪_中华人民共和国最高人民检察院 (spp.gov.cn)</span></a></span></p>
<p><span><a href="https://zhuanlan.zhihu.com/p/88993118" target="_blank" rel="noopener noreferrer"><span>爬虫到底违法吗？你离违法还有多远？ - 知乎 (zhihu.com)</span></a></span></p>
</article>
