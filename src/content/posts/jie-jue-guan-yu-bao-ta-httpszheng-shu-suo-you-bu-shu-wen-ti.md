---
id: "jie-jue-guan-yu-bao-ta-httpszheng-shu-suo-you-bu-shu-wen-ti"
title: "解决关于宝塔HTTPS证书所有部署问题"
date: "2024-06-06"
excerpt: "用宝塔的同学大部分是自建博客啥的吧，这两天SSL证书过期了，需要续一下，但是遇到了两个问题。如下 申请证书报一小时申请次数过多 这个在网上找了个帖子，看了一些老哥的评论。总结下来，宝塔客服没总结到这个问题。下面评论的老哥说不是申请次数多的问题，是因为不能一次性申请多个域名。原贴：【已解答】该帐户1小"
category: "网站搭建"
tags: ["https","ssl","宝塔","网站搭建"]
wordCount: 964
headings: [{"level":2,"id":"%E7%94%B3%E8%AF%B7%E8%AF%81%E4%B9%A6%E6%8A%A5%E4%B8%80%E5%B0%8F%E6%97%B6%E7%94%B3%E8%AF%B7%E6%AC%A1%E6%95%B0%E8%BF%87%E5%A4%9A","text":"申请证书报一小时申请次数过多"},{"level":2,"id":"%E8%A7%A3%E5%86%B3%E5%A4%9A%E4%B8%AA%E5%9F%9F%E5%90%8D%E5%BC%80%E5%90%AFhttps","text":"解决多个域名开启https"},{"level":2,"id":"%E7%95%AA%E5%A4%96%E7%AF%87%EF%BC%9A%E8%AE%A9%E5%AE%9D%E5%A1%94%E9%9D%A2%E6%9D%BF%E9%80%9A%E8%BF%87https%E6%94%AF%E6%8C%81%E7%9A%84%E5%9F%9F%E5%90%8D%E8%AE%BF%E9%97%AE","text":"番外篇：让宝塔面板通过https支持的域名访问"}]
imageOmitted: false
legacySlug: "jie-jue-guan-yu-bao-ta-httpszheng-shu-suo-you-bu-shu-wen-ti"
sourceUrl: "https://www.bugdesigner.cn/archives/jie-jue-guan-yu-bao-ta-httpszheng-shu-suo-you-bu-shu-wen-ti"
---

<article id="content"><p>用宝塔的同学大部分是自建博客啥的吧，这两天SSL证书过期了，需要续一下，但是遇到了两个问题。如下</p>
<h2 id="%E7%94%B3%E8%AF%B7%E8%AF%81%E4%B9%A6%E6%8A%A5%E4%B8%80%E5%B0%8F%E6%97%B6%E7%94%B3%E8%AF%B7%E6%AC%A1%E6%95%B0%E8%BF%87%E5%A4%9A">申请证书报一小时申请次数过多</h2>
<p>​       这个在网上找了个帖子，看了一些老哥的评论。总结下来，宝塔客服没总结到这个问题。下面评论的老哥说不是申请次数多的问题，是因为不能一次性申请多个域名。原贴：<a href="https://www.bt.cn/bbs/thread-62449-1-1.html" target="_blank" rel="noopener noreferrer">【已解答】该帐户1小时内失败的订单次数超过5次 - Linux面板 - 宝塔面板论坛 (bt.cn)</a></p>
<p>​       我这个很奇怪，几个月前跟着网上教程做的，也可能是新手允许申请多个域名，然后再续就不行了，也可能是宝塔改了。<strong>解决方案</strong>：申请一个即可成功，点击这个申请证书，填写信息表单即可</p>
<p><img src="/images/d370df21c2bd7cae48cd.png" alt="image-20240606130807890" width="1637" height="1474" loading="lazy" decoding="async"></p>
<p>ps：宝塔对异常捕获的还是不完整啊，乱抛</p>
<h2 id="%E8%A7%A3%E5%86%B3%E5%A4%9A%E4%B8%AA%E5%9F%9F%E5%90%8D%E5%BC%80%E5%90%AFhttps">解决多个域名开启https</h2>
<p>​       上面那个问题解决了，但是出现一个新的问题是你只能为一个域名启用一个证书了（可能还有其他的nginx和服务器配置，我这个没去研究，但是宝塔是只能设置一个）。就比如说我想访问<code>www.bugdesigner.cn</code>和<code>blog.bugdesigner.cn</code>都要访问到我的博客网站。</p>
<p>​       解决方法是新建一个站点，让这个站点也指向你的wp目录，这样你可以部署一个证书，两个子站点都开启了https。下面是手把手教程</p>
<p><img src="/images/4efbb835e94777e4eab1.png" alt="image-20240606134644439" width="2860" height="1560" loading="lazy" decoding="async"><img src="/images/e29af39d0bb9c056b41d.png" alt="image-20240606135406097" width="1612" height="1299" loading="lazy" decoding="async"><img src="/images/80071307958968edaf13.png" alt="image-20240606135549098" width="1482" height="1309" loading="lazy" decoding="async"><img src="/images/d5cda227ba5eb7e6e3b3.png" alt="image-20240606135813265" width="1693" height="1489" loading="lazy" decoding="async"></p>
<p> <strong>可能会有的问题</strong></p>
<p>​       我配置的时候宝塔抽风了，那个新网站默认的重写配置没给我设置，导致我访问新域名（blog.bugdesigner.cn）一直404</p>
<p><img src="/images/ed5031fdcf225a61ee76.png" alt="image-20240606151441302" width="1611" height="1495" loading="lazy" decoding="async"></p>
<p>解决方案：用宝塔或者finalshell这种能够访问服务器文件的工具，把下面这个配置粘进去</p>
<pre><code class="language-nginx">location /
{
     try_files $uri $uri/ /index.php?$args;
}

