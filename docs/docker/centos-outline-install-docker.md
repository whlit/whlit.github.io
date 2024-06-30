---
title: Centos离线安装Docker
layout: doc
outline: deep
---

# Centos离线安装Docker

记录在公司内网无法连接外部网络情况下安装docker的过程，全程参考蛮大人的[Docker验证Centos7.2离线安装Docker环境](https://opsdev.fun/2018/05/09/O2-0-Docker%E9%AA%8C%E8%AF%81Centos7-2%E7%A6%BB%E7%BA%BF%E5%AE%89%E8%A3%85Docker%E7%8E%AF%E5%A2%83/)

## 下载Centos7.2镜像

```powershell
C:\Users\w_w>docker pull centos:7.2.1511
C:\Users\w_w>docker run -it --name centostest centos:7.2.1511 /bin/bash
[root@04ce67faeaee /]#
```

## 配置docker-ce源

```powershell
[root@04ce67faeaee /]# yum-config-manager --add-repo https://mirrors.ustc.edu.cn/docker-ce/linux/centos/docker-ce.repo
bash: yum-config-manager: command not found
```

未安装yum-config-manager

```powershell
[root@04ce67faeaee /]# yum -y install yum-utils
```

搜索docker-ce

```powershell
[root@04ce67faeaee /]# yum search docker-ce
...
========================== N/S matched: docker-ce =============================
docker-ce.x86_64 : The open-source application container engine
docker-ce-cli.x86_64 : The open-source application container engine
docker-ce-selinux.noarch : SELinux Policies for the open-source application container engine
...
```

## 下载docker-ce

```powershell
[root@04ce67faeaee /]# cd /usr/local
[root@04ce67faeaee local]# mkdir yumrepo
[root@04ce67faeaee local]# yum install --downloadonly --downloaddir=/usr/local/yumrepo/ docker-ce
```

## 配置docker本地源

先安装本地 repo 索引创建工具，通过这个工具，建立索引

```powershell
[root@04ce67faeaee local]# yum install createrepo -y
[root@04ce67faeaee local]# createrepo /usr/local/yumrepo/
```

创建源文件docker.repo

```powershell
[root@04ce67faeaee local]# cd /etc/yum.repos.d
[root@04ce67faeaee local]# vi docker.repo
[root@04ce67faeaee local]# more docker.repo
[docker-yum]
name=dockeryum
baseurl=file:///usr/local/yumrepo
enable=1
gpgcheck=0
```

## 模拟离线安装

```powershell
[root@04ce67faeaee local]# yum --disablerepo=\* --enablerepo=docker-yum install docker-ce -y
[root@04ce67faeaee local]# docker -v
Docker version 18.09.6, build 481bc77156
```

## Copy资源到服务器

```powershell
C:\Users\w_w>docker cp centostest:/usr/local/yumrepo E:/docker/yumrepo
C:\Users\w_w>docker cp centostest:/etc/yum.repos.d/docker.repo E:/docker/docker.repo
```

- yumrepo放置到/usr/local/目录下
- docker.repo放置到/etc/yum.repo.d/目录下

## 验证docker本地源

```powershell
[root@e725aaa120b2 local]# yum repolist
```

## 离线安装

```powershell
[root@e725aaa120b2 local]# yum --disablerepo=\* --enablerepo=docker-yum install docker-ce -y
```

报错，缺依赖包；docker-ce相关依赖包已经全了，只是有一些CentOS依赖的包版本比docker-ce低，内网系统可能优化精简“过”了，或基础软件不完整，导致这些低版本和高版本不能和谐共处；只能根据报错信息，去笔记本下载依赖

## 解决依赖

下载依赖包

```powershell
[root@04ce67faeaee local]# yum-config-manager --add-repo https://download.docker.com/linux/centos/docker-ce.repo
[root@04ce67faeaee local]# yum clean all
[root@04ce67faeaee local]# yum makecache
[root@04ce67faeaee local]# repotrack -a x86_64 -p /usr/local/yumrepo systemd-sysv
[root@04ce67faeaee local]# createrepo /usr/local/yumrepo/
```

通过“repotrack -a x86_64 -p /usr/local/yumrepo 包名”下载依赖包，然后重新创建索引

## 启动服务

重新拷贝到服务器后进行离线安装无报错，启动docker服务

```powershell
[root@e725aaa120b2 local]# systemctl start docker
```

原文作者：蛮大人
链接：[Docker验证Centos7.2离线安装Docker环境](https://opsdev.fun/2018/05/09/O2-0-Docker%E9%AA%8C%E8%AF%81Centos7-2%E7%A6%BB%E7%BA%BF%E5%AE%89%E8%A3%85Docker%E7%8E%AF%E5%A2%83/)
