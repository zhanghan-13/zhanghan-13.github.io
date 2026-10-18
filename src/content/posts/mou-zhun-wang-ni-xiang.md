---
id: "mou-zhun-wang-ni-xiang"
title: "某准网逆向"
date: "2023-11-18"
excerpt: "初步逆向思路 首先进入页面，这里我们爬取软件开发工程师的薪资。找到网络，发送页面数据那个请求，可以看到，请求数据有两个加密的，这个是get请求，请求url是https://www.kanzhun.com/search?cityCode=31&industryCodes=&pageNum=1&quer"
category: ""
tags: ["看准网，js逆向"]
wordCount: 1835
headings: [{"level":2,"id":"heading-1","text":"初步逆向思路"},{"level":2,"id":"heading-2","text":"找加密入口"},{"level":3,"id":"heading-3","text":"搜索interceptors"},{"level":3,"id":"heading-4","text":"搜索URL"},{"level":2,"id":"heading-5","text":"JS代码逻辑跟踪"},{"level":3,"id":"heading-6","text":"加密参数的获取"},{"level":3,"id":"heading-7","text":"解密的逻辑"},{"level":2,"id":"heading-8","text":"python代码复现"},{"level":2,"id":"heading-9","text":"总结"}]
imageOmitted: false
legacySlug: "mou-zhun-wang-ni-xiang"
sourceUrl: "https://www.bugdesigner.cn/archives/mou-zhun-wang-ni-xiang"
---

