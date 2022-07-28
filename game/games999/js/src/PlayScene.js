// import {
//     getLandData,
//     FarmerLands,
//     refreshDailyData,
//     PartnerCategoryData,
//     PartnerPicIndexData,
//     doPlantSeed,
//     doPlantSeedResult,
//     doHarvest,
//     HarvestResult,
//     useProp,
//     UsePropResult,
//     NextSec,
//     SetPreGetLandData,
//     SetSuccessGetLandData,
//     SetSuccessRefreshDailyData,
//     SetSuccessUseProp,
//     SetPreDoPlantSeed,
//     SetSuccessDoPlantSeed,
//     SetPreDoHarvest,
//     SetSuccessDoHarvest,
// } from '../../../js/farm_source.js'

import loadObjects from './loadObjects'

import land from "./objPool/land";
import character from "./objPool/character";

import { btnClick, showTipsText, rewardCollection, checkSpace, PlayAudio, showLoadingAnimation, searchPlantID, searchPropID } from './Controller';
import {
    getSeed_growSecLV2,
    getSeed_growSecLV3,
    getSeed_deadSec,
    getSeed_baseQTY,
    getSeed_rateQTY,
    getMemberLV,
    setMemberLand_cropStatus,
    setMemberLand_cropNeedSec,
    getMemberLand_cropNeedSec,
    getMemberLandOpened,
    setMemberLandOpened,
    getNewLand_limitLV,
    getMemberLand_cropStatus,
    getMemberTool,
    setMemberTool,
    getMemberSeed,
    setMemberSeed,
    setMemberTask,
    setMemberAchiev_manager,
    setMemberAchiev_grow,

    getNewLand_coinNum,
    getNewLand_O2pointNum,
    getFertilizerSec,
    getMemberExp,
    getNextExp,

} from './fakeSQL';

var waitFlag = 0
var dailyResetFlag = false
export default class PlayScene extends Phaser.Scene {
    constructor() {
        super('play')
    }

    preload() {
        this.load.spritesheet('land', './assets/land.png', { frameWidth: 160, frameHeight: 90 })
        this.load.spritesheet('wood', './assets/wood.png', { frameWidth: 60, frameHeight: 55 })

        this.load.spritesheet('host', './assets/host.png', { frameWidth: 100, frameHeight: 105 })
        this.load.spritesheet('player_N', './assets/player_N.png', { frameWidth: 100, frameHeight: 105 })
        this.load.spritesheet('player_SR', './assets/player_SR.png', { frameWidth: 100, frameHeight: 105 })
        this.load.spritesheet('player_SSR', './assets/player_SSR.png', { frameWidth: 100, frameHeight: 105 })
        this.load.spritesheet('shining', './assets/shining.png', { frameWidth: 100, frameHeight: 55 })
        this.load.spritesheet('emotion', './assets/emotion.png', { frameWidth: 30, frameHeight: 30 })

        this.load.image('land_seeds', './assets/land_seeds.png');
        this.load.spritesheet('land_seedsLV2', './assets/land_seedsLV2.png', { frameWidth: 90, frameHeight: 90 })
        this.load.spritesheet('land_seedsLV3', './assets/land_seedsLV3.png', { frameWidth: 90, frameHeight: 90 })
    }

    init() {
        // SetSuccessRefreshDailyData(successRefreshDailyData)

        this.scene.add('loadObjects', loadObjects, false)

        this.eachland = []
        this.canClickLand = true
        this.clickQuickBtn = false
        this.canDragBackground = true
        this.opened = getMemberLandOpened()
    }

