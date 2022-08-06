// import { SetSuccessReachNewbiePrize, NewbiePrize, reachNewbiePrize } from '../../../../../js/farm_source.js';

import { btnClick, hideBoard, hideCover, searchPlant_picID, searchProp_picID } from '../../Controller.js'
import { setFirstEnter, setMemberCoin, setMemberSeed, setMemberTool, getMemberSignIn_gift } from '../../fakeSQL.js'

var dialog;

export default class beginGift {
    create(scene) {
        var config = [
            { key: 'beginGift', url: './assets/beginGift.png' },
        ]
        var config2 = [{
            key: 'btn_receive',
            url: './assets/btn_receive.png',
            frameConfig: { frameWidth: 65, frameHeight: 40, }
        }]

        scene.load.image(config);
        scene.load.spritesheet(config2);

        scene.load.once('complete', function() {
            // console.log('beginGift - complete')
            scene.board = this.getBoard(scene)
        }, this);

        scene.load.start();
    }

    getBoard(scene) {
        dialog = scene.rexUI.add.dialog({
            x: game.config.width / 2,
            y: game.config.height / 2 - 10,
            width: 500,
            height: 565,

            background: scene.add.image(0, 0, 'beginGift'),

            actions: [
                scene.add.sprite(0, 0, 'btn_receive', 1).setScale(1.2),
            ],

            space: {
                left: 10,
                right: 10,
                top: 480,
                bottom: 0,
            },

            expand: {
                actions: false,
            },
        })

        .layout()
            .setDepth(1)
            // .drawBounds(scene.add.graphics(), 0xff0000)

        scene.rexUI.add.click(dialog, { clickInterval: 100 })
            .on('click', function() {
                if (scene.rexUI.isInTouching(dialog.getAction(0))) {
                    btnClick(scene, dialog.getAction(0))

                    // SetSuccessReachNewbiePrize(successReachNewbiePrize, scene)
                    // reachNewbiePrize();
                    successReachNewbiePrize(getMemberSignIn_gift(), scene)
                }
            });

        return dialog
    }
}

// function successReachNewbiePrize() {
function successReachNewbiePrize(NewbiePrize, t) {
    // console.log('------successReachNewbiePrize ')
    // console.log('這裡的this = scene')

    setFirstEnter(false)

    for (var i = 0; i < NewbiePrize.length; i++) {
        switch (NewbiePrize[i].type) {
            case 'obj_coin':
                setMemberCoin(NewbiePrize[i].num, true)
                break;

            case 'obj_seed':
                setMemberSeed(searchPlant_picID(NewbiePrize[i].id), NewbiePrize[i].num, true)
                break;

            case 'obj_tool':
                setMemberTool(searchProp_picID(NewbiePrize[i].id), NewbiePrize[i].num, true)
                break;
        }
    }

    // this.updateMemberCoin()
    t.updateMemberCoin()

    // for (var i = 0; i < this.UiButtons.length; i++) {
    //     this.UiButtons[i].setInteractive()
    // }
    for (var i = 0; i < t.UiButtons.length; i++) {
        t.UiButtons[i].setInteractive()
    }

    // hideBoard(this)
    // hideCover(this)
    // this.events.emit('releaseDrag'); // 至playScene接收
    hideBoard(t)
    hideCover(t)
    t.events.emit('releaseDrag'); // 至playScene接收
}