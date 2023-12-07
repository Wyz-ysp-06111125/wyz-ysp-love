/* eslint-disable react/no-did-update-set-state */
/* eslint-disable react/no-access-state-in-setstate */
/* eslint-disable jsx-a11y/control-has-associated-label */
/* eslint-disable max-len */
/* eslint-disable eqeqeq */
import React from 'react';
import {
  Form, Select, Radio, Button, InputNumber, Input, message,
} from 'antd';
import './index.less';
import { request } from '@cfe/caopc-center-common';
import { cloneDeep } from 'lodash';
import {
  statisticObjectAll, indicatorDimension, indicatorValueType, indicatorValue,
} from '../../config';

const FormItem = Form.Item;
const { Option } = Select;

@Form.create()

export default class Rule extends React.Component {
  constructor(props) {
    super(props);

    if (props?.ruleDetail?.indicatorValueType == '2') {
      //   eslint-disable-next-line
      props?.ruleDetail?.ruleDetail?.ladders?.map((val, index) => {
        const float = props?.ruleDetail?.ruleDetail?.ladders[index]?.startPoint;
        if (float == true || float == 'true') {
          props.ruleDetail.ruleDetail.ladders[index].startPoint = '1';
        } else {
          props.ruleDetail.ruleDetail.ladders[index].startPoint = '0';
        }
      });
    }
    if (props?.ruleDetail?.indicatorValueType == '4') {
      //   eslint-disable-next-line
      props?.ruleDetail?.ruleDetail?.ladders?.map((val, index) => {
        //   eslint-disable-next-line
        val?.nextNode?.ladders.map((item, itemdx) => {
          const float = props?.ruleDetail?.ruleDetail?.ladders[index]?.nextNode?.ladders[itemdx]?.startPoint;
          if (float == true || float == 'true') {
            props.ruleDetail.ruleDetail.ladders[index].nextNode.ladders[itemdx].startPoint = '1';
          } else {
            props.ruleDetail.ruleDetail.ladders[index].nextNode.ladders[itemdx].startPoint = '0';
          }
        });
      });
    }

    this.state = {
      carDrivedAll: [],
      carDrived: [],
      orderDataDrived: [],
      jsonOne: props?.jsonOne,
      step4Json: props?.ruleDetail,
      data: {
        name: undefined,
        indicatorDimension: undefined,
        indicatorValueType: undefined,
        statisticObject: undefined,
        ruleDetail: props?.ruleDetail?.ruleDetail || {
          indicator: undefined, // 指标编号
          ladders: [{
            ladderLevel: undefined, // 阶梯级别
            startPoint: undefined, // 阶梯起点
            endPoint: undefined, // 阶梯终点
            ladderValue: undefined,
            nextNode: {
              indicator: undefined, // 指标编号
              ladders: [{
                ladderLevel: undefined, // 阶梯级别
                startPoint: undefined, // 阶梯起点
                endPoint: undefined, // 阶梯终点
                ladderValue: undefined, // 阶梯值
              }],
            },
          }, {
            ladderLevel: undefined, // 阶梯级别
            startPoint: undefined, // 阶梯起点
            endPoint: undefined, // 阶梯终点
            ladderValue: undefined,
            nextNode: {
              indicator: undefined, // 指标编号
              ladders: [{
                ladderLevel: undefined, // 阶梯级别
                startPoint: undefined, // 阶梯起点
                endPoint: undefined, // 阶梯终点
                ladderValue: undefined, // 阶梯值
              }],
            },
          }],

        },
      },

    };
  }

  componentDidMount() {
    // 根据统计对象的值  去查找内容
    this.props?.ruleDetail?.statisticObject && this.stateObject(this.props?.ruleDetail?.statisticObject, this.props?.ruleDetail?.indicatorValueType);
  }

  addItem = () => {
    const data = cloneDeep(this.props.form.getFieldsValue(''));
    if (data?.ruleDetail?.ladders[9]) {
      message.warning('最大10级阶梯');
      return;
    }
    let Point;
    // eslint-disable-next-line
    data.ruleDetail.ladders.map((val, ind) => {
      if (data?.ruleDetail?.ladders.length - 1 == ind) {
        Point = val.endPoint;
      }
    });
    data.ruleDetail.ladders.push({
      ladderLevel: undefined, // 阶梯级别
      startPoint: Point, // 阶梯起点
      endPoint: undefined, // 阶梯终点
      ladderValue: undefined,
      nextNode: {
        indicator: undefined, // 指标编号
        ladders: [{
          ladderLevel: undefined, // 阶梯级别
          startPoint: undefined, // 阶梯起点
          endPoint: undefined, // 阶梯终点
          ladderValue: undefined, // 阶梯值
        }],
      },
    });
    this.setState({ data });
  }

