---
title: '@Component 和 @Bean 的区别'
layout: doc
outline: deep
---

# @Component 和 @Bean 的区别

- 注解位置不同

`@Component` 注解在类上，`@Bean` 注解在方法上。

- 实例化方式不同

`@Component` 是通过扫描`@ComponentScan`注解设置的类路径来自动检测及自动装配到Spring Ioc容器中，`@Bean`标注的是方法，表明这个方式产生一个类实例，使用方法名为bean的名称并设置到ioc容器中。

- 自定义能力不同

`@Bean`是注解到方法上，需要在方法内部手动实例化对象，有更多的自定义能力，同时对于第三方库中的类，无法标注`@Component`注解，因此只能通过`@Bean`的方式。

::: code-group

```java [@Component]
@Target(ElementType.TYPE)
@Retention(RetentionPolicy.RUNTIME)
@Documented
@Indexed
public @interface Component {

	String value() default "";

}
```

```java [@Bean]
@Target({ElementType.METHOD, ElementType.ANNOTATION_TYPE})
@Retention(RetentionPolicy.RUNTIME)
@Documented
public @interface Bean {

	@AliasFor("name")
	String[] value() default {};

	@AliasFor("value")
	String[] name() default {};

	@Deprecated
	Autowire autowire() default Autowire.NO;

	boolean autowireCandidate() default true;

	String initMethod() default "";

	String destroyMethod() default AbstractBeanDefinition.INFER_METHOD;
}
```

:::
