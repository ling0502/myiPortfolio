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
var gameIsOver;

// 遊戲時間
var timer = 30;
// 時間模式(預設0: 關閉，1: 開啟)
var timeMode = 0;
// 消除後是否填滿版面(預設0: 不填滿，1: 填滿)
var fillup = 0;

// 方塊列數
var rows = 10;
// 方塊行數
var columns = 20;
// 方塊種類(固定後端不能改 Min: 1，Max: 5)
var items = 4;

// 方塊數量隨機生成(預設1: 自動隨機，0: 數量限制)
var numAutoRandom = 1;
// 方塊數量(越平均難度越高，autoRandom = 0才有功能)
var numA;
var numB = 0;
var numC = 0;
var numD = 0;
var num = [];

// 方塊大小
var gemSize = 45;
// 方塊版面內縮
var boardOffset = { x: 30, y: 105 };
// 方塊移動速度
var fallSpeed = 75;
var slideSpeed = 180;
// 分數放大倍率
var multiple = 9;

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

/****************** 遊 戲 說 明 【消消樂】 **************************/

// 計分 : n x (n-1) x multiple ( n = 消除方塊數量，multiple = 定義倍數)
// 加分 : bonus()
// 計分模式 / 時間模式 (timeMode = 1)
// 一般模式 / 填滿模式 (fillup = 1 -> 時間模式要開不然會無限玩)

// 驗證機制
// PlayHistories 字串 => 一次取兩位數 = n
// ( n x (n-1) ... 全部相加之後  +  bonusA + bonusB ) x multiple 倍數(後台的參數之一)

