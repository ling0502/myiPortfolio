// import {
//     // 變數
//     LevelData,
//     PlantData,
//     PlantPicIndexData,
//     PropData,
//     PropPicIndexData,
//     PartnerCategoryData,
//     PartnerData,
//     PartnerPicIndexData,
//     PartnerIdData,
//     LandData,
//     WarehouseData,
//     AchieveCategoryData,
//     AchieveData,
//     FarmerAchieveData,
//     ACCOUNT_ID,
//     ACCOUNT_SN,
//     ACCOUNT_NAME,
//     ACCOUNT_PIC,
//     MemberPoint,
//     MemberCatCoin,
//     FarmerData,
//     FarmerLands,
//     FarmerWarehouse,
//     FarmerPartner,
//     UpdateFarmerPartner,
//     SeedStock,
//     PropStock,
//     PlantStock,
//     SigninData,
//     DailyMissionData,
//     NextLevelData,
//     GiftData,
//     GiftPics,
//     O2ExchangeData,
//     ScoreBoxData,
//     // ajax前置後置functions變數內容指定
//     SetPreEntranceData,
//     SetSuccessEntranceData,
//     SetPreSnData,
//     SetSuccessSnData,
//     SetPreRefreshDailyData,
//     SetSuccessRefreshDailyData,
//     SetPreGetLevelData,
//     SetSuccessGetLevelData,
//     SetPreGetPlantData,
//     SetSuccessGetPlantData,
//     SetPreDoPlantSeed,
//     SetSuccessDoPlantSeed,
//     SetPreDoHarvest,
//     SetSuccessDoHarvest,
//     SetPreSellPlant,
//     SetSuccessSellPlant,
//     SetPreSellProp,
//     SetSuccessSellProp,
//     SetPreGetPropData,
//     SetSuccessGetPropData,
//     SetPreBuyProp,
//     SetSuccessBuyProp,
//     SetPreBuySeed,
//     SetSuccessBuySeed,
//     SetPreBuyLand,
//     SetSuccessBuyLand,
//     SetPreBuyWarehouse,
//     SetSuccessBuyWarehouse,
//     SetPreUseProp,
//     SetSuccessUseProp,
//     SetPreGetLandData,
//     SetSuccessGetLandData,
//     SetPreGetWarehouseData,
//     SetSuccessGetWarehouseData,
//     SetPreGetAchieveData,
//     SetSuccessGetAchieveData,
//     SetPreReachAchieve,
//     SetSuccessReachAchieve,
//     SetPreGetMemberWallet,
//     SetSuccessGetMemberWallet,
//     SetPreGetSeedStock,
//     SetSuccessGetSeedStock,
//     SetPreGetPlantStock,
//     SetSuccessGetPlantStock,
//     SetPreGetPropStock,
//     SetSuccessGetPropStock,
//     SetPreGetPartnerData,
//     SetSuccessGetPartnerData,
//     SetPreClickPartner,
//     SetSuccessClickPartner,
//     SetPreRecyclePartner,
//     SetPreUnlockPartner,
//     SetSuccessUnlockPartner,
//     SetSuccessRecyclePartner,
//     SetPreGetSignInData,
//     SetSuccessGetSignInData,
//     SetPreReachSignIn,
//     SetSuccessReachSignIn,
//     SetPreGetDailyMissionData,
//     SetSuccessGetDailyMissionData,
//     SetPreReachDailyMission,
//     SetSuccessReachDailyMission,
//     SetPreGetScoreBoxData,
//     SetSuccessGetScoreBoxData,
//     SetPreReachScoreBox,
//     SetSuccessReachScoreBox,
//     SetPreGetNextLevelData,
//     SetSuccessGetNextLevelData,
//     SetErrorTimeOut,
//     SetSuccessAccountPicture,
//     SetPreGetGiftData,
//     SetSuccessGetGiftData,
//     SetSuccessSetGiftPicture,
//     SetPreExchangeGift,
//     SetSuccessExchangeGift,
//     SetPreGetO2ExchangeData,
//     SetSuccessGetO2ExchangeData,
//     SetPreBuyCatCoin,
//     SetSuccessBuyCatCoin,
//     SetPreDoSpeedUp,
//     SetSuccessDoSpeedUp,
//     // 基礎流程functions
//     entranceData,
//     getSnData,
//     refreshDailyData,
//     getLevelData,
//     getPlantData,
//     buySeed,
//     doPlantSeed,
//     doHarvest,
//     sellPlant,
//     getPropData,
//     buyProp,
//     useProp,
//     sellProp,
//     getLandData,
//     buyLand,
//     getWarehouseData,
//     buyWarehouse,
//     getAchieveData,
//     reachAchieve,
//     getMemberWallet,
//     getSeedStock,
//     getPlantStock,
//     getPropStock,
//     getPartnerData,
//     clickPartner,
//     recyclePartner,
//     unlockPartner,
//     getSignInData,
//     reachSignIn,
//     getDailyMissionData,
//     reachDailyMission,
//     getScoreBoxData,
//     reachScoreBox,
//     getNextLevelData,
//     getGiftData,
//     exchangeGift,
//     getO2ExchangeData,
// } from '../../../js/farm_source.js'

