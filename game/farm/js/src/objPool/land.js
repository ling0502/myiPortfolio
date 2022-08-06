import { btnClick } from "../Controller"
import {
    getMemberLand_status,
    setMemberLand_status,
    getMemberLand_statusID,
    setMemberLand_statusID,
    getMemberLand_cropTypeFrame,
    setMemberLand_cropTypeFrame,
    getMemberLand_cropStatus,
    setMemberLand_cropStatus,
    getMemberLand_cropNeedSec,
    setMemberLand_cropNeedSec,

    getRate_perO2toTime,
    getCropName,
    getSeed_growSecLV2,
    getSeed_growSecLV3,
    getSeed_deadSec,
    getSeed_baseQTY,
    getSeed_rateQTY,
    getSeed_exp,
} from "../fakeSQL"

export default class land extends Phaser.GameObjects.Sprite {
    constructor(config) {
        super(config.scene, config.x, config.y, config.key, config.frame, config.id)
        config.scene.add.existing(this)

        this.x = config.x
        this.y = config.y
        this.id = config.id

        this.status = getMemberLand_status()[this.id] // 種植狀態 (undefined(空的), 'planted'(已種植), 'fertilized'(已施肥-限一次), 'needDig',(需挖除))
        this.statusID = getMemberLand_statusID()[this.id] //  0=空的 / 1=已種植 / 2=已施肥 / 3=需挖除
        this.landMode = undefined // 土地資訊
        this.cropType = undefined // 種植作物種類(收成用)
        this.cropTypeFrame = getMemberLand_cropTypeFrame()[this.id]
        this.cropStatus = getMemberLand_cropStatus()[this.id] //  0=階段一 / 1=階段二 / 2=階段三 / null = 無作物&枯萎

        this.elapsed = 0 // 作物生長經過時間

        this.polygon = new Phaser.Geom.Polygon([
            this.x - 80, this.y,
            this.x, this.y - 45,
            this.x + 80, this.y,
            this.x, this.y + 45,
        ]);

        this.graphics = this.scene.add.graphics();
        this.graphics.setVisible(false)

        // 框線
        this.graphics.lineStyle(1, 0xff0000, 1);
        this.graphics.strokePoints(this.polygon.points, true);

        this.setInteractive(this.polygon, Phaser.Geom.Polygon.Contains);

        if (this.statusID == 1 || this.statusID == 2) {
            this.setLandCropStatus(this.x, this.y, this.cropTypeFrame)
        } else if (this.statusID == 3) {
            this.setFrame(2)
        }
    }

    showLandMode(x, y, type) {
        // 如果原本土地有顯示資訊 
        if (this.landMode != undefined) {
            this.hideLandMode()
        }

        // 未開放土地不顯示資訊
        if (!this.input.enabled) return

        // console.log('--showLandMode-- ' + type)
        switch (type) {
            case 'dig':
                this.landMode = this.scene.add.sprite(x - 40, y - 20, 'land_dig')
                break;

            case 'water':
                this.landMode = this.scene.add.sprite(x - 40, y - 20, 'land_water')
                break;

            case 'fertilizer':
                this.landMode = this.scene.add.sprite(x - 40, y - 20, 'land_fertilizer')
                break;

            case 'seed':
                this.landMode = this.scene.add.sprite(x - 40, y - 20, 'land_seed')
                break;

            case 'quick':
                this.landMode = this.scene.add.container(x, y - 50).setDepth(1)

                this.needTime = getMemberLand_cropNeedSec()[this.id]

                var rate = getRate_perO2toTime()
                var cost = Math.ceil(this.needTime / rate)
                var cropName = getCropName()[this.cropType]

                var hours = parseInt(this.needTime / 60 / 60)
                var leftSec = this.needTime - (hours * 60 * 60)
                var Sec = parseInt(leftSec / 60)
                var seconds = leftSec % 60

                console.log(cropName + ' quick -- ' + this.needTime + ' : ' +
                    hours + '時' + Sec + '分' + seconds + '秒')

                this.name = this.scene.add.bitmapText(-15, -9, 'farmText_Black', cropName, 14).setOrigin(0.5)
                this.time = this.scene.add.bitmapText(-15, 11, 'farmText_White', '', 14).setOrigin(0.5)
                this.time.setText(hours + '時' + Sec + '分' + seconds + '秒')
                this.quickBG = this.scene.add.sprite(0, 0, 'land_quickBG')
                this.quickBtn = this.scene.add.sprite(55, 0, 'land_quickBtn')
                    .setInteractive().on('pointerdown', function() {
                        this.canDragBackground == false // 顯示加速小框時不隱藏該土地加速狀態用
                        this.scene.clickQuickBtn = true // 避免點擊按鈕觸發下層土地用

                        btnClick(this.scene, this.quickBtn)
                            .on('complete', function(targets) {
                                this.scene.clickQuickBtn = false
                                this.scene.events.emit('clickSpeedUp', { id: this.id, type: 'speedUp', cost: cost }); // 至UIScene接收
                            }, this)

                    }, this)

                this.landMode.add([this.quickBG, this.quickBtn, this.name, this.time])
                break;
        }
        // console.log(this.landMode)
    }

