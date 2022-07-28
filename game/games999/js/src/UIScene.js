// import { NextLevelData, getNextLevelData, SetSuccessGetNextLevelData } from '../../../js/farm_source.js'

import taskTable from './table/taskTable'
import signInTable from './table/signInTable'
import achievementTable from './table/achievementTable'
import bookTable from './table/bookTable'
import warehouseTable from './table/warehouseTable'
import shopTable from './table/shopTable'

import toolMenu from './menu/toolMenu'
import cropMenu from './menu/cropMenu'

import levelUp from './table/tipsBoard/levelUp'
import coinExchange from './table/tipsBoard/coinExchange'
import noticeBoard from './table/tipsBoard/noticeBoard'
import teachTable from './table/tipsBoard/teachTable'

import { btnClick, showTipsText, showCover, PlayAudio } from './Controller.js'
import {
    getFirstEnter,
    getMemberPhoto,
    getMemberName,
    getMemberLV,
    setMemberLV,
    getMemberExp,
    setMemberExp,
    getMemberCoin,
    setMemberCoin,
    getMemberO2point,
    setMemberO2point,

    getNextLV,
    setNextLV,
    getNextExp,
    setNextExp,
    getUpgradeGift,
    setUpgradeGift,
    getUpgradeUnlock,
    setUpgradeUnlock,
    getLv_index,
    setLv_index,
    getLv_exp,
    setLv_exp,
    getLv_gift,
    setLv_gift,

    getMemberSeed,
    setMemberTask,
    getTaskNoticeStar,
    getSignInNoticeStar,
    getAchievNoticeStar,
    getBookNoticeStar
} from './fakeSQL.js'

let isdragging = false
let uiBtns = []
let uibtnSpriteArray = []
export let uiTables = []
export default class UIScene extends Phaser.Scene {
    constructor() {
        super('UI')
    }

    init() {
        // 陣列中順序很重要(異動會有影響)
        uiBtns = [
            'uibtn_task', 'uibtn_signIn', 'uibtn_achievement', 'uibtn_book', 'uibtn_warehouse', 'uibtn_shop',
            'uibtn_crop', 'uibtn_tool',
        ]

        uiTables = [
            taskTable, signInTable, achievementTable, bookTable, warehouseTable, shopTable,
            cropMenu, toolMenu
        ]
    }

