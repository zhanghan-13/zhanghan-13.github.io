---
id: "redisming-ling-ti-shi-bu-xian-shi-de-jie-jue-fang-an"
title: "Redis命令提示不显示的解决方案"
date: "2023-10-04"
excerpt: "本文共1100字 原因 网上还没有这种问题的解决方案。如果使用docker直接从dockerhub拉取redis镜像的话，我猜想redis官方应该是为了轻量考虑没有在镜像里面的redis-cli里面内置linenoise这个库，因此redis-cli的命令提示功能就没有了。 解决方案 但是我们在学习"
category: "后端"
tags: ["docker","redis","命令提示"]
wordCount: 718
headings: [{"level":2,"id":"heading-1","text":"原因"},{"level":2,"id":"heading-2","text":"解决方案"}]
imageOmitted: false
legacySlug: "redisming-ling-ti-shi-bu-xian-shi-de-jie-jue-fang-an"
sourceUrl: "https://www.bugdesigner.cn/archives/redisming-ling-ti-shi-bu-xian-shi-de-jie-jue-fang-an"
---

<article id="content"><p><span>本文共1100字</span></p>
<h2 id="heading-1">原因</h2>
网上还没有这种问题的解决方案。如果使用docker直接从dockerhub拉取redis镜像的话，<strong>我猜想</strong>redis官方应该是为了轻量考虑没有在镜像里面的redis-cli里面内置linenoise这个库，因此redis-cli的命令提示功能就没有了。
<h2 id="heading-2">解决方案</h2>
但是我们在学习过程中，redis的命令比较多，需要有命令提示怎么实现呢？只有一种解决方案就是<strong>自己手动安装解压</strong>。

<mark>演示版本是7.2.1这个版本，我把redis的配置文件放在了/mydir/redis/redis2.conf。根据自己的情况自行更改就可以了</mark>

在官网下载后缀为tar.gz的安装包，使用一些文件传输工具（Finalshell，xshell等）传到linux服务器上，然后cd到安装包那个目录使用 <code>tar -zxvf redis-7.2.1.tar.gz</code>这个命令解压（一般把这个压缩包放到linux服务器下的/opt目录下）

解压完以后cd到redis-7.2.1这个文件夹，执行<code>make &amp;&amp; make install</code>这个命令。?这个过程需要联网进行

安装完毕以后进入<code>/usr/local/bin</code>目录下查看是否安装成功。如下图，就是安装成功了

<img src="/images/38c68be84e27e99d03b5.png" alt="image-20231004124159846" width="2371" height="1482" loading="lazy" decoding="async">

安装成功以后。需要自己配置一个redis.conf这个配置文件。这里如果是个人学习的话改下面这几个方面就可以了(使用自己的远程终端工具可以打开文件ctrl+f搜索，当然也可以使用linux的vim编辑器，普通模式下按<code>/</code>这个就可以搜索了)
<ol>
<li>daemonize no 改为 yes，代表系统给redis-server起一个守护进程（如果使用docker的话这个地方不要改）</li>
<li>protected-mode yes 改为 no，代表关闭保护模式，不然不设置密码连接的时候就连不上了。跟密码双层防火墙</li>
<li>bind 127.0.0.1 直接注释掉，代表取消只能本机访问的限制</li>
<li>requirepass 改为你自己设置的密码（建议设置一下）</li>
<li>[port 6379] 这个如果本机有多个redis，需要改一下端口避免冲突，默认6379，改成6380,6381就可以</li>
</ol>
手动解压的话redis.conf文件在<code>/opt/redis 7.2.1</code>目录下面。如果是使用docker的话设置数据卷时候需要自己从官网或者github找到对应版本的配置文件。

接下来指定redis-server使用我们改过的配置来启动 <code>redis-server /mydir/redis/redis2.conf</code>（因为已经有环境变量了，所以在哪个目录下启动都可以）

然后使用<code>redis-cli [-a 密码] [-p 端口]</code>启动就可以了。生产环境下不要直接-a密码，登进去以后再使用auth 密码来认证。

最后效果如图

<img src="/images/0ab0528757c1dddce044.png" alt="image-20231004125929183" width="2371" height="1482" loading="lazy" decoding="async">

 </article>
