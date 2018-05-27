# 如何学习一个开源项目的源码

http://hcysun.me/2017/03/03/Vue%E6%BA%90%E7%A0%81%E5%AD%A6%E4%B9%A0/


## 从了解一个开源项目入手

要看一个项目的源码，不要一上来就看，先去了解一下项目本身的元数据和依赖，除此之外最好也了解一下 PR 规则，Issue Reporting 规则等等。特别是“前端”开源项目，我们在看源码之前第一个想到的应该是：_package.json_ 文件。

在 _package.json_ 文件中，我们最应该关注的就是 `scripts` 字段和 `devDependencies` 以及 `dependencies` 字段，通过 `scripts` 字段我们可以知道项目中定义的脚本命令，通过 `devDependencies` 和 `dependencies` 字段我们可以了解项目的依赖情况。

了解了这些之后，如果有依赖我们就 `npm install` 安装依赖。

除了 _package.json_ 之外，我们还要阅读项目的贡献规则文档，了解如何开始，一个好的开源项目肯定会包含这部分内容的，Vue 也不例外：https://github.com/vuejs/vue/blob/dev/.github/CONTRIBUTING.md，在这个文档里说明了一些行为准则，PR 指南，Issue Reporting 指南，Development Setup 以及 项目结构。通过阅读这些内容，我们可以了解项目如何开始，如何开发以及目录的说明，下面是对重要目录和文件的简单介绍(略...)。大概了解了重要目录和文件之后，我们就可以查看 Development Setup 中的常用命令部分，来了解如何开始这个项目了，我们可以看到这样的介绍：

```bash
# watch and auto re-build dist/vue.js
$ npm run dev

# watch and auto re-run unit tests in Chrome
$ npm run dev:test
```

现在，我们只需要运行 npm run dev 即可监测文件变化并自动重新构建输出 dist/vue.js，然后运行 npm run dev:test 来测试。不过为了方便，我会在 examples 目录新建一个例子，然后引用 dist/vue.js 这样，我们可以直接拿这个例子一边改Vue源码一边看自己写的代码想怎么玩怎么玩。


## 看源码的小提示

当你看一个项目代码的时候，最好是能找到一条主线，先把大体流程结构摸清楚，再深入到细节，逐项击破，拿 Vue 举个栗子：假如你已经知道 Vue 中数据状态改变后会采用 virtual DOM 的方式更新 DOM，这个时候，如果你不了解 virtual DOM，那么听我一句“暂且不要去研究内部具体实现，因为这会使你丧失主线”，而你仅仅需要知道 virtual DOM 分为三个步骤：

一、`createElement()`: 用 JavaScript 对象(虚拟树) 描述 真实 DOM 对象(真实树)
二、`diff(oldNode, newNode)`: 对比新旧两个虚拟树的区别，收集差异
三、`patch()`: 将差异应用到真实 DOM 树

有的时候 第二步 可能与 第三步 合并成一步(Vue 中的patch就是这样)，除此之外，还比如 src/compiler/codegen 内的代码，可能你不知道他写了什么，直接去看它会让你很痛苦，但是你只需要知道 codegen 是用来将抽象语法树(AST)生成render函数的就OK了，也就是生成类似下面这样的代码：

```js
function anonymous() {
  with(this){return _c('p',{attrs:{"id":"app"}},[_v("\n      "+_s(a)+"\n      "),_c('my-com')])}
}
```

当我们知道了一个东西存在，且知道它存在的目的，那么我们就很容易抓住这条主线。了解大体之后，我们就知道了每部分内容都是做什么的，比如 codegen 是生成类似上面贴出的代码所示的函数的，那么再去看codegen 下的代码时，目的性就会更强，就更容易理解。

