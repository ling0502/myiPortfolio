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

/* * * * phaser 3 * * * */

var game;
// 分數 (預設:0，通關=時間)
var score;
var bestScore;
var PlayHistories = ''; // 遊戲歷程

// 遊戲時間
var timer = 50;
// 關卡
var level = 1;
// 剩餘數量
var countNum;

// 飛刀數量
var lv1num = 3;
var lv2num = 3;
var lv3num = 3;

// 尾刀改變速度(偏移)
var isShift = 1;
// 每禎旋轉角度
var rotationSpeed = 1.7;
// 刀的速度(飛出/掉落)
var throwSpeed = 150;
// 刀與刀之間的最小角度(影響角度)
var minAngle = 15;

// 倒數進入遊戲時間
var entryTime;
// 最大轉動的變化量
var rotationVariation = 6;
// 過幾秒變更速度
var changeTime = 1.6;
// 最大旋轉速度
var maxRotationSpeed = 6;

// 音效
var soundBgm;
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

/****************** 遊 戲 說 明 【星際救援】 ******************/

var getScore; // 遊戲是否通關 0:否,1:是
var A; // (LV1)s 花費A時間
var B; // (LV2)s 花費B時間
var C; // (LV3)s 花費C時間
// 遊戲歷程 : 以上兩位數轉為字串相加ABC = PlayHistories

/*************************************************************/

class boot extends Phaser.Scene {
    constructor() {
        super('boot');
    }

    preload() {
        this.load.image('loading', '../Mark/preloader.gif');
        this.load.image('dauchung', '../Mark/dauchung.png');
    }

    create() {
        this.scene.start('load');
    }
}
class load extends Phaser.Scene {
    constructor() {
        super('load');
    }

    // Phaser 3 - loadingbar
    setPreloadSprite(sprite) {
        this.preloadSprite = { sprite: sprite, width: sprite.width, height: sprite.height };
        this.load.on('progress', this.onProgress, this);
    }
    onProgress(value) {
        if (this.preloadSprite) {
            var w = Math.floor(this.preloadSprite.width * value);
            this.preloadSprite.sprite.frame.width = (w <= 0 ? 1 : w);
            this.preloadSprite.sprite.frame.cutWidth = w;
            // 更新紋理
            this.preloadSprite.sprite.frame.updateUVs();
        }
    }
    preload() {
        this.loadingbar = this.add.sprite(game.config.width / 2, game.config.height * 0.65, 'loading');
        this.setPreloadSprite(this.loadingbar);
        this.add.sprite(game.config.width / 2, game.config.height * 0.4, 'dauchung');

        this.load.image('cover', '../Mark/cover01.png'); // 黑色底圖
        this.load.spritesheet('stamp', '../Mark/stamp.png', { frameWidth: 150, frameHeight: 150 }); // 通關章
        this.load.spritesheet('waiting', '../Mark/waiting.png', { frameWidth: 200, frameHeight: 200 }); // 倒數三秒進遊戲
        this.load.spritesheet('saving', '../Mark/saving.png', { frameWidth: 300, frameHeight: 300 }); // 分數儲存中

        this.load.image('logo', './assets/logo.png');
        this.load.image('menu', './assets/menu.png');
        this.load.image('background', './assets/background.png');
        this.load.image('end', './assets/end.png');
        this.load.image('story', './assets/story.png');
        this.load.image('story2', './assets/story2.png');
        this.load.image('teach', './assets/teach.png');
        this.load.image('ball', './assets/ball.png');
        this.load.image('block', './assets/block.png');
        this.load.image('complete', './assets/complete.png');
        this.load.image('fail', './assets/fail.png');

        // 飛刀組
        this.load.spritesheet("knifes", "./assets/knifes.png", { frameWidth: 40, frameHeight: 50 });
        // 數量組
        this.load.spritesheet("nums", "./assets/nums.png", { frameWidth: 24, frameHeight: 35 });
        // 圓環
        this.load.spritesheet('circle', './assets/circle.png', { frameWidth: 220, frameHeight: 220 });
        // 爆炸效果
        this.load.spritesheet('myexplode', './assets/myexplode.png', { frameWidth: 80, frameHeight: 80 });

        this.load.image('banner', './assets/banner.png');
        this.load.image('costbanner', './assets/costbanner.png');
        this.load.image('freebanner', './assets/freebanner.png');
        this.load.image('tipsbanner', './assets/tipsbanner.png');
        this.load.image('failbanner', './assets/failbanner.png');
        this.load.image('scorebanner', './assets/scorebanner.png');

        this.load.spritesheet('startBtn', './assets/startBtn.png', { frameWidth: 150, frameHeight: 81 });
        this.load.spritesheet('cancleBtn', './assets/cancleBtn.png', { frameWidth: 150, frameHeight: 81 });
        this.load.spritesheet('restartBtn', './assets/restartBtn.png', { frameWidth: 150, frameHeight: 81 });
        this.load.spritesheet('storeBtn', './assets/storeBtn.png', { frameWidth: 150, frameHeight: 81 });
        this.load.spritesheet('bagBtn', './assets/bagBtn.png', { frameWidth: 150, frameHeight: 81 });
        this.load.spritesheet('okBtn', './assets/okBtn.png', { frameWidth: 150, frameHeight: 81 });
        this.load.spritesheet('LINEshare', './assets/LINEshare.png', { frameWidth: 40, frameHeight: 40 });
        this.load.spritesheet('FBshare', './assets/FBshare.png', { frameWidth: 40, frameHeight: 40 });
        this.load.spritesheet('login', './assets/login.png', { frameWidth: 100, frameHeight: 60 });
        this.load.spritesheet('rank', './assets/rank.png', { frameWidth: 100, frameHeight: 60 });
        this.load.spritesheet('bag', './assets/bag.png', { frameWidth: 100, frameHeight: 60 });

        this.load.bitmapFont('BMFont_White', '../Font/BMFont_White.png', '../Font/BMFont_White.fnt');
        this.load.bitmapFont('BMFont_Black', '../Font/BMFont_Black.png', '../Font/BMFont_Black.fnt');

        this.load.audio('bgmSE', './assets/audio/bgm.mp3');
        this.load.audio('storySE', './assets/audio/story.mp3');
        this.load.audio('clickSE', './assets/audio/click.mp3');
        this.load.audio('correctSE', './assets/audio/correct.mp3');
        this.load.audio('errorSE', './assets/audio/error.mp3');
        this.load.audio('winSE', './assets/audio/win.mp3');
        this.load.audio('failSE', './assets/audio/fail.mp3');
    }

