## 常用数组方法的原理

### forEach
```javascript
Array.prototype.myForEach = function(callback, cn = global || window) {
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
### filter
```javascript
Array.prototype.myFilter = function(callback, cn = global || window) {
  let len = this.length,
      newArr = [],
      i = 0
  
  for(; i < len; i++) {
    // 关键的地方将callbak执行一下，得到的是个boolean
    if(callback.call(cn, this[i], i , this)){
      newArr.push(this[i]);
    }
  }
  return newArr
}

```
### find、findIndex
```javascript
Array.prototype.myFind = function(callback, cn = global || window) {
  let len = this.length,
    i = 0
  
  for(; i < len; i++) {
    // 找到了就返回
    if(callback.call(cn, this[i], i)){
      return this[i]
      // 如果是findIndex, 就返回当前下标
      // return i
    }
  }
}

```
### map
```javascript
//  [1,2,3,4].map((curr,index,arr))
Array.prototype.myMap = function(callback, cn = global || window) {
  let arr =  Array.prototype.slice.call(this), // 不修改原来数组
    mappedArr  = [],
    i = 0;

  for(; i < len; i++) {
    // 需要把当前值、索引、当前数组返回去
    mappedArr.push(
      callback.call(cn, arr[i], i, this)
    );
  }
  return  mappedArr
}

```
### reduce
```javascript
// [1,2,3,4].reduce((initVal,curr,index,arr) => {}, [])
Array.prototype.myReduce = function(fn, initVal) {
  let arr =  Array.prototype.slice.call(this) // 不修改原来数组
  let res, startIndex; 

  res = initVal ? initVal : arr[0]; // 如果不定义初始值，默认第一项
  startIndex = initVal ? 0 : 1; // 决定下标从哪里开始

  for(let i = startIndex; i < arr.length; i++) {
    // 把初始值、当前值、索引、当前数组返回去。
    res = fn.call(null, res, arr[i], i, this); 
  }
  return res
}
```
### flat 拍平数组
```javascript
// 简单版本
const myFlat = function(arr, depth = 1) {
  // 检查入参
  if (!Array.isArray(arr) || depth < 1) {
    return arr;
  }
  let result = [];
  for (let i = 0; i < arr.length; i++) {
    if (Array.isArray(arr[i]) && depth > 0) {
      result = result.concat(myFlat(arr[i], depth - 1));
    } else {
      // 否则，将当前元素添加到结果数组中
      result.push(arr[i]);
    }
  }
  return result;
}
// 完整版本，任意深度
function flat(arr, depth = 1) {
    // 检查参数是否合法
    if (!Array.isArray(arr) || depth < 1) {
        return arr;
    }

    let result = [];

    // 使用递归实现拍平
    function flatten(arr, currentDepth) {
        for (let i = 0; i < arr.length; i++) {
            if (Array.isArray(arr[i]) && currentDepth < depth) {
                flatten(arr[i], currentDepth + 1);
            } else {
                result.push(arr[i]);
            }
        }
    }

    flatten(arr, 1);
    return result;
}

// 测试
const nestedArray = [1, 2, [3, 4, [5, 6]], 7, [8, [9, 10]]];
console.log(flat(nestedArray)); // [1, 2, 3, 4, [5, 6], 7, 8, [9, 10]]
console.log(flat(nestedArray, 2)); // [1, 2, 3, 4, 5, 6, 7, 8, [9, 10]]
console.log(flat(nestedArray, 3)); // [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
console.log(flat(nestedArray, 4)); // [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
console.log(flat(nestedArray, 0)); // [1, 2, [3, 4, [5, 6]], 7, [8, [9, 10]]]
```
