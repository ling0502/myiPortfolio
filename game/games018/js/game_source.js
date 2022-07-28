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

var game = new Phaser.Game(600, 900, Phaser.AUTO, 'game');

var score;
var PlayHistories = '';
var gameIsOver;
var started;

var boxRate = 900; // 新增的頻率

var bonus_Lv1_MinSpeed = 600; //加分模式Lv1_移動的最少時間
var bonus_Lv1_MaxSpeed = 860; //加分模式Lv1_移動的最大時間
var bonus_Lv2_MinSpeed = 500; //加分模式Lv2_移動的最少時間
var bonus_Lv2_MaxSpeed = 650; //加分模式Lv2_移動的最大時間

var normal_Lv1_MinSpeed = 800; //普通模式Lv1_移動的最少時間
var normal_Lv1_MaxSpeed = 1450; //普通模式Lv1_移動的最大時間
var normal_Lv2_MinSpeed = 670; //普通模式Lv2_移動的最少時間
var normal_Lv2_MaxSpeed = 1300; //普通模式Lv2_移動的最大時間

var entryNum = 5; // 進入加分模式的條件(連續完美的顆數)
var point1 = 1; // 得分_一般
var point2 = 2; // 得分_連續2顆完美
var point3 = 3; // 得分_連續3顆完美
var point4 = 4; // 得分_連續4顆完美
var point5 = 5; // 得分_連續5顆完美

/****************** 遊 戲 說 明 【恰恰】 ******************/

var A; // 1分的顆數
var B; // 2分的顆數
var C; // 3分的顆數
var D; // 4分的顆數
var E; // 5分的顆數
// 遊戲歷程 : 以上兩位數轉為字串相加ABCDE = PlayHistories

/*************************************************************/

var cover;
var player;
var stick;
var box;
var boxSpeed;
var oldBoxSpeed;

var mouse; // 觸控
var fly; // 跳過了
var pos; //現在位置
var creatboxEvents;

var box_arr;
var stick_arr;
var path_arr;
var movingBox_arr;
var movingStick_arr;

var poor;
var perfect;
var perfectNum;

// 音效
var soundBgm;
var soundStory;
var soundBonus;

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

/**************************************************************************************/

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

        game.load.image('loading', '../Mark/preloader.gif');
        game.load.image('dauchung', '../Mark/dauchung.png');
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
        game.load.image('cover', '../Mark/cover01.png'); // 黑色底圖
        game.load.spritesheet('stamp', '../Mark/stamp.png', 150, 150); // 通關章
        game.load.spritesheet('waiting', '../Mark/waiting.png', 200, 200); // 倒數三秒進遊戲
        game.load.spritesheet('saving', '../Mark/saving.png', 300, 300); // 分數儲存中

        game.load.image('logo', './assets/logo.png');
        game.load.image('menu', './assets/menu.png');
        game.load.image('background', './assets/background.png');
        game.load.image('table', './assets/table.png');
        game.load.image('end', './assets/end.png');
        game.load.image('win', './assets/win.png');
        game.load.image('fail', './assets/fail.png');
        game.load.image('story', './assets/story.png');
        game.load.image('story2', './assets/story2.png');
        game.load.image('story3', './assets/story3.png');
        game.load.image('teach', './assets/teach.png');

        game.load.spritesheet('player', './assets/player.png', 110, 135);
        game.load.spritesheet('box', './assets/box.png', 180, 130);
        game.load.spritesheet('poor', './assets/poor.png', 130, 100);
        game.load.spritesheet('spark', './assets/spark.png', 160, 150);
        game.load.spritesheet('perfect', './assets/perfect.png', 180, 150);
        game.load.spritesheet('bonus', './assets/bonus.png', 600, 900);
        game.load.image('stickL', './assets/stickL.png');
        game.load.image('stickR', './assets/stickR.png');

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
        game.load.spritesheet('skip', './assets/skip.png', 80, 80, 2);
        game.load.spritesheet('login', './assets/login.png', 80, 80, 2);
        game.load.spritesheet('rank', './assets/rank.png', 80, 80, 2);
        game.load.spritesheet('bag', './assets/bag.png', 80, 80, 2);

        game.load.bitmapFont('BMFont', '../Font/BMFont_White.png', '../Font/BMFont_White.fnt');

        game.load.audio('waitingSE', './assets/audio/waiting.mp3');
        game.load.audio('bgmSE', './assets/audio/bgm.mp3');
        game.load.audio('clickSE', './assets/audio/click.mp3');
        game.load.audio('storySE', './assets/audio/story.mp3');
        game.load.audio('bonusSE', './assets/audio/bonus.mp3');
        game.load.audio('readySE', './assets/audio/ready.mp3');
        game.load.audio('jumpSE', './assets/audio/jump.mp3');
        game.load.audio('dangerSE', './assets/audio/danger.mp3');
        game.load.audio('hitSE', './assets/audio/hit.mp3');
        game.load.audio('fallingSE', './assets/audio/falling.mp3');
        game.load.audio('perfectSE', './assets/audio/perfect.mp3');
        game.load.audio('poorSE', './assets/audio/poor.mp3');
        game.load.audio('winSE', './assets/audio/win.mp3');
        game.load.audio('failSE', './assets/audio/fail.mp3');
    },

    create: function() {
        game.stage.disableVisibilityChange = true; // 離開畫面遊戲繼續

        // 綁定connect.js功能
        // SetPreShowDialog(PreShowDialog);
        // SetCompleteCloseDialog(completeCloseDialog);
        // SetSuccessStartData(successStartData);
        // SetSuccessScoreData(successScoreData);

        game.state.start('menu');
    }
};

