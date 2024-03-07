import { defineUserConfig } from "vuepress";
import type { DefaultThemeOptions } from "vuepress";
import recoTheme from "vuepress-theme-reco";

export default defineUserConfig({
  title: "脑子像个小风扇，转啊转啊...",
  description: "Facing the Ocean, Spring and Blossom",
  base: '/jaun.github.io/',
  theme: recoTheme({
    style: "@vuepress-reco/style-default",
    logo: "/logo.png",
    author: "Jaun",
    authorAvatar: "/head.png",
    docsBranch: "main",
    lastUpdatedText: false,
    autoSetBlogCategories: true,
    search: false, // 禁用搜索
    // series 为原 sidebar
    series: {
      "/blogs": [
        {
          text: "前端技术栈",
          children: [
            { text: "Vue", link: "/blogs/front-end/vue/" },
            { text: "Vite", link: "/blogs/front-end/vite/" },
            { text: "Http", link: "/blogs/front-end/http/" },
            { text: "Node", link: "/blogs/front-end/node/" },
            { text: "React", link: "/blogs/front-end/react/" },
            { text: "Chrome", link: "/blogs/front-end/chrome/" },
            { text: "Writing", link: "/blogs/front-end/writing/" },
            { text: "Webapck", link: "/blogs/front-end/webapck/" },
          ]
        },
        {
          text: "后端技术栈",
          children: [
            { text: "Java", link: "/blogs/back-end/java/" },
          ],
        },
        {
          text: "读会书",
          children: [
            { text: "传习录", link: "/blogs/reading/cxl/" },
          ],
        },
      ],
    },
    navbar: [
      { text: "Home", link: "/" },
      {
        text: "FrontEnd",
        children: [
          { text: "Vue", link: "/blogs/front-end/vue/" },
          { text: "Vite", link: "/blogs/front-end/vite/" },
          { text: "Http", link: "/blogs/front-end/http/" },
          { text: "Node", link: "/blogs/front-end/node/" },
          { text: "React", link: "/blogs/front-end/react/" },
          { text: "Chrome", link: "/blogs/front-end/chrome/" },
          { text: "Writing", link: "/blogs/front-end/writing/" },
          { text: "Webapck", link: "/blogs/front-end/webapck/" },
        ]
      },
      {
        text: "BackEnd",
        children: [
          { text: "Java", link: "/blogs/back-end/java/" },
        ]
      },
      {
        text: "Reading",
        children: [
          { text: "传习录", link: "/reading/chuanxilu/" },
        ]
      }
    ],
  }),
  // debug: true,
});
