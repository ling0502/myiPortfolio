/**
 * 農場設定
 */
// 等級資料
var LevelData = [];
// 作物資料
var PlantData = [];
// 作物pic_index資料
var PlantPicIndexData = [];
// 作物id資料
var PlantIdData = [];
// 道具資料
var PropData = [];
// 道具pic_index資料
var PropPicIndexData = [];
// 道具id資料
var PropIdData = [];
// 小夥伴分類
var PartnerCategoryData = [];
// 小夥伴資料
var PartnerData = [];
// 小夥伴id=>pic_index資料
var PartnerPicIndexData = [];
// 小夥伴pic_index=>id資料
var PartnerIdData = [];
// 土地資料
var LandData = [];
// 倉庫資料
var WarehouseData = [];
// 成就分類
var AchieveCategoryData = [];
// 所有成就資料
var AchieveData = [];
// 玩家目前成就資料
var FarmerAchieveData = [];
// 所有限時獎勵資料
var GiftData = [];
// 限時獎勵資料圖片 GiftPics[gift_id] = src
var GiftPics = {};
// O2 POINT兌換比例資料
var O2ExchangeData = [];
/**
 * 會員資料
 */
// 會員ACCOUNT
var ACCOUNT_ID = '';
// 登入SN
var ACCOUNT_SN = '';
// 會員名稱(最多七字)
var ACCOUNT_NAME = '';
// 會員圖片75px*75px
var ACCOUNT_PIC = '';
// 會員O2 POINT
var MemberPoint = 0;
// 會員貓鑽
var MemberCatCoin = 0;
// 農場主人資料
var FarmerData = [];
// 會員擁有土地
var FarmerLands = [];
// 會員擁有倉庫
var FarmerWarehouse = [];
// 會員擁有小夥伴
var FarmerPartner = [];
// 會員點擊小夥伴後獲得的小夥伴資料
var UpdateFarmerPartner = [];
// 會員種子庫存
var SeedStock = [];
// 會員道具庫存(倉庫)
var PropStock = [];
// 會員作物庫存(倉庫)
var PlantStock = [];
// 會員簽到資料
var SigninData = [];
// 會員每日任務資料
var DailyMissionData = [];
// 下一個等級資料
var NextLevelData = [];
// 每日任務積分寶箱資料
var ScoreBoxData = [];
// 新玩家獎勵
var NewFarmerPrize = [];
// 收成升等獎勵
var LevelUpPrize = [];
// 簽到獎勵
var SignInPrize = [];
// 積分獎勵
var ScoreBoxPrize = [];
// 每日任務獎勵
var DailyMissionPrize = [];
// 成就獎勵
var AchievePrize = [];
// 收成後回傳目前的Level
var NewLevel = 0;
// 種植完回傳下一階段秒數
var NextSec = 0;
// 種植完回傳目前階段
var NowStage = 0;
// 收成回傳資料
var HarvestResult = [];
// 使用道具回傳資料
var UsePropResult = [];
// 加速種植回傳秒數
var SpeedUpSec = 0;
// 加速種植回傳資料
var SpeedUpResult = [];
// 播種回傳資料
var doPlantSeedResult = [];
// 解鎖小夥伴回傳資料
var UnlockPartnerResult = [];
// 兌換限時獎勵回傳資料
var ExchangeGiftResult = [];
// 新手禮包獎勵
var NewbiePrize = [];
// 最大簽到天數
var MaxSignin = 0;
/**
 * 其他資料
 */
// 遊戲遊玩計時器
var GamePlayTimer = null;
// 遊戲暫停計時器
var GameIdleTimer = null;
// 遊玩秒數(總計)
var TotalPlaySeconds = 0;
// 遊玩秒數
var PlaySeconds = 0;
// 閒置秒數
var IdleSeconds = 0;
// 閒置過久FLAG(閒置秒數 > 60秒)
var TimeOutFlag = false;
// Facebook分享連結
var FacebookShareLink = 'https://dachuang.tw?openExternalBrowser=1';
// Facebook分享Hashtag
var FacebookShareHashtag = '#大創遊戲貓農趣';
// Line分享文字
var LineShareText = '大創遊戲貓農趣\n';
// Line分享連結
var LineShareLink = 'https://dachuang.tw?openExternalBrowser=1';
// 已抓取過排行資料
var ShowBoardFlag = false;
// 由網址取得Game_ID
var UrlArray = new URL(location.href).pathname.split('/');
var Game_ID = (UrlArray[3] !== undefined) ? UrlArray[3] : 0;

// ajax前置後置functions變數名稱
var preEntranceData = { fn: '', context: '' };
var successEntranceData = { fn: '', context: '' };
var preSnData = { fn: '', context: '' };
var successSnData = { fn: '', context: '' };
var preRefreshDailyData = { fn: '', context: '' };
var successRefreshDailyData = { fn: '', context: '' };
var preGetLevelData = { fn: '', context: '' };
var successGetLevelData = { fn: '', context: '' };
var preGetPlantData = { fn: '', context: '' };
var successGetPlantData = { fn: '', context: '' };
var preBuySeed = { fn: '', context: '' };
var successBuySeed = { fn: '', context: '' };
var preDoPlantSeed = { fn: '', context: '' };
var successDoPlantSeed = { fn: '', context: '' };
var preDoHarvest = { fn: '', context: '' };
var successDoHarvest = { fn: '', context: '' };
var preSellPlant = { fn: '', context: '' };
var successSellPlant = { fn: '', context: '' };
var preSellProp = { fn: '', context: '' };
var successSellProp = { fn: '', context: '' };
var preGetPropData = { fn: '', context: '' };
var successGetPropData = { fn: '', context: '' };
var preBuyProp = { fn: '', context: '' };
var successBuyProp = { fn: '', context: '' };
var preUseProp = { fn: '', context: '' };
var successUseProp = { fn: '', context: '' };
var preGetLandData = { fn: '', context: '' };
var successGetLandData = { fn: '', context: '' };
var preBuyLand = { fn: '', context: '' };
var successBuyLand = { fn: '', context: '' };
var preGetWarehouseData = { fn: '', context: '' };
var successGetWarehouseData = { fn: '', context: '' };
var preBuyWarehouse = { fn: '', context: '' };
var successBuyWarehouse = { fn: '', context: '' };
var preGetAchieveData = { fn: '', context: '' };
var successGetAchieveData = { fn: '', context: '' };
var preReachAchieve = { fn: '', context: '' };
var successReachAchieve = { fn: '', context: '' };
var preGetMemberWallet = { fn: '', context: '' };
var successGetMemberWallet = { fn: '', context: '' };
var preGetSeedStock = { fn: '', context: '' };
var successGetSeedStock = { fn: '', context: '' };
var preGetPlantStock = { fn: '', context: '' };
var successGetPlantStock = { fn: '', context: '' };
var preGetPropStock = { fn: '', context: '' };
var successGetPropStock = { fn: '', context: '' };
var preGetPartnerData = { fn: '', context: '' };
var successGetPartnerData = { fn: '', context: '' };
var preClickPartner = { fn: '', context: '' };
var successClickPartner = { fn: '', context: '' };
var preRecyclePartner = { fn: '', context: '' };
var successRecyclePartner = { fn: '', context: '' };
var preUnlockPartner = { fn: '', context: '' };
var successUnlockPartner = { fn: '', context: '' };
var preGetSignInData = { fn: '', context: '' };
var successGetSignInData = { fn: '', context: '' };
var preReachSignIn = { fn: '', context: '' };
var successReachSignIn = { fn: '', context: '' };
var preGetDailyMissionData = { fn: '', context: '' };
var successGetDailyMissionData = { fn: '', context: '' };
var preReachDailyMission = { fn: '', context: '' };
var successReachDailyMission = { fn: '', context: '' };
var preGetScoreBoxData = { fn: '', context: '' };
var successGetScoreBoxData = { fn: '', context: '' };
var preReachScoreBox = { fn: '', context: '' };
var successReachScoreBox = { fn: '', context: '' };
var preGetNextLevelData = { fn: '', context: '' };
var successGetNextLevelData = { fn: '', context: '' };
var preGetGiftData = { fn: '', context: '' };
var successGetGiftData = { fn: '', context: '' };
var successSetGiftPicture = { fn: '', context: '' };
var preExchangeGift = { fn: '', context: '' };
var successExchangeGift = { fn: '', context: '' };
var failureExchangeGift = { fn: '', context: '' };
var preGetO2ExchangeData = { fn: '', context: '' };
var successGetO2ExchangeData = { fn: '', context: '' };
var preBuyCatCoin = { fn: '', context: '' };
var successBuyCatCoin = { fn: '', context: '' };
var preDoSpeedUp = { fn: '', context: '' };
var successDoSpeedUp = { fn: '', context: '' };
var preReachNewbiePrize = { fn: '', context: '' };
var successReachNewbiePrize = { fn: '', context: '' };

// 未登入/SN逾期失效functions變數名稱
var errorTimeOut = { fn: '', context: '' };
// 玩家大頭圖載入完成
var successSetAccountPicture = { fn: '', context: '' };
// 提示彈窗開啟&關閉
var preShowDialog = { fn: '', context: '' };
var completeCloseDialog = { fn: '', context: '' };

/**
 * 農場基本設定資料
 */
