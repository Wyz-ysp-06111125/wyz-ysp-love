$(document).ready(function() {
    /**
     * 历史数据数组
     * 包含剪纸艺术发展的重要历史节点
     * @type {Array<Object>}
     * @property {string} year - 历史年代
     * @property {string} title - 事件标题
     * @property {string} content - 详细描述
     */
    const historyData = [
        {
            year: '远古时代',
            title: '剪纸艺术起源',
            content: '剪纸艺术可以追溯到远古时代，最早起源于纸张发明之后。'
        },
        {
            year: '汉代',
            title: '剪纸艺术发展',
            content: '汉代时期，剪纸艺术已经开始在民间流传，用于装饰和祭祀。'
        },
        {
            year: '唐宋时期',
            title: '剪纸艺术繁荣',
            content: '唐宋时期，剪纸艺术达到了一个高峰，技艺更加精湛。'
        },
        {
            year: '现代',
            title: '创新与传承',
            content: '现代剪纸艺术在传统基础上不断创新，展现出新的艺术魅力。'
        }
    ];

    /**
     * 团队成员数据数组
     * 存储团队核心成员信息
     * @type {Array<Object>}
     * @property {string} name - 成员姓名
     * @property {string} title - 职位头衔
     * @property {string} avatar - 头像图片URL
     * @property {string} description - 个人简介
     */
    const teamMembers = [
        {
            name: '张艺术',
            title: '艺术总监',
            avatar: 'https://via.placeholder.com/150',
            description: '从事剪纸艺术创作20年，多次获得国家级奖项。'
        },
        {
            name: '李传承',
            title: '资深教师',
            avatar: 'https://via.placeholder.com/150',
            description: '专注剪纸艺术教学15年，培养了众多优秀学员。'
        },
        {
            name: '王创新',
            title: '新锐艺术家',
            avatar: 'https://via.placeholder.com/150',
            description: '致力于将传统剪纸与现代艺术相结合。'
        }
    ];

    /**
     * 渲染历史时间线
     * 将历史数据动态渲染到页面上
     * 使用 jQuery 创建并添加时间线项目
     */
    function renderTimeline() {
        const $timeline = $('.history-timeline');

        // 遍历历史数据并创建时间线项
        historyData.forEach((item, index) => {
            const $timelineItem = $(`
                <div class="timeline-item">
                    <div class="timeline-content">
                        <div class="timeline-year">${item.year}</div>
                        <h3>${item.title}</h3>
                        <p>${item.content}</p>
                    </div>
                </div>
            `);

            $timeline.append($timelineItem);
        });
    }

    /**
     * 渲染团队成员信息
     * 动态创建团队成员卡片并添加到网格中
     * 包含头像、姓名、职位和描述信息
     */
    function renderTeam() {
        const $teamGrid = $('.team-grid');

        // 使用for...of循环添加团队成员
        for (const member of teamMembers) {
            const $memberCard = $(`
                <div class="team-member">
                    <div class="member-avatar">
                        <img src="${member.avatar}" alt="${member.name}">
                    </div>
                    <div class="member-info">
                        <h3>${member.name}</h3>
                        <p class="title">${member.title}</p>
                        <p>${member.description}</p>
                    </div>
                </div>
            `);

            $teamGrid.append($memberCard);
        }
    }

    /**
     * 处理页面滚动动画效果
     * 包含时间线和团队成员的入场动画
     * 使用 Promise 处理动画序列
     */
    function handleScrollAnimations() {
        /**
         * 动画时间线项目
         * @returns {Promise} 动画完成的Promise
         */
        const animateTimelineItems = () => {
            return new Promise((resolve) => {
                $('.timeline-item').each(function(index) {
                    const $item = $(this);
                    setTimeout(() => {
                        $item.css({
                            opacity: 1,
                            transform: 'translateX(0)'
                        });
                    }, index * 300);
                });
                setTimeout(resolve, historyData.length * 300);
            });
        };

        /**
         * 检查元素是否在视口中
         * @param {jQuery} $element - 要检查的jQuery元素
         * @returns {boolean} 元素是否在视口中
         */
        const isElementInViewport = ($element) => {
            const rect = $element[0].getBoundingClientRect();
            return (
                rect.top >= 0 &&
                rect.bottom <= $(window).height() &&
                rect.left >= 0 &&
                rect.right <= $(window).width()
            );
        };

        // 初始化动画状态
        let timelineAnimated = false;
        let teamAnimated = false;

        // 监听滚动事件
        $(window).on('scroll', function() {
            // 时间线动画
            if (!timelineAnimated && isElementInViewport($('.history-timeline'))) {
                timelineAnimated = true;
                animateTimelineItems();
            }

            // 团队成员动画
            if (!teamAnimated && isElementInViewport($('.team-section'))) {
                teamAnimated = true;
                $('.team-member').each(function(index) {
                    const $member = $(this);
                    setTimeout(() => {
                        $member.css({
                            opacity: 1,
                            transform: 'translateY(0)'
                        });
                    }, index * 200);
                });
            }
        });
    }

    /**
     * 响应式菜单处理
     * 控制移动端菜单的显示和隐藏
     */
    const $menuToggle = $('.menu-toggle');
    const $navMenu = $('.nav-menu');
    let isMenuOpen = false;

    $menuToggle.on('click', function() {
        isMenuOpen = !isMenuOpen;
        $navMenu.slideToggle(300);
        $(this).toggleClass('active');
    });

    /**
     * 监听窗口大小变化
     */
    $(window).on('resize', function() {
        if ($(window).width() > 768) {
            $navMenu.removeAttr('style');
            $menuToggle.removeClass('active');
            isMenuOpen = false;
        }
    });

    /**
     * 初始化页面
     */
    renderTimeline();
    renderTeam();
    handleScrollAnimations();

    /**
     * 页面加载完成后触发一次滚动检查
     */
    $(window).trigger('scroll');
});