    create() {
        // 綁定connect.js功能
        // SetPreShowDialog(PreShowDialog);
        // SetCompleteCloseDialog(completeCloseDialog);
        // SetSuccessStartData(successStartData);
        // SetSuccessScoreData(successScoreData);

        this.scene.start('menu');
    }
}

class play extends Phaser.Scene {
    constructor() {
        super('play');
    }
    init() {
        timer = 50;

        this.canThrow = true;
        this.gameIsOver = false;
        this.block = [];
        this.blockExist = false;
    }
    create() {
        this.add.image(0, 0, 'background').setOrigin(0);

        if (level == 1) {
            //設定三秒後進入遊戲
            entryTime = 3;
            this.firstStart();
        } else {
            entryTime = 0;
            //第二關之後開始有障礙
            this.addBlock();
        }

        this.setNewValue();
        this.createDefaultKnife();
        this.changeRotationSpeed();
        // this.add.text(12, 10, 'ID: ' + PlayerID, { fill: '#888', fontSize: '12px' });
        // this.add.text(10, 25, 'SN: ' + PlayerSN, { fill: '#888', fontSize: '12px' });

        this.add.bitmapText(game.config.width - 120, 50, 'BMFont_White', 'Ｌｅｖｅｌ', 14);
        this.levelText = this.add.bitmapText(game.config.width - 75, 85, 'BMFont_White', level, 14);
        this.add.bitmapText(20, 60, 'BMFont_White', '00：', 14);
        this.currentTime = this.currentTime.toString().padStart(2, '0');
        this.timeText = this.add.bitmapText(90, 60, 'BMFont_White', this.currentTime, 14);
        this.numText = this.add.bitmapText(game.config.width / 2 - 18, game.config.height - 86, 'BMFont_White', countNum, 16);

        this.circle = this.add.sprite(game.config.width / 2, game.config.height * 0.25, 'circle', 3);
        this.ball = this.add.image(game.config.width / 2, game.config.height / 2 - 205, 'ball');
        this.tweens.add({
            targets: [this.ball],
            scale: '-=0.05',
            duration: 800,
            repeat: -1,
        });

        // 每秒更新倒數時間
        this.timerEvents = this.time.addEvent({
            delay: 1000,
            callback: function() {
                entryTime--;
                if (entryTime < 1) {
                    this.circle.depth = 1;
                    this.cover.destroy(true);
                    this.updateCounter();
                }
            },
            callbackScope: this,
            loop: true
        });
    }

