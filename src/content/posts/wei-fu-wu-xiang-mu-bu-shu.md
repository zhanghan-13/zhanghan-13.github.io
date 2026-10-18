---
id: "wei-fu-wu-xiang-mu-bu-shu"
title: "微服务项目部署"
date: "2024-10-13"
excerpt: "前言 微服务目录结构参考：黑马 学成在线微服务模版 打包教程：鱼皮微服务打包教程：https://www.bilibili.com/video/BV1Cp4y1F7eA?vd_source=a5916dd0c483eddb098610c4f50ae397 这个教程跟鱼皮的不太重复，扩展点如下： 目录"
category: "后端"
tags: ["docker","docker-compose","微服务项目"]
wordCount: 1461
headings: [{"level":2,"id":"%E5%89%8D%E8%A8%80","text":"前言"},{"level":2,"id":"%E9%A1%B9%E7%9B%AE%E6%95%B4%E7%90%86","text":"项目整理"},{"level":2,"id":"%E6%B5%81%E7%A8%8B","text":"流程"},{"level":3,"id":"%E5%AE%89%E8%A3%85docker%E5%8F%8A%E7%9B%B8%E5%85%B3%E7%BB%84%E4%BB%B6","text":"安装docker及相关组件"},{"level":3,"id":"%E5%90%AF%E5%8A%A8%E9%A1%B9%E7%9B%AE","text":"启动项目"},{"level":2,"id":"%E8%B8%A9%E8%B8%A9%E5%9D%91","text":"踩踩坑"},{"level":2,"id":"%E9%99%84%E5%BD%95","text":"附录"}]
imageOmitted: false
legacySlug: "wei-fu-wu-xiang-mu-bu-shu"
sourceUrl: "https://www.bugdesigner.cn/archives/wei-fu-wu-xiang-mu-bu-shu"
---

