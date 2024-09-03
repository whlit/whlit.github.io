---
title: Windows 默认文件夹
layout: doc
outline: deep
---

# Windows 默认文件夹

在Windows系统中，有一些具有特殊意义的文件夹，他们在安装完Windows系统后默认就已经存在了比如：

| 名称    | 路径                           | 描述          |
| ------- | ------------------------------ | ------------- |
| 桌面    | C:\Users\<user_name>\Desktop   | 桌面文件夹    |
| 下载    | C:\Users\<user_name>\Downloads | 下载文件夹    |
| 文档    | C:\Users\<user_name>\Documents | 文档文件夹    |
| AppData | C:\Users\<user_name>\AppData   | AppData文件夹 |

这些文件夹都在C盘中，我们在使用Windows的过程中，很多时候都会使用到它们，例如在桌面放常用的文件，浏览器下载文件默认直接放入Downloads文件夹中，程序运行过程中的配置文件等都会放到AppData文件夹下。

这样时间长了C盘的占用会越来越大，尤其是我们一般会将磁盘分区，C盘就不会分配很大的空间，时间长了C盘满了没有地方存放更多的东西，C盘的文件想删又很多不敢删。

所以让这些文件夹的迁移到别的盘上就很重要了，这里提供两种方式来实现。

- 在文件夹的属性》位置》移动，设置路径到新的地址。

![move](images/windows-dirs/image.png)

- 直接修改注册表，这些默认的文件夹软件中使用的时候都是直接读取注册表来获取路径。

1. 打开注册表修改器，`win + r` 打开运行输入 `regedit` 进入注册表修改器
2. 在`HKEY_CURRENT_USER\Software\Microsoft\Windows\CurrentVersion\Explorer\User Shell Folders`下就有常用的一些文件夹的路径配置。
3. 如果你想要修改的文件夹没有在上面配置，可以在`HKEY_LOCAL_MACHINE\SOFTWARE\Microsoft\Windows\CurrentVersion\Explorer\FolderDescriptions`下找到对应的注册表项的，然后在上面的`HKEY_CURRENT_USER\Software\Microsoft\Windows\CurrentVersion\Explorer\User Shell Folders`下添加对应的配置项即可。
