// import {
//     IsLogin,
//     GameType,
//     GameCostPoint,
//     MemberFreeTimes,
//     GameFreeTimes,
//     MemberPoint,

//     startData,
//     sendScore,
//     PlayerID,
//     PlayerSN,
//     GameParameters,
//     SetSuccessStartData,
//     SetSuccessScoreData,
// } from '../../../../game/Model/connect_source';

import { btnClick, PlayAudio } from './Controller.js'

export var game_GameParameters, game_PlayerID, game_PlayerSN, game_MemberPoint

export default class TeachScene extends Phaser.Scene {
    constructor() {
        super('teach')
    }

    init() {
        // 綁定connect.js功能
        // SetPreShowDialog(PreShowDialog);
        // SetCompleteCloseDialog(completeCloseDialog);
        // SetSuccessStartData(successStartData);
    }

    create() {
        this.soundBgm = this.sound.add('bgmSE', { loop: -1 });
        this.soundBgm.play();

        this.scene.bringToTop();

        this.waitForStart = false;

        this.story = [];
        this.addPage(game.config.height / 2 - 480, 'story1');
        this.addPage(game.config.height / 2, 'story2-1').setVisible(false);
        this.addPage(game.config.height / 2, 'story2-2').setVisible(false);
        this.addPage(game.config.height / 2 + 480, 'story3').setVisible(false);
        this.addPage(game.config.height / 2, 'teach').setVisible(false).setDepth(1);

        this.fireWork1 = this.add.sprite(game.config.width / 2 + 230, 150, 'fireWork1').setBlendMode(Phaser.BlendModes.SCREEN);
        this.fireWork2 = this.add.sprite(game.config.width / 2 + 80, 230, 'fireWork2').setBlendMode(Phaser.BlendModes.SCREEN);

        this.tweens.add({
            targets: this.fireWork1,
            scale: { from: 0, to: 1 },
            alpha: { from: 0, to: 1 },
            angle: { from: 0, to: 30 },
            duration: 800,
        });

        this.tweens.add({
            targets: this.fireWork2,
            scale: { from: 0, to: 1 },
            alpha: { from: 0, to: 1 },
            angle: { from: 0, to: -20 },
            duration: 1000,
        });


        this.input.on('pointerdown', function() {
            for (var i = 0; i < this.story.length; i++) {
                if (this.story[i].visible == false) {
                    PlayAudio(this, 'clickSE');
                    this.story[i].setVisible(true)
                    return
                } else if (this.story[i].visible == true && i == this.story.length - 1) {
                    if (this.waitForStart == true) return

                    PlayAudio(this, 'clickStartSE');
                    this.waitForStart = true;

                    // ajax取得遊戲參數
                    // startData();
                    this.scene.start('play');
                }
            }
        }, this);

        this.skipBtn = this.add.sprite(game.config.width - 150, game.config.height - 75, 'skip', 0);
        this.skipBtn.setInteractive().on('pointerdown', function() {
            btnClick(this, this.skipBtn);
            this.time.addEvent({
                delay: 200,
                callback: function() {
                    this.skipBtn.destroy();
                    this.story[this.story.length - 1].setVisible(true)
                },
                callbackScope: this,
            });
        }, this);
    }

    addPage(y, key) {
        var storyPage = this.add.sprite(game.config.width / 2, y, key);
        this.story.push(storyPage)

        return storyPage
    }
}

// function successStartData() {
//     // console.log('successStartData' + PlayerID)
//     game_GameParameters = GameParameters
//     game_PlayerID = PlayerID
//     game_PlayerSN = PlayerSN
//     game_MemberPoint = MemberPoint

//     game.scene.scenes[3].scene.start('play')
// }