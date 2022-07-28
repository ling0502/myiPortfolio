// import {
//     GameType,
//     MemberWinFlag,
//     IsLogin,
//     showBoardDialog,
//     showBoardMessageModal,
//     SetPreShowDialog,
//     SetCompleteCloseDialog,
// } from '../../../../game/Model/connect_source';

import { game_PlayerID, game_PlayerSN, } from './TeachScene';

import { score } from './PlayScene.js';
import { btnClick, quitGame } from './Controller.js';

var leaveBtn, restartBtn, login, bag, rank;

export default class OverScene extends Phaser.Scene {
    constructor() {
        super('over');
    }

    init() {
        // 綁定connect.js功能
        // SetPreShowDialog(PreShowDialog);
        // SetCompleteCloseDialog(completeCloseDialog);
    }

    create() {
        this.scene.bringToTop();

        this.add.sprite(game.config.width / 2, game.config.height / 2, 'background');
        var fontStyle = { font: '18px ', fill: '#FFF' }
        // this.add.text(game.config.width / 2 - 200, game.config.height / 2 + 90, 'ID: ' + game_PlayerID, fontStyle).setDepth(1);
        // this.add.text(game.config.width / 2 + 200, game.config.height / 2 + 90, 'SN: ' + game_PlayerSN, fontStyle).setOrigin(1, 0).setDepth(1);

        this.add.sprite(game.config.width / 2, game.config.height / 2, 'cover').setScale(1.6);
        this.scorebannerGroup = this.add.group();
        var stamp = this.add.sprite(game.config.width / 2 - 170, game.config.height / 2 + 120, 'stamp');
        stamp.alpha = 0;
        stamp.depth = 5;
        this.anims.create({
            key: 'stamping',
            frames: this.anims.generateFrameNumbers('stamp', { start: 0, end: 8 }),
            frameRate: 12,
        });

        this.scorebannerGroup.create(game.config.width / 2, game.config.height / 2, 'scoreBanner');
        this.add.bitmapText(game.config.width / 2, game.config.height / 2, 'BMFont', score, 42).setOrigin(0.5);

        // if (IsLogin) {
        //     if (GameType == 'beating' && MemberWinFlag) {
        //         setTimeout(function() {
        //             stamp.alpha = 1;
        //             stamp.anims.play('stamping');
        //             stamp.on('animationcomplete', function() {
        //                 showBoardMessageModal();
        //             }, this);
        //         }, 400)
        //     } else if (GameType == 'ranking') {
        //         setTimeout(function() {
        //             showBoardMessageModal(); // 跳出上榜留言框
        //         }, 400)
        //     }
        // }

        leaveBtn = this.scorebannerGroup.create(game.config.width / 2 - 125, game.config.height / 2 + 200, 'cancleBtn', 0);
        leaveBtn.setInteractive().on('pointerdown', function() {
            restartBtn.input.enabled = false;
            btnClick(this, leaveBtn);
            quitGame();
        }, this);
        restartBtn = this.scorebannerGroup.create(game.config.width / 2 + 120, game.config.height / 2 + 200, 'restartBtn', 0);
        restartBtn.setInteractive().on('pointerdown', function() {
            stamp.alpha = 0;
            leaveBtn.input.enabled = false;
            btnClick(this, restartBtn);
            this.time.addEvent({
                delay: 400,
                callback: function() {
                    this.scene.start('menu');
                },
                callbackScope: this,
            });
        }, this);

        // 遊客模式
        // if (!IsLogin) {
        //     this.add.sprite(game.config.width / 2, game.config.height / 2, 'mark').setDepth(1).setScale(1.6);
        //     login = this.add.sprite(game.config.width / 2 + 280, game.config.height / 2 - 280, 'login', 0)
        //     login.setInteractive().on('pointerdown', function() {
        //         btnClick(this, login);
        //         window.location.replace('/member/login?redirect_url=/'); // 登入後跳轉到首頁
        //     }, this);
        // }
        // // 會員模式
        // else {
        //     // 過關賽
        //     if (GameType == 'beating') {
        //         bag = this.add.sprite(game.config.width / 2 + 280, game.config.height / 2 - 280, 'bag', 0);
        //         bag.setInteractive().on('pointerdown', function() {
        //             btnClick(this, bag);
        //             window.location.replace('/member/mall/page/Gift'); // 連接到商城頁-背包
        //         }, this);
        //     }
        //     // 排行賽
        //     else if (GameType == 'ranking') {
        //         rank = this.add.sprite(game.config.width / 2 + 280, game.config.height / 2 - 280, 'rank', 0);
        //         rank.setInteractive().on('pointerdown', function() {
        //             btnClick(this, rank);
        //             showBoardDialog();
        //         }, this);
        //     }
        // }
    }
}

// 開啟 分享 / 上榜留言框 / 排行榜
// function PreShowDialog() {
//     var btnArray = [
//         leaveBtn, restartBtn, login, bag, rank
//     ];
//     buttonAction(btnArray, false);
// }

// 關閉 分享 / 上榜留言框 / 排行榜
// function completeCloseDialog() {
//     var btnArray = [
//         leaveBtn, restartBtn, login, bag, rank
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