    firstStart() {
        this.tweens.add({
            targets: soundStory,
            volume: 0,
            duration: 1000
        });
        soundBgm = this.sound.add('bgmSE', { loop: -1 });
        soundBgm.play();

        score = 0;
        this.currentTime = timer;

        A = 0;
        B = 0;
        C = 0;
        getScore = '0';

        this.cover = this.add.image(0, 0, 'cover').setOrigin(0);
        this.cover.depth = 1;
        this.anims.create({
            key: 'waiting',
            frames: this.anims.generateFrameNumbers('waiting', { start: 0, end: 60 }),
            duration: 3000,
            hideOnComplete: true
        });
        var waiting = this.add.sprite(game.config.width / 2, game.config.height / 2, 'waiting');
        waiting.depth = 1;
        waiting.anims.play('waiting');

    }

    // 新增障礙
    addBlock() {
        for (var k = 0; k < level - 1; k++) {
            this.block[k] = this.add.sprite(0, 0, 'block');
            this.blockExist = true;

            var relativeAngle = Phaser.Math.Between(0, 360);
            this.block[k].angle = relativeAngle;
            this.block[k].impactAngle = relativeAngle;

            //兩個障礙位置不重疊
            if (level > 2 && k > 0 &&
                (Math.abs(Phaser.Math.Angle.ShortestBetween(this.block[0].angle, this.block[1].angle)) < this.newminAngle)) {
                this.block[k].destroy(true);
                k--;
            }

            var radians = Phaser.Math.DegToRad(relativeAngle + 90);
            this.block[k].x = this.circle.x + (this.circle.width / 2) * Math.cos(radians);
            this.block[k].y = this.circle.y + (this.circle.width / 2) * Math.sin(radians);
        }
    }

    // 刷新時間
    updateCounter() {
        this.currentTime -= 1;
        this.currentTime = this.currentTime.toString().padStart(2, '0');
        this.timeText.setText(this.currentTime);

        switch (level) {
            case 1:
                A += 1;
                break;
            case 2:
                B += 1;
                break;
            default:
                C += 1;
        }

        if (this.currentTime <= 10) {
            this.tweens.add({
                targets: [this.timeText],
                scale: '+=0.1',
                duration: 300,
                yoyo: true,
                repeat: 0
            });
        }
        if (this.currentTime < 1) {
            this.gameOver();
        }
    }

    // 初始默認值(要在startData()之後呼叫)
    setNewValue() {
        this.currentRotationSpeed = rotationSpeed;
        this.newRotationSpeed = rotationSpeed;
        this.newminAngle = minAngle;
        this.newthrowSpeed = throwSpeed;
        switch (level) {
            case 1:
                countNum = lv1num;
                break;
            case 2:
                countNum = lv2num;
                break;
            default:
                countNum = lv3num;
        }
    }

    // 新增預設在畫面的刀
    createDefaultKnife() {
        this.index = 0;
        this.knifeArray = [];
        this.knife = this.add.sprite((game.config.width / 2) - 3, (game.config.height * 0.8) - 3, 'knifes', this.index);
        this.knifeArray.push(this.index);
        this.knifeGroup = this.add.group();
        this.num = this.add.sprite(77, 725, 'nums', this.index);
    }

    // 變更旋轉速度
    changeRotationSpeed() {
        this.time.addEvent({
            delay: changeTime * 1000, //秒*1000=禎
            callback: function() {
                //隨機旋轉方向
                var pos = Phaser.Math.Between(0, 1) == 0 ? -1 : 1;
                //產生一個随機數據範圍在[-遊戲設置變量，遊戲設置變量]
                var variation = Phaser.Math.FloatBetween(-rotationVariation, rotationVariation);
                //產生一個新的旋轉的速度
                this.newRotationSpeed = (this.currentRotationSpeed + variation) * pos;
                //設置一個新的限制速度
                this.newRotationSpeed = Phaser.Math.Clamp(this.newRotationSpeed, -maxRotationSpeed, maxRotationSpeed);
            },
            callbackScope: this,
            loop: true
        });
    }

    //time世界時間，delta一禎1/60
    update(time, delta) {
        if (this.gameIsOver) return;

        if (entryTime <= 0) {
            this.GameStart();

            //線性更改旋轉速度比較不會突兀
            this.currentRotationSpeed = Phaser.Math.Linear(this.currentRotationSpeed, this.newRotationSpeed, delta / 1000);
            //圓旋轉
            this.circle.angle += this.currentRotationSpeed;
        }

        //更新刀旋轉位置
        var children = this.knifeGroup.getChildren();
        this.rotate(children);

        //更新障礙旋轉位置
        if (this.blockExist) {
            this.rotate(this.block);
        }
    }

