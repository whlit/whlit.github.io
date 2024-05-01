---
title: Spring Boot PageHelper 使用
---

# Spring Boot PageHelper 使用

[PageHelper](https://github.com/pagehelper/Mybatis-PageHelper) 是一个基于 MyBatis 的分页插件，可以非常简单的实现分页功能。

## 添加依赖

```xml
<dependency>
    <groupId>com.github.pagehelper</groupId>
    <artifactId>pagehelper-spring-boot-starter</artifactId>
    <version>2.1.0</version>
</dependency>
```

[最新版本链接](https://mvnrepository.com/artifact/com.github.pagehelper/pagehelper-spring-boot-starter)

## 简单使用

```java
try (Page<?> ignored = PageHelper.startPage(param.getPage(), param.getPageSize(), true)) {
    List<Item> list = itemMapper.select(param.getParam());
    PageInfo<Item> pageInfo = new PageInfo<>(list);
    pageInfo.getPageNum(); // 当前页码
    pageInfo.getPageSize(); // 每页条数
    pageInfo.getPages(); // 总页数
    pageInfo.getList(); // 当前页数据
}
```

这里使用`try-with-resources`语法，在`PageHelper.startPage`方法中，返回的`Page`对象是`Closeable`接口的实现类，所以需要自动关闭。也可以不加，但是在报错时需要手动关闭。

## Aop加自定义注解

- 自定义注解

```java
@Documented
@Retention(RetentionPolicy.RUNTIME)
@Target(ElementType.METHOD)
public @interface PageSearch {
}
```

这里不需要什么别的参数就只定义一个作用域在方法上的注解。

- Aop

::: code-group

```java [PageAspect]
package com.demo.aop;

import com.github.pagehelper.PageHelper;
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Pointcut;
import org.aspectj.lang.reflect.MethodSignature;
import org.springframework.stereotype.Component;

@Aspect
@Component
public class PageAspect {

    @Pointcut("@annotation(com.demo.aop.PageSearch)")
    public void searchPointcut() {
    }

    @Around("searchPointcut()")
    public Object around(ProceedingJoinPoint joinPoint) throws Throwable {
        Object[] args = joinPoint.getArgs();
        // 获取参数类型
        Class<?>[] parameterTypes = ((MethodSignature) joinPoint.getSignature()).getParameterTypes();
        PageParam<?> param = null;
        // 根据参数类型获取分页参数 这里的PageParam是自定义的分页查询参数类
        for (int i = 0; i < parameterTypes.length; i++) {
            if (PageParam.class.isAssignableFrom(parameterTypes[i])) {
                param = (PageParam<?>) args[i];
            }
        }
        // 没有分页参数，直接执行
        if (param == null) {
            return joinPoint.proceed(args);
        }
        // 开启分页
        try (Page<?> ignored = PageHelper.startPage(param.getPage(), param.getPageSize(), true)) {
            return joinPoint.proceed(args);
        }
    }

}
```

```java [PageParam]
public class PageParam<T> {
    /**
     * 页码
     */
    private Integer page;
    /**
     * 每页个数
     */
    private Integer pageSize;
    /**
     * 查询参数
     */
    private T param;

    // getter setter
}
```

:::

- 使用注解

::: code-group

```java [ItemService]
@Service
public class ItemServiceImpl implements ItemService {

    @Autowired
    private ItemMapper itemMapper;

    @PageSearch
    @Override
    public Page<Item> search(PageParam<ItemSearchParam> param) {
        List<Item> list itemMapper.select(param.getParam());
        return PageUtil.toPage(list);
    }
}
```

```java [PageUtil]
public class PageUtil {
    public static <T> Page<T> toPage(List<T> list) {
        Page<T> page = new Page<>();
        PageInfo<T> pageInfo = new PageInfo<>(list);
        page.setPage(pageInfo.getPageNum());
        page.setPageSize(pageInfo.getPageSize());
        page.setPageCount(pageInfo.getPages());
        page.setList(pageInfo.getList());
        return page;
    }
}
```
