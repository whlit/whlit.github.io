---
title: Spring自动装配原理
layout: doc
outline: deep
---

# Spring自动装配原理

在SpringBoot项目中我们要启动一个项目首先要定义一个启动类，通过启动类来启动我们的项目，那就首先通过这个启动类来分析。

一个简单的启动类一般是这样的：

```java
package com.example.demo;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class Main {
    public static void main(String[] args) {
        SpringApplication.run(Main.class, args);
    }
}
```

在这个启动类中我们看到，有两个spring的引入，一个是`SpringApplication`，一个是`@SpringBootApplication`注解。

## @SpringBootApplication

```java
@Target(ElementType.TYPE)
@Retention(RetentionPolicy.RUNTIME)
@Documented
@Inherited
@SpringBootConfiguration
@EnableAutoConfiguration
@ComponentScan(excludeFilters = { @Filter(type = FilterType.CUSTOM, classes = TypeExcludeFilter.class),
		@Filter(type = FilterType.CUSTOM, classes = AutoConfigurationExcludeFilter.class) })
public @interface SpringBootApplication {


	@AliasFor(annotation = EnableAutoConfiguration.class)
	Class<?>[] exclude() default {};

	@AliasFor(annotation = EnableAutoConfiguration.class)
	String[] excludeName() default {};

	@AliasFor(annotation = ComponentScan.class, attribute = "basePackages")
	String[] scanBasePackages() default {};

	@AliasFor(annotation = ComponentScan.class, attribute = "basePackageClasses")
	Class<?>[] scanBasePackageClasses() default {};

	@AliasFor(annotation = ComponentScan.class, attribute = "nameGenerator")
	Class<? extends BeanNameGenerator> nameGenerator() default BeanNameGenerator.class;

	@AliasFor(annotation = Configuration.class)
	boolean proxyBeanMethods() default true;

}
```

在`@SpringBootApplication`注解中，我们可以看到它上面有`SpringBootConfiguration`、`@EnableAutoConfiguration`和`@ComponentScan`注解分开来看。

## @SpringBootConfiguration

`@SpringBootConfiguration`是一个配置类，用来配置spring的配置，比如说`DataSource`、`JdbcTransactionManager`等等。这个注解在`@SpringBootApplication`上，表明了这个类是一个spring的配置类。

## @ComponentScan

`@ComponentScan`注解是用来告诉Spring要扫描哪些包下的类，并且要排除哪些类。我们可以通过这个注解来扫描我们的项目并且排除一些不需要的类。

```java
@Retention(RetentionPolicy.RUNTIME)
@Target(ElementType.TYPE)
@Documented
@Repeatable(ComponentScans.class)
public @interface ComponentScan {

	@AliasFor("basePackages")
	String[] value() default {};

	@AliasFor("value")
	String[] basePackages() default {}; // 配置要扫描的包

	Class<?>[] basePackageClasses() default {};

	Class<? extends BeanNameGenerator> nameGenerator() default BeanNameGenerator.class;

	Class<? extends ScopeMetadataResolver> scopeResolver() default AnnotationScopeMetadataResolver.class;

	ScopedProxyMode scopedProxy() default ScopedProxyMode.DEFAULT;

	String resourcePattern() default ClassPathScanningCandidateComponentProvider.DEFAULT_RESOURCE_PATTERN;

	boolean useDefaultFilters() default true;

	Filter[] includeFilters() default {};

	Filter[] excludeFilters() default {};

	boolean lazyInit() default false;


	@Retention(RetentionPolicy.RUNTIME)
	@Target({})
	@interface Filter {

		FilterType type() default FilterType.ANNOTATION;

		@AliasFor("classes")
		Class<?>[] value() default {};

		@AliasFor("value")
		Class<?>[] classes() default {};

		String[] pattern() default {};

	}

}
```

## @EnableAutoConfiguration

`@EnableAutoConfiguration`是一个开启自动装配的注解。

```java
@Target(ElementType.TYPE)
@Retention(RetentionPolicy.RUNTIME)
@Documented
@Inherited
@AutoConfigurationPackage
@Import(AutoConfigurationImportSelector.class)
public @interface EnableAutoConfiguration {

	String ENABLED_OVERRIDE_PROPERTY = "spring.boot.enableautoconfiguration";

	Class<?>[] exclude() default {};

	String[] excludeName() default {};
}
```

在这个注解上我们看到`@Import(AutoConfigurationImportSelector.class)`它引入了`AutoConfigurationImportSelector`类，这个类是一个自动装配的选择器类。

在`getAutoConfigurationEntry`方法中，我们可以通过这个方法来获取自动装配的配置类。

```java
protected AutoConfigurationEntry getAutoConfigurationEntry(AnnotationMetadata annotationMetadata) {
    if (!isEnabled(annotationMetadata)) {
        return EMPTY_ENTRY;
    }
    AnnotationAttributes attributes = getAttributes(annotationMetadata);
    List<String> configurations = getCandidateConfigurations(annotationMetadata, attributes);
    configurations = removeDuplicates(configurations);
    Set<String> exclusions = getExclusions(annotationMetadata, attributes);
    checkExcludedClasses(configurations, exclusions);
    configurations.removeAll(exclusions);
    configurations = getConfigurationClassFilter().filter(configurations);
    fireAutoConfigurationImportEvents(configurations, exclusions);
    return new AutoConfigurationEntry(configurations, exclusions);
}
```

