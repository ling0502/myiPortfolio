/**********************Phaser v2 強制橫屏模組 (scaleManager.js)**************************** */
var extend = function extend(superCtor, prop) {
    return function() {
        var fnTest = /xyz/.test(function() {
            xyz;
        }) ? /\b_super\b/ : /.*/;

        var _super = superCtor.prototype;
        // The base Class implementation (does nothing)
        function baseClass() {
            if (baseClass.prototype.ctor) {
                baseClass.prototype.ctor.apply(this, Array.from(arguments));
            }
        };
        // 空函数F:
        var F = function F() {};
        // 把F的原型指向Student.prototype:
        F.prototype = superCtor.prototype;
        // F.prototype = Object.create(superCtor.prototype);
        // 把PrimaryStudent的原型指向一个新的F對象，F對象的原型正好指向Student.prototype:
        baseClass.prototype = new F();
        // 把PrimaryStudent原型的构造函数修复为PrimaryStudent:
        baseClass.prototype.constructor = baseClass;

        var prototype = baseClass.prototype;
        if (!_super.ctor) {
            _super.ctor = superCtor;
        }

        // Copy the properties over onto the new prototype
        for (var name in prop) {
            // Check if we're overwriting an existing function
            prototype[name] = typeof prop[name] == "function" && typeof _super[name] == "function" && fnTest.test(prop[name]) ? function(name, fn) {
                return function() {
                    var tmp = this._super;
                    // Add a new ._super() method that is the same method
                    // but on the super-class
                    this._super = _super[name];
                    // The method only need to be bound temporarily, so we
                    // remove it when we're done executing
                    var ret = fn.apply(this, Array.from(arguments));
                    this._super = tmp;
                    return ret;
                };
            }(name, prop[name]) : prop[name];
        }
        return baseClass;
    }();
};

var MyScaleManager = extend(function() {}, {
    ctor: function ctor(gameDiv) {
        this.gameDiv = gameDiv;
        this.proDOM = Phaser.DOM;
        this.isMyLandscapeMode = false;
        if (this.proDOM.getScreenOrientation() != "landscape-primary") {
            //如果当前是竖屏 启动自定义横屏
            this.setMyLandscapeMode(true, true);
        } else {
            this.refresh();
        }
        var BaseDOM = extend(function() {}, Phaser.DOM);

        var MyDOM = extend(BaseDOM, {
            getScreenOrientation: function getScreenOrientation() {
                var orientation = this._super.apply(this, arguments);

                if (document.documentElement.clientWidth !== this.proDocumentWidth || document.documentElement.clientHeight !== this.proDocumentHeight) {
                    Phaser.myScaleManager.refresh(); //刷新界面宽高 非常有用
                    this.proDocumentWidth = document.documentElement.clientWidth;
                    this.proDocumentHeight = document.documentElement.clientHeight;
                }

                if (orientation != "landscape-primary") {
                    //当前是竖屏
                    if (!Phaser.myScaleManager.isMyLandscape()) {
                        //未启动 自定义横屏
                        Phaser.myScaleManager.setMyLandscapeMode(true, true);
                    }
                    return "landscape-primary";
                } else {
                    //切换到横屏模式
                    if (Phaser.myScaleManager.isMyLandscape()) {
                        //关闭自定义横屏模式
                        Phaser.myScaleManager.setMyLandscapeMode(false, true);
                    }
                    return orientation;
                }
            },
            getOffset: function getOffset() {
                var rel = this._super.apply(this, arguments);
                return rel;
            },
            getBounds: function getBounds() {
                var rel = this._super.apply(this, arguments);
                return rel;
            },
            calibrate: function calibrate() {
                var rel = this._super.apply(this, arguments);
                return rel;
            },
            getAspectRatio: function getAspectRatio() {
                var rel = this._super.apply(this, arguments);
                return rel;
            },
            inLayoutViewport: function inLayoutViewport() {
                var rel = this._super.apply(this, arguments);
                return rel;
            }
        });
        Phaser.DOM = new MyDOM();

        var _startPointer = Phaser.Input.prototype.startPointer;
        Phaser.Input.prototype.startPointer = function(event) {
            return _startPointer.call(this, this.copyEvent(event));
        };
        var _updatePointer = Phaser.Input.prototype.updatePointer;
        Phaser.Input.prototype.updatePointer = function(event) {
            return _updatePointer.call(this, this.copyEvent(event));
        };
        var _stopPointer = Phaser.Input.prototype.stopPointer;
        Phaser.Input.prototype.stopPointer = function(event) {
            return _stopPointer.call(this, this.copyEvent(event));
        };
        Phaser.Input.prototype.copyEvent = function(event) {
            if (!Phaser.myScaleManager.isMyLandscape()) {
                //未启动 自定义横屏
                return event;
            }

            var target = event.target;
            var myevent = this.extendCopy(event);
            var _cx = myevent.clientX;
            var _cy = myevent.clientY;
            var _px = myevent.pageX;
            var _py = myevent.pageY;
            myevent.clientX = _cy;
            myevent.clientY = target.clientHeight - _cx;
            myevent.pageX = _py;
            myevent.pageY = target.clientHeight - _px;
            return myevent;
        };
        Phaser.Input.prototype.extendCopy = function(p) {
            var c = {};
            for (var i in p) {
                c[i] = p[i];
            }
            c.uber = p;
            return c;
        };
        var _getParentBounds = Phaser.ScaleManager.prototype.getParentBounds;
        Phaser.ScaleManager.prototype.getParentBounds = function() {
            var rel = _getParentBounds.apply(this, arguments);
            var _width = rel.width;
            var _height = rel.height;
            if (Phaser.myScaleManager.isMyLandscape()) {
                rel.width = _height;
                rel.height = _width;
            }
            return rel;
        };
    },
    boot: function boot(game) {
        this.game = game;
    },
    refresh: function refresh() {
        document.body.style.width = document.documentElement.clientWidth + "px";
        document.body.style.height = document.documentElement.clientHeight + "px";

        if (document.documentElement.clientHeight >= document.documentElement.clientWidth) {
            //竖屏
            this.gameDiv.style.height = document.body.clientWidth + "px";
            this.gameDiv.style.width = document.body.clientHeight + "px";
            this.gameDiv.style.transform = "rotate(90deg)";
            this.gameDiv.style.left = -(document.documentElement.clientHeight - document.documentElement.clientWidth) / 2 + "px";
            this.gameDiv.style.top = (document.documentElement.clientHeight - document.documentElement.clientWidth) / 2 + "px";
        } else {
            //横屏
            this.gameDiv.style.width = document.body.clientWidth + "px";
            this.gameDiv.style.height = document.body.clientHeight + "px";
            this.gameDiv.style.transform = "";
            this.gameDiv.style.left = "";
            this.gameDiv.style.top = "";
        }

        this.wMax = 1280;
        this.hScale = 1;
        this.hTrim = 0;
        this.vScale = 1;
        this.vTrim = 0;
        this.height = this.gameDiv.clientHeight;
        this.width = this.gameDiv.clientWidth;
        this.scale = 1;
        if (this.width > this.wMax) {
            this.scale = this.width / this.wMax;
        }
        if (this.scale < 1) {
            this.scale = 1;
        }

        this.width = this.width / this.scale;
        this.height = this.height / this.scale;
        this.hScale = this.scale;
        this.vScale = this.scale;
        if (this.game && this.game.scale) {
            game.stage.width = game.width;
            game.stage.height = game.height;
            game.scale.width = this.width;
            game.scale.height = this.height;
            if (this.game.scale.scaleMode === Phaser.ScaleManager.USER_SCALE) {
                this.game.scale.setUserScale(this.hScale, this.vScale, this.hTrim, this.vTrim);
            }
            game.scale.setupScale(this.width, this.height);
            game.scale.parentScaleFactor = new Phaser.Point(1, 1);
            game.scale.setGameSize(this.width, this.height);
            game.scale.resetCanvas(this.gameDiv.style.width, this.gameDiv.style.height);
            game.scale.refresh();
        }
    },
    setMyLandscapeMode: function setMyLandscapeMode(setTo, refresh) {
        refresh = refresh || false;
        this.isMyLandscapeMode = setTo;
        if (refresh) {
            this.refresh();
        }
    },
    isMyLandscape: function isMyLandscape() {
        return this.isMyLandscapeMode;
    }

});

