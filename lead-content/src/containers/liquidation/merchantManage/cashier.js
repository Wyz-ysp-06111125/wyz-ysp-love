import React, { Component } from 'react';
import { Form, Input, InputNumber, } from 'antd';
import { Auth } from '@cfe/caopc-center-common';
import CModal from '@/components/cModal';
import { urls } from './config';

const FormItem = Form.Item;
const { TextArea } = Input;

export default class AdvancedModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showModal: false,
    };
  }

  componentDidMount() {

  }


  getCustomRender() {
    return (form) => {
      const { getFieldDecorator } = form;
      const {
        record = {}
      } = this.props;
      return (<Form className="search-form liquidation" layout="inline" >
        <div>
          <div className="liquidation-cashier">
            <FormItem label="商户名称">
              {record.merchantName}
            </FormItem>
          </div>
          <div className="liquidation-cashier">
            <FormItem label="商户号">
              {record.merchantNo}
            </FormItem>
          </div>
          <div className="liquidation-cashier">
            <FormItem label="账户金额(元)">
              {record.accountAmount}
            </FormItem>
          </div>
          <div className="liquidation-cashier">
            <FormItem label="冻结金额(元)">
              {record.frozenAmount}
            </FormItem>
          </div>
          <div className="liquidation-cashier">
            <FormItem label="提现渠道">
            银行卡
            </FormItem>
          </div>
          <div className="liquidation-cashier">
            <FormItem label="提现账号">
              {record.bankUserNo}
            </FormItem>
          </div>
          <div className="liquidation-cashier">
            <FormItem label="账号姓名">
              {record.companyName}
            </FormItem>
          </div>
          <div className="liquidation-cashier">
            <FormItem label="开户行">
              {record.bankName}
            </FormItem>
          </div>
          <div className="liquidation-cashier">
            <FormItem label="支行">
              {record.subBankName}
            </FormItem>
          </div>
          <div>
            <FormItem label="提现金额(元)">
              {getFieldDecorator('amount', {
                initialValue: undefined,
                rules: [
                  { required: true, message: '提现金额不能为空！' },
                ],
              })(<InputNumber
                className="input-md"
                precision={2}
                min={0.01}
                // max={record.accountAmount - record.frozenAmount}
              />)}
            </FormItem>
          </div>
          <div>
            <FormItem label="提现原因">
              {getFieldDecorator('remark', {
                initialValue: undefined,
                rules: [
                  { required: true, message: '提现原因不能为空！' },
                ],
              })(<TextArea
                className="input-md"
                rows={4}
              />)}
            </FormItem>
          </div>
        </div>
      </Form>);
    };
  }


  handleOnOver() {
    this.setState({
      showModal: false,
    });
  }

  handleOnClick() {
    return () => {
      this.setState({
        showModal: true,
      });
    };
  }

  render() {
    const {
      title, loadData, children, authType, record
    } = this.props;
    const { showModal } = this.state;

    return (
      <span>
        <Auth
          url={urls.cashier.url}
          authType={authType || 'link'}
          onClick={this.handleOnClick()}
          type="primary"
        >{children || title}</Auth>
        {
          showModal ?
            <CModal
              visible
              width={452}
              wrapForm={(form) => {
                this.form = form;
              }}
              onOver={(data) => {
                this.handleOnOver(data);
              }}
              fetch={{
                ...urls.cashier,
                body: (form, callback) => {
                  form.validateFields((err, fieldValues) => {
                    if (!err) {
                      if (record) {
                        fieldValues.id = record.merchantNo;
                      }
                      callback(fieldValues);
                    }
                  });
                },
              }}
              loadData={loadData}
              title={title}
              okText="保存"
              cancelText="取消"
              customRender={this.getCustomRender()}
            /> : null
        }

      </span>
    );
  }
}