在这个方法中，首先通过`isEnabled`方法来判断是否启用自动装配，如果不启用就返回一个空的自动装配配置类。如果启用则读取`META-INF/spring.factories`下的自动配置的配置类，也就是我们在创建Starter的时候需要告诉Spring如何自动装配的配置类。

```java
protected List<String> getCandidateConfigurations(AnnotationMetadata metadata, AnnotationAttributes attributes) {
	List<String> configurations = new ArrayList<>(
			SpringFactoriesLoader.loadFactoryNames(getSpringFactoriesLoaderFactoryClass(), getBeanClassLoader()));
	ImportCandidates.load(AutoConfiguration.class, getBeanClassLoader()).forEach(configurations::add);
	Assert.notEmpty(configurations,
			"No auto configuration classes found in META-INF/spring.factories nor in META-INF/spring/org.springframework.boot.autoconfigure.AutoConfiguration.imports. If you "
					+ "are using a custom packaging, make sure that file is correct.");
	return configurations;
}
```

例如`spring-boot-autoconfigure`中的`META-INF/spring.factories`文件中有许都类：

```properties
# Initializers
org.springframework.context.ApplicationContextInitializer=\
org.springframework.boot.autoconfigure.SharedMetadataReaderFactoryContextInitializer,\
org.springframework.boot.autoconfigure.logging.ConditionEvaluationReportLoggingListener

...

# Depends on database initialization detectors
org.springframework.boot.sql.init.dependency.DependsOnDatabaseInitializationDetector=\
org.springframework.boot.autoconfigure.batch.JobRepositoryDependsOnDatabaseInitializationDetector,\
org.springframework.boot.autoconfigure.quartz.SchedulerDependsOnDatabaseInitializationDetector,\
org.springframework.boot.autoconfigure.session.JdbcIndexedSessionRepositoryDependsOnDatabaseInitializationDetector
```

以`org.springframework.boot.autoconfigure.data.redis.RedisAutoConfiguration`为例：

```java
@AutoConfiguration
@ConditionalOnClass(RedisOperations.class)
@EnableConfigurationProperties(RedisProperties.class)
@Import({ LettuceConnectionConfiguration.class, JedisConnectionConfiguration.class })
public class RedisAutoConfiguration {

	@Bean
	@ConditionalOnMissingBean(name = "redisTemplate")
	@ConditionalOnSingleCandidate(RedisConnectionFactory.class)
	public RedisTemplate<Object, Object> redisTemplate(RedisConnectionFactory redisConnectionFactory) {
		RedisTemplate<Object, Object> template = new RedisTemplate<>();
		template.setConnectionFactory(redisConnectionFactory);
		return template;
	}

	@Bean
	@ConditionalOnMissingBean
	@ConditionalOnSingleCandidate(RedisConnectionFactory.class)
	public StringRedisTemplate stringRedisTemplate(RedisConnectionFactory redisConnectionFactory) {
		return new StringRedisTemplate(redisConnectionFactory);
	}

}
```

## @ConditionalOnClass

这是一个Redis的自动配置类，首先`@AutoConfiguration`标明这是一个供SpringBoot进行自动配置类。`@ConditionalOnClass(RedisOperations.class)`表示这个类需要依赖`RedisOperations`类。只有`RedisOperations`这个类存在的时候，才会加载这个类进行自动配置。`@ConditionalOnClass`是在类加载之前，使用 ASM 解析注释元数据，当你的pom中没有依赖`org.springframework.data:spring-data-redis`时，也就不存在`RedisOperations`类，所以这个类就不会被处理。`@ConditionalOnMissingBean(name = "redisTemplate")`是当Spring容器中不存在一个名字叫做`redisTemplate`的RedisTemplate Bean时，才会通过这个方法实例化Bean并加入到Spring容器中。

这个注解还有其他不同场景下的注解：

| 注解                            | 用法                                         |
| ------------------------------- | -------------------------------------------- |
| `@ConditionalOnBean`            | 当Spring容器中存在指定的Bean时               |
| `@ConditionalOnClass`           | 当类路径下存在指定的类时                     |
| `@ConditionalOnCloudPlatform`   | 当指定的云平台存在时                         |
| `@ConditionalOnExpression`      | 当指定的SpEL表达式为true时                   |
| `@ConditionalOnJava`            | 当指定的Java版本大于等于指定的版本时         |
| `@ConditionalOnJndi`            | 当指定的JNDI存在时                           |
| `@ConditionalOnMissingBean`     | 当Spring容器中不存在指定的Bean时             |
| `@ConditionalOnMissingClass`    | 当类路径下不存在指定的类时                   |
| `@ConditionalOnProperty`        | 当指定的属性是指定的值时                     |
| `@ConditionalOnResource`        | 当指定的资源存在于类路径上时                 |
| `@ConditionalOnSingleCandidate` | 当Spring容器中指定的Bean可以确定单一的实例时 |
| `@ConditionalOnWebApplication`  | 当应用程序时Web应用时                        |
