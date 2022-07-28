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
var score;
var PlayHistories = '';

var oddScore;
var baseScore; // 分數基數(一顆多少分)
var gameIsOver;

// 遊戲時間(目前未使用)
// var timer = 10;
// 步數
var step = 30;
// 分數倍數
var multiple = 15;
// 道具分數倍數
var propRate = 1.2;

// 方塊行/列數 (正方形)
var fieldSize = 7;
// 方塊種類(Min : 2，Max : 5)
var fieldColors = 4;
// 過關條件種類 (要小於方塊種類_fieldColors，Min : 0(無指定條件)，Max : 3)
var requireType = 3;
// 過關條件數量
var num = [];
var numA = 20;
var numB = 30;
var numC = 40;

// 方塊大小
var gemSize = 55;
// 方塊間距
var gemOffset = 15;
// 版面內縮
var boardOffset = { x: 55, y: 355 };
// 方塊移動速度
var swapSpeed = 200;
var fallSpeed = 100;
var destroySpeed = 200;
// 五消道具隨機數量
var randomNum = 5;

const HORIZONTAL = 1;
const VERTICAL = 2;

// 音效
var soundBgm;
var soundStory;
var soundWin;
var soundFail;

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

/************************ 遊 戲 說 明 【菇之鄉】 **************************/
// this.gameArray[i][j].gemColor = 0 ~ 4 (五種方塊顏色) . 5 ~ 8 (四種道具)

// 計分(普通) : n x (n-1) x multiple (n = 消除方塊數量，multiple = 定義倍數)
// 計分(道具) : n x (n-1) x multiple x propRate (propRate = 道具倍數)

// 雙道具功能 : 
// 五消 + 任一 => 隨機五個位置變成其道具
// 直角 + 直角 => 消除自身為中心 5 x 5(25顆) 
// 直角 + 直/橫 => 消除自身為中心左右/上下一排 3 x 7(21顆)
// 直/橫 + 直/橫 => 消除自身為中心十字 7 x 2 - 1(13顆)

// 隱藏功能
// 連續消除五次道具 : 隨機位置產生兩顆五消道具

