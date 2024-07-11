---
title: 使用 simple-git-hooks 进行提交前格式化
layout: doc
---

# 使用 simple-git-hooks 进行提交前格式化

simple-git-hooks 是一个简单的 git hooks 的集成工具，它具有零依赖、配置简单、轻量级等特点。

## 安装

::: code-group

```sh [npm]
$ npm i -D simple-git-hooks
```

```sh [pnpm]
$ pnpm i -D simple-git-hooks
```

```sh [yarn]
$ yarn add -D simple-git-hooks
```

:::

## 配置

在 `package.json` 中添加 `simple-git-hooks` 配置

```json
{
  "scripts": {
    "docs:dev": "vitepress dev",
    "docs:build": "vitepress build",
    "docs:preview": "vitepress preview",
    "format": "prettier --write ."
  },
  "devDependencies": {
    "lint-staged": "^15.2.7",
    "prettier": "^3.2.5",
    "simple-git-hooks": "^2.11.1",
    "vitepress": "^1.0.1"
  },
  "simple-git-hooks": {
    // [!code focus]
    "pre-commit": "pnpm lint-staged" // [!code focus]
  }, // [!code focus]
  "lint-staged": {
    "*": "prettier --write --ignore-unknown"
  }
}
```

## 更新 Git hooks

运行cli脚本来将hooks命令更新到git hooks中

::: code-group

```sh [npm]
$ npx simple-git-hooks
```

```sh [pnpm]
$ pnpm simple-git-hooks
```

```sh [yarn1]
$ ynpx simple-git-hooks
```

```sh [yarn2]
$ yarn dlx simple-git-hooks
```

:::

## 结合 prettier 和 lint-staged 使用

prettier 是一个代码格式化工具，用于格式化代码。lint-staged 是一个只对暂存区的文件执行命令的工具。

- 安装prettier

prettier的安装配置可以参照[Vite + React + TypeScript + ESLint + Prettier](/react/vite-react-ts-eslint-prettier)

- 安装lint-staged

::: code-group

```sh [npm]
$ npm i -D lint-staged
```

```sh [pnpm]
$ pnpm i -D lint-staged
```

```sh [yarn]
$ yarn add -D lint-staged
```

:::

- 配置lint-staged

在 `package.json` 中添加 `lint-staged` 配置

```json
{
  "scripts": {
    "docs:dev": "vitepress dev",
    "docs:build": "vitepress build",
    "docs:preview": "vitepress preview",
    "format": "prettier --write ."
  },
  "devDependencies": {
    "lint-staged": "^15.2.7",
    "prettier": "^3.2.5",
    "simple-git-hooks": "^2.11.1",
    "vitepress": "^1.0.1"
  },
  "simple-git-hooks": {
    "pre-commit": "pnpm lint-staged"
  },
  "lint-staged": {
    // [!code focus]
    "*": "prettier --write --ignore-unknown" // [!code focus]
  } // [!code focus]
}
```

也可以针对文件类型进行配置

```json
{
  "lint-staged": {
    "*.js": "eslint",
    "*.{ts,tsx}": ["eslint --fix", "prettier --write"],
    "*.md": "prettier --write",
    "!(*.js|*.ts|*.md)": "prettier --write"
  }
}
```

## 提交不生效

如果之前使用的是husky，现在使用simple-git-hooks不生效，可能是因为husky修改了`core.hooksPath`的值。

```sh
$ git config core.hooksPath
```

使用上面的命令查询当前git仓库的hooks路径，如果目录不是`.git/hooks`，则需要修改。

```sh
$ git config core.hooksPath ./.git/hooks
```

## 链接

- [simple-git-hooks](https://github.com/toplenboren/simple-git-hooks)
- [lint-staged](https://github.com/lint-staged/lint-staged)
- [prettier](https://prettier.io/)
