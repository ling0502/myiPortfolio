// import { ScoreBoxPrize } from '../../../../../js/farm_source.js';

import { hideSmallBoard, hideSmallCover, updateMemberNum, PlayAudio, searchPlant_picID, searchProp_picID } from '../../Controller.js'
import { getTaskBoxGift } from '../../fakeSQL';

var dialog;

export default class afterUnboxing {
    create(scene) {
        var config = [
            { key: 'bg_smallBoard', url: '/games/farm/assets/bg_smallBoard.png' },
        ]
        var config2 = [{
            key: 'title_afterUnboxing',
            url: '/games/farm/assets/title_afterUnboxing.png',
            frameConfig: { frameWidth: 425, frameHeight: 280, }
        }]

        scene.load.image(config);
        scene.load.spritesheet(config2);

        scene.load.once('complete', function() {
            console.log('afterUnboxing - complete')
            scene.smallBoard = getBoard(scene)
        }, scene);

        scene.load.start();
    }
}

var getBoard = function(scene) {
    PlayAudio(scene, 'giftBoardSE')
    scene.anims.create({
        key: 'title_afterUnboxing',
        frames: scene.anims.generateFrameNumbers('title_afterUnboxing', { start: 0, end: 3 }),
        frameRate: 6,
        repeat: -1,
    });

    // fakeSQL用
    var ScoreBoxPrize = getTaskBoxGift();
    
    dialog = scene.rexUI.add.dialog({
            x: game.config.width / 2,
            y: game.config.height / 2,
            width: 600,
            height: 365,
            scrollMode: 1,

            background: scene.add.image(0, 0, 'bg_smallBoard'),
            title: scene.add.sprite(0, 0, 'title_afterUnboxing').anims.play('title_afterUnboxing'),
            actions: [
                GetContentLabel(scene, ScoreBoxPrize[0].type, ScoreBoxPrize[0].id, ScoreBoxPrize[0].num),
                GetContentLabel(scene, ScoreBoxPrize[1].type, ScoreBoxPrize[1].id, ScoreBoxPrize[1].num),
                GetContentLabel(scene, ScoreBoxPrize[2].type, ScoreBoxPrize[2].id, ScoreBoxPrize[2].num),
            ],

            space: {
                left: 10,
                right: 10,
                top: -70,
                bottom: 0,

                actionsLeft: 30,

                title: -50,
                action: 10,
            },

            expand: {
                title: false,
                content: false,
            },
        })
        .layout()
        // .drawBounds(scene.add.graphics(), 0xff0000)

    // 關閉小框功能
    scene.rexUI.add.click(dialog, { threshold: 10 })
        .on('click', function() {
            hideSmallBoard(scene)
            hideSmallCover(scene)
        });

    var actionItem = dialog.getElement('actions')
    for (var i = 0; i < actionItem.length; i++) {
        console.log(i + ': ' + actionItem[i].getElement('gift') + ' / ' + actionItem[i].getElement('num').text.substr(1))

        updateMemberNum(scene, actionItem[i].getElement('gift'), actionItem[i].getElement('num').text.substr(1))
    }

    return dialog
}

var GetContentLabel = function(scene, key, id, num) {
    var giftFrame
    switch (key) {
        case 'obj_coin':
            giftFrame = 0
            break;

        case 'obj_seed':
            // giftFrame = searchPlant_picID(id)
            giftFrame = id
            break;

        case 'obj_tool':
            // giftFrame = searchProp_picID(id)
            giftFrame = id
            break;
    }

    var gift = scene.add.sprite(0, 0, key, giftFrame)
    var scale = 90 / gift.width
    gift.setScale(scale)

    var numText = scene.add.bitmapText(0, 0, 'farmText_Black', '+' + num, 20)

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
        'center', { left: -5, top: 50 },
        false,
        'num'
    )
}