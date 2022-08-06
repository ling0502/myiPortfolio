// import { SignInPrize, reachSignIn, SetSuccessReachSignIn } from '../../../../js/farm_source.js';

import afterSignIn from './tipsBoard/afterSignIn.js'

import { btnClick, showTipsText, showBoard, updateMemberNum, searchPlant_picID, searchProp_picID } from '../Controller.js'
import {
    getMemberCanSignToday,
    setMemberCanSignToday,
    getMemberSignDay,
    setMemberSignDay,
    getMemberSignIn_gift,
} from '../fakeSQL.js'


var dialog;
export default class signInTable {
    create(scene) {
        var canSignToday = getMemberCanSignToday() // 今天是否可簽
        console.log('今天是否可簽' + getMemberCanSignToday())
        console.log('已簽' + getMemberSignDay() + '天')

        dialog = scene.rexUI.add.dialog({
                x: game.config.width / 2,
                y: game.config.height / 2 - 10,
                width: 500,
                height: 565,

                background: scene.add.sprite(0, 0, 'bg_signInBoard'),

                title: GetTitleSizer(scene),

                choices: [
                    createChoiceSizer(scene, 3, 1), // (scene ,格數 ,起始值)
                    createChoiceSizer(scene, 4, 4),
                ],

                space: {
                    left: 10,
                    right: 10,
                    top: 0,
                    bottom: 0,

                    title: 135, // 與下一標籤物件間隔
                },

                // 擴展(延伸填滿)
                expand: {
                    title: false,
                    choices: false,
                },

                align: {
                    title: 'right',
                    choices: 'center',
                },
            })
            .layout()
            // .drawBounds(scene.add.graphics(), 0xff0000)

        showBoard(scene, dialog)

        // 已簽到過的
        var signDay = getMemberSignDay()

        // 如果今天還沒簽到
        if (canSignToday == true) {
            signDay += 1
            if (signDay > 3) {
                dialog.getChoice(1).getElement('day' + signDay).getElement('background').setFrame(1);
                for (var i = 4; i < signDay; i++) {
                    dialog.getChoice(1).getElement('day' + i).getElement('background').setFrame(2).setDepth(1);
                    dialog.getChoice(1).getElement('day' + i).getElement('text').setTint(0x2d2d2d).setDepth(1);
                }
                for (var i = 1; i <= 3; i++) {
                    dialog.getChoice(0).getElement('day' + i).getElement('background').setFrame(2).setDepth(1);
                    dialog.getChoice(0).getElement('day' + i).getElement('text').setTint(0x2d2d2d).setDepth(1);
                }
            } else {
                dialog.getChoice(0).getElement('day' + signDay).getElement('background').setFrame(1);
                for (var i = 1; i < signDay; i++) {
                    dialog.getChoice(0).getElement('day' + i).getElement('background').setFrame(2).setDepth(1);
                    dialog.getChoice(0).getElement('day' + i).getElement('text').setTint(0x2d2d2d).setDepth(1);
                }
            }
        } else {
            if (signDay > 3) {
                for (var i = 4; i <= signDay; i++) {
                    dialog.getChoice(1).getElement('day' + i).getElement('background').setFrame(2).setDepth(1);
                    dialog.getChoice(1).getElement('day' + i).getElement('text').setTint(0x2d2d2d).setDepth(1);
                }
                for (var i = 1; i <= 3; i++) {
                    dialog.getChoice(0).getElement('day' + i).getElement('background').setFrame(2).setDepth(1);
                    dialog.getChoice(0).getElement('day' + i).getElement('text').setTint(0x2d2d2d).setDepth(1);
                }
            } else {
                for (var i = 1; i <= signDay; i++) {
                    dialog.getChoice(0).getElement('day' + i).getElement('background').setFrame(2).setDepth(1);
                    dialog.getChoice(0).getElement('day' + i).getElement('text').setTint(0x2d2d2d).setDepth(1);
                }
            }
        }

        return dialog
    }
}

