
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
- useEffect
> 这个hook是当react的渲染的时候，这个hook的函数会根据依赖变化而发生调用。
这个方法一开始都会执行一次，可以用来做什么？当做它的一个组件的一个挂载的一个生命周期和的一个钩子来用。
不能写在if等条件语句下，原因其实是react通过它对这个组件的声明，就像声明这个组件拥有什么样的功能一样。
- useRef
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

```
- useMemo
- useCallback
- useContext