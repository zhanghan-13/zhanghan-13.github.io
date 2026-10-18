---
id: "yi-ge-wen-zhang-jie-jue-suo-you-guan-yu.gitignorede-wen-ti"
title: "一个文章解决所有关于.gitignore的问题"
date: "2024-05-14"
excerpt: "idea让我迷惑的操作 最近遇到了一个神奇的bug，idea添加文件会问你要不要添加到git仓库，如果你不添加，这个是一个颜色是忽略的颜色。但是我又想添加进去了，这个时候你单独添加一个文件是可以的，但是右键添加整个文件夹却不行，接下来先说我的问题的解决： 原理：idea你不添加到git里面会默认往"
category: "后端"
tags: [".gitignore","git"]
wordCount: 596
headings: [{"level":2,"id":"heading-1","text":"idea让我迷惑的操作"},{"level":2,"id":"heading-2","text":"补充.gitignore还可能出现的问题"}]
imageOmitted: false
legacySlug: "yi-ge-wen-zhang-jie-jue-suo-you-guan-yu.gitignorede-wen-ti"
sourceUrl: "https://www.bugdesigner.cn/archives/yi-ge-wen-zhang-jie-jue-suo-you-guan-yu.gitignorede-wen-ti"
---

<article id="content"><h2 id="heading-1">idea让我迷惑的操作</h2>
<p>​       最近遇到了一个神奇的bug，idea添加文件会问你要不要添加到git仓库，如果你不添加，这个是一个颜色是忽略的颜色。但是我又想添加进去了，这个时候你单独添加一个文件是可以的，但是右键添加整个文件夹却不行，接下来先说我的问题的解决：</p>
<p><strong>原理</strong>：idea你不添加到git里面会默认往 <code>.git/info/exclude</code>文件里面写入一个记录，类似这样的，这就解释了我们add时候为什么不能一起add，因为他添加记录的时候是一条一条添加的。因此找到这个文件，把里面的内容删了就可以一起添加了。</p>
<p><img src="/images/096b9e0260c5080dae42.png" alt="image-20240514212428832" width="1740" height="337" loading="lazy" decoding="async"></p>
<blockquote>
<p>ps：我当时迷惑了好久，为什么.gitignore里面没有这个忽略的记录，原来被idea这小子写到这里面去了</p>
</blockquote>
<h2 id="heading-2">补充.gitignore还可能出现的问题</h2>
<ol>
<li>就是全局.gitignore文件可能被忽视, 一些IDE可能会往这里写东西，使用下面这个命令查看全局git忽略文件（注意默认是gitignore_global，也可以设置其他名称）</li>
</ol>
<pre><code class="language-bash">git config --get core.excludesfile</code></pre>
<ol start="2">
<li>还有项目顶层目录可能也会影响文件忽略，这个就是一个项目有多个.gitignore文件，细心一点排查即可，我写了个py脚本,可以搜索</li>
</ol>
<pre><code class="language-python">import os

# 查询所有包含指定字符串的文件
def search_files(root_directory, search_content, search_filename):
    matches = []

    for root, dirs, files in os.walk(root_directory):
        for file in files:
            if search_filename != "" and file == search_filename:
                file_path = os.path.join(root, file)
                try:
                    with open(file_path, 'r', encoding='utf-8') as f:
                        if search_content in f.read():
                            matches.append(file_path)
                except (IOError, UnicodeDecodeError):
                    continue
            else:
                file_path = os.path.join(root, file)
                try:
                    with open(file_path, 'r', encoding='utf-8') as f:
                        if search_content in f.read():
                            matches.append(file_path)
                except (IOError, UnicodeDecodeError):
                    continue

    return matches

if __name__ == "__main__":
    root_directory = "D:\\"  # 查询的根路径，C|D|E盘
    search_content = "ischool-search"  # 查询的内容
    search_filename = ""  # 查询的文件名，没有传空即可（全盘扫估计得好久）

    matching_files = search_files(root_directory, search_content, search_filename)

    if matching_files:
        print("匹配项找到在以下文件中:")
        for match in matching_files:
            print(match)
    else:
        print("未找到匹配项。")</code></pre>
<p>总结来说：git三个地方可以配置忽略</p>
<ul>
<li>.gitignore文件</li>
<li>项目目录下：.git/info/exclude</li>
<li>git全局配置文件</li>
</ul>
</article>
