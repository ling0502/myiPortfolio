// import { UpdateFarmerPartner, clickPartner, recyclePartner, SetSuccessClickPartner, SetSuccessRecyclePartner } from '../../../../js/farm_source'

import { PlayAudio, searchPartnerID } from '../Controller.js'

import {
    setMemberTask,
    setMemberAchiev_grow,

    setMemberBook_N,
    setLockMask_memberBookN,
    setMemberBook_NIntimacy,
    setMemberBook_SR,
    setLockMask_memberBookSR,
    setMemberBook_SRIntimacy,
    setMemberBook_SSR,
    setLockMask_memberBookSSR,
    setMemberBook_SSRIntimacy,
    setOwned_memberBookN,
    setOwned_memberBookSR,
    setOwned_memberBookSSR,
} from '../fakeSQL';

export default class character extends Phaser.GameObjects.Sprite {
    constructor(config) {
        super(config.scene, config.x, config.y, config.key, config.frame)
        config.scene.add.existing(this)

        this.setDepth(1)
        this.setOrigin(0.5, 0.8)

        this.stay = false // 是否要停留 
        this.rate = config.rate
        this.key = config.key
        this.frameIndex = config.frame // 紀錄小夥伴索引
        this.emotion = this.scene.add.sprite(0, 0, 'emotion', 0).setDepth(1)
        this.round = 0 // 走了幾圈
        this.totalTime = 0 // 測試走完一圈總時長
        this.direction = Phaser.Math.Between(0, 1) == 0 ? 'left' : 'right'; // 'left'(順時針),  'right'(逆時針)

        this.setInteractive().on('pointerup', function() {
            PlayAudio(this.scene, 'clickPartnerSE')

            this.input.enabled = false

            // SetSuccessClickPartner(successClickPartner, this);

            switch (this.key) {
                case 'player_N':
                    setOwned_memberBookN(this.frameIndex, true)
                        // clickPartner(searchPartnerID('N', this.frameIndex))
                    successClickPartner('N', this.frameIndex);
                    break;

                case 'player_SR':
                    setOwned_memberBookSR(this.frameIndex, true)
                        // clickPartner(searchPartnerID('SR', this.frameIndex))
                    successClickPartner('SR', this.frameIndex);
                    break;

                case 'player_SSR':
                    setOwned_memberBookSSR(this.frameIndex, true)
                        // clickPartner(searchPartnerID('SSR', this.frameIndex))
                    successClickPartner('SSR', this.frameIndex);
                    break;
            }

            setMemberTask(5, 1, true) // 回傳每日任務第5項(任務6)+1
            setMemberAchiev_grow(7, 1, true) // 回傳成就-成長第7項+1

            this.emotion.setFrame(1)

            this.scene.tweens.add({
                targets: this.emotion,
                scale: { from: 0.8, to: 1.2 },
                ease: 'Circ',
                yoyo: false,
                repeat: 2,
                duration: 400,
                onComplete: function() {
                    this.emotion.visible = false

                },
                callbackScope: this
            });
        }, this)

        // 主人不能點(不會消失)
        if (this.key == 'host') {
            this.removeInteractive()
            this.emotion.visible = false
        }

        this.createAnimation()
    }

    createAnimation() {
        this.scene.anims.create({
            key: 'shining',
            frames: this.scene.anims.generateFrameNumbers('shining', { start: 0, end: 3 }),
            frameRate: 6,
            repeat: 1,
            hideOnComplete: true
        });
        this.scene.anims.create({
            key: 'shining2',
            frames: this.scene.anims.generateFrameNumbers('shining', { start: 4, end: 7 }),
            frameRate: 6,
            repeat: 1,
            hideOnComplete: true
        });
        this.scene.anims.create({
            key: 'shining3',
            frames: this.scene.anims.generateFrameNumbers('shining', { start: 8, end: 11 }),
            frameRate: 6,
            repeat: 1,
            hideOnComplete: true
        });

        this.scene.anims.create({
            key: 'goDownLeft' + this.key + this.frameIndex,
            frames: this.scene.anims.generateFrameNumbers(this.key, { start: this.frameIndex * 12 + 0, end: this.frameIndex * 12 + 2 }),
            frameRate: 6,
            repeat: -1,
        });
        this.scene.anims.create({
            key: 'goDownRight' + this.key + this.frameIndex,
            frames: this.scene.anims.generateFrameNumbers(this.key, { start: this.frameIndex * 12 + 3, end: this.frameIndex * 12 + 5 }),
            frameRate: 6,
            repeat: -1,
        });
        this.scene.anims.create({
            key: 'goUpLeft' + this.key + this.frameIndex,
            frames: this.scene.anims.generateFrameNumbers(this.key, { start: this.frameIndex * 12 + 6, end: this.frameIndex * 12 + 8 }),
            frameRate: 6,
            repeat: -1,
        });
        this.scene.anims.create({
            key: 'goUpRight' + this.key + this.frameIndex,
            frames: this.scene.anims.generateFrameNumbers(this.key, { start: this.frameIndex * 12 + 9, end: this.frameIndex * 12 + 11 }),
            frameRate: 6,
            repeat: -1,
        });
    }

