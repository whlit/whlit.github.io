---
title: Java 中 Stream 的使用
layout: doc
outline: deep
---

# Java 中 Stream 的使用

Stream 是 Java 1.8 新增的一个功能，它可以帮助我们实现数据的简单高效的操作。

## 将List转换为Map

- 将`List<String>` 转换为 `Map<String, Integer>`，key为字符串，value为字符串的长度。

```java
public static void main(String[] args) {
    List<String> list = List.of("Tom", "Jack", "Lily", "July");
    Map<String, Integer> map = list.stream()
            .collect(Collectors.toMap(
                    Function.identity(), // key 获取函数，直接使用元素本身
                    String::length, // value 获取函数，使用String的length方法
                    (k1, k2) -> k1, // 当key相同时的处理函数，默认抛出异常
                    HashMap::new // Map的创建函数，默认使用HashMap
            ));
}
```

- 将`List<User>` 转换为 `Map<String, Integer>`，key为用户的名字，value为用户的年龄。

::: code-group

```java [list2map]
public static void main(String[] args) {
    List<User> users = List.of(new User("Tom", 10), new User("Jack", 20),
            new User("Lily", 30));
    Map<String, Integer> map = users.stream()
            .collect(Collectors.toMap(
                    User::getName,
                    User::getAge,
                    (k1, k2) -> k1
            ));
}
```

```java [User]
class User {
    public User(String name, Integer age) {
        this.name = name;
        this.age = age;
    }
    private String name;
    private Integer age;

    public String getName() {
        return name;
    }

    public Integer getAge() {
        return age;
    }
}
```

:::

## 将两个List合并为一个List

- 将`List<String>` 和 `List<String>` 合并为`List<String>`。

可以直接使用`Stream.concat`合并两个流。

```java
public static void main(String[] args) {
    List<String> list1 = List.of("tom", "jerry", "jack");
    List<String> list2 = List.of("张三", "李四", "王五");
    List<String> list = Stream.concat(list1.stream(), list2.stream()).toList();
}
```

## 去重

```java
public static void main(String[] args) {
    List<String> list = List.of("Tom", "Jack", "Lily", "July", "Tom");
    List<String> list2 = list.stream().distinct().toList();
}
```

## 排序

```java
public static void main(String[] args) {
    List<String> list = List.of("Tom", "Jack", "Lily", "July");
    List<String> list2 = list.stream().sorted().toList();
    List<String> list3 = list.stream().sorted(Comparator.reverseOrder()).toList();
}
```

## 过滤

```java
public static void main(String[] args) {
    List<String> list = List.of("Tom", "Jack", "Lily", "July");
    List<String> list2 = list.stream().filter(s -> s.startsWith("J")).toList();
}
```

## 对List中每个元素进行操作返回新的List

```java
public static void main(String[] args) {
    List<String> list = List.of("Tom", "Jack", "Lily", "July");
    List<String> list2 = list.stream().map(String::toUpperCase).toList();
    List<Integer> list3 = list.stream().map(String::length).toList();
}
```

## 将`List<List<String>>` 转换为`List<String>`

```java
public static void main(String[] args) {
    List<List<String>> list = List.of(List.of("Tom", "Jack"), List.of("Lily", "July"));
    List<String> list2 = list.stream().flatMap(Collection::stream).toList();
}
```

## 对集合中的元素进行分组

- 根据字符串长度分组

```java
public static void main(String[] args) {
    List<String> list = List.of("Tom", "Jack", "Lily", "July");
    Map<Integer, List<String>> map = list.stream()
    .collect(Collectors.groupingBy(String::length)); // 根据字符串长度分组
}
```

- 根据年龄分组，每组根据名字排序，返回用户名分组

::: code-group

```java [GroupingBy]
public static void main(String[] args) {
    List<User> users = List.of(new User("Tom", 10), new User("Jack", 20),
                new User("Lily", 30));

    Map<Integer, List<String>> map = users.stream()
        .collect(Collectors.groupingBy(
            User::getAge, // 根据年龄分组
            Collectors.collectingAndThen( // 分组后集合操作
                Collectors.toList(),
                list -> list.stream()
                    .map(User::getName).sorted().toList() // 转换为名字列表并排序
            )
        ));
}

```

```java [User]
public class User {
    private String name;
    private Integer age;
    public User(String name, Integer age) {
        this.name = name;
        this.age = age;
    }
    public String getName() {
        return name;
    }
    public Integer getAge() {
        return age;
    }
}
```

:::

- 根据名字和年龄分组

::: code-group

```java [GroupingBy]
public static void main(String[] args) {
    List<User> users = List.of(new User("Tom", 10), new User("Jack", 20),
                new User("Lily", 30));
    Map<String, Map<Integer, List<User>>> map = users.stream().collect(
                Collectors.groupingBy(
                        User::getName, // 根据名字分组
                        Collectors.groupingBy(
                                User::getAge // 根据年龄分组
                        )
                )
        );
}
```

```java [User]
public class User {
    private String name;
    private Integer age;
    public User(String name, Integer age) {
        this.name = name;
        this.age = age;
    }
    public String getName() {
        return name;
    }
    public Integer getAge() {
        return age;
    }
}
```

:::

## 将集合中的字符串用逗号拼接

```java
public static void main(String[] args) {
    List<String> list = List.of("Tom", "Jack", "Lily", "July");
    String str = list.stream().collect(Collectors.joining(","));
}
```

## 对流中的元素进行累积缩减

```java
public static void main(String[] args) {
    List<Integer> list = List.of(1, 2, 3, 4, 5, 6, 7, 8, 9, 10);
    int sum = list.stream().reduce(0, Integer::sum);
}
```

上面的代码相当于：

```java
public static void main(String[] args) {
    List<Integer> list = List.of(1, 2, 3, 4, 5, 6, 7, 8, 9, 10);
    int sum = 0;
    for (int i : list) {
        sum = Integer.sum(sum, i);
    }
}
```
