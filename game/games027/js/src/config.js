import BootScene from './BootScene'
import LoadScene from './LoadScene'
import MenuScene from './MenuScene'
import TeachScene from './TeachScene'
import PlayScene from './PlayScene'
import OverScene from './OverScene'

import GesturesPlugin from '../../../bundle_phaser3/node_modules/phaser3-rex-plugins/plugins/gestures-plugin.js';

class Game extends Phaser.Game {
    constructor() {
        let config = {
            type: Phaser.AUTO,
            parent: 'game',
            width: 600,
            height: 900,
            scale: {
                // 自動調整寬度和高度，保持寬高比，覆蓋全部區域，可能會超出_ENVELOP (FIT:可能會有未覆蓋)
                mode: Phaser.Scale.FIT,
                // 畫布水平、垂直居中
                autoCenter: Phaser.Scale.CENTER_BOTH
            },
            roundPixels: true,

            plugins: {
                scene: [{
                    key: 'rexGestures',
                    plugin: GesturesPlugin,
                    mapping: 'rexGestures'
                }]
            }
        }

        super(config)

        this.scene.add("boot", BootScene, false)
        this.scene.add("load", LoadScene, false)
        this.scene.add("menu", MenuScene, false)
        this.scene.add("teach", TeachScene, false)
        this.scene.add("play", PlayScene, false)
        this.scene.add("over", OverScene, false)

        this.scene.start('boot')
    }
}

window.game = new Game()