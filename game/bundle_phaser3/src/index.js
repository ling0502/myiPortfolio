import {
    IsLogin,
    GameType,
    GameCostPoint,
    MemberFreeTimes,
    MemberPoint,

    startData,
    sendScore,
    PlayerID,
    PlayerSN,
    GameParameters,
    SetSuccessStartData,
    SetSuccessScoreData,

    StatusFlag,
    StatusText,
    showBoardDialog,
    showMessageModal,
    showBoardMessageModal,
    shareViaLine,
    shareViaFacebook,

    MemberWinFlag,
    SetPreShowDialog,
    SetCompleteCloseDialog,
} from '../../js/connect_source.js';

/* * * * phaser 2 * * * */

var game = new Phaser.Game(450, 800, Phaser.AUTO, 'game');
var score;
var PlayHistories = '';
var timerEvents;
var typeNum = 4; // 共有Ｎ種不同類別方塊

// 遊戲時間
var timer = 30;
// 顏色配對錯誤,懲罰數量
var punishNum = 4;
// 隨機選擇按鈕顏色 {預設:1=true , 0=false}
var rndColor = 1;
// 最多可連續出現同色數量 {預設:3 =最多連續出現3顆同顏色 ,數字越小越難 ,最小1}
var sameColor = 1;
// 定時更改顏色 {預設:0=false , 數字 = 更改秒數}
var ischange = 5;

// 難度時間門檻 {預設:剩下25秒 , 進入LV1}
var LV1 = 25;
var LV2 = 20;
var LV3 = 15;
var LV4 = 10;
// 難度速度門檻 {預設:60 =0.5秒出現一顆}
var Rate0 = 30;
var Rate1 = 25;
var Rate2 = 20;
var Rate3 = 16;
var Rate4 = 13;
// 得分數 {預設:1分,lv1 = 2分,lv2 = 5分,lv3 = 10分,lv4 = 15分}    
var lv0Point = 1;
var lv1Point = 1;
var lv2Point = 1;
var lv3Point = 1;
var lv4Point = 1;

// 音效
var soundBgm;
var soundStart;
var soundStory;

// 按鈕
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

/****************** 遊 戲 說 明 【魷魚對對碰】 ******************/

// 微調games029
// 五種細菌 -> 四種幾何圖
// 介面/按鈕微調 其餘大致不變 

/*************************************************************/

var bootState = {
    preload: function() {
        var W = Phaser.Math.min(window.outerWidth, window.innerWidth);
        if (W == 0) { // 有些ios判斷 outerWidth == 0
            W = Phaser.Math.max(window.outerWidth, window.innerWidth);
        }
        var H = Phaser.Math.min(window.outerHeight, window.innerHeight);
        if (H == 0) { // 有些ios判斷 outerHeight == 0
            H = Phaser.Math.max(window.outerHeight, window.innerHeight);
        }

        if (!game.device.desktop) { // 行動裝置調適
            var scaleX = W / game.width;
            var scaleY = H / game.height;
            this.game.scale.scaleMode = Phaser.ScaleManager.USER_SCALE;
            this.game.scale.setUserScale(scaleX, scaleY);
        } else {
            game.scale.pageAlignHorizontally = true;
            game.scale.pageAlignVertically = true;
            var scaleY = H / game.height;
            this.game.scale.scaleMode = Phaser.ScaleManager.USER_SCALE;
            this.game.scale.setUserScale(1, scaleY);
        }
        this.game.scale.pageAlignHorizontally = true;
        this.game.scale.pageAlignVertically = true;

        game.load.image('loading', '/games/mark/preloader.gif');
        game.load.image('dauchung', '/games/mark/dauchung.png');
    },

    create: function() {
        game.state.start('load');
    }
};