// 遊戲介面
var gameState = {
    init: function() {
        score = 0;
        PlayHistories = '';
        pos = -1;
        box_arr = [];
        stick_arr = [];
        path_arr = [];
        movingBox_arr = [];
        movingStick_arr = [];

        started = false;
        gameIsOver = false;

        // 驗證
        A = 0;
        B = 0;
        C = 0;
        D = 0;
        E = 0;
    },

    create: function() {
        soundStory.fadeOut(1500);

        soundBgm = game.add.sound('bgmSE', 1, true);
        soundBonus = game.add.sound('bonusSE', 1, true);

        this.background = game.add.image(0, 900, 'background');
        this.background.anchor.setTo(0, 1)
        this.table = game.add.image(0, 700, 'table');

        // ajax取得遊戲參數
        // startData();

        // game.add.text(42, 10, 'ID: ' + PlayerID, { fill: '#000', fontSize: "12px" });
        // game.add.text(40, 25, 'SN: ' + PlayerSN, { fill: '#000', fontSize: "12px" });

        this.scoreText = game.add.bitmapText(game.world.centerX, game.world.height / 10, 'BMFont', '', 40);
        this.scoreText.anchor.setTo(0.5);

        this.createFirstBox();

        cover = game.add.image(0, 0, 'cover')
        var waiting = game.add.sprite(game.world.centerX, game.world.centerY, 'waiting');
        waiting.anchor.setTo(0.5);
        waiting.animations.add('waiting', [0, 1, 2, 3, 4, 5, 6, 7, 8, 9,
            10, 11, 12, 13, 14, 15, 16, 17, 18, 19,
            20, 21, 22, 23, 24, 25, 26, 27, 28, 29,
            30, 31, 32, 33, 34, 35, 36, 37, 38, 39,
            40, 41, 42, 43, 44, 45, 46, 47, 48, 49,
            50, 51, 52, 53, 54, 55, 56, 57, 58, 59,
        ]);
        // soundWaiting.play();
        PlayAudio('waitingSE', 1.3);
        waiting.animations.play('waiting', 20, false, true); //(framename, rate, loop, hideonComplete)

        //延遲三秒進遊戲
        game.time.events.add(Phaser.Timer.SECOND * 3, this.gameStart, this);

        this.bonus = game.add.sprite(0, 0, 'bonus');
        this.bonus.animations.add('bonus', [0, 1, 2, 3, 4]);
        this.bonus.alpha = 0;
    },

    gameStart: function() {
        soundBgm.fadeIn(1500);
        started = true;
        perfectNum = 0;
        cover.alpha = 0;
        this.createPlayer();

        creatboxEvents = game.time.events.loop(boxRate, function() {
            this.createBox();
        }, this);

        // 取代 game.input.onDown.add()
        mouse = game.add.sprite(0, 0);
        mouse.scale.setTo(game.width, game.height);
        mouse.inputEnabled = true;
        mouse.events.onInputDown.add(this.jump);
    },

    createFirstBox: function() {
        this.firstBox = game.add.sprite(game.world.centerX, game.world.centerY + 195, 'box', 0);
        this.firstBox.anchor.setTo(0.5, 0);
        game.physics.arcade.enable(this.firstBox);
        this.firstBox.body.setSize(130, 100, 25, 15); // 原大小180x130
        this.firstBox.body.immovable = true;
        this.offsetY = this.firstBox.height - 30; // 30 => player & box 中間的空隙 (被setSize調整後 y忽略的部分_ player:15 / box:15 )
    },

    createPlayer: function() {
        player = game.add.sprite(this.firstBox.x, this.firstBox.y - this.firstBox.height, 'player', 0);
        player.anchor.setTo(0.5, 0);
        game.physics.arcade.enable(player);
        // 碰撞內縮 (寬度 ,高度 ,x ,y)
        player.body.setSize(44, 60, 33, 60); // 原大小110x135
        // player.body.bounce.setTo(0.3); // 反彈係數
        player.body.gravity.y = 600;
        player.touchOn = 0;

        player.animations.add('ready', [0, 1, 2, 3, 4], 8);
        player.animations.add('jump', [5, 6, 7, 8, 9], 8);
        player.animations.add('dangerR', [10, 11, 12, 13, 14, 12, 13, 14], 16);
        player.animations.add('dangerL', [15, 16, 17, 18, 19, 17, 18, 19], 16);
        player.animations.add('hitR', [20, 21, 22, 23, 24], 12);
        player.animations.add('hitL', [25, 26, 27, 28, 29], 12);
        // soundReady.play();
        PlayAudio('readySE', 1);
        player.play('ready');
    },

    jump: function() {
        // soundJump.play();
        PlayAudio('jumpSE', 0.5);
        player.play('jump');
        var jumping = game.add.tween(player).to({ y: '-150' }, 300, "Cubic", true);
        jumping.onComplete.add(function() {
            fly = 1;
            player.touchOn = 0;
        }, this);
    },

    update: function() {
        if (gameIsOver) return;

        this.scoreText.setText(score);

        var touched1 = this.physics.arcade.collide(player, this.firstBox, this.effect);
        var touched2 = this.physics.arcade.collide(player, box_arr, this.effect);
        var touched3 = this.physics.arcade.overlap(player, box_arr, this.overlapped);

        if (started) {
            mouse.inputEnabled = false;
        }
        if (touched1 || touched2) {
            mouse.inputEnabled = true;
            this.stepOn();
        }
        if (touched3) {
            mouse.inputEnabled = false;
        }
    },

    stepOn: function() {
        if (player.touchOn == 1 && fly == 1) {
            pos += 1;
            fly = 0;

            this.screenDown();
            this.danger();
            this.stepped();
            this.scoreAdd();
        }
    },

    screenDown: function() {
        if (this.background.y < this.background.height) {
            this.background.y += 5;
        }
        if (box_arr.length > 3) {
            this.distance = this.offsetY;
        } else {
            this.distance = 30;
        }

        player.y += this.distance;
        this.table.y += this.distance;
        this.firstBox.y += this.distance;
        for (var i = 0; i < box_arr.length; i++) {
            box_arr[i].y += this.distance;
            stick_arr[i].y += this.distance;
        }

        if (poor) {
            poor.y += this.distance;
        }
        if (perfect) {
            perfect.y += this.distance;
        }
    },

    danger: function() {
        PlayAudio('dangerSE', 1);
        if (box_arr[pos].x >= game.world.centerX - box.width / 2 && box_arr[pos].x <= game.world.centerX - box.width / 4) {
            player.animations.play('dangerL');
            // soundDanger.play();
        } else if (box_arr[pos].x <= game.world.centerX + box.width / 2 && box_arr[pos].x >= game.world.centerX + box.width / 4) {
            player.animations.play('dangerR');
            // soundDanger.play();
        }
    },

    stepped: function() {
        movingBox_arr[pos].stop();
        movingStick_arr[pos].stop();

        if (path_arr[pos] == 0) {
            game.add.tween(stick_arr[pos]).to({ x: -stick.width }, 80, "Linear", true);
        } else {
            game.add.tween(stick_arr[pos]).to({ x: game.world.width }, 80, "Linear", true);
        }

        if (box_arr[pos].x >= game.world.centerX - 5 && box_arr[pos].x <= game.world.centerX + 5) {
            // soundPerfect.play();
            PlayAudio('perfectSE', 1);
            perfect = game.add.sprite(player.x, player.y + 80, 'perfect');
            perfect.alpha = 0.8;
            perfect.scale.setTo(1.2);
            perfect.anchor.setTo(0.5);
            perfect.animations.add('perfect', [0, 1, 2, 3, 4]);
            perfect.animations.play('perfect', 16, false, true); //(framename, rate, loop, hideonComplete)

            box_arr[pos].animations.play('Step');
            box_arr[pos].action = perfect;
            perfectNum += 1;
        } else {
            // soundPoor.play();
            PlayAudio('poorSE', 0.8);
            box_arr[pos].scale.setTo(1.07, 1);

            poor = game.add.sprite(player.x, player.y + 80, 'poor');
            poor.anchor.setTo(0.5);
            poor.animations.add('poor', [0, 1, 2, 3, 4]);
            poor.animations.play('poor', 16, false, true); //(framename, rate, loop, hideonComplete)

            if (path_arr[pos] == 0) {
                box_arr[pos].animations.play('StepL');
            } else {
                box_arr[pos].animations.play('StepR');
            }
            box_arr[pos].action = poor;
        }

        if (perfectNum > 0) {
            this.bonusTime();
        }
    },

    bonusTime: function() {
        if (this.bonus.alpha == 1) {
            if (box_arr[pos].action.key != 'perfect') {
                soundBgm.fadeIn(500);
                soundBonus.fadeOut(500);
                this.bonus.alpha = 0;
                perfectNum = 0;
                creatboxEvents.delay = boxRate;
            }
        } else if (perfectNum % entryNum == 0) {
            soundBgm.fadeOut(500);
            soundBonus.fadeIn(500);
            this.bonus.alpha = 1;
            this.bonus.animations.play('bonus', 12, true); //(framename, rate, loop, hideonComplete)
            game.world.swap(this.scoreText, this.bonus); // phaser 2 - depth
            creatboxEvents.delay = boxRate + 250;
        } else {
            if (box_arr[pos].action.key == 'poor') {
                perfectNum = 0;
            }
        }
    },

    scoreAdd() {
        if (perfectNum == 0 || perfectNum == 1) {
            score += point1;
            A += 1;
        } else if (perfectNum == 2) {
            score += point2;
            B += 1;
        } else if (perfectNum == 3) {
            score += point3;
            C += 1;
        } else if (perfectNum == 4) {
            score += point4;
            D += 1;
        } else {
            score += point5;
            E += 1;
        }
    },

    createBox: function() {
        var path = this.rnd.between(0, 1);
        var w = game.cache.getFrameByIndex("box", 0).width;
        var h = this.offsetY;
        var movingY = this.firstBox.y - h * (box_arr.length + 1);
        var stickY = this.firstBox.y - h * box_arr.length + 8;

        if (this.bonus.alpha == 1) {
            if (score >= 20) {
                boxSpeed = this.rnd.between(0, 1) == 0 ? bonus_Lv2_MinSpeed : bonus_Lv2_MaxSpeed;
                if (oldBoxSpeed > 1000) {
                    boxSpeed = oldBoxSpeed - 400;
                    // console.log('bonus 1 >= : ' + boxSpeed)
                }
            } else {
                boxSpeed = this.rnd.between(0, 1) == 0 ? bonus_Lv1_MinSpeed : bonus_Lv1_MaxSpeed;
                if (oldBoxSpeed > 1100) {
                    boxSpeed = oldBoxSpeed - 500;
                    // console.log('bonus 1 Speed: ' + boxSpeed)
                }
            }
        } else {
            if (score >= 20) {
                boxSpeed = Math.floor(Math.random() * (normal_Lv2_MaxSpeed - normal_Lv2_MinSpeed)) + normal_Lv2_MinSpeed; // 速度區間 : 670 ~ 1300 
                // console.log('bonus 0 >= : ' + boxSpeed)
            } else {
                boxSpeed = Math.floor(Math.random() * (normal_Lv1_MaxSpeed - normal_Lv1_MinSpeed)) + normal_Lv1_MinSpeed; // 速度區間 : 800 ~ 1450 
                // console.log('bonus 0 Speed : ' + boxSpeed)
            }
        }
        oldBoxSpeed = boxSpeed;

        //左出
        if (path == 0) {
            box = game.add.sprite(-w / 2, movingY, 'box', 9);
            box.anchor.setTo(0.5, 0);
            game.physics.arcade.enable(box);
            var movingBox = game.add.tween(box).to({ x: game.world.centerX }, boxSpeed, "Linear", true);

            stick = game.add.sprite(0, stickY, 'stickL');
            stick.anchor.setTo(1, 0);
            var movingStick = game.add.tween(stick).to({ x: game.world.centerX + w / 2 - 20 }, boxSpeed, "Linear", true);
            movingStick.onComplete.add(this.stickBack, this);
        }
        //右出
        else {
            box = game.add.sprite(game.world.width + w / 2, movingY, 'box', 14);
            box.anchor.setTo(0.5, 0);
            game.physics.arcade.enable(box);
            var movingBox = game.add.tween(box).to({ x: game.world.centerX }, boxSpeed, "Linear", true);

            stick = game.add.sprite(game.world.width, stickY, 'stickR');
            stick.x = game.world.width;
            var movingStick = game.add.tween(stick).to({ x: game.world.centerX - w / 2 + 20 }, boxSpeed, "Linear", true);
            movingStick.onComplete.add(this.stickBack, this);
        }

        box.animations.add('Step', [0, 1, 2, 3, 4], 16);
        box.animations.add('StepL', [5, 6, 7, 8, 9], 16);
        box.animations.add('StepR', [10, 11, 12, 13, 14], 16);
        box.animations.add('rushL', [15, 16, 17, 18, 19], 16);
        box.animations.add('rushR', [20, 21, 22, 23, 24], 16);

        game.world.swap(player, box);

        box_arr.push(box); // 碰撞用
        stick_arr.push(stick); // 踩到的時候收回
        path_arr.push(path); // stick收回用
        movingBox_arr.push(movingBox); // box移動事件tween的陣列
        movingStick_arr.push(movingStick); // stick移動事件tween的陣列

        game.physics.arcade.enable(box);
        // 碰撞內縮 (寬度 ,高度 ,x ,y)
        box.body.setSize(104, 100, 38, 15); // 原大小180x130
        box.body.immovable = true;
    },

    stickBack: function() {
        if (path_arr[pos + 1] == 0) {
            game.add.tween(stick_arr[pos + 1]).to({ x: -stick.width }, 80, "Linear", true);
        } else {
            game.add.tween(stick_arr[pos + 1]).to({ x: game.world.width }, 80, "Linear", true);
        }
    },

    effect: function(playerObj, boxObj) {
        if (player.touchOn == 0 && boxObj == box_arr[pos + 1]) {
            player.touchOn = 1;
        }
    },

    overlapped: function() {
        gameIsOver = true;
        game.time.events.remove(creatboxEvents);

        // soundHit.play();
        PlayAudio('hitSE', 1);
        for (var i = 0; i < movingBox_arr.length; i++) {
            movingBox_arr[i].stop();
            movingStick_arr[i].stop();
        }

        if (path_arr[pos + 1] == 0) {
            box_arr[pos + 1].animations.play('rushL');
            player.animations.play('hitL');
            var flying = game.add.tween(player).to({ x: '+265', y: '-150' }, 300, "Linear", true);
            var spark = game.add.sprite(player.x + 50, player.y, 'spark');
        } else {
            box_arr[pos + 1].animations.play('rushR');
            player.animations.play('hitR');
            var flying = game.add.tween(player).to({ x: '-265', y: '-150' }, 300, "Linear", true);
            var spark = game.add.sprite(player.x - 50, player.y, 'spark');
        }

        spark.anchor.setTo(0.5, 0);
        spark.animations.add('spark', [0, 1, 2, 3, 4]);
        spark.animations.play('spark', 28, false, true); //(framename, rate, loop, hideonComplete)

        flying.onComplete.add(function() {
            // soundFalling.play();
            PlayAudio('fallingSE', 1.5);
        }, this);

        setTimeout(function() {
            gameOver();
        }, 1000);
    }
}

