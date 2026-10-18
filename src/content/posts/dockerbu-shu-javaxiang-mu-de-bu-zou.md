---
id: "dockerbu-shu-javaxiang-mu-de-bu-zou"
title: "Docker部署Java项目的步骤"
date: "2023-10-11"
excerpt: "本文共6017个字 Docker的介绍 Docker部署项目非常简便快速一致。对于一些常见的软件如MySQL，nginx等，都可以一键从DockerHub里面拉取下来（基本常用的软件都有软件官方负责维护的镜像）。相较于传统的部署，手动去找安装包然后传到服务器上进行解压一行一行敲各种命令，Docker"
category: "后端"
tags: ["docker","Java"]
wordCount: 2926
headings: [{"level":2,"id":"heading-1","text":"Docker的介绍"},{"level":2,"id":"heading-2","text":"详细流程"},{"level":3,"id":"heading-3","text":"安装Docker"},{"level":3,"id":"heading-4","text":"安装Mysql(Latest)"},{"level":3,"id":"heading-5","text":"安装Nginx(Latest)"},{"level":3,"id":"heading-6","text":"编写DockerFile文件运行jar包"},{"level":2,"id":"heading-7","text":"大招—>DockerCompose"},{"level":2,"id":"heading-8","text":"番外篇(踩坑点)"}]
imageOmitted: false
legacySlug: "dockerbu-shu-javaxiang-mu-de-bu-zou"
sourceUrl: "https://www.bugdesigner.cn/archives/dockerbu-shu-javaxiang-mu-de-bu-zou"
---

<article id="content"><p><span>本文共6017个字</span></p>
<h2 id="heading-1">Docker的介绍</h2>
Docker部署项目非常简便快速一致。对于一些常见的软件如MySQL，nginx等，都可以一键从DockerHub里面拉取下来（基本常用的软件都有软件官方负责维护的镜像）。相较于传统的部署，手动去找安装包然后传到服务器上进行解压一行一行敲各种命令，Docker的优势无疑是巨大的。下面是Docker命令的流程
<pre><code class="language-mermaid">graph LR
  A[安装环境] --&gt; B[挂载数据卷]
   A[安装环境] --&gt; C[配置容器网络互联]
   A[安装环境] --&gt; D[编写自己的镜像文件]
   B[挂载数据卷] --&gt;E[使用Docker run命令/Docker Compose部署]
  C[配置容器网络互联] --&gt; E[使用Docker run命令/Docker Compose部署]
   D[编写自己的镜像文件] --&gt; E[使用Docker run命令/Docker Compose部署]
</code></pre>
对于微服务项目，也就是多打几个包，多编写几个DockerFile，对于集群，就需要用到k8s了，这里就不再赘述了。这里演示部署一个普通的Java项目，步骤一般有三个
<pre><code class="language-mermaid">graph LR
  A[部署Mysql] --&gt; B[后端Java]
  B --&gt; C[前端nginx]
</code></pre>
接下来就简单的说一下每个步骤的流程及用到的一些Docker命令和解释
<h2 id="heading-2">详细流程</h2>
<h3 id="heading-3">安装Docker</h3>
这个命令看自己有没有安装过Docker，如果安装过，就卸载
<pre><code class="language-shell">yum remove docker \
    docker-client \
    docker-client-latest \
    docker-common \
    docker-latest \
    docker-latest-logrotate \
    docker-logrotate \
    docker-engine
</code></pre>
安装 yum库
<pre><code class="language-shell">yum install -y yum-utils
</code></pre>
配置yum源
<pre><code class="language-shell">yum-config-manager --add-repo https://download.docker.com/linux/centos/docker-ce.repo
</code></pre>
最后安装Docker
<pre><code class="language-shell">yum install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
</code></pre>
Docker的基本操作
<pre><code class="language-shell"># 启动Docker
systemctl start docker

# 停止Docker
systemctl stop docker

# 重启
systemctl restart docker

# 设置开机自启
systemctl enable docker

# 执行docker ps命令，如果不报错，说明安装启动成功
docker ps
</code></pre>
配置阿里云镜像

