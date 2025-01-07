---
title: Go 切片
---

# Go 切片

在Go中，切片(Slice)是一种可以动态更改其长度的数组，其长度的增长是通过`append`函数实现的，缩小是通过对切片的切割实现。

## 切片的声明和初始化

- 使用数组字面量

```go
s := []string{"hello", "world"}
```

- 使用`make`函数

```go
s := make([]string, len, cap)
```

- 通过现有的数组或者切片

```go
arr := [2]string{"hello", "world"}
s := arr[0:1]
```

## 切片的扩容

当向切片使用`append`函数追加元素时，如果追加后长度超过了容量，则会自动分配一个更大的数组，并复制元素到新的数组

```go
s := make([]string)
s = append(s, "hello", "world")
fmt.Println(s, len(s), cap(s)) // [hello world] 2 2
s = append(s, "hello", "china")
fmt.Println(s, len(s), cap(s)) // [hello world hello china] 4 4
```

## 切片的引用

当我们通过一个切片的分割来初始化另一个切片时，其实go并没有创建一个新的数组来存放内容，而是创建了一个指向原有切片数组内存的指针，我们对该其中一个切片进行修改时，会影响到另一个，但是当切片进行扩容时，此时该切片就指向了另一个新的数组，这样两个切片就不会彼此影响了

::: code-group

```go [main]
func main() {
	s1 := []string{"h", "e", "l", "l", "o"}
	fmt.Println(s1) // [h e l l o]
	s2 := s1[1:3]
	fmt.Println(s2) // [e l]
	s1[1] = "W"
	fmt.Println(s1, s2) // [h W l l o] [W l]
	s1 = append(s1, "w", "o", "r", "l", "d")
	fmt.Println(s1, s2) // [h W l l o w o r l d] [W l]
	s1[1] = "e"
	fmt.Println(s1, s2) // [h e l l o w o r l d] [W l]
}
```

```go [slice]
type slice struct {
	array unsafe.Pointer
	len   int
	cap   int
}
```

:::

![slice-append](images/slice/slice-append.excalidraw.svg)