// 成績結算
function gameOver() {
    soundBgm.fadeOut(1000);
    soundBonus.fadeOut(1000);

    // game.add.image(0, 0, 'cover');
    game.world.bringToTop(cover);
    cover.alpha = 1;


    // 驗證
    A = A.toString().padStart(3, '0');
    B = B.toString().padStart(3, '0');
    C = C.toString().padStart(3, '0');
    D = D.toString().padStart(3, '0');
    E = E.toString().padStart(3, '0');
    PlayHistories = A + B + C + D + E;

    var endBoard;
    // 會員 + 過關賽 + 通關
    // if (IsLogin && GameType == 'beating' && MemberWinFlag) {
        // PlayAudio('winSE', 1);
        // endBoard = game.add.sprite(game.world.centerX, 0, 'win');
    // } else {
        PlayAudio('failSE', 1);
        endBoard = game.add.sprite(game.world.centerX, 0, 'fail');
    // }
    endBoard.anchor.setTo(0.5);
    var endBoardTween = game.add.tween(endBoard).to({ y: game.world.centerY - 50 }, 1000, Phaser.Easing.Bounce.Out, true);
    endBoardTween.onComplete.add(function() {
        setTimeout(function() {
            var saving = game.add.sprite(game.world.centerX, game.world.centerY, 'saving');
            saving.anchor.setTo(0.5);
            saving.scale.setTo(0.5);
            saving.animations.add('saving');
            saving.animations.play('saving', 12, true);

            // 回傳分數
            // sendScore(score, PlayHistories);
            game.state.start('over');
        }, 1200);
    });
};

