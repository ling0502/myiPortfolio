// -------------待接資料庫參數-------------

// 會員資料
var virtualAwards_type = ['obj_coin', 'obj_seed', 'obj_tool'] // 虛擬獎項(遊戲幣, 種子, 道具)
var virtualAwards_frame = [1, 15, 3] // 虛擬獎項種類(1種幣(歐兔幣不送), 15種種子 ,3種道具(中高級肥料不送))
var rate_perO2toCoin = 10 // 每一歐兔幣可兌換貓鑽比率
var rate_perO2toTime = 10 // 每一歐兔幣可節省時間比率
var limit_perSpaceNum = 80 // 每一格倉庫空間可堆疊最大數量

var firstEnter = false // 第一次進入(新手禮包用)
var memberPhoto // 會員頭像
var memberName = '勤勞の貓貓' // 會員名稱
var memberLV = 1 // 會員等級
var memberExp = 900 // 會員經驗值
var memberCoin = 86000 // 會員貓幣
var memberO2point = 88000 // 會員歐兔幣

var memberCanSignToday = true // 今天是否可以簽到
var memberSignDay = 3 // 簽到第n天

var memberSpace = 3 // 預設倉庫空間
var memberLandOpened = 5 // 預設土地開放格數
var memberTool = [10, 20, 30, 5, 30] // 道具數量
var memberSeed = [50, 30, 50, 20, 10, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0] // 種子數量
var memberCrop = [10, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0] // 作物數量
var memberTask = [20, 20, 20, 0, 0, 0, 0, 0] // 每日任務完成數量
var memberTaskReceived = [false, false, false, false, false, false, false, false] // 每日任務獎勵領取狀態
var memberTaskboxOpened = [false, false, false] // 每日任務寶箱開啟狀態

var memberBook_N = [] // 圖鑑(N)數量預設0
var memberBook_SR = [] // 圖鑑(SR)數量預設0
var memberBook_SSR = [] // 圖鑑(SSR)數量預設0

var owned_memberBookN = [] // 圖鑑(N)是否已擁有預設false
var owned_memberBookSR = [] // 圖鑑(SR)是否已擁有預設false
var owned_memberBookSSR = [] // 圖鑑(SSR)是否已擁有預設false

var lockMask_memberBookN = [] // 圖鑑(N)鎖定遮罩預設true
var lockMask_memberBookSR = [] // 圖鑑(SR)鎖定遮罩預設true
var lockMask_memberBookSSR = [] // 圖鑑(SSR)鎖定遮罩預設true

var upgradeNum_memberBookN = [] // 圖鑑(N)升階數量
var upgradeNum_memberBookSR = [] // 圖鑑(SR)升階數量
var upgradeNum_memberBookSSR = [] // 圖鑑(SSR)升階數量

var memberBook_NIntimacy = [] // 圖鑑(N)親密度 _ (0)初識(1)友好(2)親近(3)知己
var memberBook_SRIntimacy = [] // 圖鑑(SR)親密度 _ (0)初識(1)友好(2)親近(3)知己
var memberBook_SSRIntimacy = [] // 圖鑑(SSR)親密度 _ (0)初識(1)友好(2)親近(3)知己

for (var i = 0; i < 10; i++) {
    memberBook_N.push(0)
    memberBook_SR.push(0)
    memberBook_SSR.push(0)

    owned_memberBookN.push(false)
    owned_memberBookSR.push(false)
    owned_memberBookSSR.push(false)

    lockMask_memberBookN.push(true)
    lockMask_memberBookSR.push(true)
    lockMask_memberBookSSR.push(true)

    upgradeNum_memberBookN.push(20)
    upgradeNum_memberBookSR.push(30)
    upgradeNum_memberBookSSR.push(50)

    memberBook_NIntimacy.push(0)
    memberBook_SRIntimacy.push(0)
    memberBook_SSRIntimacy.push(0)
}

var memberAchiev_manager = [] // 成就(經營)完成數量預設0
var memberAchiev_managerStar = [] // 成就星級(經營)預設0
var memberAchiev_managerReceived = [] // 成就(經營)已領取獎勵預設false
for (var i = 0; i < 15; i++) {
    memberAchiev_manager.push(30)
    memberAchiev_managerStar.push(0)
    memberAchiev_managerReceived.push(false)
}
var memberAchiev_book = [] // 成就(圖鑑)完成數量預設0
var memberAchiev_bookStar = [] // 成就星級(圖鑑)預設0
var memberAchiev_bookReceived = [] // 成就(圖鑑)已領取獎勵預設false
for (var i = 0; i < 20; i++) {
    memberAchiev_book.push(20)
    memberAchiev_bookStar.push(0)
    memberAchiev_bookReceived.push(false)
}
var memberAchiev_grow = [] // 成就(成長)完成數量預設0
var memberAchiev_growStar = [] // 成就星級(成長)預設0
var memberAchiev_growReceived = [] // 成就(成長)已領取獎勵預設false
for (var i = 0; i < 10; i++) {
    memberAchiev_grow.push(7)
    memberAchiev_growStar.push(0)
    memberAchiev_growReceived.push(false)
}

// 一周簽到禮
var memberSignIn_gift = [{
    type: 'obj_coin',
    id: 1,
    num: 300
}, {
    type: 'obj_seed',
    id: 0,
    num: 1
}, {
    type: 'obj_tool',
    id: 0,
    num: 2
}, {
    type: 'obj_coin',
    id: 1,
    num: 400
}, {
    type: 'obj_seed',
    id: 1,
    num: 2
}, {
    type: 'obj_tool',
    id: 1,
    num: 3
}, {
    type: 'obj_seed',
    id: 0,
    num: 3
}]

var memberLand_status = []
var memberLand_statusID = []
var memberLand_cropTypeFrame = []
var memberLand_cropStatus = []
var memberLand_cropNeedSec = [20, 40, 60, 240, 720, 2160, 2880, 5760, 12960, 17280, 13440, 17280, 20160, 34560, 38880]