    startWalk() {
        this.path = this.createPath()
        this.points = this.path.getPoints(0.1)
        this.nextPoint(this, this.points, this.direction, this.rate, 0);
    }

    createPath() {
        var path = new Phaser.Curves.Path(150, 880); // 起(海邊)
        if (this.direction == 'right') {
            path // 逆時針
                .lineTo(450, 690) // 草屋門口_L
                .lineTo(570, 740) // o草屋
                .lineTo(590, 610) // 草屋門口_R
                .lineTo(710, 520) // 右
                .lineTo(440, 360) // o大門口_R
                .lineTo(620, 230) // 鐵路
                .lineTo(400, 100) // o車站
                .lineTo(420, 310) // 大門口_L
                .lineTo(220, 260) // o房子
                .lineTo(-170, 475) // 左
                .lineTo(200, 710) // 下
                .lineTo(150, 880); // 回 - 起(海邊)
        } else {
            path // 順時針
                .lineTo(200, 710) // 下
                .lineTo(-170, 475) // 左
                .lineTo(220, 260) // o房子
                .lineTo(420, 310) // 大門口_L
                .lineTo(400, 100) // o車站
                .lineTo(620, 230) // 鐵路
                .lineTo(440, 360) // o大門口_R
                .lineTo(710, 520) // 右
                .lineTo(590, 610) // 草屋門口_R
                .lineTo(570, 740) // o草屋
                .lineTo(450, 690) // 草屋門口_L
                .lineTo(150, 880); // 回 - 起(海邊)
        }

        return path
    }

    nextPoint(target, points, dir, rate, index) {
        if (index == points.length) {
            // console.log(this.totalTime / 1000)
            index = 0
            this.totalTime = 0
        }
        this.turnFace(dir, index, target)

        index++;
        var next = points[index % points.length];
        var dx = target.x - next.x;
        var dy = target.y - next.y;
        var speed = Math.sqrt(dx * dx + dy * dy) * rate;

        this.totalTime += Math.round(speed)

        this.scene.tweens.add({
            targets: target,
            x: next.x,
            y: next.y,
            ease: 'Linear',
            duration: speed,
            onUpdate: function() {
                this.emotion.setPosition(target.x, target.y - 90)
            },
            onComplete: function() {
                if (index == 12 && this.key != 'host') {
                    this.round++;

                    // 走完兩圈或已點擊
                    if (this.round == 2 || this.emotion.frame.name == 1) {
                        // SetSuccessRecyclePartner(successRecyclePartner, target)
                        this.destroySprite()
                        // switch (this.key) {
                        //     case 'player_N':
                        //         recyclePartner(searchPartnerID('N', this.frameIndex))
                        //         break;

                        //     case 'player_SR':
                        //         recyclePartner(searchPartnerID('SR', this.frameIndex))
                        //         break;

                        //     case 'player_SSR':
                        //         recyclePartner(searchPartnerID('SSR', this.frameIndex))
                        //         break;
                        // }
                        return
                    }
                } else {
                    target.isViewpoint(dir, index)
                }

                if (this.active == false) {
                    return
                }

                if (this.stay == true) {
                    target.stop()

                    var array = ['shining', 'shining2', 'shining3']
                    var rnd = Phaser.Math.Between(0, 2)
                    this.shining = this.scene.add.sprite(target.x, target.y - 20, 'shining', 0).setDepth(1)
                    this.shining.anims.play(array[rnd])
                    this.shining.on('animationcomplete', function() {
                        this.stay = false
                        this.turnFace(dir, index, target)
                        this.nextPoint(target, points, dir, rate, index)
                    }, this);
                } else {
                    this.nextPoint(target, points, dir, rate, index)
                }
            },
            callbackScope: this
        });
    }

