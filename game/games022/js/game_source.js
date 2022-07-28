// 碰撞類組
const category1 = 2; // player + stick + line
const category2 = 4; // wall + net 
const category3 = 8; // hook + shrimp + trash
const category4 = 16; // default

class addType extends Phaser.Physics.Matter.Sprite {
    constructor(scene, x, y, key) {

        var arrow = '57 32 41 28 34 29 26 35 18 43 13 51 13 60 17 66 22 71 28 71 34 74 40 72 42 65 41 58 34 63 27 61 30 53 39 49 43 50 46 55 54 53 65 49 54 40 59 37';

        super(scene.matter.world, x, y, key, null, {
            collisionFilter: {
                category: category3,
                mask: category2
            },
            label: 'shrimp',
            shape: { type: 'circle', radius: 30 },
            ignoreGravity: true,
        });

        scene.add.existing(this);
    }
}

class ShrimpPool extends Phaser.GameObjects.Group {
    constructor(scene, config = {}) {
        const defaults = {
            classType: addType,
            maxSize: -1,
            runChildUpdate: true,
        }
        super(scene, Object.assign(defaults, config));
    }

    spawn(x, y, key, dir) {
        const spawnExisting = this.countActive(false) > 0;

        const shrimpObj = super.get(x, y, key);

        shrimpObj.setCollisionCategory(category3);
        shrimpObj.setCollidesWith(category2);
        shrimpObj.setIgnoreGravity(true);
        shrimpObj.setAngularVelocity(0); // 避免任意旋轉
        shrimpObj.setFixedRotation();
        shrimpObj.setDensity(0.00001);
        shrimpObj.setMass(0.0001);

        shrimpObj.setPosition(x, y);
        shrimpObj.setOrigin(0.5, 0.6);
        shrimpObj.keyClass = key;
        shrimpObj.ishooked = false;
        shrimpObj.shrimpTimer = -1;
        shrimpObj.shrimpTimerText = shrimpObj.scene.add.text(0, 0, '', { font: '20px', fill: '#000' });

        if (key == 'deadShrimp') {
            shrimpObj.floating = false;
            shrimpObj.updateTimer = 0;
            shrimpObj.shrimpTimer = shrimpTimer;
            shrimpObj.shrimpTimerText.alpha = 1;
        }

        if (!shrimpObj) {
            return;
        }

        switch (key) {
            case 'normalShrimp':
                shrimpObj.play('normalSwim');
                break;
            case 'bloodShrimp':
                shrimpObj.play('bloodSwim');
                break;
            case 'deadShrimp':
                shrimpObj.play('deadSwim');
                break;
            case 'inkShrimp':
                shrimpObj.play('inkSwim');
                break;
            default:
                break;
        }

        shrimpObj.moveYTween = shrimpObj.scene.add.tween({
            targets: shrimpObj,
            y: '+=30',
            duration: 800,
            yoyo: true,
            repeat: -1,
        });

        var speed = Phaser.Math.Between(2000, 5000);
        var rnd = Phaser.Math.Between(0, 1); // 0 : 不轉向，1 : 轉向
        var rndX = Phaser.Math.Between(300, 650); // 轉向X座標的條件
        var dirX; // 動畫移動X軸目標
        var RdirX; // 反向

        if (dir == 0) { // 由左游到右
            dirX = wallXR;
            RdirX = wallXL;
        } else { // 由右游到左
            dirX = wallXL;
            RdirX = wallXR;
        }

        if (rnd == 0 || shrimpObj.keyClass == 'deadShrimp') {
            shrimpObj.moveXTween = shrimpObj.scene.add.tween({
                targets: shrimpObj,
                x: dirX,
                duration: speed,
            });
        } else {
            shrimpObj.moveXTween = shrimpObj.scene.add.tween({
                targets: shrimpObj,
                x: rndX,
                duration: speed,
                ease: 'Quad.easeIn',
                yoyo: true,
                onYoyo: function() {
                    shrimpObj.scaleX *= -1;
                    shrimpObj.moveXTween.data[0].start = RdirX;
                },
                onYoyoScope: this,
            });
        }

        if (spawnExisting) {
            shrimpObj.world.add(shrimpObj.body);

            shrimpObj.setActive(true);
            shrimpObj.setVisible(true);
            shrimpObj.setTexture(key);
            shrimpObj.setPosition(x, y);
            shrimpObj.setOrigin(0.5, 0.6);
        }

        return shrimpObj;
    }

    despawn(obj) {
        if (typeof obj.shrimpTimerText != 'undefined' && obj.shrimpTimerText.alpha == 1) {
            obj.shrimpTimerText.alpha = 0;
            obj.shrimpTimerText.destroy();
        }
        obj.ishooked = false;
        this.scene.tweens.killTweensOf(obj)
        this.scene.tweens.remove(obj.moveXTween); // 避免亂飄可能沒用
        this.scene.tweens.remove(obj.moveYTween) // 避免亂飄可能沒用

        this.killAndHide(obj);
        obj.world.remove(obj.body);
    }
}

class TrashType extends Phaser.Physics.Matter.Sprite {
    constructor(scene, x, y, key, frame) {
        super(scene.matter.world, x, y, key, frame, {
            collisionFilter: {
                category: category3,
                mask: category2
            },
            label: 'trash',
            ignoreGravity: true,
        });
        scene.add.existing(this);
    }
}
class TrashPool extends Phaser.GameObjects.Group {
    constructor(scene, config = {}) {
        const defaults = {
            classType: TrashType,
            maxSize: -1,
            runChildUpdate: true,
        }
        super(scene, Object.assign(defaults, config));
    }

    spawn(x, y, key, dir) {
        const spawnExisting = this.countActive(false) > 0;

        var rndFrame = Phaser.Math.Between(0, 1); // 隨機垃圾素材

        const trashObj = super.get(x, y, key, rndFrame);

        trashObj.setCollisionCategory(category3);
        trashObj.setCollidesWith(category2);
        trashObj.setIgnoreGravity(true);
        trashObj.setAngularVelocity(0); // 避免任意旋轉
        trashObj.setFixedRotation();
        trashObj.setDensity(0.00001);
        trashObj.setMass(0.0001);

        trashObj.setPosition(x, y);
        trashObj.keyClass = key;
        trashObj.ishooked = false;

        if (!trashObj) {
            return;
        }

        trashObj.moveYTween = trashObj.scene.add.tween({
            targets: trashObj,
            y: '+=5',
            duration: 200,
            yoyo: true,
            repeat: -1
        });

        var speed = Phaser.Math.Between(4500, 7000);

        if (dir == 0) { // 由左游到右
            trashObj.moveXTween = trashObj.scene.add.tween({
                targets: trashObj,
                x: wallXR,
                duration: speed,
            });
        } else { // 由右游到左
            trashObj.moveXTween = trashObj.scene.add.tween({
                targets: trashObj,
                x: wallXL,
                duration: speed,
            });
        }

        if (spawnExisting) {
            trashObj.world.add(trashObj.body);

            trashObj.setActive(true);
            trashObj.setVisible(true);
            trashObj.setTexture(key);
            trashObj.setPosition(x, y);
        }

        return trashObj;
    }

    despawn(obj) {
        obj.ishooked = false;

        this.scene.tweens.killTweensOf(obj)
        this.killAndHide(obj);
        obj.world.remove(obj.body);
    }
}
Phaser.GameObjects.GameObjectFactory.register('ShrimpPool', function() {
    return this.updateList.add(new ShrimpPool(this.scene));
})
Phaser.GameObjects.GameObjectFactory.register('TrashPool', function() {
    return this.updateList.add(new TrashPool(this.scene));
})

// import {
//     IsLogin,
//     GameType,
//     GameCostPoint,
//     MemberFreeTimes,
//     MemberPoint,

//     startData,
//     sendScore,
//     PlayerID,
//     PlayerSN,
//     GameParameters,
//     SetSuccessStartData,
//     SetSuccessScoreData,

//     StatusFlag,
//     StatusText,
//     showBoardDialog,
//     showMessageModal,
//     showBoardMessageModal,
//     shareViaLine,
//     shareViaFacebook,

//     MemberWinFlag,
//     SetPreShowDialog,
//     SetCompleteCloseDialog,
// } from '../../js/connect_source.js';

/***  phaser 3 ****/
var game;
var score;
var gameIsOver;
// 歷程
var PlayHistories = '';
var deduction = 0; // 扣分
var historyNumArray = [];
var historyScoreArray = [];

var life = 30; // 生命(遊戲時間)
var totalShrimp = 15; // 池中最大數量(蝦子)
var totalTrash = 5; // 池中最大數量(垃圾)
// 基本分數
var baseScore_normal = 100; // 基本分數(一般蝦)
var baseScore_blood = 200; // 基本分數(補血蝦)
var baseScore_dead = 300; // 基本分數(老蝦)
var baseScore_ink = 400; // 基本分數(墨汁蝦)
// 生成頻率
var frequency_normal = 700; // 生成頻率(一般蝦)1100
var frequency_blood = 2780; // 生成頻率(補血蝦)3000
var frequency_dead = 1930; // 生成頻率(老蝦)2430
var frequency_ink = 1310; // 生成頻率(墨汁蝦)1750
var frequency_trash = 1220; // 生成頻率(垃圾)1220

var player;
var stick;
var fishLine = [];
var hook;
var pre; // 釣線前一個連接點
var graphics; // 畫釣線
var graphicsArray = [];
var shrimpMultiple; // 得分倍數(蝦子)
var trashMultiple; // 扣分倍數(垃圾)