// 驗證機制(步數)
// PlayHistories 字串 => 一次取兩位數，(後值 = 前值 - 1)
/*************************************************************************/

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
        this.load.spritesheet('saving', '../Mark/saving.png', { frameWidth: 300, frameHeight: 300 }); // 分數儲存中

        this.load.image('logo', './assets/logo.png');
        this.load.image('menu', './assets/menu.png');
        this.load.image('background', './assets/background.png');
        this.load.image('wood', './assets/wood.png');
        this.load.image('story', './assets/story.png');
        this.load.image('story2', './assets/story2.png');
        this.load.image('story3', './assets/story3.png');
        this.load.image('teach', './assets/teach.png');
        // 方塊組
        this.load.spritesheet('gems', './assets/gems.png', { frameWidth: gemSize, frameHeight: gemSize });
        // 香菇人物動畫
        this.load.spritesheet('player', './assets/player.png', { frameWidth: 350, frameHeight: 250 });
        // 無法移動的過場動畫
        this.load.spritesheet('boss', './assets/boss.png', { frameWidth: 600, frameHeight: 400 });
        // 背景動畫
        this.load.spritesheet('tree', './assets/tree.png', { frameWidth: 500, frameHeight: 285 });
        // 過關特效
        this.load.spritesheet('complete', './assets/complete.png', { frameWidth: 500, frameHeight: 340 });
        // 失敗特效
        this.load.spritesheet('fail', './assets/fail.png', { frameWidth: 500, frameHeight: 340 });
        // 完美特效
        this.load.spritesheet('perfect', './assets/perfect.png', { frameWidth: 500, frameHeight: 500 });
        // 一般消除特效
        this.load.spritesheet('normalAni', './assets/normalAni.png', { frameWidth: 100, frameHeight: 130 });
        // 整行消除特效
        this.load.spritesheet('rowAni', './assets/rowAni.png', { frameWidth: 90, frameHeight: 1040 });
        // 整列消除特效
        this.load.spritesheet('colAni', './assets/colAni.png', { frameWidth: 1040, frameHeight: 90 });
        // 三行消除特效
        this.load.spritesheet('wideRowAni', './assets/wideRowAni.png', { frameWidth: 180, frameHeight: 1040 });
        // 三列消除特效
        this.load.spritesheet('wideColAni', './assets/wideColAni.png', { frameWidth: 1040, frameHeight: 180 });
        // 十字消除特效
        this.load.spritesheet('crossAni', './assets/crossAni.png', { frameWidth: 1040, frameHeight: 1040 });
        // 九宮格消除特效
        this.load.spritesheet('roundAni', './assets/roundAni.png', { frameWidth: 280, frameHeight: 280 });
        // 五消消除特效
        this.load.spritesheet('circleAni', './assets/circleAni.png', { frameWidth: 350, frameHeight: 350 });

        this.load.image('banner', './assets/banner.png');
        this.load.image('costbanner', './assets/costbanner.png');
        this.load.image('freebanner', './assets/freebanner.png');
        this.load.image('tipsbanner', './assets/tipsbanner.png');
        this.load.image('failbanner', './assets/failbanner.png');
        this.load.image('scorebanner', './assets/scorebanner.png');

        this.load.spritesheet('playBtn', './assets/playBtn.png', { frameWidth: 185, frameHeight: 105 });
        this.load.spritesheet('startBtn', './assets/startBtn.png', { frameWidth: 130, frameHeight: 70 });
        this.load.spritesheet('cancleBtn', './assets/cancleBtn.png', { frameWidth: 130, frameHeight: 70 });
        this.load.spritesheet('restartBtn', './assets/restartBtn.png', { frameWidth: 130, frameHeight: 70 });
        this.load.spritesheet('storeBtn', './assets/storeBtn.png', { frameWidth: 130, frameHeight: 70 });
        this.load.spritesheet('bagBtn', './assets/bagBtn.png', { frameWidth: 130, frameHeight: 70 });
        this.load.spritesheet('okBtn', './assets/okBtn.png', { frameWidth: 130, frameHeight: 70 });
        this.load.spritesheet('LINEshare', './assets/LINEshare.png', { frameWidth: 45, frameHeight: 45 });
        this.load.spritesheet('FBshare', './assets/FBshare.png', { frameWidth: 45, frameHeight: 45 });
        this.load.spritesheet('skipBtn', './assets/skipBtn.png', { frameWidth: 80, frameHeight: 80 });
        this.load.spritesheet('login', './assets/login.png', { frameWidth: 80, frameHeight: 80 });
        this.load.spritesheet('rank', './assets/rank.png', { frameWidth: 80, frameHeight: 80 });
        this.load.spritesheet('bag', './assets/bag.png', { frameWidth: 80, frameHeight: 80 });

        this.load.bitmapFont('BMFont', '../Font/BMFont_White.png', '../Font/BMFont_White.fnt');

        this.load.audio('bgmSE', './assets/audio/bgm.mp3');
        this.load.audio('storySE', './assets/audio/story.mp3');
        this.load.audio('clickStartSE', './assets/audio/clickStart.mp3');
        this.load.audio('clickSE', './assets/audio/click.mp3');
        this.load.audio('moveSE', './assets/audio/move.mp3');
        this.load.audio('normalSE', './assets/audio/normal.mp3');
        this.load.audio('bornLineSE', './assets/audio/bornLine.mp3');
        this.load.audio('bornRoundSE', './assets/audio/bornRound.mp3');
        this.load.audio('bornCircleSE', './assets/audio/bornCircle.mp3');
        this.load.audio('killLineSE', './assets/audio/killLine.mp3');
        this.load.audio('killRonudSE', './assets/audio/killRonud.mp3');
        this.load.audio('killCircleSE', './assets/audio/killCircle.mp3');
        this.load.audio('noMoveSE', './assets/audio/noMove.mp3');
        this.load.audio('perfectSE', './assets/audio/perfect.mp3');
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
        score = 0;
        oddScore = 0
        PlayHistories = '';
        gameIsOver = false;

        this.step = step;
        this.cheat = 0; //隱藏條件
        this.scoreCombo = 0; // 得分連擊數
        this.canPick = true;
        this.dragging = false;
        this.selectedGem = null;
    }

    create() {
        this.tweens.add({
            targets: soundStory,
            volume: 0,
            duration: 1000
        });
        this.createAudio();
        soundBgm.play();

        this.add.image(0, 0, 'background').setOrigin(0);

        this.tree = this.add.sprite(-50, 0, 'tree').setOrigin(0);
        this.anims.create({
            key: 'tree',
            frames: this.anims.generateFrameNumbers('tree', { start: 0, end: 9 }),
            repeat: 2,
            frameRate: 14,
        });

        if (requireType > 0) {
            this.add.image(45, 125, 'wood').setOrigin(0);
        }

        // this.add.text(12, game.config.height - 45, 'ID: ' + PlayerID, { font: '16px ', fill: '#FFF' });
        // this.add.text(10, game.config.height - 25, 'SN: ' + PlayerSN, { font: '16px ', fill: '#FFF' });

        this.scoreText = this.add.bitmapText(game.config.width - 75, 25, 'BMFont', score, 12).setOrigin(0.5);
        this.stepText = this.add.bitmapText(30, 30, 'BMFont', '', 20).setOrigin(0.5);

        this.createPlayer();
        this.createPropsAnimation();
        this.chooseColor();
        this.drawField();
        if (requireType > 0) {
            this.required();
        }

        this.showed = false;
        this.leftOver = false;
        this.isChecking = false;

        this.showSuggestion();
        this.input.on('pointerdown', this.gemSelect, this);
        this.input.on('pointermove', this.startSwipe, this);
        this.input.on('pointerup', this.stopSwipe, this);
    }

    update() {
        if (gameIsOver) return;

        this.stepText.setText(this.step);
        if (requireType > 0) {
            for (var i = 0; i < requireType; i++) {
                this.numArray[i].setText(num[i]);
            }
        }

        if (this.step > 0 && requireType > 0) {
            if (this.deleteAllRequire()) {
                gameIsOver = true;
                this.leftOver = true;
            }
        }
    }

    createAudio() {
        soundBgm = this.sound.add('bgmSE', { loop: -1 });
        soundWin = this.sound.add('winSE', { loop: -1 });
        soundFail = this.sound.add('failSE');
    }

    scoreTween(score) {
        this.pointsTween = this.tweens.addCounter({
            from: oddScore,
            to: score,
            duration: destroySpeed * 2,
            onUpdateScope: this,
            onCompleteScope: this,
            onUpdate: function() {
                this.scoreText.setText(Math.floor(this.pointsTween.getValue()));
            },
        });
        oddScore = score;
    }

    deleteAllRequire() {
        for (var i = 0; i < requireType; i++) {
            if (num[i] != 0) {
                return false;
            }
        }
        return true;
    }

    showResult() {
        gameIsOver = true;
        this.propscalculated = [];

        if (!this.showed) { //還沒顯示過 (checkBonus會進入第二次 = 顯示過)
            this.pass = false;

            if (requireType > 0) {
                this.pass = this.deleteAllRequire();
            } else {
                this.pass = true;
            }

            this.tweens.add({
                targets: soundBgm,
                volume: 0,
                duration: 2000
            });

            if (this.pass) {
                this.passAni('complete');
                this.player.play('winAnims');
                soundWin.play();
            } else {
                this.passAni('fail');
                this.player.play('failAnims');
                soundFail.play();
                this.player.on('animationcomplete', function() {
                    this.player.play('failAnims2');
                }, this);
            }
        } else if (this.matchInBoard() || this.propInBoard() > 0) {
            this.checkBonus();
        } else {
            this.gameOver();
        }
    }

    passAni(passAnims) {
        this.anims.create({
            key: passAnims,
            frames: this.anims.generateFrameNumbers(passAnims, { start: 0, end: 1 }),
            frameRate: 4,
            repeat: -1
        });
        this.passBanner = this.add.sprite(game.config.width / 2, game.config.height / 2, passAnims);
        this.passBanner.depth = 4;
        this.passBanner.play(passAnims);

        this.time.addEvent({
            delay: 1200,
            callback: function() {
                if (passAnims == 'fail') {
                    score = 0;
                    this.gameOver();
                } else if (passAnims == 'complete' && this.propInBoard() == 0 && !this.leftOver) {
                    this.gameOver();
                } else {
                    this.tweens.add({
                        targets: this.passBanner,
                        y: 1200,
                        duration: 500,
                        callbackScope: this,
                        onComplete: function() {
                            this.showed = true;
                            this.passBanner.destroy();
                            if (this.leftOver && !this.isChecking) { // 如果有步數
                                this.leftStepToProp();
                            } else {
                                this.checkBonus();
                            }
                        },
                        onCompleteScope: this,
                    });
                }
            },
            callbackScope: this,
        });
    }

    leftStepToProp() {
        var random = [];
        var leftNum = this.step > 10 ? 10 : this.step;

        for (var k = 0; k < leftNum; k++) {
            var rndPosX = Phaser.Math.Between(0, fieldSize - 1);
            var rndPosY = Phaser.Math.Between(0, fieldSize - 1);
            if (random.indexOf(rndPosX.toString() + rndPosY.toString()) != -1 ||
                this.gameArray[rndPosX][rndPosY].gemColor >= 5) {
                k -= 1;
                continue;
            }
            random.push(rndPosX.toString() + rndPosY.toString());

            var colorIdx = Phaser.Math.Between(5, 7);
            this.gameArray[rndPosX][rndPosY].gemSprite.setFrame(colorIdx);
            this.gameArray[rndPosX][rndPosY].gemColor = colorIdx;

            var leftAni = this.add.sprite(0, 0, 'normalAni');
            leftAni.x = this.gameArray[rndPosX][rndPosY].gemSprite.x;
            leftAni.y = this.gameArray[rndPosX][rndPosY].gemSprite.y + 10;
            leftAni.depth = 2;
            leftAni.play('normalAni_default');

            this.tweens.add({
                targets: this.gameArray[rndPosX][rndPosY].gemSprite,
                alpha: 0.5,
                scale: { from: 1, to: 1.5 },
                yoyo: true,
                duration: destroySpeed,
                callbackScope: this,
            });
        }

        this.leftTween = this.tweens.addCounter({
            from: this.step,
            to: 0,
            duration: destroySpeed * 2,
            callbackScope: this,
            onUpdate: function() {
                this.stepText.setText(Math.floor(this.leftTween.getValue()));
            },
            onUpdateScope: this,
        });

        this.time.addEvent({
            delay: 800,
            callback: this.checkBonus,
            callbackScope: this,
        });
    }

    checkBonus() {
        gameIsOver = true;
        this.canPick = false;
        this.dragging = false;
        this.isChecking = true;

        this.time.addEvent({
            delay: 200,
            callback: function() {
                if (this.propInBoard() > 0) {

                    this.useProps_removeMap = [];
                    for (var i = 0; i < fieldSize; i++) {
                        this.useProps_removeMap[i] = [];
                        for (var j = 0; j < fieldSize; j++) {
                            this.useProps_removeMap[i].push(0);
                        }
                    }

                    this.numOfPropInBoard = 0;
                    for (var i = 0; i < fieldSize; i++) {
                        for (var j = 0; j < fieldSize; j++) {
                            if (this.gameArray[i][j].gemColor >= 5) {
                                this.useProps(i, j, -2);
                                this.isCheckAuto = true;
                            }
                        }
                    }
                }
            },
            callbackScope: this,
        });
    }

    gameOver() {
        var cover = this.add.image(0, 0, 'cover').setOrigin(0);
        cover.depth = 5;

        this.tweens.add({
            targets: soundWin,
            volume: 0,
            duration: 1000
        });

        this.anims.create({
            key: 'saving',
            frames: this.anims.generateFrameNumbers('saving', { start: 0, end: 9 }),
            frameRate: 6,
            repeat: -1
        });
        var saving = this.add.sprite(game.config.width / 2, game.config.height / 2, 'saving');
        saving.depth = 5;
        saving.setScale(0.5);
        saving.anims.play('saving');

        // 回傳分數
        this.time.addEvent({
            delay: 800,
            callback: function() {
                // sendScore(score, PlayHistories);
                this.scene.start('over');
            },
            callbackScope: this,
        });
    }

    createPlayer() {
        this.player = this.add.sprite(game.config.width / 2 + 90, 140, 'player');
        this.anims.create({
            key: 'standbyAnims',
            frames: this.anims.generateFrameNumbers('player', { start: 0, end: 19 }),
            frameRate: 14,
            repeat: -1,
        });
        this.anims.create({
            key: 'matchAnims',
            frames: this.anims.generateFrameNumbers('player', { start: 20, end: 39 }),
            frameRate: 14,
        });
        this.anims.create({
            key: 'usePropAnims',
            frames: this.anims.generateFrameNumbers('player', { start: 40, end: 59 }),
            frameRate: 14,
        });
        this.anims.create({
            key: 'cheatAnims',
            frames: this.anims.generateFrameNumbers('player', { start: 60, end: 79 }),
            frameRate: 14,
        });
        this.anims.create({
            key: 'failAnims',
            frames: this.anims.generateFrameNumbers('player', { start: 80, end: 99 }),
            frameRate: 14,
        });
        this.anims.create({
            key: 'failAnims2',
            frames: this.anims.generateFrameNumbers('player', { start: 92, end: 93 }),
            frameRate: 5,
        });
        this.anims.create({
            key: 'winAnims',
            frames: this.anims.generateFrameNumbers('player', { start: 100, end: 119 }),
            frameRate: 14,
            repeat: -1,
        });
        this.player.play('standbyAnims');
    }
    playerAnimComplete(animation) {
        if (animation.key == 'matchAnims' || animation.key == 'usePropAnims' || animation.key == 'cheatAnims') {
            this.player.play('standbyAnims');
        }
    }
    createPropsAnimation() {
        this.anims.create({
            key: 'normalAni_0',
            frames: this.anims.generateFrameNumbers('normalAni', { start: 0, end: 9 }),
            frameRate: 12,
            hideOnComplete: true,
        });
        this.anims.create({
            key: 'normalAni_1',
            frames: this.anims.generateFrameNumbers('normalAni', { start: 10, end: 19 }),
            frameRate: 12,
            hideOnComplete: true,
        });
        this.anims.create({
            key: 'normalAni_2',
            frames: this.anims.generateFrameNumbers('normalAni', { start: 20, end: 29 }),
            frameRate: 12,
            hideOnComplete: true,
        });
        this.anims.create({
            key: 'normalAni_3',
            frames: this.anims.generateFrameNumbers('normalAni', { start: 30, end: 39 }),
            frameRate: 12,
            hideOnComplete: true,
        });
        this.anims.create({
            key: 'normalAni_4',
            frames: this.anims.generateFrameNumbers('normalAni', { start: 40, end: 49 }),
            frameRate: 12,
            hideOnComplete: true,
        });
        this.anims.create({
            key: 'normalAni_default',
            frames: this.anims.generateFrameNumbers('normalAni', { start: 50, end: 59 }),
            frameRate: 12,
            hideOnComplete: true,
        });
        this.anims.create({
            key: 'rowAni',
            frames: this.anims.generateFrameNumbers('rowAni', { start: 0, end: 9 }),
            frameRate: 24,
            hideOnComplete: true,
        });
        this.anims.create({
            key: 'colAni',
            frames: this.anims.generateFrameNumbers('colAni', { start: 0, end: 9 }),
            frameRate: 24,
            hideOnComplete: true,
        });
        this.anims.create({
            key: 'wideRowAni',
            frames: this.anims.generateFrameNumbers('wideRowAni', { start: 0, end: 9 }),
            frameRate: 24,
            hideOnComplete: true,
        });
        this.anims.create({
            key: 'wideColAni',
            frames: this.anims.generateFrameNumbers('wideColAni', { start: 0, end: 9 }),
            frameRate: 24,
            hideOnComplete: true,
        });
        this.anims.create({
            key: 'crossAni',
            frames: this.anims.generateFrameNumbers('crossAni', { start: 0, end: 9 }),
            frameRate: 24,
            hideOnComplete: true,
        });
        this.anims.create({
            key: 'roundAni',
            frames: this.anims.generateFrameNumbers('roundAni', { start: 0, end: 9 }),
            frameRate: 16,
            hideOnComplete: true,
        });
        this.anims.create({
            key: 'circleAni',
            frames: this.anims.generateFrameNumbers('circleAni', { start: 0, end: 9 }),
            frameRate: 18,
            hideOnComplete: true,
        });
    }

    chooseColor() {
        this.colorArray = [0, 1, 2, 3, 4]; //五種顏色
        for (var i = 0; i < fieldColors; i++) {
            var rnd = Phaser.Math.Between(0, this.colorArray.length - 1);
            var temp = this.colorArray[i];
            this.colorArray[i] = this.colorArray[rnd];
            this.colorArray[rnd] = temp;
        }
        // console.log('[' + this.colorArray + ']: ' + '取前' + fieldColors + '種顏色')
    }

    drawField() {
        this.removeMap = [];
        this.poolArray = [];
        this.gameArray = [];

        for (var i = 0; i < fieldSize; i++) {
            this.removeMap[i] = [];
            this.gameArray[i] = [];
            for (var j = 0; j < fieldSize; j++) {
                this.removeMap[i].push(0);
                var gemX = boardOffset.x + (gemSize + gemOffset) * j + (gemSize + gemOffset) / 2;
                var gemY = boardOffset.y + (gemSize + gemOffset) * i + (gemSize + gemOffset) / 2;
                var gem = this.add.sprite(gemX, gemY, 'gems');

                do {
                    var pickColor = Phaser.Math.Between(0, fieldColors - 1);
                    gem.setFrame(this.colorArray[pickColor]);
                    this.gameArray[i][j] = {
                        gemColor: this.colorArray[pickColor],
                        gemSprite: gem,
                        isEmpty: false,
                    };
                    this.tweens.add({
                        targets: this.gameArray[i][j].gemSprite,
                        scale: { from: 0.5, to: 1 },
                        duration: destroySpeed,
                        callbackScope: this,
                    });
                } while (this.isMatch(i, j)); // while(true)重新生成，不要一開始就有配對好的可以消除
            }
        }
        this.anyCanMove();
    }

    anyCanMove() {
        var matchFound = false;

        for (var i = 0; i < fieldSize; i++) {
            for (var j = 0; j < fieldSize; j++) {
                if (this.gameArray[i][j].gemColor >= 5) {
                    matchFound = true;
                    return;
                }

                if (i < fieldSize - 1) {
                    this.tmpSwap(i, j, i + 1, j);
                    if (this.matchInBoard()) {
                        matchFound = true;
                    }

                    this.tmpSwap(i, j, i + 1, j);
                    if (matchFound) {
                        return;
                    }
                }

                if (j < fieldSize - 1) {
                    this.tmpSwap(i, j, i, j + 1);
                    if (this.matchInBoard()) {
                        matchFound = true;
                    }

                    this.tmpSwap(i, j, i, j + 1);
                    if (matchFound) {
                        return;
                    }
                }
            }
        }

        // console.log('----- no more move -----');
        PlayAudio(this, 'noMoveSE');

        var boss = this.add.sprite(-100, 0, 'boss').setOrigin(0);
        boss.depth = 4;
        this.anims.create({
            key: 'boss',
            frames: this.anims.generateFrameNumbers('boss', { start: 0, end: 19 }),
            frameRate: 9,
            hideOnComplete: true,
        });
        boss.play('boss');

        this.tweens.add({
            targets: boss,
            x: 0,
            y: 245,
            duration: 500,
            ease: 'Circ.Out',
        });

        for (var j = 0; j < fieldSize; j++) {
            for (var i = 0; i < fieldSize; i++) {
                this.tweens.add({
                    targets: this.gameArray[i][j].gemSprite,
                    alpha: 0,
                    scale: 0.5,
                    duration: 1050,
                    callbackScope: this,
                });
            }
        }
        this.time.addEvent({
            delay: 1000,
            callback: function() {
                this.drawField();
            },
            callbackScope: this,
        });
    }

    //過關條件
    required() {
        num = [numA, numB, numC];
        this.requireArray = [];
        this.numArray = [];

        var numY;
        var typeY;
        for (var i = 0; i < requireType; i++) {
            if (requireType < 3) {
                numY = 150 + 33 / requireType + i * 33;
                typeY = 160 + 33 / requireType + i * 33;
            } else {
                numY = 150 + i * 33;
                typeY = 160 + i * 33;
            }

            this.numArray[i] = this.add.bitmapText(115, numY, 'BMFont', num[i], 12);
            var require = this.physics.add.image(90, typeY, 'gems', this.colorArray[i]);
            require.setScale(0.45);

            this.requireArray[i] = {
                    requireNum: num[i],
                    requireSprite: require,
                    requireColor: this.colorArray[i],
                }
                // console.log('require[' + i + '] Color: ' + this.requireArray[i].requireColor + ' / num: ' + this.requireArray[i].requireNum)
        }
    }

    showSuggestion() {
        var matchFound = false;
        for (var i = 0; i < fieldSize - 1; i++) {
            for (var j = 0; j < fieldSize - 1; j++) {
                this.tmpSwap(i, j, i + 1, j);
                if (this.matchInBoard()) {
                    this.tweens.add({
                        targets: this.tmpMatch(),
                        scale: { from: 1, to: 1.3 },
                        duration: 300,
                        yoyo: true,
                        repeat: 1,
                        callbackScope: this,
                    });
                    matchFound = true;
                }
                this.tmpSwap(i, j, i + 1, j);
                if (matchFound) {
                    return;
                }

                this.tmpSwap(i, j, i, j + 1);
                if (this.matchInBoard()) {
                    this.tweens.add({
                        targets: this.tmpMatch(),
                        scale: { from: 1, to: 1.3 },
                        duration: 300,
                        yoyo: true,
                        repeat: 1,
                        callbackScope: this,
                    });
                    matchFound = true;
                }
                this.tmpSwap(i, j, i, j + 1);
                if (matchFound) {
                    return;
                }
            }
        }
    }
    tmpSwap(row1, col1, row2, col2) {
        var tmp = this.gameArray[row1][col1];
        this.gameArray[row1][col1] = this.gameArray[row2][col2];
        this.gameArray[row2][col2] = tmp;
    }
    tmpMatch() {
        var signalArray = [];
        for (var i = 0; i < fieldSize; i++) {
            for (var j = 0; j < fieldSize; j++) {
                if (this.gameArray[i][j].gemColor >= 5) {
                    signalArray.push(this.gameArray[i][j].gemSprite)
                } else if (this.isHorizontalMatch(i, j)) {
                    signalArray.push(this.gameArray[i][j].gemSprite, this.gameArray[i][j - 1].gemSprite, this.gameArray[i][j - 2].gemSprite)
                } else if (this.isVerticalMatch(i, j)) {
                    signalArray.push(this.gameArray[i][j].gemSprite, this.gameArray[i - 1][j].gemSprite, this.gameArray[i - 2][j].gemSprite)
                }
            }
        }
        return signalArray;
    }

    gemSelect(pointer) {
        if (this.canPick) {
            this.dragging = true;
            var row = Math.floor((pointer.y - boardOffset.y) / (gemSize + gemOffset));
            var col = Math.floor((pointer.x - boardOffset.x) / (gemSize + gemOffset));
            var pickedGem = this.gemAt(row, col);
            if (pickedGem != -1) {
                if (this.selectedGem == null) {
                    pickedGem.gemSprite.setScale(1.2);
                    // pickedGem.gemSprite.setDepth(1);
                    this.selectedGem = pickedGem;
                } else {
                    if (this.areTheSame(pickedGem, this.selectedGem)) {
                        this.selectedGem.gemSprite.setScale(1);
                        this.selectedGem = null;
                    } else {
                        if (this.areNext(pickedGem, this.selectedGem)) {
                            this.selectedGem.gemSprite.setScale(1);
                            this.swapGems(this.selectedGem, pickedGem, true);
                        } else {
                            this.selectedGem.gemSprite.setScale(1);
                            pickedGem.gemSprite.setScale(1.2);
                            this.selectedGem = pickedGem;
                        }
                    }
                }
            }
        }
    }

    startSwipe(pointer) {
        if (this.dragging && this.selectedGem != null) {
            var deltaX = pointer.downX - pointer.x;
            var deltaY = pointer.downY - pointer.y;
            var deltaRow = 0;
            var deltaCol = 0;
            if (deltaX > gemSize / 2 && Math.abs(deltaY) < gemSize / 4) {
                deltaCol = -1;
            }
            if (deltaX < -gemSize / 2 && Math.abs(deltaY) < gemSize / 4) {
                deltaCol = 1;
            }
            if (deltaY > gemSize / 2 && Math.abs(deltaX) < gemSize / 4) {
                deltaRow = -1;
            }
            if (deltaY < -gemSize / 2 && Math.abs(deltaX) < gemSize / 4) {
                deltaRow = 1;
            }
            if (deltaRow + deltaCol != 0) {
                var pickedGem = this.gemAt(this.getGemRow(this.selectedGem) + deltaRow, this.getGemCol(this.selectedGem) + deltaCol);
                if (pickedGem != -1) {
                    PlayAudio(this, 'moveSE');
                    this.selectedGem.gemSprite.setScale(1);
                    this.swapGems(this.selectedGem, pickedGem, true);
                }
            }
        }
    }

    gemAt(row, col) {
        if (row < 0 || row >= fieldSize || col < 0 || col >= fieldSize) {
            return -1;
        }
        return this.gameArray[row][col];
    }

    isMatch(row, col) {
        return this.isHorizontalMatch(row, col) || this.isVerticalMatch(row, col);
    }

    isHorizontalMatch(row, col) {
        return this.gemAt(row, col).gemColor == this.gemAt(row, col - 1).gemColor && this.gemAt(row, col).gemColor == this.gemAt(row, col - 2).gemColor;
    }

    isVerticalMatch(row, col) {
        return this.gemAt(row, col).gemColor == this.gemAt(row - 1, col).gemColor && this.gemAt(row, col).gemColor == this.gemAt(row - 2, col).gemColor;
    }

    stopSwipe() {
        this.dragging = false;
    }

    areTheSame(gem1, gem2) {
        return this.getGemRow(gem1) == this.getGemRow(gem2) && this.getGemCol(gem1) == this.getGemCol(gem2);
    }

    getGemRow(gem) {
        return Math.floor((gem.gemSprite.y - boardOffset.y) / (gemSize + gemOffset));
    }

    getGemCol(gem) {
        return Math.floor((gem.gemSprite.x - boardOffset.x) / (gemSize + gemOffset));
    }

    areNext(gem1, gem2) {
        return Math.abs(this.getGemRow(gem1) - this.getGemRow(gem2)) + Math.abs(this.getGemCol(gem1) - this.getGemCol(gem2)) == 1;
    }

    swapGems(gem1, gem2, swapBack) {
        this.swappingGems = 2;
        this.canPick = false;
        this.dragging = false;
        var fromColor = gem1.gemColor;
        var fromSprite = gem1.gemSprite;
        var toColor = gem2.gemColor;
        var toSprite = gem2.gemSprite;
        var gem1Row = this.getGemRow(gem1);
        var gem1Col = this.getGemCol(gem1);
        var gem2Row = this.getGemRow(gem2);
        var gem2Col = this.getGemCol(gem2);
        this.gameArray[gem1Row][gem1Col].gemColor = toColor;
        this.gameArray[gem1Row][gem1Col].gemSprite = toSprite;
        this.gameArray[gem2Row][gem2Col].gemColor = fromColor;
        this.gameArray[gem2Row][gem2Col].gemSprite = fromSprite;
        this.tweenGem(gem1, gem2, swapBack);
        this.tweenGem(gem2, gem1, swapBack);
    }

    tweenGem(gem1, gem2, swapBack) {
        var row = this.getGemRow(gem1);
        var col = this.getGemCol(gem1);
        this.tweens.add({
            targets: this.gameArray[row][col].gemSprite,
            x: col * (gemSize + gemOffset) + (gemSize + gemOffset) / 2 + boardOffset.x,
            y: row * (gemSize + gemOffset) + (gemSize + gemOffset) / 2 + boardOffset.y,
            duration: swapSpeed,
            callbackScope: this,
            onComplete: function() {
                this.swappingGems--;
                if (this.swappingGems == 0) {
                    if (!this.matchInBoard() && swapBack && !this.isMovingProp(gem1, gem2)) { // 沒有符合 & 要換回來
                        this.swapGems(gem1, gem2, false); // -> 換回來
                    } else if (this.isMovingProp(gem1, gem2) || this.matchInBoard()) {
                        PlayHistories += this.step.toString().padStart(2, '0');
                        this.step -= 1;

                        if (this.isMovingProp(gem1, gem2)) { // 移動 = 道具
                            this.cheat += this.numOfMovingProp(gem1, gem2);
                            this.player.play('usePropAnims');
                            this.player.on('animationcomplete', this.playerAnimComplete, this);
                            this.time.addEvent({
                                delay: 1000,
                                callback: function() {
                                    this.tree.play('tree');
                                },
                                callbackScope: this,
                            })

                            if (this.matchInBoard()) { // 移動 = + 一般消除
                                this.double = true;
                                this.handleMatches(this.getGemRow(gem1), this.getGemCol(gem1), this.getGemRow(gem2), this.getGemCol(gem2));
                            }

                            this.useProps_removeMap = [];
                            for (var i = 0; i < fieldSize; i++) {
                                this.useProps_removeMap[i] = [];
                                for (var j = 0; j < fieldSize; j++) {
                                    this.useProps_removeMap[i].push(0);
                                }
                            }

                            this.numOfAuto = 0;
                            this.numOfCheck = 0;
                            this.doubleComplete = 1;
                            this.doing = false;
                            this.isCheckAuto = false;
                            this.isAutoPosition = false;
                            this.propscalculated = [];
                            // console.log('tweenGem into useProps')
                            this.useProps(this.getPropRow(gem1, gem2), this.getPropCol(gem1, gem2), this.getNextProp(gem1, gem2).gemColor, this.getNextProp(gem1, gem2));
                        } else if (this.matchInBoard()) { // 移動 = 一般消除
                            this.cheat = 0;
                            this.player.play('matchAnims');
                            this.player.on('animationcomplete', this.playerAnimComplete, this);
                            this.handleMatches(this.getGemRow(gem1), this.getGemCol(gem1), this.getGemRow(gem2), this.getGemCol(gem2));
                        }
                    } else { // 移動 = 不能消除 / swapBack = false
                        this.canPick = true;
                        this.selectedGem = null;
                    }
                }
            }
        });
    }

    matchInBoard() {
        for (var i = 0; i < fieldSize; i++) {
            for (var j = 0; j < fieldSize; j++) {
                if (this.gameArray[i][j].gemColor < 5) { // 如果不是道具才判斷
                    if (this.isMatch(i, j)) {
                        return true;
                    }
                }
            }
        }
        return false;
    }

    handleMatches(gem1row, gem1col, gem2row, gem2col) {
        this.sameArray = [];
        this.sortMap = [];
        for (var i = 0; i < fieldSize; i++) {
            this.sortMap[i] = [];
            for (var j = 0; j < fieldSize; j++) {
                this.sortMap[i][j] = {
                    index: 0,
                    removeMark: 0,
                    removeDirection: 0,
                    sameIndex: 0,
                }
            }
        }

        this.markMatches(HORIZONTAL);
        this.markMatches(VERTICAL);
        this.checkCheat(gem1row, gem1col, gem2row, gem2col);
        this.baseScoreOfNormal();
        this.propPosition(gem1row, gem1col, gem2row, gem2col);
    }

    markMatches(direction) {
        var groupCount = 0;
        if (direction == HORIZONTAL) {
            groupCount = 1;
        } else {
            groupCount = 50;
        }

        for (var i = 0; i < fieldSize; i++) {
            var colorStreak = 1;
            var currentColor = -1;
            var startStreak = 0;
            var colorToWatch = 0;
            var groupName = '';

            for (var j = 0; j < fieldSize; j++) {
                if (direction == HORIZONTAL) {
                    colorToWatch = this.gemAt(i, j).gemColor;
                } else {
                    colorToWatch = this.gemAt(j, i).gemColor;
                }

                if (colorToWatch == currentColor) {
                    colorStreak++;
                }

                if (colorToWatch != currentColor || j == fieldSize - 1 || colorToWatch >= 5) { //如果顏色不一樣||已經到達邊界||遇到道具
                    if (colorStreak >= 3) {
                        groupName = groupCount++;

                        if (direction == HORIZONTAL) {
                            // console.log('HORIZONTAL : Length = ' + colorStreak + ' / Start = (' + i + ',' + startStreak + ') / Color = ' + currentColor);
                        } else {
                            // console.log('VERTICAL : Length = ' + colorStreak + ' / Start = (' + startStreak + ',' + i + ') / Color = ' + currentColor);
                            for (var z = 0; z < colorStreak; z++) {
                                // 如果是同一組消除(已有group)
                                if (typeof this.sortMap[startStreak + z][i].group != 'undefined') {
                                    var existGroup = this.sortMap[startStreak + z][i].group;
                                    for (var x = 0; x < fieldSize; x++) {
                                        for (var y = 0; y < fieldSize; y++) {
                                            if (this.sortMap[x][y].group == existGroup) {
                                                this.sortMap[x][y].group = groupName;
                                            }
                                        }
                                    }
                                }
                            }
                        }
                        for (var k = 0; k < colorStreak; k++) {
                            if (direction == HORIZONTAL) {
                                this.removeMap[i][startStreak + k]++;

                                this.sortMap[i][startStreak + k].index = k + 1;
                                this.sortMap[i][startStreak + k].removeMark++;
                                this.sortMap[i][startStreak + k].group = groupName;
                                this.sortMap[i][startStreak + k].removeDirection = HORIZONTAL;
                                this.sortMap[i][startStreak + k].removeNum = colorStreak;

                            } else {
                                this.removeMap[startStreak + k][i]++;

                                this.sortMap[startStreak + k][i].removeMark++;
                                this.sortMap[startStreak + k][i].group = groupName;
                                this.sortMap[startStreak + k][i].removeDirection = VERTICAL;
                                if (typeof this.sortMap[startStreak + k][i].removeNum == 'undefined' ||
                                    this.sortMap[startStreak + k][i].removeNum < colorStreak) {
                                    this.sortMap[startStreak + k][i].removeNum = colorStreak;
                                    this.sortMap[startStreak + k][i].index = k + 1;
                                }
                            }
                        }
                    }

                    startStreak = j;
                    colorStreak = 1;
                    currentColor = colorToWatch;
                }
            }
        }
    }

    propPosition(gem1row, gem1col, gem2row, gem2col) {
        var halfRemoveNum = 0;
        this.propsArray = [];
        for (let i = 0; i < fieldSize; i++) {
            this.propsArray[i] = [];
            for (let j = 0; j < fieldSize; j++) {
                if (typeof this.sortMap[i][j].group != 'undefined') {
                    this.propsArray[i][j] = {
                        group: 0,
                        x: 0,
                        y: 0,
                        type: 0,
                    };
                }
                if (this.removeMap[i][j] > 0) {
                    halfRemoveNum = Phaser.Math.CeilTo(this.sortMap[i][j].removeNum / 2); // CeilTo 無條件進位

                    if (this.sortMap[i][j].removeNum >= 5) {
                        if (typeof gem1row == 'undefined' && this.sortMap[i][j].index == halfRemoveNum) {
                            this.propsArray[i][j].type = 8;
                        } else if (gem1row == i && gem1col == j || gem2row == i && gem2col == j) {
                            this.propsArray[i][j].type = 8;
                        }
                    } else if (this.sortMap[i][j].removeMark == 2 && this.sortMap[i][j].removeNum >= 3) {
                        this.propsArray[i][j].type = 7;
                    } else if (this.sortMap[i][j].removeMark == 1) {
                        if (this.sortMap[i][j].removeNum == 4) {
                            if (this.sortMap[i][j].removeDirection == HORIZONTAL) {
                                if (typeof gem1row == 'undefined' && this.sortMap[i][j].index == halfRemoveNum) {
                                    this.propsArray[i][j].type = 5;
                                } else if (gem1row == i && gem1col == j || gem2row == i && gem2col == j) {
                                    this.propsArray[i][j].type = 5;
                                }
                            } else {
                                if (typeof gem1row == 'undefined' && this.sortMap[i][j].index == halfRemoveNum) {
                                    this.propsArray[i][j].type = 6;
                                } else if (gem1row == i && gem1col == j || gem2row == i && gem2col == j) {
                                    this.propsArray[i][j].type = 6;
                                }
                            }
                        }
                    }

                    if (this.propsArray[i][j].type >= 5) {
                        this.propsArray[i][j].x = i;
                        this.propsArray[i][j].y = j;
                        this.propsArray[i][j].group = this.sortMap[i][j].group;
                        // console.log('變成道具的位置 (' + i + ',' + j + ')group: ' + this.propsArray[i][j].group + ' / type: ' + this.propsArray[i][j].type)

                        if (this.sameArray.indexOf(this.propsArray[i][j].group) == -1) { // 如果還沒確定位置
                            this.sameArray.push(this.propsArray[i][j].group);
                        } else {
                            if (this.propsArray[i][j].type >= this.getType(this.propsArray[i][j].group)) { // 如果新的比舊的大
                                this.propsArray[this.getTypeX(this.propsArray[i][j].group)][this.getTypeY(this.propsArray[i][j].group)].group = 0; // 舊的就沒資格變成道具 = 0
                            } else {
                                this.propsArray[i][j].group = 0; // else新的就沒資格變成道具 = 0
                            }
                        }
                    }
                }
            }
        }
        this.destroyGems(false);
    }
    useProps(row, col, indexColor, gem2) {
        // console.log('useProps(' + row + ',' + col + '): ' + indexColor + ' / ' + gem2)

        if (indexColor == -2) { // 五消道具自動發動->隨機選一個顏色
            var rand = Phaser.Math.Between(0, fieldColors - 1)
            indexColor = this.colorArray[rand];
        }
        if (indexColor > 0) { // 避免路徑上重複發動五消道具
            for (var a = 0; a < fieldSize; a++) {
                for (var b = 0; b < fieldSize; b++) {
                    if (this.gameArray[row][col].gemColor == 8) {
                        if (a == row && b == col) {
                            this.useProps_removeMap[a][b] = 1;
                            this.isCheckArray[a][b] = this.gameArray[a][b].gemColor;
                        }
                    }
                }
            }
        }

        for (var i = 0; i < fieldSize; i++) {
            for (var j = 0; j < fieldSize; j++) {
                if (this.gameArray[row][col].gemColor == 8) { // 五消道具
                    this.useProps_removeMap[row][col] = 1;
                    if (indexColor == 8) {
                        // console.log('【8 + 8】');
                        this.allClear = true;
                        for (var x = 0; x < fieldSize; x++) {
                            for (var y = 0; y < fieldSize; y++) {
                                this.useProps_removeMap[x][y] = 1;
                            }
                        }
                    } else {
                        if (indexColor == -1) {
                            return;
                        } else if (this.gameArray[i][j].gemColor == indexColor) {
                            if (indexColor >= 0 && indexColor < 5) {
                                this.useProps_removeMap[i][j] = 1;
                            } else {
                                this.isAutoPosition = true;
                                this.randomIndex = [];
                                for (var k = 0; k < randomNum; k++) { // 隨機五顆變成道具
                                    let randomPosX = Phaser.Math.Between(0, fieldSize - 1);
                                    let randomPosY = Phaser.Math.Between(0, fieldSize - 1);
                                    if (this.randomIndex.indexOf(randomPosX.toString() + randomPosY.toString()) != -1 ||
                                        this.gameArray[randomPosX][randomPosY].gemColor >= 5) {
                                        k -= 1;
                                        continue;
                                    }
                                    this.randomIndex.push(randomPosX.toString() + randomPosY.toString());

                                    this.gameArray[randomPosX][randomPosY].gemSprite.setFrame(indexColor); //變成道具
                                    this.gameArray[randomPosX][randomPosY].gemColor = indexColor;
                                    // console.log('隨機位置->道具' + k + ': (' + randomPosX + ',' + randomPosY + ') color: ' + indexColor)
                                    if (k == randomNum - 1 && typeof gem2 != 'undefined') {
                                        // console.log('隔壁道具也要發動' + ': (' + this.getGemRow(gem2) + ',' + this.getGemCol(gem2) + ') color: ' + indexColor)
                                        this.useProps(this.getGemRow(gem2), this.getGemCol(gem2), -1);
                                    }
                                    this.tweens.add({
                                        targets: this.gameArray[randomPosX][randomPosY].gemSprite,
                                        alpha: 0.5,
                                        scale: { from: 1, to: 1.5 },
                                        yoyo: true,
                                        duration: fallSpeed,
                                        callbackScope: this,
                                        onComplete: function() {
                                            this.useProps(randomPosX, randomPosY, indexColor);
                                            this.doubleComplete++;
                                        }
                                    });
                                }
                                indexColor = -1;
                            }
                        }
                    }
                } else if (this.gameArray[row][col].gemColor == 7) { // 直角道具
                    if (indexColor == 5) {
                        if (j == col || j == col - 1 || j == col + 1) {
                            this.useProps_removeMap[i][j] = 1;

                            // isCheckArray 道具動畫索引用
                            this.isCheckArray[row][col] = 75; // 三排橫動畫
                            this.isCheckArray[this.getGemRow(gem2)][this.getGemCol(gem2)] = -1;
                            this.gameArray[this.getGemRow(gem2)][this.getGemCol(gem2)].gemColor = -1;
                        }
                    } else if (indexColor == 6) {
                        if (i == row || i == row - 1 || i == row + 1) {
                            this.useProps_removeMap[i][j] = 1;

                            // isCheckArray 道具動畫索引用
                            this.isCheckArray[row][col] = 76; // 三排直動畫
                            this.isCheckArray[this.getGemRow(gem2)][this.getGemCol(gem2)] = -1;
                            this.gameArray[this.getGemRow(gem2)][this.getGemCol(gem2)].gemColor = -1;
                        }
                    } else if (indexColor == 7) {
                        if (i <= row + 2 && i >= row - 2 && j <= col + 2 && j >= col - 2) {
                            this.useProps_removeMap[i][j] = 1;
                            // console.log('25顆【7 + 7】: (' + i + ',' + j + ')');
                        }
                    } else {
                        if (i <= row + 1 && i >= row - 1 && j <= col + 1 && j >= col - 1) {
                            this.useProps_removeMap[i][j] = 1;
                            // console.log('9顆 frame 7: (' + i + ',' + j + ')' + this.useProps_removeMap[i][j])
                        }
                    }
                } else if (this.gameArray[row][col].gemColor == 6) { // 橫線道具
                    if (i == row) {
                        this.useProps_removeMap[i][j] = 1;
                        // console.log('frame 6: (' + i + ',' + j + '): ' + this.useProps_removeMap[i][j])
                    }
                    if (indexColor == 5 || indexColor == 6) {
                        if (j == col) {
                            this.useProps_removeMap[i][j] = 1;
                        }
                        // isCheckArray 道具動畫索引用
                        this.isCheckArray[row][col] = 56; // 十字動畫
                        this.isCheckArray[this.getGemRow(gem2)][this.getGemCol(gem2)] = -1;
                        this.gameArray[this.getGemRow(gem2)][this.getGemCol(gem2)].gemColor = -1;
                    }
                } else if (this.gameArray[row][col].gemColor == 5) { // 直線道具
                    if (j == col) {
                        this.useProps_removeMap[i][j] = 1;
                        // console.log('frame 5: (' + i + ',' + j + '): ' + this.useProps_removeMap[i][j])
                    }
                    if (indexColor == 5 || indexColor == 6) {
                        if (i == row) {
                            this.useProps_removeMap[i][j] = 1;
                        }
                        // isCheckArray 道具動畫索引用
                        this.isCheckArray[row][col] = 56; // 十字動畫
                        this.isCheckArray[this.getGemRow(gem2)][this.getGemCol(gem2)] = -1;
                        this.gameArray[this.getGemRow(gem2)][this.getGemCol(gem2)].gemColor = -1;
                    }
                }

                if (i == row && j == col) {
                    this.isCheckArray[i][j] = this.gameArray[i][j].gemColor;
                    this.baseScoreOfProps(i, j, indexColor);
                } else {
                    // 是道具 + 要被殺(在路徑上) + 還沒到分配到動畫(沒被執行過)
                    if (this.gameArray[i][j].gemColor >= 5 && this.useProps_removeMap[i][j] == 1 && this.isCheckArray[i][j] == 0) {
                        this.isCheckAuto = true;
                        this.isCheckArray[i][j] = 1; // 在路徑上等待被執行
                    }
                }
            }
        }

        if (!this.leftOver) { // 不是結算剩餘步數時(平常使用道具判斷路徑上用)
            for (var i = 0; i < fieldSize; i++) {
                for (var j = 0; j < fieldSize; j++) {
                    if (this.isCheckArray[i][j] == 1) {
                        if (this.isAutoPosition && this.isCheckAuto) {
                            if (this.gameArray[i][j].gemColor == 8 && indexColor > 0) {
                                // isAutoPosition的道具8本身不再發動
                            } else {
                                this.useProps(i, j, -2);
                            }
                            this.numOfCheck++;
                        } else {
                            this.useProps(i, j, -2);
                        }
                    }
                }
            }
        }

        var numOfDouble = 0;
        for (var i = 0; i < fieldSize; i++) {
            for (var j = 0; j < fieldSize; j++) {
                if (this.isCheckArray[i][j] >= 5 || this.isCheckArray[i][j] == -1) {
                    if (this.isCheckArray[i][j] != 75 && this.isCheckArray[i][j] != 76) {
                        numOfDouble++;
                    }
                }
            }
        }

        if (!gameIsOver) {
            if (this.isAutoPosition && this.isCheckAuto) {
                if (this.doing) {
                    return;
                }
                // console.log('numOfDouble: ' + numOfDouble + 'doubleComplete: ' + this.doubleComplete)
                if (numOfDouble == this.check() && this.doubleComplete >= 5) {
                    this.doing = true;
                    this.destroyGems(true);
                }
            } else if (this.isAutoPosition) {
                this.numOfAuto++;
                // console.log('numOfAuto: ' + this.numOfAuto)
                if (this.numOfAuto > randomNum) {
                    this.destroyGems(true);
                }
            } else if (this.isCheckAuto) {
                this.numOfCheck++;
                // console.log('>>>> isCheckAuto ' + this.numOfCheck)
                if (this.numOfCheck == this.check()) {
                    this.destroyGems(true);
                }
            } else {
                this.destroyGems(true);
            }
        } else {
            // console.log('gameIsOver: ' + this.numOfPropInBoard + ' / ' + this.propInBoard() + ' this.propscalculated: ' + this.propscalculated.length)
            if (!this.autoDestroy && this.propscalculated.length == this.propInBoard()) {
                this.autoDestroy = true;
                this.destroyGems(true);
            }
        }
    }

    check() {
        var total = 0;
        for (var i = 0; i < fieldSize; i++) {
            for (var j = 0; j < fieldSize; j++) {
                if (this.gameArray[i][j].gemColor >= 5 && this.useProps_removeMap[i][j] > 0) {
                    total++;
                }
            }
        }
        return total;
    }
    propInBoard() {
        var numOfBonus = 0;
        for (var i = 0; i < fieldSize; i++) {
            for (var j = 0; j < fieldSize; j++) {
                if (this.gameArray[i][j].gemColor >= 5) {
                    numOfBonus++
                }
            }
        }
        return numOfBonus;
    }

    isMovingProp(gem1, gem2) {
        return this.gemAt(this.getGemRow(gem1), this.getGemCol(gem1)).gemColor >= 5 || this.gemAt(this.getGemRow(gem2), this.getGemCol(gem2)).gemColor >= 5;
    }

    numOfMovingProp(gem1, gem2) {
        if (this.gemAt(this.getGemRow(gem1), this.getGemCol(gem1)).gemColor >= 5 && this.gemAt(this.getGemRow(gem2), this.getGemCol(gem2)).gemColor >= 5) {
            return 2;
        } else if (this.gemAt(this.getGemRow(gem1), this.getGemCol(gem1)).gemColor >= 5 || this.gemAt(this.getGemRow(gem2), this.getGemCol(gem2)).gemColor >= 5) {
            return 1;
        }
    }

    getPropRow(gem1, gem2) {
        if (this.gemAt(this.getGemRow(gem1), this.getGemCol(gem1)).gemColor >= 5 && this.gemAt(this.getGemRow(gem2), this.getGemCol(gem2)).gemColor >= 5) {
            return this.gemAt(this.getGemRow(gem1), this.getGemCol(gem1)).gemColor >= this.gemAt(this.getGemRow(gem2), this.getGemCol(gem2)).gemColor ?
                this.getGemRow(gem1) : this.getGemRow(gem2);
        } else {
            if (this.gemAt(this.getGemRow(gem1), this.getGemCol(gem1)).gemColor >= 5) {
                return this.getGemRow(gem1);
            } else if (this.gemAt(this.getGemRow(gem2), this.getGemCol(gem2)).gemColor >= 5) {
                return this.getGemRow(gem2);
            }
        }
    }
    getPropCol(gem1, gem2) {
        if (this.gemAt(this.getGemRow(gem1), this.getGemCol(gem1)).gemColor >= 5 && this.gemAt(this.getGemRow(gem2), this.getGemCol(gem2)).gemColor >= 5) {
            return this.gemAt(this.getGemRow(gem1), this.getGemCol(gem1)).gemColor >= this.gemAt(this.getGemRow(gem2), this.getGemCol(gem2)).gemColor ?
                this.getGemCol(gem1) : this.getGemCol(gem2);
        } else {
            if (this.gemAt(this.getGemRow(gem1), this.getGemCol(gem1)).gemColor >= 5) {
                return this.getGemCol(gem1);
            } else if (this.gemAt(this.getGemRow(gem2), this.getGemCol(gem2)).gemColor >= 5) {
                return this.getGemCol(gem2);
            }
        }
    }
    getPropNextColor(gem1, gem2) {
        if (this.gemAt(this.getGemRow(gem1), this.getGemCol(gem1)).gemColor >= 5 && this.gemAt(this.getGemRow(gem2), this.getGemCol(gem2)).gemColor >= 5) {
            return this.gemAt(this.getGemRow(gem1), this.getGemCol(gem1)).gemColor >= this.gemAt(this.getGemRow(gem2), this.getGemCol(gem2)).gemColor ?
                this.gemAt(this.getGemRow(gem2), this.getGemCol(gem2)).gemColor : this.gemAt(this.getGemRow(gem1), this.getGemCol(gem1)).gemColor;
        } else {
            if (this.gemAt(this.getGemRow(gem1), this.getGemCol(gem1)).gemColor >= 5) {
                return this.gemAt(this.getGemRow(gem2), this.getGemCol(gem2)).gemColor;
            } else if (this.gemAt(this.getGemRow(gem2), this.getGemCol(gem2)).gemColor >= 5) {
                return this.gemAt(this.getGemRow(gem1), this.getGemCol(gem1)).gemColor;
            }
        }
    }
    getNextProp(gem1, gem2) {
        if (this.gemAt(this.getGemRow(gem1), this.getGemCol(gem1)).gemColor >= 5 && this.gemAt(this.getGemRow(gem2), this.getGemCol(gem2)).gemColor >= 5) {
            return this.gemAt(this.getGemRow(gem1), this.getGemCol(gem1)).gemColor >= this.gemAt(this.getGemRow(gem2), this.getGemCol(gem2)).gemColor ?
                this.gemAt(this.getGemRow(gem2), this.getGemCol(gem2)) : this.gemAt(this.getGemRow(gem1), this.getGemCol(gem1));
        } else {
            if (this.gemAt(this.getGemRow(gem1), this.getGemCol(gem1)).gemColor >= 5) {
                return this.gemAt(this.getGemRow(gem2), this.getGemCol(gem2))
            } else if (this.gemAt(this.getGemRow(gem2), this.getGemCol(gem2)).gemColor >= 5) {
                return this.gemAt(this.getGemRow(gem1), this.getGemCol(gem1))
            }
        }
    }

    getType(groupIndex) {
        for (var i = 0; i < fieldSize; i++) {
            for (var j = 0; j < fieldSize; j++) {
                if (typeof this.propsArray[i][j] != 'undefined') {
                    if (this.propsArray[i][j].group == groupIndex) {
                        return this.propsArray[i][j].type;
                    }
                }
            }
        }
    }
    getTypeX(groupIndex) {
        for (var i = 0; i < fieldSize; i++) {
            for (var j = 0; j < fieldSize; j++) {
                if (typeof this.propsArray[i][j] != 'undefined') {
                    if (this.propsArray[i][j].group == groupIndex) {
                        return i;
                    }
                }
            }
        }
    }
    getTypeY(groupIndex) {
        for (var i = 0; i < fieldSize; i++) {
            for (var j = 0; j < fieldSize; j++) {
                if (typeof this.propsArray[i][j] != 'undefined') {
                    if (this.propsArray[i][j].group == groupIndex) {
                        return j;
                    }
                }
            }
        }
    }

    destroyGems(isUsingProp) {
        PlayAudio(this, 'normalSE');
        this.scoreTween(score)
        if (this.allClear) {
            this.showPerfectAnim();
            this.allClear = false;
        }

        var destroyed = 0;
        for (let i = 0; i < fieldSize; i++) {
            for (let j = 0; j < fieldSize; j++) {
                if (isUsingProp && this.useProps_removeMap[i][j] > 0) {
                    this.removeMap[i][j] = this.useProps_removeMap[i][j];
                }
                if (!isUsingProp && this.double) { // 發動道具 + 可消 : 會進兩次(可消那次不執行)
                    return;
                }

                if (this.removeMap[i][j] > 0) {
                    this.showGemsAnim(i, j);
                    if (typeof this.isCheckArray != 'undefined' && this.isCheckArray[i][j] > 0) {
                        this.showPropsAnimation(i, j, this.isCheckArray[i][j]);
                    }
                    this.meetRequired(this.gameArray[i][j].gemColor);

                    if (this.sameArray.indexOf(this.sortMap[i][j].group) != -1 && this.propsArray[i][j].group != 0) {
                        this.showBornAudio(this.propsArray[i][j].type)

                        // console.log('不要殺我(' + i + ',' + j + ')')
                        this.gameArray[i][j].gemSprite.setFrame(this.propsArray[i][j].type); //變成道具
                        this.gameArray[i][j].gemColor = this.propsArray[i][j].type;

                        this.tweens.add({
                            targets: this.gameArray[i][j].gemSprite,
                            alpha: 0.5,
                            scale: 0.5,
                            duration: destroySpeed,
                            callbackScope: this,
                            onComplete: function() {
                                this.gameArray[i][j].gemSprite.alpha = 1;
                                this.gameArray[i][j].gemSprite.scale = 1;
                            }
                        });
                    } else {
                        destroyed++;

                        this.tweens.add({
                            targets: this.gameArray[i][j].gemSprite,
                            alpha: 0.5,
                            scale: 0.5,
                            duration: destroySpeed,
                            callbackScope: this,
                            onComplete: function() {
                                destroyed--;
                                this.gameArray[i][j].gemSprite.scale = 1;
                                this.gameArray[i][j].gemSprite.visible = false;
                                this.poolArray.push(this.gameArray[i][j].gemSprite);
                                if (destroyed == 0) {
                                    this.double = false;
                                    this.makeGemsFall();
                                    this.replenishField();
                                }
                            }
                        });
                        this.gameArray[i][j].isEmpty = true;
                    }
                }
            }
        }
    }
    makeGemsFall() {
        for (var i = fieldSize - 2; i >= 0; i--) {
            for (var j = 0; j < fieldSize; j++) {
                if (!this.gameArray[i][j].isEmpty) {
                    let fallTiles = this.holesBelow(i, j);
                    if (fallTiles > 0) {
                        this.tweens.add({
                            targets: this.gameArray[i][j].gemSprite,
                            y: this.gameArray[i][j].gemSprite.y + fallTiles * (gemSize + gemOffset),
                            duration: fallSpeed * fallTiles,
                        });
                        this.gameArray[i + fallTiles][j] = {
                            gemColor: this.gameArray[i][j].gemColor,
                            gemSprite: this.gameArray[i][j].gemSprite,
                            isEmpty: false,
                        }
                        this.gameArray[i][j].isEmpty = true;
                    }
                }
            }
        }
    }

    holesBelow(row, col) {
        var result = 0;
        for (var i = row + 1; i < fieldSize; i++) {
            if (this.gameArray[i][col].isEmpty) {
                result++;
            }
        }
        return result;
    }

    replenishField() {
        this.autoDestroy = false;
        var replenished = 0;
        for (var j = 0; j < fieldSize; j++) {
            let emptySpots = this.holesInCol(j);
            if (emptySpots > 0) {
                for (var i = 0; i < emptySpots; i++) {
                    replenished++;
                    let randomColor = Phaser.Math.Between(0, fieldColors - 1);
                    this.gameArray[i][j].gemColor = this.colorArray[randomColor];
                    this.gameArray[i][j].gemSprite = this.poolArray.pop();
                    this.gameArray[i][j].gemSprite.setFrame(this.colorArray[randomColor]);
                    this.gameArray[i][j].gemSprite.visible = true;
                    this.gameArray[i][j].gemSprite.x = (gemSize + gemOffset) * j + (gemSize + gemOffset) / 2 + boardOffset.x;
                    this.gameArray[i][j].gemSprite.y = (boardOffset.y + (gemSize + gemOffset) / 2) - (emptySpots - i) * (gemSize + gemOffset);
                    this.gameArray[i][j].gemSprite.alpha = 1;
                    this.gameArray[i][j].isEmpty = false;

                    this.tweens.add({
                        targets: this.gameArray[i][j].gemSprite,
                        y: (gemSize + gemOffset) * i + (gemSize + gemOffset) / 2 + boardOffset.y,
                        duration: fallSpeed * emptySpots,
                        callbackScope: this,
                        onComplete: function() {
                            this.sameArray = [];
                            replenished--;
                            if (replenished == 0) {

                                this.removeMap = [];
                                this.isCheckArray = [];
                                for (let i = 0; i < fieldSize; i++) {
                                    this.removeMap[i] = [];
                                    this.isCheckArray[i] = [];
                                    for (let j = 0; j < fieldSize; j++) {
                                        this.removeMap[i].push(0);
                                        this.isCheckArray[i].push(0);
                                    }
                                }

                                if (this.matchInBoard()) {
                                    this.time.addEvent({
                                        delay: 250,
                                        callback: this.handleMatches(),
                                    });
                                } else {
                                    // 第二次配對要用，可是第一次配對不要執行(會重複消->造成空格)
                                    if (gameIsOver || this.step == 0) {
                                        // console.log('>> replenishField into showResult')
                                        this.time.addEvent({
                                            delay: 500,
                                            callback: function() {
                                                this.showResult();
                                            },
                                            callbackScope: this
                                        });
                                    } else {
                                        this.selectedGem = null;
                                        this.scoreCombo = 0;
                                        if (this.cheat >= 5) {
                                            this.createCheat();
                                        } else {
                                            this.canPick = true;
                                        }
                                        this.time.addEvent({
                                            delay: 500,
                                            callback: function() {
                                                this.anyCanMove();
                                            },
                                            callbackScope: this
                                        });
                                    }
                                }
                            }
                        }
                    });
                }
            }
        }
    }

    holesInCol(col) {
        var result = 0;
        for (var i = 0; i < fieldSize; i++) {
            if (this.gameArray[i][col].isEmpty) {
                result++;
            }
        }
        return result;
    }

    createCheat() {
        if (!this.showed) {
            this.showPerfectAnim();
        }
        this.time.addEvent({
            delay: 1500,
            callback: function() {
                this.player.play('cheatAnims');
                this.player.on('animationcomplete', this.playerAnimComplete, this);

                var randomX;
                var randomY;
                var randomArray = [];
                for (var k = 0; k < 2; k++) {
                    randomX = Phaser.Math.Between(0, fieldSize - 1);
                    randomY = Phaser.Math.Between(0, fieldSize - 1);
                    if (randomArray.indexOf(randomX.toString() + randomY.toString()) != -1 ||
                        this.gameArray[randomX][randomY].gemColor >= 5) {
                        k -= 1;
                        continue;
                    }
                    randomArray.push(randomX.toString() + randomY.toString());

                    this.showBornAudio(8);
                    this.gameArray[randomX][randomY].gemSprite.setFrame(8);
                    this.gameArray[randomX][randomY].gemColor = 8;
                    this.gameArray[randomX][randomY].gemSprite.depth = 2;

                    var cheatAni = this.add.sprite(0, 0, 'normalAni');
                    cheatAni.x = this.gameArray[randomX][randomY].gemSprite.x;
                    cheatAni.y = this.gameArray[randomX][randomY].gemSprite.y + 10;
                    cheatAni.play('normalAni_default');

                    this.tweens.add({
                        targets: this.gameArray[randomX][randomY].gemSprite,
                        alpha: 0.5,
                        scale: { from: 1, to: 1.5 },
                        yoyo: true,
                        duration: destroySpeed,
                        callbackScope: this,
                        onComplete: function() {
                            this.canPick = true;
                            this.cheat = 0;
                        }
                    });
                }
            },
            callbackScope: this,
        });
    }

    meetRequired(colorIndex) {
        var usepropsRequire = [0, 0, 0];
        for (var k = 0; k < requireType; k++) {
            if (colorIndex == this.requireArray[k].requireColor) {
                usepropsRequire[k]++;
            }
            this.destoryRequire(usepropsRequire[k], this.requireArray[k].requireColor)
        }
    }
    destoryRequire(numIndex, colorIndex) {
        if (requireType > 0) {
            for (var i = 0; i < this.requireArray.length; i++) {
                if (colorIndex == this.requireArray[i].requireColor) {
                    num[i] -= numIndex;
                    if (num[i] < 0) {
                        num[i] = 0;
                    }
                }
            }
        }
    }
    checkCheat(gem1row, gem1col, gem2row, gem2col) {
        var array = [];
        var color = -1;
        for (var i = 0; i < fieldSize; i++) {
            for (var j = 0; j < fieldSize; j++) {
                if (this.gameArray[i][j].gemColor < 5) {
                    if (this.isHorizontalMatch(i, j)) {
                        if (gem1row == i) {
                            if (gem1col == j || gem1col == j - 1 || gem1col == j - 2) {
                                color = this.gameArray[gem1row][gem1col].gemColor;
                                array.push(this.gameArray[gem1row][gem1col].gemColor);
                            }
                        } else if (gem2row == i) {
                            if (gem2col == j || gem2col == j - 1 || gem2col == j - 2) {
                                color = this.gameArray[gem2row][gem2col].gemColor;
                                array.push(this.gameArray[gem2row][gem2col].gemColor);
                            }
                        }
                    } else if (this.isVerticalMatch(i, j)) {
                        if (gem1col == j) {
                            if (gem1row == i || gem1row == i - 1 || gem1row == i - 2) {
                                color = this.gameArray[gem1row][gem1col].gemColor;
                                array.push(this.gameArray[gem1row][gem1col].gemColor);
                            }
                        } else if (gem2col == j) {
                            if (gem2row == i || gem2row == i - 1 || gem2row == i - 2) {
                                color = this.gameArray[gem2row][gem2col].gemColor;
                                array.push(this.gameArray[gem2row][gem2col].gemColor);
                            }
                        }
                    }
                }
            }
        }
    }
    baseScoreOfNormal() {
        var idx;
        var normalScore = 0;
        var normalGroupArray = [];
        var normalNumArray = [];

        for (var i = 0; i < fieldSize; i++) {
            for (var j = 0; j < fieldSize; j++) {
                if (typeof this.sortMap[i][j].group != 'undefined') {
                    if (normalGroupArray.indexOf(this.sortMap[i][j].group) == -1) {
                        normalGroupArray.push(this.sortMap[i][j].group);
                        idx = normalGroupArray.indexOf(this.sortMap[i][j].group);
                        normalNumArray[idx] = 1;
                    } else {
                        normalNumArray[normalGroupArray.indexOf(this.sortMap[i][j].group)]++;
                    }
                }
            }
        }
        // console.log(normalNumArray)
        for (var k = 0; k < normalNumArray.length; k++) {
            this.scoreCombo++;
            normalScore = this.calculateBaseScore(normalNumArray[k], 1);
            score += normalScore;
            // console.log('normalScore: ' + normalScore)
        }
    }

    baseScoreOfProps(row, col, indexColor) {
        if (this.propscalculated.indexOf(row.toString() + col.toString()) != -1) {
            return;
        }
        //如果兩顆都是道具旁邊那顆也要加進去
        this.propscalculated.push(row.toString() + col.toString());

        var num = 0;
        var propsScore = 0;
        this.scoreCombo = 1;
        if (this.gameArray[row][col].gemColor == 8) {
            if (indexColor == 8) {
                propsScore = this.calculateBaseScore(fieldSize * fieldSize, propRate);
                // console.log('【8 + 8】' + propsScore);
            } else {
                if (indexColor == -1) {
                    return;
                } else if (indexColor >= 0 && indexColor < 5) {
                    for (var i = 0; i < fieldSize; i++) {
                        for (var j = 0; j < fieldSize; j++) {
                            if (this.gameArray[i][j].gemColor == indexColor) {
                                num++;
                                // console.log('(' + i + ',' + j + ')')
                            }
                        }
                    }
                    propsScore = this.calculateBaseScore(num, propRate);
                    // console.log('【8 + n】' + propsScore);
                } else {
                    propsScore = this.calculateBaseScore(randomNum, propRate);
                    // console.log('【8 + m】' + propsScore);
                }
            }
        } else if (this.gameArray[row][col].gemColor == 7) {
            if (indexColor == 5 || indexColor == 6) {
                propsScore = this.calculateBaseScore(fieldSize, propRate) * 3;
                // console.log('【7 + n】' + propsScore);
            } else if (indexColor == 7) {
                // console.log('【7 + 7】' + (25));
                propsScore = this.calculateBaseScore(25, propRate);
            } else {
                propsScore = this.calculateBaseScore(9, propRate);
            }
        } else if (this.gameArray[row][col].gemColor == 6) { // 橫
            if (indexColor == 5 || indexColor == 6) { // 十字消
                propsScore = this.calculateBaseScore(fieldSize, propRate) * 2;
                // console.log('【6 + n】' + propsScore);
            } else {
                propsScore = this.calculateBaseScore(fieldSize, propRate);
                // console.log('【 6 】' + (fieldSize) + ' / ' + propsScore);
            }
        } else if (this.gameArray[row][col].gemColor == 5) { // 直
            if (indexColor == 5 || indexColor == 6) { // 十字消
                propsScore = this.calculateBaseScore(fieldSize, propRate) * 2;
                // console.log('【5 + n】' + propsScore);
            } else {
                propsScore = this.calculateBaseScore(fieldSize, propRate);
                // console.log('【 5 】' + (fieldSize) + ' / ' + propsScore);
            }
        }

        // console.log('propsScore: ' + propsScore)
        score += propsScore;
    }

    calculateBaseScore(num, propsMultiple) {
        baseScore = num * (num - 1) * multiple * propsMultiple * this.scoreCombo;
        // console.log(num + ' x ' + (num - 1) + ' x ' + multiple + ' x ' + propsMultiple + ' x ' + this.scoreCombo)
        return baseScore;
    }

    showGemsAnim(i, j) {
        var normalAni = this.add.sprite(0, 0, 'normalAni');
        normalAni.x = this.gameArray[i][j].gemSprite.x;
        normalAni.y = this.gameArray[i][j].gemSprite.y + 10;
        normalAni.depth = 2;
        var type = this.gameArray[i][j].gemColor;

        // console.log('----showGemsAnim-----: (' + i + ',' + j + ')=> ' + type)

        if (type == -1 || type >= 5) {
            normalAni.play('normalAni_default');
        } else if (type == 0) {
            normalAni.play('normalAni_0');
        } else if (type == 1) {
            normalAni.play('normalAni_1');
        } else if (type == 2) {
            normalAni.play('normalAni_2');
        } else if (type == 3) {
            normalAni.play('normalAni_3');
        } else if (type == 4) {
            normalAni.play('normalAni_4');
        }
    }

    showPerfectAnim() {
        this.showed = true;
        this.anims.create({
            key: 'perfect',
            frames: this.anims.generateFrameNumbers('perfect', { start: 0, end: 1 }),
            frameRate: 6,
            repeat: -1,
        });
        PlayAudio(this, 'perfectSE');
        this.perfectAni = this.add.sprite(50, 0, 'perfect').setOrigin(0);
        this.perfectAni.depth = 4;
        this.perfectAni.play('perfect');

        this.tweens.add({
            targets: this.perfectAni,
            y: 300,
            duration: 500,
            ease: 'Circ.Out',
        });

        this.time.addEvent({
            delay: 1500,
            callback: function() {
                this.tweens.add({
                    targets: this.perfectAni,
                    y: 900,
                    duration: 500,
                    hideOnComplete: true,
                    callbackScope: this,
                    onComplete: function() {
                        this.showed = false;
                    }
                });
            },
            callbackScope: this,
        });
    }

    showBornAudio(audioInedex) {
        switch (audioInedex) {
            case 5:
                PlayAudio(this, 'bornLineSE');
                break;
            case 6:
                PlayAudio(this, 'bornLineSE');
                break;
            case 7:
                PlayAudio(this, 'bornRoundSE');
                break;
            case 8:
                PlayAudio(this, 'bornCircleSE');
                break;
        }
    }

    showPropsAnimation(i, j, aniIndex) {
        var indexArray = [5, 6, 56, 75, 76, 7, 8]; // 道具: [ 橫, 直, 十字, 直角 + 橫, 直角 + 直, 直角, 五消 ]
        var aniArray = ['rowAni', 'colAni', 'crossAni', 'wideRowAni', 'wideColAni', 'roundAni', 'circleAni'];

        if (indexArray.indexOf(aniIndex) != -1) {
            var aniSprite = aniArray[indexArray.indexOf(aniIndex)];
            switch (indexArray.indexOf(aniIndex)) {
                case 0:
                case 1:
                case 2:
                    PlayAudio(this, 'killLineSE');
                    break;
                case 3:
                case 4:
                case 5:
                    PlayAudio(this, 'killRonudSE');
                    break;
                case 6:
                    PlayAudio(this, 'killCircleSE');
                    break;
            }

            var propAni = this.add.sprite(this.gameArray[i][j].gemSprite.x, this.gameArray[i][j].gemSprite.y + 5, aniSprite);
            propAni.depth = 3;
            if (aniIndex == 56) {
                propAni.play('rowAni');
                propAni = this.add.sprite(this.gameArray[i][j].gemSprite.x, this.gameArray[i][j].gemSprite.y + 5, 'colAni');
                propAni.play('colAni');
            } else {
                propAni.play(aniSprite);
            }
        }
    }
}