/**
 * 数据管理功能
 * 实现数据的增删改查操作
 */

/**
 * 存储数据的数组和当前ID计数器
 * @type {Array<Object>} dataArray - 存储所有数据项
 * @type {number} currentId - 当前最新ID值
 */
let dataArray = [];
let currentId = 1;

/**
 * 添加新数据项
 * 获取表单数据并添加到数组中
 */
function addItem() {
    const name = document.getElementById('itemName').value;
    const description = document.getElementById('itemDescription').value;
    const category = document.getElementById('itemCategory').value;

    const newItem = {
        id: currentId++,
        name: name,
        description: description,
        category: category
    };

    dataArray.push(newItem);
    renderTable();
    clearForm();
}

/**
 * 删除数据项
 * @param {number} id - 要删除的数据项ID
 */
function deleteItem(id) {
    if (confirm('确定要删除这条数据吗？')) {
        dataArray = dataArray.filter(item => item.id !== id);
        renderTable();
    }
}

/**
 * 编辑数据项
 * @param {number} id - 要编辑的数据项ID
 */
function editItem(id) {
    const item = dataArray.find(item => item.id === id);
    if (item) {
        document.getElementById('itemName').value = item.name;
        document.getElementById('itemDescription').value = item.description;
        document.getElementById('itemCategory').value = item.category;
        
        // 删除原数据
        dataArray = dataArray.filter(item => item.id !== id);
        renderTable();
    }
}

/**
 * 搜索数据项
 * @param {string} query - 搜索关键词
 */
function searchItems(query) {
    if (!query) {
        renderTable(dataArray);
        return;
    }

    const filteredData = dataArray.filter(item => 
        item.name.toLowerCase().includes(query.toLowerCase()) ||
        item.description.toLowerCase().includes(query.toLowerCase()) ||
        item.category.toLowerCase().includes(query.toLowerCase())
    );
    renderTable(filteredData);
}

/**
 * 渲染数据表格
 * @param {Array<Object>} data - 要渲染的数据数组
 */
function renderTable(data = dataArray) {
    const tbody = document.getElementById('dataTable').getElementsByTagName('tbody')[0];
    tbody.innerHTML = '';

    data.forEach(item => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${item.id}</td>
            <td>${item.name}</td>
            <td>${item.description}</td>
            <td>${item.category}</td>
            <td class="action-buttons">
                <button class="btn btn-edit" onclick="editItem(${item.id})">编辑</button>
                <button class="btn btn-delete" onclick="deleteItem(${item.id})">删除</button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

/**
 * 清空表单数据
 * 重置所有输入字段
 */
function clearForm() {
    document.getElementById('itemName').value = '';
    document.getElementById('itemDescription').value = '';
    document.getElementById('itemCategory').value = '';
}