  addItemWalker = () => {
    const data = cloneDeep(this.props.form.getFieldsValue(''));
    if (data?.ruleDetail?.ladders[9]) {
      message.warning('最大10级阶梯');
      return;
    }
    let Point;
    // eslint-disable-next-line
    data.ruleDetail.ladders.map((val, ind) => {
      if (data?.ruleDetail?.ladders.length - 1 == ind) {
        Point = val.endPoint;
      }
    });

    data.ruleDetail.ladders.push({
      ladderLevel: undefined, // 阶梯级别
      startPoint: Point, // 阶梯起点
      endPoint: undefined, // 阶梯终点
      ladderValue: undefined,
      nextNode: {
        indicator: undefined, // 指标编号
        ladders: [{
          ladderLevel: undefined, // 阶梯级别
          startPoint: undefined, // 阶梯起点
          endPoint: undefined, // 阶梯终点
          ladderValue: undefined, // 阶梯值
        }],
      },
    });
    this.setState({ data });
  }

  addItemOne = () => {
    const data = cloneDeep(this.props.form.getFieldsValue(''));
    if (data?.ruleDetail?.ladders[9]) {
      message.warning('最大10级阶梯');
      return;
    }

    let Point;
    // eslint-disable-next-line
    data.ruleDetail.ladders.map((val, ind) => {
      if (data.ruleDetail.ladders.length - 1 == ind) {
        Point = val.endPoint;
      }
    });
    data.ruleDetail.ladders.push({
      ladderLevel: undefined, // 阶梯级别
      startPoint: Point, // 阶梯起点
      endPoint: undefined, // 阶梯终点
      ladderValue: undefined,
      nextNode: {
        indicator: undefined, // 指标编号
        ladders: [{
          ladderLevel: undefined, // 阶梯级别
          startPoint: undefined, // 阶梯起点
          endPoint: undefined, // 阶梯终点
          ladderValue: undefined, // 阶梯值
        }],
      },
    });
    this.setState({ data });
  }

  addTimeItem = (index) => {
    const data = cloneDeep(this.props.form.getFieldsValue(''));
    if (data?.ruleDetail?.ladders[index]?.nextNode?.ladders[9]) {
      message.warning('最大10级阶梯');
      return;
    }
    let Point;
    // eslint-disable-next-line
    data.ruleDetail.ladders.map((val, ind) => {
      if (index == ind) {
        // eslint-disable-next-line
        val.nextNode.ladders.map((item, itemIndex) => {
          if (data?.ruleDetail?.ladders[ind]?.nextNode?.ladders?.length - 1 == itemIndex) {
            Point = item.endPoint;
          }
        });
      }
    });
    data.ruleDetail.ladders[index].nextNode.ladders.push({
      ladderLevel: undefined, // 阶梯级别
      startPoint: Point, // 阶梯起点
      endPoint: undefined, // 阶梯终点
      ladderValue: undefined, // 阶梯值
    });

    this.setState({ data });
  }

  removeItem = (idx) => {
    const data = cloneDeep(this.props.form.getFieldsValue());
    if (data.ruleDetail.ladders[idx - 1] && data.ruleDetail.ladders[idx + 1]) {
      data.ruleDetail.ladders[idx + 1].startPoint = data.ruleDetail.ladders[idx - 1].endPoint;
    }
    data.ruleDetail.ladders.splice(idx, 1);

    this.setState({
      data,
    }, () => {
      this.props.form.setFieldsValue({
        'ruleDetail.ladders': data.ruleDetail.ladders,
      });
    });
  }

  removeItemWalker = (idx) => {
    const data = cloneDeep(this.props.form.getFieldsValue());
    if (data.ruleDetail.ladders[idx - 1] && data.ruleDetail.ladders[idx + 1]) {
      data.ruleDetail.ladders[idx + 1].startPoint = data.ruleDetail.ladders[idx - 1].endPoint;
    }
    data.ruleDetail.ladders.splice(idx, 1);

    this.setState({
      data,
    }, () => {
      this.props.form.setFieldsValue({
        'ruleDetail.ladders': data.ruleDetail.ladders,
      });
    });
  }

  removeItemOne = (index) => {
    const data = cloneDeep(this.props.form.getFieldsValue());
    if (data.ruleDetail.ladders[index - 1] && data.ruleDetail.ladders[index + 1]) {
      data.ruleDetail.ladders[index + 1].startPoint = data.ruleDetail.ladders[index - 1].endPoint;
    }
    data.ruleDetail.ladders.splice(index, 1);

    this.setState({
      data,
    }, () => {
      this.props.form.setFieldsValue({
        'ruleDetail.ladders': data.ruleDetail.ladders,
      });
    });
  }

