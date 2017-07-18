// 立马理财首页抓销售额数据

// <-----------v3.0----------->
// 1、优化排除算法，保证数据没有丢失；
// 2、根据数据动态调整请求的间隔时间；
// 3、增加定点抢产品时，动态调整请求间隔时间；
// 4、新增localstorage存储数据，可以离线统计
// 5、优化开始统计时间的计算
// 6、最后经测试，代码没有问题，而是首页的数据有问题，不是按照队列性质，中间会有几个数据不一样！！！

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

var data = localStorage.getItem("data")? JSON.parse(window.localStorage.getItem("data")) : [];
var SHOW_TIME = "10:00:00"; //开售时间，24小时制，没有时为空字符串
var INTERVAL = 10; //起始刷新的时间间隔,单位:s
var MAX_INTERVAL = 30*60;
var MIN_INTERVAL = 10;
var ENABLE_ADJUST = true; //在开售“期间”，INTERVAL始终为1，ENABLE_ADJUST=false
var firstTime, timer1;
var data_old = {object: [], string: []}; //获取的前50个数据
var data_new = {object: [], string: []}; //获取的前50个数据
(function(){
    if(data.length !== 0){
       for (var i = 0, len = data.length; i < len; i++) {
            var now = +new Date();
            var arrID = data[i].payAmount.toString() + data[i].productId + data[i].username;
            firstTime = data[data.length-1].time;
            data_new.string.push(arrID);
            //格式化后推入data中
            data_new.object.push(data[i]);
        } 
    }
})();
var xmlhttp = new XMLHttpRequest();
var url = 'https://www.lmlc.com/s/web/home/user_buying';

xmlhttp.onreadystatechange = prepareDate;

//刚进入页面请求一次
xmlhttp.open("GET", url, true);
xmlhttp.send(null);
sendAjax();

// 每隔INTERVAL秒，ajax异步请求一次数据，更新data值
function sendAjax(){
    if(timer1){
        window.clearInterval(timer1);
    }
    timer1 = window.setInterval(function() {
        xmlhttp.open("GET", url, true);
        xmlhttp.send(null);
    }, INTERVAL * 1000);
}


if(SHOW_TIME !== ""){
    var str = (new Date()).format("yyyy-MM-dd hh:mm:ss");
    var arr1 = (str.split(" ")[1]).split(":");
    var arr2 = SHOW_TIME.split(":");
    var ts1 = parseInt(arr1[0])*60*60 + parseInt(arr1[1])*60 + parseInt(arr1[2]);
    var ts2 = parseInt(arr2[0])*60*60 + parseInt(arr2[1])*60 + parseInt(arr2[2]);
    var delta_ts = ts2 - ts1;
    // 检测是否接近开售时间，提前设定INTERVAL值
    var timer2 = window.setInterval(function() {
        delta_ts--;
        //确保一定能在开售之前检测到
        if(delta_ts > -15 * 60 && delta_ts < MAX_INTERVAL + 5){
            if(ENABLE_ADJUST){
                ENABLE_ADJUST = false;
                INTERVAL = 1;
                sendAjax();
            }
        }else{
            if(!ENABLE_ADJUST){
                ENABLE_ADJUST = true;
            }
        }
    }, 1000);
}

//回调处理，一次请求的数据是50条
function prepareDate() {
    data_old = null; //每次循环清空data_old对象
    data_old = JSON.parse(JSON.stringify(data_new)); // a = b, 引用类型变量(包括对象, 数组)不能直接赋值, 否则b对象变化, a也跟着变了
    
    if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
        var now = +new Date();
        var tmp = JSON.parse(xmlhttp.responseText).data;
        
        // 开始统计时间的计算
        if(data_new.string.length === 0){
            firstTime = (new Date(now - tmp[(tmp.length-1)].time)).format("yyyy-MM-dd hh:mm:ss");
        }
        
        // 每次循环清空data_new对象
        data_new.object = [];
        data_new.string = [];

        for (var i = 0, len = tmp.length; i < len; i++) {
            var arrID = tmp[i].payAmount.toString() + tmp[i].productId + tmp[i].username;
            data_new.string.push(arrID);
            //购买时间格式化
            tmp[i].time = (new Date(now - tmp[i].time)).format("yyyy-MM-dd hh:mm:ss");
            //删除不需要的用户头像属性，都是字符串空
            delete tmp[i].userPic;
            //格式化后推入data中
            data_new.object.push(tmp[i]);
        }
        handleDate(data_old, data_new);
    }
}

function handleDate(data_old, data_new){
    // console.table(data_old.object);
    // console.table(data_new.object);
    // console.log("----------------------------------------");
    if(data_old.string.length === 0){
        var dataStr = JSON.stringify(data_new.object);
        data = JSON.parse(dataStr);
        window.localStorage.setItem("data", dataStr); //转化为json字符串存入localStorage
        return
    }
    var all_string = data_old.string.join("");

    //利用数据是类似队列性质，检查两列数据是否有大段重合来确定新旧数据的分割点
    for (var i = 0, len = data_new.string.length; i < len; i++) {

        if(data_old.string[0] === data_new.string[i]){  //查找可能匹配的分割点，有三种情况
            var index_string = data_new.string.slice(i).join("");

            if(all_string.indexOf(index_string) > -1){  //因为是从前往后的，第一个能匹配的就是正确的分割点
                adjustInterval(i, len/2);
                data = (data_new.object.slice(0, i)).concat(data);
                window.localStorage.setItem("data", JSON.stringify(data));
                return
            }
        }
    }
    adjustInterval(-1, len/2); //此时可能有数据丢失
    data = data_new.object.concat(data);
    window.localStorage.setItem("data", JSON.stringify(data));
}

function adjustInterval(index, threshold){
    if(ENABLE_ADJUST === true){
        if(index === -1){
            INTERVAL = 1;
            sendAjax();
            var warn_str = (new Date()).format("yyyy-MM-dd hh:mm:ss");
            console.warn("在" + warn_str + "时，您可能丢失数据！");
        //可变步长迭代，因为threshold=25，所以这样精度是1s
        }else if(index <= threshold){
            var tmp1 = INTERVAL + 25 * (threshold - index)/threshold;
            if(tmp1 <= MAX_INTERVAL){
                INTERVAL = tmp1;
                sendAjax();
            }else{
                console.warn("您设置的MAX_INTERVAL过小，无效的请求可能会降低性能！");
            }
        }else if(index > threshold){
            var tmp2 = INTERVAL - 25 * (index - threshold)/threshold;
            if(tmp2 >= MIN_INTERVAL){
                INTERVAL = tmp2;
                sendAjax();
            }else{
                console.warn("您设置的MIN_INTERVAL过大，可能有丢失数据的危险！");
            }
        }
    }
}

function getResult() {
    var totalNum = 0;
    var value = "";
    var endTime = (new Date()).format("yyyy-MM-dd hh:mm:ss");
    var data = JSON.parse(window.localStorage.getItem("data"));
    for (var i = 0, len = data.length; i < len; i++) {
        totalNum += data[i].payAmount;
    }
    value = (totalNum / 10000).toFixed(2).toString().replace(/\.00/, '').replace(/(\.[1-9])0/, "$1") + "万元";
    // console.log("开始抓取数据时间：" + startTime);
    console.log("开始统计时间：" + firstTime);
    console.log("截止到：" + endTime + "，一共售出：" + value);
    console.table(data); //列表形式打印数组
}

function clearAll() {
    window.clearInterval(timer1);
    window.clearInterval(timer2);
}




// <------------v2.0------------>
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




// <------------v1.0------------>
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
