// import {
//     // 變數
//     GameType,
//     IsLogin,
//     GatePassScore,
//     // ajax前置後置functions變數內容指定
//     SetNoEnoughPoints,
//     SetSuccessScoreData,
//     SetSuccessReBorn,
//     SetPrePurchaseProp,
//     SetSuccessPurchaseProp,
//     SetCompletePurchaseProp,
//     // 基礎流程functions
//     entranceData,
//     startData,
//     sendScore,
//     purchaseProp,
// } from '../../../../game/Model/connect_source';


import { game_GameParameters, game_PlayerID, game_PlayerSN, game_MemberPoint } from './TeachScene';
import { btnClick, PlayAudio, } from './Controller';

// 遊戲得分
export var score;
// 驗證字串
var PlayHistories = '';
// 驗證_基本次數
var historiesA;
// 驗證_加分次數
var historiesB;
// 倒數進入遊戲時間
var entryTime = 3;
// 道具時間進度條位置
var barX = 550;
var barY = 320;
// 道具時間進度條寬度
var barWidth = 160;
// 總選取道具數量
var totalChoosed = 0;
// 後端已成功購買數量
var successBuy = 0;

// 水平速度
var horizontalSpeed = 4.1;
// 跳躍力
var jumpForce = 16;
// 得分基數(一次多少分)
var baseScore = 1;
// 加分倍率
var buffRate = 2;
// 可使用道具模式(0:關閉，1:開啟)
var propMode = 1;
// 初始生命值
var life = 3;
// 道具費用
var propCostA = 10;
var propCostB = 20;
var propCostC = 30;
var propCost = [propCostA,propCostB,propCostC];
// 道具持續時間_毫秒
var propTimeA = 10000;
var propTimeB = 8000;


/************************ 遊 戲 說 明 【夏祭金魚之旅】 **************************/
// 碰到安全牆壁 + 基本分數
// placestar()隨機生成星星 吃到 + 基本分數

// propMode道具模式開啟時
// 道具一：propTimeA秒內分數二倍
// 道具二：propTimeB秒內防護罩
// 道具三：多一顆生命

// 驗證機制
// PlayHistories 字串 => 基本分數 + 基本次數 + 基本分數 + 加分次數 + 加分倍率 (皆為三位數)
/*************************************************************************/

export default class PlayScene extends Phaser.Scene {
    constructor() {
        super('play')
    }

    init() {
        // horizontalSpeed = parseInt(game_GameParameters.horizontalSpeed);
        // horizontalSpeed = parseInt(game_GameParameters.horizontalSpeed);
        // jumpForce = parseInt(game_GameParameters.jumpForce);
        // buffRate = parseInt(game_GameParameters.buffRate);
        // propMode = parseInt(game_GameParameters.propMode);
        // life = parseInt(game_GameParameters.life);
        // propCostA = parseInt(game_GameParameters.propCostA);
        // propCostB = parseInt(game_GameParameters.propCostB);
        // propCostC = parseInt(game_GameParameters.propCostC);
        // propCost = [propCostA, propCostB, propCostC]
        // propTimeA = parseInt(game_GameParameters.propTimeA);
        // propTimeB = parseInt(game_GameParameters.propTimeB);

        // console.log('水平速度: ' + horizontalSpeed)
        // console.log('跳躍力 ' + jumpForce)
        // console.log('得分基數: ' + baseScore)
        // console.log('加分倍率(道具A) ' + buffRate)
        // console.log('可使用道具模式 ' + propMode)
        // console.log('初始生命值 ' + life)
        // console.log('道具費用(道具A): ' + propCostA)
        // console.log('道具費用(道具B): ' + propCostB)
        // console.log('道具費用(道具C): ' + propCostC)
        // console.log('道具費用: ' + propCost)
        // console.log('道具持續時間A ' + propTimeA)
        // console.log('道具持續時間B ' + propTimeB)

        // 綁定connect.js功能
        // SetSuccessScoreData(successScoreData);
        // SetNoEnoughPoints(noEnoughPoints, this);
        // SetSuccessPurchaseProp(successPurchaseProp, this);

        this.gameIsStart = false
        entryTime = 3 // 倒數進入時間

        score = 0;
        PlayHistories = '';
        historiesA = 0;
        historiesB = 0;
        totalChoosed = 0;
        successBuy = 0;

        this.totalCost = 0;
        this.scoreInc = baseScore;
    }