    GameStart() {
        this.input.on('pointerdown', this.throwKnife, this);
    }

    //更新旋轉位置
    rotate(obj) {
        for (var n = 0; n < obj.length; n++) {
            obj[n].angle += this.currentRotationSpeed;
            var radians = Phaser.Math.DegToRad(obj[n].angle + 90);
            obj[n].x = this.circle.x + (this.circle.width * 0.45) * Math.cos(radians);
            obj[n].y = this.circle.y + (this.circle.width * 0.45) * Math.sin(radians);
        }
    }

    throwKnife() {
        if (this.canThrow) {
            this.canThrow = false;

            this.tweens.add({
                targets: [this.knife],
                y: this.circle.y + this.circle.width * 0.45,
                duration: this.newthrowSpeed,
                callbackScope: this,
                onComplete: this.onThrow
            })

            //偏移
            if (isShift && level >= 2) {
                if (level == 2 && countNum == 1) {
                    this.newthrowSpeed -= 30;
                    this.currentRotationSpeed += (Phaser.Math.Between(0, 1) == 0 ? -2 : 2);
                } else if (level == 3 && countNum == 2) {
                    this.newthrowSpeed -= 50;
                    this.currentRotationSpeed += (Phaser.Math.Between(0, 1) == 0 ? -2 : 2);
                } else if (level == 3 && countNum == 1) {
                    this.newthrowSpeed -= 70;
                    this.currentRotationSpeed += (Phaser.Math.Between(0, 1) == 0 ? -3.5 : 3.5);
                }
            }
        }
    }

