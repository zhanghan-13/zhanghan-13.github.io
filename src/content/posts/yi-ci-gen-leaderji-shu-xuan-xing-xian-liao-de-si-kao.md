---
id: "yi-ci-gen-leaderji-shu-xuan-xing-xian-liao-de-si-kao"
title: "一次跟leader技术选型闲聊的思考"
date: "2024-09-20"
excerpt: "前言 以前都是自己做一些玩具项目，技术选型肯定没有考虑那么多，学习阶段往往是要学什么技术，因此用什么技术，在专门为了准备面试的时候可能会去细心雕模一下这个项目，但是没有实际的工程背景，可能大多数也是平地建高楼。在实际的工程阶段，我也好奇项目的负责人是从什么维度进行技术选型的，正好之前在吃饭时候跟我l"
category: "随笔"
tags: ["前端","后端","实际工程","技术选型"]
wordCount: 1695
headings: [{"level":2,"id":"%E5%89%8D%E8%A8%80","text":"前言"},{"level":2,"id":"%E6%8A%80%E6%9C%AF%E5%88%97%E8%A1%A8","text":"技术列表"},{"level":2,"id":"%E9%80%89%E5%9E%8B%E6%80%9D%E6%83%B3","text":"选型思想"},{"level":3,"id":"%E5%89%8D%E7%AB%AF","text":"前端"},{"level":3,"id":"%E5%90%8E%E7%AB%AF","text":"后端"},{"level":2,"id":"%E6%80%BB%E7%BB%93","text":"总结"}]
imageOmitted: false
legacySlug: "yi-ci-gen-leaderji-shu-xuan-xing-xian-liao-de-si-kao"
sourceUrl: "https://www.bugdesigner.cn/archives/yi-ci-gen-leaderji-shu-xuan-xing-xian-liao-de-si-kao"
---

