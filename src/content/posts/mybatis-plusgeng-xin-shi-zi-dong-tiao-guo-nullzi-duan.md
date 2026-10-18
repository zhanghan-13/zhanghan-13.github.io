---
id: "mybatis-plusgeng-xin-shi-zi-dong-tiao-guo-nullzi-duan"
title: "Mybatis-plus更新时自动跳过null字段"
date: "2024-04-28"
excerpt: "在insert和update的时候，mp都是默认会把null字段不更新到数据库中，如果想要改变这个情况。 自己构造wrapper或实体类 在需要更新为null的字段上加@TableField(updateStrategy = FieldStrategy.IGNORED) yml配置update-st"
category: "后端"
tags: ["mybatis-plus"]
wordCount: 272
headings: []
imageOmitted: false
legacySlug: "mybatis-plusgeng-xin-shi-zi-dong-tiao-guo-nullzi-duan"
sourceUrl: "https://www.bugdesigner.cn/archives/mybatis-plusgeng-xin-shi-zi-dong-tiao-guo-nullzi-duan"
---

<article id="content"><p>在insert和update的时候，mp都是默认会把null字段不更新到数据库中，如果想要改变这个情况。</p>
<ol>
<li>
<p>自己构造wrapper或实体类</p>
</li>
<li>
<p>在需要更新为null的字段上加@TableField(updateStrategy = FieldStrategy.IGNORED)</p>
</li>
<li>
<p>yml配置update-strategy，上面的扫描高版本不配置也可以</p>
</li>
</ol>
<pre><code class="language-yml">mybatis-plus:
mapper-locations: classpath*:/mapper/**/**.xml
#实体扫描，多个package用逗号或者分号分隔
typeAliasesPackage: com.xx.**.entity
global-config:
#数据库相关配置
db-config:
# select-strategy: not_empty
# insert-strategy: not_empty
update-strategy: not_empty
#主键类型 AUTO:"数据库ID自增", INPUT:"用户输入ID", ID_WORKER:"全局唯一ID (数字类型唯一ID)", UUID:"全局唯一ID UUID";
id-type: ID_WORKER
banner: false
# ignored 不管有没有有设置属性，所有的字段都会设置到insert语句中，如果没设置值，全为null，这种在update 操作中会有风 险，把有值的更新为null

# not_null,也是默认策略，也就是忽略null的字段，不忽略""

# not-empty 为null，为空串的忽略，就是如果设置值为null，“”，不会插入数据库</code></pre>
<p> </p>
</article>