/*******************************************************************/

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

        this.load.image('cover', '../Mark/cover02.png'); // 黑色底圖
        this.load.spritesheet('stamp', '../Mark/stamp.png', { frameWidth: 150, frameHeight: 150 }); // 通關章
        this.load.spritesheet('saving', '../Mark/saving.png', { frameWidth: 300, frameHeight: 300 }); // 分數儲存中

        this.load.image('logo', './assets/logo.png');
        this.load.image('menu', './assets/menu.png');
        this.load.image('background', './assets/background.png');
        this.load.image('story', './assets/story.png');
        this.load.image('teach', './assets/teach.png');
        this.load.image('timercontainer', './assets/timercontainer.png');
        this.load.image('timerInner', './assets/timerInner.png');
        this.load.image('timerclock', './assets/timerclock.png');
        // 方塊組
        this.load.spritesheet('gems', './assets/gems.png', { frameWidth: gemSize, frameHeight: gemSize });
        // 碎片特效
        this.load.spritesheet('dot', './assets/dot.png', { frameWidth: 10, frameHeight: 10 });
        // 通關特效
        this.load.spritesheet('clear', './assets/clear.png', { frameWidth: 450, frameHeight: 450 });
        // 失敗特效
        this.load.spritesheet('fail', './assets/fail.png', { frameWidth: 451, frameHeight: 450 });

        this.load.image('banner', './assets/banner.png');
        this.load.image('costbanner', './assets/costbanner.png');
        this.load.image('freebanner', './assets/freebanner.png');
        this.load.image('tipsbanner', './assets/tipsbanner.png');
        this.load.image('scorebanner', './assets/scorebanner.png');

        this.load.spritesheet('playBtn', './assets/playBtn.png', { frameWidth: 180, frameHeight: 85 });
        this.load.spritesheet('startBtn', './assets/startBtn.png', { frameWidth: 125, frameHeight: 60 });
        this.load.spritesheet('cancleBtn', './assets/cancleBtn.png', { frameWidth: 125, frameHeight: 60 });
        this.load.spritesheet('restartBtn', './assets/restartBtn.png', { frameWidth: 125, frameHeight: 60 });
        this.load.spritesheet('storeBtn', './assets/storeBtn.png', { frameWidth: 125, frameHeight: 60 });
        this.load.spritesheet('bagBtn', './assets/bagBtn.png', { frameWidth: 125, frameHeight: 60 });
        this.load.spritesheet('okBtn', './assets/okBtn.png', { frameWidth: 125, frameHeight: 60 });
        this.load.spritesheet('LINEshare', './assets/LINEshare.png', { frameWidth: 40, frameHeight: 40 });
        this.load.spritesheet('FBshare', './assets/FBshare.png', { frameWidth: 40, frameHeight: 40 });
        this.load.spritesheet('login', './assets/login.png', { frameWidth: 115, frameHeight: 55 });
        this.load.spritesheet('rank', './assets/rank.png', { frameWidth: 115, frameHeight: 55 });
        this.load.spritesheet('bag', './assets/bag.png', { frameWidth: 115, frameHeight: 55 });

        this.load.bitmapFont('BMFont_White', '../Font/BMFont_White.png', '../Font/BMFont_White.fnt');
        this.load.bitmapFont('BMFont_Black', '../Font/BMFont_Black.png', '../Font/BMFont_Black.fnt');

        this.load.audio('bgmSE', './assets/audio/bgm.mp3');
        this.load.audio('storySE', './assets/audio/story.mp3');
        this.load.audio('clickSE', './assets/audio/click.mp3');
        this.load.audio('correctSE', './assets/audio/correct.mp3');
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
        PlayHistories = '';
        this.passedTime = 0;
        gameIsOver = false;

        this.currentTime = timer;
        this.canPick = true;
    }
    create() {
        this.tweens.add({
            targets: soundStory,
            volume: 0,
            duration: 1000
        });
        soundBgm = this.sound.add('bgmSE', { loop: -1 });
        soundWin = this.sound.add('winSE');
        soundFail = this.sound.add('failSE');

        this.add.image(0, 0, 'background').setOrigin(0);

        soundBgm.play();

        // this.add.text(12, 10, 'ID: ' + PlayerID, { font: '16px ', fill: '#444' });
        // this.add.text(10, 25, 'SN: ' + PlayerSN, { font: '16px ', fill: '#444' });

        this.add.bitmapText(game.config.width - 310, 20, 'BMFont_White', 'ＳＣＯＲＥ：', 16);
        this.scoreText = this.add.bitmapText(game.config.width - 160, 20, 'BMFont_White', score, 16);

        this.sameGame = new SameGame({
            rows: rows,
            columns: columns,
            items: items
        });
        this.createBoard();
        this.drawField();
        if (timeMode) {
            this.createTimerbar();
        }

        this.timerEvents = this.time.addEvent({
            delay: 1000,
            callback: function() {
                this.updateCounter();
            },
            callbackScope: this,
            loop: true
        });

        this.input.on('pointerdown', this.tileSelect, this);
    }

    createBoard() {
        do {
            this.sameGame.generateBoard();
        } while (this.sameGame.stillPlayable(2) !== true);
    }

    createTimerbar() {
        this.timerContainer = this.add.sprite(240, 20, 'timercontainer').setOrigin(0);
        this.timerInner = this.add.sprite(this.timerContainer.x + 10, this.timerContainer.y + 28, 'timerInner').setOrigin(0);
        this.timerclock = this.add.sprite(225, 60, 'timerclock');

        this.timerMask = this.add.sprite(this.timerInner.x, this.timerInner.y, 'timerInner').setOrigin(0);
        this.timerMask.visible = false;
        this.timerInner.mask = new Phaser.Display.Masks.BitmapMask(this, this.timerMask);
    }

    updateCounter() {
        // 一般模式
        this.passedTime++;
        // 時間模式
        if (timeMode) {
            if (this.currentTime <= 3) {
                this.tweens.add({
                    targets: this.timerclock,
                    rotation: 0.5,
                    duration: 120,
                    yoyo: true,
                    repeat: 3,
                    ease: 'Bounce.InOut'
                })
            }
            console.log(this.timerMask.x)
            this.currentTime--;
            this.stepWidth = this.timerInner.width / timer;
            this.timerMask.x -= this.stepWidth;

            // 死亡
            if (this.currentTime < 0.5) {
                this.canPick = false;
                this.endOfMove();
            }
        }
    }

    drawField() {
        this.poolArray = [];

        for (var i = 0; i < this.sameGame.getRows(); i++) {
            for (var j = 0; j < this.sameGame.getColumns(); j++) {
                var gemX = boardOffset.x + gemSize * j + gemSize / 2;
                var gemY = boardOffset.y + gemSize * i + gemSize / 2;
                var gem = this.add.sprite(gemX, gemY, 'gems', this.sameGame.getValueAt(i, j));
                this.sameGame.setCustomData(i, j, gem);
            }
        }
    }

    tileSelect(pointer) {
        if (this.canPick) {
            var row = Math.floor((pointer.y - boardOffset.y) / gemSize);
            var col = Math.floor((pointer.x - boardOffset.x) / gemSize);

            if (this.sameGame.validPick(row, col) && !this.sameGame.isEmpty(row, col)) {
                var connectedItems = this.sameGame.countConnectedItems(row, col);
                if (connectedItems > 1) {
                    PlayAudio(this, 'correctSE');
                    // 計分
                    score += (connectedItems * (connectedItems - 1) * multiple);
                    PlayHistories += connectedItems.toString().padStart(3, '0');

                    // 時間模式
                    if (timeMode) {
                        if (this.timerMask.x < this.timerInner.x) {
                            this.currentTime += 0.5;
                            this.timerMask.x += this.stepWidth / 2;
                        }
                    }
                    this.scoreTween();
                    this.canPick = false;
                    var gemsToRemove = this.sameGame.listConnectedItems(row, col);
                    var x = pointer.x;
                    var y = pointer.y - 80;
                    this.emitter(x, y, 0, 1000, 20).explode();

                    var destroyed = 0;
                    gemsToRemove.forEach(function(gem) {
                        destroyed++;
                        this.poolArray.push(this.sameGame.getCustomDataAt(gem.row, gem.column));
                        this.tweens.add({
                            targets: this.sameGame.getCustomDataAt(gem.row, gem.column),
                            scale: { from: 0.65, to: 1.2 },
                            // rotation: '+=2',
                            alpha: 0,
                            duration: 200,
                            callbackScope: this,
                            onComplete: function() {
                                destroyed--;
                                if (destroyed == 0) {
                                    this.sameGame.removeConnectedItems(row, col);
                                    if (fillup) {
                                        this.makeGemsFillup();
                                    } else {
                                        this.makeGemsFall();
                                    }
                                }
                            },
                        });
                    }.bind(this));
                }
            }
        }
    }

    scoreTween() {
        if (score) {
            this.pointsTween = this.tweens.addCounter({
                to: score,
                duration: 200,
                onUpdateScope: this,
                onCompleteScope: this,
                onUpdate: function() {
                    this.scoreText.setText(Math.floor(this.pointsTween.getValue()));
                },
            });
        }
    }

    makeGemsFillup() {
        var fallingGems = 0;
        var movements = this.sameGame.arrangeBoard();
        movements.forEach(function(movement) {
            fallingGems++;
            this.tweens.add({
                targets: this.sameGame.getCustomDataAt(movement.row, movement.column),
                y: this.sameGame.getCustomDataAt(movement.row, movement.column).y + gemSize * movement.deltaRow,
                duration: fallSpeed * movement.deltaRow,
                callbackScope: this,
                onComplete: function() {
                    fallingGems--;
                    if (fallingGems == 0) {
                        this.endOfMove();
                    }
                }
            })
        }.bind(this));
        var fillupMovements = this.sameGame.fillupBoard();
        fillupMovements.forEach(function(movement) {
            fallingGems++;
            var sprite = this.poolArray.pop();
            sprite.alpha = 1;
            sprite.y = boardOffset.y + gemSize * (movement.row - movement.deltaRow + 1) - gemSize / 2;
            sprite.x = boardOffset.x + gemSize * movement.column + gemSize / 2;
            sprite.setFrame(this.sameGame.getValueAt(movement.row, movement.column));
            this.sameGame.setCustomData(movement.row, movement.column, sprite);
            this.tweens.add({
                targets: sprite,
                y: boardOffset.y + gemSize * movement.row + gemSize / 2,
                scale: 1,
                duration: fallSpeed * movement.deltaRow,
                callbackScope: this,
                onComplete: function() {
                    fallingGems--;
                    if (fallingGems == 0) {
                        this.endOfMove();
                    }
                }
            });
        }.bind(this));
    }

    makeGemsFall() {
        var movements = this.sameGame.arrangeBoard();
        var fallingGems = 0;
        if (movements.length == 0) {
            this.makeGemsSlide();
        } else {
            movements.forEach(function(movement) {
                fallingGems++;
                this.tweens.add({
                    targets: this.sameGame.getCustomDataAt(movement.row, movement.column),
                    y: this.sameGame.getCustomDataAt(movement.row, movement.column).y + gemSize * movement.deltaRow,
                    duration: fallSpeed * movement.deltaRow,
                    callbackScope: this,
                    onComplete: function() {
                        fallingGems--;
                        if (fallingGems == 0) {
                            this.makeGemsSlide();
                        }
                    }
                })
            }.bind(this));
        }
    }

    makeGemsSlide() {
        var slideMovements = this.sameGame.compactBoardToLeft();
        if (slideMovements.length == 0) {
            this.endOfMove();
        } else {
            var movingGems = 0;
            slideMovements.forEach(function(movement) {
                movingGems++;
                this.tweens.add({
                    targets: this.sameGame.getCustomDataAt(movement.row, movement.column),
                    x: this.sameGame.getCustomDataAt(movement.row, movement.column).x + gemSize * movement.deltaColumn,
                    duration: Math.abs(slideSpeed * movement.deltaColumn),
                    ease: 'Bounce.easeOut',
                    callbackScope: this,
                    onComplete: function() {
                        movingGems--;
                        if (movingGems == 0) {
                            this.endOfMove();
                        }
                    }
                });
            }.bind(this));
        }
    }

    endOfMove() {
        if (!gameIsOver) {
            // 時間模式
            if (timeMode) {
                if (this.currentTime >= 0.5 && this.sameGame.stillPlayable(2)) {
                    this.canPick = true;
                } else {
                    gameIsOver = true;
                    this.add.sprite(0, 0, 'cover').setOrigin(0);
                    this.canPick = false;
                    this.timerEvents.remove();
                    this.animationEvent(300);
                }
            }
            // 一般模式
            else {
                if (this.sameGame.stillPlayable(2)) {
                    this.canPick = true;
                } else {
                    gameIsOver = true;
                    this.add.sprite(0, 0, 'cover').setOrigin(0);
                    this.canPick = false;
                    this.timerEvents.remove();

                    var nonEmpty = 0;
                    var aniDelay = 300;
                    for (var j = this.sameGame.getColumns() - 1; j >= 0; j--) {
                        for (var i = 0; i < this.sameGame.getRows(); i++) {
                            if (!this.sameGame.isEmpty(i, j)) {
                                var x = j * gemSize + boardOffset.x;
                                var y = i * gemSize + boardOffset.x;
                                if (nonEmpty < 5) {
                                    aniDelay = 500 * nonEmpty;
                                    this.emitter(x, y, aniDelay, 1000, 6).explode();
                                } else {
                                    aniDelay = 500 * 5;
                                    this.emitter(x, y, aniDelay, 1000, 1.5).explode();
                                }
                                nonEmpty += 1;
                                for (var k = 0; k < nonEmpty; k++) {
                                    this.tweens.add({
                                        targets: this.sameGame.getCustomDataAt(i, j),
                                        duration: 100,
                                        alpha: 0,
                                        delay: aniDelay
                                    }, this);
                                }
                            }
                        }
                    }
                    this.animationEvent(aniDelay);
                }
            }
        }
    }
    animationEvent(delay) {
        this.time.addEvent({
            delay: delay * 1.3,
            callbackScope: this,
            callback: function() {
                this.tweens.add({
                    targets: soundBgm,
                    volume: 0,
                    duration: 2000
                });

                if (this.sameGame.nonEmptyItems() == 0) {
                    this.gameClear();
                } else {
                    this.gameFail();
                }
            }
        });

        this.time.addEvent({
            delay: delay,
            callbackScope: this,
            callback: function() {
                this.bonus();
            }
        });
        this.time.addEvent({
            delay: delay * 4,
            callbackScope: this,
            callback: function() {
                if (this.sameGame.nonEmptyItems() == 0) {
                    this.soundTargets = soundWin;
                } else {
                    this.soundTargets = soundFail;
                }
                this.tweens.add({
                    targets: this.soundTargets,
                    volume: 0,
                    duration: 100
                });
                this.gameOver();
            }
        });
    }
    gameClear() {
        soundWin.play();
        this.anims.create({
            key: 'clear',
            frames: this.anims.generateFrameNumbers('clear', { start: 0, end: 3 }),
            duration: 800,
            hideOnComplete: true,
            repeat: -1
        });
        this.add.sprite(game.config.width / 2, game.config.height / 2, 'clear').play('clear');
    }
    gameFail() {
        soundFail.play();
        this.anims.create({
            key: 'fail',
            frames: this.anims.generateFrameNumbers('fail', { start: 0, end: 3 }),
            duration: 800,
            hideOnComplete: true,
            repeat: -1
        });
        this.overSprite = this.add.sprite(game.config.width / 2, -200, 'fail').play('fail');
        this.tweens.add({
            targets: this.overSprite,
            y: game.config.height / 2,
            duration: 1000,
            ease: 'Bounce.easeOut',
        });
    }
    gameOver() {
        // 傳送分數
        // sendScore(score, PlayHistories);
        this.scene.start('over');
    }

    emitter(x, y, delay, gravityY, quantity) {
        var dot = this.add.particles('dot').createEmitter({
            frame: [0, 1, 2, 3],
            x: x,
            y: y,
            speed: { min: -300, max: 600 },
            alpha: { start: 0, end: 1, ease: 'Expo.easeOut' },
            delay: delay,
            gravityY: gravityY,
            lifespan: 600,
            quantity: quantity
        });
        return dot;
    }

    bonus() {
        var bonusA;
        var bonusB;
        // 方塊bonus +分
        if (this.sameGame.nonEmptyItems() == 0) {
            bonusA = 1500;
            // console.log('全消+' + bonusA);
        } else if (this.sameGame.nonEmptyItems() > 0 && this.sameGame.nonEmptyItems() <= 3) {
            bonusA = 1000;
            // console.log('~3+' + bonusA);
        } else if (this.sameGame.nonEmptyItems() > 3 && this.sameGame.nonEmptyItems() <= 8) {
            bonusA = 300;
            // console.log('~8+' + bonusA);
        } else if (this.sameGame.nonEmptyItems() > 8 && this.sameGame.nonEmptyItems() <= 15) {
            bonusA = 100;
            // console.log('~15+' + bonusA);
        } else {
            bonusA = 0;
            // console.log('超過bonusA顆數');
        }
        // 隱藏的 時間bonus +分
        if (!timeMode) {
            if (this.passedTime <= 20) {
                bonusB = 1000;
                // console.log('小於A+' + bonusB);
            } else if (this.passedTime > 20 && this.passedTime <= 25) {
                bonusB = 300;
                // console.log('小於B+' + bonusB);
            } else if (this.passedTime > 25 && this.passedTime <= 40) {
                bonusB = 100;
                // console.log('小於C+' + bonusB);
            } else {
                bonusB = 0;
                // console.log('超過bonusB時間');
            }
        }
        //如果是時間模式就不存在
        else {
            bonusB = 0;
        }

        score = score + (bonusA + bonusB) * multiple;
        PlayHistories += bonusA.toString().padStart(4, '0');
        PlayHistories += bonusB.toString().padStart(4, '0');
        this.scoreTween();
    }
}