var GetTitleSizer = function(scene) {
    return scene.rexUI.add.sizer({
        orientation: 0,
        space: { left: 0, right: -14, top: 0, bottom: 0, item: 0 },
    })

    .add(
        CreateButton(scene, 'btn_close'),
        0,
        'center', { top: -10 },
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

var createChoiceSizer = function(scene, num, from) {
    // 間距調整
    let sideSpace
    let topPadding
    if (from == 1) {
        sideSpace = 70;
        topPadding = 0;
    } else {
        sideSpace = 10;
        topPadding = -70; // 扣掉中間兩行間隔重複算
    }

    var choiceSizer = scene.rexUI.add.sizer({
        width: 105,
        height: 140,
        orientation: 0,
        space: { left: sideSpace, right: sideSpace, top: 45, bottom: 45, item: 5 },
    })

    var gift = getMemberSignIn_gift()
    console.log('--------------')
    console.log(gift)
    var max = from + num - 1

    for (var i = from - 1; i < max; i++) {
        var giftFrame
        switch (gift[i].type) {
            case 'obj_coin':
                giftFrame = 0
                break;

            case 'obj_seed':
                // giftFrame = searchPlant_picID(gift[i].id)
                giftFrame = gift[i].id
                break;

            case 'obj_tool':
                // giftFrame = searchProp_picID(gift[i].id)
                giftFrame = gift[i].id
                break;
        }

        choiceSizer.add(
            createChoiceButton(scene, gift[i].type, giftFrame, gift[i].num, i),
            1, // proportion
            'center', // align
            { top: topPadding }, // padding
            false,
            'day' + (i + 1)
        )
    }

    return choiceSizer
}

var createChoiceButton = function(scene, giftType, frame, num, day) {
    var dayIndex = ['一', '二', '三', '四', '五', '六', '七']

    var dayLabel = scene.rexUI.add.label({
        width: 105,
        height: 140,
        orientation: 1,

        background: scene.add.sprite(0, 0, 'obj_signInBack', 0), // (frame1:簽到當天 frame2:已簽過)
        text: scene.add.bitmapText(0, 0, 'farmText_White', '第' + dayIndex[day] + '天', 16),
        // 簽到獎勵
        action: scene.add.sprite(0, 0, giftType, frame).setScale(0.8),

        space: {
            top: 10,
            text: 15,
        },
    })

    .setInteractive()
        .on('pointerdown', function() {
            if (scene.smallCover != undefined) {
                return
            }

            if (dayLabel.getElement('background').frame.name != 1) {
                return
            }

            // SetSuccessReachSignIn(successReachSignIn, scene)

            var isEnough = true

            // 購買道具會有爆倉問題 (道具改不佔用倉庫空間)
            // if (giftType == 'obj_tool') {
            //     isEnough = checkSpace(dayLabel.getElement('action'), num)
            // }

            // 有足夠倉庫空間
            if (isEnough) {
                // reachSignIn()
                successReachSignIn(scene)

                dayLabel.getElement('background').setFrame(2).setDepth(1);
                dayLabel.getElement('text').setTint(0x2d2d2d).setDepth(1);

                updateMemberNum(scene, dayLabel.getElement('action'), num)
            } else {
                showTipsText(scene, '倉庫空間不足')
            }
        }, scene);

    return dayLabel
}

function successReachSignIn(t) {
    console.log('------successReachSignIn')
    console.log('這裡的this = scene')

    //fakeSQL用
    var SignInPrize = []
    SignInPrize.push(getMemberSignIn_gift()[getMemberSignDay()])

    setMemberCanSignToday(false)
    setMemberSignDay(1, true)

    var giftFrame
    switch (SignInPrize[0].type) {
        case 'obj_coin':
            giftFrame = 0
            break;

        case 'obj_seed':
            // giftFrame = searchPlant_picID(SignInPrize[0].id)
            giftFrame = SignInPrize[0].id
            break;

        case 'obj_tool':
            // giftFrame = searchProp_picID(SignInPrize[0].id)
            giftFrame = SignInPrize[0].id
            break;
    }

    // 出現小框時大框變暗
    // this.smallCover = this.add.sprite(dialog.x + 1, dialog.y - 5, 'smallCover')
    t.smallCover = t.add.sprite(dialog.x + 1, dialog.y - 5, 'smallCover')

    // 顯示小框
    // new afterSignIn().create(this, SignInPrize[0].type, giftFrame, SignInPrize[0].num)
    new afterSignIn().create(t, SignInPrize[0].type, giftFrame, SignInPrize[0].num)
}