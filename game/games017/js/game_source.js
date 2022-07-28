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

var floor;
var PlayHistories;
var gameIsOver;

var timer = 10;
// 平台上升速度
var stepVelocity = 150;
// 平台新增頻率(毫秒)
var frequency = 1000;
// 角色移動速度
var playerMoveSpeed = 250;
// 角色重力
var playerGravity = 1200;
// 角色彈跳程度
var playerJump = 200;
// 角色無敵時間(受傷後)
var unhurtTime = 800;

/***********平台機率***********/
// 一般平台
var rangeNormal = 30;
// 尖刺平台
var rangeNails = 60;
// 運輸平台(左)
var rangeConveyorL = 70;
// 運輸平台(右)
var rangeConveyorR = 80;
// 彈跳平台
var rangeTrampoline = 90;


/****************** 遊 戲 說 明 【防疫先鋒】 ******************/

// 每一階PlayHistories++，每三階 = 1層，層數floor = 分數
// 遊戲歷程 : PlayHistories / 3 = 分數

/*************************************************************/

// 角色能力值
var player;
var playerHp = 6;
var hurtblood = 1; // 受傷扣血
var mask; // lifeBar用

// 遊戲狀態
var keyboard; // 鍵盤控制
var platforms; // 地板組
var initPlatform; // 預設平台
var ceilingdepth; // 天花板寬度
var stairs;
var NEWstepVelocity;
var NEWfrequency;
var boost; // 加速(難度門檻)
var lastAdding; // 新增地板時間
var bleeding; // 碰到尖次地板時間
var beingTop; // 碰到天花板時間