    onThrow() {
        var legalHit = true;

        //碰到圓上的刀
        this.children = this.knifeGroup.getChildren();
        for (var i = 0; i < this.children.length; i++) {
            //兩者之間的最短距離(ShortestBetween)小於最小角度
            //當前的圓角度(this.circle.angle)
            //圓上的每一刀角度(children[i].impactAngle)
            if (Math.abs(Phaser.Math.Angle.ShortestBetween(this.circle.angle, this.children[i].impactAngle)) < this.newminAngle) {
                legalHit = false;
                break;
            }
        }
        //碰到障礙
        if (this.blockExist) {
            for (var n = 0; n < this.block.length; n++) {
                if (Math.abs(Phaser.Math.Angle.ShortestBetween(this.circle.angle, 360 - this.block[n].impactAngle)) < this.newminAngle) {
                    legalHit = false;
                }
            }
        }

        if (legalHit) {
            PlayAudio(this, 'correctSE');
            countNum--;
            this.numText.setText(countNum);

            this.canThrow = true;

            // 創建一個新飛刀取代原飛出的刀插在圓上
            var newknife = this.add.sprite(this.knife.x, this.knife.y, 'knifes', this.index);
            // 新飛刀的影響角度等於圓的相對的角度 (碰撞用)
            newknife.impactAngle = this.circle.angle;
            // 將新飛刀绑定在飛刀组中
            this.knifeGroup.add(newknife);

            //射中特效
            this.anims.create({
                key: 'hit',
                frames: this.anims.generateFrameNumbers('myexplode', { start: 0, end: 3 }),
                frameRate: 30,
                hideOnComplete: true
            });
            var boom = this.add.sprite(this.knife.x, this.knife.y, 'myexplode');
            boom.anims.play('hit');

            //正常
            if (countNum > 0) {
                this.index = Phaser.Math.Between(0, 4);
                this.knifeArray.push(this.index);
                // 刀回原位
                this.knife.destroy(true);
                this.knife = this.add.sprite(this.knife.x, 0, 'knifes', this.index);
                this.knife.y = (game.config.height * 0.8) - 3;
                // 數量陣列
                this.num.destroy(true);
                this.num = this.add.sprite(this.num.x, this.num.y, 'nums', this.index);

                //圓晃動
                this.tweens.add({
                    targets: [this.circle],
                    x: this.circle.x + (Phaser.Math.Between(0, 1) == 0 ? -1 : 1) * 10,
                    y: this.circle.y - 10,
                    duration: 30,
                    yoyo: true,
                });
            }

            //過關
            else if (countNum == 0) {
                this.canThrow = false;

                //刀射穿
                this.tweens.add({
                    targets: [this.knife],
                    y: -this.knife.height,
                    duration: 300
                });
                //變成切片
                this.circle.destroy(true);
                var slice = this.physics.add.sprite(this.circle.x, this.circle.y, 'circle', 0).setVelocity(-200, -500);
                var slice1 = this.physics.add.sprite(this.circle.x, this.circle.y - 120, 'circle', 1).setVelocity(80, -500);
                var slice2 = this.physics.add.sprite(this.circle.x, this.circle.y + 30, 'circle', 2).setVelocity(200, -500);

                //障礙炸開
                if (this.blockExist) {
                    for (var n = 0; n < this.block.length; n++) {
                        this.block[n].visible = false;
                        this.flyblock = this.physics.add.sprite(this.block[n].x, this.block[n].y, 'block');
                        var moveX = this.block[n].x - (game.config.width / 2);
                        this.flyblock.setVelocity(moveX * 2, -500);
                        this.flyblock.setAngularVelocity(180);
                    }
                }

                //群組刀散開
                for (var i = 0; i < this.children.length; i++) {
                    this.children[i].visible = false;
                    this.flyknife = this.physics.add.sprite(this.children[i].x, this.children[i].y, 'knifes', this.knifeArray[i]);
                    this.flyknife.angle = this.children[i].angle;
                    var moveX = this.children[i].x - (game.config.width / 2);
                    this.flyknife.setVelocity(moveX * 3, -600);
                    this.flyknife.setAngularVelocity(180);
                }
                this.gameClear()
            }
        }

        //(!legalHit)飛刀掉落 & 重新開始遊戲 
        else {
            PlayAudio(this, 'errorSE');
            this.cameras.main.flash();
            this.tweens.add({
                targets: [this.knife],
                y: game.config.height + this.knife.height,
                rotation: 5,
                duration: this.newthrowSpeed * 4,
                //回傳範圍
                callbackScope: this,
                //结束後的回调函數
                onComplete: this.gameOver
            });
        }
    }
    gameClear() {
        this.gameIsOver = true;
        this.timerEvents.remove();
        if (level == 3) {
            this.gameOver();
            return;
        }

        this.add.bitmapText(game.config.width / 2, game.config.height / 2 - 20, 'BMFont_White', 'Ｌｅｖｅｌ  ＵＰ', 20).setOrigin(0.5);
        level += 1;
        this.time.addEvent({
            delay: 900,
            callback: function() {
                this.scene.start('play');
                this.blockExist = false;
            },
            callbackScope: this,
        });
    }
    gameOver() {
        this.add.image(0, 0, 'cover').setOrigin(0);
        this.gameIsOver = true;
        this.timerEvents.remove();

        //有過關才會記錄分數
        if (level == 3 && countNum == 0) {
            score = this.currentTime;
            // 驗證
            getScore = '1'; //為1時才會作用
        } else {
            // 驗證
            getScore = '0';
        }
        A = A.toString().padStart(2, '0');
        B = B.toString().padStart(2, '0');
        C = C.toString().padStart(2, '0');
        PlayHistories = getScore + A + B + C;
        // console.log(PlayHistories);

        this.tweens.add({
            targets: soundBgm,
            volume: 0,
            duration: 1000,
        });

        //最好分數
        bestScore = bestScore || 0;
        if (score > bestScore) {
            bestScore = score;
        }

        // 回傳分數
        this.time.addEvent({
            delay: 1200,
            callback: function() {
                // sendScore(score, PlayHistories);
                this.scene.start('over');
            },
            callbackScope: this,
        });

        this.time.addEvent({
            delay: 800,
            callback: function() {
                this.anims.create({
                    key: 'saving',
                    frames: this.anims.generateFrameNumbers('saving', { start: 0, end: 9 }),
                    frameRate: 6,
                    repeat: -1
                });
                var saving = this.add.sprite(game.config.width / 2, game.config.height / 2, 'saving');
                saving.setScale(0.5);
                saving.anims.play('saving');
            },
            callbackScope: this,
        });
    }
}