var isTap = true;
var canHook = false;
var shrimpTimer = 3; // 老蝦倒數n秒自殺

var playerY = 120;
var wallXL = -120; // 左邊牆壁X座標(蝦子/垃圾動畫目標位置)
var wallXR = 1080; // 右邊牆壁X座標(蝦子/垃圾動畫目標位置)
var leftStartMin = -40; // 左邊蝦子生成X座標MIN
var leftStartMax = 0; // 左邊蝦子生成X座標MAX
var rightStartMin = 960; // 右邊蝦子生成X座標MIN
var rightStartMax = 1000; // 右邊蝦子生成X座標MAX

// 音效
var soundBgm;
var soundStory;

// 按鈕
var menu_bg
var playBtn;
var FBshare;
var LINEshare;
var homeBtn;
var rankBtn;
var bagBtn;
var storeBtn;
var loginBtn;
var restartBtn;
var okBtn;


/****************** 遊 戲 說 明 【釣蝦】 **************************/

// 計分 : 基本分數(種類) x 得分倍數 (1 > 1.2 > 1.4 > …)
// 一般蝦 : baseScore_normal / -
// 補血蝦 : baseScore_blood / 加1/4血量 
//  老蝦  : baseScore_dead / 扣1/3血量
// 墨汁蝦 : baseScore_ink / -
//  垃圾  : 扣當前分數10% / 扣1/6血量


// 驗證機制
// PlayHistories 字串 => 保留4位數紀錄扣分 + 一次取2位數為數量 + 一次取4位數為分數
// 扣分 + (2位數 x 4位數) + (2位數 x 4位數) + ... = 總分

/*******************************************************************/

class boot extends Phaser.Scene {
    constructor() {
        super('boot');
    }
    preload() {
        this.load.image('loading', '../Mark/preloader.gif');
        this.load.image('dauchung', '../Mark/dauchung.png');
        this.load.spritesheet('walk', './assets/menu/walk.png', { frameWidth: 90, frameHeight: 90 }); // 讀取條上的小人
    }
    create() {
        this.scene.start('load');
    }
}
class load extends Phaser.Scene {
    constructor() {
        super('load');
    }

    // Phaser 3 - loadingbar
    setPreloadSprite(sprite) {
        this.preloadSprite = { sprite: sprite, width: sprite.width * sprite.scaleX, height: sprite.height };
        this.load.on('progress', this.onProgress, this);

        var barWidth = this.loadingbar.width * this.loadingbar.scaleX;
        this.walk = this.add.sprite(0, game.config.height - 180, 'walk');
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
            var w = Math.floor(this.preloadSprite.width * value);
            this.preloadSprite.sprite.frame.width = (w <= 0 ? 1 : w);
            this.preloadSprite.sprite.frame.cutWidth = w;
            this.walk.x = this.startX + (w * 0.95);

            // 更新紋理
            this.preloadSprite.sprite.frame.updateUVs();
        }
    }

    preload() {
        this.loadingbar = this.add.sprite(game.config.width / 2, game.config.height - 130, 'loading');
        this.loadingbar.setScale(1.5, 1);
        this.setPreloadSprite(this.loadingbar);
        this.add.sprite(game.config.width / 2, game.config.height / 2 - 65, 'dauchung').setScale(1.2);

        this.load.image('lifecontainer', './assets/lifecontainer.png');
        this.load.image('lifeInner', './assets/lifeInner.png');

        this.load.image('cover', '../Mark/cover02.png'); // 黑色底圖
        this.load.image('press', '../Mark/press.png'); // 點擊開始
        this.load.spritesheet('waiting', '../Mark/waiting.png', { frameWidth: 200, frameHeight: 200 }); // 倒數三秒進遊戲
        this.load.spritesheet('stamp', '../Mark/stamp.png', { frameWidth: 150, frameHeight: 150 }); // 通關章
        this.load.spritesheet('saving', '../Mark/saving.png', { frameWidth: 300, frameHeight: 300 }); // 分數儲存中

        this.load.image('logo', './assets/logo.png');
        this.load.image('menu_bg', './assets/menu/menu_bg.png');
        this.load.spritesheet('menu_player', './assets/menu/player.png', { frameWidth: 225, frameHeight: 185 });
        this.load.spritesheet('menu_bubble', './assets/menu/bubble.png', { frameWidth: 960, frameHeight: 540 });
        this.load.spritesheet('menu_shrimp', './assets/menu/shrimp.png', { frameWidth: 440, frameHeight: 540 });
        this.load.image('menu_shrimp2', './assets/menu/shrimp2.png');
        this.load.image('menu_shrimp3', './assets/menu/shrimp3.png');
        this.load.image('background', './assets/background.png');
        this.load.image('flashBlood', './assets/flashBlood.png');
        this.load.image('story', './assets/story/story.png');
        this.load.image('story2', './assets/story/story2.png');
        this.load.image('teach', './assets/story/teach.png');
        this.load.image('p01', './assets/story/p01.png');
        this.load.image('p02', './assets/story/p02.png');
        this.load.image('p03', './assets/story/p03.png');
        this.load.image('p04', './assets/story/p04.png');
        this.load.image('end_win', './assets/end_win.png');
        this.load.image('end_fail', './assets/end_fail.png');

        this.load.image('bannerBack', './assets/UI/ban_back.png');
        this.load.image('costbanner', './assets/UI/ban_cost.png');
        this.load.image('freebanner', './assets/UI/ban_free.png');
        this.load.image('tipsbanner', './assets/UI/ban_tips.png');
        this.load.image('scorebanner', './assets/UI/ban_score.png');
        this.load.image('banner', './assets/UI/banner.png');

        this.load.image('player', './assets/player.png');
        this.load.image('Cball', './assets/Cball.png');
        this.load.image('stick', './assets/stick.png');
        this.load.image('hook', './assets/hook.png');
        this.load.image('net', './assets/net.png');
        this.load.image('ink', './assets/ink.png');

        this.load.spritesheet('normalShrimp', './assets/normalShrimp.png', { frameWidth: 80, frameHeight: 80 });
        this.load.spritesheet('bloodShrimp', './assets/bloodShrimp.png', { frameWidth: 80, frameHeight: 80 });
        this.load.spritesheet('deadShrimp', './assets/deadShrimp.png', { frameWidth: 80, frameHeight: 80 });
        this.load.spritesheet('inkShrimp', './assets/inkShrimp.png', { frameWidth: 80, frameHeight: 80 });
        this.load.spritesheet('trash', './assets/trash.png', { frameWidth: 40, frameHeight: 50 });

        this.load.spritesheet('boss', './assets/boss.png', { frameWidth: 150, frameHeight: 150 });
        this.load.spritesheet('grass', './assets/grass.png', { frameWidth: 80, frameHeight: 90 });
        this.load.spritesheet('putIn', './assets/putIn.png', { frameWidth: 140, frameHeight: 100 });
        this.load.spritesheet('attack', './assets/attack.png', { frameWidth: 120, frameHeight: 120 });
        this.load.spritesheet('bubble', './assets/bubble.png', { frameWidth: 960, frameHeight: 330 });
        this.load.spritesheet('finish', './assets/finish.png', { frameWidth: 330, frameHeight: 330 });
        this.load.spritesheet('win', './assets/win.png', { frameWidth: 350, frameHeight: 200 });
        this.load.spritesheet('fail', './assets/fail.png', { frameWidth: 350, frameHeight: 125 });

        this.load.spritesheet('playBtn', './assets/UI/playBtn.png', { frameWidth: 135, frameHeight: 55 });
        this.load.spritesheet('restartBtn', './assets/UI/restartBtn.png', { frameWidth: 135, frameHeight: 55 });
        this.load.spritesheet('storeBtn', './assets/UI/storeBtn.png', { frameWidth: 135, frameHeight: 55 });
        this.load.spritesheet('okBtn', './assets/UI/okBtn.png', { frameWidth: 135, frameHeight: 55 });
        this.load.spritesheet('LINEshare', './assets/UI/btn_LINEshare.png', { frameWidth: 60, frameHeight: 45 });
        this.load.spritesheet('FBshare', './assets/UI/btn_FBshare.png', { frameWidth: 60, frameHeight: 45 });
        this.load.spritesheet('skip', './assets/UI/btn_skip.png', { frameWidth: 90, frameHeight: 50 });
        this.load.spritesheet('home', './assets/UI/btn_home.png', { frameWidth: 125, frameHeight: 80 });
        this.load.spritesheet('login', './assets/UI/btn_login.png', { frameWidth: 125, frameHeight: 80 });
        this.load.spritesheet('rank', './assets/UI/btn_rank.png', { frameWidth: 125, frameHeight: 80 });
        this.load.spritesheet('bag', './assets/UI/btn_bag.png', { frameWidth: 125, frameHeight: 80 });

        this.load.bitmapFont('BMFont', '../Font/BMFont_White.png', '../Font/BMFont_White.fnt');
        this.load.bitmapFont('dialog', './assets/story/dialog.png', './assets/story/dialog.fnt'); //故事劇情文字檔

        this.load.audio('bgmSE', './assets/audio/bgm.mp3');
        this.load.audio('storySE', './assets/audio/story.mp3');
        this.load.audio('clickSE', './assets/audio/click.mp3');
        this.load.audio('waitingSE', './assets/audio/waiting.mp3');
        this.load.audio('floatSE', './assets/audio/float.mp3');
        this.load.audio('putSE', './assets/audio/put.mp3');
        this.load.audio('hitSE', './assets/audio/hit.mp3');
        this.load.audio('hurtSE', './assets/audio/hurt.mp3');
        this.load.audio('overSE', './assets/audio/over.mp3');
        this.load.audio('winSE', './assets/audio/win.mp3');
        this.load.audio('failSE', './assets/audio/fail.mp3');
    }

    create() {
        // 綁定connect.js功能
        // SetPreShowDialog(PreShowDialog);
        // SetCompleteCloseDialog(completeCloseDialog);
        // SetSuccessStartData(successStartData);
        // SetSuccessScoreData(successScoreData);

        this.scene.start('menu');
    }
}

