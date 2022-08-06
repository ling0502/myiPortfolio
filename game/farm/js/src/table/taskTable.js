// import { SetSuccessReachScoreBox, reachDailyMission, reachScoreBox } from '../../../../js/farm_source.js';

import afterUnboxing from './tipsBoard/afterUnboxing.js'

import { btnClick, showTipsText, showBoard, rewardCollection, searchPlant_picID, searchProp_picID, searchTaskStageID } from '../Controller.js'
import {
    getMemberTask,
    setMemberTask,
    getMemberTaskReceived,
    setMemberTaskReceived,
    getMemberTaskboxOpened,
    setMemberTaskboxOpened,
    setMemberAchiev_grow,

    getTaskList,
    getTaskNum,
    getTaskGift
} from '../fakeSQL.js'

var dialog
var preLabel;

export default class taskTable {
    create(scene) {
        scene.anims.create({
            key: 'boxShining',
            frames: scene.anims.generateFrameNumbers('obj_box', { start: 1, end: 3 }),
            frameRate: 5,
            repeat: -1,
        });

        dialog = scene.rexUI.add.dialog({
                x: game.config.width / 2,
                y: game.config.height / 2 - 10,
                width: 500,
                height: 565,

                background: scene.add.sprite(0, 0, 'bg_table'),

                title: GetTitleSizer(scene),

                content: GetContentSizer(scene),

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
                                height: 380, // gridTable.height - gridTable.space.top & bottom

                                // 捲動欄位大小
                                // cellWidth: undefined,
                                cellHeight: 85, // Height of each cell + padding between two cell

                                // 捲動欄位數
                                columns: 1,
                            },

                            createCellContainerCallback: function(cell, cellContainer) {
                                var scene = cell.scene,
                                    width = cell.width,
                                    height = 80, // Height of this cell
                                    item = cell.item,
                                    index = cell.index;
                                if (cellContainer === null) {
                                    cellContainer = createRowItem(scene);
                                    // console.log(cell.index + ': create new cell-container');
                                } else {
                                    // console.log(cell.index + ': reuse cell-container');
                                }

                                // Set properties from item value
                                cellContainer.setMinSize(width, height); // Size might changed in this demo
                                cellContainer.getElement('script').setText(item.taskList); // item.taskList

                                // 取任務敘述當核對key
                                var stringKey = cutScript(cellContainer.getElement('script').text, '(')

                                var index = searchOriginIndex(stringKey)

                                // item.taskList = getTaskList()[index] // 任務標題
                                item.taskNum = getTaskNum()[index] // 每一任務條件總量
                                item.taskGift = getTaskGift()[index] // 每一任務獎勵
                                item.memberTask = getMemberTask()[index] // 每一任務完成數量
                                item.isReceived = getMemberTaskReceived()[index] // 已領取完成獎勵

                                // 完成數量顯示限制在上限
                                if (item.memberTask > item.taskNum) {
                                    item.memberTask = item.taskNum
                                }

                                // 任務內容
                                var script = stringKey + '(' + item.memberTask + '/' + item.taskNum + ')';

                                // - - - 更新顯示內容 - - - 
                                var giftFrame
                                switch (item.taskGift.type) {
                                    case 'obj_coin':
                                        giftFrame = 0
                                        break;

                                    case 'obj_seed':
                                        // giftFrame = searchPlant_picID(item.taskGift.id)
                                        giftFrame = item.taskGift.id
                                        break;

                                    case 'obj_tool':
                                        // giftFrame = searchProp_picID(item.taskGift.id)
                                        giftFrame = item.taskGift.id
                                        break;
                                }

                                cellContainer.getElement('prize').setTexture(item.taskGift.type).setFrame(giftFrame);
                                cellContainer.getElement('awardNum').setText(item.taskGift.num);
                                cellContainer.getElement('script').setText(script);

                                // 已領取
                                if (item.isReceived == true) {
                                    cellContainer.getElement('btn_receive').setFrame(2)
                                } // 領取
                                else if (item.memberTask >= item.taskNum) {
                                    cellContainer.getElement('btn_receive').setFrame(1)
                                } // 進行中
                                else {
                                    cellContainer.getElement('btn_receive').setFrame(0)
                                }

                                return cellContainer;
                            },

                            space: {
                                left: 10,
                                right: 10,
                                top: 5,
                                bottom: 5,
                            },
                        }),