    create() {
        this.input.setTopOnly(true)
        this.input.setGlobalTopOnly(true)

        this.createInfo()
        this.createButton()

        // 首次登入遊戲，顯示新手教學
        if (getFirstEnter() == true) {
            showCover(this)
            new teachTable().create(this, 0, false)

            // 先鎖定UI按鈕可點選功能
            for (var i = 0; i < this.UiButtons.length; i++) {
                this.UiButtons[i].disableInteractive()
            }
            this.events.emit('lockDrag'); // 至playScene接收
        }

        this.UiContainer = this.add.container(0, 0)
        this.UiButtons.forEach(function(icon) {
            this.UiContainer.add(icon)
        }, this)

        this.input.on('pointerdown', function(pointer) {
            if (this.board != undefined && this.board.type == "rexScrollablePanel") {
                if (!this.rexUI.isInTouching(this.board)) {
                    console.log('pointerdown + rexScrollablePanel')
                    this.board = undefined;
                    this.releaseUIbtn()
                    this.events.emit('hideAllBoard'); // 至loadObject接收
                    this.events.emit('releaseDrag'); // 至playScene接收
                }
            }
        }, this);

        this.sceneLoadObjects = this.scene.get('loadObjects');
        this.sceneLoadObjects.events.on('showBoard', function(data) {
            console.log('events.on showBoard')
            showCover(this)
            this.board = data.board
            this.lockUIbtn()
            this.events.emit('lockDrag'); // 至playScene接收
        }, this);

        this.sceneLoadObjects.events.on('btn_close', function(data) {
            console.log('events.on btn_close')
            PlayAudio(this, 'btnCloseSE')
            this.board = undefined;
            this.releaseUIbtn()
            this.events.emit('hideAllBoard'); // 至loadObject接收
            this.events.emit('releaseDrag'); // 至playScene接收
        }, this);

        this.sceneLoadObjects.events.on('showMenu', this.addMask, this);

        this.sceneLoadObjects.events.on('calculate', function(data) {
            console.log('sceneLoadObjects events.on calculate')
            setMemberCoin(data.coinInc, true)
            setMemberO2point(data.O2pointInc, true)
            setMemberTask(7, -data.O2pointInc, true) // 回傳每日任務第7項(任務8)+消耗數量

            this.updateMemberCoin()
        }, this);

        this.sceneLoadObjects.events.on('showTeach', function(data) {
            console.log('events.on showTeach')
            new teachTable().create(this.sceneLoadObjects, data.page, true)
        }, this);


        // 地圖拖動 & UI按鈕互鎖 (避免拖動時鬆開在按鈕之上會同時開啟功能框)
        this.sceneplay = this.scene.get('play');
        this.sceneplay.events.on('dragBG', function(data) {
            isdragging = true
        }, this);
        this.sceneplay.events.on('endDragBG', function(data) {
            isdragging = false
        }, this);

        this.sceneplay.events.on('clickWood', function(data) {
            console.log('events.on clickWood')
            showCover(this)
            this.board = data.type
            new noticeBoard().create(this, data.type, false, data.cost, data.coinFrame)
            this.events.emit('lockDrag'); // 至playScene接收
        }, this);

        this.sceneplay.events.on('clickSpeedUp', function(data) {
            console.log('events.on clickSpeedUp')
            showCover(this)
            this.board = data.type
            new noticeBoard().create(this, data.type, false, data.cost, 0, data.id)
            this.events.emit('lockDrag'); // 至playScene接收
        }, this);

        this.sceneplay.events.on('harvest', function(data) {
            console.log('events.on harvest')
                // SetSuccessGetNextLevelData(successGetNextLevelData, this);

            setMemberExp(data.expInc, true)

            var NextLevelData = {
                level: getLv_index()[0],
                exp: getLv_exp()[0],
                prize_arr: getLv_gift()[0],
            }

            if (data.isLevelUp == true) {
                this.board = data.type
                    // getNextLevelData(true);
                successGetNextLevelData(this, NextLevelData);
            } else {
                this.updateMemberExp();
            }
        }, this);

        this.time.addEvent({
            delay: 500, // 每0.5秒偵測一次，減少效能消耗
            callback: function() {
                this.checkUIStar()
            },
            callbackScope: this,
            loop: true
        });
    }

    checkUIStar() {
        if (getTaskNoticeStar() == false) {
            this.taskUI.star.setVisible(false)
        } else {
            this.taskUI.star.setVisible(true)
        }

        if (getSignInNoticeStar() == false) {
            this.signInUI.star.setVisible(false)
        } else {
            this.signInUI.star.setVisible(true)
        }

        if (getAchievNoticeStar() == false) {
            this.achievementUI.star.setVisible(false)
        } else {
            this.achievementUI.star.setVisible(true)
        }

        if (getBookNoticeStar() == false) {
            this.bookUI.star.setVisible(false)
        } else {
            this.bookUI.star.setVisible(true)
        }
    }

    addMask() {
        let maskShape = this.make.graphics();
        maskShape.fillStyle(0xffffff);
        maskShape.fillRect(0, 0, 600, 775);
        this.board.mask = new Phaser.Display.Masks.BitmapMask(this, maskShape);
    }