    create() {
        this.time.addEvent({
            delay: 1000,
            callback: function() {
                // 遊戲中跨日刷新(待測試)
                var d = new Date();
                var nowTimeHour = d.getHours()
                var nowTimeMins = d.getMinutes()
                    // if (dailyResetFlag == false && nowTimeHour == 0 && nowTimeMins <= 3) {
                    //     refreshDailyData()
                    // }
                    // if (dailyResetFlag == true && nowTimeHour == 0 && nowTimeMins > 3) {
                    //     dailyResetFlag = false
                    // }


                for (var w = 0; w < this.opened; w++) {
                    if (this.eachland[w].status == undefined) continue
                    if (this.eachland[w].cropStatusSprite == undefined) continue

                    if (this.eachland[w].cropStatus == 0 || this.eachland[w].cropStatus == 1) {
                        var newSec = getMemberLand_cropNeedSec()[w]
                        newSec -= 1
                        this.eachland[w].needTime = newSec
                        setMemberLand_cropNeedSec(w, newSec)
                    }
                    // 如果顯示加速框的時候
                    if (this.eachland[w].landMode != undefined && this.eachland[w].landMode.type == 'Container') {
                        var hours = parseInt(this.eachland[w].needTime / 60 / 60)
                        var leftMins = this.eachland[w].needTime - (hours * 60 * 60)
                        var mins = parseInt(leftMins / 60)
                        var seconds = leftMins % 60
                        this.eachland[w].time.setText(hours + '時' + mins + '分' + seconds + '秒')
                        if (this.eachland[w].needTime == 0) {
                            this.eachland[w].hideLandMode()
                        }
                    }

                    if (this.eachland[w].cropStatusSprite.texture.key == 'land_seeds' && this.eachland[w].needTime == 0) {
                        // console.log('猜猜我是誰' + w + ': ' + getSeed_growSecLV3()[this.eachland[w].cropType])
                        this.eachland[w].needTime = getSeed_growSecLV3()[this.eachland[w].cropType]
                        setMemberLand_cropNeedSec(w, getSeed_growSecLV3()[this.eachland[w].cropType])
                        this.eachland[w].cropStatusSprite.setTexture('land_seedsLV2').setFrame(this.eachland[w].cropType)
                    } else if (this.eachland[w].cropStatusSprite.texture.key == 'land_seedsLV2' && this.eachland[w].needTime == 0) {
                        // console.log('該長大囉！' + w + ': ' + getSeed_deadSec()[this.eachland[w].cropType])
                        this.eachland[w].needTime = getSeed_deadSec()[this.eachland[w].cropType]
                        setMemberLand_cropNeedSec(w, getSeed_deadSec()[this.eachland[w].cropType])
                        this.eachland[w].cropStatusSprite.setTexture('land_seedsLV3').setFrame(this.eachland[w].cropType)
                        if (this.eachland[w].landMode != undefined) {
                            this.eachland[w].hideLandMode()
                        }
                    } else if (this.eachland[w].cropStatusSprite.texture.key == 'land_seedsLV3' && this.eachland[w].needTime == 0) {
                        // console.log('爛掉哭哭' + w)
                        this.eachland[w].clearLand();
                        this.eachland[w].setTexture('land').setFrame(2)

                    }
                }
            },
            callbackScope: this,
            loop: true
        })

        this.createWorkAnims()

        this.game.events.on('hidden', function() {
            // console.log('hidden');
            for (var i = 0; i < this.opened; i++) {
                if (this.eachland[i].landMode != undefined && this.eachland[i].landMode.type == 'Container') {
                    // 隱藏加速框
                    this.eachland[i].hideLandMode()
                }
            }
        }, this);

        // fakeSQL 不使用
        // this.game.events.on('visible', function() {
        //     console.log('visible');

        //     SetPreGetLandData(preGetLandData_inGame, this);
        //     SetSuccessGetLandData(successGetLandData_inGame, this);
        //     getLandData(true);
        // }, this);

        this.input.setTopOnly(true)

        var bg = this.add.sprite(-280, -300, 'background').setOrigin(0) // 600x900 放大1080x1620 -> 新錨點=有主畫面
        var cam = this.cameras.main.setBounds(-280, -300, bg.displayWidth, bg.displayHeight)
        this.cameras.main.setViewport(0, 0, 600, 900)

        this.input.on('pointermove', function(pointer) {
            if (!pointer.isDown || !this.canDragBackground) return

            // console.log('PlayScene - pointermove');

            cam.scrollX -= (pointer.x - pointer.prevPosition.x) / cam.zoom
            cam.scrollY -= (pointer.y - pointer.prevPosition.y) / cam.zoom

            this.events.emit('dragBG'); // 至UIScene接收
        }, this)

        this.input.on('pointerup', function(pointer) {
            this.events.emit('endDragBG'); // 至UIScene接收
        }, this)

        this.input.on('pointerup', function(pointer, gameObject) {
            if (this.canClickLand == false) return
            if (this.clickQuickBtn == true) return

            var num = 0;
            for (var i = 0; i < this.opened; i++) {
                const p = this.cameras.main.getWorldPoint(pointer.x, pointer.y);
                const px = p.x;
                const py = p.y;

                // 指標在任一土地內(選擇該塊土地)
                if (this.eachland[i].polygon.contains(px, py)) {
                    // 當選取種植 / 使用道具狀態
                    if (this.pointerWork) {
                        // 該土地已使用過道具無符號 = 顯示剩餘時間 & 剩餘土地消除提示符號
                        if (this.eachland[i].landMode == undefined) {
                            for (var k = 0; k < this.opened; k++) {
                                if (k == i) {
                                    this.hidePointerWork();
                                    this.canDragBackground = true

                                    if (this.eachland[k].status != undefined) {
                                        // console.log('已使用')
                                        this.onLandwithCrop(this.eachland[k], k)
                                    } else {
                                        // console.log('道具 - 沒有作物')
                                    }
                                    continue
                                }
                                this.eachland[k].hideLandMode();
                                // console.log('剩餘土地消除提示符號')
                            }
                        } // 種植 / 使用道具消除提示符號
                        else {
                            // console.log('紀錄土地狀態')
                            this.eachland[i].setLandStatus(this.eachland[i].landMode.texture.key);

                            var seedNum = getMemberSeed()[this.pointerWork.frame.name]
                            if (this.eachland[i].landMode.texture.key == 'land_seed' && seedNum > 0) {
                                // console.log('種植' + i)

                                // SetPreDoPlantSeed(preDoPlantSeed, this)
                                // SetSuccessDoPlantSeed(successDoPlantSeed, this.eachland[i])
                                // doPlantSeed(searchPlantID(this.pointerWork.frame.name), i)
                                successDoPlantSeed(this.eachland[i], this.pointerWork.frame.name)

                                setMemberTask(1, 1, true) // 回傳每日任務第1項(任務2)+1
                                setMemberAchiev_manager(this.pointerWork.frame.name, 1, true) // 回傳成就-經營次數+1
                                setMemberSeed(this.pointerWork.frame.name, -1, true)

                                if (seedNum == 1) {
                                    this.canDragBackground = true
                                    this.hidePointerWork();
                                    for (var x = 0; x < this.opened; x++) {
                                        this.eachland[x].hideLandMode();
                                        // console.log('當前選的種子數量歸0')
                                    }
                                    return
                                }
                            } else {
                                // console.log('使用道具')
                                PlayAudio(this, 'actionSE')

                                // SetSuccessUseProp(successUseProp, this)
                                // useProp(searchPropID(this.pointerWork.frame.name), i)

                                var toolNum = getMemberTool()[this.pointerWork.frame.name]
                                if (toolNum > 0) {
                                    setMemberTool(this.pointerWork.frame.name, -1, true)
                                }

                                // 設置使用道具動畫
                                var frame;
                                var doing;
                                var UsePropResult = {}; // fakeSQL用
                                switch (this.eachland[i].landMode.texture.key) {
                                    case 'land_dig':
                                        frame = 0
                                        doing = 'action_dig'
                                        setMemberAchiev_grow(6, 1, true) // 回傳成就-成長第6項+1
                                        break

                                    case 'land_water':
                                        frame = 3
                                        doing = 'action_water'
                                        setMemberTask(2, 1, true) // 回傳每日任務第2項(任務3)+1
                                        setMemberAchiev_grow(5, 1, true) // 回傳成就-成長第5項+1

                                        // faleSQL用
                                        UsePropResult = {
                                            location: i,
                                            add_harvest_num: Phaser.Math.Between(0, 1) == 0 ? true : false, // 觸發增加收成量flag
                                            harvest_num: this.eachland[i].harvestNum * getSeed_rateQTY()
                                        }
                                        successUseProp(this, UsePropResult)
                                        break

                                    case 'land_fertilizer':
                                        frame = 6
                                        doing = 'action_fertilizer'
                                        setMemberAchiev_grow(4, 1, true) // 回傳成就-成長第4項+1

                                        // --------------------- faleSQL用 ---------------------
                                        var reducedTime // 肥料可減少時間
                                        switch (this.pointerWork.frame.name) {
                                            case 2: // 初級肥料
                                                reducedTime = getFertilizerSec()[0]
                                                break
                                            case 3: // 中級肥料
                                                reducedTime = getFertilizerSec()[1]
                                                break
                                            case 4: // 高級肥料
                                                reducedTime = getFertilizerSec()[2]
                                                break
                                        }
                                        var newStage = 0 // 施肥後作物階段 : 0=階段一 / 1=階段二 / 2=階段三 / null = 無作物&枯萎
                                        var nextSec = 0
                                        if (getMemberLand_cropStatus()[i] == 0) {
                                            if (reducedTime - (this.eachland[i].needTime + getSeed_growSecLV3()[i]) >= 0) {
                                                newStage = 2
                                                nextSec = getSeed_deadSec()[i]
                                            } else if (reducedTime - this.eachland[i].needTime >= 0) {
                                                newStage = 1
                                                nextSec = getSeed_growSecLV3()[i] - (reducedTime - this.eachland[i].needTime)
                                            } else {
                                                newStage = 0
                                                nextSec = this.eachland[i].needTime - reducedTime
                                            }
                                        } else if (getMemberLand_cropStatus()[i] == 1) {
                                            if (reducedTime - this.eachland[i].needTime >= 0) {
                                                newStage = 2
                                                nextSec = getSeed_deadSec()[i]
                                            } else {
                                                newStage = 1
                                                nextSec = this.eachland[i].needTime - reducedTime
                                            }
                                        }
                                        var trigger = Phaser.Math.Between(0, 1) == 0 ? undefined : true
                                        var typeArray = ['player_N', 'player_SR', 'player_SSR']
                                        var p_type = typeArray[Phaser.Math.Between(0, 2)]
                                        var p_id = Phaser.Math.Between(0, 9) // 每一類有十隻小夥伴
                                        UsePropResult = {
                                            location: i,
                                            now_stage: newStage,
                                            next_sec: nextSec,
                                            walking_partner: trigger, // 觸發小夥伴flag
                                            p_type: p_type,
                                            p_id: p_id,
                                        }
                                        successUseProp(this, UsePropResult)
                                            // --------------------- faleSQL用 ---------------------
                                        break
                                }

                                var actions = this.add.sprite(this.eachland[i].x + 30, this.eachland[i].y - 55, 'land_actions', frame)
                                actions.play(doing)
                                var animsIndex = i // 正在執行動畫的土地序號oncomplete用

                                actions.on('animationupdate', function() { // v3.50.1 animationstart沒反應，先用animationupdate替代(待改)
                                    if (toolNum == 1 && !this.canDragBackground) {
                                        this.canDragBackground = true
                                        this.hidePointerWork();
                                        for (var x = 0; x < this.opened; x++) {
                                            this.eachland[x].hideLandMode();
                                            // console.log('當前選的道具數量歸0')
                                        }
                                    }
                                }, this);

                                actions.on('animationcomplete', function(currentAnim, currentFrame, sprite) {
                                    if (sprite.anims.currentAnim.key == 'action_dig') {
                                        this.eachland[animsIndex].setFrame(0)
                                    }
                                }, this);
                            }

                            // console.log('消除提示符號')
                            this.eachland[i].hideLandMode();
                        }
                    } else if (this.eachland[i].status == undefined || this.eachland[i].status == 'needDig') {
                        // console.log('沒有作物 / 爛掉')
                    } // 查看作物剩餘生長時間
                    else {
                        // console.log('點到土地 & 沒有工作 ' + i)

                        this.hidePointerWork();

                        if (this.eachland[i].cropStatusSprite.texture.key == 'land_seedsLV3') {
                            this.onLandwithCrop(this.eachland[i], i)
                        } else {
                            this.eachland[i].showLandMode(this.eachland[i].x, this.eachland[i].y, 'quick');
                        }
                    }
                }

                // 指標在土地內(剩餘19塊土地會執行以下else) / 點擊空白處
                else {
                    num++

                    // 查看加速框時一次只顯示一塊土地的訊息
                    if (!this.pointerWork) {
                        if (this.canDragBackground == true) { // 點擊加速按鈕時會鎖定->不隱藏加速框
                            this.eachland[i].hideLandMode();
                        }
                    } else if (this.pointerWork) {
                        // 點擊空白處
                        if (num == this.opened) {
                            this.canDragBackground = true
                            this.hidePointerWork();
                            for (var j = 0; j < this.opened; j++) {
                                this.eachland[j].hideLandMode();
                                // console.log('點擊空白處')
                            }
                        }
                    }
                }
            }
        }, this)

        this.sceneLoadObjects = this.scene.get('loadObjects');
        // 顯示土地資訊
        this.sceneLoadObjects.events.on('chooseWork', function(data) {
            this.canDragBackground = false
                // console.log('----------' + data.key)

            // 滑鼠指標圖示
            this.pointerWork = this.add.sprite(0, 0, data.key, data.frame).setVisible(false)

            var m = 0 // 紀錄土地序號
            var n = 0 // 紀錄符合條件數量

            var memberTool = getMemberTool()[data.frame]
            if (data.work != 'seed' && memberTool <= 0) {
                showTipsText(this, '道具數量不足')
                return
            }
            // 土地排序左上到右下一行一行新增
            for (var j = 0; j < 4; j++) {
                for (var i = 0; i < 5; i++) {
                    var incX = i * 80 - j * 80 // 80土地寬的一半
                    var incY = i * 45 + j * 45 // 45土地高的一半

                    if (m < this.opened) {
                        // 選種植 & 空土地
                        if (data.work == 'seed' && this.eachland[m].status == undefined && this.eachland[m].frame.name == 0) {
                            this.eachland[m].showLandMode(270 + incX, 350 + incY, data.work)
                        } // 選道具 & 土地有作物
                        else if (data.work != 'seed' && this.eachland[m].status != undefined && this.eachland[m].status != 'needDig') {
                            // 作物等於階段三 || 選擇鏟子(土地同時有生長中作物+爛掉土地) || 已施肥過(上限一次)
                            if (this.eachland[m].cropStatusSprite.texture.key == 'land_seedsLV3' || data.work == 'dig' || data.work == 'fertilizer' && this.eachland[m].status == 'fertilized') {
                                n++
                            } else {
                                this.eachland[m].showLandMode(270 + incX, 350 + incY, data.work)
                            }

                        } else if (data.work == 'dig' && this.eachland[m].frame.name == 2) { // frame 2 = 作物爛掉的土地
                            this.eachland[m].showLandMode(270 + incX, 350 + incY, data.work)
                        } else {
                            n++
                        }
                    }
                    m++
                }
            }

            // 當所有土地(已開放)都符合條件
            if (n == this.opened) {
                // console.log('當所有土地(已開放)都符合條件')
                this.hidePointerWork();
                showTipsText(this, '無符合條件的土地')

                this.canDragBackground = true
            }
        }, this);

        this.scene.launch('UI');
        this.sceneUI = this.scene.get('UI');
        this.sceneUI.events.on('clickUI', function(data) {
            this.hidePointerWork();
            for (var j = 0; j < this.opened; j++) {
                this.eachland[j].hideLandMode();
            }
        }, this);

        this.sceneUI.events.on('lockDrag', function(data) {
            this.canDragBackground = false
        }, this);
        this.sceneUI.events.on('releaseDrag', function(data) {
            // console.log('releaseDrag')
            this.canDragBackground = true
        }, this);
        this.sceneUI.events.on('lockLand', function(data) {
            // console.log('lockLand')
            this.canClickLand = false
        }, this);
        this.sceneUI.events.on('releaseLand', function(data) {
            // console.log('releaseLand')
            this.canClickLand = true
        }, this);
        this.sceneUI.events.on('cancelShortenGrowing', function(data) {
            // console.log('cancelShortenGrowing')
            for (var i = 0; i < this.opened; i++) {
                if (this.eachland[i].landMode != undefined) {
                    this.eachland[i].hideLandMode();
                    // console.log('取消加速關閉')
                }
            }
        }, this);
        this.sceneUI.events.on('shortenGrowing', function(data) {
            // console.log('shortenGrowing')

            // this.eachland[data.landID].needTime = data.nextTime
            // setMemberLand_cropNeedSec(data.landID, data.nextTime)

            if (this.eachland[data.landID].cropStatusSprite.texture.key == 'land_seeds') {
                // fakeSQL用
                this.eachland[data.landID].needTime = getSeed_growSecLV3()[data.landID]
                setMemberLand_cropNeedSec(data.landID, getSeed_growSecLV3()[data.landID])

                this.eachland[data.landID].cropStatusSprite.setTexture('land_seedsLV2').setFrame(this.eachland[data.landID].cropType)
            } else if (this.eachland[data.landID].cropStatusSprite.texture.key == 'land_seedsLV2') {
                // fakeSQL用
                this.eachland[data.landID].needTime = getSeed_deadSec()[data.landID]
                setMemberLand_cropNeedSec(data.landID, getSeed_deadSec()[data.landID])

                this.eachland[data.landID].cropStatusSprite.setTexture('land_seedsLV3').setFrame(this.eachland[data.landID].cropType)
            }

            this.eachland[data.landID].hideLandMode();
            // console.log('加速完關閉' + getMemberLand_cropNeedSec()[data.landID])
        }, this);

        this.sceneUI.events.on('levelUp_updateWood', function(data) {
            this.updateWoodFrame()
        }, this);

        this.sceneUI.events.on('openLand', function(data) {
            this.eachland[this.opened].setFrame(0)
            this.opened += 1

            if (this.opened < 20) { // 土地最多20格
                setMemberLandOpened(this.opened)

                this.wood.setPosition(this.eachland[this.opened].x, this.eachland[this.opened].y - 20)

                this.updateWoodFrame()
            } else {
                this.wood.setVisible(false)
                this.wood = undefined
            }
        }, this);

        var k = 0
        var frameIndex = 0 // 已開放
        for (var j = 0; j < 4; j++) {
            for (var i = 0; i < 5; i++) {
                var incX = i * 80 - j * 80
                var incY = i * 45 + j * 45

                // 未開放
                if (k >= this.opened) {
                    frameIndex = 1
                }

                this.eachland[k] = new land({
                    scene: this,
                    id: k,
                    x: 230 + incX,
                    y: 350 + incY,
                    key: 'land',
                    frame: frameIndex,
                })

                k++
            }
        }

        // 解鎖木牌
        this.wood = this.add.sprite(0, 0, 'wood', 1).setDepth(1)
        if (this.opened < 20) { // 土地最多20格
            this.wood.setPosition(this.eachland[this.opened].x, this.eachland[this.opened].y - 20)

            this.updateWoodFrame()

            this.wood.setInteractive().on('pointerdown', function() {

                if (this.canClickLand == false) return

                PlayAudio(this, 'clickSE')
                btnClick(this, this.wood)
                    .on('complete', function(tween, targets) {
                        var cost
                        var coinFrame
                        var newLand_coinNum = getNewLand_coinNum()
                        var newLand_O2pointNum = getNewLand_O2pointNum()
                        if (newLand_coinNum[this.opened] == 0) {
                            cost = newLand_O2pointNum[this.opened]
                            coinFrame = 1
                        } else {
                            cost = newLand_coinNum[this.opened]
                            coinFrame = 0
                        }

                        if (targets[0].frame.name == 0) {
                            showTipsText(this, '等級不足')
                        } else if (targets[0].frame.name == 1) {
                            this.events.emit('clickWood', { type: 'newLand', cost: cost, coinFrame: coinFrame }); // 至UIScene接收
                        }
                    }, this)
            }, this)
        } else {
            this.wood.setVisible(false)
            this.wood = undefined
        }

        // 顯示主角在場上
        var host = new character({
            scene: this,
            x: 150,
            y: 880,
            rate: 15,
            key: 'host',
            frame: 0
        })
        host.startWalk()
    }