    hideLandMode() {
        if (this.landMode == undefined) return

        // console.log('hideLandMode')
        this.landMode.destroy()
        this.landMode = undefined
    }

    setLandStatus(status) {
        // console.log('-------setLandStatus--------' + status)

        var statusType
        switch (status) {
            case 'land_dig':
                statusType = undefined
                this.cropType = undefined
                break;

            case 'land_water': // 可無限次數澆
                // 若已施肥過，避免澆水後刷新狀態
                if (this.status == 'fertilized') {
                    statusType = 'fertilized'
                } else {
                    statusType = 'watered'
                }
                break;

            case 'land_fertilizer': // 只能一次(初中高肥料共用次數)
                statusType = 'fertilized'
                break;

            case 'land_seed':
                statusType = 'planted'
                break;
        }

        this.status = statusType
    }

    setLandCropStatus(x, y, frame) {
        this.cropType = frame
        this.cropTypeSprite = this.scene.add.sprite(x, y, 'obj_crop', frame).setVisible(false) // 作物種類精靈(判斷爆倉用)
        // console.log('setLandCropStatus-----------')

        // 第一次種植作物
        if (this.cropStatus == null) {
            this.cropStatus = 0
        }

        switch (this.cropStatus) {
            case 0:
                this.cropStatusSprite = this.scene.add.sprite(x, y, 'land_seeds')
                break
            case 1:
                this.cropStatusSprite = this.scene.add.sprite(x, y, 'land_seedsLV2', frame)
                break
            case 2:
                this.cropStatusSprite = this.scene.add.sprite(x, y, 'land_seedsLV3', frame)
                break
        }

        this.buffTime = 0 // 作物生長經過的時間
        this.needTime = getMemberLand_cropNeedSec()[this.id]
        this.growSecLV2 = getSeed_growSecLV2()[frame] // 長成階段二所需時間(秒)
        this.growSecLV3 = getSeed_growSecLV3()[frame] // 長成階段三所需時間(秒)
        this.deadSec = getSeed_deadSec()[frame] // 枯萎時間
        this.harvestNum = getSeed_baseQTY()[frame] // 收成量(+倍率 待改)
        this.exp = getSeed_exp()[frame] // 收成經驗
        // console.log('作物所需時間: ' + this.needTime)
    }

    clearLand() {
        this.cropStatusSprite.destroy()
        this.cropStatusSprite = undefined
        this.status = undefined
        this.status = setMemberLand_status(this.id, undefined)
        this.statusID = 0
        this.statusID = setMemberLand_statusID(this.id, 0)
        this.cropTypeFrame = null
        this.cropTypeFrame = setMemberLand_cropTypeFrame(this.id, null)
        this.cropStatus = null
        this.cropStatus = setMemberLand_cropStatus(this.id, null)
    }

    setHarvestNum(num) {
        // 觸發增益執行彩虹動畫
        this.scene.anims.create({
            key: 'action_rainbow',
            frames: this.scene.anims.generateFrameNumbers('land_rainbow', { start: 0, end: 4 }),
            frameRate: 8,
            repeat: 1,
            hideOnComplete: true
        });
        var rainbow = this.scene.add.sprite(this.x, this.y - 25, 'land_rainbow', 0)
        rainbow.play('action_rainbow')

        this.harvestNum = num
        console.log('當前收成量= ' + this.harvestNum)
    }
}