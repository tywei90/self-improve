---
title: 数组多重筛选条件排序方法，外加一些简单常用的数组方法
date: 2016-11-28 00:07:48
tags:
    - 数组排序
    - 多重条件排序
    - 数组常用方法
---
> *版权声明：本文为博主原创文章，未经博主允许不得转载！*

## 一、问题背景
&emsp;&emsp;前端时间做项目遇到个数组多重筛选条件排序的问题，做的是一个展示用户拥有的红包和加息券页面，但是排序类似于下面这样：

&emsp;&emsp;&emsp;&emsp;a. 先按照截止时间倒序排；
&emsp;&emsp;&emsp;&emsp;b. 若截止时间一样，则按照获得时间倒序排；
&emsp;&emsp;&emsp;&emsp;c. 若获得时间一样时，红包>加息券；
&emsp;&emsp;&emsp;&emsp;d. 剩余则随机。

## 二、解决方法1
&emsp;&emsp;我就琢磨着，这个可以做成一个组件。但是实现的方法其实也就是算法有好多种，我当时最先想到的是数组的自带排序方法sort,在参数function里边去处理排序，确实是可以做到先按照截止时间排序，并且可以提取出截止时间相同的元素组成的数组，但是再这样递归下去直到最后一个条件，然后再归纳数组合并，数据不太好处理，也不容易做成函数的递归。我捉摸着写出了下面的代码：

<!-- more -->

``` js
function sortDeepArr(arr, sortTypes) {
    var i = 0;
    var len = sortTypes.length;
    var arrObj = {}; //对象-->对象-->数组-->对象
    sortArr(arr, sortTypes[i]);

    function sortArr(arr, sortType) {
        var itSelf = arguments.callee;
        arrObj[sortType.name] = {};
        arr.sort(function(item1, item2) {
            if (item1[sortType.name] === item2[sortType.name]) {
                if (!arrObj[sortType.name][item1[sortType.name]]) {
                    arrObj[sortType.name][item1[sortType.name]] = [item1, item2]
                } else {
                    arrObj[sortType.name][item1[sortType.name]].push(item2)
                }
            }
            // console.log(arrObj)
            return (item1[sortType.name] - item2[sortType.name]) * ((sortType.positive || true) ? 1 : -1)
        });
        console.log(arrObj)
        i++
        if (JSON.stringify(arrObj[sortType.name]) === "{}" || i >= len) {
            return
        } else {
            var nextSortType = sortTypes[i + 1];
            $.each(arrObj[sortType.name], function(key, val) {
                console.log(i)
                itSelf(val, nextSortType)
            })
        }
    }
}
```

## 三、解决方法2
&emsp;&emsp;不知道你们乱不乱啊，反正我是放弃了。。。既然这个走不通，我就想，我们能不能遍历所有条件一次选出一个或者几个元素，然后再从头遍历。就是说我们先从所有数组中选出截止时间离我们最近，如果只有一个，直接return，此次循环结束；如果有多个，再从中选出获得时间离我们最近的，如果只有一个，直接return，此次循环结束；如果有多个。。。一直到最后条件c后，return所有剩下的。这样第一轮就算结束了，然后我们将第一轮筛选出来的元素push进outArr里边，并从输入数组inArr中删除这些数组。接着再这样递归下去，直到inArr为空数组。

&emsp;&emsp;这样思路是不是清爽多了？也比较好处理递归的问题。废话少说，附上代码如下：
``` js
define([], function() {
    var sortArrMethods ={
        // 删除数组指定项(index)
        delArrByIndex: function (arr, indexArr) {
            if (arr.length === 0) {
                return [];
            }
            for (var i = 0, len = indexArr.length; i < len; i++) {
                arr.splice(indexArr[i] - i, 1);
            }
        },
        // 选出对象数组某个属性值最大的对象组成的数组
        maxObjArr: function (arr, sortType) {
            var maxData;
            var tmpArr = [];
            var outArr = [];
            if (arr.length === 0) {
                return [];
            }
            for(var i=0,len=arr.length; i<len; i++){
                tmpArr.push(arr[i][sortType]);
            }
            maxData = maxNum(tmpArr);
            for(var i=0,len=arr.length; i<len; i++){
                if (arr[i][sortType] === maxData) {
                    outArr.push(arr[i]);
                }
            }
            return outArr
            // 选出数字组成的数组中最大值
            function maxNum(array) {
                return Math.max.apply({}, array)
            }
        },
        // 选出对象数组某个属性值最小的对象组成的数组
        minObjArr: function (arr, sortType) {
            var minData;
            var tmpArr = [];
            var outArr = [];
            if (arr.length === 0) {
                return [];
            }
            for(var i=0,len=arr.length; i<len; i++){
                tmpArr.push(arr[i][sortType]);
            }
            minData = minNum(tmpArr);
            for(var i=0,len=arr.length; i<len; i++){
                if (arr[i][sortType] === minData) {
                    outArr.push(arr[i]);
                }
            }
            return outArr
            // 选出数字组成的数组中最小值
            function minNum(array) {
                return Math.min.apply({}, array)
            }
        },
        // 多重条件数组筛选方法
        multiSortArr: function(arr, sortLists) {
            var me = this;
            var i = 0;
            var len = sortLists.length;
            var inArr = arr;
            var outArr = [];
            if (inArr.length === 0) {
                return [];
            }
            // 严格模式下arguments.callee正确的使用姿势
            var sortArr = (function sortArrWrap(arr, sortList) {
                    var filterArr = [];
                    if (arr.length === 0) {
                        return;
                    }
                    if (sortList.positive === false) {
                        filterArr = me.maxObjArr(arr, sortList.name);
                    } else {
                        filterArr = me.minObjArr(arr, sortList.name);
                    }
                    if (filterArr.length === 1 || i >= len - 1) {
                        outArr = outArr.concat(filterArr);
                        // 删除原来数组中的对应项
                        for(var k=0,len1=filterArr.length; k<len1; k++){
                            // 每次查找到一个就删除原数组对应项，并更新stringifyInArr，防止有多个相同元素，导致删除错误
                            var stringifyInArr = [];
                            for(var j=0,len2=inArr.length; j<len2; j++){
                                stringifyInArr.push(JSON.stringify(inArr[j]));
                            }
                            var delIndex = stringifyInArr.indexOf(JSON.stringify(filterArr[k]));
                            if (delIndex !== -1) {
                                me.delArrByIndex(inArr, [delIndex]);
                            }
                        }
                    } else {
                        i++;
                        sortArrWrap(filterArr, sortLists[i])
                    }
                })
                // 严格模式下arguments.callee正确的使用姿势
            var loopSortArr = (function loopSortArrWrap() {
                i = 0;
                sortArr(inArr, sortLists[0]);
                if (inArr.length === 0) {
                    return
                }
                loopSortArrWrap();
            })
            loopSortArr();
            return outArr;
        }
    };
    return sortArrMethods
})
```

