export function PlayAudio(t, music, volume) {
    var soundFx = t.sound.add(music,{
        volume: volume,
    });
    try {
        soundFx.play();
    } catch (e) {}
}

export function btnClick(t, btn) {
    btn.setFrame(1);
    PlayAudio(t, 'clickSE');
    btn.input.enabled = false;

    return t.tweens.add({
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

export function quitGame() {
    setTimeout(function() {
        window.history.back(); // 返回到前頁
    }, 200);
}

// // sendScore 回傳成功
// export function successScoreData() {
//     console.log('successScoreData')
//     setTimeout(function() {
//         // scene[4] = play
//         // game.scene.scenes[4] = this 
//         // += scene.start(' ');
//         game.scene.scenes[4].scene.start('over');
//     }, 1500);
// }