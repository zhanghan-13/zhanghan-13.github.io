---
id: "scrcpy-an-zhuo-she-bei-tou-ping-dao-dian-nao-shi-yong-jiao-cheng"
title: "Scrcpy（安卓设备投屏到电脑）使用教程"
date: "2024-09-07"
excerpt: "Github：Genymobile / scrcpy：显示和控制您的 Android 设备 (github.com) 我提的issue：Video bitrate setting · Issue #5273 · Genymobile/scrcpy (github.com) 前言 最近有一个这样的需求"
category: "教程"
tags: ["matepad11.5s","scrcpy","华为平板","开源","投屏"]
wordCount: 745
headings: [{"level":2,"id":"%E5%89%8D%E8%A8%80","text":"前言"},{"level":2,"id":"%E6%98%BE%E7%A4%BA%E6%A8%A1%E7%B3%8A%E7%9A%84%E9%97%AE%E9%A2%98","text":"显示模糊的问题"},{"level":2,"id":"%E6%97%A0%E7%BA%BF%E8%BF%9E%E6%8E%A5","text":"无线连接"},{"level":2,"id":"%E5%90%AF%E5%8A%A8%E8%84%9A%E6%9C%AC","text":"启动脚本"}]
imageOmitted: false
legacySlug: "scrcpy-an-zhuo-she-bei-tou-ping-dao-dian-nao-shi-yong-jiao-cheng"
sourceUrl: "https://www.bugdesigner.cn/archives/scrcpy-an-zhuo-she-bei-tou-ping-dao-dian-nao-shi-yong-jiao-cheng"
---

<article id="content"><p>Github：<a href="https://github.com/Genymobile/scrcpy" target="_blank" rel="noopener noreferrer">Genymobile / scrcpy：显示和控制您的 Android 设备 (github.com)</a></p>
<p>我提的issue：<a href="https://github.com/Genymobile/scrcpy/issues/5273" target="_blank" rel="noopener noreferrer">Video bitrate setting · Issue #5273 · Genymobile/scrcpy (github.com)</a></p>
<h2 id="%E5%89%8D%E8%A8%80">前言</h2>
<p>​		最近有一个这样的需求，需要把平板内容投屏到电脑上，平板是华为matepad11.5s，笔记本是联想tb14+，找了好多软件，有华为电脑管家、自带投屏、scrcpy，最后还是选择用这个，让我在订阅制国内软件和几十k star的开源选择的话，一般还是开源，毕竟码农对开源有莫名的偏爱哈哈。</p>
<p>小白教程：【【超好用】安卓投屏神器 Scrcpy安装使用教程 我一直在用的Android投屏软件 Github开源项目】<a href="https://www.bilibili.com/video/BV1fh4y197nq?p=5&amp;vd_source=a5916dd0c483eddb098610c4f50ae397" target="_blank" rel="noopener noreferrer">https://www.bilibili.com/video/BV1fh4y197nq?p=5&amp;vd_source=a5916dd0c483eddb098610c4f50ae397</a></p>
<blockquote><p>这个up讲的很详细，对小白很友好，但是有些还是没有补充到这个博客补充一下</p>
</blockquote>
<h2 id="%E6%98%BE%E7%A4%BA%E6%A8%A1%E7%B3%8A%E7%9A%84%E9%97%AE%E9%A2%98">显示模糊的问题</h2>
<p>视频比特率默认8M，对于手机够用了，但是对于平板还是差点意思，启动使用添加这个配置项</p>
<pre><code class="language-bash">scrcpy --video-bit-rate=32M</code></pre>
<blockquote><p>官方配置文档在这里<a href="https://github.com/Genymobile/scrcpy/blob/master/doc/video.md" target="_blank" rel="noopener noreferrer">scrcpy/doc/video.md at master · Genymobile/scrcpy (github.com)</a>，可自行炼丹</p>
</blockquote>
<p>补充两个命令</p>
<ol><li><p>-h 查看所有可设置的选项</p>
</li><li><p>-f启动全屏显示</p>
</li></ol>
<p>我一般启动的时候就是这个脚本</p>
<pre><code class="language-bash">scrcpy -f --video-bit-rate=32M</code></pre>
<h2 id="%E6%97%A0%E7%BA%BF%E8%BF%9E%E6%8E%A5">无线连接</h2>
<p>有些同学可能觉得带个线很难受，可以使用无线连接模式，但是想要延迟低的话一般还是有线好一点。</p>
<p>运行下面的命令（ip换成自己平板|手机的ip，注意在一个局域网内）</p>
<pre><code class="language-bash">ping 192.168.1.2 # ensure can connect this device
.\adb kill-server   # 防止之前的设备影响
.\adb start-server  # 启动adb服务
.\adb connect 192.168.1.2:5555  # 连接终端adb服务
.\adb devices       # 查看是不是连上了</code></pre>
<p>接下来运行scrcpy的脚本即可</p>
<p>！用华为平板的同学注意了，你拔掉数据线以后华为可能默认会把usb调试选项给你关了，重新开一下，不然connect的时候连不上</p>
<h2 id="%E5%90%AF%E5%8A%A8%E8%84%9A%E6%9C%AC">启动脚本</h2>
<p>有时候还需要切到指定目录，运行命令，有点繁琐，写个windows脚本双击运行方便一点。</p>
<p>无线连接bat脚本（注意修改自己的路径和ip）：</p>
<pre><code class="language-bash">@echo off
ping 192.168.1.2
"D:\Program Files\scrcpy-win64-v2.6.1\adb.exe" kill-server
"D:\Program Files\scrcpy-win64-v2.6.1\adb.exe" start-server
"D:\Program Files\scrcpy-win64-v2.6.1\adb.exe" connect 192.168.1.2:5555
"D:\Program Files\scrcpy-win64-v2.6.1\adb.exe" devices
pause</code></pre>
<p>启动vbs脚本（注意修改路径）：</p>
<pre><code class="language-BASH">Dim shell
REM 创建执行对象
Set shell = CreateObject("Shell.Application")
REM 表示获取到管理员权限，执行，cmd窗口也会显示，0表示不显示，那个system32也可以不写，会自动找到   /c 告诉cmd执行后面的字符串  runas指定管理员权限
shell.ShellExecute "cmd.exe", "/c ""D:\Program Files\scrcpy-win64-v2.6.1\scrcpy.exe"" -f --video-bit-rate=32M", "C:\Windows\System32\", "", 1</code></pre>
<p></p>
</article>