                        topButtons: [
                            GetLabelSizer(scene),
                        ],

                        space: {
                            left: 10,
                            right: 10,
                        },
                    })
                    .layout(),

                space: {
                    title: 15,
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
                },
            })
            .layout()
            // .drawBounds(scene.add.graphics(), 0xff0000)

        var items = getItems(8, 'label_daily');
        // 預設顯示標籤
        preLabel = 'label_daily';
        dialog.getElement('description').getTopButton(0).getElement(preLabel).getElement('background').setFrame(0);
        dialog.getElement('description').getElement('panel').setItems(items).scrollToTop();

        // Grid table
        dialog.getElement('description').getElement('panel')
            .on('cell.click', function(cellContainer, cellIndex) {
                // console.log(cellIndex + ': ' + cellContainer.getElement('script').text + '\n')

                var btn = cellContainer.getElement('btn_receive')

                if (scene.rexUI.isInTouching(btn)) {
                    if (scene.smallCover != undefined) return

                    if (btn.frame.name == 1) {

                        btnClick(scene, btn)

                        // 取任務敘述當核對key
                        var stringKey = cutScript(cellContainer.getElement('script').text, '(')

                        var originIndex = searchOriginIndex(stringKey)

                        if (originIndex == undefined) return

                        var isEnough = true

                        // 購買道具會有爆倉問題 (道具改不佔用倉庫空間)
                        // if (cellContainer.getElement('prize').texture.key == 'obj_tool') {
                        //     isEnough = checkSpace(cellContainer.getElement('prize'), cellContainer.getElement('awardNum').text)
                        // }

                        // 有足夠倉庫空間
                        if (isEnough) {
                            // reachDailyMission(searchTaskStageID(originIndex))

                            setMemberTask(originIndex, getTaskNum()[originIndex], false) // 完成數量卡在條件總量
                            setMemberTaskReceived(originIndex, true)
                            setMemberAchiev_grow(9, 1, true) // 回傳成就-成長第9項+1

                            updateTasknumberBar()

                            rewardCollection(scene, cellContainer.getElement('prize'), cellContainer.getElement('awardNum').text)

                            btn.setFrame(2);
                        } else {
                            showTipsText(scene, '倉庫空間不足')
                        }
                    }
                }
            }, scene);

        showBoard(scene, dialog)

        return dialog
    }
}

var GetTitleSizer = function(scene) {
    var title = scene.add.sprite(0, 0, 'title_task');

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
        })

    return button
}

var GetContentSizer = function(scene) {
    return scene.rexUI.add.sizer({
        // width: undefined,
        // height: 50,
        orientation: 1,
        space: { left: 0, right: 0, top: 0, bottom: 0, item: -30 } // item : 兩物件之間的距離
    })

    .add(
        CreateContentBar(scene), // child
        0, // proportion
        'center', // align
        { top: 0 }, // padding
        false, // 擴展 (寬度/高度)
        'contentBar'
    )

    .add(
        CreateContentButton(scene),
        0,
        'left', { left: 0 },
        false,
        'contentButton'
    )
}

var CreateContentButton = function(scene) {
    return scene.rexUI.add.sizer({
        // width: 50,
        // height: 50,
        // orientation: 0,
    })

    .add(
        createTreasure(scene, 'obj_box1'), // 遊戲對象
        0, // 比例 (0:與下一物件緊密對齊)
        'center', // 垂直對齊 (center ,left ,right ,top ,bottom)
        { left: 140 }, // 邊界 (left ,right ,top ,bottom))
        false, // 擴展 (寬度/高度)
        'obj_box1' // 添加至map-key，可以讀取sizer.getElement(key)
    )

    .add(
        createTreasure(scene, 'obj_box2'),
        0,
        'center', { left: 100 },
        false,
        'obj_box2'
    )

    .add(
        createTreasure(scene, 'obj_box3'),
        0,
        'center', { left: 55 },
        false,
        'obj_box3'
    )
}

