---
id: "vitepressda-jian-bing-bu-shu-wang-zhan"
title: "vitepress搭建并部署网站"
date: "2024-01-10"
excerpt: "前言 首先，明确一点，不要轻易用最新的版本！！！很多开源项目文档写的真的太简练了，个人觉得不太适合小白，给个QA区也好啊。最后我们在遇到问题的时候解决方案一般有三条： 去网上搜索，看别人写的博客 问gpt 问别人（效率最低，特别是对于不会提问的同学） 对开源项目来说，还有两条 去github的iss"
category: "教程"
tags: ["github pages","vitepress","部署网站"]
wordCount: 3210
headings: [{"level":2,"id":"heading-1","text":"前言"},{"level":2,"id":"heading-2","text":"创建项目"},{"level":2,"id":"heading-3","text":"自定义配置"},{"level":3,"id":"heading-4","text":"美化主页"},{"level":3,"id":"heading-5","text":"主页扩展"},{"level":3,"id":"heading-6","text":"美化文章页"},{"level":3,"id":"heading-7","text":"文章页扩展"},{"level":3,"id":"heading-8","text":"美化地址栏icon"},{"level":3,"id":"heading-9","text":"设置搜索框"},{"level":2,"id":"heading-10","text":"使用Github Pages部署"},{"level":3,"id":"heading-11","text":"部署步骤"},{"level":3,"id":"heading-12","text":"配置自定义域名"},{"level":2,"id":"heading-13","text":"补充"}]
imageOmitted: false
legacySlug: "vitepressda-jian-bing-bu-shu-wang-zhan"
sourceUrl: "https://www.bugdesigner.cn/archives/vitepressda-jian-bing-bu-shu-wang-zhan"
---

