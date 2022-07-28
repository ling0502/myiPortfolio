// import {
//     GameType,
//     GameID,
//     GameDegree,
//     GameParameters,
//     GameFreeTimes,
//     GameCostPoint,
//     MemberFreeTimes,
//     MemberPoint,
//     IsLogin,
//     StatusFlag,
//     StatusText,
//     GatePassScore,
//     // ajax前置後置functions變數內容指定
//     SetPreShowDialog,
//     SetCompleteCloseDialog,
//     // 基礎流程functions
//     entranceData,
//     startData,
//     sendScore,
//     showBoardDialog,
//     shareViaFacebook,
//     shareViaLine,
//     resetData,
//     showMessageModal,
//     showErrorModal,
//     showStartModal,
//     showReloadModal,
//     dialogTemplete,
//     showBoardMessageModal
// } from '../../../../game/Model/connect_source';

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
        console.log('-------MenuScene')
        this.scene.bringToTop();
        this.add.sprite(0, 0, 'menu').setOrigin(0);

        // 標題動畫
        this.anims.create({
            key: 'menu_logo',
            frames: this.anims.generateFrameNumbers('logo', { start: 0, end: 4 }),
            frameRate: 6,
            repeat: -1,
        });
        var logo = this.add.sprite(game.config.width / 2, -150, 'logo');
        logo.play('menu_logo');
        this.tweens.add({
            targets: logo,
            y: 120,
            duration: 1000,
            ease: 'Bounce.Out'
        });

        // 人物動畫
        this.anims.create({
            key: 'menu_player',
            frames: this.anims.generateFrameNumbers('menu_player', { start: 0, end: 4 }),
            frameRate: 6,
            repeat: -1,
        });
        var player = this.add.sprite(game.config.width / 2 + 20, game.config.height / 2 + 15, 'menu_player');
        player.play('menu_player');

        // 開始按鈕
        playBtn = this.add.sprite(game.config.width / 2, game.config.height / 2 + 300, 'playBtn', 0);
        playBtn.setInteractive().on('pointerdown', function() {
            btnClick(this, playBtn).on('complete', function() {
                playBtn.setVisible(false)
                // if (IsLogin && GameType != 'normal') {
                //     this.showBanner();
                // } else {
                    this.scene.start('teach');
                // }
            }, this);
        }, this);

        // console.log('StatusFlag ' + StatusFlag)
        // if (StatusFlag != 0 && StatusFlag != 5) {
        //     console.log(StatusText)
        //     showMessageModal(StatusText);
        // }
    }

//     showBanner() {
//         var boardGroup = this.add.group();
//         var costString = GameCostPoint.toString(); // 原型態(number)=0 的時候bitmapText無法顯示
//         var MemberPointString = MemberPoint.toString(); // 原型態(number)=0 的時候bitmapText無法顯示

//         if (MemberFreeTimes > 0) {
//             boardGroup.create(game.config.width / 2, game.config.height / 2, 'freebanner');
//             boardGroup.create(this.add.bitmapText(game.config.width / 2 + 55, game.config.height / 2 + 25, 'BMFont', MemberFreeTimes, 18));
//         } else {
//             boardGroup.create(game.config.width / 2, game.config.height / 2, 'costbanner');
//             boardGroup.create(this.add.bitmapText(game.config.width / 2 + 10, game.config.height / 2 + 10, 'BMFont', costString, 26).setOrigin(1));
//             boardGroup.create(this.add.bitmapText(game.config.width / 2 + 35, game.config.height / 2 + 35, 'BMFont', MemberPointString, 12));
//         }

//         cancleBtn = this.add.sprite(game.config.width / 2 - 75, game.config.height / 2 + 120, 'cancleBtn', 0);
//         boardGroup.add(cancleBtn);
//         cancleBtn.setInteractive().on('pointerdown', function() {
//             btnClick(this, cancleBtn);
//             startBtn.input.enabled = false;
//             quitGame();
//         }, this);
//         startBtn = this.add.sprite(game.config.width / 2 + 70, game.config.height / 2 + 120, 'startBtn', 0);
//         boardGroup.add(startBtn);
//         startBtn.setInteractive().on('pointerdown', function() {
//             btnClick(this, startBtn);
//             this.tweens.add({
//                 targets: boardGroup,
//                 alpha: 0,
//                 duration: 300,
//             });
//             cancleBtn.input.enabled = false;
//             this.onStartbtnClick();
//         }, this);
//     }

//     onStartbtnClick() {
//         this.time.addEvent({
//             delay: 300,
//             callback: function() {
//                 if (MemberFreeTimes > 0 || parseInt(MemberPoint, 10) >= parseInt(GameCostPoint, 10)) {
//                     this.scene.start('teach');
//                 } else {
//                     var tipsGroup = this.add.group();
//                     tipsGroup.create(game.config.width / 2, game.config.height / 2, 'tipsbanner');
//                     var backBtn = tipsGroup.create(game.config.width / 2 - 75, game.config.height / 2 + 120, 'cancleBtn', 0);
//                     backBtn.setInteractive().on('pointerdown', function() {
//                         btnClick(this, backBtn);
//                         this.time.addEvent({
//                             delay: 300,
//                             callback: function() {
//                                 startBtn.input.enabled = true;
//                                 cancleBtn.input.enabled = true;
//                                 tipsGroup.destroy(true);
//                                 this.tweens.add({
//                                     targets: tipsGroup,
//                                     alpha: 1,
//                                     duration: 300,
//                                 });
//                             },
//                             callbackScope: this,
//                         });
//                     }, this);

//                     var storeBtn = tipsGroup.create(game.config.width / 2 + 70, game.config.height / 2 + 120, 'storeBtn', 0);
//                     storeBtn.setInteractive().on('pointerdown', function() {
//                         btnClick(this, storeBtn);
//                         this.time.addEvent({
//                             delay: 200,
//                             callback: function() {
//                                 window.location.replace('/buycoins'); // 連接到儲值頁
//                             },
//                             callbackScope: this,
//                         });
//                     }, this);
//                 }
//             },
//             callbackScope: this,
//         });
//     }
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