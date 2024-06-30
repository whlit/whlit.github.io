---
title: Mysql删除不存在的id
layout: doc
outline: deep
---

# Mysql删除不存在的id

现有一张mysql表，存在id为1，2，3，7，8的数据，当更新id为4，5，6的数据时，会发生什么，哪些数据会被锁

| id  | name      |
| --- | --------- |
| 1   | zhangsan  |
| 2   | lisi      |
| 3   | wangwu    |
| 7   | xiaolan   |
| 8   | xiaoliang |

## 新增操作

- 插入id为4的数据

```sql
BEGIN;

INSERT INTO `user` VALUES (4, 'xiaohong');
```

此时插入id为4的数据的事务中

```sql
SELECT * FROM `user` WHERE id = 4;  //查询结果为空

INSERT INTO `user` VALUES (4, 'xiaohong');  //尝试插入id为4的数据，超时

INSERT INTO `user` VALUES (5, 'xiaohuang');  //尝试插入id为5的数据，正常插入

UPDATE `user` SET name = 'xiaohuang' WHERE id = 3;  //尝试更新id为3的数据，正常更新

UPDATE `user` SET name = 'xiaohuang' WHERE id = 4;  //尝试更新id为4的数据，超时

UPDATE `user` SET name = 'xiaohuang' WHERE id = 5;  //尝试更新id为5的数据，更新0条数据，但并没有超时

UPDATE `user` SET name = 'xiaohuang' WHERE id = 6;  //尝试更新id为6的数据，更新0条数据，但并没有超时

UPDATE `user` SET name = 'xiaohuang' WHERE id = 7;  //尝试更新id为7的数据，正常更新
```

说明当插入id为4的数据时，id为4的数据行会被锁定，其他数据行不会被锁定

- 插入id为5的数据

```sql
BEGIN;
INSERT INTO `user` VALUES (5, 'xiaohuang');
```

此时插入id为5的数据的事务中

```sql
SELECT * FROM `user` WHERE id = 5;  //查询结果为空

INSERT INTO `user` VALUES (4, 'xiaohong');  //尝试插入id为4的数据，正常插入

INSERT INTO `user` VALUES (5, 'xiaohuang');  //尝试插入id为5的数据，超时，结果显示为锁超时

UPDATE `user` SET name = 'xiaohuang' WHERE id = 3;  //尝试更新id为3的数据，正常更新

UPDATE `user` SET name = 'xiaohuang' WHERE id = 5;  //尝试更新id为5的数据，超时
```

说明当插入id为5的数据时，id为5的数据行会被锁定，其他数据行不会被锁定

- 插入id为6的数据

由上面两个示例可以看出，新增数据只会锁插入的数据行，其他数据行不会被锁定

## 删除操作

- 删除id为4的数据

```sql
BEGIN;
DELETE FROM `user` WHERE id = 4;
```

此时删除id为4的数据的事务中

```sql
SELECT * FROM `user` WHERE id = 4;  //查询结果为空

INSERT INTO `user` VALUES (4, 'xiaohong');  //尝试插入id为4的数据，超时，结果显示为锁超时

INSERT INTO `user` VALUES (5, 'xiaohuang');  //尝试插入id为5的数据，超时，结果显示为锁超时

INSERT INTO `user` VALUES (6, 'xiaoliang');  //尝试插入id为6的数据，超时，结果显示为锁超时

UPDATE `user` SET name = 'xiaohuang' WHERE id = 3;  //尝试更新id为3的数据，正常更新

UPDATE `user` SET name = 'xiaohuang' WHERE id = 4;  //尝试更新id为4的数据，超时,结果显示为锁超时

UPDATE `user` SET name = 'xiaohuang' WHERE id = 7;  //尝试更新id为7的数据，正常更新
```

当删除id为4的数据时，id为4，5，6的数据行会被锁定

- 删除id为5的数据

```sql
BEGIN;
DELETE FROM `user` WHERE id = 5;
```

此时删除id为5的数据的事务中

```sql
SELECT * FROM `user` WHERE id = 5;  //查询结果为空

INSERT INTO `user` VALUES (4, 'xiaohong');  //尝试插入id为4的数据，超时，结果显示为锁超时

INSERT INTO `user` VALUES (5, 'xiaohuang');  //尝试插入id为5的数据，超时，结果显示为锁超时

INSERT INTO `user` VALUES (6, 'xiaoliang');  //尝试插入id为6的数据，超时，结果显示为锁超时

UPDATE `user` SET name = 'xiaohuang' WHERE id = 3;  //尝试更新id为3的数据，正常更新

UPDATE `user` SET name = 'xiaohuang' WHERE id = 4;  //尝试更新id为4的数据，超时,结果显示为锁超时

UPDATE `user` SET name = 'xiaohuang' WHERE id = 7;  //尝试更新id为7的数据，正常更新
```

