---
title: Spring boot validator
layout: doc
outline: deep
---

# Spring boot validator

## 在Service层使用

在controller层以外的地方使用校验，需要在接口层的方法参数上加上`@Valid` 注解，在实现类上加`@Validated` 注解

```java
//实体类
public class User {
    @NotEmpty(message="名字不可为空")
    private String name;
    ...
}
//接口
public interface UserService {
    void add(@Valid User user);//接口方法参数需要@Valid标识
}
//接口实现类
@Service
@Validated //搭配使用，Spring的注解，实现注解参数的校验
public class UserServiceImpl implements UserService {
    @Override
    void add(User user){
        //doSomeThing
    }
}
```
