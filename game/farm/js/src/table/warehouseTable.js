import sellBoard from './tipsBoard/sellBoard.js'
import expandBoard from './tipsBoard/expandBoard.js'

import { btnClick, showTipsText, showBoard } from '../Controller.js'
import {
    getLimit_perSpaceNum,

    getMemberLV,
    getMemberSpace,
    getMemberTool,
    getMemberCrop,

    getNewSpace_limitLV,
    getNewSpace_coinNum,
    getNewSpace_O2pointNum,
    getToolName,
    getCropName,
    getSellPrice_tool,
    getSellPrice_crop,
} from '../fakeSQL.js'

var dialog;
var preLabel; // 上一個點選的標籤類別
var labelType; // 當前標籤類別
var totalSpace; // 已占用格數
var maxNum = getLimit_perSpaceNum() // 單格數量上限
export default class warehouseTable {
    create(scene) {
        calucateSpace()

        dialog = scene.rexUI.add.dialog({
                x: game.config.width / 2,
                y: game.config.height / 2 - 10,
                width: 500,
                height: 565,

                background: scene.add.sprite(0, 0, 'bg_warehouseTable'),

                title: GetTitleSizer(scene),

                description: scene.rexUI.add.tabs({
                        x: game.config.width / 2,
                        y: game.config.height / 2,
                        scrollMode: 0,

                        panel: scene.rexUI.add.gridTable({
                            width: 480,
                            height: 370, // 留位置給空間數量
                            background: scene.add.sprite(0, 0, 'bg_warehouseRect'),
                            scrollMode: 0,

                            table: {
                                // 捲動表格大小
                                width: 460, // gridTable.width - gridTable.space.left & right
                                height: 350, // gridTable.height - gridTable.space.top & bottom

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
                                cellContainer.getElement('name').getElement('text').setText(item.name);
                                cellContainer.getElement('name').getElement('action').setText(item.price);
                                cellContainer.getElement('pic').setTexture(item.key, item.frame);
                                cellContainer.getElement('num').setText(item.num);

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
                            CreateHeaderButton(scene, 'label_crop', 15),
                            // CreateHeaderButton(scene, 'label_tool', 5), // 道具改不佔用倉庫
                        ],

                        space: {
                            left: 10,
                            right: 10,
                        },
                    })
                    .layout(),

                actions: [
                    createFooterSizer(scene, totalSpace, getMemberSpace()), // (scene, usedSpace, ownSpace)
                    createFooterButton(scene)
                ],

                space: {
                    description: 20,
                    actionsRight: 15,
                },

                // 擴展(延伸填滿)
                expand: {
                    title: false,
                    content: false,
                    description: false,
                },

                align: {
                    title: 'center',
                    description: 'center',
                    actions: 'right',
                },
            })
            .layout()
            // .drawBounds(scene.add.graphics(), 0xff0000)

        var items = getItems(15, 'label_crop');

        // 預設顯示標籤
        preLabel = dialog.getElement('description').getTopButton(0);
        dialog.getElement('description').getTopButton(0).getElement('background').setFrame(0);
        dialog.getElement('description').getElement('panel').setItems(items).scrollToTop();
        dialog.getAction(0).getElement('icon').setOrigin(0.5, 0)

        dialog.getElement('description').getElement('panel')
            .on('cell.click', function(cellContainer, cellIndex) {
                console.log('cell.click ' + cellIndex)

                if (this.smallCover != undefined) {
                    return
                }

                // 出現小框時大框變暗
                scene.smallCover = scene.add.sprite(dialog.x + 1, dialog.y - 5, 'smallCover')

                // 顯示小框
                new sellBoard().create(scene, cellContainer, labelType)

            }, scene);

        showBoard(scene, dialog)

        return dialog
    }
}

var GetTitleSizer = function(scene) {
    var title = scene.add.sprite(0, 0, 'title_warehouse');

    return scene.rexUI.add.sizer({
        // width: undefined,
        // height: 80,
        orientation: 0,
        name: 'warehouse' // btn_QA用
    })

    .add(
        CreateButton(scene, 'btn_QA'), // 遊戲對象
        0, // 比例 (0:與下一物件緊密對齊)
        'center', // 垂直對齊 (center ,left ,right ,top ,bottom)
        { left: 5, right: -40 }, // 邊界 (left ,right ,top ,bottom))
        false, // 擴展 (寬度/高度)
        'btn_QA' // 添加至map-key，可以讀取sizer.getElement(key)
    )

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
            button.disableInteractive()
            console.log(`Pointer down ${text}`)
            btnClick(scene, button)
        })

