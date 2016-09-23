new Vue({
    el: '#teal',
    methods: {
        submit: function(event) {
            if (this.content !== '2368') {
                this.content = '';
                $('input').val('');
                alert('密码错误！');
            } else {
                this.isLogin = true;
            }
        },
        changeTheme: function() {
            if (this.currentTheme === this.themeNum) {
                this.currentTheme = 1;
            } else {
                this.currentTheme++;
            }
        }
    },
    watch: {
        'content': function(newVal, oldVal) {
            if (newVal.length >= 4) {
                this.submit();
            }
        },
        currentColor: function(newVal, oldVal) {
            localStorage.setItem('currentColor', newVal);
        },
        currentTheme: function(newVal, oldVal) {
            localStorage.setItem('currentTheme', newVal);
        }
    },
    computed: {
        bgStyle: function() {
            return 'url(./img/bg' + this.currentTheme + '.png) left top repeat fixed ' + this.currentColor;
        }
    },
    created: function() {
        var currentColor = localStorage.getItem('currentColor');
        var currentTheme = localStorage.getItem('currentTheme');
        if (currentColor) {
            this.currentColor = currentColor;
        }
        if (currentTheme) {
            this.currentTheme = currentTheme;
        }
    },
    ready: function() {
        $('.cell').hover(function() {
            $(this).find('.hide').toggle();
        }).mousedown(function(event) {
            event.preventDefault();
            $(this).mousemove(function(event) {
                event.preventDefault();
                console.log('mousemove')
            }).mouseup(function(event) {
                console.log('mouseup')
            });
        });
    },
    data: {
        isLogin: false,
        content: '',
        currentColor: '#3FDCDC',
        currentTheme: 1,
        themeNum: 8,
        websites: [{
            'name': '百度',
            'profile': './img/8.png',
            'href': 'https://www.baidu.com/',
            'account': 'wty2368',
            'password': 'me_N'
        }, {
            'name': 'CSDN博客',
            'profile': './img/1.png',
            'href': 'http://blog.csdn.net/teal01/article/details/52102509',
            'account': 'Teal01',
            'password': 'Csdn_2004'
        }, {
            'name': '新浪博客-前端',
            'profile': './img/2.png',
            'href': 'http://weibo.com/mygroups?gid=4004334981737692&wvr=6&leftnav=1',
            'account': 'wty-236688@163.com',
            'password': 'Sina_weibo_2004'
        }, {
            'name': '京东商城',
            'profile': './img/3.png',
            'href': 'http://www.jd.com/',
            'account': 'tywei',
            'password': 'her'
        }, {
            'name': '淘宝登录',
            'profile': './img/4.png',
            'href': 'https://www.taobao.com/',
            'account': 'wty2368@163.com',
            'password': 'me_N'
        }, {
            'name': '淘宝支付',
            'profile': './img/4.png',
            'href': 'https://www.taobao.com/',
            'account': 'wty2368@163.com',
            'password': 'me_S'
        }, {
            'name': '豆瓣',
            'profile': './img/5.png',
            'href': 'https://www.douban.com/',
            'account': 'wty2368@163.com',
            'password': 'Douban_2004',
        }, {
            'name': '当当',
            'profile': './img/6.png',
            'href': 'http://www.dangdang.com/',
            'account': 'wty2368@163.com',
            'password': 'Dangdang_2004'
        }, {
            'name': '网易邮箱1',
            'profile': './img/7.png',
            'href': 'http://mail.163.com/',
            'account': 'wty2368@163.com',
            'password': 'me_N'
        }, {
            'name': '网易邮箱2',
            'profile': './img/7.png',
            'href': 'http://mail.163.com/',
            'account': 'wty-236688@163.com',
            'password': 'me_T'
        }, {
            'name': '网易邮箱3',
            'profile': './img/7.png',
            'href': 'http://mail.163.com/',
            'account': 'tywei90@163.com',
            'password': 'her'
        }, {
            'name': '腾讯',
            'profile': './img/9.png',
            'href': 'http://www.qq.com/',
            'account': '1024192940',
            'password': 'me_N'
        }, {
            'name': '亚马逊',
            'profile': './img/10.png',
            'href': 'https://www.amazon.cn/',
            'account': 'wty-236688@163.com',
            'password': 'me_S'
        }, {
            'name': '携程',
            'profile': './img/11.png',
            'href': 'http://www.ctrip.com/',
            'account': 'wty2368@163.com',
            'password': 'me_N'
        }, {
            'name': '知乎',
            'profile': './img/12.png',
            'href': 'http://www.zhihu.com/',
            'account': 'wty2368@163.com',
            'password': 'me_N'
        }, {
            'name': 'segmentfault',
            'profile': './img/13.png',
            'href': 'https://segmentfault.com/',
            'account': 'wty2368@163.com',
            'password': '236688'
        }, {
            'name': '慕课网',
            'profile': './img/14.png',
            'href': 'http://www.imooc.com/',
            'account': 'wty2368@163.com',
            'password': '236688'
        }, {
            'name': 'linkedin',
            'profile': './img/15.png',
            'href': 'http://www.linkedin.com',
            'account': '13262269362',
            'password': '236688'
        }]
    }
})
