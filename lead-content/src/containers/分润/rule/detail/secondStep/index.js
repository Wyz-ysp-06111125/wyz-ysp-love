import React, { Component } from 'react';
import { Form, Select } from 'antd';

const FormItem = Form.Item;
const { Option } = Select;

export default class Step extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }


  componentDidMount() {

  }

  render() {
    const {
      form, feeCodesList, umpFeeDetailsList, specialFeeList,
      detail, disabled,
    } = this.props;
    const { getFieldDecorator } = form;
    console.log(detail);

    return (
      <div>
        <div className="liquid-rule-cell">
          <FormItem label="代收费用">
            {getFieldDecorator('feeCodes', {
              initialValue: detail.ruleDetail.feeCodes || undefined,
              rules: [
                // { required: true, message: '代收费用不能为空！' },
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
              {feeCodesList.map((item) => (
                <Option
                  key={item.key}
                  value={item.key}
                >{item.value}</Option>
              ))}
            </Select>)}
          </FormItem>
        </div>
        <div className="liquid-rule-cell">
          <FormItem label="优惠金额">
            {getFieldDecorator('umpFeeCodes', {
              initialValue: detail.ruleDetail.umpFeeCodes || undefined,
              rules: [
                // { required: true, message: '代收费用不能为空！' },
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
              {umpFeeDetailsList.map((item) => (
                <Option
                  key={item.key}
                  value={item.key}
                >{item.value}</Option>
              ))}
            </Select>)}
          </FormItem>
        </div>
        <div className="liquid-rule-cell">
          <FormItem label="特殊费用">
            {getFieldDecorator('specialFeeCodes', {
              initialValue: detail.ruleDetail.specialFeeCodes || undefined,
              rules: [
                // { required: true, message: '特殊费用不能为空！' },
              ],
            })(<Select
              mode="multiple"
              style={{ width: 424 }}
              allowClear
              placeholder="请选择"
              showSearch
              optionFilterProp="children"
              disabled
            >
              {specialFeeList.map((item) => (
                <Option
                  key={item.key}
                  value={item.key}
                >{item.value}</Option>
              ))}
            </Select>)}
          </FormItem>
        </div>
      </div>
    );
  }
}
