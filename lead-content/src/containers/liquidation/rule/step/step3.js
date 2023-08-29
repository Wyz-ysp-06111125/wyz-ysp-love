/* eslint-disable camelcase */
/* eslint-disable eqeqeq */
/* eslint-disable max-len */
/* eslint-disable react/no-access-state-in-setstate */
import React, { Component } from 'react';
import {
  Form, Card, Tabs, Input,
} from 'antd';
import { g_event_emitter } from '@/ruleUtils/eventEmitter';
import { SelectMax } from '@cfe/venom';
import AdvanceInput from '../detail/firstStep/advanceInput';

const FormItem = Form.Item;
const { TabPane } = Tabs;

@Form.create()
export default class Step extends Component {
  constructor(props) {
    super(props);
    this.lastIndex = -1;
    this.state = {
      activeKey: this.lastIndex?.toString(),
      specialRules: [],
    };
  }


  componentDidMount() {
    g_event_emitter.on('formValid', (name, index) => {
      this.setState({
        activeKey: this.state.specialRules[index]?.key?.toString(),
      });
    });
    if (window.sessionStorage.getItem('Step3')) {
      const detail = JSON.parse(window.sessionStorage.getItem('Step3'));
      if (detail.specialRules?.length) {
        this.lastIndex = detail.specialRules[detail.specialRules.length - 1]?.key;
        this.setState({
          ...detail,
          activeKey: detail.specialRules[0]?.key?.toString(),
        });
      }
    }
  }

  handleOnValidator(index) {
    return (rule, value, callback) => {
      if (index === 0) {
        if (Object.keys(value).some((key) => (value[key] === undefined || value[key] === null || value[key] === ''))) {
          callback('请填写完整此条规则！');
          return;
        }
      } else if (!this.checkValid(value)) {
        callback('请填写完整此条规则！');
        return;
      }
      callback();
    };
  }

  checkValid = (value) => {
    let count = 0;
    Object.keys(value)?.forEach((key) => {
      if (value[key] === 0 || value[key]) {
        count += 1;
      }
    });
    return count == 0 || count == 4;
  }

  onEdit = (targetKey, action) => {
    this[action](targetKey);
  };

  onChange = (activeKey) => {
    this.setState({ activeKey });
  };


  add = () => {
    this.lastIndex += 1;
    const { specialRules } = this.state;
    specialRules.push({
      key: this.lastIndex,
      feeCodes: undefined,
      merchantSplitDetails: [{
        clearRate: undefined, merchantNo: undefined, settlePeriod: undefined, settleUserType: undefined,
      }, {
        clearRate: undefined, merchantNo: undefined, settlePeriod: undefined, settleUserType: undefined,
      }],
    });
    this.setState({ specialRules, activeKey: this.lastIndex?.toString() });
  };

  remove = (targetKey) => {
    const specialRules = this.state.specialRules.filter((pane) => pane.key != targetKey);
    this.setState({ specialRules, activeKey: specialRules[0]?.key?.toString() });
    this.props.form.setFieldsValue({
      specialRules,
    });
  };

  onChangeForm = (obj, index, key, value, i) => {
    const newData = this.state[`${obj}`];
    if (i || i == 0) {
      newData[index][key][i] = value;
      this.setState({
        [`${obj}`]: newData,
      });
    } else {
      newData[index][key] = value;
      this.setState({
        [`${obj}`]: newData,
      });
    }
  }

  render() {
    const { specialRules, activeKey } = this.state;
    const { getFieldDecorator } = this.props.form;
    const {
      merchantTypeList, clearMerchantTypeList, specialFeeList, disabled,
    } = this.props;
    return (
      <Card className="modal-rule">
        <Form layout="inline">
          <Tabs
            type={disabled ? 'card' : 'editable-card'}
            onEdit={this.onEdit}
            onChange={this.onChange}
            activeKey={activeKey}
          >
            {specialRules.map((item, index) => (
              <TabPane tab={`特殊分润${index + 1}`} key={item.key}>
                <FormItem>
                  {getFieldDecorator(`specialRules[${index}].key`, {
                    initialValue: item.key,
                  })(<Input style={{ display: 'none' }} disabled={disabled} />)}
                </FormItem>
                <FormItem label="选择费用项" labelCol={{ style: { width: 200 } }}>
                  {getFieldDecorator(`specialRules[${index}].feeCodes`, {
                    initialValue: item.feeCodes,
                    rules: [
                      { required: true, message: '请选择' },
                    ],
                  })(<SelectMax style={{ minWidth: 200 }}
                    mode="multiple"
                    options={specialFeeList}
                    onChange={(e) => this.onChangeForm('specialRules', index, 'feeCodes', e)}
                    disabled={disabled}
                  />)}
                </FormItem>
                <div className="liquid-rule-cell" style={{ marginLeft: 200, marginTop: 10 }}>
                  {
                    item.merchantSplitDetails?.map((e, i) => (
                      <FormItem key={`advanceInput${item.key}_${i}`} className="liquidation-formItem-advanceInputGroup">
                        {getFieldDecorator(`specialRules[${index}].merchantSplitDetails[${i}]`, {
                          initialValue: e,
                          rules: [
                            { required: true, message: '规则不能为空！' },
                            { validator: this.handleOnValidator(i) },
                          ],
                        })(<AdvanceInput
                          disabled={disabled}
                          index={i}
                          merchantTypeList={merchantTypeList}
                          clearMerchantTypeList={clearMerchantTypeList}
                          onChange={(e) => this.onChangeForm('specialRules', index, 'merchantSplitDetails', e, i)}
                        />)}
                      </FormItem>
                    ))
                  }
                </div>
              </TabPane>
            ))}
          </Tabs>

        </Form>
      </Card>
    );
  }
}