&emsp;&emsp;去除了原来用jquery的`$.each()`方法遍历数组，改用for循环，解除依赖。这样脚本就是纯原生js写的，没有兼容性问题并且不依赖任何组件，大家放心使用。这里是用的AMD异步模块方案做的组件，没有依赖，输出一个对象，有delArrByIndex、maxObjArr、minObjArr和multiSortArr四个数组方法。

## 四、详细用法说明及测试

> 1、多重数组筛选方法：multiSortArr

针对类似如下的情况：
    a. 先按照截止时间倒序排；
    b. 若截止时间一样，则按照获得时间倒序排；
    c. 若获得时间一样时，红包>加息券；
    d. 剩余则随机。

### for test

``` js
var arr = [{
    invalidTime: 100,
    assignTime: 10,
    type: 0
},{
    invalidTime: 110,
    assignTime: 10,
    type: 1
},{
    invalidTime: 110,
    assignTime: 10,
    type: 0
},{
    invalidTime: 110,
    assignTime: 10,
    type: 0
},{
    invalidTime: 110,
    assignTime: 14,
    type: 0
},{
    invalidTime: 92,
    assignTime: 13,
    type: 0
},{
    invalidTime: 92,
    assignTime: 10,
    type: 1
},{
    invalidTime: 92,
    assignTime: 12,
    type: 0
}]
console.table(arr)
// positive参数为true表示从小到大排序, false从大到小, 默认为true
var outArr = sortArr.multiSortArr(arr, [{name: 'invalidTime', positive: true}, {name: 'assignTime', positive: false}, {name: 'type'}])
console.table(outArr)
```
&emsp;
> 2、删除数组指定项(index)方法：delArrByIndex

### for test

``` js
var arr=[3, 2, 52, 5, 67, 356, 678, 234, 455];
var outArr = sortArr.delArrByIndex(arr, [2,4,7]);
// outArr = [3, 2, 5, 356, 678, 455];
```
&emsp;
> 3、选出对象数组某个属性值最大、最小的对象组成的数组方法：maxObjArr、minObjArr

### for test

``` js
var arr = [{
    invalidTime: 82,
    assignTime: 12,
    type: 0
},{
    invalidTime: 110,
    assignTime: 12,
    type: 1
},{
    invalidTime: 90,
    assignTime: 16,
    type: 0
}]
var outArr1 = sortArr.maxObjArr(arr, 'invalidTime');
var outArr2 = sortArr.minObjArr(arr, 'assignTime');
// 输出
// outArr1 = [{
//     invalidTime: 110,
//     assignTime: 10,
//     type: 1
// }]
// outArr2 = [{
//     invalidTime: 82,
//     assignTime: 12,
//     type: 0
// },{
//     invalidTime: 110,
//     assignTime: 12,
//     type: 1
// }]
```

## 五、总结
&emsp;&emsp;对比上面两种算法的实现，我个人觉得第一种，算法效率更高，因为一次原生数组排序方法就排查出所有第一个条件参数不一样的元素，如果此时没有重复的直接就return了。就算有重复的，后面也就是针对这些重复的进行排查，计算量也是比较小的。但是难就难在数据的存储方式，递归的实现以及最后数据的重组上，同时也比较耗内存，因为需要创建很多数组和对象（如果有比较多重复的话）。第二种，思路比较简单，实现起来方便。但是算法效率并不高，因为是相当于`n + (n-1) + (n-2) + ... + 1 = 1/2*n(n+1)`复杂度，这里就不算n里边还要循环的次数，因为都这个都一样。而第一种看概率，如果没有重复的就直接是1次，重复多了也是比第二种复杂度小。第二种比较耗cpu，因为计算次数多。

&emsp;&emsp;经过测试目前没有发现问题，欢迎大家使用反馈~