// 音效
var isPlayed;
var soundBgm;
var soundStory;
var soundTop;
var soundMove;

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
        // game.load.spritesheet('waiting', '../Mark/waiting.png', 200, 200); // 倒數三秒進遊戲
        game.load.spritesheet('saving', '../Mark/saving.png', 300, 300); // 分數儲存中

        game.load.image('logo', './assets/logo.png');
        game.load.image('menu', './assets/menu.png');
        game.load.image('background', './assets/background.png');
        game.load.image('story', './assets/story.png');
        game.load.image('story2', './assets/story2.png');
        game.load.image('teach', './assets/teach.png');
        game.load.image('fail', './assets/fail.png');

        game.load.image('wallL', './assets/wallL.png');
        game.load.image('wallR', './assets/wallR.png');
        game.load.image('box', './assets/box.png');
        game.load.image('lifeContainer', './assets/lifeContainer.png');
        game.load.image('lifeBar', './assets/lifeBar.png');

        game.load.spritesheet('player', './assets/player.png', 50, 76);
        game.load.spritesheet('ceiling', './assets/ceiling.png', 600, 65);
        game.load.image('normal', './assets/normal.png');
        game.load.spritesheet('conveyorRight', './assets/conveyor_right.png', 120, 50);
        game.load.spritesheet('conveyorLeft', './assets/conveyor_left.png', 120, 50);
        game.load.spritesheet('nail', './assets/nail.png', 120, 80);
        game.load.spritesheet('trampoline', './assets/trampoline.png', 130, 70);
        game.load.spritesheet('fake', './assets/fake.png', 120, 80);

        game.load.image('banner', './assets/banner.png');
        game.load.image('freebanner', './assets/freebanner.png');
        game.load.image('costbanner', './assets/costbanner.png');
        game.load.image('tipsbanner', './assets/tipsbanner.png');
        game.load.image('scorebanner', './assets/scorebanner.png');

        game.load.spritesheet('playBtn', './assets/playBtn.png', 220, 85, 2);
        game.load.spritesheet('startBtn', './assets/startBtn.png', 130, 52, 2);
        game.load.spritesheet('cancleBtn', './assets/cancleBtn.png', 130, 52, 2);
        game.load.spritesheet('restartBtn', './assets/restartBtn.png', 130, 52, 2);
        game.load.spritesheet('storeBtn', './assets/storeBtn.png', 130, 52, 2);
        game.load.spritesheet('bagBtn', './assets/bagBtn.png', 130, 52, 2);
        game.load.spritesheet('okBtn', './assets/okBtn.png', 130, 52, 2);
        game.load.spritesheet('LINEshare', './assets/LINEshare.png', 40, 40, 2);
        game.load.spritesheet('FBshare', './assets/FBshare.png', 40, 40, 2);
        game.load.spritesheet('login', './assets/login.png', 85, 90, 2);
        game.load.spritesheet('rank', './assets/rank.png', 95, 125, 2);
        game.load.spritesheet('bag', './assets/bag.png', 85, 90, 2);

        game.load.bitmapFont('BMFont', '../Font/BMFont_White.png', '../Font/BMFont_White.fnt');

        game.load.audio('bgmSE', './assets/audio/bgm.mp3');
        game.load.audio('storySE', './assets/audio/story.mp3');
        game.load.audio('clickSE', './assets/audio/click.mp3');
        game.load.audio('failSE', './assets/audio/fail.mp3');
        game.load.audio('topSE', './assets/audio/top.mp3'); // 天花板
        game.load.audio('stairSE', './assets/audio/stair.mp3'); // 普通平台
        game.load.audio('jumpSE', './assets/audio/jump.mp3'); // 病床平台
        game.load.audio('moveSE', './assets/audio/move.mp3'); // 針筒平台
        game.load.audio('hurtSE', './assets/audio/hurt.mp3'); // 病毒平台
        game.load.audio('fakeSE', './assets/audio/fake.mp3'); // 藥丸平台
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
        stairs = 0; // 每3階 = 1層
        floor = 0;
        PlayHistories = 0; // 驗證分數
        lastAdding = 0;
        bleeding = 0;
        beingTop = 0;
        initPlatform = 0; // 預設平台
        boost = false; // 加速(難度門檻)
    },

    create: function() {
        gameIsOver = false;
        this.background = game.add.tileSprite(0, 0, game.width, game.height, 'background'); // 循環圖(x, y, width, height, key)

        keyboard = game.input.keyboard.addKeys({
            'left': Phaser.Keyboard.LEFT,
            'right': Phaser.Keyboard.RIGHT,
        });

        soundBgm = game.add.audio('bgmSE', 0.8, true);
        soundTop = game.add.audio('topSE');
        soundMove = game.add.audio('moveSE', 1, true);

        soundStory.fadeOut(1500);
        soundBgm.play();

        NEWstepVelocity = stepVelocity;
        NEWfrequency = frequency;

        // game.add.text(57, 60, 'ID: ' + PlayerID, { fill: '#000', fontSize: "12px" });
        // game.add.text(55, 75, 'SN: ' + PlayerSN, { fill: '#000', fontSize: "12px" });

        this.createBounds();
        this.createPlayer();
        this.floorText = game.add.bitmapText(25, 255, 'BMFont', '', 10);
        this.floorText.anchor.setTo(0.5);
        game.add.bitmapText(15, 270, 'BMFont', '層', 12);

        platforms = [];
        keyboard.right.isDown = false;
        keyboard.left.isDown = false;

        // 左右控制
        game.input.onDown.add(this.onDown, this);
        game.input.onUp.add(this.onUp, this);
        // 隱藏功能，連擊加速
        game.input.onTap.add(this.onTap, this);
    },

    onDown: function(pointer) {
        if (pointer.x > game.world.centerX) {
            keyboard.left.isDown = false;
            keyboard.right.isDown = true;
        } else if (pointer.x < game.world.centerX) {
            keyboard.left.isDown = true;
            keyboard.right.isDown = false;
        } else {
            console.log("X: " + game.input.x);
        }
    },
    onUp: function(pointer) {
        if (pointer.x > game.world.centerX) {
            keyboard.right.isDown = false;
        } else if (pointer.x < game.world.centerX) {
            keyboard.left.isDown = false;
        }
    },
    onTap: function(pointer, doubleTap) {
        if (doubleTap) {
            NEWstepVelocity += 120;
            setTimeout(function() {
                NEWstepVelocity -= 120;
            }, 800);
        }
    },

    // 創建 左右牆面 + 天花板針刺 + 闖關UI
    createBounds: function() {
        this.leftWall = game.add.sprite(0, 0, 'wallL');
        game.physics.arcade.enable(this.leftWall);
        this.leftWall.body.immovable = true;

        this.rightWall = game.add.sprite(550, 0, 'wallR');
        game.physics.arcade.enable(this.rightWall);
        this.rightWall.body.immovable = true;

        this.ceiling = game.add.sprite(0, 0, 'ceiling');
        ceilingdepth = this.ceiling.height - 15;
        this.ceiling.animations.add('fire', [0, 1, 2], 8, true);
        this.ceiling.play('fire');

        var box = game.add.image(25, 267, 'box');
        box.anchor.setTo(0.5);
        var lifeContainer = game.add.image(25, 400, 'lifeContainer');
        lifeContainer.anchor.setTo(0.5);
        var lifeBar = game.add.image(25, 400, 'lifeBar');
        lifeBar.anchor.setTo(0.5);

        mask = game.add.graphics(0, 0);
        mask.beginFill(0xffffff);
        mask.drawRect(20, 355, 12, 125); // (x ,y ,width ,height)
        mask.anchor.setTo(0.5);
        lifeBar.mask = mask;
    },

    // 創建 玩家屬性及狀態
    createPlayer: function() {
        player = game.add.sprite(game.world.centerX, 120, 'player');
        game.physics.arcade.enable(player);
        // 碰撞內縮 (寬度 ,高度 ,x ,y)
        player.body.setSize(36, 57, 7, 15); // 原大小50x76

        player.animations.add('left', [0, 1, 2, 3], 8);
        player.animations.add('left_lessHp', [4, 5, 6, 7], 8);
        player.animations.add('right', [8, 9, 10, 11], 8);
        player.animations.add('right_lessHp', [12, 13, 14, 15], 8);
        player.animations.add('flyleft', [16, 17, 18, 19], 12);
        player.animations.add('flyleft_lessHp', [20, 21, 22, 23], 12);
        player.animations.add('flyright', [24, 25, 26, 27], 12);
        player.animations.add('flyright_lessHp', [28, 29, 30, 31], 12);
        player.animations.add('fly', [32, 33, 34, 35], 12);
        player.animations.add('fly_lessHp', [36, 37, 38, 39], 12);
        player.life = playerHp;
        player.body.gravity.y = playerGravity;
        player.moveSpeed = playerMoveSpeed;

        player.touchOn = 0; // 初始觸碰(0:無，1:接觸)
    },
    render() {
        // game.debug.bodyInfo(player, 32, 32);
        // game.debug.body(player);
    },

    update: function() {
        if (gameIsOver) return;

        if (player.life <= 0 || player.body.y > game.world.height + 50) {
            gameIsOver = true;
            setTimeout(function() {
                gameOver();
            }, 500)
        }

        this.background.tilePosition.y -= 1;

        this.floorText.setText(floor);
        // 難度調整
        this.level();

        // 平台音效
        if (player.touchOn == 0) {
            isPlayed = 0;
            soundMove.stop();
            soundTop.stop();
        }

        player.touchOn = 0;
        this.physics.arcade.collide(player, platforms, effect);
        this.physics.arcade.collide(player, [this.leftWall, this.rightWall]);

        this.createPlatforms();
        this.updatePlayer();
        this.updatePlatforms();
        game.world.bringToTop(player);

        // 如果碰到天花板
        if (player.body.y < ceilingdepth) {
            if (player.body.velocity.y < 0) {
                player.body.velocity.y = 0;
            }
            this.touchCeiling(player);
        }
    },

    // 難度提升
    level: function() {
        if (stairs == 1) {
            boost = false;
        }
        // 10層以上開始加速
        if (boost == false && floor >= 10 && floor < 75) {
            // 每五層調一次難度
            if (floor % 5 == 0 && stairs == 0) {
                playerGravity += 70;
                player.moveSpeed += 2;
                NEWstepVelocity += 25;
                NEWfrequency -= 40;
                boost = true;
            }
        }
    },

    // 創建平台規則
    createPlatforms: function() {
        // 碰到天花板新增速度較慢
        if (player.body.y < ceilingdepth) {
            if (game.time.now > lastAdding + NEWfrequency * 1.3) {
                lastAdding = game.time.now;
                this.createOnePlatform();
            }
        } else {
            if (game.time.now > lastAdding + NEWfrequency) {
                lastAdding = game.time.now;
                this.createOnePlatform();
            }
        }
    },

    // 平台屬性 + 創建規則
    createOnePlatform: function() {
        stairs += 1;
        if (stairs == 3) {
            floor += 1;
            PlayHistories += stairs;
            stairs = 0;
        }
        var platform;
        var x = Math.random() * (game.world.width - this.leftWall.width - this.rightWall.width - 120) + this.leftWall.width;
        var y = game.world.height - 20;
        var rand = Math.random() * 100;
        if (initPlatform < 3) {
            if (initPlatform == 0) {
                platform = game.add.sprite(game.world.centerX - 40, 550 + initPlatform * 100, 'normal');
            } else {
                platform = game.add.sprite(x, 550 + initPlatform * 120, 'normal');
            }
            initPlatform++;
        } else if (rand < rangeNormal) {
            platform = game.add.sprite(x, y, 'normal');
        } else if (rand < rangeNails) {
            platform = game.add.sprite(x, y, 'nail');
            platform.animations.add('sting', [0, 1, 2, 3, 4], 8, true); // 平常的動畫
            platform.animations.add('onsting', [5, 6, 7, 8, 9], 8, true); // 踩到的動畫
            platform.play('sting');
            game.physics.arcade.enable(platform);
            platform.body.setSize(106, 30, 7, 42); // 原大小120x80
        } else if (rand < rangeConveyorL) {
            platform = game.add.sprite(x, y, 'conveyorLeft');
            platform.animations.add('scroll', [0, 1, 2, 3], 6, true);
            platform.play('scroll');
        } else if (rand < rangeConveyorR) {
            platform = game.add.sprite(x, y, 'conveyorRight');
            platform.animations.add('scroll2', [0, 1, 2, 3], 6, true);
            platform.play('scroll2');
        } else if (rand < rangeTrampoline) {
            platform = game.add.sprite(x, y, 'trampoline');
            platform.animations.add('up', [0, 1, 2, 3], 18);
            game.physics.arcade.enable(platform);
            platform.body.setSize(106, 40, 12, 13); // 原大小130x50
        } else {
            platform = game.add.sprite(x, y, 'fake');
            platform.animations.add('turn', [0, 1, 2, 3, 4], 30);
        }

        game.physics.arcade.enable(platform);
        platform.body.immovable = true;
        platforms.push(platform);

        platform.body.checkCollision.down = false;
        platform.body.checkCollision.left = false;
        platform.body.checkCollision.right = false;
    },

    // 更新玩家屬性及狀態
    updatePlayer: function() {
        if (keyboard.left.isDown) {
            player.body.velocity.x = -player.moveSpeed;
        } else if (keyboard.right.isDown) {
            player.body.velocity.x = player.moveSpeed;
        } else {
            player.body.velocity.x = 0;
        }
        this.setPlayerAnimate(player);
    },

    // 角色動畫
    setPlayerAnimate: function(player) {
        var x = player.body.velocity.x;
        var waringHp = parseInt(playerHp / 3);

        if (x < 0 && player.touchOn == 0) {
            if (player.life < waringHp) {
                player.animations.play('flyleft_lessHp');
            } else {
                player.animations.play('flyleft');
            }
        }
        if (x > 0 && player.touchOn == 0) {
            if (player.life < waringHp) {
                player.animations.play('flyright_lessHp');
            } else {
                player.animations.play('flyright');
            }
        }
        if (x < 0 && player.touchOn == 1) {
            if (player.life < waringHp) {
                player.animations.play('left_lessHp');
            } else {
                player.animations.play('left');
            }
        }
        if (x > 0 && player.touchOn == 1) {
            if (player.life < waringHp) {
                player.animations.play('right_lessHp');
            } else {
                player.animations.play('right');
            }
        }
        if (x == 0 && player.touchOn == 0) {
            if (player.life < waringHp) {
                player.animations.play('fly_lessHp');
            } else {
                player.animations.play('fly');
            }
        }
        if (x == 0 && player.touchOn == 1) {
            if (player.life < waringHp) {
                player.frame = 39;
            } else {
                player.frame = 35;
            }
        }
    },

    // 平台更新規則
    updatePlatforms: function() {
        for (var i = 0; i < platforms.length; i++) {
            var platform = platforms[i];
            // 如果被天花板刺到，平台減速
            if (player.body.y < ceilingdepth) {
                platform.body.velocity.y = -NEWstepVelocity / 3;
            } else {
                platform.body.velocity.y = -NEWstepVelocity;
            }
            // 如果平台超過天花板，該平台刪除
            if (platform.body.position.y <= ceilingdepth) {
                platform.destroy();
                platforms.splice(i, 1);
            }
            // 平台動畫復原
            if (platform.key == 'nail' && player.touchOn == 0) {
                platform.animations.play('sting');
                // beingTop = 0;
            }
            // game.debug.body(platform);
        }
    },

    // 如果被天花板刺到
    touchCeiling: function(player) {
        if (game.time.now > beingTop) {
            if (player.life <= 0) {
                player.life = 0;
            }
            beingTop = game.time.now + unhurtTime;
            player.life -= hurtblood;
            mask.y += 21 * hurtblood; // lifeBar
            game.camera.flash(0xff0000, 100);
            soundTop.play();
        }
    },
};