    return button
}

var createRowItem = function(scene) {
    var background =
        scene.rexUI.add.label({
            width: 120,
            height: 100,
            orientation: 1,
            background: scene.add.sprite(0, 0, 'bg_cropRect'),
            text: scene.add.bitmapText(0, 0, 'farmText_Black', '', 12).setAlpha(0), // 紀錄中文名子用
            action: scene.add.bitmapText(0, 0, 'farmText_Black', '88', 12).setAlpha(0), // 紀錄單價用
            align: 'center',
        })

    // 作物圖示
    var pic = scene.add.sprite(0, 0, 'obj_crop', 0);

    // 作物數量
    var num = scene.add.bitmapText(0, 0, 'farmText_White', '', 18)

    return scene.rexUI.add.sizer({
        orientation: 1,
    })

    .addBackground(
        background,
        0,
        'name',
    )

    .add(
        pic, // 遊戲對象
        0, // 比例 (0:與下一物件緊密對齊)
        'center', // 垂直對齊 (center ,left ,right ,top ,bottom)
        { top: 35 }, // 邊界 (left ,right ,top ,bottom))
        false, // 擴展 (寬度/高度)
        'pic' // 添加至map-key，可以讀取sizer.getElement(key)
    )

    .add(
        num,
        0,
        'center', { top: 17, left: 65 },
        false,
        'num'
    )
}

// 視窗內容設定
var getItems = function(count, type) {
    labelType = type

    let key
    let name
    let num
    let price

    switch (type) {
        case 'label_crop':
            key = 'obj_crop';
            name = getCropName(); // 作物名稱
            num = getMemberCrop(); // 擁有數量
            price = getSellPrice_crop(); // 單價
            break;
        case 'label_tool':
            key = 'obj_tool';
            name = getToolName();
            num = getMemberTool();
            price = getSellPrice_tool();
            break;
    }

    var data = [];
    var times

    // 新增倉庫內容
    for (var i = 0; i < count; i++) {

        // 數量0的不顯示
        if (num[i] == 0) continue
        console.log(i)
        // 判斷大於單格最大數量
        if (num[i] > maxNum) {
            var overNum = num[i]
            times = num[i] / maxNum // 總共會佔幾格

            for (var j = 0; j < times; j++) {
                // 不滿單格上限數量等於餘數
                if (overNum % maxNum != 0 && overNum > maxNum) {
                    overNum = num[i] % maxNum
                } else {
                    overNum = maxNum
                }

                data.push({
                    key: key,
                    name: name[i],
                    num: overNum,
                    price: price[i],
                    frame: i
                });
            }
        } else {
            data.push({
                key: key,
                name: name[i],
                num: num[i],
                price: price[i],
                frame: i
            });
        }
    }
    console.log(data)

    return data;
}

var CreateHeaderButton = function(scene, itemType, itemNum) {
    var headerButton = scene.rexUI.add.label({
        width: 80,
        height: 35,
        orientation: 0,
        background: scene.add.sprite(0, 0, itemType, 1), // 預設frame = 深色(未選)
        align: 'center',
    })

    headerButton.setInteractive()
        .on('pointerdown', function() {
            if (scene.smallCover != undefined) {
                return
            }
            console.log('pointerdown ' + itemType);

            headerButton.getElement('background').setFrame(0);
            labelType = itemType
            updateCellItems(itemNum, itemType)

            if (preLabel != headerButton) {
                preLabel.getElement('background').setFrame(1);
            }

            preLabel = headerButton;
        })

    return headerButton
}