//首頁 + 扣點/次數介面
class menu extends Phaser.Scene {
    constructor() {
        super('menu');
    }
    create() {
        this.add.sprite(0, 0, 'menu').setOrigin(0);
        var logo = this.add.sprite(game.config.width / 2, -150, 'logo');
        this.tweens.add({
            targets: logo,
            y: 120,
            duration: 1000,
            ease: 'Bounce.Out'
        });
        playBtn = this.add.sprite(game.config.width / 2, game.config.height / 2, 'startBtn', 0);
        playBtn.setInteractive().on('pointerdown', function() {
            btnClick(this, playBtn);
            this.tweens.add({
                targets: playBtn,
                alpha: 0,
                duration: 300,
                ease: 'Linear',
                callbackScope: this,
                onComplete: function() {
                    // if (IsLogin && GameType != 'normal') {
                    //     this.showBanner();
                    // } else {
                    this.scene.start('story');
                    // }
                },
            });
        }, this);

        // if (StatusFlag != 0 && StatusFlag != 5) {
        //     showMessageModal(StatusText);
        // }
    }

    showBanner() {
        FBshare = this.add.sprite(game.config.width - 90, game.config.height - 40, 'FBshare', 0);
        FBshare.setInteractive().on('pointerdown', function() {
            btnClick(this, FBshare);
            this.time.addEvent({
                delay: 400,
                callback: function() {
                    shareViaFacebook();
                },
                callbackScope: this,
            });
        }, this);
        LINEshare = this.add.sprite(game.config.width - 40, game.config.height - 40, 'LINEshare', 0);
        LINEshare.setInteractive().on('pointerdown', function() {
            btnClick(this, LINEshare);
            this.time.addEvent({
                delay: 400,
                callback: function() {
                    shareViaLine();
                },
                callbackScope: this,
            });
        }, this);

        var boardGroup = this.add.group();
        var GameCostPointText = GameCostPoint.toString(); // 原型態(number)=0 的時候bitmapText無法顯示
        var MemberPointText = MemberPoint.toString(); // 原型態(number)=0 的時候bitmapText無法顯示

        if (MemberFreeTimes > 0) {
            boardGroup.create(this.add.sprite(game.config.width / 2, game.config.height / 2, 'freebanner'));
            boardGroup.create(this.add.bitmapText(game.config.width / 2 + 50, game.config.height / 2 + 20, 'BMFont_White', MemberFreeTimes, 18));
        } else {
            boardGroup.create(this.add.sprite(game.config.width / 2, game.config.height / 2, 'costbanner'));
            boardGroup.create(this.add.bitmapText(game.config.width / 2 + 20, game.config.height / 2 - 10, 'BMFont_White', GameCostPointText, 24).setOrigin(1));
            boardGroup.create(this.add.bitmapText(game.config.width / 2 + 55, game.config.height / 2 + 27, 'BMFont_White', MemberPointText, 14));
        }

        cancleBtn = this.add.sprite(game.config.width / 2 - 70, game.config.height * 0.65, 'cancleBtn', 0);
        boardGroup.add(cancleBtn);
        cancleBtn.setInteractive().on('pointerdown', function() {
            btnClick(this, cancleBtn);
            startBtn.input.enabled = false;
            quitGame();
        }, this);
        startBtn = this.add.sprite(game.config.width / 2 + 75, game.config.height * 0.65, 'startBtn', 0);
        boardGroup.add(startBtn);
        startBtn.setInteractive().on('pointerdown', function() {
            btnClick(this, startBtn);
            this.tweens.add({
                targets: this.board,
                alpha: 0,
                duration: 300,
            });
            FBshare.alpha = 0;
            LINEshare.alpha = 0;
            cancleBtn.input.enabled = false;
            this.onStartbtnClick();
        }, this);
    }

    onStartbtnClick() {
        this.time.addEvent({
            delay: 300,
            callback: function() {
                if (MemberFreeTimes > 0 || parseInt(MemberPoint, 10) >= parseInt(GameCostPoint, 10)) {
                    this.scene.start('story');
                } else {
                    var tipsGroup = this.add.group();
                    tipsGroup.create(game.config.width / 2, game.config.height / 2, 'tipsbanner');
                    var backBtn = tipsGroup.create(game.config.width / 2 - 70, game.config.height * 0.65, 'cancleBtn', 0);
                    backBtn.setInteractive().on('pointerdown', function() {
                        btnClick(this, backBtn);
                        this.time.addEvent({
                            delay: 300,
                            callback: function() {
                                FBshare.alpha = 1;
                                LINEshare.alpha = 1;
                                startBtn.input.enabled = true;
                                cancleBtn.input.enabled = true;
                                tipsGroup.destroy(true);
                                this.tweens.add({
                                    targets: this.board,
                                    alpha: 1,
                                    duration: 300,
                                });
                            },
                            callbackScope: this,
                        });
                    }, this);

                    var storeBtn = tipsGroup.create(game.config.width / 2 + 75, game.config.height * 0.65, 'storeBtn', 0);
                    storeBtn.setInteractive().on('pointerdown', function() {
                        btnClick(this, storeBtn);
                        this.time.addEvent({
                            delay: 200,
                            callback: function() {
                                window.location.replace('/buycoins'); // 連接到儲值頁
                            },
                            callbackScope: this,
                        });
                    }, this);
                }
            },
            callbackScope: this,
        });
    }
}