// 首頁 + 扣點/次數介面
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
        playBtn = this.add.sprite(game.config.width / 2, game.config.height / 2 + 300, 'playBtn', 0);
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

    // showBanner() {
    //     FBshare = this.add.sprite(game.config.width - 90, game.config.height - 40, 'FBshare', 0);
    //     FBshare.setInteractive().on('pointerdown', function() {
    //         btnClick(this, FBshare);
    //         this.time.addEvent({
    //             delay: 400,
    //             callback: function() {
    //                 shareViaFacebook();
    //             },
    //             callbackScope: this,
    //         });
    //     }, this);
    //     LINEshare = this.add.sprite(game.config.width - 40, game.config.height - 40, 'LINEshare', 0);
    //     LINEshare.setInteractive().on('pointerdown', function() {
    //         btnClick(this, LINEshare);
    //         this.time.addEvent({
    //             delay: 400,
    //             callback: function() {
    //                 shareViaLine();
    //             },
    //             callbackScope: this,
    //         });
    //     }, this);

    //     var boardGroup = this.add.group();
    //     // GameCostPoint = GameCostPoint.toString(); // 原型態(number)=0 的時候bitmapText無法顯示
    //     // MemberPoint = MemberPoint.toString(); // 原型態(number)=0 的時候bitmapText無法顯示

    //     if (MemberFreeTimes > 0) {
    //         boardGroup.create(game.config.width / 2, game.config.height / 2, 'freebanner');
    //         boardGroup.create(this.add.bitmapText(game.config.width / 2 + 55, game.config.height / 2 + 25, 'BMFont', MemberFreeTimes, 18));
    //     } else {
    //         boardGroup.create(game.config.width / 2, game.config.height / 2, 'costbanner');
    //         boardGroup.create(this.add.bitmapText(game.config.width / 2 + 10, game.config.height / 2 + 10, 'BMFont', GameCostPoint, 26).setOrigin(1));
    //         boardGroup.create(this.add.bitmapText(game.config.width / 2 + 65, game.config.height / 2 + 32, 'BMFont', MemberPoint, 14));
    //     }

    //     cancleBtn = this.add.sprite(game.config.width / 2 - 75, game.config.height / 2 + 120, 'cancleBtn', 0);
    //     boardGroup.add(cancleBtn);
    //     cancleBtn.setInteractive().on('pointerdown', function() {
    //         btnClick(this, cancleBtn);
    //         startBtn.input.enabled = false;
    //         quitGame();
    //     }, this);
    //     startBtn = this.add.sprite(game.config.width / 2 + 70, game.config.height / 2 + 120, 'startBtn', 0);
    //     boardGroup.add(cancleBtn);
    //     startBtn.setInteractive().on('pointerdown', function() {
    //         btnClick(this, startBtn);
    //         this.tweens.add({
    //             targets: this.board,
    //             alpha: 0,
    //             duration: 300,
    //         });
    //         FBshare.alpha = 0;
    //         LINEshare.alpha = 0;
    //         cancleBtn.input.enabled = false;
    //         this.onStartbtnClick();
    //     }, this);
    // }

    // onStartbtnClick() {
    //     this.time.addEvent({
    //         delay: 300,
    //         callback: function() {
    //             if (MemberFreeTimes > 0 || parseInt(MemberPoint, 10) >= parseInt(GameCostPoint, 10)) {
    //                 this.scene.start('story');
    //             } else {
    //                 var tipsGroup = this.add.group();
    //                 tipsGroup.create(game.config.width / 2, game.config.height / 2, 'tipsbanner');
    //                 var backBtn = tipsGroup.create(game.config.width / 2 - 75, game.config.height / 2 + 120, 'cancleBtn', 0);
    //                 backBtn.setInteractive().on('pointerdown', function() {
    //                     btnClick(this, backBtn);
    //                     this.time.addEvent({
    //                         delay: 300,
    //                         callback: function() {
    //                             FBshare.alpha = 1;
    //                             LINEshare.alpha = 1;
    //                             startBtn.input.enabled = true;
    //                             cancleBtn.input.enabled = true;
    //                             tipsGroup.destroy(true);
    //                             this.tweens.add({
    //                                 targets: this.board,
    //                                 alpha: 1,
    //                                 duration: 300,
    //                             });
    //                         },
    //                         callbackScope: this,
    //                     });
    //                 }, this);

    //                 var storeBtn = tipsGroup.create(game.config.width / 2 + 70, game.config.height / 2 + 120, 'storeBtn', 0);
    //                 storeBtn.setInteractive().on('pointerdown', function() {
    //                     btnClick(this, storeBtn);
    //                     this.time.addEvent({
    //                         delay: 200,
    //                         callback: function() {
    //                             window.location.replace('/buycoins'); // 連接到儲值頁
    //                         },
    //                         callbackScope: this,
    //                     });
    //                 }, this);
    //             }
    //         },
    //         callbackScope: this,
    //     });
    // }
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
        soundStory = this.sound.add('storySE', { loop: -1 });
        soundStory.play();
        this.waitForStart = false;

        var page = 0;
        this.story = ['story', 'story2', 'story3', 'teach'];
        for (var i = this.story.length - 1; i >= 0; i--) {
            this.story[i] = this.add.sprite(0, 0, this.story[i]).setOrigin(0);
            this.story[i].inputEnabled = true;
            this.story[i].setInteractive().on('pointerdown', function() {
                this.nextPage(page);
                page += 1;
            }, this)
        }

        this.skipBtn = this.add.sprite(game.config.width - 50, game.config.height - 35, 'skipBtn', 0);
        this.skipBtn.setInteractive().on('pointerdown', function() {
            btnClick(this, this.skipBtn);
            this.time.addEvent({
                delay: 200,
                callback: function() {
                    this.skipBtn.destroy();
                    for (var j = 0; j < this.story.length - 1; j++) {
                        this.story[j].alpha = 0;
                    }
                    page = this.story.length - 1;
                },
                callbackScope: this,
            });
        }, this);
    }

    nextPage(page) {
        if (this.waitForStart == true) return

        if (page == this.story.length - 1) {
            PlayAudio(this, 'clickStartSE');
            this.waitForStart = true;

            // ajax取得遊戲參數
            // startData();
            this.scene.start('play');
        } else {
            this.story[page].alpha = 0;
            PlayAudio(this, 'clickSE');
            if (page == this.story.length - 2) {
                this.skipBtn.destroy();
            }
        }
    }
}

