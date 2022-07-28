// import {
//     PlantPicIndexData,
//     PlantIdData,
//     PropPicIndexData,
//     PropIdData,
//     PartnerIdData,
//     AchieveCategoryData,
//     FarmerAchieveData,
//     DailyMissionData,
// } from '../../../js/farm_source'

import {
    getLimit_perSpaceNum,
    setMemberCoin,
    getMemberSpace,
    getMemberTool,
    setMemberTool,
    setMemberSeed,
    getMemberCrop,
    setMemberCrop
} from '../src/fakeSQL.js'

export function btnClick(t, btn, doComplete) {
    console.log('---btnClick--')
    PlayAudio(t, 'clickSE');

    var key = undefined
    if (btn.type == 'Sprite') {
        key = btn.texture.key
    }

    return t.tweens.add({
        targets: btn,
        scaleX: { from: 0.8, to: 1 },
        scaleY: { from: 0.8, to: 1 },
        duration: 100,
        ease: 'Bounce.Out',
        callbackScope: this,
        onComplete: function() {
            switch (key) {
                case 'btn_close':
                    if (doComplete == false) return
                    console.log('btn_close - emit close')

                    if (t.smallBoard != undefined) {
                        hideSmallBoard(t)
                        hideSmallCover(t)
                    } else {
                        t.events.emit('btn_close'); // 至UIScene 接收
                    }
                    break

                case 'btn_QA':
                    btn.rexContainer.parent.getElement('btn_QA').setInteractive()
                        // 出現小框時大框變暗
                    var dialog = btn.rexContainer.parent.rexContainer.parent
                    t.smallCover = t.add.sprite(dialog.x + 1, dialog.y - 5, 'smallCover')

                    if (btn.rexContainer.parent.name == 'book') {
                        t.events.emit('showTeach', { page: 2 }); // 至UIScene接收
                    } else if (btn.rexContainer.parent.name == 'warehouse') {
                        t.events.emit('showTeach', { page: 3 }); // 至UIScene接收
                    }
                    break

                case 'btn_no':
                    if (t.sys.config == 'UI') { // 土地擴建/貓鑽兌換/歐兔幣儲值
                        hideBoard(t)
                        hideCover(t)
                        t.releaseUIbtn()
                    } else if (t.sys.config == 'loadObjects') {
                        hideSmallBoard(t)
                        hideSmallCover(t)
                    }
                    t.events.emit('releaseDrag'); // 至playScene接收
                    break

                case 'btn_yes':
                    if (doComplete == false) return

                    console.log('btn_yes - releaseDrag')

                    t.events.emit('releaseDrag'); // UIScene至playScene接收
                    break
            }
        }
    })
}

export function showTipsText(t, text) {
    var x = t.cameras.main.midPoint.x
    var y = t.cameras.main.midPoint.y
    var width = text.length * 20 + 20

    var textContainer = t.add.container(x - width / 2, y).setDepth(1)

    var graphics = t.add.graphics()
    graphics.fillStyle(0x000000, 0.6);
    graphics.fillRoundedRect(0, 0, width, 35, 10);
    textContainer.add(graphics)

    var tipText = t.add.bitmapText(10, 5, 'farmText_White', text, 20)
    textContainer.add(tipText)

    t.tweens.add({
        targets: textContainer,
        y: textContainer.y - 50,
        alpha: 0,
        ease: 'Linear',
        duration: 800,
    });
}

export function showBoard(t, target) {
    t.tweens.add({
        targets: target,
        scaleX: { from: 0.8, to: 1 },
        scaleY: { from: 0.8, to: 1 },
        ease: 'Back',
        duration: 400,
    });
}

export function showCover(t) {
    if (t.cover == undefined) {
        t.cover = t.add.sprite(0, 0, 'cover').setOrigin(0, 0).setDepth(1)
    }
    t.events.emit('lockLand'); // 至playScene接收
}

export function hideBoard(t) {
    if (t.board != undefined) {
        if (t.board.type == 'rexDialog') {
            t.board.scaleDownDestroy(100);
        } else if (t.board.type == 'rexScrollablePanel') {
            t.board.moveToDestroy(200, undefined, t.y);
        }
        t.board = undefined;
    }
}

export function hideCover(t) {
    if (t.cover != undefined) {
        t.cover.setVisible(false)
        t.cover = undefined
    }
    t.events.emit('releaseLand'); // 至playScene接收
}

export function hideSmallBoard(t) {
    if (t.smallBoard != undefined) {
        t.smallBoard.scaleDownDestroy(100)
        t.smallBoard = undefined
    }
}

export function hideSmallCover(t) {
    if (t.smallCover != undefined) {
        t.smallCover.setVisible(false)
        t.smallCover = undefined
    }
}

export function rewardCollection(t, reward, rewardNum) {
    var key = reward.texture.key
    var frame = reward.frame.name

    var product = t.add.sprite(reward.x, reward.y - 40, key, frame)
    product.setScale(0.5)

    var coinX = t.cameras.main.midPoint.x - 70
    var coinY = t.cameras.main.midPoint.y - 320
    var warehouseX = t.cameras.main.midPoint.x + 140
    var warehouseY = t.cameras.main.midPoint.y + 320
    var targetX
    var targetY

    if (key == 'obj_coin') {
        targetX = coinX
        targetY = coinY
    } else {
        targetX = warehouseX
        targetY = warehouseY
    }

    var dist = Phaser.Math.Distance.Between(product.x, product.y - 30, targetX, targetY);

    var timeline = t.tweens.createTimeline();
    timeline.add({
        targets: product,
        y: '-=15',
        duration: 300,
        ease: 'Back',
    })
    timeline.add({
        targets: product,
        x: { from: product.x, to: targetX },
        y: { from: product.y - 30, to: targetY },
        duration: dist * 1.2,
        onComplete: function() {
            product.destroy();
        }
    })
    timeline.play();

    updateMemberNum(t, reward, rewardNum)
}

