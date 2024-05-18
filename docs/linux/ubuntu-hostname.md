---
title: Ubuntu 修改主机名
---

# Ubuntu 修改主机名

## 临时修改

直接使用hostname+新主机名即可

```bash
hostname new-hostname
```

## 永久修改

修改`/etc/hostname`文件中的内容即可

```bash
sudo vim /etc/hostname
```

重启系统即可看到主机名称已经修改

## 参考

- [Ubuntu查看并修改主机名的方法](https://www.cnblogs.com/lzyws739307453/p/12909717.html)
