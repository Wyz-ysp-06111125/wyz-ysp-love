import React, { Component } from 'react';
import { Button, Modal, Upload, Row, Col, Icon, message } from 'antd';
import { Request } from '@/actions/request';
import AuthButton from '@/components/auth-button';
import PREFIX from '@/actions/prefix';

export default class Import extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isVisibility: false,
      uploading: false,
      fileList: [],
    };
  }

  handleOperate() {
    return () => {
      this.setState({
        isVisibility: true,
      });
    };
  }

  handleOver() {
    this.setState({
      isVisibility: false,
    });
  }

  handleImport() {
    return () => {
      const { fileList } = this.state;

      this.setState({
        uploading: true,
      });

      Request({
        url: `${PREFIX}/clearMerchant/upload`,
        type: 'post',
        dataType: 'FormData',
        params: { file: fileList[0] },
      }).then((json) => {
        if (json.success) {
          this.setState({
            fileList: [],
            uploading: false,
            isVisibility: false,
          });
          window.open(json.data);
          message.success('上传成功！');
        } else {
          message.error('上传失败！');
          this.setState({
            uploading: false,
          });
        }
      }).catch(() => {
        message.error('上传失败！');
        this.setState({
          uploading: false,
        });
      });
    };
  }

  render() {
    const { isVisibility, uploading } = this.state;

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
        this.setState(({ fileList }) => ({
          fileList: [...fileList, file],
        }));
        return false;
      },
      fileList: this.state.fileList,
    };

    return (<span>
      <AuthButton
        path="pay-boss/clearMerchant/upload"
        type="primary"
        style={{ marginRight: 8 }}
        onClick={this.handleOperate()}
      >导入</AuthButton>
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
              disabled={this.state.fileList.length === 0 || uploading}
              loading={uploading}
            >{uploading ? '正在上传' : '上传' }</Button>,
          ]}
        >
          <Row>
            <Col span={16}>
              <Upload {...uploadProps} >
                <Button disabled={this.state.fileList.length > 0}>
                  <Icon type="upload" /> 请选择导入文件
                </Button>
              </Upload>
            </Col>
            <Col span={5} offset={3}><a href={`${PREFIX}/clearMerchant/getTemplate`} >下载导入模板</a></Col>
          </Row>
        </Modal> : null
      }
    </span>);
  }
}
