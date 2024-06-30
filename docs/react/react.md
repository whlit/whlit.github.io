---
title: React 相关
layout: doc
outline: deep
---

# React 相关

### 列表渲染中key的位置

列表项的key是写在组件本身上的，不是组件内部返回的标签上

:::info
**注意这里的 key 是写在 `<Recipe>` 组件本身上的，不要写在 Recipe 内部返回的 `<div>` 上。** 这是因为 key 只有在就近的数组上下文中才有意义。之前的写法里，我们生成了一个 `<div>` 的数组所以其中的每一项需要一个 key，但是现在的写法里，生成的实际上是 `<Recipe>` 的数组。换句话说，在提取组件的时候，key 应该写在复制粘贴的 JSX 的外层组件上
----摘自react官网
:::

Link: [列表渲染](https://zh-hans.react.dev/learn/rendering-lists)

### Fragment

当需要将多个元素包装成单个元素但又不想影响DOM，可以使用`<Fragment></Fragment>`包裹起来，大多数情况可以简写为`<></>`，因为Fragment只有一个key作为参数，而<>无法使用key参数，所以必须使用Fragment
Link:[Fragment](https://zh-hans.react.dev/reference/react/Fragment#fragment)
Fragment的示例

```jsx
function Demo(){
  return (
    <Fragment>
      <h1>Demo</h1>
      <p>This is a Demo</p>
    <Fragment/>
  )
}
```

`<>`的示例

```jsx
function Demo() {
  return (
    <>
      <h1>Demo</h1>
      <p>This is a Demo</p>
    </>
  )
}
```

渲染列表

```jsx
function Demo(){
  return data.map(item =>
  	<Fragment key={item.id}>
      <h1>{item.name}</h1>
      <p>This is a Demo</p>
    <Fragment/>
  )
}
```
