---
id: "zhongkao_mirgate"
title: "河南考生中考移民大庆大家究竟在吵什么？我爬取了两万五千条抖音评论和近6年分数线并进行了数据分析"
date: "2024-01-16"
excerpt: "所涉及到的知识点 爬虫 爬虫基础 requests库的基本使用 pyquery库的基本使用 js逆向 js补环境(VMP还原) execjs的使用 数据分析 pandas的使用 numpy的使用 matplotlib的使用 绘制组合条形图 绘制词云图 绘制折线图 绘制柱状图 存储数据 pymysql"
category: "爬虫"
tags: ["中考移民","抖音逆向","河南高考"]
wordCount: 4466
headings: [{"level":2,"id":"heading-1","text":"所涉及到的知识点"},{"level":2,"id":"heading-2","text":"数据爬取"},{"level":3,"id":"heading-3","text":"爬取分数线相关数据"},{"level":3,"id":"heading-4","text":"爬取评论数据"},{"level":2,"id":"heading-5","text":"数据分析结果"},{"level":3,"id":"heading-6","text":"如何进行数据分析"},{"level":3,"id":"heading-7","text":"分数线分析"},{"level":4,"id":"heading-8","text":"分数线排名"},{"level":4,"id":"heading-9","text":"两省对比"},{"level":3,"id":"heading-10","text":"抖音评论分析"},{"level":4,"id":"heading-11","text":"地域分析"},{"level":4,"id":"heading-12","text":"评论时间分析"},{"level":4,"id":"heading-13","text":"词云图分析"},{"level":4,"id":"heading-14","text":"归类分析"},{"level":3,"id":"heading-15","text":"写在后面"}]
imageOmitted: false
legacySlug: "zhongkao_mirgate"
sourceUrl: "https://www.bugdesigner.cn/archives/zhongkao_mirgate"
---