class SameGame {
    constructor(obj) {
        this.rows = obj.rows;
        this.columns = obj.columns;
        this.items = obj.items;
    }

    // generates the game board
    generateBoard() {
        this.gameArray = [];

        //檢查方塊數量
        // var A = 0;
        // var B = 0;
        // var C = 0;
        // var D = 0;

        var idx = 0;
        var totalNum = this.rows * this.columns;

        // 生成方塊數量陣列(numAutoRandom==0)
        var randomArray = [];
        for (var i = 0; i < this.items; i++) {
            for (var j = 0; j < num[i]; j++) {
                randomArray.push(i);
            }
        }

        for (var i = 0; i < this.rows; i++) {
            this.gameArray[i] = [];
            for (var j = 0; j < this.columns; j++) {
                if (numAutoRandom == 0) {
                    var randomValue = Math.floor(Math.random() * (totalNum - idx));
                    this.gameArray[i][j] = {
                        value: randomArray[randomValue],
                        isEmpty: false,
                        row: i,
                        column: j
                    }
                } else {
                    var randomValue = Math.floor(Math.random() * this.items);
                    this.gameArray[i][j] = {
                        value: randomValue,
                        isEmpty: false,
                        row: i,
                        column: j
                    }
                }
                idx++;

                // if (randomArray[randomValue] === undefined) {
                //     A++;
                //     console.log('方塊數量有誤');
                // } else {
                //     if (randomArray[randomValue] == 0) {
                //         A++;
                //     }
                //     else if (randomArray[randomValue] == 1) {
                //         B++;
                //     }
                //     else if (randomArray[randomValue] == 2) {
                //         C++;
                //     }
                //     else if (randomArray[randomValue] == 3) {
                //         D++;
                //     }
                // }

                // 被選過的以當前陣列最後一個值替代 (避免重複選)
                randomArray[randomValue] = randomArray[totalNum - idx]
            }
        }
        // console.log('idx= ' + idx);
        // console.log('A= ' + A);
        // console.log('B= ' + B);
        // console.log('C= ' + C);
        // console.log('D= ' + D);
    }

