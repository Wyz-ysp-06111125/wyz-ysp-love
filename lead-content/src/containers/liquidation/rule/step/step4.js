/* eslint-disable react/no-access-state-in-setstate */
import React, { Component } from 'react';
import {
  Form, Card,
} from 'antd';
import { SelectMax } from '@cfe/venom';

const FormItem = Form.Item;

@Form.create()
export default class Step extends Component {
  constructor(props) {
    super(props);
    this.state = {
      detail: {},
      specialFeeCodes: [],
    };
  }


  componentDidMount() {
    const { specialRules = [] } = JSON.parse(window.sessionStorage.getItem('Step3')) || {};
    let feeCodes = [];
    specialRules.forEach((item) => {
      feeCodes = feeCodes.concat(item.feeCodes);
    });
    this.setState({
      specialFeeCodes: [...new Set(feeCodes)],
    });
    const detail = JSON.parse(window.sessionStorage.getItem('Step4')) || {};
    this.setState({
      detail,
    });
  }

  render() {
    const { detail, specialFeeCodes } = this.state;
    const { getFieldDecorator } = this.props.form;
    const {
      feeCodesList, umpFeeDetailsList, specialFeeList, disabled,
    } = this.props;
    return (
      <Card>
        <Form layout="inline">
          <FormItem label="代收费用项" labelCol={{ style: { width: 200 } }}>
            {getFieldDecorator('feeCodes', {
              initialValue: detail.feeCodes,
              rules: [
                // { required: true, message: '请选择' },
              ],
            })(<SelectMax
              style={{ minWidth: 300 }}
              mode="multiple"
              options={feeCodesList}
              disabled={disabled}
            />)}
          </FormItem>
          <br />
          <FormItem label="营销费用项" labelCol={{ style: { width: 200 } }}>
            {getFieldDecorator('umpFeeCodes', {
              initialValue: detail.umpFeeCodes,
              rules: [
                // { required: true, message: '请选择' },
              ],
            })(<SelectMax
              style={{ minWidth: 300 }}
              mode="multiple"
              options={umpFeeDetailsList}
              disabled={disabled}
            />)}
          </FormItem>
          <br />
          <FormItem label="特殊费用项" labelCol={{ style: { width: 200 } }}>
            {getFieldDecorator('specialFeeCodes', {
              initialValue: specialFeeCodes,
              rules: [
                // { required: true, message: '请选择' },
              ],
            })(<SelectMax
              placeholder=""
              disabled
              style={{ minWidth: 300 }}
              mode="multiple"
              options={specialFeeList}
            />)}
          </FormItem>
        </Form>
      </Card>
    );
  }
}