    createWorkAnims() {
        this.anims.create({
            key: 'action_dig',
            frames: this.anims.generateFrameNumbers('land_actions', { start: 0, end: 2 }),
            frameRate: 6,
            repeat: 1,
            hideOnComplete: true
        });
        this.anims.create({
            key: 'action_water',
            frames: this.anims.generateFrameNumbers('land_actions', { start: 3, end: 5 }),
            frameRate: 6,
            repeat: 1,
            hideOnComplete: true
        });
        this.anims.create({
            key: 'action_fertilizer',
            frames: this.anims.generateFrameNumbers('land_actions', { start: 6, end: 8 }),
            frameRate: 6,
            repeat: 1,
            hideOnComplete: true
        });
    }

    hidePointerWork() {
        if (this.pointerWork == undefined) return

        this.pointerWork.destroy()
        this.pointerWork = undefined
    }

    onLandwithCrop(target, location) {
        // console.log('onLandwithCrop' + target.cropStatusSprite)

        if (target.cropStatusSprite.texture.key == 'land_seedsLV3') {
            // 判斷是否爆倉
            var isEnough = checkSpace(target.cropTypeSprite, target.harvestNum)

            // 有足夠倉庫空間
            if (isEnough) {
                PlayAudio(this, 'harvestSE')
                    // SetPreDoHarvest(preDoHarvest, this);
                    // SetSuccessDoHarvest(successDoHarvest, this);
                    // doHarvest(location);
                successDoHarvest(this, location);

                rewardCollection(this, target.cropTypeSprite, target.harvestNum)
                target.clearLand();
            } else {
                showTipsText(this, '倉庫空間不足')
            }
        } else {
            target.showLandMode(target.x, target.y, 'quick');
        }
    }