    // returns the number of board rows
    getRows() {
        return this.rows;
    }

    // returns the number of board columns
    getColumns() {
        return this.columns;
    }

    // returns true if the item at (row, column) is empty
    isEmpty(row, column) {
        return this.gameArray[row][column].isEmpty;
    }

    // returns the value of the item at (row, column), or false if it's not a valid pick
    getValueAt(row, column) {
        if (!this.validPick(row, column)) {
            return false;
        }
        return this.gameArray[row][column].value;
    }

    // returns the custom data of the item at (row, column)
    getCustomDataAt(row, column) {
        return this.gameArray[row][column].customData;
    }

    // 有效選擇 returns true if the item at (row, column) is a valid pick
    validPick(row, column) {
        return row >= 0 && row < this.rows && column >= 0 && column < this.columns && this.gameArray[row] != undefined && this.gameArray[row][column] != undefined;
    }

    // sets a custom data on the item at (row, column)
    setCustomData(row, column, customData) {
        this.gameArray[row][column].customData = customData;
    }

    // returns an object with all connected items starting at (row, column)
    listConnectedItems(row, column) {
        if (!this.validPick(row, column) || this.gameArray[row][column].isEmpty) {
            return;
        }
        this.colorToLookFor = this.gameArray[row][column].value;
        this.floodFillArray = [];
        this.floodFillArray.length = 0;
        this.floodFill(row, column);
        return this.floodFillArray;
    }

