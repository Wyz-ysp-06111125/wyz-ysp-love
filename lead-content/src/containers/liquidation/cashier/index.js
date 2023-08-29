import React from 'react';
import { } from 'antd';
import { PageTemplate } from '@cfe/caopc-center-common';
import { urls } from './config';
import '../index.less';


export default class List extends React.Component {
  constructor(props) {
    document.title = '提现记录';
    super(props);
    this.state = {
      statusList: [
        { key: '1', value: '提现中' },
        { key: '99', value: '提现失败' },
        { key: '100', value: '提现成功' },
      ], //
    };

    this.columns = [
      {
        title: '序号',
        dataIndex: 'id',
        width: 120,
      },
      {
        title: '提现编号',
        dataIndex: 'withdrawNo',
        width: 120,
      },
      {
        title: '商户号',
        dataIndex: 'merchantNo',
        width: 120,
      },
      {
        title: '商户名称',
        dataIndex: 'merchantName',
        width: 120,
      },
      {
        title: '提现金额',
        dataIndex: 'amount',
        width: 120,
      },
      {
        title: '状态',
        dataIndex: 'status',
        width: 120,
      },
      {
        title: '提现渠道',
        dataIndex: 'channel',
        width: 120,
      },
      {
        title: '提现账号',
        dataIndex: 'bankUserNo',
        width: 120,
      },
      {
        title: '账号姓名',
        dataIndex: 'companyName',
        width: 120,
      },
      {
        title: '开户行',
        dataIndex: 'bankName',
        width: 120,
      },
      {
        title: '支行',
        dataIndex: 'subBankName',
        width: 120,
      },
      {
        title: '提现原因',
        dataIndex: 'remark',
        width: 120,
      },
    ];
  }

  componentDidMount() {

  }


  getConfig() {
    return {
      ...urls.queryPageList,
      beforeRequest: values => values,
    };
  }

  renderFilter() {
    const { statusList } = this.state;
    return [
      {
        component: 'Input',
        key: 'merchantName',
        label: '商户名称',
      },
      {
        component: 'Input',
        key: 'merchantNo',
        label: '商户号',
      },
      {
        component: 'Select',
        key: 'status',
        label: '状态',
        options: statusList,
      },
    ];
  }

  renderToolbar() {
    return [];
  }

  renderEleAfterSearchBtn() {
    return null;
  }

  render() {
    return (
      <div style={{ padding: 20 }} className="liquidation">
        <PageTemplate
          rowKey="id"
          config={this.getConfig()}
          filter={this.renderFilter()}
          eleAfterSearchBtn={this.renderEleAfterSearchBtn()}
          toolbar={this.renderToolbar()}
          columns={this.columns}
          connect={({ onSearch, form }) => { this.onSearch = onSearch; this.form = form; }}
        />
      </div>);
  }
}
