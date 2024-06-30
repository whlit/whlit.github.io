---
title: Shell 脚本编写
layout: doc
outline: deep
---

# Shell 脚本编写

## 首行

第一行内容在脚本的首行左侧，表示脚本将要调用的shell解释器，内容如下：

```sh
#!/bin/bash

```

`#!`符号能够被内核识别成是一个脚本的开始，这一行必须位于脚本的首行，`/bin/bash`是bash程序的绝对路径，在这里表示后续的内容将通过bash程序解释执行。

## 注释

注释符号# 放在需注释内容的前面，如下：

```sh
#!/bin/bash
#我的shell脚本
```

## 内容

可执行内容和shell结构

```sh
#!/bin/bash
#我的shell脚本
$ echo "hello world"
```

## Shell脚本权限

一般Linux下文件默认是没有执行权限的，需要我们手动赋予执行权限

```sh
$ touch myShell.sh # 新建文件
$ ls -l	# 列出文件夹下所有
# -rw-r--r--. 1 root root       0 2月  28 15:45 a.txt
$ chmod +x myShell.sh	# 赋予执行权限
$ ls -l	# 列出文件夹下所有
# -rwxr-xr-x. 1 root root       0 2月  28 15:45 a.txt
```
