$(document).ready(function() {
    /**
     * 教程数据数组
     * 存储所有剪纸教程信息
     * @type {Array<Object>}
     * @property {number} id - 教程唯一标识
     * @property {string} title - 教程标题
     * @property {string} image - 教程封面图片URL
     * @property {string} difficulty - 难度级别
     * @property {string} description - 教程描述
     */
    const tutorials = [
        {
            id: 1,
            title: '基础窗花剪纸',
            image: 'https://via.placeholder.com/300',
            difficulty: 'beginner',
            description: '适合初学者的传统窗花剪纸教程'
        },
        {
            id: 2,
            title: '福字剪纸技巧',
            image: 'https://via.placeholder.com/300',
            difficulty: 'intermediate',
            description: '传统福字的剪纸方法和技巧'
        },
        {
            id: 3,
            title: '高级龙纹剪纸',
            image: 'https://via.placeholder.com/300',
            difficulty: 'advanced',
            description: '复杂龙纹图案的剪纸技术'
        }
    ];

    /**
     * 教程步骤数据
     * 定义剪纸教程的具体步骤
     * @type {Array<Object>}
     * @property {number} number - 步骤序号
     * @property {string} title - 步骤标题
     * @property {string} content - 步骤详细说明
     */
    const steps = [
        {
            number: 1,
            title: '准备工具',
            content: '准备剪纸工具：剪刀、刻刀、垫板、红纸等必要材料。'
        },
        {
            number: 2,
            title: '设计图案',
            content: '在纸上画出想要的图案，注意对称性和整体布局。'
        },
        {
            number: 3,
            title: '折叠纸张',
            content: '根据图案特点对纸张进行对折，可以是对角、对半等。'
        },
        {
            number: 4,
            title: '剪纸技巧',
            content: '从内到外依次剪切，注意力度和角度的控制。'
        }
    ];

    /**
     * 渲染教程卡片
     * 将教程数据渲染为可视化的卡片形式
     * 包含图片、标题、难度和描述信息
     */
    function renderTutorials() {
        const $grid = $('.tutorial-grid');

        // 使用forEach遍历教程数组
        tutorials.forEach(tutorial => {
            const $card = $(`
                <div class="tutorial-card" data-id="${tutorial.id}">
                    <div class="tutorial-image">
                        <img src="${tutorial.image}" alt="${tutorial.title}">
                    </div>
                    <div class="tutorial-content">
                        <span class="difficulty ${tutorial.difficulty}">
                            ${tutorial.difficulty.charAt(0).toUpperCase() + tutorial.difficulty.slice(1)}
                        </span>
                        <h3>${tutorial.title}</h3>
                        <p>${tutorial.description}</p>
                        <button class="btn">开始学习</button>
                    </div>
                </div>
            `);

            // 添加点击事件
            $card.find('.btn').on('click', function() {
                scrollToSteps();
            });

            $grid.append($card);
        });
    }

    /**
     * 渲染教程步骤
     * 创建步骤列表并添加动画效果
     */
    function renderSteps() {
        const $stepList = $('.step-list');

        // 使用for...of循环
        for (const step of steps) {
            const $step = $(`
                <li class="step-item">
                    <div class="step-number">${step.number}</div>
                    <div class="step-content">
                        <h4>${step.title}</h4>
                        <p>${step.content}</p>
                    </div>
                </li>
            `);

            $stepList.append($step);
        }

        // 使用Promise处理动画效果
        const animateSteps = () => {
            return new Promise((resolve) => {
                $('.step-item').each(function(index) {
                    const $step = $(this);
                    setTimeout(() => {
                        $step.css({
                            opacity: 1,
                            transform: 'translateY(0)'
                        });
                    }, index * 200);
                });
                setTimeout(resolve, steps.length * 200);
            });
        };

        // 监听滚动事件，触发动画
        let animated = false;
        $(window).on('scroll', function() {
            const $steps = $('.tutorial-steps');
            if (!animated && isElementInViewport($steps)) {
                animated = true;
                animateSteps();
            }
        });
    }

    /**
     * 检查元素是否在视口中
     * @param {jQuery} $element - 要检查的jQuery元素
     * @returns {boolean} 元素是否在视口中
     */
    function isElementInViewport($element) {
        const rect = $element[0].getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= $(window).height() &&
            rect.right <= $(window).width()
        );
    }

    /**
     * 平滑滚动到步骤部分
     * 实现页面平滑滚动效果
     */
    function scrollToSteps() {
        $('html, body').animate({
            scrollTop: $('.tutorial-steps').offset().top - 100
        }, 800);
    }

    // 小技巧展开/收起效果
    $('.tips-toggle').on('click', function() {
        const $content = $('.tips-content');
        const $icon = $('.toggle-icon');

        // 使用if...else条件语句
        if ($content.is(':visible')) {
            $content.slideUp(300);
            $icon.text('▼');
        } else {
            $content.slideDown(300);
            $icon.text('▲');
        }
    });

    // 响应式菜单
    const $menuToggle = $('.menu-toggle');
    const $navMenu = $('.nav-menu');
    let isMenuOpen = false;

    $menuToggle.on('click', function() {
        isMenuOpen = !isMenuOpen;
        $navMenu.slideToggle(300);
        $(this).toggleClass('active');
    });

    // 监听窗口大小变化
    $(window).on('resize', function() {
        if ($(window).width() > 768) {
            $navMenu.removeAttr('style');
            $menuToggle.removeClass('active');
            isMenuOpen = false;
        }
    });

    // 初始化页面
    renderTutorials();
    renderSteps();
});