function entranceData(ASYNC_SETTING = true) {
    // 前置函式
    if (typeof preEntranceData.fn === 'function') {
        preEntranceData.fn.call(preEntranceData.context);
    }
    let AJAX_URL = '/game/farm/' + Game_ID + '/entrance';
    let AJAX_METHOD = 'GET';
    $.ajax({
        url: AJAX_URL, // 網址
        type: AJAX_METHOD, // 使用 GET 傳送
        async: ASYNC_SETTING, // 非同步設定(true/false)
        success: function(result) { // 傳送成功的 function
            console.log('--entranceData start--');
            console.log(result);
            console.log('--entranceData end--');
            if (result.flag == 'success') {
                // Facebook分享資料
                FacebookShareLink = result.fb_share_link;
                // Line分享資料
                LineShareText = result.line_share_text;
                LineShareLink = result.line_share_link;
                if (typeof successEntranceData.fn === 'function') {
                    successEntranceData.fn.call(successEntranceData.context);
                }
            } else if (result.flag == 'timeout') {
                timeOutEvent(showErrorModal, '', AJAX_URL, AJAX_METHOD);
            } else {
                // 失敗畫面(跳回首頁)
                recordGoogleSheet(showErrorModal, result.msg, AJAX_URL, AJAX_METHOD);
            }
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {
            recordGoogleSheet(showErrorModal, '遊戲載入失敗', AJAX_URL, AJAX_METHOD, '', textStatus, errorThrown);
        }
    });
}

/**
 * 會員農場資料，頁面載入時執行一次，後續不再執行
 * (取得ACCOUNT_SN)
 */
function getSnData(ASYNC_SETTING = true) {
    // 前置函式
    if (typeof preSnData.fn === 'function') {
        preSnData.fn.call(preSnData.context);
    }
    let AJAX_URL = '/game/farm/' + Game_ID + '/getsndata';
    let AJAX_METHOD = 'GET';
    $.ajax({
        url: AJAX_URL, // 網址
        type: AJAX_METHOD, // 使用 GET 傳送
        cache: false,
        async: ASYNC_SETTING, // 非同步設定(true/false)
        success: function(result) { // 傳送成功的 function
            console.log('--getSnData start--');
            console.log(result);
            console.log('--getSnData end--');

            if (result.flag == 'success') {
                // 會員資料
                ACCOUNT_ID = result.account;
                ACCOUNT_SN = result.sn;
                ACCOUNT_NAME = result.name;
                // 農場主人資料
                FarmerData = result.farmer_data;
                // 新玩家獎勵
                NewFarmerPrize = result.real_release_prizes;
                // 有圖片時設定base64的ACCOUNT_PIC (非即時另有載入完成的function可呼叫)
                if (result.pic) {
                    SetAccountPicture(result.pic, 75, 75);
                } else {
                    ACCOUNT_PIC = null;
                }
                // 遊戲開始計時
                timingStart();
                if (typeof successSnData.fn === 'function') {
                    successSnData.fn.call(successSnData.context);
                }
            } else if (result.flag == 'timeout') {
                timeOutEvent(showErrorModal, '', AJAX_URL, AJAX_METHOD);
            } else {
                // 失敗畫面(跳回首頁)
                recordGoogleSheet(showErrorModal, result.msg, AJAX_URL, AJAX_METHOD);
            }
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {
            recordGoogleSheet(showErrorModal, '遊戲載入失敗', AJAX_URL, AJAX_METHOD, '', textStatus, errorThrown);
        }
    });
}

/**
 * 頁面載入 & 跨天時呼叫
 */
function refreshDailyData(ASYNC_SETTING = true) {
    // 前置函式
    if (typeof preRefreshDailyData.fn === 'function') {
        preRefreshDailyData.fn.call(preRefreshDailyData.context);
    }
    let AJAX_URL = '/game/farm/' + Game_ID + '/refreshdailydata';
    let AJAX_METHOD = 'GET';
    $.ajax({
        url: AJAX_URL, // 網址
        type: AJAX_METHOD, // 使用 GET 傳送
        cache: false,
        async: ASYNC_SETTING, // 非同步設定(true/false)
        success: function(result) { // 傳送成功的 function
            console.log('--refreshDailyData start--');
            console.log(result);
            console.log('--refreshDailyData end--');

            if (result.flag == 'success') {
                if (typeof successRefreshDailyData.fn === 'function') {
                    successRefreshDailyData.fn.call(successRefreshDailyData.context);
                }
            } else if (result.flag == 'timeout') {
                timeOutEvent(showErrorModal, '', AJAX_URL, AJAX_METHOD);
            } else {
                // 失敗畫面(跳回首頁)
                recordGoogleSheet(showErrorModal, result.msg, AJAX_URL, AJAX_METHOD);
            }
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {
            recordGoogleSheet(showErrorModal, '遊戲載入失敗', AJAX_URL, AJAX_METHOD, '', textStatus, errorThrown);
        }
    });
}

/**
 * 農場等級資料
 */
function getLevelData(ASYNC_SETTING = true) {
    // 前置函式
    if (typeof preGetLevelData.fn === 'function') {
        preGetLevelData.fn.call(preGetLevelData.context);
    }
    let AJAX_URL = '/game/farm/' + Game_ID + '/getleveldata';
    let AJAX_METHOD = 'GET';
    $.ajax({
        url: AJAX_URL, // 網址
        type: AJAX_METHOD, // 使用 GET 傳送
        data: { sn: ACCOUNT_SN },
        cache: false,
        async: ASYNC_SETTING, // 非同步設定(true/false)
        success: function(result) { // 傳送成功的 function
            console.log('--getLevelData start--');
            console.log(result);
            console.log('--getLevelData end--');
            if (result.flag == 'success') {
                LevelData = result.level_data;

                if (typeof successGetLevelData.fn === 'function') {
                    successGetLevelData.fn.call(successGetLevelData.context);
                }
                return;
            } else if (result.flag == 'timeout') {
                timeOutEvent(showErrorModal, '', AJAX_URL, AJAX_METHOD);
            } else {
                // 失敗畫面(跳回首頁)
                recordGoogleSheet(showErrorModal, result.msg, AJAX_URL, AJAX_METHOD);
            }
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {
            recordGoogleSheet(showErrorModal, '載入失敗', AJAX_URL, AJAX_METHOD, '', textStatus, errorThrown);
        }
    });
}

/**
 * 農場作物資料
 */
function getPlantData(ASYNC_SETTING = true) {
    // 前置函式
    if (typeof preGetPlantData.fn === 'function') {
        preGetPlantData.fn.call(preGetPlantData.context);
    }
    let AJAX_URL = '/game/farm/' + Game_ID + '/getplantdata';
    let AJAX_METHOD = 'GET';
    $.ajax({
        url: AJAX_URL, // 網址
        type: AJAX_METHOD, // 使用 GET 傳送
        data: { sn: ACCOUNT_SN },
        cache: false,
        async: ASYNC_SETTING, // 非同步設定(true/false)
        success: function(result) { // 傳送成功的 function
            console.log('--getPlantData start--');
            console.log(result);
            console.log('--getPlantData end--');
            if (result.flag == 'success') {
                PlantData = result.plant_data;
                PlantPicIndexData = result.plant_pic_index_data;
                PlantIdData = result.plant_id_data;

                if (typeof successGetPlantData.fn === 'function') {
                    successGetPlantData.fn.call(successGetPlantData.context);
                }
                return;
            } else if (result.flag == 'timeout') {
                timeOutEvent(showErrorModal, '', AJAX_URL, AJAX_METHOD);
            } else {
                // 失敗畫面(跳回首頁)
                recordGoogleSheet(showErrorModal, result.msg, AJAX_URL, AJAX_METHOD);
            }
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {
            recordGoogleSheet(showErrorModal, '載入失敗', AJAX_URL, AJAX_METHOD, '', textStatus, errorThrown);
        }
    });
}

/**
 * 購買種子(作物ID、數量)
 */
function buySeed(SEED_ID, SEED_QUANTITY, ASYNC_SETTING = true) {
    // 前置函式
    if (typeof preBuySeed.fn === 'function') {
        preBuySeed.fn.call(preBuySeed.context);
    }
    let AJAX_URL = '/game/farm/' + Game_ID + '/buyseed';
    let AJAX_METHOD = 'POST';
    $.ajax({
        headers: {
            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
        }, // 權限TOKEN
        url: AJAX_URL,
        type: AJAX_METHOD,
        data: { sn: ACCOUNT_SN, seed_id: SEED_ID, quantity: SEED_QUANTITY, seconds: PlaySeconds },
        cache: false,
        async: ASYNC_SETTING,
        success: function(result) {
            console.log('--buySeed start--');
            console.log(result);
            console.log('--buySeed end--');
            if (result.flag == 'success') {
                PlaySeconds = 0;

                if (typeof successBuySeed.fn === 'function') {
                    successBuySeed.fn.call(successBuySeed.context);
                }
                return;
            } else if (result.flag == 'timeout') {
                timeOutEvent(showErrorModal, '', AJAX_URL, AJAX_METHOD);
            } else {
                // 失敗畫面(跳回首頁)
                recordGoogleSheet(showErrorModal, result.msg, AJAX_URL, AJAX_METHOD, 'seed_id:' + SEED_ID + ',quantity:' + SEED_QUANTITY);
            }
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {
            recordGoogleSheet(showErrorModal, '載入失敗', AJAX_URL, AJAX_METHOD, 'seed_id:' + SEED_ID + ',quantity:' + SEED_QUANTITY, textStatus, errorThrown);
        }
    });
}

/**
 * 種下種子
 */
function doPlantSeed(PLANT_ID, LOCATION, ASYNC_SETTING = true) {
    // 前置函式
    if (typeof preDoPlantSeed.fn === 'function') {
        preDoPlantSeed.fn.call(preDoPlantSeed.context);
    }
    let AJAX_URL = '/game/farm/' + Game_ID + '/plantseed';
    let AJAX_METHOD = 'POST';
    $.ajax({
        headers: {
            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
        }, // 權限TOKEN
        url: AJAX_URL,
        type: AJAX_METHOD,
        data: { sn: ACCOUNT_SN, plant_id: PLANT_ID, location: LOCATION, seconds: PlaySeconds },
        cache: false,
        async: ASYNC_SETTING, // 非同步設定(true/false)
        success: function(result) { // 傳送成功的 function
            console.log('--doPlantSeed start--');
            console.log(result);
            console.log('--doPlantSeed end--');
            if (result.flag == 'success') {
                PlaySeconds = 0;
                NextSec = result.next_sec;
                NowStage = result.now_stage;
                doPlantSeedResult = result;
                if (typeof successDoPlantSeed.fn === 'function') {
                    successDoPlantSeed.fn.call(successDoPlantSeed.context);
                }
                return;
            } else if (result.flag == 'timeout') {
                timeOutEvent(showErrorModal, '', AJAX_URL, AJAX_METHOD);
            } else {
                // 失敗畫面(跳回首頁)
                recordGoogleSheet(showErrorModal, result.msg, AJAX_URL, AJAX_METHOD, 'plant_id:' + PLANT_ID + ',location:' + LOCATION);
            }
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {
            recordGoogleSheet(showErrorModal, '載入失敗', AJAX_URL, AJAX_METHOD, 'plant_id:' + PLANT_ID + ',location:' + LOCATION, textStatus, errorThrown);
        }
    });
}

/**
 * 收成作物
 */
function doHarvest(LOCATION, ASYNC_SETTING = true) {
    // 前置函式
    if (typeof preDoHarvest.fn === 'function') {
        preDoHarvest.fn.call(preDoHarvest.context);
    }
    let AJAX_URL = '/game/farm/' + Game_ID + '/harvest';
    let AJAX_METHOD = 'POST';
    $.ajax({
        headers: {
            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
        }, // 權限TOKEN
        url: AJAX_URL,
        type: AJAX_METHOD,
        data: { sn: ACCOUNT_SN, location: LOCATION, seconds: PlaySeconds },
        cache: false,
        async: ASYNC_SETTING, // 非同步設定(true/false)
        success: function(result) { // 傳送成功的 function
            console.log('--doHarvest start--');
            console.log(result);
            console.log('--doHarvest end--');
            if (result.flag == 'success') {
                PlaySeconds = 0;
                HarvestResult = result;
                NewLevel = result.level;
                LevelUpPrize = result.real_release_prizes;
                if (typeof successDoHarvest.fn === 'function') {
                    successDoHarvest.fn.call(successDoHarvest.context);
                }
                return;
            } else if (result.flag == 'timeout') {
                timeOutEvent(showErrorModal, '', AJAX_URL, AJAX_METHOD);
            } else {
                // 失敗畫面(跳回首頁)
                recordGoogleSheet(showErrorModal, result.msg, AJAX_URL, AJAX_METHOD, 'location:' + LOCATION);
            }
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {
            recordGoogleSheet(showErrorModal, '載入失敗', AJAX_URL, AJAX_METHOD, 'location:' + LOCATION, textStatus, errorThrown);
        }
    });
}

/**
 * 賣出作物
 */
function sellPlant(PLANT_ID, QUANTITY, ASYNC_SETTING = true) {
    // 前置函式
    if (typeof preSellPlant.fn === 'function') {
        preSellPlant.fn.call(preSellPlant.context);
    }
    let AJAX_URL = '/game/farm/' + Game_ID + '/sellplant';
    let AJAX_METHOD = 'POST';
    $.ajax({
        headers: {
            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
        }, // 權限TOKEN
        url: AJAX_URL,
        type: AJAX_METHOD,
        data: { sn: ACCOUNT_SN, plant_id: PLANT_ID, quantity: QUANTITY, seconds: PlaySeconds },
        cache: false,
        async: ASYNC_SETTING, // 非同步設定(true/false)
        success: function(result) { // 傳送成功的 function
            console.log('--sellPlant start--');
            console.log(result);
            console.log('--sellPlant end--');
            if (result.flag == 'success') {
                PlaySeconds = 0;
                if (typeof successSellPlant.fn === 'function') {
                    successSellPlant.fn.call(successSellPlant.context);
                }
                return;
            } else if (result.flag == 'timeout') {
                timeOutEvent(showErrorModal, '', AJAX_URL, AJAX_METHOD);
            } else {
                // 失敗畫面(跳回首頁)
                recordGoogleSheet(showErrorModal, result.msg, AJAX_URL, AJAX_METHOD, 'plant_id:' + PLANT_ID + ',quantity:' + QUANTITY);
            }
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {
            recordGoogleSheet(showErrorModal, '載入失敗', AJAX_URL, AJAX_METHOD, 'plant_id:' + PLANT_ID + ',quantity:' + QUANTITY, textStatus, errorThrown);
        }
    });
}

/**
 * 賣出道具
 */
function sellProp(PROP_ID, QUANTITY, ASYNC_SETTING = true) {
    // 前置函式
    if (typeof preSellProp.fn === 'function') {
        preSellProp.fn.call(preSellProp.context);
    }
    let AJAX_URL = '/game/farm/' + Game_ID + '/sellprop';
    let AJAX_METHOD = 'POST';
    $.ajax({
        headers: {
            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
        }, // 權限TOKEN
        url: AJAX_URL,
        type: AJAX_METHOD,
        data: { sn: ACCOUNT_SN, prop_id: PROP_ID, quantity: QUANTITY, seconds: PlaySeconds },
        cache: false,
        async: ASYNC_SETTING, // 非同步設定(true/false)
        success: function(result) { // 傳送成功的 function
            console.log('--sellProp start--');
            console.log(result);
            console.log('--sellProp end--');
            if (result.flag == 'success') {
                if (typeof successSellProp.fn === 'function') {
                    successSellProp.fn.call(successSellProp.context);
                }
                return;
            } else if (result.flag == 'timeout') {
                timeOutEvent(showErrorModal, '', AJAX_URL, AJAX_METHOD);
            } else {
                // 失敗畫面(跳回首頁)
                recordGoogleSheet(showErrorModal, result.msg, AJAX_URL, AJAX_METHOD, 'prop_id:' + PROP_ID + ',quantity:' + QUANTITY);
            }
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {
            recordGoogleSheet(showErrorModal, '載入失敗', AJAX_URL, AJAX_METHOD, 'prop_id:' + PROP_ID + ',quantity:' + QUANTITY, textStatus, errorThrown);
        }
    });
}

/**
 * 農場道具資料
 */
function getPropData(ASYNC_SETTING = true) {
    // 前置函式
    if (typeof preGetPropData.fn === 'function') {
        preGetPropData.fn.call(preGetPropData.context);
    }
    let AJAX_URL = '/game/farm/' + Game_ID + '/getpropdata';
    let AJAX_METHOD = 'GET';
    $.ajax({
        url: AJAX_URL, // 網址
        type: AJAX_METHOD, // 使用 GET 傳送
        data: { sn: ACCOUNT_SN },
        cache: false,
        async: ASYNC_SETTING, // 非同步設定(true/false)
        success: function(result) { // 傳送成功的 function
            console.log('--getPropData start--');
            console.log(result);
            console.log('--getPropData end--');
            if (result.flag == 'success') {
                PropData = result.prop_data;
                PropPicIndexData = result.prop_pic_index_data;
                PropIdData = result.prop_id_data;

                if (typeof successGetPropData.fn === 'function') {
                    successGetPropData.fn.call(successGetPropData.context);
                }
                return;
            } else if (result.flag == 'timeout') {
                timeOutEvent(showErrorModal, '', AJAX_URL, AJAX_METHOD);
            } else {
                // 失敗畫面(跳回首頁)
                recordGoogleSheet(showErrorModal, result.msg, AJAX_URL, AJAX_METHOD);
            }
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {
            recordGoogleSheet(showErrorModal, '載入失敗', AJAX_URL, AJAX_METHOD, '', textStatus, errorThrown);
        }
    });
}

/**
 * 購買道具(道具ID、數量)
 */
function buyProp(PROP_ID, PROP_QUANTITY, ASYNC_SETTING = true) {
    // 前置函式
    if (typeof preBuyProp.fn === 'function') {
        preBuyProp.fn.call(preBuyProp.context);
    }
    let AJAX_URL = '/game/farm/' + Game_ID + '/buyprop';
    let AJAX_METHOD = 'POST';
    $.ajax({
        headers: {
            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
        }, // 權限TOKEN
        url: AJAX_URL,
        type: AJAX_METHOD,
        data: { sn: ACCOUNT_SN, prop_id: PROP_ID, quantity: PROP_QUANTITY, seconds: PlaySeconds },
        cache: false,
        async: ASYNC_SETTING,
        success: function(result) {
            console.log('--buyProp start--');
            console.log(result);
            console.log('--buyProp end--');
            if (result.flag == 'success') {
                PlaySeconds = 0;
                MemberCatCoin = result.now_cat_coin;

                if (typeof successBuyProp.fn === 'function') {
                    successBuyProp.fn.call(successBuyProp.context);
                }
                return;
            } else if (result.flag == 'failure') {
                MemberCatCoin = result.now_cat_coin;
                recordGoogleSheet(showReloadModal, result.msg, AJAX_URL, AJAX_METHOD);
            } else if (result.flag == 'timeout') {
                timeOutEvent(showErrorModal, '', AJAX_URL, AJAX_METHOD);
            } else {
                // 失敗畫面(跳回首頁)
                recordGoogleSheet(showErrorModal, result.msg, AJAX_URL, AJAX_METHOD, 'prop_id:' + PROP_ID + ',quantity:' + PROP_QUANTITY);
            }
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {
            recordGoogleSheet(showErrorModal, '載入失敗', AJAX_URL, AJAX_METHOD, 'prop_id:' + PROP_ID + ',quantity:' + PROP_QUANTITY, textStatus, errorThrown);
        }
    });
}

/**
 * 使用道具(道具ID、土地位置)
 */
function useProp(PROP_ID, LOCATION, ASYNC_SETTING = true) {
    // 前置函式
    if (typeof preUseProp.fn === 'function') {
        preUseProp.fn.call(preUseProp.context);
    }
    let AJAX_URL = '/game/farm/' + Game_ID + '/useprop';
    let AJAX_METHOD = 'POST';
    $.ajax({
        headers: {
            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
        }, // 權限TOKEN
        url: AJAX_URL,
        type: AJAX_METHOD,
        data: { sn: ACCOUNT_SN, prop_id: PROP_ID, location: LOCATION, seconds: PlaySeconds },
        cache: false,
        async: ASYNC_SETTING,
        success: function(result) {
            console.log('--useProp start--');
            console.log(result);
            console.log('--useProp end--');
            if (result.flag == 'success') {
                UsePropResult = result;
                PlaySeconds = 0;

                if (typeof successUseProp.fn === 'function') {
                    successUseProp.fn.call(successUseProp.context);
                }
                return;
            } else if (result.flag == 'timeout') {
                timeOutEvent(showErrorModal, '', AJAX_URL, AJAX_METHOD);
            } else {
                // 失敗畫面(跳回首頁)
                recordGoogleSheet(showErrorModal, result.msg, AJAX_URL, AJAX_METHOD, 'prop_id:' + PROP_ID + ',location:' + LOCATION);
            }
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {
            recordGoogleSheet(showErrorModal, '載入失敗', AJAX_URL, AJAX_METHOD, 'prop_id:' + PROP_ID + ',location:' + LOCATION, textStatus, errorThrown);
        }
    });
}

/**
 * 土地資料
 */
function getLandData(ASYNC_SETTING = true) {
    // 前置函式
    if (typeof preGetLandData.fn === 'function') {
        preGetLandData.fn.call(preGetLandData.context);
    }
    let AJAX_URL = '/game/farm/' + Game_ID + '/getlanddata';
    let AJAX_METHOD = 'GET';
    $.ajax({
        url: AJAX_URL, // 網址
        type: AJAX_METHOD, // 使用 GET 傳送
        data: { sn: ACCOUNT_SN },
        cache: false,
        async: ASYNC_SETTING, // 非同步設定(true/false)
        success: function(result) { // 傳送成功的 function
            console.log('--getLandData start--');
            console.log(result);
            console.log('--getLandData end--');
            if (result.flag == 'success') {
                LandData = result.land_data;
                FarmerLands = result.farmer_land_data;

                if (typeof successGetLandData.fn === 'function') {
                    successGetLandData.fn.call(successGetLandData.context);
                }
                return;
            } else if (result.flag == 'timeout') {
                timeOutEvent(showErrorModal, '', AJAX_URL, AJAX_METHOD);
            } else {
                // 失敗畫面(跳回首頁)
                recordGoogleSheet(showErrorModal, result.msg, AJAX_URL, AJAX_METHOD);
            }
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {
            recordGoogleSheet(showErrorModal, '載入失敗', AJAX_URL, AJAX_METHOD, '', textStatus, errorThrown);
        }
    });
}

/**
 * 購買土地
 */
function buyLand(ASYNC_SETTING = true) {
    // 前置函式
    if (typeof preBuyLand.fn === 'function') {
        preBuyLand.fn.call(preBuyLand.context);
    }
    let AJAX_URL = '/game/farm/' + Game_ID + '/buyland';
    let AJAX_METHOD = 'POST';
    $.ajax({
        headers: {
            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
        }, // 權限TOKEN
        url: AJAX_URL,
        type: AJAX_METHOD,
        data: { sn: ACCOUNT_SN, seconds: PlaySeconds },
        cache: false,
        async: ASYNC_SETTING,
        success: function(result) {
            console.log('--buyLand start--');
            console.log(result);
            console.log('--buyLand end--');
            if (result.flag == 'success') {
                MemberCatCoin = result.cat_coin;
                MemberPoint = result.o2_point;
                PlaySeconds = 0;

                if (typeof successBuyLand.fn === 'function') {
                    successBuyLand.fn.call(successBuyLand.context);
                }
                return;
            } else if (result.flag == 'timeout') {
                timeOutEvent(showErrorModal, '', AJAX_URL, AJAX_METHOD);
            } else {
                // 失敗畫面(跳回首頁)
                recordGoogleSheet(showErrorModal, result.msg, AJAX_URL, AJAX_METHOD);
            }
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {
            recordGoogleSheet(showErrorModal, '載入失敗', AJAX_URL, AJAX_METHOD, '', textStatus, errorThrown);
        }
    });
}

/**
 * 倉庫資料
 */
function getWarehouseData(ASYNC_SETTING = true) {
    // 前置函式
    if (typeof preGetWarehouseData.fn === 'function') {
        preGetWarehouseData.fn.call(preGetWarehouseData.context);
    }
    let AJAX_URL = '/game/farm/' + Game_ID + '/getwarehousedata';
    let AJAX_METHOD = 'GET';
    $.ajax({
        url: AJAX_URL, // 網址
        type: AJAX_METHOD, // 使用 GET 傳送
        data: { sn: ACCOUNT_SN },
        cache: false,
        async: ASYNC_SETTING, // 非同步設定(true/false)
        success: function(result) { // 傳送成功的 function
            console.log('--getWarehouseData start--');
            console.log(result);
            console.log('--getWarehouseData end--');
            if (result.flag == 'success') {
                WarehouseData = result.warehouse_data;
                FarmerWarehouse = result.farmer_warehouse_data;

                if (typeof successGetWarehouseData.fn === 'function') {
                    successGetWarehouseData.fn.call(successGetWarehouseData.context);
                }
                return;
            } else if (result.flag == 'timeout') {
                timeOutEvent(showErrorModal, '', AJAX_URL, AJAX_METHOD);
            } else {
                // 失敗畫面(跳回首頁)
                recordGoogleSheet(showErrorModal, result.msg, AJAX_URL, AJAX_METHOD);
            }
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {
            recordGoogleSheet(showErrorModal, '載入失敗', AJAX_URL, AJAX_METHOD, '', textStatus, errorThrown);
        }
    });
}

/**
 * 購買倉庫
 */
function buyWarehouse(ASYNC_SETTING = true) {
    // 前置函式
    if (typeof preBuyWarehouse.fn === 'function') {
        preBuyWarehouse.fn.call(preBuyWarehouse.context);
    }
    let AJAX_URL = '/game/farm/' + Game_ID + '/buywarehouse';
    let AJAX_METHOD = 'POST';
    $.ajax({
        headers: {
            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
        }, // 權限TOKEN
        url: AJAX_URL,
        type: AJAX_METHOD,
        data: { sn: ACCOUNT_SN, seconds: PlaySeconds },
        cache: false,
        async: ASYNC_SETTING,
        success: function(result) {
            console.log('--buyWarehouse start--');
            console.log(result);
            console.log('--buyWarehouse end--');
            if (result.flag == 'success') {
                MemberCatCoin = result.cat_coin;
                MemberPoint = result.o2_point;
                PlaySeconds = 0;

                if (typeof successBuyWarehouse.fn === 'function') {
                    successBuyWarehouse.fn.call(successBuyWarehouse.context);
                }
                return;
            } else if (result.flag == 'timeout') {
                timeOutEvent(showErrorModal, '', AJAX_URL, AJAX_METHOD);
            } else {
                // 失敗畫面(跳回首頁)
                recordGoogleSheet(showErrorModal, result.msg, AJAX_URL, AJAX_METHOD);
            }
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {
            recordGoogleSheet(showErrorModal, '載入失敗', AJAX_URL, AJAX_METHOD, '', textStatus, errorThrown);
        }
    });
}

/**
 * 成就資料
 */
function getAchieveData(ASYNC_SETTING = true) {
    // 前置函式
    if (typeof preGetAchieveData.fn === 'function') {
        preGetAchieveData.fn.call(preGetAchieveData.context);
    }
    let AJAX_URL = '/game/farm/' + Game_ID + '/getachievedata';
    let AJAX_METHOD = 'GET';
    $.ajax({
        url: AJAX_URL, // 網址
        type: AJAX_METHOD, // 使用 GET 傳送
        data: { sn: ACCOUNT_SN },
        cache: false,
        async: ASYNC_SETTING, // 非同步設定(true/false)
        success: function(result) { // 傳送成功的 function
            console.log('--getAchieveData start--');
            console.log(result);
            console.log('--getAchieveData end--');
            if (result.flag == 'success') {
                AchieveCategoryData = result.achieve_category_data;
                FarmerAchieveData = result.farmer_achieve_data;
                AchieveData = result.achieve_data;

                if (typeof successGetAchieveData.fn === 'function') {
                    successGetAchieveData.fn.call(successGetAchieveData.context);
                }
                return;
            } else if (result.flag == 'timeout') {
                timeOutEvent(showErrorModal, '', AJAX_URL, AJAX_METHOD);
            } else {
                // 失敗畫面(跳回首頁)
                recordGoogleSheet(showErrorModal, result.msg, AJAX_URL, AJAX_METHOD);
            }
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {
            recordGoogleSheet(showErrorModal, '載入失敗', AJAX_URL, AJAX_METHOD, '', textStatus, errorThrown);
        }
    });
}

/**
 * 成就達成領取大禮包
 */
function reachAchieve(STAGE_ID, ASYNC_SETTING = true) {
    // 前置函式
    if (typeof preReachAchieve.fn === 'function') {
        preReachAchieve.fn.call(preReachAchieve.context);
    }
    let AJAX_URL = '/game/farm/' + Game_ID + '/reachachieve';
    let AJAX_METHOD = 'POST';
    $.ajax({
        headers: {
            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
        }, // 權限TOKEN
        url: AJAX_URL,
        type: AJAX_METHOD,
        data: { sn: ACCOUNT_SN, stage_id: STAGE_ID, seconds: PlaySeconds },
        cache: false,
        async: ASYNC_SETTING, // 非同步設定(true/false)
        success: function(result) { // 傳送成功的 function
            console.log('--reachAchieve start--');
            console.log(result);
            console.log('--reachAchieve end--');
            if (result.flag == 'success') {
                FarmerAchieveData = result.farmer_achieve_data;
                AchievePrize = result.real_release_prizes;
                PlaySeconds = 0;

                if (typeof successReachAchieve.fn === 'function') {
                    successReachAchieve.fn.call(successReachAchieve.context);
                }
                return;
            } else if (result.flag == 'timeout') {
                timeOutEvent(showErrorModal, '', AJAX_URL, AJAX_METHOD);
            } else {
                // 失敗畫面(跳回首頁)
                recordGoogleSheet(showErrorModal, result.msg, AJAX_URL, AJAX_METHOD, 'stage_id:' + STAGE_ID);
            }
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {
            recordGoogleSheet(showErrorModal, '載入失敗', AJAX_URL, AJAX_METHOD, 'stage_id:' + STAGE_ID, textStatus, errorThrown);
        }
    });
}

/**
 * 取得會員O2 POINT/貓鑽
 */
function getMemberWallet(ASYNC_SETTING = true) {
    // 前置函式
    if (typeof preGetMemberWallet.fn === 'function') {
        preGetMemberWallet.fn.call(preGetMemberWallet.context);
    }
    let AJAX_URL = '/game/farm/' + Game_ID + '/getwallet';
    let AJAX_METHOD = 'GET';
    $.ajax({
        url: AJAX_URL, // 網址
        type: AJAX_METHOD, // 使用 GET 傳送
        data: { sn: ACCOUNT_SN },
        cache: false,
        async: ASYNC_SETTING, // 非同步設定(true/false)
        success: function(result) { // 傳送成功的 function
            console.log('--getMemberWallet start--');
            console.log(result);
            console.log('--getMemberWallet end--');
            if (result.flag == 'success') {
                MemberCatCoin = result.cat_coin;
                MemberPoint = result.o2_point;

                if (typeof successGetMemberWallet.fn === 'function') {
                    successGetMemberWallet.fn.call(successGetMemberWallet.context);
                }
                return;
            } else if (result.flag == 'timeout') {
                timeOutEvent(showErrorModal, '', AJAX_URL, AJAX_METHOD);
            } else {
                // 失敗畫面(跳回首頁)
                recordGoogleSheet(showErrorModal, result.msg, AJAX_URL, AJAX_METHOD);
            }
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {
            recordGoogleSheet(showErrorModal, '載入失敗', AJAX_URL, AJAX_METHOD, '', textStatus, errorThrown);
        }
    });
}

/**
 * 取得會員種子庫存
 */
function getSeedStock(ASYNC_SETTING = true) {
    // 前置函式
    if (typeof preGetSeedStock.fn === 'function') {
        preGetSeedStock.fn.call(preGetSeedStock.context);
    }
    let AJAX_URL = '/game/farm/' + Game_ID + '/getseedstock';
    let AJAX_METHOD = 'GET';
    $.ajax({
        url: AJAX_URL, // 網址
        type: AJAX_METHOD, // 使用 GET 傳送
        data: { sn: ACCOUNT_SN },
        cache: false,
        async: ASYNC_SETTING, // 非同步設定(true/false)
        success: function(result) { // 傳送成功的 function
            console.log('--getSeedStock start--');
            console.log(result);
            console.log('--getSeedStock end--');
            if (result.flag == 'success') {
                SeedStock = result.farmer_seed_data;

                if (typeof successGetSeedStock.fn === 'function') {
                    successGetSeedStock.fn.call(successGetSeedStock.context);
                }
                return;
            } else if (result.flag == 'timeout') {
                timeOutEvent(showErrorModal, '', AJAX_URL, AJAX_METHOD);
            } else {
                // 失敗畫面(跳回首頁)
                recordGoogleSheet(showErrorModal, result.msg, AJAX_URL, AJAX_METHOD);
            }
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {
            recordGoogleSheet(showErrorModal, '載入失敗', AJAX_URL, AJAX_METHOD, '', textStatus, errorThrown);
        }
    });
}

/**
 * 取得會員收成作物庫存
 */
function getPlantStock(ASYNC_SETTING = true) {
    // 前置函式
    if (typeof preGetPlantStock.fn === 'function') {
        preGetPlantStock.fn.call(preGetPlantStock.context);
    }
    let AJAX_URL = '/game/farm/' + Game_ID + '/getplantstock';
    let AJAX_METHOD = 'GET';
    $.ajax({
        url: AJAX_URL, // 網址
        type: AJAX_METHOD, // 使用 GET 傳送
        data: { sn: ACCOUNT_SN },
        cache: false,
        async: ASYNC_SETTING, // 非同步設定(true/false)
        success: function(result) { // 傳送成功的 function
            console.log('--getPlantStock start--');
            console.log(result);
            console.log('--getPlantStock end--');
            if (result.flag == 'success') {
                PlantStock = result.farmer_plant_data;

                if (typeof successGetPlantStock.fn === 'function') {
                    successGetPlantStock.fn.call(successGetPlantStock.context);
                }
                return;
            } else if (result.flag == 'timeout') {
                timeOutEvent(showErrorModal, '', AJAX_URL, AJAX_METHOD);
            } else {
                // 失敗畫面(跳回首頁)
                recordGoogleSheet(showErrorModal, result.msg, AJAX_URL, AJAX_METHOD);
            }
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {
            recordGoogleSheet(showErrorModal, '載入失敗', AJAX_URL, AJAX_METHOD, '', textStatus, errorThrown);
        }
    });
}

/**
 * 取得會員道具庫存
 */
function getPropStock(ASYNC_SETTING = true) {
    // 前置函式
    if (typeof preGetPropStock.fn === 'function') {
        preGetPropStock.fn.call(preGetPropStock.context);
    }
    let AJAX_URL = '/game/farm/' + Game_ID + '/getpropstock';
    let AJAX_METHOD = 'GET';
    $.ajax({
        url: AJAX_URL, // 網址
        type: AJAX_METHOD, // 使用 GET 傳送
        data: { sn: ACCOUNT_SN },
        cache: false,
        async: ASYNC_SETTING, // 非同步設定(true/false)
        success: function(result) { // 傳送成功的 function
            console.log('--getPropStock start--');
            console.log(result);
            console.log('--getPropStock end--');
            if (result.flag == 'success') {
                PropStock = result.farmer_prop_data;

                if (typeof successGetPropStock.fn === 'function') {
                    successGetPropStock.fn.call(successGetPropStock.context);
                }
                return;
            } else if (result.flag == 'timeout') {
                timeOutEvent(showErrorModal, '', AJAX_URL, AJAX_METHOD);
            } else {
                // 失敗畫面(跳回首頁)
                recordGoogleSheet(showErrorModal, result.msg, AJAX_URL, AJAX_METHOD);
            }
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {
            recordGoogleSheet(showErrorModal, '載入失敗', AJAX_URL, AJAX_METHOD, '', textStatus, errorThrown);
        }
    });
}

/**
 * 取得會員小夥伴資料
 */
function getPartnerData(ASYNC_SETTING = true) {
    // 前置函式
    if (typeof preGetPartnerData.fn === 'function') {
        preGetPartnerData.fn.call(preGetPartnerData.context);
    }
    let AJAX_URL = '/game/farm/' + Game_ID + '/getpartnerdata';
    let AJAX_METHOD = 'GET';
    $.ajax({
        url: AJAX_URL, // 網址
        type: AJAX_METHOD, // 使用 GET 傳送
        data: { sn: ACCOUNT_SN },
        cache: false,
        async: ASYNC_SETTING, // 非同步設定(true/false)
        success: function(result) { // 傳送成功的 function
            console.log('--getPartnerData start--');
            console.log(result);
            console.log('--getPartnerData end--');
            if (result.flag == 'success') {
                PartnerCategoryData = result.partner_category_data;
                PartnerData = result.partner_data;
                PartnerPicIndexData = result.partner_pic_index_data;
                PartnerIdData = result.partner_id_data;
                FarmerPartner = result.farmer_partner_data;

                if (typeof successGetPartnerData.fn === 'function') {
                    successGetPartnerData.fn.call(successGetPartnerData.context);
                }
                return;
            } else if (result.flag == 'timeout') {
                timeOutEvent(showErrorModal, '', AJAX_URL, AJAX_METHOD);
            } else {
                // 失敗畫面(跳回首頁)
                recordGoogleSheet(showErrorModal, result.msg, AJAX_URL, AJAX_METHOD);
            }
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {
            recordGoogleSheet(showErrorModal, '載入失敗', AJAX_URL, AJAX_METHOD, '', textStatus, errorThrown);
        }
    });
}

/**
 * 點擊行走小夥伴
 */
function clickPartner(PARTNER_ID, ASYNC_SETTING = true) {
    // 前置函式
    if (typeof preClickPartner.fn === 'function') {
        preClickPartner.fn.call(preClickPartner.context);
    }
    let AJAX_URL = '/game/farm/' + Game_ID + '/clickpartner';
    let AJAX_METHOD = 'POST';
    $.ajax({
        headers: {
            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
        }, // 權限TOKEN
        url: AJAX_URL,
        type: AJAX_METHOD,
        data: { sn: ACCOUNT_SN, partner_id: PARTNER_ID, seconds: PlaySeconds },
        cache: false,
        async: ASYNC_SETTING, // 非同步設定(true/false)
        success: function(result) { // 傳送成功的 function
            console.log('--clickPartner start--');
            console.log(result);
            console.log('--clickPartner end--');
            if (result.flag == 'success') {
                UpdateFarmerPartner = result.update_partner_data;
                PlaySeconds = 0;

                if (typeof successClickPartner.fn === 'function') {
                    successClickPartner.fn.call(successClickPartner.context);
                }
                return;
            } else if (result.flag == 'timeout') {
                timeOutEvent(showErrorModal, '', AJAX_URL, AJAX_METHOD);
            } else {
                // 失敗畫面(跳回首頁)
                recordGoogleSheet(showErrorModal, result.msg, AJAX_URL, AJAX_METHOD, 'partner_id:' + PARTNER_ID);
            }
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {
            recordGoogleSheet(showErrorModal, '載入失敗', AJAX_URL, AJAX_METHOD, 'partner_id:' + PARTNER_ID, textStatus, errorThrown);
        }
    });
}

/**
 * 回收行走小夥伴
 */
function recyclePartner(PARTNER_ID, ASYNC_SETTING = true) {
    // 前置函式
    if (typeof preRecyclePartner.fn === 'function') {
        preRecyclePartner.fn.call(preRecyclePartner.context);
    }
    let AJAX_URL = '/game/farm/' + Game_ID + '/recyclepartner';
    let AJAX_METHOD = 'POST';
    $.ajax({
        headers: {
            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
        }, // 權限TOKEN
        url: AJAX_URL,
        type: AJAX_METHOD,
        data: { sn: ACCOUNT_SN, partner_id: PARTNER_ID, seconds: PlaySeconds },
        cache: false,
        async: ASYNC_SETTING, // 非同步設定(true/false)
        success: function(result) { // 傳送成功的 function
            console.log('--recyclePartner start--');
            console.log(result);
            console.log('--recyclePartner end--');
            if (result.flag == 'success') {
                PlaySeconds = 0;
                if (typeof successRecyclePartner.fn === 'function') {
                    successRecyclePartner.fn.call(successRecyclePartner.context);
                }
                return;
            } else if (result.flag == 'timeout') {
                timeOutEvent(showErrorModal, '', AJAX_URL, AJAX_METHOD);
            } else {
                // 失敗畫面(跳回首頁)
                recordGoogleSheet(showErrorModal, result.msg, AJAX_URL, AJAX_METHOD, 'partner_id:' + PARTNER_ID);
            }
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {
            recordGoogleSheet(showErrorModal, '載入失敗', AJAX_URL, AJAX_METHOD, 'partner_id:' + PARTNER_ID, textStatus, errorThrown);
        }
    });
}

/**
 * 解鎖小夥伴
 */
function unlockPartner(PARTNER_ID, ASYNC_SETTING = true) {
    // 前置函式
    if (typeof preUnlockPartner.fn === 'function') {
        preUnlockPartner.fn.call(preUnlockPartner.context);
    }
    let AJAX_URL = '/game/farm/' + Game_ID + '/unlockpartner';
    let AJAX_METHOD = 'POST';
    $.ajax({
        headers: {
            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
        }, // 權限TOKEN
        url: AJAX_URL,
        type: AJAX_METHOD,
        data: { sn: ACCOUNT_SN, partner_id: PARTNER_ID, seconds: PlaySeconds },
        cache: false,
        async: ASYNC_SETTING, // 非同步設定(true/false)
        success: function(result) { // 傳送成功的 function
            console.log('--unlockPartner start--');
            console.log(result);
            console.log('--unlockPartner end--');
            if (result.flag == 'success') {
                PlaySeconds = 0;
                UnlockPartnerResult = result;

                if (typeof successUnlockPartner.fn === 'function') {
                    successUnlockPartner.fn.call(successUnlockPartner.context);
                }
                return;
            } else if (result.flag == 'timeout') {
                timeOutEvent(showErrorModal, '', AJAX_URL, AJAX_METHOD);
            } else {
                // 失敗畫面(跳回首頁)
                recordGoogleSheet(showErrorModal, result.msg, AJAX_URL, AJAX_METHOD, 'partner_id:' + PARTNER_ID);
            }
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {
            recordGoogleSheet(showErrorModal, '載入失敗', AJAX_URL, AJAX_METHOD, 'partner_id:' + PARTNER_ID, textStatus, errorThrown);
        }
    });
}

/**
 * 取得會員簽到資料
 */
function getSignInData(ASYNC_SETTING = true) {
    // 前置函式
    if (typeof preGetSignInData.fn === 'function') {
        preGetSignInData.fn.call(preGetSignInData.context);
    }
    let AJAX_URL = '/game/farm/' + Game_ID + '/getsignindata';
    let AJAX_METHOD = 'GET';
    $.ajax({
        url: AJAX_URL, // 網址
        type: AJAX_METHOD, // 使用 GET 傳送
        data: { sn: ACCOUNT_SN },
        cache: false,
        async: ASYNC_SETTING, // 非同步設定(true/false)
        success: function(result) { // 傳送成功的 function
            console.log('--getSignInData start--');
            console.log(result);
            console.log('--getSignInData end--');
            if (result.flag == 'success') {
                SigninData = result.signin_data;

                if (typeof successGetSignInData.fn === 'function') {
                    successGetSignInData.fn.call(successGetSignInData.context);
                }
                return;
            } else if (result.flag == 'timeout') {
                timeOutEvent(showErrorModal, '', AJAX_URL, AJAX_METHOD);
            } else {
                // 失敗畫面(跳回首頁)
                recordGoogleSheet(showErrorModal, result.msg, AJAX_URL, AJAX_METHOD);
            }
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {
            recordGoogleSheet(showErrorModal, '載入失敗', AJAX_URL, AJAX_METHOD, '', textStatus, errorThrown);
        }
    });
}

/**
 * 每日任務達成領取大禮包
 */
function reachSignIn(ASYNC_SETTING = true) {
    // 前置函式
    if (typeof preReachSignIn.fn === 'function') {
        preReachSignIn.fn.call(preReachSignIn.context);
    }
    let AJAX_URL = '/game/farm/' + Game_ID + '/reachsignin';
    let AJAX_METHOD = 'POST';
    $.ajax({
        headers: {
            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
        }, // 權限TOKEN
        url: AJAX_URL,
        type: AJAX_METHOD,
        data: { sn: ACCOUNT_SN, seconds: PlaySeconds },
        cache: false,
        async: ASYNC_SETTING, // 非同步設定(true/false)
        success: function(result) { // 傳送成功的 function
            console.log('--reachSignIn start--');
            console.log(result);
            console.log('--reachSignIn end--');
            if (result.flag == 'success') {
                MaxSignin = result.max_signin;
                SignInPrize = result.real_release_prizes;
                PlaySeconds = 0;

                if (typeof successReachSignIn.fn === 'function') {
                    successReachSignIn.fn.call(successReachSignIn.context);
                }
                return;
            } else if (result.flag == 'timeout') {
                timeOutEvent(showErrorModal, '', AJAX_URL, AJAX_METHOD);
            } else {
                // 失敗畫面(跳回首頁)
                recordGoogleSheet(showErrorModal, result.msg, AJAX_URL, AJAX_METHOD);
            }
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {
            recordGoogleSheet(showErrorModal, '載入失敗', AJAX_URL, AJAX_METHOD, '', textStatus, errorThrown);
        }
    });
}

/**
 * 取得會員每日任務資料
 */
function getDailyMissionData(ASYNC_SETTING = true) {
    // 前置函式
    if (typeof preGetDailyMissionData.fn === 'function') {
        preGetDailyMissionData.fn.call(preGetDailyMissionData.context);
    }
    let AJAX_URL = '/game/farm/' + Game_ID + '/getdailydata';
    let AJAX_METHOD = 'GET';
    $.ajax({
        url: AJAX_URL, // 網址
        type: AJAX_METHOD, // 使用 GET 傳送
        data: { sn: ACCOUNT_SN },
        cache: false,
        async: ASYNC_SETTING, // 非同步設定(true/false)
        success: function(result) { // 傳送成功的 function
            console.log('--getDailyMissionData start--');
            console.log(result);
            console.log('--getDailyMissionData end--');
            if (result.flag == 'success') {
                DailyMissionData = result.daily_mission_data;

                if (typeof successGetDailyMissionData.fn === 'function') {
                    successGetDailyMissionData.fn.call(successGetDailyMissionData.context);
                }
                return;
            } else if (result.flag == 'timeout') {
                timeOutEvent(showErrorModal, '', AJAX_URL, AJAX_METHOD);
            } else {
                // 失敗畫面(跳回首頁)
                recordGoogleSheet(showErrorModal, result.msg, AJAX_URL, AJAX_METHOD);
            }
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {
            recordGoogleSheet(showErrorModal, '載入失敗', AJAX_URL, AJAX_METHOD, '', textStatus, errorThrown);
        }
    });
}

/**
 * 每日任務達成領取大禮包
 */
function reachDailyMission(MISSION_ID, ASYNC_SETTING = true) {
    // 前置函式
    if (typeof preReachDailyMission.fn === 'function') {
        preReachDailyMission.fn.call(preReachDailyMission.context);
    }
    let AJAX_URL = '/game/farm/' + Game_ID + '/reachmission';
    let AJAX_METHOD = 'POST';
    $.ajax({
        headers: {
            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
        }, // 權限TOKEN
        url: AJAX_URL,
        type: AJAX_METHOD,
        data: { sn: ACCOUNT_SN, mission_id: MISSION_ID, seconds: PlaySeconds },
        cache: false,
        async: ASYNC_SETTING, // 非同步設定(true/false)
        success: function(result) { // 傳送成功的 function
            console.log('--reachDailyMission start--');
            console.log(result);
            console.log('--reachDailyMission end--');
            if (result.flag == 'success') {
                DailyMissionData = result.daily_mission_data;
                DailyMissionPrize = result.real_release_prizes;
                PlaySeconds = 0;

                if (typeof successReachDailyMission.fn === 'function') {
                    successReachDailyMission.fn.call(successReachDailyMission.context);
                }
                return;
            } else if (result.flag == 'timeout') {
                timeOutEvent(showErrorModal, '', AJAX_URL, AJAX_METHOD);
            } else {
                // 失敗畫面(跳回首頁)
                recordGoogleSheet(showErrorModal, result.msg, AJAX_URL, AJAX_METHOD, 'mission_id:' + MISSION_ID);
            }
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {
            recordGoogleSheet(showErrorModal, '載入失敗', AJAX_URL, AJAX_METHOD, 'mission_id:' + MISSION_ID, textStatus, errorThrown);
        }
    });
}

/**
 * 取得每日積分寶箱資料
 */
function getScoreBoxData(ASYNC_SETTING = true) {
    // 前置函式
    if (typeof preGetScoreBoxData.fn === 'function') {
        preGetScoreBoxData.fn.call(preGetScoreBoxData.context);
    }
    let AJAX_URL = '/game/farm/' + Game_ID + '/getscoreboxdata';
    let AJAX_METHOD = 'GET';
    $.ajax({
        url: AJAX_URL, // 網址
        type: AJAX_METHOD, // 使用 GET 傳送
        data: { sn: ACCOUNT_SN },
        cache: false,
        async: ASYNC_SETTING, // 非同步設定(true/false)
        success: function(result) { // 傳送成功的 function
            console.log('--getScoreBoxData start--');
            console.log(result);
            console.log('--getScoreBoxData end--');
            if (result.flag == 'success') {
                ScoreBoxData = result.score_box_data;

                if (typeof successGetScoreBoxData.fn === 'function') {
                    successGetScoreBoxData.fn.call(successGetScoreBoxData.context);
                }
                return;
            } else if (result.flag == 'timeout') {
                timeOutEvent(showErrorModal, '', AJAX_URL, AJAX_METHOD);
            } else {
                // 失敗畫面(跳回首頁)
                recordGoogleSheet(showErrorModal, result.msg, AJAX_URL, AJAX_METHOD);
            }
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {
            recordGoogleSheet(showErrorModal, '載入失敗', AJAX_URL, AJAX_METHOD, '', textStatus, errorThrown);
        }
    });
}

/**
 * 每日積分達成領取寶箱大禮包
 */
function reachScoreBox(BOX_ID, ASYNC_SETTING = true) {
    // 前置函式
    if (typeof preReachScoreBox.fn === 'function') {
        preReachScoreBox.fn.call(preReachScoreBox.context);
    }
    let AJAX_URL = '/game/farm/' + Game_ID + '/reachscorebox';
    let AJAX_METHOD = 'POST';
    $.ajax({
        headers: {
            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
        }, // 權限TOKEN
        url: AJAX_URL,
        type: AJAX_METHOD,
        data: { sn: ACCOUNT_SN, box_id: BOX_ID },
        cache: false,
        async: ASYNC_SETTING, // 非同步設定(true/false)
        success: function(result) { // 傳送成功的 function
            console.log('--reachScoreBox start--');
            console.log(result);
            console.log('--reachScoreBox end--');
            if (result.flag == 'success') {
                ScoreBoxPrize = result.real_release_prizes;

                if (typeof successReachScoreBox.fn === 'function') {
                    successReachScoreBox.fn.call(successReachScoreBox.context);
                }
                return;
            } else if (result.flag == 'timeout') {
                timeOutEvent(showErrorModal, '', AJAX_URL, AJAX_METHOD);
            } else {
                // 失敗畫面(跳回首頁)
                recordGoogleSheet(showErrorModal, result.msg, AJAX_URL, AJAX_METHOD);
            }
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {
            recordGoogleSheet(showErrorModal, '載入失敗', AJAX_URL, AJAX_METHOD, '', textStatus, errorThrown);
        }
    });
}

/**
 * 取得會員下一個等級資料
 */
function getNextLevelData(ASYNC_SETTING = true) {
    // 前置函式
    if (typeof preGetNextLevelData.fn === 'function') {
        preGetNextLevelData.fn.call(preGetNextLevelData.context);
    }
    let AJAX_URL = '/game/farm/' + Game_ID + '/getnextleveldata';
    let AJAX_METHOD = 'GET';
    $.ajax({
        url: AJAX_URL, // 網址
        type: AJAX_METHOD, // 使用 GET 傳送
        data: { sn: ACCOUNT_SN },
        cache: false,
        async: ASYNC_SETTING, // 非同步設定(true/false)
        success: function(result) { // 傳送成功的 function
            console.log('--getNextLevelData start--');
            console.log(result);
            console.log('--getNextLevelData end--');
            if (result.flag == 'success') {
                NextLevelData = result.next_level_data;

                if (typeof successGetNextLevelData.fn === 'function') {
                    successGetNextLevelData.fn.call(successGetNextLevelData.context);
                }
                return;
            } else if (result.flag == 'timeout') {
                timeOutEvent(showErrorModal, '', AJAX_URL, AJAX_METHOD);
            } else {
                // 失敗畫面(跳回首頁)
                recordGoogleSheet(showErrorModal, result.msg, AJAX_URL, AJAX_METHOD);
            }
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {
            recordGoogleSheet(showErrorModal, '載入失敗', AJAX_URL, AJAX_METHOD, '', textStatus, errorThrown);
        }
    });
}

/**
 * 限時獎勵資料
 */
function getGiftData(ASYNC_SETTING = true) {
    // 前置函式
    if (typeof preGetGiftData.fn === 'function') {
        preGetGiftData.fn.call(preGetGiftData.context);
    }
    let AJAX_URL = '/game/farm/' + Game_ID + '/getgiftdata';
    let AJAX_METHOD = 'GET';
    $.ajax({
        url: AJAX_URL, // 網址
        type: AJAX_METHOD, // 使用 GET 傳送
        data: { sn: ACCOUNT_SN },
        cache: false,
        async: ASYNC_SETTING, // 非同步設定(true/false)
        success: function(result) { // 傳送成功的 function
            console.log('--getGiftData start--');
            console.log(result);
            console.log('--getGiftData end--');
            if (result.flag == 'success') {
                GiftData = result.gift_data;
                // 圖片轉base64 (120x100)
                for (let i = 0; i < GiftData.length; i++) {
                    SetGiftPicture(GiftData.length, GiftData[i].id, GiftData[i].picture);
                }
                if (typeof successGetGiftData.fn === 'function') {
                    successGetGiftData.fn.call(successGetGiftData.context);
                }
                return;
            } else if (result.flag == 'timeout') {
                timeOutEvent(showErrorModal, '', AJAX_URL, AJAX_METHOD);
            } else {
                // 失敗畫面(跳回首頁)
                recordGoogleSheet(showErrorModal, result.msg, AJAX_URL, AJAX_METHOD);
            }
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {
            recordGoogleSheet(showErrorModal, '載入失敗', AJAX_URL, AJAX_METHOD, '', textStatus, errorThrown);
        }
    });
}

/**
 * 兌換限時獎勵(獎勵ID)
 */
function exchangeGift(Gift_ID, ASYNC_SETTING = true) {
    // 前置函式
    if (typeof preExchangeGift.fn === 'function') {
        preExchangeGift.fn.call(preExchangeGift.context);
    }
    let AJAX_URL = '/game/farm/' + Game_ID + '/exchangegift';
    let AJAX_METHOD = 'POST';
    $.ajax({
        headers: {
            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
        }, // 權限TOKEN
        url: AJAX_URL,
        type: AJAX_METHOD,
        data: { sn: ACCOUNT_SN, gift_id: Gift_ID, seconds: PlaySeconds },
        cache: false,
        async: ASYNC_SETTING,
        success: function(result) {
            console.log('--exchangeGift start--');
            console.log(result);
            console.log('--exchangeGift end--');
            if (result.flag == 'success') {
                PlaySeconds = 0;
                ExchangeGiftResult = result;

                if (typeof successExchangeGift.fn === 'function') {
                    successExchangeGift.fn.call(successExchangeGift.context);
                }
                return;
            } else if (result.flag == 'failure') {
                recordGoogleSheet(showMessageModal, result.msg, AJAX_URL, AJAX_METHOD);

                if (typeof failureExchangeGift.fn === 'function') {
                    failureExchangeGift.fn.call(failureExchangeGift.context);
                }
            } else if (result.flag == 'timeout') {
                timeOutEvent(showErrorModal, '', AJAX_URL, AJAX_METHOD);
            } else {
                // 失敗畫面(跳回首頁)
                recordGoogleSheet(showErrorModal, result.msg, AJAX_URL, AJAX_METHOD, 'gift_id:' + Gift_ID);
            }
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {
            recordGoogleSheet(showErrorModal, '載入失敗', AJAX_URL, AJAX_METHOD, 'gift_id:' + Gift_ID, textStatus, errorThrown);
        }
    });
}

/**
 * O2兌換比例資料
 */
function getO2ExchangeData(ASYNC_SETTING = true) {
    // 前置函式
    if (typeof preGetO2ExchangeData.fn === 'function') {
        preGetO2ExchangeData.fn.call(preGetO2ExchangeData.context);
    }
    let AJAX_URL = '/game/farm/' + Game_ID + '/geto2exchangedata';
    let AJAX_METHOD = 'GET';
    $.ajax({
        url: AJAX_URL, // 網址
        type: AJAX_METHOD, // 使用 GET 傳送
        data: { sn: ACCOUNT_SN },
        cache: false,
        async: ASYNC_SETTING, // 非同步設定(true/false)
        success: function(result) { // 傳送成功的 function
            console.log('--getO2ExchangeData start--');
            console.log(result);
            console.log('--getO2ExchangeData end--');
            if (result.flag == 'success') {
                O2ExchangeData = result.o2_exchange_data;
                if (typeof successGetO2ExchangeData.fn === 'function') {
                    successGetO2ExchangeData.fn.call(successGetO2ExchangeData.context);
                }
                return;
            } else if (result.flag == 'timeout') {
                timeOutEvent(showErrorModal, '', AJAX_URL, AJAX_METHOD);
            } else {
                // 失敗畫面(跳回首頁)
                recordGoogleSheet(showErrorModal, result.msg, AJAX_URL, AJAX_METHOD);
            }
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {
            recordGoogleSheet(showErrorModal, '載入失敗', AJAX_URL, AJAX_METHOD, '', textStatus, errorThrown);
        }
    });
}

/**
 * 用 O2 購買 貓鑽
 */
function buyCatCoin(O2_POINT, ASYNC_SETTING = true) {
    // 前置函式
    if (typeof preBuyCatCoin.fn === 'function') {
        preBuyCatCoin.fn.call(preBuyCatCoin.context);
    }
    let AJAX_URL = '/game/farm/' + Game_ID + '/buycatcoin';
    let AJAX_METHOD = 'POST';
    $.ajax({
        headers: {
            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
        }, // 權限TOKEN
        url: AJAX_URL,
        type: AJAX_METHOD,
        data: { sn: ACCOUNT_SN, o2_point: O2_POINT, seconds: PlaySeconds },
        cache: false,
        async: ASYNC_SETTING,
        success: function(result) {
            console.log('--buyCatCoin start--');
            console.log(result);
            console.log('--buyCatCoin end--');
            if (result.flag == 'success') {
                MemberCatCoin = result.cat_coin;
                MemberPoint = result.o2_point;
                PlaySeconds = 0;

                if (typeof successBuyCatCoin.fn === 'function') {
                    successBuyCatCoin.fn.call(successBuyCatCoin.context);
                }
                return;
            } else if (result.flag == 'timeout') {
                timeOutEvent(showErrorModal, '', AJAX_URL, AJAX_METHOD);
            } else {
                // 失敗畫面(跳回首頁)
                recordGoogleSheet(showErrorModal, result.msg, AJAX_URL, AJAX_METHOD, 'o2_point:' + O2_POINT);
            }
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {
            recordGoogleSheet(showErrorModal, '載入失敗', AJAX_URL, AJAX_METHOD, 'o2_point:' + O2_POINT, textStatus, errorThrown);
        }
    });
}

/**
 * 用 O2 加速作物種植
 */
function doSpeedUp(O2_POINT, LOCATION, ASYNC_SETTING = true) {
    // 前置函式
    if (typeof preDoSpeedUp.fn === 'function') {
        preDoSpeedUp.fn.call(preDoSpeedUp.context);
    }
    let AJAX_URL = '/game/farm/' + Game_ID + '/speedup';
    let AJAX_METHOD = 'POST';
    $.ajax({
        headers: {
            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
        }, // 權限TOKEN
        url: AJAX_URL,
        type: AJAX_METHOD,
        data: { sn: ACCOUNT_SN, o2_point: O2_POINT, location: LOCATION, seconds: PlaySeconds },
        cache: false,
        async: ASYNC_SETTING,
        success: function(result) {
            console.log('--doSpeedUp start--');
            console.log(result);
            console.log('--doSpeedUp end--');
            if (result.flag == 'success') {
                MemberPoint = result.o2_point;
                SpeedUpSec = result.speed_up_sec;
                SpeedUpResult = result;
                PlaySeconds = 0;

                if (typeof successDoSpeedUp.fn === 'function') {
                    successDoSpeedUp.fn.call(successDoSpeedUp.context);
                }
                return;
            } else if (result.flag == 'timeout') {
                timeOutEvent(showErrorModal, '', AJAX_URL, AJAX_METHOD);
            } else {
                // 失敗畫面(跳回首頁)
                recordGoogleSheet(showErrorModal, result.msg, AJAX_URL, AJAX_METHOD, 'o2_point:' + O2_POINT + ',location:' + LOCATION);
            }
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {
            recordGoogleSheet(showErrorModal, '載入失敗', AJAX_URL, AJAX_METHOD, 'o2_point:' + O2_POINT + ',location:' + LOCATION, textStatus, errorThrown);
        }
    });
}

/**
 * 領取新手禮包
 */
function reachNewbiePrize(ASYNC_SETTING = true) {
    // 前置函式
    if (typeof preReachNewbiePrize.fn === 'function') {
        preReachNewbiePrize.fn.call(preReachNewbiePrize.context);
    }
    let AJAX_URL = '/game/farm/' + Game_ID + '/reachnewbieprize';
    let AJAX_METHOD = 'POST';
    $.ajax({
        headers: {
            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
        }, // 權限TOKEN
        url: AJAX_URL,
        type: AJAX_METHOD,
        data: { sn: ACCOUNT_SN },
        cache: false,
        async: ASYNC_SETTING,
        success: function(result) {
            console.log('--reachNewbiePrize start--');
            console.log(result);
            console.log('--reachNewbiePrize end--');
            if (result.flag == 'success') {
                NewbiePrize = result.real_release_prizes;
                if (typeof successReachNewbiePrize.fn === 'function') {
                    successReachNewbiePrize.fn.call(successReachNewbiePrize.context);
                }
                return;
            } else if (result.flag == 'timeout') {
                timeOutEvent(showErrorModal, '', AJAX_URL, AJAX_METHOD);
            } else {
                // 失敗畫面(跳回首頁)
                recordGoogleSheet(showErrorModal, result.msg, AJAX_URL, AJAX_METHOD);
            }
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {
            recordGoogleSheet(showErrorModal, '載入失敗', AJAX_URL, AJAX_METHOD, '', textStatus, errorThrown);
        }
    });
}

/**
 * 計時開始 呼叫時機：進入遊戲後第一次點擊
 */
function timingStart() {
    // 重置(避免之前的沒關掉，會變成有兩個時鐘在計時)
    clearInterval(GamePlayTimer);
    clearInterval(GameIdleTimer);
    TotalPlaySeconds = 0;
    PlaySeconds = 0;
    IdleSeconds = 0;
    // 計時(遊玩秒數++)
    GamePlayTimer = window.setInterval(timeCheck, 1000);
}

/**
 * 計時結束 呼叫時機：Game Over
 */
function timingStop() {
    clearInterval(GamePlayTimer);
    clearInterval(GameIdleTimer);
}

/**
 * 計時暫停 呼叫時機：暫停
 */
function timingIdle() {
    // 重置(避免之前的沒關掉，會變成有兩個時鐘在計時)
    clearInterval(GamePlayTimer);
    clearInterval(GameIdleTimer);
    // 計時(暫停秒數++)
    GameIdleTimer = window.setInterval(function() {
        IdleSeconds++;
    }, 1000);
}

/**
 * 計時恢復 呼叫時機：結束暫停，繼續遊戲
 */
function timingResume() {
    // 重置(避免之前的沒關掉，會變成有兩個時鐘在計時)
    clearInterval(GamePlayTimer);
    clearInterval(GameIdleTimer);
    // 計時(遊玩秒數++)
    GamePlayTimer = window.setInterval(timeCheck, 1000);
}

/**
 * 計時 + 逾時判斷
 */
function timeCheck() {
    // 閒置60秒->連線逾時
    if (TimeOutFlag && IdleSeconds > 60) {
        timeOutEvent(showReloadModal, '連線逾時');
    }
    TotalPlaySeconds++;
    PlaySeconds++;

    // 連線100分鐘，刷新token
    if (TotalPlaySeconds > 6000) {
        TotalPlaySeconds = 0;
        $.ajax({
            headers: {
                'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
            }, // 權限TOKEN
            url: '/game/farm/refeshtoken',
            type: 'POST',
            cache: false,
            async: true,
            success: function(result) {
                console.log('--refeshToken start--');
                console.log(result);
                console.log('--refeshToken end--');
                if (result.flag == 'success') {
                    $('meta[name="csrf-token"]').attr('content', result.token);
                }
            },
            error: function(XMLHttpRequest, textStatus, errorThrown) {
                recordGoogleSheet(showReloadModal, '資料刷新失敗，連線逾時', '/game/farm/refeshtoken', 'POST');
            }
        });
    }
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
        // $.get('/game/board/' + Game_ID, function(data) {
        $.get('/game/farm/' + Game_ID + '/board', function(data) {
            ShowBoardFlag = true;

            // 彈出窗出現前的執行動作(關閉按鈕功能)
            if (typeof preShowDialog.fn === 'function') {
                preShowDialog.fn.call(preShowDialog.context);
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
        if (typeof preShowDialog.fn === 'function') {
            preShowDialog.fn.call(preShowDialog.context);
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

$(function() {
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

        if (nextStep == 'gotoindex') {
            // 回首頁
            window.location.href = '/';
        } else if (nextStep == 'back') {
            // 回上一頁(原post改成get頁面後此功能可能因沒有上一頁而失敗)
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
                    url: '/game/farm/' + Game_ID + '/sharedviafb', // 網址
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
        url: '/game/farm/' + Game_ID + '/sharedvialine', // 網址
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

function timeOutEvent(FUNCTION_NAME, MESSAGE = '', AJAX_URL = '', AJAX_METHOD = '') {
    if (typeof errorTimeOut.fn === 'function') {
        errorTimeOut.fn.call(errorTimeOut.context);
    } else {
        if (MESSAGE == '') {
            MESSAGE = '連線逾時，或者已在別的裝置重複登入';
        }
        // 失敗畫面(跳回首頁)
        recordGoogleSheet(FUNCTION_NAME, MESSAGE, AJAX_URL, AJAX_METHOD);
    }
}

/**
 * 跳出訊息框(繼續遊玩)
 */
function showMessageModal(MESSAGE, RESPONSE = '') {
    dialogTemplete('提示', MESSAGE, '關閉後遊戲將繼續執行');
}

/**
 * 跳出訊息框(回首頁)
 */
function showErrorModal(MESSAGE, RESPONSE = '') {
    dialogTemplete('錯誤', MESSAGE + '<br>' + RESPONSE, '關閉後將跳轉回首頁', 'gotoindex');
}

/**
 * 跳出訊息框(重新整理)
 */
function showReloadModal(MESSAGE, RESPONSE = '') {
    dialogTemplete('', MESSAGE, '關閉後頁面將重新整理', 'reload');
}

/**
 * 跳出訊息框(重新整理)
 */
function recordGoogleSheet(FUNCTION_NAME, MESSAGE = '', AJAX_URL = '', AJAX_METHOD = '', AJAX_DATA = '', GOOGLE_ERROR_MSG1 = '', GOOGLE_ERROR_MSG2 = '') {
    // 在Google Sheet上紀錄錯誤資料
    $.get("https://script.google.com/macros/s/AKfycbyObJ759ur91bHsZh15rxc9k9NhK7nTSaHd5XZblJLhbwgWF016/exec", {
            account: ACCOUNT_ID,
            gameid: Game_ID,
            sn: ACCOUNT_SN,
            url: AJAX_URL,
            method: AJAX_METHOD,
            access_data: AJAX_DATA,
            errormsg: '[' + MESSAGE + ']' + GOOGLE_ERROR_MSG1 + (GOOGLE_ERROR_MSG2 ? ('->' + GOOGLE_ERROR_MSG2) : '')
        })
        .done(function(RESPONSE) {
            FUNCTION_NAME(MESSAGE, RESPONSE);
        });
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
    // if (NEXTSTEP == 'gotoindex' && (ACCOUNT_ID || ACCOUNT_SN || PlayScore)) {
    //     str += '<div class="playerinfo">玩家資料：<span>ID(' + ACCOUNT_ID + ')</span> | <span>SN(' + ACCOUNT_SN + ')</span> | <sapn>SCORE(' + PlayScore + ')</sapn></div>';
    // }
    str += '<hr><h6>' + NOTES + '</h6><button class="closeDialogTempleteBtn" data-next="' + NEXTSTEP + '">關閉</button></div>';

    // 彈出窗出現前的執行動作(關閉按鈕功能)
    if (typeof preShowDialog.fn === 'function') {
        preShowDialog.fn.call(preShowDialog.context);
    }
    // 插入訊息彈出窗
    $('#dialog').html(str);
    $('#dialogBg').fadeIn(300);
    $('#dialog').removeAttr('class').addClass('animated bounceIn').fadeIn();
    $('html').css('overflow-x', 'hidden');
    $('html').css('overflow-y', 'hidden');
}

// 玩家大頭圖 - 使用Canvas修改圖片Size為 75x75
function SetAccountPicture(src, width = 75, height = 75) {
    let image = new Image();
    // 避免垮域存取圖片發生錯誤(Facebook、Google帳號圖片)
    // 參考 https://stackoverflow.com/questions/20424279/canvas-todataurl-securityerror
    image.setAttribute("crossOrigin", 'Anonymous');
    image.onload = function() {
        let canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        let ctx = canvas.getContext("2d");
        // 轉base64時透明背景變成黑色修正成白色
        ctx.fillStyle = "#fff";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
        ACCOUNT_PIC = canvas.toDataURL("image/jpeg", 0.92);
        // ACCOUNT_PIC 設定完成後呼叫
        if (typeof successSetAccountPicture.fn === 'function') {
            successSetAccountPicture.fn.call(successSetAccountPicture.context);
        }
    };
    image.src = src;
    // 圖片載入失敗 (404)
    image.onerror = function() {
        ACCOUNT_PIC = null;
    }
}

// 限時獎勵圖 - 使用Canvas修改圖片Size為 120 x 100
function SetGiftPicture(gift_count, gift_id, src, width = 120, height = 100) {
    if (GiftPics[gift_id] !== undefined) {
        return;
    }
    let image = new Image();
    image.onload = function() {
        let canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        let ctx = canvas.getContext("2d");
        // 轉base64時透明背景變成黑色修正成白色
        ctx.fillStyle = "#fff";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        // 把圖片縮到最小邊的長度100x100 & X軸位移10讓圖片置中
        ctx.drawImage(image, 10, 0, 100, 100);
        // 限時獎勵照片陣列
        GiftPics[gift_id] = canvas.toDataURL("image/jpeg", 0.92);

        if (Object.keys(GiftPics).length == gift_count) {
            if (typeof successSetGiftPicture.fn === 'function') {
                successSetGiftPicture.fn.call(successSetGiftPicture.context);
            }
        }
    };
    image.src = src;
    // 圖片載入失敗 (404)
    image.onerror = function() {
        GiftPics[gift_id] = null;

        if (Object.keys(GiftPics).length == gift_count) {
            if (typeof successSetGiftPicture.fn === 'function') {
                successSetGiftPicture.fn.call(successSetGiftPicture.context);
            }
        }
    }
}

/**
 *  ajax前置後置functions變數內容指定
 **/
function SetPreEntranceData(assignFunction, context = this) {
    Object.defineProperty(preEntranceData, 'fn', {
        value: assignFunction,
        writable: true,
        enumerable: true,
        configurable: true,
    });
    Object.defineProperty(preEntranceData, 'context', {
        value: context,
        writable: true,
        enumerable: true,
        configurable: true,
    });

}

function SetSuccessEntranceData(assignFunction, context = this) {
    Object.defineProperty(successEntranceData, 'fn', {
        value: assignFunction,
        writable: true,
        enumerable: true,
        configurable: true,
    });
    Object.defineProperty(successEntranceData, 'context', {
        value: context,
        writable: true,
        enumerable: true,
        configurable: true,
    });
}

function SetPreSnData(assignFunction, context = this) {
    Object.defineProperty(preSnData, 'fn', {
        value: assignFunction,
        writable: true,
        enumerable: true,
        configurable: true,
    });
    Object.defineProperty(preSnData, 'context', {
        value: context,
        writable: true,
        enumerable: true,
        configurable: true,
    });

}

function SetSuccessSnData(assignFunction, context = this) {
    Object.defineProperty(successSnData, 'fn', {
        value: assignFunction,
        writable: true,
        enumerable: true,
        configurable: true,
    });
    Object.defineProperty(successSnData, 'context', {
        value: context,
        writable: true,
        enumerable: true,
        configurable: true,
    });
}

function SetPreRefreshDailyData(assignFunction, context = this) {
    Object.defineProperty(preRefreshDailyData, 'fn', {
        value: assignFunction,
        writable: true,
        enumerable: true,
        configurable: true,
    });
    Object.defineProperty(preRefreshDailyData, 'context', {
        value: context,
        writable: true,
        enumerable: true,
        configurable: true,
    });

}

function SetSuccessRefreshDailyData(assignFunction, context = this) {
    Object.defineProperty(successRefreshDailyData, 'fn', {
        value: assignFunction,
        writable: true,
        enumerable: true,
        configurable: true,
    });
    Object.defineProperty(successRefreshDailyData, 'context', {
        value: context,
        writable: true,
        enumerable: true,
        configurable: true,
    });
}

function SetPreGetLevelData(assignFunction, context = this) {
    Object.defineProperty(preGetLevelData, 'fn', {
        value: assignFunction,
        writable: true,
        enumerable: true,
        configurable: true,
    });
    Object.defineProperty(preGetLevelData, 'context', {
        value: context,
        writable: true,
        enumerable: true,
        configurable: true,
    });
}

function SetSuccessGetLevelData(assignFunction, context = this) {
    Object.defineProperty(successGetLevelData, 'fn', {
        value: assignFunction,
        writable: true,
        enumerable: true,
        configurable: true,
    });
    Object.defineProperty(successGetLevelData, 'context', {
        value: context,
        writable: true,
        enumerable: true,
        configurable: true,
    });
}

function SetPreGetPlantData(assignFunction, context = this) {
    Object.defineProperty(preGetPlantData, 'fn', {
        value: assignFunction,
        writable: true,
        enumerable: true,
        configurable: true,
    });
    Object.defineProperty(preGetPlantData, 'context', {
        value: context,
        writable: true,
        enumerable: true,
        configurable: true,
    });
}

function SetSuccessGetPlantData(assignFunction, context = this) {
    Object.defineProperty(successGetPlantData, 'fn', {
        value: assignFunction,
        writable: true,
        enumerable: true,
        configurable: true,
    });
    Object.defineProperty(successGetPlantData, 'context', {
        value: context,
        writable: true,
        enumerable: true,
        configurable: true,
    });
}

function SetPreDoPlantSeed(assignFunction, context = this) {
    Object.defineProperty(preDoPlantSeed, 'fn', {
        value: assignFunction,
        writable: true,
        enumerable: true,
        configurable: true,
    });
    Object.defineProperty(preDoPlantSeed, 'context', {
        value: context,
        writable: true,
        enumerable: true,
        configurable: true,
    });
}

function SetSuccessDoPlantSeed(assignFunction, context = this) {
    Object.defineProperty(successDoPlantSeed, 'fn', {
        value: assignFunction,
        writable: true,
        enumerable: true,
        configurable: true,
    });
    Object.defineProperty(successDoPlantSeed, 'context', {
        value: context,
        writable: true,
        enumerable: true,
        configurable: true,
    });
}

function SetPreDoHarvest(assignFunction, context = this) {
    Object.defineProperty(preDoHarvest, 'fn', {
        value: assignFunction,
        writable: true,
        enumerable: true,
        configurable: true,
    });
    Object.defineProperty(preDoHarvest, 'context', {
        value: context,
        writable: true,
        enumerable: true,
        configurable: true,
    });
}

function SetSuccessDoHarvest(assignFunction, context = this) {
    Object.defineProperty(successDoHarvest, 'fn', {
        value: assignFunction,
        writable: true,
        enumerable: true,
        configurable: true,
    });
    Object.defineProperty(successDoHarvest, 'context', {
        value: context,
        writable: true,
        enumerable: true,
        configurable: true,
    });
}

function SetPreSellPlant(assignFunction, context = this) {
    Object.defineProperty(preSellPlant, 'fn', {
        value: assignFunction,
        writable: true,
        enumerable: true,
        configurable: true,
    });
    Object.defineProperty(preSellPlant, 'context', {
        value: context,
        writable: true,
        enumerable: true,
        configurable: true,
    });
}

function SetSuccessSellPlant(assignFunction, context = this) {
    Object.defineProperty(successSellPlant, 'fn', {
        value: assignFunction,
        writable: true,
        enumerable: true,
        configurable: true,
    });
    Object.defineProperty(successSellPlant, 'context', {
        value: context,
        writable: true,
        enumerable: true,
        configurable: true,
    });
}

function SetPreSellProp(assignFunction, context = this) {
    Object.defineProperty(preSellProp, 'fn', {
        value: assignFunction,
        writable: true,
        enumerable: true,
        configurable: true,
    });
    Object.defineProperty(preSellProp, 'context', {
        value: context,
        writable: true,
        enumerable: true,
        configurable: true,
    });
}

function SetSuccessSellProp(assignFunction, context = this) {
    Object.defineProperty(successSellProp, 'fn', {
        value: assignFunction,
        writable: true,
        enumerable: true,
        configurable: true,
    });
    Object.defineProperty(successSellProp, 'context', {
        value: context,
        writable: true,
        enumerable: true,
        configurable: true,
    });
}

function SetPreGetPropData(assignFunction, context = this) {
    Object.defineProperty(preGetPropData, 'fn', {
        value: assignFunction,
        writable: true,
        enumerable: true,
        configurable: true,
    });
    Object.defineProperty(preGetPropData, 'context', {
        value: context,
        writable: true,
        enumerable: true,
        configurable: true,
    });
}

function SetSuccessGetPropData(assignFunction, context = this) {
    Object.defineProperty(successGetPropData, 'fn', {
        value: assignFunction,
        writable: true,
        enumerable: true,
        configurable: true,
    });
    Object.defineProperty(successGetPropData, 'context', {
        value: context,
        writable: true,
        enumerable: true,
        configurable: true,
    });
}

function SetPreBuyProp(assignFunction, context = this) {
    Object.defineProperty(preBuyProp, 'fn', {
        value: assignFunction,
        writable: true,
        enumerable: true,
        configurable: true,
    });
    Object.defineProperty(preBuyProp, 'context', {
        value: context,
        writable: true,
        enumerable: true,
        configurable: true,
    });
}

function SetSuccessBuyProp(assignFunction, context = this) {
    Object.defineProperty(successBuyProp, 'fn', {
        value: assignFunction,
        writable: true,
        enumerable: true,
        configurable: true,
    });
    Object.defineProperty(successBuyProp, 'context', {
        value: context,
        writable: true,
        enumerable: true,
        configurable: true,
    });
}

function SetPreBuySeed(assignFunction, context = this) {
    Object.defineProperty(preBuySeed, 'fn', {
        value: assignFunction,
        writable: true,
        enumerable: true,
        configurable: true,
    });
    Object.defineProperty(preBuySeed, 'context', {
        value: context,
        writable: true,
        enumerable: true,
        configurable: true,
    });
}

function SetSuccessBuySeed(assignFunction, context = this) {
    Object.defineProperty(successBuySeed, 'fn', {
        value: assignFunction,
        writable: true,
        enumerable: true,
        configurable: true,
    });
    Object.defineProperty(successBuySeed, 'context', {
        value: context,
        writable: true,
        enumerable: true,
        configurable: true,
    });
}

function SetPreBuyLand(assignFunction, context = this) {
    Object.defineProperty(preBuyLand, 'fn', {
        value: assignFunction,
        writable: true,
        enumerable: true,
        configurable: true,
    });
    Object.defineProperty(preBuyLand, 'context', {
        value: context,
        writable: true,
        enumerable: true,
        configurable: true,
    });
}

function SetSuccessBuyLand(assignFunction, context = this) {
    Object.defineProperty(successBuyLand, 'fn', {
        value: assignFunction,
        writable: true,
        enumerable: true,
        configurable: true,
    });
    Object.defineProperty(successBuyLand, 'context', {
        value: context,
        writable: true,
        enumerable: true,
        configurable: true,
    });
}

function SetPreBuyWarehouse(assignFunction, context = this) {
    Object.defineProperty(preBuyWarehouse, 'fn', {
        value: assignFunction,
        writable: true,
        enumerable: true,
        configurable: true,
    });
    Object.defineProperty(preBuyWarehouse, 'context', {
        value: context,
        writable: true,
        enumerable: true,
        configurable: true,
    });
}

function SetSuccessBuyWarehouse(assignFunction, context = this) {
    Object.defineProperty(successBuyWarehouse, 'fn', {
        value: assignFunction,
        writable: true,
        enumerable: true,
        configurable: true,
    });
    Object.defineProperty(successBuyWarehouse, 'context', {
        value: context,
        writable: true,
        enumerable: true,
        configurable: true,
    });
}

function SetPreUseProp(assignFunction, context = this) {
    Object.defineProperty(preUseProp, 'fn', {
        value: assignFunction,
        writable: true,
        enumerable: true,
        configurable: true,
    });
    Object.defineProperty(preUseProp, 'context', {
        value: context,
        writable: true,
        enumerable: true,
        configurable: true,
    });
}

function SetSuccessUseProp(assignFunction, context = this) {
    Object.defineProperty(successUseProp, 'fn', {
        value: assignFunction,
        writable: true,
        enumerable: true,
        configurable: true,
    });
    Object.defineProperty(successUseProp, 'context', {
        value: context,
        writable: true,
        enumerable: true,
        configurable: true,
    });
}

function SetPreGetLandData(assignFunction, context = this) {
    Object.defineProperty(preGetLandData, 'fn', {
        value: assignFunction,
        writable: true,
        enumerable: true,
        configurable: true,
    });
    Object.defineProperty(preGetLandData, 'context', {
        value: context,
        writable: true,
        enumerable: true,
        configurable: true,
    });
}

function SetSuccessGetLandData(assignFunction, context = this) {
    Object.defineProperty(successGetLandData, 'fn', {
        value: assignFunction,
        writable: true,
        enumerable: true,
        configurable: true,
    });
    Object.defineProperty(successGetLandData, 'context', {
        value: context,
        writable: true,
        enumerable: true,
        configurable: true,
    });
}

function SetPreGetWarehouseData(assignFunction, context = this) {
    Object.defineProperty(preGetWarehouseData, 'fn', {
        value: assignFunction,
        writable: true,
        enumerable: true,
        configurable: true,
    });
    Object.defineProperty(preGetWarehouseData, 'context', {
        value: context,
        writable: true,
        enumerable: true,
        configurable: true,
    });
}

function SetSuccessGetWarehouseData(assignFunction, context = this) {
    Object.defineProperty(successGetWarehouseData, 'fn', {
        value: assignFunction,
        writable: true,
        enumerable: true,
        configurable: true,
    });
    Object.defineProperty(successGetWarehouseData, 'context', {
        value: context,
        writable: true,
        enumerable: true,
        configurable: true,
    });
}

function SetPreGetAchieveData(assignFunction, context = this) {
    Object.defineProperty(preGetAchieveData, 'fn', {
        value: assignFunction,
        writable: true,
        enumerable: true,
        configurable: true,
    });
    Object.defineProperty(preGetAchieveData, 'context', {
        value: context,
        writable: true,
        enumerable: true,
        configurable: true,
    });
}

function SetSuccessGetAchieveData(assignFunction, context = this) {
    Object.defineProperty(successGetAchieveData, 'fn', {
        value: assignFunction,
        writable: true,
        enumerable: true,
        configurable: true,
    });
    Object.defineProperty(successGetAchieveData, 'context', {
        value: context,
        writable: true,
        enumerable: true,
        configurable: true,
    });
}

function SetPreReachAchieve(assignFunction, context = this) {
    Object.defineProperty(preReachAchieve, 'fn', {
        value: assignFunction,
        writable: true,
        enumerable: true,
        configurable: true,
    });
    Object.defineProperty(preReachAchieve, 'context', {
        value: context,
        writable: true,
        enumerable: true,
        configurable: true,
    });
}

function SetSuccessReachAchieve(assignFunction, context = this) {
    Object.defineProperty(successReachAchieve, 'fn', {
        value: assignFunction,
        writable: true,
        enumerable: true,
        configurable: true,
    });
    Object.defineProperty(successReachAchieve, 'context', {
        value: context,
        writable: true,
        enumerable: true,
        configurable: true,
    });
}

function SetPreGetMemberWallet(assignFunction, context = this) {
    Object.defineProperty(preGetMemberWallet, 'fn', {
        value: assignFunction,
        writable: true,
        enumerable: true,
        configurable: true,
    });
    Object.defineProperty(preGetMemberWallet, 'context', {
        value: context,
        writable: true,
        enumerable: true,
        configurable: true,
    });
}

function SetSuccessGetMemberWallet(assignFunction, context = this) {
    Object.defineProperty(successGetMemberWallet, 'fn', {
        value: assignFunction,
        writable: true,
        enumerable: true,
        configurable: true,
    });
    Object.defineProperty(successGetMemberWallet, 'context', {
        value: context,
        writable: true,
        enumerable: true,
        configurable: true,
    });
}

function SetPreGetSeedStock(assignFunction, context = this) {
    Object.defineProperty(preGetSeedStock, 'fn', {
        value: assignFunction,
        writable: true,
        enumerable: true,
        configurable: true,
    });
    Object.defineProperty(preGetSeedStock, 'context', {
        value: context,
        writable: true,
        enumerable: true,
        configurable: true,
    });
}

function SetSuccessGetSeedStock(assignFunction, context = this) {
    Object.defineProperty(successGetSeedStock, 'fn', {
        value: assignFunction,
        writable: true,
        enumerable: true,
        configurable: true,
    });
    Object.defineProperty(successGetSeedStock, 'context', {
        value: context,
        writable: true,
        enumerable: true,
        configurable: true,
    });
}

function SetPreGetPlantStock(assignFunction, context = this) {
    Object.defineProperty(preGetPlantStock, 'fn', {
        value: assignFunction,
        writable: true,
        enumerable: true,
        configurable: true,
    });
    Object.defineProperty(preGetPlantStock, 'context', {
        value: context,
        writable: true,
        enumerable: true,
        configurable: true,
    });
}

function SetSuccessGetPlantStock(assignFunction, context = this) {
    Object.defineProperty(successGetPlantStock, 'fn', {
        value: assignFunction,
        writable: true,
        enumerable: true,
        configurable: true,
    });
    Object.defineProperty(successGetPlantStock, 'context', {
        value: context,
        writable: true,
        enumerable: true,
        configurable: true,
    });
}

function SetPreGetPropStock(assignFunction, context = this) {
    Object.defineProperty(preGetPropStock, 'fn', {
        value: assignFunction,
        writable: true,
        enumerable: true,
        configurable: true,
    });
    Object.defineProperty(preGetPropStock, 'context', {
        value: context,
        writable: true,
        enumerable: true,
        configurable: true,
    });
}

function SetSuccessGetPropStock(assignFunction, context = this) {
    Object.defineProperty(successGetPropStock, 'fn', {
        value: assignFunction,
        writable: true,
        enumerable: true,
        configurable: true,
    });
    Object.defineProperty(successGetPropStock, 'context', {
        value: context,
        writable: true,
        enumerable: true,
        configurable: true,
    });
}

function SetPreGetPartnerData(assignFunction, context = this) {
    Object.defineProperty(preGetPartnerData, 'fn', {
        value: assignFunction,
        writable: true,
        enumerable: true,
        configurable: true,
    });
    Object.defineProperty(preGetPartnerData, 'context', {
        value: context,
        writable: true,
        enumerable: true,
        configurable: true,
    });
}

function SetSuccessGetPartnerData(assignFunction, context = this) {
    Object.defineProperty(successGetPartnerData, 'fn', {
        value: assignFunction,
        writable: true,
        enumerable: true,
        configurable: true,
    });
    Object.defineProperty(successGetPartnerData, 'context', {
        value: context,
        writable: true,
        enumerable: true,
        configurable: true,
    });
}

function SetPreClickPartner(assignFunction, context = this) {
    Object.defineProperty(preClickPartner, 'fn', {
        value: assignFunction,
        writable: true,
        enumerable: true,
        configurable: true,
    });
    Object.defineProperty(preClickPartner, 'context', {
        value: context,
        writable: true,
        enumerable: true,
        configurable: true,
    });
}

function SetSuccessClickPartner(assignFunction, context = this) {
    Object.defineProperty(successClickPartner, 'fn', {
        value: assignFunction,
        writable: true,
        enumerable: true,
        configurable: true,
    });
    Object.defineProperty(successClickPartner, 'context', {
        value: context,
        writable: true,
        enumerable: true,
        configurable: true,
    });
}

function SetPreRecyclePartner(assignFunction, context = this) {
    Object.defineProperty(preRecyclePartner, 'fn', {
        value: assignFunction,
        writable: true,
        enumerable: true,
        configurable: true,
    });
    Object.defineProperty(preRecyclePartner, 'context', {
        value: context,
        writable: true,
        enumerable: true,
        configurable: true,
    });
}

function SetSuccessRecyclePartner(assignFunction, context = this) {
    Object.defineProperty(successRecyclePartner, 'fn', {
        value: assignFunction,
        writable: true,
        enumerable: true,
        configurable: true,
    });
    Object.defineProperty(successRecyclePartner, 'context', {
        value: context,
        writable: true,
        enumerable: true,
        configurable: true,
    });
}

function SetPreUnlockPartner(assignFunction, context = this) {
    Object.defineProperty(preUnlockPartner, 'fn', {
        value: assignFunction,
        writable: true,
        enumerable: true,
        configurable: true,
    });
    Object.defineProperty(preUnlockPartner, 'context', {
        value: context,
        writable: true,
        enumerable: true,
        configurable: true,
    });
}

function SetSuccessUnlockPartner(assignFunction, context = this) {
    Object.defineProperty(successUnlockPartner, 'fn', {
        value: assignFunction,
        writable: true,
        enumerable: true,
        configurable: true,
    });
    Object.defineProperty(successUnlockPartner, 'context', {
        value: context,
        writable: true,
        enumerable: true,
        configurable: true,
    });
}

function SetPreGetSignInData(assignFunction, context = this) {
    Object.defineProperty(preGetSignInData, 'fn', {
        value: assignFunction,
        writable: true,
        enumerable: true,
        configurable: true,
    });
    Object.defineProperty(preGetSignInData, 'context', {
        value: context,
        writable: true,
        enumerable: true,
        configurable: true,
    });
}

function SetSuccessGetSignInData(assignFunction, context = this) {
    Object.defineProperty(successGetSignInData, 'fn', {
        value: assignFunction,
        writable: true,
        enumerable: true,
        configurable: true,
    });
    Object.defineProperty(successGetSignInData, 'context', {
        value: context,
        writable: true,
        enumerable: true,
        configurable: true,
    });
}

function SetPreReachSignIn(assignFunction, context = this) {
    Object.defineProperty(preReachSignIn, 'fn', {
        value: assignFunction,
        writable: true,
        enumerable: true,
        configurable: true,
    });
    Object.defineProperty(preReachSignIn, 'context', {
        value: context,
        writable: true,
        enumerable: true,
        configurable: true,
    });
}

function SetSuccessReachSignIn(assignFunction, context = this) {
    Object.defineProperty(successReachSignIn, 'fn', {
        value: assignFunction,
        writable: true,
        enumerable: true,
        configurable: true,
    });
    Object.defineProperty(successReachSignIn, 'context', {
        value: context,
        writable: true,
        enumerable: true,
        configurable: true,
    });
}

function SetPreGetDailyMissionData(assignFunction, context = this) {
    Object.defineProperty(preGetDailyMissionData, 'fn', {
        value: assignFunction,
        writable: true,
        enumerable: true,
        configurable: true,
    });
    Object.defineProperty(preGetDailyMissionData, 'context', {
        value: context,
        writable: true,
        enumerable: true,
        configurable: true,
    });
}

function SetSuccessGetDailyMissionData(assignFunction, context = this) {
    Object.defineProperty(successGetDailyMissionData, 'fn', {
        value: assignFunction,
        writable: true,
        enumerable: true,
        configurable: true,
    });
    Object.defineProperty(successGetDailyMissionData, 'context', {
        value: context,
        writable: true,
        enumerable: true,
        configurable: true,
    });
}

function SetPreReachDailyMission(assignFunction, context = this) {
    Object.defineProperty(preReachDailyMission, 'fn', {
        value: assignFunction,
        writable: true,
        enumerable: true,
        configurable: true,
    });
    Object.defineProperty(preReachDailyMission, 'context', {
        value: context,
        writable: true,
        enumerable: true,
        configurable: true,
    });
}

function SetSuccessReachDailyMission(assignFunction, context = this) {
    Object.defineProperty(successReachDailyMission, 'fn', {
        value: assignFunction,
        writable: true,
        enumerable: true,
        configurable: true,
    });
    Object.defineProperty(successReachDailyMission, 'context', {
        value: context,
        writable: true,
        enumerable: true,
        configurable: true,
    });
}

function SetPreGetScoreBoxData(assignFunction, context = this) {
    Object.defineProperty(preGetScoreBoxData, 'fn', {
        value: assignFunction,
        writable: true,
        enumerable: true,
        configurable: true,
    });
    Object.defineProperty(preGetScoreBoxData, 'context', {
        value: context,
        writable: true,
        enumerable: true,
        configurable: true,
    });
}

function SetSuccessGetScoreBoxData(assignFunction, context = this) {
    Object.defineProperty(successGetScoreBoxData, 'fn', {
        value: assignFunction,
        writable: true,
        enumerable: true,
        configurable: true,
    });
    Object.defineProperty(successGetScoreBoxData, 'context', {
        value: context,
        writable: true,
        enumerable: true,
        configurable: true,
    });
}

function SetPreReachScoreBox(assignFunction, context = this) {
    Object.defineProperty(preReachScoreBox, 'fn', {
        value: assignFunction,
        writable: true,
        enumerable: true,
        configurable: true,
    });
    Object.defineProperty(preReachScoreBox, 'context', {
        value: context,
        writable: true,
        enumerable: true,
        configurable: true,
    });
}

function SetSuccessReachScoreBox(assignFunction, context = this) {
    Object.defineProperty(successReachScoreBox, 'fn', {
        value: assignFunction,
        writable: true,
        enumerable: true,
        configurable: true,
    });
    Object.defineProperty(successReachScoreBox, 'context', {
        value: context,
        writable: true,
        enumerable: true,
        configurable: true,
    });
}

function SetPreGetNextLevelData(assignFunction, context = this) {
    Object.defineProperty(preGetNextLevelData, 'fn', {
        value: assignFunction,
        writable: true,
        enumerable: true,
        configurable: true,
    });
    Object.defineProperty(preGetNextLevelData, 'context', {
        value: context,
        writable: true,
        enumerable: true,
        configurable: true,
    });
}

function SetSuccessGetNextLevelData(assignFunction, context = this) {
    Object.defineProperty(successGetNextLevelData, 'fn', {
        value: assignFunction,
        writable: true,
        enumerable: true,
        configurable: true,
    });
    Object.defineProperty(successGetNextLevelData, 'context', {
        value: context,
        writable: true,
        enumerable: true,
        configurable: true,
    });
}

function SetPreGetGiftData(assignFunction, context = this) {
    Object.defineProperty(preGetGiftData, 'fn', {
        value: assignFunction,
        writable: true,
        enumerable: true,
        configurable: true,
    });
    Object.defineProperty(preGetGiftData, 'context', {
        value: context,
        writable: true,
        enumerable: true,
        configurable: true,
    });
}

function SetSuccessGetGiftData(assignFunction, context = this) {
    Object.defineProperty(successGetGiftData, 'fn', {
        value: assignFunction,
        writable: true,
        enumerable: true,
        configurable: true,
    });
    Object.defineProperty(successGetGiftData, 'context', {
        value: context,
        writable: true,
        enumerable: true,
        configurable: true,
    });
}

function SetSuccessSetGiftPicture(assignFunction, context = this) {
    Object.defineProperty(successSetGiftPicture, 'fn', {
        value: assignFunction,
        writable: true,
        enumerable: true,
        configurable: true,
    });
    Object.defineProperty(successSetGiftPicture, 'context', {
        value: context,
        writable: true,
        enumerable: true,
        configurable: true,
    });
}

function SetPreExchangeGift(assignFunction, context = this) {
    Object.defineProperty(preExchangeGift, 'fn', {
        value: assignFunction,
        writable: true,
        enumerable: true,
        configurable: true,
    });
    Object.defineProperty(preExchangeGift, 'context', {
        value: context,
        writable: true,
        enumerable: true,
        configurable: true,
    });
}

function SetSuccessExchangeGift(assignFunction, context = this) {
    Object.defineProperty(successExchangeGift, 'fn', {
        value: assignFunction,
        writable: true,
        enumerable: true,
        configurable: true,
    });
    Object.defineProperty(successExchangeGift, 'context', {
        value: context,
        writable: true,
        enumerable: true,
        configurable: true,
    });
}

function SetFailureExchangeGift(assignFunction, context = this) {
    Object.defineProperty(failureExchangeGift, 'fn', {
        value: assignFunction,
        writable: true,
        enumerable: true,
        configurable: true,
    });
    Object.defineProperty(failureExchangeGift, 'context', {
        value: context,
        writable: true,
        enumerable: true,
        configurable: true,
    });
}

function SetPreGetO2ExchangeData(assignFunction, context = this) {
    Object.defineProperty(preGetO2ExchangeData, 'fn', {
        value: assignFunction,
        writable: true,
        enumerable: true,
        configurable: true,
    });
    Object.defineProperty(preGetO2ExchangeData, 'context', {
        value: context,
        writable: true,
        enumerable: true,
        configurable: true,
    });
}

function SetSuccessGetO2ExchangeData(assignFunction, context = this) {
    Object.defineProperty(successGetO2ExchangeData, 'fn', {
        value: assignFunction,
        writable: true,
        enumerable: true,
        configurable: true,
    });
    Object.defineProperty(successGetO2ExchangeData, 'context', {
        value: context,
        writable: true,
        enumerable: true,
        configurable: true,
    });
}

function SetPreBuyCatCoin(assignFunction, context = this) {
    Object.defineProperty(preBuyCatCoin, 'fn', {
        value: assignFunction,
        writable: true,
        enumerable: true,
        configurable: true,
    });
    Object.defineProperty(preBuyCatCoin, 'context', {
        value: context,
        writable: true,
        enumerable: true,
        configurable: true,
    });
}

function SetSuccessBuyCatCoin(assignFunction, context = this) {
    Object.defineProperty(successBuyCatCoin, 'fn', {
        value: assignFunction,
        writable: true,
        enumerable: true,
        configurable: true,
    });
    Object.defineProperty(successBuyCatCoin, 'context', {
        value: context,
        writable: true,
        enumerable: true,
        configurable: true,
    });
}

function SetPreDoSpeedUp(assignFunction, context = this) {
    Object.defineProperty(preDoSpeedUp, 'fn', {
        value: assignFunction,
        writable: true,
        enumerable: true,
        configurable: true,
    });
    Object.defineProperty(preDoSpeedUp, 'context', {
        value: context,
        writable: true,
        enumerable: true,
        configurable: true,
    });
}

function SetSuccessDoSpeedUp(assignFunction, context = this) {
    Object.defineProperty(successDoSpeedUp, 'fn', {
        value: assignFunction,
        writable: true,
        enumerable: true,
        configurable: true,
    });
    Object.defineProperty(successDoSpeedUp, 'context', {
        value: context,
        writable: true,
        enumerable: true,
        configurable: true,
    });
}

function SetPreReachNewbiePrize(assignFunction, context = this) {
    Object.defineProperty(preReachNewbiePrize, 'fn', {
        value: assignFunction,
        writable: true,
        enumerable: true,
        configurable: true,
    });
    Object.defineProperty(preReachNewbiePrize, 'context', {
        value: context,
        writable: true,
        enumerable: true,
        configurable: true,
    });
}

function SetSuccessReachNewbiePrize(assignFunction, context = this) {
    Object.defineProperty(successReachNewbiePrize, 'fn', {
        value: assignFunction,
        writable: true,
        enumerable: true,
        configurable: true,
    });
    Object.defineProperty(successReachNewbiePrize, 'context', {
        value: context,
        writable: true,
        enumerable: true,
        configurable: true,
    });
}

function SetSuccessAccountPicture(assignFunction, context = this) {
    Object.defineProperty(successSetAccountPicture, 'fn', {
        value: assignFunction,
        writable: true,
        enumerable: true,
        configurable: true,
    });
    Object.defineProperty(successSetAccountPicture, 'context', {
        value: context,
        writable: true,
        enumerable: true,
        configurable: true,
    });
}

function SetErrorTimeOut(assignFunction, context = this) {
    Object.defineProperty(errorTimeOut, 'fn', {
        value: assignFunction,
        writable: true,
        enumerable: true,
        configurable: true,
    });
    Object.defineProperty(errorTimeOut, 'context', {
        value: context,
        writable: true,
        enumerable: true,
        configurable: true,
    });
}

function SetPreShowDialog(assignFunction, context = this) {
    Object.defineProperty(preShowDialog, 'fn', {
        value: assignFunction,
        writable: true,
        enumerable: true,
        configurable: true,
    });
    Object.defineProperty(preShowDialog, 'context', {
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
    LevelData,
    PlantData,
    PlantPicIndexData,
    PlantIdData,
    PropData,
    PropPicIndexData,
    PropIdData,
    PartnerCategoryData,
    PartnerData,
    PartnerPicIndexData,
    PartnerIdData,
    LandData,
    WarehouseData,
    AchieveCategoryData,
    AchieveData,
    FarmerAchieveData,
    ACCOUNT_ID,
    ACCOUNT_SN,
    ACCOUNT_NAME,
    ACCOUNT_PIC,
    MemberPoint,
    MemberCatCoin,
    FarmerData,
    FarmerLands,
    FarmerWarehouse,
    FarmerPartner,
    UpdateFarmerPartner,
    SeedStock,
    PropStock,
    PlantStock,
    SigninData,
    DailyMissionData,
    NextLevelData,
    GiftData,
    GiftPics,
    O2ExchangeData,
    ScoreBoxData,
    NewFarmerPrize,
    LevelUpPrize,
    SignInPrize,
    ScoreBoxPrize,
    DailyMissionPrize,
    AchievePrize,
    GamePlayTimer,
    GameIdleTimer,
    PlaySeconds,
    IdleSeconds,
    TimeOutFlag,
    FacebookShareLink,
    FacebookShareHashtag,
    LineShareText,
    LineShareLink,
    ShowBoardFlag,
    NewLevel,
    NextSec,
    NowStage,
    HarvestResult,
    UsePropResult,
    SpeedUpSec,
    SpeedUpResult,
    doPlantSeedResult,
    UnlockPartnerResult,
    ExchangeGiftResult,
    NewbiePrize,
    MaxSignin,
    // ajax前置後置functions變數內容指定
    SetPreEntranceData,
    SetSuccessEntranceData,
    SetPreSnData,
    SetSuccessSnData,
    SetPreRefreshDailyData,
    SetSuccessRefreshDailyData,
    SetPreGetLevelData,
    SetSuccessGetLevelData,
    SetPreGetPlantData,
    SetSuccessGetPlantData,
    SetPreDoPlantSeed,
    SetSuccessDoPlantSeed,
    SetPreDoHarvest,
    SetSuccessDoHarvest,
    SetPreSellPlant,
    SetSuccessSellPlant,
    SetPreSellProp,
    SetSuccessSellProp,
    SetPreGetPropData,
    SetSuccessGetPropData,
    SetPreBuyProp,
    SetSuccessBuyProp,
    SetPreBuySeed,
    SetSuccessBuySeed,
    SetPreBuyLand,
    SetSuccessBuyLand,
    SetPreBuyWarehouse,
    SetSuccessBuyWarehouse,
    SetPreUseProp,
    SetSuccessUseProp,
    SetPreGetLandData,
    SetSuccessGetLandData,
    SetPreGetWarehouseData,
    SetSuccessGetWarehouseData,
    SetPreGetAchieveData,
    SetSuccessGetAchieveData,
    SetPreReachAchieve,
    SetSuccessReachAchieve,
    SetPreGetMemberWallet,
    SetSuccessGetMemberWallet,
    SetPreGetSeedStock,
    SetSuccessGetSeedStock,
    SetPreGetPlantStock,
    SetSuccessGetPlantStock,
    SetPreGetPropStock,
    SetSuccessGetPropStock,
    SetPreGetPartnerData,
    SetSuccessGetPartnerData,
    SetPreClickPartner,
    SetSuccessClickPartner,
    SetPreRecyclePartner,
    SetPreUnlockPartner,
    SetSuccessUnlockPartner,
    SetSuccessRecyclePartner,
    SetPreGetSignInData,
    SetSuccessGetSignInData,
    SetPreReachSignIn,
    SetSuccessReachSignIn,
    SetPreGetDailyMissionData,
    SetSuccessGetDailyMissionData,
    SetPreReachDailyMission,
    SetSuccessReachDailyMission,
    SetPreGetScoreBoxData,
    SetSuccessGetScoreBoxData,
    SetPreReachScoreBox,
    SetSuccessReachScoreBox,
    SetPreGetNextLevelData,
    SetSuccessGetNextLevelData,
    SetErrorTimeOut,
    SetPreShowDialog,
    SetCompleteCloseDialog,
    SetSuccessAccountPicture,
    SetPreGetGiftData,
    SetSuccessGetGiftData,
    SetSuccessSetGiftPicture,
    SetPreExchangeGift,
    SetSuccessExchangeGift,
    SetFailureExchangeGift,
    SetPreGetO2ExchangeData,
    SetSuccessGetO2ExchangeData,
    SetPreBuyCatCoin,
    SetSuccessBuyCatCoin,
    SetPreDoSpeedUp,
    SetSuccessDoSpeedUp,
    SetPreReachNewbiePrize,
    SetSuccessReachNewbiePrize,
    // 基礎流程functions
    entranceData,
    getSnData,
    refreshDailyData,
    getLevelData,
    getPlantData,
    buySeed,
    doPlantSeed,
    doHarvest,
    sellPlant,
    getPropData,
    buyProp,
    useProp,
    sellProp,
    getLandData,
    buyLand,
    getWarehouseData,
    buyWarehouse,
    getAchieveData,
    reachAchieve,
    getMemberWallet,
    getSeedStock,
    getPlantStock,
    getPropStock,
    getPartnerData,
    clickPartner,
    recyclePartner,
    unlockPartner,
    getSignInData,
    reachSignIn,
    getDailyMissionData,
    reachDailyMission,
    getScoreBoxData,
    reachScoreBox,
    getNextLevelData,
    getGiftData,
    exchangeGift,
    getO2ExchangeData,
    buyCatCoin,
    doSpeedUp,
    reachNewbiePrize,
    timingStart,
    timingStop,
    timingIdle,
    timingResume,
    timeCheck,
    showBoardDialog,
    shareViaFacebook,
    shareViaLine,
    showMessageModal,
    showErrorModal,
    showReloadModal,
    dialogTemplete,
    recordGoogleSheet,
    timeOutEvent
}