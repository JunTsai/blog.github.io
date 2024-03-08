---
title: 依赖收集、异步更新
date: 2018/12/18
tags:
  - vue2
categories:
  - front-end
  - vue
---
```javascript
```
## 依赖收集
假设现在有一个全局的对象，可能会在多个 Vue 对象中用到它进行展示。
```javascript
let globalObj = {
    text1: 'text1'
};

let o1 = new Vue({
  template:
      `<div>
          <span>{{text1}}</span> 
      <div>`,
  data: globalObj
});

let o2 = new Vue({
  template:
      `<div>
          <span>{{text1}}</span> 
      <div>`,
  data: globalObj
});
// 更改globalObj.text1的值，需要通知 o1 以及 o2 两个vm实例进行视图的更新
globalObj.text1 = 'hello,text1';
```
解决上面的通知问题，需要「依赖收集」。「依赖收集」会让 text1 这个数据知道“有两个地方依赖我的数据,变化的时候需要通知它们.vue中用到观察者模式来做依赖收集。

### 订阅者 Dep
主要作用是用来存放 Watcher 观察者对象
```javascript
class Dep {
  constructor() {
    this.subs = []
  }
    /* 在subs中添加一个Watcher对象 */
  addSub (sub) {
    this.subs.push(sub);
  }
 /* 通知所有Watcher对象更新视图 */
  notify () {
    this.subs.forEach((sub) => {
      sub.update();
    })
  }
}
```
### 观察者 Watcher
```javascript
class Watcher {
  constructor () {
    /* 在new一个Watcher对象时将该对象赋值给Dep.target，在get中会用到 */
    Dep.target = this;
  }
  /* 更新视图的方法 */
  update () {
    console.log("视图更新啦～");
  }
}
Dep.target = null; // 释放内存
```
### 依赖收集
修改一下 defineReactive 以及 Vue 的构造函数，来完成依赖收集
```javascript
function defineReactive (obj, key, val) {
  const dep = new Dep();  // 一个Dep类对象

  Object.defineProperty(obj, key, {
    enumerable: true,
    configurable: true,
    get: function reactiveGetter () {
      /* 将Dep.target（即当前的Watcher对象存入dep的subs中） */
      dep.addSub(Dep.target);
      return val;         
    },
    set: function reactiveSetter (newVal) {
      if (newVal === val) return;
      /* 在set的时候触发dep的notify来通知所有的Watcher对象更新视图 */
      dep.notify();
    }
  });
}
// 遍历所有属性的方式对该对象的每一个属性都通过 defineReactive 处理。
function observer(value) {
  if (!value || typeof value !== "object") {
    return;
  }
  Object.keys(value).forEach((key) => {
    defineReactive(value, key, value[key]);
  });
}

class Vue {
  constructor(options) {
    this._data = options.data;
    observer(this._data);
    /* 新建一个Watcher观察者对象，这时候Dep.target会指向这个Watcher对象 */
    new Watcher();
    /* 在这里模拟render的过程，为了触发test属性的get函数 */
    console.log('render~', this._data.test);
  }
}

```
总结：
- 首先在 observer 的过程中会注册 get 方法，该方法用来进行「依赖收集」。在它的闭包中会有一个 Dep 对象，这个对象用来存放 Watcher 对象的实例。
- 其实「依赖收集」的过程就是把 Watcher 实例存放到对应的 Dep 对象中去。get 方法可以让当前的 Watcher 对象（Dep.target）存放到它的 subs 中（addSub）方法，在数据变化时，set 会调用 Dep 对象的 notify 方法通知它内部所有的 Watcher 对象进行视图更新。
-  Object.defineProperty 的 set/get 方法处理的事情，那么「依赖收集」的前提条件还有两个：1.触发 get 方法；2.新建一个 Watcher 对象。
- 触发 get 方法也很简单，实际上只要把 render function 进行渲染，那么其中的依赖的对象都会被「读取」

