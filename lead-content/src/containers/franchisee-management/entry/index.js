/* eslint-disable react/jsx-no-target-blank */
/* eslint-disable no-script-url */
/* eslint-disable max-len */
/* eslint-disable eqeqeq */
/* eslint-disable */
import moment from 'moment';
import React from 'react';
import {
  PageTemplate, SelectMax, ModalTable,
} from '@cfe/venom';
import request from '@cfe/venom-request';
import { Button, message, Modal } from 'antd';
import ModalRule from '../component/modal-audt';
import Transfers from '../component/modal-tranfers';
import Withdrawals from '../component/modal-withdrawals';
import './index.less';

const AUDIT_STATUS = {
  1: '启用',
  2: '注销',
  3: '冻结',
};
export default class List extends React.Component {
  constructor(props) {
    super(props);
    document.title = '代扣加盟商管理';
    this.state = {
      setLeaseList: [],
      // 城市得
      cityList: [],
      // data穿的参数
      data: '',
      // type判单类型
      type: '',
      // 添加或编辑
      visiable: false,
      oneVisible: false,
      twoVisible: false,
      thereVisible: false,
      onedata: undefined,
      twodata: undefined,
      theredata: undefined,
      // 调涨
      tranvisiable: false,
      // 提现
      WithdrawalsVisiable: false,

    };
  }

  beforeRequest = (values) => {
    // const { provinceCode } = (values.cityCode || {});
    // values.cityCode = (values.cityCode || {}).cityCode;
    // if (provinceCode && !values.cityCode) {
    //   message.error('请选择城市');
    //   return;
    // }
    values.agencyNo = values.agencyNo || values.agencyName;
    if (values.agencyNo && values.agencyName) {
      if (values.agencyName !== values.agencyNo) {
        message.error('请选择正确的加盟商名称');
        return;
      }
    }
    delete values.agencyName;

    if (values.statusList) {
      values.statusList = [values.statusList];
    }
    values.requestFromOuter = false;
    return values;
  }

  // 注销得弹出框
  disableVisible = (data) => {
    this.setState({
      oneVisible: true,
      onedata: data,
    });
  }

  oneHandleOk = () => {
    this.setState({
      oneVisible: false,
    });
    const { onedata } = this.state;
    // 这里一般都是改参数  举例
    request({
      url: '/pay-boss/leaseDeduction/agency/disable',
      method: 'post',
      data: {
        // 要去改变得东西
        agencyNo: onedata.agencyNo,
        requestFromOuter: false,
      },
    }).then(() => {
      message.success('操作成功');
      this.onSearch();
    });
  }

  // 冻结得弹出框
  freezeVisible = (record) => {
    this.setState({
      twoVisible: true,
      twodata: record,
    });
  }

  // 冻结时候得弹出框内容改变
  twoHandleOk = () => {
    this.setState({
      twoVisible: false,
    });
    const { twodata } = this.state;
    // 判断改变得状态
    request({
      url: '/pay-boss/leaseDeduction/agency/freeze',
      method: 'post',
      data: {
        // 要去改变得东西
        agencyNo: twodata.agencyNo,
        requestFromOuter: false,
        // status:twostate
      },
    }).then(() => {
      message.success('操作成功');
      this.onSearch();
    });
  }

  // 解冻时候得弹出框
  ThereVisible = (record) => {
    this.setState({
      thereVisible: true,
      theredata: record,
    });
  }

  // 解冻时候弹出框内容改变
  thereHandleOk = () => {
    this.setState({
      thereVisible: false,
    });
    const { theredata } = this.state;
    request({
      url: '/pay-boss/leaseDeduction/agency/unfreeze',
      method: 'post',
      data: {
        // 要去改变得东西
        agencyNo: theredata.agencyNo,
        requestFromOuter: false,
        // status:twostate
      },
    }).then(() => {
      message.success('操作成功');
      this.onSearch();
    });
  }

  // 作废得取消按钮
  oneHandleCancel = () => {
    this.setState({
      oneVisible: false,
    });
  };

  // 冻结得取消按钮
  twoHandleCancel = () => {
    this.setState({
      twoVisible: false,
    });
  };

  // 解冻得取消按钮
  thereHandleCancel = () => {
    this.setState({
      thereVisible: false,
    });
  };

  // 添加编辑时候的model 弹出框
  update = (record) => () => {
    this.setState({
      data: record,
      type: 'edit',
      visiable: true,
    });
  }

  // 添加关闭时的取消按钮
  onOk = () => {
    this.setState({
      visiable: false,
    });
    this.onSearch();
  }

  onCancel = () => {
    this.setState({
      visiable: false,
    });
  }