function effect(player, platform) {
    player.touchOn = 1;

    // 運輸(右)平台效果
    if (platform.key == 'conveyorRight') {
        player.body.x += 2;
        if (isPlayed == 0) {
            soundMove.play();
            isPlayed = 1;
        }
    }
    // 運輸(左)平台效果
    if (platform.key == 'conveyorLeft') {
        player.body.x -= 2;
        if (isPlayed == 0) {
            soundMove.play();
            isPlayed = 1;
        }
    }
    // 尖刺平台效果
    if (platform.key == 'nail') {
        platform.animations.play('onsting');
        // 持續扣血
        if (game.time.now > bleeding) {
            bleeding = game.time.now + unhurtTime;
            PlayAudio('hurtSE', 1);
            player.life -= hurtblood;
            mask.y += 21 * hurtblood; // lifeBar
            game.camera.flash(0xff0000, 100);
        }
        if (player.life <= 0) {
            player.life = 0;
        }
    }
    // 一般平台效果
    if (platform.key == 'normal') {
        if (isPlayed == 0) {
            PlayAudio('stairSE', 1);
            isPlayed = 1;
        }
    }
    // 彈跳平台效果
    if (platform.key == 'trampoline') {
        platform.animations.play('up');
        PlayAudio('jumpSE', 1);

        if (player.life < playerHp) {
            player.life += 1;
            mask.y -= 21 * hurtblood; // lifeBar
        }

        platform.animations.play('jump');
        player.body.velocity.y -= playerJump;

        if (player.body.y < ceilingdepth) {
            setTimeout(function() {
                platform.body.enable = false;
                platform.kill();
            }, 80)
        }
    }
    // 假平台效果
    if (platform.key == 'fake') {
        setTimeout(function() {
            platform.body.enable = false;
        }, 50)

        platform.animations.play('turn');
        platform.animations.currentAnim.onComplete.add(function() {
            platform.kill();
        }, this);

        if (isPlayed == 0) {
            PlayAudio('fakeSE', 1);
            isPlayed = 1;
        }
    }
}