var loadState = {
    preload: function() {
        game.add.sprite(game.world.centerX, game.world.height * 0.4, 'dauchung').anchor.setTo(0.5);
        var preloadSprite = game.add.sprite(game.world.centerX - 110, game.world.height * 0.65, 'loading');
        game.load.setPreloadSprite(preloadSprite);

        // 加載資源
        game.load.image('mark', '/games/mark/mark01.png'); // 浮水印
        game.load.image('cover', '/games/mark/cover01.png'); // 黑色底圖
        game.load.spritesheet('stamp', '/games/mark/stamp.png', 150, 150); // 通關章
        game.load.spritesheet('waiting', '/games/mark/waiting.png', 200, 200); // 倒數三秒進遊戲
        game.load.spritesheet('saving', '/games/mark/saving.png', 300, 300); // 分數儲存中

        game.load.image('logo', '/games/games029/assets/logo.png');
        game.load.image('menu', '/games/games029/assets/menu.png');
        game.load.image('background', '/games/games029/assets/background.png');
        game.load.image('win', '/games/games029/assets/win.png');
        game.load.image('fail', '/games/games029/assets/fail.png');
        game.load.image('teach', '/games/games029/assets/teach.png');
        //下方按鈕組
        game.load.spritesheet('colors', '/games/games029/assets/colors.png', 153, 146);
        //上方方塊組
        game.load.spritesheet('geoms', '/games/games029/assets/geoms.png', 108, 108);

        game.load.image('banner', '/games/games029/assets/banner.png');
        game.load.image('freebanner', '/games/games029/assets/freebanner.png');
        game.load.image('costbanner', '/games/games029/assets/costbanner.png');
        game.load.image('tipsbanner', '/games/games029/assets/tipsbanner.png');
        game.load.image('scorebanner', '/games/games029/assets/scorebanner.png');

        game.load.image('startBtn', '/games/games029/assets/startBtn.png');
        game.load.image('cancleBtn', '/games/games029/assets/cancleBtn.png');
        game.load.image('restartBtn', '/games/games029/assets/restartBtn.png');
        game.load.image('storeBtn', '/games/games029/assets/storeBtn.png');
        game.load.image('bagBtn', '/games/games029/assets/bagBtn.png');
        game.load.image('okBtn', '/games/games029/assets/okBtn.png');
        game.load.image('login', '/games/games029/assets/login.png');
        game.load.image('rank', '/games/games029/assets/rank.png');
        game.load.image('bag', '/games/games029/assets/bag.png');
        game.load.spritesheet('LINEshare', '/games/games029/assets/LINEshare.png', 40, 40, 2);
        game.load.spritesheet('FBshare', '/games/games029/assets/FBshare.png', 40, 40, 2);

        game.load.bitmapFont('BMFont_White', '/games/Font/BMFont_White.png', '/games/Font/BMFont_White.fnt');
        game.load.bitmapFont('BMFont_Black', '/games/Font/BMFont_Black.png', '/games/Font/BMFont_Black.fnt');

        game.load.audio('bgm', '/games/games029/assets/audio/bgm.mp3');
        game.load.audio('click', '/games/games029/assets/audio/click.mp3');
        game.load.audio('start', '/games/games029/assets/audio/start.mp3');
        game.load.audio('story', '/games/games029/assets/audio/story.mp3');
        game.load.audio('correct', '/games/games029/assets/audio/correct.mp3');
        game.load.audio('error', '/games/games029/assets/audio/error.mp3');
        game.load.audio('dead', '/games/games029/assets/audio/dead.mp3');
    },

    create: function() {
        game.stage.disableVisibilityChange = true; // 離開畫面遊戲繼續

        // 綁定connect.js功能
        SetPreShowDialog(PreShowDialog);
        SetCompleteCloseDialog(completeCloseDialog);
        SetSuccessStartData(successStartData);
        SetSuccessScoreData(successScoreData);

        game.state.start('menu');
    }
};

