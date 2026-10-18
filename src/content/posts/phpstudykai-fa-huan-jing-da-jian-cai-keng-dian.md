---
id: "phpstudykai-fa-huan-jing-da-jian-cai-keng-dian"
title: "phpstudy开发环境搭建踩坑点"
date: "2023-10-29"
excerpt: "本文共879个字 前言 最近在学习这门世界上最好的语言，搭建开发环境的时候踩了一些坑，接下来记录一下。 具体坑点 502服务器无法处理请求 这个错误是本篇文章产生"
category: ""
tags: ["PHP","环境搭建"]
wordCount: 599
headings: [{"level":2,"id":"heading-1","text":"前言"},{"level":2,"id":"heading-2","text":"具体坑点"},{"level":3,"id":"heading-3","text":"502服务器无法处理请求"},{"level":3,"id":"heading-4","text":"提示nginx启动不成功"},{"level":3,"id":"heading-5","text":"MySQL冲突问题"},{"level":3,"id":"heading-6","text":"杂篇"}]
imageOmitted: false
legacySlug: "phpstudykai-fa-huan-jing-da-jian-cai-keng-dian"
sourceUrl: "https://www.bugdesigner.cn/archives/phpstudykai-fa-huan-jing-da-jian-cai-keng-dian"
---

<article id="content"><p><span>本文共879个字</span></p>
<h2 id="heading-1"><span>前言</span></h2>
<p><span>最近在学习这门世界上最好的语言，搭建开发环境的时候踩了一些坑，接下来记录一下。</span></p>
<h2 id="heading-2"><span>具体坑点</span></h2>
<h3 id="heading-3"><span>502服务器无法处理请求</span></h3>
<p><span>这个错误是本篇文章产生的最主要原因，这个实在是太坑了。我们开发php一般是PhpStorm和phpstudy两个一起安装。前者作为PHP的开发环境，后者则是傻瓜式环境集成WNMP，就不用自己安装了（类似于宝塔），图形化创建网站。然而php-cgi.exe这个运行的时候需要占用9000端口，但是PhpStorm2023.2.3版本的Debug功能需要默认需要占用9000和9003端口，这样就出现了端口冲突问题，解决方式很简单，把这个9000端口删了只剩下个9003就可以了。</span><span><strong><span>如果还不行先重启phpstudy，或者重启电脑，或者更新一下DNS缓存</span></strong></span></p>
<p><span>windows查看端口占用的命令：</span><span><code>netstat -ano | findstr 9000</code></span></p>
<p><span>杀死指定进程的命令：</span><span><code>taskkill /pid 进程ID -t -f</code></span></p>
<p><span>更新DNS缓存：</span><span><code>ipconfig/flushdns</code></span></p>
<p><span><img src="/images/cf25a629e21ecfd1a04d.png" alt="image-20231028234455069" width="1992" height="1455" loading="lazy" decoding="async"></span></p>
<h3 id="heading-4"><span>提示nginx启动不成功</span></h3>
<p><span>这个提示一般是你安装的路径存在空格，这点在小皮的txt文件上面写了，但是可能有同学跟我一样，没有仔细看，习惯性装到D盘Program Files文件夹下。结果还得删了重装一下。</span></p>
<h3 id="heading-5"><span>MySQL冲突问题</span></h3>
<p><span>本机已经有MySQL了，一般我们都设置了mysql开机自启服务，这个时候一启动端口肯定冲突，因此改一下默认端口号就可以了。如下图。</span></p>
<p><span><img src="/images/a942f332b62d18e06914.png" alt="image-20231028234940777" width="916" height="918" loading="lazy" decoding="async"></span></p>
<h3 id="heading-6"><span>杂篇</span></h3>
<p><span>最后可能出问题的点可能在nginx网站目录的配置，这个可以直接放在phpstudy里面的WWW目录下，也可自己新建目录。</span></p>
<p><span><img src="/images/3077e88ce0acbe7cd8b5.png" alt="image-20231028235148657" width="920" height="930" loading="lazy" decoding="async"></span></p>
<p><span>安装了小皮就用这个创建网站还是挺方便的，图形化点两下，它自动给你改这个目录下面的配置文件</span><span><code>C:\Windows\System32\drivers\etc\hosts</code></span><span>，nginx的conf文件帮你改好，php-cgi.exe的location块也配好了。</span></p>
<p><span><img src="/images/7d21e008e47c1125989f.png" alt="image-20231028235730020" width="1380" height="1137" loading="lazy" decoding="async"></span></p>
<p><span><strong><span>最后在phpstorm里面的配置</span></strong></span><span>：想运行虚拟域名也很简单，1：配置php.exe的路径。2：打开设置部署应用一下就可以运行了。部署设置如下</span></p>
<p><span><img src="/images/796fe2a8594b2489a7c8.png" alt="image-20231029000744429" width="1976" height="1451" loading="lazy" decoding="async"></span></p>
<p><span>至此，我们就可以愉快的开始我们php的开发了???</span></p>
</article>