因为DockerHub仓库在国外，国内访问可能比较慢，因此需要配置镜像（类似于Maven仓库）

登录进阿里云官网，直接在搜索栏搜容器镜像服务，如下图

<img src="/images/2ffa857954eda41314eb.png" alt="image-20231010191925485" width="2864" height="1556" loading="lazy" decoding="async">

进入以后直接找到镜像加速器，复制加速器地址

<img src="/images/5716a0f67800f02a4f69.png" alt="image-20231011172234786" width="2880" height="1562" loading="lazy" decoding="async">

然后修改下面的registry-mirrors。
<pre><code class="language-shell"># 创建目录,-p代表递归创建
mkdir -p /etc/docker

# 复制内容，注意把其中的镜像加速地址改成你自己的
tee /etc/docker/daemon.json &lt;&lt;-'EOF'
{
  "registry-mirrors": ["https://xxxx.mirror.aliyuncs.com"]
}
EOF

# 重新加载配置
systemctl daemon-reload

# 重启Docker
systemctl restart docker
</code></pre>
<blockquote>⚠️ <strong>Warning:</strong> 不要忘记创建目录</blockquote>
<h3 id="heading-4">安装Mysql(Latest)</h3>
首先创建一个网段，让这些应用程序可以彼此通信，因为他们的ip不是固定的，接下来就可以根据容器名而非容器ip地址访问容器里面的服务了
<pre><code class="language-shell">docker network create mynetwork
</code></pre>
直接执行下面的命令就可以了，简单解释一下下面的命令，-d代表再起一个进程后台运行，--name指定容器名，-e是环境变量指定时区和密码，-v代表挂载，就是容器和宿主机的一个映射，--network是一个网段，最后这个mysql是镜像名。这些参数按需选择即可，如果没有配置文件或者初始化脚本可以不挂载那两个对应的-v。
<pre><code class="language-shell">docker run -d \
  --name mysql \
  -p 3306:3306 \
  -e TZ=Asia/Shanghai \
  -e MYSQL_ROOT_PASSWORD=your_password \
  -v /home/mysql/data:/var/lib/mysql \
  -v /home/mysql/conf:/etc/mysql/conf.d \
  -v /home/mysql/init:/docker-entrypoint-initdb.d \
  --network mynetwork \
  mysql
</code></pre>
运行完成有一个容器号就代表成功了，如下图：

<img src="/images/1b6c494d9680d5888381.png" alt="image-20231010194744480" width="986" height="171" loading="lazy" decoding="async">

如果需要查看初始化的数据是否成功，可以使用下面的命令进入docker容器，登录进数据库验证
<pre><code class="language-shell">docker exec -it mysql bash
mysql -u root -p your_password
show databases;
</code></pre>
<blockquote>? <strong>tips:</strong>这个执行的run命令就不用自己使用pull命令拉取镜像了，但是需要注意的是，如果你的挂载文件内容\路径需要改的话（比如配置文件，初始化文件）。得把这个images删了重新下，重新run是没有作用的。当然也可以先pull，再run</blockquote>
<strong>mysql配置进阶篇</strong>

data，conf，init都是一个目录，把相应文件放在宿主机目录下即可，mysql run的时候会自动挂载相关文件，init里面的初始化数据库脚本就是sql文件，conf里面的是配置文件

这些挂载点都可以在官网找到，mysql配置文件一般是设置字符编码和访问策略等等。这是我的Java项目的mysql.conf的配置文件
<pre><code class="language-shell">[client]
default_character_set=utf8mb4
[mysql]
default_character_set=utf8mb4
[mysqld]
# 可以让所有主机而非只有本机访问（生产环境不要这么设置，设置一个白名单好一点）
bind-address = 0.0.0.0
# 设置认证策略（高版本可能需要设置）
default_authentication_plugin=mysql_native_password
character_set_server=utf8mb4
collation_server=utf8mb4_unicode_ci
init_connect='SET NAMES utf8mb4'
</code></pre>
<h3 id="heading-5">安装Nginx(Latest)</h3>
从镜像仓库拉取nginx
<pre><code class="language-shell">docker pull nginx
</code></pre>
主要就是把打包以后的前端文件放到指定目录挂载即可，如果需要配置一些代理，还需要配置conf文件，注意网段一致
<pre><code class="language-shell">docker run -d \
  --name nginx \
  -p 80:80 \
  -v /home/nginx/html/dist:/usr/share/nginx/html \
  -v /home/nginx/default.conf:/etc/nginx/conf.d/default.conf \
  --network mynetwork \
  nginx
