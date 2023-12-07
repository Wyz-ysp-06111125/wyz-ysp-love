import PREFIX from '@/actions/prefix';

export const urls = {
  /* 列表 */
  queryPageList: {
    url: `${PREFIX}/clearMerchant/findPageInfo`,
    method: 'get',
  },
  queryClearMerchantTypeList: {
    url: `${PREFIX}/clearMerchant/getClearMerchantType`,
    method: 'get',
  },
  log: {
    url: `${PREFIX}/basic/logPage`,
    method: 'post',
  },
  add: {
    url: `${PREFIX}/clearMerchant/insert`,
    method: 'post',
  },
  modify: {
    url: `${PREFIX}/clearMerchant/update`,
    method: 'post',
  }
};

export default { urls };
