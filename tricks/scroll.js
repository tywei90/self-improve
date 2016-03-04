//移动端的页面滚动scroll，回顶部
require(['jquery', 'core', "pj.appcore"], function($, Core, AppCore) {
	'use strict';
	Core.page.extend({
		cache: {},
		init: function() {
			var ca = this.cache;
			ca.$main = $('#main');
			ca.scrWid = $(window).width();
			ca.scrHet = $(window).height();
			ca.$returnTop = $('.return-top', ca.$main);
			// console.log($('.return-top'));
			this.initEvent();
		},
		initEvent: function() {
			var me = this;
			var ca = me.cache;
			ca.$main.delegate('.ques, .helpMenu', 'click', function(event) {
				// console.log(this);
				// console.log(event.target);
				// console.log(event.currentTarget);
				// console.log(event.delegateTarget);
				me.clickToggle(event);
			});
			var $ans = $(".detailQues .ques", ca.$main);
			if($ans.length == 1){
				$ans.next().slideDown(400);
				$ans.find('span').css('transform','rotate(180deg)');
			}
			ca.$main.delegate('.lev2', 'click', function(event) {
				// console.log(event.target);
				window.location.href = $(event.target).find('a').attr('href');
			});
			$(window).bind('scroll touchstart touchend touchmove', function() {
				me.toggleTip();
			});
			ca.$main.delegate('.return-top', 'click', function() {
				$('body').animate({
					scrollTop: 0
				}, 400)
			})
		},
		clickToggle: function(event) {
			var me = this;
			var ca = me.cache;
			var scrY = event.clientY; //点击处距离屏幕可视区域顶端的距离
			var scrTop = $(window).scrollTop(); //滚动条距离页面顶端的高度
			// var docHet = $(document).height(); //整个文档的内容高度
			var diff = scrY - ca.scrHet / 2;
			var scrTopNew = scrTop + diff + 'px';
			// console.log('scrTop'+scrTop);
			// console.log('ca.scrHet:'+ca.scrHet);
			// console.log('ca.scrHet:'+docHet);
			event.target = event.currentTarget; //解决了单击箭头没有响应的bug，event.target永远指直接接受事件的对象
			if ($(event.target).next().is(":hidden")) {
				if (diff <= 0) { //如果点击点在屏幕的上半平面
					if (!$(event.target).next().is(":animated")) {
						$(event.target).next().slideDown(400);
						// $(event.target).find('i').attr('class', 'icon icon-arrow-t');
						$(event.target).find('span').css('transform','rotate(180deg)');
					}
				} else {
					if (!$('body').is(":animated")) { //如果点击点在屏幕的下半平面
						// if (scrTop + ca.scrHet == docHet) { //滚动到底部执行事件
							// $(event.target).find('i').attr('class', 'icon icon-arrow-t');
							$(event.target).find('span').css('transform','rotate(180deg)');
							$(event.target).next().slideDown(400,function(){
								var docHet = $(document).height();//如果新的页面超过屏幕高度
								if(docHet>ca.scrHet){
									// console.log(newDocHet-ca.scrHet);
									$('body').animate({
										scrollTop: scrTopNew
									}, 400);
								}
							}); //如果滚动到底部，点击直接打开，消除停顿400s的bug
						// } else { //否则，先上拉再呈现内容
						// 	$('body').animate({
						// 		scrollTop: scrTopNew
						// 	}, 400, function() {
						// 		$(event.target).next().slideDown(400);
						// 		// $(event.target).find('i').attr('class', 'icon icon-arrow-t');
						// 		$(event.target).find('span').css('transform','rotate(180deg)');
						// 	});
						// }
					}
				}
			} else { //再次点击，收起
				if (!$(event.target).next().is(":animated")) {
					$(event.target).next().slideUp(400);
					// $(event.target).find('i').attr('class', 'icon icon-arrow-b');
					$(event.target).find('span').css('transform','rotate(0deg)');
				}
			}
		},
		toggleTip: function() {
			var me = this;
			var ca = me.cache;
			var scrTop = $(window).scrollTop(); //滚动条距离页面顶端的高度
			var docHet = $(document).height(); //整个文档的内容高度
			if (scrTop > 0 && scrTop + ca.scrHet > 0.9 * docHet) {
				if (!ca.$returnTop.is(":animated")) {
					ca.$returnTop.show(100);
				}
			} else {
				if (!ca.$returnTop.is(":animated")) { 
					ca.$returnTop.hide(100);
				}
			}
		}
	})
});