  removeTimeItem = (index, banIndex) => {
    const data = cloneDeep(this.props.form.getFieldsValue());
    if (data.ruleDetail.ladders[index].nextNode.ladders[banIndex - 1] && data.ruleDetail.ladders[index].nextNode.ladders[banIndex + 1]) {
      data.ruleDetail.ladders[index].nextNode.ladders[banIndex + 1].startPoint = data.ruleDetail.ladders[index].nextNode.ladders[banIndex - 1].endPoint;
    }
    data.ruleDetail.ladders[index].nextNode.ladders.splice(banIndex, 1);
    this.setState({
      data,
    }, () => {
      this.props.form.setFieldsValue({
        'ruleDetail.ladders': data.ruleDetail.ladders,
      });
    });
  }

  queryDataType = (value, carDrivedAll) => {
    if (value) {
      const list = [];
      const floatlist = [];
      if (value == '1') {
        //   eslint-disable-next-line
        carDrivedAll.map((val, index) => {
          if (val.valueType == 1) {
            list.push(carDrivedAll[index]);
          }
        });
      }
      if (value == '2') {
        //   eslint-disable-next-line
        carDrivedAll.map((val, index) => {
          if (val.valueType == 3) {
            list.push(carDrivedAll[index]);
          }
        });
      }
      if (value == '3') {
        //   eslint-disable-next-line
        carDrivedAll.map((val, index) => {
          if (val.valueType == 1) {
            list.push(carDrivedAll[index]);
          }
        });
      }
      if (value == '4') {
        //   eslint-disable-next-line
        carDrivedAll.map((val, index) => {
          if (val.valueType == 1) {
            list.push(carDrivedAll[index]);
          }
          if (val.valueType == 3) {
            floatlist.push(carDrivedAll[index]);
          }
        });
      }
      this.setState({
        carDrived: list,
        orderDataDrived: floatlist,
      });
    }
  }

  contextData = (value) => {
    const { data, carDrivedAll } = this.state;
    const type = 'ruleDetail.indicator';
    const dataAllContent = this.props.form.getFieldsValue('');
    this.props.form.setFieldsValue({
      [type]: undefined,
    });
    dataAllContent?.ruleDetail?.ladders?.forEach((val, index) => {
      const ladderLevel = `ruleDetail.ladders[${index}].ladderLevel`;
      // const startPoint = `ruleDetail.ladders[${index}].startPoint`;
      const endPoint = `ruleDetail.ladders[${index}].endPoint`;
      const ladderValue = `ruleDetail.ladders[${index}].ladderValue`;
      const indicator = `ruleDetail.ladders[${index}].nextNode.indicator`;
      this.props.form.setFieldsValue({
        [ladderLevel]: undefined,
        // [startPoint]: undefined,
        [endPoint]: undefined,
        [ladderValue]: undefined,
        [indicator]: undefined,
      });
      val?.nextNode?.ladders?.forEach((key, keyIndex) => {
        const ladderLevel = `ruleDetail.ladders[${index}].nextNode.ladders[${keyIndex}].ladderLevel`;
        // const startPoint = `ruleDetail.ladders[${index}].nextNode.ladders[${keyIndex}].startPoint`;
        const endPoint = `ruleDetail.ladders[${index}].nextNode.ladders[${keyIndex}].endPoint`;
        const ladderValue = `ruleDetail.ladders[${index}].nextNode.ladders[${keyIndex}].ladderValue`;
        this.props.form.setFieldsValue({
          [ladderLevel]: undefined,
          // [startPoint]: undefined,
          [endPoint]: undefined,
          [ladderValue]: undefined,
        });
      });
    });
    this.queryDataType(value, carDrivedAll);
    data.ruleDetail = {
      indicator: undefined, // 指标编号
      ladders: [{
        ladderLevel: undefined, // 阶梯级别
        startPoint: undefined, // 阶梯起点
        endPoint: undefined, // 阶梯终点
        ladderValue: undefined,
        nextNode: {
          indicator: undefined, // 指标编号
          ladders: [{
            ladderLevel: undefined, // 阶梯级别
            startPoint: undefined, // 阶梯起点
            endPoint: undefined, // 阶梯终点
            ladderValue: undefined, // 阶梯值
          }, {
            ladderLevel: undefined, // 阶梯级别
            startPoint: undefined, // 阶梯起点
            endPoint: undefined, // 阶梯终点
            ladderValue: undefined, // 阶梯值
          }],
        },
      }, {
        ladderLevel: undefined, // 阶梯级别
        startPoint: undefined, // 阶梯起点
        endPoint: undefined, // 阶梯终点
        ladderValue: undefined,
        nextNode: {
          indicator: undefined, // 指标编号
          ladders: [{
            ladderLevel: undefined, // 阶梯级别
            startPoint: undefined, // 阶梯起点
            endPoint: undefined, // 阶梯终点
            ladderValue: undefined, // 阶梯值
          }, {
            ladderLevel: undefined, // 阶梯级别
            startPoint: undefined, // 阶梯起点
            endPoint: undefined, // 阶梯终点
            ladderValue: undefined, // 阶梯值
          }],
        },
      }],

    };

    this.setState({
      data,
    });
  }