var createFooterSizer = function(scene, usedSpace, ownSpace) {
    return scene.rexUI.add.label({
        width: 70,

        icon: scene.add.bitmapText(0, 0, 'farmText_White', usedSpace, 22), // 當前數量(待改)
        text: scene.add.bitmapText(0, 0, 'farmText_White', '/', 20),
        action: scene.add.bitmapText(0, 0, 'farmText_White', ownSpace, 22), // 總數量(待改)

        space: { left: 9, top: -4, icon: -6, text: 4, },
    });
}

var createFooterButton = function(scene) {
    var expandBtn = scene.add.sprite(0, 0, 'btn_add', 0)

    .setInteractive()
        .on('pointerdown', function() {
            if (scene.smallCover != undefined) {
                return
            }
            console.log('Pointer down expandBtn')

            btnClick(scene, expandBtn)
                .on('complete', function() {
                    var memberLV = getMemberLV()
                    var limitLV = getNewSpace_limitLV()
                    var coinNum = getNewSpace_coinNum()
                    var O2pointNum = getNewSpace_O2pointNum()

                    // 達到解鎖等級(貓鑽)
                    if (memberLV >= limitLV[0]) {
                        // 還可以擴充
                        if (coinNum.length > 0) {
                            console.log('扣貓鑽')

                            // 出現小框時大框變暗
                            scene.smallCover = scene.add.sprite(dialog.x + 1, dialog.y - 5, 'smallCover')

                            new expandBoard().create(scene, dialog, 0, coinNum)

                        } else {
                            console.log('貓鑽不夠扣兔幣')
                            checkRequire(scene, coinNum, O2pointNum)
                        }
                    } // 等級不足(歐兔幣)
                    else {
                        console.log('扣兔幣')
                        checkRequire(scene, coinNum, O2pointNum)
                    }
                });
        })

    return expandBtn
}

var checkRequire = function(scene, coinNum, O2pointNum) {
    // 還可以擴充
    if (O2pointNum.length > 0) {
        // 出現小框時大框變暗
        scene.smallCover = scene.add.sprite(dialog.x + 1, dialog.y - 5, 'smallCover')

        new expandBoard().create(scene, dialog, 1, O2pointNum)
    } else {
        if (coinNum.length > 0) {
            showTipsText(scene, '等級不足')
        } else {
            showTipsText(scene, '已達上限')
        }
    }
}

export function calucateSpace() {
    totalSpace = 0

    // console.log(getMemberCrop())
    // console.log(getMemberTool())

    // 作物 & 道具占用倉庫空間
    // var labelArray = [getMemberCrop, getMemberTool]
    // for (var i = 0; i < labelArray.length; i++) {
    //     for (var j = 0; j < labelArray[i]().length; j++) {
    //         if (labelArray[i]()[j] == 0) continue
    //         if (labelArray[i]()[j] > maxNum) {
    //             totalSpace += Math.ceil(labelArray[i]()[j] / maxNum)
    //         } else {
    //             totalSpace++
    //         }
    //     }
    // }

    // 僅作物占用倉庫空間
    var memberCrop = getMemberCrop()
    for (var j = 0; j < memberCrop.length; j++) {
        if (memberCrop[j] == 0) continue

        if (memberCrop[j] > maxNum) {
            totalSpace += Math.ceil(memberCrop[j] / maxNum)
        } else {
            totalSpace++
        }
    }
}

export function updateCellItems() {
    var itemNum
    if (labelType == 'label_crop') {
        itemNum = getCropName().length
    } else if (labelType == 'label_tool') {
        itemNum = getToolName().length
    }

    var items = getItems(itemNum, labelType);
    dialog.getElement('description').getElement('panel').setItems(items).scrollToTop();
    dialog.getAction(0).getElement('icon').setText(totalSpace)
}