<article id="content"><h2 id="%E5%89%8D%E8%A8%80">前言</h2>
<p>​       以前都是自己做一些玩具项目，技术选型肯定没有考虑那么多，学习阶段往往是要<strong>学什么技术</strong>，因此<strong>用什么技术</strong>，在专门为了准备面试的时候可能会去细心雕模一下这个项目，但是没有实际的工程背景，可能大多数也是平地建高楼。在实际的工程阶段，我也好奇项目的负责人是<strong>从什么维度进行技术选型的</strong>，正好之前在吃饭时候跟我leader聊到了这个话题，因此写篇博客记录一下。</p>
<h2 id="%E6%8A%80%E6%9C%AF%E5%88%97%E8%A1%A8">技术列表</h2>
<p>​       首先说一下我们这个项目的技术选型吧。因为我们主要做的是一个业务中台的系统（B/S架构），简单理解就是一个网站，因此选用的技术就是我们日常会学习到的一些技术。</p>
<p>前端：</p>
<ul><li><p>微前端框架qiankun：<a href="https://qiankun.umijs.org/zh/guide" target="_blank" rel="noopener noreferrer">介绍 - qiankun (umijs.org)</a></p>
</li><li><p>公司自研框架：基于vue的封装，类似于umi？</p>
</li><li><p>公司内部组件库</p>
</li><li><p>公司内部打包工具：基于webpack的封装</p>
</li></ul>
<p>后端：</p>
<ol><li><p>语言：python</p>
</li><li><p>框架：flask</p>
</li><li><p>ORM：peewee</p>
</li><li><p>流程引擎：airflow</p>
</li><li><p>数据库：mysql</p>
</li><li><p>消息队列：kafaka</p>
</li><li><p>RPC：grpc</p>
</li></ol>
<p>其他：</p>
<p>CI/CD：这个忘记了没有深究怎么实现的，流程就是docker打一个镜像然后去内部发布平台发布</p>
<p>外部接口：企微、openai、其他外部系统接口</p>
<p>还有就是其他的nginx网关，基本都用这个，就不再赘述了</p>
<h2 id="%E9%80%89%E5%9E%8B%E6%80%9D%E6%83%B3">选型思想</h2>
<h3 id="%E5%89%8D%E7%AB%AF">前端</h3>
<ol><li><p>为什么使用微前端框架</p>
<p>​        当时因为刚进公司不久，真的对这个微前端框架和公司自研的那个非常不熟悉，配置都不知道在哪配，就问了句为什么不使用vue呢？直接纯vue多好，还要用这个微前端框架，我leader给出我的答复是我们因为要兼容老平台，新老平台迁移的时候要把老平台作为一个服务，点击tab栏可以切换，说实话没太懂，兼容的话设置一个超链接跳转过去也可以啊。我的思考点是如果<strong>设置一个超链接跳转就意味着分开部署，肯定没有作为某个服务好部署并且在逻辑上也说的通</strong></p>
</li><li><p>组件库、打包工具的选择</p>
<p>​        又问了下为啥用公司这个组件库，我还以为是规范统一要求的，结果我leader说了句我当时就知道公司有这个就用了（剧本不是这个！！），其实我们也可以用外部的比如element-plus、ant design、arco design这种，哈哈，小知识get，居然可以用<strong>友商开源的组件库</strong>。打包工具这个没仔细问，但是我是真的<strong>webpack一生黑</strong>，每次ci一下都得好久，看博客说因为webpack稳定，但是<strong>让我选我肯定选vite</strong>。</p>
</li></ol>
<h3 id="%E5%90%8E%E7%AB%AF">后端</h3>
<ol><li><p>语言和框架</p>
<p>​        为啥用python语言这个也让我很纠结，因为公司主力是Java，再加上我主要方向还是Java对这个也有一定的好感度。后来leader给出的解释是因为我们这个不会涉及到复杂的业务逻辑，<strong>使用python可以增加开发效率，Java的话开发效率有点慢（我觉着用mp写CRUD也挺快的啊）</strong>，框架就没问，但是一共就两个，第一个Django、第二个Flask，<strong>选用flask应该是更轻量的原因吧</strong>。</p>
</li><li><p>ORM框架和MySQL</p>
<p>​        这个peewee是全自动ORM框架，类似于mp，这个当时聊到说我leader去看了github的issues区看到<strong>peewee的作者坚持不给这个框架加上自动校验参数类型这个功能，因为作者是老古董坚持认为需要类型就不要写python哈哈，啥时候我能对技术有这么高的执念，真的很喜欢这种geek范</strong>。</p>
<p>​        还有一次聊天时候因为我看到提交历史我leader怎么之前<strong>周六周日天天commit</strong>，我就问了句都不休息的吗哈哈，然后聊到因为我们这个项目新开的时候当时有时间限制，如果在指定日期之前没有搭建出新项目框架就只能去维护老平台的Go的代码了（确实维护老平台跟开一个新项目开发体验不是一个量级的~），然后我leader周六周日在家commit，时间紧任务重这个ORM框架就没有太深入调研，<strong>准备开新项目时候把这个换掉</strong>。</p>
<p>        MySQL就不用说了，使用率接近100%，其实公司也有一些自研的数据库，这里为了脱敏就不过多阐述了</p>
</li><li><p>airflow、kafka和gRPC</p>
<p>​        airflow就是一个流程编排引擎嘛，最近写一个需求的时候才用到，但是中台系统应该都会用到这种技术，以前在组件库天天看到有这个流程，当时还好奇这玩意儿的应用场景，今天我就看到了，选择的原因就是apache 顶级项目知名度高有保障。（我猜的）</p>
<p>​        kafka是处理平台大数据量的消息队列，跟这个场景完美契合了只能说。</p>
<p>​        grpc是远程调一些外部系统的接口的，那些外部系统是用Go写的，当然有些其他RPC也能调，但是我一个没用过Go的都知道这个RPC，知名度应该是稳稳的</p>
<p>还有其他的比如clickhouse自己不太了解这里我就不班门弄斧了</p>
</li></ol>
<h2 id="%E6%80%BB%E7%BB%93">总结</h2>
<p>​       当然一次聊天肯定不能囊括所有项目，技术选型要考虑的因素也不止上面说的，还有成本、可维护性、合规性等等等等    </p>
<p>​       最后发现其实之前在B站学习的技术是完完全全可以应用在实际的工程项目中的，但是你涉猎的内容需要足够的广泛，比如虽然我主要是Java，但是我前端Vue和React都写，Python平时也写一些爬虫，常见的中间件也是有了解的。在公司里面<strong>往往是先有这个场景，然后应用技术去解决这个问题</strong>，其实越写到后面越可以发现，语言，框架，技术都是可以变的，<strong>唯一不变的是业务思想</strong>。</p>
<p>​       就比如我们在考试的时候，你需要纠结是苹果计算器还是安卓计算器好用吗（手动doge），<strong>我们要做的最关键问题是想出如何解决这道问题的步骤</strong>，然后使用一个趁手的计算器去实现它。</p>
</article>
