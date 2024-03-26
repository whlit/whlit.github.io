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
        text: "Blog",
        items: [
          { text: "使用 VitePress 构建个人博客网站", link: "/blog/vitepress" },
        ]
      },
    ],

    socialLinks: [{ icon: "github", link: "https://github.com/whlit" }],
  },
});
