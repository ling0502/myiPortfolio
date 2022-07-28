/**
 * --------------------------
 *  前端網頁上的js 變數
 * --------------------------
 *  var GameType：遊戲模式：normal、ranking、beating
 *  var GameID：遊戲Name / 競賽ID
 *  var GameDegree：遊戲難度：degree_id
 * 
 * --------------------------
 *  連結後端的ajax functions
 *   // 非同步設定(true=啟用非同步/false=關閉非同步)
 *   // 如果需要發送同步請求，請將此選項設置為false。
 *   // 注意，同步請求將鎖住瀏覽器，用戶其它操作必須等待請求完成才可以執行。
 * --------------------------
 *  entranceData(ASYNC_SETTING)：遊戲入口畫面 return 會員登入(IsLogin=true)、每日免費次數、會員剩餘免費次數、會員持有點數、(通關賽遊玩資格判斷)
 *  startData(ASYNC_SETTING)：確認遊玩 進入遊戲前判斷遊玩資格(扣點) return 玩家資料ID & SN 、遊戲參數
 *  sendScore(SCORE, PLAYHISTORY, ASYNC_SETTING)：分數&歷程傳送到後端 return 名次(前三名可留言)
 *  sendScoreByGetMethod(SCORE, PLAYHISTORY, textStatus)：sendScore傳送逾時時改用get方法
 *  sendComment(COMMENT, ASYNC_SETTING)：前三名的留言傳送到後端 return 成功 or 失敗
 *  purchaseItem(ITEM, ASYNC_SETTING)：道具購買 return 成功 or 失敗
 *  shareViaFacebook()：成功分享到Facebook 加免費次數 return 會員剩餘免費次數
 *  shareViaLine()：成功分享到Line 加免費次數 return 會員剩餘免費次數
 * 
 * --------------------------
 *  基礎流程functions
 * --------------------------
 *  timeCheck()：逾時判斷 計時變數++、進入遊戲30秒後，沒有開始遊戲，顯示遊戲已斷線(連線逾時)
 *  timingStart()：計時開始 呼叫時機：startData() ajax成功後
 *  timingStop()：計時結束 呼叫時機：Game Over
 *  timingPause()：計時暫停 呼叫時機：暫停
 *  timingResume()：計時恢復 呼叫時機：結束暫停，繼續遊戲
 *  showBoardDialog()：顯示 排行榜彈出窗
 *  showBoardMessageModal()：跳出上榜留言框(繼續遊玩)
 *  showMessageModal(MESSAGE)：跳出一般訊息框(關閉後繼續遊戲)
 *  showErrorModal(MESSAGE)：跳出錯誤訊息框(關閉後跳轉回上頁)
 *  showStartModal(TITLE, MESSAGE)：跳出獎品狀態訊息框(關閉後繼續遊玩)
 *  showReloadModal(MESSAGE)：跳出錯誤訊息框(關閉後重新整理)
 *  dialogTemplete(TITLE, MESSAGE, NOTES, NEXTSTEP = '')：彈出窗模板
 * 
 * --------------------------
 *  ajax前後執行functions變數名稱
 * --------------------------
 * PreEntranceData
 * setEntranceData
 * PreStartData
 * successStartData
 * noEnoughPoints
 * PreSendScore
 * successScoreData
 * PreSendComment
 * PrePurchaseItem
 * PreShowRankBoard
 * completeShowRankBoard
 * PreCloseRankBoard
 * completeCloseRankBoard
 */

// 遊戲類型(從網址取值)
var GameType = '';
// 遊戲ID / 競賽ID(從網址取值)
var GameID = '';
// 遊戲難度(從網址取值)
var GameDegree = '';
// 遊戲參數
var GameParameters = {};
// 每日免費次數
var GameFreeTimes = 0;
// 遊戲需花費點數
var GameCostPoint = 0;
// 會員剩餘免費次數
var MemberFreeTimes = 0;
// 會員持有點數
var MemberPoint = 0;
// 會員今日獎品數限制
var MemberTodayPrizesLimit = 0;
// 關卡今日獎品數限制
var GateTodayPrizes = 0;
// 會員獎品數限制
var MemberPrizesLimit = 0;
// 關卡獎品數限制
var GatePrizesLimit = 0;
// 會員免費獎品數限制
var MemberFreePrizesLimit = 0;
// 會員今日獲得獎品數
var MemberTodayWinPrizes = 0;
// 會員已獲得獎品數
var MemberPrizes = 0;
// 會員本次遊戲獲得獎品
var MemberWinFlag = false;
// 會員本次遊戲獲得名次
var MemberBoardPosition = 0;
// 會員目前最高分數
var HighestScore = 0;
// 玩家ID
var PlayerID = '';
// 玩家SN
var PlayerSN = '';
// 遊戲遊玩計時器
var GamePlayTimer = null;
// 遊戲暫停計時器
var GamePauseTimer = null;
// 遊玩分數
var PlayScore = 0;
// 遊玩秒數
var PlaySeconds = 0;
// 暫停秒數
var PauseSeconds = 0;
// 是否登入(true = 會員, false = 遊客)
var IsLogin = false;
// 過久沒有開始遊戲(30秒)(先不用)
var TimeOutFlag = false;
// Facebook分享圖片
var FacebookSharePicture = '';
// Facebook分享連結
var FacebookShareLink = 'https://dachuang.tw?openExternalBrowser=1';
// Facebook分享Hashtag
var FacebookShareHashtag = '#大創遊戲';
// Facebook分享Name
var FacebookShareName = '大創遊戲';
// Facebook分享標題
var FacebookShareCaption = '大創遊戲';
// Facebook分享描述
var FacebookShareDescription = '大創遊戲';
// Line分享文字
var LineShareText = '大創遊戲\n';
// Line分享連結
var LineShareLink = 'https://dachuang.tw?openExternalBrowser=1';
// ajax傳送錯誤計次
var AjaxErrorTimes = 0;
// 已抓取過排行資料
var ShowBoardFlag = false;
// 成功抓取到後台參數資料(startData)
var GetParamFlag = false;
// 分數傳送後回傳的過關賽目前獎品狀態(0=正常)
var StatusFlag = 0;
// 分數傳送後回傳的過關賽目前狀態說明
var StatusText = '';
// 過關分數
var GatePassScore = 0;
// ajax前置後置functions變數名稱
var PreEntranceData = { fn: '', context: '' };
var setEntranceData = { fn: '', context: '' };
var PreStartData = { fn: '', context: '' };
var successStartData = { fn: '', context: '' };
var noEnoughPoints = { fn: '', context: '' };
var PreSendScore = { fn: '', context: '' };
var successScoreData = { fn: '', context: '' };
var PreSendComment = { fn: '', context: '' };
var completeSendComment = { fn: '', context: '' };
var PrePurchaseItem = { fn: '', context: '' };
var completePurchaseItem = { fn: '', context: '' };
var PreShowRankBoard = { fn: '', context: '' };
var completeShowRankBoard = { fn: '', context: '' };
var PreCloseRankBoard = { fn: '', context: '' };
var completeCloseRankBoard = { fn: '', context: '' };
var PreShowDialog = { fn: '', context: '' };
var completeCloseDialog = { fn: '', context: '' };