<article id="content"><h2 id="heading-1">所涉及到的知识点</h2>
<p><strong>爬虫</strong></p>
<ul>
<li>
<p>爬虫基础</p>
<ol>
<li>requests库的基本使用</li>
<li>pyquery库的基本使用</li>
</ol>
</li>
<li>
<p>js逆向</p>
<ol>
<li>
<p>js补环境(VMP还原)</p>
</li>
<li>
<p>execjs的使用</p>
</li>
</ol>
</li>
</ul>
<p><strong>数据分析</strong></p>
<ul>
<li>
<p>pandas的使用</p>
</li>
<li>
<p>numpy的使用</p>
</li>
<li>
<p>matplotlib的使用</p>
<ul>
<li>绘制组合条形图</li>
<li>绘制词云图</li>
<li>绘制折线图</li>
<li>绘制柱状图</li>
</ul>
</li>
</ul>
<p><strong>存储数据</strong></p>
<ul>
<li>pymysql的基本使用</li>
<li>pymongo的基本使用</li>
<li>存储到csv文件</li>
</ul>
<p><strong>小知识</strong></p>
<ul>
<li>复制请求的bash命令快速生成py代码</li>
<li>快速编写windows脚本（以mongodb启动脚本为例）</li>
</ul>
<h2 id="heading-2">数据爬取</h2>
<p>数据来源：</p>
<ul>
<li>中国教育在线：<a href="https://www.eol.cn/e_html/gk/fsx/index.shtml" target="_blank" rel="noopener noreferrer">https://www.eol.cn/e_html/gk/fsx/index.shtml</a></li>
<li>抖音网页版：<a href="https://www.douyin.com/search/%E5%A4%A7%E5%BA%86%E5%9B%9E%E5%BA%94%E6%B2%B3%E5%8D%97%E4%B8%AD%E8%80%83%E7%94%9F%E7%A7%BB%E6%B0%91?publish_time=0&amp;sort_type=1&amp;source=tab_search&amp;type=general" target="_blank" rel="noopener noreferrer">发现更多精彩视频 - 抖音搜索 (douyin.com)</a></li>
</ul>
<h3 id="heading-3">爬取分数线相关数据</h3>
<p>​       这个就是简单的爬取数据，点开这个网站，直接F12抓包。网站是用<code>jquery</code>写的，也没有异步加载，直接往一个页面上发送请求即可拿到返回的html页面。</p>
<p>​       在返回的html结构中就可以使用<code>pyquery</code>，<code>xpath</code>这种库来提取需要的数据了。</p>
<h3 id="heading-4">爬取评论数据</h3>
<p>​       抖音这个网站当时也是研究了一天，也结合了网上的一些教程，比如K哥的手撸X-Bogus加密，最后成功的逆向出来了，本来想着还能搞个几k呢，谁想到老板跑路了。其实你只要拿着这个X-Bogus加密，就能拿到抖音很多东西了，比如<code>用户资料</code>，<code>用户视频信息</code>，<code>评论</code>什么的，一些自动化的还需要<code>bd-ticket-guard-client-data</code>。</p>
<p><strong>X-Bogus逆向：</strong></p>
<p>​       这里我采用的是<strong>补环境</strong>，顾名思义，就是补一下js代码运行所需要的环境。找到加密入口，通过一些断点调试的方式找到加密的参数，把所有代码整个给扣下来，然后在python里面调用js代码，传递需要加密的参数，让js把加密后的数据给你返回即可。</p>
<p>可以参考这个教程：<a href="https://www.bilibili.com/video/BV1nw411t7dq/%EF%BC%8C%E4%B8%A4%E4%B8%AA%E5%B0%8F%E6%97%B6%E8%AE%B2%E7%9A%84%E5%BE%88%E9%80%82%E5%90%88%E5%B0%8F%E7%99%BD%EF%BC%8C%E6%9C%89%E5%9F%BA%E7%A1%80%E7%9A%84%E5%8F%AF%E4%BB%A5%E8%B7%B3%E7%9D%80%E7%9C%8B" target="_blank" rel="noopener noreferrer">https://www.bilibili.com/video/BV1nw411t7dq/，两个小时讲的很适合小白，有基础的可以跳着看</a></p>
<p><strong>剩下的参数</strong></p>
<p>​   对于剩下的参数，如果你需要自动化数据采集，比如根据关键字搜索后自动把这个关键字下面视频的所有评论都给采集出来，你可能还需要使用正则把<code>aweme_id</code>这种参数给逆向出来（一般是通过<strong>正则</strong>提取）。</p>
<p>​   但是我们这里就采集5条视频的两万五千条评论，我就手动赋值了，只需要修改分页查询的两个参数就可以愉快的进行爬取了。</p>
<p><strong>写在后面</strong></p>
<p>​       本次我爬取的时候前前后后爬取了10万条评论，抖音没有进行风控，如果爬取的多了，比如几十万条几百万条，可能需要多个账号进行爬取。因为这里是学习目的，就不深入介绍了。</p>
<h2 id="heading-5">数据分析结果</h2>
<p>参考的文章：</p>
<ul>
<li><a href="https://www.zhihu.com/question/388542513" target="_blank" rel="noopener noreferrer">为什么云南教育那么落后一本线却那么高 尤其是文科一本线达到560为全国第一？ - 知乎 (zhihu.com)</a></li>
<li><a href="https://www.zhihu.com/question/406096847" target="_blank" rel="noopener noreferrer">为什么没人说江西高考生难呢？ - 知乎 (zhihu.com)</a></li>
<li><a href="https://www.zhihu.com/question/463646951" target="_blank" rel="noopener noreferrer">2021高考共几套试卷，各省使用什么卷？ - 知乎 (zhihu.com)</a></li>
<li><a href="https://news.koolearn.com/20180605/1152565.html" target="_blank" rel="noopener noreferrer">2018年高考试卷使用版本划定 哪些省市使用全国卷_高考_新东方在线 (koolearn.com)</a></li>
</ul>
<h3 id="heading-6">如何进行数据分析</h3>
<p>​       很多同学拿到数据不知道怎么进行分析，我能给的建议是首先看你需要什么，第二看你拿到的数据能给你什么。分析的自由度是很大的，画什么图，用什么数据都是你自己决定的，多看看别人是怎么进行数据分析的。拿现在我们分析的举例子：</p>
<p><strong>对分数线的分析</strong>：我只是分析了一二本的前4名和后4名。扩展的是不是还有新高考省份的分数线？京津沪的分数线。</p>
<p><strong>对评论的分析</strong>：是不是可以对评论的人进行分类，看一下评论的性别分布和年龄分布。在B站的话可能还有等级分布</p>
<h3 id="heading-7">分数线分析</h3>
<p>一图胜千言，首先是每个省份的可视化分析。</p>
<p>​       这里我的分析思路是这样的，我们之前拿到了每个省份近6年的分数线数据。这些数据<strong>并不符合严格的规律</strong>，分析自由度大了很多，当然提取数据的难度也大了很多。我分析的目的只是简单看一下各个省份分数线的分布，咱也不是专业人士，对于什么<code>艺术类</code>、<code>特招</code>、<code>自主招生</code>、<code>新高考</code>这些也并没有深入的了解，就不在这里班门弄斧了，就简单分析一下对于<strong>2023年还在使用一本二本这些传统高考录取的省份进行一个分析。</strong></p>
<p>​       根据文理科和一二本进行分类，一共有4种组合，对每种组合分别分析<strong>平均分数线</strong>最高的4个省份和<strong>平均分数线</strong>最低的4个省份进行绘制折线图。</p>
<p><strong>QA:</strong></p>
<blockquote>
<p>Q: 为什么我使用平均分数线来对省份进行排序？</p>
<p>A：选择的原因</p>
<ul>
<li>使用平均分数线分析起来相对简单，同时比单个年份的排序更有说服力</li>
<li>一般一个省份分数线高就会一直高下去，基本不会出现飞上枝头变凤凰这种情况，每年的差距应该不算很大。</li>
</ul>
<p>Q：每个省份不是对应有特定的I,II,III卷吗，这个可以忽略吗？</p>
<p>A：显然是不建议忽略的。但是仍然忽略的原因如下</p>
<ol>
<li>这里因为数据量较少（经过一二本的过滤只剩下了16个省份），如果再强行进行分类，可能会出现数据对照组较少难以解释的问题。</li>
<li>选择II和III的省份近几年分数也相对比较低，跟卷I的省份比较也不会太大的影响分析结果。</li>
</ol>
</blockquote>
<p><strong>明确一点，分数线高低并不直接代表高考的难易程度，任何事情都是相对的。</strong></p>
<p>举个例子：竞争压力大的省份过一本线70分可以上双一流，竞争压力小的省份过一本线30分可以上双一流。其中省内大学和省外大学又有差距。同时每个省份的评分标准也不尽相同</p>
<blockquote>
<p>参与统计的省份（共16个）：</p>
<p>南方：江西、安徽、广西、四川、云南、贵州</p>
<p>北方：河南、山西、内蒙古、陕西，甘肃，宁夏，青海，新疆、吉林、黑龙江</p>
</blockquote>
<h4 id="heading-8"><strong>分数线排名</strong></h4>
<ol>
<li>排名前4的分别是四川、云南、江西、河南</li>
<li>排名后4的有宁夏、黑龙江、新疆、青海</li>
</ol>
<p>2020年前的I卷和III卷难度差距较大，20年以后全国三张卷子更改成甲卷和乙卷，难度接近了。</p>
<p><strong>排名前四的分析：</strong></p>
<ul>
<li>四川和云南使用三卷，分数高一点也正常，但是这么高的分数也足以看出他们的实力了。</li>
<li>江西确实是直接一提的，同属一卷的情况下，分数线在20年之前遥遥领先河南，20年之后也是跟河南差不多的。</li>
<li>从分数线看的话，河南的高考难度还好，并没有遥遥领先，可能是人多而高校招生人数是固定的，导致高校分数线在本省上浮从而上学难。</li>
</ul>
<p><strong>排名后四的分析：</strong></p>
<ul>
<li>从20年4个省份分数线开始极速暴跌，尤其是在2021年，新疆的一本分数线是405，与分数线最高的省份四川差了116分。可能是因为改用了全国卷的原因，在21年之前，新疆、宁夏、黑龙江使用卷III，由于教育改革，这三个省份开始使用全国乙卷(即与江西、安徽、河南等共用一套卷子)。</li>
</ul>
<p><img src="/images/4820ac6ce5e4ddf46b7d.png" alt="image-20240114154913668" width="1200" height="800" loading="lazy" decoding="async"></p>
<p>下面这几个图就不一一分析了：</p>
<img src="/images/7f0fb75e782592767a80.png" alt="image-20240114160834693" width="1200" height="800" loading="lazy" decoding="async">
<p><img src="/images/87a29e0396c16d3bd563.png" alt="image-20240114160858380" width="1200" height="800" loading="lazy" decoding="async"></p>
<p><img src="/images/5f8cdd975aebe9f7ddea.png" alt="image-20240114160930122" width="1200" height="800" loading="lazy" decoding="async"></p>
<h4 id="heading-9">两省对比</h4>
<p>​   我们是来探究河南移民大庆，我这里就把这两个省份简单抽出来做了一些比较。下面直接上图：</p>
<p>还是只分析理科的。</p>
<ul>
<li>在2021年（不含2021年）之前，由于两个省份卷子不同，所以其实可以看出河南并没有比黑龙江高出多少分，最高的一次在2020年，理科一本线高出了89分，理科二本线高出了117分。（这次可能是因为疫情原因）</li>
<li>2021年以后，由于卷子统一，分数差距逐渐拉开，甚至在2023年，河南本科二批分数线高于黑龙江本科一批分数线1分，本科一批分数线高出黑龙江106分。本科二批分数线高出黑龙江122分。</li>
</ul>
<p><img src="/images/a9969524acd47d9dd8b5.png" alt="image-20240114161141616" width="1800" height="1000" loading="lazy" decoding="async"></p>
<p>文科的也是一样，就不再赘述了</p>
<p><img src="/images/515e89ffb879cea7747f.png" alt="image-20240114161736057" width="1800" height="1000" loading="lazy" decoding="async"></p>
<h3 id="heading-10">抖音评论分析</h3>
<p>​       对评论来说，需要用到NLP技术，或者LDA分类。我对这方面的理解也仅限于调用一个别人的模型，可是这个评论属实有点......，别说模型了，连我有的都看不懂，要是手动打标记用一些机器学习模型再训练的话实在太浪费时间了。</p>
<p>​       所以我就想着调用一下GPT4的接口，让他帮我进行归类，我的prompt写的感觉够详细了，还是不太行,有的完全看不出来评论是冷嘲热讽的，如果每个评论调用一次接口，它的识别成功率可以达到60%-70%左右。但是如果每次评论我都调用一下接口，我的wallet也扛不住啊，因此就用模式匹配简单分析一下就可以了</p>
<p>可以看一下我的prompt：</p>
<pre><code>我下面会给你一份csv文件，这个文件的text列是你所要分析的抖音评论