var menuState = {
    create: function() {
        game.add.image(0, 0, 'menu');

        var logo = game.add.sprite(game.world.centerX, -60, 'logo');
        logo.anchor.setTo(0.5);
        game.add.tween(logo).to({ y: 120 }, 1000, Phaser.Easing.Bounce.Out, true);

        playBtn = AddButton(game.world.centerX, game.world.centerY + 225, 'playBtn', 0.5, 'clickSE');
        playBtn.onInputUp.add(function() {
            var tween = game.add.tween(playBtn).to({ alpha: 0 }, 300, Phaser.Easing.Linear.None, true, 0, 0, false);
            tween.onComplete.add(function() {
                // if (IsLogin && GameType != 'normal') {
                //     showBanner();
                // } else {
                    game.state.start('story');
                // }
            });
        });

        // if (StatusFlag != 0 && StatusFlag != 5) {
        //     showMessageModal(StatusText);
        // }

        // function showBanner() {
        //     var share = game.add.sprite(game.world.width - 120, game.world.height - 60);
        //     FBshare = share.addChild(AddButton(0, 0, 'FBshare', 0.5, 'clickSE'));
        //     FBshare.onInputUp.add(function() {
        //         shareViaFacebook();
        //     });
        //     LINEshare = share.addChild(AddButton(60, 0, 'LINEshare', 0.5, 'clickSE'));
        //     LINEshare.onInputUp.add(function() {
        //         shareViaLine();
        //     });
        //     var board;
        //     // GameCostPoint = GameCostPoint.toString(); // 原型態(number)=0 的時候bitmapText無法顯示
        //     // MemberPoint = MemberPoint.toString(); // 原型態(number)=0 的時候bitmapText無法顯示

        //     if (MemberFreeTimes > 0) {
        //         board = game.add.sprite(game.world.centerX, game.world.centerY, 'freebanner');
        //         board.addChild(game.add.bitmapText(60, 30, 'BMFont', MemberFreeTimes, 16));
        //     } else {
        //         board = game.add.sprite(game.world.centerX, game.world.centerY, 'costbanner');
        //         board.addChild(game.add.bitmapText(10, 10, 'BMFont', GameCostPoint, 26)).anchor.setTo(1);
        //         board.addChild(game.add.bitmapText(40, 32, 'BMFont', MemberPoint, 14));
        //     }
        //     board.anchor.setTo(0.5);

        //     cancleBtn = AddButton(game.world.centerX - 75, game.world.centerY + 125, 'cancleBtn', 0.5, 'clickSE');
        //     cancleBtn.onInputUp.add(function() {
        //         setTimeout(function() {
        //             startBtn.inputEnabled = false;
        //             window.history.back(); // 返回到前頁
        //         }, 200);
        //     });
        //     startBtn = AddButton(game.world.centerX + 75, game.world.centerY + 125, 'startBtn', 0.5, 'clickSE');
        //     startBtn.onInputUp.add(function() {
        //         game.add.tween(board).to({ alpha: 0 }, 300, Phaser.Easing.Linear.None, true, 0, 0, false);
        //         share.alpha = 0;
        //         cancleBtn.inputEnabled = false;
        //         setTimeout(function() {
        //             if (MemberFreeTimes > 0 || parseInt(MemberPoint, 10) >= parseInt(GameCostPoint, 10)) {
        //                 game.state.start('story');
        //             } else {
        //                 var tipsboard = game.add.sprite(game.world.centerX, game.world.centerY, 'tipsbanner');
        //                 tipsboard.anchor.setTo(0.5);

        //                 var backBtn = tipsboard.addChild(AddButton(-75, 125, 'cancleBtn', 0.5, 'clickSE'));
        //                 backBtn.onInputUp.add(function() {
        //                     setTimeout(function() {
        //                         share.alpha = 1;
        //                         startBtn.inputEnabled = true;
        //                         cancleBtn.inputEnabled = true;
        //                         tipsboard.destroy();
        //                         game.add.tween(board).to({ alpha: 1 }, 300, Phaser.Easing.Linear.None, true, 0, 0, false);
        //                     }, 200);
        //                 }, 0, 1, 0);

        //                 var storeBtn = tipsboard.addChild(AddButton(75, 125, 'storeBtn', 0.5, 'clickSE'));
        //                 storeBtn.onInputUp.add(function() {
        //                     window.location.replace('/buycoins'); // 連接到儲值頁
        //                 }, 200);
        //             }
        //         }, 200);
        //     });
        // }
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
        soundStory = game.add.sound('storySE', 1, true);
        soundStory.play();

        var waitForStart = false;
        var page = 0;
        var picArray = ['story', 'story2', 'story3', 'teach'];
        for (var i = picArray.length - 1; i >= 0; i--) {
            picArray[i] = game.add.sprite(0, 0, picArray[i]);
            picArray[i].inputEnabled = true;
        }

        picArray[page].events.onInputDown.add(nextPage, this);

        var skip = AddButton(game.world.width - 60, game.world.height - 40, 'skip', 0.5, 'clickSE');
        skip.onInputUp.add(function() {
            for (var j = 0; j < picArray.length - 2; j++) {
                picArray[j].alpha = 0;
            }
            page = picArray.length - 2
            nextPage();
        });

        function nextPage() {
            if (waitForStart == true) return

            PlayAudio('clickSE', 1);

            // 教學 -> 進遊戲
            if (page >= picArray.length - 1) {
                waitForStart = true;

                // ajax取得遊戲參數
                // startData();
                game.state.start('game');
            } else {
                // 故事最後一頁 -> 下一頁不用skip按鈕
                if (page == picArray.length - 2) {
                    skip.destroy();
                }
                picArray[page].alpha = 0;
                page += 1;
            }
        }
    }
};

