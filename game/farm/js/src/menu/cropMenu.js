import { getMemberSeed } from '../fakeSQL.js';

export default class cropMenu {
    create(scene, x, y) {
        var seedNum = getMemberSeed()
        console.log('----cropMenu--- ' + seedNum)
        var scrollablePanel = scene.rexUI.add.scrollablePanel({
                x: x,
                y: y,
                width: 560,
                height: 110,

                scrollMode: 1,

                background: scene.add.image(0, 0, 'bg_cropMenu'),

                panel: {
                    child: createPanel(scene, seedNum),
                },

                space: { left: 5, right: 5, }
            })
            .layout()
            // .drawBounds(scene.add.graphics(), 0xff0000);

        scene.input.topOnly = false

        scene.tweens.add({
            targets: scrollablePanel,
            y: '-=110',
            ease: 'Back.easeOut',
            duration: 600,
            onStart: function() { scene.events.emit('showMenu'); }, // 至UIScene接收
        });

        var labels = [];
        labels.push(...scrollablePanel.getElement('panel.items'))
        labels.forEach(function(label) {
            scene.rexUI.add.click(label.getElement('obj_seed'), { threshold: 10 })
                .on('click', function() {
                    var frame = label.getElement('obj_seed').frame.name

                    scene.events.emit('btn_close');
                    scene.events.emit('chooseWork', { work: label.name, key: 'obj_seed', frame: frame }); // 至PlayScene接收
                });
        })

        return scrollablePanel
    }
}

var createPanel = function(scene, numArray) {
    var sizer = scene.rexUI.add.sizer({
        space: { bottom: 10 }
    })

    for (var i = 0; i < numArray.length; i++) {
        // 數量為0不顯示
        if (numArray[i] == 0) continue

        // 調整排版(顯示最大上限=99)
        var showNum
        if (numArray[i] > 99) {
            showNum= 99
        }else{
            showNum=numArray[i]
        }

        sizer.add(
            createIcon(scene, i, showNum),
            0, // proportion
            'center', // align
            { left: 0 }, // padding
            false,
            'cropPanel'
        );
    }

    return sizer;
}

var createIcon = function(scene, frame, num) {
    // 種子圖示
    var obj_seed = scene.add.sprite(0, 0, 'obj_seed', frame).setScale(0.75)

    // 獎勵數量
    var numText = scene.rexUI.add.label({
        width: 23,
        // height: undefined,
        background: scene.rexUI.add.roundRectangle(0, 0, 0, 0, 10, 0xBEBEBE),
        text: scene.add.bitmapText(0, 0, 'farmText_Black', num, 14),
        align: 'center',
        space: { left: 3.5, right: 3.5, top: 4.5, bottom: 4.5 }
    });

    return scene.rexUI.add.sizer({
        width: 90,
        height: 75,
        orientation: 1,
        space: { left: 0, right: 0, top: 0, bottom: 0, item: -25 },
        name: 'seed'
    })

    .add(
        obj_seed, // 遊戲對象
        0, // 比例 (0:與下一物件緊密對齊)
        'center', // 垂直對齊 (center ,left ,right ,top ,bottom)
        { left: 0 }, // 邊界 (left ,right ,top ,bottom))
        false, // 擴展 (寬度/高度)
        'obj_seed' // 添加至map-key，可以讀取sizer.getElement(key)
    )

    .add(
        numText,
        0,
        'center', { left: 85 },
        false,
        'num'
    )
};