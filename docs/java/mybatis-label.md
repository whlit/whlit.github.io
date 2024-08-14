---
title: Mybatis 常用的标签
layout: doc
---

# Mybatis 常用的标签

## select insert update delete

对应sql语句中的select insert update delete，分别是查询，插入，更新，删除

## if

根据条件拼接sql语句，在运行时根据传入参数进行条件判断，来动态的拼接sql语句。

```xml
<if test="name != null">
    and name = #{name}
</if>
```

## choose when otherwise

类似于java中的switch语句，`choose` 语句需要搭配 `when` 语句以及 `otherwise` 语句使用，在`choose`中按顺序判断`when`语句的条件是否满足，满足则执行对应的`when`语句，并跳出`choose`，当所以的`when`都不满足时执行`otherwise`语句。

```xml
<choose>
    <when test="name != null">
        and name = #{name}
    </when>
    <otherwise>
        and name = 'default'
    </otherwise>
</choose>
```

## foreach

当入参对象中存在集合时，可以使用`foreach`语句来遍历集合中的对象，然后拼接sql语句。

::: info 属性

- collection: 需要遍历的集合，如果入参是`List`则填`list`，如果是数组则填`array`，如果是对象类型或者`Map`则填集合对应的属性名。
- item: 集合中的元素的变量名，如果元素类型为对象，则可以通过该值来获取对象的属性。例如`item.name`。
- index: 集合中的元素的下标或者Map中的key，如果元素类型为对象，则可以通过该值来获取对象的属性。
- open: 遍历集合开始的前缀
- close: 遍历集合结束的后缀
- separator: 遍历集合的分隔符

:::

```xml
<foreach collection="list" item="item" index="index" open="(" separator="," close=")">
    #{item}
</foreach>
```

## where

优雅智能的处理`where`语句的拼接。例如去除多余的`and`。

```xml
<select id="getUser" parameterType="User">
    select * from user
    <where>
        <if test="name != null">
            and name = #{name}
        </if>
        <if test="age != null">
            and age = #{age}
        </if>
    </where>
</select>
```

## set

和`where`类似，`set`也是为了优雅智能地处理`set`语句的拼接。

```xml
<update id="updateUser" parameterType="User">
    update user
    <set>
        <if test="name != null">
            name = #{name},
        </if>
        <if test="age != null">
            age = #{age},
        </if>
    </set>
    where id = #{id}
</update>
```

## sql include

用于sql语句的复用，例如查询的结果字段，在多个查询中使用相同的sql语句，当数据库字段进行变更时，可以直接对sql片段进行修改，而不需要修改所有的sql语句，减少程序的不可控。

```xml
<sql id="columns">
    id, name, age
</sql>
<select id="getUser" parameterType="User">
    select
    <include refid="columns"/>
    from user
    <where>
        <if test="name != null">
            and name = #{name}
        </if>
        <if test="age != null">
            and age = #{age}
        </if>
    </where>
</select>
<select id="getUserById" parameterType="Long">
    select
    <include refid="columns"/>
    from user
    where id = #{_parameter}
</select>
```