// 升級
var nextLV = 2
var nextExp = 1000
var upgradeGift = [{
    type: 'obj_coin',
    id: 0,
    num: 6000
}, {
    type: 'obj_seed',
    id: 1,
    num: 5
}, {
    type: 'obj_tool',
    id: 2,
    num: 3
}]
var upgradeUnlock = [{
    'type': 'land',
    'id': 5,
    'pic_index': 0
}, {
    'type': 'warehouse',
    'id': 4,
    'pic_index': 0
}, {
    'type': 'plant',
    'id': 2,
    'pic_index': 1
}]

// 等級資料
var lv_index = [3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]
var lv_exp = [3000, 6000, 10000, 15000, 21000, 28000, 36000, 45000, 55000, 66000, 78000, 91000, 105000]
var lv_gift = [
    [{
        type: 'obj_coin',
        id: 0,
        num: 4000
    }, {
        type: 'obj_seed',
        id: 2,
        num: 5
    }, {
        type: 'obj_tool',
        id: 0,
        num: 2
    }],
    [{
        type: 'obj_coin',
        id: 0,
        num: 2000
    }, {
        type: 'obj_tool',
        id: 0,
        num: 2
    }, {
        type: 'obj_tool',
        id: 1,
        num: 5
    }],
    [{
        type: 'obj_seed',
        id: 4,
        num: 5
    }, {
        type: 'obj_tool',
        id: 1,
        num: 5
    }, {
        type: 'obj_tool',
        id: 2,
        num: 3
    }],
    [{
        type: 'obj_coin',
        id: 0,
        num: 4000
    }, {
        type: 'obj_seed',
        id: 11,
        num: 5
    }, {
        type: 'obj_tool',
        id: 0,
        num: 2
    }],
    [{
        type: 'obj_coin',
        id: 0,
        num: 2000
    }, {
        type: 'obj_seed',
        id: 8,
        num: 5
    }, {
        type: 'obj_tool',
        id: 2,
        num: 3
    }],
    [{
        type: 'obj_coin',
        id: 0,
        num: 4000
    }, {
        type: 'obj_tool',
        id: 0,
        num: 2
    }, {
        type: 'obj_tool',
        id: 1,
        num: 5
    }],
    [{
        type: 'obj_coin',
        id: 0,
        num: 2000
    }, {
        type: 'obj_tool',
        id: 1,
        num: 5
    }, {
        type: 'obj_tool',
        id: 2,
        num: 3
    }],
    [{
        type: 'obj_seed',
        id: 12,
        num: 5
    }, {
        type: 'obj_seed',
        id: 3,
        num: 5
    }, {
        type: 'obj_tool',
        id: 0,
        num: 1
    }],
    [{
        type: 'obj_seed',
        id: 13,
        num: 5
    }, {
        type: 'obj_tool',
        id: 0,
        num: 1
    }, {
        type: 'obj_tool',
        id: 2,
        num: 3
    }],
    [{
        type: 'obj_coin',
        id: 0,
        num: 800
    }, {
        type: 'obj_seed',
        id: 9,
        num: 5
    }, {
        type: 'obj_tool',
        id: 2,
        num: 3
    }],
    [{
        type: 'obj_seed',
        id: 6,
        num: 5
    }, {
        type: 'obj_tool',
        id: 0,
        num: 1
    }, {
        type: 'obj_tool',
        id: 1,
        num: 4
    }],
    [{
        type: 'obj_coin',
        id: 0,
        num: 800
    }, {
        type: 'obj_seed',
        id: 7,
        num: 5
    }, {
        type: 'obj_seed',
        id: 10,
        num: 5
    }],
    [{
        type: 'obj_tool',
        id: 0,
        num: 1
    }, {
        type: 'obj_tool',
        id: 1,
        num: 4
    }, {
        type: 'obj_tool',
        id: 2,
        num: 1
    }]
]

// 擴倉
var newSpace_limitLV = [1, 4, 8, 10, 12, 13, 14, 15, ] // 擴倉等級限制
var newSpace_coinNum = [2000, 3000, 5000, 6000, 9000, 16000, 20000] // 擴倉花費貓鑽
var newSpace_O2pointNum = [] // 擴倉花費歐兔幣

// 擴土
var newLand_limitLV = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1] // 擴土等級限制
var newLand_coinNum = [0, 0, 0, 0, 0, 300, 500, 1000, 1800, 2100, 2400, 3000, 0, 0, 0, 0, 0, 0, 0, 0] // 擴土花費貓鑽
var newLand_O2pointNum = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 300, 400, 600, 800, 1100, 1400, 1800, 2200] // 擴土花費歐兔幣

// 作物/道具/禮物
var toolName = ['鏟子', '水壺', '初級肥料', '中級肥料', '高級肥料']
var fertilizerSec = [1800, 4800, 12000]
var cropName = ['稻米', '紅蘿蔔', '玉米', '蕃茄', '豌豆', '馬鈴薯', '甜菜根', '蔥', '辣椒', '高麗菜', '南瓜', '茄子', '鳳梨', '甜椒', '白花椰菜']
var giftName = []
var giftID = []
var giftUrl = []
var giftRequire = []
var giftLeftNum = []
var giftLeftHours = []

var buyPrice_tool = [180, 110, 216, 576, 990] // 買入道具單價
var sellPrice_tool = [10, 10, 10, 10, 10] // 賣出道具單價
var buyPrice_seed = [100, 110, 120, 130, 150, 200, 300, 400, 520, 660, 720, 840, 900, 1200, 1500] // 買入種子單價
var sellPrice_crop = [11, 14, 17, 22, 26, 35, 45, 55, 60, 75, 78, 80, 74, 96, 98] // 賣出作物單價

