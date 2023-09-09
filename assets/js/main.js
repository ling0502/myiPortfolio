$(function () {
    // 啟用嚴格模式
    "use strict";

    // 左側導覽列 連結&樣式控制
    let navbarlinks = $('#navbar .scrollto');
    const navbarlinksActive = () => {
        let position = window.scrollY + 200
        navbarlinks.each(function () {
            if (!this.hash) return;
            let section = $(this.hash);
            if (!section.length) return;
            if (position >= section.offset().top && position <= (section.offset().top + section.outerHeight())) {
                $(this).addClass('active');
            } else {
                $(this).removeClass('active');
            }
        });
    }
    $(window).on('load', navbarlinksActive);
    $(document).on('scroll', navbarlinksActive);

    // 自定義(共用)：畫面捲動平滑動畫
    const scrollto = (el) => {
        let elementPos = $(el).offset().top;
        window.scrollTo({
            top: elementPos,
            behavior: 'smooth'
        });
    }

    // 返回頂端按鈕
    let backtotop = $('.back-to-top');
    if (backtotop.length) {
        const toggleBacktotop = () => {
            if (window.scrollY > 100) {
                backtotop.addClass('active');
            } else {
                backtotop.removeClass('active');
            }
        }
        $(window).on('load', toggleBacktotop);
        $(document).on('scroll', toggleBacktotop);
    }

    // 行動裝置版 上方導覽列icon切換 - 點擊導覽列icon時
    $('.mobile-nav-toggle').on('click', function (e) {
        $(this).toggleClass('bx-x');
    });

    // 行動裝置版 上方導覽列icon切換 - 點擊導覽列項目時
    let navbarToggle = $('.mobile-nav-toggle');
    $('#mobileNavbar .scrollto').on('click', function (e) {
        navbarToggle.toggleClass('bx-x');
    });

    // 左側導覽列控制
    $('.scrollto').on('click', function (e) {
        if ($(this.hash).length) {
            e.preventDefault();
            let body = $('body');
            if (body.hasClass('mobile-nav-active')) {
                body.removeClass('mobile-nav-active');
                let navbarToggle = $('.mobile-nav-toggle');
                navbarToggle.toggleClass('bi-list bi-x');
            }
            scrollto(this.hash);
        }
    });

    // 刷新後 頁面捲動到上次的位置
    $(window).on('load', () => {
        if (window.location.hash && $(window.location.hash).length) {
            scrollto(window.location.hash);
        }
    });

    // 遊戲專案 輪播插件效果(swiper)
    new Swiper('.portfolios-slider', {
        speed: 600,
        loop: true,
        slidesPerView: 'auto',
        pagination: {
            el: '.swiper-pagination',
            type: 'bullets',
            clickable: true
        },
        breakpoints: {
            576: {
                slidesPerView: 1,
                spaceBetween: 20
            },
            768: {
                slidesPerView: 2,
                spaceBetween: 30
            },
            1200: {
                slidesPerView: 3,
                spaceBetween: 20
            }
        }
    });

    // 滾動框架動畫(AOS)
    $(window).on('load', () => {
        AOS.init({
            duration: 1000,
            easing: 'ease-in-out',
            once: false, // 重複觸發動畫
            mirror: false // 超過滾動範圍時，做移出的動畫效果
        })
    });

});