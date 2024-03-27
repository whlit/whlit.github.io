import { defineConfig } from 'vitepress';

export default defineConfig({
  lang: 'zh-CN',
  title: `whlit's blog`,
  head: [['link', { rel: 'icon', href: '/favicon.svg' }]],
  themeConfig: {
    logo: '/favicon.svg',
    nav: [
      { text: 'Java', link: '/java/', activeMatch: '/java/' },
      { text: 'Python', link: '/python/', activeMatch: '/python/' },
      { text: 'Vue', link: '/vue/', activeMatch: '/vue/' },
      { text: 'React', link: '/react/', activeMatch: '/react/' },
      {
        text: '数据库', items: [
          { text: 'Mysql', link: '/mysql/', activeMatch: '/mysql/' },
          { text: 'Neo4j', link: '/neo4j/', activeMatch: '/neo4j/' },
        ]
      },
      { text: 'Git', link: '/git/', activeMatch: '/git/' },
      { text: '其他', link: '/blog/', activeMatch: '/blog/' },
    ],
    search: {
      provider: 'local',
    },

    sidebar: {
      '/java/': [
        { text: 'Cpu时间片段', link: '/java/cpu-time' },
        { text: 'Idea gradle报错:Could not resolve all dependencies...', link: '/java/ex-idea-gradle' },
        { text: '实体类与ResultMap中的属性顺序不一致的问题', link: '/java/result-map' },
        { text: 'java.lang.IllegalStateException: Unable to find a...', link: '/java/illegal-state-exception' },
        { text: 'Docker 部署 ElasticSearch + Kibana', link: '/java/docker-elasticsearch' },
        { text: 'Spring boot validator', link: '/java/spring-boot-validator' },
        { text: 'ArrayList序列化', link: '/java/arraylist-serialize' },
        { text: 'ABA 问题', link: '/java/aba' },
        { text: 'Spring中有两个相同id的bean会报错吗', link: '/java/spring-same-bean-id' },
        { text: 'Spring Xml自动装配', link: '/java/spring-autowire' },
        { text: '设计模式', link: '/java/design-pattern' },
        { text: '双大括号初始化', link: '/java/double-brace-init' },
        { text: 'transient 关键字', link: '/java/transient' },
      ],
      '/python/': [
        { text: '无法加载xxx.ps1,因为在此系统上禁止运行脚本', link: '/python/load-xxx-ps1' },
        { text: 'Python 版本管理', link: '/python/py-version-manger' },
      ],
      '/vue/': [
        { text: 'Vite+Ts+Vue+Electron+Mysql应用', link: '/vue/vite-ts-vue-electron-mysql' },
        { text: 'Vue3与Vue2', link: '/vue/vue3-vs-vue2' }
      ],
      '/react/': [
        { text: 'React 相关', link: '/react/react' }
      ],
      '/mysql/': [
        { text: 'Mysql相关', link: '/mysql/mysql' },
        { text: 'Docker构建MySQL服务', link: '/mysql/docker-mysql' }
      ],
      '/neo4j/': [
        { text: 'Cypher', link: '/neo4j/cypher' }
      ],
      '/git/': [
        { text: 'Git使用', link: '/git/git' }
      ],
      '/docker/': [
        { text: 'Centos离线安装Docker', link: '/docker/centos-outline-install-docker' }
      ],
      '/linux/': [
        { text: 'Shell相关', link: '/linux/shell' },
        { text: 'Linux命令', link: '/linux/linux-command' },
      ],
      '/blog/': [
        { text: '使用 VitePress 构建个人博客网站', link: '/blog/vitepress' },
      ],
    },

    socialLinks: [{ icon: 'github', link: 'https://github.com/whlit' }],
  },
});
