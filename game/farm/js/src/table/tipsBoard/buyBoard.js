// import { buyProp, buySeed } from '../../../../../js/farm_source.js';

import numberPad from './numberPad.js'

import { btnClick, showTipsText, hideSmallBoard, hideSmallCover, updateMemberNum, PlayAudio, searchPlantID, searchPropID } from '../../Controller.js'
import { getMemberCoin, setMemberTask } from '../../fakeSQL';

var dialog;

export default class buyBoard {
    create(scene, data) {
        var config = [
            { key: 'bg_goodsBoard', url: './assets/bg_goodsBoard.png' },
        ]

        scene.load.image(config);
        scene.load.once('complete', function() {
            console.log('buyBoard-complete')
            scene.smallBoard = getBoard(scene, data)
        }, scene);

        scene.load.start();
    }
}

var getBoard = function(scene, data) {
    var memberCoin = getMemberCoin()

    var key = data.getElement('pic').texture.key
    var frameName = data.getElement('pic').frame.name
    var name = data.getElement('name').text
    var maxNum = 999
    var unitPrice = data.getElement('costSizer').getElement('cost').text

    dialog = scene.rexUI.add.dialog({
        x: game.config.width / 2,
        y: game.config.height / 2,
        width: 400,
        height: 365,

        background: scene.add.image(0, 0, 'bg_goodsBoard'),

        title: CreateTitleLabel(scene, key, frameName, name),

        content: CreateContentSizer(scene, unitPrice),
        description: CreateDescriptionLabel(scene, unitPrice),

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

        name: 'buying'
    })

    .layout()
        .setDepth(1)
        // .drawBounds(scene.add.graphics(), 0xff0000)

    if (unitPrice > memberCoin) {
        dialog.getElement('description').getElement('text').setFont('farmText_White') // 原本黑字無法setTint，要先改成白字
        dialog.getElement('description').getElement('text').setTint(0xFF0000)
    }
    dialog.getElement('content').getElement('num').getElement('text').setOrigin(0.5, 0)
    dialog.getElement('description').getElement('text').setOrigin(0.2, 0)

    scene.rexUI.add.click(dialog, { clickInterval: 100 })
        .on('click', function() {
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
                    updateNum('btn_less', unitPrice, memberCoin)
                } else if (scene.rexUI.isInTouching(dialog.getElement('content').getElement('btn_add'))) {
                    btn = dialog.getElement('content').getElement('btn_add')
                    updateNum('btn_add', unitPrice, memberCoin)
                }
            }


            if (btn == undefined) return

            btnClick(scene, btn)
                .on('complete', function(tween, targets) {
                    // 如果有數字鍵盤，點選btn_no / btn_yes，才會同步關閉
                    scaleDownPad(scene)

                    if (targets[0].texture.key == 'btn_yes') {
                        if (dialog.getElement('description').getElement('text').font == 'farmText_White') {
                            showTipsText(scene, '貓鑽不足')
                        } else {
                            var buyItem = dialog.getElement('title').getElement('background')
                            var coinInc = -parseInt(dialog.getElement('description').getElement('text').text)
                            var numInc = parseInt(dialog.getElement('content').getElement('num').getElement('text').text)

                            var isEnough = true

                            // 購買道具會有爆倉問題 (道具改不佔用倉庫空間)
                            // if (buyItem.texture.key == 'obj_tool') {
                            //     isEnough = checkSpace(buyItem, numInc)
                            // }

                            // 有足夠倉庫空間
                            if (isEnough) {
                                PlayAudio(scene, 'coinSE')

                                switch (buyItem.texture.key) {
                                    case 'obj_tool':
                                        // buyProp(searchPropID(buyItem.frame.name), numInc)
                                        setMemberTask(3, numInc, true) // 回傳每日任務第3項(任務4)+增加數量
                                        break;

                                    case 'obj_seed':
                                        // buySeed(searchPlantID(buyItem.frame.name), numInc)
                                        setMemberTask(4, numInc, true) // 回傳每日任務第4項(任務5)+增加數量
                                        break;
                                }
                                updateMemberNum(scene, buyItem, numInc)
                                scene.events.emit('calculate', { coinInc: coinInc, O2pointInc: 0 })

                                hideSmallBoard(scene)
                                hideSmallCover(scene)
                            } else {
                                showTipsText(scene, '倉庫空間不足')
                            }
                        }
                    }
                }, scene);
        });

    return dialog
}

var CreateTitleLabel = function(scene, key, frameName, name) {
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

var CreateContentSizer = function(scene, unitPrice) {
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
        CreateContentLabel(scene, unitPrice),
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

var updateNum = function(frame, unitPrice, memberCoin) {
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
            numText = preNum + 1
            break
    }

    var costText = unitPrice * numText
    dialog.getElement('content').getElement('num').getElement('text').setText(numText)
    dialog.getElement('description').getElement('text').setText(costText)

    // 如果購買金額大於"財產" -> 變紅字
    if (costText > memberCoin) {
        dialog.getElement('description').getElement('text').setFont('farmText_White') // 原本黑字無法setTint，要先改成白字
        dialog.getElement('description').getElement('text').setTint(0xFF0000)
    } else {
        dialog.getElement('description').getElement('text').setFont('farmText_Black')
    }
}

var scaleDownPad = function(scene) {
    if (scene.newPad != undefined) {
        scene.newPad.setVisible(false)
        scene.newPad = undefined
    }
}

var CreateContentLabel = function(scene) {
    return scene.rexUI.add.label({
        width: 140,
        height: 35,
        orientation: 0,
        text: scene.add.bitmapText(0, 0, 'farmText_Black', '1', 22),
        space: { left: 70 }
    })
}

var CreateDescriptionLabel = function(scene, unitPrice) {
    return scene.rexUI.add.label({
        width: 220,
        height: 35,
        orientation: 0,
        icon: scene.add.sprite(0, 0, 'obj_coin', 0).setScale(0.3),
        text: scene.add.bitmapText(0, 0, 'farmText_Black', unitPrice, 22),

        space: {
            left: 130,
            right: 0,
            top: 0,
            bottom: 0,

            icon: 35
        },
    })
}