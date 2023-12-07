/* eslint-disable react/jsx-no-target-blank */
/* eslint-disable no-script-url */
/* eslint-disable max-len */
/* eslint-disable eqeqeq */

import React from 'react';
import {
  PageTemplate, SelectMax, ModalTable,
} from '@cfe/venom';
import request from '@cfe/venom-request';
import {
  message, Modal, Button, DatePicker,
} from 'antd';
import AuthLink from '@/components/auth-link';
// import {urls} from "../config"
const { MonthPicker } = DatePicker;
const AUDIT_STATUS = {
  1: '待生效',
  2: '生效中',
  3: '已过期',
  4: '已停用',
};
export default class List extends React.Component {
  constructor(props) {
    super(props);
    document.title = '政策配置';
    this.state = {
      // cityList: [],
      resetVisible: false,
      failVisible: false,
      carBelongType: [],
      resetdata: undefined,
    };
  }

  componentDidMount() {
    // 车辆所属类别
    request({
      url: '/pay-boss/leaseSalary/base/findTypeList',
      method: 'post',
      data: {
        indexNo: 'carBelongType',
        pageSize: 99999,
        pageNum: 1,
      },
    }).then((res) => {
      this.setState({
        carBelongType: res.list,
      });
    });
  }

  // 重置得弹出框
  resetVisible = (record) => {
    this.setState({
      resetVisible: true,
      resetdata: record,
    });
  }

  // 启用时候得弹出框内容改变
  resetHandleOk = () => {
    this.setState({
      resetVisible: false,
    });
    const { resetdata } = this.state;
    request({
      url: '/pay-boss/leaseSalary/policy/enable',
      method: 'get',
      data: {
        policyNo: resetdata.policyNo,
      },
    }).then(() => {
      message.success('操作成功');
      this.onSearch();
    });
  }

  // 失败时候得弹出框
  failVisible = (record) => {
    this.setState({
      failVisible: true,
      theredata: record,
    });
  }

  // 停用时候弹出框内容改变
  failHandleOk = () => {
    this.setState({
      failVisible: false,
    });
    const { theredata } = this.state;
    request({
      url: '/pay-boss/leaseSalary/policy/disable',
      method: 'get',
      data: {
        policyNo: theredata.policyNo,
      },
    }).then(() => {
      message.success('操作成功');
      this.onSearch();
    });
  }

  // 关闭按钮   重置
  resetHandleCancel = () => {
    this.setState({
      resetVisible: false,
    });
  };

  // 关闭按钮   失败
  failHandleCancel = () => {
    this.setState({
      failVisible: false,
    });
  };

  filterConfig = () => [{
    component: 'Input',
    key: 'policyNo',
    label: '政策ID',
  }, {
    component: <SelectMax
      options={Object.keys(AUDIT_STATUS).map((key) => ({ key, value: AUDIT_STATUS[key] }))}
      showSearch
      optionFilterProp="children"
    />,
    key: 'status',
    label: '状态',
  }, {
    component: <SelectMax
      style={{ width: 160 }}
      placeholder="请选择"
      showSearch
      options={this.state.carBelongType}
      optionFilterProp="children"
      optionMap={{ value: 'indexEnumName', key: 'indexEnum' }}
    />,
    key: 'carBelongType',
    label: '车辆所属类别',
  }, {
    component: <MonthPicker
      placeholder="请选择月份"
      format="YYYY-MM"
    />,
    key: 'range',
    label: '时间',
  }]

