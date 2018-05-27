/**
 * 原项目教程：https://www.cnblogs.com/kidney/p/8018226.html
 * 原项目地址：https://github.com/bison1994/vue-for-learning
 * 我重新梳理并用 ES6 语法进行了重写。正如原作者说的，有的代码是多余的，有的代码被极大简化了，但目的只有一个：更易读。
 */

// observer ========================================================================================

let uid$1 = 0

class Dep {
  constructor () {
    this.subs = []
    this.id = uid$1++
  }
  addSub (sub) { this.subs.push(sub) }
  notify () { this.subs.forEach(sub => sub.update()) }
}
Dep.target = null  // 这其实就是一个临时变量，get() 时会临时赋值

class Watcher {
  constructor (vm, expOrFn, cb) {
    this.vm = vm
    this.getter = expOrFn
    this.cb = cb
    this.depIds = []
    this.value = this.get()
  }
  get () {
    Dep.target = this /* ! */
    const value = this.getter.call(this.vm)  // getter 去取值时，就会触发被取值 Watcher 添加 dep 项
    Dep.target = null
    return value
  }
  update () {
    const value = this.get()
    if (this.value !== value) {
      var oldValue = this.value
      this.value = value
      this.cb.call(this.vm, value, oldValue)
    }
  }
  addDep (dep) {
    const id = dep.id
    if (this.depIds.indexOf(id) === -1) { // 避免重复添加
      this.depIds.push(id)
      dep.addSub(this)
    }
  }
}

function defineReactive (obj, key, val) {  // 此处的 val 是闭包内变量
  const dep = new Dep()                    // 记录都有谁谁谁依赖我，我变更时好通知他们一声
  Object.defineProperty(obj, key, {        // 将原有的 property 转成了 accessor
    get () {
      if (Dep.target) { Dep.target.addDep(dep) }
      return val
    },
    set (newVal) {
      if (newVal === obj[key]) { return }
      val = newVal
      dep.notify()
    }
  })
}

function observe (obj) {
  for (let key in obj) { defineReactive(obj, key, obj[key]) }
}

// vdom ============================================================================================

class VNode {
  constructor (tag, data, children, text, elm) {
    this.tag = tag
    this.data = data
    this.children = children
    this.text = text
    this.elm = elm
  }
}

function normalizeChildren (children) {
  if (typeof children === 'string') { return [createTextVNode(children)] }
  return children
}

function createTextVNode (val) {
  return new VNode(undefined, undefined, undefined, String(val))
}

function createElement (tag, data, children) {
  return new VNode(tag, data, normalizeChildren(children), undefined, undefined)
}

/** 根据 vnode 生成真实 DOM 节点树 */
function createElm (vnode) {
  if (!vnode.tag) {
    vnode.elm = document.createTextNode(vnode.text)
    return vnode.elm
  }
  vnode.elm = document.createElement(vnode.tag)
  if (vnode.data.attrs) {
    for (let key in vnode.data.attrs) {
      vnode.elm.setAttribute(key, vnode.data.attrs[key])
    }
  }
  if (vnode.children) {
    vnode.children.forEach(child => vnode.elm.appendChild(createElm(child)))
  }
  return vnode.elm
}

function sameVNode (vnode1, vnode2) {
  return vnode1.tag === vnode2.tag  // 此处精简地有点夸张，真实过程比较复杂
}

function updateChildren (oldCh, newCh) {
  // assume that every element node has only one child to simplify our diff algorithm
  if (sameVNode(oldCh[0], newCh[0])) {
    patchVNode(oldCh[0], newCh[0])
  } else {
    patch(oldCh[0], newCh[0])
  }
}

function patchVNode (oldVNode, vnode) {
  var elm = vnode.elm = oldVNode.elm
  var oldCh = oldVNode.children
  var ch = vnode.children

  if (!vnode.text) {
    if (oldCh && ch) { updateChildren(oldCh, ch) }
  } else if (oldVNode.text !== vnode.text) {
    elm.textContent = vnode.text
  }
}

/** 将 vnode 挂载到 elm，或者更新 vnode */
function patch (oldVNode, vnode) {
  const isRealElement = oldVNode.nodeType !== undefined  // virtual node has no `nodeType` property
  if (!isRealElement && sameVNode(oldVNode, vnode)) {
    patchVNode(oldVNode, vnode)
  } else {
    const elm = isRealElement ? oldVNode : oldVNode.elm
    if (isRealElement) {
      oldVNode = new VNode(elm.tagName.toLowerCase(), {}, [], undefined, elm)
    }
    createElm(vnode)
    elm.parentNode.insertBefore(vnode.elm, elm)
    elm.parentNode.removeChild(elm)
  }
  return vnode.elm
}

// Vue =============================================================================================

function proxy (vm, key) {
  Object.defineProperty(vm, key, {
    configurable: true,
    enumerable: true,
    get () { return vm.$data[key] },
    set (val) { vm.$data[key] = val }
  })
}

function initData (vm) {
  const data = vm.$data = vm.$options.data
  // proxy data so you can use `this.key` directly other than `this.$data.key`
  Object.keys(data).forEach(key => { proxy(vm, key) })
  observe(data)
}

class Vue {
  constructor (options) {
    this.$options = options
    initData(this)
    this.mount(document.querySelector(options.el))
  }
  mount (el) {
    this.$el = el
    new Watcher(this, () => this.update(this.render()))
  }
  update (vnode) {
    const prevVNode = this._vnode
    this._vnode = vnode
    if (!prevVNode) {
      this.$el = this.patch(this.$el, vnode)
    } else {
      this.$el = this.patch(prevVNode, vnode)
    }
  }
  /** 生成 vnode */
  render () {
    return this.$options.render.call(this)
  }
}
Vue.prototype.patch = patch

// test it =========================================================================================

const vm = window.vm = new Vue({
  el: '#app',
  data: {
    message: 'Hello world',
    isShow: false
  },
  render () {
    return createElement(
      'div',
      { attrs: { 'class': 'wrapper' } },
      [
        this.isShow
          ? createElement(
            'p',
            { attrs: { 'class': 'inner' } },
            this.message
          )
          : createElement(
            'h1',
            { attrs: { 'class': 'inner' } },
            'Hello world'
          )
      ]
    )
  }
})

setTimeout(function () { vm.isShow = true }, 1000)
setTimeout(function () { vm.message = 'Hello' }, 2000)
