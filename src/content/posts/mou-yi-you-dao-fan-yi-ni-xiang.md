---
id: "mou-yi-you-dao-fan-yi-ni-xiang"
title: "某易有道翻译逆向"
date: "2023-11-19"
excerpt: "分析网站 分析payload 从下图可以看出，sign99%是需要逆向的，mysticTime98%也是需要逆向的（推测结合生成sign），不然传过去这个参数干嘛。其他的参数都很随意，像yduuid这种99%是不需逆向 分析请求头 都是很常规的，不需逆向"
category: "爬虫"
tags: ["AES","js逆向","md5"]
wordCount: 1534
headings: [{"level":2,"id":"heading-1","text":"分析网站"},{"level":2,"id":"heading-2","text":"寻找加密入口"},{"level":2,"id":"heading-3","text":"寻找解密入口"},{"level":2,"id":"heading-4","text":"Python代码复现"},{"level":2,"id":"heading-5","text":"总结"}]
imageOmitted: false
legacySlug: "mou-yi-you-dao-fan-yi-ni-xiang"
sourceUrl: "https://www.bugdesigner.cn/archives/mou-yi-you-dao-fan-yi-ni-xiang"
---

<article id="content"><h2 id="heading-1">分析网站</h2>
<p><strong>分析payload</strong></p>
<p>从下图可以看出，sign99%是需要逆向的，mysticTime98%也是需要逆向的（推测结合生成sign），不然传过去这个参数干嘛。其他的参数都很随意，像yduuid这种99%是不需逆向</p>
<img src="/images/bd3f25be56c18292ecba.png" alt="image-20231119125018855" width="869" height="893" loading="lazy" decoding="async">
<p><strong>分析请求头</strong></p>
<p>都是很常规的，不需逆向</p>
<img src="/images/2af7a4a2580c9e2d2ca8.png" alt="image-20231119125254938" width="1425" height="779" loading="lazy" decoding="async">
<p><strong>分析返回数据</strong></p>
<p>这种东西一看也是需要逆向的</p>
<img src="/images/0238d4aace8d552899c2.png" alt="image-20231119125348103" width="1477" height="119" loading="lazy" decoding="async">
<p>因此得出结论，本次我们逆向的目标是<strong>sign</strong>和<strong>返回数据</strong></p>
<h2 id="heading-2">寻找加密入口</h2>
<p>url <a href="https://dict.youdao.com/webtranslate" target="_blank" rel="noopener noreferrer">https://dict.youdao.com/webtranslate</a>  搜索translate。只发现有一个js文件里面有，因此点进去。</p>
<img src="/images/0f936c8c227c2df30613.png" alt="image-20231119142643134" width="2495" height="269" loading="lazy" decoding="async">
<p>看上去都是在声明函数，给这些都打上断点。⚠️这里断点打到里面去，不然断不下来</p>
<img src="/images/3e55e4c45acf20048fea.png" alt="image-20231119125919852" width="1371" height="834" loading="lazy" decoding="async">
<p>1：发现是在I这个函数断下来的，这里把后面的函数运行一下，发现是一个promise对象，这个时候需要注意。有promise一定有发送请求和接收请求，发送请求就在这个函数里面。这个函数里面可以查看函数</p>
<p>接收数据是在后面的then里面。❗这个对我们后面数据解密找解密入口非常有帮助</p>
<img src="/images/ae4c6e8e5d96848ca40f.png" alt="image-20231119130216409" width="1556" height="260" loading="lazy" decoding="async">
<p>进入这个I这个函数看一下，打个断点观察参数值，一共有三个参数，分别是e为url，t为发送的数据，o为加的请求头。再观察sign什么的都已经加上去了，因此不用想了，肯定是I这个箭头函数对这个数据进行了加密。接下来分析代码</p>
<img src="/images/47a24ac304e63c0b39de.png" alt="image-20231119130459714" width="1269" height="518" loading="lazy" decoding="async">
<p>2：划上去都运行一下，发现sign是在w函数加密的，点进去w应该是找到了加密入口</p>
<img src="/images/e4c0dc21b17f4f76b68f.png" alt="image-20231119131327266" width="1801" height="311" loading="lazy" decoding="async">
<p>3：点击进去w，获取了一个时间戳，然后把e和时间戳传给k</p>
<img src="/images/37514b6a633f34850218.png" alt="image-20231119131422946" width="1028" height="573" loading="lazy" decoding="async">
<p>4：继续找k，其实这三个函数挨着的，因此k再找j，发现是一个md5</p>
<img src="/images/37319f8aaa3ce4eed94a.png" alt="image-20231119131504743" width="1140" height="666" loading="lazy" decoding="async">
<p>e10开头，标准md5，把这个k函数的逻辑扣下来去python里面复现就可以了</p>
<img src="/images/ae1d6c902060a08db954.png" alt="image-20231119131628120" width="644" height="87" loading="lazy" decoding="async">
<h2 id="heading-3">寻找解密入口</h2>
<p>还记得我们刚刚说的promise对象有大用吗？现在找解密入口就派上了用场。解密的寻找有几种思路：</p>
<ol>
<li>对于网站使用promise，首先找interceptors拦截器</li>
<li>对于ajax请求，找success函数</li>
<li>上面都没有，找他调用这个axios发送请求的地方，then就是处理的成功的回调。看看哪个地方用到了这个声明promise的函数。</li>
</ol>
<p>这里我们采用的就是第三个方法。</p>
<p>需要注意的是，上面的仅仅是声明这个返回promise对象的一个函数I，并没有调用，那么去哪里找调用呢？直接在当前js文件搜索（ctrl+f）I，找到这个地方。这里应该是暴露出去供外部调用（猜想）</p>
<img src="/images/f3906160c8708d19ad8c.png" alt="image-20231119132350769" width="1251" height="524" loading="lazy" decoding="async">
<p>因此全局搜这个getTextTranslateResult，一共有两处，点进去</p>
<img src="/images/134c5dd9188437734acd.png" alt="image-20231119142559328" width="2461" height="632" loading="lazy" decoding="async">
<p>1：看到这个then的话，解密入口也已经找到了。接下来就是打断点，单步调试。看到这个decodeData函数，key，iv莫名开始兴奋。</p>
<img src="/images/5c1fe3d70942c81be36d.png" alt="image-20231119132622822" width="1383" height="684" loading="lazy" decoding="async">
<p>2：点进去decodeData这个函数。像是一个aes加密。</p>
<img src="/images/17b00a9ca8ea9540f0f6.png" alt="image-20231119133005572" width="1505" height="300" loading="lazy" decoding="async">
<p>这个y和alloc函数对我们传进来的key和iv做了一个处理。运行完y发现数据被变成数字数组了，但是alloc运行完是不变的（因此不用管它）。这个数字数组一般是字符串。点进去看看怎么转化的</p>
<img src="/images/45c86495b40519c5e84d.png" alt="image-20231119133304513" width="2496" height="357" loading="lazy" decoding="async">
<p>3：发现就是求了个md5，然后变成字节串（就变成我们的数字数组），记住这个逻辑，等下也要复现</p>
<img src="/images/b78cb9f0c5fee7307c5b.png" alt="image-20231119133425810" width="977" height="120" loading="lazy" decoding="async">
<p>4：接着就是很简单了。继续走decodeData那个逻辑，注意这个i.a.createDecipheriv是Nodejs一个标准库，假设我们不知道，可以先假设它是标准的，然后复现，看看解密的结果一不一样。不一样再去js代码扣逻辑</p>
<p>然后就是解密完毕转成base64。</p>
<p>? 注意这个return是先赋值再return s，就是做一个拼接。最后得到了最终的数据。这是前端需要干的，在py里面decrypt方法会自动处理最后一个数据块。我们不需要做拼接</p>
<img src="/images/ffc0319a8cd5a8d1a197.png" alt="image-20231119133915826" width="2473" height="304" loading="lazy" decoding="async">
<h2 id="heading-4">Python代码复现</h2>
<pre><code class="language-python">import base64

