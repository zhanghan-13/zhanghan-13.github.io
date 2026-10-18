---
id: "jie-jue-rabbitmqde-chuang-jian-dui-lie-shi-bai-wen-ti"
title: "解决RabbitMQ的创建队列失败问题"
date: "2024-05-12"
excerpt: "报错信息如下 [ischool-search] [Container#0-1] o.s.a.r.listener.BlockingQueueConsumer : Failed to declare queue: ai_queue 2024-05-06T12:45:02.418+08:00 WARN"
category: "后端"
tags: ["rabbitmq","队列创建失败"]
wordCount: 125
headings: []
imageOmitted: false
legacySlug: "jie-jue-rabbitmqde-chuang-jian-dui-lie-shi-bai-wen-ti"
sourceUrl: "https://www.bugdesigner.cn/archives/jie-jue-rabbitmqde-chuang-jian-dui-lie-shi-bai-wen-ti"
---

<article id="content"><p>报错信息如下</p>
<pre><code>[ischool-search] [Container#0-1] o.s.a.r.listener.BlockingQueueConsumer : Failed to declare queue: ai_queue 2024-05-06T12:45:02.418+08:00 WARN 21240 --- [ischool-search] [ntContainer#0-1] o.s.a.r.listener.BlockingQueueConsumer : Queue declaration failed; retries left=3 org.springframework.amqp.rabbit.listener.BlockingQueueConsumer$DeclarationException: Failed to declare queue(s):[ai_queue] at org.springframework.amqp.rabbit.listener.BlockingQueueConsumer.attemptPassiveDeclarations(BlockingQueueConsumer.java:773) ~[spring-rabbit-3.1.3.jar:3.1.3]</code></pre>
<p>解决方法：在consumer那里修改声明，不要queues</p>
<pre><code class="language-java">   @RabbitListener(
            bindings = @QueueBinding(
                    value = @Queue(AiMQConstant.AI_QUEUE_NAME),
                    exchange = @Exchange(name = AiMQConstant.AI_EXCHANGE_NAME, type = ExchangeTypes.DIRECT),
                    key = AiMQConstant.AI_ROUTING_KEY
            ), ackMode = "MANUAL")</code></pre>
</article>
