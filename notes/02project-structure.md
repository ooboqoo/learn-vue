# Vue.js 项目结构

```txt
vue
  |- .github         贡献规则文档
  |- scripts         构建相关的文件
  |- src             源码目录
  |- dist            Vue.js 发布目录
  |- packages        Vue.js 子项目发布目录
  |- test            测试文件
  |- benchmarks      性能测试用例
  |- examples        一些使用Vue开发的应用案例
  |- types           Typescript 类型声明文件
  |- flow            Flow 类型声明文件
  \- package.json
```

```txt
src
  |- compiler    模板编译器
  |  |- codegen 
  |  |- directives 
  |  |- parser 
  |  |- optimizer.js
  |  |- create-compiler.js
  |  |- error-detector.js
  |  |- helper.js
  |  |- to-function.js
  |  \- index.js
  |- core        存放通用的平台无关的代码
  |  |- components
  |  |- global-api
  |  |- instance
  |  |- observer 
  |  |- util 
  |  |- vdom 
  |  |- config.js
  |  \- index.js
  |- platforms   平台相关代码
  |  |- web
  |  |  |- compiler 
  |  |  |- runtime 
  |  |  |- server
  |  |  |- util
  |  |  |- entry-compiler.js 
  |  |  |- entry-runtime-with-compiler.js 
  |  |  |- entry-runtime.js 
  |  |  |- entry-server-basic-render.js
  |  |  \- entry-server-renderer.js
  |  \- weex
  |- server      服务端渲染 SSR 相关代码
  |- sfc         单文件组件解析代码，用于 vue-template-compiler
  |  \- parser.js
  \- shared      包含整个代码库通用代码
     |- constants.js           
     \- util.js         
```





