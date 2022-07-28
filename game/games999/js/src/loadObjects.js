import { uiTables } from './UIScene'
import { hideBoard, hideCover, hideSmallBoard, hideSmallCover } from './Controller.js'

export default class loadObjects extends Phaser.Scene {
    constructor() {
        super('loadObjects');
    }

    init(data) {
        console.log(data);
        this.x = data.x;
        this.y = data.y;
        this.UiID = data.UiID;
        this.type = data.type;
    }

    preload() {
        // UiID 對照 = { // = UIScene - uiTables[]
        //     0: taskTable,
        //     1: signInTable,
        //     2: achievementTable,
        //     3: bookTable,
        //     4: warehouseTable,
        //     5: shopTable,
        //     6: cropMenu,
        //     7: toolMenu,
        // }

        this.load.image('smallCover', './assets/smallCover.png'); // 小框黑色底圖

        this.load.image('bg_table', './assets/bg_table.png');
        this.load.image('bg_rect', './assets/bg_rect.png');

        if (this.UiID != 3) {
            this.load.spritesheet('obj_tool', './assets/obj_tool.png', { frameWidth: 120, frameHeight: 100 });
            this.load.spritesheet('obj_seed', './assets/obj_seed.png', { frameWidth: 120, frameHeight: 100 });
        }

        if (this.UiID == 3 || this.UiID == 5) {
            this.load.spritesheet('bg_locked', './assets/bg_locked.png', { frameWidth: 150, frameHeight: 175 });
        }

        if (this.UiID == 4 || this.UiID == 5) {
            this.load.spritesheet('label_tool', './assets/label_tool.png', { frameWidth: 80, frameHeight: 35 });
        }


        /* * * * * * * * * * * * * taskTable * * * * * * * * * * * * */
        if (this.UiID == 0) {
            this.load.image('bg_taskRect', './assets/bg_taskRect.png');
            this.load.image('title_task', './assets/title_task.png');

            this.load.spritesheet('obj_box', './assets/obj_box.png', { frameWidth: 50, frameHeight: 50 });
            this.load.spritesheet('label_daily', './assets/label_daily.png', { frameWidth: 80, frameHeight: 35 });
        }


        /* * * * * * * * * * * * * signInTable * * * * * * * * * * * * */
        else if (this.UiID == 1) {
            this.load.image('bg_signInBoard', './assets/bg_signInBoard.png');
            this.load.spritesheet('obj_signInBack', './assets/obj_signInBack.png', { frameWidth: 105, frameHeight: 140 });
        }


        /* * * * * * * * * * * * * achievement * * * * * * * * * * * * */
        else if (this.UiID == 2) {
            this.load.image('bg_achievementRect', './assets/bg_achievementRect.png');
            this.load.image('title_achievement', './assets/title_achievement.png');

            this.load.spritesheet('label_manage', './assets/label_manage.png', { frameWidth: 80, frameHeight: 35 });
            this.load.spritesheet('label_book', './assets/label_book.png', { frameWidth: 80, frameHeight: 35 });
            this.load.spritesheet('label_grow', './assets/label_grow.png', { frameWidth: 80, frameHeight: 35 });
            this.load.spritesheet('obj_star', './assets/obj_star.png', { frameWidth: 50, frameHeight: 15 });
        }


        /* * * * * * * * * * * * * bookTable * * * * * * * * * * * * */
        else if (this.UiID == 3) {
            this.load.image('title_book', './assets/title_book.png');
            this.load.image('obj_bookLock', './assets/obj_bookLock.png');

            this.load.spritesheet('obj_N', './assets/obj_N.png', { frameWidth: 125, frameHeight: 130 });
            this.load.spritesheet('obj_SR', './assets/obj_SR.png', { frameWidth: 125, frameHeight: 130 });
            this.load.spritesheet('obj_SSR', './assets/obj_SSR.png', { frameWidth: 125, frameHeight: 130 });
            this.load.spritesheet('obj_heart', './assets/obj_heart.png', { frameWidth: 30, frameHeight: 25 });
            this.load.spritesheet('label_N', './assets/label_N.png', { frameWidth: 80, frameHeight: 35 });
            this.load.spritesheet('label_SR', './assets/label_SR.png', { frameWidth: 80, frameHeight: 35 });
            this.load.spritesheet('label_SSR', './assets/label_SSR.png', { frameWidth: 80, frameHeight: 35 });
            this.load.spritesheet('bg_bookRect', './assets/bg_bookRect.png', { frameWidth: 150, frameHeight: 175 });
        }


        /* * * * * * * * * * * * * warehouseTable * * * * * * * * * * * * */
        else if (this.UiID == 4) {
            this.load.image('bg_warehouseTable', './assets/bg_warehouseTable.png');
            this.load.image('bg_warehouseRect', './assets/bg_warehouseRect.png');
            this.load.image('bg_cropRect', './assets/bg_cropRect.png');
            this.load.image('title_warehouse', './assets/title_warehouse.png');

            this.load.spritesheet('label_crop', './assets/label_crop.png', { frameWidth: 80, frameHeight: 35 });
        }


        /* * * * * * * * * * * * * shopTable * * * * * * * * * * * * */
        else if (this.UiID == 5) {
            this.load.image('bg_shopRect', './assets/bg_shopRect.png');
            this.load.image('bg_costRect', './assets/bg_costRect.png');
            this.load.image('title_shop', './assets/title_shop.png');

            this.load.spritesheet('obj_gift', './assets/obj_gift.png', { frameWidth: 120, frameHeight: 100 });
            this.load.spritesheet('bg_soldOut', './assets/bg_soldOut.png', { frameWidth: 150, frameHeight: 175 });
            this.load.spritesheet('label_seed', './assets/label_seed.png', { frameWidth: 80, frameHeight: 35 });
            this.load.spritesheet('label_timeLimit', './assets/label_timeLimit.png', { frameWidth: 80, frameHeight: 35 });
        }


        /* * * * * * * * * * * * * cropMenu  * * * * * * * * * * * * */
        else if (this.UiID == 6) {
            this.load.image('bg_cropMenu', './assets/bg_cropMenu.png');
        }


        /* * * * * * * * * * * * *  toolMenu * * * * * * * * * * * * */
        else if (this.UiID == 7) {
            this.load.image('bg_toolMenu', './assets/bg_toolMenu.png');
        }
    }

    create() {
        this.input.setTopOnly(true);
        this.input.setGlobalTopOnly(true);

        this.sceneUI = this.scene.get('UI');
        this.sceneUI.events.on('hideAllBoard', function(data) {
            console.log('hideAllBoard')
            hideBoard(this);
            hideCover(this.sceneUI);
            hideSmallBoard(this);
            hideSmallCover(this);
        }, this)

        if (this.UiID == 6 || this.UiID == 7) {
            this.board = new uiTables[this.UiID]().create(this, this.x, this.y);
        } else {
            this.board = new uiTables[this.UiID]().create(this);
        }

        if (this.board == undefined) return

        this.events.emit('showBoard', { board: this.board, boardKey: this.UiID }); // 至UIScene接收
    }
}