export function updateMemberNum(t, reward, rewardNum) {
    var key = reward.texture.key
    var frame = reward.frame.name
    var parsed = parseInt(rewardNum)

    switch (key) {
        case 'obj_coin':
            if (t.sys.config == 'loadObjects') {
                t.events.emit('calculate', { coinInc: parsed, O2pointInc: 0 })
            } else if (t.sys.config == 'UI') {
                setMemberCoin(parsed, true)

                t.updateMemberCoin()
            }
            break;

        case 'obj_seed':
            setMemberSeed(frame, parsed, true)
            break;

        case 'obj_tool':
            setMemberTool(frame, parsed, true)
            break;

        case 'obj_crop': // 土地收成
            setMemberCrop(frame, parsed, true)
            break;
    }
}

export function checkSpace(reward, rewardNum) {
    var totalSpace = 0 // 總占用格數
    var memberSpace = getMemberSpace()
    var perSpaceNum = getLimit_perSpaceNum()

    console.log(getMemberCrop())
    console.log(getMemberTool())

    // 作物 & 道具占用倉庫空間
    // var labelArray = [getMemberCrop, getMemberTool]
    // for (var i = 0; i < labelArray.length; i++) {
    //     for (var j = 0; j < labelArray[i]().length; j++) {
    //         if (labelArray[i]()[j] == 0) continue

    //         if (labelArray[i]()[j] > perSpaceNum) {
    //             totalSpace += Math.ceil(labelArray[i]()[j] / perSpaceNum)
    //         } else {
    //             totalSpace++
    //         }
    //     }
    // }

    // 僅作物占用倉庫空間
    var memberCrop = getMemberCrop()
    for (var j = 0; j < memberCrop.length; j++) {
        if (memberCrop[j] == 0) continue

        if (memberCrop[j] > perSpaceNum) {
            totalSpace += Math.ceil(memberCrop[j] / perSpaceNum)
        } else {
            totalSpace++
        }
    }

    var originNum = 0
    var key = reward.texture.key
    var frame = reward.frame.name
    var parsed = parseInt(rewardNum)

    // 僅作物占用倉庫空間
    var originNum = memberCrop[frame]

    // 作物 & 道具占用倉庫空間
    // switch (key) {
    //     case 'obj_crop': // 土地收成
    //         originNum = labelArray[0]()[frame]
    //         break;

    //     case 'obj_tool':
    //         originNum = labelArray[1]()[frame]
    //         break;
    // }

    var occupiedQty = Math.ceil(originNum / perSpaceNum) // 原本已占用格數
    var calculated = originNum + parsed
    var empty = memberSpace - totalSpace // 剩餘空間

    console.log('totalSpace: ' + totalSpace + ' / memberSpace: ' + memberSpace)
    console.log('originNum: ' + originNum + ' / calculated: ' + calculated + ' / occupiedQty ' + occupiedQty)

    // 剛好滿倉狀態 & 原本存在倉庫
    if (totalSpace == memberSpace && originNum > 0) {
        console.log('calculated: ' + calculated + ' <= ' + (perSpaceNum * occupiedQty))
        if (calculated <= perSpaceNum * occupiedQty) { // 尚可堆疊
            return true
        } else {
            return false
        }
    } // 倉庫尚有空間
    else if (totalSpace < memberSpace) {
        // 原本存在倉庫剩餘空間要補上已占用格數
        if (originNum > 0 && calculated <= (empty + occupiedQty) * perSpaceNum) {
            return true
        } else if (originNum <= 0 && calculated <= empty * perSpaceNum) {
            return true
        } else {
            return false
        }
    } else {
        return false
    }
}

export function PlayAudio(t, music) {
    var soundFx = t.sound.add(music);
    try {
        soundFx.play();
    } catch (e) {}
}

export function showLoadingAnimation(t) {
    console.log(t)
    t.anims.create({
        key: 'connecting',
        frames: t.anims.generateFrameNumbers('connecting', { start: 0, end: 4 }),
        frameRate: 6,
        repeat: -1,
    });
    t.loadingAnimation = t.add.sprite(game.config.width / 2, game.config.height / 2, 'connecting', 0).setDepth(1)
    t.loadingAnimation.anims.play('connecting')
}

export function searchPlantID(picIndex) {
    return PlantIdData[picIndex]
}
export function searchPlant_picID(plantID) {
    return PlantPicIndexData[plantID]
}

export function searchPropID(picIndex) {
    return PropIdData[picIndex]
}
export function searchProp_picID(propID) {
    return PropPicIndexData[propID]
}

export function searchAchievStageID(category, achievIndex) {
    return FarmerAchieveData[AchieveCategoryData[category]][achievIndex].stage_id
}

export function searchTaskStageID(taskIndex) {
    return DailyMissionData[taskIndex].mission_id
}

export function searchPartnerID(category, partnerIndex) {
    return PartnerIdData[category][partnerIndex]
}