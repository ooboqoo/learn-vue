# Vue.js 源码学习项目


## 目录结构

```txt
vue          Vue.js 源码
mini-vue     自己实现的精简版 Vue.js
webapp       配合 mini-vue 做的示例应用，有点类似于测试用例
notes        源码学习的相关笔记
topics       源码分项解析示例
```


## 主要参考资源

* https://github.com/answershuto/learnVue
* http://hcysun.me/2017/03/03/Vue%E6%BA%90%E7%A0%81%E5%AD%A6%E4%B9%A0/
* https://github.com/bison1994/vue-for-learning


## 笔记索引

* [如何学习一个开源项目源码](./notes/01how-to-read-src.md)
* [Vue.js 项目目录结构](./notes/02project-structure.md)


## 源码分项解析

https://juejin.im/book/5a36661851882538e2259c0f

* 响应式系统 [代码-基本原理](./topics/reactivity-basic.js) / [代码-依赖追踪](./topics/reactivity-deps.js)
* 批量异步更新及 nextTick 原理 [代码](./topics/next-tick.js)
* 200多行代码实现迷你版 Vue [教程(外链)](https://www.cnblogs.com/kidney/p/8018226.html)/ [代码](./topics/vue-in-300-lines.js)


## mini-vue

