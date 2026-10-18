---
id: "wei-fu-wu-xiang-mu-java8sheng-ji-zhi-nan"
title: "微服务项目Java8升级指南"
date: "2024-05-10"
excerpt: "最近有接入SpringAI的需求，但是SpringAI要求JDK17+Springboot3，那我用的依赖版本都是从网上项目copy的，万年不变的java8，权衡一下利弊，还是升级一下吧，毕竟spring都放弃java8了，这个文章记录一下升级日志。 前置版本 Java： jdk8 maven3.8"
category: "后端"
tags: ["Spring cloud","springboot3","微服务"]
wordCount: 952
headings: [{"level":2,"id":"heading-1","text":"前置版本"},{"level":2,"id":"heading-2","text":"升级过程"},{"level":2,"id":"heading-3","text":"配置问题"},{"level":2,"id":"heading-4","text":"升级后的版本"}]
imageOmitted: false
legacySlug: "wei-fu-wu-xiang-mu-java8sheng-ji-zhi-nan"
sourceUrl: "https://www.bugdesigner.cn/archives/wei-fu-wu-xiang-mu-java8sheng-ji-zhi-nan"
---

<article id="content"><p>​       最近有接入SpringAI的需求，但是SpringAI要求JDK17+Springboot3，那我用的依赖版本都是从网上项目copy的，万年不变的java8，权衡一下利弊，还是升级一下吧，毕竟spring都放弃java8了，这个文章记录一下升级日志。</p>
<h2 id="heading-1">前置版本</h2>
<ol>
<li>
<p>Java：</p>
<ul>
<li>jdk8</li>
<li>maven3.8.1</li>
</ul>
</li>
<li>
<p>SpringCloud部分：</p>
<ul>
<li>spring cloud版本：Hoxton.SR9</li>
<li>spring cloud alibaba：2.2.6.RELEASE</li>
</ul>
</li>
<li>
<p>SpringBoot：2.3.7.RELEASE</p>
</li>
<li>
<p>其他依赖</p>
<ul>
<li>lombok：1.18.8</li>
<li>fastjson：1.2.83</li>
<li>druid：1.2.8</li>
<li>mysql：8.0.30</li>
<li>mybatis-plus：3.4.1</li>
<li>knife4j：4.3.0</li>
<li>openfeign：3.0.2</li>
</ul>
</li>
</ol>
<h2 id="heading-2">升级过程</h2>
<ol>
<li>根据SCA官网的表格升级spring cloud alibaba、spring cloud、springboot，<a href="https://sca.aliyun.com/docs/2023/overview/version-explain/" target="_blank" rel="noopener noreferrer">版本发布说明 | https://sca.aliyun.com</a></li>
</ol>
<pre><code class="language-xml">&lt;properties&gt;
    &lt;spring-cloud.version&gt;2023.0.1&lt;/spring-cloud.version&gt;
    &lt;spring-boot.version&gt;3.2.4&lt;/spring-boot.version&gt;
    &lt;spring-cloud-alibaba.version&gt;2023.0.1.0&lt;/spring-cloud-alibaba.version&gt;
&lt;/properties&gt;</code></pre>
<ol start="2">
<li>升级Java版本和maven编译版本<code>直接搜索1.8全局替换即可</code>（idea的项目jdk和模块jdk也改一下）</li>
</ol>
<pre><code class="language-xml">&lt;properties&gt;
    &lt;java.version&gt;17&lt;/java.version&gt;
    &lt;maven.compiler.source&gt;17&lt;/maven.compiler.source&gt;
    &lt;maven.compiler.source&gt;17&lt;/maven.compiler.source&gt;
    &lt;project.build.sourceEncoding&gt;UTF-8&lt;/project.build.sourceEncoding&gt;
    &lt;spring-cloud.version&gt;2023.0.1&lt;/spring-cloud.version&gt;
    &lt;spring-boot.version&gt;3.2.4&lt;/spring-boot.version&gt;
    &lt;spring-cloud-alibaba.version&gt;2023.0.1.0&lt;/spring-cloud-alibaba.version&gt;
&lt;/properties&gt;</code></pre>
<ol start="3">
<li>其他的就是小版本微调了，knife4j和mybatis-plus这个调成支持springboot3的</li>
</ol>
<pre><code class="language-xml">&lt;!-- knife4j-jakarta--&gt;
&lt;dependency&gt;
&lt;groupId&gt;com.github.xiaoymin&lt;/groupId&gt;
&lt;artifactId&gt;knife4j-openapi3-jakarta-spring-boot-starter&lt;/artifactId&gt;
&lt;version&gt;4.1.0&lt;/version&gt;
&lt;/dependency&gt;

&lt;dependency&gt;
    &lt;groupId&gt;com.baomidou&lt;/groupId&gt;
    &lt;artifactId&gt;mybatis-plus-spring-boot3-starter&lt;/artifactId&gt;
    &lt;version&gt;3.5.6&lt;/version&gt;