var createTreasure = function(scene, name) {
    var cutIndex = name.indexOf('x') + 1;
    var boxIndex = name.substr(cutIndex) - 1;
    var isOpened = getMemberTaskboxOpened()

    var boxFrame
    if (isOpened[boxIndex] == true) {
        boxFrame = 4
    } else {
        boxFrame = 0
    }

    var obj_box = scene.add.sprite(0, 0, 'obj_box', boxFrame)
        .setInteractive().on('pointerup', function() {
            if (scene.smallCover != undefined) {
                return
            }

            if (obj_box.anims.isPlaying) {
                // SetSuccessReachScoreBox(successReachScoreBox, scene);
                // reachScoreBox(boxIndex)
                successReachScoreBox(scene)

                setMemberAchiev_grow(8, 1, true) // 回傳成就-成長第8項+1
                setMemberTaskboxOpened(boxIndex, true)

                obj_box.stop()
                obj_box.setFrame(4)
                obj_box.removeInteractive()
            }
        }, scene);

    return obj_box
}

var CreateContentBar = function(scene) {
    var numberBar = scene.rexUI.add.numberBar({
            width: 380, // Fixed width

            background: scene.rexUI.add.roundRectangle(0, 0, 0, 0, 5, 0x260e04),

            slider: {
                track: scene.rexUI.add.roundRectangle(0, 0, 0, 0, 5, 0x604C3F), // 軌道
                indicator: scene.rexUI.add.roundRectangle(0, 0, 0, 0, 5, 0xF8B62D), // 進度
            },

            valuechangeCallback: function(value, oldValue, numberBar) {
                var targetNum
                var realValue = value * 120
                var unitValue = 120 / 8 // 總長:120，任務數:8
                console.log('numberBar_Value: ' + realValue)

                // 完成8任務=第三寶相
                if (realValue >= unitValue * 8) {
                    targetNum = 3
                } // 完成6任務=第二寶相
                else if (realValue >= unitValue * 6) {
                    targetNum = 2
                } // 完成3任務=第一寶相
                else if (realValue >= unitValue * 3) {
                    targetNum = 1
                }

                // 更新寶箱狀態
                for (var i = 1; i <= targetNum; i++) {
                    var button = dialog.getElement('content').getElement('contentButton')

                    // 已經開過的寶箱
                    if (button.getElement('obj_box' + i).frame.name == 4) continue

                    button.getElement('obj_box' + i).anims.play('boxShining') //達成條件寶箱發光
                }
            },
        })
        .layout();

    //預設值 (value ,min ,max)
    numberBar.setValue(0, 0, 120);

    return numberBar
}

// 比對任務敘述找陣列中位置
var searchOriginIndex = function(stringKey) {
    var originList = getTaskList()

    for (var i = 0; i < originList.length; i++) {
        if (originList[i] == stringKey) {
            return i
        }
    }
}

// 取任務敘述當核對key
var cutScript = function(myString, stringIndex) {
    var cutIndex = myString.indexOf(stringIndex);

    return myString.substr(0, cutIndex);
}

var createRowItem = function(scene) {
    var background = scene.add.sprite(0, 0, 'bg_taskRect');

    // 獎勵圖示
    var prize = scene.add.sprite(0, 0, 'obj_seed', 0).setScale(0.45);

    // 獎勵數量
    var awardNum = scene.add.bitmapText(0, 0, 'farmText_Black', '', 14)

    // 任務敘述
    var script = scene.add.bitmapText(0, 0, 'farmText_Black', '', 20)

    // 領取按鈕
    var btn_receive = scene.add.sprite(0, 0, 'btn_receive', 0);

    return scene.rexUI.add.sizer({
        orientation: 0,
    })

    .addBackground(
        background
    )

    .add(
        prize, // 遊戲對象
        0, // 比例 (0:與下一物件緊密對齊)
        'center', // 垂直對齊 (center ,left ,right ,top ,bottom)
        { left: 5 }, // 邊界 (left ,right ,top ,bottom))
        false, // 擴展 (寬度/高度)
        'prize' // 添加至map-key，可以讀取sizer.getElement(key)
    )

    .add(
        awardNum,
        1,
        'center', { left: -30, top: 50 },
        false,
        'awardNum'
    )

    .add(
        script,
        1,
        'left', { left: -250 },
        false,
        'script'
    )

    // 領取按鈕
    .add(
        btn_receive,
        0,
        'center', { right: 10 },
        false,
        'btn_receive'
    )
}