  columns = () => [{
    title: '政策ID',
    dataIndex: 'policyNo',
  }, {
    title: '政策名称',
    dataIndex: 'policyName',
  }, {
    title: '应用月份',
    dataIndex: 'statisticMonth',
  }, {
    title: '加盟商数',
    dataIndex: 'leaseCount',
  }, {
    title: '车辆归属类别',
    dataIndex: 'carBelongType',
    render: (text) => {
      let content;
      //  eslint-disable-next-line
      this.state.carBelongType?.map((val) => {
        if (text == val.indexEnum) {
          content = <span>{val.indexEnumName}</span>;
        }
      });
      return content;
    },
  }, {
    title: '更新时间',
    dataIndex: 'updateTime',
  }, {
    title: '状态',
    dataIndex: 'status',
    render: (text) => AUDIT_STATUS[text],
  },
  {
    title: '操作',
    dataIndex: 'action',
    // fixed: 'left',
    render: (text, record) => (
      <span>
        {/* <a style={{ marginRight: 8 }} href="javascript:;" onClick={() => this.resetVisible(record)}>启用</a> */}
        <a target="_blank"
          style={{ marginRight: 8 }}
          rel="noreferrer noopener"
          href={`/financial-center/policy-configuration/detail/${record.policyNo}`}
        >查看</a>

        {
          (record.status == '2' || record.status == '1') && (
          <a target="_blank"
            style={{ marginRight: 8 }}
            rel="noreferrer noopener"
            href={`/financial-center/policy-configuration/copy/${record.policyNo}`}
          >复制</a>
          )
        }
        {
          (record.status == '2' || record.status == '1') && (
          <AuthLink
            style={{ marginRight: 8 }}
            path="pay-boss/leaseSalary/policy/modify"
            onClick={() => window.open(`/financial-center/policy-configuration/edit/${record.policyNo}`)}
          >编辑</AuthLink>
          )
        }

        {/* 停用 当状态等于处理中得时候展示 */}
        {record.status == '1'

        && (
        <AuthLink
          style={{ marginRight: 8 }}
          path="pay-boss/leaseSalary/policy/disable"
          onClick={() => this.failVisible(record)}
        >停用</AuthLink>
        )}

        {/* 日志 */}
        <ModalTable
          url={{
            url: '/pay-boss/basic/logPage',
            method: 'post',
          }}
          params={{ sourceId: record.policyNo, type: 62 }}
          tableProps={{ rowKey: (e, i) => i }}
          columns={
            [{
              title: '操作类型',
              dataIndex: 'operateType',
            }, {
              title: '操作后内容',
              dataIndex: 'content',
              width: 400,
              render: (text) => <pre style={{ margin: 0, fontFamily: 'inherit', textAlign: 'left' }}>{text}</pre>,
            }, {
              title: '操作人',
              dataIndex: 'operator',
            }, {
              title: '操作时间',
              dataIndex: 'createTime',
              width: 120,
            }]
          }
          title="操作日志"
        > <a>日志</a></ModalTable>
      </span>
    ),
  }]

  beforeRequest = (values) => {
    values.statisticMonth = values.range?.format('YYYY-MM');
    delete values.range;
    return values;
  }

  templateConfig = () => ({
    url: {
      url: '/pay-boss/leaseSalary/policy/findPageInfo',
      method: 'post',
    },
    beforeRequest: this.beforeRequest,
    // 导出按钮
    needExport: true,
    searchOnLoad: true,
    searchOnVisible: true,
    beforeExport: this.beforeRequest,
    exportProps: {
      url: {
        url: '/pay-boss/leaseSalary/policy/export',
        method: 'post',
      },
    },
  })

  render() {
    const {
      resetVisible, failVisible,
    } = this.state;

    return (
      <div style={{ padding: 20 }}>
        <PageTemplate
          // rowKey={(r) => r.id + r.updateTime}
          // needExport
          {...this.templateConfig()}
          filter={this.filterConfig()}
          columns={this.columns()}
          toolbar={[

            <AuthLink
              path="pay-boss/leaseSalary/policy/create"
              onClick={() => window.open('/financial-center/policy-configuration/add')}
            > <Button type="primary">新增</Button></AuthLink>,
          ]}
          connect={({ onSearch, form }) => { this.onSearch = onSearch; this.form = form; }}
        />
        <Modal title="启用" visible={resetVisible} onOk={this.resetHandleOk} onCancel={this.resetHandleCancel}>
          <div>重试后,将发起一笔新的银行流水,原记录将作废,是否确认重试？</div>
        </Modal>
        <Modal title="停用" visible={failVisible} onOk={this.failHandleOk} onCancel={this.failHandleCancel}>
          <div>操作失败后,该笔记录状态将变更为“失败” , 是否确认该笔记录在银行侧交易已失败？</div>
        </Modal>
      </div>
    );
  }
}
