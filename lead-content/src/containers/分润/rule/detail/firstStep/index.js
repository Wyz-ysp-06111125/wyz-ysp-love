/* eslint-disable max-len */
import React, { Component } from 'react';
import {
  Form, Select, Input, DatePicker, Icon,
} from 'antd';
import moment from 'moment';
import { request } from '@cfe/caopc-center-common';
import { urls } from '../../config';
import AdvanceInput from './advanceInput';

const FormItem = Form.Item;
const { Option } = Select;

export default class Step extends Component {
  constructor(props) {
    super(props);
    this.state = {
      leaseholdersList: [],
    };
  }


  componentDidMount() {
    const { detail } = this.props;
    this.loadLeaseholdersList(detail.cityCode);
  }

  loadLeaseholdersList(cityCode) {
    if (!cityCode) {
      return;
    }

    request({
      ...urls.queryLeaseholdersList,
      data: {
        cityCode,
      },
    }).then((data) => {
      this.setState({
        leaseholdersList: data || [],
      });
    });
  }

  handleOnAdd(data) {
    return () => {
      const { templete, getKey, baseRuleFormat } = this.props;

      const item = { ...templete.specialTemplete, key: getKey() };
      item.feeCodes = [];
      item.merchantSplitDetails = [];
      baseRuleFormat(item.merchantSplitDetails, templete.baseTemplete);
      data.specialRules.push(item);
      this.setState({});
    };
  }

  handleOnRemove(data, index) {
    return () => {
      data.splice(index, 1);
      this.setState({});
    };
  }

  handleOnValidator(index) {
    return (rule, value, callback) => {
      if (index === 0) {
        if (Object.keys(value).some((key) => (value[key] === undefined || value[key] === null || value[key] === ''))) {
          callback('请填写完整此条规则！');
          return;
        }
      } else if (!(Object.keys(value).every((key) => (key === 'key' ? true : (value[key] === undefined || value[key] === null || value[key] === '')))
        || Object.keys(value).every((key) => (key === 'key' ? true : !(value[key] === undefined || value[key] === null || value[key] === ''))))) {
        callback('请填写完整此条规则！');
        return;
      }
      callback();
    };
  }

  handleOnchange(key) {
    return (value) => {
      const { form } = this.props;
      if (key === 'cityCode') {
        form.setFieldsValue({
          agencyIdList: undefined,
        });
        this.loadLeaseholdersList(value);
      }
    };
  }

  disabledDate(current) {
    return current && current < moment().endOf('day');
  }

