import PREFIX from '@/actions/prefix';

export const urls = {
  /* 列表 */
  queryPageList: {
    url: `${PREFIX}/clearing/merchants`,
    method: 'get',
  },
  log: {
    url: `${PREFIX}/clearing/merchants/logs`,
    method: 'post',
  },
  add: {
    url: `${PREFIX}/clearing/merchants/create`,
    method: 'post',
  },
  modify: {
    url: `${PREFIX}/clearing/merchants/update`,
    method: 'post',
  },
  cashier: {
    url: `${PREFIX}/clearing/withdraws`,
    method: 'post',
  },
  templateDownload: {
    url: `${PREFIX}/clearing/merchants/getImportTemplate`
  },
  uploadTemplate: {
    url: `${PREFIX}/clearing/merchants/import`,
    method: 'get'
  }
};

export default { urls };
