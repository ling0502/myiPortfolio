// import { FarmerAchieveData, reachAchieve, SetSuccessReachAchieve } from '../../../../js/farm_source.js';

import { btnClick, showTipsText, showBoard, rewardCollection, searchPlant_picID, searchProp_picID, searchAchievStageID } from '../Controller.js'
import {
    setAchievNum_manager,
    setAchievGift_manager,
    getMemberAchiev_manager,
    setMemberAchiev_manager,
    getMemberAchiev_managerStar,
    setMemberAchiev_managerStar,
    getMemberAchiev_managerReceived,
    setMemberAchiev_managerReceived,

    setAchievNum_book,
    setAchievGift_book,
    getMemberAchiev_book,
    setMemberAchiev_book,
    getMemberAchiev_bookStar,
    setMemberAchiev_bookStar,
    getMemberAchiev_bookReceived,
    setMemberAchiev_bookReceived,

    setAchievNum_grow,
    setAchievGift_grow,
    getMemberAchiev_grow,
    setMemberAchiev_grow,
    getMemberAchiev_growStar,
    setMemberAchiev_growStar,
    getMemberAchiev_growReceived,
    setMemberAchiev_growReceived,

    getAchievID_manager,
    getAchievList_manager,
    getAchievNum_manager,
    getAchievGift_manager,

    getAchievID_book,
    getAchievList_book,
    getAchievNum_book,
    getAchievGift_book,

    getAchievID_grow,
    getAchievList_grow,
    getAchievNum_grow,
    getAchievGift_grow,
} from '../fakeSQL.js'

var dialog;
var preLabel; // 上一個點選的標籤類別
var labelType; // 當前標籤類別

