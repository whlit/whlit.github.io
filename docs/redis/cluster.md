---
title: Redis 三主三从 Cluster Docker环境搭建
layout: doc
outline: deep
---

# Redis 三主三从 Cluster Docker环境搭建

工作中有时需要一个本地或者临时的Redis集群环境用于测试，这个过程中我们需要：手动创建虚拟机，然后下载安装包，然后搭建配置等，再加上其他的安装过程中的一些环境问题等，可能就几个小时过去了，这就不符合我们临时使用的场景需求了，而docker所提供环境一致性以及快速部署启动等优点，就完美的符合我们的使用场景。

![最小集群](images/cluster/image.png)
https://redis.io/docs/latest/operate/oss_and_stack/management/scaling/

鉴于官网建议的最小的集群为三主三从共六个节点的集群，至于为什么这样要求，可以看官网的解释，这里不再赘述。

## 配置文件

首先我们需要创建配置文件用于对Redis节点的特殊配置。

下面是一些简单的配置：

```
# redis端口号
port 6381
# 后台允许redis，由于我们是在docker中运行，所以不能让它后台运行
daemonize no
# 数据持久化，看情况考虑
appendonly yes
# 开启集群模式
cluster-enabled yes
# 集群配置文件
cluster-config-file nodes6381.conf
# 节点ping其他节点的超时时间
cluster-node-timeout 5000
# 该节点的外部访问ip，一般是宿主机的ip，如果不设置，集群拓扑结构中该节点的ip是docker内部容器的ip，外部无法访问
cluster-announce-ip 172.24.160.1
# 该节点的外部访问端口号
cluster-announce-port 6381
# 集群节点间通信端口，一般是访问端口号加10000
cluster-announce-bus-port 16381
```

我们可以通过shell脚本批量创建各个节点的配置文件：

```sh
#!/bin/bash

function createConfig() {
    echo "port 638$1
daemonize no
appendonly yes
cluster-enabled yes
cluster-config-file nodes638$1.conf
cluster-node-timeout 5000
cluster-announce-ip 172.24.160.1
cluster-announce-port 638$1
cluster-announce-bus-port 1638$1" > redis-cluster/redis-node-$1/redis.conf
}

nodes=6

for i in $(seq $nodes)
do
    mkdir -p redis-cluster/redis-node-$i
    createConfig $i
done
```

## Docker Compose

通过编写`docker-compose.yaml`文件来一次性的拉起六个节点的redis集群，这里我们创建了一个docker网络用于redis内部ip分配

```sh
docker network create --subnet=192.168.200.0/24 redis-net
```

