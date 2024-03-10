# 总结 webpack4 相关的问题

随着现代前端开发的复杂度和规模越来越庞大，已经不能抛开工程化来独立开发了，如 react 的 jsx 代码必须编译后才能在浏览器中使用；又如 sass 和 less 的代码浏览器也是不支持的。 而如果摒弃了这些开发框架，那么开发的效率将大幅下降。在众多前端工程化工具中，webpack 脱颖而出成为了当今最流行的前端构建工具。 然而大多数的使用者都只是单纯的会使用，而并不知道其深层的原理。希望通过以下的面试题总结可以帮助大家温故知新、查缺补漏，知其然而又知其所以然。

## 问题列表

1. webpack 与 grunt、gulp 的不同？
2. 与 webpack 类似的工具还有哪些？谈谈你为什么最终选择（或放弃）使用 webpack？
3. 有哪些常见的 Loader？他们是解决什么问题的？
4. 有哪些常见的 Plugin？他们是解决什么问题的？
5. Loader 和 Plugin 的不同？
6. webpack 的构建流程是什么?从读取配置到输出文件这个过程尽量说全
7. 是否写过 Loader 和 Plugin？描述一下编写 loader 或 plugin 的思路？
8. webpack 的热更新是如何做到的？说明其原理？
9. 如何利用 webpack 来优化前端性能？（提高性能和体验）
10. 如何提高 webpack 的构建速度？
11. 怎么配置单页应用？怎么配置多页应用？
12. npm 打包时需要注意哪些？如何利用 webpack 来更好的构建？
13. 如何在 vue 项目中实现按需加载？

### 1. webpack 与 grunt、gulp 的不同？

三者都是前端构建工具，grunt 和 gulp 在早期比较流行，现在 webpack 相对来说比较主流，不过一些轻量化的任务还是会用 gulp 来处理，比如单独打包 CSS 文件等。

grunt 和 gulp 是基于任务和流（Task、Stream）的。类似 jQuery，找到一个（或一类）文件，对其做一系列链式操作，更新流上的数据， 整条链式操作构成了一个任务，多个任务就构成了整个 web 的构建流程。

webpack 是基于入口的。webpack 会自动地递归解析入口所需要加载的所有资源文件，然后用不同的 Loader 来处理不同的文件，用 Plugin 来扩展 webpack 功能。

所以总结一下：

- 从构建思路来说
  - gulp 和 grunt 需要开发者将整个前端构建过程拆分成多个`Task`，并合理控制所有`Task`的调用关系
  - webpack 需要开发者找到入口，并需要清楚对于不同的资源应该使用什么 Loader 做何种解析和加工
- 对于知识背景来说
  - gulp 更像后端开发者的思路，需要对于整个流程了如指掌 webpack 更倾向于前端开发者的思路

---

### 2. 与 webpack 类似的工具还有哪些？谈谈你为什么最终选择（或放弃）使用 webpack？

同样是基于入口的打包工具还有以下几个主流的：

- webpack
- rollup
- parcel

从应用场景上来看：

- webpack 适用于大型复杂的前端站点构建
- rollup 适用于基础库的打包，如 vue、react
- parcel 适用于简单的实验性项目，他可以满足低门槛的快速看到效果

由于 parcel 在打包过程中给出的调试信息十分有限，所以一旦打包出错难以调试，所以不建议复杂的项目使用 parcel

---

### 3. 有哪些常见的 Loader？他们是解决什么问题的？

常见的 Loader 及其作用如下：

- **file-loader：** 把文件输出到一个文件夹中，在代码中通过相对 URL 去引用输出的文件
- **url-loader：** 和 file-loader 类似，但是能在文件很小的情况下以 base64 的方式把文件内容注入到代码中去
- **source-map-loader：** 加载额外的 Source Map 文件，以方便断点调试
- **image-loader：** 加载并且压缩图片文件
- **babel-loader：** 把 ES6 转换成 ES5
- **css-loader：** 加载 CSS，支持模块化、压缩、文件导入等特性
- **style-loader：** 把 CSS 代码注入到 JavaScript 中，通过 DOM 操作去加载 CSS。
- **eslint-loader：** 通过 ESLint 检查 JavaScript 代码

