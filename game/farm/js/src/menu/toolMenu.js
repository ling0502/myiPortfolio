import { getMemberTool } from '../fakeSQL.js';

export default class toolMenu {
    create(scene, x, y) {
        var toolNum = getMemberTool()

        // 紀錄土地使用道具用(鏟子,水壺,初階,中階,高階)
        var toolType = ['dig', 'water', 'fertilizer', 'fertilizer', 'fertilizer'];

        var scrollablePanel = scene.rexUI.add.scrollablePanel({
                x: x,
                y: y,
                width: 560,
                height: 110,

                scrollMode: 1,

                background: scene.add.image(0, 0, 'bg_toolMenu'),

                panel: {
                    child: createPanel(scene, toolNum, toolType),
                },

                space: {
                    left: 5,
                    right: 5,
                }
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
            scene.rexUI.add.click(label.getElement('obj_tool'), { threshold: 10 })
                .on('click', function() {
                    var n = label.getElement('num').getElement('text').text
                    var frame = label.getElement('obj_tool').frame.name

                    console.log('pointerup ' + frame + ': ' + n)

                    scene.events.emit('btn_close');
                    scene.events.emit('chooseWork', { work: label.name, key: 'obj_tool', frame: frame }); // 至PlayScene接收
                });
        })

        return scrollablePanel
    }
}

var createPanel = function(scene, toolNum, toolType) {
    var sizer = scene.rexUI.add.sizer({
        space: { bottom: 10 }
    })

    for (var i = 0; i < toolNum.length; i++) {

        // 調整排版(顯示最大上限=99)
        var showNum
        if (toolNum[i] > 99) {
            showNum = 99
        } else {
            showNum = toolNum[i]
        }

        sizer.add(
            createIcon(scene, i, showNum, toolType[i]),
            0, // proportion
            'center', // align
            { left: 0 }, // padding
            false,
            'toolPanel'
        );
    }

    return sizer;
}

var createIcon = function(scene, frame, num, type) {
    // 工具圖示
    var obj_tool = scene.add.sprite(0, 0, 'obj_tool', frame).setScale(0.75)

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
        name: type // 紀錄土地使用道具用
    })

    .add(
        obj_tool, // 遊戲對象
        0, // 比例 (0:與下一物件緊密對齊)
        'center', // 垂直對齊 (center ,left ,right ,top ,bottom)
        { left: 0 }, // 邊界 (left ,right ,top ,bottom))
        false, // 擴展 (寬度/高度)
        'obj_tool' // 添加至map-key，可以讀取sizer.getElement(key)
    )

    .add(
        numText,
        0,
        'center', { left: 85 },
        false,
        'num'
    )
};