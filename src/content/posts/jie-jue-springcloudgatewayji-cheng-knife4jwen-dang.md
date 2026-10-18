---
id: "jie-jue-springcloudgatewayji-cheng-knife4jwen-dang"
title: "解决SpringCloudGateway集成knife4j文档"
date: "2024-05-04"
excerpt: "前言 无力吐槽，不知道是knife4j的问题还是swagger的问题，这个微服务网关集成路径问题折磨了我两个小时，官方文档的配置也跑不起来，作者联系不上，交流群加不进去,网上的资源也很少，大多数不清不楚的，下面总结一下怎么能让这个微服务网关跑起来。 版本：springboot2.3.7.RELEAS"
category: ""
tags: ["knife4j","spring cloud gateway"]
wordCount: 807
headings: [{"level":2,"id":"heading-1","text":"前言"},{"level":2,"id":"heading-2","text":"引入依赖"},{"level":2,"id":"heading-3","text":"出现问题"},{"level":2,"id":"heading-4","text":"解决方法"},{"level":2,"id":"heading-5","text":"PS"}]
imageOmitted: false
legacySlug: "jie-jue-springcloudgatewayji-cheng-knife4jwen-dang"
sourceUrl: "https://www.bugdesigner.cn/archives/jie-jue-springcloudgatewayji-cheng-knife4jwen-dang"
---

<article id="content"><h2 id="heading-1">前言</h2>
<p>​       无力吐槽，不知道是knife4j的问题还是swagger的问题，这个微服务网关集成路径问题折磨了我两个小时，官方文档的配置也跑不起来，作者联系不上，交流群加不进去,网上的资源也很少，大多数不清不楚的，下面总结一下怎么能让这个微服务网关跑起来。</p>
<p>版本：springboot2.3.7.RELEASE，spring cloud alibaba2.2.6.RELEASE ，springcloud Hoxton.SR9</p>
<p>其实上面的版本作用不大，主要是springboot的版本，2和3有区别，这个我在上一个博客里面说过</p>
<h2 id="heading-2">引入依赖</h2>
<p>每个服务都引入一个这个依赖即可：</p>
<pre><code class="language-pom">&lt;!--        knife4j--&gt;
&lt;dependency&gt;
    &lt;groupId&gt;com.github.xiaoymin&lt;/groupId&gt;
    &lt;artifactId&gt;knife4j-openapi3-spring-boot-starter&lt;/artifactId&gt;
    &lt;version&gt;4.3.0&lt;/version&gt;
&lt;/dependency&gt;</code></pre>
<p>网关服务引入这个依赖</p>
<pre><code class="language-pom">     &lt;!--        文档--&gt;
    &lt;dependency&gt;
        &lt;groupId&gt;com.github.xiaoymin&lt;/groupId&gt;
        &lt;artifactId&gt;knife4j-gateway-spring-boot-starter&lt;/artifactId&gt;
        &lt;version&gt;4.3.0&lt;/version&gt;
    &lt;/dependency&gt;</code></pre>
<p>其实这个时候你访问每个服务的接口文档已经可以访问到了，但是需要集成的话，需要在网关上面加这个配置</p>
<pre><code class="language-yaml">knife4j:
  gateway:
    enabled: true
    # 指定服务发现的模式聚合微服务文档，并且是默认`default`分组
    strategy: discover
    discover:
      enabled: true
      # 指定版本号(Swagger2|OpenAPI3)
      version : openapi3
      # 需要排除的微服务(eg:网关服务)
      excluded-services:
        - ischool-gateway</code></pre>
<h2 id="heading-3">出现问题</h2>
<p>上述就是官方推荐的步骤，然而错了！！！这是我可以访问swagger数据成功的url：<code>http://localhost:8901/user/v3/api-docs</code>，解释一下上面的url结构，</p>
<ul>
<li>user是访问前缀，我的网关会根据这个转发到user微服务上面</li>
<li>v3/api-docs是openapi3规范的前缀</li>
<li>default是组名</li>
</ul>
<p>我如果不加这个组名是可以访问成功的，但是不知道为啥，knife4j访问的时候自动加上了组名default，现在变成了<code>http://localhost:8901/user/v3/api-docs/default</code>，这下直接404了（我猜测它是默认default分组，但是openapi3规范不兼容，如果默认是default的话就直接省略？）。</p>
<h2 id="heading-4">解决方法</h2>
<p>既然他多个default，那我就在拦截器里面把他给cut掉就可以了，在定义的网关过滤器里面加一个这样的代码（过滤器order为-1）</p>
<pre><code class="language-java">// 处理knife4j的uri
String path = exchange.getRequest().getURI().getPath();
if (path.contains("/v3/api-docs")) {
    String newPath = path.substring(0, path.length() - "/default".length());
    ServerWebExchange modifiedExchange = exchange.mutate()
            .request(exchange.getRequest().mutate().path(newPath).build())
            .build();
    return chain.filter(modifiedExchange);
}</code></pre>
<p>最后大功告成</p>
<img src="/images/7032245ac55c497added.png" alt="image-20240504194210015" width="2880" height="1630" loading="lazy" decoding="async">
<h2 id="heading-5">PS</h2>
<p>可能有些同学有自定义组的需求，我也试过了，感觉<strong>自己用的话比较鸡肋</strong>，具体就是配置式的话就是这样</p>
<pre><code class="language-yaml"># springdoc-openapi项目配置
springdoc:
  swagger-ui:
    path: /swagger-ui.html
    tags-sorter: alpha
    operations-sorter: alpha
  api-docs:
    path: /v3/api-docs
  group-configs:
    - group: 'user'
      paths-to-match: '/**'
      packages-to-scan: com.ischool.controller</code></pre>
<p>网关还需要兼容一下</p>
<pre><code class="language-yaml">  service-config:
    ischool-user:
      order: 0
      group-name: 用户
      group-names:
        - 分组1
    ischool-community:
      order: 1
      group-name: 大众点评
      group-names:
        - 分组2</code></pre>
<p>这样的话访问数据的url就变成<code>http://localhost:8901/user/v3/api-docs/default/组名</code>了，<strong>上面的切割字符串代码就不管用了</strong>，自己把default切了就行。</p>
<p>剩下的自定义属性和注释啥的就很简单了，openapi3的规范，我自己开发的话是懒得写......</p>
</article>
