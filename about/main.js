require(['jquery', 'core'], function($, Core) {
	'use strict';
	Core.page.extend({
		cache: {},
		init: function() {
			var ca = this.cache;
			ca.i = 5; //每版放5张图片
			ca.$main = $('#main');
			ca.$goLeft = $(".go-left", ca.$main);
			ca.$goRight = $(".go-right", ca.$main);
			ca.$inner = $(".inner", ca.$main);
			ca.$li = $(".inner li", ca.$main);
			ca.len = ca.$li.length;
			ca.page_count = Math.ceil(ca.len / ca.i); //只要不是整数，就往大的方向取最小的整数
			ca.unitWidth = $(".inner li", ca.$main).width() + 5; //加上图片之间的margin = 5px

			ca.containerWidth = $(".container", ca.$main).width() + 5;
			ca.$indicator = $(".indicator", ca.$main);
			ca.$newsContainer = $(".news-container", ca.$main);
			ca.newsUnitWidth = ca.$newsContainer.width();
			ca.newsMask = $(".newsMask", ca.$main);
			ca.$newsInner = $(".news-inner", ca.$main);
			ca.$paging = $(".paging", ca.$main);
			// console.log(ca.page_count);
			// console.log(ca.unitWidth);
			// console.log(ca.containerWidth);
			this.initEvent();
			this.getNews(0);
			//拓展string方法，给定一个字节数限制，将大于限制后的内容替换成“...”
			String.prototype.ellipFormat = function(num) {
				var bytesCount = 0;
				for (var i = 0; i < this.length; i++) {
					var char = this.charAt(i);
					if (/^[\u0000-\u00ff]$/.test(char)) //匹配双字节
					{
						bytesCount += 1;
					} else {
						bytesCount += 2;
					};
					if (bytesCount > num) {
						return this.substring(0, i) + " ..."; //字节数超过限定
					}
				};
				return this; //字节数未超过限定
			};
		},
		initEvent: function() {
			var me = this;
			var ca = me.cache;
			var totalWidth = (ca.page_count + 1) * ca.i * ca.unitWidth;
			ca.$inner.width(totalWidth);
			// $('body').scrollTop(100);
			// $('body').animate({
			// 	scrollTop: 100
			// }, 200);
			if ($.isIE8) {
				ca.$newsInner.addClass("ie8");
			};
			if (ca.page_count > 1) {
				ca.$goLeft.css("display", "block");
				ca.$goRight.css("display", "block");
				var addLi = "";
				var n = ca.page_count * ca.i - ca.len;
				if (n > 0) {
					for (var i = 0; i < n; i++) {
						var addLi = "<li></li>" + addLi;
					};
					$(addLi).appendTo(ca.$inner);
				};
				// console.log(ca.$li);
				// console.log($(".inner li", ca.$main));
				// console.log(ca.$inner);
				// console.log($(".inner", ca.$main));
				$(".inner li", ca.$main).slice(-5).clone(true).prependTo(ca.$inner);
				ca.$inner.css("left", (-1) * ca.containerWidth + "px");
			};
			ca.$main.delegate('.inner li', 'mouseover', function() {
				// console.log(this);
				$("em", this).show();
				$(".imageMask", this).show();
			});
			ca.$main.delegate('.inner li', 'mouseout', function() {
				// console.log(this);
				$("em", this).hide();
				$(".imageMask", this).hide();
			});
			ca.$main.delegate('.go-left', 'click', function(event) {
				me.goLeft(event);
			});
			ca.$main.delegate('.go-right', 'click', function(event) {
				me.goRight(event);
			});
			ca.$main.delegate('.news-selection span', 'click', function(event) {
				$(this).parent().children("span").removeClass("active");
				$(this).addClass("active");
				if (!ca.$indicator.is(":animated")) {
					if ($(this).hasClass('selection1')) {
						ca.$indicator.animate({
							left: "370px"
						}, 400);
						me.getNews(0);
					} else if ($(this).hasClass('selection2')) {
						ca.$indicator.animate({
							left: "562px"
						}, 400);
						me.getNews(1);
					}
				};
			});
			ca.$main.delegate('.page-num, .prev-page, .next-page', 'click', function(event) {
				if (!$(this).hasClass('current')) {
					me.changePages(event);
				}
			});
		},
		goLeft: function(event) {
			var me = this;
			var ca = me.cache;
			if (!ca.$inner.is(":animated")) {
				ca.$inner.animate({
					left: '+=' + ca.containerWidth
				}, 800, function() {
					$(".inner li", ca.$main).slice(-5).remove();
					$(".inner li", ca.$main).slice(-5).clone(true).prependTo(ca.$inner);
					ca.$inner.css("left", (-1) * ca.containerWidth + "px");
				});
			}
		},
		goRight: function(event) {
			var me = this;
			var ca = me.cache;
			if (!ca.$inner.is(":animated")) {
				ca.$inner.animate({
					left: '-=' + ca.containerWidth
				}, 800, function() {
					$(".inner li", ca.$main).slice(0, 5).remove();
					$(".inner li", ca.$main).slice(0, 5).clone(true).appendTo(ca.$inner);
					ca.$inner.css("left", (-1) * ca.containerWidth + "px");
				});
			}
		},
		getNews: function(num) {
			var me = this;
			var ca = me.cache;
			//产生1000~1500的随机数作为相应时间，ajax效果做的如假包换！
			// var RandNum = Math.random()*500 + 1000;
			// var time = parseInt(RandNum, 10);
			// ca.newsMask.show();
			// setTimeout(function(){
			// 	ca.newsMask.hide();
			// }, time);
			// 开始加载中的提示
			ca.$newsInner.addClass("active");
			ca.newsMask.show();
			Core.getJSON("/s/web/news", {
				"type": num
			}, function(hasError, data) {
				if (hasError) {
					Core.alert("err");
				} else {
					var s = data.retcode;
					if (s == 200) { //联调时待修改
						switch (num) {
							case 0:
								me.showNews(data.data.result0);
								me.showPages(data.data.result0);
								break;
							case 1:
								me.showNews(data.data.result1);
								me.showPages(data.data.result1);
								break;
						}
					} else {
						Core.alert("网络不好，请重试！");
					}
				}
			});
		},
		showNews: function(data) {
			var me = this;
			var ca = me.cache;
			var len = data.length;
			var page_tot = Math.ceil((len + 3) / 10);
			ca.$newsInner.width(ca.newsUnitWidth * page_tot);
			if (page_tot == 1) {
				var text = "";
				if (len == 0) {
					Core.alert("对不起，没有最新的新闻~");
				} else if (len > 0 && len <= 2) {
					for (var i = 0; i < len; i++) {
						text += '<div style="float:left" class="unit news-big"><img src=' + data[i].imgUrl + '/><dl><dt>' + data[i].title.ellipFormat(58) + '</dt><dd>' + data[i].content.ellipFormat(238) + '<a href=' + data[i].jumpUrl + '>查看详情</a></dd></dl></div>';
					};
					text = '<li><div class="part1">' + text + '</div></li>';
				} else {
					var text1 = "";
					var text2 = "";
					for (var i = 0; i < 2; i++) {
						text1 += '<div style="float:left" class="unit news-big"><img src=' + data[i].imgUrl + '/><dl><dt>' + data[i].title.ellipFormat(58) + '</dt><dd>' + data[i].content.ellipFormat(238) + '<a href=' + data[i].jumpUrl + '>查看详情</a></dd></dl></div>';
					};
					for (var i = 2; i < len; i++) {
						text2 += '<div style="float:right" class="unit news-small"><img src=' + data[i].imgUrl + '/><dl><dt>' + data[i].title.ellipFormat(58) + '</dt><dd>' + data[i].content.ellipFormat(64) + '<a href=' + data[i].jumpUrl + '>查看详情</a></dd></dl></div>';
					};
					text = '<li><div class="part1">' + text1 + '</div>' + '<div class="part2">' + text2 + '</div></li>';
				};
				ca.$newsInner.html(text);
				ca.$newsInner.css("left", "0px");
				//取消加载中的提示
				ca.$newsInner.removeClass("active");
				ca.newsMask.hide();
			} else if (page_tot > 1) {
				var arrayPart1 = [];
				var arrayPart2 = [];
				var arrayLi = [];
				//将data按照页面属性分组，赋值初始化为二维数组
				arrayPart1[0] = data.slice(0, 2);
				for (var i = 0; i < page_tot - 1; i++) {
					arrayPart1[i + 1] = data.slice(7 + 10 * i, 12 + 10 * i);
				};
				for (var i = 0; i < page_tot; i++) {
					arrayPart2[i] = data.slice(2 + 10 * i, 7 + 10 * i);
				};
				//将每个组里边的data数据包装成内容为html的字符串
				for (var i = 0; i < page_tot; i++) {
					if (i == 0) {
						for (var j = 0, m = arrayPart1[0].length; j < m; j++) {
							arrayPart1[0][j] = '<div style="float:left" class="unit news-big"><img src=' + arrayPart1[0][j].imgUrl + '/><dl><dt>' + arrayPart1[0][j].title.ellipFormat(58) + '</dt><dd>' + arrayPart1[0][j].content.ellipFormat(238) + '<a href=' + arrayPart1[0][j].jumpUrl + '>查看详情</a></dd></dl></div>';
						};
					} else {
						for (var j = 0, m = arrayPart1[i].length; j < m; j++) {
							arrayPart1[i][j] = '<div style="float:left" class="unit news-small"><img src=' + arrayPart1[i][j].imgUrl + '/><dl><dt>' + arrayPart1[i][j].title.ellipFormat(58) + '</dt><dd>' + arrayPart1[i][j].content.ellipFormat(64) + '<a href=' + arrayPart1[i][j].jumpUrl + '>查看详情</a></dd></dl></div>';
						}
					}
				};
				for (var i = 0; i < page_tot; i++) {
					for (var j = 0, m = arrayPart2[i].length; j < m; j++) {
						arrayPart2[i][j] = '<div style="float:right" class="unit news-small"><img src=' + arrayPart2[i][j].imgUrl + '/><dl><dt>' + arrayPart2[i][j].title.ellipFormat(58) + '</dt><dd>' + arrayPart2[i][j].content.ellipFormat(64) + '<a href=' + arrayPart2[i][j].jumpUrl + '>查看详情</a></dd></dl></div>';
					}
				};
				//组装整合插入html中
				for (var i = 0; i < page_tot; i++) {
					if(i==0){
						arrayLi[i] = '<li><div class="part1">' + arrayPart1[i].join("") + '</div>' + '<div class="part2">' + arrayPart2[i].join("") + '</div></li>';
					}else{
						arrayLi[i] = '<li><div class="part1">' + arrayPart1[i].join("") + '</div>' + '<img class="seperator" src="./img/seperator.png#url" />' + '<div class="part2">' + arrayPart2[i].join("") + '</div></li>';
					}
				};
				ca.$newsInner.html(arrayLi.join(""));
				ca.$newsInner.css("left", "0px");
				//取消加载中的提示
				ca.$newsInner.removeClass("active");
				ca.newsMask.hide();
			}
		},
		showPages: function(data) {
			var me = this;
			var ca = me.cache;
			var len = data.length;
			var page_tot = Math.ceil((len + 3) / 10);
			var page_content = "";
			if (page_tot == 1) {
				var num = len == 0 ? 0 : 1;
				page_content = '<span class="total-num">共' + num + '条记录</span>';
			} else if (page_tot > 1 && page_tot <= 6) {
				page_content = '<span class="total-num">共' + page_tot + '条记录</span><span class="page-num current">1</span>';
				for (var i = 2; i < page_tot + 1; i++) {
					page_content += '<span class="page-num">' + i + '</span>';
				};
				page_content += '<span class="next-page">下一页&gt;</span>';
			} else if (page_tot > 6) {
				page_content = '<span class="total-num">共' + page_tot + '条记录</span><span class="page-num current">1</span>';
				for (var i = 2; i < 5; i++) {
					page_content += '<span class="page-num">' + i + '</span>';
				};
				page_content += '<span class="page-ellipsis">...</span>';
				for (var i = page_tot - 1; i < page_tot + 1; i++) {
					page_content += '<span class="page-num">' + i + '</span>';
				};
				page_content += '<span class="next-page">下一页&gt;</span>';
			}
			ca.$paging.html(page_content);
		},
		changePages: function(event) {
			var me = this;
			var ca = me.cache;
			var page_tot = $("li", ca.$newsInner).length;
			var current_page = parseInt($(".current", ca.$paging).text());
			var diff = 0;
			var $prev = $(".current", ca.$paging).prev();
			var $next = $(".current", ca.$paging).next();
			$(".current", ca.$paging).removeClass("current");
			if (current_page == 1) {
				$(".total-num", ca.$paging).after('<span class="prev-page">&lt;上一页</span>');
			};
			if (current_page == page_tot) {
				ca.$paging.append('<span class="next-page">下一页&gt;</span>');
			};
			if ($(event.target).hasClass('next-page')) {
				if ($next.next().attr('class') == "page-ellipsis") {
					$next.after('<span class="page-num">' + (current_page + 2) + '</span>');
				};
				if (current_page == 5 && page_tot >= 7 && $prev.prev().attr("class") != "page-ellipsis") {
					$(".page-num", ca.$paging).eq(2).remove();
					$(".page-num", ca.$paging).eq(1).after('<span class="page-ellipsis">...</span>');
				};
				if (current_page >= 6 && page_tot >= 8 && current_page < page_tot - 1 && $prev.prev().attr("class") != "page-ellipsis") {
					$prev.prev().remove();
				};
				if (current_page == page_tot - 4 && $next.next().next().attr("class") == "page-ellipsis") {
					$next.next().next().remove();
				};
				if (current_page == page_tot - 1) {
					$(".next-page").remove();
				};
				diff = (-1) * ca.newsUnitWidth;
				$next.addClass('current');
			} else if ($(event.target).hasClass('prev-page')) {
				if ($prev.prev().attr('class') == "page-ellipsis") {
					$prev.before('<span class="page-num">' + (current_page - 2) + '</span>');
				};
				if (current_page == page_tot - 4 && page_tot >= 7 && $next.next().attr("class") != "page-ellipsis") {
					$(".page-num", ca.$paging).eq(-3).remove();
					$(".page-num", ca.$paging).eq(-2).before('<span class="page-ellipsis">...</span>');
				};
				if (current_page <= page_tot - 5 && page_tot >= 8 && current_page > 2 && $next.next().attr("class") != "page-ellipsis") {
					$next.next().remove();
				};
				if (current_page == 5 && $prev.prev().prev().attr("class") == "page-ellipsis") {
					$prev.prev().prev().remove();
				};
				if (current_page == 2) {
					$(".prev-page").remove();
				};
				diff = ca.newsUnitWidth;
				$prev.addClass('current');
			} else {
				var value = parseInt($(event.target).text());
				diff = (current_page - value) * ca.newsUnitWidth;
				$(event.target).addClass("current");
				if (value == 1) {
					$(".prev-page").remove();
				};
				if (value == page_tot) {
					$(".next-page").remove();
				};
				if (page_tot >= 7) {
					if (value <= 2 && current_page > 2) {
						var page_content = '<span class="total-num">共' + page_tot + '条记录</span>';
						if (value == 2) {
							page_content += '<span class="prev-page">&lt;上一页</span>';
						};
						for (var i = 1; i < 5; i++) {
							if (i == value) {
								page_content += '<span class="page-num current">' + i + '</span>';
							} else {
								page_content += '<span class="page-num">' + i + '</span>';
							}
						};
						page_content += '<span class="page-ellipsis">...</span>';
						for (var i = page_tot - 1; i < page_tot + 1; i++) {
							if (i == value) {
								page_content += '<span class="page-num current">' + i + '</span>';
							} else {
								page_content += '<span class="page-num">' + i + '</span>';
							}
						};
						page_content += '<span class="next-page">下一页&gt;</span>';
						ca.$paging.html(page_content);
					} else if (value >= page_tot - 1 && current_page < page_tot - 1) {
						var page_content = '<span class="total-num">共' + page_tot + '条记录</span><span class="prev-page">&lt;上一页</span>';
						for (var i = 1; i < 3; i++) {
							if (i == value) {
								page_content += '<span class="page-num current">' + i + '</span>';
							} else {
								page_content += '<span class="page-num">' + i + '</span>';
							}
						};
						page_content += '<span class="page-ellipsis">...</span>';
						for (var i = page_tot - 3; i < page_tot + 1; i++) {
							if (i == value) {
								page_content += '<span class="page-num current">' + i + '</span>';
							} else {
								page_content += '<span class="page-num">' + i + '</span>';
							}
						};
						if (value == page_tot - 1) {
							page_content += '<span class="next-page">下一页&gt;</span>';
						};
						ca.$paging.html(page_content);
					} else {
						if ($(event.target).next().next().attr("class") == "page-ellipsis" && value > 2) {
							$(event.target).next().after('<span class="page-num">' + (value + 2) + '</span>');
							if (value + 4 == page_tot) {
								$(event.target).next().next().next().remove();
							};
							if (value == 5) {
								$(event.target).prev().prev().replaceWith('<span class="page-ellipsis">...</span>');
							};
							if (value > 5) {
								$(event.target).prev().prev().remove();
							}
						} else if ($(event.target).next().attr("class") == "page-ellipsis" && value > 2) {
							if (value + 3 == page_tot) {
								$(event.target).next().replaceWith('<span class="page-num">' + (value + 1) + '</span>');
							} else if (value + 4 == page_tot) {
								$(event.target).next().replaceWith('<span class="page-num">' + (value + 1) + '</span>' + '<span class="page-num">' + (value + 2) + '</span>');
							} else if (value + 4 < page_tot) {
								$(event.target).after('<span class="page-num">' + (value + 1) + '</span>' + '<span class="page-num">' + (value + 2) + '</span>');
							};
							if (value == 5) {
								$(event.target).prev().prev().replaceWith('<span class="page-ellipsis">...</span>');
							} else if (value == 6) {
								$(event.target).prev().prev().remove();
								$(event.target).prev().prev().replaceWith('<span class="page-ellipsis">...</span>');
							} else if (value > 6) {
								$(event.target).prev().prev().remove();
								$(event.target).prev().prev().remove();
							}
						} else if ($(event.target).prev().prev().attr("class") == "page-ellipsis" && value < page_tot - 1) {
							$(event.target).prev().before('<span class="page-num">' + (value - 2) + '</span>');
							if (value == 5) {
								$(event.target).prev().prev().prev().remove();
							};
							if (value + 4 == page_tot) {
								$(event.target).next().next().replaceWith('<span class="page-ellipsis">...</span>');
							};
							if (value + 4 < page_tot) {
								$(event.target).next().next().remove();
							}
						} else if ($(event.target).prev().attr("class") == "page-ellipsis" && value < page_tot - 1) {
							if (value == 4) {
								$(event.target).prev().replaceWith('<span class="page-num">' + (value - 1) + '</span>');
							} else if (value == 5) {
								$(event.target).prev().replaceWith('<span class="page-num">' + (value - 2) + '</span>' + '<span class="page-num">' + (value - 1) + '</span>');
							} else if (value > 5) {
								$(event.target).before('<span class="page-num">' + (value - 2) + '</span>' + '<span class="page-num">' + (value - 1) + '</span>');
							};
							if (value + 4 == page_tot) {
								$(event.target).next().next().replaceWith('<span class="page-ellipsis">...</span>');
							} else if (value + 5 == page_tot) {
								$(event.target).next().next().remove();
								$(event.target).next().next().replaceWith('<span class="page-ellipsis">...</span>');
							} else if (value + 5 < page_tot) {
								$(event.target).next().next().remove();
								$(event.target).next().next().remove();
							}
						}
					}
				}
			};
			ca.$newsInner.css("left", "+=" + diff + "px");
		}
	})
});
