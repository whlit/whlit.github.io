---
title: '重装系统，软件记录'
---

# 重装系统，软件记录

记录下个人电脑环境所用到的比较好用、重要、必要的软件，当需要重新安装系统时，可以一次性尽可能的恢复原有的环境。

## 软件列表

| 软件名称                                                                      | 介绍             | 是否免费    | 下载地址                                                                                       |
| ----------------------------------------------------------------------------- | ---------------- | ----------- | ---------------------------------------------------------------------------------------------- |
| [7-Zip](https://www.7-zip.org/)                                               | 压缩工具         | 免费        | [下载](https://www.7-zip.org)                                                                  |
| [Git](https://git-scm.com/)                                                   | 版本控制         | 免费        | [下载](https://git-scm.com/downloads)                                                          |
| [JDK](https://www.oracle.com/java/)                                           | Java 开发环境    | 免费        | [下载](https://www.oracle.com/java/technologies/downloads/)                                    |
| [Go](https://go.dev/)                                                         | Go 开发环境      | 免费        | [下载](https://go.dev/dl/)                                                                     |
| [nvm](https://github.com/nvm-sh/nvm)                                          | Node.js 管理工具 | 免费        | [下载](https://github.com/nvm-sh/nvm) \| [nvm-win](https://github.com/coreybutler/nvm-windows) |
| [pyenv](https://github.com/pyenv/pyenv)                                       | Python 管理工具  | 免费        | [下载](https://github.com/pyenv/pyenv) \| [pyenv-win](https://github.com/pyenv-win/pyenv-win)  |
| [Visual Studio Code](https://code.visualstudio.com/)                          | 开发编辑器       | 免费        | [下载](https://code.visualstudio.com)                                                          |
| [Photoshop](https://www.adobe.com/cn/products/photoshop.html)                 | 图片处理         | 付费        | 网盘中                                                                                         |
| [Apache Maven](https://maven.apache.org/)                                     | Java 构建工具    | 免费        | [下载](https://maven.apache.org/download.cgi)                                                  |
| [Gradle](https://gradle.org/)                                                 | Java 构建工具    | 免费        | [下载](https://gradle.org/releases/)                                                           |
| [Everything](https://www.voidtools.com/zh-cn/)                                | 本地文件搜索工具 | 免费        | [下载](https://www.voidtools.com/zh-cn/)                                                       |
| [Typora](https://typora.io/)                                                  | Markdown 编辑器  | 收费        | [下载](https://typora.io/)                                                                     |
| [Idea](https://www.jetbrains.com/idea/)                                       | 开发编辑器       | 收费/社区版 | [下载](https://www.jetbrains.com/idea/download/#section=windows)                               |
| [IDM](https://www.internetdownloadmanager.com/)                               | 下载工具         | 收费        | 网盘中                                                                                         |
| [Navicat Premium](https://www.navicat.com.cn/)                                | 数据库管理工具   | 收费        | [下载](https://www.navicat.com.cn/products/navicat-premium/)                                   |
| [PotPlayer](https://potplayer.daum.net/)                                      | 视频播放器       | 免费        | [下载](https://potplayer.daum.net/)                                                            |
| [Snipaste](https://www.snipaste.com/)                                         | 截图工具         | 免费        | [下载](https://www.snipaste.com/)                                                              |
| [Thunderbird](https://www.thunderbird.net/)                                   | 邮件客户端       | 免费        | [下载](https://www.thunderbird.net/)                                                           |
| [VMware Workstation](https://www.vmware.com/cn/products/workstation-pro.html) | 虚拟机           | 收费        | [下载](https://www.vmware.com/cn/products/workstation-pro.html)                                |
| [Docker Desktop](https://www.docker.com/)                                     | 容器管理工具     | 免费        | [下载](https://www.docker.com/products/docker-desktop/)                                        |
| [wsl](https://docs.microsoft.com/zh-cn/windows/wsl/install)                   | Win的Linux子系统 | 免费        | [下载](https://docs.microsoft.com/zh-cn/windows/wsl/install)                                   |
| [Xftp](https://www.xshell.com/zh/xftp/)                                       | 文件传输工具     | 免费        | 邮箱中链接                                                                                     |
| [Xshell](https://www.xshell.com/zh/xshell/)                                   | SSH 客户端       | 免费        | 邮箱中链接                                                                                     |
| [向日葵](https://sunlogin.oray.com/)                                          | 远程桌面         | 免费        | [下载](https://sunlogin.oray.com/)                                                             |
| [蒲公英](https://pgy.oray.com/)                                               | 异地组网         | 免费        | [下载](https://pgy.oray.com/)                                                                  |
| [百度网盘](https://pan.baidu.com)                                             | 存储             | 免费        | [下载](https://pan.baidu.com/download)                                                         |
| [字由](https://www.hellofont.cn/)                                             | 一些免费字体     | 免费        | [下载](https://www.hellofont.cn/)                                                              |

## 环境配置

### Git 配置

```bash
git config --global user.name "your name"
git config --global user.email "your email"
```

### 环境变量

```powershell
[Environment]::SetEnvironmentVariable('JAVA_HOME', 'D:\\soft\\java\\jdk21', 'Machine')
[Environment]::SetEnvironmentVariable('M2_HOME', 'D:\\soft\\apache-maven-3.9.4', 'Machine')
[Environment]::SetEnvironmentVariable('PATH', $env:PATH + ';%M2_HOME%\bin;%JAVA_HOME%\bin', 'Machine')
```
