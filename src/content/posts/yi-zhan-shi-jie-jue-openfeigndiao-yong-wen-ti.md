---
id: "yi-zhan-shi-jie-jue-openfeigndiao-yong-wen-ti"
title: "一站式解决openfeign调用问题"
date: "2024-05-12"
excerpt: "openfeign是一个远程调用的HTTP客户端，不上RPC框架的时候使用它还是挺香的，使用具体就是下面这四步 flowchart LR\n导入依赖-->定义feign方法-->开启feign-->注入并调用 这次来说说我遇到的三个问题。 传输类型是对象时解码错误 报错信息如下： feign.code"
category: "后端"
tags: ["openfeign","rpc","微服务"]
wordCount: 543
headings: []
imageOmitted: false
legacySlug: "yi-zhan-shi-jie-jue-openfeigndiao-yong-wen-ti"
sourceUrl: "https://www.bugdesigner.cn/archives/yi-zhan-shi-jie-jue-openfeigndiao-yong-wen-ti"
---

<article id="content"><p>openfeign是一个远程调用的HTTP客户端，不上RPC框架的时候使用它还是挺香的，使用具体就是下面这四步</p>
<pre><code class="language-mermaid">flowchart LR
导入依赖--&gt;定义feign方法--&gt;开启feign--&gt;注入并调用</code></pre>
<p>这次来说说我遇到的三个问题。</p>
<ol>
<li><strong>传输类型是对象时解码错误</strong></li>
</ol>
<p>报错信息如下：</p>
<pre><code class="language-java">feign.codec.DecodeException: Type definition error: [simple type, class com.ischool.model.BaseResponse]</code></pre>
<p>解决方法：</p>
<p>​   跟jackson差不多，其实是通用返回类没有无参构造，没办法解码，加上无参构造函数即可</p>
<ol start="2">
<li><strong>出现方法无限调用直接503的情况</strong></li>
</ol>
<p>解决方法：</p>
<p>​   不要循环调用，你在这个微服务方法调用另一个微服务的方法，这两个方法还互相调用，就叫循环调用了，需要重构业务代码</p>
<ol start="3">
<li><strong>传输对象存在日期造成反序列化错误</strong></li>
</ol>
<p>报错信息如下：</p>
<pre><code class="language-java">feign.codec.DecodeException: Error while extracting response for type [java.util.List&lt;com.common.dto.MessageDto&gt;] and content type [application/json]</code></pre>
<blockquote>
<p>这个通常出现在和JSONConfig混用的情况，序列化时候是jsonconfig指定的格式，你openfeign反序列化回来也得是他指定的格式</p>
</blockquote>
<p>解决方法：因为openfeign默认使用jackson，因此修改JSON序列化的配置类，添加上反序列化配置就可以了，不用再新写配置类了</p>
<pre><code class="language-java">package com.ischool.config;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.fasterxml.jackson.databind.module.SimpleModule;
import com.fasterxml.jackson.databind.ser.std.ToStringSerializer;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import com.fasterxml.jackson.datatype.jsr310.ser.LocalDateSerializer;
import com.fasterxml.jackson.datatype.jsr310.ser.LocalDateTimeSerializer;
import org.springframework.boot.jackson.JsonComponent;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;
import org.springframework.http.converter.json.Jackson2ObjectMapperBuilder;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

@JsonComponent
public class JsonConfig {

    private static final String DATE_FORMAT = "yyyy-MM-dd";
    private static final String DATE_TIME_FORMAT = "yyyy-MM-dd HH:mm:ss";

    @Bean(name = "webObjectMapper")
    @Primary
    public ObjectMapper objectMapper(Jackson2ObjectMapperBuilder builder) {
        JavaTimeModule javaTimeModule = new JavaTimeModule();
        javaTimeModule.addSerializer(LocalDate.class, new LocalDateSerializer(DateTimeFormatter.ofPattern(DATE_FORMAT)));
        javaTimeModule.addSerializer(LocalDateTime.class, new LocalDateTimeSerializer(DateTimeFormatter.ofPattern(DATE_TIME_FORMAT)));

        SimpleModule longToStringModule = new SimpleModule();
        longToStringModule.addSerializer(Long.class, ToStringSerializer.instance);
        longToStringModule.addSerializer(Long.TYPE, ToStringSerializer.instance);

        return builder
                .featuresToDisable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS) // Disable timestamps in JSON
                .modulesToInstall(javaTimeModule, longToStringModule)
                .build();
    }
}</code></pre>
<p>封面图来自：<a href="https://zhuanlan.zhihu.com/p/346273428" target="_blank" rel="noopener noreferrer">https://zhuanlan.zhihu.com/p/346273428</a></p>
</article>