rewrite /wp-admin$ $scheme://$host$uri/ permanent;</code></pre>
<p><img src="/images/f3f02ccb1f86b7f38ebd.png" alt="image-20240606152000787" width="2876" height="1564" loading="lazy" decoding="async"></p>
<h2 id="%E7%95%AA%E5%A4%96%E7%AF%87%EF%BC%9A%E8%AE%A9%E5%AE%9D%E5%A1%94%E9%9D%A2%E6%9D%BF%E9%80%9A%E8%BF%87https%E6%94%AF%E6%8C%81%E7%9A%84%E5%9F%9F%E5%90%8D%E8%AE%BF%E9%97%AE">番外篇：让宝塔面板通过https支持的域名访问</h2>
<p>​   安装完成以后，宝塔会给你一个默认的外网访问地址，这个是根据ip访问，后面还有一个8位的哈希值（应该叫哈希值吧），并且还老显示不安全。接下来介绍怎么解决这个问题</p>
<p>点击面板设置，直接输入这个绑定域名就可以了，下面的安全入口可以关了，但是我设置的是直接转发</p>
<p><img src="/images/c173f1e8ac53316f8747.png" alt="image-20240606140348681" width="2837" height="1552" loading="lazy" decoding="async"></p>
<p>接下来能访问还是不安全，要做的是再新建一个站点，具体不再赘述，<strong>域名跟上一步绑定域名一样</strong>，指向目录指向一个新目录即可</p>
<p>还是申请ssl秘钥，接下来要做的是把大机构发的秘钥和证书覆盖宝塔自签的半吊子证书。</p>
<p><img src="/images/8885741378befc1debd8.png" alt="image-20240606140748678" width="1653" height="1486" loading="lazy" decoding="async"></p>
<p>点击文件，把key和证书替换默认的文件即可（直接点击可以进入宝塔的文件管理界面）</p>
<p><img src="/images/1e7ca387b2a41fd8d346.png" alt="image-20240606141050261" width="2880" height="1609" loading="lazy" decoding="async"></p>
<p>可能有些同学觉得还需要<code>https://{域名}:40524/{哈希值}</code>太多了记不住</p>
<ol><li><p>上面那个配置可以吧哈希值去了（但我没设置）</p>
</li><li><p>配置新网站转发规则</p>
<p>​        还记得吗，之前创建了一个新网站，这个时候去nginx.conf里面配置一下告诉nginx我们访问这个网站的时候自动重定向到宝塔面板这个网站，配置如下</p>
<pre><code class="language-nginx">location / {
   return 301 https://pannel.bugdesigner.cn:40524/2784c86e; # 301重定向，注意修改成你想让他重定向的网站
}</code></pre>
<p><img src="/images/700d58c8a2053bd6d249.png" alt="image-20240606150817998" width="1616" height="1480" loading="lazy" decoding="async"></p>
</li></ol>
<p>参考：<a href="https://www.daniao.org/4626.html" target="_blank" rel="noopener noreferrer">宝塔面板绑定域名访问-自定义SSL证书(消除不安全提示) - 大鸟博客 (daniao.org)</a></p>
<p><a href="https://www.bt.cn/bbs/thread-62449-1-1.html" target="_blank" rel="noopener noreferrer">【新提醒】【已解答】该帐户1小时内失败的订单次数超过5次 - Linux面板 - 宝塔面板论坛 (bt.cn)</a></p>
</article>
