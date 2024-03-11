import { defineUserConfig } from "vuepress";
import recoTheme from "vuepress-theme-reco";
import fontend from './public/route/fontend'
import backend from './public/route/backend'
import read from "./public/route/reading";

export default defineUserConfig({
  title: "脑瓜转啊转...",
  description: "Facing the Ocean, Spring and Blossom",
  base: '/blog.github.io/',
  theme: recoTheme({
    style: "@vuepress-reco/style-default",
    logo: "/logo.png",
    author: "Jaun",
    authorAvatar: "/head.png",
    docsBranch: "main",
    lastUpdatedText: "",
    autoSetBlogCategories: false,
    lastUpdated: false,
    series: {
      "/blogs": [
        {
          text: "前端技术栈",
          children: [...fontend],
          collapsible: false,
        },
        {
          text: "后端技术栈",
          children: [...backend],
          collapsible: false
        },
        {
          text: "读会书",
          children: [ read ],
          collapsible: false
        },
      ],
    },
    navbar: [
      { text: "Home", link: "/" },
      {
        text: "FrontEnd",
        children: [
          { text: "Vue", link: "/blogs/front-end/vue/2/2-observer" },
          // { text: "Node", link: "/blogs/front-end/node/" },
          { text: "React", link: "/blogs/front-end/react/basic" },
          { text: "Writing", link: "/blogs/front-end/writing/array" },
          { text: "Engineering", link: "/blogs/front-end/engineering/webpack/total" },
        ]
      },
      {
        text: "BackEnd",
        children: [
          { text: "Java", link: "/blogs/back-end/java/model" },
        ]
      },
      {
        text: "Reading",
        children: [
          { text: "传习录", link: "/blogs/reading/cxl/" },
        ]
      }
    ],
  }),
  // debug: true,
});
