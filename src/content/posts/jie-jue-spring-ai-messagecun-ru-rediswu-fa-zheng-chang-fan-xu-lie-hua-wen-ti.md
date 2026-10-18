---
id: "jie-jue-spring-ai-messagecun-ru-rediswu-fa-zheng-chang-fan-xu-lie-hua-wen-ti"
title: "解决Spring AI message存入Redis无法正常反序列化问题"
date: "2024-05-10"
excerpt: "前言 版本：springboot3.2.4+spring ai1.0.0SNAPSHOT+redis-windows5 果然不用新版本确实，引入新版本以前的许多配置都过时了，我大概试了6、7种，后来自己都看懂那些配置啥作用了，还是没有试成功，后来我就怀疑是不是SpringAI的message接口有问"
category: ""
tags: []
wordCount: 792
headings: [{"level":3,"id":"heading-1","text":"前言"}]
imageOmitted: false
legacySlug: "jie-jue-spring-ai-messagecun-ru-rediswu-fa-zheng-chang-fan-xu-lie-hua-wen-ti"
sourceUrl: "https://www.bugdesigner.cn/archives/jie-jue-spring-ai-messagecun-ru-rediswu-fa-zheng-chang-fan-xu-lie-hua-wen-ti"
---

<article id="content"><h3 id="heading-1">前言</h3>
<p>版本：springboot3.2.4+spring ai1.0.0SNAPSHOT+redis-windows5</p>
<p>​       果然不用新版本确实，引入新版本以前的许多配置都过时了，我大概试了6、7种，后来自己都看懂那些配置啥作用了，还是没有试成功，后来我就怀疑是不是SpringAI的message接口有问题，自己搞了个demo，最后试出来一个新版本反序列化的配置(一个博客写的)，其实就是三步，把工厂添加进去，配置objectmapper，配置序列化器</p>
<p>​       这里其实就可以正常使用了，message包里面是这样的：message接口被一个抽象类实现，UserMessage、SystemMessage等又继承抽象类。Spring AI有两个问题</p>
<ol>
<li>这些继承抽象类的Message没有无参构造，导致jackson会报错</li>
</ol>
<pre><code class="language-java">org.springframework.data.redis.serializer.SerializationException: Could not read JSON: Cannot construct instance of `org.springframework.ai.chat.messages.SystemMessage` (although at least one Creator exists): cannot deserialize from Object value (no delegate- or property-based Creator)</code></pre>
<ol start="2">
<li>接口和抽象类里面的属性命名不一致，导致jackson序列化时候会多序列化两个属性，解析时候解析不了也报错</li>
</ol>
<pre><code>org.springframework.data.redis.serializer.SerializationException: Could not read JSON: Problem deserializing 'setterless' property ("media"): no way to handle typed deser with setterless yet</code></pre>
<p>于是我就使用JVM的双亲委派机制，直接把这个包拿出来重写了一下代码，成功运行！</p>
<p>我提交了个pr，想看怎么解决的可以看这个地址，其实也就是改一下属性名和加个</p>
<pre><code class="language-java">package com.search.config;

import com.fasterxml.jackson.annotation.JsonAutoDetect;
import com.fasterxml.jackson.annotation.PropertyAccessor;
import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.fasterxml.jackson.databind.jsontype.impl.LaissezFaireSubTypeValidator;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import com.fasterxml.jackson.datatype.jsr310.deser.LocalDateDeserializer;
import com.fasterxml.jackson.datatype.jsr310.deser.LocalDateTimeDeserializer;
import com.fasterxml.jackson.datatype.jsr310.deser.LocalTimeDeserializer;
import com.fasterxml.jackson.datatype.jsr310.ser.LocalDateSerializer;
import com.fasterxml.jackson.datatype.jsr310.ser.LocalDateTimeSerializer;
import com.fasterxml.jackson.datatype.jsr310.ser.LocalTimeSerializer;
import com.search.patch.SystemMessageMixin;
import org.springframework.ai.chat.messages.AssistantMessage;
import org.springframework.ai.chat.messages.SystemMessage;
import org.springframework.ai.chat.messages.UserMessage;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.redis.connection.RedisConnectionFactory;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.serializer.Jackson2JsonRedisSerializer;
import org.springframework.data.redis.serializer.RedisSerializer;
import org.springframework.data.redis.serializer.StringRedisSerializer;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;

/**
 * Redis相关Bean配置
 */
@Configuration
public class RedisConfig {
    @Bean
    public RedisTemplate&lt;String, Object&gt; redisTemplate(RedisConnectionFactory redisConnectionFactory) {
        RedisSerializer&lt;Object&gt; serializer = redisSerializer();
        RedisTemplate&lt;String, Object&gt; redisTemplate = new RedisTemplate&lt;&gt;();
        redisTemplate.setConnectionFactory(redisConnectionFactory);

        redisTemplate.setKeySerializer(new StringRedisSerializer());
        redisTemplate.setValueSerializer(serializer);
        redisTemplate.setHashKeySerializer(new StringRedisSerializer());
        redisTemplate.setHashValueSerializer(serializer);
        redisTemplate.afterPropertiesSet();
        return redisTemplate;
    }

    @Bean
    public RedisSerializer&lt;Object&gt; redisSerializer() {
        ObjectMapper objectMapper = new ObjectMapper();
        objectMapper.setVisibility(PropertyAccessor.ALL, JsonAutoDetect.Visibility.ANY);
        objectMapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);
        // 必须设置，否则无法将JSON转化为对象，会转化成Map类型
        objectMapper.activateDefaultTyping(LaissezFaireSubTypeValidator.instance, ObjectMapper.DefaultTyping.NON_FINAL);

        // 自定义ObjectMapper的时间处理模块
        JavaTimeModule javaTimeModule = new JavaTimeModule();

        javaTimeModule.addSerializer(LocalDateTime.class, new LocalDateTimeSerializer(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss")));
        javaTimeModule.addDeserializer(LocalDateTime.class, new LocalDateTimeDeserializer(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss")));

        javaTimeModule.addSerializer(LocalDate.class, new LocalDateSerializer(DateTimeFormatter.ofPattern("yyyy-MM-dd")));
        javaTimeModule.addDeserializer(LocalDate.class, new LocalDateDeserializer(DateTimeFormatter.ofPattern("yyyy-MM-dd")));

        javaTimeModule.addSerializer(LocalTime.class, new LocalTimeSerializer(DateTimeFormatter.ofPattern("HH:mm:ss")));
        javaTimeModule.addDeserializer(LocalTime.class, new LocalTimeDeserializer(DateTimeFormatter.ofPattern("HH:mm:ss")));

        objectMapper.registerModule(javaTimeModule);

        // 禁用将日期序列化为时间戳的行为
        objectMapper.disable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS);

        // 创建JSON序列化器
        return new Jackson2JsonRedisSerializer&lt;&gt;(objectMapper, Object.class);
    }
}</code></pre>
</article>