---

### 4. 有哪些常见的 Plugin？他们是解决什么问题的？

常见的 Plugin 及其作用如下：

- **define-plugin：** 定义环境变量
- **commons-chunk-plugin：** 提取公共代码
- **uglifyjs-webpack-plugin：** 通过 UglifyES 压缩 ES6 代码

---

### 5. Loader 和 Plugin 的不同？

**不同的作用：**

- Loader 直译为"加载器"。Webpack 将一切文件视为模块，但是 webpack 原生是只能解析 js 文件，如果想将其他文件也打包的话，就会用到 loader。 所以 Loader 的作用是让 webpack 拥有了加载和解析非 JavaScript 文件的能力。

- Plugin 直译为"插件"。Plugin 可以扩展 webpack 的功能，让 webpack 具有更多的灵活性。 在 Webpack 运行的生命周期中会广播出许多事件，Plugin 可以监听这些事件，在合适的时机通过 Webpack 提供的 API 改变输出结果。

**不同的用法：**

- Loader 在`module.rules`中配置，也就是说它作为模块的解析规则而存在。 类型为数组，每一项都是一个 Object，里面描述了对于什么类型的文件（test），使用什么加载(loader)和使用的参数（options）。

- Plugin 在`plugins`中单独配置。 类型为数组，每一项是一个 plugin 的实例，参数都通过构造函数传入。

---

### Webpack 的构建流程可以总结为以下几个关键步骤：

1. **初始化参数**：Webpack 会从配置文件和命令行参数中读取配置，并将它们合并，得出最终的参数。

2. **启动编译**：Webpack 初始化完成后，会创建一个 Compiler 对象，加载所有配置的插件，并执行 Compiler 对象的 run 方法开始执行编译过程。

3. **确定入口**：Webpack 根据配置文件中的 entry 属性确定所有的入口文件。

4. **编译模块**：Webpack 从确定的入口文件开始，调用配置的 Loader 对模块进行编译，同时解析模块间的依赖关系，递归处理所有的依赖模块。

5. **完成模块编译**：在经过 Loader 编译后，Webpack 得到了每个模块被编译后的最终内容以及它们之间的依赖关系。

6. **输出资源**：根据模块间的依赖关系，Webpack 将模块组装成一个个 Chunk，并将每个 Chunk 转换成一个单独的文件加入到输出列表中，这里可以通过配置对输出内容进行修改。

7. **输出完成**：Webpack 确定了输出路径和文件名后，将文件内容写入到文件系统中，完成整个构建过程。

在以上过程中，Webpack 会在特定的时间点触发特定的事件，插件可以监听这些事件，并在适当的时机执行特定的逻辑。这种机制使得插件可以修改和扩展 Webpack 的功能，提供更灵活的构建流程。

---

### 7.编写 Loader 或 Plugin 的思路

#### Loader

Loader 就像一个"翻译官"，负责将读取到的源文件内容转义成新的文件内容，并通过链式操作逐步翻译源文件。

1. **理解需求：** 首先，明确需要编写的 Loader 实现何种功能，例如转义 ES6 到 ES5、处理图片文件等。
2. **遵循单一原则：** 每个 Loader 应该只做一种转义工作，保持功能单一、灵活和可维护。
3. **处理源文件：** Loader 接收源文件内容（source），可以通过返回值方式输出处理后的内容，或者使用 `this.callback()` 方法将内容返回给 webpack。还可以通过 `this.async()` 生成回调函数输出处理后的内容。
4. **使用工具函数：** webpack 提供了一些开发 Loader 的工具函数集，如 `loader-utils`，可以帮助开发者更方便地编写 Loader。

#### Plugin

相比 Loader，Plugin 的编写更为灵活，它可以监听 webpack 在运行过程中广播出的各种事件，并在适当的时机通过 webpack 提供的 API 改变输出结果。