var bookScriptLV = ['友好', '親近', '知己', '知己']
export default class achievementTable {
    create(scene) {
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
                                cellContainer.getElement('script').getElement('id').setText(item.id);
                                // cellContainer.getElement('script').getElement('achievScript').setText(item.achievList);

                                // 取成就敘述當核對key
                                var stringKey = cellContainer.getElement('script').getElement('id').text
                                var originIndex = searchOriginIndex(stringKey)

                                switch (labelType) {
                                    case 'label_manage':
                                        item.achievList = getAchievList_manager()[originIndex] // 成就內容
                                        item.starFrame = getMemberAchiev_managerStar()[originIndex] // 星級
                                        item.achievNumLV = getAchievNum_manager()[originIndex] // 每一成就條件總量
                                        item.achievGiftLV = getAchievGift_manager()[originIndex] // 每一成就獎勵
                                        item.memberAchiev = getMemberAchiev_manager()[originIndex] // 每一成就完成數量
                                        item.isReceived = getMemberAchiev_managerReceived()[originIndex] // 已領取完成獎勵
                                        break;

                                    case 'label_book':
                                        item.achievList = getAchievList_book()[originIndex]
                                        item.starFrame = getMemberAchiev_bookStar()[originIndex]
                                        item.achievNumLV = getAchievNum_book()[originIndex]
                                        item.achievGiftLV = getAchievGift_book()[originIndex]
                                        item.memberAchiev = getMemberAchiev_book()[originIndex]
                                        item.isReceived = getMemberAchiev_bookReceived()[originIndex]
                                        break;

                                    case 'label_grow':
                                        item.achievList = getAchievList_grow()[originIndex]
                                        item.starFrame = getMemberAchiev_growStar()[originIndex]
                                        item.achievNumLV = getAchievNum_grow()[originIndex]
                                        item.achievGiftLV = getAchievGift_grow()[originIndex]
                                        item.memberAchiev = getMemberAchiev_grow()[originIndex]
                                        item.isReceived = getMemberAchiev_growReceived()[originIndex]
                                        break;
                                }

                                // 成就內容
                                var script
                                if (labelType == 'label_book') {
                                    script = item.achievList + bookScriptLV[item.starFrame]
                                } else {
                                    // 完成數量顯示限制在上限
                                    if (item.memberAchiev > item.achievNumLV) {
                                        item.memberAchiev = item.achievNumLV
                                    }
                                    script = item.achievList + '(' + item.memberAchiev + '/' + item.achievNumLV + ')';
                                }

                                // - - - 更新顯示內容 - - - 
                                var giftFrame
                                switch (item.achievGiftLV.type) {
                                    case 'obj_coin':
                                        giftFrame = 0
                                        break;

                                    case 'obj_seed':
                                        // giftFrame = searchPlant_picID(item.achievGiftLV.id)
                                        giftFrame = item.achievGiftLV.id
                                        break;

                                    case 'obj_tool':
                                        // giftFrame = searchProp_picID(item.achievGiftLV.id)
                                        giftFrame = item.achievGiftLV.id
                                        break;
                                }

                                cellContainer.getElement('star').setFrame(item.starFrame);
                                cellContainer.getElement('awardSizer').getElement('prize').setTexture(item.achievGiftLV.type).setFrame(giftFrame);
                                cellContainer.getElement('awardSizer').getElement('num').setText(item.achievGiftLV.num);
                                cellContainer.getElement('script').getElement('achievScript').setText(script);

                                // 已領取
                                if (item.starFrame >= 3) {
                                    cellContainer.getElement('btn_receive').setFrame(2)
                                } // 領取
                                else if (item.memberAchiev >= item.achievNumLV) {
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

        var items = getItems(15, 'label_manage');

        // 預設顯示標籤
        preLabel = 'label_manage';
        dialog.getElement('description').getTopButton(0).getElement(preLabel).getElement('background').setFrame(0);
        dialog.getElement('description').getElement('panel').setItems(items).scrollToTop();

        // Grid table
        dialog.getElement('description').getElement('panel')
            .on('cell.click', function(cellContainer, cellIndex) {
                console.log('cell.click\n' + cellIndex + ': ' + cellContainer.getElement('script').getElement('achievScript').text);

                var btn = cellContainer.getElement('btn_receive')

                if (scene.rexUI.isInTouching(btn)) {
                    if (scene.smallCover != undefined) return

                    if (btn.frame.name == 1) {

                        btnClick(scene, btn)
                            .on('complete', function(tween, targets) {
                                btn.setFrame(2);
                            })

                        // 星級(升星前)
                        // var originStarFrame = parseInt(cellContainer.getElement('star').frame.name)

                        // 取成就敘述當核對key
                        var stringKey = cellContainer.getElement('script').getElement('id').text
                        var originIndex = searchOriginIndex(stringKey)

                        if (originIndex == undefined) return

                        var isEnough = true

                        // 道具領獎會有爆倉問題 (道具改不佔用倉庫空間)
                        // if (cellContainer.getElement('awardSizer').getElement('prize').texture.key == 'obj_tool') {
                        //     isEnough = checkSpace(cellContainer.getElement('awardSizer').getElement('prize'), cellContainer.getElement('awardSizer').getElement('num').text)

                        // }

                        // 有足夠倉庫空間
                        if (isEnough) {
                            // SetSuccessReachAchieve(successReachAchieve, cellContainer);

                            var achievList
                            var originMember // 完成數量(升星前)
                            var originNumLV
                            var originGiftLV
                            switch (labelType) {
                                case 'label_manage':
                                    // reachAchieve(searchAchievStageID(0, originIndex))
                                    successReachAchieve(cellContainer)

                                    achievList = getAchievList_manager()[originIndex]
                                    originMember = getMemberAchiev_manager()[originIndex]
                                    originNumLV = getAchievNum_manager()
                                    originGiftLV = getAchievGift_manager()
                                    break;

                                case 'label_book':
                                    // reachAchieve(searchAchievStageID(1, originIndex))
                                    successReachAchieve(cellContainer)

                                    achievList = getAchievList_book()[originIndex]
                                    originMember = getMemberAchiev_book()[originIndex]
                                    originNumLV = getAchievNum_book()
                                    originGiftLV = getAchievGift_book()
                                    break;

                                case 'label_grow':
                                    // reachAchieve(searchAchievStageID(2, originIndex))
                                    successReachAchieve(cellContainer)

                                    achievList = getAchievList_grow()[originIndex]
                                    originMember = getMemberAchiev_grow()[originIndex]
                                    originNumLV = getAchievNum_grow()
                                    originGiftLV = getAchievGift_grow()
                                    break;
                            }

                            rewardCollection(scene, cellContainer.getElement('awardSizer').getElement('prize'), cellContainer.getElement('awardSizer').getElement('num').text)
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
    var title = scene.add.sprite(0, 0, 'title_achievement');

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
            console.log(`Pointer down ${text}`)
            btnClick(scene, button)
        })

    return button
}

var createRowItem = function(scene) {
    var background = scene.add.sprite(0, 0, 'bg_achievementRect');

    // 星級
    var star = scene.add.sprite(0, 0, 'obj_star', 0);

    // 領取按鈕
    var btn_receive = scene.add.sprite(0, 0, 'btn_receive', 0);

    return scene.rexUI.add.sizer({
        orientation: 0,
    })

    .addBackground(
        background
    )

    .add(
        getAward(scene), // 遊戲對象
        0, // 比例 (0:與下一物件緊密對齊)
        'center', // 垂直對齊 (center ,left ,right ,top ,bottom)
        { left: 5 }, // 邊界 (left ,right ,top ,bottom))
        false, // 擴展 (寬度/高度)
        'awardSizer' // 添加至map-key，可以讀取sizer.getElement(key)
    )

    .add(
        star,
        0,
        'center', { left: 20, top: -35 },
        false,
        'star'
    )

    .add(
        getScript(scene),
        1,
        'center', { left: 10, top: 0 },
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

var getAward = function(scene) {
    // 獎勵圖示
    var prize = scene.add.sprite(0, 0, 'obj_seed', 0).setScale(0.45);

    // 獎勵數量
    var num = scene.add.bitmapText(0, 0, 'farmText_Black', '50', 14).setOrigin(0.5)

    return scene.rexUI.add.sizer({
        orientation: 1,
    })

    .add(
        prize, // 遊戲對象
        0, // 比例 (0:與下一物件緊密對齊)
        'center', // 垂直對齊 (center ,left ,right ,top ,bottom)
        { left: 0 }, // 邊界 (left ,right ,top ,bottom))
        false, // 擴展 (寬度/高度)
        'prize' // 添加至map-key，可以讀取sizer.getElement(key)
    )

    .add(
        num,
        1,
        'center', { left: 0, top: -5 },
        false,
        'num'
    )
}

var getScript = function(scene) {
    // 成就名稱
    var id = scene.add.bitmapText(0, 0, 'farmText_Black', '', 20)

    // 任務目標
    var achievScript = scene.add.bitmapText(0, 0, 'farmText_Black', '', 18)

    return scene.rexUI.add.sizer({
        // width: 240,
        // height: undefined,
        orientation: 1,
    })

    .add(
        id,
        0,
        'left', { left: 0 },
        false,
        'id'
    )

    .add(
        achievScript,
        0,
        'left', { left: -65, top: 10 },
        false,
        'achievScript'
    )
}

// 比對成就敘述找陣列中位置
var searchOriginIndex = function(stringKey) {
    var originID
    switch (labelType) {
        case 'label_manage':
            originID = getAchievID_manager()
            break;

        case 'label_book':
            originID = getAchievID_book()
            break;

        case 'label_grow':
            originID = getAchievID_grow()
            break;
    }
    for (var i = 0; i < originID.length; i++) {
        if (originID[i] == stringKey) {
            return i
        }
    }
}

// 視窗內容設定
var getItems = function(count, type) {
    labelType = type

    let starFrame
    let id
    let achievList
    let achievNumLV
    let achievGiftLV
    let memberAchiev
    let isReceived

    switch (type) {
        case 'label_manage':
            starFrame = getMemberAchiev_managerStar(); // 星級
            id = getAchievID_manager(); // 成就名稱
            achievList = getAchievList_manager() // 成就內容
            achievNumLV = getAchievNum_manager() // 每一成就條件總量
            achievGiftLV = getAchievGift_manager() // 每一階段獎勵
            memberAchiev = getMemberAchiev_manager() // 每一成就完成數量
            isReceived = getMemberAchiev_managerReceived() // 已領取完成獎勵
            break;

        case 'label_book':
            starFrame = getMemberAchiev_bookStar();
            id = getAchievID_book();
            achievList = getAchievList_book();
            achievNumLV = getAchievNum_book()
            achievGiftLV = getAchievGift_book()
            memberAchiev = getMemberAchiev_book()
            isReceived = getMemberAchiev_bookReceived()
            break;

        case 'label_grow':
            starFrame = getMemberAchiev_growStar();
            id = getAchievID_grow();
            achievList = getAchievList_grow();
            achievNumLV = getAchievNum_grow()
            achievGiftLV = getAchievGift_grow()
            memberAchiev = getMemberAchiev_grow()
            isReceived = getMemberAchiev_growReceived()
            break;
    }

    var data = [];

    for (var i = 0; i < count; i++) {
        data.push({
            starFrame: starFrame[i],
            id: id[i],
            achievList: achievList[i],
            achievNumLV: achievNumLV[i],
            achievGiftLV: achievGiftLV[i],
            memberAchiev: memberAchiev[i],
            isReceived: isReceived[i],
        });
    }

    // 排序(順序:可領取-進行中-已領取)
    var arrCanClick = []
    var arrDoing = []
    var arrFinish = []

    for (var i = 0; i < count; i++) {
        if (data[i].starFrame >= 3) {
            arrFinish.push(data[i])
        } else if (memberAchiev[i] >= achievNumLV[i]) {
            arrCanClick.push(data[i])
        } else {
            arrDoing.push(data[i])
        }
    }

    var sortedData = arrCanClick.concat(arrDoing).concat(arrFinish);

    return sortedData
}

var GetLabelSizer = function(scene) {
    return scene.rexUI.add.sizer({
        // width: undefined,
        // height: 80,
        orientation: 0,
        space: { left: 10, right: 0, top: 0, bottom: 0, item: 0 }
    })

    .add(
        CreateHeaderButton(scene, 'label_manage', 15), // child
        0, // proportion
        'bottom', // align
        { left: 0 }, // padding
        false,
        'label_manage'
    )

    .add(
        CreateHeaderButton(scene, 'label_book', 20),
        0,
        'bottom', { left: 0 },
        false,
        'label_book'
    )

    .add(
        CreateHeaderButton(scene, 'label_grow', 10),
        0,
        'bottom', { left: 0 },
        false,
        'label_grow'
    )

    // 一鍵領取按鈕(暫不做功能)
    // .add(
    //     CreateButton(scene, 'btn_oneClick'),
    //     0,
    //     'center', { left: 130 },
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

function successReachAchieve(t) {
    // console.log('------successReachAchieve')
    // console.log('這裡的this = cellContainer')

    // var stringKey = this.getElement('script').getElement('id').text
    var stringKey = t.getElement('script').getElement('id').text
    var originIndex = searchOriginIndex(stringKey)

    var achieveCategory
    switch (labelType) {
        case 'label_manage':
            achieveCategory = 'plant'
            // setAchievNum_manager(originIndex, FarmerAchieveData[achieveCategory][originIndex].goal_value)
            // setAchievGift_manager(originIndex, FarmerAchieveData[achieveCategory][originIndex].prize_arr[0])
            // setMemberAchiev_manager(originIndex, FarmerAchieveData[achieveCategory][originIndex].now_value, false)
            // setMemberAchiev_managerStar(originIndex, FarmerAchieveData[achieveCategory][originIndex].now_star)
            // setMemberAchiev_managerReceived(originIndex, FarmerAchieveData[achieveCategory][originIndex].received)
            setMemberAchiev_managerStar(originIndex, 3) // 假設直接滿星
            setMemberAchiev_managerReceived(originIndex, true)
            break;

        case 'label_book':
            achieveCategory = 'partner'
            // setAchievNum_book(originIndex, FarmerAchieveData[achieveCategory][originIndex].goal_status)
            // setAchievGift_book(originIndex, FarmerAchieveData[achieveCategory][originIndex].prize_arr[0])
            // setMemberAchiev_book(originIndex, FarmerAchieveData[achieveCategory][originIndex].lock_status, false)
            // setMemberAchiev_bookStar(originIndex, FarmerAchieveData[achieveCategory][originIndex].now_star)
            // setMemberAchiev_bookReceived(originIndex, FarmerAchieveData[achieveCategory][originIndex].received)
            setMemberAchiev_bookStar(originIndex, 3) // 假設直接滿星
            setMemberAchiev_bookReceived(originIndex, true)
            break;

        case 'label_grow':
            achieveCategory = 'other'
            // setAchievNum_grow(originIndex, FarmerAchieveData[achieveCategory][originIndex].goal_value)
            // setAchievGift_grow(originIndex, FarmerAchieveData[achieveCategory][originIndex].prize_arr[0])
            // setMemberAchiev_grow(originIndex, FarmerAchieveData[achieveCategory][originIndex].now_value, false)
            // setMemberAchiev_growStar(originIndex, FarmerAchieveData[achieveCategory][originIndex].now_star)
            // setMemberAchiev_growReceived(originIndex, FarmerAchieveData[achieveCategory][originIndex].received)
            setMemberAchiev_growStar(originIndex, 3) // 假設直接滿星
            setMemberAchiev_growReceived(originIndex, true)
            break;
    }

    var gift
    var star
    var achievList
    var achievNumLV
    var memberAchiev
    var require
    var received
    switch (labelType) {
        case 'label_manage':
            gift = getAchievGift_manager()[originIndex]
            star = getMemberAchiev_managerStar()[originIndex]
            achievList = getAchievList_manager()[originIndex]
            achievNumLV = getAchievNum_manager()[originIndex]
            memberAchiev = getMemberAchiev_manager()[originIndex]
            require = getAchievNum_manager()[originIndex]
            received = getMemberAchiev_managerReceived()[originIndex]
            break;

        case 'label_book':
            gift = getAchievGift_book()[originIndex]
            star = getMemberAchiev_bookStar()[originIndex]
            achievList = getAchievList_book()[originIndex]
            achievNumLV = getAchievNum_book()[originIndex]
            memberAchiev = getMemberAchiev_book()[originIndex]
            require = getAchievNum_book()[originIndex]
            received = getMemberAchiev_bookReceived()[originIndex]
            break;

        case 'label_grow':
            gift = getAchievGift_grow()[originIndex]
            star = getMemberAchiev_growStar()[originIndex]
            achievList = getAchievList_grow()[originIndex]
            achievNumLV = getAchievNum_grow()[originIndex]
            memberAchiev = getMemberAchiev_grow()[originIndex]
            require = getAchievNum_grow()[originIndex]
            received = getMemberAchiev_growReceived()[originIndex]
            break;
    }

    var script
    if (labelType == 'label_book') {
        script = achievList + bookScriptLV[star]
    } else {
        // 完成數量顯示限制在上限
        if (memberAchiev > achievNumLV) {
            memberAchiev = achievNumLV
        }
        script = achievList + '(' + memberAchiev + '/' + require + ')';
    }

    // - - - 更新顯示內容 - - - 
    var giftFrame
    switch (gift.type) {
        case 'obj_coin':
            giftFrame = 0
            break;

        case 'obj_seed':
            // giftFrame = searchPlant_picID(gift.id)
            giftFrame = gift.id
            break;

        case 'obj_tool':
            // giftFrame = searchProp_picID(gift.id)
            giftFrame = gift.id
            break;
    }

    // this.getElement('star').setFrame(star);
    // this.getElement('awardSizer').getElement('prize').setTexture(gift.type).setFrame(giftFrame);
    // this.getElement('awardSizer').getElement('num').setText(gift.num);
    // this.getElement('script').getElement('achievScript').setText(script);
    t.getElement('star').setFrame(star);
    t.getElement('awardSizer').getElement('prize').setTexture(gift.type).setFrame(giftFrame);
    t.getElement('awardSizer').getElement('num').setText(gift.num);
    t.getElement('script').getElement('achievScript').setText(script);

    // // 已領取
    // if (this.getElement('star').frame.name == 3) {
    //     this.getElement('btn_receive').setFrame(2);
    // } // 領取
    // else if (memberAchiev >= require) {
    //     this.getElement('btn_receive').setFrame(1);
    // } // 進行中
    // else {
    //     this.getElement('btn_receive').setFrame(0);
    // }
    // 已領取
    if (t.getElement('star').frame.name == 3) {
        t.getElement('btn_receive').setFrame(2);
    } // 領取
    else if (memberAchiev >= require) {
        t.getElement('btn_receive').setFrame(1);
    } // 進行中
    else {
        t.getElement('btn_receive').setFrame(0);
    }
}