## 异步更新
Vue.js 在修改 data 中的数据后修改视图了。这里面其实就是一个“setter -> Dep -> Watcher -> patch -> 视图”的过程。
```html
<template>
  <div>
    <div>{{number}}</div>
    <div @click="handleClick">click</div>
  </div>
</template>
```
```javascript
// 按下 click 按钮的时候，number 会被循环增加1000次。
export default {
  data () {
    return {
        number: 0
    };
  },
  methods: {
    handleClick () {
        for(let i = 0; i < 1000; i++) {
            this.number++;
        }
    }
  }
}
```
Vue.js在默认情况下，每次触发某个数据的 setter 方法后，对应的 Watcher 对象其实会被 push 进一个队列 queue 中，在下一个 tick 的时候将这个队列 queue 全部拿出来 run（ Watcher 对象的一个方法，用来触发 patch 操作） 一遍。什么是下一个tick？

## nextTick
- Vue.js 实现了一个 nextTick 函数，传入一个 cb ，这个 cb 会被存储到一个队列中，在下一个 tick 时触发队列中的所有 cb 事件。
- Vue.js 源码中分别用 Promise、setTimeout、setImmediate 等方式在 microtask（或是task）中创建一个事件，目的是在当前调用栈执行完毕以后（不一定立即）才会去执行这个事件。
```javascript
// 重新定义watcher
let uid = 0;
class Watcher {
  constructor () {
    this.id = ++uid;
  }
  update () {
    console.log('watch' + this.id + ' update');
    queueWatcher(this);
  }
  run () {
    console.log('watch' + this.id + '视图更新啦～');
  }
}
// queueWatcher 函数
let has = {}; //map，里面存放 id -> true ( false ) 的形式，用来判断是否已经存在相同的 Watcher 对象
let queue = [];
let waiting = false; /* waiting 是一个标记位，标记是否已经向 nextTick 传递了 flushSchedulerQueue 方法，
在下一个 tick 的时候执行 flushSchedulerQueue 方法来 flush 队列 queue，执行它里面的所有 Watcher 对象的 run 方法。 */
function queueWatcher(watcher) {
  const id = watcher.id;
  if (has[id] == null) {
    has[id] = true;
    queue.push(watcher);

    if (!waiting) {
      waiting = true;
      nextTick(flushSchedulerQueue);
    }
  }
}

/*waiting 是一个标记位，标记是否已经向 nextTick 传递了flushSchedulerQueue 方法，
在下一个 tick 的时候执行 flushSchedulerQueue 方法来 flush 队列 queue，
执行它里面的所有 Watcher 对象的 run 方法。 */
function flushSchedulerQueue () {
  let watcher, id;
  // 遍历观察者队列中的所有观察者
  for (index = 0; index < queue.length; index++) {
    watcher = queue[index];
    id = watcher.id;
    // 清除观察者是否存在的标记
    has[id] = null;
    // 执行观察者的方法
    watcher.run();
  }
  // 重置等待标记
  waiting  = false;
}

// 用 setTimeout 来模拟这个方法
let callbacks = [];
let pending = false;
function nextTick (cb) {
  callbacks.push(cb);
  if (!pending) {
    pending = true;
    setTimeout(flushCallbacks, 0);
  }
}

function flushCallbacks () {
  pending = false;
  const copies = callbacks.slice(0);
  callbacks.length = 0;
  for (let i = 0; i < copies.length; i++) {
    copies[i]();
  }
}

let watch1 = new Watcher();
let watch2 = new Watcher();

watch1.update();
watch1.update();
watch2.update();

/* 
假设没有批量异步更新策略的话
watch1 update
watch1视图更新啦～
watch1 update
watch1视图更新啦～
watch2 update
watch2视图更新啦～
异步更新
watch1 update
watch1 update
watch2 update
watch1视图更新啦～
watch2视图更新啦～ */
```
这就是异步更新策略的效果，相同的 Watcher 对象会在这个过程中被剔除，在下一个 tick 的时候去更新视图.
再回过头聊一下第一个例子， number 会被不停地进行 ++ 操作，不断地触发它对应的 Dep 中的 Watcher 对象的 update 方法。然后最终 queue 中因为对相同 id 的 Watcher 对象进行了筛选，从而 queue 中实际上只会存在一个 number 对应的 Watcher 对象。在下一个 tick 的时候（此时 number 已经变成了 1000），触发 Watcher 对象的 run 方法来更新视图，将视图上的 number 从 0 直接变成 1000。