// 種子訊息
var seed_growSecLV2 = [20, 40, 60, 240, 720, 2160, 2880, 5760, 12960, 17280, 13440, 17280, 20160, 34560, 38880] // 生長時間-長成階段二(秒)
var seed_growSecLV3 = [40, 80, 240, 360, 1080, 2040, 3420, 9540, 9840, 10920, 21060, 26520, 31140, 22440, 27120] // 生長時間-長成階段三(秒)
var seed_deadSec = [30 /*300*/ , 29700, 25800, 26700, 22500, 22200, 19500, 18900, 15000, 15900, 11700, 11400, 8700, 8100, 4200] // 枯萎時間(秒)
var seed_baseQTY = [10, 9, 9, 8, 8, 9, 10, 8, 12, 12, 10, 14, 13, 14, 16] // 基礎收成量
var seed_rateQTY = 1.5 // 收成量增益倍率
var seed_exp = [100, 300, 400, 600, 200, 400, 700, 500, 300, 400, 200, 800, 600, 800, 1000] // 收成經驗
var seed_limitLV = [1, 2, 2, 2, 2, 2, 2, 2, 5, 5] // 種子等級限制

// 每日任務
var taskList = ['累計收成作物', '累計種植作物', '累計使用澆水', '前往商店購買工具', '前往商店購買種子', '點擊來訪小夥伴', '累計販售獲取貓鑽', '累計消耗歐兔幣', ]
var taskNum = [5, 10, 15, 5, 10, 1, 3000, 30]
var taskGift = [{
    type: 'obj_coin',
    id: 0,
    num: 300
}, {
    type: 'obj_seed',
    id: 0,
    num: 1
}, {
    type: 'obj_tool',
    id: 0,
    num: 2
}, {
    type: 'obj_coin',
    id: 0,
    num: 400
}, {
    type: 'obj_seed',
    id: 1,
    num: 2
}, {
    type: 'obj_tool',
    id: 1,
    num: 3
}, {
    type: 'obj_seed',
    id: 0,
    num: 3
}, {
    type: 'obj_tool',
    id: 0,
    num: 2
}]
var taskBoxGift = [{
    type: 'obj_coin',
    id: 0,
    num: 200
}, {
    type: 'obj_seed',
    id: 1,
    num: 3
}, {
    type: 'obj_tool',
    id: 2,
    num: 2
}]

// 成就
var achievID_manager = ['作伙來呷飯', '東方小人參', '金黃色的澱粉', '蔬菜水果傻傻不分', '四胞胎也不奇怪', '傳說的地下人蔘', '植物界的奶媽', '有人喜歡有人討厭', '喝水是沒有用的', '火鍋好搭檔', '不要再玩食物了', '都給你不用搶', '旺來旺旺來', '爆量維生素C', '減醣好夥伴']
var achievList_manager = ['累計種植稻米', '累計種植紅蘿蔔', '累計種植玉米', '累計種植蕃茄', '累計種植豌豆', '累計種植馬鈴薯', '累計種植甜菜根', '累計種植蔥', '累計種植辣椒', '累計種植高麗菜', '累計種植南瓜', '累計種植茄子', '累計種植鳳梨', '累計種植甜椒', '累計種植白花椰菜']
var achievNum_manager = [3600, 1800, 720, 360, 120, 80, 80, 70, 50, 50, 40, 40, 30, 25, 25]
var achievGift_manager = [{
    type: 'obj_tool',
    id: 0,
    num: 1
}, {
    type: 'obj_seed',
    id: 2,
    num: 1
}, {
    type: 'obj_coin',
    id: 0,
    num: 1000
}, {
    type: 'obj_tool',
    id: 2,
    num: 1
}, {
    type: 'obj_tool',
    id: 0,
    num: 1
}, {
    type: 'obj_seed',
    id: 13,
    num: 1
}, {
    type: 'obj_tool',
    id: 0,
    num: 1
}, {
    type: 'obj_coin',
    id: 0,
    num: 1000
}, {
    type: 'obj_tool',
    id: 0,
    num: 1
}, {
    type: 'obj_tool',
    id: 2,
    num: 1
}, {
    type: 'obj_coin',
    id: 0,
    num: 1000
}, {
    type: 'obj_tool',
    id: 1,
    num: 1
}, {
    type: 'obj_tool',
    id: 2,
    num: 1
}, {
    type: 'obj_tool',
    id: 1,
    num: 1
}, {
    type: 'obj_coin',
    id: 0,
    num: 8000
}, ]

var achievID_book = ['鼠來寶', '行走的零食庫', '開口就讓你閉嘴', '犯人就是你', '橘貓才不胖！', '拼命的小豬', '我只想下班', '只想整到你', '紅得像蘋果', '你的笑容幾分甜？', '哪裡都能滑', '壞小孩最怕', '一起chill', 'NASA都想挖角', '好玩到咩噗', '世界為我打轉', '打球打起來！', '童玩小能手', '教練我想打球', '走路自帶BGM']
var achievList_book = ['和羅尼親密度達到', '和諾可親密度達到', '和米米親密度達到', '和萌萌親密度達到', '和小橘親密度達到', '和潘蒂親密度達到', '和布司親密度達到', '和步妮親密度達到', '和寶拉親密度達到', '和嘿琪親密度達到', '和撲麥親密度達到', '和卡卡親密度達到', '和婕絲霓親密度達到', '和阿奈親密度達到', '和奇塔親密度達到', '和碰碰親密度達到', '和阿庫親密度達到', '和喀布親密度達到', '和奇弟親密度達到', '和吉特斯親密度達到']
var achievNum_book = [20, 20, 20, 20, 20, 30, 30, 30, 30, 30, 50, 50, 30, 50, 50, 20, 50, 50, 30, 30]
var achievGift_book = [{
    type: 'obj_coin',
    id: 0,
    num: 1000
}, {
    type: 'obj_coin',
    id: 0,
    num: 3000
}, {
    type: 'obj_coin',
    id: 0,
    num: 3000
}, {
    type: 'obj_coin',
    id: 0,
    num: 1000
}, {
    type: 'obj_coin',
    id: 0,
    num: 2000
}, {
    type: 'obj_tool',
    id: 0,
    num: 1
}, {
    type: 'obj_tool',
    id: 2,
    num: 1
}, {
    type: 'obj_tool',
    id: 0,
    num: 1
}, {
    type: 'obj_tool',
    id: 1,
    num: 1
}, {
    type: 'obj_tool',
    id: 0,
    num: 1
}, {
    type: 'obj_seed',
    id: 2,
    num: 15
}, {
    type: 'obj_tool',
    id: 2,
    num: 1
}, {
    type: 'obj_tool',
    id: 0,
    num: 1
}, {
    type: 'obj_seed',
    id: 0,
    num: 10
}, {
    type: 'obj_tool',
    id: 1,
    num: 1
}, {
    type: 'obj_coin',
    id: 0,
    num: 2000
}, {
    type: 'obj_coin',
    id: 0,
    num: 4000
}, {
    type: 'obj_coin',
    id: 0,
    num: 6000
}, {
    type: 'obj_coin',
    id: 0,
    num: 3000
}, {
    type: 'obj_coin',
    id: 0,
    num: 2000
}]

