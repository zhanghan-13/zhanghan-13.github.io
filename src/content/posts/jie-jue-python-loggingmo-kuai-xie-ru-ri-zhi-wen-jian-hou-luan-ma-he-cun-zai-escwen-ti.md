---
id: "jie-jue-python-loggingmo-kuai-xie-ru-ri-zhi-wen-jian-hou-luan-ma-he-cun-zai-escwen-ti"
title: "解决python logging模块写入日志文件后乱码和存在esc问题"
date: "2024-05-17"
excerpt: "乱码是因为没有设置文件格式，存在esc是因为颜色问题，阅读器无法渲染。解决配置如下 import re\n\n# 自定义formatter，匹配常见的ANSI转义序列，处理日志中的esc字符\nclass NoColorFormatter(logging.Formatter):\n    def forma"
category: ""
tags: []
wordCount: 171
headings: []
imageOmitted: false
legacySlug: "jie-jue-python-loggingmo-kuai-xie-ru-ri-zhi-wen-jian-hou-luan-ma-he-cun-zai-escwen-ti"
sourceUrl: "https://www.bugdesigner.cn/archives/jie-jue-python-loggingmo-kuai-xie-ru-ri-zhi-wen-jian-hou-luan-ma-he-cun-zai-escwen-ti"
---

<article id="content"><p>乱码是因为没有设置文件格式，存在esc是因为颜色问题，阅读器无法渲染。解决配置如下</p>
<pre><code class="language-python">import re

# 自定义formatter，匹配常见的ANSI转义序列，处理日志中的esc字符
class NoColorFormatter(logging.Formatter):
    def format(self, record):
        ansi_escape = re.compile(r'\x1B(?:[@-Z\\-_]|\[[0-?]*[ -/]*[@-~])')
        record.msg = ansi_escape.sub('', record.msg)
        return super().format(record)

# 创建一个带有UTF-8编码的RotatingFileHandler
handler = RotatingFileHandler('logfile.log', maxBytes=1*1024*1024, backupCount=3, encoding='utf-8')
handler.setLevel(logging.INFO)

# 创建一个格式器并将其添加到处理器
formatter = NoColorFormatter('%(asctime)s - %(levelname)s - %(message)s', datefmt='%Y-%m-%d %H:%M:%S')
handler.setFormatter(formatter)

# 获取根日志记录器并添加处理器
logger = logging.getLogger()
logger.addHandler(handler)</code></pre>
</article>
