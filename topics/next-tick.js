/**
 * 请配合教程学习：https://juejin.im/book/5a36661851882538e2259c0f/section/5a3bb17af265da4307037186
 */

let uid = 0
class Watcher {
  constructor () {
    this.id = ++uid
  }
  // 每次 notify() 都会执行
  update () {
    console.log('watch' + this.id + ' update')
    // Vue 采用异步更新策略，每次触发某个数据的 setter 方法后，对应的 Watcher 对象会被 push 进一个队列 queue 中，
    // 在下一个 tick 的时候将这个队列 queue 全部拿出来 run (Watcher 对象的一个方法，用来触发 patch 操作) 一遍。
    queueWatcher(this)
  }
  // 一个周期内只执行一次，不管进行了几次 update()
  run () {
    console.log('watch' + this.id + '视图更新啦～')
  }
}

let has = {}
let queue = []
let waiting = false  // 为 true 表示已通知 nextTick，watcher 队列在等待被调用

function queueWatcher (watcher) {
  const id = watcher.id
  if (has[id]) { return }  // 一个 tick 内，每个 watch 只需要执行一次即可确保视图是最新的

  has[id] = true
  queue.push(watcher)

  if (!waiting) {
    waiting = true
    nextTick(flushSchedulerQueue)
  }
}

function flushSchedulerQueue () {
  let watcher, id

  for (let i = 0; i < queue.length; i++) {
    watcher = queue[i]
    id = watcher.id
    has[id] = false
    watcher.run()
  }

  waiting = false
}

let callbacks = []
let pending = false  // true 表示已安排 flushCallbacks，无需重复安排
function nextTick (cb) {
  callbacks.push(cb)
  if (!pending) {
    pending = true
    setTimeout(flushCallbacks, 0)
  }
}

function flushCallbacks () {
  pending = false
  const copies = callbacks.slice(0)
  callbacks.length = 0
  for (let i = 0; i < copies.length; i++) { copies[i]() }
}

// test it =====================================================

(function () {
  let watch1 = new Watcher()
  let watch2 = new Watcher()

  watch1.update()
  watch1.update()
  watch2.update()
})()
