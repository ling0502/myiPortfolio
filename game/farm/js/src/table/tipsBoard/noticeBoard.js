// import { buyLand, doSpeedUp, SpeedUpResult, SetSuccessBuyLand, SetSuccessDoSpeedUp } from '../../../../../js/farm_source.js'

import { btnClick, showTipsText, hideBoard, hideCover, PlayAudio, } from '../../Controller.js'

import { getMemberCoin, setMemberCoin, getMemberO2point, setMemberO2point, setMemberTask, getSeed_deadSec } from '../../fakeSQL';

var dialog;

export default class noticeBoard {

    create(scene, tipsType, isSmallBoard, cost, coinFrame, landID) {
        var config = [
            { key: 'bg_noticeBoard', url: './assets/bg_noticeBoard.png' },
        ]

        scene.load.image(config);
        scene.load.once('complete', function() {
            console.log('noticeBoard complete')
            if (isSmallBoard == true) {
                scene.smallBoard = this.getBoard(scene, tipsType, cost)
            } else {
                scene.board = this.getBoard(scene, tipsType, cost, coinFrame, landID)
            }
        }, this);

        scene.load.start();
    }


    getBoard(scene, tipsType, cost, coinFrame, landID) {
        PlayAudio(scene, 'warningSE')

        var memberCoin = getMemberCoin()
        var memberO2point = getMemberO2point()

        var frame;
        var expandCost;
        var visible;
        var tipsTitle;
        var tipsScript;

        switch (tipsType) {
            case 'newLand':
                frame = coinFrame
                expandCost = cost
                visible = true
                tipsTitle = '擴建土地'
                tipsScript = '是否解鎖新土地？'
                break
            case 'speedUp':
                frame = 1
                expandCost = cost
                visible = true
                tipsTitle = '加速作物'
                tipsScript = '是否縮短生長時間？'
                break
            case 'goMemberBag':
                frame = 0
                visible = false
                tipsTitle = '兌換成功'
                tipsScript = '是否前往會員背包查看？'
                break
            case 'goMemberStore':
                frame = 0
                visible = false
                tipsTitle = '前往儲值'
                tipsScript = '是否前往官網儲值頁面？'
                break
        }

        dialog = scene.rexUI.add.dialog({
                x: game.config.width / 2,
                y: game.config.height / 2,
                width: 400,
                height: 365,

                background: scene.add.image(0, 0, 'bg_noticeBoard'),

                title: scene.add.bitmapText(0, 0, 'farmText_Black', tipsTitle, 28),
                content: scene.add.bitmapText(0, 0, 'farmText_Black', tipsScript, 24),
                description: GetDescriptionSizer(scene, frame, expandCost, visible),

                actions: [
                    scene.add.sprite(0, 0, 'btn_no', 0),
                    scene.add.sprite(0, 0, 'btn_yes', 0),
                ],

                space: {
                    left: 0,
                    right: 0,
                    top: 110,
                    bottom: 0,

                    title: 25, // 與下方物件距離
                    content: 25, // 與下方物件距離
                    description: 30, // 與下方物件距離
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

        .on('button.click', function(button, groupName, index, pointer, event) {
            btnClick(scene, button, false)
                .on('complete', function() {
                    if (tipsType == 'goMemberStore') {
                        hideBoard(scene)
                        hideCover(scene)
                        scene.events.emit('releaseDrag'); // 至playScene接收
                    }

                    if (button.texture.key == 'btn_yes') {
                        console.log('noticeBoard - complete ' + tipsType)

                        // 各種框確認後的功能
                        switch (tipsType) {
                            case 'newLand':
                                // SetSuccessBuyLand(successBuyLand, scene)

                                if (frame == 0) {
                                    if (memberCoin >= parseInt(expandCost)) {
                                        // buyLand()
                                        successBuyLand(scene)
                                    } else {
                                        showTipsText(scene, '貓鑽不足')
                                    }
                                } else {
                                    if (memberO2point >= parseInt(expandCost)) {
                                        // buyLand()
                                        successBuyLand(scene)
                                    } else {
                                        showTipsText(scene, '歐兔幣不足')
                                    }
                                }
                                break
                            case 'speedUp':
                                if (memberO2point >= parseInt(expandCost)) {
                                    console.log('土地: ' + landID + ' 加速花費: ' + expandCost + '歐兔幣')

                                    // SetSuccessDoSpeedUp(successDoSpeedUp, scene)
                                    // doSpeedUp(expandCost, landID)
                                    successDoSpeedUp(scene, landID)
                                } else {
                                    showTipsText(scene, '歐兔幣不足')
                                }
                                break
                            case 'goMemberBag':
                                scene.events.emit('btn_close'); // 至UIScene 接收
                                window.location.replace('/member/pocket'); // 連接到商城頁-背包
                                break
                            case 'goMemberStore':
                                window.location.replace('/buycoins'); // 連接到儲值頁
                                break
                        }
                    } else { // 點擊取消按鈕
                        switch (tipsType) {
                            case 'speedUp':
                                scene.events.emit('cancelShortenGrowing'); // 至playScene接收
                                break
                        }

                    }
                })
        }, this)

        return dialog
    }
}
var GetDescriptionSizer = function(scene, frame, expandCost, visible) {
    var memberCoin = getMemberCoin()
    var memberO2point = getMemberO2point()
    var costTextFrame = 'farmText_Black'

    if (frame == 0) {
        if (expandCost > memberCoin) {
            costTextFrame = 'farmText_White'
        }
    } else {
        if (expandCost > memberO2point) {
            costTextFrame = 'farmText_White'
            console.log(expandCost + '>>>>>>>>>' + memberO2point)
        }
    }

    var coin = scene.add.sprite(0, 0, 'obj_coin', frame).setScale(0.3).setVisible(visible);
    var cost = scene.add.bitmapText(0, 0, costTextFrame, expandCost, 22).setVisible(visible).setTint(0xFF0000);

    return scene.rexUI.add.sizer({
        // width: undefined,
        // height: 80,
        orientation: 0,
        space: { left: -10, right: 0, top: 0, bottom: 0, item: 20 } // item : 兩物件之間的距離
    })

    .add(
        coin, // 遊戲對象
        0, // 比例 (0:與下一物件緊密對齊)
        'center', // 垂直對齊 (center ,left ,right ,top ,bottom)
        { left: 0 }, // 邊界 (left ,right ,top ,bottom))
        false, // 擴展 (寬度/高度)
        'coin' // 添加至map-key，可以讀取sizer.getElement(key)
    )

    .add(
        cost,
        0,
        'center', { left: 0 },
        false,
        'cost'
    )
}

function successBuyLand(t) {
    // console.log('------successBuyLand')
    // console.log('這裡的this = scene')

    var coinFrame = dialog.getElement('description').getElement('coin').frame.name
    var coinCost = dialog.getElement('description').getElement('cost').text

    // this.events.emit('openLand', { frame: coinFrame }) // 至playScene 接收
    // hideBoard(this)
    // hideCover(this)
    t.events.emit('openLand', { frame: coinFrame }) // 至playScene 接收
    hideBoard(t)
    hideCover(t)

    if (coinFrame == 0) {
        setMemberCoin(-coinCost, true)
    } else {
        setMemberO2point(-coinCost, true)
    }
    // this.updateMemberCoin()
    t.updateMemberCoin()

    // this.events.emit('releaseDrag'); // 至playScene接收
    t.events.emit('releaseDrag'); // 至playScene接收
}

function successDoSpeedUp(t, landID) {
    // console.log('------successDoSpeedUp')
    // console.log('這裡的this = scene')

    // hideBoard(this)
    // hideCover(this)
    hideBoard(t)
    hideCover(t)

    var coinCost = dialog.getElement('description').getElement('cost').text

    setMemberTask(7, coinCost, true) // 回傳每日任務第7項(任務8)

    setMemberO2point(-coinCost, true)
        // this.updateMemberCoin()
    t.updateMemberCoin()

    // this.events.emit('shortenGrowing', { landID: SpeedUpResult.location, nextTime: SpeedUpResult.next_sec }); // 至playScene接收
    // this.events.emit('releaseDrag'); // 至playScene接收
    t.events.emit('shortenGrowing', { landID: landID }); // 至playScene接收
    t.events.emit('releaseDrag'); // 至playScene接收
}