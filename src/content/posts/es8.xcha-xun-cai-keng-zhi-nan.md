---
id: "es8.xcha-xun-cai-keng-zhi-nan"
title: "ES8.x查询踩坑指南"
date: "2024-05-25"
excerpt: "不知道是不是版本问题，但肯定是8.x的锅，就是构建完条件以后执行查询时候反序列化老是出现问题，具体如下面这行代码，还是在elastic讨论社区才找到答案：https://discuss.elastic.co/t/jsonp-mapping-exception/306992     SearchRes"
category: ""
tags: ["DSL","elastic search8","反序列化"]
wordCount: 473
headings: [{"level":2,"id":"%E5%AE%9E%E4%BD%93%E7%B1%BB%E9%85%8D%E7%BD%AE","text":"实体类配置"},{"level":2,"id":"%E8%87%AA%E5%AE%9A%E4%B9%89%E5%BA%8F%E5%88%97%E5%8C%96%E5%99%A8%E9%85%8D%E7%BD%AE","text":"自定义序列化器配置"}]
imageOmitted: false
legacySlug: "es8.xcha-xun-cai-keng-zhi-nan"
sourceUrl: "https://www.bugdesigner.cn/archives/es8.xcha-xun-cai-keng-zhi-nan"
---

<article id="content"><p>不知道是不是版本问题，但肯定是8.x的锅，就是构建完条件以后执行查询时候反序列化老是出现问题，具体如下面这行代码，还是在elastic讨论社区才找到答案：<a href="https://discuss.elastic.co/t/jsonp-mapping-exception/306992" target="_blank" rel="noopener noreferrer">https://discuss.elastic.co/t/jsonp-mapping-exception/306992</a></p>
<pre><code class="language-java">    SearchResponse&lt;AnnouncementESDTO&gt; searchResponse = elasticsearchClient.search(searchRequest, AnnouncementESDTO.class);</code></pre>
<h2 id="%E5%AE%9E%E4%BD%93%E7%B1%BB%E9%85%8D%E7%BD%AE">实体类配置</h2>
<p>具体来说就是实体类反序列化出现了问题，我完整的实体类定义如下，修改两方面</p>
<ol><li><p>类上增加@JsonIgnoreProperties(ignoreUnknown = true)注解，表示忽略实体类里面没有属性</p>
</li><li><p>日期字段不仅显式声明，反序列化时候指定序列化器@JsonDeserialize(using = CustomLocalDateDeserializer.class)，反序列化器的配置如下</p>
</li></ol>
<pre><code class="language-java">@Document(indexName = "announcement")
@Data
@JsonIgnoreProperties(ignoreUnknown = true)
public class AnnouncementESDTO {
    private static final String DATE_TIME_PATTERN = "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'";
    private static final String DATE_PATTERN = "yyyy-MM-dd";
    @Id
    private Long id;

    private String title;

    private String content;

    @Field(index = true, store = true, type = FieldType.Date, format = {}, pattern = DATE_PATTERN)
    @JsonDeserialize(using = CustomLocalDateDeserializer.class)
    private LocalDate pubTime;

    private String url;

    @Field(index = false, store = true, type = FieldType.Date, format = {}, pattern = DATE_TIME_PATTERN)
    @JsonDeserialize(using = CustomLocalDateTimeDeserializer.class)
    private LocalDateTime createTime;

    private Long articleId;

    private String school;
}</code></pre>
<h2 id="%E8%87%AA%E5%AE%9A%E4%B9%89%E5%BA%8F%E5%88%97%E5%8C%96%E5%99%A8%E9%85%8D%E7%BD%AE">自定义序列化器配置</h2>
<pre><code class="language-java">package com.ischool.config;

import com.fasterxml.jackson.core.JsonParser;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.DeserializationContext;
import com.fasterxml.jackson.databind.JsonDeserializer;

import java.io.IOException;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;

/**
 * @program: iSchool-Server
 * @author: AlbertZhang
 * @create: 2024-05-19 22:17
 * @description:
 **/
public class CustomLocalDateDeserializer extends JsonDeserializer&lt;LocalDate&gt; {
    private static final DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");

    @Override
    public LocalDate deserialize(JsonParser p, DeserializationContext ctxt) throws IOException, JsonProcessingException {
        return LocalDate.parse(p.getText(), formatter);
    }
}</code></pre>
<pre><code class="language-java">package com.ischool.config;

import com.fasterxml.jackson.core.JsonParser;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.DeserializationContext;
import com.fasterxml.jackson.databind.JsonDeserializer;
import java.io.IOException;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

/*
* 解决es日期问题
* */
public class CustomLocalDateTimeDeserializer extends JsonDeserializer&lt;LocalDateTime&gt; {
    private static final DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd'T'HH:mm:ss.SSS'Z'");

    @Override
    public LocalDateTime deserialize(JsonParser p, DeserializationContext ctxt) throws IOException, JsonProcessingException {
        return LocalDateTime.parse(p.getText(), formatter);
    }

}</code></pre>
<p>最后吐槽一下：世上配置千千万，JSON序列化占一半啊</p>
</article>