/**********************Phaser v2 強制橫屏模組 (scaleManager.js)**************************** */

// import {
//     IsLogin,
//     GameType,
//     GameCostPoint,
//     MemberFreeTimes,
//     MemberPoint,

//     startData,
//     sendScore,
//     PlayerID,
//     PlayerSN,
//     GameParameters,
//     SetSuccessStartData,
//     SetSuccessScoreData,

//     StatusFlag,
//     StatusText,
//     showBoardDialog,
//     showMessageModal,
//     showBoardMessageModal,
//     shareViaLine,
//     shareViaFacebook,

//     MemberWinFlag,
//     SetPreShowDialog,
//     SetCompleteCloseDialog,
// } from '../../js/connect_source.js';

/* * * * phaser 2 * * * */

// 遊戲主畫布
var width = 960;
var height = 540;
//var Phaser = Phaser || {};
var gameDiv = document.getElementById('game');
Phaser.myScaleManager = new MyScaleManager(gameDiv);
var game = new Phaser.Game(width, height, Phaser.AUTO, 'game');
Phaser.myScaleManager.boot();

// 遊玩時間
var timer = 30;
// 歷程
var PlayHistories = '';
var historyNumArray = [];
var historyScoreArray = [];

// 叉子攻擊間格時間
var againTime = 1000;

// 幽靈產生間格時間
var phatomIntervalLim = 1500;
var phatomSIntervalLim = 7500;

// 幽靈移動速度
var phantomVelocityLim = 100;
var phantomVelocityMax = 300;
var phantomSVelocityLim = 550;
var phantomSVelocityMax = 700;

// 幽靈分數
var phantomScore = 100;
var phantomScoreS = 300;

/******* 遊戲數值設定 ********/
var combo = 0;
var scoreBonus = 1;
var phantomY1 = 240;
var phantomY2 = 360;
var phantomY3 = 480;

/******** 條件 *********/
// 有無按過按鈕條件
var freeCost = false;
var pointCost = false;
// 倒數條件
var reciprocalFlag = true;

// 可再叉條件
var atk = true;
// 可殺幽靈條件
var canKill = true;
// mask條件
var maskFlag = true;

/********** 按鈕 ************/
var playBtn;
var FBshare;
var LINEshare;
var startBtn;
var cancleBtn;
var rank;
var login;
var bag;
var leaveBtn;
var restartBtn;

/******** 遊戲物件 ********/

// 遊戲階段
game.State = {};

// 場景
game.background;
game.isAlarm = false;
game.flashBlood;

// UI
game.timeText
game.scoreText;

// 遊戲得分
game.score = 0;

// 遊戲時間
game.timer = timer;

// 背景音樂
game.bgm;

// 叉子
game.fork;

// 點數花費
game.memberPoint;
game.costPoint;
game.freePlay;