```yaml
networks:
  redis-net:
    external:
      name: redis-net

services:
  redis-node-1:
    image: redis:7.2.3
    container_name: redis-node-1
    networks:
      redis-net:
        #   为节点分配静态ip
        ipv4_address: 192.168.200.11
    ports:
      # 开放端口
      - '6381:6381'
      - '16381:16381'
    command: ['redis-server', '/usr/local/etc/redis/redis.conf']
    # 引用我们的配置文件，以及持久化数据到本地磁盘
    volumes:
      - ./redis-cluster/redis-node-1/data:/data
      - ./redis-cluster/redis-node-1/redis.conf:/usr/local/etc/redis/redis.conf

  redis-node-2:
    image: redis:7.2.3
    container_name: redis-node-2
    networks:
      redis-net:
        ipv4_address: 192.168.200.12
    ports:
      - '6382:6382'
      - '16382:16382'
    command: ['redis-server', '/usr/local/etc/redis/redis.conf']
    volumes:
      - ./redis-cluster/redis-node-2/data:/data
      - ./redis-cluster/redis-node-2/redis.conf:/usr/local/etc/redis/redis.conf

  redis-node-3:
    image: redis:7.2.3
    container_name: redis-node-3
    networks:
      redis-net:
        ipv4_address: 192.168.200.13
    ports:
      - '6383:6383'
      - '16383:16383'
    command: ['redis-server', '/usr/local/etc/redis/redis.conf']
    volumes:
      - ./redis-cluster/redis-node-3/data:/data
      - ./redis-cluster/redis-node-3/redis.conf:/usr/local/etc/redis/redis.conf

  redis-node-4:
    image: redis:7.2.3
    container_name: redis-node-4
    networks:
      redis-net:
        ipv4_address: 192.168.200.14
    ports:
      - '6384:6384'
      - '16384:16384'
    command: ['redis-server', '/usr/local/etc/redis/redis.conf']
    volumes:
      - ./redis-cluster/redis-node-4/data:/data
      - ./redis-cluster/redis-node-4/redis.conf:/usr/local/etc/redis/redis.conf

  redis-node-5:
    image: redis:7.2.3
    container_name: redis-node-5
    networks:
      redis-net:
        ipv4_address: 192.168.200.15
    ports:
      - '6385:6385'
      - '16385:16385'
    command: ['redis-server', '/usr/local/etc/redis/redis.conf']
    volumes:
      - ./redis-cluster/redis-node-5/data:/data
      - ./redis-cluster/redis-node-5/redis.conf:/usr/local/etc/redis/redis.conf

  redis-node-6:
    image: redis:7.2.3
    container_name: redis-node-6
    networks:
      redis-net:
        ipv4_address: 192.168.200.16
    ports:
      - '6386:6386'
      - '16386:16386'
    command: ['redis-server', '/usr/local/etc/redis/redis.conf']
    volumes:
      - ./redis-cluster/redis-node-6/data:/data
      - ./redis-cluster/redis-node-6/redis.conf:/usr/local/etc/redis/redis.conf

  # 用于将redis节点加入集群，启动运行一次命令就退出了
  redis-cluster-create:
    image: redis:7.2.3
    container_name: redis-cluster-create
    networks:
      - redis-net
    # 运行命令将redis实例加入集群当中
    command:
      [
        'redis-cli',
        '--cluster',
        'create',
        '192.168.200.11:6381',
        '192.168.200.12:6382',
        '192.168.200.13:6383',
        '192.168.200.14:6384',
        '192.168.200.15:6385',
        '192.168.200.16:6386',
        '--cluster-replicas',
        '1',
        '--cluster-yes',
      ]
    # 等待所有redis节点都启动成功后运行
    depends_on:
      - redis-node-1
      - redis-node-2
      - redis-node-3
      - redis-node-4
      - redis-node-5
      - redis-node-6
```

## 查看集群

随便进入一个节点，运行`cluster nodes`查看集群节点情况，[CLUSTER NODES](https://redis.io/docs/latest/commands/cluster-nodes/)

```sh
127.0.0.1:6383> cluster nodes
be5f66cd0984746d7c31f16b60f8e9a083e88d50 172.24.160.1:6381@16381 master - 0 1736759246093 1 connected 0-5460
1b98644f6c68db0c9444f5344610ff355391afd5 172.24.160.1:6386@16386 slave 92f38ef0369622242c5f5f5eaa2aa39438c9b571 0 1736759246596 2 connected
2cbdada86a9566480f3c643c2df77249c9682fd6 172.24.160.1:6385@16385 slave be5f66cd0984746d7c31f16b60f8e9a083e88d50 0 1736759246093 1 connected
92f38ef0369622242c5f5f5eaa2aa39438c9b571 172.24.160.1:6382@16382 master - 0 1736759245592 2 connected 5461-10922
4ad0a22c82a9ff4aee9db875f33e06dac02e07d7 172.24.160.1:6384@16384 slave c8f91f94a2bcf1a3ac10fb8c5bba0614d362c54f 0 1736759244588 3 connected
c8f91f94a2bcf1a3ac10fb8c5bba0614d362c54f 172.24.160.1:6383@16383 myself,master - 0 1736759244000 3 connected 10923-16383
```
