---
layout: doc
title: Redis 数据类型
outline: deep
---

# Redis 数据类型

## String

String 类型是基础的`key:value`类型，key是字符串类型，value可以是bytes、string、序列化对象、字节数组。value最大不可超过512MB.

### SET GET <Badge>常用</Badge>

SET和GET是两个最基础的操作，也是Redis的基础，set操作是设置值，get操作是获取值。

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



### MSET MGET  <Badge>常用</Badge>

MSET和MGET是两个最基础的操作的批量操作，可以同时设置多个key，也可以同时获取多个key。

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

### GETSET  <Badge type="danger">废弃</Badge>

以原子的方式将一个值设置为另一个值，并返回旧的值。

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



### GETRANGESETRANGE {#getrange-and-setrange}

GETRANGE 和 SETRANGE 用于获取和设置字符串的一部分。
`getrange key start end`：返回字符串key的值从start到end的子串，包括start和end。
`setrange key offset value`：将字符串key的值从start到end的子串替换为value，如果value长度不够则用`\x00`填充。

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


### MSETNX

批量设置键值，如果key已经存在，则不设置。但只要有一个值已经存在就不会执行操作。也就是要么都成功，要么都失败。

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


### INCR DECR <Badge>常用</Badge>

将key的值增加1或者减少1，并返回值，如果key不存在，则会创建一个key为key，值为1。如果值不可以转为整数，则会报错。

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

### INCRBY DECRBY <Badge>常用</Badge>

将key的值增加或者减少指定的值，并返回值，如果key不存在，则会创建一个key为key，值为指定的值。如果值不可以转为整数，则会报错。

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

### STRLEN  <Badge>常用</Badge>

获取值的**字节长度**。

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


## List

## Set

## Hash

## Sorted Sets

## Streams

## Geospatial indexes

## Bitmaps

## Bitfields

## HyperLogLog

## 通用命令

### COPY

将源key的值复制到目标key中。如果目标key存在，返回0。

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

返回所有匹配的key，支持通配符。这个命令要小心使用，如果数据量很大的话很可能会导致内存溢出。

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

### SORT

### SORT_RO

### TOUCH

### TTL <Badge>常用</Badge>

获取指定key的剩余过期时间（单位为秒）。

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