  render() {
    const {
      form, cityList, specialFeeList,
      bizLineList, carNatureList, clearMerchantTypeList, merchantTypeList,
      detail, disabled, type,
    } = this.props;
    const { getFieldDecorator } = form;
    const { leaseholdersList } = this.state;
    console.log(detail, merchantTypeList);

    return (
      <div>
        <div className="liquid-rule-cell">
          <FormItem label="分润规则名称">
            {getFieldDecorator('ruleName', {
              initialValue: detail.ruleName || undefined,
              rules: [
                { required: true, message: '分润规则名称不能为空！' },
              ],
            })(<Input className="input-sm" disabled={disabled} maxLength={10} />)}
          </FormItem>
          <FormItem label="生效时间">
            {getFieldDecorator('activateTime', {
              initialValue: detail.activateTime ? moment(detail.activateTime) : undefined,
              rules: [
                { required: true, message: '生效时间不能为空！' },
              ],
            })(<DatePicker
              // showTime
              format="YYYY-MM-DD"
              disabled={disabled}
              disabledDate={this.disabledDate}
            />)}
          </FormItem>
        </div>
        <div className="liquid-rule-cell">
          <div className="rule-title">业务因素：</div>
          <div>
            <div>
              <FormItem label="城市">
                {getFieldDecorator('cityCode', {
                  initialValue: detail.cityCode || undefined,
                  rules: [
                    { required: true, message: '城市不能为空！' },
                  ],
                })(<Select
                  className="input-sm"
                  allowClear
                  placeholder="请选择"
                  showSearch
                  optionFilterProp="children"
                  disabled={disabled}
                  onChange={this.handleOnchange('cityCode')}
                >
                  {cityList.map((item) => (
                    <Option
                      key={item.key}
                      value={item.key}
                    >{item.value}</Option>
                  ))}
                </Select>)}
              </FormItem>
              <FormItem label="租赁商">
                {getFieldDecorator('agencyIdList', {
                  initialValue: detail.agencyIdList || undefined,
                  rules: [
                    { required: true, message: '租赁商不能为空！' },
                  ],
                })(<Select
                  className="input-llg"
                  allowClear
                  placeholder="请选择"
                  showSearch
                  mode="multiple"
                  optionFilterProp="children"
                  disabled={disabled}
                >
                  {leaseholdersList.map((item) => (
                    <Option
                      key={item.key}
                      value={item.key}
                    >{item.value}({item.key})</Option>
                  ))}
                </Select>)}
              </FormItem>
            </div>
            <div>
              <FormItem label="业务线">
                {getFieldDecorator('bizLine', {
                  initialValue: (detail.bizLine || detail.bizLine === '0' || detail.bizLine === 0) ? detail.bizLine.toString() : undefined,
                  rules: [
                    { required: true, message: '业务线不能为空！' },
                  ],
                })(<Select
                  className="input-sm"
                  allowClear
                  placeholder="请选择"
                  showSearch
                  optionFilterProp="children"
                  disabled={disabled}
                >
                  {bizLineList.map((item) => (
                    <Option
                      key={item.key}
                      value={item.key}
                    >{item.value}</Option>
                  ))}
                </Select>)}
              </FormItem>
              <FormItem label="车辆所属性质">
                {getFieldDecorator('carBelongType', {
                  initialValue: (detail.carBelongType || detail.carBelongType === '0' || detail.carBelongType === 0) ? detail.carBelongType.toString() : undefined,
                  rules: [
                    { required: true, message: '车辆所属性质不能为空！' },
                  ],
                })(<Select
                  className="input-md"
                  allowClear
                  placeholder="请选择"
                  showSearch
                  optionFilterProp="children"
                  disabled={disabled}
                >
                  {carNatureList.map((item) => (
                    <Option
                      key={item.key}
                      value={item.key}
                    >{item.value}</Option>
                  ))}
                </Select>)}
              </FormItem>
            </div>
          </div>
        </div>
        <div className="liquid-rule-cell dashed">
          <div className="rule-title">分润规则（默认）：</div>
          {
            detail.ruleDetail.baseRule.map((item, index) => (
              <FormItem key={item.key} className="liquidation-formItem-advanceInputGroup">
                {getFieldDecorator(`baseRule_item_${item.key}`, {
                  initialValue: item || undefined,
                  rules: [
                    { required: true, message: '规则不能为空！' },
                    { validator: this.handleOnValidator(index, 'baseRule') },
                  ],
                })(<AdvanceInput
                  index={index}
                  merchantTypeList={merchantTypeList}
                  clearMerchantTypeList={clearMerchantTypeList}
                  disabled={disabled}
                />)}
              </FormItem>
            ))
          }
        </div>
        {
          detail.ruleDetail.specialRules.map((item, index) => (
            <div className="liquid-rule-cell dashed" key={item.key}>

              {
                <div>
                  <FormItem label="特殊分润费用">
                    {getFieldDecorator(`specialRules_item_fee_${item.key}`, {
                      initialValue: item.feeCodes || undefined,
                      rules: [
                        { required: true, message: '特殊分润费用不能为空！' },
                      ],
                    })(<Select
                      mode="multiple"
                      style={{ width: 424 }}
                      allowClear
                      placeholder="请选择"
                      showSearch
                      optionFilterProp="children"
                      disabled={disabled}
                    >
                      {specialFeeList.map((childItem) => (
                        <Option
                          key={childItem.key}
                          value={childItem.key}
                        >{childItem.value}</Option>
                      ))}
                    </Select>)}
                  </FormItem>
                </div>
              }
              {
                item.merchantSplitDetails.map((childItem, childIndex) => (
                  <FormItem key={childItem.key} className="liquidation-formItem-advanceInputGroup">
                    {getFieldDecorator(`specialRules_item_child_${item.key}_${childItem.key}`, {
                      initialValue: childItem || undefined,
                      rules: [
                        { required: true, message: '规则不能为空！' },
                        { validator: this.handleOnValidator(childIndex, 'specialRules') },
                      ],
                    })(<AdvanceInput
                      index={childIndex}
                      merchantTypeList={merchantTypeList}
                      clearMerchantTypeList={clearMerchantTypeList}
                      disabled={disabled}
                    />)}
                  </FormItem>
                ))
              }
              {
                type !== 'look' && (
                  <Icon
                    type="minus-circle"
                    theme="filled"
                    onClick={this.handleOnRemove(detail.ruleDetail.specialRules, index)}
                  />
                )
              }
            </div>
          ))
        }
        {
          type !== 'look'
          && (
            <div className="liquid-rule-cell">
              <div className="icon-button" onClick={this.handleOnAdd(detail.ruleDetail)}>
                <Icon type="plus" />
              </div>
            </div>
          )
        }
      </div>
    );
  }
}
