/* eslint-disable max-len */
import { transformUrlsWithoutPrefix } from '@/configs';

const urls = transformUrlsWithoutPrefix({
  // 分页列表内容
  list: {
    url: '/leaseSalary/policy/findPageInfo',
    method: 'post',
  },
  // 查看列表
  detail: {
    url: '/leaseSalary/policy/findSingle',
    method: 'post',
  },
  // 导出内容
  expent: {
    url: '/leaseSalary/policy/export',
    method: 'post',
  },

  // 启用
  // detail: {
  //   url: '/leaseSalary/policy/enable',
  //   method: 'get',
  // },
  // 编辑
  edit: {
    url: '/leaseSalary/policy/modify',
    method: 'post',
  },

  // 新增内容
  commit: {
    url: '/leaseSalary/policy/create',
    method: 'post',
  },
}, '/pay-boss');

// 新的内容开始
// 车辆
const carBelong = {
  1: '全部',
  2: '优行车辆',
  3: '非优行车辆',
};
// 流水基数统计
const statisticType = {
  1: '加盟商总流水',
  2: '单个阶梯流水汇总',
};
// 统计对象
const statisticObject = {
  2: '单个司机',
  3: '单个车辆',
};
// 统计对象 奖励项
const statisticObjectAll = {
  1: '加盟商',
  2: '单个司机',
  3: '单个车辆',
};
// 模型维度
const indicatorDimension = {
  1: '1维',
  2: '2维',
};
// 数据类型 1维
const indicatorValueType = {
  1: '数值型',
  2: '布尔型',

};
// 数据类型  2维
const indicatorValue = {
  3: '数值型+数值型',
  4: '数值型+布尔型',
};
// 数据类别
const assessType = {
  1: '目标型',
  2: '阶梯型',
};
// 指标特征
const indicatorSpecial = {
  1: '望大',
  2: '望小',
};
const driverList = {
  1: '按单个司机',
  2: '按单个车辆',
  3: '按整体加盟商',
};
export {
  statisticObjectAll, driverList, indicatorSpecial, assessType, carBelong, statisticType, statisticObject, indicatorDimension, indicatorValueType, indicatorValue, urls,
};
