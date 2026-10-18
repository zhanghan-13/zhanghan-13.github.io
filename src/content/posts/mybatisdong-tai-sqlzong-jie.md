---
id: "mybatisdong-tai-sqlzong-jie"
title: "Mybatis动态sql总结"
date: "2023-12-26"
excerpt: "forEach详解 在使用动态sql<foreach>语句时collection写list或者@Param注解里面指定的名称都行，item是每一个元素的别名，注意引用时候跟外部方法参数引用方式一样，#{item.name}......，不加占位符会出现难以预料的问题   <delete id=\"de"
category: ""
tags: ["mybatis"]
wordCount: 867
headings: [{"level":2,"id":"heading-1","text":"forEach详解"},{"level":2,"id":"heading-2","text":"resultMap详解"},{"level":2,"id":"heading-3","text":"Mybatis其他小点"}]
imageOmitted: false
legacySlug: "mybatisdong-tai-sqlzong-jie"
sourceUrl: "https://www.bugdesigner.cn/archives/mybatisdong-tai-sqlzong-jie"
---

<article id="content"><h2 id="heading-1">forEach详解</h2>
<p> 在使用动态sql&lt;foreach&gt;语句时collection写list或者@Param注解里面指定的名称都行，item是每一个元素的别名，注意引用时候跟外部方法参数引用方式一样，<strong>#{item.name}......，不加占位符会出现难以预料的问题</strong></p>
<pre><code class="language-xml">  &lt;delete id="deleteBatch"&gt;
        delete from setmeal_dish where setmeal_id in
        &lt;foreach collection="list" item="id" separator="," open="(" close=")"&gt;
            #{id}
        &lt;/foreach&gt;
 &lt;/delete&gt;
</code></pre>
<p>delete里面的id代表mapper文件里面的方法名。foreach标签里面的属性解释如下：</p>
<ul>
<li>collection为可迭代对象名称/可迭代对象类型(list,array,map)。一般直接用参数名。</li>
<li>item为collection的迭代过程对象，如ids为list集合，id就为item</li>
<li>separator。每个语句之间的分隔符，mybatis最后执行时候会拼接</li>
<li>open。拼接的左字符串，只会拼接一次</li>
<li>close。拼接的右字符串，只会拼接一次</li>
</ul>
<h2 id="heading-2">resultMap详解</h2>
<p> resultMap常用于多表查询中，用于拼接查询出的元素为统一的数据格式。常见场景如：套餐包含多个菜品，又需要查询套餐的所属分类名称。根据id查询套餐，这样当然可以根据id查询两次，再根据查询出来的分类id查询分类表，这样简单性能也优异，但是为了炫技(bushi)，使用resultMap映射三张表联查写起来更快一些。</p>
<pre><code class="language-xml">&lt;!--  resultMap的id，作为这个映射集的唯一标识、type，表明当前要映射的目标实体类  --&gt;
&lt;resultMap id="setmealDishMap" type="com.sky.vo.SetmealVO"&gt;
    &lt;!-- id和result标签中的property和column分别对应的是实体类属性的名称和从数据库查询出来的名称 --&gt;
    &lt;!--  id标签。作为当前属性集的id属性。  --&gt;
        &lt;id property="id" column="id"/&gt;
        &lt;result property="categoryId" column="category_id"/&gt; // result标签。映射普通属性
        &lt;result property="name" column="name"/&gt;
        &lt;result property="price" column="price"/&gt;
        &lt;result property="status" column="status"/&gt;
        &lt;result property="description" column="description"/&gt;
        &lt;result property="image" column="image"/&gt;
        &lt;result property="updateTime" column="update_time"/&gt;
        &lt;result property="categoryName" column="categoryName"/&gt;
    &lt;!--collection标签的ofType属性代表List集合里面存储的对象，javaType这个属性可写可不写，mybatis可以识别出来--&gt;
        &lt;collection property="setmealDishes" javaType="list" ofType="SetmealDish"&gt;
            &lt;id property="id" column="sd_id"/&gt;
            &lt;result property="setmealId" column="sd_setmeal_id"/&gt;
            &lt;result property="dishId" column="sd_dish_id"/&gt;
            &lt;result property="name" column="sd_name"/&gt;
            &lt;result property="price" column="sd_price"/&gt;
        &lt;/collection&gt;
    &lt;!--除了collection还有association 这个标签，这个主要用于一个对象里面包含一个对象而不是一个对象集合，它的用法是
        &lt;association property="属性名" javaType="对象的绝对路径"&gt;
跟collection类似
        &lt;/association&gt;
--&gt;
    &lt;/resultMap&gt;
&lt;!--这里就是resultMap引用上面的id了--&gt;
    &lt;select id="selectById" resultMap="setmealDishMap"&gt;
        &lt;!--为了避免命名冲突，给sd这个表里面的元素起一个别名--&gt;
        select s.*,
               sd.id as sd_id,
               sd.setmeal_id as sd_setmeal_id,
               sd.dish_id as sd_dish_id,
               sd.name as sd_name,
               sd.price as sd_price,
               sd.copies as sd_copies,
               c.name as categoryName
        from setmeal s,
             setmeal_dish sd,
             category c
        where s.id = sd.setmeal_id
          and s.category_id = c.id
          and s.id = #{id};
    &lt;/select&gt;
</code></pre>
<p> 另外不知道为什么，我开启了驼峰映射这个resultMap死活映射不上去，所以就手动使用result标签映射的。这样也直观一点还不容易出现冲突，虽然不太优雅~</p>
<h2 id="heading-3">Mybatis其他小点</h2>
<ol>
<li>能单表查多次尽量不要多表查一次，避免3张表以上的联查</li>
<li>多表联查时，注意给表起别名，引用时候别名.字段名来引用，项目中的表很可能会出现相同的字段。</li>
</ol>
<p>持续更新......</p>
</article>
