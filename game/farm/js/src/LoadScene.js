// import { getSuccessNum } from './MenuScene.js'

// var isSuccessNum = 0
// var isComplete = 0
export default class LoadScene extends Phaser.Scene {
    constructor() {
        super('load')
    }

    // Phaser 3 - LoaderPlugin
    updateBar(percentage) {
        //刷新讀取內框
        this.newGraphics.clear();
        this.newGraphics.fillStyle(0xcce198, 1);
        this.newGraphics.fillRectShape(new Phaser.Geom.Rectangle(game.config.width / 2 - 150, game.config.height - 120, percentage * 300, 20));

        percentage = percentage * 100;
    }

    // Phaser 3 - LoaderPlugin
    complete() {
        console.log('----- complete -----')
        // isComplete = 1;
    }

    preload() {
        this.anims.create({
            key: 'changing',
            frames: this.anims.generateFrameNumbers('loading_img', { start: 0, end: 1 }),
            duration: 8000,
            repeat: -1,
        });

        this.add.sprite(game.config.width / 2, game.config.height / 2, 'bg_loading')
        this.pic = this.add.sprite(game.config.width / 2 - 48, game.config.height / 2 + 40, 'loading_img', 0).setAngle(-3)
        this.pic.anims.play('changing')


        // 讀取外框
        this.graphics = this.add.graphics();
        var progressBar = new Phaser.Geom.Rectangle(game.config.width / 2 - 150, game.config.height - 120, 300, 20);
        this.graphics.fillStyle(0x362e2b, 1);
        this.graphics.fillRectShape(progressBar);

        //讀取內框
        this.newGraphics = this.add.graphics();
        this.newGraphics.fillStyle(0xcce198, 1);

        this.add.bitmapText(game.config.width / 2, progressBar.y + 45, 'farmText_White', '讀取中...', 28).setOrigin(0.5);
        this.load.on('progress', this.updateBar, { newGraphics: this.newGraphics });
        this.load.on('complete', this.complete, { scene: this.scene });
        this.load.spritesheet('connecting', './assets/connecting.png', { frameWidth: 200, frameHeight: 200 })


        this.load.image('background', './assets/background.jpg') // png檔案太大&壓縮失真明顯
        this.load.image('beginGift', './assets/beginGift.png')

        this.load.image('bg_info', './assets/bg_info.png');
        this.load.image('info_photo', './assets/info_photo.png');
        this.load.image('info_expStar', './assets/info_expStar.png');
        this.load.image('info_expOuter', './assets/info_expOuter.png');
        this.load.image('info_expInner', './assets/info_expInner.png');
        this.load.image('btn_close', './assets/btn_close.png');
        this.load.image('btn_add', './assets/btn_add.png');
        this.load.image('btn_less', './assets/btn_less.png');
        this.load.image('btn_yes', './assets/btn_yes.png');
        this.load.image('btn_no', './assets/btn_no.png');
        this.load.image('btn_QA', './assets/btn_QA.png');
        this.load.spritesheet('btn_receive', './assets/btn_receive.png', { frameWidth: 65, frameHeight: 40 });

        this.load.spritesheet('obj_coin', './assets/obj_coin.png', { frameWidth: 110, frameHeight: 110 });
        this.load.spritesheet('obj_crop', './assets/obj_crop.png', { frameWidth: 120, frameHeight: 100 });

        this.load.image('land_dig', './assets/land_dig.png');
        this.load.image('land_seed', './assets/land_seed.png');
        this.load.image('land_water', './assets/land_water.png');
        this.load.image('land_fertilizer', './assets/land_fertilizer.png');
        this.load.image('land_quickBG', './assets/land_quickBG.png');
        this.load.image('land_quickBtn', './assets/land_quickBtn.png');
        this.load.spritesheet('land_actions', './assets/land_actions.png', { frameWidth: 65, frameHeight: 70 });
        this.load.spritesheet('land_rainbow', './assets/land_rainbow.png', { frameWidth: 110, frameHeight: 70 });

        this.load.image('bg_action', './assets/bg_action.png');
        this.load.image('uibtn_task', './assets/uibtn_task.png');
        this.load.image('uibtn_signIn', './assets/uibtn_signIn.png');
        this.load.image('uibtn_achievement', './assets/uibtn_achievement.png');
        this.load.image('uibtn_book', './assets/uibtn_book.png');
        this.load.image('uibtn_shop', './assets/uibtn_shop.png');
        this.load.image('uibtn_warehouse', './assets/uibtn_warehouse.png');
        this.load.image('uibtn_crop', './assets/uibtn_crop.png');
        this.load.image('uibtn_tool', './assets/uibtn_tool.png');

        this.load.audio('coinSE', './assets/audio/coin.mp3')
        this.load.audio('actionSE', './assets/audio/action.mp3')
        this.load.audio('harvestSE', './assets/audio/harvest.mp3')
        this.load.audio('warningSE', './assets/audio/warning.mp3')
        this.load.audio('btnCloseSE', './assets/audio/btnClose.mp3')
        this.load.audio('giftBoardSE', './assets/audio/giftBoard.mp3')
        this.load.audio('unlockBookSE', './assets/audio/unlockBook.mp3')
        this.load.audio('clickSE', './assets/audio/click.mp3')
        this.load.audio('clickPartnerSE', './assets/audio/clickPartner.mp3')
    }

    create() {
        this.time.addEvent({
            delay: 500, // 每0.5秒偵測一次，減少效能消耗
            callback: function() {
                console.log('LOADING.........')
                this.count();
            },
            callbackScope: this,
            loop: true
        });
    }

    count() {
        // isSuccessNum = getSuccessNum();
        // var total = isSuccessNum + isComplete;

        // if (total == 18) { // 17個取資料函式 + 1素材讀取完成flag
            this.scene.start('play');
        // }
        // console.log('isSuccessNum: ' + isSuccessNum)
    }
}