import { PlayAudio } from './Controller.js'
// import {
//     getFirstEnter,
//     setFirstEnter,
//     getvirtualAwards_type,
//     getVirtualAwards_frame,
//     getRate_perO2toCoin,
//     setRate_perO2toCoin,
//     getRate_perO2toTime,
//     setRate_perO2toTime,
//     getLimit_perSpaceNum,

//     getMemberPhoto,
//     setMemberPhoto,
//     getMemberName,
//     setMemberName,
//     getMemberLV,
//     setMemberLV,
//     getMemberExp,
//     setMemberExp,
//     getMemberCoin,
//     setMemberCoin,
//     getMemberO2point,
//     setMemberO2point,

//     getMemberLand_status,
//     setMemberLand_status,
//     getMemberLand_statusID,
//     setMemberLand_statusID,
//     getMemberLand_cropTypeFrame,
//     setMemberLand_cropTypeFrame,
//     getMemberLand_cropStatus,
//     setMemberLand_cropStatus,
//     getMemberLand_cropNeedSec,
//     setMemberLand_cropNeedSec,
//     getMemberLandOpened,
//     setMemberLandOpened,
//     getMemberSpace,
//     setMemberSpace,
//     getMemberTool,
//     setMemberTool,
//     getMemberSeed,
//     setMemberSeed,
//     getMemberCrop,
//     setMemberCrop,

//     getMemberTask,
//     setMemberTask,
//     getMemberTaskReceived,
//     setMemberTaskReceived,
//     getMemberTaskboxOpened,
//     setMemberTaskboxOpened,

//     getMemberAchiev_manager,
//     setMemberAchiev_manager,
//     getMemberAchiev_managerStar,
//     setMemberAchiev_managerStar,
//     getMemberAchiev_managerReceived,
//     setMemberAchiev_managerReceived,
//     getMemberAchiev_book,
//     setMemberAchiev_book,
//     getMemberAchiev_bookStar,
//     setMemberAchiev_bookStar,
//     getMemberAchiev_bookReceived,
//     setMemberAchiev_bookReceived,
//     getMemberAchiev_grow,
//     setMemberAchiev_grow,
//     getMemberAchiev_growStar,
//     setMemberAchiev_growStar,
//     getMemberAchiev_growReceived,
//     setMemberAchiev_growReceived,

//     getMemberCanSignToday,
//     setMemberCanSignToday,
//     getMemberSignDay,
//     setMemberSignDay,
//     getMemberSignIn_gift,
//     setMemberSignIn_gift,

//     getMemberBook_N,
//     setMemberBook_N,
//     getLockMask_memberBookN,
//     setLockMask_memberBookN,
//     getMemberBook_NIntimacy,
//     setMemberBook_NIntimacy,
//     getMemberBook_SR,
//     setMemberBook_SR,
//     getLockMask_memberBookSR,
//     setLockMask_memberBookSR,
//     getMemberBook_SRIntimacy,
//     setMemberBook_SRIntimacy,
//     getMemberBook_SSR,
//     setMemberBook_SSR,
//     getLockMask_memberBookSSR,
//     setLockMask_memberBookSSR,
//     getMemberBook_SSRIntimacy,
//     setMemberBook_SSRIntimacy,
//     getOwned_memberBookN,
//     setOwned_memberBookN,
//     getOwned_memberBookSR,
//     setOwned_memberBookSR,
//     getOwned_memberBookSSR,
//     setOwned_memberBookSSR,
//     getUpgradeNum_memberBookN,
//     setUpgradeNum_memberBookN,
//     getUpgradeNum_memberBookSR,
//     setUpgradeNum_memberBookSR,
//     getUpgradeNum_memberBookSSR,
//     setUpgradeNum_memberBookSSR,