/**************************************************************************************/

// boot state 對遊戲進行設置
game.State.boot = {
    preload: function() {
        game.load.image('loading', '../Mark/preloader.gif');
        game.load.image('dauchung', '../Mark/dauchung.png');
        // 螢幕自適應
        game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
        game.scale.pageAlignHorizontally = true;
        game.scale.pageAlignVertically = true;

        this.scale.forcePortrait = false;
        this.scale.refresh();
    },
    create: function() {
        game.scale.onOrientationChange.add(function() {
            if (game.scale.isLandscape) {
                game.scale.correct = true;
                game.scale.setGameSize(width, height);
            } else {
                game.scale.correct = false;
                game.scale.setGameSize(height, width);
            }
        }, this)
        game.state.start('load');
    }
}

// 預載遊戲資材
game.State.load = {
    preload: function() {
        game.add.sprite(game.world.centerX, game.world.centerY - 60, 'dauchung').anchor.setTo(0.5);
        var preloadSprite = game.add.sprite(game.world.centerX - 110, game.world.centerY + 120, 'loading');
        game.load.setPreloadSprite(preloadSprite);

        // 加載資源
        game.load.spritesheet('stamp', '../Mark/stamp.png', 150, 150); // 通關章
        game.load.spritesheet('waiting', '../Mark/waiting.png', 200, 200); // 倒數三秒進遊戲
        game.load.spritesheet('saving', '../Mark/saving.png', 300, 300); // 分數儲存中

        game.load.image('logo', './assets/logo.png');
        game.load.image('menu', './assets/menu.png');
        game.load.image('background', './assets/background.png');
        game.load.image('scoreBack', './assets/scoreBack.png');
        game.load.image('flashBlood', './assets/flashBlood.png');
        game.load.image('timesUp', './assets/timesUp.png');
        game.load.image('teach', './assets/teach.png');
        game.load.image('fork', './assets/fork.png');
        game.load.spritesheet('phantom', './assets/phantom.png', 110, 120, 10); //一般幽靈
        game.load.spritesheet('phantomS', './assets/phantomS.png', 110, 120, 10); //加速幽靈
        game.load.spritesheet('die', './assets/die.png', 110, 120, 10); //死亡特效

        game.load.image('banner', './assets/banner.png');
        game.load.image('freebanner', './assets/freebanner.png');
        game.load.image('costbanner', './assets/costbanner.png');
        game.load.image('tipsbanner', './assets/tipsbanner.png');
        game.load.image('scorebanner', './assets/scorebanner.png');

        game.load.spritesheet('playBtn', './assets/playBtn.png', 150, 80, 2);
        game.load.spritesheet('startBtn', './assets/startBtn.png', 130, 70, 2);
        game.load.spritesheet('cancleBtn', './assets/cancleBtn.png', 130, 70, 2);
        game.load.spritesheet('restartBtn', './assets/restartBtn.png', 130, 70, 2);
        game.load.spritesheet('storeBtn', './assets/storeBtn.png', 130, 70, 2);
        game.load.spritesheet('bagBtn', './assets/bagBtn.png', 130, 70, 2);
        game.load.spritesheet('okBtn', './assets/okBtn.png', 130, 70, 2);
        game.load.spritesheet('LINEshare', './assets/LINEshare.png', 45, 45, 2);
        game.load.spritesheet('FBshare', './assets/FBshare.png', 45, 45, 2);
        game.load.spritesheet('login', './assets/login.png', 80, 80, 2);
        game.load.spritesheet('rank', './assets/rank.png', 80, 80, 2);
        game.load.spritesheet('bag', './assets/bag.png', 80, 80, 2);

        game.load.bitmapFont('BMFont_White', '../Font/BMFont_White.png', '../Font/BMFont_White.fnt');

        game.load.audio('bgm', './assets/audio/bgm.mp3');
        game.load.audio('pyo', './assets/audio/pyo.mp3');
        game.load.audio('attack', './assets/audio/attack.mp3');
        game.load.audio('timesUp', './assets/audio/timesUp.mp3');
        game.load.audio('click', './assets/audio/click.mp3');
    },

    create: function() {
        game.stage.disableVisibilityChange = true; // 離開畫面遊戲繼續

        // 綁定connect.js功能
        // SetPreShowDialog(PreShowDialog);
        // SetCompleteCloseDialog(completeCloseDialog);
        // SetSuccessStartData(successStartData);
        // SetSuccessScoreData(successScoreData);

        game.state.start('start');
    }
};

// 遊戲開始介面與設定
game.State.start = {
    init: function() {
        // 遊戲設定
        this.setting();
    },
    create: function() {
        game.add.image(0, 0, 'menu');
        var logo = game.add.image(game.world.centerX, -50, 'logo');
        logo.anchor.setTo(0.5);
        game.add.tween(logo).to({ y: 100 }, 1000, Phaser.Easing.Bounce.Out, true);

        playBtn = AddButton(game.world.centerX, game.world.centerY + 200, 'playBtn', 0.5, 'click');
        playBtn.alpha = 0;
        playBtn.onInputUp.add(function() {
            var tween = game.add.tween(playBtn).to({ alpha: 0 }, 300, Phaser.Easing.Linear.None, true, 0, 0, false);
            tween.onComplete.add(function() {
                // if (IsLogin && GameType != 'normal') {
                //     game.state.start('cost');
                // } else {
                game.state.start('teach');
                // }
            });
        });
        game.add.tween(playBtn).to({ alpha: 1 }, 500, Phaser.Easing.Linear.None, true, 0, 0, false);

        // if (StatusFlag != 0 && StatusFlag != 5) {
        //     showMessageModal(StatusText);
        // }
    },

    // 遊戲設定
    setting: function() {
        // 背景音樂
        game.bgm = game.add.audio('bgm', 1, true);

        // 分數歸0
        game.score = 0;
        // 歷程重置
        PlayHistories = '';
        historyNumArray = [];
        historyScoreArray = [];
        // 計時器設定
        game.timer = timer;
        // 倒數條件
        reciprocalFlag = true;

        // 有無按過按鈕條件
        freeCost = false;
        pointCost = false;

        /******* 遊戲數值設定 ********/
        combo = 0;
        scoreBonus = 1;

        /******** 條件 *********/
        //倒數三秒音效
        game.isAlarm = false;

        // 可再叉條件
        atk = true;
        // 可殺幽靈條件
        canKill = true;
        // mask條件
        maskFlag = true;
    },
}

