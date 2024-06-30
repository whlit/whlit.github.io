---
title: Spring Xml自动装配
layout: doc
outline: deep
---

# Spring Xml自动装配

## no

`autowire="no"`
不进行自动装配需要指定注入的实例

```java
public class People {
    private String name;
    //省略了get和set方法
}

public class Car {
    private String color;
    private People people;
    //省略了get和set方法
}
```

```xml
<bean id="zhangsan" class="com.test.People">
    <property name = "name" value = "zhangsan" />
</bean>
<bean id="car" class="com.test.Car">
    <property name = "color" value = "red" />
    <property name = "people" ref = "zhangsan" />
</bean>
```

## byName

`autowire="byName"`
根据名称进行自动装配，`<bean>` 标签中定义了`autowire="byName"`时，对类中set方法的名称从ioc容器中获取名称相同的bean实例进行注入

```xml
<bean id="zhangsan" class="com.test.People">
    <property name = "name" value = "zhangsan" />
</bean>
<bean id="car" class="com.test.Car" autowire="byName">
    <property name = "color" value = "red" />
</bean>
```

## byType

`autowire="byType"`
和byName类似，根据类型进行自动装配，`<bean>` 标签中定义了`autowire="byType"`时，对类中set方法的参数类型从ioc容器中获取类型相同的bean实例进行注入

```xml
<bean id="zhangsan" class="com.test.People">
    <property name = "name" value = "zhangsan" />
</bean>
<bean id="car" class="com.test.Car" autowire="byType">
    <property name = "color" value = "red" />
</bean>
```

## constructor

`autowire="constructor"`
根据构造函数进行装配，类的构造函数为一个有参的构造函数，`<bean>` 标签中定义了`autowire="constructor"`时，对类的构造函数中的参数类型，从ioc容器中获取对应类型的bean实例进行实例化

```java
public class People {
    private String name;
    //省略了get和set方法
}

public class Car {
    private String color;
    private People people;
    //省略了get和set方法
    public Car(People people){
        this.people = people;
    }
}
```

```xml
<bean id="zhangsan" class="com.test.People">
    <property name = "name" value = "zhangsan" />
</bean>
<bean id="car" class="com.test.Car" autowire="constructor">
    <property name = "color" value = "red" />
</bean>
```

## autodetect

当需要对xml在的bean的自动装配的规则相同时，可以在`<beans>` 标签中添加：`default-autowire="byName"`，或者byType形式进行配置，当然如果某个bean的配置需要另外一种形式的配置时，可以对该`<bean>`标签配置autowire属性进行配置，该中方式可以覆盖beans标签中的配置
**该种方式在spring4.x中已经被删除了**

```xml
<beans ... default-autowire="byName>
    <bean id="zhangsan" class="com.test.People">
        <property name = "name" value = "zhangsan" />
    </bean>
    <bean id="car" class="com.test.Car">
        <property name = "color" value = "red" />
    </bean>
</beans>
```

## 参考文档

[使用 XML 配置在 Spring 中自动装配](https://www.netjstech.com/2016/04/autowiring-using-xml-configuration-in-spring.html)
