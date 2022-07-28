export default class LoadScene extends Phaser.Scene {
    constructor() {
        super('load')
    }

    // Phaser 3 - loadingbar
    setPreloadSprite(sprite) {
        this.preloadSprite = { sprite: sprite, width: sprite.width, height: sprite.height };
        this.load.on('progress', this.onProgress, this);

        var barWidth = this.loadingbar.width * this.loadingbar.scaleX;
        this.walk = this.add.sprite(0, game.config.height / 2 + 90, 'walk');
        this.startX = this.loadingbar.x - barWidth / 2;
        this.walk.x = this.startX;

        this.anims.create({
            key: 'walking',
            frames: this.anims.generateFrameNumbers('walk', { start: 0, end: 4 }),
            frameRate: 8,
            repeat: -1
        });
        this.walk.play('walking');
    }
    onProgress(value) {
        if (this.preloadSprite) {
            let w = Math.floor(this.preloadSprite.width * value);
            this.preloadSprite.sprite.frame.width = (w <= 0 ? 1 : w);
            this.preloadSprite.sprite.frame.cutWidth = w;
            this.walk.x = this.startX + (w * 0.95);

            // 更新紋理
            this.preloadSprite.sprite.frame.updateUVs();
        }
    }

    preload() {
        this.add.sprite(game.config.width / 2, game.config.height * 0.4, 'dauchung')
        this.loadingbar = this.add.sprite(game.config.width / 2, game.config.height * 0.65, 'loading')
        this.setPreloadSprite(this.loadingbar)

        this.load.image('press', '../Mark/press.png') // 點擊開始
        this.load.image('cover', '../Mark/cover01.png'); // 黑色底圖
        this.load.spritesheet('stamp', '../Mark/stamp.png', { frameWidth: 150, frameHeight: 150 }); // 通關章
        this.load.spritesheet('waiting', '../Mark/waiting.png', { frameWidth: 200, frameHeight: 200 }); // 倒數三秒進遊戲
        this.load.spritesheet('saving', '../Mark/saving.png', { frameWidth: 300, frameHeight: 300 }); // 分數儲存中

        this.load.image('menu', './assets/menu.png');
        this.load.image('background', './assets/background.png');
        this.load.image('bulb', './assets/bulb.png');
        this.load.image('teach', './assets/teach.png');
        this.load.image('end_bg', './assets/end_bg.png');
        this.load.image('end0', './assets/end0.png');
        this.load.image('end1', './assets/end1.png');
        this.load.image('end2', './assets/end2.png');
        this.load.image('end3', './assets/end3.png');
        this.load.image('end4', './assets/end4.png');

        this.load.spritesheet('logo', './assets/logo.png', { frameWidth: 430, frameHeight: 130 });
        this.load.spritesheet('menu_player', './assets/menu_player.png', { frameWidth: 350, frameHeight: 360 });
        this.load.spritesheet('win', './assets/win.png', { frameWidth: 350, frameHeight: 350 });
        this.load.spritesheet('fail', './assets/fail.png', { frameWidth: 350, frameHeight: 350 });

        // 甜點組
        this.load.spritesheet('desserts', './assets/desserts.png', { frameWidth: 110, frameHeight: 110 });

        this.load.image('costbanner', './assets/ban_cost.png');
        this.load.image('freebanner', './assets/ban_free.png');
        this.load.image('tipsbanner', './assets/ban_tips.png');
        this.load.image('relivebanner', './assets/ban_relive.png');

        this.load.spritesheet('playBtn', './assets/playBtn.png', { frameWidth: 185, frameHeight: 105 });
        this.load.spritesheet('startBtn', './assets/startBtn.png', { frameWidth: 130, frameHeight: 70 });
        this.load.spritesheet('cancleBtn', './assets/cancleBtn.png', { frameWidth: 130, frameHeight: 70 });
        this.load.spritesheet('storeBtn', './assets/storeBtn.png', { frameWidth: 130, frameHeight: 70 });
        this.load.spritesheet('okBtn', './assets/okBtn.png', { frameWidth: 130, frameHeight: 70 });
        this.load.spritesheet('noBtn', './assets/noBtn.png', { frameWidth: 130, frameHeight: 70 });
        this.load.spritesheet('home', './assets/btn_home.png', { frameWidth: 100, frameHeight: 110 });
        this.load.spritesheet('login', './assets/btn_login.png', { frameWidth: 100, frameHeight: 110 });
        this.load.spritesheet('rank', './assets/btn_rank.png', { frameWidth: 100, frameHeight: 110 });
        this.load.spritesheet('bag', './assets/btn_bag.png', { frameWidth: 100, frameHeight: 110 });
        this.load.spritesheet('restart', './assets/btn_restart.png', { frameWidth: 100, frameHeight: 110 });

        this.load.bitmapFont('BMFont', '../Font/BMFont_Black.png', '../Font/BMFont_Black.fnt');
        this.load.bitmapFont('BMFont_desserts', './assets/dessertsText_Black.png', './assets/dessertsText_Black.fnt');

        this.load.audio('bgmSE', './assets/audio/bgm.mp3');
        this.load.audio('waitingSE', './assets/audio/waiting.mp3');
        this.load.audio('clickStartSE', './assets/audio/clickStart.mp3');
        this.load.audio('clickSE', './assets/audio/click.mp3');
        this.load.audio('matchSE', './assets/audio/match.mp3');
        this.load.audio('bonusSE', './assets/audio/bonus.mp3');
        this.load.audio('winSE', './assets/audio/win.mp3');
        this.load.audio('failSE', './assets/audio/fail.mp3');
    }

    create() {
        this.scene.start('menu') // menu . teach . play
    }
}