// 點數花費
// game.State.cost = {
//     create: function() {
//         game.add.image(0, 0, 'menu');
//         var share = game.add.sprite(game.world.width - 120, game.world.height - 60);
//         FBshare = share.addChild(AddButton(0, 0, 'FBshare', 0.5, 'click'));
//         FBshare.onInputUp.add(function() {
//             shareViaFacebook();
//         });
//         LINEshare = share.addChild(AddButton(60, 0, 'LINEshare', 0.5, 'click'));
//         LINEshare.onInputUp.add(function() {
//             shareViaLine();
//         });

//         /********** 判斷出哪個板子 **********/
//         var board;
//         //每日免費遊玩
//         if (parseInt(MemberFreeTimes, 10) > 0) {
//             freeCost = true;
//             // 免費遊玩板子
//             board = game.add.sprite(game.world.centerX, game.world.centerY, 'freebanner');
//             // 免費遊玩資訊 
//             var freetimesText = board.addChild(game.add.bitmapText(60, 30, 'BMFont_White', MemberFreeTimes, 16));
//         } else {
//             if (MemberPoint - GameCostPoint >= 0) {
//                 pointCost = true;
//             }
//             // 花費點數遊玩板子
//             board = game.add.sprite(game.world.centerX, game.world.centerY, 'costbanner');

//             var SgameCostPoint = GameCostPoint.toString(); // 原型態(number)=0 的時候bitmapText無法顯示
//             var SmemberPoint = MemberPoint.toString(); // 原型態(number)=0 的時候bitmapText無法顯示
//             // 花費點數資訊
//             board.addChild(game.add.bitmapText(15, 10, 'BMFont_White', SgameCostPoint, 26)).anchor.setTo(1);
//             // 會員剩餘點數/需花費點數
//             var memberpointText = board.addChild(game.add.bitmapText(50, 32, 'BMFont_White', SmemberPoint, 14));
//         }

//         board.alpha = 0;
//         board.anchor.setTo(0.5);
//         game.add.tween(board).to({ alpha: 1 }, 300, Phaser.Easing.Linear.None, true, 0, 0, false);

//         // 取消按鈕
//         cancleBtn = board.addChild(AddButton(-75, 125, 'cancleBtn', 0.5, 'click'));
//         cancleBtn.onInputUp.add(function() {
//             setTimeout(function() {
//                 startBtn.inputEnabled = false;
//                 window.history.back(); // 返回到前頁
//             }, 200);
//         });
//         // 確定按鈕
//         startBtn = board.addChild(AddButton(75, 125, 'startBtn', 0.5, 'click'));
//         startBtn.onInputUp.add(function() {
//             game.add.tween(board).to({ alpha: 0 }, 300, Phaser.Easing.Linear.None, true, 0, 0, false);
//             share.alpha = 0;
//             cancleBtn.inputEnabled = false;
//             if (freeCost) {
//                 freetimesText.setText(MemberFreeTimes - 1);
//             }
//             if (pointCost) {
//                 memberpointText.setText(MemberPoint - GameCostPoint);
//             }

//             setTimeout(function() {
//                 if (MemberFreeTimes > 0 || parseInt(MemberPoint, 10) >= parseInt(GameCostPoint, 10)) {
//                     game.state.start('teach');
//                 } else {
//                     var tipsboard = game.add.sprite(game.world.centerX, game.world.centerY, 'tipsbanner');
//                     tipsboard.anchor.setTo(0.5);

//                     var backBtn = tipsboard.addChild(AddButton(-75, 125, 'cancleBtn', 0.5, 'click'));
//                     backBtn.onInputUp.add(function() {
//                         setTimeout(function() {
//                             share.alpha = 1;
//                             startBtn.inputEnabled = true;
//                             cancleBtn.inputEnabled = true;
//                             tipsboard.destroy();
//                             game.add.tween(board).to({ alpha: 1 }, 300, Phaser.Easing.Linear.None, true, 0, 0, false);
//                         }, 200);
//                     }, 0, 1, 0);

//                     var storeBtn = tipsboard.addChild(AddButton(75, 125, 'storeBtn', 0.5, 'click'));
//                     storeBtn.onInputUp.add(function() {
//                         window.location.replace('/buycoins'); // 連接到儲值頁
//                     }, 200);
//                 }
//             }, 500);
//         });
//     }
// }

// 遊戲教學
game.State.teach = {
    create: function() {
        try {
            game.bgm.fadeIn(1000);
        } catch (e) {}
        var waitForStart = false;
        var teach = game.add.sprite(0, 0, 'teach');
        teach.inputEnabled = true;
        teach.events.onInputDown.add(function() {
            teach.inputEnabled = false;
            game.add.sound('click').play();

            if (!waitForStart) {
                waitForStart = true;

                // ajax取得遊戲參數
                // startData();
                game.state.start('play');
            }
        });
    }
}

