---
title: Go YAML解析
layout: doc
outline: deep
---

# Go YAML解析

go对于yaml格式的编码和解码可以通过`gopkg.in/yaml.v3`包。

```sh
go get -u gopkg.in/yaml.v3
```

使用方式与JSON类似。通过FieldTag标识结构体字段和yaml字段的映射关系

```go
type User struct {
    Name string `yaml:"name"`
    Age  int    `yaml:"age"`
}
type Company struct {
    Leader   User   `yaml:"leader"`
    Employee []User `yaml:"employee"`
}
var yamlStr = `leader:
  name: kuba
  age: 18
employee:
  - name: bob
    age: 18
  - name: alice
    age: 18
`
func main() {
    // 解析yaml
    var company Company
    err := yaml.Unmarshal([]byte(yamlStr), &company)
    if err != nil {
        fmt.Println(err)
    }
    fmt.Println(company)
    // 序列化yaml
    yamlBytes, err := yaml.Marshal(company)
    if err != nil {
        fmt.Println(err)
    }
    fmt.Println(string(yamlBytes))
}
```