当删除id为5的数据时，id为4，5，6的数据行会被锁定

- 删除id为6的数据

```sql
BEGIN;
DELETE FROM `user` WHERE id = 6;
```

此时删除id为6的数据的事务中

```sql
SELECT * FROM `user` WHERE id = 6;  //查询结果为空

INSERT INTO `user` VALUES (4, 'xiaohong');  //尝试插入id为4的数据，超时，结果显示为锁超时

INSERT INTO `user` VALUES (5, 'xiaohuang');  //尝试插入id为5的数据，超时，结果显示为锁超时

INSERT INTO `user` VALUES (6, 'xiaoliang');  //尝试插入id为6的数据，超时，结果显示为锁超时

UPDATE `user` SET name = 'xiaohuang' WHERE id = 3;  //尝试更新id为3的数据，正常更新

UPDATE `user` SET name = 'xiaohuang' WHERE id = 4;  //尝试更新id为4的数据，超时,结果显示为锁超时

UPDATE `user` SET name = 'xiaohuang' WHERE id = 7;  //尝试更新id为7的数据，正常更新
```

当删除id为6的数据时，id为4，5，6的数据行会被锁定

## 更新操作

- 更新id为4的数据

```sql
BEGIN;
UPDATE `user` SET name = 'xiaohuang' WHERE id = 4;
```

此时更新id为4的数据的事务中

```sql
SELECT * FROM `user` WHERE id = 4;  //查询结果为空

INSERT INTO `user` VALUES (4, 'xiaohong');  //尝试插入id为4的数据，超时，结果显示为锁超时

INSERT INTO `user` VALUES (5, 'xiaohuang');  //尝试插入id为5的数据，超时，结果显示为锁超时

INSERT INTO `user` VALUES (6, 'xiaoliang');  //尝试插入id为6的数据，超时，结果显示为锁超时

UPDATE `user` SET name = 'xiaohuang' WHERE id = 3;  //尝试更新id为3的数据，正常更新

UPDATE `user` SET name = 'xiaohuang' WHERE id = 4;  //尝试更新id为4的数据，更新0条数据，但并没有超时

UPDATE `user` SET name = 'xiaohuang' WHERE id = 5;  //尝试更新id为5的数据，更新0条数据，但并没有超时

UPDATE `user` SET name = 'xiaohuang' WHERE id = 6;  //尝试更新id为6的数据，更新0条数据，但并没有超时

UPDATE `user` SET name = 'xiaohuang' WHERE id = 7;  //尝试更新id为7的数据，正常更新
```

当更新id为4的数据时，id为4的数据行会被写锁定，

- 更新id为5的数据

```sql
BEGIN;
UPDATE `user` SET name = 'xiaohuang' WHERE id = 5;
```

此时更新id为5的数据的事务中

```sql
SELECT * FROM `user` WHERE id = 5;  //查询结果为空

INSERT INTO `user` VALUES (4, 'xiaohong');  //尝试插入id为4的数据，超时，结果显示为锁超时

INSERT INTO `user` VALUES (5, 'xiaohuang');  //尝试插入id为5的数据，超时，结果显示为锁超时

INSERT INTO `user` VALUES (6, 'xiaoliang');  //尝试插入id为6的数据，超时，结果显示为锁超时

UPDATE `user` SET name = 'xiaohuang' WHERE id = 3;  //尝试更新id为3的数据，正常更新

UPDATE `user` SET name = 'xiaohuang' WHERE id = 4;  //尝试更新id为4的数据，更新0条数据，但并没有超时

UPDATE `user` SET name = 'xiaohuang' WHERE id = 5;  //尝试更新id为5的数据，更新0条数据，但并没有超时

UPDATE `user` SET name = 'xiaohuang' WHERE id = 6;  //尝试更新id为6的数据，更新0条数据，但并没有超时

UPDATE `user` SET name = 'xiaohuang' WHERE id = 7;  //尝试更新id为7的数据，正常更新
```

当更新id为5的数据时，id为5的数据行会被写锁定

- 更新id为6的数据

由上面两个示例可以看出，更新数据只会锁更新的数据行，其他数据行不会被锁定

## 结论

新增一条数据时，会锁定新增的id的数据行，其他数据行不会被锁定

更新一条数据时，会锁定更新的id的数据行，其他数据行不会被锁定

删除一条数据时，会锁定删除的id的区间的所有不存在的id的数据行，其他数据行不会被锁定
