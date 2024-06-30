---
title: Spring中有两个相同id的bean会报错吗
layout: doc
outline: deep
---

# Spring中有两个相同id的bean会报错吗

1. 在同一个xml配置文件中，如果存在相同id的bean会报错。主要原因是spring启动时在解析xml文件时会报id重复的错误
2. 在不同的xml配置文件中，如果存在相同的id的bean，不会报错。后面定义的bean会覆盖前面定义的bean
3. 在同一个配置类中，如果存在相同的id的bean，不会报错。会以第一个声明的bean为准。
4. 在不同的配置类中，如果存在相同的id的bean，也不会报错。和在同一个配置类中相同，也是以第一个声明的bean生效。
5. 在xml与配置类中存在相同的id的bean，也不会报错。以xml中声明的bean为准。
