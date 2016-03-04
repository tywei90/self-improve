// 只允许输入数字包括小数点和限制总字数，其他禁止输入
ca.$main.delegate(".recharge-money input", 'keydown keyup mousedown focusout', function(event) {
    me.handleInput(event);
});
handleInput: function(event) {
    var me = this;
    var ca = me.cache;
    var rechargeNum = parseFloat(ca.$rechargeInput[0].value);
    var limitText = $(".current .limit em", ca.$bankCards).text();
    switch (event.type) {
        case "keydown":
            {
                me.onlyNum(ca.$rechargeInput[0].value, event);
                break;
            }
        case "keyup":
            {
                me.compareNum(rechargeNum, limitText, event);
                break;
            }
        case "focusout":
        case "mousedown":
            {
                var text = ca.$rechargeInput.val().replace(/[^.\d]/g,"");
                ca.$rechargeInput.val(text);
                me.compareNum(rechargeNum, limitText, event);
                break;
            }
    }
},
onlyNum: function(data, event) {
    var me = this;
    var ca = me.cache;
    //输入框仅可输入数字与小数点，其他字符不可输入，且小数点后只能输入两位数字。最多输入12位数字
    if (!((event.keyCode == 46) || (event.keyCode == 8) || (event.keyCode == 37) || (event.keyCode == 39) 
        || (event.keyCode == 110) || (event.keyCode == 190) || (event.keyCode >= 48 && event.keyCode <= 57) 
        || (event.keyCode >= 96 && event.keyCode <= 105))||(/\./.test(data)&&(event.keyCode == 110||event.keyCode == 190))
        ||(((/\.\d{2}/.test(data))||data.length===(/\./.test(data)?13:12)) && event.keyCode!==8 && event.keyCode!==46 && event.keyCode!==37 && event.keyCode!==39)) {
        if (document.all) {
            window.event.returnValue = false;
        } else {
            event.preventDefault();
        };
    } 
},