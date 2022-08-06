// import { PlantPicIndexData, PropPicIndexData } from '../../../../../js/farm_source.js';

import { hideBoard, hideCover, updateMemberNum, PlayAudio } from '../../Controller.js'

var dialog;

export default class levelUp {
    create(scene, award, unlock) {
        var config = [
            { key: 'bg_smallBoard', url: './assets/bg_smallBoard.png' },
            { key: 'obj_warehouse', url: './assets/obj_warehouse.png' },
            { key: 'obj_new', url: './assets/obj_new.png' },
        ]

        var config2 = [{
            key: 'title_levelUp',
            url: './assets/title_levelUp.png',
            frameConfig: { frameWidth: 425, frameHeight: 280, }
        }, {
            key: 'obj_seed',
            url: './assets/obj_seed.png',
            frameConfig: { frameWidth: 120, frameHeight: 100, }
        }, {
            key: 'obj_tool',
            url: './assets/obj_tool.png',
            frameConfig: { frameWidth: 120, frameHeight: 100, }
        }]

        scene.load.image(config);
        scene.load.spritesheet(config2);

        scene.load.once('complete', function() {
            console.log('levelUp-complete')
            scene.board = this.getBoard(scene, award, unlock)
        }, this);

        scene.load.start();
    }

    getBoard(scene, award, unlock) {
        PlayAudio(scene, 'giftBoardSE')
        console.log(award)
        scene.anims.create({
            key: 'title_levelUp',
            frames: scene.anims.generateFrameNumbers('title_levelUp', { start: 0, end: 3 }),
            frameRate: 6,
            repeat: -1,
        });

        dialog = scene.rexUI.add.dialog({
                x: game.config.width / 2,
                y: game.config.height / 2,
                width: 600,
                height: 365,
                scrollMode: 1,

                background: scene.add.image(0, 0, 'bg_smallBoard'),
                title: scene.add.sprite(0, 0, 'title_levelUp').anims.play('title_levelUp'),

                choices: [
                    GetChoiceSizer(scene, award, 'award'),
                    GetChoiceSizer(scene, unlock, 'unlock')
                ],

                space: {
                    left: 10,
                    right: 10,
                    top: -70,
                    bottom: 0,

                    title: -65,
                    choice: 10,
                },

                expand: {
                    title: false,
                    choices: false,
                },
            })
            .layout()
            .setDepth(1)
            .popUp(300)
            // .drawBounds(scene.add.graphics(), 0xff0000)

        // 關閉小框功能
        scene.rexUI.add.click(dialog, { threshold: 10 })
            .on('click', function() {
                for (var i = 0; i < dialog.getChoice(0).getElement('items').length; i++) {
                    var giftItems = dialog.getChoice(0).getElement('award' + i)
                    console.log('關閉小框: ' + giftItems.getElement('num').text)
                    updateMemberNum(scene, giftItems.getElement('gift'), giftItems.getElement('num').text)
                }

                hideBoard(scene)
                hideCover(scene)
                scene.events.emit('releaseDrag'); // 至playScene接收
                scene.events.emit('levelUp_updateWood'); // 至playScene接收
            });

        return dialog
    }
}
var GetChoiceSizer = function(scene, obj, type) {
    var choiceSizer = scene.rexUI.add.sizer({
        width: 90,
        height: 90,
        orientation: 0,
        space: { left: 25, right: 25, top: 0, bottom: 0, item: 40 } // item : 兩物件之間的距離
    })

    if (type == 'award') {
        for (var i = 0; i < obj.length; i++) {
            choiceSizer.add(
                CreateAwardChoice(scene, obj[i]), //child
                0, // proportion
                'left', // align
                { left: 0 }, // padding
                false, // 擴展 (寬度/高度)
                type + i
            )
        }
    } else if (type == 'unlock') {
        for (var j = 0; j < obj.length; j++) {
            choiceSizer.add(
                CreateUnlockChoice(scene, obj[j]),
                0,
                'left', { left: 0 },
                false,
            )
        }
    }

    return choiceSizer
}

var CreateAwardChoice = function(scene, giftInfo) {
    var giftFrame
    switch (giftInfo.type) {
        case 'obj_coin':
            giftFrame = 0
            break;

        case 'obj_seed':
            // giftFrame = PlantPicIndexData[giftInfo.id]
            giftFrame = giftInfo.id
            break;

        case 'obj_tool':
            // giftFrame = PropPicIndexData[giftInfo.id]
            giftFrame = giftInfo.id
            break;
    }
    console.log('------------- ' + giftInfo.type + ' = ' + giftFrame)

    // 獎勵圖示
    var gift = scene.add.sprite(0, 0, giftInfo.type, giftFrame).setScale(0.8)

    // 獎勵數量
    var numText = scene.add.bitmapText(0, 0, 'farmText_Black', '+' + giftInfo.num, 20)

    return scene.rexUI.add.sizer({
        orientation: 0,
        space: { left: 0, right: 0, top: 0, bottom: 0, item: 0 }
    })

    .add(
        gift, //child
        0, // proportion
        'center', // align
        { left: 0 }, // padding
        false, // 擴展 (寬度/高度)
        'gift'
    )

    .add(
        numText,
        0,
        'center', { left: 0, top: 50 },
        false,
        'num'
    )
}

var CreateUnlockChoice = function(scene, newOpen) {
    var newOpenKey
    var newOpenFrame
    switch (newOpen.type) {
        case 'land':
            newOpenKey = 'land'
            newOpenFrame = 0
            break;

        case 'warehouse':
            newOpenKey = 'obj_warehouse'
            newOpenFrame = 0
            break;

        case 'plant':
            newOpenKey = 'obj_crop'
                // newOpenFrame = PlantPicIndexData[newOpen.id]
            newOpenFrame = newOpen.id
            break;
    }

    var gift = scene.add.sprite(0, 0, newOpenKey, newOpenFrame)
    var scale = 96 / gift.width
    gift.setScale(scale)

    var obj_new = scene.add.sprite(0, 0, 'obj_new')

    return scene.rexUI.add.sizer({
        orientation: 0,
    })

    .add(
        gift, //child
        0, // proportion
        'center', // align
        { left: 0 }, // padding
        false, // 擴展 (寬度/高度)
        'gift'
    )

    .add(
        obj_new,
        0,
        'center', { left: -5, top: 50 },
        false,
        'obj_new'
    )
}