import requests
import time
from hashlib import md5
from Crypto.Cipher import AES
from Crypto.Util.Padding import pad, unpad

url = "https://dict.youdao.com/webtranslate"

headers = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36",
    "Referer": "https://fanyi.youdao.com/",
    "Cookie": "OUTFOX_SEARCH_USER_ID=1138325494@10.105.137.204; OUTFOX_SEARCH_USER_ID_NCOO=46378145.29139559",
    "Origin": "https://fanyi.youdao.com"
}
# 伪造时间戳,py里面是秒，转成毫秒
times = int(time.time() * 1000)

# 伪造sign，直接复现md5
# 准备数据
d = "fanyideskweb"
e = times
u = "webfanyi"
t = "fsdsogkndfokasodnaso"
str = f"client={d}&amp;mysticTime={e}&amp;product={u}&amp;key={t}"
# 加密得到sign
sign = md5(str.encode("utf-8")).hexdigest()

data = {
    "i": "like",    # 要翻译的值
    "from": "auto",
    "to": "",
    "dictResult": "true",
    "keyid": "webfanyi",
    "sign": sign,
    "client": "fanyideskweb",
    "product": "webfanyi",
    "appVersion": "1.0.0",
    "vendor": "web",
    "pointParam": "client,mysticTime,product",
    "mysticTime": e,
    "keyfrom": "fanyi.web",
    "mid": "1",
    "screen": "1",
    "model": "1",
    "network": "wifi",
    "abtest": "0",
    "yduuid": "abcdefg"
}

# 发送请求
res = requests.post(url, headers=headers, data=data)
print(res.text)

# 对数据进行解密
key = 'ydsecret://query/key/B*RGygVywfNBwpmBaZg*WT7SIOUP2T0C9WHMZN39j^DAdaZhAnxvGcCY6VYFwnHl'
iv = 'ydsecret://query/iv/C@lZe2YzHtZ2CYgaXKSVfsb7Y4QWHjITPPZ0nQp87fBeJ!Iv6v^6fvi2WN@bYpJ4'
# 复现对key和iv处理的逻辑
key=md5(key.encode('utf-8')).digest() 
iv=md5(iv.encode('utf-8')).digest()
data = res.text.replace(
    "_", "/").replace("-", "+")  # 处理一下传输的base64字符串 
# 创建一个AES对象
aes = AES.new(key=key, IV=iv, mode=AES.MODE_CBC)

result= unpad(aes.decrypt(base64.b64decode(data)), 16).decode("utf-8")    # 解密数据，先转成字节串，再解码，最后去掉填充

print(result)</code></pre>
<h2 id="heading-5">总结</h2>
<p>​       网易有道翻译算是逆向的入门案例了，没有混淆，对新手很友好，还用到md5，base64，aes，promise，数字数组这些知识点。有了这个接口直接调这个就不用调api了，当然我们这里只是学习使用。普通翻译好像是几千个字符有限制。</p>
<p>​       这个从头写到尾我的收获也很大，之前还迷迷糊糊的找加密入口，现在又过了一遍，对一些思路更清晰了。每一步都有详细的截图，可以说是保姆式手把手教学了</p>
</article>