class play extends Phaser.Scene {
    constructor() {
        super({
            key: 'play',
            physics: {
                matter: {
                    // debug: true,
                    gravity: { y: 2 }
                }
            }
        })
    }

    init() {
        gameIsOver = false;
        score = 0;
        // 歷程重置
        PlayHistories = '';
        deduction = 0;
        historyNumArray = [];
        historyScoreArray = [];

        this.updateTimer = 0;
        this.currentLife = life;
    }

    create() {
        this.tweens.add({
            targets: soundStory,
            volume: 0,
            duration: 1000
        });
        soundBgm = this.sound.add('bgmSE', { loop: -1 });

        this.background = this.add.sprite(0, 0, 'background').setOrigin(0);
        this.background.setInteractive();

        this.cover = this.add.sprite(0, 0, 'cover').setOrigin(0).setDepth(1);

        this.anims.create({
            key: 'waiting',
            frames: this.anims.generateFrameNumbers('waiting', { start: 0, end: 59 }),
            frameRate: 20,
            hideOnComplete: true
        });
        PlayAudio(this, 'waitingSE', 1);
        this.add.sprite(game.config.width / 2, game.config.height / 2, 'waiting').setDepth(1).play('waiting');

        // 延遲三秒進遊戲
        this.timerEvents = this.time.addEvent({
            delay: 3000,
            callback: function() {
                this.gameStart();
            },
            callbackScope: this,
        });

        // this.add.text(12, 10, 'ID: ' + PlayerID, { font: '16px ', fill: '#000' });
        // this.add.text(10, 25, 'SN: ' + PlayerSN, { font: '16px ', fill: '#000' });

        this.add.bitmapText(game.config.width - 230, 15, 'BMFont', '分數：', 16);
        this.scoreText = this.add.bitmapText(game.config.width - 140, 15, 'BMFont', score, 16);

        this.createUIAnims();
        this.createShrimpAnims();
        this.createUI();
        this.createLifebar();
    }

    createUIAnims() {
        this.anims.create({
            key: 'bubbling',
            frames: this.anims.generateFrameNumbers('bubble', { start: 0, end: 5 }),
            frameRate: 3,
            repeat: -1
        });
        this.anims.create({
            key: 'swing',
            frames: this.anims.generateFrameNumbers('grass', { start: 0, end: 4 }),
            frameRate: 6,
            repeat: -1
        });
        this.anims.create({
            key: 'swing2',
            frames: this.anims.generateFrameNumbers('grass', { start: 5, end: 9 }),
            frameRate: 5,
            repeat: -1
        });
        this.anims.create({
            key: 'bossShine',
            frames: this.anims.generateFrameNumbers('boss', { start: 1, end: 4 }),
            frameRate: 12,
            repeat: -1
        });
        this.anims.create({
            key: 'putting',
            frames: this.anims.generateFrameNumbers('putIn', { start: 0, end: 4 }),
            frameRate: 16,
            hideOnComplete: true
        });
        this.anims.create({
            key: 'attacking',
            frames: this.anims.generateFrameNumbers('attack', { start: 0, end: 3 }),
            frameRate: 12,
            hideOnComplete: true
        });
        this.anims.create({
            key: 'finishing',
            frames: this.anims.generateFrameNumbers('finish', { start: 0, end: 4 }),
            frameRate: 8,
            repeat: -1
        });

        this.add.sprite(0, 250, 'bubble').setOrigin(0).play('bubbling');
        this.add.sprite(160, 495, 'grass', 0).play('swing');
        this.add.sprite(830, 500, 'grass', 5).play('swing2');
    }

    createShrimpAnims() {
        this.anims.create({
            key: 'normalSwim',
            frames: this.anims.generateFrameNumbers('normalShrimp', { start: 0, end: 4 }),
            frameRate: 4,
            repeat: -1
        });
        this.anims.create({
            key: 'bloodSwim',
            frames: this.anims.generateFrameNumbers('bloodShrimp', { start: 0, end: 4 }),
            frameRate: 4,
            repeat: -1
        });
        this.anims.create({
            key: 'deadSwim',
            frames: this.anims.generateFrameNumbers('deadShrimp', { start: 0, end: 4 }),
            frameRate: 6,
            repeat: -1
        });
        this.anims.create({
            key: 'inkSwim',
            frames: this.anims.generateFrameNumbers('inkShrimp', { start: 0, end: 4 }),
            frameRate: 4,
            repeat: -1
        });
    }

    createUI() {
        //畫面閃紅
        this.flashing = false;
        this.flashBlood = this.add.sprite(0, 0, 'flashBlood').setOrigin(0);
        this.flashBlood.alpha = 0;

        this.bossTime = Phaser.Math.Between(life / 3, life / 2); // 觸發隱藏條件時間 (時間剩餘 1/3 ~ 1/2 )

        //  ------------ Matter object --------------
        // 角色
        player = this.matter.add.image(game.config.width / 2, playerY, 'player', null, {
            collisionFilter: {
                category: category1,
                mask: category3
            },
            label: 'player',
            density: 200,
            isStatic: true, // 避免被蝦子撞飛
            ignoreGravity: true,
        });
        player.setFixedRotation();

        // 邊界牆壁
        this.matter.add.rectangle(wallXL, 375, 80, 330, {
            collisionFilter: {
                category: category2,
                mask: category3
            },
            label: 'wall',
            isStatic: true,
            ignoreGravity: true,
        });
        this.matter.add.rectangle(wallXR, 375, 80, 330, {
            collisionFilter: {
                category: category2,
                mask: category3
            },
            label: 'wall',
            isStatic: true,
            ignoreGravity: true,
        });

        // 裝蝦籃子
        this.net = this.matter.add.image(70, 185, 'net', null, {
            collisionFilter: {
                category: category2,
                mask: category3
            },
            label: 'net',
            isStatic: true,
            ignoreGravity: true,
            shape: { type: 'rectangle', width: 140, height: 20 },
            render: { sprite: { xOffset: 0, yOffset: -0.3 } },
        });

        // 釣竿
        stick = this.matter.add.image(player.x + 140, player.y, 'stick', null, {
            collisionFilter: {
                category: category1,
                mask: category4
            },
            label: 'stick',
            ignoreGravity: true,
        });
        stick.setAngle(-15);
        stick.setFixedRotation();

        // 綁定人物 & 釣竿
        this.PS_Constraint = this.matter.add.constraint(player, stick, 0, 1, {
            pointA: { x: 0, y: 20 },
            pointB: { x: -40, y: 10 },
        });

        // 釣線
        var linkLength = 24;
        var linkDistance = 15;
        for (var i = 0; i < linkLength; i++) {
            var linkAnchor = this.matter.add.image(player.x + 40, player.y + i * linkDistance, 'Cball', null, {
                collisionFilter: {
                    category: category1,
                    mask: category4
                },
                label: 'linkAnchor',
            });
            linkAnchor.alpha = 0;
            fishLine.push(linkAnchor);

            if (i > 0) {
                this.matter.add.constraint(pre, fishLine[i], linkDistance, 1, {
                    label: 'line',
                });
            }
            pre = fishLine[i];
        }

        // 綁定釣竿 & 釣線
        this.SF_Constraint = this.matter.add.constraint(stick, fishLine[0], 0, 1, {
            pointA: { x: 35, y: -10 },
        });

        // 釣鉤
        hook = this.matter.add.image(linkAnchor.x + linkAnchor.width / 2, linkAnchor.y + linkAnchor.height / 2, 'hook', null, {
            collisionFilter: {
                category: category3,
                mask: category2
            },
            label: 'hook',
            frictionAir: 0.07, //越小越快，越大越慢(身體在空間中移動時速度)
        });
        hook.setFixedRotation();

        // 綁定釣線 & 釣鉤
        this.matter.add.constraint(fishLine[fishLine.length - 1], hook, 0, 1, {
            pointB: { x: 0, y: -20 },
        });

        // 畫釣魚線
        graphics = this.add.graphics();
        graphicsArray.push(graphics);
    }

    createLifebar() {
        this.lifeContainer = this.add.sprite(game.config.width / 2 - 185, 20, 'lifecontainer').setOrigin(0);
        this.lifeInner = this.add.sprite(this.lifeContainer.x + 40, this.lifeContainer.y + 10, 'lifeInner').setOrigin(0);

        this.lifeMask = this.add.sprite(this.lifeInner.x, this.lifeInner.y, 'lifeInner').setOrigin(0);
        this.lifeMask.visible = false;
        this.lifeInner.mask = new Phaser.Display.Masks.BitmapMask(this, this.lifeMask);
    }

    gameStart() {
        soundBgm.play();
        this.cover.destroy();

        // 血量更新
        this.timerEvents = this.time.addEvent({
            delay: 100,
            callback: function() {
                this.updateCounter();
            },
            callbackScope: this,
            loop: true
        });

        // 籃子移動
        var netTween = this.tweens.add({
            targets: this.net,
            x: 890,
            duration: 3500,
            yoyo: true,
            loop: -1,
            onUpdate: function() {
                if (gameIsOver) {
                    netTween.pause();
                }
            },
            onUpdateScope: this,
        }, this);

        this.creatEvent(); // 新增蝦子/垃圾
        this.checkCollision(); // Matter偵測碰撞
        this.moveControl(); // 玩家移動控制
    }

