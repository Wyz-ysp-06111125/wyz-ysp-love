import React from 'react';
import { } from 'antd';
import { PageTemplate, request, Log } from '@cfe/caopc-center-common';
import { urls } from './config';
import '../index.less';

import Detail from './detail';
import Import from './import';

export default class List extends React.Component {
  constructor(props) {
    document.title = '分润主题及结算商户维护表';
    super(props);
    this.state = {
      clearMerchantTypeList: [], // 分润主体类型
    };

    this.columns = [
      {
        title: '分润主体类型',
        dataIndex: 'merchantType',
        width: 120,
        render: text => (this.state.clearMerchantTypeList.find(item =>
          item.key.toString() === text.toString()) || {}).value
      },
      {
        title: '分润主体名称',
        dataIndex: 'merchantName',
        width: 120,
      },
      {
        title: '分润主体账户',
        dataIndex: 'merchantNo',
        width: 120,
      },
      {
        title: '结算商户号',
        dataIndex: 'bankMerchantNo',
        width: 300,
      },
      {
        title: '操作',
        dataIndex: 'action',
        width: 200,
        render: (text, record) => ([
          <Detail
            key={1}
            title="修改"
            loadData={this.onSearch}
            type="modify"
            record={record}
            clearMerchantTypeList={this.state.clearMerchantTypeList}
          />,
          <Log
            key={4}
            title="日志"
            url={urls.log.url}
            query={{
              model: 6,
              type: 8,
              sourceId: record.id,
            }}
            text="日志"
            width={600}
            columns={[
              {
                title: '操作时间',
                dataIndex: 'createTime',
              },
              {
                title: '操作人',
                dataIndex: 'operator',
              },
              {
                title: '操作类型',
                dataIndex: 'operateType',
              },
              {
                title: '操作内容',
                dataIndex: 'content',
              },
            ]}
          />,
        ]),
      },
    ];
  }

  componentDidMount() {
    this.loadClearMerchantTypeList();
  }


  getConfig() {
    return {
      ...urls.queryPageList,
      beforeRequest: values => values,
    };
  }

  loadClearMerchantTypeList() {
    request({
      ...urls.queryClearMerchantTypeList,
      data: {},
    }).then((data) => {
      this.setState({
        clearMerchantTypeList: data || [],
      });
    });
  }

  renderFilter() {
    const { clearMerchantTypeList } = this.state;
    return [
      {
        component: 'Select',
        key: 'merchantType',
        label: '分润主体类型',
        options: clearMerchantTypeList,
      },
      {
        component: 'Input',
        key: 'merchantName',
        label: '分润主体名称',
      },
      {
        component: 'Input',
        key: 'merchantNo',
        label: '分润主体账户',
      },
    ];
  }

  renderToolbar() {
    return [
      <Detail
        key={1}
        title="新增"
        loadData={this.onSearch}
        type="add"
        authType="button"
        clearMerchantTypeList={this.state.clearMerchantTypeList}
      />,
      <Import
        key={2}
      />
    ];
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
