angular.module('starter.controllers', [])

.run(['$rootScope', 'Chats', function($rootScope, Chats, $ionicModal) {
  $rootScope.newChats = Chats.all();
  $rootScope.refreshBadge = function(striples) {
    $rootScope.$watch(striples, function(newValue, oldValue) {
      $rootScope.badgeNum = 0;
      $rootScope.newChats = striples;
      for (var i = 0, len = striples.length; i < len; i++) {
        if (striples[i].state === "block") {
          $rootScope.badgeNum = $rootScope.badgeNum + striples[i].num;
        }
      };
    })
  };
  $rootScope.theme = "royal";
  $rootScope.refreshBadge($rootScope.newChats);
  $rootScope.openURL = function(url) {
    window.open(url, '_blank', 'location=yes');
  };
  $rootScope.addChats = [{
    id: 4,
    name: '刘健',
    lastText: '[位置]',
    face: 'img/liujian.png',
    num:3,
    state:"block",
    bgColor: 'fff',
    priority:0,
  },{
    id: 5,
    name: 'QQ邮箱',
    lastText: '西安电子科技大学：魏天尧同学，母校诚挚邀请您参加学校研究生培养质量调查，帮助母校教改',
    face: 'img/qqmain.png',
    num: 2,
    state: "block",
    bgColor: 'fff',
    priority:0,
  }, {
    id: 6,
    name: '魏淑君',
    lastText: '恩，拜拜',
    face: 'img/shujun.png',
    num: 1,
    state: "block",
    bgColor: 'fff',
    priority:0,
  }, {
    id: 7,
    name: '王鑫',
    lastText: '好的，前段时间加班多，周五晚上联系你',
    face: 'img/wangxin.png',
    num: 1,
    state: "block",
    bgColor: 'fff',
    priority:0,
  }, {
    id: 8,
    name: '网易金融',
    lastText: '秒杀各宝宝，易钱袋收益率达10%！',
    face: 'img/wangyijinrong.png',
    num: 1,
    state: "block",
    bgColor: 'fff',
    priority:0,
  }, {
    id: 9,
    name: '相龙东',
    lastText: '嗯嗯，昨天他给我说了',
    face: 'img/longdong.png',
    num: 3,
    state: "block",
    bgColor: 'fff',
    priority:0,
  }, {
    id: 10,
    name: '王硕',
    lastText: '研究所不轻松的，我们经常加班。。。',
    face: 'img/wangshuo.png',
    num: 6,
    state: "block",
    bgColor: 'fff',
    priority:0,
  }, {
    id: 11,
    name: '翟华星',
    lastText: '恩，大爷好好休息，明天国考加油！',
    face: 'img/huaxing.png',
    num: 4,
    state: "block",
    bgColor: 'fff',
    priority:0,
  }, {
    id: 12,
    name: '陈昊',
    lastText: '行啊，不说了，你好好休息~',
    face: 'img/chenhao.png',
    num: 6,
    state: "block",
    bgColor: 'fff',
    priority:0,
  }, {
    id: 13,
    name: '常友辉',
    lastText: 'ok',
    face: 'img/youhui.png',
    num: 2,
    state: "block",
    bgColor: 'fff',
    priority:0,
  }, {
    id: 14,
    name: '曾峙垚',
    lastText: '拜拜',
    face: 'img/zhiyao.png',
    num: 1,
    state: "block",
    bgColor: 'fff',
    priority:0,
  }, {
    id: 15,
    name: '徐维佳',
    lastText: '下次一起打球啊~',
    face: 'img/weijia.png',
    num: 1,
    state: "block",
    bgColor: 'fff',
    priority:0,
  }];
}])

