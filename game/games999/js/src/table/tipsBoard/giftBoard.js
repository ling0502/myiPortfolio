// import { exchangeGift, ExchangeGiftResult, SetSuccessExchangeGift, SetFailureExchangeGift } from '../../../../../js/farm_source.js';

import noticeBoard from './noticeBoard.js'

import { btnClick, showTipsText, hideSmallBoard, hideSmallCover, searchPlant_picID, searchProp_picID } from '../../Controller.js'
import { getMemberCrop, setMemberCrop, setMemberSeed, setMemberTool, getGiftID, getGiftRequire } from '../../fakeSQL.js'

var dialog;
var shopContainer;
var require;

// fakeSQL 不使用此標籤
export default class giftBoard {
    create(scene, index, data) {
        var config = [
            { key: 'bg_noticeBoard', url: '/games/farm/assets/bg_noticeBoard.png' },
        ]
        var config2 = [{
            key: 'obj_crop',
            url: '/games/farm/assets/obj_crop.png',
            frameConfig: { frameWidth: 120, frameHeight: 100, }
        }]

        scene.load.image(config);
        scene.load.spritesheet(config2);

        scene.load.once('complete', function() {
            console.log('giftBoard-complete')
            scene.smallBoard = getBoard(scene, index, data)
        }, scene);

        scene.load.start();
    }
}

var getBoard = function(scene, index, data) {
    shopContainer = data
    var giftID = getGiftID()[index]; // 獎勵ID
    require = getGiftRequire()[index]; // 兌獎條件

    dialog = scene.rexUI.add.dialog({
        x: scene.cameras.main.worldView.centerX, // 畫面拖動，位置仍在畫面正中間
        y: scene.cameras.main.worldView.centerY,
        width: 400,
        height: 365,

        background: scene.add.image(0, 0, 'bg_noticeBoard'),

        title: scene.add.bitmapText(0, 0, 'farmText_Black', '兌換獎品', 28),
        content: GetContentSizer(scene, require),
        description: scene.add.bitmapText(0, 0, 'farmText_Black', '是否換取？', 24),

        actions: [
            scene.add.sprite(0, 0, 'btn_no', 0),
            scene.add.sprite(0, 0, 'btn_yes', 0),
        ],

        space: {
            left: 0,
            right: 0,
            top: 110,
            bottom: 0,

            title: 15, // 與下方物件距離
            content: 15, // 與下方物件距離
            description: 27, // 與下方物件距離
            action: 70, // 兩物件距離
        },

        expand: {
            title: false,
            content: false,
            description: false,
        },
    })

    .layout()
        .setDepth(1)
        // .drawBounds(scene.add.graphics(), 0xff0000)

    scene.rexUI.add.click(dialog, { clickInterval: 100 })
        .on('click', function() {
            var btn
            if (scene.rexUI.isInTouching(dialog.getAction(0))) {
                btn = dialog.getAction(0)
            } else if (scene.rexUI.isInTouching(dialog.getAction(1))) {
                btn = dialog.getAction(1)
            }

            if (btn == undefined) return

            btnClick(scene, btn, false)
                .on('complete', function(tween, targets) {
                    if (targets[0].texture.key == 'btn_yes') {
                        // 會員背包增加(待改)

                        var item = dialog.getElement('content')

                        // 若有兌換條件不足
                        for (var i = 0; i < require.length; i++) {
                            if (item.getElement('num' + i).font == 'farmText_White') {
                                showTipsText(scene, '作物不足')
                                return
                            }
                            var itemIndex = item.getElement('goods' + i).frame.name
                            var itemInc = -parseInt(item.getElement('num' + i).text)

                            setMemberCrop(itemIndex, itemInc, true)
                        }

                        SetSuccessExchangeGift(successExchangeGift, scene)
                        SetFailureExchangeGift(failureExchangeGift, scene)
                        exchangeGift(giftID)
                    }
                }, scene);
        });

    return dialog
}

var GetContentSizer = function(scene, require) {
    var memberCrop = getMemberCrop()

    var fixText = scene.add.bitmapText(0, 0, 'farmText_Black', '需', 22);

    var requireSizer = scene.rexUI.add.sizer({
        // width: undefined,
        // height: 80,
        orientation: 0,
        space: { left: -10 }
    })

    .add(
        fixText, // 遊戲對象
    )

    for (var i = 0; i < require.length; i++) {
        var goodsFrame = searchPlant_picID(require[i].id)
        var goodsNum = require[i].num

        var goods = scene.add.sprite(0, 0, 'obj_crop', goodsFrame).setScale(0.5);
        var num = scene.add.bitmapText(0, 0, 'farmText_Black', goodsNum, 22);

        // 擁有作物數量不足
        if (memberCrop[goodsFrame] < goodsNum) {
            num.setFont('farmText_White') // 原本黑字無法setTint，要先改成白字
            num.setTint(0xFF0000)
        }

        requireSizer.add(
            goods, // 遊戲對象
            0, // 比例 (0:與下一物件緊密對齊)
            'center', // 垂直對齊 (center ,left ,right ,top ,bottom)
            { left: 0 }, // 邊界 (left ,right ,top ,bottom))
            false, // 擴展 (寬度/高度)
            'goods' + i // 添加至map-key，可以讀取sizer.getElement(key)
        )

        .add(
            num,
            0,
            'center', { left: -10 },
            false,
            'num' + i
        )
    }

    return requireSizer
}

function successExchangeGift() {
    console.log('------successExchangeGift')
    console.log('這裡的this = scene')
    hideSmallBoard(this)

    if (ExchangeGiftResult.can_exchange == false) {
        shopContainer.getElement('lockMask').setFrame(1)
    }

    if (ExchangeGiftResult.type == 3) {
        var prize = ExchangeGiftResult.real_release_prizes
        var prizeFrame

        for (var i = 0; i < prize.length; i++) {
            switch (prize[i].type) {
                case 'obj_coin':
                    prizeFrame = 0
                    this.events.emit('calculate', { coinInc: prize[i].num, O2pointInc: 0 })
                    break;

                case 'obj_seed':
                    prizeFrame = searchPlant_picID(prize[i].id)
                    setMemberSeed(prizeFrame, prize[i].num, true)
                    break;

                case 'obj_tool':
                    prizeFrame = searchProp_picID(prize[i].id)
                    setMemberTool(prizeFrame, prize[i].num, true)
                    break;
            }
        }
        hideSmallCover(this)
    } else {
        new noticeBoard().create(this, 'goMemberBag', true)
    }
}

function failureExchangeGift() {
    console.log('------failureExchangeGift')
    console.log('這裡的this = scene')

    showTipsText(this, '禮物數量不足')

    // 復原作物數量
    var item = dialog.getElement('content')
    for (var i = 0; i < require.length; i++) {
        var itemIndex = item.getElement('goods' + i).frame.name
        var itemInc = parseInt(item.getElement('num' + i).text)
        setMemberCrop(itemIndex, itemInc, true)
    }

    shopContainer.getElement('lockMask').setFrame(1)
}