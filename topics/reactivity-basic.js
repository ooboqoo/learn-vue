
function defineReactive (obj, key, val) {
  // Vue.js 是基于 `Object.defineProperty` 实现「响应式系统」的
  // 此处会将原有的 property 转成 accessor
  // val 在这里变成了闭包内变量
  Object.defineProperty(obj, key, {
    enumerable: true,       // 属性可枚举
    configurable: true,     // 属性可被修改或删除
    get: function reactiveGetter () {
      // 实际上会依赖收集，暂略
      return val
    },
    set: function reactiveSetter (newVal) {
      if (newVal === val) { return }
      render(newVal)
    }
  })
}

function observer (target) {
  if (!target || (typeof target !== 'object')) { return }

  Object.keys(target).forEach(key => {
    defineReactive(target, key, target[key])
  })
}

/** 渲染函数 */
function render (val) {
  // document.body.innerText = val
  console.log(val)
}

class Vue {
  constructor (options) {
    this._data = options.data
    observer(this._data)
  }
}

// 测试效果

const vm = new Vue({
  data: {
    test: 'I am test.'
  }
})
vm._data.test = 'hello,world.'  // 视图会更新
