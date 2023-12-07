import React from 'react';
import { } from 'antd';
import { PageTemplate, Log } from '@cfe/caopc-center-common';
import { Button, Modal, Upload, Row, Col, Icon, message } from 'antd';
import { urls } from './config';
import '../index.less';
import AuthButton from '@/components/auth-button';
import { Request } from '@/actions/request';

import Detail from './detail';
import Cashier from './cashier';

export default class List extends React.Component {
  constructor(props) {
    document.title = '清结算商户管理';
    super(props);
    this.state = {
      certificatesTypeList: [
        { key: '1', value: '身份证' },
        { key: '2', value: '港澳通行证' },
        { key: '3', value: '户口簿' },
        { key: '4', value: '护照' },
      ], // 证件类型
      accountTypeList: [
        { key: '1', value: '借记卡' },
        { key: '2', value: '信用卡' },
      ], // 账号类型
      isVisibility: false,
      fileList: [],
      uploading: false
    };

    this.columns = [
      {
        title: '序号',
        dataIndex: 'id',
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
        title: '账户金额(元)',
        dataIndex: 'accountAmount',
        width: 120,
      },
      {
        title: '冻结金额(元)',
        dataIndex: 'frozenAmount',
        width: 120,
      },
      {
        title: '公司名称',
        dataIndex: 'companyName',
        width: 120,
      },
      {
        title: '操作',
        dataIndex: 'action',
        width: 200,
        render: (text, record) => ([
          <Detail
            key={1}
            title="编辑"
            loadData={this.onSearch}
            type="modify"
            record={record}
            certificatesTypeList={this.state.certificatesTypeList}
            accountTypeList={this.state.accountTypeList}
          />,
          <Detail
            key={2}
            title="查看"
            loadData={this.onSearch}
            type="look"
            record={record}
            certificatesTypeList={this.state.certificatesTypeList}
            accountTypeList={this.state.accountTypeList}
          />,
          <Cashier
            title="提现"
            loadData={this.onSearch}
            record={record}
          />,
          <Log
            key={4}
            title="日志"
            url={urls.log.url}
            query={{
              sourceId: record.merchantNo,
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

  }

  getConfig() {
    return {
      ...urls.queryPageList,
      beforeRequest: values => values,
    };
  }

  renderFilter() {
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
    ];
  }

  renderToolbar() {
    return [
      <Detail
        key={1}
        title="新增"
        onOver={this.onOver}
        loadData={this.onSearch}
        type="add"
        authType="button"
        certificatesTypeList={this.state.certificatesTypeList}
        accountTypeList={this.state.accountTypeList}
      />,
      <AuthButton
        key={2}
        path={urls.uploadTemplate.url.slice(1)}
        onClick={this.handleOperate}
      >导入</AuthButton>
    ];
  }

  onOver = _ => {
    this.onSearch()
  }

  handleOperate = _ => {
    this.setState({
      isVisibility: true
    })
  }

  handleOver = _ => {
    this.setState({
      isVisibility: false
    })
  }

  handleImport = _ => {
    return () => {
      const { fileList } = this.state;
      this.setState({
        uploading: true,
      });

      console.log(fileList)

      Request({
        ...urls.uploadTemplate,
        type: 'post',
        dataType: 'FormData',
        params: {
          file: fileList[0]
        },
      }).then((json) => {
        if (json.success) {
          this.onSearch()
          this.setState({
            fileList: [],
            uploading: false,
            isVisibility: false,
          });
          window.open(json.data);
          message.success('上传成功！');
        } else {
          message.error(json.message || '上传失败！');
          this.setState({
            uploading: false,
          });
        }
      }).catch(() => {
        message.error('上传失败！');
        this.setState({
          fileList: [],
          uploading: false,
        });
      })
    }
  }

  renderEleAfterSearchBtn() {
    return null;
  }

  render () {
    const { isVisibility, fileList, uploading } = this.state

    const uploadProps = {
      accept: '.csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel',
      action: '',
      onRemove: (file) => {
        this.setState(({ fileList }) => {
          const index = fileList.indexOf(file);
          const newFileList = fileList.slice();
          newFileList.splice(index, 1);
          return {
            fileList: newFileList,
          };
        });
      },
      beforeUpload: (file) => {
        console.log(file)
        this.setState(({ fileList }) => ({
          fileList: [...fileList, file],
        }));
        return false;
      },
      fileList: this.state.fileList,
    };

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

        {
          isVisibility ? <Modal
            visible
            title="导入"
            okText="确定"
            cancelText="取消"
            onCancel={() => { this.handleOver(); }}
            onOk={this.handleImport()}
            footer={[
              <Button
                key="back"
                type="ghost"
                size="large"
                onClick={() => { this.handleOver(); }}
              >关闭</Button>,
              <Button
                key="submit"
                type="primary"
                size="large"
                onClick={this.handleImport()}
                disabled={fileList.length === 0 || uploading}
                loading={uploading}
              >{uploading ? '正在上传' : '上传' }</Button>,
            ]}
          >
            <Row>
              <Col span={16}>
                <Upload {...uploadProps} >
                  <Button disabled={fileList.length > 0}>
                    <Icon type="upload" /> 请选择导入文件
                  </Button>
                </Upload>
              </Col>
              <Col span={5} offset={3}><a href={urls.templateDownload.url} >下载导入模板</a></Col>
            </Row>
          </Modal> : null
        }
      </div>);
  }
}