// 遊玩遊戲
game.State.play = {
    create: function() {
        // 背景音樂(跟教學共用)
        // try {
        // game.bgm.fadeIn(3000);
        // } catch (e) {}

        // 開啟碰撞系統
        game.physics.startSystem(Phaser.Physics.ARCADE);

        // 場景
        game.background = game.add.image(0, 0, 'background');
        game.background.inputEnabled = true;
        game.background.input.priorityID = 1;

        //畫面閃紅
        game.flashBlood = game.add.sprite(0, 0, 'flashBlood');
        game.flashBlood.alpha = 0;

        // 叉子
        game.fork = game.add.sprite(game.width / 2, 0, 'fork');
        game.fork.anchor.setTo(0.5, 1);
        game.physics.arcade.enable(game.fork);

        // 幽靈組
        this.phantoms1 = game.add.group();
        this.phantoms1.lastPhantomTime = 0;
        this.phantoms2 = game.add.group();
        this.phantoms2.lastPhantomTime = 0;
        this.phantoms3 = game.add.group();
        this.phantoms3.lastPhantomTime = 0;
        this.phantomsS = game.add.group();
        this.phantomsS.lastPhantomTime = 0;

        this.startUI();
    },

    startUI: function() {
        // game.playerText = game.add.text(70, 50, 'ID: ' + PlayerID, { fill: '#FFF', fontSize: "18px" });
        // game.playerText.alpha = 0;
        // game.playSnText = game.add.text(70, 90, 'SN: ' + PlayerSN, { fill: '#FFF', fontSize: "18px" });
        // game.playSnText.alpha = 0;

        var scoreBack = game.add.image(game.width - 305, 30, 'scoreBack');
        scoreBack.alpha = 0;
        scoreBack.addChild(game.add.bitmapText(60, 20, 'BMFont_White', 'ＴＩＭＥ：', 14));
        scoreBack.addChild(game.add.bitmapText(50, 60, 'BMFont_White', 'ＳＣＯＲＥ：', 12));
        game.timeText = scoreBack.addChild(game.add.bitmapText(185, 20, 'BMFont_White', game.timer, 14));
        game.scoreText = scoreBack.addChild(game.add.bitmapText(170, 60, 'BMFont_White', game.score, 12));

        // 叉子動態
        var tween = game.add.tween(game.fork).to({ y: 150 }, 1500, Phaser.Easing.Sinusoidal.InOut, true, 0, 0, false);
        // 叉子定位後
        tween.onComplete.add(function() {
            // 計時器
            this.timeTimer = game.time.events.loop(Phaser.Timer.SECOND * 1, function() {
                game.timer = game.timer - 1;
                game.timeText.setText(game.timer);
                if (game.timer < 3 && game.timer >= 0) {
                    var tween = game.add.tween(game.flashBlood).to({ alpha: 1 }, 500, Phaser.Easing.Linear.None, true, 0, 0);
                    tween.yoyo(true, 0);
                    if (!game.isAlarm) {
                        game.isAlarm = true;
                        this.soundFx('timesUp', 1, false);
                    }
                }
            }, this);

            // 生成一般幽靈
            this.phatomTimer = game.time.events.loop(phatomIntervalLim, function() {
                var rnd = game.rnd.integerInRange(0, 2);
                if (rnd == 0) {
                    this.generatePhantom1();
                } else if (rnd == 1) {
                    this.generatePhantom2();
                } else {
                    this.generatePhantom3();
                }
            }, this);

            //生成幽靈S
            this.phatomSTimer = game.time.events.loop(phatomSIntervalLim, function() {
                this.generatePhantomS();
            }, this);

            canKill = true;

            // UI出現
            // game.add.tween(game.playerText).to({ alpha: 1 }, 500, Phaser.Easing.Sinusoidal.InOut, true, 0, 0, false);
            // game.add.tween(game.playSnText).to({ alpha: 1 }, 500, Phaser.Easing.Sinusoidal.InOut, true, 0, 0, false);
            game.add.tween(scoreBack).to({ alpha: 1 }, 500, Phaser.Easing.Sinusoidal.InOut, true, 0, 0, false);

            game.background.events.onInputDown.add(function() {
                if (atk) {
                    this.soundFx('attack', 0.8, false);
                    atk = false;
                    var forkTween = game.add.tween(game.fork).to({ y: game.fork.height - 10 }, 200, Phaser.Easing.Sinusoidal.InOut, true, 0, 0, false);
                    forkTween.onComplete.add(function() {
                        canKill = false;
                        if (combo > 0) {
                            var comboText = game.add.bitmapText(game.world.centerX + 180, 150, 'BMFont_White', combo, 20);
                            comboText.addChild(game.add.bitmapText(70, 0, 'BMFont_White', 'ＨＩＴ', 20));
                        }
                        // combo 文字動態
                        setTimeout(function() {
                            if (comboText) {
                                var alphaTween = game.add.tween(comboText).to({ alpha: 0 }, 300, Phaser.Easing.Linear.None, true, 0, 0, false);
                                alphaTween.onComplete.add(function() {
                                    comboText.destroy();
                                });
                            }
                        }, 10);

                        var tween = game.add.tween(game.fork).to({ y: 150 }, againTime, Phaser.Easing.Sinusoidal.InOut, true, 0, 0, false);
                        tween.onComplete.add(function() {
                            canKill = true;
                            atk = true;
                            combo = 0;
                            scoreBonus = 1;
                        }, this);

                    }, this);
                }
            }, this);
        }, this);
    },

    update: function() {
        game.scoreText.setText(game.score);

        // 遊戲結束
        if (game.timer === 0) {
            this.phantoms1.forEachAlive(function(phantom) {
                this.effect(phantom.x, phantom.y, 0.5, 0.5, 'die', 30);
                phantom.destroy();
            }.bind(this))
            this.phantoms2.forEachAlive(function(phantom) {
                this.effect(phantom.x, phantom.y, 0.5, 0.5, 'die', 30);
                phantom.destroy();
            }.bind(this))
            this.phantoms3.forEachAlive(function(phantom) {
                this.effect(phantom.x, phantom.y, 0.5, 0.5, 'die', 30);
                phantom.destroy();
            }.bind(this))
            this.phantomsS.forEachAlive(function(phantom) {
                this.effect(phantom.x, phantom.y, 0.5, 0.5, 'die', 30);
                phantom.destroy();
            }.bind(this))

            if (reciprocalFlag) {
                this.soundFx('pyo', 0.5, false);
                reciprocalFlag = false;
                canKill = false;

                for (var i = 0; i < historyScoreArray.length; i++) {
                    PlayHistories += historyNumArray[i].toString().padStart(2, '0');
                    PlayHistories += historyScoreArray[i].toString().padStart(4, '0');
                }

                var timesUp = game.add.image(game.world.centerX, game.world.centerY, 'timesUp');
                timesUp.alpha = 0;
                timesUp.anchor.setTo(0.5);
                var alphaTween = game.add.tween(timesUp).to({ alpha: 1 }, 1500, Phaser.Easing.Linear.None, true, 0, 0, false);
                alphaTween.onComplete.add(function() {
                    setTimeout(function() {
                        var saving = game.add.sprite(game.world.centerX, game.world.centerY, 'saving');
                        saving.anchor.setTo(0.5);
                        saving.scale.setTo(0.5);
                        saving.animations.add('saving');
                        saving.animations.play('saving', 12, true);

                        // 回傳分數
                        // sendScore(game.score, PlayHistories);
                        game.state.start('over');
                    }, 1200);
                });
            }

            // 移除計時器
            game.time.events.remove(this.timeTimer);
            game.time.events.remove(this.phatomTimer);
            game.time.events.remove(this.phatomSTimer);
            game.timer = 0;

            game.background.inputEnabled = false;
            atk = false;

            if (maskFlag) {
                maskFlag = false;
                game.bgm.fadeOut(1000);
            }
        }

        // 碰撞偵測
        if (canKill) {
            game.physics.arcade.overlap(game.fork, this.phantoms1, function(a, b) {
                b.kill();
                this.soundFx('pyo', 0.5, false);
                this.effect(b.x, b.y, 0.5, 0.5, 'die', 30);

                // 分數計算與獎勵公式
                combo = combo + 1;
                scoreBonus = (combo - 1) * 0.2 + scoreBonus;
                var getPoints = parseInt(phantomScore * scoreBonus);
                this.scoreEff(b.x, b.y, getPoints);
                game.score = game.score + getPoints;
                // console.log(combo, scoreBonus, getPoints, game.score);
            }, null, this);
            game.physics.arcade.overlap(game.fork, this.phantoms2, function(a, b) {
                b.kill();
                this.soundFx('pyo', 0.5, false);
                this.effect(b.x, b.y, 0.5, 0.5, 'die', 30);

                // 分數計算與獎勵公式                
                combo = combo + 1;
                scoreBonus = (combo - 1) * 0.2 + scoreBonus;
                var getPoints = parseInt(phantomScore * scoreBonus);
                this.scoreEff(b.x, b.y, getPoints);
                game.score = game.score + getPoints;
                // console.log(combo, scoreBonus, getPoints, game.score);
            }, null, this);
            game.physics.arcade.overlap(game.fork, this.phantoms3, function(a, b) {
                b.kill();
                this.soundFx('pyo', 0.5, false);
                this.effect(b.x, b.y, 0.5, 0.5, 'die', 30);

                // 分數計算與獎勵公式      
                combo = combo + 1;
                scoreBonus = (combo - 1) * 0.2 + scoreBonus;
                var getPoints = parseInt(phantomScore * scoreBonus);
                this.scoreEff(b.x, b.y, getPoints);
                game.score = game.score + getPoints;
                // console.log(combo, scoreBonus, getPoints, game.score);
            }, null, this);
            game.physics.arcade.overlap(game.fork, this.phantomsS, function(a, b) {
                b.kill();
                this.soundFx('pyo', 0.5, false);
                this.effect(b.x, b.y, 0.5, 0.5, 'die', 30);

                // 分數計算與獎勵公式
                combo = combo + 1;
                scoreBonus = (combo - 1) * 0.2 + scoreBonus;
                var getPoints = parseInt(phantomScoreS * scoreBonus);
                this.scoreEff(b.x, b.y, getPoints);
                game.score = game.score + getPoints;
                // console.log(combo, scoreBonus, getPoints, game.score);
            }, null, this);
        }
    },

    // 得分動態
    scoreEff: function(x, y, value) {
        var valueText = game.add.text(x, y, '+ ' + parseInt(value), { fill: '#FFF', fontSize: "20px" });
        valueText.anchor.setTo(0.5, 0.5);

        game.add.tween(valueText).to({ y: y - 80 }, 800, Phaser.Easing.Linear.None, true, 0, 0, false);
        setTimeout(function() {
            game.add.tween(valueText).to({ alpha: 0 }, 600, Phaser.Easing.Linear.None, true, 0, 0, false);
        }, 200);
        setTimeout(function() {
            valueText.kill()
        }, 700);

        // 紀錄遊戲歷程
        if (historyScoreArray.indexOf(value) == -1) {
            historyScoreArray.push(value);
            historyNumArray[historyScoreArray.indexOf(value)] = 1;
        } else {
            historyNumArray[historyScoreArray.indexOf(value)]++;
        }
    },

    // 特效播放
    effect: function(x, y, anchorX, anchorY, name, frame) {
        var eff = game.add.sprite(x, y, name);
        eff.anchor.setTo(anchorX, anchorY);
        var anim = eff.animations.add(name);
        anim.play(frame, false, true); // (幀數 ,是否循環 ,是否在不循環前提下播完銷毀)
    },

    // 聲音播放
    soundFx: function(name, value, loopFlag) {
        var soundFx = game.add.audio(name, value, loopFlag);
        try {
            soundFx.play();
        } catch (e) {}
    },

    /************************** 幽靈生成 ******************************/

    // 第一排幽靈
    generatePhantom1: function() {
        var phantom1Velocity = game.rnd.integerInRange(phantomVelocityLim, phantomVelocityMax);
        var phantom = this.phantoms1.getFirstExists(false, true, -10, phantomY1, 'phantom');
        phantom.anchor.setTo(0.5, 0.5);
        phantom.scale.x = -1;
        phantom.animations.add('fly');
        phantom.animations.play('fly', 15, true);

        game.physics.arcade.enable(phantom);
        phantom.body.velocity.x = phantom1Velocity;

        phantom.lastFireTime = 0;
        phantom.checkWorldBounds = true; // 檢查邊界
        phantom.outOfBoundsKill = true; // 飛出邊界消除
    },

    // 第二排幽靈
    generatePhantom2: function() {
        var phantom2Velocity = game.rnd.integerInRange(phantomVelocityLim, phantomVelocityMax);
        var phantom = this.phantoms2.getFirstExists(false, true, game.width + 10, phantomY2, 'phantom');
        phantom.anchor.setTo(0.5, 0.5);
        phantom.animations.add('fly');
        phantom.animations.play('fly', 15, true);

        game.physics.arcade.enable(phantom);
        phantom.body.velocity.x = -phantom2Velocity;

        phantom.lastFireTime = 0;
        phantom.checkWorldBounds = true; // 檢查邊界
        phantom.outOfBoundsKill = true; // 飛出邊界消除
    },

    // 第三排幽靈
    generatePhantom3: function() {
        var phantom3Velocity = game.rnd.integerInRange(phantomVelocityLim, phantomVelocityMax);
        var phantom = this.phantoms3.getFirstExists(false, true, -10, phantomY3, 'phantom');
        phantom.anchor.setTo(0.5, 0.5);
        phantom.scale.x = -1;
        phantom.animations.add('fly');
        phantom.animations.play('fly', 15, true);

        game.physics.arcade.enable(phantom);
        phantom.body.velocity.x = phantom3Velocity;

        phantom.lastFireTime = 0;
        phantom.checkWorldBounds = true; // 檢查邊界
        phantom.outOfBoundsKill = true; // 飛出邊界消除
    },

    // 特殊幽靈
    generatePhantomS: function() {
        var yRnd = game.rnd.integerInRange(0, 2);
        var y;
        switch (yRnd) {
            case 0:
                y = phantomY1;
                break;
            case 1:
                y = phantomY2;
            case 2:
                y = phantomY3;
                break;
        }
        var x;
        var directionRnd = game.rnd.integerInRange(0, 1);
        var direction;
        var phantomSVelocity = game.rnd.integerInRange(phantomSVelocityLim, phantomSVelocityMax);
        switch (directionRnd) {
            case 0:
                x = -10;
                direction = -1;
                break;
            case 1:
                x = game.width + 10;
                direction = 1;
                break;
        }
        var phantomSVelocity = game.rnd.integerInRange(phantomSVelocityLim, phantomSVelocityMax);
        var phantom = this.phantomsS.getFirstExists(false, true, x, y, 'phantomS');
        phantom.anchor.setTo(0.5, 0.5);
        phantom.scale.x = direction;
        phantom.animations.add('fly');
        phantom.animations.play('fly', 15, true);

        game.physics.arcade.enable(phantom);
        switch (directionRnd) {
            case 0:
                phantom.body.velocity.x = phantomSVelocity;
                break;
            case 1:
                phantom.body.velocity.x = -phantomSVelocity;
                break;
        }

        phantom.lastFireTime = 0;
        phantom.checkWorldBounds = true; // 檢查邊界
        phantom.outOfBoundsKill = true; // 飛出邊界消除
    },
}

