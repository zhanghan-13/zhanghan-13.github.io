---
id: "yi-ci-ban-ben-wen-ti-yin-fa-de-nge-bugde-si-kao"
title: "一次版本问题引发的N个bug的思考"
date: "2024-09-27"
excerpt: "前言 之前在做一个有关开放API的一个需求，当时自己本意是想手搓一个可视化HTTP请求调用，demo代码复制。后来调研了一下还是采用了这个开源项目：https://github.com/scalar/scalar 。殊不知这才是让我脑壳疼的开始。接下来因为这个引入这个开源项目，我们的项目会出现一系列"
category: "前端"
tags: ["headlessui","scalar","前端"]
wordCount: 1644
headings: [{"level":2,"id":"%E5%89%8D%E8%A8%80","text":"前言"},{"level":2,"id":"%E9%97%AE%E9%A2%98%E5%87%BA%E7%8E%B0","text":"问题出现"},{"level":3,"id":"build%E5%A4%B1%E8%B4%A5%E9%97%AE%E9%A2%98","text":"build失败问题"},{"level":3,"id":"%E6%A0%B7%E5%BC%8F%E5%86%B2%E7%AA%81%E9%97%AE%E9%A2%98","text":"样式冲突问题"},{"level":3,"id":"%E5%90%8E%E7%BB%AD%E7%9A%84%E4%B8%80%E4%BA%9B%E9%97%AE%E9%A2%98","text":"后续的一些问题"},{"level":2,"id":"%E5%A4%8D%E7%9B%98%E6%80%BB%E7%BB%93","text":"复盘总结"}]
imageOmitted: false
legacySlug: "yi-ci-ban-ben-wen-ti-yin-fa-de-nge-bugde-si-kao"
sourceUrl: "https://www.bugdesigner.cn/archives/yi-ci-ban-ben-wen-ti-yin-fa-de-nge-bugde-si-kao"
---

