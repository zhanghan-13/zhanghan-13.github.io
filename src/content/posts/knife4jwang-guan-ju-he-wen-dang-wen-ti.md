---
id: "knife4jwang-guan-ju-he-wen-dang-wen-ti"
title: "Knife4j网关聚合文档问题"
date: "2024-05-22"
excerpt: "Knife4j使用的三个问题，全是版本问题，聚合博客： Knife4j请求文档异常 - bugDesigner的博客 springboot版本问题 解决SpringCloudGateway集成knife4j文档 - bugDesigner的博客 springcloud技术栈版本问题 版本 <!--"
category: "后端"
tags: ["/v3/api-docs/swagger-config","接口文档","网关聚合"]
wordCount: 363
headings: [{"level":2,"id":"heading-1","text":"版本"},{"level":2,"id":"heading-2","text":"问题描述"},{"level":2,"id":"heading-3","text":"解决方法"}]
imageOmitted: false
legacySlug: "knife4jwang-guan-ju-he-wen-dang-wen-ti"
sourceUrl: "https://www.bugdesigner.cn/archives/knife4jwang-guan-ju-he-wen-dang-wen-ti"
---

<article id="content"><p>Knife4j使用的三个问题，全是版本问题，聚合博客：</p>
<p><a href="/posts/knife4jqing-qiu-wen-dang-yi-chang/">Knife4j请求文档异常 - bugDesigner的博客</a> springboot版本问题</p>
<p><a href="/posts/jie-jue-springcloudgatewayji-cheng-knife4jwen-dang/">解决SpringCloudGateway集成knife4j文档 - bugDesigner的博客</a> springcloud技术栈版本问题</p>
<h2 id="heading-1">版本</h2>
<pre><code class="language-xml">&lt;!--        文档--&gt;
&lt;dependency&gt;
    &lt;groupId&gt;com.github.xiaoymin&lt;/groupId&gt;
    &lt;artifactId&gt;knife4j-gateway-spring-boot-starter&lt;/artifactId&gt;
    &lt;version&gt;4.3.0&lt;/version&gt;
&lt;/dependency&gt;

&lt;!--        knife4j--&gt;
&lt;dependency&gt;
    &lt;groupId&gt;com.github.xiaoymin&lt;/groupId&gt;
    &lt;artifactId&gt;knife4j-openapi3-jakarta-spring-boot-starter&lt;/artifactId&gt;
    &lt;version&gt;4.1.0&lt;/version&gt;
&lt;/dependency&gt;</code></pre>
<h2 id="heading-2">问题描述</h2>
<p>之前将SpringCloud和SpringBoot版本升级到了springboot3和springcloud2023，具体参考这个<a href="/posts/wei-fu-wu-xiang-mu-java8sheng-ji-zhi-nan/">微服务项目Java8升级指南 - bugDesigner的博客</a>，这次又出现了兼容性问题，表现形式是：</p>
<p>访问ip+port+/v3/api-docs/swagger-config时返回的并不是需要的各个微服务的地址，而是下面的格式</p>
<pre><code class="language-json">{
    "configUrl": "/v3/api-docs/swagger-config",
    "oauth2RedirectUrl": "http://localhost:8901/webjars/swagger-ui/oauth2-redirect.html",
    "url": "/v3/api-docs",
    "validatorUrl": ""
}</code></pre>
<p>因此就导致访问http:localhost:port/doc.html这个找不到每个微服务的地址，就显示个默认的分组，正常情况下是下面这样</p>
<pre><code class="language-json">{
  "configUrl": "/v3/api-docs/swagger-config",
  "oauth2RedirectUrl": "",
  "operationsSorter": "alpha",
  "tagsSorter": "alpha",
  "urls": [
    {
      "name": "ischool-community",
      "url": "/community/v3/api-docs",
      "contextPath": "/community",
      "id": "aXNjaG9vbC1jb21tdW5pdHkvY29tbXVuaXR5L3YzL2FwaS1kb2NzL2NvbW11bml0eQ==",
      "serviceName": "ischool-community",
      "discovered": true
    },
    {
      "name": "ischool-user",
      "url": "/user/v3/api-docs",
      "contextPath": "/user",
      "id": "aXNjaG9vbC11c2VyL3VzZXIvdjMvYXBpLWRvY3MvdXNlcg==",
      "serviceName": "ischool-user",
      "discovered": true
    }
  ],
  "validatorUrl": ""
}</code></pre>
<h2 id="heading-3">解决方法</h2>
<p>升级就可以了，全部升级到官方的最新版本</p>
<pre><code class="language-xml">&lt;!--        文档--&gt;
&lt;dependency&gt;
    &lt;groupId&gt;com.github.xiaoymin&lt;/groupId&gt;
    &lt;artifactId&gt;knife4j-gateway-spring-boot-starter&lt;/artifactId&gt;
    &lt;version&gt;4.5.0&lt;/version&gt;
&lt;/dependency&gt;

&lt;!--        knife4j--&gt;
&lt;dependency&gt;
    &lt;groupId&gt;com.github.xiaoymin&lt;/groupId&gt;
    &lt;artifactId&gt;knife4j-openapi3-jakarta-spring-boot-starter&lt;/artifactId&gt;
    &lt;version&gt;4.5.0&lt;/version&gt;
&lt;/dependency&gt;</code></pre>
</article>
