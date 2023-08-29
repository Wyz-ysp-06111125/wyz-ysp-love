/* eslint-disable react/jsx-no-target-blank */
/* eslint-disable no-script-url */
/* eslint-disable max-len */
/* eslint-disable eqeqeq */
import React from 'react';
import {
  Form, Modal, InputNumber,
} from 'antd';
// import { request } from '@cfe/caopc-center-common';
import ModalProcess from '../conponent/processModal';

const FormItem = Form.Item;
@Form.create()
export default class ModalRule extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
    };
  }

  componentDidMount() {
    const { data, type } = this.props;
    if (type === 'edit') {
      this.onChangeCity(data.cityCode);
    }
    // request({
    //   url: '/pay-boss/basic/queryPermissionCity',
    //   method: 'post',
    // }).then((res) => {
    //   this.setState({
    //     cityList: res.filter((val) => val.value !== '全国'),
    //   });
    // });
    // request({
    //   url: '/pay-platform/common/dict/list/leaseDeductChannelAccount',
    //   method: 'get',
    // }).then((data) => {
    //   this.setState({
    //     firmData: data,
    //   });
    // });
  }

    submit = () => {
      const {
        form,
      } = this.props;

      form.validateFieldsAndScroll((err) => {
        if (!err) {
          this.setState({
            visible: true,
          });
        }
      });
    }

    onOkMorry = () => {
      const { onOk } = this.props;
      this.setState({
        visible: false,
      });
      onOk();
    }

    render() {
      const { getFieldDecorator, getFieldValue } = this.props.form;
      const { visible } = this.state;
      const { selectedRowKeys } = this.props;

      return (
        <Modal
          visible
          title="分润调控"
          onCancel={this.props.onCancel}
          onOk={this.submit}
          maskClosable={false}
          width={500}
        >
          <h3 style={{ marginLeft: 20 }}>
            已选择&nbsp;&nbsp; <span style={{ color: 'red' }}>{selectedRowKeys?.length}</span>&nbsp;&nbsp;条分润规则
          </h3>
          <Form layout="inline">
            <FormItem label="请输入分润调控系数" labelCol={{ style: { width: 170 } }}>
              {getFieldDecorator('driverTagRate', {
                rules: [{
                  required: true,
                  message: '分润调控系数输入区间为【-19.99,0）',
                  pattern: /^(-(([1-9]|1[0-9]|19)(\.\d{1,2})?|0(\.\d{1,2})?))$/,
                }],
              })(
                <InputNumber precision={2} style={{ width: 150 }} placeholder="请输入" />,
              )}
            </FormItem>

          </Form>
          {visible && <ModalProcess data={getFieldValue('driverTagRate')} selectedRowKeys={selectedRowKeys} onOk={this.onOkMorry} onCancel={this.onOkMorry} />}
        </Modal>
      );
    }
}
