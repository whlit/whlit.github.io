import { DefaultTheme } from 'vitepress'
import { glob } from 'glob'
import matter from 'gray-matter'
import fs from 'fs-extra'

const updateTimes = fs.readJSONSync('cache/timestamp.json')

export function getSidebar(root: string, path: string): DefaultTheme.SidebarItem[] {
  const sidebar: { text: string; link: string; timestamp: number }[] = []

  root = root
    .replace(/\\/g, '/') // 统一分割符为‘/’
    .replace(/\/{2,}/g, '/') // 去掉多余的斜杠
    .replace(/^\/+|\/+$/g, '') // 去掉头尾的斜杠
  path = path
    .replace(/\\/g, '/')
    .replace(/\/{2,}/g, '/')
    .replace(/^\/+|\/+$/g, '')

  glob.sync(`${root}/${path}/**/*.md`).forEach((file) => {
    // 替换斜杠，统一分割符为‘/’
    file = file.replace(/\\/g, '/')
    // 获取链接路径
    const link = file.substring(root.length + 1, file.length - 3)
    // 读取frontmatter，从中获取title
    const { data } = matter.read(file)

    sidebar.push({
      text: data.title || link.split('/').pop(), // 如果没有title，则使用文件名
      link: link,
      timestamp: updateTimes[file],
    })
  })
  return sidebar.sort((a, b) => b.timestamp - a.timestamp)
}