    // returns the number of connected items starting at (row, column)
    countConnectedItems(row, column) {
        return this.listConnectedItems(row, column).length;
    }

    // removes all connected items starting at (row, column)
    removeConnectedItems(row, column) {
        var items = this.listConnectedItems(row, column);
        items.forEach(function(item) {
            this.gameArray[item.row][item.column].isEmpty = true;
        }.bind(this))
    }

    // returs true if in the board there is at least a move with a minimum minCombo items
    stillPlayable(minCombo) {
        for (var i = 0; i < this.getRows(); i++) {
            for (var j = 0; j < this.getColumns(); j++) {
                if (!this.isEmpty(i, j) && this.countConnectedItems(i, j) >= minCombo) {
                    return true;
                }
            }
        }
        return false;
    }

    // returns the amount of non empty items on the board
    nonEmptyItems(minCombo) {
        var result = 0;
        for (var i = 0; i < this.getRows(); i++) {
            for (var j = 0; j < this.getColumns(); j++) {
                if (!this.isEmpty(i, j)) {
                    result++;
                }
            }
        }
        return result;
    }

    // flood fill routine
    // http:// www.emanueleferonato.com/2008/06/06/flash-flood-fill-implementation/
    floodFill(row, column) {
        if (!this.validPick(row, column) || this.isEmpty(row, column)) {
            return;
        }
        if (this.gameArray[row][column].value == this.colorToLookFor && !this.alreadyVisited(row, column)) {
            this.floodFillArray.push({
                row: row,
                column: column
            });
            this.floodFill(row + 1, column);
            this.floodFill(row - 1, column);
            this.floodFill(row, column + 1);
            this.floodFill(row, column - 1);
        }
    }

