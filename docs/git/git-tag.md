---
title: Git Tag 常用操作
---

# Git Tag 常用操作

## 创建 Tag

- 创建简单的tag

```sh
git tag v1.0.0
```

- 创建带注释的tag

```sh
git tag -a v1.0.0 -m "tag message"
```

- 对某次提交创建tag

```sh
git tag v1.0.0 b8d9e3
```

## 查询 Tag

- 查看所有tag

```sh
git tag
```

- 查看某个tag的信息

```sh
git show v1.0.0
```

## 把 tag push 到远程仓库

```sh
git push origin v1.0.0
```

## 删除 tag

```sh
git tag -d v1.0.0
```

## 根据 tag 检出

```sh
git checkout v1.0.0
```