// 遊戲介面
var gameState = {
    init: function() {
        score = 0;
        PlayHistories = '';

        // 驗證
        A = 0;
        B = 0;
        C = 0;
        D = 0;
        E = 0;
    },

    create: function() {
        soundStart.fadeOut(1000);
        soundStory.fadeOut(1000);

        this.gameIsOver = false;
        game.add.image(0, 0, 'background');
        if (!IsLogin) {
            game.add.sprite(0, 0, 'mark');
        }
        soundBgm = game.add.sound('bgm', 0.7, true);
        soundBgm.play();

        game.add.text(12, 10, 'ID: ' + PlayerID, { fill: '#888', fontSize: "12px" });
        game.add.text(10, 25, 'SN: ' + PlayerSN, { fill: '#888', fontSize: "12px" });

        this.currentTime = timer;
        this.passedTime = 0;

        game.add.bitmapText(30, 55, 'BMFont_Black', 'ＴＩＭＥ', 14);
        game.add.bitmapText(20, 95, 'BMFont_Black', '00：', 14);
        this.currentTime = this.currentTime.toString().padStart(2, '0');
        this.timeText = game.add.bitmapText(90, 95, 'BMFont_Black', this.currentTime, 14);
        game.add.bitmapText(330, 55, 'BMFont_Black', 'ＳＣＯＲＥ', 14);
        this.scoreText = game.add.bitmapText(385, 110, 'BMFont_Black', '', 14);
        this.scoreText.anchor.set(0.5);
        timerEvents = game.time.events.loop(1000, this.updateCounter, this);

        // 顏色順序(紅 黃 藍 綠 紫)
        this.arr = [0, 1, 2, 3, 4];
        // 按鈕位置(左 中 右)
        this.arrpos = [];

        this.row = game.add.group();
        // 是否隨機取按鈕顏色
        if (rndColor == 1) {
            for (var i = 0; i < 3; i++) {
                this.x = this.rnd.between(0, typeNum - 1);
                this.temp = this.arr[i];
                this.arr[i] = this.arr[this.x];
                this.arr[this.x] = this.temp;
            }
            // console.log('左:' + this.arr[0] + ' 中:' + this.arr[1] + ' 右:' + this.arr[2]);
        }
        // 創建按鈕
        for (var j = 0; j < 3; j++) {
            this.arrpos[j] = game.add.image(0, game.world.height, 'colors', this.arr[j]);
            this.arrpos[j].x = this.arrpos[j].width * (j + 0.95);
            this.arrpos[j].anchor.setTo(1, 1);
            this.arrpos[j].inputEnabled = true;
        }
        this.arrpos[0].events.onInputDown.add(function() {
            this.press(0);
        }, this)
        this.arrpos[1].events.onInputDown.add(function() {
            this.press(1);
        }, this)
        this.arrpos[2].events.onInputDown.add(function() {
            this.press(2);
        }, this)

        // 進入遊戲即預設一些在螢幕上
        for (let key in this.arr) {
            this.rowCreate();
            this.rowUpdate(this.row, this.dust);
        }
    },

    update: function() {
        if (this.gameIsOver) return;

        this.level();

        // 定時(Rate)出現圖片
        this.passedTime++;
        if (this.passedTime % this.Rate == 0) {
            this.rowCreate();
        }
        this.rowUpdate(this.row, this.dust)

        this.scoreText.setText(score);

        // 判斷死亡條件
        if (this.row.length >= 13) {
            this.gameIsOver = true;
            for (var i = 0; i < 3; i++) {
                this.arrpos[i].inputEnabled = false;
            }
            gameOver();
        }
        // 判斷全部消除
        else if (this.row.length < 1) {
            for (var i = 0; i < 2; i++) {
                this.rowCreate();
            }
        }
    },

    level: function() {
        // 難度門檻
        if (this.currentTime > LV1) {
            this.Rate = Rate0;
            this.point = lv0Point;
        } else if (this.currentTime <= LV1 && this.currentTime > LV2) {
            this.Rate = Rate1;
            this.point = lv1Point;
        } else if (this.currentTime <= LV2 && this.currentTime > LV3) {
            this.Rate = Rate2;
            this.point = lv2Point;
        } else if (this.currentTime <= LV3 && this.currentTime > LV4) {
            this.Rate = Rate3;
            this.point = lv3Point;
        } else {
            this.Rate = Rate4;
            this.point = lv4Point;
        }
    },

    press: function(n) {
        if (this.row.getChildAt(this.row.length - 1).frame == this.arr[n]) {
            PlayAudio('correct', 1);
            this.row.getChildAt(this.row.length - 1).destroy();
            this.showPoint(this.arrpos[n]);
            score = score + this.point;

            // 驗證
            if (this.currentTime > LV1) {
                A += 1;
                // console.log("LV0" + A);
            } else if (this.currentTime <= LV1 && this.currentTime > LV2) {
                B += 1;
                // console.log("LV1" + B);
            } else if (this.currentTime <= LV2 && this.currentTime > LV3) {
                C += 1;
                // console.log("LV2" + C);
            } else if (this.currentTime <= LV3 && this.currentTime > LV4) {
                D += 1;
                // console.log("LV3" + D);
            } else {
                E += 1;
                // console.log("LV4" + E);
            }
        } else {
            PlayAudio('error', 1);
            // 畫面閃紅
            game.camera.flash(0x330000, 50);
            for (var i = 0; i < punishNum; i++) {
                this.rowCreate();
                this.rowUpdate(this.row, this.dust);
            }
        }
    },

    // 新增幾何圖到row
    rowCreate: function() {
        this.r = this.rnd.between(0, 2);
        if (this.rn == this.r) {
            this.exist++;
            if (this.exist > sameColor) {
                do {
                    this.r = this.rnd.between(0, 2);
                } while (this.rn == this.r)
                this.exist = 1;
            }
        } else {
            this.exist = 1;
        }
        this.dust = game.add.image(0, 0, 'geoms', this.arr[this.r]);
        this.dust.anchor.setTo(0.5, 0.5);
        this.rx = this.rnd.between(1, 3);
        this.dust.x = this.world.centerX + (30 * (2 - this.rx));
        this.dust.y = this.dust.height * 0.7;
        this.row.add(this.dust);
        this.rn = this.r;
    },

    showPoint: function(btn) {
        PlayAudio('correct', 1);
        var pointText = game.add.text(btn.x - btn.width / 2, btn.y - 180, '+' + this.point, { fontSize: '26px' });
        pointText.alpha = 1;
        setTimeout(function() {
            pointText.alpha = 0
        }, 100);
    },

    // 刷新時間
    updateCounter: function() {
        this.currentTime -= 1;

        this.currentTime = this.currentTime.toString().padStart(2, '0');
        this.timeText.setText(this.currentTime);

        if (this.currentTime <= 0) {
            this.gameIsOver = true;
            for (var i = 0; i < 3; i++) {
                this.arrpos[i].inputEnabled = false;
            }
            setTimeout(function() {
                gameOver();
            }, 300)
        }
        if (ischange > 0) {
            this.changeColor(this.currentTime);
        }
        // console.log('剩餘時間: ' + this.currentTime)
        // console.log('刷新速率: ' + this.Rate+' /60 秒')
    },

    // 刷新幾何圖row
    rowUpdate: function(row, dust) {
        for (var i = 0; i < row.length; i++) {
            if (i == 0) {
                row.getChildAt(i).y = dust.height * 0.7;
                continue;
            }
            // 新增加的幾何圖座標y在舊幾何圖+50的位置
            row.getChildAt(i).y = row.getChildAt(i - 1).y + 50;
            // 新增加的下降一級(圖層排序)
            row.sendToBack(dust);
        }
    },

    changeColor: function(time) {
        var change = time % ischange;
        if (change == 0) {
            for (var i = 0; i < 3; i++) {
                var random = this.rnd.between(0, 2);
                var tempR = this.arr[i];
                this.arr[i] = this.arr[random];
                this.arr[random] = tempR;
            }
            for (var j = 0; j < 3; j++) {
                this.arrpos[j].frame = this.arr[j];
            }
        }
    }
};