    // 安排 arranges the board, making items fall down. Returns an object with movement information
    arrangeBoard() {
        var result = []
        for (var i = this.getRows() - 2; i >= 0; i--) {
            for (var j = 0; j < this.getColumns(); j++) {
                var emptySpaces = this.emptySpacesBelow(i, j);
                if (!this.isEmpty(i, j) && emptySpaces > 0) {
                    this.swapItems(i, j, i + emptySpaces, j)
                    result.push({
                        row: i + emptySpaces,
                        column: j,
                        deltaRow: emptySpaces
                    });
                }
            }
        }
        return result;
    }

    // checks if a column is completely empty
    isEmptyColumn(column) {
        return this.emptySpacesBelow(-1, column) == this.getRows();
    }

    // counts empty columns to the left of column
    countLeftEmptyColumns(column) {
        var result = 0;
        for (var i = column - 1; i >= 0; i--) {
            if (this.isEmptyColumn(i)) {
                result++;
            }
        }
        return result;
    }

    // 壓緊 compacts the board to the left and returns an object with movement information
    compactBoardToLeft() {
        var result = [];
        for (var i = 1; i < this.getColumns(); i++) {
            if (!this.isEmptyColumn(i)) {
                var emptySpaces = this.countLeftEmptyColumns(i);
                if (emptySpaces > 0) {
                    for (var j = 0; j < this.getRows(); j++) {
                        if (!this.isEmpty(j, i)) {
                            this.swapItems(j, i, j, i - emptySpaces)
                            result.push({
                                row: j,
                                column: i - emptySpaces,
                                deltaColumn: -emptySpaces
                            });
                        }
                    }
                }
            }
        }
        return result;
    }

    // fillup the board and returns an object with movement information
    fillupBoard() {
        var result = [];
        for (var i = 0; i < this.getColumns(); i++) {
            if (this.isEmpty(0, i)) {
                var emptySpaces = this.emptySpacesBelow(0, i) + 1;
                for (var j = 0; j < emptySpaces; j++) {
                    var randomValue = Math.floor(Math.random() * this.items);
                    result.push({
                        row: j,
                        column: i,
                        deltaRow: emptySpaces
                    });
                    this.gameArray[j][i].value = randomValue;
                    this.gameArray[j][i].isEmpty = false;
                }
            }
        }
        return result;
    }

