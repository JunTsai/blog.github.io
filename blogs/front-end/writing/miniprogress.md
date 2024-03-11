## 微信小程序底层框架实现原理

### 双线程架构
微信小程序的渲染层与逻辑层分别由两个线程管理，渲染层的界面使用 `webview` 进行渲染；逻辑层采用 `JSCore运行JavaScript代码。`
![avatar](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b29e220dcf3241a7aad242055c0f8b0c~tplv-k3u1fbpfcp-jj-mark:1663:0:0:0:q75.awebp)
- **渲染层**
  - 一个小程序有多个界面，所以渲染层对应存在多个`webview`.两个线程之间由`Native层`进行统一处理。无论是线程之间的通讯、数据的传递、网络请求都由`Native层`做转发。
  - 为什么要做多个webview呢，为了更加接近原生应用APP的用户体验。多个webview可以理解为多页面应用，有别于单页面应用SPA.多页面应用的新页面直接滑动出来并且覆盖在旧页面上即可，这样的用户体验是非常好的。
- **逻辑层**
  - 为了解决安全管控问题，小程序阻止开发者使用一些浏览器提供的比如跳转页面、操作DOM、动态执行脚本的开放性接口,同时小程序提供了一个纯JavaScript 的解释执行环境的沙箱。
  - 得益于客户端系统有javaScript 的解释引擎（在`iOS`下使用内置的 `javaScriptCore框架`，在`安卓`则是用腾讯x5内核提供的`JsCore环境`），可以创建一个单独的线程去执行 javaScript，在这个环境下执行的都是有关小程序业务逻辑的代码，也就是`逻辑层`。

### WXML标签设计思路

- **WXML语法结构**
![avater](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/2b95a804efe546e8831b6d0e9105cee1~tplv-k3u1fbpfcp-jj-mark:1663:0:0:0:q75.awebp)
  - 行内属性
  > id
  style
  class
  data-*
  hidden
  bind*/catch*
  - 数据绑定 
  > WXML 通过 {{变量名}} 来绑定 WXML 文件和对应的javaScript文件中的data对象属性
  - 逻辑语法
  > {{ 变量名 }} 语法可以使得 WXML 拥有动态渲染的能力，除此外还可以在 {{ }} 内进行简单的逻辑运算。
  三元运算
  算数运算
  字符串的拼接
  放置常量（数字、字符串或者是数组）
  - 条件逻辑
  > if-else
  - 列表渲染
  >  wx:for
  - 模板
  > WXML提供模板（template），可以在模板中定义代码片段，然后在不同的地方调用。使用 name 属性，作为模板的名字。然后在<template />内定义代码片段。
  - import&include
  >import可以在该文件中使用目标文件定义的 <template />, import 不具有递归的特性。include 可以将目标文件中除了<template />、<wxs />外的整个代码引入，相当于是拷贝到include位置

- **WXML设计思路**
  1.Exparser是微信小程序的组件组织框架，内置在小程序基础库中，为小程序的各种组件提供基础的支持。小程序内的所有组件，包括内置组件和自定义组件，都由Exparser组织管理。
  2.Exparser的组件模型与WebComponents标准中的Shadow DOM高度相似。Exparser会维护整个页面的节点树相关信息，包括节点的属性、事件绑定等，相当于一个简化版的Shadow DOM实现。