    creatEvent() {
        // 使用物件池(蝦子 & 垃圾)
        this.shrimpGroup = this.add.ShrimpPool();
        this.trashGroup = this.add.TrashPool();
        this.time.addEvent({
            delay: frequency_normal,
            loop: true,
            callback: () => {
                this.addShrimp('normalShrimp');
            }
        });
        this.time.addEvent({
            delay: frequency_blood,
            loop: true,
            callback: () => {
                this.addShrimp('bloodShrimp');
            }
        });
        this.time.addEvent({
            delay: frequency_dead,
            loop: true,
            callback: () => {
                this.addShrimp('deadShrimp');
            }
        });
        this.time.addEvent({
            delay: frequency_ink,
            loop: true,
            callback: () => {
                this.addShrimp('inkShrimp');
            }
        });
        this.time.addEvent({
            delay: frequency_trash,
            loop: true,
            callback: () => {
                this.addTrash('trash');
            }
        });
    }

    moveControl() {
        this.background.on('pointermove', function(pointer) {
            isTap = false;

            var moveToX;
            if (typeof this.preX == 'undefined') {
                this.preX = pointer.x;
            } else {
                if (Math.abs(this.preX - pointer.x) >= 25) { // 行動裝置觸控太靈敏會一直轉向
                    if (this.preX > pointer.x) {
                        moveToX = player.x - pointer.getDistanceX();
                        player.setFlipX(true);
                        stick.setFlipX(true);
                        hook.setFlipX(true);
                        stick.setAngle(-165);
                    } else if (this.preX <= pointer.x) {
                        moveToX = player.x + pointer.getDistanceX();
                        player.setFlipX(false);
                        stick.setFlipX(false);
                        hook.setFlipX(false);
                        stick.setAngle(-15);
                    }
                    this.preX = pointer.x;
                }
            }

            //限制人物不會超出邊界
            if (moveToX <= player.width) {
                moveToX = player.width;
            } else if (moveToX >= game.config.width - player.width) {
                moveToX = game.config.width - player.width;
            }

            if (!moveToX) {
                return
            }

            var moveDistance = Math.abs(moveToX - player.x); // 讓tween的速度一樣
            var pointerTween = this.tweens.add({
                targets: player,
                x: moveToX,
                duration: 2 * moveDistance,
                onUpdate: function() {
                    if (!pointer.isDown) {
                        pointerTween.pause();
                    }
                },
                onComplete: function() {
                    pointerTween.pause();
                },
                onUpdateScope: this,
                onCompleteScope: this,
            }, this);
        }, this);

        this.background.on('pointerup', function(pointer) {
            if (isTap && pointer.getDuration() < 110) {
                hook.setCollisionCategory(category2); // 調整類別與蝦子碰撞
                hook.setCollidesWith(category3);

                hook.setVelocityY(-100);
                isTap = false;
                canHook = true;
            }
        }, this);
    }

    updateCounter() {
        this.currentLife -= 0.1;
        this.stepWidth = this.lifeInner.width / life / 10;
        this.lifeMask.x -= this.stepWidth;

        // 倒數三秒閃紅
        if (!this.flashing && this.currentLife < 3) {
            this.flashing = true;
            this.flash = this.add.tween({
                targets: this.flashBlood,
                alpha: 1,
                ease: 'Linear',
                duration: 500,
                yoyo: true,
                repeat: -1
            });
        }
        // 閃紅時若補血超過則關閉
        if (this.flashing && this.currentLife >= 3) {
            this.flashing = false;
            this.flash.stop();
            this.flashBlood.alpha = 0;
        }

        // 隱藏功能
        this.callBoss();

        // 死亡
        if (this.currentLife < 0.1) {
            gameIsOver = true;
            hook.setStatic(true); // 鎖定鉤子(避免已釣的蝦子裝進籃子後再加分)
            this.background.disableInteractive();

            this.shrimpGroup.getChildren().forEach(function(child) {
                child.anims.pause();
                this.tweens.killTweensOf(child);
            }, this);
            this.trashGroup.getChildren().forEach(function(child) {
                this.tweens.killTweensOf(child);
            }, this);

            this.flash.stop();
            this.flashBlood.alpha = 0;
            this.timerEvents.remove();
            this.gameOver();
        }
    }

    callBoss() {
        if (typeof this.bossCalled == 'undefined' && this.currentLife < this.bossTime) {
            this.bossCalled = true;

            this.boss = this.add.sprite(0, 95, 'boss');
            var rndBoss = Phaser.Math.Between(0, 1); // 0:左邊，1:右邊
            var goalbossX;

            if (rndBoss == 0) {
                this.boss.x = -75;
                this.boss.flipX = true;
                goalbossX = this.boss.x + this.boss.width;
            } else {
                this.boss.x = 1035;
                goalbossX = this.boss.x - this.boss.width;
            }

            this.tweens.add({
                targets: this.boss,
                x: goalbossX,
                duration: 1000,
                ease: 'Cubic.easeIn',
                hold: 2000, // yoyoDelay
                yoyo: true,
            }, this);

            this.boss.setInteractive().on('pointerdown', function() {
                this.boss.disableInteractive();
                this.boss.play('bossShine');
                this.calucateLife('boss');
            }, this);
        }
    }

    addShrimp(addType) {
        if (!this.shrimpGroup) {
            return
        }
        // 限制最大數量
        if (this.shrimpGroup.countActive(true) >= totalShrimp || gameIsOver) {
            return
        }

        var shrimp;
        var shrimpX_left = Phaser.Math.Between(leftStartMin, leftStartMax);
        var shrimpX_right = Phaser.Math.Between(rightStartMin, rightStartMax);
        var shrimpY = Phaser.Math.Between(260, 480);
        var direction = Phaser.Math.Between(0, 1);

        if (direction == 0) {
            shrimp = this.shrimpGroup.spawn(shrimpX_left, shrimpY, addType, direction);
            shrimp.move = 'right'; // 由左游到右
            if (shrimp.scaleX > 0) {
                shrimp.scaleX *= -1;
            }
        } else {
            shrimp = this.shrimpGroup.spawn(shrimpX_right, shrimpY, addType, direction);
            shrimp.move = 'left'; // 由右游到左
            if (shrimp.scaleX < 0) {
                shrimp.scaleX *= -1;
            }
        }
        if (!shrimp) {
            return
        }
    }

    addTrash(addType) {
        if (!this.trashGroup) {
            return
        }
        // 限制最大數量
        if (this.trashGroup.countActive(true) >= totalTrash || gameIsOver) {
            return
        }

        var trash;
        var trashX_left = Phaser.Math.Between(leftStartMin, leftStartMax);
        var trashX_right = Phaser.Math.Between(rightStartMin, rightStartMax);
        var trashY = Phaser.Math.Between(250, 480);
        var direction = Phaser.Math.Between(0, 1);

        if (direction == 0) {
            trash = this.trashGroup.spawn(trashX_left, trashY, addType, direction);
            trash.move = 'right'; // 由左游到右
            trash.angle = -10;
        } else {
            trash = this.trashGroup.spawn(trashX_right, trashY, addType, direction);
            trash.move = 'left'; // 由右游到左
            trash.angle = 10;
        }

        if (!trash) {
            return
        }
    }

