---
title: Vite + React + TypeScript + ESLint + Prettier
---

# Vite + React + TypeScript + ESLint + Prettier

## ESLint 安装

- 首先安装eslint，然后通过生成eslint配置文件，生成`.eslintrc.js`文件，

`pnpm add -D eslint eslint-plugin-react-hooks eslint-plugin-react-refresh`

如果是用的vite创建的项目默认会安装

- 安装eslint对ts解析的插件

`pnpm add -D @typescript-eslint/eslint-plugin @typescript-eslint/parser`

## Prettier 安装

`pnpm add -D prettier`

- 配置prettier

在项目的根目录下创建`.prettierrc.js`或者`.prettierrc.yaml`或者`.prettierrc.json`文件，有多种格式，这里以`.prettierrc.yaml`为例

```yaml
# 使用单引号
singleQuote: true
# 结尾使用分号
semi: false
# 每行最多100个字符
printWidth: 100
# 在多行分隔符时，尾随逗号
trailingComma: none
# 缩进2个空格
tabWidth: 2
# 使用tab缩进
useTabs: false
# jsx使用单引号
jsxSingleQuote: true
# 换行符
endOfLine: 'lf'
```

更多规则可以在[Prettier官网](https://prettier.io/docs/en/options.html)查看

- 配置忽略文件`.prettierignore`

```
out
dist
pnpm-lock.yaml
tsconfig.json
tsconfig.*.json
```

## 整合eslint和prettier

安装依赖

`pnpm add -D eslint-config-prettier eslint-plugin-prettier`

- 配置`.eslintrc.cjs`文件

```js
module.exports = {
  root: true, // 指定这是根配置文件，用于定义javascript或者Typescript项目中的代码质量和风格的规则。
  env: { browser: true, es2020: true }, // 指定代码的运行环境
  extends: [
    // 这里是越靠后的插件配置优先级越高
    'eslint:recommended', // eslint默认规则
    'plugin:@typescript-eslint/recommended', // Typsscript推荐规范
    'plugin:react-hooks/recommended', // React Hooks推荐规范
    'plugin:prettier/recommended', // 集成Prettier插件规范
  ],
  ignorePatterns: ['dist', '.eslintrc.cjs'], // 忽略文件
  parser: '@typescript-eslint/parser', // 指定的解析器
  plugins: ['react-refresh'], // 支持React的热刷新
  rules: {
    'prettier/prettier': 'error', // 违反prettier的规则，将产生一个错误
    'react-refresh/only-export-components': ['warn', { allowConstantExport: true }], // 配置React热刷新的规则，允许常量到导出
  },
}
```

- 添加格式化命令

在`package.json`中添加

```json
{
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "lint": "eslint . --ext ts,tsx --report-unused-disable-directives --max-warnings 0", // [!code focus]
    "preview": "vite preview",
    "format": "prettier --write ." // [!code focus]
  }
}
```
