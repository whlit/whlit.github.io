---
title: Git 放弃修改
layout: doc
outline: deep
---

# Git 放弃修改

在使用git的时候，对于我们已经修改的内容，想要恢复成没有修改时的状态。

## 放弃未跟踪的文件

一般新建的文件没有加入到git的跟踪中，需要使用`git add`命令将其加入到git的跟踪中。其中不包含忽略的文件，即`.gitignore`中标识的文件。

::: tip git clean 用法

`git clean [-d] [-f] [-i] [-n] [-q] [-e <pattern>] [-x | -X] [--] [<pathspec>...]`

:::

::: info 可选参数

- `-q, --[no-]quiet` 不打印删除的文件名称
- `-n, --[no-]dry-run` 不实际进行删除，只进行尝试，并打印哪些文件会被删除
- `-f, --[no-]force` 删除
- `-i, --[no-]interactive` 交互模式进行删除
- `-d` 递归
- `-e, --exclude <pattern>` 添加忽略的文件规则
- `-x` 也删除忽略的文件
- `-X` 只删除忽略的文件

:::

## 放弃未添加到暂存区的修改

已经跟踪的文件的修改，但是还没有使用`git add`命令添加到git的暂存区中。这时可以使用`git checkout`命令将其放弃修改。

::: tip git checkout 用法

`git checkout [-f] [--] [<pathspec>...]`

:::

`git checkout -- filepath` 放弃对文件的修改，不要忘记`--`不然就变成了切换分支了。

`git checkout .` 放弃所有文件的修改

## 放弃所有修改

对于已经添加到暂存区的修改，可以使用`git reset`命令放弃。[Git Reset](./git-delete-push)

::: tip git reset 用法

`git reset [--soft | --mixed | --hard] <commit>`

:::

`git reset --hard HEAD` 放弃所有修改，工作区和暂存区都会清空所作的修改，回到最后一次提交的状态。

## 缓存修改

对于我们当前的修改我们不想放弃，但是又急于切换分支处理问题时，可以使用`git stash`命令将修改缓存起来，然后处理完问题后切换回分支使用`git stash pop`命令将修改恢复。注意**只有被跟踪的文件的修改才会被缓存**，无论是否添加到暂存区。

::: tip git stash 用法

`git stash [<options>]`

:::

::: info 常用命令

- `git stash` 缓存修改
- `git stash pop` 恢复最后一次缓存的修改，并删除这个缓存
- `git stash list` 查看缓存的修改
- `git stash clear` 清空所有缓存
- `git stash apply` 恢复最后一次缓存的修改，但是不删除
- `git stash drop` 删除最后一次缓存的修改，不会恢复
- `git stash show` 查看最后一次缓存的修改

:::