// 遊戲結束
function gameOver() {
    soundBgm.fadeOut(800);
    game.add.audio('failSE', 2).play();
    game.add.image(0, 0, 'cover').alpha = 0.5;

    var fail = game.add.sprite(game.world.centerX, 0, 'fail');
    fail.anchor.setTo(0.5);
    fail.angle = -5;
    var failTween = game.add.tween(fail).to({ y: game.world.centerY }, 1000, Phaser.Easing.Bounce.Out, true);
    failTween.onComplete.add(function() {
        setTimeout(function() {
            var saving = game.add.sprite(game.world.centerX, game.world.centerY, 'saving');
            saving.anchor.setTo(0.5);
            saving.scale.setTo(0.5);
            saving.animations.add('saving');
            saving.animations.play('saving', 12, true);

            // 回傳分數
            // sendScore(floor, PlayHistories);
            game.state.start('over');
        }, 1200);
    });
};

var menuState = {
    create: function() {
        game.add.image(0, 0, 'menu');

        var logo = game.add.sprite(game.world.centerX, -85, 'logo');
        logo.anchor.setTo(0.5);
        game.add.tween(logo).to({ y: 130 }, 1000, Phaser.Easing.Bounce.Out, true);

        playBtn = AddButton(game.world.centerX, game.world.centerY + 200, 'playBtn', 0.5, 'clickSE');
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
        //     var share = game.add.sprite(game.world.width - 90, game.world.height - 60);
        //     FBshare = share.addChild(AddButton(0, 0, 'FBshare', 0.5, 'clickSE'));
        //     FBshare.onInputUp.add(function() {
        //         shareViaFacebook();
        //     });
        //     LINEshare = share.addChild(AddButton(50, 0, 'LINEshare', 0.5, 'clickSE'));
        //     LINEshare.onInputUp.add(function() {
        //         shareViaLine();
        //     });
        //     var board;
        //     // GameCostPoint = GameCostPoint.toString(); // 原型態(number)=0 的時候bitmapText無法顯示
        //     // MemberPoint = MemberPoint.toString(); // 原型態(number)=0 的時候bitmapText無法顯示

        //     if (MemberFreeTimes > 0) {
        //         board = game.add.sprite(game.world.centerX, game.world.centerY, 'freebanner');
        //         board.addChild(game.add.bitmapText(65, 72, 'BMFont', MemberFreeTimes, 14));
        //     } else {
        //         board = game.add.sprite(game.world.centerX, game.world.centerY, 'costbanner');
        //         board.addChild(game.add.bitmapText(-10, 50, 'BMFont', GameCostPoint, 26)).anchor.setTo(1);
        //         board.addChild(game.add.bitmapText(40, 72, 'BMFont', MemberPoint, 14));
        //     }
        //     board.anchor.setTo(0.5);

        //     cancleBtn = AddButton(game.world.centerX - 80, game.world.centerY + 145, 'cancleBtn', 0.5, 'clickSE');
        //     cancleBtn.onInputUp.add(function() {
        //         setTimeout(function() {
        //             startBtn.inputEnabled = false;
        //             window.history.back(); // 返回到前頁
        //         }, 200);
        //     });
        //     startBtn = AddButton(game.world.centerX + 75, game.world.centerY + 145, 'startBtn', 0.5, 'clickSE');
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

        //                 var backBtn = tipsboard.addChild(AddButton(-80, 145, 'cancleBtn', 0.5, 'clickSE'));
        //                 backBtn.onInputUp.add(function() {
        //                     setTimeout(function() {
        //                         share.alpha = 1;
        //                         startBtn.inputEnabled = true;
        //                         cancleBtn.inputEnabled = true;
        //                         tipsboard.destroy();
        //                         game.add.tween(board).to({ alpha: 1 }, 300, Phaser.Easing.Linear.None, true, 0, 0, false);
        //                     }, 200);
        //                 }, 0, 1, 0);

        //                 var storeBtn = tipsboard.addChild(AddButton(75, 145, 'storeBtn', 0.5, 'clickSE'));
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
        var picArray = ['story', 'story2', 'teach'];
        for (var i = picArray.length - 1; i >= 0; i--) {
            picArray[i] = game.add.sprite(0, 0, picArray[i]);
            picArray[i].inputEnabled = true;
        }

        picArray[page].events.onInputDown.add(nextPage, this);

        function nextPage() {
            if (waitForStart == true) return

            PlayAudio('clickSE', 1);

            if (page >= picArray.length - 1) {
                waitForStart = true;

                // ajax取得遊戲參數
                // startData();
                game.state.start('game');
            } else {
                picArray[page].alpha = 0;
                page += 1;
            }
        }
    }
}