</code></pre>
测试访问

<code>http://服务器ip:80</code>

default.conf文件我的项目是这么设置的。这个部分需要改的地方就两个，一个是location下面的root改成自己的挂载点，一个是server_name改成自己ip
<pre><code class="language-shell">server {
    listen       80; 
    server_name  xx.xx.xx.xx; # 修改为docker服务宿主机的ip/域名
    
    access_log  /var/log/nginx/host.access.log  main;
    error_log  /var/log/nginx/error.log  error;

    location / {
        root   /usr/share/nginx/html;
        index  index.html index.htm;
        try_files $uri $uri/ /index.html =404;
    }

    error_page   500 502 503 504  /50x.html;
    location = /50x.html {
        root   html;
    }}
</code></pre>
<h3 id="heading-6">编写DockerFile文件运行jar包</h3>
一般的DockerFile文件格式如下
<pre><code class="language-dockerfile"># 基础镜像，这个镜像需要自己去DockerHub里面找官方提供的对应版本的jar包
FROM openjdk:17-jdk-alpine
# 设定时区
ENV TZ=Asia/Shanghai
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime &amp;&amp; echo $TZ &gt; /etc/timezone
# 拷贝jar包，这个项目名需要改成自己的jar包
COPY logistics-project-0.0.1-SNAPSHOT.jar /app.jar
# 入口
ENTRYPOINT ["java", "-jar", "/app.jar"]
</code></pre>
运行DockerFile文件

cd到<code>/home/java</code>目录下，运行下面的命令构建镜像
<pre><code class="language-shell"># -t指定镜像名称
docker build -t logistics .
</code></pre>
直接执行下面的命令启动容器即可
<pre><code class="language-shell">docker run -d \
--name logistics \
-p 8080:8080 \
--network mynetwork \
logistics
</code></pre>
<blockquote>ℹ️ <strong>Info：</strong>前端访问后端程序或者说后端连接数据库的时候可以那个ip地址可以写服务器的ip地址，当然也可以写这个容器名，比如说java程序连接数据库可以写成<code>jdbc:mysql://mysql:3306/数据库名</code></blockquote>
<h2 id="heading-7">大招—&gt;DockerCompose</h2>
跟着上面的流程做下来可能会出现下面这些问题:
<ol>
<li>参数不明确。比如说端口，这次run以后万一忘记了这个映射的端口就还得查找之前的源命令</li>
<li>每次运行都需要重新敲一遍run命令</li>
<li>逻辑上没有关联关系。</li>
<li>需要一个一个部署，很繁琐。</li>
</ol>
<code>上面的第1,2两个问题可以通过编写sh脚本解决</code>

这个时候我们的章鱼哥（DockerCompose）就闪亮登场了，它允许我们把一个项目的启动命令写到一个yml文件中，只需要一个命令就可以部署整个项目，真正做到了<strong>一键部署</strong>。下面给出我的项目的示例，按需修改即可
<pre><code class="language-yml">version: "1.0"			# 项目版本号，自己指定

services:
  mysql:
    image: mysql
    container_name: mysql
    ports:
      - "3306:3306"
    environment:
      TZ: Asia/Shanghai
      MYSQL_ROOT_PASSWORD: your_password
    volumes:
      - "./mysql/conf:/etc/mysql/conf.d"
      - "./mysql/data:/var/lib/mysql"
      - "./mysql/init:/docker-entrypoint-initdb.d"
    networks:
      - mynetwork
  logistics:
    build: 
      context: .			   # context代表上下文，.代表当前目录
      dockerfile: Dockerfile   # 这一项是你编写的DockerFile的文件名
    container_name: logistics
    ports:
      - "8080:8080"
    networks:
      - mynetwork
    depends_on:
      - mysql					# 项目中各服务运行的先后关系，但注意，这个不是绝对精确的运行关系
  nginx:
    image: nginx
    container_name: nginx
    ports:
      - "80:80"					# 如果nginx需要代理多个端口，在后面加-就可以，yml的列表语法 
    volumes:
      - "./nginx/default.conf:/etc/nginx/conf.d/default.conf"
      - "./nginx/html:/usr/share/nginx/html"
    depends_on:
      - logistics
    networks:
      - mynetwork
