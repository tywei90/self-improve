
<div class="pages"><p><span class="current">1</span>/${data.imgList?size}</p></div>
<ul class="images">
	<#list data.imgList as item>
		<#-- 第一张图片直接加载，否则第一张图片的尺寸和loading图标的位置不好预先控制 -->
		<#if item?counter lt 2>
			<li><img  src="${item.url}"></li>
		<#else>
			<li><img class="lazyload" data-src="${item.url}" src="./img/transparent.png#url"></li>
		</#if>
			<li class="seperator"></li>
	</#list>
</ul>
<div class="return-top"><p>顶部</p></div>

<script type="text/javascript">
require(['jquery'], function($) {
	'use strict';
	var page = {
		// 缓存元素或业务数据
		cache: {},
		init: function() {
			var ca = this.cache;
			ca.RATIO = 1.4375; //PDF一页的高宽比
			ca.SEPERATE = 10; //页分隔行高度10px
			ca.$main = $('#main');
			ca.images = $(".images li img", ca.$main);
			ca.scrWid = $(window).width();
			ca.scrHet = $(window).height();
			ca.docHet = $(document).height(); //整个文档的内容高度
			ca.unitHet1 = ca.scrWid * ca.RATIO;
			ca.unitHet2 = ca.scrWid * ca.RATIO + ca.SEPERATE;
			ca.$returnTop = $('.return-top', ca.$main);
			this.initEvent();
			this.changePage();
			this.toggleTip();
		},
		initEvent: function() {
			var me = this;
			var ca = me.cache;
			var $metaEl = $('meta[name="viewport"]');
			// 设置viewport，使用户可以缩放
			$metaEl.attr('content', 'width=device-width,target-densitydpi=high-dpi,initial-scale=1.0,maximum-scale=2.0,user-scalable=yes,minimal-ui');
			ca.images.height(ca.unitHet1); // 设置懒加载图片的占位图高度,同时强制使所有的图片高度一致
			$(".seperator:last", ca.$main).remove(); // 删除最后一个图片list的分隔行
			// $(".firstImg", ca.images).load(function() {
			// 	$(this).removeClass("loading");
			// });
			var oldScrollTop = $(window).scrollTop();
			var newScrollTop = $(window).scrollTop();
			var timer = window.setInterval(function() {
				oldScrollTop = newScrollTop;
				newScrollTop = $(window).scrollTop();
				// 滚动条在200px的范围内停留0.5s，则认为用户是想加载该页图片的
				if (Math.abs(newScrollTop - oldScrollTop) < 200) {
					me.getLazyIndex(newScrollTop, timer);
				}
			}, 500);
			$(window).bind('scroll', function() {
				me.toggleTip();
				me.changePage();
			});
			ca.$main.delegate('.return-top', 'click', function() {
				$('body').animate({
					scrollTop: 0
				}, 400)
			});
			//处理窗口大小改变，一般为手机的横竖屏转换
			$(window).resize(function() {
				ca.scrWid = $(window).width();
				ca.scrHet = $(window).height();
				ca.docHet = $(document).height();
				ca.unitHet1 = ca.scrWid * ca.RATIO;
				ca.unitHet2 = ca.scrWid * ca.RATIO + ca.SEPERATE;
				ca.images.height(ca.unitHet1);
			});
		},
		changePage: function() {
			var me = this;
			var ca = me.cache;
			var current_page;
			var scrTop = $(window).scrollTop(); //滚动条距离页面顶端的高度
			// console.log(ca.scrHet);
			if(ca.scrWid < ca.scrHet){
				current_page = Math.ceil((scrTop + ca.scrHet - 0.5 * ca.unitHet1) / ca.unitHet2);
			}else{
				current_page = Math.ceil((scrTop + 0.5 * ca.scrHet) / ca.unitHet2);
			}
			$(".current", ca.$main).text(current_page);
		},
		getLazyIndex: function(newScrollTop, timer) {
			var me = this;
			var ca = me.cache;
			if ($(".lazyload", ca.$main).length === 0) {
				window.clearInterval(timer);
				return;
			}
			var index = Math.floor(Math.abs(newScrollTop + (ca.scrHet - ca.unitHet1) / 2) / ca.unitHet2);
			var $index1 = $(ca.images[index]); // 缓存中间值
			var $index2 = $(ca.images[index + 1]);
			if ($index1.hasClass('lazyload')) {
				me.lazyload($index1);
			}
			if ($index2.hasClass('lazyload')) {
				me.lazyload($index2);
			}
		},
		lazyload: function($index) {
			// 图片加载完的回调，将背景loading的gif去掉
			$index.load(function() {
				$index.removeClass("lazyload");
			});
			$index.attr("src", $index.attr("data-src")).removeAttr("data-src");
		},
		toggleTip: function() {
			var me = this;
			var ca = me.cache;
			var scrTop = $(window).scrollTop(); //滚动条距离页面顶端的高度
			if (scrTop > ca.unitHet2) {
				if (!ca.$returnTop.is(":animated")) {
					ca.$returnTop.css("visibility", "visible");
				}
			} else {
				if (!ca.$returnTop.is(":animated")) {
					ca.$returnTop.css("visibility", "hidden");
				}
			}
		}
	};
	$(function() {
		page.init();
	});
});
</script>

<style type="text/less">
	.pages{
		text-align: center;
		font-size: 32/@brem;
		display: flex;
		justify-content: center;
		align-items: center;
		position: fixed;
		width: 100/@brem;
		height: 60/@brem;
		left: 20/@brem;
		top: 20/@brem;
		border-radius: 20/@brem;
		opacity: 0.6;
		color: white;
		background-color: black;
		p{
			margin: auto;
		}
	}
	.images{
		img{
			width: 100%;
		}
		.lazyload{
			background: #eee url("./img/base.gif") center center no-repeat;
		}
		.seperator{
			width: 100%;
			/*要固定px，js要用*/
			height: 10px; 
			background-color: grey;
		}
	}
	.return-top{
		font-size: 28/@brem;
		display: flex;
		justify-content: center;
		align-items: center;
		position: fixed;
		width: 80/@brem;
		height: 80/@brem;
		right: 20/@brem;
		bottom: 20/@brem;
		border-radius: 80/@brem;
		opacity: 0.6;
		color: white;
		background-color: black;
		visibility: hidden;
		p{
			margin: auto;
		}
	}
</style>