export default class LoadScene extends Phaser.Scene {
    constructor() {
        super('load')
    }

    // Phaser 3 - loadingbar
    setPreloadSprite(sprite) {
        this.preloadSprite = { sprite: sprite, width: sprite.width, height: sprite.height };
        this.load.on('progress', this.onProgress, this);

        var barWidth = this.loadingbar.width * this.loadingbar.scaleX;
        this.walk = this.add.sprite(0, game.config.height / 2 + 160, 'fish').setScale(1.2);
        this.startX = this.loadingbar.x - barWidth / 2;
        this.walk.x = this.startX;

        this.anims.create({
            key: 'walking',
            frames: this.anims.generateFrameNumbers('fish', { start: 0, end: 2 }),
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
        this.add.sprite(game.config.width / 2, game.config.height * 0.4, 'dauchung');
        this.loadingbar = this.add.sprite(game.config.width / 2, game.config.height * 0.65, 'loading');
        this.setPreloadSprite(this.loadingbar);

        this.load.image('press', '../Mark/press.png') // 點擊開始
        this.load.image('cover', '../Mark/cover01.png'); // 黑色底圖
        this.load.spritesheet('stamp', '../Mark/stamp.png', { frameWidth: 150, frameHeight: 150 }); // 通關章
        this.load.spritesheet('waiting', '../Mark/waiting.png', { frameWidth: 200, frameHeight: 200 }); // 倒數三秒進遊戲
        this.load.spritesheet('saving', '../Mark/saving.png', { frameWidth: 300, frameHeight: 300 }); // 分數儲存中

        this.load.image('logo', './assets/logo.png');
        this.load.image('background', './assets/background.jpg');
        this.load.image('bg_water', './assets/bg_water.png');
        this.load.image('skip', './assets/skip.png');
        this.load.image('story1', './assets/story1.png');
        this.load.image('story2-1', './assets/story2-1.png');
        this.load.image('story2-2', './assets/story2-2.png');
        this.load.image('story3', './assets/story3.png');
        this.load.image('teach', './assets/teach.jpg');
        this.load.image('fireWork1', './assets/fireWork1.png');
        this.load.image('fireWork2', './assets/fireWork2.png');
        this.load.image('warning', './assets/warning.png');

        this.load.image('menu_bg', './assets/menu/menu_bg.png');
        this.load.image('cat1', './assets/menu/cat1.png');
        this.load.image('cat2', './assets/menu/cat2.png');
        this.load.spritesheet('menu_fish', './assets/menu/menu_fish.png', { frameWidth: 650, frameHeight: 600 });
        this.load.spritesheet('fin1', './assets/menu/fin1.png', { frameWidth: 175, frameHeight: 200 });
        this.load.spritesheet('fin2', './assets/menu/fin2.png', { frameWidth: 235, frameHeight: 220 });
        this.load.spritesheet('fin3', './assets/menu/fin3.png', { frameWidth: 315, frameHeight: 210 });
        this.load.spritesheet('fin4', './assets/menu/fin4.png', { frameWidth: 370, frameHeight: 265 });
        this.load.spritesheet('fin5', './assets/menu/fin5.png', { frameWidth: 420, frameHeight: 595 });

        this.load.image('tap', './assets/tap.png');
        this.load.image('star', './assets/star.png');
        this.load.image('heart', './assets/heart.png');
        this.load.image('yellow', './assets/yellow.png');
        this.load.image('bubble', './assets/bubble.png');
        this.load.image('shelter', './assets/shelter.png');
        this.load.spritesheet('fish', './assets/fish.png', { frameWidth: 60, frameHeight: 40 });
        this.load.spritesheet('prop', './assets/prop.png', { frameWidth: 125, frameHeight: 125 });
        this.load.spritesheet('wall', './assets/wall.png', { frameWidth: 50, frameHeight: 210 });
        this.load.spritesheet('border', './assets/border.png', { frameWidth: 600, frameHeight: 30 });

        this.load.image('costBanner', './assets/ban_cost.png');
        this.load.image('freeBanner', './assets/ban_free.png');
        this.load.image('tipsBanner', './assets/ban_tips.png');
        this.load.image('propBanner', './assets/ban_prop.png');
        this.load.image('scoreBanner', './assets/ban_score.png');

        this.load.spritesheet('startBtn', './assets/startBtn.png', { frameWidth: 155, frameHeight: 80 });
        this.load.spritesheet('cancleBtn', './assets/cancleBtn.png', { frameWidth: 155, frameHeight: 80 });
        this.load.spritesheet('storeBtn', './assets/storeBtn.png', { frameWidth: 155, frameHeight: 80 });
        this.load.spritesheet('restartBtn', './assets/restartBtn.png', { frameWidth: 155, frameHeight: 80 });
        this.load.spritesheet('okBtn', './assets/okBtn.png', { frameWidth: 155, frameHeight: 80 });
        this.load.spritesheet('noBtn', './assets/noBtn.png', { frameWidth: 155, frameHeight: 80 });
        this.load.spritesheet('bagBtn', './assets/bagBtn.png', { frameWidth: 155, frameHeight: 80 });
        this.load.image('login', './assets/btn_login.png');
        this.load.image('rank', './assets/btn_rank.png');
        this.load.image('bag', './assets/btn_bag.png');

        this.load.bitmapFont('BMFont', '../Font/BMFont_White.png', '../Font/BMFont_White.fnt');

        this.load.audio('bgmSE', './assets/audio/bgm.mp3');
        this.load.audio('waitingSE', './assets/audio/waiting.mp3');
        this.load.audio('clickStartSE', './assets/audio/clickStart.mp3');
        this.load.audio('clickSE', './assets/audio/click.mp3');
        this.load.audio('jumpSE', './assets/audio/jump.mp3');
        this.load.audio('safeSE', './assets/audio/safe.mp3');
        this.load.audio('dangerSE', './assets/audio/danger.mp3');
        this.load.audio('winSE', './assets/audio/win.mp3');
        this.load.audio('failSE', './assets/audio/fail.mp3');
    }

    create() {
        this.scene.start('menu');
    }
}