var overState = {
    create: function() {
        game.add.image(0, 0, 'menu');
        // game.add.text(30, 20, 'ID: ' + PlayerID, { fill: '#000', fontSize: "12px" });
        // game.add.text(30, 35, 'SN: ' + PlayerSN, { fill: '#000', fontSize: "12px" });

        game.add.sprite(game.world.centerX, game.world.centerY, 'scorebanner').anchor.setTo(0.5);
        floor = floor.toString(); // 原型態(number)=0 的時候bitmapText無法顯示
        game.add.bitmapText(game.world.centerX - 60, game.world.centerY + 55, 'BMFont', floor, 28).anchor.setTo(0.5);

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
        //     }, 400)
        // }

        leaveBtn = AddButton(game.world.centerX - 80, game.world.centerY + 145, 'cancleBtn', 0.5, 'clickSE');
        leaveBtn.onInputUp.add(function() {
            restartBtn.inputEnabled = false;
            setTimeout(function() {
                window.history.back() // 返回到前頁
            }, 200);
        });
        restartBtn = AddButton(game.world.centerX + 75, game.world.centerY + 145, 'restartBtn', 0.5, 'clickSE');
        restartBtn.onInputUp.add(function() {
            stamp.alpha = 0;
            leaveBtn.inputEnabled = false;
            setTimeout(function() {
                game.state.start('menu');
            }, 200);
        })

        // 遊客模式
        // if (!IsLogin) {
        //     login = AddButton(game.world.centerX + 125, game.world.centerY - 45, 'login', 0.5, 'clickSE');
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
        //         bag = AddButton(game.world.centerX + 125, game.world.centerY - 45, 'bag', 0.5, 'clickSE');
        //         bag.onInputUp.add(function() {
        //             setTimeout(function() {
        //                 window.location.replace('/member/pocket'); // 連接到商城頁-背包
        //             }, 200);
        //         });
        //     }
        //     // 排行賽
        //     else if (GameType == 'ranking') {
        //         rank = AddButton(game.world.centerX + 125, game.world.centerY - 45, 'rank', 0.5, 'clickSE');
        //         rank.onInputUp.add(function() {
        //             setTimeout(function() {
        //                 showBoardDialog();
        //             }, 200);
        //         });
        //     }
        // }
    }
}

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
//     timer = parseInt(GameParameters.timer);
//     stepVelocity = parseInt(GameParameters.stepVelocity);
//     frequency = parseInt(GameParameters.frequency);
//     playerMoveSpeed = parseInt(GameParameters.playerMoveSpeed);
//     playerGravity = parseInt(GameParameters.playerGravity);
//     unhurtTime = parseInt(GameParameters.unhurtTime);
//     rangeNormal = parseInt(GameParameters.rangeNormal);
//     rangeNails = parseInt(GameParameters.rangeNails);
//     rangeConveyorL = parseInt(GameParameters.rangeConveyorL);
//     rangeConveyorR = parseInt(GameParameters.rangeConveyorR);
//     rangeTrampoline = parseInt(GameParameters.rangeTrampoline);

//     console.log('遊戲時間: ' + timer);
//     console.log('平台上升速度: ' + stepVelocity);
//     console.log('平台新增頻率: ' + frequency);
//     console.log('角色移動速度: ' + playerMoveSpeed);
//     console.log('角色重力: ' + playerGravity);
//     console.log('角色無敵時間: ' + unhurtTime);
//     console.log('平台機率(一般): ' + rangeNormal);
//     console.log('平台機率(尖刺): ' + rangeNails);
//     console.log('平台機率(運輸左): ' + rangeConveyorL);
//     console.log('平台機率(運輸右): ' + rangeConveyorR);
//     console.log('平台機率(彈跳): ' + rangeTrampoline);

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