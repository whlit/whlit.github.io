---
title: Docker 部署 ElasticSearch + Kibana
layout: doc
outline: deep
---

# Docker 部署 ElasticSearch + Kibana

## 部署单节点es

### 创建网络

为了让 elasticsearch 和 kibana 联通起来，我们创建一个docker网络

```shell
docker network create es
```

### 创建逻辑卷

创建两个volume，用于数据及插件

```shell
docker volume create es-dev-data
docker volume create es-dev-plugins
```

### 部署单节点elastcisearch

这里我使用的版本是8.11.1，并且由于是本地开发学习使用，就禁用了xpack

```shell
docker run --name es-dev \
--network es \
-p 9200:9200 \
-e discovery.type=single-node \
-e ES_JAVA_OPTS="-Xms1g -Xmx1g" \
-e xpack.security.enabled=false \
-v es-dev-data:/usr/share/elasticsearch/data \
-v es-dev-plugins:/usr/share/elasticsearch/plugins \
-d elasticsearch:8.11.1
```

### 部署kibana

使用和es一样版本的kibana，并且加入相同的网络后可以直接使用容器的名字来连接网络

```shell
docker run --name kibana \
--network es \
-p 5601:5601 \
-e ELASTICSEARCH_HOSTS=http://es-dev:9200 \
-d kibana:8.11.1
```
