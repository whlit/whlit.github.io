import { DefaultTheme, defineConfig } from 'vitepress'
import mermaidPlugin from './script/mermaid'
import { getSidebar } from './script/sidebar'
import { navbar } from './script/navbar'

const SORUCE_DIR = 'docs'

export default defineConfig({
  lang: 'zh-CN',
  title: `whlit's blog`,
  head: [
    ['link', { rel: 'icon', href: '/favicon.svg' }],
    ['meta', { name: 'google-site-verification', content: 'TXcyVysEbl1he1_f6amPGUmRYYxt7bdo7-Qd3_6Pqcs' }],
  ],
  srcDir: SORUCE_DIR,
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
    ...getBar(),
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
    math: true,
  },
  lastUpdated: true,
  sitemap: {
    hostname: 'https://whlit.github.io',
    lastmodDateOnly: true,
  },
})

function getBar(): { sidebar: DefaultTheme.SidebarMulti; nav: DefaultTheme.NavItem[] } {
  const nav = navbar()
  const activeMatchs = getNavActiveMatchs(nav)
  const side = {}
  Object.keys(activeMatchs).forEach((key) => {
    side[key] = getSidebar(SORUCE_DIR, key)
    if (side[key]) {
      activeMatchs[key].link = side[key][0].link
    }
  })
  return {
    nav: nav,
    sidebar: side,
  }
}

function getNavActiveMatchs(navs: DefaultTheme.NavItem[]): { [key: string]: DefaultTheme.NavItemWithLink } {
  const activeMatchs: { [key: string]: DefaultTheme.NavItemWithLink } = {}
  navs.forEach((nav) => {
    if (nav.items) {
      Object.assign(activeMatchs, getNavActiveMatchs(nav.items))
    } else if (nav.activeMatch) {
      activeMatchs[nav.activeMatch] = nav
    }
  })
  return activeMatchs
}
