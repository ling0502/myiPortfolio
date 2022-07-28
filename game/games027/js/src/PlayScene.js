// import {
//     // 變數
//     GameType,
//     IsLogin,
//     GatePassScore,
//     // ajax前置後置functions變數內容指定
//     SetNoEnoughPoints,
//     SetSuccessScoreData,
//     SetSuccessReBorn,
//     // 基礎流程functions
//     entranceData,
//     startData,
//     sendScore,
//     reBorn,
// } from '../../../../game/Model/connect_source';


// import { game_GameParameters, game_PlayerID, game_PlayerSN, } from './TeachScene';
import { btnClick, PlayAudio, } from './Controller';

export var score;
// 驗證字串
var PlayHistories = '';
// 驗證_基本次數
var historiesA;
// 驗證_加分次數
var historiesB;
// 倒數進入遊戲時間
var entryTime;
// 兩甜點之間距離
var eachDistance = 80

// 遊戲時間
var time = 30;
// 甜點下降速度(時間_毫秒)
var fallDuration = 3200;
// 復活花費O2point
var reborn_o2point = 30;
// 復活秒數(timeMode = 1 才有用)
var propTime = 10;
// 得分基數(一次多少分)
var baseScore = 2;
// 加分基數(連續加速三次多少分)
var buffScore = 5;
// 時間模式(0:關閉，1:開啟)
var timeMode = 0;
// 可使用道具模式(0:關閉，1:開啟) _ 此遊戲為扣點復活
var propMode = 0;


/************************ 遊 戲 說 明 【美食同樂會】 **************************/
// this.dessertsContainer = 轉盤精靈組
// this.dessertsArray = 同轉盤精靈用來控制雙擊交換後內容
// this.fallingContainer  = 下降精靈組

// 隱藏功能(長按可加速)
// 連續加速三次 : 加分為buffScore

// 驗證機制(步數)
// PlayHistories 字串 => 基本分數 + 基本次數 + 加分分數 + 加分次數 (皆為三位數)
/*************************************************************************/

export default class PlayScene extends Phaser.Scene {
    constructor() {
        super('play')
    }

    init() {
        // console.log('------PlayScene')

        // time = game_GameParameters.time;
        // fallDuration = game_GameParameters.fallDuration
        // reborn_o2point = game_GameParameters.reborn_o2point
        // propTime = game_GameParameters.propTime
        // baseScore = parseInt(game_GameParameters.baseScore);
        // buffScore = parseInt(game_GameParameters.buffScore);
        // timeMode = game_GameParameters.timeMode;
        // propMode = game_GameParameters.propMode;

        // console.log('遊戲時間(秒): ' + time)
        // console.log('甜點下降速度(時間_毫秒): ' + fallDuration)
        // console.log('復活花費: ' + reborn_o2point)
        // console.log('復活秒數: ' + propTime)
        // console.log('得分基數 ' + typeof baseScore + baseScore)
        // console.log('加分基數 ' + typeof buffScore + buffScore)
        // console.log('時間模式 ' + timeMode)
        // console.log('道具模式 ' + propMode)

        // 綁定connect.js功能
        // SetSuccessScoreData(successScoreData);
        // SetNoEnoughPoints(noEnoughPoints, this);
        // SetSuccessReBorn(successReBorn, this);

        this.speedUpTimes = 0 // 連續加速次數
        this.quicked = false // 當前下降甜點組是否加速過
        this.relived = false // 已經使用過復活(propMode = 1 才有用)
        this.gamesIsOver = false

        entryTime = 3 // 倒數進入時間

        this.currentTime = time
        this.lastDownTime = 0; // 最後一次點下時間(判斷長按用)

        score = 0;
        PlayHistories = '';
        historiesA = 0;
        historiesB = 0;
    }