    // returns the amount of empty spaces below the item at (row, column)
    emptySpacesBelow(row, column) {
        var result = 0;
        if (row != this.getRows()) {
            for (var i = row + 1; i < this.getRows(); i++) {
                if (this.isEmpty(i, column)) {
                    result++;
                }
            }
        }
        return result;
    }

    // swap the items at (row, column) and (row2, column2)
    swapItems(row, column, row2, column2) {
        var tempObject = Object.assign(this.gameArray[row][column]);
        this.gameArray[row][column] = Object.assign(this.gameArray[row2][column2]);
        this.gameArray[row2][column2] = Object.assign(tempObject);
    }

    // returns true if (row, column) is already in floodFillArray array
    alreadyVisited(row, column) {
        var found = false;
        this.floodFillArray.forEach(function(item) {
            if (item.row == row && item.column == column) {
                found = true;
            }
        });
        return found;
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
            y: 150,
            duration: 1000,
            ease: 'Bounce.Out'
        });
        playBtn = this.add.sprite(game.config.width / 2, game.config.height / 2 + 100, 'playBtn', 0);
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
    //     var GameCostPointText = GameCostPoint.toString(); // 原型態(number)=0 的時候bitmapText無法顯示
    //     var MemberPointText = MemberPoint.toString(); // 原型態(number)=0 的時候bitmapText無法顯示

    //     if (MemberFreeTimes > 0) {
    //         boardGroup.create(this.add.sprite(game.config.width / 2, game.config.height / 2 + 70, 'freebanner'));
    //         boardGroup.create(this.add.bitmapText(game.config.width / 2 + 65, game.config.height / 2 + 90, 'BMFont_White', MemberFreeTimes, 18));
    //     } else {
    //         boardGroup.create(this.add.sprite(game.config.width / 2, game.config.height / 2 + 70, 'costbanner'));
    //         boardGroup.create(this.add.bitmapText(game.config.width / 2 + 20, game.config.height / 2 + 70, 'BMFont_White', GameCostPointText, 26).setOrigin(1));
    //         boardGroup.create(this.add.bitmapText(game.config.width / 2 + 30, game.config.height / 2 + 92, 'BMFont_White', MemberPointText, 16));
    //     }

    //     cancleBtn = this.add.sprite(game.config.width / 2 - 75, game.config.height / 2 + 170, 'cancleBtn', 0);
    //     boardGroup.add(cancleBtn);
    //     cancleBtn.setInteractive().on('pointerdown', function() {
    //         btnClick(this, cancleBtn);
    //         startBtn.input.enabled = false;
    //         quitGame();
    //     }, this);
    //     startBtn = this.add.sprite(game.config.width / 2 + 75, game.config.height / 2 + 170, 'startBtn', 0);
    //     boardGroup.add(startBtn);
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
    //                 tipsGroup.create(game.config.width / 2, game.config.height / 2 + 70, 'tipsbanner');
    //                 var backBtn = tipsGroup.create(game.config.width / 2 - 75, game.config.height / 2 + 170, 'cancleBtn', 0);
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

    //                 var storeBtn = tipsGroup.create(game.config.width / 2 + 75, game.config.height / 2 + 170, 'storeBtn', 0);
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
        soundStory = this.sound.add('storySE');
        soundStory.play();
        var waitForStart = false;

        this.teach = this.add.sprite(0, 0, 'teach').setOrigin(0);
        this.story = this.add.sprite(0, 0, 'story').setOrigin(0);

        this.story.setInteractive().on('pointerdown', function() {
            PlayAudio(this, 'clickSE');
            this.story.destroy(true);
        }, this);
        this.teach.setInteractive().on('pointerdown', function() {
            PlayAudio(this, 'clickSE');
            if (!waitForStart) {
                waitForStart = true;

                // ajax取得遊戲參數
                // startData();
                this.scene.start('play');
            }
        }, this);
    }
}

// 結束 / 成績結算介面
class over extends Phaser.Scene {
    constructor() {
        super('over');
    }

