// import { SetSuccessUnlockPartner, unlockPartner, UnlockPartnerResult } from '../../../../js/farm_source.js';

import detailBook from './tipsBoard/detailBook.js'

import { btnClick, showBoard, PlayAudio, searchPartnerID } from '../Controller.js'
import {
    getMemberBook_N,
    setMemberBook_N,
    getLockMask_memberBookN,
    setLockMask_memberBookN,
    getMemberBook_NIntimacy,
    setMemberBook_NIntimacy,
    getMemberBook_SR,
    setMemberBook_SR,
    getLockMask_memberBookSR,
    setLockMask_memberBookSR,
    getMemberBook_SRIntimacy,
    setMemberBook_SRIntimacy,
    getMemberBook_SSR,
    setMemberBook_SSR,
    getLockMask_memberBookSSR,
    setLockMask_memberBookSSR,
    getMemberBook_SSRIntimacy,
    setMemberBook_SSRIntimacy,
    getOwned_memberBookN,
    getOwned_memberBookSR,
    getOwned_memberBookSSR,
    setUpgradeNum_memberBookN,
    setUpgradeNum_memberBookSR,
    setUpgradeNum_memberBookSSR,
} from '../fakeSQL.js'

var dialog;
var preLabel;
var labelType;
export default class bookTable {
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
                                cellContainer.getElement('background').setFrame(item.bgFrame);

                                if (item.key == 'obj_bookLock') {
                                    cellContainer.getElement('pic').setTexture(item.key);
                                } else {
                                    cellContainer.getElement('pic').setTexture(item.key, item.frame);
                                }

                                switch (item.key) {
                                    case 'obj_N':
                                        item.memberBook = getMemberBook_N()[index]; // 沒有重新排序，可以直接取cell.index當索引
                                        item.owned = getOwned_memberBookN()[index];
                                        item.lockMask = getLockMask_memberBookN()[index];
                                        item.intimacy = getMemberBook_NIntimacy()[index];
                                        break;
                                    case 'obj_SR':
                                        item.memberBook = getMemberBook_SR()[index];
                                        item.owned = getOwned_memberBookSR()[index];
                                        item.lockMask = getLockMask_memberBookSR()[index];
                                        item.intimacy = getMemberBook_SRIntimacy()[index];
                                        break;
                                    case 'obj_SSR':
                                        item.memberBook = getMemberBook_SSR()[index];
                                        item.owned = getOwned_memberBookSSR()[index];
                                        item.lockMask = getLockMask_memberBookSSR()[index];
                                        item.intimacy = getMemberBook_SSRIntimacy()[index];
                                        break;
                                }

                                if (item.owned == false) {
                                    cellContainer.getElement('lockMask').setFrame(0);
                                    cellContainer.getElement('lockMask').setVisible(true);
                                    // console.log(index + '==0 未解鎖')
                                } else if (item.lockMask == true) {
                                    showLockMask(scene, cellContainer.getElement('lockMask'))
                                    // console.log(index + '>=')
                                } else {
                                    cellContainer.getElement('lockMask').setFrame(2);
                                    // console.log(index + 'else hide')
                                }

                                // - - - 更新顯示內容 - - - 
                                cellContainer.getElement('obj_heart').setFrame(item.intimacy);
                                cellContainer.getElement('collectNum').setText(item.memberBook);
                                if (item.intimacy == 3 || cellContainer.getElement('lockMask').frame.name == 1) {
                                    cellContainer.getElement('collectNum').setText('MAX').setFontSize(12);
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
                            CreateHeaderButton(scene, 'label_N', 10),
                            CreateHeaderButton(scene, 'label_SR', 10),
                            CreateHeaderButton(scene, 'label_SSR', 10),
                        ],
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

        var items = getItems(10, 'label_N');

        // 預設顯示標籤
        // preLabel = 'label_N';
        preLabel = dialog.getElement('description').getTopButton(0);
        dialog.getElement('description').getTopButton(0).getElement('background').setFrame(0);
        dialog.getElement('description').getElement('panel').setItems(items).scrollToTop();