    create() {
        this.scene.bringToTop();
        this.background = this.add.sprite(0, 0, 'background').setOrigin(0);

        // if (!IsLogin) {
        //     this.add.sprite(0, 0, 'mark').setOrigin(0).setTint(0x8E8E8E);
        // } else {
        //     this.add.text(12, game.config.height - 45, 'ID: ' + game_PlayerID, { font: '16px ', fill: '#000' });
        //     this.add.text(10, game.config.height - 25, 'SN: ' + game_PlayerSN, { font: '16px ', fill: '#000' });
        // }

        this.scoreText = this.add.bitmapText(75, 50, 'BMFont', score, 20).setOrigin(0.5);
        if (timeMode == 1) {
            this.currentTime = this.currentTime.toString().padStart(2, '0');
            this.timeText = this.add.bitmapText(game.config.width - 100, 50, 'BMFont', '00：' + this.currentTime, 20).setOrigin(0.5);
        }
        this.cover = this.add.sprite(0, 0, 'cover').setOrigin(0).setDepth(1);

        this.anims.create({
            key: 'waiting',
            frames: this.anims.generateFrameNumbers('waiting', { start: 0, end: 59 }),
            duration: 3000,
            hideOnComplete: true
        });
        PlayAudio(this, 'waitingSE', 0.5);
        var waiting = this.add.sprite(game.config.width / 2, game.config.height / 2, 'waiting');
        waiting.depth = 1;
        waiting.anims.play('waiting');

        // 倒數三秒開始遊戲
        this.time.addEvent({
            delay: 1000,
            callback: function() {
                entryTime--;
                if (entryTime == 0) {
                    this.gameStart();
                    this.cover.destroy(true);
                }
            },
            callbackScope: this,
            repeat: 3
        });

        this.createDessert()
    }

    update() {
        if (this.gamesIsOver) return

        // 長按 = 加速功能
        if (this.input.activePointer.isDown && !this.inAction &&
            this.fallingContainer != undefined && this.fallingContainer.y >= 120 &&
            Date.now() - this.lastDownTime > 600) {
            this.quicked = true
            this.speedUpTimes += 1
                // console.log('長按' + this.speedUpTimes)
            this.inAction = true
            this.fallTween.timeScale = 5
            this.background.disableInteractive()
        };
    }

    // 新增點心精靈
    createDessert() {
        this.dessertsContainer = this.add.container(game.config.width / 2, 700);
        this.dessertsArray = []
            // 點心順序: 左上-右上-右下-左下
        this.dessertsPos = [
            { x: -eachDistance, y: -eachDistance },
            { x: eachDistance, y: -eachDistance },
            { x: eachDistance, y: eachDistance },
            { x: -eachDistance, y: eachDistance },
        ]

        for (var i = 0; i < 4; i++) {
            var dessert = this.add.sprite(this.dessertsPos[i].x, this.dessertsPos[i].y, 'desserts', i);
            this.dessertsContainer.add(dessert);
            this.dessertsArray.push(dessert);
        }
    }

    // 刷新時間
    updateCounter() {
        this.timerEvents = this.time.addEvent({
            delay: 1000,
            callback: function() {
                this.currentTime -= 1;
                this.currentTime = this.currentTime.toString().padStart(2, '0');
                this.timeText.setText('00：' + this.currentTime);

                if (this.currentTime <= 10) {
                    this.tweens.add({
                        targets: this.timeText,
                        scale: '+=0.1',
                        duration: 300,
                        yoyo: true,
                        repeat: 0
                    });
                }

                if (this.currentTime < 1) {
                    // console.log('時間到')
                    this.gameOver();
                }
            },
            callbackScope: this,
            loop: true
        });
    }

    // 遊戲開始
    gameStart() {
        // console.log('gameStart');

        // 背景燈泡閃爍
        var obj = this.add.sprite(0, 900, 'bulb').setOrigin(0, 1)
        var oldRand = undefined
        var oldValue = undefined

        this.tweens.addCounter({
            from: 100,
            to: 0,
            duration: 3000, //2400
            repeat: -1,
            onUpdate: function(tween) {
                const value = Math.floor(tween.getValue());
                if (value % 25 == 0 && oldValue != value) {
                    oldValue = value
                    var randValue = [
                        [210, 210, 255],
                        [255, 165, 255],
                        [255, 210, 165],
                        [210, 255, 255],
                    ]
                    do {
                        var rand = Phaser.Math.Between(0, randValue.length - 1)
                    } while (oldRand == rand)
                    oldRand = rand

                    obj.setTint(Phaser.Display.Color.GetColor(randValue[rand][0], randValue[rand][1], randValue[rand][2]));
                }
            }
        });


        this.soundBgm = this.sound.add('bgmSE', { loop: -1 });
        this.soundBgm.play();

        if (timeMode == 1) {
            this.updateCounter();
        }
        this.createFallingContainer()

        var downX, upX, downY, upY, threshold = 80;

        this.background.setInteractive();
        this.background.on('pointerdown', function(pointer) {
            // console.log('pointerdown ' + this.lastDownTime);
            if (this.background.input.enabled == false) return

            let clickDelay = Date.now() - this.lastDownTime;
            this.lastDownTime = Date.now();
            if (clickDelay < 250) {
                this.inAction = true
                this.lastDownTime = 0
                this.handleTap()
            } else {
                this.inAction = false
                downX = pointer.x;
                downY = pointer.y;
            }
        }, this);

        // 左右滑動
        this.background.on('pointerup', function(pointer) {
            if (this.background.input.enabled == false) return

            upX = pointer.x;
            upY = pointer.y;
            if (upX < downX - threshold) {
                // console.log('swipeleft');
                this.handleSwipe('left')
            } else if (upX > downX + threshold) {
                // console.log('swiperight');
                this.handleSwipe('right')
            } else if (upY < downY - threshold) {
                // console.log('swipeup');
                this.handleSwipe('left')
            } else if (upY > downY + threshold) {
                // console.log('swipedown');
                this.handleSwipe('right')
            }
        }, this)

    }

