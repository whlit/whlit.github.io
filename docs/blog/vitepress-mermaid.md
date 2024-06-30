---
title: VitePress 支持 Mermaid
layout: doc
outline: deep
---

# VitePress 支持 Mermaid

VitePress 的Markdown渲染是用的 `markdown-it`，所以可以通过自定义插件来支持Mermaid。

这里使用`markdown-it`插件来转换Mermaid代码块为vue组件，然后在vue组件中调用mermaid渲染代码为svg。

### 定义插件

- markdown-it 插件函数：`(md: MarkdownIt) => void`

```ts
import type MarkdownIt from 'markdown-it'

export default function mermaidPlugin(md: MarkdownIt): void {
  // 保存原有的 fence 函数
  const fence = md.renderer.rules.fence?.bind(md.renderer.rules)
  // 定义我们自己的 fence 函数
  md.renderer.rules.fence = (tokens, idx, options, env, self) => {
    // 通过tocken上的 info 获取代码块的语言
    const token = tokens[idx]
    const language = token.info.trim()

    if (language.startsWith('mermaid')) {
      // 将代码块渲染成 html，这里替换成我们自己定义的vue组件
      return `<Mermaid id="mermaid-${idx}" code="${encodeURIComponent(token.content)}"></Mermaid>`
    }
    // 对不是我们需要的代码块的直接调用原有的函数
    return fence(tokens, idx, options, env, self)
  }
}
```

### 定义Vue组件

定义一个vue组件用于渲染mermaid代码

```vue
<template>
  <div v-html="svgRef"></div>
</template>
<script setup ts>
import { ref, onMounted } from 'vue'
import { render } from '../docs/.vitepress/script/mermaid'

const props = defineProps({
  id: String,
  code: String,
})

const render = async (id, code) => {
  // mermaid 初始化
  mermaid.initialize({ startOnLoad: false })
  const { svg } = await mermaid.render(id, code)
  return svg
}
// 在组件挂载后进行mermaid渲染
onMounted(async () => {
  svgRef.value = await render(props.id, decodeURIComponent(props.code))
})

const svgRef = ref('')
</script>
```

### Vitepress使用Vue组件

在`.vitepress/theme/index.ts`中声明全局组件

```ts
import type { Theme } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
import Mermaid from '../../../components/Mermaid.vue'

export default <Theme>{
  extends: DefaultTheme,
  enhanceApp: async ({ app }) => {
    app.component('Mermaid', Mermaid)
  },
}
```

### 使用插件

在`.vitepress/config.ts`中引入插件

```ts
import mermaidPlugin from './script/mermaid'

export default defineConfig({
  markdown: {
    config: (md) => {
      md.use(mermaidPlugin)
    },
  },
})
```
