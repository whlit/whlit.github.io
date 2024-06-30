---
title: Vue3与Vue2
layout: doc
outline: deep
---

# Vue3与Vue2

## 获取dom元素

### 使用ref获取

```vue
<template>
  <div ref="testDiv">测试用div</div>
</template>
<script>
import { ref } from 'vue'

export default {
  name: 'test',
  setup() {
    const testDiv = ref(null)
    return {
      testDiv,
    }
  },
}
</script>
```

### vue2中使用ref获取

```vue
<template>
  <div ref="testDiv">测试用div</div>
</template>
<script>
export default {
  name: 'test',
  mounted() {
    console.log(this.$refs.testDiv)
  },
}
</script>
```
