## 封装公共组件

### 为什么
思考：
- React Hooks的架构，封装和复用是怎么做的？
- 在Component Class的时代封装是怎么做的?
- JSX是函数返回的值，Hooks是副作用，封装的Hooks是？
### 依赖属性渲染的组件
有时候组件不需要有内部状态，状态完全由外部提供，这样可以进行简单封装。 
### 受控输入组件
有时一个组件得输入完全依赖与属性，这样得组件内部没有状态，完全受到外部的控制，这样的组件是受控组件。受控组件的优势是设计简单，缺点是增加了更新路径的长度。value的更新需要外部驱动(props.value),
而又需要从内部传出去(onChange)。
```ts
const Input = ({value, onChange}: {
  value: string,
  onChange: Function
}) => {
  // return <input onChange={onChange} value={value}>
  // 这样写整个input都延迟了
  return <input onChange={debounce(onChange)} value={value}>
}
```
### 非受控输入组件
非受控组件会维护内部状态，外部只提供初始值。
```ts
const uncontrolledInput = ({ defaultValue, onChange}: {
  defaultValue: string,
  onChange?: Function
}) => {
  const [value, setValue] = useState<string>(defaulValue)
  useEffect(() => {
    if (value !== defaulValue) {
      onChange && onChange(value)
    }
  }, [value])
  return <input onchange = { e => {
    setValue(e.target.value)
  }}>
}
```

### 兼容受控和非受控组件
在封装组件的时候，往往需要同事支持两种行为
```ts

```