    // 顏色測試
    showFrame(frame) {
        // console.log(typeof frame)
        switch (frame) {
            case 0:
                // console.log('紅')
                break
            case 1:
                // console.log('綠')
                break
            case 2:
                // console.log('黃')
                break
            case 3:
                // console.log('黑')
                break
        }
    }

    createFallingContainer() {
        this.quicked = false
        this.fallingContainer = this.add.container(game.config.width / 2, -50); //-50  / 650-150

        var frameArray = [0, 1, 2, 3]

        for (var i = 0; i < 2; i++) {
            var posX
            if (i == 0) {
                posX = -eachDistance
            } else {
                posX = eachDistance
            }

            var rndFrame = Phaser.Math.Between(0, frameArray.length - 1);

            // console.log('createFallingContainer' + rndFrame)
            this.showFrame(frameArray[rndFrame])

            var fallingSprite = this.add.sprite(posX, 0, 'desserts', frameArray[rndFrame]);
            this.fallingContainer.add(fallingSprite);
            frameArray.splice(rndFrame, 1)
        }
        // console.log(frameArray)

        this.falling()
    }

    // 甜點下降動畫
    falling() {
        this.fallTween = this.tweens.add({
            targets: this.fallingContainer,
            y: 540,
            duration: fallDuration,
            callbackScope: this,
            onComplete: function(tween, targets) {
                if (this.quicked == false) {
                    this.speedUpTimes = 0
                }

                if (this.fallingContainer.list[0].frame.name == this.dessertsArray[0].frame.name &&
                    this.fallingContainer.list[1].frame.name == this.dessertsArray[1].frame.name) {
                    // console.log('match' + typeof this.fallTween.timeScale + this.fallTween.timeScale)
                    this.background.setInteractive()
                    PlayAudio(this, 'matchSE')
                    this.handleMatch()

                    if (this.speedUpTimes == 3) {
                        PlayAudio(this, 'bonusSE', 1.3);
                        var bonusText = this.add.bitmapText(game.config.width / 2, game.config.height / 2, 'BMFont_desserts', 'BONUS+' + buffScore, 30).setOrigin(0.5);
                        this.tweens.add({
                            targets: bonusText,
                            y: '-=20',
                            alpha: 0,
                            duration: 500,
                            hideOnComplete: true
                        }, this);

                        score += buffScore;
                        this.speedUpTimes = 0; // 每三次加分後重新計算
                        historiesB += 1;
                    } else {
                        PlayAudio(this, 'matchSE');
                        score += baseScore;
                        historiesA += 1;
                    }
                    this.scoreText.setText(score);
                } else {
                    // console.log('跟不上了吧')
                    this.background.disableInteractive();

                    this.gameOver();

                    this.backTween = this.tweens.add({
                        targets: this.fallingContainer,
                        y: -50,
                        duration: 300,
                    })
                }
            }
        }, this);
    }

    // 當符合轉盤甜點
    handleMatch() {
        this.fallingContainer.destroy()

        this.tweens.add({
            targets: [this.dessertsArray[0], this.dessertsArray[1]],
            scale: 1.1,
            duration: 200,
            ease: 'Bounce.InOut',
            yoyo: true
        })

        this.createFallingContainer()
    }

