---
title: Docker构建MySQL服务
layout: doc
outline: deep
---

# Docker构建MySQL服务

- Mysql 镜像检索

```
[root@localhost ~]# docker search mysql
   NAME                                                   DESCRIPTION                                     STARS               OFFICIAL            AUTOMATED
   mysql                                                  MySQL is a widely used, open-source relation…   8109                [OK]
   mariadb                                                MariaDB is a community-developed fork of MyS…   2750                [OK]
   mysql/mysql-server                                     Optimized MySQL Server Docker images. Create…   607                                     [OK]
   zabbix/zabbix-server-mysql                             Zabbix Server with MySQL database support       190                                     [OK]
   hypriot/rpi-mysql                                      RPi-compatible Docker Image with Mysql          113
   zabbix/zabbix-web-nginx-mysql                          Zabbix frontend based on Nginx web-server wi…   99                                      [OK]
   centurylink/mysql                                      Image containing mysql. Optimized to be link…   60                                      [OK]
   centos/mysql-57-centos7                                MySQL 5.7 SQL database server                   52
   1and1internet/ubuntu-16-nginx-php-phpmyadmin-mysql-5   ubuntu-16-nginx-php-phpmyadmin-mysql-5          50                                      [OK]
   mysql/mysql-cluster                                    Experimental MySQL Cluster Docker images. Cr…   44
   tutum/mysql                                            Base docker image to run a MySQL database se…   31
   zabbix/zabbix-web-apache-mysql                         Zabbix frontend based on Apache web-server w…   29                                      [OK]
   bitnami/mysql                                          Bitnami MySQL Docker Image                      26                                      [OK]
   schickling/mysql-backup-s3                             Backup MySQL to S3 (supports periodic backup…   26                                      [OK]
   zabbix/zabbix-proxy-mysql                              Zabbix proxy with MySQL database support        22                                      [OK]
   linuxserver/mysql                                      A Mysql container, brought to you by LinuxSe…   20
   centos/mysql-56-centos7                                MySQL 5.6 SQL database server                   13
   mysql/mysql-router                                     MySQL Router provides transparent routing be…   11
   circleci/mysql                                         MySQL is a widely used, open-source relation…   11
   dsteinkopf/backup-all-mysql                            backup all DBs in a mysql server                6                                       [OK]
   openshift/mysql-55-centos7                             DEPRECATED: A Centos7 based MySQL v5.5 image…   6
   jelastic/mysql                                         An image of the MySQL database server mainta…   1
   cloudposse/mysql                                       Improved `mysql` service with support for `m…   0                                       [OK]
   widdpim/mysql-client                                   Dockerized MySQL Client (5.7) including Curl…   0                                       [OK]
   ansibleplaybookbundle/mysql-apb                        An APB which deploys RHSCL MySQL                0                                       [OK]
```

- 拉取镜像

默认拉取最新版本

```
[root@localhost ~]# docker pull mysql
```

也可以指定版本

```
[root@localhost ~]# docker pull mysql:5.7
```

- 查看镜像

```
[root@localhost ~]# docker images
   REPOSITORY                 TAG                 IMAGE ID            CREATED             SIZE
   mysql                      latest              7bb2586065cd        5 weeks ago         477MB
   docker4w/nsenter-dockerd   latest              2f1c802f322f        6 months ago        187kB
```

- 运行镜像

```powershell
C:\Users\admin>docker run \
			-d \	## 后台运行
      -p 3306:3306 \ ## 映射端口号
      -v E:/mysql/conf/my.cnf:/etc/mysql/my.cnf \ ## 映射配置文件
      -v E:/mysql/data:/var/lib/mysql  \ ## 映射数据文件夹
      -e MYSQL_ROOT_PASSWORD=root \ ## 配置root用户密码
      --name mysql-docker \ ## 容器名称
      mysql:5.7 ## 使用的镜像的名称及版本号
```
