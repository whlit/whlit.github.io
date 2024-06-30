---
title: 'GitHub Actions 自动构建发布Release'
layout: doc
outline: deep
---

# GitHub Actions 自动构建发布Release

在GitHub上的项目想要发布一个Release版本的包，一般是通过手动创建一个Release，然后手动上传Release包。

## 使用GitHub Actions自动构建

在根目录下创建`.github/workflows/deploy.yml`文件名称可以自定义

```yml
name: release # 任务名称

on: # 触发条件
  push: # 在push时触发
    tags: # 标签  这里标识在push tag时触发
      - 'v*' # 以v开头的版本

jobs: # 任务
  build: # 任务ID
    runs-on: windows-latest # 运行环境 此处为windows环境，可根据实际情况选择
    steps:
      - uses: actions/checkout@v4 # 检出代码

      - name: Set up Go # 安装go 安装构建所需的环境 此处为go项目所以安装的go，如果为node项目则安装node，npm等
        uses: actions/setup-go@v4
        with: # 这里是actions中支持的参数
          go-version-file: 'src/go.mod' # go.mod文件
          cache-dependency-path: 'src/go.sum'

      - name: Build # 构建
        run: ./build.bat # 运行的命令 根据实际情况修改
```

添加以上工作流，会在每次push时自动执行构建，此时我们有了构建好的Release包。

## 使用GitHub Actions自动发布

在上面的工作流中添加后续上传的步骤

```yml
- name: Upload # 上传
  uses: softprops/action-gh-release@v2 # 使用第三方actions 上传
  if: startsWith(github.ref, 'refs/tags/') # 仅在tag时上传
  with:
    files: dist/env-manage.7z # 上传的文件
```

## 链接

- [GitHub Actions 工作流语法](https://docs.github.com/zh/actions/using-workflows/workflow-syntax-for-github-actions)
- [action-gh-release 自动上传Release](https://github.com/softprops/action-gh-release)