//     getNextLV,
//     setNextLV,
//     getNextExp,
//     setNextExp,
//     getUpgradeGift,
//     setUpgradeGift,
//     getUpgradeUnlock,
//     setUpgradeUnlock,

//     getNewSpace_limitLV,
//     setNewSpace_limitLV,
//     shiftNewSpace_limitLV,
//     getNewSpace_coinNum,
//     setNewSpace_coinNum,
//     shiftNewSpace_coinNum,
//     getNewSpace_O2pointNum,
//     setNewSpace_O2pointNum,
//     shiftNewSpace_O2pointNum,

//     getNewLand_limitLV,
//     setNewLand_limitLV,
//     getNewLand_coinNum,
//     setNewLand_coinNum,
//     getNewLand_O2pointNum,
//     setNewLand_O2pointNum,

//     getToolName,
//     setToolName,
//     getCropName,
//     setCropName,
//     getGiftName,
//     setGiftName,
//     getGiftID,
//     setGiftID,
//     getGiftUrl,
//     setGiftUrl,
//     getGiftRequire,
//     setGiftRequire,
//     getGiftLeftNum,
//     setGiftLeftNum,
//     getGiftLeftHours,
//     setGiftLeftHours,

//     getBuyPrice_tool,
//     setBuyPrice_tool,
//     getSellPrice_tool,
//     setSellPrice_tool,
//     getBuyPrice_seed,
//     setBuyPrice_seed,
//     getSellPrice_crop,
//     setSellPrice_crop,

//     getSeed_growSecLV2,
//     setSeed_growSecLV2,
//     getSeed_growSecLV3,
//     setSeed_growSecLV3,
//     getSeed_deadSec,
//     setSeed_deadSec,
//     getSeed_baseQTY,
//     setSeed_baseQTY,
//     getSeed_rateQTY,
//     getSeed_exp,
//     setSeed_exp,
//     getSeed_limitLV,
//     setSeed_limitLV,

//     getTaskList,
//     setTaskList,
//     getTaskNum,
//     setTaskNum,
//     getTaskGift,
//     setTaskGift,
//     getTaskBoxGift,
//     setTaskBoxGift,

//     getAchievID_manager,
//     setAchievID_manager,
//     getAchievList_manager,
//     setAchievList_manager,
//     getAchievNum_manager,
//     setAchievNum_manager,
//     getAchievGift_manager,
//     setAchievGift_manager,
//     getAchievID_book,
//     setAchievID_book,
//     getAchievList_book,
//     setAchievList_book,
//     getAchievNum_book,
//     setAchievNum_book,
//     getAchievGift_book,
//     setAchievGift_book,
//     getAchievID_grow,
//     setAchievID_grow,
//     getAchievList_grow,
//     setAchievList_grow,
//     getAchievNum_grow,
//     setAchievNum_grow,
//     getAchievGift_grow,
//     setAchievGift_grow,
// } from './fakeSQL'

var successNum = 0
export default class MenuScene extends Phaser.Scene {
    constructor() {
        super('menu')
    }

    init() {
        // SetSuccessSnData(successSnData);
        // SetSuccessAccountPicture(successSetAccountPicture)
        // SetSuccessGetNextLevelData(successGetNextLevelData);
        // SetSuccessRefreshDailyData(successRefreshDailyData);
        // SetSuccessGetPlantData(successGetPlantData);
        // SetSuccessGetPropData(successGetPropData);
        // SetSuccessGetLandData(successGetLandData);
        // SetSuccessGetWarehouseData(successGetWarehouseData);
        // SetSuccessGetAchieveData(successGetAchieveData);
        // SetSuccessGetSeedStock(successGetSeedStock);
        // SetSuccessGetPlantStock(successGetPlantStock);
        // SetSuccessGetPropStock(successGetPropStock);
        // SetSuccessGetPartnerData(successGetPartnerData);
        // SetSuccessGetSignInData(successGetSignInData);
        // SetSuccessGetDailyMissionData(successGetDailyMissionData);
        // SetSuccessGetScoreBoxData(successGetScoreBoxData);
        // SetSuccessGetGiftData(successGetGiftData);
        // SetSuccessSetGiftPicture(successSetGiftPicture);
        // SetSuccessGetO2ExchangeData(successGetO2ExchangeData);

        // entranceData(false);
        // getSnData(false);
        // refreshDailyData(false);
        // getPlantData(true);
        // getPropData(true);
        // getWarehouseData(true);
        // getAchieveData(true);
        // getMemberWallet(true);
        // getPropStock(true);
        // getPartnerData(true);
        // getSignInData(true);
        // getDailyMissionData(true);
        // getScoreBoxData(true);
        // getGiftData(true);
        // getO2ExchangeData(true);
    }

