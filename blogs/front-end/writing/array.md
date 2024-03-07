# 数组原理

## forEach
```js
Array.prototype.myForEach = function(callback, cn = window) {
  let self = this,
      i = 0,
      len = self.length
  
  for(; i < len; i++) {
    if (typeof callback === 'function') {
      callback.call(cn, self[i], i)
    }
  }
}

```
