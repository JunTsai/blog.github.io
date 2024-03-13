
## Hook的介绍

### 两个方面去理解:
- **第一个是从它的作用:** 
  - 让rect更好的拥抱函数式
  - 更好的解决组合的问题(关注点分离)
- **第二个是从工作原理:** 
  - 从原理上来说，react hook。既然叫做hook，那么它本身的工作原理是属于钩子。当react生命周期发生变化的时候，会触发到他们。

>钩子：一种消息通知机制
钩子的概念和作用，以及在不同场景下的应用。钩子是一种从系统外部监听系统内部变化，并与特定事件挂钩的消息通知机制。例如，Git的web hook用于在代码提交时通知HTTP请求，操作系统的钩子用于在进程创建或变动时通知杀毒软件等。

```javascript
// hook 出现前Class 风格
class Foo extends Component {}
// hook 出现后，react组件看作一个函数
function Foo() {
  return <div>...</div>
}
```

### react hook解决了什么问题:
1. 第一个是从现在这个起来看，它的组件变成了一个可以用来渲染的纯函数。那它就是一个纯的一个渲染的函数，这个叫什么呢？这个其实是`重新定义了react组件`。我们不再需要`关注`生命周期，不再需要`理解`生命周期，不再需要`背诵`生命周期。这样更接近rect中最核心的概念，这个是rect16.8提出之后最核心的概念。他认为我们的组件就是一个接收数据输入的函数。你看它从这种方式上来讲，对react组件的理解，其实是发生了变化的。

2. 第二种就是说通过这个方式细化解决用户的痛点。这里其实是我们是在通过这个useState，它是个状态的钩子。这个状态钩子它其实是在解决状态的问题。use effect你可以看到，但effect我们叫作用，但其实它本质上它解决什么？它解决的是我们需要有一些地方在处理什么，在处理理解之外的程序。

3. 第三个就是让用户以最小代价实现关注点分离。

### hook 是什么？从原理角度分析

>Hook本质上是一种消息机制；Hook的作用就是从系统外部监听某个系统内部的变化，并和某种特定事件挂钩。所以hook的实现是两个方面：
>- 被监听的实体在特定情况下发送消息给Hook
>- Hook对象收到这种消息完成某个具体的工作

`React Hook`在干嘛？
- react某种特定状态发生变化时会通知hook，然后hook在完成某个特定行为；
- 例如useEffect,当react渲染的时候就会触发这个Hook，如果这个hook的依赖发生变化，就会执行这个hook上关联的函数；
- 而useState，是一个反向的hook，当用户设置状态变更的时候，会反向触发React的更新;

### API
- **useState**
> 作用： 管理状态，并当状态发生变化的时候,反向通知React重绘
通知方向： state hook -> React Component -> render
```ts
import { useState } from "react";

export default function () {
  // const [count, setCount] = useState(0)
  // const [count, setCount] = useState<number>(0)
  const [count, setCount] = useState(() => 0)

  return <div>
    {count}
    {/* x => x + 1 这种写法不存在竞争条件问题，他不是一个闭包中去读一个值 */}
    <button onClick={() => setCount(x => x +1 )}>+</button>
  </div>
 
}
```
总结：useState可以解成react之外的空间的状态，在向react内部通知的一个方式。其实是一个dispatch函数，为什么呢? 以为它其是在派发。
- **useEffect**
> 这个hook是当react的渲染的时候，这个hook的函数会根据依赖变化而发生调用。
这个方法一开始都会执行一次，可以用来做什么？当做它的一个组件的一个挂载的一个生命周期和的一个钩子来用。
不能写在if等条件语句下，原因其实是react通过它对这个组件的声明，就像声明这个组件拥有什么样的功能一样。
`useEffect`将渲染之外的事情收敛，集中管理。
- **useRef**
> useRef hook 是React提供的一个用于在函数组件中创建可变的引用的hook。它返回一个可变的ref对象，该对象的current属性被初始化为传入的参数。useRef主要用于在函数组件中保存持久化的值，这些值可以在多次渲染之间保持不变。
```ts
import React, { useRef } from 'react';

function TextInputWithFocusButton() {
  const inputRef = useRef(null);

  const handleClick = () => {
    inputRef.current.focus();
  };

  return (
    <div>
      <input ref={inputRef} type="text" />
      <button onClick={handleClick}>Focus the input</button>
    </div>
  );
}
// 思考下面程序中：

function foo() {
  const x = useRef(1)
  const y = useRef(2)
}
// x的值通过引用对象被保存了下，这个引用对象在哪里？
// 在React的虚拟DOM对象上，useRef保证了什么？
```
`useRef`保证如果是：
1. 相同的虚拟DOM对象（比如foo可以被多个虚拟DOM对象使用）
2. 相同的位置的useRef(比如上面程序中x,y是不同位置的useRef)
useRef帮助我们在一个闭包内缓存per instance, per location的数据。
如果想要根据某种依赖关系更新X，就需要这样做
```ts
function foo() {
  const x = useRef(1)
  useEffect(() => {
    x.current ++     // 更新x的逻辑
  }, [someDeps])
}
// 如果使用useMemo就得到简化了
function foo() {
  const x = useMemo(() => {
    // 重新更新x的逻辑
  }, [deps])
}
```
- **useMemo**
> 允许我们在闭包内根据依赖缓存数据。本质是在依赖发生变化的时候，通知React具体的VirtualDOM实例更新自己内部useMemo对应的状态。
useMemo和useHook非常相似，useHook帮助函数组件在它的多次调用间同步实例数据。