    create() {
        this.scene.bringToTop();
        this.background = this.add.sprite(0, 0, 'background').setOrigin(0);

        // if (!IsLogin) {
        //     this.gameBoot();
        // } else {
        var fontStyle = { font: '16px ', fill: '#000' };
        // this.add.text(240, game.config.height - 320, 'ID: ' + game_PlayerID, fontStyle).setDepth(1);
        // this.add.text(game.config.width - 240, game.config.height - 320, 'SN: ' + game_PlayerSN, fontStyle).setOrigin(1, 0).setDepth(1);

        if (propMode) {
            this.createBuyProp();
        } else {
            this.gameBoot();
        }
        // }
    }

    update() {
        if (this.gameIsStart) {
            this.bg_water.tilePositionX += 1;

            if (this.shelter != undefined) {
                this.shelter.setPosition(this.fish.x, this.fish.y);
            }

            if (this.propBar != undefined) {
                this.propBar.clear();
                this.propBar.fillStyle(0xFFFADC);
                this.propBar.fillRect(barX, barY, barWidth - barWidth * this.propTimer.getProgress(), 8);
            }

            if (this.tap != undefined && this.tap.visible == false) {
                this.fish.setVelocity((this.fish.body.velocity.x > 0) ? horizontalSpeed : -horizontalSpeed, this.fish.body.velocity.y);
            }
        }
    }

    // 新增道具購買框
    createBuyProp() {
        this.bigCover = this.add.sprite(game.config.width / 2, game.config.height / 2, 'cover').setScale(1.6);

        this.propContainer = this.add.container(game.config.width / 2, game.config.height / 2).setDepth(1);
        this.propBanner = this.add.sprite(0, 0, 'propBanner');
        this.O2pointText = this.add.bitmapText(50, 30, 'BMFont', game_MemberPoint, 18);
        this.costText = this.add.bitmapText(50, 95, 'BMFont', this.totalCost, 18);
        var okBtn = this.add.sprite(0, 210, 'okBtn', 0)
            .setInteractive().on('pointerdown', function() {
                if (this.costText.isTinted) { // 點數不足
                    var textContainer = this.add.container(game.config.width / 2 - 75, game.config.height / 2 + 130).setDepth(1);

                    var graphics = this.add.graphics()
                    graphics.fillStyle(0x000000, 0.6);
                    graphics.fillRoundedRect(0, 0, 150, 50, 10); // x, y, width, height, radius
                    textContainer.add(graphics)

                    var tipsText = this.add.bitmapText(20, 10, 'BMFont', '點數不足', 16)
                    textContainer.add(tipsText)

                    this.tweens.add({
                        targets: textContainer,
                        y: '-=80',
                        alpha: 0,
                        duration: 600,
                    });
                } else {
                    this.closeBuyProp()
                }
            }, this)
        this.propContainer.add([this.propBanner, this.O2pointText, this.costText, okBtn]);

        var posX = [-175, 0, 175]
        var posY = -80
        this.propArray = []
        for (var i = 0; i < posX.length; i++) {
            this.addProp(posX[i], posY, i)
        }

        var cirs = new Phaser.Geom.Circle(0, 0, 63);
        this.particles = this.make.particles({
            key: 'yellow',
            origin: { x: 0.5, y: 0.5 },
            add: true,
            emitters: [{
                    name: propCost[0], // 儲存所需費用
                    x: posX[0],
                    y: posY,
                    // speed: 8,
                    // lifespan: 1500,
                    // delay: 500,
                    // frequency: 0,
                    alpha: 0, // 預設不顯示
                    quantity: 2,
                    scale: { start: 0.15, end: 0.05 },
                    blendMode: 'ADD',
                    emitZone: { type: 'edge', source: cirs, quantity: 200 }
                },
                {
                    name: propCost[1],
                    x: posX[1],
                    y: posY,
                    alpha: 0,
                    quantity: 2,
                    scale: { start: 0.15, end: 0.05 },
                    blendMode: 'ADD',
                    emitZone: { type: 'edge', source: cirs, quantity: 200 }
                },
                {
                    name: propCost[2],
                    x: posX[2],
                    y: posY,
                    alpha: 0,
                    quantity: 2,
                    scale: { start: 0.15, end: 0.05 },
                    blendMode: 'ADD',
                    emitZone: { type: 'edge', source: cirs, quantity: 200 }
                }
            ]
        });
        this.propContainer.add(this.particles);
    }

