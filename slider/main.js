/**
 * 工资计划页
 * @auther 魏天尧
 */
require(['jquery', 'core', 'app'], function($, Core, App) {
	'use strict';
	// 应用描述对象
	var VueApp = {
		data: {
			/*  设置sliderFlag参数，是为了解决slider在执行动画中，手指同时在滑动，若此时动画结束，
				不会触发touchstart，直接触发touchmove，导致slider位置不对出现闪屏 */
			sliderFlag : 3,
			productIndex: '',
		},
		created: function() {
			var me = this;
			me.products = me.formatProducts(me.products);
			me.initCurrentProduct(me.products);
			this._createAgreement();
		},
		ready: function() {
			var me = this;
			$(window).resize(function() {
				me.initSlider();
			});
			me.initSlider();
		},
		computed: {
			
		},
		methods: {
			selectProd: function(index) {
				var me = this;
				me.sliderFlag = 3;
				if (!$('#main .inner').is(":animated")) {
					// 屏幕宽度
					var screenWidth = $("#main .m-slider").width();
					var unitWidth = screenWidth / 3;
					$('#main .inner').animate({
						left: -unitWidth * index + 'px'
					}, 'fast', function() {
						me.productIndex = index;
					});
				}
			},
			initSlider: function() {
				var me = this;
				var startPageX, startLeftX, startTimeStamp;
				var slider = document.getElementsByClassName('m-slider')[0];
				var inner = document.getElementsByClassName('inner')[0];
				var $inner = $('#main .inner');
				var productNum = me.products.length;
				// 屏幕宽度
				var screenWidth = $("#main .m-slider").width();
				// 产品球的高度
				var ballHeight = $("#main .m-slider").height();
				// 产品球的左右margin
				var ballMargin = (screenWidth - 3 * ballHeight) / 6;
				// 一个产品球的单位宽度
				var unitWidth = ballHeight + 2 * ballMargin;
				// 整个产品球的总宽度
				var innerWidth = (productNum + 2) * unitWidth;
				// 普通球的边框宽度
				// var borderWidth = parseFloat($('.current').siblings('.ball').css('border-width'));
				// 普通球的字体大小
				// var fontSize = parseFloat($('.current').siblings('.ball').css('font-size'));
				// 选中球的字体大小
				// var currentFontSize = parseFloat($('.current').css('font-size'));
				// 初始化slider样式
				$("#main .inner").width(innerWidth);
				// inner的头尾各插一个占位球
				$("#main .inner").css('padding-left', unitWidth + 'px');
				$("#main .inner").css('padding-right', unitWidth + 'px');
				// 设置产品球的margin
				$("#main .ball").css('margin-left', ballMargin + 'px');
				$("#main .ball").css('margin-right', ballMargin + 'px');
				// 使得默认产品居中显示
				$inner.css("left", -unitWidth * me.productIndex + 'px');

				// 添加监听事件
				slider.addEventListener('touchstart', function(event) {
					// 阻止浏览器双击选中，不能再响应
					document.onselectstart = function() {
						return false;
					};
					document.ondragstart = function() {
						return false;
					};
					//  如果这个元素的位置内只有一个手指,且没有在执行动画，sliderFlag正确 
					if (event.targetTouches.length == 1 && !$inner.is(":animated") && me.sliderFlag === 3) {
						me.sliderFlag = 1;
						startTimeStamp = +new Date();
						var touch = event.targetTouches[0];
						startPageX = touch.pageX;
						startLeftX = parseFloat($inner.css("left"));
					}
				});
				slider.addEventListener('touchmove', function(event) {
					event.preventDefault(); // 阻止浏览器默认事件，重要 
					// 如果这个元素的位置内只有一个手指,且没有在执行动画，sliderFlag正确
					if (event.targetTouches.length == 1 && !$inner.is(":animated") && me.sliderFlag !== 3) {
						me.sliderFlag = 2;
						var touch = event.targetTouches[0];
						var movePageX = touch.pageX;
						var deltaDistance = movePageX - startPageX;
						var swipeRight = deltaDistance > 0 ? true : false;
						var toLeftX = startLeftX + deltaDistance;
						// 如果inner的位置超过左右边界一定范围，则不再响应手指滑动
						if (toLeftX <= ballHeight && toLeftX >= -(ballHeight + innerWidth - screenWidth)) {
							// 把元素放在手指所在的位置
							inner.style.left = toLeftX + 'px';
							// $('.current').css('border-width', borderWidth * (1 - deltaDistance / unitWidth) + 'px');
							// $('.current').css('font-size', currentFontSize - (currentFontSize - fontSize) * deltaDistance / unitWidth + 'px');
							// if(swipeRight){
							// 	$('.current').prev().css('border-width', borderWidth * deltaDistance / unitWidth + 'px');
							// 	$('.current').prev().css('font-size', fontSize + (currentFontSize - fontSize) * deltaDistance / unitWidth + 'px');
							// }else{
							// 	$('.current').next().css('border-width', borderWidth * deltaDistance / unitWidth + 'px');
							// 	$('.current').next().css('font-size', fontSize + (currentFontSize - fontSize) * deltaDistance / unitWidth + 'px');
							// }
						}

					}
				});
				slider.addEventListener('touchend', function(event) {
					// touchend时，event.targetTouches.length === 0，用changedTouches事件
					// 没有在执行动画，sliderFlag正确
					if (!$inner.is(":animated") && me.sliderFlag === 2) {
						me.sliderFlag = 3;
						// 速度的最大值，超过则到最后一个
						var SPEEDMAX = 2;
						// 大于此参数，会有启动滑动惯性
						var SPEEDTHRESHOLD = 0.5;
						var endTimeStamp = +new Date();
						var deltaTimeStamp = endTimeStamp - startTimeStamp;
						var touch = event.changedTouches[0];
						var endPageX = touch.pageX;
						var deltaDistance = Math.abs(endPageX-startPageX);
						var endLeftX = parseFloat($inner.css("left"));
						var mod = endLeftX % unitWidth;
						var speed = deltaDistance / deltaTimeStamp;
						var fastToMargin = speed >= SPEEDMAX ? true : false;
						speed = speed >= SPEEDMAX ? SPEEDMAX : speed;
						// 设置一定阈值才触发惯性
						if (Math.abs(endLeftX - startLeftX) > 10 && speed > SPEEDTHRESHOLD && endLeftX < 0 && endLeftX > screenWidth - innerWidth) {
							// 判断左滑还是右滑
							var swipeRight = endLeftX - startLeftX > 0 ? true : false;
							// 根据左右还剩余的产品球个数给定滑动惯性分级别
							var num = swipeRight ? me.productIndex : productNum - me.productIndex - 1;
							// 惯性速度级别，越大说明速度越快
							var speedLevel = Math.round((productNum-1) * speed / SPEEDMAX);
							var speedRate = speedLevel / (productNum - 1);
							var index = me.productIndex + (swipeRight ? -1 : 1) * speedLevel;
							index = index < 0 ? 0 : index;
							index = index > productNum - 1 ? productNum - 1 : index;
							$inner.animate({
								left: -(index + (fastToMargin ? 1 : 0.5) * (swipeRight ? -speedRate : speedRate)) * unitWidth + 'px'
							}, 'normal', function() {
								me.productIndex = index;
								$inner.animate({
									left: -index * unitWidth + 'px'
								}, 'normal');
							});
						} else {
							if (endLeftX >= 0) {
								// inner拉到最左边
								me.productIndex = 0;
								$inner.animate({
									left: '0px'
								}, 'fast');
							} else if (endLeftX <= screenWidth - innerWidth) {
								// inner拉到最右边
								me.productIndex = productNum - 1;
								$inner.animate({
									left: screenWidth - innerWidth + 'px'
								}, 'fast');
							} else {
								if (-mod < 0.5 * unitWidth) {
									me.productIndex = Math.round((-endLeftX + mod) / unitWidth);
									$inner.animate({
										left: Math.round(endLeftX - mod) + 'px'
									}, 'fast');
								} else {
									me.productIndex = Math.round((-endLeftX + mod) / unitWidth + 1);
									$inner.animate({
										left: Math.round(endLeftX - mod - unitWidth) + 'px'
									}, 'fast');
								}
							}
						}
					}
				});
			}
		}

