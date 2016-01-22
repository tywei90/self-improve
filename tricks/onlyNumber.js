//只能输入数字包括小数点，其他禁止输入
onlyNum: function(data, event) {
    var me = this;
    var ca = me.cache;
    if (!((event.keyCode == 46) || (event.keyCode == 8) || (event.keyCode == 37) || (event.keyCode == 39) 
        || (event.keyCode == 110) || (event.keyCode == 190) || (event.keyCode >= 48 && event.keyCode <= 57) 
        || (event.keyCode >= 96 && event.keyCode <= 105))) {
        if (document.all) {
            window.event.returnValue = false;
        } else {
            window.event.preventDefault();
        };
    } 
},