/**
 * 订阅者 Dep
 */
class Dep {
  constructor () {
    this.subs = []  // 用来存放 Watcher 对象的数组
  }
  /** 在 subs 中添加一个 Watcher 对象 */
  addSub (sub) { this.subs.push(sub) }
  /** 通知所有 Watcher 对象更新视图 */
  notify () { this.subs.forEach(sub => { sub.update() }) }
}
Dep.target = null

/**
 * 观察者 Watcher
 */
class Watcher {
  constructor () {
    Dep.target = this  // 在 new 一个 Watcher 对象时将该对象赋值给 Dep.target，在 get 中会用到
  }
  /** 更新视图的方法 */
  update () { render() }
}

function defineReactive (obj, key, val) {
  const dep = new Dep()

  Object.defineProperty(obj, key, {
    enumerable: true,
    configurable: true,
    get: function reactiveGetter () {
      /* 将Dep.target（即当前的Watcher对象存入dep的subs中） */
      dep.addSub(Dep.target)
      return val
    },
    set: function reactiveSetter (newVal) {
      if (newVal === val) return
      /* 在set的时候触发dep的notify来通知所有的Watcher对象更新视图 */
      dep.notify()
    }
  })
}

function observer (target) {
  if (!target || (typeof target !== 'object')) { return }

  Object.keys(target).forEach(key => {
    defineReactive(target, key, target[key])
  })
}

function render () {
  document.body.innerText = vm._data.test
}

class Vue {
  constructor (options) {
    this._data = options.data
    observer(this._data)
    /* 新建一个Watcher观察者对象，这时候Dep.target会指向这个Watcher对象 */
    new Watcher()
  }
}

// 测试效果

const vm = window.vm = new Vue({
  data: {
    test: 'I am test.'
  }
})
vm._data.test = 'hello,world.'  // 视图会更新
