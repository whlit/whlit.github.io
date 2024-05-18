---
title: Ubuntu 修改DNS
---

# Ubuntu 修改DNS

在远程连接Ubuntu桌面系统时，发现无法解析域名的问题，通过修改DNS解决。

修改`/etc/NetworkManager/system-connections/有线连接 1.nmconnection`文件，将`dns=`修改为`dns=8.8.8.8`。

```
[connection]
id=有线连接 1
uuid=cd98d986-2cac-3393-b6ab-a41752d7579d
type=ethernet
autoconnect-priority=-999
interface-name=enp3s0

[ethernet]

[ipv4]
address1=192.168.9.2/24,192.168.9.1
method=manual
dns=8.8.8.8

[ipv6]
addr-gen-mode=stable-privacy
method=auto

[proxy]
```

重启网络管理`sudo systemctl restart NetworkManager`

## 参考

- [Ubuntu22.04Desktop桌面版设置静态Ip](https://blog.csdn.net/kfepiza/article/details/127348964)
