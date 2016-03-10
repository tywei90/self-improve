// 立马理财首页抓销售额数据
// <-----------最新版本----------->
// 优化排除算法，保证保证数据没有丢失；另外，新增localstorage存储数据，可以离线统计
//日期格式化，格式化后:2016-03-09 11:20:12
Date.prototype.format = function(format) {
    var o = {
        "M+": this.getMonth() + 1, //month 
        "d+": this.getDate(), //day 
        "h+": this.getHours(), //hour 
        "m+": this.getMinutes(), //minute 
        "s+": this.getSeconds(), //second 
        "q+": Math.floor((this.getMonth() + 3) / 3), //quarter 
        "S": this.getMilliseconds() //millisecond 
    }
    if (/(y+)/.test(format)) format = format.replace(RegExp.$1,
        (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
        if (new RegExp("(" + k + ")").test(format))
            format = format.replace(RegExp.$1,
                RegExp.$1.length == 1 ? o[k] :
                ("00" + o[k]).substr(("" + o[k]).length));
    return format;
}
var data = [];
var data2 = [];
data2[0] = []; //初始化：data2[0]为payAmount值、productId值和username值字符串拼接，作为鉴别数据是否重复(也不能确保唯一性)
data2[1] = []; //初始化：data2[1]为每个用户的购买金额，用于计算总金额
data2[2] = []; //初始化：data2[2]为每个用户的购买时间
var xmlhttp = new XMLHttpRequest();
var url = 'https://www.lmlc.com/s/web/home/user_buying';
// var startTime = (new Date()).format("yyyy-MM-dd hh:mm:ss");
xmlhttp.onreadystatechange = state_Change;
//刚进入页面请求一次
xmlhttp.open("GET", url, true);
xmlhttp.send(null);
//每隔1分钟ajax异步请求一次数据，更新data值
var timer = setInterval(function() {
    xmlhttp.open("GET", url, true);
    xmlhttp.send(null);
}, 60 * 1000);
//回调处理，一次请求的数据是50条
function state_Change() {
    if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
        var now = +new Date();
        var tmp = JSON.parse(xmlhttp.responseText).data;
        for (var i = 0, len = tmp.length; i < len; i++) {
            // if (data2.indexOf(tmp[i]) === -1) { //对于元素为对象的数组不能用indexof方法去判断相等，因为每个对象都是唯一的！
            var arrID = tmp[i].payAmount.toString() + tmp[i].productId + tmp[i].username;
            if (data2[0].indexOf(arrID) === -1) {
                data2[0].push(arrID);
                data2[1].push(tmp[i].payAmount);
                data2[2].push(now - tmp[i].time);
                //购买金额格式化(格式化之后，chrome的输出金额没法按照数字大写排列)
                // if(tmp[i].payAmount >= 10000){
                //     tmp[i].payAmount = (tmp[i].payAmount/10000).toFixed(2).toString().replace(/\.00/,'').replace(/(\.[1-9])0/, "$1") + "万元";
                // }else{
                //     tmp[i].payAmount = (tmp[i].payAmount/1000).toFixed(2).toString().replace(/\.00/,'').replace(/(\.[1-9])0/, "$1") + "千元";
                // }
                //购买时间格式化
                tmp[i].time = (new Date(now - tmp[i].time)).format("yyyy-MM-dd hh:mm:ss");
                //删除不需要的用户头像属性，都是字符串空
                delete tmp[i].userPic;
                //格式化后推入data中
                data.push(tmp[i]);
            }
        }
        return data;
    }
}

function getResult() {
    var totalNum = 0;
    var value = "";
    var endTime = (new Date()).format("yyyy-MM-dd hh:mm:ss");
    var minTime = Math.min.apply(null, data2[2]);
    var firstTime = (new Date(minTime)).format("yyyy-MM-dd hh:mm:ss");
    for (var i = 0, len = data2[1].length; i < len; i++) {
        totalNum += data2[1][i];
    }
    value = (totalNum / 10000).toFixed(2).toString().replace(/\.00/, '').replace(/(\.[1-9])0/, "$1") + "万元";
    // console.log("开始抓取数据时间：" + startTime);
    console.log("开始统计时间：" + firstTime);
    console.log("截止到：" + endTime + "，一共售出：" + value);
    console.table(data); //列表形式打印数组
}

function clearRequest() {
    window.clearInterval(timer);
}




// <------------新版本------------>
// 通过ajax可以自己每隔一段时间去向服务器请求数据，不需要手动刷新页面。
//日期格式化，格式化后:2016-03-04 23:02:12
Date.prototype.format = function(format) {
    var o = {
        "M+": this.getMonth() + 1, //month 
        "d+": this.getDate(), //day 
        "h+": this.getHours(), //hour 
        "m+": this.getMinutes(), //minute 
        "s+": this.getSeconds(), //second 
        "q+": Math.floor((this.getMonth() + 3) / 3), //quarter 
        "S": this.getMilliseconds() //millisecond 
    }
    if (/(y+)/.test(format)) format = format.replace(RegExp.$1,
        (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
        if (new RegExp("(" + k + ")").test(format))
            format = format.replace(RegExp.$1,
                RegExp.$1.length == 1 ? o[k] :
                ("00" + o[k]).substr(("" + o[k]).length));
    return format;
}
var data = [];
var data2 = [];
data2[0] = []; //初始化：data2[0]为payAmount值、productId值和username值字符串拼接，作为鉴别数据是否重复(也不能确保唯一性)
data2[1] = []; //初始化：data2[1]为每个用户的购买金额，用于计算总金额
data2[2] = []; //初始化：data2[2]为每个用户的购买时间
var xmlhttp = new XMLHttpRequest();
var url = 'https://www.lmlc.com/s/web/home/user_buying';
// var startTime = (new Date()).format("yyyy-MM-dd hh:mm:ss");
xmlhttp.onreadystatechange = state_Change;
//刚进入页面请求一次
xmlhttp.open("GET", url, true);
xmlhttp.send(null);
//每隔1分钟ajax异步请求一次数据，更新data值
var timer = setInterval(function() {
    xmlhttp.open("GET", url, true);
    xmlhttp.send(null);
}, 60 * 1000);
//回调处理，一次请求的数据是50条
function state_Change() {
    if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
        var now = +new Date();
        var tmp = JSON.parse(xmlhttp.responseText).data;
        for (var i = 0, len = tmp.length; i < len; i++) {
            // if (data2.indexOf(tmp[i]) === -1) { //对于元素为对象的数组不能用indexof方法去判断相等，因为每个对象都是唯一的！
            var arrID = tmp[i].payAmount.toString() + tmp[i].productId + tmp[i].username;
            if (data2[0].indexOf(arrID) === -1) {
                data2[0].push(arrID);
                data2[1].push(tmp[i].payAmount);
                data2[2].push(now - tmp[i].time);
                //购买金额格式化(格式化之后，chrome的输出金额没法按照数字大写排列)
                // if(tmp[i].payAmount >= 10000){
                //     tmp[i].payAmount = (tmp[i].payAmount/10000).toFixed(2).toString().replace(/\.00/,'').replace(/(\.[1-9])0/, "$1") + "万元";
                // }else{
                //     tmp[i].payAmount = (tmp[i].payAmount/1000).toFixed(2).toString().replace(/\.00/,'').replace(/(\.[1-9])0/, "$1") + "千元";
                // }
                //购买时间格式化
                tmp[i].time = (new Date(now - tmp[i].time)).format("yyyy-MM-dd hh:mm:ss");
                //删除不需要的用户头像属性，都是字符串空
                delete tmp[i].userPic;
                //格式化后推入data中
                data.push(tmp[i]);
            }
        }
        return data;
    }
}

function getResult() {
    var totalNum = 0;
    var value = "";
    var endTime = (new Date()).format("yyyy-MM-dd hh:mm:ss");
    var minTime = Math.min.apply(null, data2[2]);
    var firstTime = (new Date(minTime)).format("yyyy-MM-dd hh:mm:ss");
    for (var i = 0, len = data2[1].length; i < len; i++) {
        totalNum += data2[1][i];
    }
    value = (totalNum / 10000).toFixed(2).toString().replace(/\.00/, '').replace(/(\.[1-9])0/, "$1") + "万元";
    // console.log("开始抓取数据时间：" + startTime);
    console.log("开始统计时间：" + firstTime);
    console.log("截止到：" + endTime + "，一共售出：" + value);
    console.table(data); //列表形式打印数组
}

function clearRequest() {
    window.clearInterval(timer);
}




// <------------老版本------------>
// 从页面的"大家都在抢"获取数据，由于页面不是ajax请求所以只能测出一次刷新后的页面所有数据
//初始化
startTime = (new Date()).toLocaleString();
var arr = [];
var timer = setInterval(function() {
    arr.push($(".m-rob dl dd:first h4").text());
}, 3000);
console.log("开始统计时间：" + startTime);

//因为数据是每隔50次轮播一次，所以要获取真实不重复的数据
function refeshNum() {
    var obj = {};
    var arreal = []; //存放没有重复的数组(数据可能小于真实值，因为如果是同姓且买相同数值的产品只记一次！)
    var len1 = arr.length;
    for (var i = 0; i < len1; i++) {
        if (obj[arr[i]] !== 1) {
            obj[arr[i]] = 1;
            arreal.push(arr[i]);
        }
    };
    //计算总共销售额
    var totalNum = 0;
    var value = "";
    len2 = arreal.length;
    for (var i = 0; i < len2; i++) {
        totalNum += parseInt(arreal[i].replace(/[^\d]/g, ''));
    };
    value = totalNum / 10000 + "万元";
    endTime = (new Date()).toLocaleString();
    arreal.sort(function(a, b) {
        var a_deal = parseInt(a.replace(/[^\d]/g, ''));
        var b_deal = parseInt(b.replace(/[^\d]/g, ''));
        return (a_deal - b_deal);
    });
    console.log("开始统计时间：" + startTime);
    console.log("截止到：" + endTime + "，一共售出：" + value);
    console.log("按照购买金额由小到大排列：");
    console.table(arreal); //列表形式打印数组
    console.log("购买最少的：" + arreal[0].replace(/\d+元/, (parseInt(arreal[0].replace(/[^\d]/g, '')) / 10000).toFixed(2) + "万元"));
    console.log("购买最多的：" + arreal[len2 - 1].replace(/\d+元/, parseInt(arreal[len2 - 1].replace(/[^\d]/g, '')) / 10000 + "万元"));
}

//隔一段时间后执行，一般5分钟就差不多了，数据不再变化差不多就是到目前为止的销售额
refeshNum();