var achievID_grow = ['脫胎換骨', '只要用心就做得到', '我是大富翁', '振興市場經濟', '長得跟大樹一樣', '沒事多喝水', '農場生活不簡單', '一隻都不能少', '給我更多的寶物！', '勤勞寶寶']
var achievList_grow = ['等級達成', '連續簽到', '累計持有貓鑽', '累計販售獲取貓鑽', '累計施肥', '累計澆水', '累計挖除', '累計收集圖鑑', '累計開啟任務寶箱', '累計完成每日任務']
var achievNum_grow = [10, 7, 1000000, 65000, 100, 200, 100, 120, 25, 60]
var achievGift_grow = [{
    type: 'obj_coin',
    id: 0,
    num: 1000
}, {
    type: 'obj_coin',
    id: 0,
    num: 2000
}, {
    type: 'obj_tool',
    id: 2,
    num: 5
}, {
    type: 'obj_tool',
    id: 1,
    num: 5
}, {
    type: 'obj_coin',
    id: 0,
    num: 3000
}, {
    type: 'obj_coin',
    id: 0,
    num: 4000
}, {
    type: 'obj_tool',
    id: 0,
    num: 5
}, {
    type: 'obj_coin',
    id: 0,
    num: 3000
}, {
    type: 'obj_tool',
    id: 1,
    num: 5
}, {
    type: 'obj_tool',
    id: 2,
    num: 3
}, ]

// 圖鑑
// var upgrade_intimacyN = [0, 1 /*, 20, 60, 110*/ ] // (初始，解鎖，友好，親近，知己)升階數量
// var upgrade_intimacySR = [0, 1 /*, 30, 70, 130*/ ] // (初始，解鎖，友好，親近，知己)升階數量
// var upgrade_intimacySSR = [0, 1 /*, 30, 90, 150*/ ] // (初始，解鎖，友好，親近，知己)升階數量

/* * * * * * * * * * * * * 會員資料 * * * * * * * * * * * * */
function getFirstEnter() {
    return firstEnter
}

function setFirstEnter(flag) {
    firstEnter = flag
}

function getvirtualAwards_type() {
    return virtualAwards_type
}

function getVirtualAwards_frame() {
    return virtualAwards_frame
}

function getRate_perO2toCoin() {
    return rate_perO2toCoin
}

function setRate_perO2toCoin(coin) {
    rate_perO2toCoin = coin
}

function getRate_perO2toTime() {
    return rate_perO2toTime
}

function setRate_perO2toTime(sec) {
    rate_perO2toTime = sec
}

function getLimit_perSpaceNum() {
    return limit_perSpaceNum
}

// 會員頭像/名稱/等級/經驗/貓鑽/歐兔幣
function getMemberPhoto() {
    return memberPhoto
}

function setMemberPhoto(img) {
    memberPhoto = img
}

function getMemberName() {
    return memberName
}

function setMemberName(name) {
    memberName = name
}

function getMemberLV() {
    return memberLV
}

function setMemberLV(level) {
    memberLV = level
}

function getMemberExp() {
    return memberExp
}

function setMemberExp(exp, isInc) {
    if (isInc == true) {
        memberExp += exp
    } else {
        memberExp = exp
    }
}

function getMemberCoin() {
    return memberCoin
}

function setMemberCoin(coin, isInc) {
    if (isInc == true) {
        memberCoin += coin
    } else {
        memberCoin = coin
    }
}

function getMemberO2point() {
    return memberO2point
}

function setMemberO2point(O2point, isInc) {
    if (isInc == true) {
        memberO2point += O2point
    } else {
        memberO2point = O2point
    }
}

// 土地
function getMemberLand_status() {
    return memberLand_status
}

function setMemberLand_status(index, status) {
    memberLand_status[index] = status
}

function getMemberLand_statusID() {
    return memberLand_statusID
}

function setMemberLand_statusID(index, status) {
    memberLand_statusID[index] = status // 0=空的 / 1=已種植 / 2=已施肥 / 3=需挖除
}

function getMemberLand_cropTypeFrame() {
    return memberLand_cropTypeFrame
}

function setMemberLand_cropTypeFrame(index, type) {
    memberLand_cropTypeFrame[index] = type
}

function getMemberLand_cropStatus() {
    return memberLand_cropStatus
}

function setMemberLand_cropStatus(index, status) {
    memberLand_cropStatus[index] = status // 0=階段一/ 1=階段二 / 2=階段三 / null=無作物or枯萎
}

function getMemberLand_cropNeedSec() {
    return memberLand_cropNeedSec
}

function setMemberLand_cropNeedSec(index, sec) {
    memberLand_cropNeedSec[index] = sec
}

function getMemberLandOpened() {
    return memberLandOpened
}

function setMemberLandOpened(num) {
    memberLandOpened = num
}

// 倉庫空間
function getMemberSpace() {
    return memberSpace
}

function setMemberSpace(space) {
    memberSpace = space
}

// 種子/道具/作物
function getMemberTool() {
    return memberTool
}

function setMemberTool(toolIndex, toolNum, isInc) {
    if (isInc == true) {
        memberTool[toolIndex] += toolNum
    } else {
        memberTool[toolIndex] = toolNum
    }
}

function getMemberSeed() {
    return memberSeed
}

function setMemberSeed(seedIndex, seedNum, isInc) {
    if (isInc == true) {
        memberSeed[seedIndex] += seedNum
    } else {
        memberSeed[seedIndex] = seedNum
    }
}

function getMemberCrop() {
    return memberCrop
}

