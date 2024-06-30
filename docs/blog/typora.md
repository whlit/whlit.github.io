---
title: 免激活使用Typora
---

# 免激活使用Typora

## 下载安装Typora

从官网下载最新版本的typora并安装。

[Typora](https://typora.io/)

## 激活Typora

- 找到Typora安装目录，找到license文件

`Typora\resources\page-dist\static\js\LicenseIndex.***.chunk.js`

修改文件中`e.hasActivated="true"==e.hasActivated`为`e.hasActivated="true"=="true"`

- 关闭已激活弹窗

`resources\page-dist\license.html`

在`</body></html>`中间添加

`<script>window.onload=function(){setTimeout(()=>{window.close();},5);}</script>`

- 去除未激活提示

`resources\locales\zh-Hans.lproj\Panel.json`

修改文件中`"UNREGISTERED":"未激活"`为`"UNREGISTERED":""`
