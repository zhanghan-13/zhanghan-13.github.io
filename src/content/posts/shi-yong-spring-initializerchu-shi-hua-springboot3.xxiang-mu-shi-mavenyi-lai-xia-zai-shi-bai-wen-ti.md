---
id: "shi-yong-spring-initializerchu-shi-hua-springboot3.xxiang-mu-shi-mavenyi-lai-xia-zai-shi-bai-wen-ti"
title: "使用spring initializer初始化springboot3.x项目时maven依赖下载失败问题"
date: "2023-12-26"
excerpt: "最近在开发一个springboot五子棋AI项目，想着使用idea自带的初始化器初始化一个项目，没想到刚创建项目的时候就报错了，报错信息是： org.springframework.boot:spring-boot-starter-parent:pom:3.1.6 failed to transfe"
category: "后端"
tags: ["maven","springboot3"]
wordCount: 377
headings: []
imageOmitted: false
legacySlug: "shi-yong-spring-initializerchu-shi-hua-springboot3.xxiang-mu-shi-mavenyi-lai-xia-zai-shi-bai-wen-ti"
sourceUrl: "https://www.bugdesigner.cn/archives/shi-yong-spring-initializerchu-shi-hua-springboot3.xxiang-mu-shi-mavenyi-lai-xia-zai-shi-bai-wen-ti"
---

<article id="content">最近在开发一个springboot五子棋AI项目，想着使用idea自带的初始化器初始化一个项目，没想到刚创建项目的时候就报错了，报错信息是：
<pre><code class="language-java">org.springframework.boot:spring-boot-starter-parent:pom:3.1.6 failed to transfer from http://maven.aliyun.com/nexus/content/repositories/central/ during a previous attempt. This failure was cached in the local repository and resolution is not reattempted until the update interval of alimaven has elapsed or updates are forced. Original error: Could not transfer artifact org.springframework.boot:spring-boot-starter-parent:pom:3.1.6 from/to alimaven (http://maven.aliyun.com/nexus/content/repositories/central/): transfer failed for http://maven.aliyun.com/nexus/content/repositories/central/org/springframework/boot/spring-boot-starter-parent/3.1.6/spring-boot-starter-parent-3.1.6.pom
</code></pre>
难受的一批。就好比是当你正准备去解决NPhard问题时1+1居然不知道为什么等于2的挫败感 (｡•́︿•̀｡)。

后来在网上搜各种解决方案，有说springboot版本太高降一下版本、清idea缓存、删除本地仓库里面的依赖、配置ssl，都没有解决。后来发现ssl是要配的，但是是配置到下面这里
<pre><code class="language-java">-Dmaven.wagon.http.ssl.insecure=true -Dmaven.wagon.http.ssl.allowall=true -Dmaven.wagon.http.ssl.ignore.validity.dates=true -DarchetypeCatalog=internal 
</code></pre>
<img src="/images/3500094aecb96ba706ae.png" alt="image-20231209185902606" width="1846" height="1454" loading="lazy" decoding="async">

再重新构建就可以了

题外话：上面的4个maven的配置命令都是在告诉maven<strong>没事的啦，安全不重要，能连上就可以</strong>。当然我们也不用关心这个，国内阿里云他的仓库就算不安全对我们来说也没啥影响，国内大家都一样不安全。

 </article>
