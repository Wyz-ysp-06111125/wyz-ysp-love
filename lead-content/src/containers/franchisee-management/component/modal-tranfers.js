import React from 'react';
import {
  Form, Modal, Message, Input, Radio, InputNumber,
} from 'antd';
import { request } from '@cfe/caopc-center-common';
import './index.less';

const FormItem = Form.Item;
const { TextArea } = Input;
@Form.create()
export default class Transfers extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      // cityCart: [],
      // companyList: [],
      // companyName: '',
    };
  }

  componentDidMount() {
    // const { data, type } = this.props;
    // request({
    //   url: "/center-config/category/listByCity",
    //   method: "get"
    // }).then((res) => {
    //   this.setState({
    //     cityCart: res
    //   })
    // })
  }

  submit = () => {
    const {
      form, data, onOk,
    } = this.props;

    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        values.agencyNo = data.agencyNo;
        // const number = values.adjustAmount.toString()
        // values.adjustAmount = ((values.adjustAmount.toFixed(2) * 10000).toString()).slice(0, -2)
        // console.log(typeof(values.adjustAmount))
        values.adjustAmount = values.adjustAmount.toString();
        // console.log(typeof(values.adjustAmount))
        // values.adjustAmount = Number((values.adjustAmount * 100).toFixed(0));
        request({
          url: '/pay-boss/leaseDeduction/agency/adjust',
          method: 'post',
          data: values,
        }).then((res) => {
          Message.success('操作成功');
          onOk && onOk(res);
        });
      }
    });
  }

  // 获取所有内容查看页面时候
  // queryCompanyList = (name) => {
  // };

  render() {
    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 8 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 },
      },
    };
    return (
      <Modal
        visible
        title="调账"
        onCancel={this.props.onCancel}
        onOk={this.submit}
        maskClosable={false}
        width={600}
      >
        <Form>
          <FormItem label="调账方向" {...formItemLayout}>
            {getFieldDecorator('adjustType', {
              // rules: [{
              //   required: true, message: '请选择',
              // }],
              initialValue: 1,
            })(
              <Radio.Group>
                <Radio value={1}>增加</Radio>
                <Radio value={2}>减少</Radio>
              </Radio.Group>,
            )}
          </FormItem>
          <FormItem label="调账金额" {...formItemLayout}>
            {getFieldDecorator('adjustAmount', {
              rules: [{
                required: true, message: '请选择',
              }],
            })(
              <InputNumber placeholder="请输入" style={{ width: 200 }} min={0} precision={2} max={100000} />,
            )}
          </FormItem>
          <div style={{ marginTop: 15 }}>
            <FormItem label="备注" {...formItemLayout}>
              {getFieldDecorator('remark', {
                rules: [{
                  message: '请输入', required: true,
                }],
              })(
                <TextArea style={{ height: 120, width: 200 }} />,
              )}
            </FormItem>
          </div>
        </Form>

      </Modal>
    );
  }
}