game.State.over = {
    create: function() {
        game.add.image(0, 0, 'background');
        // game.add.text(70, 50, 'ID: ' + PlayerID, { fill: '#FFF', fontSize: "18px" });
        // game.add.text(70, 90, 'SN: ' + PlayerSN, { fill: '#FFF', fontSize: "18px" });

        game.add.sprite(game.world.centerX, game.world.centerY, 'scorebanner').anchor.setTo(0.5);
        game.score = game.score.toString(); // 原型態(number)=0 的時候bitmapText無法顯示
        game.add.bitmapText(game.world.centerX, game.world.centerY + 10, 'BMFont_White', game.score, 26).anchor.setTo(0.5);

        var stamp = game.add.sprite(game.world.centerX - 190, game.world.centerY - 150, 'stamp');
        stamp.alpha = 0;
        // if (IsLogin && GameType == 'beating' && MemberWinFlag) {
        setTimeout(function() {
                stamp.alpha = 1;
                stamp.animations.add('play', [0, 1, 2, 3, 4, 5, 6, 7, 8]);
                stamp.animations.play('play', 12);
                // 跳出上榜留言框
                // stampAni.onComplete.add(showBoardMessageModal, this);
            }, 400)
            // } else if (GameType == 'ranking') {
            //     setTimeout(function() {
            //         showBoardMessageModal(); // 跳出上榜留言框
            //     }, 400);
            // }

        leaveBtn = AddButton(game.world.centerX - 80, game.world.centerY + 125, 'cancleBtn', 0.5, 'click');
        leaveBtn.onInputUp.add(function() {
            restartBtn.inputEnabled = false;
            setTimeout(function() {
                window.history.back() // 返回到前頁
            }, 200);
        });
        restartBtn = AddButton(game.world.centerX + 75, game.world.centerY + 125, 'restartBtn', 0.5, 'click');
        restartBtn.onInputUp.add(function() {
            stamp.alpha = 0;
            leaveBtn.inputEnabled = false;
            setTimeout(function() {
                game.state.start('start');
            }, 200);
        })

        // 遊客模式
        // if (!IsLogin) {
        //     login = AddButton(game.world.centerX + 125, game.world.centerY - 80, 'login', 0.5, 'click');
        //     login.onInputUp.add(function() {
        //         setTimeout(function() {
        //             window.location.replace('/member/login?redirect_url=/'); // 登入後跳轉到首頁
        //         }, 200);
        //     });
        // }
        // // 會員模式
        // else {
        //     // 過關賽
        //     if (GameType == 'beating') {
        //         bag = AddButton(game.world.centerX + 125, game.world.centerY - 80, 'bag', 0.5, 'click');
        //         bag.onInputUp.add(function() {
        //             setTimeout(function() {
        //                 window.location.replace('/member/pocket'); // 連接到商城頁-背包
        //             }, 200);
        //         });
        //     }
        //     // 排行賽
        //     else if (GameType == 'ranking') {
        //         rank = AddButton(game.world.centerX + 125, game.world.centerY - 80, 'rank', 0.5, 'click');
        //         rank.onInputUp.add(function() {
        //             setTimeout(function() {
        //                 showBoardDialog();
        //             }, 200);
        //         });
        //     }
        // }
    }
}

