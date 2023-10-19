/* eslint-disable no-nested-ternary */
/* eslint-disable eqeqeq */
/* eslint-disable max-len */
/* eslint-disable react/no-access-state-in-setstate */
import React, { Component } from 'react';
import moment from 'moment';
import { cloneDeep } from 'lodash';
import {
  Form, Button, Card, InputNumber, message, Radio, TimePicker, Select,
} from 'antd';
// import {
//   SelectMax,
// } from '@cfe/venom';
// import { request } from '@cfe/caopc-center-common';
import { MODULE } from '../config';
import AdvanceInput from '../detail/firstStep/advanceInput';
import './dataIndex.less';

const FormItem = Form.Item;
const { Option } = Select;
@Form.create()
export default class Step extends Component {
  constructor(props) {
    super(props);
    this.state = {
      splitModel: '0',
      baseRule: [{
        clearRate: undefined, merchantNo: undefined, settlePeriod: undefined, settleUserType: undefined,
      }, {
        clearRate: undefined, merchantNo: undefined, settlePeriod: undefined, settleUserType: undefined,
      }],
      ladderBaseRules: [{
        end: undefined,
        mileageSplitDetails: [{
          end: undefined,
          merchantSplitDetails: [{
            clearRate: undefined, merchantNo: undefined, settlePeriod: 1, settleUserType: '1',
          }, {
            clearRate: undefined, merchantNo: undefined, settlePeriod: 3, settleUserType: '4',
          }],
          driverClearFactors: [{
            start: undefined,
            end: undefined,
            value: undefined,
          }],
          driverTagRates: [
            //   {
            //   driverTag: undefined,
            //   rate: undefined,
            // }
          ],

        }],
      }],
      baseDriverClearFactors: undefined,
    };
  }