    checkCollision() {
        // ------------ Matter 碰撞 --------------
        this.matter.world.on('collisionstart', function(event, bodyA, bodyB) {
            for (var i = 0; i < event.pairs.length; i++) {
                var bodyA = this.getRootBody(event.pairs[i].bodyA);
                var bodyB = this.getRootBody(event.pairs[i].bodyB);

                // 角色 vs 老蝦
                if (bodyA.label === 'player' && bodyB.label === 'shrimp') {
                    PlayAudio(this, 'hurtSE');
                    PlayAudio(this, 'hitSE');
                    this.shrimpGroup.despawn(bodyB.gameObject);
                    this.add.sprite(player.x, player.y + player.height / 2 + 20, 'attack').play('attacking');

                    this.calucateLife('deadShrimp');
                }
                // 牆壁 vs 蝦子 / 垃圾
                if (bodyA.label === 'wall') {
                    if (bodyB.label === 'shrimp' && !bodyB.gameObject.ishooked) {
                        this.shrimpGroup.despawn(bodyB.gameObject);
                    } else if (bodyB.label === 'trash' && !bodyB.gameObject.ishooked) {
                        this.trashGroup.despawn(bodyB.gameObject);
                    }
                } // 鉤子 vs 蝦子 / 垃圾
                else if (canHook && bodyA.label === 'hook') {
                    if (bodyB.label === 'shrimp' || bodyB.label === 'trash') {
                        if (bodyB.label === 'shrimp') {
                            bodyB.gameObject.anims.pause();
                            bodyB.gameObject.shrimpTimer = -1
                        }
                        bodyB.gameObject.ishooked = true;
                        bodyB.gameObject.inPoolY = bodyB.gameObject.y;
                        bodyB.gameObject.setFixedRotation(); // 鎖定旋轉
                        bodyB.gameObject.setCollisionCategory(category4); // 調整碰撞類別才不會打架亂甩
                    }
                } // 籃子 & 鉤子 (放進籃子)
                else if (bodyA.label == 'net' && bodyB.label == 'hook') {

                    shrimpMultiple = 1;
                    trashMultiple = 1;

                    // 殺掉蝦子
                    this.shrimpGroup.getChildren().forEach(function(child) {
                        if ( /*typeof child.ishooked != 'undefined' && */ child.ishooked) {
                            this.shrimpGroup.despawn(child);

                            PlayAudio(this, 'putSE');
                            child.setDepth(2); // 蝦子移到籃子前面
                            bodyA.gameObject.setDepth(1); // 籃子移到水花前面
                            this.add.sprite(bodyB.position.x, bodyB.position.y + 10, 'putIn').play('putting'); // 水花特效

                            if (child.keyClass == 'inkShrimp') {
                                var pos = Phaser.Math.Between(0, 1) == 0 ? -1 : 1;
                                var inkX = 475 + Phaser.Math.Between(40, 325) * pos;
                                var inkY = 375 + Phaser.Math.Between(0, 25) * pos;
                                var ink2X = 475 + Phaser.Math.Between(40, 375) * pos * -1;
                                var ink2Y = 375 + Phaser.Math.Between(0, 75) * pos * -1;
                                var ink = this.add.sprite(inkX, inkY, 'ink').setAlpha(0).setDepth(5);
                                var ink2 = this.add.sprite(ink2X, ink2Y, 'ink').setAlpha(0).setScale(0.7).setDepth(5);

                                this.tweens.add({
                                    targets: [ink, ink2],
                                    alpha: 1,
                                    duration: 600,
                                    hold: 1000, // yoyoDelay
                                    yoyo: true,
                                }, this);
                            }

                            if (child.keyClass == 'bloodShrimp' || child.keyClass == 'trash') {
                                this.calucateLife(child.keyClass);
                            }
                            this.calucateScore(child.keyClass, Math.round(shrimpMultiple * 10) / 10); // 四捨五入到小數第一位
                            shrimpMultiple += 0.2;
                        }
                    }, this);

                    // 殺掉垃圾
                    this.trashGroup.getChildren().forEach(function(child) {
                        if ( /*typeof child.ishooked != 'undefined' &&*/ child.ishooked) {
                            this.trashGroup.despawn(child);

                            PlayAudio(this, 'putSE');
                            bodyA.gameObject.setDepth(1); // 籃子移到水花前面
                            this.add.sprite(bodyB.position.x, bodyB.position.y + 10, 'putIn').play('putting'); // 水花特效

                            this.calucateLife(child.keyClass);
                            this.calucateScore(child.keyClass, Math.round(trashMultiple * 10) / 10); // 四捨五入到小數第一位
                            trashMultiple += 0.2;
                        }
                    }, this);

                    // 蝦子放進籃子之後，調整碰撞類別(才不會卡在籃子上)
                    hook.setCollisionCategory(category2);
                    hook.setCollidesWith(category3);
                }
            }
        }, this);
    }

    getRootBody(body) {
        if (body.parent === body) {
            return body;
        }
        while (body.parent !== body) {
            body = body.parent;
        }
        return body;
    }

    update(time, delta) {
        player.y = playerY; // 控制人物Y軸(忽略重力沒用，放久一點人物還是會被往下拖)

        // 畫釣魚線
        graphics.clear();
        var allConstraints = this.matter.world.getAllConstraints();
        for (let i = 0; i < allConstraints.length; i++) {
            if (allConstraints[i].label == 'line') {
                var line = new Phaser.Geom.Line(
                    allConstraints[i].bodyA.position.x + allConstraints[i].pointA.x,
                    allConstraints[i].bodyA.position.y + allConstraints[i].pointA.y,
                    allConstraints[i].bodyB.position.x + allConstraints[i].pointB.x,
                    allConstraints[i].bodyB.position.y + allConstraints[i].pointB.y
                )
                graphics.lineStyle(3, 0x000000);
                graphics.strokeLineShape(line);
            }
        }

        if (!this.shrimpGroup || !this.trashGroup) {
            return
        }

        // 蝦子跟隨鉤子
        this.shrimpGroup.getChildren().forEach(function(child) {
            if (!child.ishooked && child.y < 0) {
                this.shrimpGroup.despawn(child); // 限制(未知原因會從天上生成降落)
            }

            if (child.ishooked) {
                child.x = hook.x;
                child.y = hook.y;

                if (child.shrimpTimerText.alpha == 1) {
                    child.shrimpTimerText.alpha = 0;
                }
            } // 限制不再移動(遊戲結束 & 動畫暫停，仍會亂飄)
            else if (gameIsOver && !child.ishooked) {
                child.x = child.shrimpPreX;
                child.y = child.shrimpPreY;
            }
        }, this);

        // 垃圾跟隨鉤子
        this.trashGroup.getChildren().forEach(function(child) {
            // 垃圾跟隨鉤子
            if (!child.ishooked && child.y < 0) {
                this.trashGroup.despawn(child); // 限制(未知原因會從天上生成降落)
            }

            if (child.ishooked) {
                child.x = hook.x;
                child.y = hook.y;
            } // 限制不再移動(遊戲結束 & 動畫暫停，仍會亂飄)
            else if (gameIsOver && !child.ishooked) {
                child.x = child.trashPreX;
                child.y = child.trashPreY;
            }
        }, this);

        if (gameIsOver) {
            return
        }

        if (hook.y > 500) {
            isTap = true;
        }

        // 紀錄遊戲結束前蝦子最後位置 & 釣起時暫停動畫
        this.shrimpGroup.getChildren().forEach(function(child) {
            child.shrimpPreX = child.x;
            child.shrimpPreY = child.y;
            if (child.ishooked) {
                child.moveXTween.pause();
                child.moveYTween.pause();
            }
        }, this);

        // 紀錄遊戲結束前垃圾最後位置 & 釣起時暫停動畫
        this.trashGroup.getChildren().forEach(function(child) {
            child.trashPreX = child.x;
            child.trashPreY = child.y;
            if (child.ishooked) {
                child.moveXTween.pause();
                child.moveYTween.pause();
            }
        }, this);

        // 老蝦倒數 & 文字
        this.shrimpGroup.getChildren().forEach(function(child) {
            if (child.keyClass == 'deadShrimp' && !child.floating) {
                child.updateTimer += delta;
                while (child.updateTimer > 1000) {
                    child.updateTimer -= 1000;
                    child.shrimpTimer -= 1;
                }
                if (child.shrimpTimer == 0 && !child.ishooked && child.x < 960 && child.x > 0) {
                    PlayAudio(this, 'floatSE');
                    child.floating = true;
                    this.floatUp(child, player.x, player.y);
                }
                if (typeof child.shrimpTimerText != 'undefined' && child.shrimpTimerText.alpha == 1) {
                    child.shrimpTimerText.setText(child.shrimpTimer);
                    if (child.move == 'right') {
                        child.shrimpTimerText.x = child.x - 55;
                    } else {
                        child.shrimpTimerText.x = child.x + child.width / 2;
                    }
                    child.shrimpTimerText.y = child.y - child.height / 2;
                }
            }
        }, this);

        // 高於水池邊，復原碰撞類別
        if (hook.y < 150) {
            canHook = false;
            this.isPut = true;
            hook.setCollisionCategory(category3); // 與籃子產生碰撞
            hook.setCollidesWith(category2);

        } // 低於水池邊，復原碰撞類別
        else if (!canHook && hook.y > 200) {
            this.isPut = false;
            hook.setCollisionCategory(category3); // 避免與蝦子碰撞
            hook.setCollidesWith(category2);

            // 釣起後沒進籃 -> 釋放蝦子
            this.shrimpGroup.getChildren().forEach(function(child) {
                if (child.ishooked) {
                    child.setCollisionCategory(category3); // 復原碰撞類別
                    if (hook.y > child.inPoolY) {
                        child.ishooked = false;
                        child.moveXTween.resume();
                        child.moveYTween.resume();
                        child.shrimpTimer = shrimpTimer;
                        child.shrimpTimerText.alpha = 1;
                        child.anims.resume();
                    }
                }
            }, this);

            // 釣起後沒進籃 -> 釋放垃圾
            this.trashGroup.getChildren().forEach(function(child) {
                if (child.ishooked) {
                    child.setCollisionCategory(category3); // 復原碰撞類別
                    if (hook.y > child.inPoolY) {
                        child.ishooked = false;
                        child.moveXTween.resume();
                        child.moveYTween.resume();
                    }

                }
            }, this);
        }
    }

    // 老蝦升天
    floatUp(target, x, y) {
        target.shrimpTimerText.alpha = 0;
        target.anims.pause();
        target.setTexture('deadShrimp', 5);
        target.setCollidesWith(category1); // 調整類別與角色碰撞

        var goalY = y + player.height / 2 + 20;
        var moveDuration = Math.abs(Phaser.Math.Distance.Between(x, goalY, target.x, target.y)); // 兩點距離(讓tween的速度一樣)
        this.floatTween = this.add.tween({
            targets: target,
            x: x,
            y: goalY,
            duration: moveDuration * 2.5,
            callbackScope: this,
            onComplete: function() { // 飛上去但沒撞到角色
                PlayAudio(this, 'hitSE');
                this.shrimpGroup.despawn(target);
                this.add.sprite(x, goalY, 'attack').play('attacking');
            }
        });
    }