.controller('HomeCtrl', function($state, $scope, $timeout) {
  $scope.switchRight = function() {
    $state.go('tab.dash')
  };
  $scope.sites = [{
    srcL: "img/05.jpg",
    introL: '台湾环岛8日7晚跟团游(3钻)·1晚住圆山 爸妈放心游A线 泡汤享乐',
    priceL: 5080,
    srcR: "img/06.jpg",
    introR: '泰国清迈6日4晚自由行·吉祥直飞 春节/寒假畅销产品',
    priceR: 2086,
  }, {
    srcL: "img/07.jpg",
    introL: '日本东京+箱根+京都+大阪6日5晚跟团游(4钻)·2天自由 新宿连住 温泉 神户牛',
    priceL: 6999,
    srcR: "img/08.jpg",
    introR: '韩国济州岛+首尔5日4晚跟团游(4钻)·上海名牌 三飞纯玩好评如潮 旅游狂欢月',
    priceR: 3799,
  }];
  $scope.addSites = [{
    srcL: "img/09.jpg",
    introL: '马尔代夫四季兰达吉拉瓦鲁岛Landaa Giraavaru自由行(5钻)·6日4晚 2沙2水 水飞上岛',
    priceL: 19874,
    srcR: "img/10.jpg",
    introR: '法国尼斯+巴黎自由行·9日7晚 蔚蓝海岸',
    priceR: 5743,
  }, {
    srcL: "img/11.jpg",
    introL: '海南三亚6日5晚跟团游(5钻)·携程自研 五星度假世界 金牌纯玩+99升海景',
    priceL: 3400,
    srcR: "img/12.jpg",
    introR: '鼓浪屿+厦门4日自由行·双飞 1晚鼓浪屿+2晚厦门 0元接机',
    priceR: 626,
  }, {
    srcL: "img/13.jpg",
    introL: '丽江+香格里拉+玉龙雪山5日4晚跟团游(5钻)·[高端特色客栈]避寒真纯玩&暖阳礼包&减1000',
    priceL: 3548,
    srcR: "img/14.jpg",
    introR: '北京5日跟团游(5钻)·出游首选好评如潮 5星万豪/香格里拉/威斯汀',
    priceR: 3446,
  }, {
    srcL: "img/15.jpg",
    introL: '成都+九寨沟+乐山+峨眉山7日6晚跟团游(4钻)·品质全景 THEME西姆2.0+特色餐+晚会 特卖汇',
    priceL: 2403,
    srcR: "img/16.jpg",
    introR: '桂林+漓江+阳朔+龙脊梯田4日3晚跟团游(4钻)·【私家定制】总统之旅 一价全包 春节热卖团',
    priceR: 2269,
  }];
  $scope.load_more = function() {
    $timeout(function() {
      $scope.$apply(function() {
        if ($scope.addSites.length > 0) {
          var Arr = $scope.addSites.shift();
          // console.log($scope.addSites);
          $scope.sites.push(Arr);
          // console.log($scope.sites);
        }
      })
    }, 400);
    $scope.$broadcast("scroll.infiniteScrollComplete");
  };
})

.controller('sideMenu', function($scope, $rootScope, $ionicModal, $ionicSideMenuDelegate, $ionicPopup) {
  $ionicModal.fromTemplateUrl("my-modal.html", {
    scope: $scope,
    animation: "slide-in-up"
  }).then(function(modal) {
    $scope.modal = modal;
  });
  $scope.newUser = {};
  $scope.isLogin = false;
  $scope.flag1 = false;
  $scope.flag2 = false;
  $scope.flag3 = false;
  $scope.openModal = function() {
    $scope.modal.show();
  };
  $scope.closeModal = function() {
    $scope.modal.hide();
    $ionicSideMenuDelegate.toggleLeft();
  };
  $scope.showConfirm = function() {
    $ionicPopup.confirm({
      title: "温馨提示：",
      template: "您确定要注销登录？",
      okText:"确定",
      cancelText:"取消"
    })
    .then(function(res) {
      if(res) {
        $scope.isLogin = false;
        $scope.newUser.account = "";
        $scope.newUser.password = "";
        $scope.newUser.validate = "";
      } else {
        $scope.isLogin = true;
      }
    });
  };
  $scope.login = function() {
    // console.log($scope.newUser.account);
    if ($scope.newUser.account == "wty" && $scope.newUser.password == "123456" && $scope.newUser.validate == "g8pk") {
      $scope.isLogin = true;
      $scope.modal.hide();
      $ionicSideMenuDelegate.toggleLeft();
    } else {
      $scope.isLogin = false;
    }
  };
  //Cleanup the modal when we are done with it!
  $scope.$on("$destroy", function() {
    console.log('modal.$destroy');
    $scope.modal.remove();
  });
  // Execute action on hide modal
  $scope.$on("modal.hidden", function() {
    // Execute action
    console.log('modal.hidden');
  });
  // Execute action on remove modal
  $scope.allThemes = ['royal', 'assertive', 'energized', 'balanced', 'calm', 'positive'];
  $scope.changeTheme = function(theme) {
    $rootScope.className = !$rootScope.className;
    for (var i = 0, len = $scope.allThemes.length; i < len; i++) {
      if ($scope.allThemes[i] == theme && i != len - 1) {
        $rootScope.theme = $scope.allThemes[i + 1];
      } else if ($scope.allThemes[i] == theme && i == len - 1) {
        $rootScope.theme = $scope.allThemes[0];
      }
    }
  };
})

