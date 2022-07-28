export default class BootScene extends Phaser.Scene {
    constructor() {
        super('boot')
    }
    preload() {
        this.load.image('loading', '../Mark/preloader.gif');
        this.load.image('dauchung', '../Mark/dauchung.png');
        this.load.spritesheet('walk', './assets/walk.png', { frameWidth: 90, frameHeight: 90 }); // 讀取條上的小人
    }
    create() {
        this.scene.start('load');
    }
}