function PlayAudio(t, music) {
    var soundFx = t.sound.add(music);
    try {
        soundFx.play();
    } catch (e) {}
}

function btnClick(t, btn) {
    btn.setFrame(1);
    PlayAudio(t, 'clickSE');
    btn.input.enabled = false;

    t.tweens.add({
        targets: btn,
        scale: { from: 0.8, to: 1 },
        duration: 100,
        ease: 'Bounce.Out',
        callbackScope: this,
        onComplete: function() {
            btn.setFrame(0);
        }
    })
}

function quitGame() {
    setTimeout(function() {
        window.history.back(); // 返回到前頁
    }, 200);
}

// 故事 / 教學介面
class story extends Phaser.Scene {
    constructor() {
        super('story');
    }
    create() {
        soundStory = this.sound.add('storySE');
        soundStory.play();

        this.waitForStart = false;
        var page = 0;
        this.story = ['story', 'story2', 'teach'];
        for (var i = this.story.length - 1; i >= 0; i--) {
            this.story[i] = this.add.sprite(0, 0, this.story[i]).setOrigin(0);
            this.story[i].setInteractive().on('pointerdown', function() {
                this.nextPage(page);
                page += 1;
            }, this)
        }
    }
    nextPage(page) {
        if (this.waitForStart == true) return

        PlayAudio(this, 'clickSE');
        if (page == this.story.length - 1) {
            this.waitForStart = true;

            // ajax取得遊戲參數
            // startData();
            this.scene.start('play');
        } else {
            this.story[page].alpha = 0;
        }
    }

}

// 結束 / 成績結算介面
class over extends Phaser.Scene {
    constructor() {
        super('over');
    }

    create() {
        this.add.sprite(0, 0, 'end').setOrigin(0);
        // this.add.text(12, 10, 'ID: ' + PlayerID, { fill: '#888', fontSize: '12px' });
        // this.add.text(10, 25, 'SN: ' + PlayerSN, { fill: '#888', fontSize: '12px' });

        this.scorebannerGroup = this.add.group();
        //過關
        if (level == 3 && countNum == 0) {
            PlayAudio(this, 'winSE');
            this.banner = this.add.sprite(game.config.width / 2, -50, 'complete');
            this.tweens.add({
                targets: [this.banner],
                y: 140,
                duration: 1000,
                ease: 'Bounce.easeOut'
            })

            score = score.toString().padStart(2, '0'); // 原型態(number)=0 的時候bitmapText無法顯示
            bestScore = bestScore.toString().padStart(2, '0'); // 原型態(number)=0 的時候bitmapText無法顯示
            this.scorebannerGroup.create(game.config.width / 2, game.config.height / 2, 'scorebanner');
            this.add.bitmapText(game.config.width / 2 - 140, game.config.height / 2, 'BMFont_Black', '00：', 16);
            this.add.bitmapText(game.config.width / 2 - 65, game.config.height / 2, 'BMFont_Black', score, 16);
            this.add.bitmapText(game.config.width / 2 + 10, game.config.height / 2, 'BMFont_Black', '00：', 16);
            this.add.bitmapText(game.config.width / 2 + 85, game.config.height / 2, 'BMFont_Black', bestScore, 16);
        }
        //失敗
        else {
            PlayAudio(this, 'failSE');
            this.add.sprite(game.config.width / 2, game.config.height / 2 - 20, 'failbanner');
            this.banner = this.add.sprite(game.config.width / 2, 100, 'fail');
            this.tweens.add({
                targets: [this.banner],
                y: game.config.height / 2 - 40,
                duration: 1000,
                ease: 'Bounce.easeOut'
            });
        }

        var stamp = this.add.sprite(110, game.config.height / 2 - 110, 'stamp');
        stamp.alpha = 0;
        this.anims.create({
            key: 'stamping',
            frames: this.anims.generateFrameNumbers('stamp', { start: 0, end: 8 }),
            frameRate: 12,
        });
        // if (IsLogin && GameType == 'beating' && MemberWinFlag) {
        // setTimeout(function() {
        //     stamp.alpha = 1;
        //     stamp.anims.play('stamping');
        //         stamp.on('animationcomplete', function() {
        //             showBoardMessageModal();
        //         }, this);
        // }, 400)
        // } else if (GameType == 'ranking') {
        //     setTimeout(function() {
        //         showBoardMessageModal(); // 跳出上榜留言框
        //     }, 400)
        // }

        leaveBtn = this.scorebannerGroup.create(game.config.width / 2 - 70, game.config.height * 0.65, 'cancleBtn', 0);
        leaveBtn.setInteractive().on('pointerdown', function() {
            restartBtn.input.enabled = false;
            btnClick(this, leaveBtn);
            quitGame();
        }, this);
        restartBtn = this.scorebannerGroup.create(game.config.width / 2 + 75, game.config.height * 0.65, 'restartBtn', 0);
        restartBtn.setInteractive().on('pointerdown', function() {
            level = 1;
            stamp.alpha = 0;
            leaveBtn.input.enabled = false;
            btnClick(this, restartBtn);
            this.time.addEvent({
                delay: 200,
                callback: function() {
                    this.scene.start('menu');
                },
                callbackScope: this,
            });
        }, this);

        // 遊客模式
        // if (!IsLogin) {
        //     this.add.image(0, 0, 'mark').setOrigin(0);
        //     login = this.add.sprite(game.config.width / 2 + 100, game.config.height / 2 - 120, 'login')
        //     login.setInteractive().on('pointerdown', function() {
        //         btnClick(this, login);
        //         window.location.replace('/member/login?redirect_url=/'); // 登入後跳轉到首頁
        //     }, this);
        // }
        // // 會員模式
        // else {
        //     // 過關賽
        //     if (GameType == 'beating') {
        //         bag = this.add.sprite(game.config.width / 2 + 100, game.config.height / 2 - 120, 'bag', 0);
        //         bag.setInteractive().on('pointerdown', function() {
        //             btnClick(this, bag);
        //             window.location.replace('/member/pocket'); //連接到商城頁-背包
        //         }, this);
        //     }
        //     // 排行賽
        //     else if (GameType == 'ranking') {
        //         rank = this.add.sprite(game.config.width / 2 + 100, game.config.height / 2 - 120, 'rank', 0);
        //         rank.setInteractive().on('pointerdown', function() {
        //             btnClick(this, rank);
        //             showBoardDialog();
        //         }, this);
        //     }
        // }
    }
}