<article id="content"><h2 id="heading-1">前言</h2>
<p>首先，明确一点，<strong>不要轻易用最新的版本</strong>！！！很多开源项目文档写的真的太简练了，个人觉得不太适合小白，给个QA区也好啊。最后我们在遇到问题的时候解决方案一般有三条：</p>
<ol>
<li>去网上搜索，看别人写的博客</li>
<li>问gpt</li>
<li>问别人（效率最低，特别是对于不会提问的同学）</li>
</ol>
<p>对开源项目来说，还有两条</p>
<ol>
<li>去github的issues区看别人是否遇到过这种问题</li>
<li>提issue</li>
</ol>
<p>为什么说不要用最新版本，首先版本发布的最新，很多问题网上根本没有解决方案，特别是对于比较小众的开源项目。问GPT的话它的知识库都没更新到最新，也没法解决。至于github的issue区也只能碰运气。</p>
<p>到最后遇到问题你只能提issue，这个时候就得看负责维护这个项目团队的积极性了，vitepress团队还是很奈斯的，我今天两点提了个issue8分钟就回复了，也得益于美国跟咱这边有时差。</p>
<p><img src="/images/71520bc66daf010a1d68.png" alt="image-20240108185018057" width="2038" height="1367" loading="lazy" decoding="async"></p>
<h2 id="heading-2">创建项目</h2>
<p>话不多说，接下来开始我们的搭建步骤。对于开源项目，肯定是直接看官网和一些最佳实践了。</p>
<p>vitepress官网地址：<a href="https://vitepress.dev/" target="_blank" rel="noopener noreferrer">https://vitepress.dev/</a></p>
<p>模仿的最佳实践（B站一个UP主的）：<a href="https://docs.zhengxinonly.com/" target="_blank" rel="noopener noreferrer">https://docs.zhengxinonly.com/</a></p>
<p><strong>安装vitepress</strong></p>
<p>首先新建文件夹，打开cmd窗口</p>
<pre><code class="language-sh">pnpm add -D vitepress</code></pre>
<p><strong>初始化Vitepress</strong></p>
<pre><code class="language-sh">pnpm vitepress init</code></pre>
<p>这是我的配置，简单介绍一下</p>
<ul>
<li>
<p>第一个是在当前根目录下创建vitepress项目</p>
</li>
<li>
<p>站点标题和描述。后续可以在配置中改</p>
</li>
<li>
<p>主题，建议选择第二个，个人觉得比较好看</p>
</li>
<li>
<p>是否使用ts，我们个人学习就没必要ts了，主要还是我懒</p>
</li>
<li>
<p>是否添加脚本到package.json，这个还是需要的，启动命令，打包命令这些都得用</p>
</li>
</ul>
<img src="/images/0dd162479b83a961ee06.png" alt="image-20240108190215775" width="2106" height="914" loading="lazy" decoding="async">
<p>初始化成功后，使用vscode或webstorm打开文件夹，会看到这样一个目录。接下来简单介绍一下每个文件的含义</p>
<ul>
<li>.vitepress，最核心的目录，</li>
<li>theme目录。自定义主题配置，css样式等</li>
<li>config.mjs。最核心的文件，各种配置导航栏、侧边栏、标题什么的都是在这里</li>
<li>node_modules。安装的依赖</li>
<li>api-examples.md和markdown-examples.md。官方给的两个示例</li>
<li>index.md。主页相关</li>
<li>package.json和pnpm-lock.yml。包管理工具需要用的</li>
</ul>
<p><img src="/images/8e88afde88ac047bed93.png" alt="image-20240108190658316" width="589" height="529" loading="lazy" decoding="async"></p>
<p><strong>启动项目</strong></p>
<pre><code class="language-sh">pnpm run docs:dev</code></pre>
<p>打开，看到这个，说明初始化成功</p>
<p><img src="/images/5d90a86bb8c4978fa7b7.png" alt="image-20240108191252240" width="2864" height="1556" loading="lazy" decoding="async"></p>
<h2 id="heading-3">自定义配置</h2>
<h3 id="heading-4">美化主页</h3>
<p>对于主页，我们自定义的内容有哪些？如下图，8个地方可以自定义。接下来就一一叙述这8个地方怎么自定义的。</p>
<p><img src="/images/55efa22987e820501104.png" alt="image-20240108191730006" width="2880" height="1552" loading="lazy" decoding="async"></p>
<p>忘记了还有个页脚：</p>
<p><img src="/images/938c03cf0a7cd785210f.png" alt="image-20240110033048297" width="2863" height="173" loading="lazy" decoding="async"></p>
<p>9这个是直接配置footer，在<code>config.mjs defineConfig themeConfig</code>下面配置就可以了</p>
<p><img src="/images/90ae2c038815b72b24a1.png" alt="image-20240110033147092" width="924" height="170" loading="lazy" decoding="async"></p>
<p>2-6是在index.md文件中自定义的。简单介绍一下对应关系</p>
<p><code>name&lt;==&gt;2</code> <code>text&lt;==&gt;3</code> <code>tagline&lt;==&gt;4</code> <code>actions&lt;==&gt;5</code> <code>features&lt;==&gt;6</code></p>
<p>需要说明的是，对于5这两个按钮，是可以跳转的，<strong>link指定路径</strong>，比如/api-example就是在项目根目录下找api-example.md这个文件  </p>
<img src="/images/998ffe8204dd27835de4.png" alt="image-20240108192410028" width="1108" height="1150" loading="lazy" decoding="async">
<p>修改后的页面如下：</p>
<p><img src="/images/6512b8569ba13ac22afd.png" alt="image-20240108192848790" width="2860" height="1144" loading="lazy" decoding="async"></p>
<p>1、7、8这三个配置是在config.mjs中配置的</p>
<p>其中，title对应1，nav对应7，socialLinks对应8。description是SEO要用的，我们不用关注。</p>
<img src="/images/8d0192f1352016231778.png" alt="image-20240108194059919" width="1281" height="1192" loading="lazy" decoding="async">
<p>最后的结果是这样。</p>
<p><img src="/images/a70043fea65753f33f21.png" alt="image-20240108194335668" width="2880" height="1564" loading="lazy" decoding="async"></p>
<h3 id="heading-5">主页扩展</h3>
<p>我们可能还想要对页面进行进一步美化，添加一些图标。可以去这个网站找图片https://www.iconfont.cn/</p>
<p>将找到的图片放在根目录下的public目录下。</p>
<img src="/images/8dc31668a65b1dcbbee7.png" alt="image-20240108195132751" width="1198" height="1085" loading="lazy" decoding="async">
<p>最后美化的效果如图：</p>
<p><img src="/images/6f917bdc2841d2549ed4.png" alt="image-20240108195220278" width="2864" height="1556" loading="lazy" decoding="async"></p>
<p><strong>TODO：</strong></p>
<ul>
<li>logo的配置是在config.mjs添加。（注意是themeConfig不是config）</li>
</ul>
<pre><code>logo: "logo.svg", // 配置logo位置，public目录</code></pre>
<ul>
<li>vitepress原生支持国外的sociallink，如果是国内需要自行复制svg代码。如图：</li>
</ul>
<p><img src="/images/25c464c64f4591457a7b.png" alt="image-20240108195501321" width="1733" height="574" loading="lazy" decoding="async"></p>
<ul>
<li>添加搜索栏，config.mjs中的themeConfig（支持国际化需要进一步配置 ）</li>
</ul>
<p><img src="/images/669a9518cc5d60347177.png" alt="image-20240108215134634" width="753" height="792" loading="lazy" decoding="async"></p>
<h3 id="heading-6">美化文章页</h3>
<p>默认进来官方给的示例是三边栏的</p>
<p>左边是sidebar的配置，右边是显示的文章目录（默认显示一二级）。</p>
<p><img src="/images/cfede8aa3f5b3450a543.png" alt="image-20240108195711534" width="2864" height="1556" loading="lazy" decoding="async"></p>
<p>下面叙述这个是怎么配置的。sidebar可以是数组，也可以是对象。还是修改config.mjs</p>
<p><img src="/images/47d6b4275f3be7e4f2c5.png" alt="image-20240108200043005" width="1196" height="657" loading="lazy" decoding="async"></p>
<p>最后的结果是这样</p>
<p><img src="/images/f038ac7ba550ab541a6a.png" alt="image-20240108200249558" width="2864" height="1556" loading="lazy" decoding="async"></p>
<p>右侧导航栏默认索引的是md文件的一二级标题，可能需要定义索引的标题级别和<code>On this page</code>这个说明。这个时候需要在config.mjs中配置下面这两个选项，<code>outlineTitle</code>用于替代On this page。<code>outline</code>定义展示的标题级别，这里定义2-6级</p>
<p><img src="/images/f2f1efc30f10c8f3b835.png" alt="image-20240108200555674" width="835" height="135" loading="lazy" decoding="async"></p>
<p>最后美化后的文章目录是这样</p>
<p><img src="/images/bd93bed9723d7020b013.png" alt="image-20240108201005185" width="2864" height="1556" loading="lazy" decoding="async"></p>
<p><strong>自动生成侧边栏</strong></p>
<p>我们使用这种配置时常常是一个目录有很多md文件，这些md文件所在的目录对应导航栏的一个选项。侧边栏的配置需要自己手写一个个路由映射到相应的文件上，那么有没有一个自动生成侧边栏的工具呢？根据一个目录下面的所有md文件自动生成路由，可以使用下面这个脚本</p>
<pre><code class="language-js">import path from "node:path";
import fs from "node:fs";

