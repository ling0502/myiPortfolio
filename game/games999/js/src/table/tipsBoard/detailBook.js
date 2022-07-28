import { hideSmallBoard, hideSmallCover } from '../../Controller.js'

var dialog

export default class detailBook {

    create(scene, frame, labelType) {
        var config = [{
                key: 'obj_bigN',
                url: '/games/farm/assets/obj_bigN.png',
                frameConfig: { frameWidth: 500, frameHeight: 565, }
            },
            {
                key: 'obj_bigSR',
                url: '/games/farm/assets/obj_bigSR.png',
                frameConfig: { frameWidth: 500, frameHeight: 565, }
            },
            {
                key: 'obj_bigSSR',
                url: '/games/farm/assets/obj_bigSSR.png',
                frameConfig: { frameWidth: 500, frameHeight: 565, }
            }
        ]

        scene.load.spritesheet(config);

        scene.load.once('complete', function() {
            scene.smallBoard = getBoard(scene, frame, labelType)
            console.log('complete')
        }, scene);

        scene.load.start();
    }
}

var getBoard = function(scene, frame, labelType) {
    var bgKey
    switch (labelType) {
        case 'label_N':
            bgKey = 'obj_bigN'
            break;
        case 'label_SR':
            bgKey = 'obj_bigSR'
            break;
        case 'label_SSR':
            bgKey = 'obj_bigSSR'
            break;
    }

    dialog = scene.rexUI.add.dialog({
            x: game.config.width / 2,
            y: game.config.height / 2 - 10,
            width: 500,
            height: 565,

            background: scene.add.sprite(0, 0, bgKey, frame),
        })
        .layout()
        .setDepth(1)

    scene.rexUI.add.click(dialog, { threshold: 10 })
        .on('click', function() {
            hideSmallBoard(scene)
            hideSmallCover(scene)
        });

    return dialog
}