  // 调账按钮
  Transfers = (record) => () => {
    this.setState({
      data: record,
      tranvisiable: true,
    });
  }

  tranonOk = () => {
    this.setState({
      tranvisiable: false,

    });
    this.onSearch();
  }

  tranonCancel = () => {
    this.setState({
      tranvisiable: false,
    });
  }

  // 提现按钮
  Withdrawals = (record) => () => {
    this.setState({
      data: record,
      WithdrawalsVisiable: true,
    });
  }

  WithdrawalsOk = () => {
    this.setState({
      WithdrawalsVisiable: false,
    });
    this.onSearch();
  }

  WithdrawalsonCancel = () => {
    this.setState({
      WithdrawalsVisiable: false,
    });
  }

  // 导出按钮
  beforeExport = (values) => {
    // values.cityCode = (values.cityCode || {}).cityCode;
    values.requestFromOuter = false;
    if (values.statusList) {
      values.statusList = values.statusList.split('');
    }
    values.agencyNo = values.agencyNo || values.agencyName;
    if (values.agencyNo && values.agencyName) {
      if (values.agencyName !== values.agencyNo) {
        message.error('请选择正确的加盟商名称');
        return;
      }
    }
    delete values.agencyName;

    return values;
  }

  // 加盟商名称
  onChangeCity = (cityCode) => {
    this.form.setFieldsValue({
      agencyName: undefined,
    });
    this.setState({
      setLeaseList: [],
    });
    if (cityCode) {
      request({
        url: '/center-settlement/basic/queryAuthLeaseCompany',
        data: { companyType: 5, cityCode },
      }).then((data) => {
        this.setState({
          setLeaseList: data,
        });
      });
    }
  }

  componentDidMount() {
    request({
      url: '/pay-boss/basic/queryPermissionCity',
      method: 'post',
    }).then((res) => {
      this.setState({
        cityList: res.filter((val) => val.value !== '全国'),
      });
    });
  }

  filterConfig = () => {
    const { setLeaseList, cityList } = this.state;
    return [{
      component: <SelectMax
        style={{ width: 200 }}
        options={cityList}
        showSearch
        onChange={this.onChangeCity}
        optionFilterProp="children"
        placeholder="请选择"
        optionMap={{ value: 'value', key: 'key' }}
      />,
      key: 'cityCode',
      label: '城市',
    }, {
      component: 'Input',
      key: 'agencyNo',
      label: '加盟商ID',
    }, {
      component: <SelectMax
        style={{ width: 200 }}
        options={setLeaseList}
        showSearch
        optionFilterProp="children"
        placeholder="请选择"
        optionMap={{ value: 'value', key: 'key' }}
      />,
      key: 'agencyName',
      label: '加盟商名称',
    }, {
      component: <SelectMax
        options={Object.keys(AUDIT_STATUS).map((key) => ({ key, value: AUDIT_STATUS[key] }))}
        showSearch
        optionFilterProp="children"
      />,
      key: 'statusList',
      label: '状态',
    }];
  }

