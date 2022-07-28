export default class BootScene extends Phaser.Scene {
    constructor() {
        super('boot')
    }
    preload() {
        this.load.image('loading', '../Mark/preloader.gif');
        this.load.image('dauchung', '../Mark/dauchung.png');
        this.load.spritesheet('fish', './assets/fish.png', { frameWidth: 60, frameHeight: 40 }); // 讀取條上的小人
    }
    create() {
        this.scene.start('load');
    }
}