    // 雙擊 = 左右交換
    handleTap() {
        this.background.disableInteractive()

        // console.log('handleTap')
        this.showFrame(this.dessertsArray[0].frame.name)
        this.showFrame(this.dessertsArray[1].frame.name)

        var changeItem = 0
        var tweenRight = this.tweens.add({
            targets: this.dessertsArray[0],
            x: this.dessertsArray[0].x + eachDistance * 2,
            duration: 200,
            ease: 'Cubic.Out',
            callbackScope: this,
            onComplete: function(tween, targets) {
                changeItem += 1
                this.tempSprite(changeItem)
            },
        });
        var tweenLeft = this.tweens.add({
            targets: this.dessertsArray[1],
            x: this.dessertsArray[1].x - eachDistance * 2,
            duration: 200,
            ease: 'Cubic.Out',
            callbackScope: this,
            onComplete: function(tween, targets) {
                changeItem += 1
                this.tempSprite(changeItem)
            },
        });
    }

    tempSprite(num) {
        if (num != 2) return

        // console.log('tempSprite')
        var temp = this.dessertsArray[0];
        this.dessertsArray[0] = this.dessertsArray[1];
        this.dessertsArray[1] = temp;

        if (this.gamesIsOver) return
        this.background.setInteractive()
    }

    // 左/右旋轉
    handleSwipe(dir) {
        this.inAction = true
        this.background.disableInteractive()

        // 子元素反向旋轉 (避免容器旋轉時，甜點方向跟著轉)
        var childDeg = (dir == 'right') ? -90 : 90

        for (var i = 0; i < 4; i++) {
            this.add.tween({
                targets: this.dessertsArray[i],
                angle: childDeg,
                duration: 100,
            });
        }

        // 
        var degrees = (dir == 'right') ? 90 : -90
        var goalAngle = this.dessertsContainer.angle + degrees

        var rotateTween = this.tweens.add({
            targets: this.dessertsContainer,
            angle: goalAngle,
            duration: 200,
            ease: 'Cubic.Out',
            callbackScope: this,
            onComplete: function(tween, targets) {
                if (degrees == 90) {
                    Phaser.Utils.Array.RotateRight(this.dessertsArray)
                } else {
                    Phaser.Utils.Array.RotateLeft(this.dessertsArray)
                }

                this.dessertsContainer.angle = 0;

                for (var i = 0; i < 4; i++) {
                    this.dessertsArray[i].setPosition(this.dessertsPos[i].x, this.dessertsPos[i].y);
                    this.dessertsArray[i].setAngle(0);
                }

                if (this.gamesIsOver) return
                this.background.setInteractive()
            },
        }, this);
    }

    gameOver() {
        this.tweens.add({
            targets: this.soundBgm,
            volume: 0,
            duration: 2000
        });

        this.cover = this.add.sprite(0, 0, 'cover').setOrigin(0);
        this.gamesIsOver = true;
        this.fallTween.stop();
        this.fallingContainer.removeAll(true)
        this.background.disableInteractive();

        if (timeMode == 1) {
            this.timerEvents.remove();
        }

        // 驗證
        var A = baseScore.toString().padStart(3, '0');
        var B = buffScore.toString().padStart(3, '0');
        var C = historiesA.toString().padStart(3, '0');
        var D = historiesB.toString().padStart(3, '0');
        PlayHistories = A + B + C + D;
        // console.log('PlayHistories: ' + PlayHistories)

        // if (IsLogin && propMode == 1 && !this.relived) {
        //     // 若過關賽已達到目標，則不再顯示
        //     if (GameType == 'beating' && score >= GatePassScore) {
        //         this.tweenEndBoard()
        //         return
        //     }

        //     var boardContainer = this.add.container(game.config.width / 2, game.config.height / 2);
        //     var relivebanner = this.add.sprite(0, 0, 'relivebanner');
        //     var costText = this.add.bitmapText(0, 0, 'BMFont', reborn_o2point, 30).setOrigin(0.5).setTint(0xFF0000);
        //     var tipsText = this.add.bitmapText(0, 50, 'BMFont_desserts', '增加時間' + propTime + '秒', 18).setOrigin(0.5);
        //     var okBtn = this.add.sprite(70, 120, 'okBtn', 0);
        //     var noBtn = this.add.sprite(-75, 120, 'noBtn', 0);

        //     boardContainer.add([relivebanner, costText, okBtn, tipsText, noBtn]);

        //     if (timeMode == 0) {
        //         tipsText.setVisible(false)
        //     } else {
        //         tipsText.setVisible(true)
        //     }

        //     noBtn.setInteractive().on('pointerdown', function() {
        //         okBtn.input.enabled = false;
        //         btnClick(this, noBtn).on('complete', function() {
        //             this.tweenEndBoard()
        //         }, this);
        //         this.tweens.add({
        //             targets: boardContainer,
        //             alpha: 0,
        //             duration: 300,
        //         }, this);
        //     }, this);

        //     okBtn.setInteractive().on('pointerdown', function() {
        //         noBtn.input.enabled = false;
        //         btnClick(this, okBtn).on('complete', function() {
        //             reBorn()
        //         }, this);
        //         this.tweens.add({
        //             targets: boardContainer,
        //             alpha: 0,
        //             duration: 300,
        //         }, this);
        //     }, this);
        // } else {
        this.tweenEndBoard()
            // }
    }