useMemo的优化及使用真实场景：
1.缓存对象(最大价值)
```ts
const node = useMemo<DragNode>(() => new DragNode(), [])
```
2.实现复杂的计算逻辑(微优化)
```ts
function complexComputation(a,b,c) {...}
const result = useMemo( () => complexComputation(a,b,c), [a,b,c])
```
3. 利用useMemo优化,让子组件永不更新（微优化）
```ts
function ParentComponent(props) {
  return useMemo(
    () => <ChildComponent someProp = {props.someProp}/>,
    [props.someProp]
  )
}
function ChildrenComponent() {
  return <div>...</div>
}
```
- useCallback
官方文档中
> `useCallback(fn,deps)` is equivalent to `useMemo(() => fn, deps)`
**关于useMemo& useCallback的总结**
> useMemo 和 useCallback 其实是两个低频能力。总体来说，它们和useRef能力相似的，都是闭包间同步一个 per virtualdom instance per loaction 的值。类似一个静态的，基于词法作用域的缓存。
```ts
// 这段程序是为了防止高频setState带来的组件高频刷新，用useThrottledState 代替useState
function useThrottledState<T>(initialState: T, interval = 16) : 
[T, (val : (T | (T =>T))) => void] {
  const state = useRef<T>(initialState)
  const [, setVer] = useState(0)

  const setState = useMemo(() => {
    const fn = (val: T | (() => T)) => {
      if (isFunction(val)) {
        val = val()
      }
      state.current = val
      setVer(x => x + 1)
    }
    return throttle(fn, interval)
  }, [])
  return [state.current, setState]
}
// 用法，这样无论调用频率如何，最终刷新频率会在每100ms一次。
const [x,setState] = useThrottledState(customData, 100)
```
- useContext
这个Hook将父组件设置的上下文下发，是一种被高频使用，重要的技巧。
>举个例子：
```ts
// 像这样很多组件都依赖的状态就可以用context下发
class User {
  loginStatus: UserStates
   
  public isLoggedIn() : boolen {
    // ...
  }
  public onLoginStatusChanged(handler: Handler) {
    ...
  }
}
```
```ts
import { createContext } from "react"
import User from './User';

const UserContext = createContext(new User())

export default UserContext
```
```ts
import { useContext } from "react";
import User from "./User";
import UserContext from './UserContext'

export default () => {
  const user = useContext(UserContext)

  return <UserContext.Provider value={user}>
    <FooComponent></FooComponent>
  </UserContext.Provider>
}

const FooComponent = () => {
  const context = useContext(UserContext)
  return <div>{ context.name }</div>
}
```
**Context仅仅用于组件间共享的上下文类信息。什么是上下文类，就是系统设计中大部分组件都需要依赖的数据。**

### 几个用Hooks的小技巧
1. 不能用 Hooks + 控制流
```js
if (...) {
  useEffect(() => {

  }, [])
}
```
Hooks是对行为的声明，if-else是分支控制，不是声明的一部分。从理论上不应有声明在控制流之下。在React内部通过Hooks的词法顺序来区分不同的Hook。

2. Stackoverflow

```js
//如果操作不慎，可能会导致StackOverflow
// 下面会代码会一直刷新，无限循环。
const [s, setS] = useState(0)
useEffect(() => {
  setS(x => x + 1)
}, [s])
```

3. Effect的注销
如果一个effect中监听了事件，或者发送了请求，但是有时候在事件响应，请求返回后，组件已经被销毁了，因此要注意手动注销在effect中使用的资源。
```ts
useEffect(() => {
  const unsub = editor.on('some-evnt', () => {

  })
  return () => {}
}, [])
```

4. 多状态更新
多状态更新是，到底用多个useState还是合并用一个大的呢?
没有必须用多个state还是一个对象，要看具体的场景，通常一个useState要解决一类问题。