function setMemberCrop(cropIndex, cropNum, isInc) {
    if (isInc == true) {
        memberCrop[cropIndex] += cropNum
    } else {
        memberCrop[cropIndex] = cropNum
    }
}

// 任務
function getMemberTask() {
    return memberTask
}

function setMemberTask(taskIndex, num, isInc) {
    num = parseInt(num)
    if (isInc == true) {
        memberTask[taskIndex] += num
    } else {
        memberTask[taskIndex] = num
    }
}

function getMemberTaskReceived() {
    return memberTaskReceived
}

function setMemberTaskReceived(taskIndex, isReceived) {
    memberTaskReceived[taskIndex] = isReceived
}

function getMemberTaskboxOpened() {
    return memberTaskboxOpened
}

function setMemberTaskboxOpened(taskIndex, isOpened) {
    memberTaskboxOpened[taskIndex] = isOpened
}

// 成就
function getMemberAchiev_manager() {
    return memberAchiev_manager
}

function setMemberAchiev_manager(achievIndex, num, isInc) {
    if (isInc == true) {
        memberAchiev_manager[achievIndex] += num
    } else {
        memberAchiev_manager[achievIndex] = num
    }
}

function getMemberAchiev_managerStar() {
    return memberAchiev_managerStar
}

function setMemberAchiev_managerStar(achievIndex, star) {
    memberAchiev_managerStar[achievIndex] = star
}

function getMemberAchiev_managerReceived() {
    return memberAchiev_managerReceived
}

function setMemberAchiev_managerReceived(achievIndex, isReceived) {
    memberAchiev_managerReceived[achievIndex] = isReceived
}

function getMemberAchiev_book() {
    return memberAchiev_book
}

function setMemberAchiev_book(achievIndex, num, isInc) {
    if (isInc == true) {
        memberAchiev_book[achievIndex] += num
    } else {
        memberAchiev_book[achievIndex] = num
    }
}

function getMemberAchiev_bookStar() {
    return memberAchiev_bookStar
}

function setMemberAchiev_bookStar(achievIndex, star) {
    memberAchiev_bookStar[achievIndex] = star
}

function getMemberAchiev_bookReceived() {
    return memberAchiev_bookReceived
}

function setMemberAchiev_bookReceived(achievIndex, isReceived) {
    memberAchiev_bookReceived[achievIndex] = isReceived
}

function getMemberAchiev_grow() {
    return memberAchiev_grow
}

function setMemberAchiev_grow(achievIndex, num, isInc) {
    if (isInc == true) {
        memberAchiev_grow[achievIndex] += num
    } else {
        memberAchiev_grow[achievIndex] = num
    }
}

function getMemberAchiev_growStar() {
    return memberAchiev_growStar
}

function setMemberAchiev_growStar(achievIndex, star) {
    memberAchiev_growStar[achievIndex] = star
}

function getMemberAchiev_growReceived() {
    return memberAchiev_growReceived
}

function setMemberAchiev_growReceived(achievIndex, isReceived) {
    memberAchiev_growReceived[achievIndex] = isReceived
}

// 每日簽到
function getMemberCanSignToday() {
    return memberCanSignToday
}

function setMemberCanSignToday(flag) {
    memberCanSignToday = flag
}

function getMemberSignDay() {
    return memberSignDay
}

function setMemberSignDay(day, isInc) {
    if (isInc == true) {
        memberSignDay += day
    } else {
        memberSignDay = day
    }
}

function getMemberSignIn_gift() {
    return memberSignIn_gift
}

function setMemberSignIn_gift(index, gift) {
    memberSignIn_gift[index] = gift
}

// 圖鑑
function getMemberBook_N() {
    return memberBook_N
}

function setMemberBook_N(bookIndex, num, isInc) {
    if (isInc == true) {
        memberBook_N[bookIndex] += num
    } else {
        memberBook_N[bookIndex] = num
    }
}

function getLockMask_memberBookN() {
    return lockMask_memberBookN
}

function setLockMask_memberBookN(bookIndex, flag) {
    lockMask_memberBookN[bookIndex] = flag
}

function getMemberBook_NIntimacy() {
    return memberBook_NIntimacy
}

function setMemberBook_NIntimacy(bookIndex, intimacy) {
    memberBook_NIntimacy[bookIndex] = intimacy

    var achievIndex
    switch (bookIndex) {
        case 0:
            achievIndex = 0
            break;

        case 3:
            achievIndex = 1
            break;

        case 6:
            achievIndex = 2
            break;

        case 7:
            achievIndex = 3
            break;

        case 9:
            achievIndex = 4
            break;

        case 2:
            achievIndex = 15
            break;
    }

    if (achievIndex == undefined) return
    setMemberAchiev_book(achievIndex, memberBook_NIntimacy[bookIndex])
}

function getMemberBook_SR() {
    return memberBook_SR
}

function setMemberBook_SR(bookIndex, num, isInc) {
    if (isInc == true) {
        memberBook_SR[bookIndex] += num
    } else {
        memberBook_SR[bookIndex] = num
    }
}

function getLockMask_memberBookSR() {
    return lockMask_memberBookSR
}

function setLockMask_memberBookSR(bookIndex, flag) {
    lockMask_memberBookSR[bookIndex] = flag
}

function getMemberBook_SRIntimacy() {
    return memberBook_SRIntimacy
}

function setMemberBook_SRIntimacy(bookIndex, intimacy) {
    memberBook_SRIntimacy[bookIndex] = intimacy

    var achievIndex
    switch (bookIndex) {
        case 3:
            achievIndex = 5
            break;

        case 4:
            achievIndex = 6
            break;

        case 7:
            achievIndex = 7
            break;

        case 8:
            achievIndex = 8
            break;

        case 9:
            achievIndex = 9
            break;

        case 2:
            achievIndex = 12
            break;

        case 6:
            achievIndex = 18
            break;

        case 1:
            achievIndex = 19
            break;
    }

    if (achievIndex == undefined) return
    setMemberAchiev_book(achievIndex, memberBook_SRIntimacy[bookIndex])
}

function getMemberBook_SSR() {
    return memberBook_SSR
}

