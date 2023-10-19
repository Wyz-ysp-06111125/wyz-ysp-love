/* eslint-disable react/jsx-no-target-blank */
/* eslint-disable no-script-url */
/* eslint-disable max-len */
/* eslint-disable eqeqeq */
import React from 'react';
import moment from 'moment';
import { SelectMax } from '@cfe/caopc-center-common';
import { message } from 'antd';
import { PageTemplate } from '@cfe/venom';
import './detail.less';

const STATUS = {
  20010: '租金清算',
  20011: '租金结算',
  20009: '调账',
  100: '提现',
  60: '清算',
  20006: '结算',
};
export default class CarDeductionDetail extends React.Component {
  constructor(props) {
    document.title = '租金代扣-交易明细';
    super(props);
  }

  // 选项时间的时候要用到beforRequest
  beforeRequest = (values) => {
    if (!values.bizTypeSet) {
      values.bizTypeSet = [20010, 20011, 20009, 100, 60, 20006].toString();
    }
    const { agencyNo } = this.props.location.query;
    values.userNo = agencyNo;
    values.userType = 6;
    values.status = 100;
    values.specialAccountType = 6;
    values.startTime = values.range && values.range[0] ? moment(values.range[0]).format('YYYY-MM-DD 00:00:00') : undefined;
    values.endTime = values.range && values.range[1] ? moment(values.range[1]).format('YYYY-MM-DD 23:59:59') : undefined;
    if (values.startTime
      && moment(values.endTime).diff(moment(values.startTime), 'days') > 31) {
      message.error('日期区间不能超过31天');
      return;
    }
    delete values.range;
    return values;
  }

  render() {
    //   const { id } = this.props.params;
    const { query } = this.props.location;
    const {
      agencyNo, agencyName, balanceAmount, withdrawAmount, waitSettleAmount,
    } = query;

    const getconfig = {
      url: {
        // 真实的
        url: '/pay-boss/balance/userBalanceAmounts/queryAccountChangeRecord',
        method: 'get',
      },
      beforeRequest: this.beforeRequest,
      // 导出按钮
    };
    const columns = [{
      title: '交易类型',
      dataIndex: 'bizType',
      render: (val) => STATUS[val],
    }, {
      title: '本次交易金额(元)',
      dataIndex: 'changeAmount',
      render: (text) => text && parseFloat(text / 100).toFixed(2),
    }, {
      title: '当前账户余额(元)',
      dataIndex: 'incomeAfterTotalAmount',
      render: (text) => text && parseFloat(text / 100).toFixed(2),
    }, {
      title: '当前可提现金额(元)',
      dataIndex: 'incomeAfterWithdrawAmount',
      render: (text) => text && parseFloat(text / 100).toFixed(2),
    }, {
      title: '关联单号',
      dataIndex: 'tradeNo',
    }, {
      title: '交易时间',
      dataIndex: 'payTime',
    }];
    const filterConfig = [
      {
        component: <SelectMax
          options={Object.keys(STATUS).map((key) => ({ key, value: STATUS[key] }))}
          showSearch
          optionFilterProp="children"
        />,
        key: 'bizTypeSet',
        label: '交易类型',
      },
      {
        component: 'RangePicker',
        key: 'range',
        label: '交易时间',
        options: {
          initialValue: [moment().subtract(31, 'day'), moment()],
        },
      },
    ];
    const driverMsg = [
      [{
        key: '加盟商ID：',
        value: agencyNo,
      },
      {
        key: '加盟商名称：',
        value: agencyName,
      },
      {
        key: '账户余额：',
        value: balanceAmount,
      },
      {
        key: '可提现金额：',
        value: withdrawAmount,
      }, {
        key: '待入账金额：',
        value: waitSettleAmount,
      }],

    ];
    return (
      <div style={{ paddingLeft: 20, paddingTop: 20 }}>
        <div className="table-all">
          <table className="tabel">
            <tbody>
              {
                driverMsg.map((row, index) => (
                  <tr key={index}>
                    {
                      row.map((cell, index) => <td key={index} style={{ paddingBottom: 20, paddingLeft: 40 }}><span>{cell.key}</span><span>{cell.value}</span></td>)
                    }
                  </tr>
                ))
              }
            </tbody>
          </table>
        </div>
        <div className="tranrefs">
          <span>交易明细</span>
        </div>
        <div className="car-deduction-detail">
          <PageTemplate
            rowKey="id"
            filter={filterConfig}
            {...getconfig}
            columns={columns}
          />
        </div>
      </div>
    );
  }
}