    addProp(x, y, index) {
        var prop = this.add.sprite(x, y, 'prop', index)
            .setName(index)
            .setInteractive().on('pointerdown', function() {
                // 計算所需費用
                var cost = (this.particles.emitters.list[prop.name].alpha.propertyValue == 0) ?
                    parseInt(this.particles.emitters.list[prop.name].name) : -parseInt(this.particles.emitters.list[prop.name].name);
                this.totalCost += cost;
                this.costText.setText(this.totalCost);

                // 顯示/隱藏 道具選取動畫
                this.particles.emitters.list[prop.name].setAlpha((this.particles.emitters.list[prop.name].alpha.propertyValue == 0) ? 1 : 0);

                // 點數不足文字變色
                if (this.totalCost > game_MemberPoint) {
                    this.costText.setTint(0xFF0000);
                } else {
                    this.costText.clearTint();
                }
            }, this);

        this.propArray.push(prop);
        this.propContainer.add(prop);
    }

    closeBuyProp() {
        this.propChoosed = [];

        for (var i = 0; i < this.propArray.length; i++) {
            var isClicked = this.particles.emitters.list[i].alpha.propertyValue == 0 ? false : true;
            this.propChoosed.push(isClicked);

            if (this.propChoosed[i] == true) {
                totalChoosed += 1;
            }
        }

        // if (totalChoosed == 0) {
        this.propContainer.destroy();
        this.bigCover.destroy();
        this.gameBoot();
        // } else {
        //     for (var i = 0; i < this.propChoosed.length; i++) {
        //         if (this.propChoosed[i] == true) {
        //             switch (i) {
        //                 case 0:
        //                     purchaseProp('propCostA');
        //                     break;
        //                 case 1:
        //                     purchaseProp('propCostB');
        //                     break;
        //                 case 2:
        //                     purchaseProp('propCostC');
        //                     break;
        //             }
        //         }
        //     }
        // }
    }

    // 遊戲準備
    gameBoot() {
        this.background.setInteractive().on('pointerdown', function() {
            this.background.disableInteractive();
            this.tap.setVisible(false)
            this.cameras.main.zoomTo(1.6, 400)
                .on('camerazoomcomplete', function(camera) {
                    this.countDown();
                }, this);
        }, this);

        this.bg_water = this.add.tileSprite(game.config.width / 2, game.config.height / 2, 600, 900, 'bg_water');
        this.scoreText = this.add.bitmapText(game.config.width / 2, 400, 'BMFont', '0', 40).setOrigin(0.5).setAlpha(0.8);

        this.tap = this.add.sprite(game.config.width / 2, game.config.height / 2 + 80, 'tap');

        this.anims.create({
            key: 'swimming',
            frames: this.anims.generateFrameNumbers('fish', { start: 0, end: 1 }),
            frameRate: 6,
            repeat: -1,
        });
        this.fish = this.matter.add.sprite(310, 550, 'fish')
            .setName('fish')
            .setFixedRotation()
            .setIgnoreGravity(true)

        this.createWall();
        this.createStar();

        if ( /*IsLogin &&*/ propMode) {
            this.propSetting();
        } else {
            this.createLive(life);
        }

        this.matter.world.on('collisionstart', function(e, b1, b2) {
            // console.log(b1.label + ' / ' + b2.label)
            if (b1.label == 'leftWall' || b2.label == 'leftWall') {
                this.handleWallCollision('leftWall', b1, b2);
            }
            if (b1.label == 'rightWall' || b2.label == 'rightWall') {
                this.handleWallCollision('rightWall', b1, b2);
            }
            if (b1.label == 'topWall' || b2.label == 'topWall') {
                this.handleWallCollision('topWall', b1, b2);
            }
            if (b1.label == 'downWall' || b2.label == 'downWall') {
                this.handleWallCollision('downWall', b1, b2);
            }

            if (b1.label == 'star' || b2.label == 'star') {
                this.updateScore();
                this.placestar();
            }
        }, this);
    }