function setMemberBook_SSR(bookIndex, num, isInc) {
    if (isInc == true) {
        memberBook_SSR[bookIndex] += num
    } else {
        memberBook_SSR[bookIndex] = num
    }
}

function getLockMask_memberBookSSR() {
    return lockMask_memberBookSSR
}

function setLockMask_memberBookSSR(bookIndex, flag) {
    lockMask_memberBookSSR[bookIndex] = flag
}

function getMemberBook_SSRIntimacy() {
    return memberBook_SSRIntimacy
}

function setMemberBook_SSRIntimacy(bookIndex, intimacy) {
    memberBook_SSRIntimacy[bookIndex] = intimacy

    var achievIndex
    switch (bookIndex) {
        case 2:
            achievIndex = 10
            break;

        case 4:
            achievIndex = 11
            break;

        case 7:
            achievIndex = 13
            break;

        case 8:
            achievIndex = 14
            break;

        case 5:
            achievIndex = 16
            break;

        case 0:
            achievIndex = 17
    }

    if (achievIndex == undefined) return
    setMemberAchiev_book(achievIndex, memberBook_SSRIntimacy[bookIndex])
}

function getOwned_memberBookN() {
    return owned_memberBookN
}

function setOwned_memberBookN(bookIndex, flag) {
    owned_memberBookN[bookIndex] = flag
}

function getOwned_memberBookSR() {
    return owned_memberBookSR
}

function setOwned_memberBookSR(bookIndex, flag) {
    owned_memberBookSR[bookIndex] = flag
}

function getOwned_memberBookSSR() {
    return owned_memberBookSSR
}

function setOwned_memberBookSSR(bookIndex, flag) {
    owned_memberBookSSR[bookIndex] = flag
}

function getUpgradeNum_memberBookN() {
    return upgradeNum_memberBookN
}

function setUpgradeNum_memberBookN(bookIndex, flag) {
    upgradeNum_memberBookN[bookIndex] = flag
}

function getUpgradeNum_memberBookSR() {
    return upgradeNum_memberBookSR
}

function setUpgradeNum_memberBookSR(bookIndex, flag) {
    upgradeNum_memberBookSR[bookIndex] = flag
}

function getUpgradeNum_memberBookSSR() {
    return upgradeNum_memberBookSSR
}

function setUpgradeNum_memberBookSSR(bookIndex, flag) {
    upgradeNum_memberBookSSR[bookIndex] = flag
}

/* * * * * * * * * * * * * 等級 * * * * * * * * * * * * */
function getNextLV() {
    return nextLV
}

function setNextLV(lv) {
    nextLV = lv
}

function getNextExp() {
    return nextExp
}

function setNextExp(exp) {
    nextExp = exp
}

function getUpgradeGift() {
    return upgradeGift
}

function setUpgradeGift(gift) {
    upgradeGift = gift
}

function getUpgradeUnlock() {
    return upgradeUnlock
}

function setUpgradeUnlock(unlock) {
    upgradeUnlock = unlock
}

function getLv_index() {
    return lv_index
}

function setLv_index(action) {
    if (action == 'shift') {
        lv_index.shift()
    }
}

function getLv_exp() {
    return lv_exp
}

function setLv_exp(action) {
    if (action == 'shift') {
        lv_exp.shift()
    }
}

function getLv_gift() {
    return lv_gift
}

function setLv_gift(action) {
    if (action == 'shift') {
        lv_gift.shift()
    }
}

/* * * * * * * * * * * * * 倉庫 * * * * * * * * * * * * */
function getNewSpace_limitLV() {
    return newSpace_limitLV
}

function setNewSpace_limitLV(lv) {
    newSpace_limitLV.push(lv)
}

function shiftNewSpace_limitLV() {
    newSpace_limitLV.shift()
}

function getNewSpace_coinNum() {
    return newSpace_coinNum
}

function setNewSpace_coinNum(coinNum) {
    newSpace_coinNum.push(coinNum)
}

function shiftNewSpace_coinNum() {
    newSpace_coinNum.shift()
}

function getNewSpace_O2pointNum() {
    return newSpace_O2pointNum
}

function setNewSpace_O2pointNum(O2pointNum) {
    newSpace_O2pointNum.push(O2pointNum)
}

function shiftNewSpace_O2pointNum() {
    newSpace_O2pointNum.shift()
}


/* * * * * * * * * * * * * 土地 * * * * * * * * * * * * */
function getNewLand_limitLV() {
    return newLand_limitLV
}

function setNewLand_limitLV(index, lv) {
    newLand_limitLV[index] = lv
}

function getNewLand_coinNum() {
    return newLand_coinNum
}

function setNewLand_coinNum(index, coinNum) {
    newLand_coinNum[index] = coinNum
}

function getNewLand_O2pointNum() {
    return newLand_O2pointNum
}

function setNewLand_O2pointNum(index, O2pointNum) {
    newLand_O2pointNum[index] = O2pointNum
}


/* * * * * * * * * * * * * 種子/道具 * * * * * * * * * * * * */
function getToolName() {
    return toolName
}

function setToolName(index, name) {
    toolName[index] = name
}

function getFertilizerSec() {
    return fertilizerSec
}

function setFertilizerSec(index, sec) {
    fertilizerSec[index] = sec
}

function getCropName() {
    return cropName
}

function setCropName(index, name) {
    cropName[index] = name
}

function getGiftID() {
    return giftID
}

function setGiftID(index, ID) {
    giftID[index] = ID
}

function getGiftName() {
    return giftName
}

function setGiftName(index, name) {
    giftName[index] = name
}

function getGiftUrl() {
    return giftUrl
}

function setGiftUrl(index, url) {
    giftUrl[index] = url
}

function getGiftRequire() {
    return giftRequire
}

function setGiftRequire(index, require) {
    giftRequire[index] = require
}

function getGiftLeftNum() {
    return giftLeftNum
}

function setGiftLeftNum(index, num) {
    giftLeftNum[index] = num
}

function getGiftLeftHours() {
    return giftLeftHours
}

function setGiftLeftHours(index, hours) {
    giftLeftHours[index] = hours
}

function getBuyPrice_tool() {
    return buyPrice_tool
}

