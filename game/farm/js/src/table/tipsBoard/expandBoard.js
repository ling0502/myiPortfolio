// import { buyWarehouse, SetSuccessBuyWarehouse } from '../../../../../js/farm_source.js';

import { btnClick, showTipsText, hideSmallBoard, hideSmallCover } from '../../Controller.js'
import {
    getMemberCoin,
    getMemberO2point,
    getMemberSpace,
    setMemberSpace,
    shiftNewSpace_limitLV,
    shiftNewSpace_coinNum,
    shiftNewSpace_O2pointNum
} from '../../fakeSQL';


var dialog;
var warehouseBoard;
export default class expandBoard {

    create(scene, data, coinFrame, coinType) {
        var config = [
            { key: 'bg_expandBoard', url: './assets/bg_expandBoard.png' },
        ]

        scene.load.image(config);
        scene.load.once('complete', function() {
            // console.log('expandBoard - complete')
            scene.smallBoard = getBoard(scene, data, coinFrame, coinType)
        }, scene);

        scene.load.start();
    }
}

var getBoard = function(scene, data, coinFrame, coinType) {
    warehouseBoard = data
        // 擴充花費+判斷幣別 (待改-資料庫)
    var distance = 10
    var ownSpace = getMemberSpace()
    var memberCoin = getMemberCoin()
    var memberO2point = getMemberO2point()
    var cost = coinType[0]
    var fontType = 'farmText_Black'

    if (ownSpace < 10) {
        distance = 50
    }

    if (coinFrame == 0 && cost > memberCoin) {
        fontType = 'farmText_White'
    } else if (coinFrame == 1 && cost > memberO2point) {
        fontType = 'farmText_White'
    }


    dialog = scene.rexUI.add.dialog({
        x: game.config.width / 2,
        y: game.config.height / 2,
        width: 400,
        height: 365,

        background: scene.add.image(0, 0, 'bg_expandBoard'),

        toolbar: [
            createLabel(scene, ownSpace), // 待資料庫(待改)
            createLabel(scene, ownSpace + 1), // 待資料庫(待改)
        ],

        content: GetContentSizer(scene, coinFrame, cost, fontType), // 待資料庫(待改)

        actions: [
            scene.add.sprite(0, 0, 'btn_no', 0),
            scene.add.sprite(0, 0, 'btn_yes', 0),
        ],

        space: {
            left: 0,
            right: 0,
            top: 110,
            bottom: 0,

            title: 40, // 與下方物件距離
            content: 35, // 與下方物件距離
            contentLeft: 60,

            toolbarItem: distance, // 兩物件距離
            action: 70, // 兩物件距離
        },

        expand: {
            title: false,
            content: false,
            action: false,
        },
    })

    .layout()
        // .drawBounds(scene.add.graphics(), 0xff0000)

    scene.rexUI.add.click(dialog, { clickInterval: 100 })
        .on('click', function() {
            var btn

            if (scene.rexUI.isInTouching(dialog.getAction(0))) {
                btn = dialog.getAction(0)
            } else if (scene.rexUI.isInTouching(dialog.getAction(1))) {
                btn = dialog.getAction(1)
            }

            if (btn != undefined) {
                btnClick(scene, btn, false)
                    .on('complete', function(tween, targets) {
                        if (targets[0].texture.key == 'btn_yes') {

                            // SetSuccessBuyWarehouse(successBuyWarehouse, scene)

                            // 扣錢(貓鑽)
                            if (coinFrame == 0) {
                                if (dialog.getElement('content').getElement('text').font == 'farmText_White') {
                                    showTipsText(scene, '貓鑽不足')
                                    return
                                } else {
                                    // buyWarehouse()
                                    successBuyWarehouse(scene)
                                }
                            } // 扣錢(歐兔幣)
                            else if (coinFrame == 1) {
                                if (dialog.getElement('content').getElement('text').font == 'farmText_White') {
                                    showTipsText(scene, '歐兔幣不足')
                                    return
                                } else {
                                    // buyWarehouse()
                                    successBuyWarehouse(scene)
                                }
                            }
                        }
                    }, scene);
            }
        })

    return dialog
}

var createLabel = function(scene, text) {
    return scene.rexUI.add.label({
        // width: undefined,
        height: 70,

        text: scene.add.bitmapText(0, 0, 'farmText_Black', text, 40),
        space: { left: 100, right: 0, top: 0, bottom: 0 }
    });
}

var GetContentSizer = function(scene, coinType, costNum, fontType) {
    return scene.rexUI.add.label({
        width: 180,
        height: 35,
        orientation: 0,
        icon: scene.add.sprite(0, 0, 'obj_coin', coinType).setScale(0.25),
        text: scene.add.bitmapText(0, 0, fontType, costNum, 22).setTint(0xFF0000),
        space: { left: 10, right: 0, top: 0, bottom: 0, icon: 35 },
    })
}

function successBuyWarehouse(t) {
    // console.log('------successBuyWarehouse')
    // console.log('這裡的this = scene')

    var coinFrame = dialog.getElement('content').getElement('icon').frame.name
    var newOwnSpace = getMemberSpace() + 1
    warehouseBoard.getAction(0).getElement('action').setText(newOwnSpace)
    setMemberSpace(newOwnSpace)

    if (coinFrame == 0) { // 扣貓幣
        shiftNewSpace_coinNum()
        shiftNewSpace_limitLV()

        var coinInc = -parseInt(dialog.getElement('content').getElement('text').text)
        // this.events.emit('calculate', { coinInc: coinInc, O2pointInc: 0 })
        t.events.emit('calculate', { coinInc: coinInc, O2pointInc: 0 })
    } else { // 扣歐兔幣
        shiftNewSpace_O2pointNum()

        var O2pointInc = -parseInt(dialog.getElement('content').getElement('text').text)
        // this.events.emit('calculate', { coinInc: 0, O2pointInc: O2pointInc })
        t.events.emit('calculate', { coinInc: 0, O2pointInc: O2pointInc })
    }

    // hideSmallBoard(this)
    // hideSmallCover(this)
    hideSmallBoard(t)
    hideSmallCover(t)
}