视频评论背景：
    这个事件发生在最近，就在中国，中国的教育地域分布是非常不均的，教育公平是很多人都想达到的目标。其中河南高考的难度在中国是非常大的，而黑龙江却并没有那么大。这次事件的原委是有大量河南的家长把学生户籍迁移到黑龙江省大庆市，被大庆市的家长举报，认为侵犯了他们孩子的利益。这个事情在中国的抖音（国外的tiktok）平台引发了激烈的讨论。

给你的输入：
    如前所述，这个输入的格式是一个csv文件。text列是我爬取的评论

你需要做的：
    你需要识别不同评论的【深层】语义并把他们进行分类（需要结合视频评论的【特征】、【背景】、【以及隐含的含义】，来识别他们这个评论的含义）。分类的特征有12个：
        1：支持河南考生移民
        2：认为不能抢占黑龙江考生名额

        3：认为河南高考分数太高
        4：认为教育不平等，支持全国统一分数线
        5：认为复读生太多
        6: 认为河南好大学少
        7：认为两者教育资源有差距，

        8：认为河南生的多
        9：攻击河南人

        10: 谈到了西安
        11：认为有人搞阴谋论，抹黑黑龙江和河南
        12: 其他原因

     分类的要求如下：根据你自己的模型训练集和上面的要求【精确】识别这些评论，你需要在上面11个选项中选择一个评论最可能的分类，（请注意，如果你实在无法识别评论的倾向，请把他们归类于其他原因）

