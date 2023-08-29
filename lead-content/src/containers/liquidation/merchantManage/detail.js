import React, { Component } from 'react';
import { Form, Select, Input, InputNumber, DatePicker } from 'antd';
import { Auth } from '@cfe/caopc-center-common';
import Moment from 'moment';
import CModal from '@/components/cModal';
import { urls } from './config';

const FormItem = Form.Item;
const { Option } = Select;

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
        certificatesTypeList, accountTypeList, record = {}, type
      } = this.props;
      const disabled = type === 'look';
      return (<Form className="search-form liquidation" layout="inline" >
        <div>
          <div>商户信息：</div>
          <div>
            <FormItem label="商户名称">
              {getFieldDecorator('merchantName', {
                initialValue: record.merchantName,
                rules: [
                  { required: true, message: '商户名称不能为空！' },
                ],
              })(<Input
                className="input-md"
                disabled={disabled}
              />)}
            </FormItem>
            <FormItem label="商户号">
              {getFieldDecorator('merchantNo', {
                initialValue: record.merchantNo,
                rules: [
                  { required: true, message: '商户号不能为空！' },
                ],
              })(<Input
                className="input-md"
                disabled={disabled || type !== 'add'}
              />)}
            </FormItem>
            <FormItem label="公司名称">
              {getFieldDecorator('companyName', {
                initialValue: record.companyName,
                rules: [
                  { required: true, message: '公司名称不能为空！' },
                ],
              })(<Input
                className="input-md"
                disabled={disabled}
              />)}
            </FormItem>
            <FormItem label="法人姓名">
              {getFieldDecorator('realName', {
                initialValue: record.realName,
                rules: [
                  { required: true, message: '法人姓名不能为空！' },
                ],
              })(<Input className="input-md" disabled={disabled} />)}
            </FormItem>
            <FormItem label="法人证件类型">
              {getFieldDecorator('certType', {
                initialValue: record.certType ? record.certType.toString() : undefined,
                rules: [
                  { required: true, message: '法人证件类型不能为空！' },
                ],
              })(<Select
                className="input-md"
                allowClear
                placeholder="请选择"
                showSearch
                optionFilterProp="children"
                disabled={disabled}
              >
                {certificatesTypeList.map(item => (<Option
                  key={item.key}
                  value={item.key}
                >{item.value}</Option>))}
              </Select>)}
            </FormItem>
            <FormItem label="法人证件号">
              {getFieldDecorator('certNo', {
                initialValue: record.certNo,
                rules: [
                  { required: true, message: '法人证件号不能为空！' },
                ],
              })(<Input className="input-md" disabled={disabled} />)}
            </FormItem>
            <FormItem label="法人手机号">
              {getFieldDecorator('phone', {
                initialValue: record.phone,
                rules: [
                  { required: true, message: '法人手机号不能为空！' },
                ],
              })(<InputNumber className="input-md" disabled={disabled} />)}
            </FormItem>
            <FormItem label="营业执照号">
              {getFieldDecorator('licenseNo', {
                initialValue: record.licenseNo,
                rules: [
                  { required: true, message: '营业执照号不能为空！' },
                ],
              })(<Input className="input-md" disabled={disabled} />)}
            </FormItem>
            <FormItem label="营业执照有效期">
              {getFieldDecorator('licenseValidTime', {
                initialValue: record.licenseValidTime ? Moment(record.licenseValidTime, 'YYYY-MM-DD') : undefined,
                rules: [
                  { required: true, message: '营业执照有效期不能为空！' },
                ],
              })(<DatePicker
                placeholder="请选择时间"
                className="input-md"
                format="YYYY-MM-DD"
                disabled={disabled}
              />)}
            </FormItem>
          </div>
        </div>
        <div>
          <div>提现账户：</div>
          <div>
            <div>
              <FormItem label="银行账户">
                {getFieldDecorator('bankUserNo', {
                  initialValue: record.bankUserNo,
                  rules: [
                    { required: true, message: '银行账户不能为空！' },
                  ],
                })(<Input className="input-md" disabled={disabled} />)}
              </FormItem>
              <FormItem label="账号类型">
                {getFieldDecorator('bankUserType', {
                  initialValue: record.bankUserType ? record.bankUserType.toString() : undefined,
                  rules: [
                    { required: true, message: '账号类型不能为空！' },
                  ],
                })(<Select
                  className="input-md"
                  allowClear
                  placeholder="请选择"
                  showSearch
                  optionFilterProp="children"
                  disabled={disabled}
                >
                  {accountTypeList.map(item => (<Option
                    key={item.key}
                    value={item.key}
                  >{item.value}</Option>))}
                </Select>)}
              </FormItem>
            </div>
            <div>
              <FormItem label="开户行">
                {getFieldDecorator('bankName', {
                  initialValue: record.bankName,
                  rules: [
                    { required: true, message: '开户行不能为空！' },
                  ],
                })(<Input className="input-md" disabled={disabled} />)}
              </FormItem>
              <FormItem label="支行">
                {getFieldDecorator('subBankName', {
                  initialValue: record.subBankName,
                  rules: [
                    { required: true, message: '支行不能为空！' },
                  ],
                })(<Input className="input-md" disabled={disabled} />)}
              </FormItem>
            </div>
          </div>
        </div>
      </Form>);
    };
  }


  handleOnOver() {
    const { onOver } = this.props
    onOver && onOver()
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
      title, loadData, type, children, authType, record
    } = this.props;
    const { showModal } = this.state;
    let fetch = {};

    if (type === 'modify') {
      fetch = urls.modify;
    } else if (type === 'add') {
      fetch = urls.add;
    } else {
      fetch = urls.queryPageList;
    }

    return (
      <span>
        <Auth
          url={fetch.url}
          authType={authType || 'link'}
          onClick={this.handleOnClick()}
          type="primary"
        >{children || title}</Auth>
        {
          showModal ?
            <CModal
              visible
              width={1083}
              wrapForm={(form) => {
                this.form = form;
              }}
              onOver={(data) => {
                this.handleOnOver(data);
              }}
              fetch={{
                ...fetch,
                body: (form, callback) => {
                  form.validateFields((err, fieldValues) => {
                    if (!err) {
                      if (record) {
                        fieldValues.id = record.id;
                      }
                      fieldValues.licenseValidTime = fieldValues.licenseValidTime.format('YYYY-MM-DD');
                      callback(fieldValues);
                    }
                  });
                },
              }}
              loadData={loadData}
              title={title}
              okText={type === 'look' ? '' : '保存'}
              cancelText={type === 'look' ? '关闭' : '取消'}
              customRender={this.getCustomRender()}
            /> : null
        }

      </span>
    );
  }
}