// 文件根目录
const DIR_PATH = path.resolve();
// 白名单,过滤不是文章的文件和文件夹
const WHITE_LIST = [
  "index.md",
  ".vitepress",
  "node_modules",
  ".idea",
  "assets",
];

// 判断是否是文件夹
const isDirectory = (path) =&gt; fs.lstatSync(path).isDirectory();

// 取差值
const intersections = (arr1, arr2) =&gt;
  Array.from(new Set(arr1.filter((item) =&gt; !new Set(arr2).has(item))));

// 把方法导出直接使用
function getList(params, path1, pathname) {
  // 存放结果
  const res = [];
  // 开始遍历params
  for (let file in params) {
    // 拼接目录
    const dir = path.join(path1, params[file]);
    // 判断是否是文件夹
    const isDir = isDirectory(dir);
    if (isDir) {
      // 如果是文件夹,读取之后作为下一次递归参数
      const files = fs.readdirSync(dir);
      res.push({
        text: params[file],
        collapsible: true,
        items: getList(files, dir, `${pathname}/${params[file]}`),
      });
    } else {
      // 获取名字
      const name = path.basename(params[file]);
      // 排除非 md 文件
      const suffix = path.extname(params[file]);
      if (suffix !== ".md") {
        continue;
      }
      res.push({
        text: name,
        link: `${pathname}/${name}`,
      });
    }
  }
  // 对name做一下处理，把后缀删除
  res.map((item) =&gt; {
    item.text = item.text.replace(/\.md$/, "");
  });
  return res;
}

