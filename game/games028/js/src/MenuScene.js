// import {
//     GameType,
//     GameCostPoint,
//     MemberFreeTimes,
//     MemberPoint,
//     IsLogin,
//     StatusFlag,
//     StatusText,
//     // ajax前置後置functions變數內容指定
//     SetPreShowDialog,
//     SetCompleteCloseDialog,
//     // 基礎流程functions
//     showMessageModal,
// } from '../../../../game/Model/connect_source';

import TeachScene from './TeachScene'
import { PlayAudio, btnClick, quitGame } from './Controller.js'

var playBtn, startBtn, cancleBtn;

export default class MenuScene extends Phaser.Scene {
    constructor() {
        super('menu')
    }

    init() {
        // 綁定connect.js功能
        // SetPreShowDialog(PreShowDialog);
        // SetCompleteCloseDialog(completeCloseDialog);
    }

    create() {
        this.scene.bringToTop();
        var menu_bg = this.add.sprite(game.config.width / 2, game.config.height / 2, 'menu_bg');
        menu_bg.setInteractive().on('pointerdown', function() {
            PlayAudio(this, 'clickSE');
            menu_bg.disableInteractive();
            // if (IsLogin && GameType != 'normal') {
            //     press.destroy();
            //     this.add.sprite(game.config.width / 2, game.config.height / 2, 'cover').setScale(1.6);
            //     this.showBanner();
            // } else {
            if (this.scene.manager.keys['teach'] == undefined) {
                this.scene.add("teach", TeachScene, false);
            }
            this.scene.start('teach');
            // }
        }, this);

        // 標題動畫
        var logo = this.add.sprite(game.config.width / 2, -150, 'logo');
        this.tweens.add({
            targets: logo,
            y: 200,
            duration: 1000,
            ease: 'Bounce.Out'
        });

        // 魚動畫
        this.anims.create({
            key: 'fishing',
            frames: this.anims.generateFrameNumbers('menu_fish', { start: 0, end: 5 }),
            frameRate: 5,
            repeat: -1,
        });
        this.anims.create({
            key: 'fin1ing',
            frames: this.anims.generateFrameNumbers('fin1', { start: 0, end: 5 }),
            frameRate: 5,
            repeat: -1,
        });
        this.anims.create({
            key: 'fin2ing',
            frames: this.anims.generateFrameNumbers('fin2', { start: 0, end: 5 }),
            frameRate: 5,
            repeat: -1,
        });
        this.anims.create({
            key: 'fin3ing',
            frames: this.anims.generateFrameNumbers('fin3', { start: 0, end: 5 }),
            frameRate: 5,
            repeat: -1,
        });
        this.anims.create({
            key: 'fin4ing',
            frames: this.anims.generateFrameNumbers('fin4', { start: 0, end: 5 }),
            frameRate: 5,
            repeat: -1,
        });
        this.anims.create({
            key: 'fin5ing',
            frames: this.anims.generateFrameNumbers('fin5', { start: 0, end: 5 }),
            frameRate: 5,
            repeat: -1,
        });
        var fin1 = this.add.sprite(game.config.width / 2 - 270, game.config.height / 2 + 210, 'fin1');
        fin1.play('fin1ing');
        var fin3 = this.add.sprite(game.config.width / 2, game.config.height / 2 + 290, 'fin3');
        fin3.play('fin3ing');
        var fin5 = this.add.sprite(game.config.width / 2 + 270, game.config.height / 2 - 20, 'fin5');
        fin5.play('fin5ing');
        var fin4 = this.add.sprite(game.config.width / 2 + 280, game.config.height / 2 + 240, 'fin4');
        fin4.play('fin4ing');
        var menu_fish = this.add.sprite(game.config.width / 2 + 40, game.config.height / 2 - 30, 'menu_fish');
        menu_fish.play('fishing');
        var fin2 = this.add.sprite(game.config.width / 2 + 140, game.config.height / 2 + 220, 'fin2');
        fin2.play('fin2ing');

        this.tweens.add({
            targets: [menu_fish, fin1, fin2, fin3, fin4, fin5],
            y: '-=10',
            duration: 900,
            yoyo: true,
            repeat: -1
        });

        var cat1 = this.add.sprite(game.config.width / 2 - 280, game.config.height / 2 - 250, 'cat1');
        this.tweens.add({
            targets: cat1,
            y: '-=60',
            duration: 1600,
            yoyo: true,
            repeat: -1
        });
        var cat2 = this.add.sprite(game.config.width / 2 + 270, game.config.height / 2 + 400, 'cat2');
        this.tweens.add({
            targets: cat2,
            y: '+=35',
            duration: 1200,
            yoyo: true,
            repeat: -1
        });

        var press = this.add.sprite(game.config.width / 2, game.config.height - 200, 'press').setScale(1.2);
        this.tweens.add({
            targets: press,
            alpha: 0,
            duration: 600,
            yoyo: true,
            repeat: -1,
            repeatDelay: 800,
        });

        // console.log('StatusFlag ' + StatusFlag)
        // if (StatusFlag != 0 && StatusFlag != 5) {
        //     showMessageModal(StatusText);
        // }
    }


