---
title: Go JSON解析
layout: doc
---

# Go JSON解析

go内置了json格式的编码和解码

## 标识结构体字段

通过FieldTag标识结构体字段和json字段的映射关系

```go
type User struct {
    Name string `json:"name"`
    Age  int    `json:"age"`
}
type Company struct {
    Leader   User   `json:"leader"`
    Employee []User `json:"employee"`
}
var jsonStr = `{"leader":{"name":"kuba","age":18},"employee":[{"name":"bob","age":18},{"name":"alice","age":18}]}`
func main() {
    // 解析json
    var company Company
    err := json.Unmarshal([]byte(jsonStr), &company)
    if err != nil {
        fmt.Println(err)
        return
    }
    fmt.Println(company)
    // 序列化json
    jsonStr2, err := json.Marshal(company)
    if err != nil {
        fmt.Println(err)
        return
    }
    fmt.Println(string(jsonStr2))
}
```
