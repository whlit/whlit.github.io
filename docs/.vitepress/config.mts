import { DefaultTheme, defineConfig } from 'vitepress'
import mermaidPlugin from './script/mermaid'

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
    { text: 'Java', link: '/java/spring-autowire', activeMatch: '/java/' },
    {
      text: 'Python',
      link: '/python/py-version-manger',
      activeMatch: '/python/',
    },
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

function sidebar(): DefaultTheme.SidebarMulti {
  return {
    '/java/': { base: '/java/', items: sidebarJava() },
    '/python/': { base: '/python/', items: sidebarPython() },
    '/vue/': { base: '/vue/', items: sidebarVue() },
    '/react/': { base: '/react/', items: sidebarReact() },
    '/mysql/': { base: '/mysql/', items: sidebarMysql() },
    '/neo4j/': { base: '/neo4j/', items: sidebarNeo4j() },
    '/redis/': { base: '/redis/', items: sidebarRedis() },
    '/git/': { base: '/git/', items: sidebarGit() },
    '/docker/': { base: '/docker/', items: sidebarDocker() },
    '/linux/': { base: '/linux/', items: sidebarLinux() },
    '/blog/': { base: '/blog/', items: sidebarBlog() },
  }
}

function sidebarJava(): DefaultTheme.SidebarItem[] {
  return [
    { text: 'Cpu时间片段', link: 'cpu-time' },
    {
      text: 'Idea gradle报错:Could not resolve all dependencies...',
      link: 'ex-idea-gradle',
    },
    { text: '实体类与ResultMap中的属性顺序不一致的问题', link: 'result-map' },
    {
      text: 'java.lang.IllegalStateException: Unable to find a...',
      link: 'illegal-state-exception',
    },
    { text: 'Spring boot validator', link: 'spring-boot-validator' },
    { text: 'ArrayList序列化', link: 'arraylist-serialize' },
    { text: 'ABA 问题', link: 'aba' },
    { text: 'Spring中有两个相同id的bean会报错吗', link: 'spring-same-bean-id' },
    { text: 'Spring Xml自动装配', link: 'spring-autowire' },
    { text: '设计模式', link: 'design-pattern' },
    { text: '双大括号初始化', link: 'double-brace-init' },
    { text: 'transient 关键字', link: 'transient' },
    { text: 'ESB 选型', link: 'esb' },
    { text: 'Nginx 集群搭建', link: 'nginx-cluster' },
    { text: 'Java 集合', link: 'collections' },
    { text: '分布式事务', link: 'distributed-transactions' },
    { text: 'Spring Boot 多数据源', link: 'spring-boot-multi-datasource' },
  ]
}

function sidebarPython(): DefaultTheme.SidebarItem[] {
  return [
    {
      text: '无法加载xxx.ps1,因为在此系统上禁止运行脚本',
      link: 'load-xxx-ps1',
    },
    { text: 'Python 版本管理', link: 'py-version-manger' },
  ]
}

function sidebarVue(): DefaultTheme.SidebarItem[] {
  return [
    {
      text: 'Vite+Ts+Vue+Electron+Mysql应用',
      link: 'vite-ts-vue-electron-mysql',
    },
    { text: 'Vue3与Vue2', link: 'vue3-vs-vue2' },
  ]
}

function sidebarReact(): DefaultTheme.SidebarItem[] {
  return [{ text: 'React', link: 'react' }]
}

function sidebarMysql(): DefaultTheme.SidebarItem[] {
  return [
    { text: 'Mysql相关', link: 'mysql' },
    { text: 'Mysql删除不存在的数据', link: 'del-not-exist' },
  ]
}

function sidebarNeo4j(): DefaultTheme.SidebarItem[] {
  return [
    { text: 'Cypher', link: 'cypher' },
    { text: 'Neo4j Elasticsearch NLP', link: 'neo4j-es-nlp' },
  ]
}

function sidebarRedis(): DefaultTheme.SidebarItem[] {
  return [
    { text: '使用Redis进行数据缓存', link: 'redis-cache' },
    { text: 'Redis 数据类型', link: 'redis-data-type' },
  ]
}

function sidebarGit(): DefaultTheme.SidebarItem[] {
  return [
    { text: 'Git 相关', link: 'git' },
    { text: 'Git Rebase使用', link: 'git-rebase' },
    { text: 'Git 删除已经push的commit记录', link: 'git-delete-push' },
    { text: 'Git提交信息常用前缀', link: 'git-commit-prefix' },
    { text: 'Git 放弃修改', link: 'git-abort' },
  ]
}

function sidebarDocker(): DefaultTheme.SidebarItem[] {
  return [
    { text: 'Centos离线安装Docker', link: 'centos-outline-install-docker' },
    { text: 'Docker构建MySQL服务', link: 'docker-mysql' },
    {
      text: 'Docker 部署 ElasticSearch + Kibana',
      link: 'docker-elasticsearch',
    },
  ]
}

function sidebarLinux(): DefaultTheme.SidebarItem[] {
  return [
    { text: 'Shell相关', link: 'shell' },
    { text: 'Linux命令', link: 'linux-command' },
    { text: 'Ubuntu 修改软件源', link: 'ubuntu-mirrors' },
  ]
}

function sidebarBlog(): DefaultTheme.SidebarItem[] {
  return [
    { text: '使用 VitePress 构建个人博客网站', link: 'vitepress' },
    { text: 'VitePress 支持 Mermaid', link: 'vitepress-mermaid' },
    { text: '常用特殊Ascii字符', link: 'special-ascii' },
    {
      text: 'Windows 系统删除 WindowsApps 文件夹',
      link: 'del-windows-apps-dir',
    },
    { text: '免激活使用Typora', link: 'typora' },
    { text: '重装系统，环境记录', link: 'reinstall-system' },
  ]
}