// 視窗內容設定
var getItems = function(count, labelType) {
    updateTasknumberBar()

    let taskList
    let taskNum
    let taskGift
    let memberTask
    let isReceived

    switch (labelType) {
        case 'label_daily':
            // type = 'obj_daily';
            taskList = getTaskList()
            taskNum = getTaskNum() // 每一任務條件總量
            memberTask = getMemberTask() // 每一任務完成數量
            taskGift = getTaskGift() // 每一任務獎勵
            isReceived = getMemberTaskReceived()
            break;

            // case 'label_weekly':(目前沒有每周任務)
            //     type = 'obj_weekly';
            //     taskList = '連續登入(7/7)';
            //     break;
    }

    var data = [];
    var isComplete // 已完成任務

    for (var i = 0; i < count; i++) {
        if (memberTask[i] >= taskNum[i]) {
            isComplete = true
        } else {
            isComplete = false
        }

        data.push({
            taskList: taskList[i] + '(' + memberTask[i] + '/' + taskNum[i] + ')',
            taskNum: taskNum[i],
            memberTask: memberTask[i],
            taskGift: taskGift[i],
            isComplete: isComplete,
            isReceived: isReceived[i]
        });
    }

    // 排序(順序:可領取-進行中-已領取)
    var arrCanClick = []
    var arrDoing = []
    var arrFinish = []

    for (var i = 0; i < count; i++) {
        if (isReceived[i] == true && data[i].isComplete == true) {
            arrFinish.push(data[i])
        } else if (data[i].isComplete == true) {
            arrCanClick.push(data[i])
        } else {
            arrDoing.push(data[i])
        }
    }

    var sortedData = arrCanClick.concat(arrDoing).concat(arrFinish);

    return sortedData
}

// 更新寶相進度條
var updateTasknumberBar = function() {
    var addNumberValueTimes = 0
    var received = getMemberTaskReceived()
    for (var i = 0; i < received.length; i++) {
        if (received[i] == true) {
            addNumberValueTimes++;
        }
    }

    console.log('--addNumberValueTimes: ' + addNumberValueTimes)
    dialog.getElement('content').getElement('contentBar').setValue(15 * addNumberValueTimes, 0, 120)
}

var GetLabelSizer = function(scene) {
    return scene.rexUI.add.sizer({
        // width: undefined,
        // height: 80,
        orientation: 0,
        space: { left: 10, right: 0, top: 0, bottom: 0, item: 80 }
    })

    .add(
        CreateHeaderButton(scene, 'label_daily', 8), // child
        0, // proportion
        'bottom', // align
        { left: 0 }, // padding
        false,
        'label_daily'
    )

    // 一鍵領取按鈕(暫不做功能)
    // .add(
    //     CreateButton(scene, 'btn_oneClick'),
    //     0,
    //     'center', { left: 205 },
    //     false,
    //     'btn_oneClick'
    // )
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
            console.log('pointerdown ' + text);

            headerButton.getElement('background').setFrame(0);
            var items = getItems(itemNum, text);
            dialog.getElement('description').getElement('panel').setItems(items).scrollToTop();

            if (preLabel != text) {
                dialog.getElement('description').getTopButton(0).getElement(preLabel).getElement('background').setFrame(1);
            }

            preLabel = text;
        })

    return headerButton
}

var successReachScoreBox = function(t) {
    console.log('------successReachScoreBox')
    console.log('這裡的this = scene')

    // 出現小框時大框變暗
    t.smallCover = t.add.sprite(dialog.x + 1, dialog.y - 5, 'smallCover')

    // 顯示小框
    new afterUnboxing().create(t)
}