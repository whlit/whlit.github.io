---
title: nginx集群搭建
layout: doc
outline: deep
---

# nginx集群搭建

## nginx负载均衡

三台服务器，一台安装nginx作为负载均衡服务器，两台作为应用服务器

### nginx安装

nginx依赖环境安装

```shell
yum -y install gcc pcre-devel zlib-devel openssl openssl-devel
```

下载nginx安装包：http://nginx.org/en/download.html

本次下载最新版本为`1.17.8`

上传到服务器后

```shell
## 解压
tar zxvf nginx-1.17.8.tar.gz
##进入nginx目录
cd nginx-1.17.8
## 配置
./configure --prefix=/usr/local/nginx

# make
make
make install
```

测试是否安装成功

```shell
/usr/local/nginx/sbin/nginx -t
```

正确输出：

```
nginx: the configuration file /usr/local/nginx/nginx/conf/nginx.conf syntax is ok
nginx: configuration file /usr/local/nginx/nginx/conf/nginx.conf test is successful
```

启动nginx

```shell
/usr/local/nginx/sbin/nginx
```

浏览器访问服务器ip显示nginx欢迎页面即证明安装成功

配置nginx开机自启动

在`/etc/rc.d/rc.local`文件中追加

```shell
/usr/local/nginx/sbin/nginx
```