    create() {
        // 綁定connect.js功能
        // SetPreShowDialog(this.PreShowDialog, this)
        // SetCompleteCloseDialog(this.completeCloseDialog, this)

        var bgm = this.sound.add('bgmSE', { volume: 1, loop: true, });
        bgm.play();

        let menu = this.add.sprite(0, 0, 'bg_menu').setOrigin(0)
        menu.setInteractive().on('pointerdown', function() {
            PlayAudio(this, 'startGameSE')
            menu.input.enabled = false
            this.scene.start('load')
        }, this)

        let logo = this.add.sprite(game.config.width / 2, -150, 'logo')
        this.tweens.add({
            targets: logo,
            y: 100,
            duration: 1000,
            ease: 'Bounce.Out',
            onComplete: function() {
                this.anims.create({
                    key: 'logo',
                    frames: this.anims.generateFrameNumbers('logo', { start: 0, end: 3 }),
                    duration: 800,
                    repeat: -1,
                })
                logo.play('logo')
            },
            callbackScope: this
        })

        let menu_player = this.add.sprite(290, 570, 'menu_player')
        this.anims.create({
            key: 'menu_player',
            frames: this.anims.generateFrameNumbers('menu_player', { start: 0, end: 14 }),
            frameRate: 10,
            repeat: -1,
        })
        menu_player.play('menu_player')

        let press = this.add.sprite(game.config.width / 2, game.config.height - 80, 'press')
        this.tweens.add({
            targets: press,
            alpha: 0,
            duration: 600,
            yoyo: true,
            repeat: -1,
            repeatDelay: 800,
        })

        this.add.sprite(game.config.width - 10, game.config.height - 10, 'company').setOrigin(1, 1)
    }
}


// function successSnData() {
//     successNum += 1

//     // 取得下一階段狀態(經驗值用)
//     getNextLevelData(true)

//     // 如果會員沒有預設頭像直接通過不用等successSetAccountPicture
//     if (ACCOUNT_PIC == null) {
//         successNum += 1
//     }

//     setFirstEnter(FarmerData.newbie_prize)
//     setMemberName(ACCOUNT_NAME)
//     setMemberLV(FarmerData.level)
//     setMemberExp(FarmerData.exp, false)
//     setMemberCoin(FarmerData.cat_coin, false)
//     setMemberO2point(FarmerData.o2_point, false)
// }

// function successSetAccountPicture() {
//     successNum += 1
//     setMemberPhoto(ACCOUNT_PIC)
// }

// function successGetNextLevelData() {
//     successNum += 1
//     setNextLV(NextLevelData.level)
//     setNextExp(NextLevelData.exp)
//     setUpgradeGift(NextLevelData.prize_arr)
//     setUpgradeUnlock(NextLevelData.unlock_arr)
// }

// function successRefreshDailyData() {

// }

// function successGetPlantData() {
//     successNum += 1

//     // 作物資訊先取完再取才會不會有問題
//     getLandData(true);
//     getSeedStock(true);
//     getPlantStock(true);

//     for (var i = 0; i < PlantData.length; i++) {
//         setCropName(PlantData[i].pic_index, PlantData[i].name)
//         setBuyPrice_seed(PlantData[i].pic_index, PlantData[i].buy_price)
//         setSellPrice_crop(PlantData[i].pic_index, PlantData[i].sell_price)
//         setSeed_growSecLV2(PlantData[i].pic_index, PlantData[i].stage1_sec)
//         setSeed_growSecLV3(PlantData[i].pic_index, PlantData[i].stage2_sec)
//         setSeed_deadSec(PlantData[i].pic_index, PlantData[i].withered_sec)
//         setSeed_baseQTY(PlantData[i].pic_index, PlantData[i].harvest_base_num)
//         setSeed_exp(PlantData[i].pic_index, PlantData[i].exp_num)
//         setSeed_limitLV(PlantData[i].pic_index, PlantData[i].unlock_level)
//     }
// }