function setBuyPrice_tool(index, price) {
    buyPrice_tool[index] = price
}

function getSellPrice_tool() {
    return sellPrice_tool
}

function setSellPrice_tool(index, price) {
    sellPrice_tool[index] = price
}

function getBuyPrice_seed() {
    return buyPrice_seed
}

function setBuyPrice_seed(index, price) {
    buyPrice_seed[index] = price
}

function getSellPrice_crop() {
    return sellPrice_crop
}

function setSellPrice_crop(index, price) {
    sellPrice_crop[index] = price
}


/* * * * * * * * * * * * * 種子訊息 * * * * * * * * * * * * */
function getSeed_growSecLV2() {
    return seed_growSecLV2
}

function setSeed_growSecLV2(index, sec) {
    seed_growSecLV2[index] = sec
}

function getSeed_growSecLV3() {
    return seed_growSecLV3
}

function setSeed_growSecLV3(index, sec) {
    seed_growSecLV3[index] = sec
}

function getSeed_deadSec() {
    return seed_deadSec
}

function setSeed_deadSec(index, sec) {
    seed_deadSec[index] = sec
}

function getSeed_baseQTY() {
    return seed_baseQTY
}

function setSeed_baseQTY(index, qty) {
    seed_baseQTY[index] = qty
}

function getSeed_rateQTY() {
    return seed_rateQTY
}

function getSeed_exp() {
    return seed_exp
}

function setSeed_exp(index, exp) {
    seed_exp[index] = exp
}

function getSeed_limitLV() {
    return seed_limitLV
}

function setSeed_limitLV(index, lv) {
    seed_limitLV[index] = lv
}

/* * * * * * * * * * * * * 每日任務 * * * * * * * * * * * * */
function getTaskList() {
    return taskList
}

function setTaskList(index, list) {
    taskList[index] = list
}

function getTaskNum() {
    return taskNum
}

function setTaskNum(index, num) {
    taskNum[index] = num
}

function getTaskGift() {
    return taskGift
}

function setTaskGift(index, gift) {
    taskGift[index] = gift
}

function getTaskBoxGift() {
    return taskBoxGift
}

function setTaskBoxGift(index, gift) {
    taskBoxGift[index] = gift
}


/* * * * * * * * * * * * * 成就 * * * * * * * * * * * * */
function getAchievID_manager() {
    return achievID_manager
}

function setAchievID_manager(index, id) {
    achievID_manager[index] = id
}

function getAchievList_manager() {
    return achievList_manager
}

function setAchievList_manager(index, list) {
    achievList_manager[index] = list
}

function getAchievNum_manager() {
    return achievNum_manager
}

function setAchievNum_manager(index, num) {
    achievNum_manager[index] = num
}

function getAchievGift_manager() {
    return achievGift_manager
}

function setAchievGift_manager(index, gift) {
    achievGift_manager[index] = gift
}

function getAchievID_book() {
    return achievID_book
}

function setAchievID_book(index, id) {
    achievID_book[index] = id
}

function getAchievList_book() {
    return achievList_book
}

function setAchievList_book(index, list) {
    achievList_book[index] = list
}

function getAchievNum_book() {
    return achievNum_book
}

function setAchievNum_book(index, num) {
    achievNum_book[index] = num
}

function getAchievGift_book() {
    return achievGift_book
}

function setAchievGift_book(index, gift) {
    achievGift_book[index] = gift
}

function getAchievID_grow() {
    return achievID_grow
}

function setAchievID_grow(index, id) {
    achievID_grow[index] = id
}

function getAchievList_grow() {
    return achievList_grow
}

function setAchievList_grow(index, list) {
    achievList_grow[index] = list
}

function getAchievNum_grow() {
    return achievNum_grow
}

function setAchievNum_grow(index, num) {
    achievNum_grow[index] = num
}

function getAchievGift_grow() {
    return achievGift_grow
}

function setAchievGift_grow(index, gift) {
    achievGift_grow[index] = gift
}

/* * * * * * * * * * * * * 小紅點功能 * * * * * * * * * * * * */
function getTaskNoticeStar() {
    for (var i = 0; i < memberTask.length; i++) {
        if (memberTask[i] >= taskNum[i] && memberTaskReceived[i] == false) {
            return true
        }
    }

    // for (var i = 0; i < memberTaskboxOpened; i++) {
    //     if (memberTaskboxOpened[i] == true) {
    //         return true
    //     }
    // }
    return false
}

function getSignInNoticeStar() {
    if (memberCanSignToday == false) {
        return false
    } else {
        return true
    }
}

function getAchievNoticeStar() {
    var achievType = [achievNum_manager, achievNum_book, achievNum_grow]

    var memberAchievNum = [memberAchiev_manager, memberAchiev_book, memberAchiev_grow]
    var memberAchievTypeStar = [memberAchiev_managerStar, memberAchiev_bookStar, memberAchiev_growStar]
    var memberAchievTypeReceived = [memberAchiev_managerReceived, memberAchiev_bookReceived, memberAchiev_growReceived]

    for (var i = 0; i < achievType.length; i++) {
        for (var j = 0; j < memberAchievNum[i].length; j++) {
            if (memberAchievTypeStar[i][j] >= 3) {
                continue
            }

            if (memberAchievNum[i][j] >= achievType[i][j] && memberAchievTypeReceived[i][j] == false) {
                return true
            }
        }
    }
    return false
}

function getBookNoticeStar() {
    var bookType = [memberBook_N, memberBook_SR, memberBook_SSR]
    var lockMaskType = [lockMask_memberBookN, lockMask_memberBookSR, lockMask_memberBookSSR]

    for (var i = 0; i < bookType.length; i++) {
        for (var j = 0; j < bookType[i].length; j++) {
            if (bookType[i][j] > 0 && lockMaskType[i][j] == true) {
                return true
            }
        }
    }
    return false
}