    updateWoodFrame() {
        var memberLV = getMemberLV()
        var newLand_limitLV = getNewLand_limitLV()
        var nextOpen = getMemberLandOpened()

        if (memberLV < newLand_limitLV[nextOpen]) {
            this.wood.setFrame(0)
        } else {
            this.wood.setFrame(1)
        }
    }
}

// function successRefreshDailyData() {
//     console.log('------successRefreshDailyData ')
//     dailyResetFlag = true
// }

// function successUseProp(this) {
function successUseProp(t, UsePropResult) {
    // console.log('------successUseProp ')
    // console.log('這裡的this = scene')

    // 縮短時間
    if (UsePropResult.next_sec != undefined) {
        // this.eachland[UsePropResult.location].needTime = UsePropResult.next_sec
        // setMemberLand_cropNeedSec(this.eachland[UsePropResult.location].id, UsePropResult.next_sec)
        // switch (UsePropResult.now_stage) {
        //     case 1:
        //         this.eachland[UsePropResult.location].cropStatusSprite.setTexture('land_seedsLV2').setFrame(this.eachland[UsePropResult.location].cropType)
        //         break
        //     case 2:
        //         this.eachland[UsePropResult.location].cropStatusSprite.setTexture('land_seedsLV3').setFrame(this.eachland[UsePropResult.location].cropType)
        //         break
        // }
        t.eachland[UsePropResult.location].needTime = UsePropResult.next_sec
        setMemberLand_cropNeedSec(UsePropResult.location, UsePropResult.next_sec)
        switch (UsePropResult.now_stage) {
            case 1:
                setMemberLand_cropStatus(UsePropResult.location, 1)
                t.eachland[UsePropResult.location].cropStatusSprite.setTexture('land_seedsLV2').setFrame(t.eachland[UsePropResult.location].cropType)
                break
            case 2:
                setMemberLand_cropStatus(UsePropResult.location, 2)
                t.eachland[UsePropResult.location].cropStatusSprite.setTexture('land_seedsLV3').setFrame(t.eachland[UsePropResult.location].cropType)
                break
        }
    }

    // 增加收成量
    if (UsePropResult.add_harvest_num != undefined) {
        // this.eachland[UsePropResult.location].setHarvestNum(UsePropResult.harvest_num)
        t.eachland[UsePropResult.location].setHarvestNum(UsePropResult.harvest_num)
    }

    // 觸發小夥伴
    // var partnerType
    // var partnerKey
    // var partnerFrame
    var partnerKey = UsePropResult.p_type
    var partnerFrame = UsePropResult.p_id

    if (UsePropResult.walking_partner == undefined) return
    if (UsePropResult.walking_partner == null) return

    // var partnerID = UsePropResult.walking_partner.id
    // for (var i = 0; i < PartnerCategoryData.length; i++) {
    //     if (PartnerPicIndexData[PartnerCategoryData[i]][partnerID] == undefined) continue

    //     partnerType = PartnerCategoryData[i]
    //     partnerFrame = PartnerPicIndexData[PartnerCategoryData[i]][partnerID]
    // }

    // switch (partnerType) {
    //     case 'N':
    //         partnerKey = 'player_N'
    //         break

    //     case 'SR':
    //         partnerKey = 'player_SR'
    //         break

    //     case 'SSR':
    //         partnerKey = 'player_SSR'
    //         break
    // }

    var walkRate
        // if (UsePropResult.walking_partner.number == 1) {
        //     walkRate = 13
        // } else {
    walkRate = 17
        // }

    // this.partner = new character({
    //     scene: this,
    //     x: 150,
    //     y: 880,
    //     rate: walkRate,
    //     key: partnerKey,
    //     frame: partnerFrame
    // })
    // this.partner.startWalk()
    t.partner = new character({
        scene: t,
        x: 150,
        y: 880,
        rate: walkRate,
        key: partnerKey,
        frame: partnerFrame
    })
    t.partner.startWalk()
}

