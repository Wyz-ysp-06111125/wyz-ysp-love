// 模拟数据
const mockData = [
  {
    id: 1,
    title: '前端开发技术分享',
    category: '技术',
    description: 'Vue.js 是一套用于构建用户界面的渐进式框架。与其它大型框架不同的是，Vue 被设计为可以自底向上逐层应用。',
    date: '2023-05-15'
  },
  {
    id: 2,
    title: '市场营销策略分析',
    category: '市场',
    description: '本文分析了当前市场环境下的营销策略，包括数字营销、内容营销和社交媒体营销等多种方式的优缺点比较。',
    date: '2023-06-20'
  },
  {
    id: 3,
    title: '2023年第二季度财务报告',
    category: '财务',
    description: '本季度公司营收增长15%，净利润增长10%，主要得益于新产品线的成功推出和成本控制措施的有效实施。',
    date: '2023-07-10'
  },
  {
    id: 4,
    title: '员工培训计划',
    category: '人力资源',
    description: '为提升员工技能和职业发展，公司计划在下半年开展一系列培训，包括技术培训、管理培训和软技能培训。',
    date: '2023-07-25'
  },
  {
    id: 5,
    title: '后端架构优化方案',
    category: '技术',
    description: '针对当前系统的性能瓶颈，提出了包括数据库优化、缓存策略和微服务架构在内的多项优化方案。',
    date: '2023-08-05'
  },
  {
    id: 6,
    title: '新产品市场调研报告',
    category: '市场',
    description: '通过问卷调查和焦点小组讨论，对目标市场的需求、竞争情况和价格敏感度进行了深入分析。',
    date: '2023-08-15'
  },
  {
    id: 7,
    title: '成本控制策略',
    category: '财务',
    description: '提出了一系列成本控制措施，包括供应链优化、能源使用效率提升和办公费用管理等方面。',
    date: '2023-08-30'
  },
  {
    id: 8,
    title: '团队建设活动计划',
    category: '人力资源',
    description: '为增强团队凝聚力和员工满意度，计划在未来三个月内开展一系列团队建设活动。',
    date: '2023-09-10'
  }
];

// 模拟API请求延迟
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// 获取数据列表
export const fetchData = async () => {
  // 模拟网络请求延迟
  await delay(1000);
  return [...mockData];
};

// 获取单个数据详情
export const fetchDataById = async (id) => {
  await delay(800);
  const item = mockData.find(item => item.id === parseInt(id));
  
  if (!item) {
    throw new Error('数据不存在');
  }
  
  return { ...item };
};

// 提交表单数据
export const submitFormData = async (formData) => {
  // 模拟表单提交延迟
  await delay(1500);
  
  // 模拟生成新ID
  const newId = mockData.length + 1;
  
  // 创建新数据项
  const newItem = {
    id: newId,
    title: formData.title,
    category: formData.category,
    description: formData.description,
    date: formData.date
  };
  
  // 添加到模拟数据中
  mockData.push(newItem);
  
  return { success: true, id: newId };
};