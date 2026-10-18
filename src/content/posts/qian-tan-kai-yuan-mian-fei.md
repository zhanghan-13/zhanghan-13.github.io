---
id: "qian-tan-kai-yuan-mian-fei"
title: "浅谈开源免费"
date: "2024-12-18"
excerpt: "引入 最近在实习，也算有一份正经的微薄收入了（以前虽然帮别人写毕设和游戏代练也赚了点小钱还是没有这个情怀直接充的hh），因此买了个永久会员支持了一下typora这个软件，虽然有点贵但物有所值吧，15刀。毕竟自己用typora写笔记、博客、面经这些也一直在用，同时也是typora最大开源插件系统obg"
category: "随笔"
tags: ["开源","盈利"]
wordCount: 1659
headings: [{"level":2,"id":"%E5%BC%95%E5%85%A5","text":"引入"},{"level":2,"id":"%E6%88%91%E7%9A%84%E8%A7%82%E7%82%B9","text":"我的观点"},{"level":2,"id":"%E5%A5%BD%E5%A4%84","text":"好处"}]
imageOmitted: false
legacySlug: "qian-tan-kai-yuan-mian-fei"
sourceUrl: "https://www.bugdesigner.cn/archives/qian-tan-kai-yuan-mian-fei"
---

<article id="content"><h2 id="%E5%BC%95%E5%85%A5">引入</h2>
<p>最近在实习，也算有一份正经的微薄收入了（以前虽然帮别人写毕设和游戏代练也赚了点小钱还是没有这个情怀直接充的hh），因此买了个永久会员支持了一下typora这个软件，虽然有点贵但物有所值吧，15刀。毕竟自己用typora写笔记、博客、面经这些也一直在用，同时也是typora最大开源插件系统<a href="https://github.com/obgnail/typora_plugin" target="_blank" rel="noopener noreferrer">obgnail/typora_plugin</a>的维护者之一。随之更新了一下新版本，发现有几个地方改的让我特别不舒服，随后就跟作者发了个邮件问了一下看看下个版本能不能做成可配置的，谁成想作者光速秒回（此处吐槽下我被某AI独角兽横向比较一个月最后发了感谢信的效率），怎么加、加什么css都说了，让我感慨还得是付钱才有的待遇呀。但是也萌生了我一个思考，软件究竟是<strong>开源为爱发电好</strong>，还是<strong>闭源收费服务好</strong>？</p>
<h2 id="%E6%88%91%E7%9A%84%E8%A7%82%E7%82%B9">我的观点</h2>
<p>首先，我这里抛出一个观点，定一下这个文章的主旋律，我认为<strong>开源+收费</strong>这样的商业模式才可以持久。</p>
<ol><li><p>国内的开源环境不必我多说，前有clash被开盒删库跑路，后有搞机圈lsp被骂到归档，强如有阿里背书的ant design也在18年圣诞节时候给大家一个小惊喜：<a href="https://github.com/ant-design/ant-design/issues/13818" target="_blank" rel="noopener noreferrer">https://github.com/ant-design/ant-design/issues/13818</a> （原issue可考古）。</p>
</li><li><p>反观国外开源环境就一定是世外桃源吗？今年1024程序员节时候开源之父linus移除所有俄罗斯开源贡献者，我在公司开发项目时候引入的scalar、redis-client 低级 bug 频出、甚至k8s的python sdk有一个持续两年多还没有修复的<a href="https://github.com/kubernetes-client/python/issues/1921" target="_blank" rel="noopener noreferrer">bug</a>。</p>
</li><li><p>开源的槽点远不止上述列出的几点，还有一些更详细的内容，推荐下这个up的视频，<a href="https://www.bilibili.com/video/BV1u7mjYpETD?vd_source=a5916dd0c483eddb098610c4f50ae397" target="_blank" rel="noopener noreferrer">那些年我被坑过的开源项目</a></p>
</li></ol>
<p>这一切的原因，我认为逃不开两个原因，人们对<strong>开源产品的尊重</strong>和<strong>缺钱</strong>。很多程序员都认为开源是乌托邦，自己写的代码运行在无数人的机器上，没有报酬，实现人生价值，and so on。但我觉得做什么东西特别是这种普适性的东西都要考虑人的劣根性（没错，其实我很讨厌这种贴标签的词）。</p>
<p>我曾经读过一本书叫《乌合之众》，这里面说当人汇聚成群体以后，智商会急剧下降这样子，在互联网这种信息茧房的时代，反而更容易让大家有这种精神上的“汇聚成群体”这样一个状态。那他们就会在不断地交谈中加深这种印象，导致越来越极端化低智化。列举一下我在网上看到的一些评论：</p>
<ol><li><p>白嫖多舒服，花钱的都是傻子</p>
</li><li><p>这个up主又接商单了，取关了</p>
</li><li><p>怎么又变成僵尸up主了</p>
</li><li><p>能不能快点把这个bug修了啊，这么不积极，还骗别人用你的开源项目</p>
</li></ol>
<p>像这种极端发言不是个例，基于上面的分析我觉得解决上述提出的两个问题有以下解决方案</p>
<ol><li><p>其实现在能翻出去的同学大多都是有一些独立思考能力的，现在的风气相较于之前还是好太多了，很多情况下大家提issue或者在discussion区讨论的时候都是比较和谐的，但是我觉得这方面需要我们共同努力，碰到上述类似发言要拨乱反正。理解开源贡献者的“<strong>不容易</strong>”</p>
</li><li><p>缺钱是最主要的点，很多开源项目为什么停止维护或者QA很烂？究其原因还是维护者太少，作者为爱发电一年两年还可以，但是总是要回归现实生活的。所以说我在这里给出的一个SOP就是<strong>前期免费吸引用户，后期维护一份社区版和pro版</strong>，对某些plus功能进行收费，其实也就是常见的互联网商业模式。有钱了才能有动力维护，有动力维护软件QA才会得到保障。</p>
</li></ol>
<h2 id="%E5%A5%BD%E5%A4%84">好处</h2>
<p>第二段一直在唱衰开源。其实我自己也开源了一些自己做的小项目，给一些开源项目提过pr，回答过issue等等。还有一些知识分享也在做。下面我就说下在我看来的开源好处吧</p>
<ol><li><p><strong>乌托邦</strong>。我感觉大部分人都觉得开源是一件伟大的事情吧，B站评论区经常出现一个梗就是<strong>感谢马斯克开源</strong>哈哈，于我而言，我自己做的一些东西能对其他人有所帮助还是挺让自己开心的一件事情，至少自己做的东西是有意义的。</p>
</li><li><p><strong>简历谈资</strong>。对于校招乃至社招同学，开源经历是比较值得拿出来说的一个点，如果恰好这个star数比较多，并且你能把这个项目整体吃透的话，我觉得面试过程中还是一个比较突出的点的（虽然我基本没被问到过...）。</p>
</li><li><p><strong>培养良好代码习惯</strong>。这个我的感触还是比较深的，之前贡献过的typora_plugin项目，作者我两加了微信给我code review，以前都是用js crud来着，那个项目慢慢的几千行重构，最后抽象出分层架构设计。包括我在开源项目前其实都会检查一下避免自己写一些比较烂的代码哈哈</p>
</li><li><p><strong>有成就感</strong>。其实这个跟第一点有点重复了，但我觉得单独拿出来好一点。不知道其他人什么样，但是当我看到自己在B站发的视频播放量和Github star数 像坐火箭一样向上涨的时候，我就觉得很有成就感，还记得去年我前几次发B站视频时候有一个8w播放量的逆向视频我基本隔一两天看看视频数据变没变，每个评论都认真回哈哈。</p>
</li></ol>
<blockquote><p>ps：坏处就是浪费时间！！最近在秋招（也许是冬招了~）真的没时间做视频和写项目，等稳定了<strong>重拾开源</strong>&amp;<strong>知识分享</strong>旧业！</p>
</blockquote>
<p></p>
</article>