// function successGetPropData() {
//     successNum += 1
//     for (var i = 0; i < PropData.length; i++) {
//         setToolName(i, PropData[i].name)
//         setBuyPrice_tool(i, PropData[i].buy_price)
//         setSellPrice_tool(i, PropData[i].sell_price)
//     }
// }

// function successGetLandData() {
//     successNum += 1
//     setMemberLandOpened(FarmerLands.length)
//     for (var i = 0; i < LandData.length; i++) {
//         setNewLand_limitLV(i, LandData[i].unlock_level)
//     }
//     for (var i = 0; i < LandData.length; i++) {
//         setNewLand_coinNum(i, LandData[i].cat_coin)
//     }
//     for (var i = 0; i < LandData.length; i++) {
//         setNewLand_O2pointNum(i, LandData[i].o2_point)
//     }

//     for (var i = 0; i < LandData.length; i++) {
//         var status = undefined
//         var land_statusID = 0
//         var plant_id = 0
//         var plant_status = undefined
//         var next_sec = 0

//         if (i < FarmerLands.length) {
//             land_statusID = FarmerLands[i].land_status
//             plant_id = FarmerLands[i].plant_id
//             plant_status = FarmerLands[i].plant_status
//             next_sec = FarmerLands[i].next_sec
//         }

//         setMemberLand_statusID(i, land_statusID)
//         setMemberLand_cropTypeFrame(i, PlantPicIndexData[plant_id])
//         setMemberLand_cropStatus(i, plant_status)
//         setMemberLand_cropNeedSec(i, next_sec)

//         switch (land_statusID) {
//             case 0:
//                 status = undefined
//                 break;
//             case 1:
//                 status = 'planted'
//                 break;
//             case 2:
//                 status = 'fertilized'
//                 break;
//             case 3:
//                 status = 'needDig'
//                 break;
//         }
//         setMemberLand_status(i, status)
//     }
// }

// function successGetWarehouseData() {
//     successNum += 1
//     setMemberSpace(FarmerWarehouse.length)
//     for (var i = 0; i < WarehouseData.length; i++) {
//         if (WarehouseData[i].for_sale == false) continue
//         if (WarehouseData[i].unlock_level == 1) continue
//         setNewSpace_limitLV(WarehouseData[i].unlock_level)
//     }
//     for (var i = 0; i < WarehouseData.length; i++) {
//         if (WarehouseData[i].for_sale == false) continue
//         if (WarehouseData[i].cat_coin == 0) continue
//         setNewSpace_coinNum(WarehouseData[i].cat_coin)
//     }
//     for (var i = 0; i < WarehouseData.length; i++) {
//         if (WarehouseData[i].for_sale == false) continue
//         if (WarehouseData[i].o2_point == 0) continue
//         setNewSpace_O2pointNum(WarehouseData[i].o2_point)
//     }
// }

// function successGetAchieveData() {
//     successNum += 1
//     for (var i = 0; i < AchieveCategoryData.length; i++) {
//         var achieveCategory = AchieveCategoryData[i]
//         for (var j = 0; j < FarmerAchieveData[achieveCategory].length; j++) {
//             switch (achieveCategory) {
//                 case 'plant':
//                     setAchievID_manager(j, FarmerAchieveData[achieveCategory][j].title)
//                     setAchievList_manager(j, FarmerAchieveData[achieveCategory][j].content)
//                     setAchievNum_manager(j, FarmerAchieveData[achieveCategory][j].goal_value)
//                     setAchievGift_manager(j, FarmerAchieveData[achieveCategory][j].prize_arr[0])
//                     setMemberAchiev_manager(j, FarmerAchieveData[achieveCategory][j].now_value, false)
//                     setMemberAchiev_managerStar(j, FarmerAchieveData[achieveCategory][j].now_star)
//                     setMemberAchiev_managerReceived(j, FarmerAchieveData[achieveCategory][j].received)
//                     break;