function AddButton(x, y, ImageName, anchor, sound) {
    var btn = game.add.button(x, y, ImageName, function() {
        game.add.sound(sound).play();
        game.add.tween(btn.scale).to({ x: 0.8, y: 0.8 }, 100, Phaser.Easing.Bounce.Out, true);
    }, this, 0, 0, 1);
    btn.anchor.setTo(anchor);
    btn.onInputUp.add(function() {
        btn.inputEnabled = false;
        game.add.tween(btn.scale).to({ x: 1, y: 1 }, 100, Phaser.Easing.Bounce.Out, true, 100);
    }, this);

    return btn;
}

/*************** 加入state ******************/

game.state.add('boot', game.State.boot);
game.state.add('load', game.State.load);
game.state.add('start', game.State.start);
game.state.add('cost', game.State.cost);
game.state.add('teach', game.State.teach);
game.state.add('play', game.State.play);
game.state.add('over', game.State.over);
game.state.start('boot');

/*******************************************/

// startData 回傳成功
// function successStartData() {
//     // 叉子攻擊間格時間
//     againTime = parseInt(GameParameters.againTime);
//     // 遊玩時間
//     game.timer = parseInt(GameParameters.timer);
//     // 幽靈產生間格時間
//     phatomIntervalLim = parseInt(GameParameters.phatomIntervalLim);
//     phatomSIntervalLim = parseInt(GameParameters.phatomSIntervalLim);
//     // 幽靈移動速度
//     phantomVelocityLim = parseInt(GameParameters.phantomVelocityLim);
//     phantomVelocityMax = parseInt(GameParameters.phantomVelocityMax);
//     phantomSVelocityLim = parseInt(GameParameters.phantomSVelocityLim);
//     phantomSVelocityMax = parseInt(GameParameters.phantomSVelocityMax);
//     // 幽靈分數
//     phantomScore = parseInt(GameParameters.phantomScore);
//     phantomScoreS = parseInt(GameParameters.phantomScoreS);

//     game.state.start('play');
// }

// sendScore 回傳成功
// function successScoreData() {
//     setTimeout(function() {
//         game.state.start('over');
//     }, 1500);
// }

// 開啟 分享 / 上榜留言框 / 排行榜
// function PreShowDialog() {
//     var btnArray = [
//         playBtn, FBshare, LINEshare,
//         startBtn, cancleBtn,
//         bag, rank, leaveBtn, restartBtn
//     ];
//     buttonAction(btnArray, false);
// }

// 關閉 分享 / 上榜留言框 / 排行榜
// function completeCloseDialog() {
//     var btnArray = [
//         playBtn, FBshare, LINEshare,
//         startBtn, cancleBtn,
//         bag, rank, leaveBtn, restartBtn
//     ];
//     buttonAction(btnArray, true);
// }

// 開啟/關閉 按鈕 action=true/false
// function buttonAction(btnArray, action) {
//     for (var i = 0; i < btnArray.length; i++) {
//         if (typeof btnArray[i] !== 'undefined' && btnArray[i].visible === true) {
//             btnArray[i].inputEnabled = action;
//             if (typeof btnArray[i].input !== 'undefined') {
//                 btnArray[i].input.enabled = action;
//             }
//         }
//     }
// }