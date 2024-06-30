---
title: Mysql 相关
layout: doc
outline: deep
---

# Mysql 相关

## 数据库管理

### 命令行连接数据库

本地连接

```bash
# 链接本地数据库  即本地安装有mysql
root@local:~$ mysql -u root -p
Enter password: # 此时需要输入密码
# 登录成功后会进入mysql的命令窗口
mysql>
```

指定端口连接，安装时修改了端口

```bash
# 指定端口连接，安装时修改了端口  本地安装有mysql
root@local:~$ mysql -u root -p -P 33060
Enter password: # 此时需要输入密码
# 登录成功后会进入mysql的命令窗口
mysql>
```

指定ip及端口连接，不连接本地的mysql，但是本地安装有mysql，即拥有mysql-cli

```bash
# 指定ip及端口连接  本地安装有mysql
root@local:~$ mysql -h 192.168.1.5 -u root -p -P 33060
Enter password: # 此时需要输入密码
# 登录成功后会进入mysql的命令窗口
mysql>
```

### 创建用户

```sql
CREATE USER 'username'@'host' IDENTIFIED BY 'password';
例子：
CREATE USER 'dev'@'%' IDENTIFIED by '123456'; -- 创建一个dev的用户，可以在任意主机上登录，密码为123456
```

### 用户授权

#### 查询权限

```sql
SHOW GRANTS FOR 'username'@'hostname';
```

#### 授予权限

```sql
GRANT privileges ON databasename.tablename TO 'username'@'host';
例子：
GRANT all ON test.table1 TO 'dev'@'%'; -- 在给dev用户在任意主机上赋予test数据库中的table1表全部权限
```