export {
    getFirstEnter,
    setFirstEnter,
    getvirtualAwards_type,
    getVirtualAwards_frame,
    getRate_perO2toCoin,
    setRate_perO2toCoin,
    getRate_perO2toTime,
    setRate_perO2toTime,
    getLimit_perSpaceNum,

    getMemberPhoto,
    setMemberPhoto,
    getMemberName,
    setMemberName,
    getMemberLV,
    setMemberLV,
    getMemberExp,
    setMemberExp,
    getMemberCoin,
    setMemberCoin,
    getMemberO2point,
    setMemberO2point,

    getMemberLand_status,
    setMemberLand_status,
    getMemberLand_statusID,
    setMemberLand_statusID,
    getMemberLand_cropTypeFrame,
    setMemberLand_cropTypeFrame,
    getMemberLand_cropStatus,
    setMemberLand_cropStatus,
    getMemberLand_cropNeedSec,
    setMemberLand_cropNeedSec,
    getMemberLandOpened,
    setMemberLandOpened,
    getMemberSpace,
    setMemberSpace,
    getMemberTool,
    setMemberTool,
    getMemberSeed,
    setMemberSeed,
    getMemberCrop,
    setMemberCrop,

    getMemberTask,
    setMemberTask,
    getMemberTaskReceived,
    setMemberTaskReceived,
    getMemberTaskboxOpened,
    setMemberTaskboxOpened,

    getMemberAchiev_manager,
    setMemberAchiev_manager,
    getMemberAchiev_managerStar,
    setMemberAchiev_managerStar,
    getMemberAchiev_managerReceived,
    setMemberAchiev_managerReceived,
    getMemberAchiev_book,
    setMemberAchiev_book,
    getMemberAchiev_bookStar,
    setMemberAchiev_bookStar,
    getMemberAchiev_bookReceived,
    setMemberAchiev_bookReceived,
    getMemberAchiev_grow,
    setMemberAchiev_grow,
    getMemberAchiev_growStar,
    setMemberAchiev_growStar,
    getMemberAchiev_growReceived,
    setMemberAchiev_growReceived,

    getMemberCanSignToday,
    setMemberCanSignToday,
    getMemberSignDay,
    setMemberSignDay,
    getMemberSignIn_gift,
    setMemberSignIn_gift,

    getMemberBook_N,
    setMemberBook_N,
    getLockMask_memberBookN,
    setLockMask_memberBookN,
    getMemberBook_NIntimacy,
    setMemberBook_NIntimacy,
    getMemberBook_SR,
    setMemberBook_SR,
    getLockMask_memberBookSR,
    setLockMask_memberBookSR,
    getMemberBook_SRIntimacy,
    setMemberBook_SRIntimacy,
    getMemberBook_SSR,
    setMemberBook_SSR,
    getLockMask_memberBookSSR,
    setLockMask_memberBookSSR,
    getMemberBook_SSRIntimacy,
    setMemberBook_SSRIntimacy,
    getOwned_memberBookN,
    setOwned_memberBookN,
    getOwned_memberBookSR,
    setOwned_memberBookSR,
    getOwned_memberBookSSR,
    setOwned_memberBookSSR,
    getUpgradeNum_memberBookN,
    setUpgradeNum_memberBookN,
    getUpgradeNum_memberBookSR,
    setUpgradeNum_memberBookSR,
    getUpgradeNum_memberBookSSR,
    setUpgradeNum_memberBookSSR,

    getNextLV,
    setNextLV,
    getNextExp,
    setNextExp,
    getUpgradeGift,
    setUpgradeGift,
    getUpgradeUnlock,
    setUpgradeUnlock,
    getLv_index,
    setLv_index,
    getLv_exp,
    setLv_exp,
    getLv_gift,
    setLv_gift,

    getNewSpace_limitLV,
    setNewSpace_limitLV,
    shiftNewSpace_limitLV,
    getNewSpace_coinNum,
    setNewSpace_coinNum,
    shiftNewSpace_coinNum,
    getNewSpace_O2pointNum,
    setNewSpace_O2pointNum,
    shiftNewSpace_O2pointNum,

    getNewLand_limitLV,
    setNewLand_limitLV,
    getNewLand_coinNum,
    setNewLand_coinNum,
    getNewLand_O2pointNum,
    setNewLand_O2pointNum,

    getToolName,
    setToolName,
    getFertilizerSec,
    setFertilizerSec,
    getCropName,
    setCropName,
    getGiftName,
    setGiftName,
    getGiftID,
    setGiftID,
    getGiftUrl,
    setGiftUrl,
    getGiftRequire,
    setGiftRequire,
    getGiftLeftNum,
    setGiftLeftNum,
    getGiftLeftHours,
    setGiftLeftHours,

    getBuyPrice_tool,
    setBuyPrice_tool,
    getSellPrice_tool,
    setSellPrice_tool,
    getBuyPrice_seed,
    setBuyPrice_seed,
    getSellPrice_crop,
    setSellPrice_crop,

    getSeed_growSecLV2,
    setSeed_growSecLV2,
    getSeed_growSecLV3,
    setSeed_growSecLV3,
    getSeed_deadSec,
    setSeed_deadSec,
    getSeed_baseQTY,
    setSeed_baseQTY,
    getSeed_rateQTY,
    getSeed_exp,
    setSeed_exp,
    getSeed_limitLV,
    setSeed_limitLV,

    getTaskList,
    setTaskList,
    getTaskNum,
    setTaskNum,
    getTaskGift,
    setTaskGift,
    getTaskBoxGift,
    setTaskBoxGift,

    getAchievID_manager,
    setAchievID_manager,
    getAchievList_manager,
    setAchievList_manager,
    getAchievNum_manager,
    setAchievNum_manager,
    getAchievGift_manager,
    setAchievGift_manager,
    getAchievID_book,
    setAchievID_book,
    getAchievList_book,
    setAchievList_book,
    getAchievNum_book,
    setAchievNum_book,
    getAchievGift_book,
    setAchievGift_book,
    getAchievID_grow,
    setAchievID_grow,
    getAchievList_grow,
    setAchievList_grow,
    getAchievNum_grow,
    setAchievNum_grow,
    getAchievGift_grow,
    setAchievGift_grow,

    getTaskNoticeStar,
    getSignInNoticeStar,
    getAchievNoticeStar,
    getBookNoticeStar,
}