var config = {
    type: Phaser.AUTO,
    parent: 'game',
    width: 450,
    height: 800,
    scale: {
        // 自動調整寬度和高度，保持寬高比，覆蓋全部區域，可能會超出_ENVELOP (FIT:可能會有未覆蓋)
        mode: Phaser.Scale.FIT,
        // 畫布水平、垂直居中
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
    physics: {
        default: 'arcade',
        arcade: {
            gravity: {
                y: 1800
            }
        },
    },
    scene: [boot, load, menu, story, play, over]
};

game = new Phaser.Game(config);

/********************************************/

// startData 回傳成功
// function successStartData() {
//     timer = parseInt(GameParameters.timer);
//     lv1num = parseInt(GameParameters.lv1num);
//     lv2num = parseInt(GameParameters.lv2num);
//     lv3num = parseInt(GameParameters.lv3num);
//     isShift = parseInt(GameParameters.isShift);
//     minAngle = parseFloat(GameParameters.minAngle);
//     rotationSpeed = parseFloat(GameParameters.rotationSpeed);
//     throwSpeed = parseInt(GameParameters.throwSpeed);

//     console.log('GameType: ' + GameType);
//     console.log('遊戲時間: ' + timer);
//     console.log('飛刀數量(LV1): ' + lv1num);
//     console.log('飛刀數量(LV2): ' + lv2num);
//     console.log('飛刀數量(LV3): ' + lv3num);
//     console.log('尾刀改變速度(偏移): ' + isShift);
//     console.log('刀與刀之間的最小角度: ' + minAngle);
//     console.log('每禎旋轉角度	 ' + rotationSpeed);
//     console.log('刀的速度(飛出/掉落): ' + throwSpeed);

//     // scene[4] = story
//     // game.scene.scenes[3] = this 
//     // += scene.start(' ');
//     game.scene.scenes[3].scene.start('play');
// }

// sendScore 回傳成功
// function successScoreData() {
//     setTimeout(function() {
//         // scene[4] = play
//         // game.scene.scenes[4] = this 
//         // += scene.start(' ');
//         game.scene.scenes[4].scene.start('over');
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