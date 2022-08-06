import beginGift from './beginGift'
import { btnClick, hideBoard, hideSmallBoard, hideSmallCover } from '../../Controller.js'

var dialog;

export default class teachTable {
    create(scene, page, isSmallBoard) {

        var config = [
            { key: 'bg_teach', url: './assets/teach/bg_teach.png' },
            { key: 'teach_land', url: './assets/teach/teach_land.png' },
            { key: 'teach_ui', url: './assets/teach/teach_ui.png' },
            { key: 'teach_book', url: './assets/teach/teach_book.png' },
            { key: 'teach_warehouse', url: './assets/teach/teach_warehouse.png' },
            { key: 'teach_shop', url: './assets/teach/teach_shop.png' },
            { key: 'teach_button', url: './assets/teach/teach_button.png' },
        ]

        scene.load.image(config);
        scene.load.once('complete', function() {
            console.log('teachTable - complete')
            if (isSmallBoard == true) {
                console.log('isSmallBoard')
                scene.smallBoard = this.getBoard(scene, page, isSmallBoard)
            } else {
                console.log('isSmallBoard = false')
                scene.board = this.getBoard(scene, page, isSmallBoard)
            }
        }, this);

        scene.load.start();
    }

    getBoard(scene, page, isSmallBoard) {
        var preIndex = page
        var imgArray = ['teach_land', 'teach_ui', 'teach_book', 'teach_warehouse', 'teach_shop']

        dialog = scene.rexUI.add.dialog({
            x: game.config.width / 2,
            y: game.config.height / 2 - 10,
            width: 500,
            height: 565,

            background: scene.add.image(0, 0, 'bg_teach'),

            title: GetTitleSizer(scene),

            content: scene.add.image(0, 0, imgArray[page]),

            description: CreateDescriptionSizer(scene, imgArray),

            actions: [
                scene.add.sprite(0, 0, 'teach_button', 0),
                scene.add.sprite(0, 0, 'teach_button', 0).setFlipX(true),
            ],

            space: {
                left: 10,
                right: 10,
                top: 0,
                bottom: 260,

                title: 30,
                content: 10, // 與下方物件距離
                description: -300,
                descriptionLeft: 150,
                actionsLeft: -350,
                actionsRight: -345,

                action: 350, // 兩物件距離
            },

            expand: {
                title: false,
                content: false,
                actions: false,
            },

            align: {
                title: 'right',
            }
        })

        .layout()
            .setDepth(1)
            // .drawBounds(scene.add.graphics(), 0xff0000)

        // 預設當前頁面顯示深色
        dialog.getElement('description').getElement('circle' + page).setFillStyle(0x40220f)

        scene.rexUI.add.click(dialog, { clickInterval: 100 })
            .on('click', function() {
                var btn
                var index = imgArray.indexOf(dialog.getElement('content').texture.key)

                if (scene.rexUI.isInTouching(dialog.getElement('title').getElement('btn_close'))) {
                    btn = dialog.getElement('title').getElement('btn_close')
                } else if (scene.rexUI.isInTouching(dialog.getAction(0))) {
                    btn = dialog.getAction(0)
                    index--
                    if (index < 0) {
                        index = imgArray.length - 1
                    }
                } else if (scene.rexUI.isInTouching(dialog.getAction(1))) {
                    btn = dialog.getAction(1)
                    index++
                    if (index == imgArray.length) {
                        index = 0
                    }
                }

                if (btn == undefined) return

                btnClick(scene, btn, false)
                    .on('complete', function(tween, targets) {
                        if (btn.texture.key == 'btn_close') {
                            if (isSmallBoard == false) {
                                hideBoard(scene)

                                scene.time.addEvent({
                                    delay: 150,
                                    callback: function() {
                                        // 首次登入遊戲，關閉新手教學開啟新手禮包   
                                        new beginGift().create(scene)
                                    },
                                    callbackScope: this,
                                })
                            } else {
                                hideSmallBoard(scene)
                                hideSmallCover(scene)
                            }
                        } else {
                            dialog.getElement('content').setTexture(imgArray[index])
                            dialog.getElement('description').getElement('circle' + index).setFillStyle(0x40220f)
                            dialog.getElement('description').getElement('circle' + preIndex).setFillStyle(0xe2d6ba)

                            preIndex = index
                        }
                    }, scene);
            });

        return dialog
    }
}
var GetTitleSizer = function(scene) {
    var button = scene.add.sprite(0, 0, 'btn_close', 0)

    return scene.rexUI.add.sizer({
        orientation: 0,
        space: { left: 0, right: -10, top: -10, bottom: 0, item: 0 },
    })

    .add(
        button,
        0,
        'center', { left: 0 },
        false,
        'btn_close'
    )
}

var CreateDescriptionSizer = function(scene, imgArray) {
    var sizer = scene.rexUI.add.sizer({
        orientation: 0,
        space: { left: 0, right: 0, top: 0, bottom: 0, item: 20 }
    })

    for (var i = 0; i < imgArray.length; i++) {
        sizer.add(
            scene.rexUI.add.roundRectangle(0, 0, 5, 5, 10, 0xe2d6ba),
            0,
            'center',
            false, { left: 0 },
            'circle' + i
        )
    }

    return sizer
}