// 取得網址資料
var UrlArray = new URL(location.href).pathname.split('/');

// 由網址取得變數值
GameType = (UrlArray[2] !== undefined) ? UrlArray[2] : 'normal';
GameID = (UrlArray[3] !== undefined) ? UrlArray[3] : 0;
GameDegree = (UrlArray[5] !== undefined) ? UrlArray[5] : 0;

// 進入遊戲(未開始遊玩)
$(function() {
    entranceData(false);
});

/**
 * 遊戲入口畫面 return 已登入(IsLogin=true)、每日免費次數、會員剩餘免費次數、會員持有點數、會員已獲得獎品數、(通關賽遊玩資格判斷)
 */
function entranceData(ASYNC_SETTING = true) {

    // 前置函式
    if (typeof PreEntranceData.fn === 'function') {
        PreEntranceData.fn.call(PreEntranceData.context);
    }
    $.ajax({
        headers: {
            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
        }, // 權限TOKEN
        url: '/game/' + GameType + '/' + GameID + '/entrance', // 網址
        type: 'POST', // 使用 POST 傳送
        async: ASYNC_SETTING, // 非同步設定(true/false)
        success: function(result) { // 傳送成功的 function
            if (result.flag == 'success') {
                // ---------- START【過關賽設置】----------
                // 會員今日獎品數限制
                MemberTodayPrizesLimit = (result.player_today_prizes_limit !== undefined) ? result.player_today_prizes_limit : 0;
                // 關卡今日獎品數限制
                GateTodayPrizes = (result.gate_today_prizes_limit !== undefined) ? result.gate_today_prizes_limit : 0;
                // 會員獎品數限制
                MemberPrizesLimit = (result.player_prizes_limit !== undefined) ? result.player_prizes_limit : 0;
                // 關卡獎品數限制
                GatePrizesLimit = (result.gate_prizes_limit !== undefined) ? result.gate_prizes_limit : 0;
                // 會員免費獎品數限制
                MemberFreePrizesLimit = (result.player_free_prizes_limit !== undefined) ? result.player_free_prizes_limit : 0;
                // 會員今日獲得獎品數
                MemberTodayWinPrizes = (result.player_today_wins !== undefined) ? result.player_today_wins : 0;
                // 會員已獲得獎品數
                MemberPrizes = (result.player_wins !== undefined) ? result.player_wins : 0;
                // 過關分數
                GatePassScore = (result.pass_score !== undefined) ? result.pass_score : 0;
                // ---------- END【過關賽設置】----------

                // 未登入=遊客
                IsLogin = result.loginflag;

                // 競賽設定免費次數
                GameFreeTimes = (result.free_of_times !== undefined) ? result.free_of_times : 0;
                // 遊戲扣點
                GameCostPoint = (result.use_points !== undefined) ? result.use_points : 0;
                // 會員剩餘免費次數
                MemberFreeTimes = (result.last_play_times !== undefined) ? result.last_play_times : 0;
                // 會員點數
                MemberPoint = result.player_points;

                // Facebook分享資料
                FacebookShareName = result.fb_share_name;
                FacebookShareLink = result.fb_share_link;
                FacebookSharePicture = result.fb_share_picture;
                FacebookShareCaption = result.fb_share_caption;
                FacebookShareDescription = result.fb_share_description;
                // Line分享資料
                LineShareText = result.line_share_text;
                LineShareLink = result.line_share_link;

                if (typeof setEntranceData.fn === 'function') {
                    setEntranceData.fn.call(setEntranceData.context);
                }
            }
            // 【過關賽】已達總獎品數 result.flag == 'gate_limit_1'
            // 【過關賽】已達會員總獲獎次數 result.flag == 'gate_limit_2'
            // 【過關賽】已達關卡每日獎品數限制 result.flag == 'gate_limit_3'
            // 【過關賽】已達會員每日獲獎次數 result.flag == 'gate_limit_4'
            // 【過關賽】已達會員免費獲獎次數 result.flag == 'gate_limit_5'
            else if (result.flag == 'gate_limit_1'){
                showStartModal('已達總獎品數', result.msg);
            }
            else if (result.flag == 'gate_limit_2'){
                showStartModal('已達會員總獲獎次數', result.msg);
            }
            else if (result.flag == 'gate_limit_3'){
                showStartModal('已達關卡每日獎品數限制', result.msg);
            }
            else if (result.flag == 'gate_limit_4'){
                showStartModal('已達會員每日獲獎次數', result.msg);
            }
            else if (result.flag == 'gate_limit_5'){
                showStartModal('已達會員免費獲獎次數', result.msg);
            }
            else {
                // 失敗畫面(跳回前一頁)
                showErrorModal(result.msg);
            }
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {
            showErrorModal('遊戲載入失敗');
        }
    });
}

/**
 * 確認遊玩 進入遊戲前判斷遊玩資格(扣點) return 玩家資料ID & SN 、 遊戲參數
 */
function startData(ASYNC_SETTING = true) {
    // 重置資料
    resetData();

    // 前置函式
    if (typeof PreStartData.fn === 'function') {
        PreStartData.fn.call(PreStartData.context);
    }

    $.ajax({
        headers: {
            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
        }, // 權限TOKEN
        url: '/game/' + GameType + '/' + GameID + '/start', // 網址
        data: {
            degree_id: GameDegree // 難度
        },
        type: 'POST', // 使用 POST 傳送
        async: ASYNC_SETTING, // 非同步設定(true/false)
        success: function(result) { // 傳送成功的 function
            if (result.flag == 'success') {
                PlayerID = result.player_id;
                PlayerSN = result.player_sn;
                // 重抓扣除遊玩次數點數後的資料
                MemberFreeTimes = result.last_play_times;
                MemberPoint = result.player_points;
                // 遊戲參數
                GameParameters = result.game_data;
                // 成功抓取遊戲參數
                GetParamFlag = true;

                // 遊戲參數轉為全域變數(動態變數)
                // for (var key in GameParameters) {
                //     window[key] = GameParameters[key];
                // }

                // 成功執行function
                if (typeof successStartData.fn === 'function') {
                    successStartData.fn.call(successStartData.context);
                }

                // 遊戲開始計時
                timingStart();
                return;
            }
            // 點數不足
            else if (result.flag == 'no_point') {
                if (typeof noEnoughPoints.fn === 'function') {
                    noEnoughPoints.fn.call(noEnoughPoints.context);
                } else {
                    // 失敗畫面(跳回前一頁)
                    showErrorModal(result.msg);
                }
                return;
            }
            // 【過關賽】已達總獎品數 result.flag == 'gate_limit_1'
            // 【過關賽】已達會員總獲獎次數 result.flag == 'gate_limit_2'
            // 【過關賽】已達關卡每日獎品數限制 result.flag == 'gate_limit_3'
            // 【過關賽】已達會員每日獲獎次數 result.flag == 'gate_limit_4'
            // 【過關賽】已達會員免費獲獎次數 result.flag == 'gate_limit_5'
            // else if (result.flag == 'gate_limit_1'){
            //     showStartModal('已達總獎品數', result.msg);
            // }
            // else if (result.flag == 'gate_limit_2'){
            //     showStartModal('已達會員總獲獎次數', result.msg);
            // }
            // else if (result.flag == 'gate_limit_3'){
            //     showStartModal('已達關卡每日獎品數限制', result.msg);
            // }
            // else if (result.flag == 'gate_limit_4'){
            //     showStartModal('已達會員每日獲獎次數', result.msg);
            // }
            // else if (result.flag == 'gate_limit_5'){
            //     showStartModal('已達會員免費獲獎次數', result.msg);
            // }
            else {
                // 失敗畫面(跳回前一頁)
                showErrorModal(result.msg);
            }
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {
            showErrorModal('遊戲資料載入失敗');
        }
    });
}

/**
 * (METHOD:POST)分數、秒數、參數、歷程 傳送到後端 return 名次
 */
function sendScore(SCORE, PLAYHISTORY = '', ASYNC_SETTING = true) {
    // 停止計時器
    timingStop();
    // 前置函式
    if (typeof PreSendScore.fn === 'function') {
        PreSendScore.fn.call(PreSendScore.context);
    }
    // 重置前端顯示分數
    PlayScore = 0;

    // 將變數資料存回json(動態變數)
    // for (var key in GameParameters) {
    //     GameParameters[key] = window[key];
    // }

    // 加上try cache紀錄前端錯誤碼
    try {
        $.ajax({
            headers: {
                'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
            }, // 權限TOKEN
            url: '/game/' + GameType + '/' + GameID + '/score', // 網址
            data: {
                score: SCORE, // 分數
                playtime: PlaySeconds, // 遊玩秒數
                pausetime: PauseSeconds, // 暫停秒數
                param: GameParameters, // 參數
                check: PLAYHISTORY // 歷程
            },
            type: 'POST', // 使用 POST 傳送
            cache: false,
            async: ASYNC_SETTING, // 非同步設定(true/false)
            timeout: 5000, // 5秒TimeOut
            success: function(result) { // 傳送成功的 function
                if (result.flag) {
                    // 本次遊戲得分(歷程計算後的分數)
                    PlayScore = result.score;
                    // 會員
                    if (IsLogin) {
                        // 會員歷史最高分(抓資料庫)
                        HighestScore = result.height_score;
                        // 會員本次名次
                        MemberBoardPosition = (result.board_position !== undefined) ? result.board_position : false;
                        // 會員本次是否獲獎
                        MemberWinFlag = (result.win_prize !== undefined) ? result.win_prize : false;
                        // 會員今日獲得獎品數
                        MemberTodayWinPrizes = (result.player_today_wins !== undefined) ? result.player_today_wins : 0;
                        // 會員已獲得獎品數
                        MemberPrizes = (result.player_wins !== undefined) ? result.player_wins : 0;
                        // 會員剩餘免費次數
                        MemberFreeTimes = (result.last_play_times !== undefined) ? result.last_play_times : 0;
                        // 獎品限制狀態
                        StatusFlag = (result.status_flag !== undefined) ? result.status_flag : 0;
                        // 獎品限制狀態說明(過關賽)
                        StatusText = (result.status_msg !== undefined) ? result.status_msg : '';
                    } else if (SCORE > HighestScore) {
                        // 遊客在js判斷得出最高分
                        HighestScore = SCORE;
                    }
                    if (typeof successScoreData.fn === 'function') {
                        successScoreData.fn.call(successScoreData.context);
                    }
                } else {
                    // 在Google Sheet上紀錄錯誤資料
                    $.get("https://script.google.com/macros/s/AKfycbwDTtXp7iiLkKJHuHufl1JqYPxtdNius5qaeNYzN2jgO3anENuZ/exec", {
                            gametype: GameType,
                            gameid: GameID,
                            sn: PlayerSN,
                            score: SCORE,
                            playtime: PlaySeconds,
                            check: PLAYHISTORY,
                            errormsg: 'sendScoreMethod return FALSE flag with message:' + result.msg
                        })
                        .done(function(response) {
                            showErrorModal(response);
                        });
                }
            },
            error: function(XMLHttpRequest, textStatus, errorThrown) {
                // 在Google Sheet上紀錄錯誤資料(不跳出訊息)
                $.get("https://script.google.com/macros/s/AKfycbwDTtXp7iiLkKJHuHufl1JqYPxtdNius5qaeNYzN2jgO3anENuZ/exec", {
                    gametype: GameType,
                    gameid: GameID,
                    sn: PlayerSN,
                    score: SCORE,
                    playtime: PlaySeconds,
                    check: PLAYHISTORY,
                    errormsg: textStatus + ': ' + errorThrown
                });
                if (textStatus === "timeout") {
                    // 改用Get傳遞
                    sendScoreByGetMethod(SCORE, PLAYHISTORY, textStatus);
                } else {
                    showMessageModal('分數傳送失敗');
                }
            }
        });
    } catch (e) {
        // 在Google Sheet上紀錄錯誤資料
        $.get("https://script.google.com/macros/s/AKfycbwDTtXp7iiLkKJHuHufl1JqYPxtdNius5qaeNYzN2jgO3anENuZ/exec", {
                gametype: GameType,
                gameid: GameID,
                sn: PlayerSN,
                score: SCORE,
                playtime: PlaySeconds,
                check: PLAYHISTORY,
                errormsg: e.message
            })
            .done(function(response) {
                showErrorModal(response);
            });
    };
}

/**
 * (METHOD:GET)分數、秒數、參數、歷程 傳送到後端 return 名次
 */
function sendScoreByGetMethod(SCORE, PLAYHISTORY, errorStatus) {
    $.ajax({
        url: '/game/' + GameType + '/' + GameID + '/resend/score', // 網址
        data: {
            score: SCORE, // 分數
            errorstatus: errorStatus, // 錯誤訊息
            playtime: PlaySeconds, // 遊玩秒數
            pausetime: PauseSeconds, // 暫停秒數
            param: GameParameters, // 參數
            check: PLAYHISTORY // 歷程
        },
        type: 'GET', // 使用 GET 傳送
        cache: false,
        timeout: 60000, // 60秒TimeOut
        success: function(result) { // 傳送成功的 function
            if (result.flag) {
                // 本次遊戲得分(歷程計算後的分數)
                PlayScore = result.score;
                // 會員
                if (IsLogin) {
                    // 會員歷史最高分(抓資料庫)
                    HighestScore = result.height_score;
                    // 會員本次名次
                    MemberBoardPosition = (result.board_position !== undefined) ? result.board_position : false;
                    // 會員本次是否獲獎
                    MemberWinFlag = (result.win_prize !== undefined) ? result.win_prize : false;
                    // 會員今日獲得獎品數
                    MemberTodayWinPrizes = (result.player_today_wins !== undefined) ? result.player_today_wins : 0;
                    // 會員已獲得獎品數
                    MemberPrizes = (result.player_wins !== undefined) ? result.player_wins : 0;
                    // 會員剩餘免費次數
                    MemberFreeTimes = (result.last_play_times !== undefined) ? result.last_play_times : 0;
                    // 獎品限制狀態
                    StatusFlag = (result.status_flag !== undefined) ? result.status_flag : 0;
                    // 獎品限制狀態說明
                    StatusText = (result.status_msg !== undefined) ? result.status_msg : '';
                } else if (SCORE > HighestScore) {
                    // 遊客在js判斷得出最高分
                    HighestScore = SCORE;
                }
                if (typeof successScoreData.fn === 'function') {
                    successScoreData.fn.call(successScoreData.context);
                }
            } else {
                // 在Google Sheet上紀錄錯誤資料
                $.get("https://script.google.com/macros/s/AKfycbwDTtXp7iiLkKJHuHufl1JqYPxtdNius5qaeNYzN2jgO3anENuZ/exec", {
                        gametype: GameType,
                        gameid: GameID,
                        sn: PlayerSN,
                        score: SCORE,
                        playtime: PlaySeconds,
                        check: PLAYHISTORY,
                        errormsg: 'sendScoreByGetMethod return FALSE flag with message:' + result.msg
                    })
                    .done(function(response) {
                        showErrorModal(response);
                    });
            }
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {
            // 在Google Sheet上紀錄錯誤資料
            $.get("https://script.google.com/macros/s/AKfycbwDTtXp7iiLkKJHuHufl1JqYPxtdNius5qaeNYzN2jgO3anENuZ/exec", {
                    gametype: GameType,
                    gameid: GameID,
                    sn: PlayerSN,
                    score: SCORE,
                    playtime: PlaySeconds,
                    check: PLAYHISTORY,
                    errormsg: 'sendScoreByGetMethod ajax ERROR: ' + textStatus + ': ' + errorThrown
                })
                .done(function(response) {
                    showErrorModal(response);
                });
        }
    });
}


/**
 * 留言傳送到後端 return 成功 or 失敗
 */
function sendComment(COMMENT, ASYNC_SETTING = true) {
    // 如果沒有留言就不執行後續程式
    if (COMMENT == null && COMMENT == '') {
        showMessageModal('未填寫留言將使用系統預設文字');
        // 完成留言後呼叫
        if (typeof completeSendComment.fn === 'function') {
            completeSendComment.fn.call(completeSendComment.context);
        }
        return false;
    }

    // 前置函式
    if (typeof PreSendComment.fn === 'function') {
        PreSendComment.fn.call(PreSendComment.context);
    }

    $.ajax({
        headers: {
            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
        }, // 權限TOKEN
        url: '/game/' + GameType + '/' + GameID + '/comment', // 網址
        data: {
            comment: COMMENT // 上榜留言
        },
        type: 'POST', // 使用 POST 傳送
        async: ASYNC_SETTING, // 非同步設定(true/false)
        success: function(result) { // 傳送成功的 function
            if (result.flag) {
                // 成功畫面
                showMessageModal(result.msg);
            } else {
                // 失敗畫面
                showMessageModal(result.msg);
            }
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {
            showMessageModal('送出留言失敗');
        },
        complete: function(result) { // 無論成功或失敗都呼叫的 function
            // 完成留言後呼叫
            if (typeof completeSendComment.fn === 'function') {
                completeSendComment.fn.call(completeSendComment.context);
            }
        }
    });
}

/**
 * 道具購買 return 成功 or 失敗
 */
function purchaseItem(ITEM, ASYNC_SETTING = true) {

    // 前置函式
    if (typeof PrePurchaseItem.fn === 'function') {
        PrePurchaseItem.fn.call(PrePurchaseItem.context);
    }

    $.ajax({
        headers: {
            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
        }, // 權限TOKEN
        url: '/game/' + GameType + '/' + GameID + '/purchase', // 網址
        type: 'POST', // 使用 POST 傳送
        async: ASYNC_SETTING, // 非同步設定(true/false)
        success: function(result) { // 傳送成功的 function
            if (result.flag) {
                // 成功畫面
                showMessageModal(result.msg);
            } else {
                // 失敗畫面
                showMessageModal(result.msg);
            }
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {
            showMessageModal('道具購買失敗');
        },
        complete: function(result) { // 無論成功或失敗都呼叫的 function
            // 完成購買後呼叫
            if (typeof completePurchaseItem.fn === 'function') {
                completePurchaseItem.fn.call(completePurchaseItem.context);
            }
        }
    });
}

/**
 * 計時開始 呼叫時機：進入遊戲後第一次點擊
 */
function timingStart() {
    // 重置(避免之前的沒關掉，會變成有兩個時鐘在計時)
    clearInterval(GamePlayTimer);
    clearInterval(GamePauseTimer);
    PlaySeconds = 0;
    PauseSeconds = 0;
    // 計時(遊玩秒數++)
    GamePlayTimer = window.setInterval(timeCheck, 1000);
}

/**
 * 計時結束 呼叫時機：Game Over
 */
function timingStop() {
    clearInterval(GamePlayTimer);
    clearInterval(GamePauseTimer);
}

/**
 * 計時暫停 呼叫時機：暫停
 */
function timingPause() {
    // 重置(避免之前的沒關掉，會變成有兩個時鐘在計時)
    clearInterval(GamePlayTimer);
    clearInterval(GamePauseTimer);
    // 計時(暫停秒數++)
    GamePauseTimer = window.setInterval(function() {
        PauseSeconds++;
    }, 1000);
}

/**
 * 計時恢復 呼叫時機：結束暫停，繼續遊戲
 */
function timingResume() {
    // 重置(避免之前的沒關掉，會變成有兩個時鐘在計時)
    clearInterval(GamePlayTimer);
    clearInterval(GamePauseTimer);
    // 計時(遊玩秒數++)
    GamePlayTimer = window.setInterval(function() {
        PlaySeconds++;
    }, 1000);
}

/**
 * 計時 + 逾時判斷
 */
function timeCheck() {
    // 進入遊戲30秒未開始遊戲->連線逾時
    if (TimeOutFlag && PlaySeconds > 30) {
        showReloadModal('連線逾時');
    }
    PlaySeconds++;
}

/**
 * 顯示 排行榜彈出窗
 */
function showBoardDialog() {

    // 開啟排行榜前置函式
    if (typeof PreShowRankBoard.fn === 'function') {
        PreShowRankBoard.fn.call(PreShowRankBoard.context);
    }

    // 未抓取過排行資料
    if (!ShowBoardFlag) {
        // $.get('/game/board/' + GameID, function(data) {
        $.get('/game/' + GameType + '/' + GameID + '/board', function(data) {
            ShowBoardFlag = true;

            // 彈出窗出現前的執行動作(關閉按鈕功能)
            if (typeof PreShowDialog.fn === 'function') {
                PreShowDialog.fn.call(PreShowDialog.context);
            }
            // 插入訊息彈出窗
            $('#dialog').html(data);
            $('#dialogBg').fadeIn(300);
            $('#dialog').removeAttr('class').addClass('animated bounceIn').fadeIn();
            $('html').css('overflow-x', 'hidden');
            $('html').css('overflow-y', 'hidden');

            // 開啟排行榜後呼叫
            if (typeof completeShowRankBoard.fn === 'function') {
                completeShowRankBoard.fn.call(completeShowRankBoard.context);
            }
        });
    } else {
        // 彈出窗出現前的執行動作(關閉按鈕功能)
        if (typeof PreShowDialog.fn === 'function') {
            PreShowDialog.fn.call(PreShowDialog.context);
        }
        $('#dialogBg').fadeIn(300);
        $('#dialog').removeAttr('class').addClass('animated bounceIn').fadeIn();
        $('html').css('overflow-x', 'hidden');
        $('html').css('overflow-y', 'hidden');

        // 開啟排行榜後呼叫
        if (typeof completeShowRankBoard.fn === 'function') {
            completeShowRankBoard.fn.call(completeShowRankBoard.context);
        }
    }
}

/**
 * 隱藏 排行榜彈出窗
 */
$(function() {
    // 關閉排行榜
    $('body').on('click', '.closeRankBoardBtn', function() {

        let ClickSound = document.getElementById('ClickSound');
        if (ClickSound) {
            // 按鈕發出聲音
            ClickSound.play();
        }

        // 關閉排行榜前置函式
        if (typeof PreCloseRankBoard.fn === 'function') {
            PreCloseRankBoard.fn.call(PreCloseRankBoard.context);
        }

        $('#dialogBg').fadeOut(300, function() {
            $('#dialog').removeAttr('class').addClass('animated bounceOutUp').fadeOut();
            $('html').css('overflow-y', 'scroll');

            // 關閉排行榜後呼叫
            if (typeof completeCloseRankBoard.fn === 'function') {
                completeCloseRankBoard.fn.call(completeCloseRankBoard.context);
            }
            // 彈出窗關閉後的執行動作(開啟按鈕功能)
            if (typeof completeCloseDialog.fn === 'function') {
                completeCloseDialog.fn.call(completeCloseDialog.context);
            }
        });
    });

    // 送出留言&關閉
    $('body').on('click', '.closeCommentBoardBtn', function() {

        sendComment($('#comment_text').val());

        // 不用關閉dailog因為sendComment()的ajax結束後會執行showMessageModal直接取代dailog內容
    });

    // 關閉彈出窗
    $('body').on('click', '.closeDialogTempleteBtn', function() {

        $('#dialogBg').fadeOut(300, function() {
            $('#dialog').removeAttr('class').addClass('animated bounceOutUp').fadeOut();
            $('html').css('overflow-y', 'scroll');
            // 彈出窗關閉後的執行動作(開啟按鈕功能)
            if (typeof completeCloseDialog.fn === 'function') {
                completeCloseDialog.fn.call(completeCloseDialog.context);
            }
        });
        // 彈出窗關閉後的後續動作
        let nextStep = $(this).data('next');

        if (nextStep == 'back') {
            // 回上頁
            window.history.back();
        } else if (nextStep == 'reload') {
            // 重新整理
            window.location.reload();
        }
    });
});

/**
 * Facebook API
 */
window.fbAsyncInit = function() {
    FB.init({
        appId: '2167431543580390',
        xfbml: true,
        version: 'v5.0'
    });
    FB.AppEvents.logPageView();
};

(function(d, s, id) {
    var js, fjs = d.getElementsByTagName(s)[0];
    if (d.getElementById(id)) { return; }
    js = d.createElement(s);
    js.id = id;
    js.src = "https://connect.facebook.net/en_US/sdk.js";
    fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'facebook-jssdk'));

/**
 * 分享到Facebook 加免費次數 return 會員剩餘免費次數
 */
function shareViaFacebook() {

    FB.ui({
            method: 'share',
            href: FacebookShareLink,
            hashtag: FacebookShareHashtag
        },
        function(response) {
            if (response && !response.error_message) {
                // FB分享成功 
                $.ajax({
                    headers: {
                        'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
                    }, // 權限TOKEN
                    url: '/game/' + GameType + '/' + GameID + '/sharedviafb', // 網址
                    type: 'POST', // 使用 POST 傳送
                    async: false, // 非同步設定(true/false)
                    success: function(result) { // 傳送成功的 function
                        if (result.flag) {
                            // 重抓免費次數
                            MemberFreeTimes = result.last_play_times;
                            // 成功&重整頁面
                            showReloadModal(result.msg);
                        } else {
                            // 失敗畫面
                            showMessageModal(result.msg);
                        }
                    },
                    error: function(XMLHttpRequest, textStatus, errorThrown) {
                        // ajax失敗 / 後端程式出錯
                        showMessageModal('操作發生了錯誤，請稍後再試');
                    }
                });
            } else {
                showMessageModal('分享失敗');
            }
        }
    );
}

/**
 * 分享到Line 加免費次數 return 會員剩餘免費次數
 */
function shareViaLine() {
    // 換行字元替換
    LineShareText = LineShareText ? LineShareText.replace(/\\n/g, "\n") : '';
    LineShareLink = LineShareLink ? LineShareLink.replace(/\\n/g, "\n") : '';

    let link = 'http://line.naver.jp/R/msg/text/?' + encodeURIComponent(LineShareText) + '%0A' + encodeURIComponent(LineShareLink);

    // 先紀錄分享，再開分享窗，避免網頁跳開後js停止運作
    $.ajax({
        headers: {
            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
        }, // 權限TOKEN
        url: '/game/' + GameType + '/' + GameID + '/sharedvialine', // 網址
        type: 'POST', // 使用 POST 傳送
        async: false, // 非同步設定(true/false)
        success: function(result) { // 傳送成功的 function
            if (result.flag) {
                // 重抓免費次數
                MemberFreeTimes = result.last_play_times;
                // 另開Line分享窗
                window.open(link, '_blank');
                // 0.5秒後再顯示結果
                setTimeout(function() {
                    // 成功&重整頁面
                    showReloadModal(result.msg);
                }, 500);
            } else {
                showMessageModal(result.msg);
            }
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {
            // ajax失敗 / 後端程式出錯
            showMessageModal('操作發生了錯誤，請稍後再試');
        }
    });
}

/**
 * 重置資料
 */
function resetData() {
    // 停止計時器
    timingStop();
    // 重置玩家ID
    PlayerID = '';
    // 重置玩家SN
    PlayerSN = '';
    // 重置遊戲分數
    PlayScore = 0;
    // 重置遊玩秒數
    PlaySeconds = 0;
    // 重置暫停秒數
    PauseSeconds = 0;
    // 重置排行榜抓取flag
    ShowBoardFlag = false;
    // 重置遊戲參數抓取成功flag
    GetParamFlag = false;
    // 重置遊戲過關flag
    MemberWinFlag = false;
}

/**
 * 跳出上榜留言框(繼續遊玩)
 */
function showBoardMessageModal() {
    // 前三名玩家上榜留言(分數大於0)
    if (IsLogin && PlayScore > 0 && MemberBoardPosition && MemberBoardPosition <= 3) {
        // 插入上榜留言彈出窗
        let str = '<div class="commentBox"><h4>🎉恭喜獲得榜單第' + MemberBoardPosition + '名</h4><hr> 請輸入上榜留言(最多10字)：<br><input type="text" id="comment_text" maxlength="10"><hr><button class="closeCommentBoardBtn">送出留言</button></div>';

        // 彈出窗出現前的執行動作(關閉按鈕功能)
        if (typeof PreShowDialog.fn === 'function') {
            PreShowDialog.fn.call(PreShowDialog.context);
        }
        // 插入訊息彈出窗
        $('#dialog').html(str);
        $('#dialogBg').fadeIn(300);
        $('#dialog').removeAttr('class').addClass('animated bounceIn').fadeIn();
        $('html').css('overflow-x', 'hidden');
        $('html').css('overflow-y', 'hidden');
    }
}

/**
 * 跳出訊息框(繼續遊玩)
 */
function showMessageModal(MESSAGE) {
    dialogTemplete('提示', MESSAGE, '關閉後遊戲將繼續執行');
}

/**
 * 跳出訊息框(回上頁)
 */
function showErrorModal(MESSAGE) {
    dialogTemplete('錯誤', MESSAGE, '關閉頁面將跳轉回上頁', 'back');
}

/**
 * 跳出訊息框(重新整理)
 */
function showReloadModal(MESSAGE) {
    dialogTemplete('', MESSAGE, '關閉後頁面將重新整理', 'reload');
}


/**
 * 跳出訊息框(回上頁)
 */
 function showStartModal(TITLE, MESSAGE) {
    dialogTemplete(TITLE, MESSAGE, '關閉後遊戲將繼續執行');
}

/**
 * Dialog彈出窗模板
 */
function dialogTemplete(TITLE, MESSAGE, NOTES, NEXTSTEP = '') {

    // 訊息拼接
    let str = '<div class="dialogTempleteBox">';

    if (TITLE) {
        str += '<h4>' + TITLE + '</h4><hr>';
    }
    str += MESSAGE;
    if (NEXTSTEP == 'back' && (PlayerID || PlayerSN || PlayScore)) {
        str += '<div class="playerinfo">玩家資料：<span>ID(' + PlayerID + ')</span> | <span>SN(' + PlayerSN + ')</span> | <sapn>SCORE(' + PlayScore + ')</sapn></div>';
    }
    str += '<hr><h6>' + NOTES + '</h6><button class="closeDialogTempleteBtn" data-next="' + NEXTSTEP + '">關閉</button></div>';

    // 彈出窗出現前的執行動作(關閉按鈕功能)
    if (typeof PreShowDialog.fn === 'function') {
        PreShowDialog.fn.call(PreShowDialog.context);
    }
    // 插入訊息彈出窗
    $('#dialog').html(str);
    $('#dialogBg').fadeIn(300);
    $('#dialog').removeAttr('class').addClass('animated bounceIn').fadeIn();
    $('html').css('overflow-x', 'hidden');
    $('html').css('overflow-y', 'hidden');
}

/**
 *  ajax前置後置functions變數內容指定
 **/
function SetPreEntranceData(assignFunction, context = this) {
    Object.defineProperty(PreEntranceData, 'fn', {
        value: assignFunction,
        writable: true,
        enumerable: true,
        configurable: true,
    });
    Object.defineProperty(PreEntranceData, 'context', {
        value: context,
        writable: true,
        enumerable: true,
        configurable: true,
    });

}

function SetEntranceData(assignFunction, context = this) {
    Object.defineProperty(PreEntranceData, 'fn', {
        value: assignFunction,
        writable: true,
        enumerable: true,
        configurable: true,
    });
    Object.defineProperty(PreEntranceData, 'context', {
        value: context,
        writable: true,
        enumerable: true,
        configurable: true,
    });
}

function SetPreStartData(assignFunction, context = this) {
    Object.defineProperty(PreStartData, 'fn', {
        value: assignFunction,
        writable: true,
        enumerable: true,
        configurable: true,
    });
    Object.defineProperty(PreStartData, 'context', {
        value: context,
        writable: true,
        enumerable: true,
        configurable: true,
    });
}

function SetSuccessStartData(assignFunction, context = this) {
    Object.defineProperty(successStartData, 'fn', {
        value: assignFunction,
        writable: true,
        enumerable: true,
        configurable: true,
    });
    Object.defineProperty(successStartData, 'context', {
        value: context,
        writable: true,
        enumerable: true,
        configurable: true,
    });
}

function SetNoEnoughPoints(assignFunction, context = this) {
    Object.defineProperty(noEnoughPoints, 'fn', {
        value: assignFunction,
        writable: true,
        enumerable: true,
        configurable: true,
    });
    Object.defineProperty(noEnoughPoints, 'context', {
        value: context,
        writable: true,
        enumerable: true,
        configurable: true,
    });
}

function SetPreSendScore(assignFunction, context = this) {
    Object.defineProperty(PreSendScore, 'fn', {
        value: assignFunction,
        writable: true,
        enumerable: true,
        configurable: true,
    });
    Object.defineProperty(PreSendScore, 'context', {
        value: context,
        writable: true,
        enumerable: true,
        configurable: true,
    });
}

function SetSuccessScoreData(assignFunction, context = this) {
    Object.defineProperty(successScoreData, 'fn', {
        value: assignFunction,
        writable: true,
        enumerable: true,
        configurable: true,
    });
    Object.defineProperty(successScoreData, 'context', {
        value: context,
        writable: true,
        enumerable: true,
        configurable: true,
    });
}

function SetPreSendComment(assignFunction, context = this) {
    Object.defineProperty(PreSendComment, 'fn', {
        value: assignFunction,
        writable: true,
        enumerable: true,
        configurable: true,
    });
    Object.defineProperty(PreSendComment, 'context', {
        value: context,
        writable: true,
        enumerable: true,
        configurable: true,
    });
}

function SetCompleteSendComment(assignFunction, context = this) {
    Object.defineProperty(completeSendComment, 'fn', {
        value: assignFunction,
        writable: true,
        enumerable: true,
        configurable: true,
    });
    Object.defineProperty(completeSendComment, 'context', {
        value: context,
        writable: true,
        enumerable: true,
        configurable: true,
    });
}

function SetPrePurchaseItem(assignFunction, context = this) {
    Object.defineProperty(PrePurchaseItem, 'fn', {
        value: assignFunction,
        writable: true,
        enumerable: true,
        configurable: true,
    });
    Object.defineProperty(PrePurchaseItem, 'context', {
        value: context,
        writable: true,
        enumerable: true,
        configurable: true,
    });
}

function SetCompletePurchaseItem(assignFunction, context = this) {
    Object.defineProperty(completePurchaseItem, 'fn', {
        value: assignFunction,
        writable: true,
        enumerable: true,
        configurable: true,
    });
    Object.defineProperty(completePurchaseItem, 'context', {
        value: context,
        writable: true,
        enumerable: true,
        configurable: true,
    });
}

function SetPreShowRankBoard(assignFunction, context = this) {
    Object.defineProperty(PreShowRankBoard, 'fn', {
        value: assignFunction,
        writable: true,
        enumerable: true,
        configurable: true,
    });
    Object.defineProperty(PreShowRankBoard, 'context', {
        value: context,
        writable: true,
        enumerable: true,
        configurable: true,
    });
}

function SetCompleteShowRankBoard(assignFunction, context = this) {
    Object.defineProperty(completeShowRankBoard, 'fn', {
        value: assignFunction,
        writable: true,
        enumerable: true,
        configurable: true,
    });
    Object.defineProperty(completeShowRankBoard, 'context', {
        value: context,
        writable: true,
        enumerable: true,
        configurable: true,
    });
}

function SetPreCloseRankBoard(assignFunction, context = this) {
    Object.defineProperty(PreCloseRankBoard, 'fn', {
        value: assignFunction,
        writable: true,
        enumerable: true,
        configurable: true,
    });
    Object.defineProperty(PreCloseRankBoard, 'context', {
        value: context,
        writable: true,
        enumerable: true,
        configurable: true,
    });
}

function SetCompleteCloseRankBoard(assignFunction, context = this) {
    Object.defineProperty(completeCloseRankBoard, 'fn', {
        value: assignFunction,
        writable: true,
        enumerable: true,
        configurable: true,
    });
    Object.defineProperty(completeCloseRankBoard, 'context', {
        value: context,
        writable: true,
        enumerable: true,
        configurable: true,
    });
}

function SetPreShowDialog(assignFunction, context = this) {
    Object.defineProperty(PreShowDialog, 'fn', {
        value: assignFunction,
        writable: true,
        enumerable: true,
        configurable: true,
    });
    Object.defineProperty(PreShowDialog, 'context', {
        value: context,
        writable: true,
        enumerable: true,
        configurable: true,
    });
}

function SetCompleteCloseDialog(assignFunction, context = this) {
    Object.defineProperty(completeCloseDialog, 'fn', {
        value: assignFunction,
        writable: true,
        enumerable: true,
        configurable: true,
    });
    Object.defineProperty(completeCloseDialog, 'context', {
        value: context,
        writable: true,
        enumerable: true,
        configurable: true,
    });
}

export {
    // 變數
    GameType,
    GameID,
    GameDegree,
    GameParameters,
    GameFreeTimes,
    GameCostPoint,
    MemberFreeTimes,
    MemberPoint,
    MemberTodayPrizesLimit,
    GateTodayPrizes,
    MemberPrizesLimit,
    GatePrizesLimit,
    MemberFreePrizesLimit,
    MemberTodayWinPrizes,
    MemberPrizes,
    MemberWinFlag,
    MemberBoardPosition,
    HighestScore,
    PlayerID,
    PlayerSN,
    GamePlayTimer,
    GamePauseTimer,
    PlayScore,
    PlaySeconds,
    PauseSeconds,
    IsLogin,
    TimeOutFlag,
    FacebookSharePicture,
    FacebookShareLink,
    FacebookShareHashtag,
    FacebookShareName,
    FacebookShareCaption,
    FacebookShareDescription,
    LineShareText,
    LineShareLink,
    AjaxErrorTimes,
    ShowBoardFlag,
    GetParamFlag,
    StatusFlag,
    StatusText,
    GatePassScore,
    // ajax前置後置functions變數內容指定
    SetPreEntranceData,
    SetEntranceData,
    SetPreStartData,
    SetSuccessStartData,
    SetNoEnoughPoints,
    SetPreSendScore,
    SetSuccessScoreData,
    SetPreSendComment,
    SetCompleteSendComment,
    SetPrePurchaseItem,
    SetCompletePurchaseItem,
    SetPreShowRankBoard,
    SetCompleteShowRankBoard,
    SetPreCloseRankBoard,
    SetCompleteCloseRankBoard,
    SetPreShowDialog,
    SetCompleteCloseDialog,
    // 基礎流程functions
    entranceData,
    startData,
    sendScore,
    sendComment,
    purchaseItem,
    timingStart,
    timingStop,
    timingPause,
    timingResume,
    timeCheck,
    showBoardDialog,
    shareViaFacebook,
    shareViaLine,
    resetData,
    showMessageModal,
    showErrorModal,
    showStartModal,
    showReloadModal,
    dialogTemplete,
    showBoardMessageModal
}