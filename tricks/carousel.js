//页面首尾相接的轮播(注意不是图片)
require(['jquery', 'core', 'fe.pagination#pack'], function($, Core) {
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
			this.initDom();
			this.initEvent();
			// this.init = $.noop;
		},
		initDom: function() {
			var me = this;
			var ca = me.cache;
			var totalWidth = (ca.page_count + 1) * ca.containerWidth;
			// console.log(ca.page_count, ca.containerWidth);
			ca.$inner.width(totalWidth);
			$(window||document||'body').scrollTop(100);
			// $('body').animate({
			// 	scrollTop: 100
			// }, 200);
			if (ca.page_count > 1) {
				// console.log(ca.page_count);
				ca.$goLeft.css("display", "block");
				ca.$goRight.css("display", "block");
				var addLi = "";
				var n = ca.page_count * ca.i - ca.len;
				// console.log(ca.i, ca.len, "=========n:", n);
				if (n > 0) {
					var addLi = [];
					for (var i = 0; i < n; i++) {
						addLi.push("<li></li>");
					};
					// console.log(addLi, ca.$inner);
					$(addLi.join("")).appendTo(ca.$inner);
				};
				// console.log(ca.$li);
				// console.log($(".inner li", ca.$main));
				// console.log(ca.$inner);
				// console.log($(".inner", ca.$main));
				$(".inner li", ca.$main).slice(-5).clone(true).prependTo(ca.$inner);
				ca.$inner.css("left", (-1) * ca.containerWidth + "px");
			};
		},
		initEvent: function() {
			var me = this;
			var ca = me.cache;
			$('.inner li', ca.$main).hover(function() {
				// console.log(this);
				$("em", this).toggle();
				$(".imageMask", this).toggle();
			});
			ca.$main.delegate('.go-left', 'click', function(event) {
				me.goLeft(event);
			});
			ca.$main.delegate('.go-right', 'click', function(event) {
				me.goRight(event);
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
		}
	})
});