//                 case 'partner':
//                     setAchievID_book(j, FarmerAchieveData[achieveCategory][j].title)
//                     setAchievList_book(j, FarmerAchieveData[achieveCategory][j].content)
//                     setAchievNum_book(j, FarmerAchieveData[achieveCategory][j].goal_status) // 以親密度判斷
//                     setAchievGift_book(j, FarmerAchieveData[achieveCategory][j].prize_arr[0])
//                     setMemberAchiev_book(j, FarmerAchieveData[achieveCategory][j].lock_status, false) // 以親密度判斷
//                     setMemberAchiev_bookStar(j, FarmerAchieveData[achieveCategory][j].now_star)
//                     setMemberAchiev_bookReceived(j, FarmerAchieveData[achieveCategory][j].received)
//                     break;

//                 case 'other':
//                     setAchievID_grow(j, FarmerAchieveData[achieveCategory][j].title)
//                     setAchievList_grow(j, FarmerAchieveData[achieveCategory][j].content)
//                     setAchievNum_grow(j, FarmerAchieveData[achieveCategory][j].goal_value)
//                     setAchievGift_grow(j, FarmerAchieveData[achieveCategory][j].prize_arr[0])
//                     setMemberAchiev_grow(j, FarmerAchieveData[achieveCategory][j].now_value, false)
//                     setMemberAchiev_growStar(j, FarmerAchieveData[achieveCategory][j].now_star)
//                     setMemberAchiev_growReceived(j, FarmerAchieveData[achieveCategory][j].received)
//                     break;
//             }
//         }
//     }
// }

// function successGetSeedStock() {
//     successNum += 1

//     var seedStockArray = [] // 玩家擁有的種子圖片序號
//     for (var i = 0; i < PlantData.length; i++) {
//         if (i < SeedStock.length) {
//             var picIndex = PlantPicIndexData[SeedStock[i].plant_id]
//             seedStockArray.push(picIndex)
//         }
//     }

//     var arrayID = 0
//     for (var j = 0; j < PlantData.length; j++) {
//         var qty = 0
//         if (j == seedStockArray[0]) {
//             qty = SeedStock[arrayID].quantity
//             seedStockArray.shift()
//             arrayID++
//         }

//         setMemberSeed(j, qty, false)
//     }
// }

// function successGetPlantStock() {
//     successNum += 1
//     var plantStockArray = [] // 玩家擁有的作物圖片序號
//     for (var i = 0; i < PlantData.length; i++) {
//         if (i < PlantStock.length) {
//             var picIndex = PlantPicIndexData[PlantStock[i].plant_id]
//             plantStockArray.push(picIndex)
//         }
//     }

//     var arrayID = 0
//     for (var j = 0; j < PlantData.length; j++) {
//         var qty = 0
//         if (j == plantStockArray[0]) {
//             qty = PlantStock[arrayID].quantity
//             plantStockArray.shift()
//             arrayID++
//         }

//         setMemberCrop(j, qty, false)
//     }
// }

// function successGetPropStock() {
//     successNum += 1
//     for (var i = 0; i < PropStock.length; i++) {
//         setMemberTool(i, PropStock[i].num, false)
//     }
// }

// function successGetPartnerData() {
//     successNum += 1
//     for (var i = 0; i < PartnerCategoryData.length; i++) {
//         var partnerCategory = PartnerCategoryData[i]
//         var partnerStockArray = [] // 玩家擁有的小夥伴圖片序號

//         for (var j = 0; j < PartnerData[partnerCategory].length; j++) {
//             if (j < FarmerPartner[partnerCategory].length) {
//                 // var picIndex = PartnerPicIndexData[FarmerPartner[partnerCategory][j].partner_id]
//                 var partnerID = FarmerPartner[partnerCategory][j].partner_id
//                 var picIndex = PartnerPicIndexData[partnerCategory][partnerID]
//                 partnerStockArray.push(picIndex)
//             }
//         }

//         var arrayID = 0
//         for (var k = 0; k < PartnerData[partnerCategory].length; k++) {
//             var status_value = 0
//             var lock_mask = 0
//             var status = 0
//             var isOwned = false
//             var upgradeNum = 0
//             if (k == partnerStockArray[0]) {
//                 status_value = FarmerPartner[partnerCategory][arrayID].status_value // 當前狀態的隻數
//                 lock_mask = FarmerPartner[partnerCategory][arrayID].lock_mask // 0:不顯示mask，1:顯示mask)
//                 status = FarmerPartner[partnerCategory][arrayID].lock_status // 親密值(0)預設(1)友好(2)親近(3)知己
//                 isOwned = true
//                 upgradeNum = FarmerPartner[partnerCategory][arrayID].next_status_value // 升階至下一階所需數量