networks:
  mynetwork:
    name: mynetwork
</code></pre>
<blockquote>ℹ️ <strong>Info:</strong> 编写文件时候需要严格遵循yml语法，比如<code>-</code>号后面需要空格再跟信息，所属关系通过缩进来表示等等。</blockquote>
在本地编写完这个yml文件就可以上传到服务器运行了，需要注意的是，我这里使用的<strong>./相对路径</strong>，因此DockerCompose文件需要上传到<code>/home</code>文件夹下

直接cd到<code>/home</code>目录执行下面这个命令，把自己需要的配置文件和初始化脚本上传到指定目录下面,直接一键部署完成！
<pre><code class="language-shell">docker compose up -d
</code></pre>
<blockquote>❗ <strong>Important:</strong> 如果不在home目录下运行，需要加上-f指定compose文件的路径</blockquote>
DockerCompose常见命令如下(这些命令除了up和down其他都只是在docker 后面加了个compose)
<figure>
<table>
<thead>
<tr>
<th>命令</th>
<th>说明</th>
</tr>
</thead>
<tbody>
<tr>
<td>up</td>
<td>创建并启动所有service</td>
</tr>
<tr>
<td>down</td>
<td>停止并移除所有容器，网络</td>
</tr>
<tr>
<td>ps</td>
<td>列出所有启动的容器</td>
</tr>
<tr>
<td>start|stop|restart</td>
<td>启动|停止|重启容器</td>
</tr>
<tr>
<td>logs</td>
<td>查看指定容器日志</td>
</tr>
<tr>
<td>exec</td>
<td>进入指定容器</td>
</tr>
</tbody>
</table>
</figure>
<h2 id="heading-8">番外篇(踩坑点)</h2>
我这个项目是之前帮学长写的一个小系统，之前是直接一行一行敲命令部署的。正好今天被黑客直接把服务器密码给我爆破了，因此重装一下系统，也练习一下Docker。部署花了我5个小时时间，期间踩坑无数。

<strong>安装Mysql。</strong>

执行脚本的时候出了问题。第一次我使用mysqldump导出的sql脚本，他没给我创建数据库和使用数据库，结果让我找半天没找出来问题，当时一度以为是挂载出了问题，改了一下sql脚本正常了

后来检查出来字符编码又乱码，后面没办法加了个设置字符编码和访问权限的配置文件并且把mysql数据库版本调成8.0.30字符编码才正常了。

<strong>安装nginx</strong>

nginx在设置项目conf配置文件的时候又对不上了，明明修改了自己的本地html地址（就是那个location），就是不生效，期间进入nginx容器里面看了一眼，还以为是没有把它自带的配置文件导进来。网上很多教程都是直接挂载在容器nginx里面的nginx.conf这个文件，但是我就是不成功。后来发现网上有个是挂载这个nginx/conf.d/default.conf文件，copy过来改改也成功了

<strong>运行jar包</strong>

我打包完（忘了改数据库主机和密码了），结果一直连不上数据库。首先是发现在本地连服务器连接不上，后来用nmap扫出来服务器重装系统以后他没给我开3306端口。

然后前后端联调的时候docker logs看日志发现服务器那边的java程序连不上数据库，但是在本地就可以正常连接，最后居然是我改完主机名和密码虽然重新打包了，但是我没有用dockerfile重新制作镜像，导致镜像一直是那个错误版本。我还不停地run(｡•́︿•̀｡) , 还以为是mysql版本问题，最后重新打包做一下镜像run一下就可以了。

至此，终于完成了~       <span>(˃ᴗ˂)</span>

 </article>