1. **理解事件生命周期：** Plugin 的编写依赖于 webpack 的事件生命周期，需要了解 webpack 运行时广播的各种事件及其触发时机。
2. **监听事件：** 开发者需要编写插件代码来监听感兴趣的事件，可以通过 `compiler` 或 `compilation` 对象来注册事件监听器。
3. **改变输出结果：** 在事件触发时，通过 webpack 提供的 API 来修改输出结果，例如修改模块代码、添加额外的资源等。
4. **处理错误：** 考虑插件在处理过程中可能遇到的错误情况，做好错误处理和日志记录。
5. **测试和调试：** 编写插件后进行测试和调试，确保插件的功能和逻辑正确。

总的来说，编写 Loader 和 Plugin 需要对 webpack 的工作原理有一定了解，并根据具体需求和事件生命周期编写相应的代码逻辑。

---

### 8.webpack 的热更新是如何做到&其原理

webpack 的热更新又称热替换（Hot Module Replacement），缩写为 HMR。 这个机制可以做到不用刷新浏览器而将新变更的模块替换掉旧的模块。

原理：
  ![avatar](https://note.youdao.com/yws/public/resource/c992970d87e9b0afc4b51577b9b19e96/xmlnote/339FED33D01F4D678E88BC7456DDB1BE/7F9953FD47834015A742AAFDA797A605/1632)

首先要知道 server 端和 client 端都做了处理工作

- **第一步：**，在 webpack 的 watch 模式下，文件系统中某一个文件发生修改，webpack 监听到文件变化，根据配置文件对模块重新编译打包，并将打包后的代码通过简单的 JavaScript 对象保存在内存中。 
- **第二步：**是 webpack-dev-server 和 webpack 之间的接口交互，而在这一步，主要是 dev-server 的中间件 webpack-dev-middleware 和 webpack 之间的交互，webpack-dev-middleware 调用 webpack 暴露的 API 对代码变化进行监控，并且告诉 webpack，将代码打包到内存中。 
- **第三步：**是 webpack-dev-server 对文件变化的一个监控，这一步不同于第一步，并不是监控代码变化重新打包。当我们在配置文件中配置了 devServer.watchContentBase 为 true 的时候，Server 会监听这些配置文件夹中静态文件的变化，变化后会通知浏览器端对应用进行 live reload。注意，这儿是浏览器刷新，和 HMR 是两个概念。 
- **第四步：** 也是 webpack-dev-server 代码的工作，该步骤主要是通过 sockjs（webpack-dev-server 的依赖）在浏览器端和服务端之间建立一个 websocket 长连接，将 webpack 编译打包的各个阶段的状态信息告知浏览器端，同时也包括第三步中 Server 监听静态文件变化的信息。浏览器端根据这些 socket 消息进行不同的操作。当然服务端传递的最主要信息还是新模块的 hash 值，后面的步骤根据这一 hash 值来进行模块热替换。
- **webpack-dev-server/client端：** 并不能够请求更新的代码，也不会执行热更模块操作，而把这些工作又交回给了 webpack，webpack/hot/dev-server 的工作就是根据 webpack-dev-server/client 传给它的信息以及 dev-server 的配置决定是刷新浏览器呢还是进行模块热更新。当然如果仅仅是刷新浏览器，也就没有后面那些步骤了。
- **HotModuleReplacement.runtime：**  是客户端 HMR 的中枢，它接收到上一步传递给他的新模块的 hash 值，它通过 JsonpMainTemplate.runtime 向 server 端发送 Ajax 请求，服务端返回一个 json，该 json 包含了所有要更新的模块的 hash 值，获取到更新列表后，该模块再次通过 jsonp 请求，获取到最新的模块代码。这就是上图中 `7、8、9 `步骤。
- **而第 10 步：** 是决定 HMR 成功与否的关键步骤，在该步骤中，HotModulePlugin 将会对新旧模块进行对比，决定是否更新模块，在决定更新模块后，检查模块之间的依赖关系，更新模块的同时更新模块间的依赖引用。
- **最后一步**，当 HMR 失败后，回退到 live reload 操作，也就是进行浏览器刷新来获取最新打包代码。

---

### 9.利用 webpack 优化前端性能

使用 webpack 优化前端性能是指通过优化 webpack 的输出结果，使得打包后的最终代码在浏览器中运行更快、更高效。

1. **压缩代码：**

   - 删除多余的代码、注释，并简化代码的写法等方式来减小文件体积。
   - 可以利用 webpack 的 UglifyJsPlugin 和 ParallelUglifyPlugin 来压缩 JS 文件，利用 cssnano（通过 css-loader 的 minimize 选项）来压缩 CSS。

2. **利用 CDN 加速：**

   - 在构建过程中，将引用的静态资源路径修改为 CDN 上对应的路径。
   - 可以通过配置 webpack 的 output 参数和各个 loader 的 publicPath 参数来修改资源路径。

3. **删除死代码（Tree Shaking）：**

   - 删除代码中永远不会被执行到的片段，减小代码体积。
   - 可以通过在启动 webpack 时追加参数 `--optimize-minimize` 来实现。

4. **提取公共代码：**
   - 将多个页面或组件共同使用的代码提取出来，形成单独的文件，利用浏览器的缓存机制减少重复加载的次数。

通过以上方式，可以有效地利用 webpack 对前端性能进行优化，提升页面加载速度和用户体验。

---

### 10.提高 webpack 的构建速度

1. **多入口情况下，使用 CommonsChunkPlugin 提取公共代码：**

   - 将多个入口文件中共同引用的模块提取出来，形成一个公共的 chunk，减少重复打包和加载的时间。

2. **通过 externals 配置来提取常用库：**

   - 将项目中常用的第三方库（如 React、Vue 等）通过 externals 配置，从而避免将这些库打包进最终的 bundle，减少打包时间。

3. **利用 DllPlugin 和 DllReferencePlugin 预编译资源模块：**

   - 使用 DllPlugin 对那些引用但绝对不会修改的 npm 包进行预编译，再通过 DllReferencePlugin 将预编译的模块加载进来，提升构建速度。

4. **使用 Happypack 实现多线程加速编译：**

   - Happypack 可以将任务分解给多个子进程并行处理，提高构建速度，尤其是在大型项目中，可以明显减少构建时间。

5. **使用 webpack-uglify-parallel 来提升 UglifyPlugin 的压缩速度：**

   - webpack-uglify-parallel 利用多核并行压缩来提升 UglifyPlugin 的压缩速度，加快代码的构建过程。

6. **使用 Tree-shaking 和 Scope Hoisting 来剔除多余代码：**
   - 通过 Tree-shaking 和 Scope Hoisting 来删除和合并多余的代码，减小 bundle 大小，提高加载速度。

通过以上方式，可以有效地提高 webpack 的构建速度，加快项目的开发和部署过程。

### 11.怎么配置单页应用？怎么配置多页应用？

### 配置单页应用

单页应用的配置比较简单，直接在 webpack 的 entry 中指定单页应用的入口即可。

### 配置多页应用

对于多页应用，可以使用 webpack 的 AutoWebPlugin 来完成简单自动化的构建，但是前提是项目的目录结构必须遵守它预设的规范。在配置多页应用时需要注意以下几点：

1. **抽离公共代码：**
   每个页面都可能会引用相同的公共代码，比如共享的 CSS 样式表或者 JavaScript 代码，可以将这些代码抽离出来，避免重复的加载，提高加载速度和性能。

2. **灵活的入口配置：**
   随着业务的不断扩展，页面可能会不断追加，因此需要保证入口的配置足够灵活，避免每次添加新页面都需要修改构建配置。可以通过动态获取入口文件的方式来实现灵活配置，或者使用一些自动化的构建工具来简化配置流程。

通过以上方式配置多页应用，可以提高项目的开发效率和可维护性，同时确保构建的结果满足项目需求。

### 12.npm 打包时需要注意哪些？如何利用 webpack 来更好的构建？

Npm 是目前最大的 JavaScript 模块仓库，里面有来自全世界开发者上传的可复用模块。你可能只是 JS 模块的使用者，但是有些情况你也会去选择上传自己开发的模块。 关于 NPM 模块上传的方法可以去官网上进行学习，这里只讲解如何利用 webpack 来构建。

NPM 模块需要注意以下问题：
要支持 CommonJS 模块化规范，所以要求打包后的最后结果也遵守该规则。
Npm 模块使用者的环境是不确定的，很有可能并不支持 ES6，所以打包的最后结果应该是采用 ES5 编写的。并且如果 ES5 是经过转换的，请最好连同 SourceMap 一同上传。
Npm 包大小应该是尽量小（有些仓库会限制包大小）
发布的模块不能将依赖的模块也一同打包，应该让用户选择性的去自行安装。这样可以避免模块应用者再次打包时出现底层模块被重复打包的情况。
UI 组件类的模块应该将依赖的其它资源文件，例如.css 文件也需要包含在发布的模块里。

基于以上需要注意的问题，我们可以对于 webpack 配置做以下扩展和优化：
CommonJS 模块化规范的解决方案： 设置 output.libraryTarget='commonjs2'使输出的代码符合 CommonJS2 模块化规范，以供给其它模块导入使用
输出 ES5 代码的解决方案：使用 babel-loader 把 ES6 代码转换成 ES5 的代码。再通过开启 devtool: 'source-map'输出 SourceMap 以发布调试。
Npm 包大小尽量小的解决方案：Babel 在把 ES6 代码转换成 ES5 代码时会注入一些辅助函数，最终导致每个输出的文件中都包含这段辅助函数的代码，造成了代码的冗余。解决方法是修改.babelrc 文件，为其加入 transform-runtime 插件
不能将依赖模块打包到 NPM 模块中的解决方案：使用 externals 配置项来告诉 webpack 哪些模块不需要打包。
对于依赖的资源文件打包的解决方案：通过 css-loader 和 extract-text-webpack-plugin 来实现，配置如下：
const ExtractTextPlugin = require('extract-text-webpack-plugin');

```javascript
module.exports = {
  module: {
    rules: [
      {
        // 增加对 CSS 文件的支持
        test: /\.css/,
        // 提取出 Chunk 中的 CSS 代码到单独的文件中
        use: ExtractTextPlugin.extract({
          use: ["css-loader"],
        }),
      },
    ],
  },
  plugins: [
    new ExtractTextPlugin({
      // 输出的 CSS 文件名称
      filename: "index.css",
    }),
  ],
};
```
### 13.如何在 vue 项目中实现按需加载？

Vue UI 组件库的按需加载 为了快速开发前端项目，经常会引入现成的 UI 组件库如 ElementUI、iView 等，但是他们的体积和他们所提供的功能一样，是很庞大的。 而通常情况下，我们仅仅需要少量的几个组件就足够了，但是我们却将庞大的组件库打包到我们的源码中，造成了不必要的开销。

不过很多组件库已经提供了现成的解决方案，如 Element 出品的 babel-plugin-component 和 AntDesign 出品的 babel-plugin-import 安装以上插件后，在.babelrc 配置中或 babel-loader 的参数中进行设置，即可实现组件按需加载了。

{
"presets": [["es2015", { "modules": false }]],
"plugins": [
[
"component",
{
"libraryName": "element-ui",
"styleLibraryName": "theme-chalk"
}
]
]
}

单页应用的按需加载 现在很多前端项目都是通过单页应用的方式开发的，但是随着业务的不断扩展，会面临一个严峻的问题——首次加载的代码量会越来越多，影响用户的体验。

> 通过 import(_)语句来控制加载时机，webpack 内置了对于 import(_)的解析，会将 import(_)中引入的模块作为一个新的入口在生成一个 chunk。 当代码执行到 import(_)语句时，会去加载 Chunk 对应生成的文件。import()会返回一个 Promise 对象，所以为了让浏览器支持，需要事先注入 Promise polyfill
