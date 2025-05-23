---
layout: doc
title: Redis 数据类型
outline: deep
---

# Redis 数据类型

## String

String 类型是基础的`key:value`类型，key是字符串类型，value可以是bytes、string、序列化对象、字节数组。value最大不可超过512MB.

### GET & SET <Badge>常用</Badge> {#get-and-set}

SET和GET是两个最基础的操作，也是Redis的基础，set操作是设置值，get操作是获取值。

[官方文档 Redis GET](https://redis.io/docs/latest/commands/get/)

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

语法：`SET key value [NX | XX] [GET] [EX seconds | PX milliseconds | EXAT unix-time-seconds | PXAT unix-time-milliseconds | KEEPTTL]`

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

### MSET & MGET <Badge>常用</Badge> {#mset-and-mget}

MSET和MGET是两个最基础的操作的批量操作，可以同时设置多个key，也可以同时获取多个key。

[官方文档 Redis MGET](https://redis.io/docs/latest/commands/mget/)

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

### GETSET <Badge type="danger">废弃</Badge> {#getset}

以原子的方式将一个值设置为另一个值，并返回旧的值。新的命令是[SET](#get-and-set)并使用`GET`参数。

[官方文档 Redis GETSET](https://redis.io/docs/latest/commands/getset/)

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

[官方文档 Redis GETDEL](https://redis.io/docs/latest/commands/getdel/)

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

[官方文档 Redis GETRANGE](https://redis.io/docs/latest/commands/getrange/)

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

### SETEX <Badge type="danger">废弃</Badge> {#setex}

SETEX是设置key并设置过期时间（单位为秒）。替代命令为[SET](#get-and-set)并使用`EX`参数。

[官方文档 Redis SETEX](https://redis.io/docs/latest/commands/setex/)

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

### SETNX <Badge type="danger">废弃</Badge> {#setnx}

SETNX 是设置key，如果key已经存在，则不设置。替代命令为[SET](#get-and-set)并使用`NX`参数。

[官方文档 Redis SETNX](https://redis.io/docs/latest/commands/setnx/)

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

[官方文档 Redis GETEX](https://redis.io/docs/latest/commands/getex/)

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

### PSETEX <Badge type="danger">废弃</Badge> {#psetex}

PSETEX和SETEX一样，只是这个单位是毫秒。替代命令为[SET](#get-and-set)并使用PX参数。

[官方文档 Redis PSETEX](https://redis.io/docs/latest/commands/psetex/)

### MSETNX

批量设置键值，如果key已经存在，则不设置。但只要有一个值已经存在就不会执行操作。也就是要么都成功，要么都失败。

[官方文档 Redis MSETNX](https://redis.io/docs/latest/commands/msetnx/)

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

[官方文档 Redis APPEND](https://redis.io/docs/latest/commands/append/)

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

### INCR & DECR <Badge>常用</Badge> {#incr-and-decr}

将key的值增加1或者减少1，并返回值，如果key不存在，则会创建一个key为key，值为1。如果值不可以转为整数，则会报错。

[官方文档 Redis INCR](https://redis.io/docs/latest/commands/incr/)

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

### INCRBY & DECRBY <Badge>常用</Badge> {#incrby-and-decrby}

将key的值增加或者减少指定的值，并返回值，如果key不存在，则会创建一个key为key，值为指定的值。如果值不可以转为整数，则会报错。

[官方文档 Redis INCRBY](https://redis.io/docs/latest/commands/incrby/)

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

[官方文档 Redis INCRBYFLOAT](https://redis.io/docs/latest/commands/incrbyfloat/)

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

[官方文档 Redis LCS](https://redis.io/docs/latest/commands/lcs/)

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

### STRLEN <Badge>常用</Badge> {#strlen}

获取值的**字节长度**。

[官方文档 Redis STRLEN](https://redis.io/docs/latest/commands/strlen/)

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

### SUBSTR <Badge type="danger">废弃</Badge> {#substr}

获取值的子串。此命令已被废弃替换为[GETRANGE](#getrange-and-setrange)。

[官方文档 Redis SUBSTR](https://redis.io/docs/latest/commands/substr/)

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

### LPUSH & RPUSH <Badge>常用</Badge> {#lpush-and-rpush}

将一个或多个值插入到列表的头部（左边）或者尾部（右边）。LPUSH: 从左边插入，RPUSH: 从右边插入。如果key不存在，则会创建一个空列表，并插入值。如果push的值类型不是列表，则会报错。

[官方文档 Redis LPUSH](https://redis.io/docs/latest/commands/lpush/)

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

### LPOP & RPOP <Badge>常用</Badge> {#lpop-and-rpop}

删除并返回列表的第一个元素。如果列表没有元素，或者key不存在，则返回nil。

[官方文档 Redis LPOP](https://redis.io/docs/latest/commands/lpop/)

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

### LLEN <Badge>常用</Badge> {#llen}

获取列表的长度。

[官方文档 Redis LLEN](https://redis.io/docs/latest/commands/llen/)

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

[官方文档 Redis LMOVE](https://redis.io/docs/latest/commands/lmove/)

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

[官方文档 Redis LTRIM](https://redis.io/docs/latest/commands/ltrim/)

::: tip 一般用法

一般和[LPUSH/RPUSH](#lpush-and-rpush)一起使用，将一个或多个值插入到列表的头部（左边）或者尾部（右边），同时确保列表不会超过指定的长度。

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

### LRANGE <Badge>常用</Badge> {#lrange}

返回列表中指定区间内的元素，区间以偏移量表示，如：0表示列表的第一个元素，1表示列表的第二个元素，-1表示列表的最后一个元素。偏移量可以是负数，表示倒数第几个元素。如果偏移量超出列表的长度，则视为列表的最后一个元素。如果开始索引大于末尾索引，则返回空列表。

[官方文档 Redis LRANGE](https://redis.io/docs/latest/commands/lrange/)

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

### BLPOP & BRPOP <Badge>常用</Badge> {#blpop-and-brpop}

从指定地列表中弹出一个元素，当所有指定地列表中都没有任何元素时，会进行阻塞，它是[LPOP/RPOP](#lpop-and-rpop)的阻塞版本。

[官方文档 Redis BLPOP](https://redis.io/docs/latest/commands/blpop/)

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

该命令是[LMOVE](#lmove)的阻塞版本，当source列表包含元素时于[LMOVE](#lmove)相同，当source列表为空时，连接将会阻塞直到有元素被推送到source或者超时。

[官方文档 Redis BLMOVE](https://redis.io/docs/latest/commands/blmove/)

::: tip 语法

`BLMOVE source destination <LEFT | RIGHT> <LEFT | RIGHT> timeout`

- timeout: 超时时间，设置为0时，表示无限期阻塞等待。

其他信息请参考：[LMOVE](#lmove)

:::

### BLMPOP

该命令是[LMPOP](#lmpop)的阻塞版本，当列表包含元素时，该命令与LMPOP完全相同，当列表为空时，连接将会阻塞直到有元素被推送到列表或者超时。

[官方文档 Redis BLMPOP](https://redis.io/docs/latest/commands/blmpop/)

::: tip 语法

`MPOP timeout numkeys key [key ...] <LEFT | RIGHT> [COUNT count]`

- timeout: 超时时间，设置为0时，表示无限期阻塞等待。

其他信息请参考：[LMPOP](#lmpop)

:::

### BRPOPLPUSH <Badge type="danger">废弃</Badge> {#brpoplpush}

该命令是[RPOPLPUSH](#rpoplpush)的阻塞版本，当列表包含元素时，该命令与RPOPLPUSH完全相同，当列表为空时，连接将会阻塞直到有元素被推送到列表或者超时。

该命令已废弃，可将其替换为带RIGHT和LEFT参数的[BLMOVE](#blmove)。

[官方文档 Redis BRPOPLPUSH](https://redis.io/docs/latest/commands/brpoplpush/)

::: tip 语法

`BRPOPLPUSH source destination timeout`

- timeout: 超时时间，设置为0时，表示无限期阻塞等待。

其他信息请参考：[RPOPLPUSH](#rpoplpush)

:::

### LINSERT

向列表中指定元素之前或者之后插入元素，

[官方文档 Redis LINSERT](https://redis.io/docs/latest/commands/linsert/)

::: tip 语法

`LINSERT key <BEFORE | AFTER> pivot element`

- BEFORE | AFTER: 在指定元素之前或者之后插入
- pivot: 要查找的元素
- element: 要插入的元素

:::

::: code-group

```sh [redis-cli]
127.0.0.1:6379> del list
(integer) 1
127.0.0.1:6379> lpush list hello
(integer) 1
127.0.0.1:6379> lpush list world
(integer) 2
127.0.0.1:6379> lrange list 0 -1
1) "world"
2) "hello"
127.0.0.1:6379> linsert list before hello test
(integer) 3
127.0.0.1:6379> lrange list 0 -1
1) "world"
2) "test"
3) "hello"
```

```java [java]
jedis.lpush("list", "hello", "world");
System.out.println(jedis.lrange("list", 0, -1)); // [world, hello]
jedis.linsert("list", ListPosition.BEFORE, "hello", "test");
System.out.println(jedis.lrange("list", 0, -1)); // [world, test, hello]
```

:::

### LINDEX

返回列表指定索引处的元素，负索引为从列表尾部开始计算的元素，当索引超出列表索引范围时返回null。

[官方文档 Redis LINDEX](https://redis.io/docs/latest/commands/lindex/)

::: tip 语法

`LINDEX key index`

:::

::: code-group

```sh [redis-cli]
127.0.0.1:6379> lindex list 1
"test"
```

```java [java]
System.out.println(jedis.lindex("list", 1)); // test
```

:::

### LMPOP

从指定的多个列表中的第一个非空列表弹出一个或者多个元素。

[官方文档 Redis LMPOP](https://redis.io/docs/latest/commands/lmpop/)

::: tip 语法

`LMPOP numkeys key [key ...] <LEFT | RIGHT> [COUNT count]`

- `numkeys`: 提供的列表key的个数
- `LEFT | RIGHT`: 从非空列表的左侧还是右侧开始弹出
- `Count`: 弹出的元素的个数，当非空列表的元素个数不足count个时，弹出该非空列表所有元素

只会从第一个非空列表弹出元素，哪怕该非空列表元素个数不足期望弹出的元素个数。返回值为双元素数组，第一个元素为弹出元素的列表的key，第二个元素为弹出元素的数组

:::

::: code-group

```sh [redis-cli]
127.0.0.1:6379> lmpop 2 list left count 10
(error) ERR syntax error
127.0.0.1:6379> lmpop 2 list list1 left count 10
1) "list"
2) 1) "world"
   2) "test"
   3) "hello"
127.0.0.1:6379> lmpop 2 list list1 left count 10
1) "list1"
2) 1) "b"
   2) "a"
127.0.0.1:6379> lmpop 2 list list1 left count 10
(nil)
```

```java [java]
KeyValue<String, List<String>> kv = jedis.lmpop(ListDirection.LEFT, 10, "list", "list1");
System.out.println(kv); // list=[world, test, hello]
kv = jedis.lmpop(ListDirection.LEFT, 10, "list", "list1");
System.out.println(kv); // list1=[b, a]
kv = jedis.lmpop(ListDirection.LEFT, 10, "list", "list1");
System.out.println(kv); // null
```

:::

### LPOS

从指定列表中查找指定元素的索引，当没有指定任何选项时，会从头到尾查找，并返回匹配的第一项的索引。

[官方文档 Redis LPOS](https://redis.io/docs/latest/commands/lpos/)

::: tip 语法

`LPOS key element [RANK rank] [COUNT num-matches] [MAXLEN len]`

- element: 要查找的元素
- rank: 返回第几个匹配项
- num-matches: 返回指定个数的匹配项
- len: 最大比较次数，也可以说是只在前len或者后len个元素中查找

:::

::: code-group

```sh [redis-cli]
127.0.0.1:6379> rpush list a b c d c a d j a
(integer) 9
127.0.0.1:6379> lpos list c
(integer) 2
127.0.0.1:6379> lpos list c rank 2
(integer) 4
127.0.0.1:6379> lpos list c count 2
1) (integer) 2
2) (integer) 4
127.0.0.1:6379> lpos list c count 2 maxlen 4
1) (integer) 2
```

```java [java]
jedis.del("list");
jedis.rpush("list", "a", "b", "c", "d", "c", "c", "a", "f");
System.out.println(jedis.lpos("list", "c")); // 2
System.out.println(jedis.lpos("list", "c", LPosParams.lPosParams().rank(2))); // 4
System.out.println(jedis.lpos("list", "c", LPosParams.lPosParams(), 10)); // [2, 4, 5]
System.out.println(jedis.lpos("list", "c", LPosParams.lPosParams().maxlen(4), 10)); // [2]
```

:::

### LPUSHX & RPUSHX {#lpushx-and-rpushx}

当key存在时，向key存储的列表中插入元素，当key不存在时不会指向任何操作。

[官方文档 Redis LPUSHX](https://redis.io/docs/latest/commands/lpushx/)

::: tip 语法

`LPUSHX key element [element ...]`

其他参考[LPUSH/RPUSH](#lpush-and-rpush)

:::

### LREM

从指定列表中删除count个指定元素。

[官方文档 Redis LREM](https://redis.io/docs/latest/commands/lrem/)

::: tip 语法

`LREM key count element`

- `count > 0`: 列表按从头到尾删除count个匹配的元素。
- `count < 0`: 列表按从尾到头删除count个匹配的元素。
- `count = 0`: 删除列表中所有匹配的元素。

:::

::: code-group

```sh [redis-cli]
127.0.0.1:6379> del list
(integer) 1
127.0.0.1:6379> rpush list a b c d c a c d c j a
(integer) 11
127.0.0.1:6379> lrem list 2 c
(integer) 2
127.0.0.1:6379> lrange list 0 -1
1) "a"
2) "b"
3) "d"
4) "a"
5) "c"
6) "d"
7) "c"
8) "j"
9) "a"
127.0.0.1:6379> del list
(integer) 1
127.0.0.1:6379> rpush list a b c d c a c d c j a
(integer) 11
127.0.0.1:6379> lrem list -2 c
(integer) 2
127.0.0.1:6379> lrange list 0 -1
1) "a"
2) "b"
3) "c"
4) "d"
5) "c"
6) "a"
7) "d"
8) "j"
9) "a"
```

```java [java]
jedis.del("list");
jedis.rpush("list", "a", "b","c","d","c","a","c","d","c","j","a");
jedis.lrem("list", 2, "c");
System.out.println(jedis.lrange("list", 0, -1)); // [a, b, d, a, c, d, c, j, a]
jedis.del("list");
jedis.rpush("list", "a", "b","c","d","c","a","c","d","c","j","a");
jedis.lrem("list", -2, "c");
System.out.println(jedis.lrange("list", 0, -1)); // [a, b, c, d, c, a, d, j, a]
```

:::

### LSET

将列表指定索引处的元素设置为新元素。

[官方文档 Redis LSET](https://redis.io/docs/latest/commands/lset/)

::: tip 语法

`LSET key index element`

- index: 列表中元素的索引，索引获取可以通过[LINDEX](#lindex)
- element: 要设置的新元素

当索引超出范围时返回错误

:::

::: code-group

```sh [redis-cli]
127.0.0.1:6379> del list
(integer) 1
127.0.0.1:6379> rpush list a b c d
(integer) 4
127.0.0.1:6379> lset list 1 e
OK
127.0.0.1:6379> lrange list 0 -1
1) "a"
2) "e"
3) "c"
4) "d"
```

```java [java]
jedis.del("list");
jedis.rpush("list", "a", "b", "c", "d");
System.out.println(jedis.lrange("list", 0, -1)); // [a, b, c, d]
jedis.lset("list", 1L, "e");
System.out.println(jedis.lrange("list", 0, -1)); // [a, e, c, d]
```

:::

### RPOPLPUSH <Badge type="danger">废弃</Badge> {#rpoplpush}

原子地返回并删除列表地尾部元素，并将其推送到另一列表地头部；该命令应使用[LMOVE](#lmove)替代;

## Set

Set 是无序的不重复元素的集合。

### SADD <Badge>常用</Badge> {#sadd}

向集合中添加一个或多个元素，返回添加成功的元素的个数。如果value的类型不是集合时返回错误。

[官方文档 Redis SADD](https://redis.io/docs/latest/commands/sadd/)

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

### SREM <Badge>常用</Badge> {#srem}

从集合中移除指定的元素。返回移除的元素个数。如果不是集合中的元素，则返回0。如果不是集合，则返回错误。

[官方文档 Redis SREM](https://redis.io/docs/latest/commands/srem/)

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

### SMEMBERS <Badge>常用</Badge> {#smembers}

返回集合中的所有元素。也可以使用[SINTER](#sinter)，当只有一个集合时，SINTER和SMEMBERS效果是一样的。注意这个方法会返回集合中所有的元素，如果集合非常大，建议使用[SSCAN](#sscan)来迭代元素集合

[官方文档 Redis SMEMBERS](https://redis.io/docs/latest/commands/smembers/)

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

### SCARD <Badge>常用</Badge> {#scard}

返回集合中元素的个数。

[官方文档 Redis SCARD](https://redis.io/docs/latest/commands/scard/)

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

### SISMEMBER <Badge>常用</Badge> {#sismember}

判断元素是否在集合中。存在返回1，不存在返回0。

[官方文档 Redis SISMEMBER](https://redis.io/docs/latest/commands/sismember/)

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

[官方文档 Redis SRANDMEMBER](https://redis.io/docs/latest/commands/srandmember/)

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

### SPOP <Badge>常用</Badge> {#spop}

随机返回集合中的一个元素，并删除。类似于[SRANDMEMBER](#srandmember)，只不过SRANDMEMBER只是返回元素但不删除。而且SRANDMEMBER返回的元素可以重复，SPOP不会重复。

[官方文档 Redis SPOP](https://redis.io/docs/latest/commands/spop/)

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

### SINTER <Badge>常用</Badge> {#sinter}

返回多个集合的交集。

[官方文档 Redis SINTER](https://redis.io/docs/latest/commands/sinter/)

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

### SINTERSTORE <Badge>常用</Badge> {#sinterstore}

此命令等同于[SINTER](#sinter)，返回多个集合的交集，但是SINTERSTORE会将结果保存到指定集合中。

[官方文档 Redis SINTERSTORE](https://redis.io/docs/latest/commands/sinterstore/)

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

### SUNION <Badge>常用</Badge> {#sunion}

返回多个集合的并集。

[官方文档 Redis SUNION](https://redis.io/docs/latest/commands/sunion/)

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

### SUNIONSTORE <Badge>常用</Badge> {#sunionstore}

此命令等同于[SUNION](#sunion)，返回多个集合的并集，但是SUNIONSTORE会将结果保存到指定集合中。

[官方文档 Redis SUNIONSTORE](https://redis.io/docs/latest/commands/sunionstore/)

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

### SDIFF <Badge>常用</Badge> {#sdiff}

返回第一个集合和多个集合的差集。

[官方文档 Redis SDIFF](https://redis.io/docs/latest/commands/sdiff/)

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

### SDIFFSTORE <Badge>常用</Badge> {#sdiffstore}

此命令等同于[SDIFF](#sdiff)，返回第一个集合和多个集合的差集，但是SDIFFSTORE会将结果保存到指定集合中。

[官方文档 Redis SDIFFSTORE](https://redis.io/docs/latest/commands/sdiffstore/)

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

原子性地将元素从一个集合移动到另一个集合。

[官方文档 Redis SMOVE](https://redis.io/docs/latest/commands/smove/)

::: tip 语法

`SMOVE source destination member`

- source: 要删除元素的集合
- destination: 要插入元素的集合
- member: 要移动的元素

:::

::: code-group

```sh [redis-cli]
127.0.0.1:6379> del set1 set2
(integer) 2
127.0.0.1:6379> sadd set1 a b c
(integer) 3
127.0.0.1:6379> smove set1 set2 b
(integer) 1
127.0.0.1:6379> smembers set1
1) "a"
2) "c"
127.0.0.1:6379> smembers set2
1) "b"
```

```java [java]
jedis.del("set1", "set2");
jedis.sadd("set1", "a", "b", "c");
jedis.smove("set1", "set2", "c");
System.out.println(jedis.smembers("set1")); // [a, b]
System.out.println(jedis.smembers("set2")); // [c]
```

:::

### SSCAN

迭代Set类型的元素集合，可以用来替代[SMEMBERS](#smembers)，该命令会多批次少量的返回匹配的元素，而不会像SMEMBERS一样一次性返回所有的元素，可以安全地在生产环境使用。

[官方文档 Redis SSCAN](https://redis.io/docs/latest/commands/sscan/)

::: tip 语法

`SSCAN key cursor [MATCH pattern] [COUNT count]`

- key: 要迭代的Set类型集合的Key
- cursor: 本次迭代的游标
- pattern: 进行模式匹配的表达式
- count: 本次迭代的元素数量

其他信息请参考[SCAN](#scan)，不同的是SCAN是迭代的redis的key列表，SSCAN是迭代的指定key的set集合的元素列表

:::

### SMISMEMBER

返回每个元素是否存在于key所存储的set类型的集合中。

[官方文档 Redis SMISMEMBER](https://redis.io/docs/latest/commands/smismember/)

::: tip 语法

`SMISMEMBER key member [member ...]`

- key: 集合的key
- member: 要查询的元素

返回值为按给定元素顺序的存在性数组，如果元素存在于集合中返回1，否则返回0

:::

::: code-group

```sh [redis-cli]
127.0.0.1:6379> del set
(integer) 1
127.0.0.1:6379> sadd set a b c d
(integer) 4
127.0.0.1:6379> smismember set c e
1) (integer) 1
2) (integer) 0
```

```java [java]
jedis.del("set");
jedis.sadd("set", "a", "b", "c", "d");
System.out.println(jedis.smismember("set", "c", "e"));
// [true, false]
```

:::

### SINTERCARD

此命令类似于[SINTER](#sinter)，不同的是SINTER返回的集合的交集，SINTERCARD返回的是集合的交集中元素的数量。

[官方文档 Redis SINTERCARD](https://redis.io/docs/latest/commands/sintercard/)

::: tip 语法

`SINTERCARD numkeys key [key ...] [LIMIT limit]`

- numkeys: 命令中集合的数量
- limit: 计算交集时如果交集中元素个数达到了指定个数，则返回指定个数，不再进行后续交集计算

:::

::: code-group

```sh [redis-cli]
127.0.0.1:6379> del set1 set2
(integer) 2
127.0.0.1:6379> sadd set1 a b c d
(integer) 4
127.0.0.1:6379> sadd set2 c d e
(integer) 3
127.0.0.1:6379> sintercard 2 set1 set2
(integer) 2
127.0.0.1:6379> sintercard 2 set1 set2 limit 1
(integer) 1
127.0.0.1:6379> sintercard 2 set1 set2 limit 10
(integer) 2
```

```java [java]
jedis.del("set1", "set2");
jedis.sadd("set1", "a", "b", "c", "d");
jedis.sadd("set2", "c", "d", "e");
System.out.println(jedis.sintercard("set1", "set2")); // 2
System.out.println(jedis.sinter("set1", "set2")); // [c, d]
```

:::

## Hash

哈希是存储结构化数据的类型，用来表示对象很方便

### HDEL <Badge>常用</Badge> {#hdel}

从哈希中删除一个或多个字段。如果字段不存在则被忽略。

[官方文档 Redis HDEL](https://redis.io/docs/latest/commands/hdel/)

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

查询指定key存储的hash结构的数据中是否存在指定字段

[官方文档 Redis HEXISTS](https://redis.io/docs/latest/commands/hexists/)

::: tip 语法

`HEXISTS key field`

:::

::: code-group

```sh [redis-cli]
127.0.0.1:6379> del item
(integer) 0
127.0.0.1:6379> hset item name a count 10
(integer) 2
127.0.0.1:6379> hexists item name
(integer) 1
127.0.0.1:6379> hexists item age
(integer) 0
```

```java [java]
jedis.del("item");
jedis.hset("item", "name", "a");
System.out.println(jedis.hexists("item", "name")); // true
System.out.println(jedis.hexists("item", "age")); // false
```

:::

### HGET & HSET <Badge>常用</Badge> {#hget-and-hset}

获取哈希的字段值，如果字段不存在则返回nil。

[官方文档 Redis HGET](https://redis.io/docs/latest/commands/hget/)

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

### HGETALL <Badge>常用</Badge> {#hgetall}

获取哈希的所有字段和值。

[官方文档 Redis HGETALL](https://redis.io/docs/latest/commands/hgetall/)

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

### HINCRBY <Badge>常用</Badge> {#hincrby}

递增哈希指定字段的值。如果字段不存在，则初始化为0，然后再递增。

[官方文档 Redis HINCRBY](https://redis.io/docs/latest/commands/hincrby/)

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

将key对应存储的hash结构数据的指定field增加指定的值，如果增加值为负则为减少。

[官方文档 Redis HINCRBYFLOAT](https://redis.io/docs/latest/commands/hincrbyfloat/)

::: tip 语法

`HINCRBYFLOAT key field increment`

- key: 指定修改的key
- field: hash结构的字段，如果该字段不存在，则在增加之前设置字段为0
- increment: 要增加的值，类型为双精度浮点数

返回值为增加后的值

:::

::: code-group

```sh [redis-cli]
127.0.0.1:6379> del item
(integer) 0
127.0.0.1:6379> hset item name a count 10
(integer) 1
127.0.0.1:6379> hincrbyfloat item age 5
"5"
127.0.0.1:6379> hincrbyfloat item age 5
"10"
```

```java [java]
jedis.del("item");
jedis.hset("item", "name", "a");
System.out.println(jedis.hincrByFloat("item", "age", 5)); // 5.0
System.out.println(jedis.hincrByFloat("item", "age", 4.3)); // 9.3
```

:::

### HKEYS

返回key对应的hash类型数据的所有字段。

[官方文档 Redis HKEYS](https://redis.io/docs/latest/commands/hkeys/)

::: code-group

```sh [redis-cli]
127.0.0.1:6379> hkeys item
1) "name"
2) "age"
```

```java [java]
System.out.println(jedis.hkeys("item")); // [name, age]
```

:::

### HLEN <Badge>常用</Badge> {#hlen}

返回哈希中字段的数量。

[官方文档 Redis HLEN](https://redis.io/docs/latest/commands/hlen/)

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

### HMGET & HMSET <Badge>常用</Badge> {#hmget-and-hmset}

HMSET同时设置多个字段，HMGET同时获取多个字段。

[官方文档 Redis HMGET](https://redis.io/docs/latest/commands/hmget/)

::: warning HMSET

**HMSET**已经废弃，直接使用[HSET](#hget-and-hset)

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

迭代返回key对应的hash结构数据的字段列表

[官方文档 Redis HSCAN](https://redis.io/docs/latest/commands/hscan/)

::: tip 语法

`HSCAN key cursor [MATCH pattern] [COUNT count] [NOVALUES]`

- key: 要迭代的hash结构数据的key
- cursor: 迭代的游标
- pattern: 模式匹配表达式
- count: 参与迭代的字段个数
- NOVALUES: 是否返回字段值，不设置则依次返回字段和值。该参数从`redis:7.6`开始支持

其他信息请参考[SCAN](#scan)，不同的是SCAN是迭代的redis的key列表，HSCAN是迭代的指定key的字段列表

:::

::: code-group

```sh [redis-cli]
127.0.0.1:6379> hscan item 0
1) "0"
2) 1) "name"
   2) "a"
   3) "age"
   4) "10"
127.0.0.1:6379> hscan item 0 novalues
1) "0"
2) 1) "name"
   2) "age"
```

```java [java]
ScanParams params = new ScanParams();
ScanResult<Map.Entry<String, String>> item = jedis.hscan("item", "0", params);
System.out.println(item.getCursor()); // 0
System.out.println(item.getResult()); // [name=a, age=9.3]
ScanResult<String> result = jedis.hscanNoValues("item", "0", params);
System.out.println(result.getCursor()); // 0
System.out.println(result.getResult()); // [name, age]
```

:::

### HSTRLEN

返回指定key的hash的指定字段的值的字符串长度。

[官方文档 Redis HSTRLEN](https://redis.io/docs/latest/commands/hstrlen/)

::: code-group

```sh [redis-cli]
127.0.0.1:6379> hscan item 0
1) "0"
2) 1) "name"
   2) "a"
   3) "age"
   4) "10"
127.0.0.1:6379> hstrlen item name
(integer) 1
127.0.0.1:6379> hstrlen item number
(integer) 0
```

```java [java]
System.out.println(jedis.hstrlen("item", "name")); // 1
System.out.println(jedis.hstrlen("item", "number")); // 0
```

:::

### HVALS

返回指定key的hash结构数据的所有字段的值。

[官方文档 Redis HVALS](https://redis.io/docs/latest/commands/hvals/)

::: code-group

```sh [redis-cli]
127.0.0.1:6379> hvals item
1) "a"
2) "10"
```

```java [java]
System.out.println(jedis.hvals("item")); // [a, 9.3]
```

:::

### HSETNX

但key对应的hash结构的值不存在指定field时，将field设置为指定的value。

[官方文档 Redis HSETNX](https://redis.io/docs/latest/commands/hsetnx/)

::: code-group

```sh [redis-cli]
127.0.0.1:6379> hscan item 0 novalues
1) "0"
2) 1) "name"
   2) "age"
127.0.0.1:6379> hsetnx item name b
(integer) 0
127.0.0.1:6379> hsetnx item number a1
(integer) 1
```

```java [java]
jedis.hsetnx("item", "name", "b");
System.out.println(jedis.hget("item", "name")); // a
jedis.hsetnx("item", "number", "a1");
System.out.println(jedis.hget("item", "number")); // a1
```

:::

### HRANDFIELD

返回key对应的hash类型数据的一个随机字段。

[官方文档 Redis HRANDFIELD](https://redis.io/docs/latest/commands/hrandfield/)

::: tip 语法

`HRANDFIELD key [count [WITHVALUES]]`

- count: 返回的随机字段的个数
- WITHVALUES: 是否返回字段值

:::

::: code-group

```sh [redis-cli]
127.0.0.1:6379> hrandfield item
"age"
127.0.0.1:6379> hrandfield item
"age"
127.0.0.1:6379> hrandfield item 2
1) "age"
2) "number"
127.0.0.1:6379> hrandfield item 1 withvalues
1) "name"
2) "a"
127.0.0.1:6379> hrandfield item 2 withvalues
1) "name"
2) "a"
3) "age"
4) "9.3"
```

```java [java]
System.out.println(jedis.hrandfield("item")); // name
System.out.println(jedis.hrandfield("item", 2)); // [name, age]
System.out.println(jedis.hrandfieldWithValues("item", 2)); // [name=a, age=9.3]
```

:::

## Sorted Set

有序集合类型，相比于Set多了排序的score属性，同时也是唯一的，但是分值可以相同，也可以安装分值排序。

### BZMPOP

该命令是[ZMPOP](#zmpop)的阻塞版本，当集合包含元素时与[ZMPOP](#zmpop)完全相同，当集合为空时会阻塞当前连接直到集合中有元素添加进来或者超时。

[官方文档 Redis BZMPOP](https://redis.io/docs/latest/commands/bzmpop/)

::: tip 语法

`BZMPOP timeout numkeys key [key ...] <MIN | MAX> [COUNT count]`

- timeout: 超时时间，双精度浮点型，单位为秒

其他信息请参考[ZMPOP](#zmpop)

:::

### BZPOPMAX

该命令是[ZPOPMAX](#zpopmax)的阻塞版本，当集合包含元素时与[ZPOPMAX](#zpopmax)完全相同，当集合为空时会阻塞当前连接直到集合中有元素添加进来或者超时。

[官方文档 Redis BZPOPMAX](https://redis.io/docs/latest/commands/bzpopmax/)

::: tip 语法

`BZPOPMAX key [key ...] timeout`

- timeout: 超时时间，双精度浮点型，单位为秒

其他信息请参考[BZPOPMIN](#bzpopmin)，它们功能完全相同，唯一不同是此命令弹出最大分值的元素，而BZPOPMIN是弹出最小分值的元素。

:::

### BZPOPMIN

该命令是[ZPOPMIN](#zpopmin)的阻塞版本，当集合包含元素时与[ZPOPMIN](#zpopmin)完全相同，当集合为空时会阻塞当前连接直到集合中有元素添加进来或者超时。

[官方文档 Redis BZPOPMIN](https://redis.io/docs/latest/commands/bzpopmin/)

::: tip 语法

`BZPOPMIN key [key ...] timeout`

- timeout: 超时时间，双精度浮点型，单位为秒

其他信息请参考[BLPOP](#blpop)，它们功能相同，不同的是返回的数据结构不同。

:::

### ZADD <Badge>常用</Badge> {#zadd}

向排序集合中添加指定分数的元素。可以同时添加多个分数/元素对。如果元素已经存在，则会更新分数，并重新插入到正确的位置。分数为双精度浮点数。

[官方文档 Redis ZADD](https://redis.io/docs/latest/commands/zadd/)

::: tip 可选参数

- `XX`: 只更新已存在的元素
- `NX`: 只添加不存在的元素，不更新已存在的元素
- `LT`: 只有当分数小于当前元素的分数时才更新，不存在的元素会插入
- `GT`: 只有当分数大于当前元素的分数时才更新，不存在的元素会插入
- `CH`: 将返回值从新添加的元素数修改为更改的元素数，更改的元素指新添加的元素和已更新分数的元素。
- `INCR`: 类似于[ZINCRBY](#zincrby)，让元素增加指定的分数，但只能指定一个分数/元素对。

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

### ZCARD <Badge>常用</Badge> {#zcard}

返回排序集合中的元素数。

[官方文档 Redis ZCARD](https://redis.io/docs/latest/commands/zcard/)

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

[官方文档 Redis ZCOUNT](https://redis.io/docs/latest/commands/zcount/)

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

返回第一个集合与其他集合的差异

[官方文档 Redis ZDIFF](https://redis.io/docs/latest/commands/zdiff/)

::: tip 语法

`ZDIFF numkeys key [key ...] [WITHSCORES]`

- numkeys: key的个数
- withscores: 同时返回分数

:::

::: code-group

```sh [redis-cli]
127.0.0.1:6379> del zset zset1 zset2
(integer) 3
127.0.0.1:6379> zadd zset 1 a 2 b 3 c
(integer) 3
127.0.0.1:6379> zadd zset1 1 a 2 c
(integer) 2
127.0.0.1:6379> zdiff 2 zset zset1
1) "b"
127.0.0.1:6379> zdiff 2 zset zset1 withscores
1) "b"
2) "2"
```

```java [java]
jedis.del("zset", "zset1", "zset2");
jedis.zadd("zset", Map.of("a", 1.0, "b", 2.0, "c", 3.0));
jedis.zadd("zset1", Map.of("a", 1.0, "c", 2.0));
System.out.println(jedis.zdiff("zset", "zset1")); // [b]
System.out.println(jedis.zdiffWithScores("zset", "zset1")); // [[b,2.0]]
```

:::

### ZDIFFSTORE

比较第一个集合与其他集合的差异，并存入指定集合中，如果集合已经存在则进行覆盖。

[官方文档 Redis ZDIFFSTORE](https://redis.io/docs/latest/commands/zdiffstore/)

::: tip 语法

`ZDIFFSTORE destination numkeys key [key ...]`

- destination: 要存入的指定集合
- numkeys: key的个数

:::

::: code-group

```sh [redis-cli]
127.0.0.1:6379> del zset zset1 zset2
(integer) 3
127.0.0.1:6379> zadd zset 1 a 2 b 3 c
(integer) 3
127.0.0.1:6379> zadd zset1 1 a 2 c
(integer) 2
127.0.0.1:6379> zdiffstore zset2 2 zset zset1
(integer) 1
127.0.0.1:6379> zrange zset2 0 -1
1) "b"
```

```java [java]
jedis.del("zset", "zset1", "zset2");
jedis.zadd("zset", Map.of("a", 1.0, "b", 2.0, "c", 3.0));
jedis.zadd("zset1", Map.of("a", 1.0, "c", 2.0));
jedis.zdiffstore("set2", "zset", "zset1");
System.out.println(jedis.zrange("zset2", 0, -1)); // [b]
```

:::

### ZINCRBY <Badge>常用</Badge> {#zincrby}

为指定元素增加指定的分数。如果元素不存在，则会创建一个新的元素并添加指定的分数。提供负数来减少分数。

[官方文档 Redis ZINCRBY](https://redis.io/docs/latest/commands/zincrby/)

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

返回多个集合的交集。该命令与[ZINTERSTORE](#zinterstore)功能相同，只不过该命令不存储结果，而是返回结果。

[官方文档 Redis ZINTER](https://redis.io/docs/latest/commands/zinter/)

::: tip 语法

`ZINTER numkeys key [key ...] [WEIGHTS weight [weight ...]] [AGGREGATE <SUM | MIN | MAX>] [WITHSCORES]`

- numkeys: key的个数
- weight: 分数权重，为每个集合指定权重，在输入给聚合函数之前会对每个集合中的每个元素的分数乘以该权重。
- aggregate: 分数聚合方式，默认为SUM
- withscores: 同时返回分数

:::

::: code-group

```sh [redis-cli]
127.0.0.1:6379> del zset zset1 zset2
(integer) 3
127.0.0.1:6379> zadd zset 1 a 2 b 3 c
(integer) 3
127.0.0.1:6379> zadd zset1 1 a 2 c
(integer) 2
127.0.0.1:6379> zinter 2 zset zset1
1) "a"
2) "c"
127.0.0.1:6379> zinter 2 zset zset1 aggregate max withscores
1) "a"
2) "1"
3) "c"
4) "3"
```

```java [java]
jedis.del("zset", "zset1", "zset2");
jedis.zadd("zset", Map.of("a", 1.0, "b", 2.0, "c", 3.0));
jedis.zadd("zset1", Map.of("a", 1.0, "c", 2.0));
System.out.println(jedis.zinter(new ZParams(), "zset", "zset1")); // [a, c]
System.out.println(jedis.zinterWithScores(new ZParams(), "zset", "zset1")); // [[a,2.0], [c,4.0]]
System.out.println(jedis.zinterWithScores(new ZParams().aggregate(ZParams.Aggregate.MAX), "zset", "zset1")); // [[a,1.0], [c,3.0]]
```

:::

### ZINTERSTORE <Badge>常用</Badge> {#zinterstore}

返回多个集合的交集，并存入指定集合中，如果集合已经存在则进行覆盖。

[官方文档 Redis ZINTERSTORE](https://redis.io/docs/latest/commands/zinterstore/)

::: tip 语法

`ZINTERSTORE destination numkeys key [key ...] [WEIGHTS weight [weight ...]] [AGGREGATE <SUM | MIN | MAX>]`

- destination: 要存入的指定集合
- numkeys: key的个数
- weight: 分数权重，为每个集合指定权重，在输入给聚合函数之前会对每个集合中的每个元素的分数乘以该权重。
- aggregate: 分数聚合方式，默认为SUM

:::

::: code-group

```sh [redis-cli]
127.0.0.1:6379> del zset zset1 zset2
(integer) 3
127.0.0.1:6379> zadd zset 1 a 2 b 3 c
(integer) 3
127.0.0.1:6379> zadd zset1 1 a 2 c
(integer) 2
127.0.0.1:6379> zinterstore zset2 2 zset zset1
(integer) 2
127.0.0.1:6379> zrange zset2 0 -1
1) "a"
2) "c"
```

```java [java]
jedis.del("zset", "zset1", "zset2");
jedis.zadd("zset", Map.of("a", 1.0, "b", 2.0, "c", 3.0));
jedis.zadd("zset1", Map.of("a", 1.0, "c", 2.0));
jedis.zinterstore("zset2", new ZParams(), "zset", "zset1");
System.out.println(jedis.zrange("zset2", 0, -1)); // [a, c]
```

:::

### ZINTERCARD

此命令与[ZINTER](#zinter)类似，都是对集合求交集，但是此命令返回交集的元素个数，而不返回交集集合。

[官方文档 Redis ZINTERCARD](https://redis.io/docs/latest/commands/zintercard/)

::: tip 语法

`ZINTERCARD numkeys key [key ...] [LIMIT limit]`

- numkeys: key的个数
- limit: 返回的元素个数，如果为0，则返回所有元素

其他信息请参考[ZINTER](#zinter)

:::

### ZLEXCOUNT

当集合中的元素都以相同的分数插入时，返回排序集合中指定范围的元素个数。

[官方文档 Redis ZLEXCOUNT](https://redis.io/docs/latest/commands/zlexcount/)

::: tip 语法

`ZLEXCOUNT key min max`

:::

### ZMPOP

从多个排序集合中的第一个非空排序集合中弹出一个或者多个元素。

[官方文档 Redis ZMPOP](https://redis.io/docs/latest/commands/zmpop/)

::: tip 语法

`ZMPOP numkeys key [key ...] <MIN | MAX> [COUNT count]`

- numkeys: key的个数
- min: 弹出的元素是集合中的分数最低的。
- max: 弹出的元素是集合中的分数最高的。
- count: 弹出的元素个数，如果为0，则返回所有元素

:::

::: code-group

```sh [redis-cli]
127.0.0.1:6379> del zset zset1 zset2
(integer) 3
127.0.0.1:6379> zadd zset 0 a 1 b 3 c 5 d
(integer) 4
127.0.0.1:6379> zmpop 2 zset zset1 max count 2
1) "zset"
2) 1) 1) "d"
      2) "5"
   2) 1) "c"
      2) "3
```

```java [java]
jedis.del("zset", "zset1", "zset2");
jedis.zadd("zset", Map.of("a", 1.0, "b", 2.0, "c", 3.0, "d", 4.0));
System.out.println(jedis.zmpop(SortedSetOption.MAX, 2,"zset", "zset1")); // zset=[[d,4.0], [c,3.0]]
```

:::

### ZMSCORE

返回排序集合中指定元素的分数。

[官方文档 Redis ZMSCORE](https://redis.io/docs/latest/commands/zmscore/)

::: tip 语法

`ZMSCORE key member [member ...]`

:::

::: code-group

```sh [redis-cli]
127.0.0.1:6379> del zset zset1 zset2
(integer) 1
127.0.0.1:6379> zadd zset 0 a 1 b 3 c 5 d
(integer) 4
127.0.0.1:6379> zmscore zset a b c
1) "0"
2) "1"
3) "3"
```

```java [java]
jedis.del("zset", "zset1", "zset2");
jedis.zadd("zset", Map.of("a", 1.0, "b", 2.0, "c", 3.0, "d", 4.0));
System.out.println(jedis.zmscore("zset", "a", "b", "c")); // [1.0, 2.0, 3.0]
```

:::

### ZPOPMAX

弹出并返回排序集合中分数最高的count个元素。

[官方文档 Redis ZPOPMAX](https://redis.io/docs/latest/commands/zpopmax/)

::: tip 语法

`ZPOPMAX key [count]`

:::

::: code-group

```sh [redis-cli]
127.0.0.1:6379> del zset zset1 zset2
(integer) 1
127.0.0.1:6379> zadd zset 0 a 1 b 3 c 5 d
(integer) 4
127.0.0.1:6379> zpopmax zset
1) "d"
2) "4"
```

```java [java]
jedis.del("zset", "zset1", "zset2");
jedis.zadd("zset", Map.of("a", 1.0, "b", 2.0, "c", 3.0, "d", 4.0));
System.out.println(jedis.zpopmax("zset", 2)); // [[d,4.0], [c,3.0]]
```

:::

### ZPOPMIN

弹出并返回排序集合中分数最低的count个元素

[官方文档 Redis ZPOPMIN](https://redis.io/docs/latest/commands/zpopmin/)

::: tip 语法

`ZPOPMIN key [count]`

:::

::: code-group

```sh [redis-cli]
127.0.0.1:6379> del zset zset1 zset2
(integer) 1
127.0.0.1:6379> zadd zset 0 a 1 b 3 c 5 d
(integer) 4
127.0.0.1:6379> zpopmin zset
1) "a"
2) "0"
```

```java [java]
jedis.del("zset", "zset1", "zset2");
jedis.zadd("zset", Map.of("a", 1.0, "b", 2.0, "c", 3.0, "d", 4.0));
System.out.println(jedis.zpopmin("zset", 2)); // [[a,1.0], [b,2.0]]
```

:::

### ZRANDMEMBER

从排序集合中随机返回count个元素。

[官方文档 Redis ZRANDMEMBER](https://redis.io/docs/latest/commands/zrandmember/)

::: tip 语法

`ZRANDMEMBER key [count [WITHSCORES]]`

- count: 返回的元素个数，如果为0，则返回所有元素
- WITHSCORES: 返回元素的分数

:::

### ZRANGE <Badge>常用</Badge> {#zrange}

返回排序集合中指定范围的元素。

[官方文档 Redis ZRANGE](https://redis.io/docs/latest/commands/zrange/)

::: tip 语法

`ZRANGE key start stop [BYSCORE | BYLEX] [REV] [LIMIT offset count] [WITHSCORES]`

:::

::: info

从Redis6.2.0开始，此命令可以替换以下命令：

- [ZREVRANGE](#zrevrange)
- [ZRANGEBYSCORE](#zrangebyscore)
- [ZREVRANGEBYSCORE](#zrevrangebyscore)
- [ZRANGEBYLEX](#zrangebylex)
- [ZREVRANGEBYLEX](#zrevrangebylex)

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

### ZRANGEBYLEX <Badge type="danger">废弃</Badge> {#zrangebylex}

当集合中的元素都以相同的分数插入时，为了强制按字典排序，此命令返回介于min 和 max 之间，且以字典顺序排列的元素。

[官方文档 Redis ZRANGEBYLEX](https://redis.io/docs/latest/commands/zrangebylex/)

::: warning

该命令已废弃，可以用带BYLEX参数的[ZRANGE](#zrange)命令替换。

:::

::: tip 语法

`ZRANGEBYLEX key min max [LIMIT offset count]`

:::

### ZRANGEBYSCORE <Badge type="danger">废弃</Badge> {#zrangebyscore}

返回排序集合中分数在指定范围的元素。

[官方文档 Redis ZRANGEBYSCORE](https://redis.io/docs/latest/commands/zrangebyscore/)

::: warning

该命令已废弃，可以用带BYSCORE参数的[ZRANGE](#zrange)命令替换。

:::

::: tip 语法

`ZRANGEBYSCORE key min max [WITHSCORES] [LIMIT offset count]`

:::

### ZRANGESTORE

将排序集合中指定范围的元素存储到目标排序集合中。与[ZRANGE](#zrange)命令一样，只是此命令会存储到目标排序集合中，而不是返回结果。

[官方文档 Redis ZRANGESTORE](https://redis.io/docs/latest/commands/zrangestore/)

::: tip 语法

`ZRANGESTORE dst src min max [BYSCORE | BYLEX] [REV] [LIMIT offset count]`

- dst: 目标排序集合
- src: 源排序集合

其他信息请参考[ZRANGE](#zrange)。

:::

### ZRANK

返回排序集合中指定元素的排名，分数从低到高排列，排名从0开始

[官方文档 Redis ZRANK](https://redis.io/docs/latest/commands/zrank/)

::: tip 语法

`ZRANK key member [WITHSCORE]`

- member: 指定的元素
- WITHSCORE: 返回元素的分数

:::

::: code-group

```sh [redis-cli]
127.0.0.1:6379> zadd zset 1 a 2 b 3 c
(integer) 3
127.0.0.1:6379> zrank zset a
(integer) 0
```

```java [java]
jedis.del("zset", "zset1", "zset2");
jedis.zadd("zset", Map.of("a", 1.0, "b", 2.0, "c", 3.0, "d", 4.0));
System.out.println(jedis.zrank("zset", "b")); // 1
```

:::

### ZREM <Badge>常用</Badge> {#zrem}

从指定的排序集合中删除指定的元素。

[官方文档 Redis ZREM](https://redis.io/docs/latest/commands/zrem/)

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

当集合中的元素都以相同的分数插入时，此命令删除介于min 和 max 之间，且以字典顺序排列的元素。

[官方文档 Redis ZREMRANGEBYLEX](https://redis.io/docs/latest/commands/zremrangebylex/)

::: tip 语法

`ZREMRANGEBYLEX key min max`

:::

### ZREMRANGEBYRANK

删除排序集合中排名在指定范围内的元素。排名请参阅[ZRANK](#zrank)

[官方文档 Redis ZREMRANGEBYRANK](https://redis.io/docs/latest/commands/zremrangebyrank/)

::: tip 语法

`ZREMRANGEBYRANK key start stop`

:::

### ZREMRANGEBYSCORE

删除排序集合中分数在指定范围内的元素。

[官方文档 Redis ZREMRANGEBYSCORE](https://redis.io/docs/latest/commands/zremrangebyscore/)

::: tip 语法

`ZREMRANGEBYSCORE key min max`

:::

### ZREVRANGE <Badge type="danger">废弃</Badge> {#zrevrange}

返回排序集合中指定范围的元素，这些元素默认是以分数从高到低排序的。

::: warning

该命令已废弃，可以用带REV参数的[ZRANGE](#zrange)命令替换。

:::

[官方文档 Redis ZREVRANGE](https://redis.io/docs/latest/commands/zrevrange/)

::: tip 语法

`ZREVRANGE key start stop [WITHSCORES]`

:::

### ZREVRANGEBYLEX <Badge type="danger">废弃</Badge> {#zrevrangebylex}

当集合中的元素都以相同的分数插入时，为了强制按字典排序，此命令返回介于max 和 min 之间范围的元素。

::: warning

该命令已废弃，可以用带REV和BYLEX参数的[ZRANGE](#zrange)命令替换。

:::

[官方文档 Redis ZREVRANGEBYLEX](https://redis.io/docs/latest/commands/zrevrangebylex/)

::: tip 语法

`ZREVRANGEBYLEX key max min [LIMIT offset count]`

- max: 最大值，可以是字符串或者数字，如果为-，则表示负无穷大
- min: 最小值，可以是字符串或者数字，如果为+，则表示正无穷大
- offset: 返回的元素偏移量，从0开始
- count: 返回的元素个数，如果为0，则返回所有元素

该命令与[ZRANGEBYLEX](#zrangebylex)类似，区别只是排序顺序相反。

:::

### ZREVRANGEBYSCORE <Badge type="danger">废弃</Badge> {#zrevrangebyscore}

返回排序集合中分数在指定范围的元素，这些元素默认以分数从高到低排序。

::: warning

该命令已废弃，可以用带REV和BYSCORE参数的[ZRANGE](#zrange)命令替换。

:::

[官方文档 Redis ZREVRANGEBYSCORE](https://redis.io/docs/latest/commands/zrevrangebyscore/)

::: tip 语法

`ZREVRANGEBYSCORE key max min [WITHSCORES] [LIMIT offset count]`

:::

### ZREVRANK

返回排序集合中指定元素的排名，分数从高到低排列，排名从0开始。该命令与[ZRANK](#zrank)相同不同的是ZRANK命令的排序顺序相反。

[官方文档 Redis ZREVRANK](https://redis.io/docs/latest/commands/zrevrank/)

::: tip 语法

`ZREVRANK key member [WITHSCORE]`

- member: 指定的元素
- WITHSCORE: 返回元素的分数

:::

### ZSCAN

迭代排序集合中的元素。

[官方文档 Redis ZSCAN](https://redis.io/docs/latest/commands/zscan/)

::: tip 语法

`ZSCAN key cursor [MATCH pattern] [COUNT count]`

- cursor: 游标，用于迭代集合中的元素，从0开始
- match: 匹配模式，如果为空，则匹配所有元素
- count: 返回的元素个数，如果为0，则返回所有元素

其他信息请参考[SCAN](#scan)，不同的是SCAN是迭代的redis的key列表，ZSCAN是迭代的指定key的排序集合的元素列表及分数

:::

### ZSCORE <Badge>常用</Badge> {#zscore}

返回排序集合中元素的分数。

[官方文档 Redis ZSCORE](https://redis.io/docs/latest/commands/zscore/)

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

### ZUNIONSTORE <Badge>常用</Badge> {#zunionstore}

对多个集合求并集，并将结果保存到目标集合中。

[官方文档 Redis ZUNIONSTORE](https://redis.io/docs/latest/commands/zunionstore/)

::: tip 语法

`ZUNIONSTORE destination numkeys key [key ...] [WEIGHTS weight [weight ...]] [AGGREGATE <SUM | MIN | MAX>]`

- destination: 目标集合
- numkeys: key的个数
- weights: 每个key的权重，如果为空，则默认为1
- aggregate: 合并方式，默认为SUM，可选SUM、MIN、MAX

:::

::: code-group

```sh [redis-cli]
127.0.0.1:6379> del zset zset1 zset2
(integer) 3
127.0.0.1:6379> zadd zset 1 a 2 b 3 c
(integer) 3
127.0.0.1:6379> zadd zset1 1 a 2 c
(integer) 2
127.0.0.1:6379> zunionstore zset2 2 zset zset1
(integer) 3
127.0.0.1:6379> zrange zset2 0 -1 withscores
1) "a"
2) "2"
3) "b"
4) "2"
5) "c"
6) "5"
```

```java [java]
jedis.del("zset", "zset1", "zset2");
jedis.zadd("zset", Map.of("a", 1.0, "b", 2.0, "c", 3.0));
jedis.zadd("zset1", Map.of("a", 1.0, "c", 2.0));
jedis.zunionstore("zset2", new ZParams(), "zset", "zset1");
System.out.println(jedis.zrangeWithScores("zset2", 0, -1)); // [[a,2.0], [b,2.0], [c,5.0]]
```

:::

### ZUNION

对多个集合求并集，功能上与[ZUNIONSTORE](#zunionstore)类似，只不过该命令不存储结果，而是返回并集。

[官方文档 Redis ZUNION](https://redis.io/docs/latest/commands/zunion/)

::: tip 语法

`ZUNION numkeys key [key ...] [WEIGHTS weight [weight ...]] [AGGREGATE <SUM | MIN | MAX>] [WITHSCORES]`

- numkeys: key的个数
- weights: 每个key的权重，如果为空，则默认为1
- aggregate: 合并方式，默认为SUM，可选SUM、MIN、MAX

其他信息请参考[ZUNIONSTORE](#zunionstore)。

:::

## 通用命令

### COPY

将源key的值复制到目标key中。如果目标key存在，返回0。

[官方文档 Redis COPY](https://redis.io/docs/latest/commands/copy/)

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

### DEL <Badge>常用</Badge> {#del}

DEL操作是删除指定key。如果删除成功返回1，否则返回0。

[官方文档 Redis DEL](https://redis.io/docs/latest/commands/del/)

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

返回key对应的值以redis特定格式序列化后的结果，之后可以使用[RESTORE](#restore)进行反序列化。

[官方文档 Redis DUMP](https://redis.io/docs/latest/commands/dump/)

```sh [redis-cli]
127.0.0.1:6379> set a b
OK
127.0.0.1:6379> dump a
"\x00\x01b\x0b\x00\x7f\xfb\x05\xe2[|\xfb\n"
```

### EXISTS <Badge>常用</Badge> {#exists}

EXISTS操作是判断key是否存在，如果存在返回true，不存在返回false。

[官方文档 Redis EXISTS](https://redis.io/docs/latest/commands/exists/)

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

### EXPIRE <Badge>常用</Badge> {#expire}

为指定key设置过期时间，只有删除或者覆盖操作才会替换过期时间。包括[DEL](#del)、[SET](#get-and-set)、[GETSET](#getset)，例如使用[INCR](#incr-and-decr)递增值，推送新值到list中，或者使用[HSET](#hget-and-hset)更改哈希的字段值，都不会更改超时时间。如果已有过期时间，那么也可以刷新过期时间，将过期时间设置为新的值

[官方文档 Redis EXPIRE](https://redis.io/docs/latest/commands/expire/)

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

EXPIREAT操作与[EXPIRE](#expire)类似，只不过它以Unix时间戳为参数。如果是过去的时间戳，那么key就会立即删除。

[官方文档 Redis EXPIREAT](https://redis.io/docs/latest/commands/expireat/)

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

[官方文档 Redis EXPIRETIME](https://redis.io/docs/latest/commands/expiretime/)

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

[官方文档 Redis KEYS](https://redis.io/docs/latest/commands/keys/)

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

原子性的将源Redis实例中的数据迁移到目标Redis实例中。实际上是在源Redis实例中执行[DUMP](#dump)+[DEL](#del)，并且在目标Redis实例上执行[RESTORE](#restore)。

[官方文档 Redis MIGRATE](https://redis.io/docs/latest/commands/migrate/)

::: tip 语法

`MIGRATE host port <key | ""> destination-db timeout [COPY] [REPLACE] [AUTH password | AUTH2 username password] [KEYS key [key ...]]`

- copy: 不从源Redis实例中删除key
- replace: 替换目标Redis实例上已有的key
- auth: 使用密码访问目标Redis实例
- auth2: 使用指定的用户密码对访问目标Redis实例

:::

### MOVE

将key从当前数据库移动到指定的数据库

[官方文档 Redis MOVE](https://redis.io/docs/latest/commands/move/)

### OBJECT ENCODING

返回key对应的值对象的内部编码。

[官方文档 Redis OBJECT ENCODING](https://redis.io/docs/latest/commands/object-encoding/)

::: tip 语法

`OBJECT ENCODING key`

具体编码请参考官方文档。

:::

### OBJECT FREQ

返回指定key的访问频率。

[官方文档 Redis OBJECT FREQ](https://redis.io/docs/latest/commands/object-freq/)

::: tip 语法

`OBJECT FREQ key`

只有当`maxmemory-policy`设置为FLU策略之一时才可用。

:::

### OBJECT IDLETIME

返回指定key从上次访问之后到现在过了多少秒。

[官方文档 Redis OBJECT IDLETIME](https://redis.io/docs/latest/commands/object-idletime/)

::: tip 语法

`OBJECT IDLETIME key`

只有当`maxmemory-policy`设置为FLU策略之一时才可用。

:::

### OBJECT REFCOUNT

返回key处存储对象的引用计数。

[官方文档 Redis OBJECT REFCOUNT](https://redis.io/docs/latest/commands/object-refcount/)

::: tip 语法

`OBJECT REFCOUNT key`

:::

### PERSIST

移除指定key上的过期时间，将其设置为永不过期

[官方文档 Redis PERSIST](https://redis.io/docs/latest/commands/persist/)

::: code-group

```sh [redis-cli]
127.0.0.1:6379> set test hello
OK
127.0.0.1:6379> ttl test
(integer) -1
127.0.0.1:6379> expire test 30
(integer) 1
127.0.0.1:6379> ttl test
(integer) 28
127.0.0.1:6379> persist test
(integer) 1
127.0.0.1:6379> ttl test
(integer) -1
```

```java [java]
jedis.del("test");
jedis.set("test", "hello");
System.out.println(jedis.ttl("test")); // -1
jedis.expire("test", 30);
System.out.println(jedis.ttl("test")); // 30
jedis.persist("test");
System.out.println(jedis.ttl("test")); // -1
```

:::

### PEXPIRE

设置key的过期时间，此命令与[EXPIRE](#expire)工作方式完全相同，不同的是PEXPIRE单位是毫秒。

[官方文档 Redis PEXPIRE](https://redis.io/docs/latest/commands/pexpire/)

### PEXPIREAT

延长key的过期时间，此命令与[EXPIREAT](#expireat)工作方式完全相同，不同的是PEXPIREAT单位是毫秒。

[官方文档 Redis PEXPIREAT](https://redis.io/docs/latest/commands/pexpireat/)

### PEXPIRETIME

返回过期的unix时间戳，此命令与[EXPIRETIME](#expiretime)工作方式完全相同，不同的是PEXPIREATIME单位是毫秒。

[官方文档 Redis PEXPIRETIME](https://redis.io/docs/latest/commands/pexpiretime/)

### RANDOMKEY

从当前数据库随机返回一个key。

[官方文档 Redis RANDOMKEY](https://redis.io/docs/latest/commands/randomkey/)

```sh [redis-cli]
127.0.0.1:6379> randomkey
"testList"
127.0.0.1:6379> randomkey
"set3"
```

### RENAME

将key重命名为newkey。如果key不存在则返回错误，如果newkey存在则对newkey进行覆盖。

[官方文档 Redis RENAME](https://redis.io/docs/latest/commands/rename/)

```sh [redis-cli]
127.0.0.1:6379> get test
"hello"
127.0.0.1:6379> get test1
(nil)
127.0.0.1:6379> rename test test1
OK
127.0.0.1:6379> get test
(nil)
127.0.0.1:6379> get test1
"hello"
```

### RENAMENX

将key重命名为newkey。如果key不存在则返回错误，如果newkey不存在则将key重命名为newkey。

[官方文档 Redis RENAMENX](https://redis.io/docs/latest/commands/renamenx/)

```sh [redis-cli]
127.0.0.1:6379> get test
"world"
127.0.0.1:6379> get test1
"hello"
127.0.0.1:6379> renamenx test test1
(integer) 0
127.0.0.1:6379> get test
"world"
127.0.0.1:6379> get test1
"hello"
127.0.0.1:6379> del test1
(integer) 1
127.0.0.1:6379> renamenx test test1
(integer) 1
127.0.0.1:6379> get test
(nil)
127.0.0.1:6379> get test1
"world"
```

### RESTORE

反序列化通过[DUMP](#dump)序列化的值，并设置到key中。

[官方文档 Redis RESTORE](https://redis.io/docs/latest/commands/restore/)

::: tip 语法

`RESTORE key ttl serialized-value [REPLACE] [ABSTTL] [IDLETIME seconds] [FREQ frequency]`

- ttl: 过期时间，当值为0时表示没有任何过期时间
- serialized-value: 经[DUMP](#dump)序列化的值

其他信息请参考官方文档 https://redis.io/docs/latest/commands/restore/

:::

```sh [redis-cli]
127.0.0.1:6379> set a b
OK
127.0.0.1:6379> dump a
"\x00\x01b\x0b\x00\x7f\xfb\x05\xe2[|\xfb\n"
127.0.0.1:6379> restore ra 0 "\x00\x01b\x0b\x00\x7f\xfb\x05\xe2[|\xfb\n"
OK
127.0.0.1:6379> get ra
"b"
```

### SCAN

迭代Redis中的键，此命令允许增量迭代，每次调用仅返回少量的数据，所以它可以在生产环境使用，并且不会发生[KEYS](#keys)那样的长时间阻塞服务器。

scan返回的是两个值组成的数组，第一个值是下次迭代的新游标值，第二个是迭代返回的元素数组。当返回的新游标值为0时表示所有元素都已经迭代完成。

[官方文档 Redis SCAN](https://redis.io/docs/latest/commands/scan/)

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

返回List|Set|Sorted Set排序后的结果。

[官方文档 Redis SORT](https://redis.io/docs/latest/commands/sort/)

::: tip 语法

`SORT key [BY pattern] [LIMIT offset count] [GET pattern [GET pattern ...]] [ASC | DESC] [ALPHA] [STORE destination]`

:::

### SORT_RO

[SORT](#sort)的只读变体，它与SORT完全相同。

[官方文档 Redis SORT_RO](https://redis.io/docs/latest/commands/sort_ro/)

### TOUCH

更改key的最后访问时间。

[官方文档 Redis TOUCH](https://redis.io/docs/latest/commands/touch/)

::: tip 语法

`TOUCH key [key ...]`

:::

### TTL <Badge>常用</Badge> {#ttl}

获取指定key的剩余过期时间（单位为秒）。

[官方文档 Redis TTL](https://redis.io/docs/latest/commands/ttl/)

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

[官方文档 Redis PTTL](https://redis.io/docs/latest/commands/ttl/)

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

[官方文档 Redis TYPE](https://redis.io/docs/latest/commands/type/)

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

该命令与[DEL](#del)非常相似，删除指定的key，不同的是UNLINK只是将key与实际的内存对象取消关联，并没有实际上进行删除，实际上的删除是在后面异步删除，所以该命令是非阻塞的，而DEL是阻塞的。

[官方文档 Redis UNLINK](https://redis.io/docs/latest/commands/unlink/)

::: tip 语法

`UNLINK key [key ...]`

:::

```sh [redis-cli]
127.0.0.1:6379> get test
(nil)
127.0.0.1:6379> get test1
"world"
127.0.0.1:6379> unlink test test1
(integer) 1
```

### WAIT

阻塞链接直到此前所有的写入命令都已经得到指定数量的副本的确认。详情请查看官方文档

[官方文档 Redis WAIT](https://redis.io/docs/latest/commands/wait/)

### WAITAOF

阻塞链接直到此前所有的写入命令都已经得到本地AOF的确认 and/or 指定数量的副本的确认。详情请查看官方文档

[官方文档 Redis WAITAOF](https://redis.io/docs/latest/commands/waitaof/)
