---
title: 响应式系统
date: 2018/12/15
tags:
  - vue2
categories:
  - front-end
  - vue
---

## 响应式系统

Vue.js 是一款 MVVM 框架，数据模型仅仅是普通的 JavaScript 对象，但是对这些对象进行操作时，却能影响对应视图，它的核心实现就是「响应式系统」。尽管我们在使用 Vue.js 进行开发时不会直接修改「响应式系统」

### Object.defineProperty

Vue.js 就是基于它实现「响应式系统」的。首先是使用方法：

```javascript
/*
  obj: 目标对象
  prop: 需要操作的目标对象的属性名
  descriptor: 描述符
  return value 传入对象
*/
Object.defineProperty(obj, prop, descriptor);
```

我们定义一个 defineReactive ，这个方法通过 Object.defineProperty 来实现对对象的「响应式」化，入参是一个 obj（需要绑定的对象）、key（obj 的某一个属性），val（具体的值）。经过 defineReactive 处理以后，我们的 obj 的 key 属性在「读」的时候会触发 reactiveGetter 方法，而在该属性被「写」的时候则会触发 reactiveSetter 方法。

```javascript
function defineReactive(obj, key, val) {
  Object.defineProperty(obj, key, {
    enumerable: true /* 属性可枚举 */,
    configurable: true /* 属性可被修改或删除 */,
    get: function reactiveGetter() {
      // 收集依赖
      return val;
    },
    set: function reactiveSetter(newVal) {
      if (newVal === val) return;
      cb(newVal);
    },
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
// new 一个 Vue 对象，就会将 data 中的数据进行「响应式」化。
class Vue {
  /* Vue构造类 */
  constructor(options) {
    this._data = options.data;
    observer(this._data);
  }
}

let o = new Vue({
  data: {
    text: "hello."
  }
});
o._data.text = 'hello world!'
```

### 缺陷
在 Vue 2 中使用 `Object.defineProperty` 有几个潜在的缺点：


1. **性能开销：** `Object.defineProperty` 的调用是相对较慢的，特别是在大型数据结构中频繁使用时。每次调用都需要遍历整个对象，这可能会导致性能问题，尤其是在需要大量响应式属性时。
```javascript

const obj = { name: 'Alice', age: 30 };
// 为对象的属性定义 getter 和 setter
Object.defineProperty(obj, 'name', {
  get() {
    console.log('Getter 调用');
    return name;
  },
  set(value) {
    console.log('Setter 调用');
    name = value;
  }
});

// 测试性能
for (let i = 0; i < 1000000; i++) {
  obj.name = 'Bob';
}
/* 在对象上使用 Object.defineProperty 定义 getter 和 setter 的方式。
当你修改属性时，每次调用都会触发相应的 getter 和 setter。
在大型数据结构中频繁使用这种方式可能会导致性能问题。 */
```


2. **深度监听的限制：** `Object.defineProperty` 只能监听对象的属性变化，而不能直接监听数组的变化。这就需要 Vue 针对数组的修改进行特殊处理，比如通过重写数组的一些方法来实现响应式。这种处理会增加代码复杂性和潜在的错误。
```javascript
// 通过 Object.defineProperty 无法直接监听数组的变化，因此需要特殊处理
const vm = new Vue({
  data: {
    arr: [1, 2, 3]
  }
});

vm.arr.push(4); // 这种修改不会触发响应
// Vue 2 中对数组的变化进行了特殊处理，重写了数组的一些方法来实现响应式。
// 但直接对数组进行的修改可能无法触发响应式更新。
```

3. **无法监听属性的添加和删除：** 使用 `Object.defineProperty` 无法直接监听到属性的添加和删除。这意味着如果在响应式对象上动态添加或删除属性，Vue 无法自动追踪这些变化。
```javascript
const obj = { name: 'Alice', age: 30 };
// 为对象的属性定义 getter 和 setter,
Object.defineProperty(obj, 'address', {
  get() {
    console.log('Getter 调用');
    return address;
  },
  set(value) {
    console.log('Setter 调用');
    address = value;
  }
});
// 动态添加属性
obj.address = '123 Main St.'; // 不会触发响应式更新
// 无法直接监听属性的添加和删除，因此动态添加或删除属性时，Vue 无法自动追踪这些变化。
```
4. **兼容性问题：** 虽然 `Object.defineProperty` 在现代浏览器中得到广泛支持，但在一些旧版本浏览器中可能存在兼容性问题。
```javascript
const obj = { name: 'Alice', age: 30 };

if (Object.defineProperty) {
  Object.defineProperty(obj, 'name', {
    value: 'Bob',
    writable: false // 在某些旧版本浏览器中可能不支持
  });
} else {
  console.log('您的浏览器不支持 Object.defineProperty');
}

// 一些旧版本浏览器中可能存在兼容性问题。
```
因此，在 Vue 2 中，尽管 `Object.defineProperty` 是实现响应式的核心机制之一，但它也有一些局限性和潜在的性能问题。