// function preGetLandData_inGame() {
//     console.log('------preGetLandData_inGame ')

//     // 鎖定畫面其餘動作
//     this.canClickLand = false
//     this.events.emit('dragBG'); // 至UIScene接收

//     if (this.loadingAnimation == undefined || this.loadingAnimation.visible == false) {
//         showLoadingAnimation(this)
//     }
// }

function successGetLandData_inGame(t) {
    // console.log('------successGetLandData_inGame ')

    // 釋放鎖定畫面其餘動作
    // this.canClickLand = true
    // this.events.emit('endDragBG'); // 至UIScene接收
    // this.loadingAnimation.destroy()

    t.canClickLand = true
    t.events.emit('endDragBG'); // 至UIScene接收
    // t.loadingAnimation.destroy()

    for (var i = 0; i < FarmerLands.length; i++) {
        // 土地無作物( 0=空的 / 1=已種植 / 2=已施肥 / 3=需挖除 )
        if (FarmerLands[i].land_status == 0) continue

        var plant_status = FarmerLands[i].plant_status // plant_status ( null=無作物、枯萎 / 0=階段一 / 1=階段二 / 2=階段三 )
        var next_sec = FarmerLands[i].next_sec

        setMemberLand_cropStatus(i, plant_status)
        setMemberLand_cropNeedSec(i, next_sec)

        // if (plant_status == 0) {
        //     this.eachland[i].cropStatusSprite.setTexture('land_seeds')
        // } else if (plant_status == 1) {
        //     this.eachland[i].cropStatusSprite.setTexture('land_seedsLV2').setFrame(this.eachland[i].cropType)
        // } else if (plant_status == 2) {
        //     this.eachland[i].cropStatusSprite.setTexture('land_seedsLV3').setFrame(this.eachland[i].cropType)
        // } else {
        //     if (this.eachland[i].cropStatusSprite != undefined) {
        //         this.eachland[i].clearLand();
        //     }
        //     this.eachland[i].setTexture('land').setFrame(2)
        // }
        if (plant_status == 0) {
            t.eachland[i].cropStatusSprite.setTexture('land_seeds')
        } else if (plant_status == 1) {
            t.eachland[i].cropStatusSprite.setTexture('land_seedsLV2').setFrame(t.eachland[i].cropType)
        } else if (plant_status == 2) {
            t.eachland[i].cropStatusSprite.setTexture('land_seedsLV3').setFrame(t.eachland[i].cropType)
        } else {
            if (t.eachland[i].cropStatusSprite != undefined) {
                t.eachland[i].clearLand();
            }
            t.eachland[i].setTexture('land').setFrame(2)
        }
    }
}