    createInfo() {
        var imageData = getMemberPhoto()
        if (imageData == undefined) {
            this.add.sprite(99, 60, 'info_photo')
        } else {
            this.textures.once('addtexture', function() {
                this.add.image(99, 60, 'baseImg')
            }, this);
            this.textures.addBase64('baseImg', imageData);
        }

        this.bg_info = this.add.sprite(0, 0, 'bg_info')
        this.bg_info.setOrigin(0).setDepth(1)

        this.info_name = this.add.text(240, 20, getMemberName(), { fontSize: '13pt', padding: { top: 6 } }).setDepth(1)
        this.info_LV = this.add.bitmapText(205, 20, 'farmText_White', getMemberLV(), 20).setDepth(1)
        this.info_expOuter = this.add.sprite(405, 25, 'info_expOuter').setOrigin(0).setDepth(1)
        this.info_expInner = this.add.graphics()
        this.info_expInner.setDepth(1)
        this.info_exp = this.add.bitmapText(475, 32, 'farmText_White', '', 10).setOrigin(0.5).setDepth(1)
        this.info_expStar = this.add.sprite(391, 29, 'info_expStar').setOrigin(0, 0.5).setDepth(1).setDepth(1)
        this.updateMemberExp()

        this.info_coin = this.add.bitmapText(250, 93, 'farmText_White', '', 20).setOrigin(0.5).setDepth(1)
        this.info_O2point = this.add.bitmapText(450, 93, 'farmText_White', this.realO2point, 20).setOrigin(0.5).setDepth(1)
        this.updateMemberCoin()

        this.createInfoButton(310, 93, 'coinAddbtn').setDepth(1)
        this.createInfoButton(510, 93, 'O2pointAddbtn').setDepth(1)
    }

    createInfoButton(x, y, type) {
        var btn = this.add.sprite(x, y, 'btn_add', 0)
        uibtnSpriteArray.push(btn)

        btn.setInteractive().on('pointerdown', function() {
            console.log('click ' + type)

            if (isdragging) return
            if (this.board != undefined) return

            this.lockUIbtn()
            btnClick(this, btn)
                .on('complete', function(tween, targets) {
                    switch (type) {
                        case 'coinAddbtn':
                            showCover(this)
                            new coinExchange().create(this)
                            this.events.emit('lockDrag'); // 至playScene接收
                            break;
                        case 'O2pointAddbtn':
                            showCover(this)
                            new noticeBoard().create(this, 'goMemberStore', false)
                            this.events.emit('lockDrag'); // 至playScene接收
                            break;
                    }
                }, this);
        }, this)
        return btn
    }

    updateMemberExp() {
        console.log('-----------updateMemberExp-------------')

        // 經驗值(待改) 清除&填滿 (this.bar.fillRect(416, 43, D, 9);) D = 128*(當前經驗/該級總經驗)
        var ownLV = getMemberLV()
        var ownExp = getMemberExp()

        var upToLV = getNextLV()
        var upToExp = getNextExp()

        this.info_LV.setText(ownLV)

        // 滿級狀態
        if (ownLV == upToLV) {
            ownExp = upToExp
        }

        var rate = 128 * (ownExp / upToExp) // 128 = 經驗條內圈長度

        this.info_expInner.clear();
        this.info_expInner.fillStyle(0xfdd442);
        this.info_expInner.fillRect(411, 28, rate, 9)

        this.info_exp.setText(ownExp + ' / ' + upToExp)
    }

    updateMemberCoin() {
        console.log('--updateMemberCoin--')
        var memberCoin = getMemberCoin()
        var memberO2point = getMemberO2point()
        console.log('Coin: ' + memberCoin + ' O2point: ' + memberO2point)

        if (memberCoin / 100000 > 1) {
            this.info_coin.setText(Math.floor((memberCoin / 1000) * 10) / 10 + 'K')
        } else {
            this.info_coin.setText(memberCoin)
        }

        this.info_O2point.setText(memberO2point)
    }

    createButton() {
        this.UiButtons = []

        this.bg_action = this.add.sprite(0, game.config.height, 'bg_action')
        this.bg_action.setOrigin(0, 1)

        this.taskUI = this.buttonController(game.config.width - 60, 200, 0)
        this.signInUI = this.buttonController(game.config.width - 60, 270, 1)
        this.achievementUI = this.buttonController(game.config.width - 60, 340, 2)
        this.bookUI = this.buttonController(game.config.width - 60, 410, 3)

        this.warehouseUI = this.buttonController(game.config.width - 155, game.config.height - 70, 4)
        this.cropUI = this.buttonController(game.config.width / 2, game.config.height - 70, 6)
        this.toolUI = this.buttonController(155, game.config.height - 70, 7)

        this.shopUI = this.buttonController(60, game.config.height - 300, 5)

        this.UiButtons.push(this.taskUI, this.signInUI, this.achievementUI, this.bookUI,
            this.warehouseUI, this.shopUI, this.cropUI, this.toolUI)
    }

