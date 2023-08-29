import PREFIX, { } from '@/actions/prefix';

const urls = {
  /* 列表 */
  queryPageList: {
    url: `${PREFIX}/clearRule/findPageInfo`,
    method: 'get',
  },
  export: {
    url: '/pay-boss/clearRule/export',
    method: 'post',
  },
  queryCityList: {
    url: `${PREFIX}/clearRule/getCity`,
    method: 'get',
  },
  queryLeaseholdersList: {
    url: `${PREFIX}/clearRule/getLeaseCompany`,
    method: 'get',
  },
  queryBizLineList: {
    url: `${PREFIX}/basic/queryBizLine`,
    method: 'get',
  },
  queryMerchantTypeList: {
    url: `${PREFIX}/clearMerchant/getMerchant`,
    method: 'get',
  },
  queryClearMerchantTypeList: {
    url: `${PREFIX}/clearMerchant/getClearMerchantType`,
    method: 'get',
  },
  queryStatusList: {
    url: `${PREFIX}/clearRule/getStatusType`,
    method: 'get',
  },
  querySpecialFeeList: {
    url: `${PREFIX}/clearRule/getSpecialFee`,
    method: 'get',
  },
  queryFeeCodesList: {
    url: `${PREFIX}/clearRule/getFee`,
    method: 'get',
  },
  queryUmpFeeDetailsList: {
    url: `${PREFIX}/clearRule/getUmpFee`,
    method: 'get',
  },
  queryCarNatureList: {
    url: `${PREFIX}/clearRule/getCarBelongType`,
    method: 'get',
  },
  log: {
    url: `${PREFIX}/basic/logPage`,
    method: 'post',
  },
  add: {
    url: `${PREFIX}/clearRule/insert`,
    method: 'post',
  },
  modify: {
    url: `${PREFIX}/clearRule/update`,
    method: 'post',
  },
  changeStatus: {
    url: `${PREFIX}/clearRule/disable`,
    method: 'get',
  },
  auditPage: {
    url: '/pay-boss/clearRule/findWorkflowList',
  },
  audit: {
    url: '/pay-boss/clearRule/approve',
    method: 'post',
  },
  invalid: {
    url: '/pay-boss/clearRule/invalid',
  },
  // 立即失效
  auditContenr: {
    url: '/pay-boss/clearRule/ineffectiveNow',
    method: 'get',
  },
  // 立即生效
  takeeffect: {
    url: '/pay-boss/clearRule/effectiveNow',
    method: 'get',
  },

  // 提交审核
  onSubmitForReview: {
    url: '/pay-boss/clearRule/update',
    method: 'post',
  },

  queryServiceTypeList: {
    url: '/pay-boss/basic/queryCarServiceType',
  },
};

const MODULE = {
  0: '固定比例分润', 1: '阶梯分润',
};

const RULE_TYPE = {
  0: '普通规则', 1: '特殊规则',
};

const RULE_TAG = {
  0: '基础分成', 1: '司机营销',
};

export {
  urls, MODULE, RULE_TYPE, RULE_TAG,
};