    create() {
        this.add.sprite(0, 0, 'menu').setOrigin(0);
        // this.add.text(12, 10, 'ID: ' + PlayerID, { font: '16px ', fill: '#444' });
        // this.add.text(10, 25, 'SN: ' + PlayerSN, { font: '16px ', fill: '#444' });

        score = score.toString(); // 原型態(number)=0 的時候bitmapText無法顯示
        this.scorebannerGroup = this.add.group();
        this.scorebannerGroup.create(game.config.width / 2, game.config.height / 2, 'scorebanner');
        this.add.bitmapText(game.config.width / 2, game.config.height / 2, 'BMFont_Black', score, 24).setOrigin(0.5);

        var stamp = this.add.sprite(game.config.width / 2 - 170, game.config.height / 2 - 140, 'stamp');
        stamp.alpha = 0;
        this.anims.create({
            key: 'stamping',
            frames: this.anims.generateFrameNumbers('stamp', { start: 0, end: 8 }),
            frameRate: 12,
        });
        // if (IsLogin && GameType == 'beating' && MemberWinFlag) {
            setTimeout(function() {
                stamp.alpha = 1;
                stamp.anims.play('stamping');
        //         stamp.on('animationcomplete', function() {
        //             showBoardMessageModal();
        //         }, this);
            }, 400)
        // } else if (GameType == 'ranking') {
        //     setTimeout(function() {
        //         showBoardMessageModal(); // 跳出上榜留言框
        //     }, 400)
        // }

        leaveBtn = this.scorebannerGroup.create(game.config.width / 2 - 75, game.config.height / 2 + 100, 'cancleBtn', 0);
        leaveBtn.setInteractive().on('pointerdown', function() {
            restartBtn.input.enabled = false;
            btnClick(this, leaveBtn);
            quitGame();
        }, this);
        restartBtn = this.scorebannerGroup.create(game.config.width / 2 + 75, game.config.height / 2 + 100, 'restartBtn', 0);
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
        //     login = this.add.sprite(game.config.width / 2 + 100, game.config.height / 2 - 105, 'login')
        //     login.setInteractive().on('pointerdown', function() {
        //         btnClick(this, login);
        //         window.location.replace('/member/login?redirect_url=/'); // 登入後跳轉到首頁
        //     }, this);
        // }
        // // 會員模式
        // else {
        //     // 過關賽
        //     if (GameType == 'beating') {
        //         bag = this.add.sprite(game.config.width / 2 + 100, game.config.height / 2 - 105, 'bag', 0);
        //         bag.setInteractive().on('pointerdown', function() {
        //             btnClick(this, bag);
        //             window.location.replace('/member/pocket'); //連接到商城頁-背包
        //         }, this);
        //     }
        //     // 排行賽
        //     else if (GameType == 'ranking') {
        //         rank = this.add.sprite(game.config.width / 2 + 100, game.config.height / 2 - 105, 'rank', 0);
        //         rank.setInteractive().on('pointerdown', function() {
        //             btnClick(this, rank);
        //             showBoardDialog();
        //         }, this);
        //     }
        // }
    }
}

var config = {
    // type: Phaser.AUTO,
    parent: 'game',
    width: 960,
    height: 640,
    scale: {
        // 自動調整寬度和高度，保持寬高比，覆蓋全部區域，可能會超出_ENVELOP (FIT:可能會有未覆蓋)
        mode: Phaser.Scale.FIT,
        // 畫布水平、垂直居中
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
    autoRound: false,
    scene: [boot, load, menu, story, play, over]
};

game = new Phaser.Game(config);

/********************************************/

// startData 回傳成功
// function successStartData() {
//     timer = parseInt(GameParameters.timer);
//     timeMode = parseInt(GameParameters.timeMode);
//     rows = parseInt(GameParameters.rows);
//     columns = parseInt(GameParameters.columns);
//     fillup = parseInt(GameParameters.fillup);
//     multiple = parseInt(GameParameters.multiple);
//     numAutoRandom = parseInt(GameParameters.numAutoRandom);
//     numB = parseInt(GameParameters.numB);
//     numC = parseInt(GameParameters.numC);
//     numD = parseInt(GameParameters.numD);

//     numA = rows * columns - numB - numC - numD;
//     num = [numA, numB, numC, numD];

//     console.log('遊戲時間: ' + timer);
//     console.log('時間模式: ' + timeMode);
//     console.log('方塊列數: ' + rows);
//     console.log('方塊行數: ' + columns);
//     console.log('消除後是否填滿版面: ' + fillup);
//     console.log('分數放大倍率: ' + multiple);
//     console.log('方塊數量隨機生成: ' + numAutoRandom);
//     console.log('B方塊數量 ' + numB);
//     console.log('C方塊數量 ' + numC);
//     console.log('D方塊數量 ' + numD);

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