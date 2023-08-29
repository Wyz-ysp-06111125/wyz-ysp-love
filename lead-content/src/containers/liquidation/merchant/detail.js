import React, { Component } from 'react';
import { Form, Select, Input, } from 'antd';
import { Auth } from '@cfe/caopc-center-common';
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
        clearMerchantTypeList, record = {}, type
      } = this.props;
      return (<Form className="search-form liquidation" layout="inline" >
        <div>
          <div>
            <FormItem label="分润主体类型">
              {getFieldDecorator('merchantType', {
                initialValue: record.merchantType ? record.merchantType.toString() : undefined,
                rules: [
                  { required: true, message: '分润主体类型不能为空！' },
                ],
              })(<Select
                className="input-md"
                allowClear
                placeholder="请选择"
                showSearch
                optionFilterProp="children"
                disabled={type === 'modify'}
              >
                {clearMerchantTypeList.map(item => (<Option
                  key={item.key}
                  value={item.key}
                >{item.value}</Option>))}
              </Select>)}
            </FormItem>
          </div>
          <div>
            <FormItem label="分润主体名称">
              {getFieldDecorator('merchantName', {
                initialValue: record.merchantName,
                rules: [
                  { required: true, message: '分润主体名称不能为空！' },
                ],
              })(<Input className="input-md" />)}
            </FormItem>
          </div>
          {
            record.id !== undefined && <div>
              <FormItem label="分润主体账户">
                {getFieldDecorator('merchantNo', {
                  initialValue: record.merchantNo,
                  rules: [
                    { required: true, message: '结算商户号不能为空！' },
                  ],
                })(<Input className="input-md" disabled />)}
              </FormItem>
            </div>
          }
          <div>
            <FormItem label="结算商户号">
              {getFieldDecorator('bankMerchantNo', {
                initialValue: record.bankMerchantNo,
                rules: [
                  { required: true, message: '结算商户号不能为空！' },
                ],
              })(<Input className="input-md" />)}
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
      title, loadData, type, children, authType, record
    } = this.props;
    const { showModal } = this.state;
    let fetch = {};

    if (type === 'modify') {
      fetch = urls.modify;
    } else if (type === 'add') {
      fetch = urls.add;
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
              width={452}
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