// 結束 / 成績結算介面
class over extends Phaser.Scene {
    constructor() {
        super('over');
    }

    create() {
        this.add.sprite(0, 0, 'menu').setOrigin(0);
        this.add.sprite(0, 0, 'cover').setOrigin(0);
        // this.add.text(12, game.config.height - 45, 'ID: ' + PlayerID, { font: '16px ', fill: '#FFF' });
        // this.add.text(10, game.config.height - 25, 'SN: ' + PlayerSN, { font: '16px ', fill: '#FFF' });

        this.scorebannerGroup = this.add.group();
        var stamp = this.add.sprite(game.config.width / 2 + 170, game.config.height / 2, 'stamp');
        stamp.alpha = 0;
        stamp.depth = 5;
        this.anims.create({
            key: 'stamping',
            frames: this.anims.generateFrameNumbers('stamp', { start: 0, end: 8 }),
            frameRate: 12,
        });

        if (score == 0) {
            this.scorebannerGroup.create(game.config.width / 2, game.config.height / 2, 'failbanner');
        } else {
            this.scorebannerGroup.create(game.config.width / 2, game.config.height / 2, 'scorebanner');
            this.add.bitmapText(game.config.width / 2, game.config.height / 2 + 10, 'BMFont', score, 26).setOrigin(0.5);
            // if (IsLogin && GameType == 'beating' && MemberWinFlag) {
            setTimeout(function() {
                    stamp.alpha = 1;
                    stamp.anims.play('stamping');
                    // stamp.on('animationcomplete', function() {
                    //     showBoardMessageModal();
                    // }, this);
                }, 400)
                // } else if (GameType == 'ranking') {
                //     setTimeout(function() {
                //         showBoardMessageModal(); // 跳出上榜留言框
                //     }, 400)
                // }
        }
        leaveBtn = this.scorebannerGroup.create(game.config.width / 2 - 75, game.config.height / 2 + 120, 'cancleBtn', 0);
        leaveBtn.setInteractive().on('pointerdown', function() {
            restartBtn.input.enabled = false;
            btnClick(this, leaveBtn);
            quitGame();
        }, this);
        restartBtn = this.scorebannerGroup.create(game.config.width / 2 + 70, game.config.height / 2 + 120, 'restartBtn', 0);
        restartBtn.setInteractive().on('pointerdown', function() {
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
        //     login = this.add.sprite(game.config.width / 2 + 130, game.config.height / 2 - 110, 'login')
        //     login.setInteractive().on('pointerdown', function() {
        //         btnClick(this, login);
        //         window.location.replace('/member/login?redirect_url=/'); // 登入後跳轉到首頁
        //     }, this);
        // }
        // // 會員模式
        // else {
        //     // 過關賽
        //     if (GameType == 'beating') {
        //         bag = this.add.sprite(game.config.width / 2 + 130, game.config.height / 2 - 110, 'bag', 0);
        //         bag.setInteractive().on('pointerdown', function() {
        //             btnClick(this, bag);
        //             window.location.replace('/member/pocket'); // 連接到商城頁-背包
        //         }, this);
        //     }
        //     // 排行賽
        //     else if (GameType == 'ranking') {
        //         rank = this.add.sprite(game.config.width / 2 + 130, game.config.height / 2 - 110, 'rank', 0);
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
    width: 600,
    height: 900,
    scale: {
        // 自動調整寬度和高度，保持寬高比，覆蓋全部區域，可能會超出_ENVELOP (FIT:可能會有未覆蓋)
        mode: Phaser.Scale.FIT,
        // 畫布水平、垂直居中
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
    physics: {
        default: 'arcade',
        // arcade: { debug: true }
    },
    autoRound: false,
    scene: [boot, load, menu, story, play, over]
};

game = new Phaser.Game(config);

/********************************************/

// startData 回傳成功
// function successStartData() {
//     step = parseInt(GameParameters.step);
//     multiple = parseInt(GameParameters.multiple);
//     fieldSize = parseInt(GameParameters.fieldSize);
//     fieldColors = parseInt(GameParameters.fieldColors);
//     requireType = parseInt(GameParameters.requireType);
//     numA = parseInt(GameParameters.numA);
//     numB = parseInt(GameParameters.numB);
//     numC = parseInt(GameParameters.numC);

//     console.log('步數: ' + step);
//     console.log('分數倍數: ' + multiple);
//     console.log('方塊行/列數 (正方形): ' + fieldSize);
//     console.log('方塊種類: ' + fieldColors);
//     console.log('過關條件種類: ' + requireType);
//     console.log('過關條件數量A: ' + numA);
//     console.log('過關條件數量B: ' + numB);
//     console.log('過關條件數量C: ' + numC);

//     // scene[3] = story
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