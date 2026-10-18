---
id: "jie-jue-es-7.14ban-ben-hou-xu-yao-pei-zhi-mi-ma-de-wen-ti"
title: "解决ES 7.14版本后需要配置密码的问题"
date: "2024-05-23"
excerpt: "首先是ES和kibana的下载，下面这个网址就可以，很香Past Releases of Elastic Stack Software | Elastic，如果你安装的新版本，不显式开启密码验证，使用的时候很烦，上面会弹出一个注释提醒你去开启 #! Elasticsearch built-in se"
category: "后端"
tags: ["elastic-search","微服务"]
wordCount: 334
headings: []
imageOmitted: false
legacySlug: "jie-jue-es-7.14ban-ben-hou-xu-yao-pei-zhi-mi-ma-de-wen-ti"
sourceUrl: "https://www.bugdesigner.cn/archives/jie-jue-es-7.14ban-ben-hou-xu-yao-pei-zhi-mi-ma-de-wen-ti"
---

<article id="content"><p>首先是ES和kibana的下载，下面这个网址就可以，很香<a href="https://www.elastic.co/cn/downloads/past-releases" target="_blank" rel="noopener noreferrer">Past Releases of Elastic Stack Software | Elastic</a>，如果你安装的新版本，不显式开启密码验证，使用的时候很烦，上面会弹出一个注释提醒你去开启</p>
<pre><code class="language-json">#! Elasticsearch built-in security features are not enabled. Without authentication, your cluster could be accessible to anyone. See https://www.elastic.co/guide/en/elasticsearch/reference/7.17/security-minimal-setup.html to enable security.</code></pre>
<ol>
<li>首先进入es安装目录<code>/config/elasticsearch.yml</code>，添加下面配置：</li>
</ol>
<pre><code class="language-yml">xpack.security.enabled: true</code></pre>
<ol start="2">
<li>接下来重启一下，新开一个控制台，输入命令</li>
</ol>
<pre><code class="language-bash">elasticsearch-setup-passwords interactive</code></pre>
<p>接下来设置密码即可</p>
<ol start="3">
<li>设置完毕以后要注意，修改kibana的配置文件，让它能连接上es，也是进入kibana安装目录<code>/bin/kibana.yml</code>，添加配置项</li>
</ol>
<pre><code class="language-yml">elasticsearch.username: "elastic"
elasticsearch.password: "123456"</code></pre>
<ol start="4">
<li>接下来可以访问{host}:5601就可以正常访问了，但是控制台还提示你生成加密秘钥，这个也一块生成了就可以了，使用下面这个命令</li>
</ol>
<pre><code class="language-bash">kibana-encryption-keys.bat generate</code></pre>
<blockquote>
<p>注意不要在kibana.yml里面添加这个加密秘钥，Gemini提示让我直接显式添加，结果kibana直接起不来，应该是老版本显式声明，新版本这样的配置已经移除了，取而代之的是生成在一些加密文件里</p>
</blockquote>
</article>