// 成績結算
function gameOver() {
    game.time.events.remove(timerEvents);
    soundBgm.fadeOut(1000);
    PlayAudio('dead', 1);
    game.add.image(0, 0, 'cover');

    // 驗證
    A = A.toString().padStart(2, '0');
    B = B.toString().padStart(2, '0');
    C = C.toString().padStart(2, '0');
    D = D.toString().padStart(2, '0');
    E = E.toString().padStart(2, '0');
    PlayHistories = A + B + C + D + E;

    var endBoard;
    // 會員 + 過關賽 + 通關
    if (IsLogin && GameType == 'beating' && MemberWinFlag) {
        endBoard = game.add.sprite(game.world.centerX, 0, 'win');
    } else {
        endBoard = game.add.sprite(game.world.centerX, 0, 'fail');
    }
    endBoard.anchor.setTo(0.5);
    endBoard.angle = -5;
    var endBoardTween = game.add.tween(endBoard).to({ y: game.world.centerY }, 1500, Phaser.Easing.Bounce.Out, true);
    endBoardTween.onComplete.add(function() {
        setTimeout(function() {
            var saving = game.add.sprite(game.world.centerX, game.world.centerY, 'saving');
            saving.anchor.setTo(0.5);
            saving.scale.setTo(0.5);
            saving.animations.add('saving');
            saving.animations.play('saving', 12, true);

            // 回傳分數
            sendScore(score, PlayHistories);
        }, 1200);
    });
};