export const set_sidebar = (pathname) =&gt; {
  // 获取pathname的路径
  const dirPath = path.join(DIR_PATH, pathname);
  // 读取pathname下的所有文件或者文件夹
  const files = fs.readdirSync(dirPath);
  // 过滤掉
  const items = intersections(files, WHITE_LIST);
  // getList 函数后面会讲到
  return getList(items, dirPath, pathname);
};</code></pre>
<p>使用时，需要导入函数名，</p>
<pre><code class="language-js">import { set_sidebar } from "../utils/auto-gen-sidebar.mjs";  // 改成自己的路径</code></pre>
<p>直接使用。第一个/front-end/react常常是<strong>nav的link</strong>，这个set_sidebar传递的参数是相对于根路径的文件夹路径，返回的是每个文件夹中文件的名称和链接</p>
<pre><code class="language-js">sidebar: { "/front-end/react": set_sidebar("front-end/react") },</code></pre>
<h3 id="heading-7">文章页扩展</h3>
<p>当然，这样对一些项目的文档是非常合适的。但是如果我们需要记笔记的话有些繁琐，并且三边栏总感觉可以查阅的东西变少了。因此可以使用刚才说的自定义样式。将三边栏改成两边栏</p>
<p>在config.mjs中的themeConfig配置对象中配置 </p>
<pre><code class="language-js">sidebar: false, // 关闭侧边栏
aside: "left", // 设置右侧侧边栏在左侧显示</code></pre>
<p>在.vitepress theme style.css中配置下面的css</p>
<pre><code class="language-css">/* 自定义侧边栏在最左边，右边撑满宽度 */
.VPDoc .container {
  margin: 0 !important;
}
@media (min-width: 960px) {
  .VPDoc:not(.has-sidebar) .content {
    max-width: 1552px !important;
  }
}
.VPDoc.has-aside .content-container {
  max-width: 1488px !important;
}
@media (min-width: 960px) {
  .VPDoc:not(.has-sidebar) .container {
    display: flex;
    justify-content: center;
    max-width: 1562px !important;
  }
}
.aside-container {
  position: fixed;
  top: 0;
  padding-top: calc(
    var(--vp-nav-height) + var(--vp-layout-top-height, 0px) +
      var(--vp-doc-top-height, 0px) + 10px
  ) !important;
  width: 224px;
  height: 100vh;
  overflow-x: hidden;
  overflow-y: auto;
  scrollbar-width: none;
}

/* 自定义h2的间距 */
.vp-doc h2 {
  margin: 0px 0 16px;
  padding-top: 24px;
  border: none;
}</code></pre>
<p>就可以将三栏样式改成双栏了（当然，上面的自定义css是我的偏好，根据实际情况可以修改），效果图如下</p>
<p><img src="/images/34b9b43c74812ce1e2b6.png" alt="image-20240108204620601" width="2864" height="1556" loading="lazy" decoding="async"></p>
<h3 id="heading-8">美化地址栏icon</h3>
<p>我们可能还需要修改浏览器地址栏的左边图标</p>
<p><img src="/images/2122d8b08bad903a401e.png" alt="image-20240110161809355" width="465" height="58" loading="lazy" decoding="async"></p>
<p>在<code>config.mjs defineConfig</code>下面直接配置即可</p>
<pre><code class="language-js">head: [["link", { rel: "icon", href: "/logo.svg" }]],</code></pre>
<p>❗如果需要配置路径<code>base</code>，这个<code>href</code>也需要添加base路径作为前缀</p>
<h3 id="heading-9">设置搜索框</h3>
<p>在<code>config.mjs defineConfig themeConfig</code>下面直接配置即可</p>
<pre><code class="language-python">   // 设置搜索框的样式
    search: {
      provider: "local",
      options: {
        translations: {
          button: {
            buttonText: "搜索文档",
            buttonAriaLabel: "搜索文档",
          },
          modal: {
            noResultsText: "无法找到相关结果",
            resetButtonTitle: "清除查询条件",
            footer: {
              selectText: "选择",
              navigateText: "切换",
            },
          },
        },
      },
    },</code></pre>
