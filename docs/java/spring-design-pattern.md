---
title: Spring都使用了哪些设计模式
layout: doc
outline: deep
---

# Spring都使用了哪些设计模式

## 单例模式

在注册bean的时候，默认都是单例模式，即`scope="singleton"`。只不过这个单例是在ioc容器中唯一的，是基于名称唯一的。

## 原型模式

在注册bean的时候，如果设置为多例模式，即`scope="prototype"`。此时，每次获取bean的时候，都会通过克隆获取bean的实例。

## 模板模式

模板模式的核心是父类定义号流程，然后将流程中需要子类实现的方法进行抽象化，以便于子类继承实现。例如`AbstractApplicationContext`中的`refresh`方法中，实现了启动IOC容器的大部分逻辑。而其中的`getBeanFactory`、`refreshBeanFactory`等方法需要子类实现。在`ClassPathXmlApplicationContext`以及`AnnotationConfigApplicationContext`中，都是实现了`AbstractApplicationContext`中定义的`getBeanFactory`、`refreshBeanFactory`等方法。

## 观察者模式

观察者模式是对象间的一对多的依赖关系，当一个对象发生改变时，依赖它的所有对象都会得到通知，并自动更新。Spring的事件驱动模型就是一个很好的实现，

- 定义事件：实现一个继承`ApplicationEvent`的事件类
- 定义观察者：实现`ApplicationListener`接口
- 发布事件：调用`ApplicationContext`的`publishEvent`方法，所有的观察者会收到事件并处理

## 工厂模式

典型的是`BeanFactory`，通过`getBean`方法获取bean实例。

## 代理模式

代理模式是给某一个对象提供一个代理对象，并由代理对象控制对原对象的访问。Spring AOP中就是非常明确的实现，它是基于动态代理的，如果要代理的对象实现了接口，则aop会使用jdk代理去创建，如果没有接口，则aop会使用cglib代理去创建。
