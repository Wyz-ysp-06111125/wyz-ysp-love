// 等待DOM加载完成
$(document).ready(function() {
    /**
     * 导航菜单状态控制
     * @type {jQuery} $menuToggle - 菜单切换按钮
     * @type {jQuery} $navMenu - 导航菜单
     * @type {boolean} isMenuOpen - 菜单是否打开
     */
    const $menuToggle = $('.menu-toggle');
    const $navMenu = $('.nav-menu');
    let isMenuOpen = false;

    /**
     * Swiper轮播图配置
     * 设置自动播放、导航按钮和分页器
     */
    const swiper = new Swiper('.swiper-container', {
        loop: true,
        autoplay: {
            delay: 5000,
            disableOnInteraction: false,
        },
        pagination: {
            el: '.swiper-pagination',
            clickable: true,
        },
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
        },
    });

    /**
     * 最新作品数据
     * @type {Array<Object>}
     * @property {number} id - 作品ID
     * @property {string} title - 作品标题
     * @property {string} image - 作品图片URL
     * @property {string} description - 作品描述
     */
    const works = [
        {
            id: 1,
            title: '春节剪纸',
            image: 'https://via.placeholder.com/300',
            description: '传统春节剪纸作品'
        },
        {
            id: 2,
            title: '福字剪纸',
            image: 'https://via.placeholder.com/300',
            description: '精美福字剪纸'
        },
        {
            id: 3,
            title: '龙纹剪纸',
            image: 'https://via.placeholder.com/300',
            description: '传统龙纹图案'
        }
    ];

    /**
     * 加载最新作品
     * 动态创建作品卡片并添加交互效果
     */
    function loadLatestWorks() {
        const $worksGrid = $('.works-grid');
        
        // 使用循环结构
        for (let i = 0; i < works.length; i++) {
            const work = works[i];
            const workElement = $(`
                <div class="work-item" data-id="${work.id}">
                    <img src="${work.image}" alt="${work.title}">
                    <div class="work-info">
                        <h3>${work.title}</h3>
                        <p>${work.description}</p>
                    </div>
                </div>
            `);
            
            // 添加hover效果
            workElement.hover(
                function() { $(this).find('img').css('transform', 'scale(1.1)'); },
                function() { $(this).find('img').css('transform', 'scale(1)'); }
            );

            $worksGrid.append(workElement);
        }
    }

    /**
     * 页面滚动效果处理
     * 包含头部固定和内容动画
     */
    $(window).on('scroll', function() {
        // 使用箭头函数和Promise处理异步
        const checkScroll = () => {
            return new Promise((resolve) => {
                setTimeout(() => {
                    if ($(window).scrollTop() > 100) {
                        $('.header').addClass('scrolled');
                        resolve(true);
                    } else {
                        $('.header').removeClass('scrolled');
                        resolve(false);
                    }
                }, 100);
            });
        };

        checkScroll().then((isScrolled) => {
            // 根据滚动状态添加动画效果
            if (isScrolled) {
                $('.feature-item').each(function(index) {
                    $(this).delay(index * 100).fadeIn(500);
                });
            }
        });
    });

    // 特色内容区域动画
    $('.feature-item').hover(function() {
        $(this).stop().animate({
            marginTop: '-10px'
        }, 300);
    }, function() {
        $(this).stop().animate({
            marginTop: '0'
        }, 300);
    });

    // 初始化页面
    loadLatestWorks();

    // 作品点击事件处理
    $('.works-grid').on('click', '.work-item', function() {
        const workId = $(this).data('id');
        // 使用数组方法查找作品
        const selectedWork = works.find(work => work.id === workId);
        
        if (selectedWork) {
            // 创建模态框显示作品详情
            const $modal = $('<div>').addClass('modal').appendTo('body');
            const $modalContent = $('<div>').addClass('modal-content').appendTo($modal);
            
            $modalContent.html(`
                <h2>${selectedWork.title}</h2>
                <img src="${selectedWork.image}" alt="${selectedWork.title}">
                <p>${selectedWork.description}</p>
            `);

            // 点击模态框外关闭
            $modal.on('click', function(e) {
                if ($(e.target).is($modal)) {
                    $modal.fadeOut(300, function() {
                        $(this).remove();
                    });
                }
            });

            $modal.fadeIn(300);
        }
    });
});