补充说明：
    不要简单的使用关键词匹配，你需要根据你的理解（即你的训练集）对每一个评论进行精确的分类。

在分类完成后，如果你可以返回csv文件，请提供一个csv文件，如果你不能返回文件，请严格按照下面的格式返回数据：
cid,type
7323084537058886452,1
7323084537058886453,6</code></pre>
<h4 id="heading-11">地域分析</h4>
<p>​       可以看到来自河南的网民对这件事关注度最高，比例为<strong>35.1%</strong>，第二名就是山东，山河四省的核心成员，第三是陕西，我猜测是因为去年的西安事件，第四是黑龙江，河南—&gt;黑龙江的，第五是江苏，这个应该是经济发达并且高考也不简单，所以应该也有关注度，第六个是河北，也是山河四省的核心成员。</p>
<p>话说 为啥山河四省的山西老铁没上榜，一家人没整整齐齐啊?</p>
<p><img src="/images/17b9e51c087dba937d77.png" alt="image-20240114190232809" width="800" height="800" loading="lazy" decoding="async"></p>
<h4 id="heading-12">评论时间分析</h4>
<p>​       2024-1-12号曝出来的，有80%（19804条）评论都是在当天评论的，2024-1-14号大家都不太关注了，仅仅3%不到，只有800个评论，热度还是蹭慢了? </p>
<p><img src="/images/1e618ac3ee96ef4c145c.png" alt="image-20240114190757952" width="800" height="800" loading="lazy" decoding="async"></p>
<h4 id="heading-13">词云图分析</h4>
<p>下面的词云图我做了一些过滤，把河南，黑龙江还有单字的这些给过滤出去了。下面简单看几个词分析一下。</p>
<ul>
<li>
<p><strong>公平</strong>、<strong>高考</strong>、<strong>分数线</strong>。这两个词应该是在强调教育不公平，高考难</p>
</li>
<li>
<p><strong>孩子</strong>。父母之爱子，则为之计深远。这种意思</p>
</li>
<li>
<p><strong>全国统一</strong>。应该是在呼吁全国统一考卷</p>
</li>
<li>
<p><strong>山河四省</strong>。源自今年出圈的一个梗，在这次也有强调，应该也是在说山河四省高考难</p>
</li>
<li>
<p><strong>向阳而生</strong>。一句话：<code>如果阳光不能均匀的撒在大地上，就不要责怪他们选择向阳而生！</code></p>
</li>
<li>
<p><strong>西安</strong>。应该是去年移民西安的事情</p>
</li>
<li>
<p><strong>为什么</strong>、<strong>河南人</strong>、<strong>他们</strong>。这些词汇应该是在攻击河南人，比如这个评论：</p>
<p><code>这些人难道不是想享受好的教育资源后，去其他弱省钻空子吗，这么多年，怎么不见江苏，浙江这些教育强省的这种新闻，反倒是你们，去完西安，现在又去大庆。你们如果去江苏，浙江，山东，河北。我觉得还真没多少人这么说河南人[尬笑][尬笑][尬笑][尬笑]</code></p>
</li>
</ul>
<p><img src="/images/ddf516028a2047651f18.png" alt="image-20240114190739429" width="1600" height="1000" loading="lazy" decoding="async"></p>
<h4 id="heading-14">归类分析</h4>
<p>由于是经过模式匹配，自己添加正则，肯定有疏漏地方，一个匹配出来了2000个左右，10%， 这个参考价值并不是很大，但是也是有参考价值的。这里我们不谈比例，只谈多少人。上面的分类在prompt里面，</p>
<p>10对应的是<strong>谈到了西安</strong></p>
<p>4对应的是认为<strong>教育不平等，支持全国统一分数线，统一试卷</strong></p>
<p>7对应的是<strong>教育资源差距</strong></p>
<p>5对应的是认为<strong>复读生太多</strong></p>
<p>8对应的是<strong>认为河南生的多，人多</strong></p>
<p>可以看到，谈到西安的评论占到了800个左右，大概是评论数的4%。统一分数线有600个评论提及，认为教育资源有差距的有500个评论，认为河南复读生多的有200个，认为河南人多的有190个。</p>
<p><img src="/images/4854e58994cab61488ea.png" alt="" width="1000" height="600" loading="lazy" decoding="async"></p>
<hr>
<p>根据上面的分析结果可以稍微得出一点结论：</p>
<ul>
<li>大家关注去年移民西安的事情</li>
<li>支持全国统一分数线、统一试卷</li>
<li>认为教育资源差距大</li>
</ul>
<h3 id="heading-15">写在后面</h3>
<p>​   今年哈尔滨爆火其实也让大家更了解了黑龙江。作为一个在黑龙江读了几年书的河南人，还是挺建议来这里的。原因</p>
<ul>
<li>反卷圣地，分数线上面也分析了，老师大部分很佛系，不会出现<code>不学习先死爹后死妈</code>的tagline。</li>
<li>平常气候也非常宜人，冬暖（有暖气）夏凉很舒服</li>
<li>至于景点和底蕴就不用我介绍了，抖音视频已经满天飞了。</li>
<li>这里的人也很不错（不包括中介? ）</li>
</ul>
<p>说回正题，调查结果出来了，好像是300多个人有100多人是河南的。</p>
<p>​   但是像这种中高考移民确实是不应该赞同的，首先，并不是鼓励大家仇富，这种能出来的要么家里有关系，要么家里有money，这不仅对黑龙江不公平，对河南考生不也相对不公平（短期大家可能觉得少了一个竞争对手）。但是你跑出来了那别人跑不跑呢？河南的跑了河北、山东的跑不跑呢？你出2w能跑别人是不是要出3w？大庆不让了是不是要去哈尔滨？哈尔滨不让了是不是要去齐齐哈尔？黑龙江不让了是不是要去青海?。归根结底还是不能说的问题</p>
<blockquote>
<p>打个比喻，上游水闸开了，一直在下游建坝能解决问题吗？大家心知肚明。现在的问题是怎么关？或者怎么关小一点，这就轮到专家发力了。</p>
</blockquote>
<p>并且也是真的对黑龙江考生不公平的，你在河南上学跑来黑龙江考试。举个栗子：河南考生5点起床9点放学<strong>卷</strong>16个小时，别人7点起床6点放学，你一天比本地考生多学5、6个小时，考试相对而言肯定不公平了。学习时间也是教育资源的一部分......</p>
<p><strong>希望大家积极向上，怨天尤人没有用，还是努力提升自己。</strong></p>
<blockquote>
<p>世界上只有一种真正的英雄主义，那就是在认清生活的真相以后依然热爱生活。</p>
</blockquote>
</article>
