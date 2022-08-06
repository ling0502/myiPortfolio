import { hideSmallBoard, hideSmallCover, PlayAudio } from '../../Controller.js'

var dialog;

export default class afterSignIn {

    create(scene, giftType, frame, num) {
        var config = [
            { key: 'bg_smallBoard', url: './assets/bg_smallBoard.png' },
        ]

        var config2 = [{
            key: 'title_afterSignIn',
            url: './assets/title_afterSignIn.png',
            frameConfig: { frameWidth: 425, frameHeight: 280, }
        }]

        scene.load.image(config);
        scene.load.spritesheet(config2);

        scene.load.once('complete', function () {
            console.log('afterSignIn-complete')
            scene.smallBoard = getBoard(scene, giftType, frame, num)
        }, scene);

        scene.load.start();
    }
}

var getBoard = function (scene, giftType, frame, num) {
    PlayAudio(scene, 'giftBoardSE')

    scene.anims.create({
        key: 'title_afterSignIn',
        frames: scene.anims.generateFrameNumbers('title_afterSignIn', { start: 0, end: 3 }),
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
        title: scene.add.sprite(0, 0, 'title_afterSignIn').anims.play('title_afterSignIn'),
        content: GetContentSizer(scene, giftType, frame, num),

        space: {
            left: 10,
            right: 10,
            top: -70,
            bottom: 0,

            title: -50,
        },

        expand: {
            title: false,
        },

    })
        .layout()
        .popUp(300)
        .setDepth(1)

    scene.rexUI.add.click(dialog, { threshold: 10 })
        .on('click', function () {
            hideSmallBoard(scene)
            hideSmallCover(scene)
        });

    return dialog
}

var GetContentSizer = function (scene, giftType, frame, num) {
    var awards = scene.add.sprite(0, 0, giftType, frame).setScale(1.3);

    var num = scene.rexUI.add.label({
        width: 50,
        height: 50,
        text: scene.add.bitmapText(0, 0, 'farmText_Black', '+' + num, 20),
    })

    return scene.rexUI.add.sizer({
        // width: 365,
        // height: 270,
        orientation: 1,
        space: { left: 0, right: 0, top: 0, bottom: 0, item: 0 }
    })

        .add(
            awards,
            0,
            'center', { left: 0 },
            false,
            'awards'
        )

        .add(
            num,
            0,
            'center', { left: 170, top: -30 },
            false,
            'num'
        )
}