.controller('DashCtrl', function($state, $scope, $cordovaDevice, $cordovaVibration, $cordovaDeviceMotion, $cordovaDialogs) {
  $scope.switchRight = function() {
    $state.go('tab.chats')
  };
  $scope.switchLeft = function() {
    $state.go('tab.home')
  };
  document.addEventListener("deviceready", function() {
    $scope.alert1 = function() {
      navigator.notification.alert(
        'You are the winner!', // 显示信息
        'Game Over', // 标题
        'Done' // 按钮名称
      );
    }
    $scope.alert2 = function() {
      $cordovaDialogs.alert('这是小米手机', '温馨提示', '返回')
        .then(function() {
          // callback success
        });
    };
    $scope.version = "版本号：" + $cordovaDevice.getVersion();
    $cordovaDeviceMotion.getCurrentAcceleration().then(function(result) {
      var X = result.x;
      var Y = result.y;
      var Z = result.z;
      var timeStamp = result.timestamp;
      $scope.motion = "时间戳：" + "timeStamp" + "\n运动方向：" + "x:" + X + "y:" + Y + "z:" + Z;
    }, function(err) {
      // An error occurred. Show a message to the user
    });

    // 震动两秒
    $scope.vibrate = function() {
      console.log("vibrate");
      $cordovaVibration.vibrate(1000);
    };
  }, false);
})