//                 partnerStockArray.shift()
//                 arrayID++
//             }

//             switch (partnerCategory) {
//                 case 'N':
//                     setMemberBook_N(k, status_value, false)
//                     setLockMask_memberBookN(k, lock_mask)
//                     setMemberBook_NIntimacy(k, status)
//                     setOwned_memberBookN(k, isOwned)
//                     setUpgradeNum_memberBookN(k, upgradeNum)
//                     break;
//                 case 'SR':
//                     setMemberBook_SR(k, status_value, false)
//                     setLockMask_memberBookSR(k, lock_mask)
//                     setMemberBook_SRIntimacy(k, status)
//                     setOwned_memberBookSR(k, isOwned)
//                     setUpgradeNum_memberBookSR(k, upgradeNum)
//                     break;
//                 case 'SSR':
//                     setMemberBook_SSR(k, status_value, false)
//                     setLockMask_memberBookSSR(k, lock_mask)
//                     setMemberBook_SSRIntimacy(k, status)
//                     setOwned_memberBookSSR(k, isOwned)
//                     setUpgradeNum_memberBookSSR(k, upgradeNum)
//                     break;
//             }
//         }
//     }
// }

// function successGetSignInData() {
//     successNum += 1
//     for (var i = 0; i < SigninData.length; i++) {
//         if (SigninData[i].today == true) {
//             setMemberCanSignToday(SigninData[i].can_signin)
//         }
//         setMemberSignIn_gift(i, SigninData[i].prize_arr[0])
//     }

//     var index = 0
//     for (var i = 0; i < SigninData.length; i++) {
//         if (SigninData[i].receive_date != null) {
//             setMemberSignDay(SigninData[i].day_no, false)
//         } else {
//             index++
//         }
//     }
//     if (index == 7) { // 若七天都沒簽到過 = 今天是第一天
//         setMemberSignDay(0, false)
//     }
// }

// function successGetDailyMissionData() {
//     successNum += 1
//     for (var i = 0; i < DailyMissionData.length; i++) {
//         setTaskList(i, DailyMissionData[i].title)
//         setTaskNum(i, DailyMissionData[i].goal_value)
//         setTaskGift(i, DailyMissionData[i].prize)
//         setMemberTask(i, DailyMissionData[i].now_value, false)
//         setMemberTaskReceived(i, DailyMissionData[i].received)
//     }
// }

// function successGetScoreBoxData() {
//     successNum += 1
//     for (var i = 0; i < ScoreBoxData.length; i++) {
//         setMemberTaskboxOpened(i, ScoreBoxData[i].opened)
//         setTaskBoxGift(i, ScoreBoxData[i].prize_arr)
//     }
// }

// function successGetGiftData() {
//     // 無獎勵直接通過不等successSetGiftPicture
//     if (GiftData.length == 0) {
//         successNum += 1
//     }

//     for (var i = 0; i < GiftData.length; i++) {
//         setGiftID(i, GiftData[i].id)
//         setGiftName(i, GiftData[i].name)
//         setGiftRequire(i, GiftData[i].exchange_data)

//         if (GiftData[i].can_exchange == true) {
//             // total_count // 獎勵總數量
//             // exchange_count // 已被兌換總數量
//             // farmer_exchanged_num // 玩家已兌換數量
//             // member_limit_num // 玩家限制可換數量

//             var totalNum = GiftData[i].total_count - GiftData[i].exchange_count
//             var farmerNum = GiftData[i].member_limit_num - GiftData[i].farmer_exchanged_num
//             var leftNum = totalNum <= farmerNum ? totalNum : farmerNum
//             setGiftLeftNum(i, leftNum)
//         } else {
//             setGiftLeftNum(i, 0)
//         }

//         var totalHR = GiftData[i].countdown_days * 24 + GiftData[i].countdown_hours
//         setGiftLeftHours(i, totalHR)
//     }
// }

// function successSetGiftPicture() {
//     successNum += 1
//     for (var i = 0; i < GiftData.length; i++) {
//         setGiftUrl(GiftData[i].id, GiftPics[GiftData[i].id])
//     }
// }

// function successGetO2ExchangeData() {
//     successNum += 1
//     setRate_perO2toCoin(O2ExchangeData.cat_coin_to_o2)
//     setRate_perO2toTime(O2ExchangeData.seconds_to_o2)
// }


// export function getSuccessNum() {
//     return successNum
// }