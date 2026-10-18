---
id: "jebyun-xing-shan-tui-wen-ti"
title: "JEB运行闪退问题"
date: "2023-11-28"
excerpt: "本文共436个字 jeb是一款静态调试和动态分析工具，但是正版pro是需要收费的，我们在下载的时候一般都是下盗版。盗版文件就衍生出来了这样一个问题，就是版本不是最新的。我这里的jeb版本是4.20.支持的jdk版本为11，（有的版本是2.X或者3.X，就对应jdk8以下和jdk8）。 在双击jeb_"
category: ""
tags: ["jeb","安卓逆向"]
wordCount: 349
headings: []
imageOmitted: false
legacySlug: "jebyun-xing-shan-tui-wen-ti"
sourceUrl: "https://www.bugdesigner.cn/archives/jebyun-xing-shan-tui-wen-ti"
---

<article id="content"><p><span>本文共436个字</span></p>
<p><span>jeb是一款静态调试和动态分析工具，但是正版pro是需要收费的，我们在下载的时候一般都是下盗版。盗版文件就衍生出来了这样一个问题，就是版本不是最新的。我这里的jeb版本是4.20.支持的jdk版本为11，（有的版本是2.X或者3.X，就对应jdk8以下和jdk8）。</span></p>
<p><span>在双击jeb_wincon.bat文件的时候直接闪退。</span></p>
<p><span><img src="/images/88696a275aa315ddcb6c.png" alt="image-20231122143929485" width="1641" height="825" loading="lazy" decoding="async"></span></p>
<p><span>后来发现是jdk版本不兼容，我的jdk是17，但是这里需要11。安装好jdk以后需要配置环境变量，变量名为JAVA_HOME,变量值为jdk路径。</span></p>
<p><span><img src="/images/fa4664249cf3a1c2b017.png" alt="image-20231122144058620" width="1320" height="315" loading="lazy" decoding="async"></span></p>
<p><span>一定要配置的名字为</span><span><strong><span>JAVA_HOME</span></strong></span><span>,因为这个bat脚本会读取这个名称的。</span></p>
<p><span>当然这里如果害怕对其他的项目有影响的时候，可以修改bat文件，让他读取java.exe的时候读取其他名字的环境变量。这里就不再赘述了</span></p>
<p><span><img src="/images/918aa467593f316fdfc1.png" alt="image-20231122143501988" width="1821" height="1021" loading="lazy" decoding="async"></span></p>
<p><span>还有一个踩坑点是当你配置完成以后把这个bat脚本发送到桌面快捷方式的时候会发现也是直接闪退。原因未知，在文件夹里面双击启动就好了，我猜想可能是需要用到相对路径的一些问题？需要使用安装目录里面的一些文件</span></p>
</article>