    tweenEndBoard() {
        // console.log(typeof score + score)
        // console.log(typeof GatePassScore + GatePassScore)

        this.anims.create({
            key: 'saving',
            frames: this.anims.generateFrameNumbers('saving', { start: 0, end: 9 }),
            frameRate: 6,
            repeat: -1
        });

        // 會員 + 過關賽 + 通關
        var endType
            // if (IsLogin && GameType == 'beating' && score >= GatePassScore) {
            // PlayAudio(this, 'winSE');
            // endType = 'win';
            // } else {
        PlayAudio(this, 'failSE');
        endType = 'fail';
        // }

        this.anims.create({
            key: endType,
            frames: this.anims.generateFrameNumbers(endType, { start: 0, end: 4 }),
            frameRate: 8,
            repeat: -1
        });
        var endBoard = this.add.sprite(game.config.width / 2, 0, endType);
        endBoard.depth = 1;
        endBoard.play(endType);

        this.tweens.add({
            targets: endBoard,
            y: game.config.height / 2 - 50,
            duration: 1000,
            ease: 'Bounce.Out',
            callbackScope: this,
            onComplete: function(tween, targets) {
                this.time.addEvent({
                    delay: 800,
                    callback: function() {
                        var saving = this.add.sprite(game.config.width / 2, game.config.height / 2, 'saving');
                        saving.depth = 1
                        saving.setScale(0.5);
                        saving.anims.play('saving');

                        // 回傳分數
                        this.time.addEvent({
                            delay: 400,
                            callback: function() {
                                // sendScore(score, PlayHistories);
                                this.scene.start('over');
                            },
                            callbackScope: this,
                        });
                    },
                    callbackScope: this,
                });
            }
        });
    }
}

// sendScore 回傳成功
// function successScoreData() {
//     console.log('successScoreData')
//     setTimeout(function() {
//         // scene[4] = play
//         // game.scene.scenes[4] = this 
//         // += scene.start(' ');
//         game.scene.scenes[4].scene.start('over');
//     }, 1500);
// }

// reBorn 回傳點數不足
// function noEnoughPoints() {
//     console.log('noEnoughPoints' + game.config.width)
//     console.log(this)

//     var tipsContainer = this.add.container(game.config.width / 2, game.config.height / 2);
//     var tipsbanner = this.add.sprite(0, 0, 'tipsbanner');
//     var okBtn = this.add.sprite(0, 120, 'okBtn', 0);
//     tipsContainer.add([tipsbanner, okBtn])
//     okBtn.setInteractive().on('pointerdown', function() {
//         btnClick(this, okBtn);

//         this.tweens.add({
//             targets: tipsContainer,
//             alpha: 0,
//             duration: 300,
//             callbackScope: this,
//             onComplete: function(tween, targets) {
//                 this.tweenEndBoard();
//             }
//         }, this);
//     }, this);
// }

// reBorn 回傳成功
// function successReBorn() {
//     console.log('successReBorn')
//     console.log('這裡的this = scene')

//     this.cover.setVisible(false)
//     this.relived = true
//     this.gamesIsOver = false;
//     this.background.setInteractive();

//     this.createFallingContainer()

//     if (timeMode == 1) {
//         this.currentTime = propTime.toString().padStart(2, '0');
//         this.timeText.setText('00：' + this.currentTime);
//         this.updateCounter()
//     }
// }