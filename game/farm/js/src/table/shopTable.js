// import { GiftData, getGiftData, SetSuccessGetGiftData } from '../../../../js/farm_source.js';

import buyBoard from './tipsBoard/buyBoard.js'
import giftBoard from './tipsBoard/giftBoard.js'

import { btnClick, showBoard } from '../Controller.js'
import {
    getMemberLV,

    getToolName,
    getCropName,
    getGiftName,
    getGiftUrl,
    getGiftLeftHours,
    setGiftLeftHours,
    getGiftLeftNum,
    setGiftLeftNum,

    getBuyPrice_tool,
    getBuyPrice_seed,

    getSeed_growSecLV2,
    getSeed_growSecLV3,
    getSeed_deadSec,
    getSeed_limitLV,
} from '../fakeSQL.js';

var dialog;
var preLabel;
var timeInfoSizer;
export default class shopTable {
    create(scene) {
        // if (GiftData.length > 0) {
        //     var giftUrlData = getGiftUrl()
        //     for (var i = 0; i < GiftData.length; i++) {
        //         var originID = GiftData[i].id;
        //         if (scene.textures.exists('giftImg' + i)) continue
        //         scene.textures.addBase64('giftImg' + i, giftUrlData[originID]);
        //     }
        // }

        dialog = scene.rexUI.add.dialog({
                x: game.config.width / 2,
                y: game.config.height / 2 - 10,
                width: 500,
                height: 565,

                background: scene.add.sprite(0, 0, 'bg_table'),

                title: GetTitleSizer(scene),

                description: scene.rexUI.add.tabs({
                        x: game.config.width / 2,
                        y: game.config.height / 2,
                        scrollMode: 0,

                        panel: scene.rexUI.add.gridTable({
                            // width: 480,
                            // height: 390,
                            background: scene.add.sprite(0, 0, 'bg_rect'),
                            scrollMode: 0,

                            table: {
                                // 捲動表格大小
                                width: 460, // gridTable.width - gridTable.space.left & right
                                height: 370, // gridTable.height - gridTable.space.top & bottom

                                // 捲動欄位大小
                                cellWidth: 155, // Width of each cell + padding between two cell
                                cellHeight: 190, // Height of each cell + padding between two cell

                                // 捲動欄位數
                                columns: 3,
                            },

                            createCellContainerCallback: function(cell, cellContainer) {
                                var scene = cell.scene,
                                    width = 150, // Width of this cell
                                    height = 175, // Height of this cell
                                    item = cell.item,
                                    index = cell.index;
                                if (cellContainer === null) {
                                    cellContainer = createRowItem(scene);
                                    // console.log(cell.index + ': create new cell-container');
                                } else {
                                    // console.log(cell.index + ': reuse cell-container');
                                }

                                cellContainer.setMinSize(width, height); // Size might changed in this demo
                                cellContainer.getElement('name').setText(item.name);

                                if (item.type == 'obj_gift') {
                                    cellContainer.getElement('pic').setTexture('giftImg' + item.frame);
                                    cellContainer.getElement('costSizer').getElement('coin').destroy();
                                    var day = parseInt(item.price / 24).toString().padStart(2, '0')
                                    var hour = parseInt(item.price % 24).toString().padStart(2, '0')
                                    cellContainer.getElement('costSizer').getElement('cost').setText(day + '日' + hour + '時');
                                } else {
                                    cellContainer.getElement('pic').setTexture(item.type, item.frame);
                                    cellContainer.getElement('costSizer').getElement('cost').setText(item.price);
                                }

                                if (item.isOpened) {
                                    cellContainer.getElement('lockMask').setFrame(2);
                                } else if (item.type == 'obj_gift') {
                                    cellContainer.getElement('lockMask').setFrame(1);
                                } else {
                                    cellContainer.getElement('lockMask').setFrame(0);
                                }

                                return cellContainer;
                            },

                            space: {
                                left: 10,
                                right: 10,
                                top: 10,
                                bottom: 10,
                            },
                        }),

                        topButtons: [
                            CreateHeaderButton(scene, 'label_seed', 15),
                            CreateHeaderButton(scene, 'label_tool', 5),
                            // CreateHeaderButton(scene, 'label_timeLimit', GiftData.length),
                        ],

                        space: {
                            left: 10,
                            right: 10,
                        },
                    })
                    .layout(),


                // 擴展(延伸填滿)
                expand: {
                    title: false,
                    content: false,
                    description: false,
                },

                align: {
                    title: 'center',
                    description: 'center',
                },
            })
            .layout()
            // .drawBounds(scene.add.graphics(), 0xff0000)

        var items = getItems(15, 'label_seed');

        // if (GiftData.length == 0) {
        //     dialog.getElement('description').hideButton('top', 2);
        // }

        // 預設顯示標籤
        preLabel = dialog.getElement('description').getTopButton(0);
        dialog.getElement('description').getTopButton(0).getElement('background').setFrame(0);
        dialog.getElement('description').getElement('panel').setItems(items).scrollToTop();

        // Grid table
        dialog.getElement('description').getElement('panel')
            .on('cell.down', function(cellContainer, cellIndex) {
                hideInfoLabel()
            }, scene)

        .on('cell.click', function(cellContainer, cellIndex) {
            if (this.smallCover != undefined) {
                return
            }

            if (cellContainer.getElement('lockMask').frame.name != 2) {
                return
            }

            if (scene.rexUI.isInTouching(cellContainer.getElement('pic'))) {
                if (preLabel.getElement('background').texture.key == 'label_seed') {
                    createInfoLabel(scene, cellContainer.getElement('pic'))
                }

            } else if (scene.rexUI.isInTouching(cellContainer.getElement('costSizer'))) {
                btnClick(scene, cellContainer.getElement('costSizer'))
                    .on('complete', function(tween, targets) {
                        // 出現小框時大框變暗
                        scene.smallCover = scene.add.sprite(dialog.x + 1, dialog.y - 5, 'smallCover')

                        var identifyKey = cellContainer.getElement('pic').texture.key.slice(0, 7)

                        // 顯示小框
                        if (identifyKey == 'giftImg') {
                            var index = cellContainer.getElement('pic').texture.key.slice(7)
                            new giftBoard().create(scene, index, cellContainer)
                        } else {
                            new buyBoard().create(scene, cellContainer)
                        }
                    })
            }
        }, scene);

        showBoard(scene, dialog)

        return dialog
    }
}