  // 清空内容的方式
  Indicator = () => {
    this.props.form.setFieldsValue({
      indicatorValueType: '',
    });
  }

  stateObject = (value, indicatorValueType) => {
    const { jsonOne } = this.state;
    request({
      url: '/pay-boss/leaseSalary/base/findIndicatorList',
      method: 'post',
      data: {
        indicatorClassify: value,
        needCustomIndicator: false,
        statusList: [1],
        carBelongType: jsonOne?.carBelongType,
      },
    }).then((data) => {
      this.setState({
        carDrivedAll: data.list,
      }, () => {
        const value = this.props.form.getFieldValue('indicatorValueType');
        if (value) {
          this.queryDataType(value, data.list);
        }
        if (indicatorValueType) {
          this.queryDataType(indicatorValueType, data.list);
        }
      });
    });
  }

  // 数据型区间将区间的第二个值  生成下一个对应的开始值
  blurValue = (index) => {
    const data = cloneDeep(this.props.form.getFieldsValue(''));
    //   eslint-disable-next-line
    data.ruleDetail.ladders.map((val, ind) => {
      if (index == ind) {
        const clIndex = index + 1;
        const values = `ruleDetail.ladders[${clIndex}].startPoint`;
        this.props.form.setFieldsValue({
          [values]: val.endPoint,
        });
      }
    });
  }

  blurValueIndex = (index, twoindex) => {
    const data = cloneDeep(this.props.form.getFieldsValue(''));
    //   eslint-disable-next-line
    data.ruleDetail.ladders.map((val, ind) => {
      if (index == ind) {
        //   eslint-disable-next-line
        val.nextNode.ladders.map((item, itemIndex) => {
          if (twoindex == itemIndex) {
            const clIndex = twoindex + 1;
            const values = `ruleDetail.ladders[${ind}].nextNode.ladders[${clIndex}].startPoint`;
            this.props.form.setFieldsValue({
              [values]: item.endPoint,
            });
          }
        });
      }
    });
  }

