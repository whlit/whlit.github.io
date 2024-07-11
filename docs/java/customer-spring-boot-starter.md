---
title: 自定义 Spring Boot Starter
layout: doc
outline: deep
---

# 自定义 Spring Boot Starter

Spring Boot Starter 是在使用SpringBoot项目时，为了简化项目的配置，可以通过自定义 starter 来将一些默认的配置抽取出来。在SpringBoot启动时自动进行配置，从而减少工作量。

这里我们以创建一个自定义 starter 用来默认添加一个 health 接口，用于心跳检查。

## 创建工程

我们需要依赖 spring-boot-autoconfigure 和 spring-boot-starter-web，前者是自动配置所必须依赖的，其中包括我们需要的注解，后者是创建Controller接口所需要的，这里optional=true表示，这个依赖是可选的。因为我们定义的starter要让他必须是一个web项目才自动添加health接口。

```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>

    <groupId>demo.spring.starter</groupId>
    <artifactId>demo-spring-boot-starter</artifactId>
    <version>1.0-SNAPSHOT</version>

    <dependencies>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-autoconfigure</artifactId>
        </dependency>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-web</artifactId>
            <optional>true</optional>
        </dependency>
    </dependencies>

</project>
```

## 自定义配置类

创建一个`MyAutoConfiguration`类。

```java
package demo.spring.starter.config;

@AutoConfiguration
@ConditionalOnWebApplication
@ConditionalOnProperty(prefix = "demo.health", name = "enable", havingValue = "true")
public class MyAutoConfiguration {

    @Bean
    public HealthController healthController() {
        return new HealthController();
    }

}
```

- @AutoConfiguration 注解是自动配置类的注解。
- @ConditionalOnWebApplication 表示当是web项目时才会自动添加health接口。
- @ConditionalOnProperty 表示当指定的属性为指定的值时才会自动添加health接口。

## 创建一个Controller接口

很平常的一个Controller接口，用来做心跳检查

```java
@RestController
public class HealthController {

    @GetMapping("health")
    public String health(){
        return "success";
    }
}
```

## 添加扫描

需要在`META-INF/spring.factories`中添加我们创建的配置类。这样在启动的时候就会自动扫描这个文件来加载对应的配置类

```properties
org.springframework.boot.autoconfigure.EnableAutoConfiguration=\
demo.spring.starter.config.MyAutoConfiguration
```

## 使用

直接在我们的项目中依赖我们刚刚写的这个starter，并且在properties中添加`demo.health.enable=true`即可。当然也别忘了依赖`spring-boot-starter-web`，毕竟我们在配置类中限制了必须是web项目才可以。

```xml
<dependencies>
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-web</artifactId>
    </dependency>
    <dependency>
        <groupId>demo.spring.starter</groupId>
        <artifactId>demo-spring-boot-starter</artifactId>
        <version>1.0-SNAPSHOT</version>
    </dependency>
</dependencies>
```

访问：`http://localhost:8080/health`，可以看到正确返回了`success`