var menuState = {
    create: function() {
        game.add.image(0, 0, 'menu');

        var logo = game.add.sprite(game.world.centerX, -80, 'logo');
        logo.anchor.setTo(0.5, 1);
        logo.angle = -5;
        game.add.tween(logo).to({ y: 170 }, 1000, Phaser.Easing.Bounce.Out, true);

        playBtn = AddButton(game.world.centerX, game.world.height - 125, 'startBtn', 0.5, 'click');
        playBtn.onInputUp.add(function() {
            var tween = game.add.tween(playBtn).to({ alpha: 0 }, 300, Phaser.Easing.Linear.None, true, 0, 0, false);
            tween.onComplete.add(function() {
                if (IsLogin && GameType != 'normal') {
                    showBanner();
                } else {
                    game.state.start('story');
                }
            });
        });

        if (StatusFlag != 0 && StatusFlag != 5) {
            showMessageModal(StatusText);
        }

        function showBanner() {
            var share = game.add.sprite(game.world.width - 90, game.world.height - 60);
            FBshare = share.addChild(AddButton(0, 0, 'FBshare', 0.5, 'click'));
            FBshare.onInputUp.add(function() {
                shareViaFacebook();
            });
            LINEshare = share.addChild(AddButton(50, 0, 'LINEshare', 0.5, 'click'));
            LINEshare.onInputUp.add(function() {
                shareViaLine();
            });

            var board;

            if (MemberFreeTimes > 0) {
                board = game.add.sprite(game.world.centerX, game.world.centerY, 'freebanner');
                board.addChild(game.add.bitmapText(60, 25, 'BMFont_White', MemberFreeTimes, 14));
            } else {
                board = game.add.sprite(game.world.centerX, game.world.centerY, 'costbanner');
                board.addChild(game.add.bitmapText(-45, -25, 'BMFont_White', GameCostPoint, 22)).anchor.setTo(1);
                board.addChild(game.add.bitmapText(70, 22, 'BMFont_White', MemberPoint, 14));
            }
            board.anchor.setTo(0.5);

            cancleBtn = AddButton(game.world.centerX - 60, game.world.centerY + 115, 'cancleBtn', 0.5, 'correct');
            cancleBtn.onInputUp.add(function() {
                setTimeout(function() {
                    startBtn.inputEnabled = false;
                    window.history.back(); // 返回到前頁
                }, 200);
            });
            startBtn = AddButton(game.world.centerX + 60, game.world.centerY + 115, 'okBtn', 0.5, 'click');
            startBtn.onInputUp.add(function() {
                game.add.tween(board).to({ alpha: 0 }, 300, Phaser.Easing.Linear.None, true, 0, 0, false);
                share.alpha = 0;
                cancleBtn.inputEnabled = false;
                setTimeout(function() {
                    if (MemberFreeTimes > 0 || parseInt(MemberPoint, 10) >= parseInt(GameCostPoint, 10)) {
                        game.state.start('story');
                    } else {
                        var tipsboard = game.add.sprite(game.world.centerX, game.world.centerY, 'tipsbanner');
                        tipsboard.anchor.setTo(0.5);

                        var backBtn = tipsboard.addChild(AddButton(-60, 115, 'cancleBtn', 0.5, 'click'));
                        backBtn.onInputUp.add(function() {
                            setTimeout(function() {
                                share.alpha = 1;
                                startBtn.inputEnabled = true;
                                cancleBtn.inputEnabled = true;
                                tipsboard.destroy();
                                game.add.tween(board).to({ alpha: 1 }, 300, Phaser.Easing.Linear.None, true, 0, 0, false);
                            }, 200);
                        }, 0, 1, 0);

                        var storeBtn = tipsboard.addChild(AddButton(60, 115, 'storeBtn', 0.5, 'click'));
                        storeBtn.onInputUp.add(function() {
                            window.location.replace('/buycoins'); // 連接到儲值頁
                        }, 200);
                    }
                }, 200);
            });
        }
    }
}