    countDown() {
        this.cover = this.add.sprite(game.config.width / 2, game.config.height / 2, 'cover');

        this.anims.create({
            key: 'waiting',
            frames: this.anims.generateFrameNumbers('waiting', { start: 0, end: 59 }),
            duration: 3000,
            hideOnComplete: true
        });
        PlayAudio(this, 'waitingSE', 1);
        var waiting = this.add.sprite(game.config.width / 2, game.config.height / 2, 'waiting');
        waiting.anims.play('waiting');

        //倒數三秒開始遊戲
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
    }

    gameStart() {
        this.gameIsStart = true;

        this.bg_water.setInteractive();
        this.bg_water.on('pointerdown', function() {
            this.jump();
        }, this)

        this.fish.play('swimming');
        this.fish.setVelocity(horizontalSpeed, 0);
        this.fish.setIgnoreGravity(false);

        if (this.propTimer != undefined) {
            this.propTimer.paused = false;
        }
        if (this.shelterTimer != undefined) {
            this.shelterTimer.paused = false;
        }
    }

    // 新增牆壁(邊界)
    createWall() {
        this.leftWalls = [];
        this.rightWalls = [];

        for (var i = 0; i < 4; i++) {
            this.leftWalls[i] = this.addSideWall(i, 'leftWall');
            this.rightWalls[i] = this.addSideWall(i, 'rightWall');
        }

        this.addTopDownWall('topWall');
        this.addTopDownWall('downWall');
    }

    // 新增加分星星
    createStar() {
        this.star = this.matter.add.image(0, 0, "star");
        this.star.setCircle();
        this.star.setStatic(true);
        this.star.body.isSensor = true;
        this.star.body.label = "star";

        this.placestar();
    }

    addTopDownWall(side) {
        var wallX = 180;
        var wallY = (side == 'topWall') ? 270 : 1140;
        var wallFrame = (side == 'topWall') ? 0 : 1;

        var wall = this.matter.add.image(wallX, wallY, 'border', wallFrame);
        wall.setName('danger');
        wall.setStatic(true);
        wall.body.label = side;

        if (side == 'topWall') {
            wall.setPosition(wall.body.position.x + wall.body.centerOffset.x, wall.body.position.y + wall.body.centerOffset.y);
        } else {
            wall.setPosition(wall.body.position.x + wall.body.centerOffset.x, wall.body.position.y + wall.body.centerOffset.y);
        }
    }

    addSideWall(index, side) {
        var wallTexture = this.textures.get('wall');

        var wallFlipX = (side == 'leftWall') ? false : true;
        var wallX = (side == 'leftWall') ? game.config.width / 2 - 250 : game.config.width / 2 + 250;
        var wallY = 300 + index * wallTexture.frames[0].height;

        var wall = this.matter.add.image(wallX, wallY, 'wall');
        wall.setName('safe');
        wall.setFlipX(wallFlipX);
        wall.setStatic(true);
        wall.body.label = side;

        if (side == 'leftWall') {
            wall.setPosition(wall.body.position.x - wall.body.centerOffset.x, wall.body.position.y + wall.body.centerOffset.y);
        } else {
            wall.setPosition(wall.body.position.x + wall.body.centerOffset.x, wall.body.position.y + wall.body.centerOffset.y);
        }

        return wall;
    }