<h2 id="heading-10">使用Github Pages部署</h2>
<h3 id="heading-11">部署步骤</h3>
<p>Github Pages专门用来托管静态内容，由于不需要服务器且基于git，支持CI/CD，成为很多静态网站比如博客、文档网站的很好的选择。下面介绍流程</p>
<ol>
<li>在github上创建仓库，如果没有Github账号，需要先注册一个。</li>
</ol>
<p><img src="/images/8a2a41bc69b8f25762a4.png" alt="" width="2868" height="1547" loading="lazy" decoding="async"></p>
<p>需要在config.mjs里面配置base，名称为github仓库名称，注意不要忘记改之前的icon</p>
<pre><code class="language-js">base: "/docs-demo/"   </code></pre>
<ol start="2">
<li>初始化git仓库</li>
</ol>
<pre><code class="language-bash">git init</code></pre>
<ol start="3">
<li>添加gitignore文件</li>
</ol>
<pre><code>node_modules
.DS_Store
dist
dist-ssr
cache
.cache
.temp
*.local</code></pre>
<ol start="4">
<li>添加本地所有文件到git仓库</li>
</ol>
<pre><code class="language-bash">git add .</code></pre>
<ol start="5">
<li>创建第一次提交</li>
</ol>
<pre><code class="language-bash">git commit -m "first commit"</code></pre>
<ol start="6">
<li>添加远程仓库地址到本地</li>
</ol>
<pre><code class="language-bash">git remote add origin https://github.com/AZCodingAccount/Demo.git</code></pre>
<ol start="7">
<li>推送项目到github</li>
</ol>
<pre><code class="language-bash">git push -u origin master</code></pre>
<ol start="8">
<li>选择github actions</li>
</ol>
<p><img src="/images/427cf90325aeccf60d8c.png" alt="image-20240108210624305" width="2880" height="1579" loading="lazy" decoding="async"></p>
<ol start="9">
<li>设置工作流</li>
</ol>
<p><img src="/images/f5e37ff64a9fe7d4cf42.png" alt="image-20240108210710694" width="2880" height="1534" loading="lazy" decoding="async"></p>
<ol start="10">
<li>重命名并设置deploy脚本</li>
</ol>
<p>脚本文件：参考的vitepress官方文档：<a href="https://vitepress.dev/guide/deploy#github-pages" target="_blank" rel="noopener noreferrer">https://vitepress.dev/guide/deploy#github-pages</a></p>
<p>❗node版本和pnpm版本需要一致</p>
<p>❗对于npm的部署可以参考这个博客[GitHub Action一键部署个人博客 | Ahao (helloahao096.github.io)](<a href="https://helloahao096.github.io/helloahao/posts/GitHub" target="_blank" rel="noopener noreferrer">https://helloahao096.github.io/helloahao/posts/GitHub</a> Action一键部署个人博客.html)</p>
<p>❗需要注意项目的根目录（.vitepress所在的目录）</p>
<pre><code class="language-yml">name: Deploy VitePress site to Pages

on:
  push:
    branches: [master]

# 设置tokenn访问权限
permissions:
  contents: read
  pages: write
  id-token: write

# 只允许同时进行一次部署，跳过正在运行和最新队列之间的运行队列
# 但是，不要取消正在进行的运行，因为我们希望允许这些生产部署完成
concurrency:
  group: pages
  cancel-in-progress: false

jobs:
  # 构建工作
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v3
        with:
          fetch-depth: 0 # 如果未启用 lastUpdated，则不需要
      - name: Setup pnpm
        uses: pnpm/action-setup@v2 # 安装pnpm并添加到环境变量
        with:
          version: 8.6.12 # 指定需要的 pnpm 版本
      - name: Setup Node
        uses: actions/setup-node@v3
        with:
          node-version: 18
          cache: pnpm # 设置缓存
      - name: Setup Pages
        uses: actions/configure-pages@v3  # 在工作流程自动配置GithubPages
      - name: Install dependencies
        run: pnpm install # 安装依赖
      - name: Build with VitePress
        run: |
          pnpm run docs:build # 启动项目
          touch .nojekyll  # 通知githubpages不要使用Jekyll处理这个站点，不知道为啥不生效，就手动搞了
      - name: Upload artifact
        uses: actions/upload-pages-artifact@v2  # 上传构建产物
        with:
          path: .vitepress/dist # 指定上传的路径，当前是根目录，如果是docs需要加docs/的前缀

  # 部署工作
  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }} # 从后续的输出中获取部署后的页面URL
    needs: build    # 在build后面完成
    runs-on: ubuntu-latest  # 运行在最新版本的ubuntu系统上
    name: Deploy
    steps:
      - name: Deploy to GitHub Pages
        id: deployment  # 指定id
        uses: actions/deploy-pages@v2 # 将之前的构建产物部署到github pages中