var overState = {
    create: function() {
        game.add.image(0, 0, 'end');
        // game.add.text(42, 10, 'ID: ' + PlayerID, { fill: '#000', fontSize: "12px" });
        // game.add.text(40, 25, 'SN: ' + PlayerSN, { fill: '#000', fontSize: "12px" });

        game.add.sprite(game.world.centerX, game.world.centerY, 'scorebanner').anchor.setTo(0.5);
        score = score.toString(); // 原型態(number)=0 的時候bitmapText無法顯示
        game.add.bitmapText(game.world.centerX, game.world.centerY + 10, 'BMFont', score, 40).anchor.setTo(0.5);

        var stamp = game.add.sprite(game.world.centerX - 195, game.world.centerY - 165, 'stamp');
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
        //     }, 400)
        // }

        leaveBtn = AddButton(game.world.centerX - 75, game.world.centerY + 125, 'cancleBtn', 0.5, 'clickSE');
        leaveBtn.onInputUp.add(function() {
            restartBtn.inputEnabled = false;
            setTimeout(function() {
                window.history.back() // 返回到前頁
            }, 200);
        });
        restartBtn = AddButton(game.world.centerX + 75, game.world.centerY + 125, 'restartBtn', 0.5, 'clickSE');
        restartBtn.onInputUp.add(function() {
            stamp.alpha = 0;
            leaveBtn.inputEnabled = false;
            setTimeout(function() {
                game.state.start('menu');
            }, 200);
        })

        // 遊客模式
        // if (!IsLogin) {
        //     login = AddButton(game.world.centerX + 120, game.world.centerY - 95, 'login', 0.5, 'clickSE');
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
        //         bag = AddButton(game.world.centerX + 120, game.world.centerY - 95, 'bag', 0.5, 'clickSE');
        //         bag.onInputUp.add(function() {
        //             setTimeout(function() {
        //                 window.location.replace('/member/pocket'); // 連接到商城頁-背包
        //             }, 200);
        //         });
        //     }
        //     // 排行賽
        //     else if (GameType == 'ranking') {
        //         rank = AddButton(game.world.centerX + 120, game.world.centerY - 95, 'rank', 0.5, 'clickSE');
        //         rank.onInputUp.add(function() {
        //             setTimeout(function() {
        //                 showBoardDialog();
        //             }, 200);
        //         });
        //     }
        // }
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
// function successStartData() {
//     boxRate = parseInt(GameParameters.boxRate);
//     bonus_Lv1_MinSpeed = parseInt(GameParameters.bonus_Lv1_MinSpeed);
//     bonus_Lv1_MaxSpeed = parseInt(GameParameters.bonus_Lv1_MaxSpeed);
//     bonus_Lv2_MinSpeed = parseInt(GameParameters.bonus_Lv2_MinSpeed);
//     bonus_Lv2_MaxSpeed = parseInt(GameParameters.bonus_Lv2_MaxSpeed);
//     normal_Lv1_MinSpeed = parseInt(GameParameters.normal_Lv1_MinSpeed);
//     normal_Lv1_MaxSpeed = parseInt(GameParameters.normal_Lv1_MaxSpeed);
//     normal_Lv2_MinSpeed = parseInt(GameParameters.normal_Lv2_MinSpeed);
//     normal_Lv2_MaxSpeed = parseInt(GameParameters.normal_Lv2_MaxSpeed);

//     entryNum = parseInt(GameParameters.entryNum);
//     point1 = parseInt(GameParameters.point1);
//     point2 = parseInt(GameParameters.point2);
//     point3 = parseInt(GameParameters.point3);
//     point4 = parseInt(GameParameters.point4);
//     point5 = parseInt(GameParameters.point5);

//     console.log('新增的頻率: ' + boxRate);
//     console.log('加分模式Lv1_移動的最少時間: ' + bonus_Lv1_MinSpeed);
//     console.log('加分模式Lv1_移動的最大時間: ' + bonus_Lv1_MaxSpeed);
//     console.log('加分模式Lv2_移動的最少時間: ' + bonus_Lv2_MinSpeed);
//     console.log('加分模式Lv2_移動的最大時間(: ' + bonus_Lv2_MaxSpeed);
//     console.log('普通模式Lv1_移動的最少時間: ' + normal_Lv1_MinSpeed);
//     console.log('普通模式Lv1_移動的最大時間: ' + normal_Lv1_MaxSpeed);
//     console.log('普通模式Lv2_移動的最少時間: ' + normal_Lv2_MinSpeed);
//     console.log('普通模式Lv2_移動的最大時間: ' + normal_Lv2_MaxSpeed);
//     console.log('進入加分模式的條件(連續完美的顆數): ' + entryNum);
//     console.log('得分_一般: ' + point1);
//     console.log('得分_連續2顆完美: ' + point2);
//     console.log('得分_連續3顆完美: ' + point3);
//     console.log('得分_連續4顆完美: ' + point4);
//     console.log('得分_連續5顆完美: ' + point5);

//     game.state.start('game');
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