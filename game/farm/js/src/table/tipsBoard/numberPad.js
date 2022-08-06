import { btnClick } from '../../Controller.js'
import { getMemberCoin, getMemberO2point } from '../../fakeSQL';

var gridButtons;
export default class numberPad {
    create(scene, dialog, maxNum, unitPrice) {
        var memberCoin = getMemberCoin()
        var memberO2point = getMemberO2point()

        var background = scene.rexUI.add.roundRectangle(0, 0, 0, 0, 20, 0x6D5C54).setStrokeStyle(4, 0x3F3027);

        var btns = {};
        var key;
        var keys = '0123456789✔⬅'; // type = string
        var firstClick = true;

        for (var i = 0, cnt = keys.length; i < cnt; i++) {
            key = keys[i];
            btns[key] = createButton(scene, key);
        }

        gridButtons = scene.rexUI.add.gridButtons({
                x: dialog.getElement('content').getElement('num').x,
                y: dialog.getElement('content').getElement('num').y - 110,
                width: 200,
                height: 160,

                background: background,

                buttons: [
                    [btns['1'], btns['2'], btns['3'], btns['⬅']],
                    [btns['4'], btns['5'], btns['6'], btns['0']],
                    [btns['7'], btns['8'], btns['9'], btns['✔']],
                ],

                space: {
                    left: 10,
                    right: 10,
                    top: 15,
                    bottom: 15,

                    row: 10,
                    column: 10
                }
            })
            .layout()
            .setDepth(1)
            //.drawBounds(this.add.graphics(), 0xff0000)

        scene.rexUI.add.click(gridButtons, { clickInterval: 100 })
            .on('click', function() {
                console.log('pointerup - gridButtons')

                var key
                var numText = 0
                var preNum = dialog.getElement('content').getElement('num').getElement('text').text

                for (var i = 0; i < gridButtons.getElement('buttons').length; i++) {
                    if (scene.rexUI.isInTouching(gridButtons.getButton(i))) {
                        btnClick(scene, gridButtons.getButton(i))

                        key = gridButtons.getButton(i).text
                    }
                }

                if (key == undefined) {
                    return
                }

                if (key === '✔') {
                    scene.newPad = undefined
                    gridButtons.scaleDownDestroy(100)
                } else {
                    if (key === '⬅') {
                        if (preNum.length > 1) {
                            numText = preNum.substring(0, preNum.length - 1)
                        } else {
                            numText = 1
                            firstClick = true
                        }
                    } else {
                        if (firstClick == true && key != '0') {

                            numText = key
                            firstClick = false
                        } else {
                            numText = preNum + key
                        }

                        if (parseInt(numText) >= maxNum) {
                            numText = maxNum
                        }
                    }

                    var costText = unitPrice * numText
                    dialog.getElement('content').getElement('num').getElement('text').setText(numText)
                    dialog.getElement('description').getElement('text').setText(costText)

                    if (dialog.name == 'buying') {
                        if (costText > memberCoin) {
                            dialog.getElement('description').getElement('text').setFont('farmText_White') // 原本黑字無法setTint，要先改成白字
                            dialog.getElement('description').getElement('text').setTint(0xFF0000)
                        } else {
                            dialog.getElement('description').getElement('text').setFont('farmText_Black')
                        }
                    }

                    if (dialog.name == 'changing') {
                        if (numText > memberO2point) {
                            dialog.getElement('content').getElement('num').getElement('text').setFont('farmText_White') // 原本黑字無法setTint，要先改成白字
                            dialog.getElement('content').getElement('num').getElement('text').setTint(0xFF0000)
                        } else {
                            dialog.getElement('content').getElement('num').getElement('text').setFont('farmText_Black')
                        }
                    }
                }
            })

        return gridButtons
    }
}

var createButton = function(scene, text) {
    return scene.rexUI.add.label({
        background: scene.rexUI.add.roundRectangle(0, 0, 0, 0, 10, 0x897A75),
        text: scene.add.text(0, 0, text, {
            fontSize: '20px'
        }),
        align: 'center'
    });
}