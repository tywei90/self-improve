// 立马理财首页抓销售额数据(由于页面不是ajax请求所以只能测出一次刷新后的页面所有数据)
//初始化
startTime = (new Date()).toLocaleString();
var arr = [];
var timer = setInterval(function() {
    arr.push($(".m-rob dl dd:first h4").text());
}, 3000);
console.log("开始统计时间：" + startTime);

//因为数据是每隔50次轮播一次，所以要获取真实不重复的数据
function refeshNum(){
    var obj = {};
    var arreal = []; //没有重复的数组(数据可能小于真实值，因为如果是同姓且买相同数值的产品只记一次！)
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
    arreal.sort(function(a,b){
        var a_deal = parseInt(a.replace(/[^\d]/g, ''));
        var b_deal = parseInt(b.replace(/[^\d]/g, ''));
        return (a_deal-b_deal);
    });
    console.log("开始统计时间：" + startTime);
    console.log("截止到：" + endTime + "，一共售出：" + value);
    console.log("按照购买金额由小到大排列：");
    console.table(arreal); //列表形式打印数组
    console.log("购买最少的：" + arreal[0].replace(/\d+元/, (parseInt(arreal[0].replace(/[^\d]/g, ''))/10000).toFixed(2) + "万元"));
    console.log("购买最多的：" + arreal[len2-1].replace(/\d+元/, parseInt(arreal[len2-1].replace(/[^\d]/g, ''))/10000 + "万元"));
} 

//隔一段时间后执行，一般5分钟就差不多了，数据不再变化差不多就是到目前为止的销售额
refeshNum();