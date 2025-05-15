$(document).ready(function() {
    /**
     * 画廊作品数据数组
     * 存储所有剪纸作品信息
     * @type {Array<Object>}
     * @property {number} id - 作品ID
     * @property {string} title - 作品标题
     * @property {string} category - 作品分类
     * @property {string} image - 作品图片URL
     * @property {string} description - 作品描述
     */
    const galleryItems = [
        {
            id: 1,
            title: '春节窗花',
            category: 'traditional',
            image: 'https://via.placeholder.com/400',
            description: '传统春节窗花剪纸作品'
        },
        {
            id: 2,
            title: '现代抽象',
            category: 'modern',
            image: 'https://via.placeholder.com/400',
            description: '现代风格抽象剪纸艺术'
        },
        {
            id: 3,
            title: '福字剪纸',
            category: 'festival',
            image: 'https://via.placeholder.com/400',
            description: '新年福字剪纸'
        },
        {
            id: 4,
            title: '龙纹图案',
            category: 'traditional',
            image: 'https://via.placeholder.com/400',
            description: '传统龙纹剪纸'
        },
        {
            id: 5,
            title: '现代人物',
            category: 'modern',
            image: 'https://via.placeholder.com/400',
            description: '现代风格人物剪纸'
        },
        {
            id: 6,
            title: '中秋月饼',
            category: 'festival',
            image: 'https://via.placeholder.com/400',
            description: '中秋节主题剪纸'
        }
    ];

    /**
     * 当前筛选器和分页状态
     * @type {string} currentFilter - 当前选中的筛选类别
     * @type {number} currentPage - 当前页码
     * @type {number} itemsPerPage - 每页显示的作品数量
     */
    let currentFilter = 'all';
    let currentPage = 1;
    const itemsPerPage = 6;

    /**
     * 渲染画廊作品
     * @param {string} filter - 筛选类别
     * @param {number} page - 页码
     */
    function renderGallery(filter = 'all', page = 1) {
        const $gallery = $('.gallery-grid');
        const filteredItems = filter === 'all' 
            ? galleryItems 
            : galleryItems.filter(item => item.category === filter);

        // 计算分页
        const startIndex = (page - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        const itemsToShow = filteredItems.slice(startIndex, endIndex);

        // 清空画廊
        if (page === 1) {
            $gallery.empty();
        }

        // 使用forEach循环添加作品
        itemsToShow.forEach(item => {
            const $item = $(`
                <div class="gallery-item" data-category="${item.category}">
                    <a href="${item.image}" data-fancybox="gallery" data-caption="${item.title}">
                        <img src="${item.image}" alt="${item.title}">
                        <div class="gallery-info">
                            <h3>${item.title}</h3>
                            <p>${item.description}</p>
                        </div>
                    </a>
                </div>
            `);

            // 添加淡入动画效果
            $item.hide().appendTo($gallery).fadeIn(500);
        });

        // 更新加载更多按钮状态
        const $loadMoreBtn = $('#loadMoreBtn');
        if (endIndex >= filteredItems.length) {
            $loadMoreBtn.hide();
        } else {
            $loadMoreBtn.show();
        }

        // 初始化 Fancybox
        $('[data-fancybox="gallery"]').fancybox({
            buttons: [
                'zoom',
                'slideShow',
                'fullScreen',
                'close'
            ],
            loop: true,
            protect: true
        });
    }

    // 筛选按钮点击事件
    $('.filter-btn').on('click', function() {
        const $this = $(this);
        currentFilter = $this.data('filter');
        currentPage = 1;

        // 更新按钮状态
        $('.filter-btn').removeClass('active');
        $this.addClass('active');

        // 使用Promise处理异步动画
        new Promise((resolve) => {
            $('.gallery-grid').fadeOut(300, resolve);
        }).then(() => {
            renderGallery(currentFilter, currentPage);
            $('.gallery-grid').fadeIn(300);
        });
    });

    // 加载更多按钮点击事件
    $('#loadMoreBtn').on('click', function() {
        currentPage++;
        renderGallery(currentFilter, currentPage);
    });

    // 响应式菜单
    const $menuToggle = $('.menu-toggle');
    const $navMenu = $('.nav-menu');
    
    $menuToggle.on('click', function() {
        $navMenu.slideToggle(300);
        $(this).toggleClass('active');
    });

    // 监听窗口大小变化
    $(window).on('resize', function() {
        if ($(window).width() > 768) {
            $navMenu.removeAttr('style');
            $menuToggle.removeClass('active');
        }
    });

    // 初始化页面
    renderGallery();
});