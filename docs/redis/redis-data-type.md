---
layout: doc
title: Redis 数据类型
outline: deep
---

# Redis 数据类型

## String

String 类型是基础的`key:value`类型，key是字符串类型，value可以是bytes、string、序列化对象、字节数组。value最大不可超过512MB.

### SET & GET <Badge>常用</Badge>

SET和GET是两个最基础的操作，也是Redis的基础，set操作是设置值，get操作是获取值。

[![官方文档](https://img.shields.io/badge/Redis_Get-官方文档-blue?logo=redis)](https://redis.io/docs/latest/commands/get/)

::: code-group

```sh [redis-cli]
127.0.0.1:6379> SET xiaohong 小红
OK
127.0.0.1:6379> GET xiaohong
"小红"
```

```java [java]
String res1 = jedis.set("xiaohong", "小红");
System.out.println(res1);  // OK
String res2 = jedis.get("xiaohong");
System.out.println(res2);  // 小红
```

:::

::: tip Set 可选参数

- EX: 设置过期时间，单位为秒。
- PX: 设置过期时间，单位为毫秒。
- EXAT: 设置指定的Unix过期时间，单位为秒。
- PXAT: 设置指定的Unix过期时间，单位为毫秒。
- NX: 当key不存在时才生效。
- XX: 当key已存在时才生效。
- KEEPTTL: 保留该key的剩余存活时间。
- GET: 返回该key的旧值，如果key不存在则返回nil，如果值的类型不是string则返回错误并中止设置。

:::

::: code-group

```sh [redis-cli]
127.0.0.1:6379> set xiaohong xh
OK
127.0.0.1:6379> set xiaohong haha nx
(nil)
127.0.0.1:6379> get xiaohong
"xh"
127.0.0.1:6379> set xiaohong haha xx
OK
127.0.0.1:6379> get xiaohong
"haha"
127.0.0.1:6379> set xiaohong xh ex 10
OK
127.0.0.1:6379> get xiaohong
"xh"
127.0.0.1:6379> get xiaohong
(nil)
```

```java [java]
jedis.set("xiaohong", "xh");
jedis.set("xiaohong", "haha", SetParams.setParams().nx());
System.out.println(jedis.get("xiaohong")); // xh

jedis.set("xiaohong", "haha", SetParams.setParams().xx());
System.out.println(jedis.get("xiaohong")); // haha

jedis.set("xiaohong", "xh", SetParams.setParams().ex(10));
System.out.println(jedis.get("xiaohong")); // xh

Thread.sleep(10000);
System.out.println(jedis.get("xiaohong")); // null
```

:::

### MSET & MGET <Badge>常用</Badge>

MSET和MGET是两个最基础的操作的批量操作，可以同时设置多个key，也可以同时获取多个key。

[![官方文档](https://img.shields.io/badge/Redis_Mget-官方文档-blue?logo=redis)](https://redis.io/docs/latest/commands/mget/)

::: code-group

```sh [redis-cli]
127.0.0.1:6379> MSET xiaohong 小红 xiaoming 小明
OK
127.0.0.1:6379> MGET xiaohong xiaoming
1)"小红"
2)"小明"
```

```java [java]
String res1 = jedis.mset("xiaohong","小红","xiaoming","小明");
System.out.println(res1);  // OK
List<String> list = jedis.mget("xiaohong","xiaoming");
System.out.println(list);  // [小红, 小明]
```

:::

### GETSET <Badge type="danger">废弃</Badge>

以原子的方式将一个值设置为另一个值，并返回旧的值。

[![官方文档](https://img.shields.io/badge/Redis_GetSet-官方文档-blue?logo=redis)](https://redis.io/docs/latest/commands/getset/)

```sh [redis-cli]
127.0.0.1:6379> SET xiaohong 小红
OK
127.0.0.1:6379> GETSET xiaohong 小明
"小红"
127.0.0.1:6379> GET xiaohong
"小明"
```

### GETDEL

获取值并删除，如果key不存在则返回null。

[![官方文档](https://img.shields.io/badge/Redis_GetDel-官方文档-blue?logo=redis)](https://redis.io/docs/latest/commands/getdel/)

::: code-group

```sh [redis-cli]
127.0.0.1:6379> GETDEL xiaohong
"小红"
127.0.0.1:6379> GET xiaohong
(nil)
```

```java [java]
String res1 = jedis.getDel("xiaohong");
System.out.println(res1);  // 小红
String res2 = jedis.get("xiaohong");
System.out.println(res2);  // null
```

:::

### GETRANGE & SETRANGE {#getrange-and-setrange}

GETRANGE 和 SETRANGE 用于获取和设置字符串的一部分。
`getrange key start end`：返回字符串key的值从start到end的子串，包括start和end。
`setrange key offset value`：将字符串key的值从start到end的子串替换为value，如果value长度不够则用`\x00`填充。

[![官方文档](https://img.shields.io/badge/Redis_GetRange-官方文档-blue?logo=redis)](https://redis.io/docs/latest/commands/getrange/)

::: code-group

```sh [redis-cli]
127.0.0.1:6379> SET xiaohong 'hello world'
OK
127.0.0.1:6379> GETRANGE xiaohong 0 2
"hel"
127.0.0.1:6379> GETRANGE xiaohong -3 -1
"rld"
127.0.0.1:6379> GETRANGE xiaohong 0 -1
"hello world"
127.0.0.1:6379> GETRANGE xiaohong 10 100
"d"
127.0.0.1:6379> GETRANGE xiaohong 20 100
""
127.0.0.1:6379> SETRANGE xiaohong 2 'abc'
11
127.0.0.1:6379> GET xiaohong
"heabc world"
127.0.0.1:6379> SETRANGE xiaohong 20 'TEST'
24
127.0.0.1:6379> GET xiaohong
"heabc world\x00\x00\x00\x00\x00\x00\x00\x00\x00TEST"
```

```java [java]
jedis.set("xiaohong", "hello world");
String res1 = jedis.getrange("xiaohong", 0, 2);
System.out.println(res1);  // hel
String res2 = jedis.getrange("xiaohong", -3, -1);
System.out.println(res2);  // rld
String res3 = jedis.getrange("xiaohong", 0, -1);
System.out.println(res3);  // hello world
String res4 = jedis.getrange("xiaohong", 10, 100);
System.out.println(res4);  // d
String res5 = jedis.getrange("xiaohong", 20, 100);
System.out.println(res5);  // ""
jedis.setrange("xiaohong", 2, "abc");
String res6 = jedis.get("xiaohong");
System.out.println(res6);  // heabc world
jedis.setrange("xiaohong", 20, "TEST");
String res7 = jedis.get("xiaohong");
System.out.println(res7);  // heabc worldTEST
```

:::

这里java代码最后打印的值其实是`heabc world\x00\x00\x00\x00\x00\x00\x00\x00\x00TEST` 中间填充有`\x00`。

### SETEX <Badge type="danger">废弃</Badge>

SETEX是设置key并设置过期时间（单位为秒）。

[![官方文档](https://img.shields.io/badge/Redis_SetEx-官方文档-blue?logo=redis)](https://redis.io/docs/latest/commands/setex/)

```sh [redis-cli]
127.0.0.1:6379> SETEX xiaohong 10 'hello world'
OK
127.0.0.1:6379> TTL xiaohong
(integer) 10
127.0.0.1:6379> GET xiaohong
"hello world"
# 等待10秒。。。
127.0.0.1:6379> GET xiaohong
(nil)
```

### SETNX <Badge type="danger">废弃</Badge>

SETNX 是设置key，如果key已经存在，则不设置。

[![官方文档](https://img.shields.io/badge/Redis_SetNx-官方文档-blue?logo=redis)](https://redis.io/docs/latest/commands/setnx/)

```sh [redis-cli]
127.0.0.1:6379> SETNX xiaohong 'hello world'
(integer) 1
127.0.0.1:6379> SETNX xiaohong 'hello'
(integer) 0
127.0.0.1:6379> GET xiaohong
"hello world"
```

### GETEX

GETEX是获取key并可以设置过期时间，该命令支持一组修改过期时间的选择：

[![官方文档](https://img.shields.io/badge/Redis_GetEx-官方文档-blue?logo=redis)](https://redis.io/docs/latest/commands/getex/)

::: tip 可选参数

- `PX`:以毫秒为单位设置过期时间。
- `EX`:以秒为单位设置过期时间。
- `EXAT`:设置密钥过期的指定Unix时间戳（以秒为单位）。
- `PXAT`:设置密钥过期的指定Unix时间戳（以毫秒为单位）。
- `PERSIST`:删除密钥的过期时间。

:::

::: code-group

```sh [redis-cli]
127.0.0.1:6379> SET xiaohong 小红
OK
127.0.0.1:6379> GETEX xiaohong
"小红"
127.0.0.1:6379> TTL xiaohong
(integer) -1
127.0.0.1:6379> GETEX xiaohong EX 10
"小红"
127.0.0.1:6379> TTL xiaohong
(integer) 10
```

```java [java]
jedis.set("xiaohong", "小红");
String res = jedis.getEx("xiaohong", GetExParams.getExParams());
System.out.println(res);  // 小红
long ttl = jedis.ttl("xiaohong");
System.out.println(ttl);  // -1
String res2 = jedis.getEx("xiaohong", GetExParams.getExParams().ex(10));
System.out.println(res2);  // 小红
long ttl2 = jedis.ttl("xiaohong");
System.out.println(ttl2);  // 10
```

:::

### PSETEX <Badge type="danger">废弃</Badge>

PSETEX和SETEX一样，只是这个单位是毫秒。

[![官方文档](https://img.shields.io/badge/Redis_PSetEx-官方文档-blue?logo=redis)](https://redis.io/docs/latest/commands/psetex/)

### MSETNX

批量设置键值，如果key已经存在，则不设置。但只要有一个值已经存在就不会执行操作。也就是要么都成功，要么都失败。

[![官方文档](https://img.shields.io/badge/Redis_MSetNx-官方文档-blue?logo=redis)](https://redis.io/docs/latest/commands/msetnx/)

::: code-group

```sh [redis-cli]
127.0.0.1:6379> MSETNX xiaohong 小红 xiaoming 小明
(integer) 1
127.0.0.1:6379> MSETNX xiaohong 小红 xiaolan 小兰
(integer) 0
127.0.0.1:6379> MGET xiaohong xiaoming xiaolan
1) "小红"
2) "小明"
3) (nil)
```

```java [java]
jedis.msetnx("xiaohong", "小红", "xiaoming", "小明");
jedis.msetnx("xiaohong", "小红", "xiaolan", "小兰");
List<String> mget = jedis.mget("xiaohong", "xiaoming", "xiaolan");
System.out.println(mget);  // [小红, 小明, null]
```

:::

### APPEND

APPEND是将值拼接到原有值的末尾。如果key不存在，则会创建一个key为key，值为value。

[![官方文档](https://img.shields.io/badge/Redis_Append-官方文档-blue?logo=redis)](https://redis.io/docs/latest/commands/append/)

::: code-group

```sh [redis-cli]
127.0.0.1:6379> SET xiaohong 小红
OK
127.0.0.1:6379> APPEND xiaohong 小红
(integer) 6
127.0.0.1:6379> GET xiaohong
"小红小红"
```

```java [java]
jedis.set("xiaohong", "小红");
jedis.append("xiaohong", "小红");
String res = jedis.get("xiaohong");
System.out.println(res);  // 小红小红
```

:::

### INCR & DECR <Badge>常用</Badge>

将key的值增加1或者减少1，并返回值，如果key不存在，则会创建一个key为key，值为1。如果值不可以转为整数，则会报错。

[![官方文档](https://img.shields.io/badge/Redis_Incr-官方文档-blue?logo=redis)](https://redis.io/docs/latest/commands/incr/)

::: code-group

```sh [redis-cli]
127.0.0.1:6379> EXISTS age
(integer) 0
127.0.0.1:6379> INCR age
(integer) 1
127.0.0.1:6379> INCR age
(integer) 2
127.0.0.1:6379> DECR age
(integer) 1
```

```java [java]
boolean exists = jedis.exists("age");
System.out.println(exists); // false
long age = jedis.incr("age");
System.out.println(age); // 1
age = jedis.incr("age");
System.out.println(age); // 2
age = jedis.decr("age");
System.out.println(age); // 1
```

:::

### INCRBY & DECRBY <Badge>常用</Badge>

将key的值增加或者减少指定的值，并返回值，如果key不存在，则会创建一个key为key，值为指定的值。如果值不可以转为整数，则会报错。

[![官方文档](https://img.shields.io/badge/Redis_IncrBy-官方文档-blue?logo=redis)](https://redis.io/docs/latest/commands/incrby/)

::: code-group

```sh [redis-cli]
127.0.0.1:6379> EXISTS age
(integer) 0
127.0.0.1:6379> INCRBY age 10
(integer) 10
127.0.0.1:6379> INCRBY age 10
(integer) 20
127.0.0.1:6379> DECRBY age 10
(integer) 10
```

```java [java]
boolean exists = jedis.exists("age");
System.out.println(exists); // false
long age = jedis.incrBy("age", 10);
System.out.println(age); // 10
age = jedis.incrBy("age", 10);
System.out.println(age); // 20
age = jedis.decrBy("age", 10);
System.out.println(age); // 10
```

:::

### INCRBYFLOAT

将key的值增加指定的值（浮点数，如果要减少值则可以传入负数），并返回值，如果key不存在，则会创建一个key为key，值为指定的值。如果值不可以转为数字，则会报错。

[![官方文档](https://img.shields.io/badge/Redis_IncrByFloat-官方文档-blue?logo=redis)](https://redis.io/docs/latest/commands/incrbyfloat/)

::: code-group

```sh [redis-cli]
127.0.0.1:6379> EXISTS flo
(integer) 0
127.0.0.1:6379> incrbyfloat flo 10.1
"10.1"
127.0.0.1:6379> incrbyfloat flo 10.1
"20.2"
127.0.0.1:6379> incrbyfloat flo -1.1
"19.1"
```

```java [java]
boolean exists = jedis.exists("flo");
System.out.println(exists); // false
double res = jedis.incrByFloat("flo", 10.1f);
System.out.println(res); // 10.1
res = jedis.incrByFloat("flo", 10.1f);
System.out.println(res); // 20.2
res = jedis.incrByFloat("flo", -1.1f);
System.out.println(res); // 19.1
```

:::

### LCS

获取两个字符串的最长公共子串；如果两个字符串没有公共子串，则返回空字符串。

[![官方文档](https://img.shields.io/badge/Redis_lcs-官方文档-blue?logo=redis)](https://redis.io/docs/latest/commands/lcs/)

::: code-group

```sh [redis-cli]
127.0.0.1:6379> set a aaaa
OK
127.0.0.1:6379> set b bbbb
OK
127.0.0.1:6379> lcs a b
""
```

```java [java]
jedis.set("a", "aaaa");
jedis.set("b", "bbbb");
LCSMatchResult lcs = jedis.lcs("a", "b", LCSParams.LCSParams());
System.out.println(lcs.getMatchString()); // ""
```

:::

### STRLEN <Badge>常用</Badge>

获取值的**字节长度**。

[![官方文档](https://img.shields.io/badge/Redis_StrLen-官方文档-blue?logo=redis)](https://redis.io/docs/latest/commands/strlen/)

::: code-group

```sh [redis-cli]
127.0.0.1:6379> SET xiaohong 小红
OK
127.0.0.1:6379> STRLEN xiaohong
(integer) 6
```

```java [java]
jedis.set("xiaohong", "小红");
long len = jedis.strlen("xiaohong");
System.out.println(len); // 6
```

:::

### SUBSTR <Badge type="danger">废弃</Badge>

获取值的子串。此命令已被废弃替换为[GETRANGE](#getrange-and-setrange)。

[![官方文档](https://img.shields.io/badge/Redis_SubStr-官方文档-blue?logo=redis)](https://redis.io/docs/latest/commands/substr/)

## List

List 列表是简单的字符串列表，按照插入顺序排序。你可以添加一个元素到列表的头部（左边）或者尾部（右边）。

::: details 实现队列 FIFO

使用LPUSH和RPOP可以实现一个FIFO队列。

::: code-group

```sh [redis-cli]
127.0.0.1:6379> lpush fifo a
(integer) 1
127.0.0.1:6379> lpush fifo b
(integer) 2
127.0.0.1:6379> lpush fifo c
(integer) 3
127.0.0.1:6379> rpop fifo
"a"
127.0.0.1:6379> rpop fifo
"b"
127.0.0.1:6379> rpop fifo
"c"
```

```java [java]
jedis.lpush("fifo", "a");
jedis.lpush("fifo", "b");
jedis.lpush("fifo", "c");
String res1 = jedis.rpop("fifo");
System.out.println(res1);  // a
String res2 = jedis.rpop("fifo");
System.out.println(res2);  // b
String res3 = jedis.rpop("fifo");
System.out.println(res3);  // c
```

:::

::: details 实现堆栈 FILO

使用LPUSH和LPOP可以实现一个堆栈。

::: code-group

```sh [redis-cli]
127.0.0.1:6379> lpush filo a
(integer) 1
127.0.0.1:6379> lpush filo b
(integer) 2
127.0.0.1:6379> lpush filo c
(integer) 3
127.0.0.1:6379> lpop filo
"c"
127.0.0.1:6379> lpop filo
"b"
127.0.0.1:6379> lpop filo
"a"
```

```java [java]
jedis.lpush("filo", "a");
jedis.lpush("filo", "b");
jedis.lpush("filo", "c");
String res1 = jedis.lpop("filo");
System.out.println(res1);  // c
String res2 = jedis.lpop("filo");
System.out.println(res2);  // b
String res3 = jedis.lpop("filo");
System.out.println(res3);  // a
```

:::

### LPUSH & RPUSH <Badge>常用</Badge>

将一个或多个值插入到列表的头部（左边）或者尾部（右边）。LPUSH: 从左边插入，RPUSH: 从右边插入。如果key不存在，则会创建一个空列表，并插入值。如果push的值类型不是列表，则会报错。

[![官方文档](https://img.shields.io/badge/Redis_LPush-官方文档-blue?logo=redis)](https://redis.io/docs/latest/commands/lpush/)

::: code-group

```sh [redis-cli]
127.0.0.1:6379> exists list
(integer) 0
127.0.0.1:6379> lpush list a b c
(integer) 3
127.0.0.1:6379> exists list
(integer) 1
127.0.0.1:6379> lrange list 0 -1
1) "c"
2) "b"
3) "a"
127.0.0.1:6379> rpush list d e f
(integer) 6
127.0.0.1:6379> lrange list 0 -1
1) "c"
2) "b"
3) "a"
4) "d"
5) "e"
6) "f"
```

```java [java]
boolean exists = jedis.exists("list");
System.out.println(exists); // false
jedis.lpush("list", "a", "b", "c");
boolean exists2 = jedis.exists("list");
System.out.println(exists2); // true
List<String> list = jedis.lrange("list", 0, -1);
System.out.println(list);  // [c, b, a]
jedis.rpush("list", "d", "e", "f");
List<String> list2 = jedis.lrange("list", 0, -1);
System.out.println(list2);  // [c, b, a, d, e, f]
```

:::

### LPOP & RPOP <Badge>常用</Badge> {#lpop-rpop}

删除并返回列表的第一个元素。如果列表没有元素，或者key不存在，则返回nil。

[![官方文档](https://img.shields.io/badge/Redis_LPop-官方文档-blue?logo=redis)](https://redis.io/docs/latest/commands/lpop/)

::: tip 可选参数

count：删除多少个元素。

:::

::: code-group

```sh [redis-cli]
127.0.0.1:6379> lpush list a b c d f
(integer) 5
127.0.0.1:6379> lpop list
"f"
127.0.0.1:6379> lpop list 2
1) "d"
2) "c"
```

```java [java]
jedis.lpush("list", "a", "b", "c", "d", "f");
String res1 = jedis.lpop("list");
System.out.println(res1);  // f
List<String> res2 = jedis.lpop("list", 2);
System.out.println(res2);  // [d, c]
```

:::

### LLEN <Badge>常用</Badge>

获取列表的长度。

[![官方文档](https://img.shields.io/badge/Redis_LLen-官方文档-blue?logo=redis)](https://redis.io/docs/latest/commands/llen/)

::: code-group

```sh [redis-cli]
127.0.0.1:6379> lpush list a b c
(integer) 3
127.0.0.1:6379> llen list
(integer) 3
```

```java [java]
jedis.lpush("list", "a", "b", "c");
long len = jedis.llen("list");
System.out.println(len); // 3
```

:::

### LMOVE

原子地返回并删除列表地头部或者尾部元素，并将该元素推送到另一列表地头部或者尾部，取决于参数;

[![官方文档](https://img.shields.io/badge/Redis_LMove-官方文档-blue?logo=redis)](https://redis.io/docs/latest/commands/lmove/)

::: tip 语法

`LMOVE source destination <LEFT | RIGHT> <LEFT | RIGHT>`

- source: 要删除地列表
- destination: 要推送到地列表
- LEFT | RIGHT: 从列表的头部还是尾部删除元素
- LEFT | RIGHT: 要推送到列表地头部还是尾部

:::

::: code-group

```sh [redis-cli]
127.0.0.1:6379> lpush list1 a b c d e f g
(integer) 7
127.0.0.1:6379> lmove list1 list2 left right
"g"
127.0.0.1:6379> lrange list1 0 -1
1) "f"
2) "e"
3) "d"
4) "c"
5) "b"
6) "a"
127.0.0.1:6379> lrange list2 0 -1
1) "g"
127.0.0.1:6379> lmove list1 list2 right left
"a"
127.0.0.1:6379> lrange list1 0 -1
1) "f"
2) "e"
3) "d"
4) "c"
5) "b"
127.0.0.1:6379> lrange list2 0 -1
1) "a"
2) "g"
```

```java [java]
jedis.del("list1", "list2");
jedis.lpush("list1", "a", "b", "c", "d", "e", "f", "g");
String s = jedis.lmove("list1", "list2", ListDirection.LEFT, ListDirection.RIGHT);
System.out.println(s); // g
System.out.println(jedis.lrange("list1", 0, -1)); // [f, e, d, c, b, a]
System.out.println(jedis.lrange("list2", 0, -1)); // [g]
```

:::

### LTRIM

裁剪现有的列表使其只保留指定范围的元素。

[![官方文档](https://img.shields.io/badge/Redis_LTrim-官方文档-blue?logo=redis)](https://redis.io/docs/latest/commands/ltrim/)

::: tip 一般用法

一般和[LPUSH/RPUSH](#lpush-rpush-常用)一起使用，将一个或多个值插入到列表的头部（左边）或者尾部（右边），同时确保列表不会超过指定的长度。

:::

::: code-group

```sh [redis-cli]
127.0.0.1:6379> lpush list a b c d e f g
(integer) 7
127.0.0.1:6379> ltrim list 0 3
OK
127.0.0.1:6379> lrange list 0 -1
1) "g"
2) "f"
3) "e"
4) "d"
127.0.0.1:6379> lpush list h
(integer) 5
127.0.0.1:6379> lrange list 0 -1
1) "h"
2) "g"
3) "f"
4) "e"
5) "d"
```

```java [java]
jedis.lpush("list", "a", "b", "c", "d", "e", "f", "g");
jedis.ltrim("list", 0, 3);
List<String> list = jedis.lrange("list", 0, -1);
System.out.println(list);  // [g, f, e, d]
jedis.lpush("list", "h");
List<String> list2 = jedis.lrange("list", 0, -1);
System.out.println(list2);  // [h, g, f, e, d]
```

:::

### LRANGE <Badge>常用</Badge>

返回列表中指定区间内的元素，区间以偏移量表示，如：0表示列表的第一个元素，1表示列表的第二个元素，-1表示列表的最后一个元素。偏移量可以是负数，表示倒数第几个元素。如果偏移量超出列表的长度，则视为列表的最后一个元素。如果开始索引大于末尾索引，则返回空列表。

[![官方文档](https://img.shields.io/badge/Redis_LRange-官方文档-blue?logo=redis)](https://redis.io/docs/latest/commands/lrange/)

::: code-group

```sh [redis-cli]
127.0.0.1:6379> lpush list a b c d
(integer) 4
127.0.0.1:6379> lrange list 1 3
1) "c"
2) "b"
3) "a"
127.0.0.1:6379> lrange list -3 -1
1) "c"
2) "b"
3) "a"
127.0.0.1:6379> lrange list 1 10
1) "c"
2) "b"
3) "a"
127.0.0.1:6379> lrange list 4 5
(empty array)
```

```java [java]
jedis.lpush("list", "a", "b", "c", "d");
List<String> list = jedis.lrange("list", 1, 3);
System.out.println(list);  // [c, b, a]
List<String> list2 = jedis.lrange("list", -3, -1);
System.out.println(list2);  // [c, b, a]
List<String> list3 = jedis.lrange("list", 1, 10);
System.out.println(list3);  // [c, b, a]
List<String> list4 = jedis.lrange("list", 4, 5);
System.out.println(list4);  // []
```

:::

### BLPOP & BRPOP <Badge>常用</Badge> {#blpop-brpop}

从指定地列表中弹出一个元素，当所有指定地列表中都没有任何元素时，会进行阻塞，它是[LPOP/RPOP](#lpop-rpop)的阻塞版本。

[![官方文档](https://img.shields.io/badge/Redis_BLPop-官方文档-blue?logo=redis)](https://redis.io/docs/latest/commands/blpop/)

::: tip 语法

`BLPOP key [key ...] timeout`

- 可以指定多个列表进行顺序检查，并从第一个非空列表中弹出元素;
- timeout: 超时时间，当阻塞等待指定时间后解除阻塞并返回null，当设置为0时，表示无限期阻塞等待;

该命令返回值为双元素数组，分别代表key和value

:::

::: code-group

```sh [redis-cli]
127.0.0.1:6379> del list1 list2
(integer) 2
127.0.0.1:6379> lpush list1 a b c
(integer) 3
127.0.0.1:6379> blpop list1 list2 0
1) "list1"
2) "c"
```

```java [java]
jedis.del("list1", "list2");
jedis.lpush("list1", "a", "b", "c");
List<String> res = jedis.blpop(0, "list1", "list2");
System.out.println(res); // [list1, c]
```

:::

### BLMOVE

### BLMPOP

### BRPOPLPUSH

### LINSERT

### LINDEX

### LMPOP

### LPOS

### LPUSHX & RPUSHX

### LREM

### LSET

### RPOPLPUSH <Badge type="danger">废弃</Badge> {#rpoplpush}

原子地返回并删除列表地尾部元素，并将其推送到另一列表地头部；该命令应使用[LMOVE](#lmove)替代;

## Set

Set 是无序的不重复元素的集合。

### SADD <Badge>常用</Badge>

向集合中添加一个或多个元素，返回添加成功的元素的个数。如果value的类型不是集合时返回错误。

[![官方文档](https://img.shields.io/badge/Redis_SAdd-官方文档-blue?logo=redis)](https://redis.io/docs/latest/commands/sadd/)

::: code-group

```sh [redis-cli]
127.0.0.1:6379> sadd set a b c d
(integer) 4
127.0.0.1:6379> smembers set
1) "a"
2) "b"
3) "c"
4) "d"
127.0.0.1:6379> sadd set a c e f
(integer) 2
127.0.0.1:6379> smembers set
1) "a"
2) "b"
3) "c"
4) "d"
5) "e"
6) "f"
```

```java [java]
long count = jedis.sadd("set", "a", "b", "c", "d");
System.out.println(count);  // 4
Set<String> set = jedis.smembers("set");
System.out.println(set);  // [a, b, c, d]
long count2 = jedis.sadd("set", "a", "c", "e", "f");
System.out.println(count2);  // 2
Set<String> set2 = jedis.smembers("set");
System.out.println(set2);  // [a, b, c, d, e, f]
```

:::

### SREM <Badge>常用</Badge>

从集合中移除指定的元素。返回移除的元素个数。如果不是集合中的元素，则返回0。如果不是集合，则返回错误。

[![官方文档](https://img.shields.io/badge/Redis_SRem-官方文档-blue?logo=redis)](https://redis.io/docs/latest/commands/srem/)

::: code-group

```sh [redis-cli]
127.0.0.1:6379> sadd set a b c d
(integer) 4
127.0.0.1:6379> srem set a
(integer) 1
127.0.0.1:6379> smembers set
1) "b"
2) "c"
3) "d"
127.0.0.1:6379> srem set c d
(integer) 2
127.0.0.1:6379> smembers set
1) "b"
```

```java [java]
jedis.sadd("set", "a", "b", "c", "d");
long count = jedis.srem("set", "a");
System.out.println(count);  // 1
Set<String> set = jedis.smembers("set");
System.out.println(set);  // [b, c, d]
long count2 = jedis.srem("set", "c", "d");
System.out.println(count2);  // 2
Set<String> set2 = jedis.smembers("set");
System.out.println(set2);  // [b]
```

:::

### SMEMBERS <Badge>常用</Badge>

返回集合中的所有元素。

[![官方文档](https://img.shields.io/badge/Redis_SMembers-官方文档-blue?logo=redis)](https://redis.io/docs/latest/commands/smembers/)

::: code-group

```sh [redis-cli]
127.0.0.1:6379> sadd set a b c d
(integer) 4
127.0.0.1:6379> smembers set
1) "a"
2) "b"
3) "c"
4) "d"
```

```java [java]
jedis.sadd("set", "a", "b", "c", "d");
Set<String> set = jedis.smembers("set");
System.out.println(set);  // [a, b, c, d]
```

:::

### SCARD <Badge>常用</Badge>

返回集合中元素的个数。

[![官方文档](https://img.shields.io/badge/Redis_Scard-官方文档-blue?logo=redis)](https://redis.io/docs/latest/commands/scard/)

::: code-group

```sh [redis-cli]
127.0.0.1:6379> sadd set a b c d
(integer) 4
127.0.0.1:6379> scard set
(integer) 4
```

```java [java]
jedis.sadd("set", "a", "b", "c", "d");
long count = jedis.scard("set");
System.out.println(count);  // 4
```

:::

### SISMEMBER <Badge>常用</Badge>

判断元素是否在集合中。存在返回1，不存在返回0。

[![官方文档](https://img.shields.io/badge/Redis_SIsMember-官方文档-blue?logo=redis)](https://redis.io/docs/latest/commands/sismember/)

::: code-group

```sh [redis-cli]
127.0.0.1:6379> sadd set a b c d
(integer) 4
127.0.0.1:6379> sismember set a
(integer) 1
127.0.0.1:6379> sismember set e
(integer) 0
```

```java [java]
jedis.sadd("set", "a", "b", "c", "d");
boolean b = jedis.sismember("set", "a");
System.out.println(b);  // true
b = jedis.sismember("set", "e");
System.out.println(b);  // false
```

:::

### SRANDMEMBER <Badge>常用</Badge> {#srandmember}

随机返回集合中的一个元素。

[![官方文档](https://img.shields.io/badge/Redis_SRandMember-官方文档-blue?logo=redis)](https://redis.io/docs/latest/commands/srandmember/)

::: tip 可选参数

- `count`: 返回指定个数的元素

:::

::: warning 返回的多个元素可以重复

:::

::: code-group

```sh [redis-cli]
127.0.0.1:6379> smembers set
1) "a"
2) "b"
3) "c"
4) "d"
127.0.0.1:6379> srandmember set
"b"
127.0.0.1:6379> srandmember set 2
1) "b"
2) "c"
```

```java [java]
jedis.sadd("set", "a", "b", "c", "d");
String member = jedis.srandmember("set");
System.out.println(member);  // b
List<String> members = jedis.srandmember("set", 2);
System.out.println(members);  // [b, c]
```

### SPOP <Badge>常用</Badge>

随机返回集合中的一个元素，并删除。类似于[SRANDMEMBER](#srandmember)，只不过SRANDMEMBER只是返回元素但不删除。而且SRANDMEMBER返回的元素可以重复，SPOP不会重复。

[![官方文档](https://img.shields.io/badge/Redis_SPop-官方文档-blue?logo=redis)](https://redis.io/docs/latest/commands/spop/)

::: tip 可选参数

- `count`: 随机返回指定个数的元素，并删除

:::

::: code-group

```sh [redis-cli]
127.0.0.1:6379> sadd set a b c d
(integer) 4
127.0.0.1:6379> spop set
"d"
127.0.0.1:6379> spop set 2
1) "a"
2) "c"
127.0.0.1:6379> smembers set
1) "b"
```

```java [java]
jedis.sadd("set", "a", "b", "c", "d");
String member = jedis.spop("set");
System.out.println(member);  // d
Set<String> members = jedis.spop("set", 2);
System.out.println(members);  // [a, c]
Set<String> members2 = jedis.smembers("set");
System.out.println(members2);  // [b]
```

:::

### SINTER <Badge>常用</Badge>

返回多个集合的交集。

[![官方文档](https://img.shields.io/badge/Redis_SInter-官方文档-blue?logo=redis)](https://redis.io/docs/latest/commands/sinter/)

::: code-group

```sh [redis-cli]
127.0.0.1:6379> smembers set
1) "a"
2) "c"
3) "d"
127.0.0.1:6379> smembers set2
1) "c"
2) "d"
127.0.0.1:6379> smembers set3
1) "a"
2) "c"
127.0.0.1:6379> sinter set set2 set3
1) "c"
```

```java [java]
jedis.sadd("set", "a", "b", "c", "d");
jedis.sadd("set2", "c", "d");
jedis.sadd("set3", "a", "c");
Set<String> set = jedis.sinter("set", "set2", "set3");
System.out.println(set);  // [c]
```

:::

### SINTERSTORE <Badge>常用</Badge>

此命令等同于[SINTER](#sinter-常用)，返回多个集合的交集，但是SINTERSTORE会将结果保存到指定集合中。

[![官方文档](https://img.shields.io/badge/Redis_SInterStore-官方文档-blue?logo=redis)](https://redis.io/docs/latest/commands/sinterstore/)

::: code-group

```sh [redis-cli]
127.0.0.1:6379> smembers set1
1) "a"
2) "c"
3) "d"
127.0.0.1:6379> smembers set2
1) "c"
2) "d"
127.0.0.1:6379> smembers set3
1) "a"
2) "c"
127.0.0.1:6379> sinterstore set set1 set2 set3
(integer) 1
127.0.0.1:6379> smembers set
1) "c"
```

```java [java]
jedis.sadd("set1", "a", "b", "c", "d");
jedis.sadd("set2", "c", "d");
jedis.sadd("set3", "a", "c");
jedis.sinterstore("set", "set1", "set2", "set3");
Set<String> set = jedis.smembers("set");
System.out.println(set);  // [c]
```

:::

### SUNION <Badge>常用</Badge>

返回多个集合的并集。

[![官方文档](https://img.shields.io/badge/Redis_SUnion-官方文档-blue?logo=redis)](https://redis.io/docs/latest/commands/sunion/)

::: code-group

```sh [redis-cli]
127.0.0.1:6379> smembers set1
1) "a"
2) "c"
3) "d"
127.0.0.1:6379> smembers set2
1) "c"
2) "d"
127.0.0.1:6379> smembers set3
1) "a"
2) "c"
127.0.0.1:6379> sunion set1 set2 set3
1) "a"
2) "c"
3) "d"
```

```java [java]
jedis.sadd("set1", "a", "b", "c", "d");
jedis.sadd("set2", "c", "d");
jedis.sadd("set3", "a", "c");
Set<String> set = jedis.sunion("set1", "set2", "set3");
System.out.println(set);  // [a, b, c, d]
```

:::

### SUNIONSTORE <Badge>常用</Badge>

此命令等同于[SUNION](#sunion-常用)，返回多个集合的并集，但是SUNIONSTORE会将结果保存到指定集合中。

[![官方文档](https://img.shields.io/badge/Redis_SUnionStore-官方文档-blue?logo=redis)](https://redis.io/docs/latest/commands/sunionstore/)

::: code-group

```sh [redis-cli]
127.0.0.1:6379> smembers set1
1) "a"
2) "c"
3) "d"
127.0.0.1:6379> smembers set2
1) "c"
2) "d"
127.0.0.1:6379> smembers set3
1) "a"
2) "c"
127.0.0.1:6379> sunionstore set set1 set2 set3
(integer) 3
127.0.0.1:6379> smembers set
1) "a"
2) "c"
3) "d"
```

```java [java]
jedis.sadd("set1", "a", "b", "c", "d");
jedis.sadd("set2", "c", "d");
jedis.sadd("set3", "a", "c");
jedis.sunionstore("set", "set1", "set2", "set3");
Set<String> set = jedis.smembers("set");
System.out.println(set);  // [a, b, c, d]
```

:::

### SDIFF <Badge>常用</Badge>

返回第一个集合和多个集合的差集。

[![官方文档](https://img.shields.io/badge/Redis_SDiff-官方文档-blue?logo=redis)](https://redis.io/docs/latest/commands/sdiff/)

::: code-group

```sh [redis-cli]
127.0.0.1:6379> smembers set1
1) "a"
2) "c"
3) "d"
127.0.0.1:6379> smembers set2
1) "c"
2) "d"
127.0.0.1:6379> smembers set3
1) "c"
127.0.0.1:6379> sdiff set1 set2 set3
1) "a"
```

```java [java]
jedis.sadd("set1", "a", "b", "c", "d");
jedis.sadd("set2", "c", "d");
jedis.sadd("set3", "a", "c");
Set<String> set = jedis.sdiff("set1", "set2", "set3");
System.out.println(set);  // [b]
```

:::

### SDIFFSTORE <Badge>常用</Badge>

此命令等同于[SDIFF](#sdiff-常用)，返回第一个集合和多个集合的差集，但是SDIFFSTORE会将结果保存到指定集合中。

[![官方文档](https://img.shields.io/badge/Redis_SDiffStore-官方文档-blue?logo=redis)](https://redis.io/docs/latest/commands/sdiffstore/)

::: code-group

```sh [redis-cli]
127.0.0.1:6379> smembers set1
1) "a"
2) "c"
3) "d"
127.0.0.1:6379> smembers set2
2) "c"
3) "d"
127.0.0.1:6379> smembers set3
1) "c"
127.0.0.1:6379> sdiffstore set set1 set2 set3
(integer) 1
127.0.0.1:6379> smembers set
1) "a"
```

```java [java]
jedis.sadd("set1", "a", "b", "c", "d");
jedis.sadd("set2", "c", "d");
jedis.sadd("set3", "a", "c");
jedis.sdiffstore("set", "set1", "set2", "set3");
Set<String> set = jedis.smembers("set");
System.out.println(set);  // [b]
```

### SMOVE

### SSCAN

### SMISMEMBER

### SINTERCARD

## Hash

哈希是存储结构化数据的类型，用来表示对象很方便

### HDEL <Badge>常用</Badge>

从哈希中删除一个或多个字段。如果字段不存在则被忽略。

[![官方文档](https://img.shields.io/badge/Redis_HDel-官方文档-blue?logo=redis)](https://redis.io/docs/latest/commands/hdel/)

::: code-group

```sh [redis-cli]
127.0.0.1:6379> hset doc title test size 200
(integer) 2
127.0.0.1:6379> hdel doc title
(integer) 1
127.0.0.1:6379> hget doc title
(integer) 0
```

```java [java]
jedis.hset("doc", "title", "test");
long res1 = jedis.hdel("doc", "title");
System.out.println(res1);  // 1
long res2 = jedis.hdel("doc", "title");
System.out.println(res2);  // 0
```

:::

### HEXISTS

### HGET & HSET <Badge>常用</Badge>

获取哈希的字段值，如果字段不存在则返回nil。

[![官方文档](https://img.shields.io/badge/Redis_HGet-官方文档-blue?logo=redis)](https://redis.io/docs/latest/commands/hget/)

::: code-group

```sh [redis-cli]
127.0.0.1:6379> hset doc title test size 200
(integer) 2
127.0.0.1:6379> hget doc title
"test"
127.0.0.1:6379> hget doc number
(nil)
```

```java [java]
jedis.hset("doc", "title", "test");
String res1 = jedis.hget("doc", "title");
System.out.println(res1);  // test
String res2 = jedis.hget("doc", "number");
System.out.println(res2);  // null
```

:::

### HGETALL <Badge>常用</Badge>

获取哈希的所有字段和值。

[![官方文档](https://img.shields.io/badge/Redis_HGetAll-官方文档-blue?logo=redis)](https://redis.io/docs/latest/commands/hgetall/)

::: code-group

```sh [redis-cli]
127.0.0.1:6379> hset doc title test size 200
(integer) 2
127.0.0.1:6379> hgetall doc
1) "title"
2) "test"
3) "size"
4) "200"
```

```java [java]
jedis.hset("doc", "title", "test");
jedis.hset("doc", "number", "200");
Map<String, String> map = jedis.hgetAll("doc");
System.out.println(map);  // {title=test, number=200}
```

:::

### HINCRBY <Badge>常用</Badge>

递增哈希指定字段的值。如果字段不存在，则初始化为0，然后再递增。

[![官方文档](https://img.shields.io/badge/Redis_HIncrBy-官方文档-blue?logo=redis)](https://redis.io/docs/latest/commands/hincrby/)

::: code-group

```sh [redis-cli]
127.0.0.1:6379> hset doc title test size 200
(integer) 2
127.0.0.1:6379> hincrby doc number 10
(integer) 10
127.0.0.1:6379> hget doc number
"10"
```

```java [java]
jedis.hset("doc", "title", "test");
long res1 = jedis.hincrBy("doc", "number", 10);
System.out.println(res1);  // 10
String res2 = jedis.hget("doc", "number");
System.out.println(res2);  // 10
```

:::

### HINCRBYFLOAT

### HKEYS

### HLEN <Badge>常用</Badge>

返回哈希中字段的数量。

[![官方文档](https://img.shields.io/badge/Redis_HLen-官方文档-blue?logo=redis)](https://redis.io/docs/latest/commands/hlen/)

::: code-group

```sh [redis-cli]
127.0.0.1:6379> hset doc title test size 200
(integer) 2
127.0.0.1:6379> hlen doc
(integer) 2
```

```java [java]
jedis.hset("doc", "title", "test");
long res = jedis.hlen("doc");
System.out.println(res);  // 1
```

:::

### HMGE & HMSET <Badge>常用</Badge>

HMSET同时设置多个字段，HMGET同时获取多个字段。

[![官方文档](https://img.shields.io/badge/Redis_HMGet-官方文档-blue?logo=redis)](https://redis.io/docs/latest/commands/hmget/)

::: warning HMSET

**HMSET**已经废弃，直接使用[HSET](#hget-hset-常用)

:::

::: code-group

```sh [redis-cli]
127.0.0.1:6379> hmset doc title test size 200
"OK"
127.0.0.1:6379> hmget doc title size number
1) "test"
2) "200"
3) (nil)
```

```java [java]
jedis.hset("doc", "title", "test");
List<String> list = jedis.hmget("doc", "title", "size", "number");
System.out.println(list);  // [test, null, null]
```

:::

### HSCAN

### HSTRLEN

### HVALS

### HSETNX

### HRANDFIELD

## Sorted Set

有序集合类型，相比于Set多了排序的score属性，同时也是唯一的，但是分值可以相同，也可以安装分值排序。

### BZMPOP

### BZPOPMAX

### BZPOPMIN

### ZADD <Badge>常用</Badge>

向排序集合中添加指定分数的元素。可以同时添加多个分数/元素对。如果元素已经存在，则会更新分数，并重新插入到正确的位置。分数为双精度浮点数。

[![官方文档](https://img.shields.io/badge/Redis_ZAdd-官方文档-blue?logo=redis)](https://redis.io/docs/latest/commands/zadd/)

::: tip 可选参数

- `XX`: 只更新已存在的元素
- `NX`: 只添加不存在的元素，不更新已存在的元素
- `LT`: 只有当分数小于当前元素的分数时才更新，不存在的元素会插入
- `GT`: 只有当分数大于当前元素的分数时才更新，不存在的元素会插入
- `CH`: 将返回值从新添加的元素数修改为更改的元素数，更改的元素指新添加的元素和已更新分数的元素。
- `INCR`: 类似于[ZINCRBY](#zincrby-常用)，让元素增加指定的分数，但只能指定一个分数/元素对。

::: warning

GT、LT和NX选项互斥

:::

::: code-group

```sh [redis-cli]
127.0.0.1:6379> zadd zset 1 a
(integer) 1
127.0.0.1:6379> zadd zset 2 b 3 c
(integer) 2
127.0.0.1:6379> zadd zset XX 4 d
(integer) 0
127.0.0.1:6379> zadd zset NX 5 e
(integer) 1
127.0.0.1:6379> zadd zset LT 6 f
(integer) 1
127.0.0.1:6379> zadd zset incr 2 g
"2"
127.0.0.1:6379> zadd zset incr 2 g
"4"
127.0.0.1:6379> zrange zset 0 -1 withscores
 1) "a"
 2) "1"
 3) "b"
 4) "2"
 5) "c"
 6) "3"
 7) "g"
 8) "4"
 9) "e"
10) "5"
11) "f"
12) "6"
```

```java [java]
jedis.zadd("zset", 1, "a");
jedis.zadd("zset", Map.of("b", 2.0, "c", 3.0));
jedis.zadd("zset", 4, "d", ZAddParams.zAddParams().xx());
jedis.zadd("zset", 5, "e", ZAddParams.zAddParams().nx());
jedis.zadd("zset", 6, "f", ZAddParams.zAddParams().lt());
jedis.zaddIncr("zset", 7, "g", ZAddParams.zAddParams().nx());
jedis.zaddIncr("zset", 7, "g", ZAddParams.zAddParams().xx());
List<Tuple> zset = jedis.zrangeWithScores("zset", 0, -1);
System.out.println(zset);  //[[a,1.0], [b,2.0], [c,3.0], [e,5.0], [f,6.0], [g,14.0]]
```

:::

### ZCARD <Badge>常用</Badge>

返回排序集合中的元素数。

[![官方文档](https://img.shields.io/badge/Redis_ZCard-官方文档-blue?logo=redis)](https://redis.io/docs/latest/commands/zcard/)

::: code-group

```sh [redis-cli]
127.0.0.1:6379> zadd zset 1 a 2 b 3 c
(integer) 3
127.0.0.1:6379> zcard zset
(integer) 3
```

```java [java]
jedis.zadd("zset", 1, "a");
jedis.zadd("zset", 2, "b");
jedis.zadd("zset", 3, "c");
System.out.println(jedis.zcard("zset"));  // 3
```

:::

### ZCOUNT

返回在指定分数范围的元素个数。

[![官方文档](https://img.shields.io/badge/Redis_ZCount-官方文档-blue?logo=redis)](https://redis.io/docs/latest/commands/zcount/)

::: code-group

```sh [redis-cli]
127.0.0.1:6379> zadd zset 1 a 2 b 3 c
(integer) 3
127.0.0.1:6379> zcount zset 2 3
(integer) 2
```

```java [java]
jedis.zadd("zset", 1, "a");
jedis.zadd("zset", 2, "b");
jedis.zadd("zset", 3, "c");
System.out.println(jedis.zcount("zset", 2, 3));  // 2
```

:::

### ZDIFF

### ZDIFFSTORE

### ZINCRBY <Badge>常用</Badge>

为指定元素增加指定的分数。如果元素不存在，则会创建一个新的元素并添加指定的分数。提供负数来减少分数。

[![官方文档](https://img.shields.io/badge/Redis_ZIncrBy-官方文档-blue?logo=redis)](https://redis.io/docs/latest/commands/zincrby/)

::: code-group

```sh [redis-cli]
127.0.0.1:6379> zadd zset 1 a 2 b 3 c
(integer) 3
127.0.0.1:6379> zincrby zset 2 d
"3"
127.0.0.1:6379> zrange zset 0 -1 withscores
 1) "a"
 2) "1"
 3) "b"
 4) "2"
 5) "c"
 6) "3"
 7) "d"
 8) "2"
```

```java [java]
jedis.zadd("zset", 1, "a");
jedis.zadd("zset", 2, "b");
jedis.zadd("zset", 3, "c");
System.out.println(jedis.zincrby("zset", 2, "d"));  // 2.0
List<Tuple> zset = jedis.zrangeWithScores("zset", 0, -1);
System.out.println(zset); // [[a,1.0], [b,2.0], [d,2.0], [c,3.0]]
```

:::

### ZINTER

### ZINTERSTORE <Badge>常用</Badge>

### ZINTERCARD

### ZLEXCOUNT

### ZMPOP

### ZMSCORE

### ZPOPMAX

### ZPOPMIN

### ZRANDMEMBER

### ZRANGE <Badge>常用</Badge>

返回排序集合中指定范围的元素。

[![官方文档](https://img.shields.io/badge/Redis_ZRange-官方文档-blue?logo=redis)](https://redis.io/docs/latest/commands/zrange/)

::: tip 语法

`ZRANGE key start stop [BYSCORE | BYLEX] [REV] [LIMIT offset count] [WITHSCORES]`

:::

::: info

从Redis6.2.0开始，此命令可以替换以下命令：[ZREVRANGE](#zrevrange-常用) [ZRANGEBYSCORE](#zrangebyscore-常用) [ZREVRANGEBYSCORE](#zrevrangebyscore-常用) [ZRANGEBYLEX](#zrangebylex-常用) [ZREVRANGEBYLEX](#zrevrangebylex-常用)

:::

::: code-group

```sh [redis-cli]
127.0.0.1:6379> zadd zset 1 a 2 b 3 c
(integer) 3
127.0.0.1:6379> zrange zset 0 -1
 1) "a"
 2) "b"
 3) "c"
```

```java [java]
jedis.zadd("zset", 1, "a");
jedis.zadd("zset", 2, "b");
jedis.zadd("zset", 3, "c");
List<String> zset = jedis.zrange("zset", 0, -1);
System.out.println(zset);  // [a, b, c]
```

:::

### ZRANGEBYLEX <Badge type="danger">废弃</Badge>

### ZRANGEBYSCORE

### ZRANGESTORE

### ZRANK

### ZREM <Badge>常用</Badge>

从指定的排序集合中删除指定的元素。

[![官方文档](https://img.shields.io/badge/Redis_ZRem-官方文档-blue?logo=redis)](https://redis.io/docs/latest/commands/zrem/)

::: code-group

```sh [redis-cli]
127.0.0.1:6379> zadd zset 1 a 2 b 3 c
(integer) 3
127.0.0.1:6379> zrem zset a
(integer) 1
127.0.0.1:6379> zrange zset 0 -1
 1) "b"
 2) "c"
```

```java [java]
jedis.zadd("zset", 1, "a");
jedis.zadd("zset", 2, "b");
jedis.zadd("zset", 3, "c");
jedis.zrem("zset", "a");
List<String> zset = jedis.zrange("zset", 0, -1);
System.out.println(zset);  // [b, c]
```

:::

### ZREMRANGEBYLEX

### ZREMRANGEBYRANK

### ZREMRANGEBYSCORE

### ZREVRANGE <Badge type="danger">废弃</Badge>

### ZREVRANGEBYLEX <Badge>常用</Badge>

### ZREVRANGEBYSCORE <Badge>常用</Badge>

### ZREVRANK

### ZSCAN

### ZSCORE <Badge>常用</Badge>

返回排序集合中元素的分数。

[![官方文档](https://img.shields.io/badge/Redis_ZScore-官方文档-blue?logo=redis)](https://redis.io/docs/latest/commands/zscore/)

::: code-group

```sh [redis-cli]
127.0.0.1:6379> zadd zset 1 a 2 b 3 c
(integer) 3
127.0.0.1:6379> zscore zset a
"1"
```

```java [java]
jedis.zadd("zset", 1, "a");
jedis.zadd("zset", 2, "b");
jedis.zadd("zset", 3, "c");
double zset = jedis.zscore("zset", "a");
System.out.println(zset);  // 1
```

:::

### ZUNIONSTORE <Badge>常用</Badge>

### ZUNION

## Streams

## Geospatial indexes

## Bitmaps

## Bitfields

## HyperLogLog

## 通用命令

### COPY

将源key的值复制到目标key中。如果目标key存在，返回0。

[![官方文档](https://img.shields.io/badge/Redis_Copy-官方文档-blue?logo=redis)](https://redis.io/docs/latest/commands/copy/)

::: tip 可选参数

REPLACE，如果目标key存在，则将其覆盖。

:::

::: code-group

```sh [redis-cli]
127.0.0.1:6379> SET xiaohong 小红
OK
127.0.0.1:6379> SET xiaoming 小明
OK
127.0.0.1:6379> COPY xiaohong xiaoming
(integer) 0
127.0.0.1:6379> GET xiaoming
"小明"
127.0.0.1:6379> COPY xiaohong xiaoming REPLACE
(integer) 1
127.0.0.1:6379> GET xiaoming
"小红"
127.0.0.1:6379> COPY xiaohong xiaolan
(integer) 1
127.0.0.1:6379> GET xiaolan
"小红"
```

```java [java]
jedis.set("xiaohong", "小红");
jedis.set("xiaoming", "小明");
boolean res = jedis.copy("xiaohong", "xiaoming", false);
System.out.println(res);  // false
String res2 = jedis.get("xiaoming");
System.out.println(res2);  // 小明
boolean res3 = jedis.copy("xiaohong", "xiaoming", false);
System.out.println(res3);  // true
String res4 = jedis.get("xiaoming");
System.out.println(res4);  // 小红
boolean res5 = jedis.copy("xiaohong", "xiaolan", false);
System.out.println(res5);  // false
String res6 = jedis.get("xiaolan");
System.out.println(res6);  // 小红
```

:::

### DEL <Badge>常用</Badge>

DEL操作是删除指定key。如果删除成功返回1，否则返回0。

[![官方文档](https://img.shields.io/badge/Redis_Del-官方文档-blue?logo=redis)](https://redis.io/docs/latest/commands/del/)

::: code-group

```sh [redis-cli]
127.0.0.1:6379> SET xiaohong 小红
127.0.0.1:6379> DEL xiaohong
(integer) 1
127.0.0.1:6379> DEL xiaohong
(integer) 0
```

```java [java]
jedis.set("xiaohong", "小红");
int res = jedis.del("xiaohong");
System.out.println(res);
int res2 = jedis.del("xiaohong");
System.out.println(res2);
```

:::

### DUMP

### EXISTS <Badge>常用</Badge>

EXISTS操作是判断key是否存在，如果存在返回true，不存在返回false。

[![官方文档](https://img.shields.io/badge/Redis_exists-官方文档-blue?logo=redis)](https://redis.io/docs/latest/commands/exists/)

::: code-group

```sh [redis-cli]
127.0.0.1:6379> SET xiaohong 小红
127.0.0.1:6379> EXISTS xiaohong
(integer) 1
127.0.0.1:6379> EXISTS xiaolan
(integer) 0
```

```java [java]
jedis.set("xiaohong", "小红");
boolean res = jedis.exists("xiaohong");
System.out.println(res);  // true
boolean res2 = jedis.exists("xiaolan");
System.out.println(res2);  // false
```

:::

### EXPIRE <Badge>常用</Badge>

为指定key设置过期时间，只有删除或者覆盖操作才会替换过期时间。包括DEL、SET、GETSET，例如使用INCR递增值，推送新值到list中，或者使用HSET更改哈希的字段值，都不会更改超时时间。如果已有过期时间，那么也可以刷新过期时间，将过期时间设置为新的值

[![官方文档](https://img.shields.io/badge/Redis_Expire-官方文档-blue?logo=redis)](https://redis.io/docs/latest/commands/expire/)

::: tip 可选参数

- `NX`: 只有key没有过期时才设置超时时间
- `XX`: 只有key已经过期时才设置超时时间
- `GT`: 只有新到期日大于旧到期日时，才设置超时时间
- `LT`: 只有新到期日小于旧到期日时，才设置超时时间

:::

::: code-group

```sh [redis-cli]
127.0.0.1:6379> SET xiaohong 小红
OK
127.0.0.1:6379> EXPIRE xiaohong 10
(integer) 1
127.0.0.1:6379> TTL xiaohong
(integer) 10
127.0.0.1:6379> SET xiaohong 小红红
OK
127.0.0.1:6379> TTL xiaohong
(integer) -1
127.0.0.1:6379> EXPIRE xiaohong 10 XX
(integer) 0
127.0.0.1:6379> TTL xiaohong
(integer) -1
127.0.0.1:6379> EXPIRE xiaohong 10 NX
(integer) 1
127.0.0.1:6379> TTL xiaohong
(integer) 10
```

```java [java]
jedis.set("xiaohong", "小红");
long res = jedis.expire("xiaohong", 10);
System.out.println(res);  // 1
long ttl = jedis.ttl("xiaohong");
System.out.println(ttl);  // 10
jedis.set("xiaohong", "小红红");
long ttl2 = jedis.ttl("xiaohong");
System.out.println(ttl2);  // -1
long res2 = jedis.expire("xiaohong", 10, ExpiryOption.XX);
System.out.println(res2);  // 0
long ttl3 = jedis.ttl("xiaohong");
System.out.println(ttl3);  // -1
long res3 = jedis.expire("xiaohong", 10, ExpiryOption.NX);
System.out.println(res3);  // 1
long ttl4 = jedis.ttl("xiaohong");
System.out.println(ttl4);  // 10
```

:::

### EXPIREAT

EXPIREAT操作与[EXPIRE](#expire-常用)类似，只不过它以Unix时间戳为参数。如果是过去的时间戳，那么key就会立即删除。

[![官方文档](https://img.shields.io/badge/Redis_Expireat-官方文档-blue?logo=redis)](https://redis.io/docs/latest/commands/expireat/)

::: tip 可选参数

- `NX`: 只有key没有过期时才设置过期时间
- `XX`: 只有key已经过期时才设置过期时间
- `GT`: 只有新到期日大于旧到期日时，才设置过期时间
- `LT`: 只有新到期日小于旧到期日时，才设置过期时间

:::

::: code-group

```sh [redis-cli]
127.0.0.1:6379> SET xiaohong 小红
OK
127.0.0.1:6379> EXPIREAT xiaohong 1711806730120
(integer) 1
127.0.0.1:6379> ttl xiaohong
(integer) 1710094923364
```

```java [java]
jedis.set("xiaohong", "小红");
long res = jedis.expireAt("xiaohong", 1711806730120);
System.out.println(res);  // 1
long ttl = jedis.ttl("xiaohong");
System.out.println(ttl);  // 1710094923364
```

:::

### EXPIRETIME

返回过期的unix时间戳。

[![官方文档](https://img.shields.io/badge/Redis_expiretime-官方文档-blue?logo=redis)](https://redis.io/docs/latest/commands/expiretime/)

::: code-group

```sh [redis-cli]
127.0.0.1:6379> SET xiaohong 小红
OK
127.0.0.1:6379> EXPIRETIME xiaohong
"1711806730120"
```

```java [java]
jedis.set("xiaohong", "小红");
String res = jedis.expireTime("xiaohong");
System.out.println(res);  // 1710094923364
```

:::

### KEYS

返回所有匹配的key，支持通配符。这个命令要小心使用，如果数据量很大的话很可能会导致内存溢出。生产环境请不要使用该方法，生产环境可以使用[SCAN](#scan)来完成对key的检索;

[![官方文档](https://img.shields.io/badge/Redis_Keys-官方文档-blue?logo=redis)](https://redis.io/docs/latest/commands/keys/)

::: code-group

```sh [redis-cli]
127.0.0.1:6379> SET xiaohong 小红
OK
127.0.0.1:6379> SET xiaoming 小明
OK
127.0.0.1:6379> keys *xiao*
1) "xiaohong"
2) "xiaoming"
```

```java [java]
jedis.set("xiaohong", "小红");
jedis.set("xiaoming", "小明");
Set<String> keys = jedis.keys("*xiao*");
System.out.println(keys);  // [xiaohong, xiaoming]
```

:::

### MIGRATE

### MOVE

### OBJECT ENCODING

### OBJECT FREQ

### OBJECT IDLETIME

### OBJECT REFCOUNT

### PERSIST

### PEXPIRE

### PEXPIREAT

### PEXPIRETIME

### RANDOMKEY

### RENAME

### RENAMENX

### RESTORE

### SCAN

迭代Redis中的键，此命令允许增量迭代，每次调用仅返回少量的数据，所以它可以在生产环境使用，并且不会发生[KEYS](#keys)那样的长时间阻塞服务器。

scan返回的是两个值组成的数组，第一个值是下次迭代的新游标值，第二个是迭代返回的元素数组。当返回的新游标值为0时表示所有元素都已经迭代完成。

[![redis-scan](https://img.shields.io/badge/Redis_Scan-官方文档-blue?logo=redis)](https://redis.io/docs/latest/commands/scan/)

::: tip 可选参数

- MATCH pattern: 在集合检索元素后，将数据返回客户端前，对结果进行模式匹配;
- COUNT count: 每次迭代应完成的工作量，Scan并不会保证每次返回键的数量，但可以通过count来调整迭代次数，默认值为10;
- TYPE type: 仅返回type类型的元素键，它是在检索元素之后，将数据返回客户端前，进行类型匹配，所以它并不能减少总体迭代的工作量。

:::

::: code-group

```sh [redis-cli]
127.0.0.1:6379> scan 0 match xiao* count 10
1) "14"
2) 1) "xiaohong"
   2) "xiao"
127.0.0.1:6379> scan 14 match xiao* count 10
1) "27"
2) (empty array)
127.0.0.1:6379> scan 27 match xiao* count 10
1) "0"
2) 1) "xiaoming"
   2) "xiaolan
```

```java [jedis]
String cursor = ScanParams.SCAN_POINTER_START;
ScanParams params = new ScanParams();
params.match("xiao*");
params.count(10);
do {
    ScanResult<String> result = jedis.scan(cursor, params);
    cursor = result.getCursor();
    System.out.println(result.getResult());
} while (!cursor.equals(ScanParams.SCAN_POINTER_START));

// [xiaohong, xiao]
// []
// [xiaoming, xiaolan]
```

```java [spring-data-redis]
List<String> keys = stringRedisTemplate.execute((RedisConnection connection) -> {
    try (Cursor<byte[]> cursor = connection.scan(ScanOptions.scanOptions().match("xiao*").build())) {
        return cursor.stream().map(String::new).collect(Collectors.toList());
    }
});
System.out.println(keys);

// [xiaohong, xiao, xiaoming, xiaolan]
```

:::

### SORT

### SORT_RO

### TOUCH

### TTL <Badge>常用</Badge>

获取指定key的剩余过期时间（单位为秒）。

[![官方文档](https://img.shields.io/badge/Redis_Ttl-官方文档-blue?logo=redis)](https://redis.io/docs/latest/commands/ttl/)

::: danger

在2.6及之前，如果key不存在或者key没有过期时间，则返回-1。在2.8开始，如果key不存在，则返回-2，如果没有过期时间，则返回-1。

:::

::: code-group

```sh [redis-cli]
127.0.0.1:6379> SET xiaohong 小红
OK
127.0.0.1:6379> TTL xiaohong
(integer) -1
127.0.0.1:6379> EXPIRE xiaohong 10
(integer) 1
127.0.0.1:6379> TTL xiaohong
(integer) 10
```

```java [java]
jedis.set("xiaohong", "小红");
long ttl = jedis.ttl("xiaohong");
System.out.println(ttl);  // -1
long res = jedis.expire("xiaohong", 10);
System.out.println(res);  // 1
long ttl2 = jedis.ttl("xiaohong");
System.out.println(ttl2);  // 10
```

:::

### PTTL

与[TTL](#ttl)相同，只不过返回的是毫秒。

[![官方文档](https://img.shields.io/badge/Redis_Pttl-官方文档-blue?logo=redis)](https://redis.io/docs/latest/commands/ttl/)

::: code-group

```sh [redis-cli]
127.0.0.1:6379> SET xiaohong 小红
OK
127.0.0.1:6379> PTTL xiaohong
(integer) -1
127.0.0.1:6379> EXPIRE xiaohong 10
(integer) 1
127.0.0.1:6379> PTTL xiaohong
(integer) 10000
```

```java [java]
jedis.set("xiaohong", "小红");
long ttl = jedis.pttl("xiaohong");
System.out.println(ttl);  // -1
long res = jedis.expire("xiaohong", 10);
System.out.println(res);  // 1
long ttl2 = jedis.pttl("xiaohong");
System.out.println(ttl2);  // 10000
```

:::

### TYPE

返回值的类型

[![官方文档](https://img.shields.io/badge/Redis_Type-官方文档-blue?logo=redis)](https://redis.io/docs/latest/commands/type/)

::: code-group

```sh [redis-cli]
127.0.0.1:6379> SET xiaohong 小红
OK
127.0.0.1:6379> TYPE xiaohong
"string"
127.0.0.1:6379> HSET xiaoming name 小红
(integer) 1
127.0.0.1:6379> TYPE xiaoming
"hash"
```

```java [java]
jedis.set("xiaohong", "小红");
jedis.hset("xiaoming", "name", "小红");
System.out.println(jedis.type("xiaohong"));  // string
System.out.println(jedis.type("xiaoming"));  // hash
```

:::

### UNLINK

### WAIT

### WAITAOF