<article id="content"><h2 id="%E5%89%8D%E8%A8%80">前言</h2>
<p>之前在做一个有关开放API的一个需求，当时自己本意是想手搓一个可视化HTTP请求调用，demo代码复制。后来调研了一下还是采用了这个开源项目：<a href="https://github.com/scalar/scalar" target="_blank" rel="noopener noreferrer">https://github.com/scalar/scalar</a> 。殊不知这才是让我脑壳疼的开始。接下来因为这个引入这个开源项目，我们的项目会出现一系列小问题，但是也加强了我排查问题解决问题的能力。</p>
<h2 id="%E9%97%AE%E9%A2%98%E5%87%BA%E7%8E%B0">问题出现</h2>
<p>引入时候出现了一些问题，但是通过阅读官方文档最后还是解决了，他们这个项目更像是去搭建一个完整的项目，里面的文档很少会涉及到实际的工程场景，比如在实际开发过程中我们往往不会把swagger文档给暴露出来，但是项目花了大篇幅去描绘如何访问后端的swagger，后来我也是文档看到最后又开了一个discussion才发现其实<strong>直接拿到json文档然后传递给封装好的组件即可</strong>。</p>
<h3 id="build%E5%A4%B1%E8%B4%A5%E9%97%AE%E9%A2%98">build失败问题</h3>
<p>引入以后正常使用是没问题的，但是在build的时候会出现这样一个问题。<code>export 'useId' (imported as 'e') was not found in 'vue' </code>。后来定位到了 headlessui 这个框架，然后我就去headlessui的项目地址，搜关键字，结果搜到了一个这一个pr：<a href="https://github.com/tailwindlabs/headlessui/pull/3458" target="_blank" rel="noopener noreferrer">https://github.com/tailwindlabs/headlessui/pull/3458</a> ，发现原来是因为vue更新了新版本（我们vue不是最新版，锁的是3.4)，然后headlessui-vue跟进了一下。</p>
<p>因为其实我对前端这种问题也不是特别熟悉，我就直接开了一个discussion：，发现没人回复（ps：headlessui的vue版本我看发行记录已经半停更了）。后来只能自己debug了，说一下<strong>解决流程</strong> </p>
<ol><li><p>降低scalar版本。最简单也最容易想到的问题就是降低scalar版本吧，然后scalar版本低了以后所依赖的headlessui版本就低了，不用最新版就不用处理vue问题，结果降低了一个多小时版本，我都降到去年发布的了，还是会出现问题，因为我们<strong>build一次还要好久</strong>，所以不想再试了，宣告失败，后来复盘时候应该是scalar在依赖里面写的是~1.x，会自动锁到headlessui一开头的最新的版本</p>
</li><li><p>锁住headlessui版本。后来我们组的前端实习生（我不是<strong>专业前端</strong>）跟我说了一个解决方案，就是锁住headless的版本，我心想还有这种操作？<strong>小知识get</strong>，结果锁了一下headlessui的版本还真的好了，discussion有具体步骤，<a href="https://github.com/tailwindlabs/headlessui/discussions/3474" target="_blank" rel="noopener noreferrer">https://github.com/tailwindlabs/headlessui/discussions/3474</a> （还顺带解决了一个外国老哥的问题哈哈）</p>
</li></ol>
<blockquote><p>还有一个方式是升高vue版本，但是这在实际工程项目我认为构不成一个解决方案</p>
</blockquote>
<h3 id="%E6%A0%B7%E5%BC%8F%E5%86%B2%E7%AA%81%E9%97%AE%E9%A2%98">样式冲突问题</h3>
<p>在我引入headlessui以后，我们组另一个实习生说我引入的css样式有问题，会把他负责的模块的样式给覆盖掉，结果排查出来是因为两个人css类名一样！！！哈哈，这又是什么奇怪的问题，后来发现scalar样式用tailwind写的，写的有很多没有加上哈希前缀这样的东西，最后的解决方案是我们妥协了，<strong>他把css类名改了一下</strong></p>
<h3 id="%E5%90%8E%E7%BB%AD%E7%9A%84%E4%B8%80%E4%BA%9B%E9%97%AE%E9%A2%98">后续的一些问题</h3>
<p>你以为事情到这里就结束了吗？那你就大错特错了，让我很烦的远不止于此。解决完成过几天以后build又有export userId问题，结果我发现后来又有scalar依赖的项目，他又跟随vue的最新版更新了！！！这个开源项目也改写了一下他的代码，使用了vue这个新特性。</p>
<p>后来我一想这也不是事儿啊，如果他依赖100个开源项目（当然不可能那么多，实际也就几个吧），那我岂不是要锁100个项目的版本？后来我就尝试降低scalar版本，结果我在降低版本时候<strong>build时候没问题了</strong>（此处的headlessui版本已经锁住了），但是<strong>样式又冲突了！！！</strong>。我真是欲哭无泪，后来的解决方案就是<strong>锁住了这个新发现的项目的版本</strong>，目前半个月过去了还安好。</p>
<h2 id="%E5%A4%8D%E7%9B%98%E6%80%BB%E7%BB%93">复盘总结</h2>
<p>每次奇奇怪怪的bug虽然很让人苦恼，但是也增强了我们debug的能力，从排查定位问题，解决问题，到后续复盘。都会变成自己的经验值，供我们升级用。有一些经验总结吧：</p>
<ol><li><p>生产环境不要用最新版，一定要锁住版本。都在说<strong>你发任你发，我用Java8</strong>，其实对于线上来说又何尝不是一种最优解呢，这些依赖都进行了实际生产的检验，不会出现一些问题。不然你升级了版本，项目中依赖的那么多包谁能保证它也升级了呢。但是我们还是要<strong>拥抱Java17</strong>，毕竟SpringBoot3 Java8都不支持了，这是技术选型的一些<strong>取舍</strong>吧。特别是引入新组件，一定要充分调研，我们这个项目还在开发阶段，所以出一些问题造成的影响很小，生产环境肯定要慎重再慎重，无论是面向B端、C端还是内部同学的。</p>
</li><li><p>排查问题。我对开源项目问题的排查还是有一些心得的，其实我在这次版本问题中排查完全是开源项目出现问题的一个SOP，流程：</p>
<blockquote><p>发现定位问题—&gt;及时让团队成员周知—&gt;Github issues、pr、discussion区搜索关键字—&gt;网上搜索解决方案—&gt; 寻求开源项目维护团队支持—&gt;自己解决—&gt;后续复盘。</p>
</blockquote>
</li></ol>
<p>​       虽然自己不是专业前端，但是这种解决问题的思维似乎对开发来说我认为都是通用的。特别是第二步，出了问题一定要让大家知道，我这个只是相对较小的问题，就是build失败影响大家CI/CD的流程，我在小组群里面发了一下跟大家说我在排查中，着急的可以先rollback一下，如<strong>果真的有严重的线上事故，肯定是要及时上报给+1，然后层层上报的，这个真的很重要！！</strong></p>
</article>
