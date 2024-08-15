import { DefaultTheme } from 'vitepress'
import { glob } from 'glob'
import matter from 'gray-matter'

export function sidebar(paths: string[]): DefaultTheme.SidebarMulti {
  const sidebar = {}
  glob.sync('docs/**/*.md').forEach((file) => {
    // 替换斜杠，统一分割符为‘/’
    file = file.replace(/\\/g, '/')
    // 获取链接路径
    const link = file.replace('docs', '').replace('.md', '')
    // 获取分组
    let path = ''
    for (const p of paths) {
      if (link.startsWith(p)) {
        path = p
        break
      }
    }
    // 如果没有匹配到分组，则不处理
    if (!path) return

    sidebar[path] = sidebar[path] || []
    // 读取frontmatter，从中获取title
    const { data } = matter.read(file)
    // 获取文件名，例如：'vitepress.md' => 'vitepress'
    sidebar[path].push({
      text: data.title || link.split('/').pop(), // 如果没有title，则使用文件名
      link: link,
    })
  })
  return sidebar
}