    buttonController(x, y, key) {
        var uibtn = this.add.sprite(x, y, uiBtns[key], 0)
        uibtnSpriteArray.push(uibtn)

        // 提示用小紅點(只有前四個UI有功能)
        var graphics = this.add.graphics();
        if (key < 4) {
            uibtn.star = drawStar(graphics, x + 20, y - 20, 5, 8, 4, 0xce0000, 0xffffff);
            uibtn.star.setDepth(1);
            uibtn.star.setVisible(false);
        }

        uibtn.setInteractive().on('pointerdown', function() {
            console.log('clickUI - drag: ' + isdragging)
            // console.log(this.board)

            if (isdragging) return
            if (this.board != undefined) return

            this.lockUIbtn()
            btnClick(this, uibtn, false)
                .on('complete', function(tween, targets) {
                    this.checkBtnKey(key)
                }, this)
        }, this)

        return uibtn
    }

    lockUIbtn() {
        for (var i = 0; i < uibtnSpriteArray.length; i++) {
            uibtnSpriteArray[i].disableInteractive()
        }
    }
    releaseUIbtn() {
        for (var i = 0; i < uibtnSpriteArray.length; i++) {
            uibtnSpriteArray[i].setInteractive()
        }
    }

    checkBtnKey(keyIndex) {
        this.events.emit('clickUI'); // 至playScene接收

        var seedNum = getMemberSeed()
        var isShowMenu = false
        for (var i = 0; i < seedNum.length; i++) {
            if (seedNum[i] != 0) {
                isShowMenu = true
            }
        }

        if (keyIndex == 6 && isShowMenu == false) {
            this.releaseUIbtn()
            showTipsText(this, '種子不足請先購買')
        } else {
            showCover(this)

            if (keyIndex <= 5) {
                this.scene.launch('loadObjects', { UiID: keyIndex })
            } else {
                // 種植 / 道具
                if (keyIndex == 6 || keyIndex == 7) {
                    this.scene.launch('loadObjects', { UiID: keyIndex, x: this.cropUI.x, y: this.cropUI.y })
                }
            }
        }
    }
}

function drawStar(graphics, cx, cy, spikes, outerRadius, innerRadius, color, lineColor) {
    var rot = Math.PI / 2 * 3;
    var x = cx;
    var y = cy;
    var step = Math.PI / spikes;
    graphics.lineStyle(2, lineColor, 1.0);
    graphics.fillStyle(color, 1.0);
    graphics.beginPath();
    graphics.moveTo(cx, cy - outerRadius);
    for (var i = 0; i < spikes; i++) {
        x = cx + Math.cos(rot) * outerRadius;
        y = cy + Math.sin(rot) * outerRadius;
        graphics.lineTo(x, y);
        rot += step;

        x = cx + Math.cos(rot) * innerRadius;
        y = cy + Math.sin(rot) * innerRadius;
        graphics.lineTo(x, y);
        rot += step;
    }
    graphics.lineTo(cx, cy - outerRadius);
    graphics.closePath();
    graphics.fillPath();
    graphics.strokePath();

    return graphics
}

function successGetNextLevelData(t, NextLevelData) {
    console.log('------successGetNextLevelData')
    console.log(NextLevelData)

    // fakeSQL 用
    setLv_index('shift')
    setLv_exp('shift')
    setLv_gift('shift')

    var ownExp = getMemberExp()
    var upToLV = getNextLV()
    var upToExp = getNextExp()
    var award = getUpgradeGift()
    var unlock = getUpgradeUnlock()

    var newExp = ownExp - upToExp
    setMemberLV(upToLV)
    setMemberExp(newExp, false)

    setNextLV(NextLevelData.level)
    setNextExp(NextLevelData.exp);
    setUpgradeGift(NextLevelData.prize_arr)
        // setUpgradeUnlock(NextLevelData.unlock_arr) // fakeSQL不使用

    // showCover(this)
    // new levelUp().create(this, award, unlock)
    // this.events.emit('lockDrag'); // 至playScene接收
    showCover(t)
    new levelUp().create(t, award, unlock)
    t.events.emit('lockDrag'); // 至playScene接收

    // this.updateMemberExp()
    t.updateMemberExp()
}