<article id="content"><h2 id="%E5%89%8D%E8%A8%80">前言</h2>
<p>微服务目录结构参考：黑马 学成在线微服务模版</p>
<p>打包教程：鱼皮微服务打包教程：<a href="https://www.bilibili.com/video/BV1Cp4y1F7eA?vd_source=a5916dd0c483eddb098610c4f50ae397" target="_blank" rel="noopener noreferrer">https://www.bilibili.com/video/BV1Cp4y1F7eA?vd_source=a5916dd0c483eddb098610c4f50ae397</a></p>
<p>这个教程跟鱼皮的不太重复，扩展点如下：</p>
<ol><li><p>目录结构不同。<strong>相应的docker-compose需要定制化调整</strong></p>
</li><li><p>引入了python微服务。<strong>不同语言的服务如何一键部署</strong></p>
</li><li><p>解决了<strong>docker 仓库的网络问题</strong>，拉取镜像不再是烦恼</p>
</li><li><p>又引入了es和xxl-job两个中间件</p>
</li><li><p>小小的踩了一下坑</p>
</li></ol>
<h2 id="%E9%A1%B9%E7%9B%AE%E6%95%B4%E7%90%86">项目整理</h2>
<div><table><colgroup><col><col><col><col></colgroup><tbody><tr><th colspan="1" rowspan="1"><p>服务名</p>
</th><th colspan="1" rowspan="1"><p>端口</p>
</th><th colspan="1" rowspan="1"><p>版本</p>
</th><th colspan="1" rowspan="1"><p>备注</p>
</th></tr><tr><td colspan="1" rowspan="1"><p>nacos</p>
</td><td colspan="1" rowspan="1"><p>8848</p>
</td><td colspan="1" rowspan="1"><p>2.3.2</p>
</td><td colspan="1" rowspan="1"><p>注册配置中心</p>
</td></tr><tr><td colspan="1" rowspan="1"><p>RabbitMQ</p>
</td><td colspan="1" rowspan="1"><p>5672|15672</p>
</td><td colspan="1" rowspan="1"><p>3.13.2</p>
</td><td colspan="1" rowspan="1"><p>消息队列、 guest |guest</p>
</td></tr><tr><td colspan="1" rowspan="1"><p>ElasticSearch</p>
</td><td colspan="1" rowspan="1"><p>9200</p>
</td><td colspan="1" rowspan="1"><p>8.11.1</p>
</td><td colspan="1" rowspan="1"><p>搜索引擎、elastic|123456</p>
</td></tr><tr><td colspan="1" rowspan="1"><p>Redis</p>
</td><td colspan="1" rowspan="1"><p>6379</p>
</td><td colspan="1" rowspan="1"><p>5.0.14</p>
</td><td colspan="1" rowspan="1"><p>缓存</p>
</td></tr><tr><td colspan="1" rowspan="1"><p>MySQL</p>
</td><td colspan="1" rowspan="1"><p>3306</p>
</td><td colspan="1" rowspan="1"><p>8.0.30</p>
</td><td colspan="1" rowspan="1"><p>数据库</p>
</td></tr><tr><td colspan="1" rowspan="1"><p>xxl-job</p>
</td><td colspan="1" rowspan="1"><p>9000</p>
</td><td colspan="1" rowspan="1"><p></p>
</td><td colspan="1" rowspan="1"><p>分布式定时任务</p>
</td></tr><tr><td colspan="1" rowspan="1"><p>Python服务</p>
</td><td colspan="1" rowspan="1"><p>10086</p>
</td><td colspan="1" rowspan="1"><p></p>
</td><td colspan="1" rowspan="1"><p>爬虫服务</p>
</td></tr><tr><td colspan="1" rowspan="1"><p>ischool-gateway</p>
</td><td colspan="1" rowspan="1"><p>9001</p>
</td><td colspan="1" rowspan="1"><p></p>
</td><td colspan="1" rowspan="1"><p>网关微服务</p>
</td></tr><tr><td colspan="1" rowspan="1"><p>ischool-user</p>
</td><td colspan="1" rowspan="1"><p>9002</p>
</td><td colspan="1" rowspan="1"><p></p>
</td><td colspan="1" rowspan="1"><p>用户微服务</p>
</td></tr><tr><td colspan="1" rowspan="1"><p>ischool-search</p>
</td><td colspan="1" rowspan="1"><p>9003</p>
</td><td colspan="1" rowspan="1"><p></p>
</td><td colspan="1" rowspan="1"><p>搜索微服务</p>
</td></tr><tr><td colspan="1" rowspan="1"><p>ischool-community</p>
</td><td colspan="1" rowspan="1"><p>9004</p>
</td><td colspan="1" rowspan="1"><p></p>
</td><td colspan="1" rowspan="1"><p>社区微服务</p>
</td></tr><tr><td colspan="1" rowspan="1"><p>crawl-announcement-executor</p>
</td><td colspan="1" rowspan="1"><p>9005</p>
</td><td colspan="1" rowspan="1"><p></p>
</td><td colspan="1" rowspan="1"><p>和搜索微服务在一个微服务下，只需暴露端口</p>
</td></tr></tbody></table>
</div>
<p>创建Docker-compose和dockerfile文件</p>
<ul><li><p>目前Python程序写入数据库和Java程序调用Python程序都写死了ip，先将就着用</p>
</li></ul>
<h2 id="%E6%B5%81%E7%A8%8B">流程</h2>
<h3 id="%E5%AE%89%E8%A3%85docker%E5%8F%8A%E7%9B%B8%E5%85%B3%E7%BB%84%E4%BB%B6">安装docker及相关组件</h3>
<p>docker官方文档：<a href="https://docs.docker.com/engine/install/centos/#set-up-the-repository" target="_blank" rel="noopener noreferrer">CentOS 操作系统 |Docker 文档</a></p>
<ol><li><p>安装软件包并设置存储库</p>
<pre><code class="language-SHELL">sudo yum install -y yum-utils
sudo yum-config-manager --add-repo https://download.docker.com/linux/centos/docker-ce.repo</code></pre>
</li><li><p>在安装docker前，执行下面命令配置一下镜像，不然安装不成功</p>
<blockquote><pre><code>           ​   24年中不知道国家出于什么方向的考虑，把docker源和国内主流的docker镜像源全封了，包括但不限于阿里、各家大学的镜像源。因此下载的时候需要费一些功夫</code></pre>
</blockquote>
<pre><code class="language-shell">sudo mkdir -p /etc/docker  #创建目录

sudo touch /etc/docker/daemon.json   # 创建文件

sudo vi /etc/docker/daemon.json      # 添加镜像配置</code></pre>
<p>PS：如果安装过docker直接vi就行了，不用创建目录和文件</p>
<p>镜像源是这个直接粘贴到上面那个文件中，注意这些都可能会被国家封了，到时候需要自己找镜像源</p>
<pre><code class="language-json">{
"registry-mirrors": ["https://docker.1panel.live", "https://hub.rat.dev/", "https://docker.chenby.cn", "https://docker.m.daocloud.io"]
}</code></pre>
</li><li><p>再去下载docker和docker套件就好了，注意<strong>网络不稳定，可能失败，再重装一下即可</strong></p>
<pre><code class="language-shell">sudo yum install docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin</code></pre>
</li><li><p>验证是否安装成功</p>
<pre><code class="language-shell">sudo systemctl start docker

