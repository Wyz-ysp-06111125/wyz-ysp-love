import React from 'react';
import {
  Form, Modal, Input, Message, Radio,
} from 'antd';
import { request } from '@cfe/caopc-center-common';
import { urls } from '../config';

const FormItem = Form.Item;
const { TextArea } = Input;

@Form.create()

export default class CreatModal extends React.Component {
  onSubmit = () => {
    const {
      form, onSubmit, data,
    } = this.props;
    form.validateFields((err, values) => {
      if (!err) {
        request({
          ...urls.audit,
          data: {
            groupId: data.groupId,
            ...values,
            approval: !!values.approval,
          },
        }).then((res) => {
          Message.success('操作成功');
          onSubmit && onSubmit(res);
        });
      }
    });
  }

  render() {
    const {
      onCancel,
    } = this.props;
    const { getFieldDecorator } = this.props.form;
    return (
      <Modal
        title="审核"
        visible
        onOk={this.onSubmit}
        onCancel={onCancel}
        // width={560}
        destroyOnClose
      >
        <Form layout="inline">
          <FormItem label="审批意见" labelCol={{ style: { width: 130 } }}>
            {getFieldDecorator('approval', {
              rules: [{
                required: true, message: '请选择',
              }],
            })(<Radio.Group>
              <Radio value={1}>同意</Radio>
              <Radio value={0}>驳回</Radio>
            </Radio.Group>)}
          </FormItem>
          <br />
          <FormItem label="备注" labelCol={{ style: { width: 130 } }}>
            {getFieldDecorator('remark', {
              // rules: [{
              //   required: true, message: '请输入',
              // }],
            })(<TextArea style={{ width: 200 }} rows={3} maxLength={200} />)}
          </FormItem>
        </Form>
      </Modal>
    );
  }
}