var GetTitleSizer = function(scene) {
    var title = scene.add.sprite(0, 0, 'title_shop');

    return scene.rexUI.add.sizer({
        // width: undefined,
        // height: 80,
        orientation: 0,
        space: { left: 0, right: 0, top: 0, bottom: 0, item: 0 } // item : 兩物件之間的距離
    })

    .add(
        title,
        0,
        'center', { left: 30, right: -15 },
        false,
        'title'
    )

    .add(
        CreateButton(scene, 'btn_close'),
        0,
        'top', { top: -10 },
        false,
        'btn_close'
    )
}

var CreateButton = function(scene, text) {
    var button = scene.add.sprite(0, 0, text, 0)
        .setInteractive().on('pointerdown', function() {
            if (scene.smallCover != undefined) {
                return
            }
            btnClick(scene, button)
                .on('complete', function() {
                    hideInfoLabel()
                })
        })

    return button
}

var createRowItem = function(scene) {
    var background = scene.add.sprite(0, 0, 'bg_shopRect');

    // 商品名稱
    // var name = scene.add.bitmapText(0, 0, 'farmText_White', '', 14)
    var name = scene.add.text(0, 0, '', {
        font: '14px ',
        fill: '#FFF',
        padding: { top: 2 }
    })

    // 商品圖示
    var pic = scene.add.sprite(0, 0, '', 0)

    // 未解鎖 / 已售完
    var lockMask = scene.add.sprite(0, 0, 'bg_soldOut', 0).setDepth(1)

    return scene.rexUI.add.sizer({
        // width: undefined,
        // height: undefined,
        orientation: 1,
    })

    .addBackground(
        background
    )

    .add(
        name, // 遊戲對象
        0, // 比例 (0:與下一物件緊密對齊)
        'center', // 垂直對齊 (center ,left ,right ,top ,bottom)
        { left: 0, top: 5 }, // 邊界 (left ,right ,top ,bottom))
        false, // 擴展 (寬度/高度)
        'name' // 添加至map-key，可以讀取sizer.getElement(key)
    )

    .add(
        pic,
        0,
        'center', { top: 9 },
        false,
        'pic'
    )

    .add(
        GetCostSizer(scene),
        0,
        'center', { left: 0, top: 7 },
        false,
        'costSizer'
    )

    .add(
        lockMask,
        0,
        'center', { top: -167 },
        false,
        'lockMask'
    )
}

var GetCostSizer = function(scene) {
    var background = scene.add.sprite(0, 0, 'bg_costRect');

    // 幣值圖示
    var coin = scene.add.sprite(0, 0, 'obj_coin', 0).setScale(0.21);

    // 商品售價
    var cost = scene.add.bitmapText(0, 0, 'farmText_White', '', 16)

    return scene.rexUI.add.sizer({
        width: 110,
        height: 30,
        orientation: 0,
        space: { left: 15, right: 0, top: 0, bottom: 0, item: 10 }
    })

    .addBackground(
        background
    )

    .add(
        coin,
        0,
        'center', { left: -2, top: -2 },
        false,
        'coin'
    )

    .add(
        cost,
        0,
        'center', { top: -2 },
        false,
        'cost'
    )
}

