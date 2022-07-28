export default class BootScene extends Phaser.Scene {
    constructor() {
        super('boot')
    }

    // Phaser 3 - loadingbar
    setPreloadSprite(sprite) {
        this.preloadSprite = { sprite: sprite, width: sprite.width * sprite.scaleX, height: sprite.height }
        this.load.on('progress', this.onProgress, this)
    }

    onProgress(value) {
        if (this.preloadSprite) {
            let w = Math.floor(this.preloadSprite.width * value)
            this.preloadSprite.sprite.frame.width = (w <= 0 ? 1 : w)
            this.preloadSprite.sprite.frame.cutWidth = w

            // 更新紋理
            this.preloadSprite.sprite.frame.updateUVs()
        }
    }

    preload() {
        this.load.image('loading', '../Mark/preloader.gif')
        this.load.image('dauchung', '../Mark/dauchung.png')

        this.load.image('press', '../Mark/press.png') // 點擊開始
        this.load.image('cover', './assets/cover.png'); // 黑色底圖

        this.load.image('bg_menu', './assets/preScreen/bg_menu.jpg')
        this.load.image('bg_loading', './assets/preScreen/bg_loading.jpg')
        this.load.image('company', './assets/preScreen/company.png')
        this.load.spritesheet('logo', './assets/preScreen/logo.png', { frameWidth: 375, frameHeight: 150 });
        this.load.spritesheet('menu_player', './assets/preScreen/menu_player.png', { frameWidth: 350, frameHeight: 400 });
        this.load.spritesheet('loading_img', './assets/preScreen/loading_img.jpg', { frameWidth: 245, frameHeight: 255 });

        this.load.bitmapFont('farmText_White', './assets/farmText_White.png', './assets/farmText_White.fnt')
        this.load.bitmapFont('farmText_Black', './assets/farmText_Black.png', './assets/farmText_Black.fnt')

        this.load.audio('bgmSE', './assets/audio/bgm.mp3')
        this.load.audio('startGameSE', './assets/audio/startGame.mp3')
    }

    create() {
        this.add.sprite(game.config.width / 2, game.config.height * 0.4, 'dauchung')
        this.loadingbar = this.add.sprite(game.config.width / 2, game.config.height * 0.65, 'loading')
        this.setPreloadSprite(this.loadingbar)

        this.scene.start('menu')
    }
}