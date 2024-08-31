import { DefaultTheme } from 'vitepress'

export function navbar(): DefaultTheme.NavItem[] {
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
      items: [
        { text: 'Blog', link: '/blog/vitepress', activeMatch: '/blog/' },
        { text: 'Nginx', link: '/nginx/nginx-cluster', activeMatch: '/nginx/' },
        { text: '算法题', link: '/leetcode/happy-number', activeMatch: '/leetcode/' },
        { text: '数据结构', link: '/data-structure/array', activeMatch: '/data-structure/' },
      ],
    },
  ]
}