<article id="content"><h2 id="heading-1">初步逆向思路</h2>
<p>首先进入页面，这里我们爬取软件开发工程师的薪资。找到网络，发送页面数据那个请求，可以看到，请求数据有两个加密的，这个是get请求，请求url是https://www.kanzhun.com/search?cityCode=31&amp;industryCodes=&amp;pageNum=1&amp;query=%E8%BD%AF%E4%BB%B6%E5%BC%80%E5%8F%91%E5%B7%A5%E7%A8%8B%E5%B8%88&amp;type=4。但是为什么会传两个参数呢，一个猜想，<strong>kiv是随机的，用于传递给后端使用特定算法解密</strong>。</p>
<p><img src="/images/f983243e3a479391746a.png" alt="image-20231118181926418" width="2581" height="645" loading="lazy" decoding="async"></p>
<p>接着观察请求头，发现应该是没有需要逆向的，都是常规的请求头（Traceid需要注意一下）</p>
<img src="/images/a9cd67dfb343428a9b4b.png" alt="image-20231118182033534" width="2018" height="460" loading="lazy" decoding="async">
<p>最后观察返回数据，发现返回数据也是经过解密的，因此确定本次逆向的目标，两个请求参数和返回数据</p>
<h2 id="heading-2">找加密入口</h2>
<h3 id="heading-3">搜索interceptors</h3>
<p>对这种使用promise的请求，第一个就是无脑搜拦截器，不要跟栈，不要跟栈，不要跟栈，重要的事情说三遍。</p>
<img src="/images/c37761eb6f14cfce93e1.png" alt="image-20231118182311286" width="1502" height="618" loading="lazy" decoding="async">
<p>搜索一下发现有这么多，点进去打断点观察数据的情况</p>
<p><img src="/images/52b4e5c8db5142e7c464.png" alt="image-20231118182421326" width="2561" height="469" loading="lazy" decoding="async"></p>
<p>到响应拦截器发现数据已经被加密了，注意，这里虽然看到了data，但前端是可以进行拆分之类的，data不会跟着请求发过去。</p>
<p><img src="/images/628e9656c34bafa74050.png" alt="image-20231118183055368" width="2580" height="1550" loading="lazy" decoding="async"></p>
<h3 id="heading-4">搜索URL</h3>
<p>搜索url的思路是从小往大搜（因为前端在处理组装数据的时候有时会对url进行修改），这个url是https://www.kanzhun.com/api_to/search/salary.json，先搜索search/salary.json。找到唯一一个，因此直接搜getSearchSalaryList，在里面搜是当前js文件，在外面搜是整个项目，直接在外面搜。</p>
<img src="/images/86e2906b2002ca3b1c44.png" alt="image-20231118183314916" width="1366" height="708" loading="lazy" decoding="async">
<p>找到打个断点，接下来就是漫长的跟代码过程了</p>
<img src="/images/33356b54e093248ec53f.png" alt="image-20231118183522471" width="2580" height="1550" loading="lazy" decoding="async">
<p>1：最后还有一个小点是当你鼠标划上去的时候你发现跳过去没有自动定位到那个函数，在控制台打出来这个函数，点击也能跳转过去</p>
<img src="/images/a3f9fa54385c72320320.png" alt="image-20231118183944588" width="1585" height="605" loading="lazy" decoding="async">
<p>使用这种方式</p>
<img src="/images/8e14dcc6a8018550fb63.png" alt="image-20231118183851288" width="739" height="137" loading="lazy" decoding="async">
<p>2：再跳到下一个函数，打上断点，然后让断点往后走一步，观察一下这个函数的一些参数即可</p>
<img src="/images/379366ddc14a6938177d.png" alt="image-20231118184510359" width="1649" height="607" loading="lazy" decoding="async">
<p>3：点击这个U函数，然后跳到这里，这里看一下代码，应该是在组装url和data，method这些参数，直接从a函数继续跟。</p>
<p><img src="/images/ad647b0964e2be6f3db1.png" alt="image-20231118184644227" width="1510" height="554" loading="lazy" decoding="async"></p>
<p>4：找到了这个入口，其实一步一步跟过去的路上分析代码就是需要经验的熟练度的问题了，最后找到了加密的JS文件如下</p>
<p><img src="/images/5f86bcdcba6b412e7137.png" alt="image-20231118184350309" width="2295" height="1079" loading="lazy" decoding="async"></p>
<p>看到这个文件跟之前的只是函数调用就明显不一样了，这个基本上就在打名牌了，看到这里面的b和kiv就已经结束了。在函数开头打个断点，开始单步调试。调试过程中发现：</p>
<p>​   我们传过来的e被拷贝到了a对象里面（注意，这个是一个重要信息，别傻傻的还跟e，前端对于这种对象拷贝很常见，就是组合参数为了发请求）。看到headers里面还有个traceId，这个运行几次发现值是固定的，就不需要逆向。</p>
<h2 id="heading-5">JS代码逻辑跟踪</h2>
<h3 id="heading-6">加密参数的获取</h3>
<p><strong>参数s</strong></p>
<p>s是经过这个s = (0,
M._A)()这个函数调用而来的，前面这个判断大体意思就是看看s有没有值，有的话就用之前的，没有就重新赋值。这个里面</p>
<img src="/images/a36b8cbcacc078b043be.png" alt="image-20231118185648683" width="1417" height="762" loading="lazy" decoding="async">
<p>但是这个参数在控制台运行几次发现值是随机的，且验证了之前的猜想</p>
<img src="/images/d34c338350101dc1deba.png" alt="image-20231118185535023" width="793" height="429" loading="lazy" decoding="async">
<p>点进去看看，发现M._A是这样一个函数，总体意思就是使用逻辑与判断e有没有值，没有值就给e赋值为16。这里的e进来的时候是underfined。<strong>这个void 0的值是underfined，跟e比较，如果e有值那逻辑与右边的就不走了，没有给e一个默认值。这个还是蛮重要的</strong></p>
<p>然后下面的循环是从那62的数当中循环随机选取16个数，返回回去。其实看到random的时候就可以出去了，它随机都可以，我们直接给他定死就得了。</p>
<img src="/images/632d85a7be474e90259c.png" alt="image-20231118190424993" width="1667" height="207" loading="lazy" decoding="async">
<p><strong>参数t（b）</strong></p>
<p>继续往下走，进入给t赋值的那个函数(0,
M.mA)，发现调用了函数l，继续跟</p>
<p><img src="/images/8ab4a84b8e55f306a4eb.png" alt="image-20231118191724616" width="1901" height="142" loading="lazy" decoding="async"></p>
<p>看到AES，加密就找到了。</p>
<p><img src="/images/285d0939972ba418b9ca.png" alt="image-20231118191833736" width="1938" height="602" loading="lazy" decoding="async"></p>
<p>这里我们找他的key和iv，mode这三个就可以收官了(pad默认的pad填充就行)。注意下面，decrypt就在下面（这个也是一个非常常见的现象）。找到这三个值，去python里面直接复现就可以了。接下来单步调试</p>
<p><strong>key的获取</strong></p>
<p>在控制台一输出发现是一个数组，这是cryptoJS的东西，解决方法就是直接toString再把cryptoJS enc对象传过去就可以了（这里的cryptojs就是o，可能是进行了打包时候的压缩）</p>
<p><img src="/images/06429e0089501a8acab7.png" alt="image-20231118192125507" width="976" height="195" loading="lazy" decoding="async"></p>
<img src="/images/eb76f174c60dd2e17d74.png" alt="image-20231118192315607" width="564" height="106" loading="lazy" decoding="async">
<p>得到key的值为：G$$QawckGfaLB97r</p>
<p><strong>iv的获取</strong></p>
<p>观察iv，其实就是之前随机出来的s，直接定死（如果害怕服务端检测就把他随机的逻辑复现一下）。得到iv：CSpFHJE0TN9oL3rF</p>
<p><strong>mode的获取</strong></p>
<p>有iv，AES，DES 99.9%都是CBC模式。得到mode：CBC</p>
<p>最后复现的时候需要注意这里把字符串做了一个替换。且它的查询的明文是这样的</p>
<p><code>"{"query":"软件开发工程师","cityCode":"","industryCodes":"","pageNum":1,"limit":15}"</code></p>
<img src="/images/f58689c9f49ec287bb25.png" alt="image-20231118195023879" width="1870" height="849" loading="lazy" decoding="async">
<h3 id="heading-7">解密的逻辑</h3>
<p>解密跟加密共用的是一套AES，逻辑一样，就不再赘述了（下面这张图我重新发了一次请求，因此t不一样）</p>
<p><img src="/images/09e94e6c93e850bd13ea.png" alt="image-20231118195514728" width="1884" height="314" loading="lazy" decoding="async"></p>
<h2 id="heading-8">python代码复现</h2>
<pre><code class="language-python">import base64