    turnFace(dir, index, target) {
        if (dir == 'right') {
            switch (index) {
                case 0:
                case 2:
                case 3:
                case 5:
                    target.play('goUpRight' + this.key + this.frameIndex)
                    break

                case 4:
                case 6:
                case 8:
                    target.play('goUpLeft' + this.key + this.frameIndex)
                    break

                case 7:
                case 9:
                case 11:
                    target.play('goDownLeft' + this.key + this.frameIndex)
                    break

                case 1:
                case 10:
                    target.play('goDownRight' + this.key + this.frameIndex)
                    break
            }
        } else {
            switch (index) {
                case 0:
                case 2:
                    target.play('goUpRight' + this.key + this.frameIndex)
                    break

                case 1:
                case 4:
                case 10:
                    target.play('goUpLeft' + this.key + this.frameIndex)
                    break

                case 6:
                case 8:
                case 11:
                    target.play('goDownLeft' + this.key + this.frameIndex)
                    break

                case 3:
                case 5:
                case 7:
                case 9:
                    target.play('goDownRight' + this.key + this.frameIndex)
                    break
            }
        }
    }

    // 停留景點 : 草屋.門口_R.車站.房子
    isViewpoint(dir, point) {
        var rndStay = Phaser.Math.Between(0, 1) == 0 ? true : false;

        if (dir == 'right') {
            if (point == 2 || point == 5 || point == 7 || point == 9) {
                this.stay = rndStay
            }
        } else {
            if (point == 3 || point == 5 || point == 7 || point == 10) {
                this.stay = rndStay
            }
        }
    }

    destroySprite() {
        this.active = false

        this.emotion.visible = true
        this.emotion.setFrame(2)
        this.emotion.setPosition(this.x, this.y - 90)

        this.scene.time.addEvent({
            delay: 500,
            callback: function() {
                this.destroy()
                this.emotion.visible = false
            },
            callbackScope: this
        })
    }
}

// function successClickPartner() {
function successClickPartner(partnerCategory, partnerPicIndex) {
    // console.log('------successClickPartner ')
    // var partnerCategory = UpdateFarmerPartner.category
    // var partnerPicIndex = UpdateFarmerPartner.pic_index

    switch (partnerCategory) {
        case 'N':
            // setMemberBook_N(partnerPicIndex, UpdateFarmerPartner.status_value, false)
            // setLockMask_memberBookN(partnerPicIndex, UpdateFarmerPartner.lock_mask)
            setMemberBook_N(partnerPicIndex, 1, true)
            setLockMask_memberBookN(partnerPicIndex, true)
                // setMemberBook_NIntimacy(partnerPicIndex, UpdateFarmerPartner.lock_status)
            break;
        case 'SR':
            // setMemberBook_SR(partnerPicIndex, UpdateFarmerPartner.status_value, false)
            // setLockMask_memberBookSR(partnerPicIndex, UpdateFarmerPartner.lock_mask)
            setMemberBook_SR(partnerPicIndex, 1, true)
            setLockMask_memberBookSR(partnerPicIndex, true)
                // setMemberBook_SRIntimacy(partnerPicIndex, UpdateFarmerPartner.lock_status)
            break;
        case 'SSR':
            // setMemberBook_SSR(partnerPicIndex, UpdateFarmerPartner.status_value, false)
            // setLockMask_memberBookSSR(partnerPicIndex, UpdateFarmerPartner.lock_mask)
            setMemberBook_SSR(partnerPicIndex, 1, true)
            setLockMask_memberBookSSR(partnerPicIndex, true)
                // setMemberBook_SSRIntimacy(partnerPicIndex, UpdateFarmerPartner.lock_status)
            break;
    }
}

// function successRecyclePartner() {
//     console.log('------successRecyclePartner ')
//     console.log('這裡的this = target')
// }