    propSetting() {
        if (this.propChoosed[0] == true) {
            this.scoreInc = baseScore * buffRate;
            this.propIcon = this.add.graphics();
            this.propIcon.lineStyle(2, 0xFFFADC, 1);
            this.propIcon.strokeCircle(barX - 30, barY + 5, 15);
            this.buffRateText = this.add.text(barX - 30, barY + 5, 'x' + buffRate, { font: '14px ', color: '#FFFADC', strokeThickness: 1 });
            this.buffRateText.setOrigin(0.5)

            this.propBar = this.add.graphics();
            this.propBar.fillStyle(0xFFFADC, 1);
            this.propBar.fillRect(barX, barY, barWidth, 8);

            this.propTimer = this.time.addEvent({
                delay: propTimeA,
                paused: true,
                callbackScope: this,
                callback: function() {
                    this.scoreInc = baseScore;
                    this.propIcon.destroy();
                    this.buffRateText.destroy();
                },
            })
        }

        if (this.propChoosed[1] == true) {
            this.shelter = this.add.sprite(this.fish.x, this.fish.y, 'shelter');
            this.shelterTimer = this.time.addEvent({
                delay: propTimeB,
                paused: true,
                callbackScope: this,
                callback: function() {
                    if (this.shelter != undefined) {
                        this.shelter.destroy();
                        this.shelter = undefined;
                    }
                },
            })
        }

        if (this.propChoosed[2] == true) {
            this.createLive(4);
        } else {
            this.createLive(life);
        }
    }

    createLive(num) {
        this.liveArray = []
        for (var i = 0; i < num; i++) {
            var heart = this.add.sprite(260 + i * 40, 330, 'heart').setName('heart' + i);
            this.liveArray.push(heart);
        }
    }

    placestar() {
        this.star.x = Phaser.Math.Between(game.config.width / 2 - 220, game.config.width / 2 + 220);
        this.star.y = Phaser.Math.Between(game.config.height / 2 - 350, game.config.height / 2 + 350);
    }

    handleWallCollision(side, bodyA, bodyB) {
        if (bodyA.gameObject.name == 'danger' || bodyB.gameObject.name == 'danger') {
            PlayAudio(this, 'dangerSE');

            if (this.shelter != undefined) {
                this.hurtWithShelter(side)
            } else {
                if (side == 'topWall' || side == 'downWall') {
                    this.hurt('y')
                } else if (side == 'leftWall' || side == 'rightWall') {
                    this.hurt('x')
                }
            }
        } else {
            PlayAudio(this, 'safeSE');
            this.updateScore();

            // 設置魚的反作用力 / 翻轉
            this.fish.setVelocityX((side == 'leftWall') ? horizontalSpeed : -horizontalSpeed);
            this.fish.setVelocityY(this.fish.body.velocity.y);
            this.fish.setFlipX((side == 'leftWall') ? false : true);

            this.paintWalls((side == 'leftWall') ? this.rightWalls : this.leftWalls);
        }
    }

    // 隨機牆壁顏色
    paintWalls(walls) {
        // 先隨機出危險的牆壁種類
        walls.forEach(function(wall) {
            var randFrame = Phaser.Math.Between(1, 3);
            wall.setFrame(randFrame);
            wall.setName('danger');
        });

        // 選出1~2格改成安全的牆壁
        var safeNum = Phaser.Math.Between(1, 2)
        for (var i = 0; i < safeNum; i++) {
            var safeWall = Phaser.Math.RND.pick(walls);
            safeWall.setFrame(0);
            safeWall.setName('safe')
        }
    }

    jump() {
        PlayAudio(this, 'jumpSE', 0.4);

        this.fish.setVelocity((this.fish.body.velocity.x > 0) ? horizontalSpeed : -horizontalSpeed, -jumpForce);

        var particles2 = this.add.particles('bubble');
        particles2.createEmitter({
            speed: 50,
            gravityY: -300,
            lifespan: 4000,
            maxParticles: 8,
            scale: { start: 0.1, end: 0.5 },
            follow: this.fish,
            followOffset: {
                x: 55,
                y: -10
            },
        });
    }

    hurtWithShelter(side) {
        var flashBlood = this.add.sprite(game.config.width / 2, game.config.height / 2, 'warning');
        this.tweens.add({
            targets: flashBlood,
            alpha: 0,
            duration: 500,
        });

        this.shelter.destroy();
        this.shelter = undefined;

        if (side == 'topWall' || side == 'downWall') {
            this.fish.setVelocityY((side == 'topWall') ? 0 : -jumpForce);
        } else if (side == 'leftWall' || side == 'rightWall') {
            this.fish.setVelocityX((side == 'leftWall') ? horizontalSpeed : -horizontalSpeed);
            this.fish.setVelocityY(this.fish.body.velocity.y);
            this.fish.setFlipX((side == 'leftWall') ? false : true);
        }

        this.paintWalls((this.fish.flipX == false) ? this.rightWalls : this.leftWalls);
    }