    // showBanner() {
    //     var boardGroup = this.add.group();
    //     var costString = GameCostPoint.toString(); // 原型態(number)=0 的時候bitmapText無法顯示
    //     var MemberPointString = MemberPoint.toString(); // 原型態(number)=0 的時候bitmapText無法顯示

    //     if (MemberFreeTimes > 0) {
    //         boardGroup.create(game.config.width / 2, game.config.height / 2, 'freeBanner');
    //         boardGroup.create(this.add.bitmapText(game.config.width / 2 + 55, game.config.height / 2 + 70, 'BMFont', MemberFreeTimes, 22));
    //     } else {
    //         boardGroup.create(game.config.width / 2, game.config.height / 2, 'costBanner');
    //         boardGroup.create(this.add.bitmapText(game.config.width / 2 + 10, game.config.height / 2 + 20, 'BMFont', costString, 36).setOrigin(1));
    //         boardGroup.create(this.add.bitmapText(game.config.width / 2 + 55, game.config.height / 2 + 70, 'BMFont', MemberPointString, 22));
    //     }

    //     cancleBtn = this.add.sprite(game.config.width / 2 - 125, game.config.height / 2 + 200, 'cancleBtn', 0);
    //     boardGroup.add(cancleBtn);
    //     cancleBtn.setInteractive().on('pointerdown', function() {
    //         btnClick(this, cancleBtn);
    //         startBtn.input.enabled = false;
    //         quitGame();
    //     }, this);
    //     startBtn = this.add.sprite(game.config.width / 2 + 120, game.config.height / 2 + 200, 'startBtn', 0);
    //     boardGroup.add(startBtn);
    //     startBtn.setInteractive().on('pointerdown', function() {
    //         btnClick(this, startBtn);
    //         this.tweens.add({
    //             targets: boardGroup,
    //             alpha: 0,
    //             duration: 300,
    //         });
    //         cancleBtn.input.enabled = false;
    //         this.onStartbtnClick();
    //     }, this);
    // }

    // onStartbtnClick() {
    //     this.time.addEvent({
    //         delay: 300,
    //         callback: function() {
    //             if (MemberFreeTimes > 0 || parseInt(MemberPoint, 10) >= parseInt(GameCostPoint, 10)) {
    //                 if (this.scene.manager.keys['teach'] == undefined) {
    //                     this.scene.add("teach", TeachScene, false);
    //                 }
    //                 this.scene.start('teach');
    //             } else {
    //                 var tipsGroup = this.add.group();
    //                 tipsGroup.create(game.config.width / 2, game.config.height / 2, 'tipsBanner');
    //                 var backBtn = tipsGroup.create(game.config.width / 2 - 125, game.config.height / 2 + 200, 'cancleBtn', 0);
    //                 backBtn.setInteractive().on('pointerdown', function() {
    //                     btnClick(this, backBtn);
    //                     this.time.addEvent({
    //                         delay: 300,
    //                         callback: function() {
    //                             startBtn.input.enabled = true;
    //                             cancleBtn.input.enabled = true;
    //                             tipsGroup.destroy(true);
    //                             this.tweens.add({
    //                                 targets: tipsGroup,
    //                                 alpha: 1,
    //                                 duration: 300,
    //                             });
    //                         },
    //                         callbackScope: this,
    //                     });
    //                 }, this);

    //                 var storeBtn = tipsGroup.create(game.config.width / 2 + 120, game.config.height / 2 + 200, 'storeBtn', 0);
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

// 開啟 分享 / 上榜留言框 / 排行榜
// function PreShowDialog() {
//     var btnArray = [
//         playBtn, startBtn, cancleBtn
//     ];
//     buttonAction(btnArray, false);
// }

// 關閉 分享 / 上榜留言框 / 排行榜
// function completeCloseDialog() {
//     var btnArray = [
//         playBtn, startBtn, cancleBtn
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