import { DefaultTheme, defineConfig } from 'vitepress'
import mermaidPlugin from './script/mermaid'
import { sidebar } from './script/sidebar'

export default defineConfig({
  lang: 'zh-Hans',
  title: `whlit's blog`,
  head: [['link', { rel: 'icon', href: '/favicon.svg' }]],
  themeConfig: {
    logo: '/favicon.svg',
    search: {
      provider: 'local',
      options: {
        translations: {
          button: {
            buttonText: '搜索文档',
            buttonAriaLabel: '搜索文档',
          },
          modal: {
            footer: {
              selectText: '选择',
              navigateText: '切换',
              closeText: '关闭',
            },
            noResultsText: '无法找到结果',
            resetButtonTitle: '清除查询',
            displayDetails: '显示详情',
          },
        },
      },
    },
    nav: nav(),
    sidebar: sidebar(),
    socialLinks: [{ icon: 'github', link: 'https://github.com/whlit' }],

    lightModeSwitchTitle: '切换到浅色模式',
    darkModeSwitchTitle: '切换到深色模式',
    returnToTopLabel: '回到顶部',
    outline: {
      label: '页面导航',
    },
  },
  markdown: {
    config: (md) => {
      md.use(mermaidPlugin)
    },
  },
})

function nav(): DefaultTheme.NavItem[] {
  return [
    {
      text: '前端',
      items: [
        {
          text: 'Vue',
          link: '/vue/vite-ts-vue-electron-mysql',
          activeMatch: '/vue/',
        },
        { text: 'React', link: '/react/react', activeMatch: '/react/' },
      ],
    },
    {
      text: '后端',
      items: [
        { text: 'Java', link: '/java/spring-autowire', activeMatch: '/java/' },
        {
          text: 'Python',
          link: '/python/py-version-manger',
          activeMatch: '/python/',
        },
        { text: 'Go', link: '/go/multiple-main-function', activeMatch: '/go/' },
      ],
    },
    {
      text: '数据库',
      items: [
        { text: 'Mysql', link: '/mysql/mysql', activeMatch: '/mysql/' },
        { text: 'Neo4j', link: '/neo4j/cypher', activeMatch: '/neo4j/' },
        { text: 'Redis', link: '/redis/redis-cache', activeMatch: '/redis/' },
      ],
    },
    { text: 'Git', link: '/git/git', activeMatch: '/git/' },
    { text: 'Linux', link: '/linux/linux-command', activeMatch: '/linux/' },
    {
      text: '容器',
      items: [
        {
          text: 'Docker',
          link: '/docker/centos-outline-install-docker',
          activeMatch: '/docker/',
        },
      ],
    },
    {
      text: '其他',
      items: [{ text: 'Blog', link: '/blog/vitepress', activeMatch: '/blog/' }],
    },
  ]
}