.controller('ChatsCtrl', function($state, $scope, $rootScope, Chats, $ionicActionSheet) {
  $scope.switchRight = function() {
    $state.go('tab.account')
  };
  $scope.switchLeft = function() {
    $state.go('tab.dash')
  };
  $scope.showSheet = function(chat) {
    if (chat.state == 'none' && chat.priority == 0) {
      // Show the action sheet
      $ionicActionSheet.show({
        cancelOnStateChange: true,
        buttons: [{
          text: "标记为未读"
        }, {
          text: "置顶聊天"
        }, ],
        buttonClicked: function(index) {
          if (index == 0) {
            console.log("标记为未读");
            chat.state = "block";
            chat.num = 1;
            $rootScope.refreshBadge($scope.chats);
          } else if (index = 1) {
            console.log("置顶聊天");
            chat.priority = 1;
            chat.bgColor = 'eee';
            chat.index = $scope.chats.indexOf(chat);
            $scope.move(chat, chat.index, 0);
          };
          return true;
        },
        destructiveText: "删除该聊天",
        destructiveButtonClicked: function() {
          console.log("删除该聊天");
          $scope.remove(chat);
          return true;
        }
      });
    }
    else if (chat.state == 'none' && chat.priority == 1) {
      // Show the action sheet
      $ionicActionSheet.show({
        cancelOnStateChange: true,
        buttons: [{
          text: "标记为未读"
        }, {
          text: "取消置顶"
        }, ],
        buttonClicked: function(index) {
          if (index == 0) {
            console.log("标记为未读");
            chat.state = "block";
            chat.num = 1;
            $rootScope.refreshBadge($scope.chats);
          } else if (index = 1) {
            console.log("取消置顶");
            chat.priority = 0;
            chat.bgColor = 'fff';
            var index = $scope.chats.indexOf(chat);
            $scope.move(chat, index, chat.index);
          };
          return true;
        },
        destructiveText: "删除该聊天",
        destructiveButtonClicked: function() {
          console.log("删除该聊天");
          $scope.remove(chat);
          return true;
        }
      });
    }
    else if (chat.state == 'block' && chat.priority == 0) {
      // Show the action sheet
      $ionicActionSheet.show({
        cancelOnStateChange: true,
        buttons: [{
          text: "标记为已读"
        }, {
          text: "置顶聊天"
        }, ],
        buttonClicked: function(index) {
          if (index == 0) {
            console.log("标记为已读");
            chat.state = "none";
            $rootScope.refreshBadge($scope.chats);
          } else if (index = 1) {
            console.log("置顶聊天");
            chat.priority = 1;
            chat.bgColor = 'eee';
            chat.index = $scope.chats.indexOf(chat);
            $scope.move(chat, chat.index, 0);
          };
          return true;
        },
        destructiveText: "删除该聊天",
        destructiveButtonClicked: function() {
          console.log("删除该聊天");
          $scope.remove(chat);
          return true;
        }
      });
    }
    else if(chat.state == 'block' && chat.priority == 1) {
      // Show the action sheet
      $ionicActionSheet.show({
        cancelOnStateChange: true,
        buttons: [{
          text: "标记为已读"
        }, {
          text: "取消置顶"
        }, ],
        buttonClicked: function(index) {
          if (index == 0) {
            console.log("标记为已读");
            chat.state = "none";
            $rootScope.refreshBadge($scope.chats);
          } else if (index = 1) {
            console.log("取消置顶");
            chat.priority = 0;
            chat.bgColor = 'fff';
            var index = $scope.chats.indexOf(chat);
            $scope.move(chat, index, chat.index);
          };
          return true;
        },
        destructiveText: "删除该聊天",
        destructiveButtonClicked: function() {
          console.log("删除该聊天");
          $scope.remove(chat);
          return true;
        }
      });
    }
  };
  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //
  //$scope.$on('$ionicView.enter', function(e) {
  //});
  //Chats对象在services.js里边定义的
  $scope.chats = Chats.all();
  $scope.remove = function(chat) {
    // console.log(chat);
    // console.log(Chats.all());
    Chats.remove($scope.chats, chat);
    $rootScope.refreshBadge($scope.chats);
    var index = $scope.chats.indexOf(chat);
    for(var i=0,len=$scope.chats.length; i<len; i++){
      if($scope.chats[i].priority==1 && $scope.chats[i].index>=index){
        $scope.chats[i].index = $scope.chats[i].index-1;
      }
    }
  };
  $scope.flag = {
    showDelete: false,
    showReorder: false
  };
  $scope.move = function(chat, fromIndex, toIndex) {
    // console.log(fromIndex);
    // console.log(toIndex);
    // console.log(chat);
    $scope.chats.splice(fromIndex, 1);
    $scope.chats.splice(toIndex, 0, chat);
    // console.log(chat);
  };
  $scope.changeBadge = function(chat) {
    if (chat.state === "block") {
      $scope.state = "none";
      $rootScope.badgeNum = $rootScope.badgeNum - chat.num;
    }
  };
  $scope.doRefresh = function() {
    if ($rootScope.addChats.length != 0) {
      var delArr = $rootScope.addChats.splice(0, 3);
      // console.log(delArr);
      // console.log($rootScope.addChats);
      var priority1Array = [];
      var priority0Array = [];
      for(var i=0,len=$scope.chats.length; i<len; i++){
        if($scope.chats[i].priority == 1){
          priority1Array.push($scope.chats[i]);
          $scope.chats[i].index = $scope.chats[i].index + 3;
        }else if($scope.chats[i].priority == 0){
          priority0Array.push($scope.chats[i]);
        }
      };
      $scope.chats = priority1Array.concat(delArr.concat(priority0Array));
      $rootScope.refreshBadge($scope.chats);
    }
    $scope.$broadcast("scroll.refreshComplete");
  }
})

