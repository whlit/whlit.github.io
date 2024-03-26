import { defineConfig } from "vitepress";

export default defineConfig({
  lang: "zh-CN",
  title: "whlit's blog",
  head: [["link", { rel: "icon", href: "/favicon.svg" }]],
  themeConfig: {
    logo: "/favicon.svg",
    nav: [{ text: "Home", link: "/" }],
    sidebar: [
      {
        text: "java",
        items: [
          { text: "Cpu时间片段", link: "/java/cpu-time" },
          { text: "Idea gradle报错:Could not resolve all dependencies...", link: "/java/ex-idea-gradle" },
          { text: "实体类与ResultMap中的属性顺序不一致的问题", link: "/java/result-map" },
          { text: "java.lang.IllegalStateException: Unable to find a...", link: "/java/illegal-state-exception" },
          { text: "Docker 部署 ElasticSearch + Kibana", link: "/java/docker-elasticsearch" },
          { text: "Spring boot validator", link: "/java/spring-boot-validator" },
          { text: 'ArrayList序列化', link: '/java/arraylist-serialize' },
          { text: 'ABA 问题', link: '/java/aba' },
          { text: 'Spring中有两个相同id的bean会报错吗', link: '/java/spring-same-bean-id' },
          { text: 'Spring Xml自动装配', link: '/java/spring-autowire' },
          { text: '设计模式', link: '/java/design-pattern' },
          { text: '双大括号初始化', link: '/java/double-brace-init' },
          { text: 'transient 关键字', link: '/java/transient' },
        ]
      },
      {
        text: "python",
        items: [
          { text: "无法加载xxx.ps1,因为在此系统上禁止运行脚本", link: "/python/load-xxx-ps1" },
          { text: "Python 版本管理", link: "/python/py-version-manger" },
        ]
      },
      {
        text: 'vue',
        items: [
          { text: 'Vite+Ts+Vue+Electron+Mysql应用', link: '/vue/vite-ts-vue-electron-mysql' },
          { text: 'Vue3与Vue2', link: '/vue/vue3-vs-vue2' }
        ]
      },
      {
        text: 'react',
        items: [
          { text: 'React 相关', link: '/react/react' }
        ]
      },
      {
        text: 'mysql',
        items: [
          { text: 'Mysql相关', link: '/mysql/mysql' },
          { text: 'Docker构建MySQL服务', link: '/mysql/docker-mysql' }
        ]
      },
      {
        text: 'Git',
        items: [
          { text: 'Git相关', link: '/git/git' }
        ]
      },
      {
        text: 'neo4j',
        items: [
          { text: 'Neo4j相关', link: '/neo4j/cypher' }
        ]
      },
      {
        text: 'docker',
        items: [
          { text: 'Centos离线安装Docker', link: '/docker/centos-outline-install-docker' }
        ]
      },
      {
        text: 'linux',
        items: [
          { text: 'Shell相关', link: '/linux/shell' },
          { text: 'Linux命令', link: '/linux/linux-command' },
        ]
      },
      {
        text: "Blog",
        items: [
          { text: "使用 VitePress 构建个人博客网站", link: "/blog/vitepress" },
        ]
      },
    ],

    socialLinks: [{ icon: "github", link: "https://github.com/whlit" }],
  },
});
