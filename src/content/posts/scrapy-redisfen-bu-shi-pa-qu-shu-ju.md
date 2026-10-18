---
id: "scrapy-redisfen-bu-shi-pa-qu-shu-ju"
title: "Scrapy-redis分布式爬取数据"
date: "2023-10-30"
excerpt: "本文共1257个字 导包 scrapy是使用redis这个数据库实现分布式的，因此我们刚开始要安装这个scrapy-redis包。pip install scrapy-redis。 创建项目"
category: ""
tags: ["scrapy","爬虫"]
wordCount: 577
headings: [{"level":2,"id":"heading-1","text":"导包"},{"level":2,"id":"heading-2","text":"创建项目"},{"level":2,"id":"heading-3","text":"配置settings文件"},{"level":2,"id":"heading-4","text":"spider配置"},{"level":2,"id":"heading-5","text":"可能存在的问题"}]
imageOmitted: false
legacySlug: "scrapy-redisfen-bu-shi-pa-qu-shu-ju"
sourceUrl: "https://www.bugdesigner.cn/archives/scrapy-redisfen-bu-shi-pa-qu-shu-ju"
---

<article id="content"><p><span>本文共1257个字</span></p>
<h2 id="heading-1"><span>导包</span></h2>
<p><span>scrapy是使用redis这个数据库实现分布式的，因此我们刚开始要安装这个scrapy-redis包。</span><span><code>pip install scrapy-redis</code></span><span>。</span></p>
<h2 id="heading-2"><span>创建项目</span></h2>
<p><span>创建项目：</span><span><code>scrapy startproject base_scrapy_plus</code></span><span>（⚠️这个项目名不能包含中文，不然会报错）</span></p>
<p><span>移动到命令执行目录：</span><span><code>cd base_scrapy_plus</code></span></p>
<p><span>生成爬虫：scrapy genspider </span><span><strong><span>-t crawl</span></strong></span><span> blogspider bugdesigner.cn</span></p>
<h2 id="heading-3"><span>配置settings文件</span></h2>
<p><span>一共需要配置的地方有三个</span></p>
<p><span><strong><span>配置队列：</span></strong></span></p>
<pre><span><span>'scrapy_redis.pipelines.RedisPipeline'</span>: <span>800</span>     <span>#开启管道，优先级给高一点</span></span></pre>
<p><span><img src="/images/3984da81e9c91e72e44d.png" alt="image-20231030180745905" width="1162" height="621" loading="lazy" decoding="async"></span></p>
<p><span><strong><span>配置分布式</span></strong></span></p>
<pre><span><span>DUPEFILTER_CLASS</span> <span>=</span> <span>"scrapy_redis.dupefilter.RFPDupeFilter"</span>  <span>#去重</span></span>
<span><span>SCHEDULER</span> <span>=</span> <span>"scrapy_redis.scheduler.Scheduler"</span>  <span>#开启调度器</span></span>
<span><span>SCHEDULER_PERSIST</span> <span>=</span> <span>True</span>    <span>#做持久化</span></span></pre>
<p><span><strong><span>配置Redis数据库信息</span></strong></span></p>
<pre><span><span>REDIS_HOST</span> <span>=</span> <span>"192.168.182.100"</span>  <span>#远程redis主机地址</span></span>
<span><span>REDIS_PORT</span> <span>=</span> <span>6380</span>   <span>#端口</span></span>
<span><span>REDIS_PARAMS</span> <span>=</span> {<span>'password'</span>: <span>'123456'</span>}  <span>#redis的配置参数，这里是配置密码</span></span></pre>
<h2 id="heading-4"><span>spider配置</span></h2>
<p><span>spider里面需要做的工作有两个</span></p>
<p><span>1：</span><span><strong><span>指定redis中list的key</span></strong></span><span>。redis_key = 'blogQuene' 这样使用lpush blogQuene "</span><span><a href="/">https://www.bugdesigner.cn</a></span><span>"就可以启动分布式爬取了</span></p>
<p><span>2：</span><span><strong><span>继承RedisCrawlSpider这个类</span></strong></span><span>，这个类导入命令为</span><span><code>from scrapy_redis.spiders import RedisCrawlSpider</code></span></p>
<p><span>❗parse方法不要再实现了，如果spider里面自己实现会重写继承的这个类里面的parse</span></p>
<p><span>剩下的就跟正常的CrawlSpider全站爬取一样了。scrapy-redis支持增量爬取，如果有其他的url，使用lpush命令添加即可。不会配置redis的，请移步我的这篇文章</span><span><a href="/posts/redisming-ling-ti-shi-bu-xian-shi-de-jie-jue-fang-an/"><span>Redis命令提示不显示的解决方案 </span></a></span><span>。如果有多台机器，都连接上统一的redis数据库就可以实现分布式爬取了。</span></p>
<p><span>启动项目以后，正常的话是这样，爬取完毕以后等待下一个url进来然后处理</span></p>
<p><span><img src="/images/b23fcb6ae288152a1db9.png" alt="image-20231030184651322" width="2783" height="563" loading="lazy" decoding="async"></span></p>
<h2 id="heading-5"><span>可能存在的问题</span></h2>
<p><span>1： TypeError: ExecutionEngine.crawl() got an unexpected keyword argument 'spider'</span></p>
<p><span>这个问题是由于先进行的爬取，再往list里面添加url。启动顺序应该是先往redis里面的blogQuene队列里面填值 ，再使用</span><span><code>scrapy crawl blogspider</code></span><span>启动爬虫</span></p>
<p><span>这个问题网上很多人和GPT说是版本不兼容，实际上完全不是版本问题......，我猜想是因为list里面没有数据，所以读取的时候会报错。</span></p>
<p><span>需要博客项目分布式全站抓取演示源码移步</span><span><a href="https://github.com/AZCodingAccount/python-spider/tree/main/%E7%AC%AC5%E7%AB%A0-selenium%E5%92%8CScrapy/base_scrapy_plus" target="_blank" rel="noopener noreferrer"><span>Github源码地址</span></a></span></p>
</article>