function PlayAudio(music, volume) {
    var soundFx = game.add.sound(music, volume);
    try {
        soundFx.play();
    } catch (e) {}
}

function AddButton(x, y, ImageName, anchor, sound) {
    var btn = game.add.button(x, y, ImageName, function() {
        PlayAudio(sound, 1);
        game.add.tween(btn.scale).to({ x: 0.8, y: 0.8 }, 100, Phaser.Easing.Bounce.Out, true);
    }, this, 0, 0, 1);
    btn.anchor.setTo(anchor);
    btn.onInputUp.add(function() {
        btn.inputEnabled = false;
        game.add.tween(btn.scale).to({ x: 1, y: 1 }, 100, Phaser.Easing.Bounce.Out, true, 100);
    }, this);

    return btn;
}

var storyState = {
    create: function() {
        var teach = game.add.sprite(0, 0, 'teach');
        teach.inputEnabled = true;
        teach.events.onInputDown.add(function() {
            teach.inputEnabled = false;
            PlayAudio('correct', 1);

            // ajax取得遊戲參數
            startData();
        }, this);
    }
};

var overState = {
    create: function() {
        game.add.image(0, 0, 'menu');
        game.add.text(12, 10, 'ID: ' + PlayerID, { fill: '#888', fontSize: "12px" });
        game.add.text(10, 25, 'SN: ' + PlayerSN, { fill: '#888', fontSize: "12px" });

        game.add.sprite(game.world.centerX, game.world.centerY, 'scorebanner').anchor.setTo(0.5);
        score = score.toString(); // 原型態(number)=0 的時候bitmapText無法顯示
        game.add.bitmapText(game.world.centerX + 30, game.world.centerY - 70, 'BMFont_White', score, 20);

        var stamp = game.add.sprite(game.world.centerX + 70, game.world.centerY - 80, 'stamp');
        stamp.alpha = 0;
        if (IsLogin && GameType == 'beating' && MemberWinFlag) {
            setTimeout(function() {
                stamp.alpha = 1;
                var stampAni = stamp.animations.add('play', [0, 1, 2, 3, 4, 5, 6, 7, 8]);
                stamp.animations.play('play', 12);
                // 跳出上榜留言框
                stampAni.onComplete.add(showBoardMessageModal, this);
            }, 400)
        } else if (GameType == 'ranking') {
            setTimeout(function() {
                showBoardMessageModal(); // 跳出上榜留言框
            }, 400);
        }

        leaveBtn = AddButton(game.world.centerX - 60, game.world.centerY + 115, 'cancleBtn', 0.5, 'correct');
        leaveBtn.onInputUp.add(function() {
            restartBtn.inputEnabled = false;
            setTimeout(function() {
                window.history.back() // 返回到前頁
            }, 200);
        });
        restartBtn = AddButton(game.world.centerX + 60, game.world.centerY + 115, 'restartBtn', 0.5, 'click');
        restartBtn.onInputUp.add(function() {
            stamp.alpha = 0;
            leaveBtn.inputEnabled = false;
            setTimeout(function() {
                game.state.start('menu');
            }, 200);
        })

        // 遊客模式
        if (!IsLogin) {
            game.add.sprite(0, 0, 'mark');
            login = AddButton(game.world.centerX + 110, game.world.centerY - 140, 'login', 0.5, 'correct');
            login.onInputUp.add(function() {
                setTimeout(function() {
                    window.location.replace('/member/login?redirect_url=/'); // 登入後跳轉到首頁
                }, 200);
            });
        }
        // 會員模式
        else {
            // 過關賽
            if (GameType == 'beating') {
                bag = AddButton(game.world.centerX + 110, game.world.centerY - 140, 'bag', 0.5, 'correct');
                bag.onInputUp.add(function() {
                    setTimeout(function() {
                        window.location.replace('/member/pocket'); // 連接到商城頁-背包
                    }, 200);
                });
            }
            // 排行賽
            else if (GameType == 'ranking') {
                rank = AddButton(game.world.centerX + 110, game.world.centerY - 140, 'rank', 0.5, 'correct');
                rank.onInputUp.add(function() {
                    setTimeout(function() {
                        showBoardDialog();
                    }, 200);
                });
            }
        }
    }
};