.controller('ChatDetailCtrl', function($state, $rootScope, $scope, $stateParams, Chats) {
  $scope.chat = Chats.get($rootScope.newChats, $stateParams.chatId);
  $scope.switchLeft = function() {
    $state.go('tab.chats')
  };
})

.controller('AccountCtrl', function($state, $scope, $ionicPopup, $cordovaVibration, $cordovaNativeAudio, $timeout) {
  $scope.switchLeft = function() {
    $state.go('tab.chats')
  };
  $scope.items = [{
    text: "接受新消息通知",
    selected: true
  }, {
    text: "通知显示消息详情",
    selected: true
  }, {
    text: "朋友圈照片更新",
    selected: true
  }];
  $scope.banners = [{
    label: "HTML5"
  }, {
    label: "CSS3"
  }, {
    label: "ES6"
  }, {
    label: "JQuery"
  }, {
    label: "AngularJS"
  }, {
    label: "Ionic"
  }, {
    label: "Phonegap"
  }, {
    label: "React"
  }, {
    label: "Bootstrap"
  }, {
    label: "Vue.js"
  }, ];
  $scope.flag = false;
  $scope.chooseAll = function() {
    $scope.flag = !$scope.flag;
    for (var i = 0, len = $scope.banners.length; i < len; i++) {
      $scope.banners[i].selected = $scope.flag;
    };
  };
  $scope.reverseChoose = function() {
    for (var i = 0, len = $scope.banners.length; i < len; i++) {
      $scope.banners[i].selected = !$scope.banners[i].selected;
    };
  };
  $scope.showResult = function() {
    var num = 0;
    for (var i = 0, len = $scope.banners.length; i < len; i++) {
      num = $scope.banners[i].selected ? num + 1 : num;
      // console.log(num);
    };
    if (num >= 8) {
      //警告弹出框
      $ionicPopup.alert({
        title: "Excellent！",
        template: "大神，请收下我的膝盖~"
      })
    } else if (num > 4 && num < 8) {
      $ionicPopup.alert({
        title: "Good！",
        template: "您是一个合格的web前端开发工程师~"
      })
    } else if (num <= 4 && num > 0) {
      $ionicPopup.alert({
        title: "Just so so！",
        template: "作为菜鸟的你，请问你每天的压力大不大~"
      })
    } else if (num == 0) {
      $ionicPopup.alert({
        title: "Oh NO！",
        template: "请至少选择一个吧，亲~"
      })
    }
  };
  document.addEventListener("deviceready", function() {
    // $cordovaNativeAudio
    //   .preloadSimple('click', '../lib/audio/music.mp3')
    //   .then(function (msg) {
    //     console.log(msg);
    //   }, function (error) {
    //     alert(error);
    //   });

    // $cordovaNativeAudio
    //   .preloadComplex('music', '../lib/audio/music.mp3', 1, 1)
    //   .then(function (msg) {
    //     console.log(msg);
    //   }, function (error) {
    //     console.error(error);
    //   });

    // $scope.play = function (value2) {
    //   if(value2){
    //     $cordovaNativeAudio.play('click');
    //     $cordovaNativeAudio.loop('music');

    //     // stop 'music' loop and unload
    //     $timeout(function () {
    //       $cordovaNativeAudio.stop('music');

    //       $cordovaNativeAudio.unload('click');
    //       $cordovaNativeAudio.unload('music');
    //     }, 1000 * 10);
    //   }
    // };
    $scope.vibrate = function(value2) {
      if (value2) {
        $cordovaVibration.vibrate(600);
      }
    };
  }, false);
});