import requests
from Crypto.Cipher import AES
from Crypto.Util.Padding import pad, unpad

url = "https://www.kanzhun.com/api_to/search/salary.json"
headers = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36",
    'Cookie': 'wd_guid=5632262a-3e0b-4746-b729-c972d1d21db9; historyState=state; __c=1700303213; __g=-; __l=l=%2Fwww.kanzhun.com%2Fsearch%3FcityCode%3D31%26industryCodes%3D%26pageNum%3D1%26query%3D%25E8%25BD%25AF%25E4%25BB%25B6%25E5%25BC%2580%25E5%258F%2591%25E5%25B7%25A5%25E7%25A8%258B%25E5%25B8%2588%26type%3D4&amp;r=; Hm_lvt_1f6f005d03f3c4d854faec87a0bee48e=1700299731,1700303213; R_SCH_CY_V=25761614; W_CITY_S_V=31; pageType=1; lasturl="https://www.kanzhun.com/search?cityCode=31&amp;industryCodes=&amp;pageNum=1&amp;query=%E8%BD%AF%E4%BB%B6%E5%BC%80%E5%8F%91%E5%B7%A5%E7%A8%8B%E5%B8%88&amp;type=4'
}   # 带上cookie，获取的数据可以多一点

# 进行加密的逻辑
kiv = "CSpFHJE0TN9oL3rF"
# AES复现
aes = AES.new(key=b'G$$QawckGfaLB97r', IV=b'CSpFHJE0TN9oL3rF', mode=AES.MODE_CBC)
ming = '{"query":"软件开发工程师","cityCode":"","industryCodes":"","pageNum":1,"limit":15}'
mi = aes.encrypt(pad(ming.encode('utf-8'), 16))
b = base64.b64encode(mi).decode().replace("/", "_").replace("+", "-").replace("=", "~")
# 准备查询参数
params = {
    'b': b,
    'kiv': kiv
}
res = requests.get(url, params=params, headers=headers)
print(res.text)

# 进行解密的逻辑
aes_decrypt = AES.new(key=b'G$$QawckGfaLB97r', IV=b'CSpFHJE0TN9oL3rF', mode=AES.MODE_CBC)
data=unpad(aes_decrypt.decrypt(base64.b64decode(res.text)),16).decode('utf-8')
print(data)</code></pre>
<p>最后提取json数据即可</p>
<p><img src="/images/5fbb0f33b4acafe194e3.png" alt="image-20231118203117435" width="2670" height="104" loading="lazy" decoding="async"></p>
<h2 id="heading-9">总结</h2>
<p>第一次写逆向的相关博文教程，这个是我跟着樵夫老师的课再结合自己的思考来的一些总结，前前后后写了一个半小时，作者还是一个逆向小白，这个网站确实很简单，大佬轻喷。以后简单写一下思路，肯定是不会这么细了，会考虑把自己的实战放在B站上讲解一下。有问题请评论或联系我~</p>
</article>