        // Grid table
        dialog.getElement('description').getElement('panel')
            .on('cell.click', function(cellContainer, cellIndex) {
                if (scene.smallCover != undefined) {
                    return
                }

                var obj_lock = cellContainer.getElement('lockMask')
                if (obj_lock.frame.name == 1) {
                    PlayAudio(scene, 'unlockBookSE')

                    // SetSuccessUnlockPartner(successUnlockPartner, cellContainer);

                    obj_lock.setFrame(2);

                    // faleSQL 用
                    var UnlockPartnerData = {
                        status_value: 1,
                        lockMask: false,
                        lock_status: 3, // 假設直接滿星
                        next_status_value: 1,
                    }
                    var picKey = cellContainer.getElement('pic').texture.key
                    switch (picKey) {
                        case 'obj_N':
                            // unlockPartner(searchPartnerID('N', cellIndex))
                            successUnlockPartner(cellContainer,UnlockPartnerData)
                            break;

                        case 'obj_SR':
                            // unlockPartner(searchPartnerID('SR', cellIndex))
                            successUnlockPartner(cellContainer,UnlockPartnerData)
                            break;

                        case 'obj_SSR':
                            // unlockPartner(searchPartnerID('SSR', cellIndex))
                            successUnlockPartner(cellContainer,UnlockPartnerData)
                            break;
                    }
                    return
                } else if (obj_lock.frame.name == 2) { // setVisible(false)的替待方式，setVisible在捲動的時候會有問題
                    // 出現小框時大框變暗
                    scene.smallCover = scene.add.sprite(dialog.x + 1, dialog.y - 5, 'smallCover')

                    // 顯示小框
                    new detailBook().create(scene, cellContainer.getElement('pic').frame.name, labelType)
                }
            }, scene);

        showBoard(scene, dialog)

        return dialog
    }
}

var GetTitleSizer = function(scene) {
    var title = scene.add.sprite(0, 0, 'title_book');

    return scene.rexUI.add.sizer({
        // width: undefined,
        // height: 80,
        orientation: 0,
        space: { left: 0, right: 0, top: 0, bottom: 0, item: 0 }, // item : 兩物件之間的距離
        name: 'book' // btn_QA用
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
            btnClick(scene, button)
        })

    return button
}

var createRowItem = function(scene) {
    var background = scene.add.sprite(0, 0, 'bg_bookRect');

    // 親密度
    var obj_heart = scene.add.sprite(0, 0, 'obj_heart', 0);

    // 單一圖鑑蒐集數量
    var collectNum = scene.add.bitmapText(0, 0, 'farmText_White', '', 14).setOrigin(0.5);

    // 圖鑑圖示
    var pic = scene.add.sprite(0, 0, 'obj_N', 0);

    // 未解鎖
    var lockMask = scene.add.sprite(0, 0, 'bg_locked', 0);

    return scene.rexUI.add.sizer({
        width: 150,
        height: 175,
        orientation: 1,
    })

    .addBackground(
        background,
        'background'
    )

    .add(
        obj_heart, // 遊戲對象
        0, // 比例 (0:與下一物件緊密對齊)
        'center', // 垂直對齊 (center ,left ,right ,top ,bottom)
        { left: -110, top: 10 }, // 邊界 (left ,right ,top ,bottom)) //18
        false, // 擴展 (寬度/高度)
        'obj_heart' // 添加至map-key，可以讀取sizer.getElement(key)
    )

    .add(
        collectNum,
        0,
        'center', { right: -106, top: -18 },
        false,
        'collectNum'
    )

    .add(
        pic,
        0,
        'center', { left: -1, top: -11 },
        false,
        'pic'
    )

    .add(
        lockMask,
        0,
        'center', { top: -153 },
        false,
        'lockMask'
    )
}