  columns = () => [{
    title: '加盟商ID',
    dataIndex: 'agencyNo',
  }, {
    title: '加盟商名称',
    dataIndex: 'agencyName',
  }, {
    title: '省份',
    dataIndex: 'provinceName',
  }, {
    title: '城市',
    dataIndex: 'cityName',
  }, {
    title: '账户余额(元)',
    dataIndex: 'balanceAmount',
    render: (text) => text && parseFloat(text / 100).toFixed(2),
  }, {
    title: '可提现金额(元)',
    dataIndex: 'withdrawAmount',
    render: (text) => text && parseFloat(text / 100).toFixed(2),
  }, {
    title: '待入账金额(元)',
    dataIndex: 'waitSettleAmount',
    render: (text) => text && parseFloat(text / 100).toFixed(2),
  }, {
    title: '结算周期(天)',
    dataIndex: 'settlePeriod',
  }, {
    title: '状态',
    dataIndex: 'status',
    render: (text) => AUDIT_STATUS[text],
  },
  {
    title: '操作',
    dataIndex: 'action',
    // width: 320,
    render: (text, record) => (
      // 1: '审核中', 2: '审核通过', 3: '审核驳回',
      <span className="allcity">
        {/* //编辑页面 */}
        {(record.status === 1 || record.status === 3) && (
          <a href="javascript:;"
            rel="noreferrer noopener"
            onClick={this.update(record)}
          >编辑</a>
        )}
        {/* 交易明细 */}
        <a target="_blank"
          rel="noreferrer noopener"
          href={`/financial-center/franchisee-management/detail/${record.agencyNo}?agencyNo=${record.agencyNo}&agencyName=${record.agencyName}&balanceAmount=${parseFloat(record.balanceAmount / 100).toFixed(2)}&withdrawAmount=${parseFloat(record.withdrawAmount / 100).toFixed(2)}&waitSettleAmount=${parseFloat(record.waitSettleAmount / 100).toFixed(2)}`}
        >交易明细</a>
        {/* 真实的 */}   {/* 提现 */}
        {record.status == 1 && (
          <a href="javascript:;"
            rel="noreferrer noopener"
            onClick={this.Withdrawals(record)}
          >提现</a>
        )}
        {/* 模拟的 */}
        {/* 调账 */}
        {(record.status === 1 || record.status === 3) && (
          <a href="javascript:;"
            rel="noreferrer noopener"
            onClick={this.Transfers(record)}
          >
            调账</a>
        )}
        {/* 注销   冻结   解冻    弹出框学完 */}
        {record.status == 1 && (<a rel="noreferrer noopener" href="javascript:;" onClick={() => this.freezeVisible(record)}>冻结</a>)}
        {record.status == 1 && (<a rel="noreferrer noopener" href="javascript:;" onClick={() => this.disableVisible(record)}>注销</a>)}
        {record.status == 3 && (<a rel="noreferrer noopener" href="javascript:;" onClick={() => this.ThereVisible(record)}>解冻</a>)}
        {/* 日志 */}
        <ModalTable
          width={880}
          url={{
            url: '/pay-boss/optLog/findPageInfo',
            method: 'get',
          }}
          params={{ sourceId: record.id, type: 49 }}
          tableProps={{ rowKey: (e, i) => i }}
          columns={
            [{
              title: '操作类型',
              dataIndex: 'operateType',
              width: 150,
            }, {
              title: '操作后内容',
              dataIndex: 'content',
              align: 'left',
              width: 400,
              render: (text) => <pre style={{ margin: 0,fontFamily: "inherit" }}>{text}</pre>,
            }, {
              title: '操作人',
              width: 100,
              dataIndex: 'operator',
            }, {
              title: '操作时间',
              dataIndex: 'createTime',
              width: 160,
              render: (text) => (text ? moment(text).format('YYYY-MM-DD HH:mm:ss') : ''),
            }]
          }
          title="操作日志"
        > <a>日志</a></ModalTable>
      </span>
    ),
  }]

  beforeReset = () => {
    this.setState({
      setLeaseList: [],
    });
  }

  templateConfig = () => ({
    url: {
      url: '/pay-boss/leaseDeduction/agency/findPageInfo',
      method: 'post',
    },
    beforeRequest: this.beforeRequest,
    // 导出按钮
    needExport: true,
    searchOnLoad: true,
    searchOnVisible: true,
    beforeExport: this.beforeExport,
    beforeReset: this.beforeReset,
    exportProps: {
      url: {
        url: '/pay-boss/leaseDeduction/agency/export',
        method: 'post',
      },
    },
  })
 
  
  render() {
    const {
      oneVisible, twoVisible, thereVisible, data, type, visiable, tranvisiable, WithdrawalsVisiable,
    } = this.state;
    return (
      <div style={{ padding: 20 }}>
        <PageTemplate
          {...this.templateConfig()}
          toolbar={[
            <Button
              type="primary"
              onClick={() => {
                this.setState({ visiable: true, type: 'add', data: '' });
              }}
            >新增</Button>,
          ]}
          filter={this.filterConfig()}
          columns={this.columns()}
          connect={({ onSearch, form }) => { this.onSearch = onSearch; this.form = form; }}
        />
        <Modal title="注销" visible={oneVisible} width={600} onOk={this.oneHandleOk} onCancel={this.oneHandleCancel}>
          <div>加盟商注销后不可逆，操作后加盟商将无法查看该账户相关信息，是否确认注销？</div>
        </Modal>
        <Modal title="冻结" visible={twoVisible} onOk={this.twoHandleOk} onCancel={this.twoHandleCancel}>
          <div>加盟商账户冻结后将无法发起提现，是否确定冻结？</div>
        </Modal>
        <Modal title="解冻" visible={thereVisible} onOk={this.thereHandleOk} onCancel={this.thereHandleCancel}>
          <div>加盟商账户解冻后支持发起提现，是否确认解冻？</div>
        </Modal>
        {visiable && <ModalRule data={data} type={type} onOk={this.onOk} onCancel={this.onCancel} />}
        {tranvisiable && <Transfers data={data} onOk={this.tranonOk} onCancel={this.tranonCancel} />}
        {WithdrawalsVisiable && <Withdrawals data={data} onOk={this.WithdrawalsOk} onCancel={this.WithdrawalsonCancel} />}
      </div>
    );
  }
}
