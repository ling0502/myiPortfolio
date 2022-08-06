// import { sellPlant, sellProp, SetSuccessSellPlant, SetSuccessSellProp } from '../../../../../js/farm_source.js';

import { calucateSpace, updateCellItems } from '../warehouseTable'
import numberPad from './numberPad.js'

import { btnClick, hideSmallBoard, hideSmallCover, PlayAudio, searchPlantID,searchPropID } from '../../Controller.js'
import { setMemberTool, setMemberCrop, setMemberTask, setMemberAchiev_grow } from '../../fakeSQL.js'

var dialog;

export default class sellBoard {
    create(scene, data, labelType) {
        var config = [
            { key: 'bg_goodsBoard', url: './assets/bg_goodsBoard.png' },
        ]

        scene.load.image(config);
        scene.load.once('complete', function () {
            // console.log('sellBoard - complete')
            scene.smallBoard = getBoard(scene, data, labelType)
        }, scene);

        scene.load.start();
    }
}

var getBoard = function (scene, data, labelType) {
    var key = data.getElement('pic').texture.key
    var frameName = data.getElement('pic').frame.name
    var name = data.getElement('name').text
    var maxNum = data.getElement('num').text
    var unitPrice
    if (labelType == 'label_crop') {
        unitPrice = data.getElement('name').getElement('action').text
    } else if (labelType == 'label_tool') {
        unitPrice = data.getElement('name').getElement('action').text
    }

    dialog = scene.rexUI.add.dialog({
        x: game.config.width / 2,
        y: game.config.height / 2,
        width: 400,
        height: 365,

        background: scene.add.image(0, 0, 'bg_goodsBoard'),

        title: CreateTitleLabel(scene, key, frameName, name),

        content: CreateContentSizer(scene, maxNum, unitPrice),
        description: CreateDescriptionLabel(scene, maxNum * unitPrice),

        actions: [
            scene.add.sprite(0, 0, 'btn_no', 0),
            scene.add.sprite(0, 0, 'btn_yes', 0),
        ],

        space: {
            left: 0,
            right: 0,
            top: 20,
            bottom: 0,

            title: 50, // 與下方物件距離
            content: 15, // 與下方物件距離
            description: 10, // 與下方物件距離

            action: 70, // 兩物件距離
        },

        expand: {
            title: false,
            content: false,
            actions: false,
        },

        name: 'selling'
    })

        .layout()
    // .drawBounds(scene.add.graphics(), 0xff0000)

    dialog.getElement('content').getElement('num').getElement('text').setOrigin(0.5, 0)
    dialog.getElement('description').getElement('text').setOrigin(0.2, 0)

    scene.rexUI.add.click(dialog, { clickInterval: 100 })
        .on('click', function () {
            var btn

            if (scene.rexUI.isInTouching(dialog.getElement('content').getElement('num'))) {
                if (scene.newPad == undefined) {
                    scene.newPad = new numberPad().create(scene, dialog, maxNum, unitPrice)
                }
            } else if (scene.rexUI.isInTouching(dialog.getAction(0))) {
                btn = dialog.getAction(0)
            } else if (scene.rexUI.isInTouching(dialog.getAction(1))) {
                btn = dialog.getAction(1)
            } else {
                // 點到小框的任意處關閉數字鍵盤
                scaleDownPad(scene)

                if (scene.rexUI.isInTouching(dialog.getElement('content').getElement('btn_less'))) {
                    btn = dialog.getElement('content').getElement('btn_less')
                    updateNum('btn_less', maxNum, unitPrice)
                } else if (scene.rexUI.isInTouching(dialog.getElement('content').getElement('btn_add'))) {
                    btn = dialog.getElement('content').getElement('btn_add')
                    updateNum('btn_add', maxNum, unitPrice)
                }
            }

            if (btn != undefined) {
                btnClick(scene, btn)
                    .on('complete', function (tween, targets) {
                        // 如果有數字鍵盤，點選btn_no / btn_yes，才會同步關閉
                        scaleDownPad(scene)

                        if (targets[0].texture.key == 'btn_yes') {
                            PlayAudio(scene, 'coinSE')

                            // SetSuccessSellPlant(successSellPlant)
                            // SetSuccessSellProp(successSellProp)

                            // 倉庫數量(待改)
                            var coinInc = parseInt(dialog.getElement('description').getElement('text').text)
                            scene.events.emit('calculate', { coinInc: coinInc, O2pointInc: 0 }) // 至UIScene接收

                            setMemberTask(6, coinInc, true) // 回傳每日任務第6項(任務7)+增加數量
                            setMemberAchiev_grow(3, coinInc, true) // 回傳成就-成長第3項+增加數量

                            var itemIndex = dialog.getElement('title').getElement('background').frame.name
                            var itemInc = -parseInt(dialog.getElement('content').getElement('num').getElement('text').text)
                            if (labelType == 'label_crop') {
                                setMemberCrop(itemIndex, itemInc, true)
                                // sellPlant(searchPlantID(itemIndex), itemInc)
                            } else if (labelType == 'label_tool') {
                                setMemberTool(itemIndex, itemInc, true)
                                // sellProp(searchPropID(itemIndex), itemInc)
                            }

                            hideSmallBoard(scene)
                            hideSmallCover(scene)

                            // dialog.on('scaledown.complete', function () {
                            //     console.log('scaledown.complete')
                            calucateSpace()
                            updateCellItems()
                            // });
                        }
                    }, scene);
            }
        });

    return dialog
}

