import { DefaultTheme } from 'vitepress'
import { glob } from 'glob'
import matter from 'gray-matter'

export function sidebar(): DefaultTheme.SidebarMulti {
  const sidebar = {}
  glob.sync('docs/**/*.md').forEach((file) => {
    // 替换斜杠，统一分割符为‘/’
    file = file.replace(/\\/g, '/')
    const paths = file.match(/\/.+\//g)
    // 不存在文件夹，说明是docs下的文件，一般是index.md，不做处理
    if (!paths) return
    // 匹配到多个文件夹路径，有异常存在
    if (paths.length > 1) {
      console.log('ERROR: More than one path in', file)
      return
    }
    // 获取分组路径，例如：'docs/blog/vitepress.md' => '/blog/'
    const path = paths[0]
    sidebar[path] = sidebar[path] || { base: path, items: [] }
    // 读取frontmatter，从中获取title
    const { data } = matter.read(file)
    // 获取文件名，例如：'vitepress.md' => 'vitepress'
    const link = file.split('/').pop()?.split('.')[0]
    sidebar[path].items.push({
      text: data.title || link, // 如果没有title，则使用文件名
      link: link,
    })
  })
  return sidebar
}
