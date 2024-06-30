---
title: ubuntu修改软件镜像源
layout: doc
outline: deep
---

# ubuntu修改软件镜像源

Ubuntu 的软件源配置文件是 `/etc/apt/sources.list`

```shell
# 对默认源文件进行备份
sudo cp /etc/apt/sources.list /etc/apt/sources.list.back
# 编辑配置文件为对应的软件源
sudo vim /etc/apt/sources.list
# 更新
sudo apt-get update
sudo apt-get upgrade
```

## 镜像源推荐

[清华镜像源](https://mirrors.tuna.tsinghua.edu.cn/help/ubuntu/)

[阿里云镜像源](https://developer.aliyun.com/mirror/ubuntu)

[网易镜像源](http://mirrors.163.com/.help/ubuntu.html)

[华科镜像源](http://mirrors.ustc.edu.cn/help/ubuntu.html)
