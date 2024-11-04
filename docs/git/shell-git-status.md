---
title: 在shell脚本中判断git状态
---

# 在shell脚本中判断git状态

`git status`是用于查看git仓库当前状态的命令，它可以查看在上次提交之后工作区以及暂存区是否有文件修改，例如：

```sh
$ git status
On branch main
Your branch is up to date with 'origin/main'.

Untracked files:
  (use "git add <file>..." to include in what will be committed)
        docs/git/shell-git-status.md

no changes added to commit (use "git add" and/or "git commit -a")
```

当没有修改时它的输出是这样的：

```sh
$ git status
On branch main
Your branch is up to date with 'origin/main'.

nothing to commit, working tree clean
```

我们还可以添加`-s`参数来减少输出的内容:

```sh
$ git status -s
?? docs/git/shell-git-status.md
```

当没有修改内容时，`git status -s`的输出就为空，所以我们可以通过判断输出是否为空来判断是否有文件修改，例如：

```sh
#!/bin/bash

if [ -z "$(git status -s)" ]
then
    echo "没有文件修改"
else
    echo "有文件修改"
fi
```