// 視窗內容設定
var getItems = function(count, type) {
    labelType = type

    let bgFrame
    let key
    let memberBook
    let owned // 已擁有
    let lockMask // 顯示解鎖圖
        // let isClicked // 已點擊解鎖
    let intimacy // 親密度

    switch (type) {
        case 'label_N':
            bgFrame = 0;
            key = 'obj_N';
            memberBook = getMemberBook_N();
            owned = getOwned_memberBookN();
            lockMask = getLockMask_memberBookN();
            intimacy = getMemberBook_NIntimacy()
            break;
        case 'label_SR':
            bgFrame = 1;
            key = 'obj_SR';
            memberBook = getMemberBook_SR();
            owned = getOwned_memberBookSR();
            lockMask = getLockMask_memberBookSR();
            intimacy = getMemberBook_SRIntimacy()
            break;
        case 'label_SSR':
            bgFrame = 2;
            key = 'obj_SSR';
            memberBook = getMemberBook_SSR();
            owned = getOwned_memberBookSSR();
            lockMask = getLockMask_memberBookSSR();
            intimacy = getMemberBook_SSRIntimacy()
            break;
    }

    var data = [];
    var picKey

    for (var i = 0; i < count; i++) {
        if (memberBook[i] == 0 && owned[i] == false) {
            picKey = 'obj_bookLock' // 改成未解鎖的黑圖
        } else {
            picKey = key
        }

        data.push({
            bgFrame: bgFrame,
            key: picKey,
            memberBook: memberBook[i],
            frame: i,
            owned: owned[i],
            lockMask: lockMask[i],
            // isClicked: isClicked[i],
            intimacy: intimacy[i]
        });
    }

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

            headerButton.getElement('background').setFrame(0);
            var items = getItems(itemNum, itemType);
            dialog.getElement('description').getElement('panel').setItems(items).scrollToTop();
            labelType = itemType

            if (preLabel != headerButton) {
                preLabel.getElement('background').setFrame(1);
            }

            preLabel = headerButton;
        })

    return headerButton
}

var showLockMask = function(scene, target) {
    target.setFrame(1);
    // target.setVisible(true);

    // 閃爍動畫
    scene.tweens.addCounter({
        from: 255,
        to: 100,
        yoyo: true,
        repeat: -1,
        duration: 700,
        onUpdate: function(tween) {
            const value = Math.floor(tween.getValue());
            target.setTint(Phaser.Display.Color.GetColor(value, value, value));
        }
    });
}

function successUnlockPartner(t, UnlockPartnerData) {
    // console.log('------successUnlockPartner')
    // console.log('這裡的this = cellContainer')

    // var UnlockPartnerData = UnlockPartnerResult.partner_data
    // var picKey = this.getElement('pic').texture.key
    // var picIndex = this.getElement('pic').frame.name
    var picKey = t.getElement('pic').texture.key
    var picIndex = t.getElement('pic').frame.name

    var memberBook = UnlockPartnerData.status_value
    var lockMask = UnlockPartnerData.lock_mask
    var heartFrame = UnlockPartnerData.lock_status
    var upgradeNum = UnlockPartnerData.next_status_value

    switch (picKey) {
        case 'obj_N':
            setMemberBook_N(picIndex, memberBook, false)
            setLockMask_memberBookN(picIndex, lockMask)
            setMemberBook_NIntimacy(picIndex, heartFrame)
            setUpgradeNum_memberBookN(picIndex, upgradeNum)
            break;

        case 'obj_SR':
            setMemberBook_SR(picIndex, memberBook, false)
            setLockMask_memberBookSR(picIndex, lockMask)
            setMemberBook_SRIntimacy(picIndex, heartFrame)
            setUpgradeNum_memberBookSR(picIndex, upgradeNum)
            break;

        case 'obj_SSR':
            setMemberBook_SSR(picIndex, memberBook, false)
            setLockMask_memberBookSSR(picIndex, lockMask)
            setMemberBook_SSRIntimacy(picIndex, heartFrame)
            setUpgradeNum_memberBookSSR(picIndex, upgradeNum)
            break;
    }

    // - - - 更新顯示內容 - - - 
    // this.getElement('obj_heart').setFrame(heartFrame);
    // this.getElement('collectNum').setText(memberBook)
    // if (heartFrame == 3) {
    //     this.getElement('collectNum').setText('MAX').setFontSize(12);
    // }
    t.getElement('obj_heart').setFrame(heartFrame);
    t.getElement('collectNum').setText(memberBook)
    if (heartFrame == 3) {
        t.getElement('collectNum').setText('MAX').setFontSize(12);
    }
}