    calucateLife(keyClass) {
        if (gameIsOver) {
            return
        }

        var variable = 0;
        switch (keyClass) {
            case 'boss': // 加滿血量(隱藏功能)
                variable = life;
                break;
            case 'bloodShrimp': // 加1/4血量
                variable = Math.round(life / 4 * 10) / 10;
                break;
            case 'deadShrimp': // 扣1/3血量
                variable = -Math.round(life / 3 * 10) / 10;
                break;
            case 'trash': // 扣1/6血量
                variable = -Math.round(life / 6 * 10) / 10;
                break;
            default:
                break;
        }

        if ((this.currentLife + variable) > life) {
            this.stepWidth = this.lifeInner.width / life * (life - this.currentLife);
            this.currentLife = life;
        } else {
            this.stepWidth = this.lifeInner.width / life * variable;
            this.currentLife += variable;
        }
        this.lifeMask.x += this.stepWidth;
    }

    calucateScore(keyClass, rate) {
        var baseScore;
        var subtotal;
        switch (keyClass) {
            case 'normalShrimp':
                baseScore = baseScore_normal;
                break;
            case 'bloodShrimp':
                baseScore = baseScore_blood;
                break;
            case 'deadShrimp':
                baseScore = baseScore_dead;
                break;
            case 'inkShrimp':
                baseScore = baseScore_ink;
                break;
            case 'trash':
                baseScore = -score * 0.1; //當前分數的10%
                break;
            default:
                break;
        }
        subtotal = Math.round(baseScore * rate);
        score += subtotal;

        // 紀錄遊戲歷程
        if (subtotal < 0) {
            deduction += Math.abs(subtotal);
        } else {
            if (historyScoreArray.indexOf(subtotal) == -1) {
                historyScoreArray.push(subtotal);
                historyNumArray[historyScoreArray.indexOf(subtotal)] = 1;
            } else {
                historyNumArray[historyScoreArray.indexOf(subtotal)]++;
            }
        }

        this.scoreTween();
    }

    scoreTween() {
        if (score) {
            this.pointsTween = this.tweens.addCounter({
                to: score,
                duration: 200,
                onUpdateScope: this,
                onUpdate: function() {
                    this.scoreText.setText(Math.floor(this.pointsTween.getValue()));
                },
            });
        }
    }

    gameOver() {
        this.tweens.add({
            targets: soundBgm,
            volume: 0,
            duration: 1000
        });

        PlayAudio(this, 'overSE');

        this.add.sprite(0, 0, 'cover').setOrigin(0).setDepth(7);
        var finish = this.add.sprite(game.config.width / 2, -200, 'finish');
        finish.setDepth(8).play('finishing');

        this.tweens.add({
            targets: finish,
            y: game.config.height / 2,
            duration: 1000,
            ease: 'Bounce.Out'
        });

        PlayHistories += deduction.toString().padStart(4, '0'); // 轉4位數字串
        for (var i = 0; i < historyScoreArray.length; i++) {
            PlayHistories += historyNumArray[i].toString().padStart(2, '0'); // 轉2位數字串
            PlayHistories += historyScoreArray[i].toString().padStart(4, '0'); // 轉4位數字串
        }

        // 回傳分數
        this.time.addEvent({
            delay: 800,
            callback: function() {
                // sendScore(score, PlayHistories);
                this.scene.start('over');
            },
            callbackScope: this,
        });
    }
}

// 首頁 + 扣點/次數介面
class menu extends Phaser.Scene {
    constructor() {
        super('menu');
    }
    create() {
        menu_bg = this.add.sprite(0, 0, 'menu_bg').setOrigin(0);
        menu_bg.setInteractive().on('pointerdown', function() {
            PlayAudio(this, 'clickSE');
            menu_bg.input.enabled = false;
            // if (IsLogin && GameType != 'normal') {
            //     press.destroy();
            //     this.showBanner();
            // } else {
            this.scene.start('story');
            // }
        }, this);

        var press = this.add.sprite(game.config.width / 2, 460, 'press').setDepth(1);
        this.tweens.add({
            targets: press,
            alpha: 0,
            duration: 600,
            yoyo: true,
            repeat: -1,
            repeatDelay: 800,
        });

        var logo = this.add.sprite(game.config.width - 190, -150, 'logo').setDepth(1);
        this.tweens.add({
            targets: logo,
            y: 80,
            duration: 1000,
            ease: 'Bounce.Out'
        });

        this.anims.create({
            key: 'first',
            frames: this.anims.generateFrameNumbers('menu_shrimp', { start: 0, end: 5 }),
            frameRate: 7,
            repeat: -1
        });
        this.add.sprite(game.config.width / 2, game.config.height / 2, 'menu_shrimp').setOrigin(0.5).play('first');

        var menu_shrimp2 = this.add.sprite(game.config.width, game.config.height / 2 + 50, 'menu_shrimp2').setOrigin(1, 0.5);
        var menu_shrimp3 = this.add.sprite(0, game.config.height - 20, 'menu_shrimp3').setOrigin(0, 1);
        this.tweens.add({
            targets: menu_shrimp2,
            y: '+-6',
            angle: '+-1',
            duration: 400,
            ease: 'Linear',
            yoyo: true,
            repeat: -1
        });
        this.tweens.add({
            targets: menu_shrimp3,
            y: '+-10',
            duration: 600,
            ease: 'Linear',
            yoyo: true,
            repeat: -1
        });

        var menu_player = this.add.sprite(325, 110, 'menu_player');
        this.anims.create({
            key: 'wink',
            frames: this.anims.generateFrameNumbers('menu_player', { start: 0, end: 5 }),
            frameRate: 6,
        });
        this.time.addEvent({
            delay: 2000,
            callback: function() {
                menu_player.play('wink');
            },
            callbackScope: this,
            repeat: -1
        });

        this.anims.create({
            key: 'menu_bubbling',
            frames: this.anims.generateFrameNumbers('menu_bubble', { start: 0, end: 5 }),
            frameRate: 6,
            repeat: -1
        });
        this.add.sprite(0, 0, 'menu_bubble').setOrigin(0).play('menu_bubbling');

        // if (StatusFlag != 0 && StatusFlag != 5) {
        //     showMessageModal(StatusText);
        // }
    }

    // showBanner() {
    //     this.btnGroup = this.add.group();
    //     FBshare = this.add.sprite(60, 50, 'FBshare', 0);
    //     this.btnGroup.add(FBshare);
    //     FBshare.setInteractive().on('pointerdown', function() {
    //         btnClick(this, FBshare);
    //         this.time.addEvent({
    //             delay: 400,
    //             callback: function() {
    //                 shareViaFacebook();
    //             },
    //             callbackScope: this,
    //         });
    //     }, this);
    //     LINEshare = this.add.sprite(60, 110, 'LINEshare', 0);
    //     this.btnGroup.add(LINEshare);
    //     LINEshare.setInteractive().on('pointerdown', function() {
    //         btnClick(this, LINEshare);
    //         this.time.addEvent({
    //             delay: 400,
    //             callback: function() {
    //                 shareViaLine();
    //             },
    //             callbackScope: this,
    //         });
    //     }, this);

    //     this.boardGroup = this.add.group();
    //     var GameCostPointText = GameCostPoint.toString(); // 原型態(number)=0 的時候bitmapText無法顯示
    //     var MemberPointText = MemberPoint.toString(); // 原型態(number)=0 的時候bitmapText無法顯示

    //     this.add.image(game.config.width, game.config.height / 2, 'bannerBack').setOrigin(1, 0.5);
    //     if (MemberFreeTimes > 0) {
    //         this.boardGroup.create(game.config.width - 10, game.config.height / 2 + 50, 'freebanner').setOrigin(1, 0.5);
    //         var freeText = this.add.bitmapText(game.config.width - 150, game.config.height / 2 + 55, 'BMFont', MemberFreeTimes, 18);
    //         this.boardGroup.add(freeText);
    //     } else {
    //         this.boardGroup.create(game.config.width - 10, game.config.height / 2 + 50, 'costbanner').setOrigin(1, 0.5);
    //         var costText = this.add.bitmapText(game.config.width - 185, game.config.height / 2 + 30, 'BMFont', GameCostPointText, 28).setOrigin(1);
    //         this.boardGroup.add(costText);
    //         var pointText = this.add.bitmapText(game.config.width - 160, game.config.height / 2 + 57, 'BMFont', MemberPointText, 14);
    //         this.boardGroup.add(pointText);
    //     }

    //     playBtn = this.add.sprite(game.config.width - 200, game.config.height / 2 + 150, 'playBtn', 0);
    //     this.boardGroup.add(playBtn);
    //     this.btnGroup.add(playBtn);
    //     playBtn.setInteractive().on('pointerdown', function() {
    //         btnClick(this, playBtn);
    //         this.onStartbtnClick();
    //     }, this);

    //     homeBtn = this.add.sprite(110, game.config.height - 90, 'home', 0);
    //     this.btnGroup.add(homeBtn);
    //     homeBtn.setInteractive().on('pointerdown', function() {
    //         btnClick(this, homeBtn);
    //         quitGame();
    //     }, this);

    //     rankBtn = this.add.sprite(250, game.config.height - 90, 'rank', 0);
    //     this.btnGroup.add(rankBtn);
    //     rankBtn.setInteractive().on('pointerdown', function() {
    //         // 禁用按鈕
    //         Phaser.Actions.Call(this.btnGroup.getChildren(), function(child) {
    //             child.disableInteractive();
    //         });
    //         btnClick(this, rankBtn);
    //         showBoardDialog();
    //     }, this);

