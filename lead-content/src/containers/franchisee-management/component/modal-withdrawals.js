import React from 'react';
import {
  Form, Modal, Message, InputNumber,
} from 'antd';
import { request } from '@cfe/caopc-center-common';
import './index.less';

const FormItem = Form.Item;
@Form.create()
export default class Withdrawals extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      bankInfo: null,
    };
  }

  componentDidMount() {
    const { data } = this.props;
    request({
      url: '/pay-boss/leaseCommission/paymentRecord/getBankInfo',
      data: {
        userNo: data.agencyNo,
      },
    }).then((data) => {
      this.setState({
        bankInfo: data,
      });
    });
  }

  submit = () => {
    const {
      form, data, onOk,
    } = this.props;
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        values.agencyNo = data.agencyNo;
        values.requestFromOuter = false;
        // values.withdrawAmount = Number((values.withdrawAmount * 100).toFixed(0));
        values.withdrawAmount = values.withdrawAmount.toString();
        request({
          url: '/pay-boss/leaseDeduction/agency/withdraw',
          method: 'post',
          data: values,
        }).then((res) => {
          Message.success('操作成功');
          onOk && onOk(res);
        });
      }
    });
  }

  queryadd=() => {
    const { data } = this.props;
    const { setFieldsValue } = this.props.form;
    const center = (data.withdrawAmount / 100).toFixed(2);
    setFieldsValue({
      withdrawAmount: center,
    });
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    const { data } = this.props;
    const { bankInfo } = this.state;
    const formItemLayout = {
      labelCol: {
        xs: { span: 20 },
        sm: { span: 7 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 17 },
      },
    };
    return (
      <Modal
        visible
        title="提现"
        onCancel={this.props.onCancel}
        onOk={this.submit}
        maskClosable={false}
        width={600}

      >
        {data !== undefined && (
          <div className="cancel-top">
            <Form {...formItemLayout}>
              <FormItem label="加盟商名称" {...formItemLayout}>
                {data.agencyName}
              </FormItem>
              <FormItem label="可提现金额" {...formItemLayout}>
                {parseFloat(data.withdrawAmount / 100).toFixed(2)}
              </FormItem>
              <FormItem label="提现金额" {...formItemLayout}>
                {getFieldDecorator('withdrawAmount', {
                  rules: [{
                    required: true,
                    message: '请选择',
                  }],
                })(
                  <InputNumber className="input-md" placeholder="请输入" precision={2} />,
                )}<span className="alldatamount" onClick={() => { this.queryadd(); }}>全部</span>
              </FormItem>
              <hr className="desta" />
              {bankInfo && (
                <div>
                  <FormItem label="提现银行" {...formItemLayout}>
                    {bankInfo.bankProvinceName}{bankInfo.bankCityName}{bankInfo.bankName}
                  </FormItem>
                  <FormItem label="开户支行" {...formItemLayout}>
                    {bankInfo.branchBankName}
                  </FormItem>
                  <FormItem label="银行账号" {...formItemLayout}>
                    {bankInfo.withdrawBankCardNo}
                  </FormItem>
                  <FormItem label="联行号" {...formItemLayout}>
                    {bankInfo.bankSettleNo}
                  </FormItem>
                </div>
              )}
            </Form>

          </div>
        )}
      </Modal>
    );
  }
}
