// import { buyCatCoin, SetSuccessBuyCatCoin } from '../../../../../js/farm_source.js';

import numberPad from './numberPad.js'

import { btnClick, showTipsText, hideBoard, hideCover, PlayAudio } from '../../Controller.js'
import { getRate_perO2toCoin, setMemberCoin, getMemberO2point, setMemberO2point, setMemberTask } from '../../fakeSQL';

var dialog;

export default class coinExchange {

    create(scene) {
        var config = [
            { key: 'bg_coinExchangeBoard', url: '/games/farm/assets/bg_coinExchangeBoard.png' },
        ]

        scene.load.image(config);
        scene.load.once('complete', function() {
            console.log('coinExchange-complete')
            scene.board = this.getBoard(scene)
        }, this);

        scene.load.start();
    }

    getBoard(scene) {
        var rate = getRate_perO2toCoin()
        var memberO2point = getMemberO2point()

        var maxNum = 9999 // 單次可兌換最大上限

        dialog = scene.rexUI.add.dialog({
            x: game.config.width / 2,
            y: game.config.height / 2,
            width: 400,
            height: 365,

            background: scene.add.image(0, 0, 'bg_coinExchangeBoard'),

            content: CreateContentSizer(scene, rate),
            description: CreateDescriptionLabel(scene, rate),

            actions: [
                scene.add.sprite(0, 0, 'btn_no', 0),
                scene.add.sprite(0, 0, 'btn_yes', 0),
            ],

            space: {
                left: 0,
                right: 0,
                top: 185,
                bottom: 0,

                title: 20, // 與下方物件距離
                content: 20, // 與下方物件距離
                description: 10, // 與下方物件距離
                contentLeft: 100,
                descriptionLeft: 110,
                action: 70, // 兩物件距離
            },

            expand: {
                title: false,
                content: false,
                action: false,
            },

            name: 'changing'
        })

        .layout()
            .setDepth(1)
            // .drawBounds(scene.add.graphics(), 0xff0000)

        if (memberO2point == 0) {
            dialog.getElement('content').getElement('num').getElement('text').setFont('farmText_White') // 原本黑字無法setTint，要先改成白字
            dialog.getElement('content').getElement('num').getElement('text').setTint(0xFF0000)
        }
        dialog.getElement('content').getElement('num').getElement('text').setOrigin(0.5, 0)
        dialog.getElement('description').getElement('text').setOrigin(0.3, 0)

        scene.rexUI.add.click(dialog, { clickInterval: 100 })
            .on('click', function() {
                var btn

                if (scene.rexUI.isInTouching(dialog.getElement('content').getElement('num'))) {
                    if (scene.newPad == undefined) {
                        scene.newPad = new numberPad().create(scene, dialog, maxNum, rate)
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
                        updateNum('btn_less', maxNum, rate, memberO2point)
                    } else if (scene.rexUI.isInTouching(dialog.getElement('content').getElement('btn_add'))) {
                        btn = dialog.getElement('content').getElement('btn_add')
                        updateNum('btn_add', maxNum, rate, memberO2point)
                    }
                }

                if (btn == undefined) return

                btnClick(scene, btn, false)
                    .on('complete', function(tween, targets) {
                        // 如果有數字鍵盤，點選btn_no / btn_yes，才會同步關閉
                        scaleDownPad(scene)

                        if (targets[0].texture.key == 'btn_yes') {
                            // var coinInc = parseInt(dialog.getElement('description').getElement('text').text)
                            var O2pointInc = -parseInt(dialog.getElement('content').getElement('num').getElement('text').text)

                            // SetSuccessBuyCatCoin(successBuyCatCoin, this)

                            if (dialog.getElement('content').getElement('num').getElement('text').font == 'farmText_White') {
                                showTipsText(scene, '歐兔幣不足')
                            } else {
                                PlayAudio(scene, 'coinSE')

                                // buyCatCoin(O2pointInc)
                                successBuyCatCoin(scene)
                            }
                        }
                    }, scene);
            });

        return dialog
    }
}
var CreateContentSizer = function(scene, rate) {
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
        CreateContentLabel(scene, rate),
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

var updateNum = function(frame, maxNum, rate, memberO2point) {
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

    var costText = rate * numText
    dialog.getElement('content').getElement('num').getElement('text').setText(numText)
    dialog.getElement('description').getElement('text').setText(costText)

    if (numText > memberO2point) {
        dialog.getElement('content').getElement('num').getElement('text').setFont('farmText_White') // 原本黑字無法setTint，要先改成白字
        dialog.getElement('content').getElement('num').getElement('text').setTint(0xFF0000)
    } else {
        dialog.getElement('content').getElement('num').getElement('text').setFont('farmText_Black')
    }
}

var scaleDownPad = function(scene) {
    if (scene.newPad != undefined) {
        scene.newPad.scaleDownDestroy(100)
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

var CreateDescriptionLabel = function(scene, price) {
    return scene.rexUI.add.label({
        width: 220,
        height: 35,
        orientation: 0,
        text: scene.add.bitmapText(0, 0, 'farmText_Black', price, 22),

        space: { left: 130, right: 0, top: 0, bottom: 0, },
    })
}

function successBuyCatCoin(t) {
    // console.log('------successBuyCatCoin ')
    // console.log('這裡的this = scene')

    var coinInc = parseInt(dialog.getElement('description').getElement('text').text)
    var O2pointInc = parseInt(dialog.getElement('content').getElement('num').getElement('text').text)

    // hideBoard(this)
    // hideCover(this)
    hideBoard(t)
    hideCover(t)

    setMemberTask(7, O2pointInc, true) // 回傳每日任務第7項(任務8)

    setMemberCoin(coinInc, true)
    setMemberO2point(-O2pointInc, true)
    // this.updateMemberCoin()
    t.updateMemberCoin()

    // this.releaseUIbtn()
    // this.events.emit('releaseDrag'); // 至playScene接收
    t.releaseUIbtn()
    t.events.emit('releaseDrag'); // 至playScene接收
}