    //     bagBtn = this.add.sprite(390, game.config.height - 90, 'bag', 0);
    //     this.btnGroup.add(bagBtn);
    //     bagBtn.setInteractive().on('pointerdown', function() {
    //         btnClick(this, bagBtn);
    //         window.location.replace('/member/pocket'); //連接到商城頁-背包
    //     }, this);
    // }

    // onStartbtnClick() {
    //     this.time.addEvent({
    //         delay: 200,
    //         callback: function() {
    //             if (MemberFreeTimes > 0 || parseInt(MemberPoint, 10) >= parseInt(GameCostPoint, 10)) {
    //                 this.scene.start('story');
    //             } else {
    //                 this.boardGroup.destroy(true);

    //                 this.add.image(game.config.width - 30, game.config.height / 2 + 50, 'tipsbanner').setOrigin(1, 0.5);
    //                 storeBtn = this.add.image(game.config.width - 200, game.config.height / 2 + 150, 'storeBtn', 0);
    //                 storeBtn.setInteractive().on('pointerdown', function() {
    //                     btnClick(this, storeBtn);
    //                     this.time.addEvent({
    //                         delay: 200,
    //                         callback: function() {
    //                             window.location.replace('/buycoins'); // 連接到儲值頁
    //                         },
    //                         callbackScope: this,
    //                     });
    //                 }, this);
    //             }
    //         },
    //         callbackScope: this,
    //     });
    // }
}

function PlayAudio(t, music) {
    var soundFx = t.sound.add(music);
    try {
        soundFx.play();
    } catch (e) {}
}

function btnClick(t, btn) {
    btn.setFrame(1);
    PlayAudio(t, 'clickSE');
    btn.input.enabled = false;

    t.tweens.add({
        targets: btn,
        scale: { from: 0.8, to: 1 },
        duration: 100,
        ease: 'Bounce.Out',
        callbackScope: this,
        onComplete: function() {
            btn.setFrame(0);
        }
    })
}

function quitGame() {
    setTimeout(function() {
        window.history.back(); // 返回到前頁
    }, 200);
}

// 故事 / 教學介面
class story extends Phaser.Scene {
    constructor() {
        super('story');
    }
    init() {
        this.storyTime = 0; // 故事自動撥放時間
        this.autoStory = 0; // 自動播放故事(0:false，1:true)
    }
    create() {
        soundStory = this.sound.add('storySE', { loop: -1 });
        soundStory.play();

        this.waitForStart = false;

        this.story = this.add.sprite(0, 0, 'story').setOrigin(0);
        this.story2 = this.add.sprite(0, 0, 'story2').setOrigin(0).setAlpha(0);
        this.teach = this.add.sprite(0, 0, 'teach').setOrigin(0).setAlpha(0).setDepth(2);

        var skipBtn = this.add.sprite(70, 40, 'skip');
        skipBtn.setInteractive().on('pointerdown', function() {
            btnClick(this, skipBtn);
            this.time.addEvent({
                delay: 200,
                callback: function() {
                    skipBtn.destroy(true);
                    this.story.destroy(true);
                    this.story2.destroy(true);
                    this.teach.alpha = 1;
                },
                callbackScope: this,
            });
        }, this);

        this.p01 = this.add.sprite(750, 300, 'p01'); // 蝦老闆
        this.p02 = this.add.sprite(180, 300, 'p02').setTint(0x444444); // 蝦弟
        this.p03 = this.add.sprite(750, 300, 'p03').setAlpha(0); // 蝦叔
        this.p04 = this.add.sprite(180, 300, 'p04').setAlpha(0).setTint(0x444444); // 蝦妹

        // 畫對話框
        var dialogBox = this.add.graphics();
        var dialogBoxX = 55;
        var dialogBoxY = 380;
        var dialogBoxW = 850;
        var dialogBoxH = 145;
        var radius = 32;
        dialogBox.fillStyle(0x3C3C3C, 0.9);
        dialogBox.fillRoundedRect(dialogBoxX, dialogBoxY, dialogBoxW, dialogBoxH, radius);
        dialogBox.lineStyle(4, 0x00ffff);
        dialogBox.strokeRoundedRect(dialogBoxX, dialogBoxY, dialogBoxW, dialogBoxH, radius);

        // 對話內容
        this.arrow = this.add.bitmapText(dialogBoxW - 20, dialogBoxY + 100, 'dialog', '▽', 34).setAlpha(0);
        this.bitmapLabel = this.add.bitmapText(dialogBoxX + 40, dialogBoxY + 15, 'dialog', '', 38).setMaxWidth(500);
        this.sentence = ['蝦老闆：\n大創釣蝦場一年一度的釣蝦大賽即將開始啦！\n參賽者趕緊入場囉！',
            '蝦弟：\n嘿嘿嘿！好期待呀！我想拿第一(≧▽≦)\n前幾天練習了好久呢～',
            '蝦叔：\n０＿０？？．．．．．．嗝～\n獎品有啤酒嗎？',
            '蝦妹：\n吼～哪來的蠢大叔啊～！走開走開～\n太陽好大！趕快進場開始啦(`A´)',
            '蝦老闆：\n這裡就是比賽場地啦～看看誰能成為今年的蝦王！\n贏的人還有豐盛的蝦子大餐喔！',
            '蝦弟：\n是我！是我！我要抱走冠軍獎盃\n然後吃一堆蝦子吃到撐o(^▽^)o',
            '蝦叔：\n．．．我、我只想吃蝦配啤酒(ﾟAﾟ)！？\n冠軍啤酒可以喝到飽嗎？',
            '蝦妹：\n哼！看起來都不怎麼樣嘛．．．\n第一名一定是我的了！',
            '蝦老闆：\n哈！哈！大家都很興奮呢！\n那就準備開始吧！'
        ];

        this.index = 0;
        this.characterIndex; // 1闆，2弟，3叔，0妹
        this.typewriteBitmapText(this.sentence[this.index]);

        this.story.setInteractive().on('pointerdown', function() {
            PlayAudio(this, 'clickSE');
            this.readStory();
        }, this);

        this.teach.setInteractive().on('pointerdown', function() {
            // PlayAudio(this, 'clickSE');
            // this.teach.disableInteractive();

            if (!this.waitForStart) {
                this.waitForStart = true;

                // ajax取得遊戲參數
                // startData();
                this.scene.start('play');
            }
        }, this);
    };
    readStory() {
        this.typewriteEvent.delay = 5;
        if (this.letter != 'undefined' && this.letter == this.length) {
            this.index++;
            this.characterIndex = (this.index + 1) % 4;
            this.goNext = 1;
            this.typewriteEvent.remove();

            if (this.index == 4) { // 換場景(4句話一個景)
                this.eventDelay = 800;
                this.cameras.main.fadeOut(800, 0, 0, 0);
                this.story.input.enabled = false;
                this.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, () => {
                    this.cameras.main.fadeIn(800, 0, 0, 0);
                    this.story2.setAlpha(1);
                    this.story.input.enabled = true;
                })
            } else {
                this.eventDelay = 0;
            }

            this.time.addEvent({
                delay: this.eventDelay,
                callback: function() {
                    this.typewriteBitmapText(this.sentence[this.index], this.index);
                    if (this.index == this.sentence.length) {
                        this.teach.setAlpha(1);
                    } else {
                        this.showCharacter(this.characterIndex);
                    }
                },
                callbackScope: this,
            });
        }
    }
    showCharacter(cID) {
        if (cID == 1) {
            if (this.isFinal) {
                this.p01.setAlpha(1).clearTint();
                this.tweens.add({
                    targets: this.p01,
                    x: '-=2',
                    y: '+=5',
                    duration: 120,
                    yoyo: true,
                    repeat: 4,
                }, this);
                this.p02.setAlpha(0);
                this.p03.setAlpha(0);
                this.p04.setAlpha(0);
            } else {
                this.isFinal = 1;
                this.p01.setAlpha(1).clearTint();
                this.p02.setAlpha(1).setTint(0x444444);
                this.p03.setAlpha(0);
                this.p04.setAlpha(0);
            }
        } else if (cID == 2) {
            this.p01.setTint(0x444444);
            this.p02.clearTint();
        } else if (cID == 3) {
            this.p01.setAlpha(0);
            this.p02.setAlpha(0);
            this.p03.setAlpha(1).clearTint();
            this.p04.setAlpha(1).setTint(0x444444);
        } else {
            this.p03.setTint(0x444444);
            this.p04.clearTint();
        }
    }
    update(time, delta) {
        if (this.teach.alpha == 1) {
            return
        }
        if (this.goNext == 0) {
            this.storyTime += delta;
            while (this.storyTime > 3000) {
                this.storyTime -= 3000;
                this.readStory();
            }
        }

        if (this.arrow.alpha == 1) {
            this.tweens.add({
                targets: this.arrow,
                alpha: 0,
                duration: 350,
                yoyo: true,
                repeat: -1,
                onUpdate: function() {
                    if (this.goNext == 1) {
                        this.arrow.alpha = 0;
                    }
                },
                onUpdateScope: this,
            }, this);
        }
    }
    typewriteBitmapText(text) {
        this.bitmapLabel.setText(text); // 設定文字
        var wrappedText = this.bitmapLabel.getTextBounds().wrappedText; // 取範圍

        this.bitmapLabel.setText(''); // 初始化

        this.letter = 0;
        this.length = wrappedText.length;

        this.typewriteEvent = this.time.addEvent({
            callback: () => {
                this.bitmapLabel.text += wrappedText[this.letter];
                this.letter++;
                if (this.letter == this.length - 1) {
                    this.goNext = 0;
                    this.arrow.alpha = 1;
                }
            },
            repeat: wrappedText.length - 1,
            delay: 80
        });
    }
}