&lt;/dependency&gt;</code></pre>
<h2 id="heading-3">配置问题</h2>
<ol>
<li>
<p>服务注册和配置中心兼容配置</p>
<p><strong>可能会出现这个问题，但是我重启以后又没这个报错了，玄学。</strong></p>
</li>
</ol>
<pre><code class="language-java">Description: No spring.config.import property has been defined Action: Add a spring.config.import=nacos: property to your configuration. If configuration is not required add spring.config.import=optional:nacos: instead. To disable this check, set spring.cloud.nacos.config.import-check.enabled=false.</code></pre>
<p>解决方法：</p>
<p>引入依赖：</p>
<pre><code class="language-xml">&lt;dependency&gt;
    &lt;groupId&gt;org.springframework.cloud&lt;/groupId&gt;
    &lt;artifactId&gt;spring-cloud-starter-bootstrap&lt;/artifactId&gt;
&lt;/dependency&gt;</code></pre>
<p>bootstrap.yml配置注册中心地址(ps：帖子上说需要配置，但是我试了不配置也可以)</p>
<pre><code class="language-yml">spring:
  cloud:
    config:
      enabled: true
      uri: http://127.0.0.1:8848</code></pre>
<p>stackoverflow原文地址：<a href="https://stackoverflow.com/questions/67507452/no-spring-config-import-property-has-been-defined" target="_blank" rel="noopener noreferrer">https://stackoverflow.com/questions/67507452/no-spring-config-import-property-has-been-defined</a></p>
<ol start="2">
<li>
<p>解决spring循环依赖</p>
<p>​        这个相信都不陌生，springboot2.6以后就默认不支持循环依赖了，如果有用到这个（比如解决事务失效问题），需要在<strong>bootstrap.yml</strong>配置文件中开启(不要在配置中心配置)</p>
<pre><code class="language-yml">spring:
 main:
   allow-circular-references: true</code></pre>
</li>
<li>
<p>openfeign版本</p>
<p>低版本的openfeign不用负载均衡那个依赖，如果升级的话直接用starter的话就是最新的，引入的话这样就可以</p>
</li>
</ol>
<pre><code class="language-xml">&lt;dependency&gt;
    &lt;groupId&gt;org.springframework.cloud&lt;/groupId&gt;
    &lt;artifactId&gt;spring-cloud-starter-openfeign&lt;/artifactId&gt;
&lt;/dependency&gt;
&lt;dependency&gt;
    &lt;groupId&gt;org.springframework.cloud&lt;/groupId&gt;
    &lt;artifactId&gt;spring-cloud-starter-loadbalancer&lt;/artifactId&gt;
&lt;/dependency&gt;</code></pre>
<ol start="4">
<li>
<p>springcloud gateway升级</p>
<p>从Spring Cloud 2020开始弃用了Ribbon，因此Spring Cloud Alibaba在2021版本nacos中删除了Ribbon的jar包，因此无法通过lb路由到指定微服务，出现了503情况。因此需要加入这个依赖才可以负载均衡</p>
</li>
</ol>
<pre><code class="language-xml">&lt;!--客户端负载均衡loadbalancer--&gt;
&lt;dependency&gt;
    &lt;groupId&gt;org.springframework.cloud&lt;/groupId&gt;
    &lt;artifactId&gt;spring-cloud-starter-loadbalancer&lt;/artifactId&gt;
&lt;/dependency&gt;</code></pre>
<ol start="5">
<li>剩下的不影响运行就不升级了，druid我为了求稳，升到了1.2.20</li>
<li>24-5-12日补充，idea中maven工具升级以后启动lombok会报错</li>
</ol>
<pre><code class="language-java">class lombok.javac.apt.LombokProcessor (in unnamed module @0x619f2afc) cannot access class com.sun.tools.javac.processing.JavacProcessingEnvironment (in module jdk.compiler) because module jdk.compiler does not export com.sun.tools.javac.processing to unnamed module @0x619f2afc</code></pre>
<p>解决方案：升级版本到<code>1.18.30</code></p>
<h2 id="heading-4">升级后的版本</h2>
<ol>
<li>
<p><strong>Java：</strong></p>
<ul>
<li><strong>jdk17</strong></li>
<li>maven3.8.1</li>
</ul>
</li>
<li>
<p><strong>SpringCloud部分：</strong></p>
<ul>
<li><strong>spring cloud版本：2023.0.1</strong></li>
<li><strong>spring cloud alibaba：2023.0.1.0</strong></li>
</ul>
</li>
<li>
<p><strong>SpringBoot：3.2.4</strong></p>
</li>
<li>
<p>其他依赖</p>
<ul>
<li>lombok：<strong>1.18.30</strong></li>
<li>fastjson：1.2.83</li>
<li><strong>druid：1.2.20</strong></li>
<li>mysql：8.0.30</li>
<li><strong>mybatis-plus：3.5.6(更换包)</strong></li>
<li><strong>knife4j：4.1.0（更换包）</strong></li>
<li><strong>openfeign：3.0.2（更换成cloud-starter，具体版本是4.1.1）</strong></li>
</ul>
<p>引入新的依赖</p>
</li>
</ol>
<ul>
<li><strong>spring-cloud-starter-bootstrap</strong></li>
<li><strong>spring-cloud-starter-loadbalancer</strong></li>
</ul>
</article>