</code></pre>
<p><img src="/images/799312d57de6c1a9cc93.png" alt="image-20240108210850443" width="2876" height="1560" loading="lazy" decoding="async"></p>
<ol start="11">
<li>点击确定，耐心等待15秒左右，就可以了，接下来查看我们的域名：</li>
</ol>
<p><img src="/images/451f6b54969d2c47b00a.png" alt="image-20240108211049140" width="2880" height="1526" loading="lazy" decoding="async"></p>
<p>踩坑点：为啥下面的没有CSS样式呢？原因是因为没有.nojekyll这个文件，不然一些css会被忽略。添加一下再push就好了</p>
<p><img src="/images/d4c1afae8a3c66e72219.png" alt="image-20240108211022770" width="2880" height="1530" loading="lazy" decoding="async"></p>
<p>最后，就部署完毕了</p>
<p><img src="/images/08ac39b65041652573ce.png" alt="image-20240108214941003" width="2880" height="1633" loading="lazy" decoding="async"></p>
<h3 id="heading-12">配置自定义域名</h3>
<p>来自我的最佳实践，直接配置子域名，别配置4条A记录，没必要让所有都指向这个，一个域名能配置好几个网站。另外域名服务商只允许添加5条记录，多了就得加钱了。</p>
<p>在自己的域名服务商那里添加一条CNAME记录，直接指向自己的github分配的域名就好了，另外需要把这个base给注释掉（不然css文件和页面都找不到），等待分配完成。</p>
<p><img src="/images/45eefd48137448a682f1.png" alt="image-20240108232734898" width="849" height="105" loading="lazy" decoding="async"></p>
<h2 id="heading-13">补充</h2>
<p>如果你想要配置mermaid支持(这是一个可以使用md语法绘制流程图，饼状图的md扩展),需要按照下面的步骤操作。
安装</p>
<pre><code class="language-bash">npm i vitepress-plugin-mermaid mermaid -D</code></pre>
<p>如果使用pnpm，还需要下面的配置改变pnpm的默认行为兼容插件</p>
<pre><code class="language-bash">pnpm install --shamefully-hoist
# 或者在根目录新建.npmrc文件，配置
shamefully-hoist=true</code></pre>
<p>更改<code>.vitepress/config.mjs</code>配置项</p>
<p>1: 导入</p>
<pre><code class="language-js">import { withMermaid } from "vitepress-plugin-mermaid";</code></pre>
<p>2: defineConfig—&gt;withMermaid</p>
<img src="/images/b4b41e9a74e9a54e0196.png" alt="image-20240209000231506" width="1089" height="152" loading="lazy" decoding="async">
<p>3:根配置项下添加</p>
<pre><code class="language-js"> mermaid: {
    // refer https://mermaid.js.org/config/setup/modules/mermaidAPI.html#mermaidapi-configuration-defaults for options
  },
 mermaidPlugin: {
    class: "mermaid my-class", // set additional css classes for parent container
  },</code></pre>
<p>可以访问<a href="https://emersonbottero.github.io/vitepress-plugin-mermaid/guide/getting-started.html" target="_blank" rel="noopener noreferrer">插件官网</a>和[mermaid官网](<a href="https://mermaid.js.org/config/setup/modules/mermaidAPI.html#mermaidapi-configuration-defaults" target="_blank" rel="noopener noreferrer">https://mermaid.js.org/config/setup/modules/mermaidAPI.html#mermaidapi-configuration-defaults</a> for options)获取更多配置信息</p>
</article>