// 結束 / 成績結算介面
class over extends Phaser.Scene {
    constructor() {
        super('over');
    }

    create() {
        if (score > 0 /*|| MemberWinFlag*/) {
            this.add.sprite(0, 0, 'end_win').setOrigin(0);
            PlayAudio(this, 'winSE');

            this.anims.create({
                key: 'winAnims',
                frames: this.anims.generateFrameNumbers('win', { start: 0, end: 6 }),
                frameRate: 10,
            });
            this.anims.create({
                key: 'winAnims2',
                frames: this.anims.generateFrameNumbers('win', { start: 4, end: 6 }),
                frameRate: 6,
                repeat: -1
            });
            this.winSprite = this.add.sprite(game.config.width - 20, -15, 'win').setOrigin(1, 0).setDepth(1).play('winAnims');
            this.winSprite.on('animationcomplete', function() {
                this.winSprite.play('winAnims2');
            }, this);
        } else {
            this.add.sprite(0, 0, 'end_fail').setOrigin(0);
            PlayAudio(this, 'failSE');

            this.anims.create({
                key: 'failAnims',
                frames: this.anims.generateFrameNumbers('fail', { start: 0, end: 6 }),
                frameRate: 12,
            });
            this.anims.create({
                key: 'failAnims2',
                frames: this.anims.generateFrameNumbers('fail', { start: 4, end: 6 }),
                frameRate: 8,
                repeat: -1
            });
            this.failSprite = this.add.sprite(game.config.width - 20, 15, 'fail').setOrigin(1, 0).setDepth(1).play('failAnims');
            this.failSprite.on('animationcomplete', function() {
                this.failSprite.play('failAnims2');
            }, this);
        }

        // this.add.text(game.config.width - 322, game.config.height - 55, 'ID: ' + PlayerID, { font: '16px ', fill: '#FFF' }).setDepth(1);
        // this.add.text(game.config.width - 320, game.config.height - 35, 'SN: ' + PlayerSN, { font: '16px ', fill: '#FFF' }).setDepth(1);

        // FBshare = this.add.sprite(60, 50, 'FBshare', 0);
        // FBshare.setInteractive().on('pointerdown', function() {
        //     btnClick(this, FBshare);
        //     shareViaFacebook();
        // }, this);
        // LINEshare = this.add.sprite(60, 110, 'LINEshare', 0);
        // LINEshare.setInteractive().on('pointerdown', function() {
        //     btnClick(this, LINEshare);
        //     shareViaLine();
        // }, this);

        this.scorebannerGroup = this.add.group();

        this.add.image(game.config.width, game.config.height / 2, 'bannerBack').setOrigin(1, 0.5);
        this.scorebannerGroup.create(game.config.width - 10, game.config.height / 2 + 50, 'scorebanner').setOrigin(1, 0.5);
        var text = this.add.bitmapText(game.config.width - 200, game.config.height / 2 + 40, 'BMFont', score, 26).setOrigin(0.5);
        this.scorebannerGroup.add(text);

        var stamp = this.add.sprite(game.config.width / 2 + 140, game.config.height / 2 - 35, 'stamp');
        stamp.alpha = 0;
        this.scorebannerGroup.add(stamp);
        this.anims.create({
            key: 'stamping',
            frames: this.anims.generateFrameNumbers('stamp', { start: 0, end: 8 }),
            frameRate: 12,
        });
        // if (IsLogin && GameType == 'beating' && MemberWinFlag) {
            // setTimeout(function() {
            //     stamp.alpha = 1;
            //     stamp.anims.play('stamping');
            //     // stamp.on('animationcomplete', function() {
            //     //     showBoardMessageModal();
            //     // }, this);
            // }, 400)
        // } else if (GameType == 'ranking') {
        //     setTimeout(function() {
        //         showBoardMessageModal(); // 跳出上榜留言框
        //     }, 400)
        // }

        restartBtn = this.scorebannerGroup.create(game.config.width - 200, game.config.height / 2 + 150, 'restartBtn', 0);
        restartBtn.setInteractive().on('pointerdown', function() {
            btnClick(this, restartBtn);
            this.time.addEvent({
                delay: 200,
                callbackScope: this,
                callback: function() {
                    window.location.reload();
                },
            });
        }, this);

        // this.btnGroup = this.add.group();
        // homeBtn = this.add.sprite(110, game.config.height - 90, 'home', 0);
        // this.btnGroup.add(homeBtn);
        // homeBtn.setInteractive().on('pointerdown', function() {
        //     btnClick(this, homeBtn);
        //     quitGame();
        // }, this);

        // rankBtn = this.add.sprite(250, game.config.height - 90, 'rank', 0);
        // this.btnGroup.add(rankBtn);
        // rankBtn.setInteractive().on('pointerdown', function() {
        //     btnClick(this, rankBtn);
        //     showBoardDialog();
        // }, this);

        // 遊客模式
        // if (!IsLogin) {
        //     loginBtn = this.add.sprite(390, game.config.height - 90, 'login', 0);
        //     this.btnGroup.add(loginBtn);
        //     loginBtn.setInteractive().on('pointerdown', function() {
        //         btnClick(this, loginBtn);
        //         window.location.replace('/member/login?redirect_url=/'); // 登入後跳轉到首頁
        //     }, this);
        // } else {
        //     bagBtn = this.add.sprite(390, game.config.height - 90, 'bag', 0);
        //     this.btnGroup.add(bagBtn);
        //     bagBtn.setInteractive().on('pointerdown', function() {
        //         btnClick(this, bagBtn);
        //         window.location.replace('/member/pocket'); //連接到商城頁-背包
        //     }, this);
        // }
    }
}

var config = {
    type: Phaser.AUTO,
    parent: 'game',
    width: 960,
    height: 540,
    scale: {
        // 自動調整寬度和高度，保持寬高比，覆蓋全部區域，可能會超出_ENVELOP (FIT:可能會有未覆蓋)
        mode: Phaser.Scale.FIT,
        // 畫布水平、垂直居中
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
    // autoRound: false,
    physics: {
        // matter: {
        //     gravity: { y: 0.8 },
        // }
    },
    scene: [boot, load, menu, story, play, over]
};

game = new Phaser.Game(config);

/********************************************/

// startData 回傳成功
// function successStartData() {
//     life = parseInt(GameParameters.life);
//     totalShrimp = parseInt(GameParameters.totalShrimp);
//     totalTrash = parseInt(GameParameters.totalTrash);
//     baseScore_normal = parseInt(GameParameters.baseScore_normal);
//     baseScore_blood = parseInt(GameParameters.baseScore_blood);
//     baseScore_dead = parseInt(GameParameters.baseScore_dead);
//     baseScore_ink = parseInt(GameParameters.baseScore_ink);
//     frequency_normal = parseInt(GameParameters.frequency_normal);
//     frequency_blood = parseInt(GameParameters.frequency_blood);
//     frequency_dead = parseInt(GameParameters.frequency_dead);
//     frequency_ink = parseInt(GameParameters.frequency_ink);
//     frequency_trash = parseInt(GameParameters.frequency_trash);

//     // console.log('生命(遊戲時間): ' + life);
//     // console.log('池中最大數量(蝦子): ' + totalShrimp);
//     // console.log('池中最大數量(垃圾): ' + totalTrash);
//     // console.log('基本分數(一般蝦): ' + baseScore_normal);
//     // console.log('基本分數(補血蝦): ' + baseScore_blood);
//     // console.log('基本分數(老蝦): ' + baseScore_dead);
//     // console.log('基本分數(墨汁蝦): ' + baseScore_ink);
//     // console.log('生成頻率(一般蝦): ' + frequency_normal);
//     // console.log('生成頻率(補血蝦): ' + frequency_blood);
//     // console.log('生成頻率(老蝦): ' + frequency_dead);
//     // console.log('生成頻率(墨汁蝦): ' + frequency_ink);
//     // console.log('生成頻率(垃圾): ' + frequency_trash);

//     game.scene.scenes[3].scene.start('play');
// }

// sendScore 回傳成功
// function successScoreData() {
//     console.log('successScoreData')
//     setTimeout(function() {
//         // scene[4] = play
//         // game.scene.scenes[4] = this 
//         // += scene.start(' ');
//         game.scene.scenes[4].scene.start('over');
//     }, 1500);
// }

// 開啟 分享 / 上榜留言框 / 排行榜
// function PreShowDialog() {
//     var btnArray = [
//         menu_bg,
//         FBshare, LINEshare,
//         playBtn,
//         homeBtn, rankBtn, bagBtn,
//         storeBtn,
//         loginBtn, restartBtn,
//         okBtn
//     ];
//     buttonAction(btnArray, false);
// }

// 關閉 分享 / 上榜留言框 / 排行榜
// function completeCloseDialog() {
//     var btnArray = [
//         menu_bg,
//         FBshare, LINEshare,
//         playBtn,
//         homeBtn, rankBtn, bagBtn,
//         storeBtn,
//         loginBtn, restartBtn,
//         okBtn
//     ];
//     buttonAction(btnArray, true);
// }

// 開啟/關閉 按鈕 action=true/false
// function buttonAction(btnArray, action) {
//     for (var i = 0; i < btnArray.length; i++) {
//         if (typeof btnArray[i] !== 'undefined' && btnArray[i].visible === true) {
//             btnArray[i].inputEnabled = action;
//             if (typeof btnArray[i].input !== 'undefined') {
//                 btnArray[i].input.enabled = action;
//             }
//         }
//     }
// }