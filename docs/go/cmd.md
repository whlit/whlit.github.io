---
title: Go 执行CMD命令
layout: doc
outline: deep
---

# Go 执行CMD命令

go中执行命令的库是`os.exec`

```go
func main() {
    cmd := exec.Command("cd", "work")
    err := cmd.Run()
    if err != nil {
        fmt.Println(err)
    }
}
```

如果需要获取执行命令的输出，可以使用`Stdout`和`Stderr`

```go
func main() {
    cmd := exec.Command("cd", "work")
    var stdout, stderr bytes.Buffer
    cmd.Stdout = &stdout
    cmd.Stderr = &stderr
    err := cmd.Run()
    fmt.Println(stdout.String(), stderr.String())
    if err != nil {
        fmt.Println(err)
    }
}
```