  render() {
    const {
      data, step4Json, carDrived, orderDataDrived,
    } = this.state;
    const {
      type,
    } = this.props;
    const { getFieldDecorator, getFieldValue } = this.props.form;
    return (
      <Form layout="inline">
        <div>
          <FormItem label="奖励名称:">
            {getFieldDecorator('name', {
              rules: [{
                required: true, message: '请输入',
              }],
              initialValue: step4Json?.name,
            })(
              <Input style={{ width: 160 }} maxLength={15} disabled={type == 'detail'} />,
            )}
          </FormItem>
        </div>
        <FormItem label="统计对象:">
          {getFieldDecorator('statisticObject', {
            rules: [{
              required: true, message: '请输入',
            }],
            initialValue: step4Json?.statisticObject?.toString(),
          })(
            <Select showSearch optionFilterProp="children" disabled={type === 'detail'} style={{ width: 160 }} onChange={(e) => this.stateObject(e)}>
              {Object.keys(statisticObjectAll).map((key) => (
                <Option key={key} value={key}>{statisticObjectAll[key]}</Option>
              ))}
            </Select>,
          )}
        </FormItem>
        <div>
          <FormItem label="模型维度:">
            {getFieldDecorator('indicatorDimension', {
              rules: [{
                required: true, message: '请输入',
              }],
              initialValue: step4Json?.indicatorDimension?.toString() || '1',
            })(
              <Radio.Group disabled={type === 'detail'} onChange={this.Indicator}>
                {Object.keys(indicatorDimension).map((key) => (
                  <Radio key={key} value={key}>{indicatorDimension[key]}</Radio>
                ))}
              </Radio.Group>,
            )}
          </FormItem>
          {
            getFieldValue('indicatorDimension') == 1 ? (
              <FormItem labelCol={{ style: { width: 130 } }} label="数据类型:">
                {getFieldDecorator('indicatorValueType', {
                  rules: [{
                    required: true, message: '请输入',
                  }],
                  initialValue: step4Json?.indicatorValueType?.toString(),
                })(
                  <Select showSearch optionFilterProp="children" disabled={type === 'detail'} style={{ width: 160 }} onChange={(e) => this.contextData(e)}>
                    {Object.keys(indicatorValueType).map((key) => (
                      <Option key={key} value={key}>{indicatorValueType[key]}</Option>
                    ))}
                  </Select>,
                )}
              </FormItem>
            ) : (
              <FormItem labelCol={{ style: { width: 130 } }} label="数据类型:">
                {getFieldDecorator('indicatorValueType', {
                  rules: [{
                    required: true, message: '请输入',
                  }],
                  initialValue: step4Json?.indicatorValueType?.toString(),
                })(
                  <Select showSearch optionFilterProp="children" disabled={type === 'detail'} style={{ width: 160 }} onChange={(e) => this.contextData(e)}>
                    {Object.keys(indicatorValue).map((key) => (
                      <Option key={key} value={key}>{indicatorValue[key]}</Option>
                    ))}
                  </Select>,
                )}
              </FormItem>
            )
          }
        </div>
        <div>
          {
            getFieldValue('indicatorValueType') == '2' && (
              <table className="table-all" style={{ marginLeft: 20, marginTop: 20 }}>
                <thead className="table-con">
                  <tr>
                    <th>参数1</th>
                    <th>区间</th>
                    <th>奖励金额</th>
                  </tr>
                </thead>
                <tbody>
                  {data.ruleDetail.ladders.map((val, ind) => (
                    <tr key={ind}>
                      {ind == 0 && (
                        <td rowSpan={parseFloat(ind)}>
                          <FormItem>
                            {
                              getFieldDecorator('ruleDetail.indicator', {
                                rules: [{
                                  required: true, message: '请输入',
                                }],
                                initialValue: data?.ruleDetail?.indicator?.toString(),
                              })(
                                <Select style={{ width: 200 }} placeholder="请选择" disabled={type === 'detail'} showSearch optionFilterProp="children">
                                  {carDrived.map((key) => (<Option key={key.indicatorNo} value={key.indicatorNo}>{key.indicatorName}</Option>))}
                                </Select>,
                              )
                            }
                          </FormItem>
                        </td>
                      )}

                      <td>
                        <FormItem>
                          {
                            getFieldDecorator(`ruleDetail.ladders[${ind}].startPoint`, {
                              rules: [{
                                required: true, message: '请输入',
                              }],
                              initialValue: ind == '1' ? '0' : '1',
                            })(
                              <Select style={{ width: 150 }} placeholder="请选择" disabled showSearch optionFilterProp="children">
                                <Option value="1">是</Option>
                                <Option value="0">否</Option>
                              </Select>,
                            )
                          }
                        </FormItem>
                      </td>
                      <td>
                        <div className="flexbigin">
                          <FormItem>
                            {
                              getFieldDecorator(`ruleDetail.ladders[${ind}].ladderValue`, {
                                rules: [{
                                  required: true, message: '请输入', pattern: /^\d+(\.\d{0,2})?$/,
                                }],
                                initialValue: data?.ruleDetail?.ladders[ind]?.ladderValue,
                              })(
                                <Input disabled={type === 'detail'} style={{ width: 120, margin: 0 }} placeholder="请输入" />,
                              )
                            }
                          </FormItem>
                          {/* <span className='leftfoxid'>%</span> */}
                        </div>
                      </td>

                    </tr>
                  ))}
                </tbody>
              </table>
            )
          }
        </div>
        <div>
          {
            getFieldValue('indicatorValueType') == '1' && (
              <table border="1" className="table-all" style={{ marginLeft: 20, marginTop: 20 }} cellSpacing="0">
                <thead className="table-con">
                  <tr>
                    <th width="280">参数1</th>
                    <th width="280">区间（≤X{'<'}）</th>
                    <th width="120">奖励金额</th>
                    <th width="120">操作</th>
                  </tr>
                </thead>
                <tbody>
                  {
                    data.ruleDetail.ladders.map((val, idx) => (
                      <tr key={idx}>
                        {idx === 0 && (
                          <td rowSpan={data.ruleDetail.ladders.length}>
                            <FormItem>
                              {getFieldDecorator('ruleDetail.indicator', {
                                rules: [{
                                  required: true, message: '请选择',
                                }],
                                initialValue: data?.ruleDetail?.indicator,
                              })(
                                <Select style={{ width: 200 }} placeholder="请选择" disabled={type === 'detail'} showSearch optionFilterProp="children">
                                  {carDrived.map((key) => (<Option key={key.indicatorNo} value={key.indicatorNo}>{key.indicatorName}</Option>))}
                                </Select>,
                              )}
                            </FormItem>
                          </td>
                        )}
                        <td>
                          <div className="treedata">
                            <FormItem>
                              {getFieldDecorator(`ruleDetail.ladders[${idx}].startPoint`, {
                                rules: [{
                                  required: true, message: '请输入',
                                }],
                                initialValue: data?.ruleDetail?.ladders[idx]?.startPoint,
                              })(
                                <InputNumber disabled={type == 'detail' ? true : idx != 0} style={{ width: 120, margin: 0 }} min={0.0000} precision={4} />,
                              )}
                            </FormItem>
                            <span className="treedataspan">~</span>
                            <FormItem>
                              {getFieldDecorator(`ruleDetail.ladders[${idx}].endPoint`, {
                                rules: [{
                                  required: true, message: '请输入',
                                }, {
                                  validator: (rule, value, callback) => {
                                    if (idx >= 0 && value <= Number(getFieldValue(`ruleDetail.ladders[${idx}].startPoint`))) {
                                      callback('右区间须大于左区间');
                                    }
                                    callback();
                                  },
                                }],
                                initialValue: data?.ruleDetail?.ladders[idx]?.endPoint,
                              })(
                                <InputNumber onBlur={() => this.blurValue(idx)} disabled={type === 'detail'} style={{ width: 120, margin: 0 }} min={0.0000} precision={4} />,
                              )}
                            </FormItem>
                          </div>
                        </td>
                        <td>
                          <div className="flexbigin">
                            <FormItem>
                              {getFieldDecorator(`ruleDetail.ladders[${idx}].ladderValue`, {
                                rules: [{
                                  required: true, message: '请输入', pattern: /^\d+(\.\d{0,2})?$/,
                                }],
                                initialValue: data?.ruleDetail?.ladders[idx]?.ladderValue,
                              })(
                                <Input disabled={type === 'detail'} style={{ width: 120, margin: 0 }} placeholder="请输入" />,
                              )}
                            </FormItem>
                            {/* <span className='leftfoxid'>%</span> */}
                          </div>

                        </td>

                        <td>
                          {idx === 0 ? (
                            <Button shape="circle"
                              icon="plus"
                              onClick={() => this.addItem()}
                              disabled={type === 'detail'}
                            />
                          ) : (
                            <Button
                              shape="circle"
                              icon="minus"
                              onClick={() => this.removeItem(idx)}
                              disabled={type === 'detail'}
                            />
                          )}
                        </td>
                      </tr>
                    ))
                  }
                </tbody>
              </table>
            )
          }
        </div>
        <div className="statisticModel-table">
          {getFieldValue('indicatorValueType') == '4' && (
            <table border="1" className="table-all" style={{ marginLeft: 20, marginTop: 20 }} cellSpacing="0">
              <thead className="table-con">
                <tr>
                  <th width="280">参数1</th>
                  <th width="280">区间1（≤X{'<'}）</th>
                  <th width="280">参数2</th>
                  <th width="280">区间2</th>
                  <th width="120">奖励金额</th>
                  <th width="120">操作</th>
                </tr>
              </thead>
              <tbody>
                {data.ruleDetail.ladders.map((item, index) => (
                  <tr key={index}>
                    {index === 0 && (
                      <td rowSpan={data.ruleDetail.ladders.length}>
                        <FormItem>
                          {getFieldDecorator('ruleDetail.indicator', {
                            rules: [{
                              required: true, message: '请选择',
                            }],
                            initialValue: data?.ruleDetail?.indicator?.toString(),
                          })(
                            <Select style={{ width: 200 }} placeholder="请选择" disabled={type === 'detail'} showSearch optionFilterProp="children">
                              {carDrived.map((key) => (<Option key={key.indicatorNo} value={key.indicatorNo}>{key.indicatorName}</Option>))}
                            </Select>,
                          )}
                        </FormItem>
                      </td>
                    )}
                    <td>
                      <div className="treedata">
                        <FormItem>
                          {getFieldDecorator(`ruleDetail.ladders[${index}].startPoint`, {
                            rules: [{
                              required: true, message: '请输入',
                            }],
                            initialValue: data?.ruleDetail?.ladders[index]?.startPoint,
                          })(
                            <InputNumber disabled={type == 'detail' ? true : index != 0} style={{ width: 120, margin: 0 }} min={0.0000} precision={4} />,
                          )}
                        </FormItem>
                        <span className="treedataspan">~</span>
                        <FormItem>
                          {getFieldDecorator(`ruleDetail.ladders[${index}].endPoint`, {
                            rules: [{
                              required: true, message: '请输入',
                            }, {
                              validator: (rule, value, callback) => {
                                if (index >= 0 && value <= Number(getFieldValue(`ruleDetail.ladders[${index}].startPoint`))) {
                                  callback('右区间须大于左区间');
                                }
                                callback();
                              },
                            }],
                            initialValue: data?.ruleDetail?.ladders[index]?.endPoint,
                          })(
                            <InputNumber onBlur={() => this.blurValue(index)} disabled={type === 'detail'} style={{ width: 120, margin: 0 }} min={0.0000} precision={4} />,
                          )}
                        </FormItem>
                      </div>
                    </td>
                    <td>
                      <FormItem>
                        {getFieldDecorator(`ruleDetail.ladders[${index}].nextNode.indicator`, {
                          rules: [{
                            required: true, message: '请输入',
                          }],
                          initialValue: data?.ruleDetail?.ladders[index]?.nextNode?.indicator?.toString(),
                        })(
                          <Select style={{ width: 200 }} placeholder="请选择" disabled={type === 'detail'} showSearch optionFilterProp="children">
                            {orderDataDrived.map((key) => (<Option key={key.indicatorNo} value={key.indicatorNo}>{key.indicatorName}</Option>))}
                          </Select>,
                        )}
                      </FormItem>
                    </td>
                    <td>
                      {
                        item.nextNode.ladders.map((val, idx) => (
                          <>
                            <FormItem>
                              {getFieldDecorator(`ruleDetail.ladders[${index}].nextNode.ladders[${idx}].startPoint`, {
                                rules: [{
                                  required: true, message: '请输入',
                                }],
                                initialValue: idx == '1' ? '0' : '1',
                              })(
                                <Select style={{ width: 150 }} placeholder="请选择" disabled showSearch optionFilterProp="children">
                                  <Option value="1">是</Option>
                                  <Option value="0">否</Option>
                                </Select>,
                              )}
                            </FormItem>
                          </>
                        ))
                      }
                    </td>
                    <td>
                      {
                        item.nextNode.ladders.map((val, idx) => (
                          <>
                            <div className="flexbigin">
                              <FormItem>
                                {getFieldDecorator(`ruleDetail.ladders[${index}].nextNode.ladders[${idx}].ladderValue`, {
                                  rules: [{
                                    required: true, message: '请输入', pattern: /^\d+(\.\d{0,2})?$/,
                                  }],
                                  initialValue: data?.ruleDetail?.ladders[index]?.nextNode?.ladders[idx]?.ladderValue,
                                })(
                                  <Input disabled={type === 'detail'} style={{ width: 120, margin: 0 }} />,
                                )}
                              </FormItem>
                            </div>
                          </>
                        ))
                      }
                    </td>

                    <td>
                      {index === 0 ? (
                        <Button shape="circle"
                          icon="plus"
                          onClick={() => this.addItemOne()}
                          disabled={type === 'detail'}
                        />
                      ) : (
                        <Button
                          shape="circle"
                          icon="minus"
                          onClick={() => this.removeItemOne(index)}
                          disabled={type === 'detail'}
                        />
                      )}
                    </td>
                  </tr>

                ))}
              </tbody>
            </table>
          )}

        </div>
        <div className="statisticModel-table">
          {
            getFieldValue('indicatorValueType') == '3' && (
              <table border="1" className="table-all" style={{ marginLeft: 20, marginTop: 20 }} cellSpacing="0">
                <thead className="table-con">
                  <tr>
                    <th width="280">参数1</th>
                    <th width="280">区间1（≤X{'<'}）</th>
                    <th width="280">参数2</th>
                    <th width="280">区间2（≤X{'<'}）</th>
                    <th width="120">奖励金额</th>
                    <th width="120">操作</th>
                  </tr>
                </thead>
                <tbody>
                  {data.ruleDetail.ladders.map((item, index) => (

                    <tr key={index}>
                      {index === 0 && (
                        <td rowSpan={data?.ruleDetail?.ladders?.length}>
                          <FormItem>
                            {getFieldDecorator('ruleDetail.indicator', {
                              rules: [{
                                required: true, message: '请选择',
                              }],
                              initialValue: data?.ruleDetail?.indicator?.toString(),
                            })(
                              <Select style={{ width: 200 }} placeholder="请选择" disabled={type === 'detail'} showSearch optionFilterProp="children">
                                {carDrived.map((key) => (<Option key={key.indicatorNo} value={key.indicatorNo}>{key.indicatorName}</Option>))}
                              </Select>,
                            )}
                          </FormItem>
                        </td>
                      )}
                      <td>
                        <div className="treedata">
                          <FormItem>
                            {getFieldDecorator(`ruleDetail.ladders[${index}].startPoint`, {
                              rules: [{
                                required: true, message: '请输入',
                              }],
                              initialValue: data?.ruleDetail?.ladders[index]?.startPoint,
                            })(
                              <InputNumber disabled={type == 'detail' ? true : index != 0} style={{ width: 120, margin: 0 }} min={0.0000} precision={4} />,
                            )}
                          </FormItem>
                          <span className="treedataspan">~</span>
                          <FormItem>
                            {getFieldDecorator(`ruleDetail.ladders[${index}].endPoint`, {
                              rules: [{
                                required: true, message: '请输入',
                              }, {
                                validator: (rule, value, callback) => {
                                  if (index >= 0 && value <= Number(getFieldValue(`ruleDetail.ladders[${index}].startPoint`))) {
                                    callback('右区间须大于左区间');
                                  }
                                  callback();
                                },
                              }],
                              initialValue: data?.ruleDetail?.ladders[index]?.endPoint,
                            })(
                              <InputNumber onBlur={() => this.blurValue(index)} disabled={type === 'detail'} style={{ width: 120, margin: 0 }} min={0.0000} precision={4} />,
                            )}
                          </FormItem>
                        </div>

                      </td>
                      <td>
                        <FormItem>
                          {getFieldDecorator(`ruleDetail.ladders[${index}].nextNode.indicator`, {
                            rules: [{
                              required: true, message: '请输入',
                            }],
                            initialValue: data?.ruleDetail?.ladders[index]?.nextNode?.indicator?.toString(),
                          })(
                            <Select style={{ width: 200 }} placeholder="请选择" disabled={type === 'detail'} showSearch optionFilterProp="children">
                              {carDrived.map((key) => (<Option key={key.indicatorNo} value={key.indicatorNo}>{key.indicatorName}</Option>))}
                            </Select>,
                          )}
                        </FormItem>
                      </td>
                      <td>
                        {
                          item.nextNode.ladders.map((banValue, banIndex) => (
                            <div className="treedata">
                              <FormItem>
                                {getFieldDecorator(`ruleDetail.ladders[${index}].nextNode.ladders[${banIndex}].startPoint`, {
                                  rules: [{
                                    required: true, message: '请输入',
                                  }],
                                  initialValue: data?.ruleDetail?.ladders[index]?.nextNode?.ladders[banIndex]?.startPoint,
                                })(
                                  <InputNumber disabled={type == 'detail' ? true : banIndex != 0} style={{ width: 120, margin: 0 }} min={0.000} precision={4} />,
                                )}
                              </FormItem>
                              <span className="treedataspan">~</span>
                              <FormItem>
                                {getFieldDecorator(`ruleDetail.ladders[${index}].nextNode.ladders[${banIndex}].endPoint`, {
                                  rules: [{
                                    required: true, message: '请输入',
                                  }, {
                                    validator: (rule, value, callback) => {
                                      if (banIndex >= 0 && value <= Number(getFieldValue(`ruleDetail.ladders[${index}].nextNode.ladders[${banIndex}].startPoint`))) {
                                        callback('右区间须大于左区间');
                                      }
                                      callback();
                                    },
                                  }],
                                  initialValue: data?.ruleDetail?.ladders[index]?.nextNode?.ladders[banIndex]?.endPoint,
                                })(
                                  <InputNumber onBlur={() => this.blurValueIndex(index, banIndex)} disabled={type === 'detail'} style={{ width: 120, margin: 0 }} min={0.0000} precision={4} />,
                                )}
                              </FormItem>
                              {banIndex === 0 ? (
                                <Button
                                  shape="circle"
                                  icon="plus"
                                  onClick={() => this.addTimeItem(index)}
                                  disabled={type === 'detail'}
                                />
                              ) : (
                                <Button
                                  shape="circle"
                                  icon="minus"
                                  onClick={() => this.removeTimeItem(index, banIndex)}
                                  disabled={type === 'detail'}
                                />
                              )}
                            </div>
                          ))
                        }
                      </td>
                      <td>
                        {
                          item.nextNode.ladders.map((banValue, banIndex) => (
                            <div className="flexbigin">
                              <FormItem>
                                {getFieldDecorator(`ruleDetail.ladders[${index}].nextNode.ladders[${banIndex}].ladderValue`, {
                                  rules: [{
                                    required: true, message: '请输入', pattern: /^\d+(\.\d{0,2})?$/,
                                  }],
                                  initialValue: data?.ruleDetail?.ladders[index]?.nextNode?.ladders[banIndex]?.ladderValue,
                                })(
                                  <Input disabled={type === 'detail'} style={{ width: 120, margin: 0 }} placeholder="请输入" />,
                                )}
                              </FormItem>
                              {/* <span className='leftfoxid'>%</span> */}
                            </div>
                          ))
                        }
                      </td>

                      <td>
                        {index === 0 ? (
                          <Button shape="circle"
                            icon="plus"
                            onClick={() => this.addItemWalker()}
                            disabled={type === 'detail'}
                          />
                        ) : (
                          <Button
                            shape="circle"
                            icon="minus"
                            onClick={() => this.removeItemWalker(index)}
                            disabled={type === 'detail'}
                          />
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )
          }

        </div>
      </Form>
    );
  }
}
