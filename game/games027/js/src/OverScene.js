// import {
//     GameType,
//     MemberWinFlag,
//     PlayerID,
//     PlayerSN,
//     IsLogin,
//     StatusFlag,
//     StatusText,
//     showBoardDialog,
//     showBoardMessageModal,
//     shareViaFacebook,
//     shareViaLine,
//     SetPreShowDialog,
//     SetCompleteCloseDialog,
// } from '../../../../game/Model/connect_source';

import { game_PlayerID, game_PlayerSN, } from './TeachScene';

import { score } from './PlayScene.js';
import { PlayAudio, btnClick, quitGame } from './Controller.js';

var homeBtn, restartBtn, login, bag, rank;

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
        // console.log('OverScene ' + score + ' / ' + MemberWinFlag)
        this.add.sprite(0, 0, 'end_bg').setOrigin(0);
        // this.add.text(120, 120, 'ID: ' + game_PlayerID, { font: '12px ', fill: '#000' });
        // this.add.text(380, 120, 'SN: ' + game_PlayerSN, { font: '12px ', fill: '#000' });

        this.scorebannerGroup = this.add.group();
        var stamp = this.add.sprite(game.config.width / 2 - 170, game.config.height / 2 + 120, 'stamp');
        stamp.alpha = 0;
        stamp.depth = 5;
        this.anims.create({
            key: 'stamping',
            frames: this.anims.generateFrameNumbers('stamp', { start: 0, end: 8 }),
            frameRate: 12,
        });

        var title = ['破壞之手的你', '有少女心的你', '非常執著的你', '喜愛玩耍的你', '偷偷隱宅的你'];
        var sentence = ['參加一場黑暗料理派對\n讓甜點通通變神秘生物\n這也許是某種天份呢！',
            '參加了一場粉嫩草莓派對\n以為自己藏得很好沒人發現\n殊不知你的好友在瘋狂偷拍！',
            '參加了一場抹茶控的派對\n有人帶著綠色蔬果汁走進來\n結果你盯著對方一整場！',
            '參加了一場Q彈的布丁派對\n看誰ㄉㄨㄞ~的最高誰獲勝\n開心的你連肚子都跑出來了！',
            '參加了一場巧克力魔法派對\n派對上充滿著神秘氣息\n導致你的中二魂大暴走！'
        ];

        var rand = Phaser.Math.Between(0, 4)
        this.add.sprite(game.config.width / 2, game.config.height / 2 - 70, 'end' + rand);
        this.add.bitmapText(game.config.width / 2 + 100, game.config.height / 2 + 190, 'BMFont_desserts', title[rand], 26).setOrigin(0.5);
        this.add.bitmapText(game.config.width / 2 + 100, game.config.height / 2 + 250, 'BMFont_desserts', sentence[rand], 20).setOrigin(0.5);

        // if (GameType == 'beating' && !MemberWinFlag) {
        //     this.add.text(game.config.width / 2 - 150, game.config.height / 2 + 245, '----', { font: '28px ', fill: '#000' }).setOrigin(0.5);
        // } else {
        this.add.bitmapText(game.config.width / 2 - 150, game.config.height / 2 + 245, 'BMFont', score, 28).setOrigin(0.5);
        // }

        // if (IsLogin) {
        //     if (GameType == 'beating' && MemberWinFlag) {
        // setTimeout(function() {
        //     stamp.alpha = 1;
        //     stamp.anims.play('stamping');
        // stamp.on('animationcomplete', function() {
        //     showBoardMessageModal();
        // }, this);
        // }, 400)
        // } else if (GameType == 'ranking') {
        //     setTimeout(function() {
        //         showBoardMessageModal(); // 跳出上榜留言框
        //     }, 400)
        // }
        // }

        homeBtn = this.scorebannerGroup.create(game.config.width / 2 + 165, game.config.height - 85, 'home', 0);
        homeBtn.setInteractive().on('pointerdown', function() {
            restartBtn.input.enabled = false;
            btnClick(this, homeBtn);
            quitGame();
        }, this);
        restartBtn = this.scorebannerGroup.create(game.config.width / 2, game.config.height - 85, 'restart', 0);
        restartBtn.setInteractive().on('pointerdown', function() {
            // stamp.alpha = 0;
            homeBtn.input.enabled = false;
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
        //     this.add.image(0, 0, 'mark').setOrigin(0);
        //     login = this.add.sprite(game.config.width / 2 - 165, game.config.height - 85, 'login', 0)
        //     login.setInteractive().on('pointerdown', function() {
        //         btnClick(this, login);
        //         window.location.replace('/member/login?redirect_url=/'); // 登入後跳轉到首頁
        //     }, this);
        // }
        // // 會員模式
        // else {
        //     // 過關賽
        //     if (GameType == 'beating') {
        //         bag = this.add.sprite(game.config.width / 2 - 165, game.config.height - 85, 'bag', 0);
        //         bag.setInteractive().on('pointerdown', function() {
        //             btnClick(this, bag);
        //             window.location.replace('/member/pocket'); // 連接到商城頁-背包
        //         }, this);
        //     }
        //     // 排行賽
        //     else if (GameType == 'ranking') {
        //         rank = this.add.sprite(game.config.width / 2 - 165, game.config.height - 85, 'rank', 0);
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
//         homeBtn, restartBtn, login, bag, rank
//     ];
//     buttonAction(btnArray, false);
// }

// 關閉 分享 / 上榜留言框 / 排行榜
// function completeCloseDialog() {
//     var btnArray = [
//         homeBtn, restartBtn, login, bag, rank
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