sudo docker run hello-world   # 出现hello docker就显示安装成功了</code></pre>
</li></ol>
<h3 id="%E5%90%AF%E5%8A%A8%E9%A1%B9%E7%9B%AE">启动项目</h3>
<ol><li><p>安装maven</p>
<pre><code class="language-shell">sudo yum install maven</code></pre>
</li><li><p>打包  (注意时间可能较长)</p>
<pre><code class="language-shell">sudo mvn package -DskipTests</code></pre>
<blockquote><p>我推荐直接在本地打jar包上传到远程，这样步骤1、2就不用做了，好像在云服务器打还会出现找不到java的情况需要安装java，可能是我maven配置有问题</p>
</blockquote>
</li><li><p>执行docker-compose文件命令</p>
<pre><code class="language-shell">sudo docker compose -f docker-compose.env.yml up
sudo docker compose -f docker-compose.service.yml up</code></pre>
</li></ol>
<p>注意：发布到线上还需要做两件事情：</p>
<ol><li><p>同步nacos配置</p>
</li><li><p>创建mysql表结构</p>
</li><li><p>xxl-job新建执行器、同步xxl-job表结构</p>
</li><li><p>es新建索引</p>
</li></ol>
<h2 id="%E8%B8%A9%E8%B8%A9%E5%9D%91">踩踩坑</h2>
<p>如果同时通过命令行或docker-compose和内部配置文件指定了环境，会以前者的环境为准</p>
<p>1：解决java -jar打包失败报<code>ischool-user-service       | no main manifest attribute, in /app/iSchool-user-1.0-SNAPSHOT.jar</code></p>
<p>给需要打jar包的微服务加上这段配置</p>
<p>！注意别删除之前的配置，不然可能有时候你Java代码不写参数名本来可以跑但是编译以后由于没有带参数导致跑不了了</p>
<pre><code class="language-xml">    &lt;build&gt;
        &lt;plugins&gt;
            &lt;plugin&gt;
                &lt;groupId&gt;org.springframework.boot&lt;/groupId&gt;
                &lt;artifactId&gt;spring-boot-maven-plugin&lt;/artifactId&gt;
                &lt;executions&gt;
                    &lt;execution&gt;
                        &lt;id&gt;repackage&lt;/id&gt;
                        &lt;goals&gt;
                            &lt;goal&gt;repackage&lt;/goal&gt;
                        &lt;/goals&gt;
                    &lt;/execution&gt;
                &lt;/executions&gt;
            &lt;/plugin&gt;
        &lt;/plugins&gt;
    &lt;/build&gt;</code></pre>
<p>2：解决redis RDB没有权限问题</p>
<pre><code class="language-shell">sudo chown -R 1000:1000 /home/code/data/.redis-data
sudo chmod -R 777  /home/code/data/.redis-data</code></pre>
<p>解决es没有获得节点锁的问题</p>
<pre><code class="language-shell">sudo chown -R 1000:1000 /home/code/data/.elasticsearch-data
sudo chmod -R 777  /home/code/data/.elasticsearch-data</code></pre>
<p>3：解决es访问失败问题(加上安全配置)</p>
<pre><code class="language-yaml">  elasticsearch:
    image: elasticsearch:8.11.1
    container_name: ischool-elasticsearch
    environment:
      - xpack.security.enabled=false
      - discovery.type=single-node
      - ELASTIC_PASSWORD=123456
      - ES_JAVA_OPTS=-Xms1g -Xmx1g # 一定要加，不然低配云服务器内存会被撑爆
    ports:
      - "9200:9200"
    volumes:
      - ./.elasticsearch-data:/usr/share/elasticsearch/data
    networks:
      - mynetwork</code></pre>
<p>4：解决使用element-plus组件库内置img属性时图片不生效问题。是因为vite默认不会处理某种格式的图片，nginx加一个转发即可</p>
<pre><code class="language-nginx">location /public/ {
    alias /usr/share/nginx/html/dist/;  # 图片路径
}</code></pre>
<h2 id="%E9%99%84%E5%BD%95">附录</h2>
<p>查看停止的docker容器日志：</p>
<pre><code class="language-shell">docker inspect --format '{{.LogPath}}' 60f486ec7c33
cat xxx</code></pre>
<p>删除所有容器和容器镜像</p>
<pre><code class="language-shell">docker rm -f $(docker ps -aq)

docker rmi -f $(docker images -q)</code></pre>
<p>修改mysql容器密码（没改密码，有个人把我mysql表和数据全删了！！！真的无语，不能理解这种人的动机）：</p>
<pre><code class="language-shell">docker exec -it ischool-mysql bash
mysql -u root -p
ALTER USER 'root'@'localhost' IDENTIFIED BY 'xxx';</code></pre>
<p>docker-compose模版与各个微服务的Dockerfile链接：<a href="https://github.com/AZCodingAccount/iSchool" target="_blank" rel="noopener noreferrer"> 智搜通—大数据量下的综合性教务公告检索平台</a></p>
<p>根据自己需要改写配置文件，<strong>线上中间件一定要设置密码，接口文档不要暴露出来（不过你不配nginx转发好像默认就404hh）。</strong></p>
<p>​       然后我们一般的处理方式是创建一个开发环境和一个生产环境的配置文件，在这种场景下，每个微服务的<strong>生产环境配置文件一般写一个nacos配置即可</strong>，剩下配置比如mysql账号密码，网关转发配置的在线上nacos里面配置。本地调通发到线上解决这个docker相关配置文件编写即可，需要帮助可进qq粉丝群提问，我看到都会答疑的！</p>
</article>