// function preDoPlantSeed() {
//     // console.log('------preDoPlantSeed: ')

//     // 鎖定畫面其餘動作
//     this.canClickLand = false
//     this.events.emit('dragBG'); // 至UIScene接收

//     if (this.loadingAnimation == undefined || this.loadingAnimation.visible == false) {
//         showLoadingAnimation(this)
//     }
// }

function successDoPlantSeed(t, seedInex) {
    // console.log('------successDoPlantSeed: ' + NextSec)
    // console.log('這裡的this = this.eachland[i]')

    // 釋放鎖定畫面其餘動作
    // this.scene.canClickLand = true;
    // this.scene.events.emit('endDragBG'); // 至UIScene接收
    t.scene.canClickLand = true;
    t.scene.events.emit('endDragBG'); // 至UIScene接收

    // this.scene.loadingAnimation.destroy()

    // this.needTime = NextSec
    // setMemberLand_cropNeedSec(this.id, NextSec)
    // this.setLandCropStatus(this.x, this.y - 10, doPlantSeedResult.pic_index)
    setMemberLand_cropStatus(t.id, 0)
    setMemberLand_cropNeedSec(t.id, getSeed_growSecLV2()[seedInex])
    t.setLandCropStatus(t.x, t.y - 10, seedInex)
}

// function preDoHarvest() {
//     waitFlag += 1;
//     this.events.emit('dragBG'); // 禁用UI待success後釋放(至UIScene接收)
// }

function successDoHarvest(t, location) {
    // console.log('------successDoHarvest: ')
    // console.log('這裡的this = scene')
    // waitFlag -= 1;

    setMemberTask(0, 1, true) // 回傳每日任務第0項(任務1)+1

    // this.events.emit('harvest', { type: 'harvest', expInc: this.eachland[HarvestResult.location].exp, isLevelUp: HarvestResult.level_up }); // 至UIScene接收
    // fakeSQL 用
    var levelUpFlag = false
    if (getMemberExp() + t.eachland[location].exp >= getNextExp()) {
        levelUpFlag = true
    }
    t.events.emit('harvest', { type: 'harvest', expInc: t.eachland[location].exp, isLevelUp: levelUpFlag }); // 至UIScene接收

    // if (waitFlag == 0) {
    //     this.events.emit('endDragBG'); // 至UIScene接收
    // }
    t.events.emit('endDragBG'); // 至UIScene接收

}