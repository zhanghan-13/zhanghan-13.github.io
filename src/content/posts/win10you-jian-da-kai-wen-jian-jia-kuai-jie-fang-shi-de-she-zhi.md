---
id: "win10you-jian-da-kai-wen-jian-jia-kuai-jie-fang-shi-de-she-zhi"
title: "win10右键打开文件[夹]快捷方式的设置"
date: "2023-09-25"
excerpt: "本文共1887个字 前言 之前学习C++的时候安装了QtCreator，后来因为不太好用转投Jetbrains全家桶门下，但是删除以后偶尔发现右键打开文件->更多方式时发现老是出现已经删除的Qt打开方式来捣乱，今天有时间就解决一下这个问题，顺便把我的Sublime Text添加到文件/文件夹的快捷方"
category: "教程"
tags: []
wordCount: 1309
headings: [{"level":2,"id":"heading-1","text":"前言"},{"level":2,"id":"heading-2","text":"解决方式"},{"level":3,"id":"heading-3","text":"修改更多打开方式的菜单"},{"level":3,"id":"heading-4","text":"修改文件/文件夹的右键菜单。"},{"level":2,"id":"heading-5","text":"后言"}]
imageOmitted: false
legacySlug: "win10you-jian-da-kai-wen-jian-jia-kuai-jie-fang-shi-de-she-zhi"
sourceUrl: "https://www.bugdesigner.cn/archives/win10you-jian-da-kai-wen-jian-jia-kuai-jie-fang-shi-de-she-zhi"
---

