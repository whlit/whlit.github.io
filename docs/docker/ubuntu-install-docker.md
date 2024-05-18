---
title: Ubuntu 安装 Docker
---

# Ubuntu 安装 Docker

## 清理旧版本

```sh
for pkg in docker.io docker-doc docker-compose docker-compose-v2 podman-docker containerd runc; do sudo apt-get remove $pkg; done
```

## 设置docker存储库

```sh
# Add Docker's official GPG key:
sudo apt-get update
sudo apt-get install ca-certificates curl
sudo install -m 0755 -d /etc/apt/keyrings
sudo curl -fsSL https://download.docker.com/linux/ubuntu/gpg -o /etc/apt/keyrings/docker.asc
sudo chmod a+r /etc/apt/keyrings/docker.asc

# Add the repository to Apt sources:
echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.asc] https://download.docker.com/linux/ubuntu \
  $(. /etc/os-release && echo "$VERSION_CODENAME") stable" | \
  sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
sudo apt-get update
```

## 安装Docker

::: code-group

```sh [最新版本]
sudo apt-get install docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
```

```sh [指定版本]
# 查询可用的版本
$ apt-cache madison docker-ce | awk '{ print $3 }'

5:26.1.0-1~ubuntu.24.04~noble
5:26.0.2-1~ubuntu.24.04~noble
...

# 安装指定版本
$ VERSION_STRING=5:26.1.0-1~ubuntu.24.04~noble
$ sudo apt-get install docker-ce=$VERSION_STRING docker-ce-cli=$VERSION_STRING containerd.io docker-buildx-plugin docker-compose-plugin
```

:::

## 参考

- [在 Ubuntu 上安装 Docker](https://docs.docker.com/engine/install/ubuntu/)