    hurt(direction) {
        var flashBlood = this.add.sprite(game.config.width / 2, game.config.height / 2, 'warning');
        this.tweens.add({
            targets: flashBlood,
            alpha: 0,
            duration: 500,
        });

        this.liveArray.pop().setTint(0x000);

        if (this.liveArray.length <= 0) {
            this.fish.destroy();
            this.gameOver();
        } else {
            this.resetFish(direction)
            this.resetWall(this.leftWalls)
            this.resetWall(this.rightWalls)
        }
    }

    resetFish(direction) {
        this.bg_water.disableInteractive();

        if (!this.gameIsStart) return

        this.placestar();
        this.fish.setPosition(310, 550).setFlipX(false).setIgnoreGravity(true);

        if (direction == 'x') {
            this.fish.setVelocityX(this.fish.body.velocity.x)
        } else {
            this.fish.setVelocityX(0)
        }
        if (direction == 'y') {
            this.fish.setVelocityY(this.fish.body.velocity.y)
        } else {
            this.fish.setVelocityY(0)
        }

        this.tap.setVisible(true)

        this.time.addEvent({
            delay: 1000,
            callbackScope: this,
            callback: function() {
                this.bg_water.setInteractive();
                this.bg_water.on('pointerdown', function() {
                    if (this.tap.visible == true) {
                        this.fish.setMass(0.5)
                        this.fish.setDensity(0.001)

                        this.fish.setVelocity(horizontalSpeed, 0)
                        this.fish.setIgnoreGravity(false)
                        this.tap.setVisible(false)
                    }
                }, this);
            },
        }, this);
    }

    resetWall(walls) {
        walls.forEach(function(wall) {
            wall.setFrame(0);
            wall.setName('safe')

        });
    }

    updateScore() {
        score += this.scoreInc;
        this.scoreText.setText(score);

        if (this.scoreInc == baseScore) {
            historiesA += 1;
        } else {
            historiesA += 2;
        }
    }

    gameOver() {
        this.gameIsStart = false;

        for (var i = 0; i < game.sound.sounds.length; i++) {
            if (game.sound.sounds[i].key = 'bgmSE') {
                this.tweens.add({
                    targets: game.sound.sounds[i],
                    volume: 0,
                    duration: 2000
                });
            }
        }

        this.cover = this.add.sprite(game.config.width / 2, game.config.height / 2, 'cover');
        this.bg_water.disableInteractive();

        // 驗證
        var A = baseScore.toString().padStart(3, '0');
        var B = buffRate.toString().padStart(3, '0');
        var C = historiesA.toString().padStart(3, '0');
        var D = historiesB.toString().padStart(3, '0');
        PlayHistories = A + C + A + D + B;
        // console.log('PlayHistories: ' + PlayHistories)

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
            delay: 500,
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

// sendScore 回傳成功
// function successScoreData() {
//     // console.log('successScoreData')
//     setTimeout(function() {
//         // scene[4] = play
//         // game.scene.scenes[4] = this 
//         // += scene.start(' ');
//         game.scene.scenes[4].scene.start('over');
//     }, 1500);
// }

// purchaseProp 回傳點數不足
// function noEnoughPoints() {
//     // console.log('noEnoughPoints')
//     // console.log(this)

//     var graphics = this.add.graphics()
//     graphics.fillStyle(0x000000, 0.6);
//     graphics.fillRoundedRect(0, 0, 150, 50, 10); // x, y, width, height, radius
//     textContainer.add(graphics)

//     var tipsText = this.add.bitmapText(20, 10, 'BMFont', '點數不足', 16)
//     textContainer.add(tipsText)

//     this.tweens.add({
//         targets: textContainer,
//         y: '-=80',
//         alpha: 0,
//         duration: 600,
//     });
// }

// purchaseProp 回傳成功
// function successPurchaseProp() {
//     // console.log('successPurchaseProp')
//     // console.log('這裡的this = scene')

//     successBuy += 1;
//     if (successBuy == totalChoosed) {
//         this.propContainer.destroy();
//         this.bigCover.destroy();
//         this.gameBoot();
//     }
// }