// 視窗內容設定
var getItems = function(count, labelType) {
    var memberLV = getMemberLV()

    let type
    let name
    let price
    let limit

    switch (labelType) {
        case 'label_seed':
            type = 'obj_seed';
            name = getCropName(); // 種子/作物名稱
            price = getBuyPrice_seed(); // 單價
            limit = getSeed_limitLV(); // 限制購買等級
            break;
        case 'label_tool':
            type = 'obj_tool';
            name = getToolName();
            price = getBuyPrice_tool(); // 單價
            // limit = undefined; // 目前沒有限制
            break;
        case 'label_timeLimit':
            type = 'obj_gift';
            name = getGiftName();
            // price = getTimeleft_gift(); // 時間(小時)
            price = getGiftLeftHours(); // 時間(小時)
            limit = getGiftLeftNum(); // 限制購買數量
            break;
    }

    var data = [];
    var isOpened;
    for (var i = 0; i < count; i++) {
        if (labelType == 'label_seed' && memberLV < limit[i]) {
            isOpened = false
        } else if (labelType == 'label_timeLimit' && limit[i] <= 0) {
            isOpened = false
        } else {
            isOpened = true
        }

        data.push({
            type: type,
            name: name[i],
            price: price[i],
            frame: i,
            isOpened: isOpened
        });
    }

    // 排序(未解鎖的擺到後面)
    var arrOpen = []
    var arrClose = []
    for (var i = 0; i < count; i++) {
        if (data[i].isOpened == true) {
            arrOpen.push(data[i])
        } else {
            arrClose.push(data[i])
        }
    }

    var sortedData = arrOpen.concat(arrClose);

    return sortedData;
}

var CreateHeaderButton = function(scene, text, itemNum) {
    var headerButton = scene.rexUI.add.label({
        width: 80,
        height: 35,
        orientation: 0,
        background: scene.add.sprite(0, 0, text, 1), // 預設frame = 深色(未選)
        align: 'center',
    })

    headerButton.setInteractive()
        .on('pointerdown', function() {
            if (scene.smallCover != undefined) {
                return
            }

            hideInfoLabel()

            headerButton.getElement('background').setFrame(0);

            if (text == 'label_timeLimit') {
                // SetSuccessGetGiftData(successGetGiftData_inGame, itemNum);
                // getGiftData()
            } else {
                var items = getItems(itemNum, text);
                dialog.getElement('description').getElement('panel').setItems(items).scrollToTop();
            }

            if (preLabel != headerButton) {
                preLabel.getElement('background').setFrame(1);
            }

            preLabel = headerButton;
        })

    return headerButton
}

var createInfoLabel = function(scene, item) {
    var cropframe = item.frame.name

    var growSecLV2 = getSeed_growSecLV2()[cropframe] // seconds
    var growSecLV3 = getSeed_growSecLV3()[cropframe] // seconds

    var plantTime = (growSecLV2 + growSecLV3) / 60 // minute
    var deadTime = getSeed_deadSec()[cropframe] / 60 // minute

    var plantingHR = parseInt(plantTime / 60).toString().padStart(2, '0')
    var plantingMins = parseInt(plantTime % 60).toString().padStart(2, '0')
    var deadingHR = parseInt(deadTime / 60).toString().padStart(2, '0')
    var deadingMins = parseInt(deadTime % 60).toString().padStart(2, '0')

    var background = scene.rexUI.add.roundRectangle(0, 0, 2, 2, 10, 0xFFFEF8).setStrokeStyle(1, 0x000);
    var plantingText =
        scene.add.bitmapText(0, 0, 'farmText_Black', '種植時間：\n' + plantingHR + '時' + plantingMins + '分', 16);
    var deadingText =
        scene.add.bitmapText(0, 0, 'farmText_Black', '枯萎時間：\n' + deadingHR + '時' + deadingMins + '分', 16)

    timeInfoSizer = scene.rexUI.add.sizer({
            x: item.x,
            y: item.y,
            orientation: 1,
            space: { left: 15, right: 15, top: 10, bottom: 10, item: 5 }, // item : 兩物件之間的距離
            name: 'test'
        })
        .setVisible(true)
        .setOrigin(0, 0)

    .addBackground(
        background
    )

    .add(
        plantingText, // 遊戲對象
        0, // 比例 (0:與下一物件緊密對齊)
        'left', // 垂直對齊 (center ,left ,right ,top ,bottom)
        { left: 0 }, // 邊界 (left ,right ,top ,bottom))
        false, // 擴展 (寬度/高度)
    )

    .add(
        deadingText,
        0,
        'left', { left: 0 },
        false,
    )

    .layout()
        .setDepth(1)
}

var hideInfoLabel = function() {
    if (timeInfoSizer != undefined) {
        timeInfoSizer.setVisible(false)
    }
}

// function successGetGiftData_inGame() {
//     console.log('------successGetGiftData_inGame')
//     console.log('這裡的this = itemNum')

//     for (var i = 0; i < GiftData.length; i++) {
//         if (GiftData[i].can_exchange == true) {
//             var totalNum = GiftData[i].total_count - GiftData[i].exchange_count
//             var farmerNum = GiftData[i].member_limit_num - GiftData[i].farmer_exchanged_num
//             var leftNum = totalNum <= farmerNum ? totalNum : farmerNum
//             setGiftLeftNum(i, leftNum)
//         } else {
//             setGiftLeftNum(i, 0)
//         }

//         var totalHR = GiftData[i].countdown_days * 24 + GiftData[i].countdown_hours
//         setGiftLeftHours(i, totalHR)
//     }

//     var items = getItems(this, 'label_timeLimit');
//     dialog.getElement('description').getElement('panel').setItems(items).scrollToTop();
// }