  componentDidMount() {
    if (window.sessionStorage.getItem('Step2')) {
      const detail = JSON.parse(window.sessionStorage.getItem('Step2'));
      detail?.ladderBaseRules?.forEach((val) => {
        val?.mileageSplitDetails?.forEach((item) => {
          if (!item.driverTagRates) {
            item.driverTagRates = [
              //   {
              //   driverTag: undefined,
              //   rate: undefined,
              // }
            ];
          }
        });
      });
      this.setState({
        ...detail,
        baseDriverClearFactors: detail.baseDriverClearFactors,
      });
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

  remove = (index, i) => {
    this.setState({
      ladderBaseRules: this.props.form.getFieldValue('ladderBaseRules'),
    }, () => {
      if (i || i == 0) {
        const newData = cloneDeep(this.state.ladderBaseRules);
        newData[index].mileageSplitDetails.splice(i, 1);
        this.setState({ ladderBaseRules: newData });
        this.props.form.setFieldsValue({
          ladderBaseRules: newData,
        });
      } else {
        const newData = cloneDeep(this.state.ladderBaseRules);
        newData.splice(index, 1);
        this.setState({ ladderBaseRules: newData });
        this.props.form.setFieldsValue({
          ladderBaseRules: newData,
        });
      }
    });
  }

  // 删除司机类型
  removeDriver = (index, i, RateIndex) => {
    this.setState({
      ladderBaseRules: this.props.form.getFieldValue('ladderBaseRules'),
    }, () => {
      if (RateIndex || RateIndex == 0) {
        const newData = cloneDeep(this.state.ladderBaseRules);
        newData[index].mileageSplitDetails[i].driverTagRates.splice(RateIndex, 1);
        this.setState({ ladderBaseRules: newData });
        this.props.form.setFieldsValue({
          ladderBaseRules: newData,
        });
      }
    });
  }

  // 增加司机类型
  addDriver = (index, i) => {
    if (i || i == 0) {
      const newData = cloneDeep(this.state.ladderBaseRules);
      if (!newData[index]?.mileageSplitDetails[i]?.driverTagRates) {
        // newData[index]?.mileageSplitDetails[i]?.driverTagRates = []
        newData?.forEach((val, valIndex) => {
          if (index == valIndex) {
            val?.mileageSplitDetails.forEach((w, a) => {
              if (i == a) {
                if (!w.driverTagRates) {
                  w.driverTagRates = [];
                }
              }
            });
          }
        });
      }
      if (newData[index]?.mileageSplitDetails[i]?.driverTagRates.length >= 9) {
        message.error('上限9个');
        return;
      }
      newData[index].mileageSplitDetails[i].driverTagRates.push({
        driverTag: undefined,
        rate: undefined,
      });
      this.setState({ ladderBaseRules: newData }, () => {
        this.changeRules(cloneDeep(this.state.baseDriverClearFactors));
      });
    }
  }

  onChangeForm = (index, key, value, i, obj, k) => {
    const newData = this.state.ladderBaseRules;
    if (i || i == 0) {
      if (k || k == 0) {
        newData[index][obj][i][key][k] = value;
        this.setState({
          ladderBaseRules: newData,
        });
      } else {
        newData[index][obj][i][key] = value;
        this.setState({
          ladderBaseRules: newData,
        });
      }
    } else {
      newData[index][key] = value;
      this.setState({
        ladderBaseRules: newData,
      });
    }
  }

  changeRules = (data) => {
    // const rule = cloneDeep(this.state.ladderBaseRules);
    const rule = cloneDeep(this.props.form.getFieldValue('ladderBaseRules'));
    if (rule) {
      rule.forEach((i) => {
        i.mileageSplitDetails.forEach((item) => {
          item.driverClearFactors = data;
        });
      });
      this.setState({
        ladderBaseRules: rule,
      }, () => {
        this.props.form.setFieldsValue({
          ladderBaseRules: rule,
        });
      });
    }
  }

  baseChange = (val, index, str) => {
    const newData = cloneDeep(this.state.baseDriverClearFactors);
    newData[index][str] = val;
    this.setState({
      baseDriverClearFactors: newData,
    });
    this.changeRules(newData);
    // this.onlyValue(index, val)
  }

  onlyValue = (index, e) => {
    const driverSwitch = this.props.form.getFieldValue('driverSwitch');
    const data = cloneDeep(this.state.ladderBaseRules);

    data?.forEach((dataValue) => {
      dataValue?.mileageSplitDetails.forEach((sonVal) => {
        // if (i == sonIndex) {
        sonVal.merchantSplitDetails.forEach((lastVal) => {
          if (lastVal.settleUserType == '4') {
            if (driverSwitch == '1') {
              sonVal.driverTagRates?.forEach((sonValdata) => {
                this.driverRate(lastVal.clearRate, e.target.value, sonValdata.rate);
              });
            }
          }
        });
        // }
      });
    });
  }

  baseAdd = () => {
    const newData = cloneDeep(this.state.baseDriverClearFactors);
    if (newData.length === 5) {
      message.info('最多5个');
      return;
    }
    newData.push({
      end: undefined,
      value: undefined,
    });
    this.setState({
      baseDriverClearFactors: newData,
    });
    this.changeRules(newData);
  }

  baseRemove = (index) => {
    this.setState({
      baseDriverClearFactors: this.props.form.getFieldValue('baseDriverClearFactors'),
    }, () => {
      const newData = cloneDeep(this.state.baseDriverClearFactors);
      newData.splice(index, 1);
      this.setState({ baseDriverClearFactors: newData });
      this.props.form.setFieldsValue({
        baseDriverClearFactors: newData,
      });
      this.changeRules(newData);
    });
  }

  driverRate = (clearRate, value, sonVal) => {
    const abc = Number(parseFloat(clearRate || 0) + parseFloat(value || 0) + parseFloat(sonVal || 0));
    if (abc > 100 || abc < 0) {
      message.config({
        duration: 3, // 显示时间为 3000 毫秒，即 3 秒钟
      });
      message.error('司机主体 的分润比例之和  必须 ≤ 100%');
    }
  }

  roteBlur = (index, i, e) => {
    const driverSwitch = this.props.form.getFieldValue('driverSwitch');
    const data = cloneDeep(this.state.ladderBaseRules);
    data?.forEach((dataValue, dataIndex) => {
      if (index == dataIndex) {
        dataValue?.mileageSplitDetails.forEach((sonVal, sonIndex) => {
          if (i == sonIndex) {
            sonVal.merchantSplitDetails.forEach((lastVal) => {
              if (lastVal.settleUserType == '4') {
                if (driverSwitch == '1') {
                  sonVal.driverClearFactors?.forEach((sonValdata) => {
                    this.driverRate(lastVal.clearRate, e.target.value, sonValdata.value);
                  });
                } else {
                  this.driverRate(lastVal.clearRate, e.target.value);
                }
              }
            });
          }
        });
      }
    });
  }

  onValue = (index, i, e) => {
    const driverSwitch = this.props.form.getFieldValue('driverSwitch');
    const data = cloneDeep(this.props.form.getFieldValue('ladderBaseRules'));
    data?.forEach((dataValue, dataIndex) => {
      if (index == dataIndex) {
        dataValue?.mileageSplitDetails.forEach((sonVal, sonIndex) => {
          if (i == sonIndex) {
            sonVal.merchantSplitDetails.forEach((lastVal) => {
              if (lastVal.settleUserType == '4') {
                if (driverSwitch == '1') {
                  sonVal.driverTagRates?.forEach((sonValdata) => {
                    this.driverRate(lastVal.clearRate, e.target.value, sonValdata.rate);
                  });
                }
              }
            });
          }
        });
      }
    });
  }

  addCopy = (index) => {
    const newData = cloneDeep(this.state.ladderBaseRules);
    if (newData?.length >= 10) {
      message.error('上限10个');
      return;
    }
    newData.push(newData[index]);
    this.setState({ ladderBaseRules: newData }, () => {
      this.changeRules(cloneDeep(this.state.baseDriverClearFactors));
    });
  }

  add = (index) => {
    if (index || index == 0) {
      const newData = cloneDeep(this.state.ladderBaseRules);
      if (newData[index]?.mileageSplitDetails?.length >= 10) {
        message.error('上限10个');
        return;
      }
      newData[index].mileageSplitDetails.push({
        end: undefined,
        merchantSplitDetails: [{
          clearRate: undefined, merchantNo: undefined, settlePeriod: undefined, settleUserType: undefined,
        }, {
          clearRate: undefined, merchantNo: undefined, settlePeriod: undefined, settleUserType: undefined,
        }],
        driverTagRates: [
          //   {
          //   driverTag: undefined,
          //   rate: undefined,
          // }
        ],
      });
      this.setState({ ladderBaseRules: newData }, () => {
        this.changeRules(cloneDeep(this.state.baseDriverClearFactors));
      });
    } else {
      const newData = cloneDeep(this.state.ladderBaseRules);
      if (newData?.length >= 10) {
        message.error('上限10个');
        return;
      }
      newData.push({
        end: undefined,
        mileageSplitDetails: [{
          end: undefined,
          merchantSplitDetails: [{
            clearRate: undefined, merchantNo: undefined, settlePeriod: undefined, settleUserType: undefined,
          }, {
            clearRate: undefined, merchantNo: undefined, settlePeriod: undefined, settleUserType: undefined,
          }],
          driverTagRates: [
            //   {
            //   driverTag: undefined,
            //   rate: undefined,
            // }
          ],
        }],
      });
      this.setState({ ladderBaseRules: newData }, () => {
        this.changeRules(cloneDeep(this.state.baseDriverClearFactors));
      });
    }
  }

  render() {
    const {
      baseRule, ladderBaseRules, splitModel, baseDriverClearFactors,
    } = this.state;
    const { getFieldDecorator, getFieldValue } = this.props.form;
    const {
      merchantTypeList, clearMerchantTypeList, disabled, driverTage,
    } = this.props;
    // console.log(111,new Date().getTime());
    return (
      <Card className="step2Top">
        <Form layout="inline">
          <FormItem label="分润模式" labelCol={{ style: { width: 200 } }}>
            {getFieldDecorator('splitModel', {
              initialValue: splitModel?.toString(),
              rules: [
                { required: true, message: '请选择' },
              ],
            })(<Radio.Group disabled={disabled}
              onChange={(e) => {
                if (e.target.value === '1') {
                  this.changeRules(cloneDeep(this.state.baseDriverClearFactors));
                }
              }}
            >
              {Object.keys(MODULE)?.map((key) => (<Radio key={key} value={key}>{MODULE[key]}</Radio>))}
            </Radio.Group>)}
          </FormItem>
          <br />
          <FormItem label="司机动态增减" labelCol={{ style: { width: 200 } }}>
            {getFieldDecorator('driverSwitch', {
              initialValue: baseDriverClearFactors?.length > 0 ? 1 : 2,
              rules: [
                { required: true, message: '请选择' },
              ],
            })(<Radio.Group
              disabled={disabled}
              onChange={() => {
                this.setState({
                  baseDriverClearFactors: [{
                    start: undefined,
                    end: undefined,
                    value: undefined,
                  }],
                }, () => {
                  this.changeRules(cloneDeep(this.state.baseDriverClearFactors));
                });
              }}
            >
              <Radio value={1}>开</Radio>
              <Radio value={2}>关</Radio>
            </Radio.Group>)}
          </FormItem>
          {getFieldValue('driverSwitch') === 1 && (
            <table style={{ marginLeft: 200 }} className="table-bordered">
              <thead>
                <th width="300px">调价系数%（≤X{'<'}）</th>
                <th width="200px">司机分润增减%</th>
                <th width="160px">调价阶梯</th>
              </thead>
              <tbody>
                {baseDriverClearFactors.map((item, index) => (
                  <tr key={index}>
                    <td>
                      {index === 0 && (
                        <FormItem>
                          {getFieldDecorator(`baseDriverClearFactors[${index}].start`, {
                            initialValue: item.start,
                            rules: [
                              { required: true, message: '请输入' },
                            ],
                          })(<InputNumber disabled={disabled} style={{ width: 80 }} min={0} max={999.99} precision={2} onChange={(v) => this.baseChange(v, index, 'start')} />)}
                          &nbsp;&nbsp;~&nbsp;&nbsp;
                        </FormItem>
                      )}
                      {index > 0 && <FormItem>{baseDriverClearFactors[index - 1].end}&nbsp;&nbsp;~&nbsp;&nbsp;</FormItem>}
                      <FormItem>
                        {getFieldDecorator(`baseDriverClearFactors[${index}].end`, {
                          initialValue: item.end,
                          rules: [
                            { required: true, message: '请输入' },
                          ],
                        })(<InputNumber disabled={disabled} style={{ width: 80 }} min={0} max={999.99} precision={2} onChange={(v) => this.baseChange(v, index, 'end')} />)}
                      </FormItem>
                    </td>
                    <td>
                      <FormItem>
                        {getFieldDecorator(`baseDriverClearFactors[${index}].value`, {
                          initialValue: item.value,
                          rules: [
                            { required: true, message: '请输入' },
                          ],
                        })(<InputNumber disabled={disabled} style={{ width: 80 }} precision={2} onBlur={(e) => { this.onlyValue(index, e); }} onChange={(v) => this.baseChange(v, index, 'value')} />)}
                      </FormItem>
                    </td>
                    <td>
                      {index == 0 ? (
                        <Button type="dashed"
                          shape="circle"
                          icon="plus"
                          disabled={disabled}
                          onClick={this.baseAdd}
                        />
                      ) : (
                        <Button type="dashed"
                          shape="circle"
                          icon="minus"
                          disabled={disabled}
                          onClick={() => this.baseRemove(index)}
                        />
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
          <div style={{
            height: 0, borderBottom: '#d5d5d5 dashed 1px', marginTop: 40, marginBottom: 40,
          }}
          />
          {getFieldValue('splitModel') == 0 && (
            <div className="liquid-rule-cell" style={{ marginLeft: 200, marginTop: 10 }}>
              {
                baseRule?.map((item, index) => (
                  <FormItem key={index} className="liquidation-formItem-advanceInputGroup">
                    {getFieldDecorator(`baseRule[${index}]`, {
                      initialValue: item,
                      rules: [
                        { required: true, message: '规则不能为空！' },
                        { validator: this.handleOnValidator(index) },
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
          )}
          {getFieldValue('splitModel') == 1 && (
            <table className="table-bordered" style={{ width: 1200 }}>
              <thead>
                <tr>
                  <th width={250}>时间阶梯（≤X{'<'}）</th>
                  <th width={200}>里程阶梯（≤X{'<'}）【km】</th>
                  <th width={1000}>分润规则</th>
                  <th width={600}>司机类型动态增减</th>
                  <th width={300}>司机分润增减(%)</th>
                  {!disabled
                    && (
                      <>
                        <th width={100}>里程阶梯</th>
                        <th width={100}>时间阶梯</th>
                      </>
                    )}
                </tr>
              </thead>
              <tbody>

                {ladderBaseRules?.map((item, index) => (
                  <tr>
                    <td><FormItem>{index == 0 ? '00:00' : (ladderBaseRules[index - 1].end ? moment(ladderBaseRules[index - 1].end).format('HH:mm') : '-')}&nbsp;&nbsp;~&nbsp;&nbsp;</FormItem>
                      {index == ladderBaseRules.length - 1 ? <FormItem>23:59</FormItem> : (
                        <FormItem>
                          {getFieldDecorator(`ladderBaseRules[${index}].end`, {
                            initialValue: item.end && moment(item.end),
                            rules: [
                              { required: true, message: '请输入' },
                              {
                                validator: (rule, value, callback) => {
                                  if (index > 0 && moment(value).isSameOrBefore(ladderBaseRules[index - 1].end)) {
                                    callback('右区间须大于左区间');
                                  }
                                  callback();
                                },
                              },
                            ],
                          })(<TimePicker format="HH:mm" disabled={disabled} onChange={(e) => this.onChangeForm(index, 'end', e)} />)}
                        </FormItem>
                      )}
                    </td>
                    <td colSpan={disabled ? 4 : 5} style={{ padding: 0, textAlign: 'left' }}>

                      {item.mileageSplitDetails?.map((e, i) => (
                        <div style={{
                          display: 'flex', borderTop: i == 0 ? 'none' : '1px solid #d9d9d9',
                        }}
                        >
                          <div style={{
                            width: 200, display: 'flex', alignItems: 'center', justifyContent: 'center',
                          }}
                          >
                            <FormItem>{i == 0 ? 0 : item.mileageSplitDetails[i - 1].end}&nbsp;&nbsp;~&nbsp;&nbsp;</FormItem>
                            <FormItem>
                              {getFieldDecorator(`ladderBaseRules[${index}].mileageSplitDetails[${i}].end`, {
                                initialValue: (e.end || e.end === 0) ? Number(e.end) : undefined,
                                rules: [
                                  { required: true, message: '请输入' },
                                  {
                                    validator: (rule, value, callback) => {
                                      if (i > 0 && value <= item.mileageSplitDetails[i - 1].end) {
                                        callback('右区间须大于左区间');
                                      }
                                      callback();
                                    },
                                  },
                                ],
                              })(<InputNumber min={0.01} disabled={disabled} max={999} precision={2} onChange={(e) => this.onChangeForm(index, 'end', e, i, 'mileageSplitDetails')} />)}
                            </FormItem>
                          </div>
                          <div style={{
                            width: 1000, display: 'flex', textAlign: 'center', paddingBottom: 8, borderLeft: '1px solid #d9d9d9', borderRight: '1px solid #d9d9d9', alignItems: 'center',
                          }}
                          >
                            <div className="liquid-rule-cell" style={{ marginTop: 10 }}>
                              {item.mileageSplitDetails?.[i]?.merchantSplitDetails?.map((j, k) => (
                                <FormItem key={k} className="liquidation-formItem-advanceInputGroup">
                                  {getFieldDecorator(`ladderBaseRules[${index}].mileageSplitDetails[${i}].merchantSplitDetails[${k}]`, {
                                    initialValue: j,
                                    rules: [
                                      { required: true, message: '规则不能为空！' },
                                      { validator: this.handleOnValidator(k) },
                                    ],
                                  })(<AdvanceInput
                                    disabled={disabled}
                                    index={k}
                                    data={this.props.form.getFieldValue('ladderBaseRules')}
                                    driverSwitch={this.props.form.getFieldValue('driverSwitch')}
                                    merchantTypeList={merchantTypeList}
                                    clearMerchantTypeList={clearMerchantTypeList}
                                    valueIndex={index}
                                    i={i}
                                    onChange={(e) => this.onChangeForm(index, 'merchantSplitDetails', e, i, 'mileageSplitDetails', k)}
                                  />)}
                                </FormItem>
                              ))}
                            </div>
                          </div>
                          <div style={{
                            width: 600, display: 'flex', paddingLeft: 30, paddingTop: 10, paddingBottom: 8, borderRight: '1px solid #d9d9d9', alignItems: 'left', justifyContent: 'center', flexDirection: 'column',
                          }}
                          >
                            {
                              (!ladderBaseRules[index].mileageSplitDetails[i].driverTagRates
                                || Array.isArray(ladderBaseRules[index].mileageSplitDetails[i].driverTagRates) && ladderBaseRules[index].mileageSplitDetails[i].driverTagRates.length === 0) && (
                                <Button type="dashed"
                                  shape="circle"
                                  icon="plus"
                                  disabled={disabled}
                                  onClick={() => this.addDriver(index, i)}
                                />
                              )
                            }

                            {
                              e.driverTagRates?.map((RateValue, RateIndex) => (
                                <div id="inputBumbet" key={RateIndex} style={{ lineHeight: '40px' }}>
                                  <div style={{ justifyContent: 'space-around', display: 'inline-block', textAlign: 'left' }}>
                                    <span>司机类型：</span>
                                    <FormItem>
                                      {getFieldDecorator(`ladderBaseRules[${index}].mileageSplitDetails[${i}].driverTagRates[${RateIndex}].driverTag`, {
                                        initialValue: RateValue?.driverTag,
                                        rules: [
                                          { required: true, message: '规则不能为空！' },
                                        ],
                                      })(
                                        // <SelectMax
                                        //   style={{ width: 200 }}
                                        //   placeholder="请选择"
                                        //   allowClear
                                        //   // disabled={getFieldValue(`ladderBaseRules[${index}].mileageSplitDetails[${i}].driverTagRates[${RateIndex}]`).map((item) => item.driverTag).includes()}
                                        //   showSearch
                                        //   optionFilterProp="children"
                                        //   afterRequest={(val) => val || []}
                                        //   url={{ url: '/pay-platform/common/dict/list/clearRuleDriverTag' }}
                                        // />,
                                        <Select allowClear disabled={disabled} style={{ width: 200 }}>
                                          {
                                            driverTage?.map((val) => (
                                              <Option
                                                disabled={
                                                  getFieldValue(
                                                    `ladderBaseRules[${index}].mileageSplitDetails[${i}].driverTagRates`,
                                                  ).map((item) => item.driverTag).includes(val.key)
                                                  || disabled
                                                }
                                                key={val.key}
                                                value={val.key}
                                              >{val.value}</Option>
                                            ))
                                          }
                                        </Select>,

                                      )}
                                    </FormItem>
                                    &nbsp;&nbsp;&nbsp;
                                    <span>分润增减：</span>
                                    <div className="toprate">
                                      <FormItem>
                                        {getFieldDecorator(`ladderBaseRules[${index}].mileageSplitDetails[${i}].driverTagRates[${RateIndex}].rate`, {
                                          initialValue: RateValue?.rate,
                                          rules: [
                                            { required: true, message: '需介于-20%到20%之间', pattern: /^-?(?:20(?:\.0+)?|[0-1]?\d(?:\.\d+)?)$/ },
                                          ],
                                        })(
                                          <InputNumber
                                            onBlur={(e) => { this.roteBlur(index, i, e); }}
                                            disabled={disabled}
                                            style={{ width: 80 }}
                                            precision={2}
                                          />,
                                        )}
                                      </FormItem>
                                      &nbsp;%
                                      &nbsp;&nbsp;
                                    </div>

                                    {RateIndex == 0 ? (
                                      <>
                                        <Button type="dashed"
                                          shape="circle"
                                          icon="plus"
                                          disabled={disabled}
                                          onClick={() => this.addDriver(index, i)}
                                        />
                                        <Button type="dashed"
                                          shape="circle"
                                          icon="minus"
                                          disabled={disabled}
                                          style={{ position: 'relative' }}
                                          onClick={() => this.removeDriver(index, i, RateIndex)}
                                        /></>
                                    ) : (
                                      <Button type="dashed"
                                        shape="circle"
                                        icon="minus"
                                        disabled={disabled}
                                        onClick={() => this.removeDriver(index, i, RateIndex)}
                                      />
                                    )}
                                  </div>
                                </div>
                              ))
                            }
                          </div>

                          <div style={{
                            width: 300, display: 'flex', paddingTop: 10, paddingBottom: 8, borderRight: '1px solid #d9d9d9', alignItems: 'center', justifyContent: 'center', flexDirection: 'column',
                          }}
                          >
                            {getFieldValue('driverSwitch') === 1 ? e.driverClearFactors?.map((facItem, facIndex) => (
                              <div key={facIndex} style={{ lineHeight: '40px' }}>
                                <div style={{ display: 'inline-block', width: '120px', textAlign: 'left' }}>
                                  <span>调价：</span>
                                  {facIndex === 0 && (
                                    <FormItem>
                                      {getFieldDecorator(`ladderBaseRules[${index}].mileageSplitDetails[${i}].driverClearFactors[${facIndex}].start`, {
                                        initialValue: facItem.start,
                                      })(
                                        <span>{facItem.start}</span>,
                                      )}
                                    </FormItem>
                                  )}
                                  {facIndex > 0 && <span>{e.driverClearFactors[facIndex - 1].end}</span>}
                                  -
                                  <FormItem>
                                    {getFieldDecorator(`ladderBaseRules[${index}].mileageSplitDetails[${i}].driverClearFactors[${facIndex}].end`, {
                                      initialValue: facItem.end,
                                    })(
                                      <span>{facItem.end}</span>,
                                    )}
                                  </FormItem>
                                </div>
                                <span>增减: </span>
                                <FormItem>
                                  {getFieldDecorator(`ladderBaseRules[${index}].mileageSplitDetails[${i}].driverClearFactors[${facIndex}].value`, {
                                    rules: [
                                      { required: true, message: '请输入' },
                                    ],
                                    initialValue: facItem.value,
                                  })(<InputNumber onBlur={(e) => { this.onValue(index, i, e); }} disabled={disabled} style={{ width: 80 }} precision={2} />)}
                                </FormItem>
                              </div>
                            )) : '/'}
                          </div>
                          {!disabled && (
                            <div style={{
                              width: 96, display: 'flex', alignItems: 'center', justifyContent: 'center',
                            }}
                            >
                              {i == 0 ? (
                                <Button type="dashed"
                                  shape="circle"
                                  icon="plus"
                                  disabled={disabled}
                                  onClick={() => this.add(index)}
                                />
                              ) : (
                                <Button type="dashed"
                                  shape="circle"
                                  icon="minus"
                                  disabled={disabled}
                                  onClick={() => this.remove(index, i)}
                                />
                              )}
                            </div>
                          )}
                        </div>
                      ))}
                    </td>
                    {!disabled && (
                      <td>
                        {index == 0 ? (
                          <Button type="dashed"
                            shape="circle"
                            icon="plus"
                            disabled={disabled}
                            onClick={() => this.addCopy(index)}
                          />
                        ) : (
                          <Button type="dashed"
                            shape="circle"
                            icon="minus"
                            disabled={disabled}
                            onClick={() => this.remove(index)}
                          />
                        )}
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
              {!disabled && (
                <tfoot>
                  <tr><td style={{ textAlign: 'left' }} colSpan={7}><Button type="primary" onClick={() => this.addCopy(0)}>添加时间阶梯</Button></td></tr>
                </tfoot>
              )}
            </table>
          )}
        </Form>
      </Card>
    );
  }
}
