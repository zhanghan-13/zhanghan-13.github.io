---
id: "jie-jue-vscodezuo-jian-dian-ji-tiao-zhuan-dao-mu-biao-wen-ti"
title: "解决VSCode左键点击跳转到目标问题"
date: "2024-05-10"
excerpt: "vscode跟jetbrains家的产品默认快捷键有很大差别，如果是全栈，还是很推荐webstorm（但是我前端一直用的vs也懒得换），动不动改快捷键很痛苦，这次来解决ctrl+左键跳转到定义的问题（仅仅测试过js）。 我的现在是ctrl+左边会打开一个小窗口(vscode管它叫速览视图) 解决方式"
category: ""
tags: []
wordCount: 191
headings: []
imageOmitted: false
legacySlug: "jie-jue-vscodezuo-jian-dian-ji-tiao-zhuan-dao-mu-biao-wen-ti"
sourceUrl: "https://www.bugdesigner.cn/archives/jie-jue-vscodezuo-jian-dian-ji-tiao-zhuan-dao-mu-biao-wen-ti"
---

<article id="content"><p>vscode跟jetbrains家的产品默认快捷键有很大差别，如果是全栈，还是很推荐webstorm（但是我前端一直用的vs也懒得换），动不动改快捷键很痛苦，这次来解决ctrl+左键跳转到定义的问题（仅仅测试过js）。</p>
<p>我的现在是ctrl+左边会打开一个小窗口(vscode管它叫速览视图)</p>
<img src="/images/0880d2722701837de11c.png" alt="image-20240507213752213" width="2032" height="680" loading="lazy" decoding="async">
<p>解决方式：设置里搜索editor.gotoLocation.multipleDefinitions，将peek改成goto即可</p>
<img src="/images/c43139dae6bd141a4977.png" alt="image-20240507213954608" width="1349" height="444" loading="lazy" decoding="async">
<p>ps：有的可能点击之后没反应，试试这个解决方案</p>
<img src="/images/c804b6286fc80fefa7a2.png" alt="image-20240507214048581" width="1216" height="563" loading="lazy" decoding="async">
<p>另外，idea里面的ctrl+shift+home/end键跟栈也是可以设置的！！！，之前难受了好久</p>
<p><a href="https://so.csdn.net/so/search?q=sticky&amp;spm=1001.2101.3001.7020" target="_blank" rel="noopener noreferrer">sticky</a> scroll 取消勾选关闭上方固定内容</p>
<p>editor.minimap.enabled 取消关闭右侧固定内容</p>
</article>
