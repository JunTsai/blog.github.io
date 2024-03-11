## Basic

### 创建一个React 项目
>npx create-react-app my-project --template typescript


### Function Component
- **函数即组件：** 函数组件的输入是prop对象，输出是一个JSX对象
```javascript
function App() {
  return <h2>hello world</h2>
}
```
>h2也是一个组件，是React内置的组件，准确说这个组件React.`Intrinsic`Elements.h2;Intrinsic(内部)的


- **属性就是函数的参数：** `JSX=f(props)`
输入决定输出叫做：纯(Pure)，没有副作用(Side Effect)
```javascript
function Greetings({ message }: { message: string }) {
  return <h2>{ message}</h2>
}
function App() {
  return <Greetings message="hello React"></Greetings>
}

```

### 组合和列表关系

- **组合关系：** `多个组件组成一个`。React用JSX直接实现组合关系，很直观！

- **数据映射成列表**
```javascript

function List({ data }: {data: Array<string>}) {
  return <ul>
    {data.map((word) => {
      return <li key={word}>{ word}</li>
    })}
  </ul>
}
```
> key 是React渲染机制的一环，不需要再属性中声明。当React渲染的时候，就会调用组件函数。只要组件的key属性发生变化，React就会重绘组件。如果Key不变，且其他属性也不变，那么就不会发生重绘。
- ['a','b','c'] -> ['a','b','c','d'] (只有一个li新增，但是没有li重绘)
- ['a','b','c'] -> ['c','a'] (a,c不会重绘，删除b)

### 容器组件
```ts
type Children = JSX.Element | JSX.Element[] | null
const Box = ({ children }: { children: Children }) => {
  return <div style={{
    display: 'flex',
    alignItems: 'center',
  }}>
    { children }
  </div>
}
const App = () => {
  return <Box>
    <h1>This is title</h1>
    <p>..</p>
  </Box>
}

export default App
```

### ReactDom
React 在DOM下的渲染需要引入react-dom
```javascript
import ReactDOM from 'react-dom';
ReactDOM.render(<App />, document.getElementById('#root'))
```
之所以这样设计，是因为JSX的结构是一个Virtual DOM, 可以渲染在各个端：
- React Native
- Canvas
- Web
- ......


### 总结
React 的核心设计原则：
- Learn once write anywhere
- 专注做好渲染工作
- Uniform：最简化，标准化表达