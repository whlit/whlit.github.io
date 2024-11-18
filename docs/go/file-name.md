---
title: Go 构建约束
layout: doc
outline: deep
---

# Go 构建约束

[构建约束(构建标签)](https://pkg.go.dev/cmd/go#hdr-Build_constraints)是用于标注该文件是否应该包含在包中，不仅仅是GO文件，构建约束需要在文件的开始行的注释中给出，例如：

```go
//go:build (linux && 386) || (darwin && !cgo)
```

在1.16及之前的版本中，构建约束的格式为`// +build`，之后的版本中遇到旧的语法时，gofmt会将等效的格式转换为`//go:build`

```go
//go:build (linux && 386) || (darwin && !cgo)
// +build linux,386 darwin,!cgo
```

## 常用的构建标签

一个文件只能有一个构建约束行，可以包含`||`、`&&`、`!`以及括号组成约束表达式

### 操作系统

设置目标操作系统，只有符合构建标签的文件才会被包含进去，比较的对象是`runtime.GOOS`

::: code-group

```go [Linux]
// +build linux

package main

// 其他代码
```

```go [非Windows系统]
// +build !windows

package main

// 其他代码
```

```go [Linux或Windows]
// +build linux windows

package main

// 其他代码
```

:::

### 架构

设置目标架构，只有符合构建标签的文件才会被包含进去，比较的对象是`runtime.GOARCH`

::: code-group

```go [amd64]
// +build amd64

package main

// 其他代码
```

```go [386]
// +build 386

package main

// 其他代码
```

:::

### Go版本

可以添加最低支持的Go版本

::: code-group

```go [Go1.18]
// +build go1.18

package main

// 其他代码
```

:::

### 排除

可以使用`ignore`来将文件排除在任何构建之外，当然你也可以使用其他未定义的构建标签，毕竟匹配不了就不会被包含在内了

::: code-group

```go [main.go]
//go:build ignore

package main

// 其他代码
```

:::

## 文件后缀

文件名去除扩展名以及`_test`后的文件名也可以用来匹配构建约束，但只可以匹配三种：

- `*_GOOS`: 匹配操作系统
- `*_GOARCH`: 匹配架构
- `*_GOOS_GOARCH`: 匹配操作系统和架构，顺序不可颠倒

例如以下两种方式是等效的：

::: code-group

```go [main_linux_amd64.go]
package main

// 其他代码
```

```go [main.go]
//go:build linux && amd64

package main

// 其他代码
```

:::

当有后缀的文件与文件中添加的构建约束注释冲突时会以构建约束的注释为准。
