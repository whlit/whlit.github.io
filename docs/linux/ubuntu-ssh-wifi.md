---
title: Ubuntu 远程SSH连接wifi
---

# Ubuntu 远程SSH连接wifi

## 列出搜索到的wifi

```sh
sudo nmcli device wifi
```

## 连接wifi

```sh
sudo nmcli device wifi connect "wifi_name" password "wifi_password"
```

对于已经保存过密码的wifi可以不用输入密码

```sh
sudo nmcli device wifi connect "wifi_name"
```

## 参考

- [Ubuntu ssh远程命令行配置WiFi连接](https://blog.csdn.net/weixin_45392081/article/details/120745506)
