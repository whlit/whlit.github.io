import { defineConfig } from "vitepress";

export default defineConfig({
  lang: "zh-CN",
  title: "whlit's blog",
  themeConfig: {
    logo: "/favicon.svg",
    nav: [{ text: "Home", link: "/" }],
    sidebar: [
      {
      },
    ],

    socialLinks: [{ icon: "github", link: "https://github.com/whlit" }],
  },
});