var CreateTitleLabel = function (scene, key, frameName, name) {
    return scene.rexUI.add.label({
        width: 150,
        height: 125,
        orientation: 1,
        background: scene.add.sprite(0, 0, key, frameName),
        text: scene.add.bitmapText(0, 0, 'farmText_Black', name, 22),
        align: 'bottom',

        space: {
            left: 0,
            right: 0,
            top: 0,
            bottom: -40,
        },
    })
}

var CreateContentSizer = function (scene, maxNum, unitPrice) {
    var btn_less = scene.add.sprite(0, 0, 'btn_less', 0)
    var btn_add = scene.add.sprite(0, 0, 'btn_add', 0)

    return scene.rexUI.add.sizer({
        width: 220,
        height: 35,
        orientation: 0,
        space: { left: 5, right: 0, top: 0, bottom: 0 }
    })

        .add(
            btn_less, //child
            0, // proportion
            'center', // align
            { left: 0 }, // padding
            false, // 擴展 (寬度/高度)
            'btn_less'
        )

        .add(
            CreateContentLabel(scene, maxNum, unitPrice),
            0,
            'center', { left: 0 },
            false,
            'num'
        )

        .add(
            btn_add,
            0,
            'center', { left: 0 },
            false,
            'btn_add'
        )
}

var updateNum = function (frame, maxNum, unitPrice) {
    var preNum = parseInt(dialog.getElement('content').getElement('num').getElement('text').text)
    var numText

    switch (frame) {
        case 'btn_less':
            if (preNum <= 1) {
                return
            }
            numText = preNum - 1
            break
        case 'btn_add':
            if (preNum >= maxNum) {
                return
            }
            numText = preNum + 1
            break
    }

    var costText = unitPrice * numText
    dialog.getElement('content').getElement('num').getElement('text').setText(numText)
    dialog.getElement('description').getElement('text').setText(costText)
}

var scaleDownPad = function (scene) {
    if (scene.newPad != undefined) {
        scene.newPad.scaleDownDestroy(100)
        scene.newPad = undefined
    }
}

var CreateContentLabel = function (scene, maxNum) {
    return scene.rexUI.add.label({
        width: 140,
        height: 35,
        orientation: 0,
        text: scene.add.bitmapText(0, 0, 'farmText_Black', maxNum, 22),
        space: { left: 70 }
    })
}

var CreateDescriptionLabel = function (scene, price) {
    return scene.rexUI.add.label({
        width: 220,
        height: 35,
        orientation: 0,
        icon: scene.add.sprite(0, 0, 'obj_coin', 0).setScale(0.3),
        text: scene.add.bitmapText(0, 0, 'farmText_Black', price, 22),

        space: {
            left: 130,
            right: 0,
            top: 0,
            bottom: 0,

            icon: 35
        },
    })
}

// function successSellPlant() {
//     console.log('------successSellPlant')
//     console.log('這裡的this = scene')
// }
// function successSellProp() {
//     console.log('------successSellProp')
//     console.log('這裡的this = scene')
// }