<article id="content"><p><span>本文共1887个字</span></p>
<h2 id="heading-1"><span>前言</span></h2>
<p><span>之前学习C++的时候安装了QtCreator，后来因为不太好用转投Jetbrains全家桶门下，但是删除以后偶尔发现右键打开文件-&gt;更多方式时发现老是出现已经删除的Qt打开方式来捣乱，今天有时间就解决一下这个问题，顺便把我的Sublime Text添加到文件/文件夹的快捷方式里面。（自从今年年初卸载notepad++的时候，已经凑合着用Vscode当记事本已经半年多了，最近才下载一个这个记事本）</span></p>
<p><span><img src="/images/93f775d9fcd5d8486e8e.png" alt="image-20230922145621665" width="824" height="459" loading="lazy" decoding="async"></span></p>
<h2 id="heading-2"><span>解决方式</span></h2>
<p><span>首先win+r输入regedit。</span></p>
<h3 id="heading-3"><span>修改更多打开方式的菜单</span></h3>
<p><span>进入到注册表编辑器后输入这个路径</span><span><code>计算机\HKEY_USERS\S-1-5-21-4024916612-1691460616-483768494-1001\Software\Classes\Applications</code></span><span>。进入的路径如下图所示，然后接着把你想删的东西删除就可以了。（如果CV不行的话可以一层一层往下找）</span></p>
<p><span><img src="/images/64d9a568280bc50a26ce.png" alt="image-20230922145955468" width="1531" height="943" loading="lazy" decoding="async"></span></p>
<p><span>删除成功，退出来就成功了</span></p>
<p><span><img src="/images/76dc64d35ffd73ba6f93.png" alt="image-20230922153930153" width="987" height="1257" loading="lazy" decoding="async"></span></p>
<h3 id="heading-4"><span>修改文件/文件夹的右键菜单。</span></h3>
<p><span>这里简单每个路径下面是存储什么的。贴一下我在网上看到的路径解释。</span></p>
<p><span>HKEY_CLASSES_ROOT*：系统所有文件，右键系统任一文件都会添加右键菜单</span></p>
<p><span>HKEY_CLASSES_ROOT\AllFilesystemObjects：系统所有文件和文件夹，右键任一文件或者文件夹都会添加右键菜单</span><span> </span><span>HKEY_CLASSES_ROOT\Folder：系统所有文件夹，右键系统任一文件夹都会添加右键菜单</span></p>
<p><span>HKEY_CLASSES_ROOT\Directory：系统所有目录，右键系统任一文件夹都会添加右键菜单</span><span> </span><span>HKEY_CLASSES_ROOT\Directory\Background：系统文件夹空白处右键，在文件夹内空白处右键都会添加右键菜单</span></p>
<p><span>由于我是修改一下文件和文件夹的右键菜单，因此我就在HKEY_CLASSES_ROOT*这个路径下做相应的修改了。进入的效果图如下：这里我简单介绍一下</span><span><strong><span>shell</span></strong></span><span>和</span><span><strong><span>shellex</span></strong></span><span>的区别。shellex是实现一些复杂的右键操作，一般使用编程实现（ex意为Extension）。我们平常更改的话更改shell下面的菜单就可以了。</span></p>
<p><span><img src="/images/721c93604d83ddfcf6f2.png" alt="image-20230922150907984" width="1407" height="870" loading="lazy" decoding="async"></span></p>
<p><span>右键shell，新建项（这个项的名称可以随便命名，但一般跟程序名保持一致）。</span></p>
<p><span><img src="/images/acbb1d098b63eea3420c.png" alt="image-20230922151348724" width="1157" height="557" loading="lazy" decoding="async"></span></p>
<p><span>双击右边的</span><span><strong><span>名称</span></strong></span><span>默认，弹出下面的窗口</span></p>
<p><span><img src="/images/f02af71a91a21a5ea085.png" alt="image-20230922151524731" width="1108" height="448" loading="lazy" decoding="async"></span></p>
<p><span>这里数值名称使用默认不用改，数值数据填写右键后显示的字符（如使用Vscode打开等等）。确定后右键新建可扩充字符串值。</span></p>
<p><span><img src="/images/8c16678851e611810929.png" alt="image-20230922152221670" width="1160" height="970" loading="lazy" decoding="async"></span></p>
<p><span>数值名称这里写Icon（就是右键显示的小图标），数值数据这里需要填需要右键执行的应用程序绝对路径去寻找到应用程序icon，这里需要具体看你把应用程序安装到哪里了，可以使用everything进行全局搜索，如下图：（everything使用技巧：搜索时候空格就是模糊匹配，代表匹配所有不限字数的字符）</span></p>
<p><span>!!! 这里的绝对路径需要加""号变成字符串</span></p>
<p><span><img src="/images/8354245f2c268ba12093.png" alt="image-20230922152422379" width="1034" height="497" loading="lazy" decoding="async"></span></p>
<p><span><img src="/images/8e2419ecc4b91dba4ac7.png" alt="image-20230922151835810" width="1569" height="311" loading="lazy" decoding="async"></span></p>
<p><span><img src="/images/17b4a0ec31937968f996.png" alt="image-20230927195539698" width="1108" height="507" loading="lazy" decoding="async"></span></p>
<p><span>前面的两步做完以后就来到了</span><span><strong><span>最后一步</span></strong></span><span>，新建</span><span><code>Command</code></span><span>项。(</span><span><strong><span>这是我发现图配错了,后期更新的图,因此这里的Sublime Text就是上面的Test,一个名称而已,大家不用在意</span></strong></span><span>)</span></p>
<p><span><img src="/images/00575e57dc108d0d1100.png" alt="image-20230927195649246" width="1516" height="781" loading="lazy" decoding="async"></span></p>
<p><span>这个项必须叫做Command（因为程序找的就是以这个为名称的项）创建好如下所示：</span></p>
<p><span><img src="/images/b2658b9e1c8af426c87b.png" alt="image-20230922153230172" width="1193" height="572" loading="lazy" decoding="async"></span></p>
<p><span>再次点击默认，进入数值数据的编辑弹窗，</span><span><strong><span>注意</span></strong></span><span>，这个数值数据是前面的绝对路径，然后还需要空格加个%1（这里加%1的目的是传递参数，当你点击右键菜单的时候，会把文件信息通过%1传递过去，这样才会打开）。</span></p>
<blockquote>
<p><span>我们可以使用这个传递的参数做一些好玩的事情，比如说把%1换成一个%V，然后右键一点击就在sublime text里面打开当前所在文件夹了，同理也可以设置各种参数，大家可以自行摸索。</span></p>
</blockquote>
<p><span>我这里就是</span><span><code>"C:\Program Files\Sublime Text" "%1"</code></span></p>
<p><span><img src="/images/8a4a5a97519820b6aa02.png" alt="image-20230927195854537" width="1614" height="560" loading="lazy" decoding="async"></span></p>
<p><span>点击确定，大功告成！</span></p>
<p><span>成功演示，右键文件/文件夹，可以看到名称，icon都已经添加上去了，点击也可以进入编辑</span></p>
<p><span><img src="/images/e3274f3d3b9a32e46cca.png" alt="image-20230927195935860" width="520" height="597" loading="lazy" decoding="async"></span></p>
<h2 id="heading-5"><span>后言</span></h2>
<p><span>其实修改右键菜单这个还是需要特别谨慎的，毕竟是系统注册表里面的东西，如果害怕改错了，修改之前文件上面有个导出可以先备份一份。</span></p>
<p><span>对于单纯对文件夹添加还是右键空白桌面，这个操作都是一样的（路径在解决方式的开头列出来了）。一个五步，找到路径-&gt;新建项-&gt;修改右键显示的文字-&gt;加入icon-&gt;添加Command项。</span></p>
<p><span>如果大家在看完上面的教程还是感觉有些繁琐的话，可以使用一些软件的右键菜单管理，比如说火绒，还有一些绿色版软件。页面操作对用户很友好。有问题请评论，我看到就会回复的。</span></p>
<p><span> 引用注册表一些路径的原文链接：</span><span><a href="https://blog.csdn.net/yang382197207/article/details/80079052" target="_blank" rel="noopener noreferrer">https://blog.csdn.net/yang382197207/article/details/80079052</a></span></p>
</article>