/*************** 加入state ******************/

game.state.add('boot', bootState);
game.state.add('load', loadState);
game.state.add('game', gameState);
game.state.add('menu', menuState);
game.state.add('story', storyState);
game.state.add('over', overState);
game.state.start('boot');

/********************************************/

// startData 回傳成功
function successStartData() {
    timer = parseInt(GameParameters.timer);
    punishNum = parseInt(GameParameters.punishNum);
    rndColor = parseInt(GameParameters.rndColor);
    sameColor = parseInt(GameParameters.sameColor);
    ischange = parseInt(GameParameters.ischange);
    LV1 = parseInt(GameParameters.LV1);
    LV2 = parseInt(GameParameters.LV2);
    LV3 = parseInt(GameParameters.LV3);
    LV4 = parseInt(GameParameters.LV4);
    Rate0 = parseInt(GameParameters.Rate0);
    Rate1 = parseInt(GameParameters.Rate1);
    Rate2 = parseInt(GameParameters.Rate2);
    Rate3 = parseInt(GameParameters.Rate3);
    Rate4 = parseInt(GameParameters.Rate4);
    lv0Point = parseInt(GameParameters.lv0Point);
    lv1Point = parseInt(GameParameters.lv1Point);
    lv2Point = parseInt(GameParameters.lv2Point);
    lv3Point = parseInt(GameParameters.lv3Point);
    lv4Point = parseInt(GameParameters.lv4Point);

    // console.log('遊戲時間: ' + timer);
    // console.log('懲罰數量: ' + punishNum);
    // console.log('隨機選擇按鈕顏色 {預設:1=true , 0=false}: ' + rndColor);
    // console.log('最多可連續出現同色數量: ' + sameColor);
    // console.log('剩餘時間門檻(LV1): ' + LV1);
    // console.log('剩餘時間門檻(LV2): ' + LV2);
    // console.log('剩餘時間門檻(LV3): ' + LV3);
    // console.log('剩餘時間門檻(LV4): ' + LV4);
    // console.log('速度門檻(預設): ' + Rate0);
    // console.log('速度門檻(LV1): ' + Rate1);
    // console.log('速度門檻(LV2): ' + Rate2);
    // console.log('速度門檻(LV3): ' + Rate3);
    // console.log('速度門檻(LV4): ' + Rate4);
    // console.log('得分數(預設): ' + lv0Point);
    // console.log('得分數(LV1): ' + lv1Point);
    // console.log('得分數(LV2): ' + lv2Point);
    // console.log('得分數(LV3): ' + lv3Point);
    // console.log('得分數(LV4): ' + lv4Point);

    game.state.start('game');

}

// sendScore 回傳成功
function successScoreData() {
    setTimeout(function() {
        game.state.start('over');
    }, 1500);
}

// 開啟 分享 / 上榜留言框 / 排行榜
function PreShowDialog() {
    var btnArray = [
        playBtn, FBshare, LINEshare,
        startBtn, cancleBtn,
        bag, rank, leaveBtn, restartBtn
    ];
    buttonAction(btnArray, false);
}

// 關閉 分享 / 上榜留言框 / 排行榜
function completeCloseDialog() {
    var btnArray = [
        playBtn, FBshare, LINEshare,
        startBtn, cancleBtn,
        bag, rank, leaveBtn, restartBtn
    ];
    buttonAction(btnArray, true);
}

// 開啟/關閉 按鈕 action=true/false
function buttonAction(btnArray, action) {
    for (var i = 0; i < btnArray.length; i++) {
        if (typeof btnArray[i] !== 'undefined' && btnArray[i].visible === true) {
            btnArray[i].inputEnabled = action;
            if (typeof btnArray[i].input !== 'undefined') {
                btnArray[i].input.enabled = action;
            }
        }
    }
}