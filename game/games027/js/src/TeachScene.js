// import {
//     startData,
//     sendScore,
//     PlayerID,
//     PlayerSN,
//     GameParameters,
//     SetSuccessStartData,
//     SetSuccessScoreData,
// } from '../../../../game/Model/connect_source';

import { PlayAudio } from './Controller.js'

export var game_GameParameters, game_PlayerID, game_PlayerSN

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
        // console.log('------TeachScene')
        this.scene.bringToTop();
        var teach = this.add.sprite(0, 0, 'teach').setOrigin(0).setInteractive();
        teach.on('pointerdown', function () {
            PlayAudio(this, 'clickStartSE');
            teach.disableInteractive()

            // ajax取得遊戲參數
            // startData();
            this.scene.start('play')

            this.time.addEvent({
                delay: 3000,
                callback: function () {
                    teach.setVisible(false)
                },
                callbackScope: this,
            });
        },this)
    }
}

// function successStartData() {
//     console.log('successStartData' + PlayerID)
//     game_GameParameters = GameParameters
//     game_PlayerID = PlayerID
//     game_PlayerSN = PlayerSN

//     game.scene.scenes[3].scene.start('play')
// }