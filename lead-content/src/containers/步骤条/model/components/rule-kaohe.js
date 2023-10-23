/* eslint-disable no-nested-ternary */
/* eslint-disable react/no-did-update-set-state */
/* eslint-disable react/no-access-state-in-setstate */
/* eslint-disable jsx-a11y/control-has-associated-label */
/* eslint-disable max-len */
/* eslint-disable eqeqeq */
/* eslint-disable react/jsx-no-target-blank */
/* eslint-disable no-script-url */
import React from 'react';
import {
  Form, Input, Button, Select, Radio, InputNumber, message,
} from 'antd';
import './index.less';
import { cloneDeep } from 'lodash';
import { request } from '@cfe/caopc-center-common';
import {
  assessType, indicatorValueType, indicatorDimension, indicatorSpecial, indicatorValue,
} from '../../config';

const FormItem = Form.Item;
const { Option } = Select;

@Form.create()

export default class Rule extends React.Component {
  constructor(props) {
    super(props);

    if (props?.ruleDetail?.ladderRule?.indicatorValueType == '2') {
      //   eslint-disable-next-line
      props?.ruleDetail?.ladderRule?.ruleDetail?.ladders?.map((val, index) => {
        const float = props?.ruleDetail?.ladderRule?.ruleDetail?.ladders[index]?.startPoint;
        if (float == true || float == 'true') {
          props.ruleDetail.ladderRule.ruleDetail.ladders[index].startPoint = '1';
        } else {
          props.ruleDetail.ladderRule.ruleDetail.ladders[index].startPoint = '0';
        }
      });
    }
    if (props?.ruleDetail?.ladderRule?.indicatorValueType == '4') {
      //   eslint-disable-next-line
      props?.ruleDetail?.ladderRule?.ruleDetail?.ladders?.map((val, index) => {
        // eslint-disable-next-line
        val?.nextNode?.ladders.map((item, itemdx) => {
          const float = props?.ruleDetail?.ladderRule?.ruleDetail?.ladders[index]?.nextNode?.ladders[itemdx]?.startPoint;
          if (float == true || float == 'true') {
            props.ruleDetail.ladderRule.ruleDetail.ladders[index].nextNode.ladders[itemdx].startPoint = '1';
          } else {
            props.ruleDetail.ladderRule.ruleDetail.ladders[index].nextNode.ladders[itemdx].startPoint = '0';
          }
        });
      });
    }

    this.state = {
      accessDataAll: [],
      // 参数下拉内容
      accessData: [],
      // 数值加布尔
      orderDataDrived: [],
      jsonStep3: props?.ruleDetail,
      data: {
        index: 1, // 顺序
        assessName: undefined, // 考核名称
        assessWeight: undefined, // 考核权重
        assessType: undefined, // 模型类别,1-目标型，2-阶梯型

        // 目标型规则
        targetRule: props?.ruleDetail?.targetRule || {
          indicatorSpecial: undefined, // 指标特性(目标型专有字段),1-望大，2-望小
          indicator: undefined, // 参数指标编号
          baseVal: undefined, // 底线值
          targetVal: undefined, // 目标值
        },

        // 阶梯型规则
        ladderRule: props?.ruleDetail?.ladderRule || {
          indicatorDimension: undefined, // 模型维度，1-一维，2-二维
          indicatorValueType: undefined, // 数据类型,1-数值型，2-布尔型，3-数值型+数值型，4-数值型+布尔型
          ruleDetail: {
            indicator: undefined, // 指标编号
            ladders: [{
              ladderLevel: undefined, // 阶梯级别
              startPoint: undefined, // 阶梯起点
              endPoint: undefined, // 阶梯终点
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
      },
    };
  }

  componentDidMount() {
    const { ruleDetail, jsonOne } = this.props;

    request({
      url: '/pay-boss/leaseSalary/base/findIndicatorList',
      method: 'post',
      data: {
        pageSize: 99999,
        pageNum: 1,
        needCustomIndicator: true,
        indicatorClassify: 1,
        carBelongType: jsonOne?.carBelongType,
      },
    }).then((data) => {
      this.setState({
        accessDataAll: data?.list,
      }, () => {
        const value = this.props.form.getFieldValue('ladderRule.indicatorValueType');
        if (indicatorValueType) {
          this.queryDataType(indicatorValueType, data?.list);
        }
        if (ruleDetail?.assessType == '2') {
          this.queryDataType(ruleDetail?.ladderRule.indicatorValueType, data?.list);
        }
        if (value) {
          this.queryDataType(value, data?.list);
        }
      });
    });
  }

  addItem = () => {
    const data = cloneDeep(this.props.form.getFieldsValue(''));
    if (data?.ladderRule?.ruleDetail?.ladders[9]) {
      message.warning('最大10级阶梯');
      return;
    }
    let Point;
    // eslint-disable-next-line
    data.ladderRule.ruleDetail.ladders.map((val, ind) => {
      if (data?.ladderRule?.ruleDetail?.ladders.length - 1 == ind) {
        Point = val.endPoint;
      }
    });
    data.ladderRule.ruleDetail.ladders.push({
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
    if (data?.ladderRule?.ruleDetail?.ladders[9]) {
      message.warning('最大10级阶梯');
      return;
    }

    let Point;
    // eslint-disable-next-line
    data.ladderRule.ruleDetail.ladders.map((val, ind) => {
      if (data.ladderRule.ruleDetail.ladders.length - 1 == ind) {
        Point = val.endPoint;
      }
    });

    data.ladderRule.ruleDetail.ladders.push({
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
    if (data?.ladderRule?.ruleDetail?.ladders[9]) {
      message.warning('最大10级阶梯');
      return;
    }
    let Point;
    // eslint-disable-next-line
    data.ladderRule.ruleDetail.ladders.map((val, ind) => {
      if (data.ladderRule.ruleDetail.ladders.length - 1 == ind) {
        Point = val.endPoint;
      }
    });
    data.ladderRule.ruleDetail.ladders.push({
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
        }, {
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
    if (data?.ladderRule?.ruleDetail?.ladders[index]?.nextNode?.ladders[9]) {
      message.warning('最大10级阶梯');
      return;
    }
    let Point;
    // eslint-disable-next-line
    data.ladderRule.ruleDetail.ladders.map((val, ind) => {
      if (index == ind) {
        // eslint-disable-next-line
        val.nextNode.ladders.map((item, itemIndex) => {
          if (data?.ladderRule?.ruleDetail?.ladders[ind]?.nextNode?.ladders?.length - 1 == itemIndex) {
            Point = item.endPoint;
          }
        });
      }
    });
    data.ladderRule.ruleDetail.ladders[index].nextNode.ladders.push({
      ladderLevel: undefined, // 阶梯级别
      startPoint: Point, // 阶梯起点
      endPoint: undefined, // 阶梯终点
      ladderValue: undefined, // 阶梯值
    });

    this.setState({ data });
  }

  removeItem = (idx) => {
    const data = cloneDeep(this.props.form.getFieldsValue());
    if (data.ladderRule.ruleDetail.ladders[idx - 1] && data.ladderRule.ruleDetail.ladders[idx + 1]) {
      data.ladderRule.ruleDetail.ladders[idx + 1].startPoint = data.ladderRule.ruleDetail.ladders[idx - 1].endPoint;
    }
    data.ladderRule.ruleDetail.ladders.splice(idx, 1);

    this.setState({
      data,
    }, () => {
      this.props.form.setFieldsValue({
        'ladderRule.ruleDetail.ladders': data.ladderRule.ruleDetail.ladders,
      });
    });
  }

  removeItemWalker = (idx) => {
    const data = cloneDeep(this.props.form.getFieldsValue());
    if (data.ladderRule.ruleDetail.ladders[idx - 1] && data.ladderRule.ruleDetail.ladders[idx + 1]) {
      data.ladderRule.ruleDetail.ladders[idx + 1].startPoint = data.ladderRule.ruleDetail.ladders[idx - 1].endPoint;
    }
    data.ladderRule.ruleDetail.ladders.splice(idx, 1);

    this.setState({
      data,
    }, () => {
      this.props.form.setFieldsValue({
        'ladderRule.ruleDetail.ladders': data.ladderRule.ruleDetail.ladders,
      });
    });
  }

  removeItemOne = (index) => {
    const data = cloneDeep(this.props.form.getFieldsValue());
    if (data.ladderRule.ruleDetail.ladders[index - 1] && data.ladderRule.ruleDetail.ladders[index + 1]) {
      data.ladderRule.ruleDetail.ladders[index + 1].startPoint = data.ladderRule.ruleDetail.ladders[index - 1].endPoint;
    }
    data.ladderRule.ruleDetail.ladders.splice(index, 1);

    this.setState({
      data,
    }, () => {
      this.props.form.setFieldsValue({
        'ladderRule.ruleDetail.ladders': data.ladderRule.ruleDetail.ladders,
      });
    });
  }

  removeTimeItem = (index, banIndex) => {
    const data = cloneDeep(this.props.form.getFieldsValue());
    if (data.ladderRule.ruleDetail.ladders[index].nextNode.ladders[banIndex - 1] && data.ladderRule.ruleDetail.ladders[index].nextNode.ladders[banIndex + 1]) {
      data.ladderRule.ruleDetail.ladders[index].nextNode.ladders[banIndex + 1].startPoint = data.ladderRule.ruleDetail.ladders[index].nextNode.ladders[banIndex - 1].endPoint;
    }
    data.ladderRule.ruleDetail.ladders[index].nextNode.ladders.splice(banIndex, 1);
    this.setState({
      data,
    }, () => {
      this.props.form.setFieldsValue({
        'ladderRule.ruleDetail.ladders': data.ladderRule.ruleDetail.ladders,
      });
    });
  }

  Indicator = () => {
    this.props.form.setFieldsValue({
      'ladderRule.indicatorValueType': '',
    });
  }

  valueTypeCode = () => {
    this.props.form.setFieldsValue({
      'ladderRule.indicatorValueType': '',
    });
  }

  queryDataType = (value, accessDataAll) => {
    if (value) {
      const list = [];
      const floatlist = [];
      if (value == '1') {
        //   eslint-disable-next-line
        accessDataAll.map((val, index) => {
          if (val.valueType == 1) {
            list.push(accessDataAll[index]);
          }
        });
      }
      if (value == '2') {
        //   eslint-disable-next-line
        accessDataAll.map((val, index) => {
          if (val.valueType == 3) {
            list.push(accessDataAll[index]);
          }
        });
      }
      if (value == '3') {
        //   eslint-disable-next-line
        accessDataAll.map((val, index) => {
          if (val.valueType == 1) {
            list.push(accessDataAll[index]);
          }
        });
      }
      if (value == '4') {
        //   eslint-disable-next-line
        accessDataAll.map((val, index) => {
          if (val.valueType == 1) {
            list.push(accessDataAll[index]);
          }
          if (val.valueType == 3) {
            floatlist.push(accessDataAll[index]);
          }
        });
      }
      this.setState({
        accessData: list,
        orderDataDrived: floatlist,
      });
    }
  }

  indicaTorContent = (value) => {
    const { data, accessDataAll } = this.state;
    this.queryDataType(value, accessDataAll);
    const type = 'ladderRule.ruleDetail.indicator';
    const dataAllContent = this.props.form.getFieldsValue('');
    this.props.form.setFieldsValue({
      [type]: undefined,
    });
    //   eslint-disable-next-line
    dataAllContent.ladderRule?.ruleDetail?.ladders?.map((val, index) => {
      const ladderLevel = `ladderRule.ruleDetail.ladders[${index}].ladderLevel`;
      // const startPoint = `ladderRule.ruleDetail.ladders[${index}].startPoint`;
      const endPoint = `ladderRule.ruleDetail.ladders[${index}].endPoint`;
      const ladderValue = `ladderRule.ruleDetail.ladders[${index}].ladderValue`;
      const indicator = `ladderRule.ruleDetail.ladders[${index}].nextNode.indicator`;
      this.props.form.setFieldsValue({
        [ladderLevel]: undefined,
        // [startPoint]: undefined,
        [endPoint]: undefined,
        [ladderValue]: undefined,
        [indicator]: undefined,
      });
      //   eslint-disable-next-line
      val?.nextNode?.ladders?.map((key, keyIndex) => {
        const ladderLevel = `ladderRule.ruleDetail.ladders[${index}].nextNode.ladders[${keyIndex}].ladderLevel`;
        // const startPoint = `ladderRule.ruleDetail.ladders[${index}].nextNode.ladders[${keyIndex}].startPoint`;
        const endPoint = `ladderRule.ruleDetail.ladders[${index}].nextNode.ladders[${keyIndex}].endPoint`;
        const ladderValue = `ladderRule.ruleDetail.ladders[${index}].nextNode.ladders[${keyIndex}].ladderValue`;
        this.props.form.setFieldsValue({
          [ladderLevel]: undefined,
          // [startPoint]: undefined,
          [endPoint]: undefined,
          [ladderValue]: undefined,
        });
      });
    });
    data.ladderRule.ruleDetail = {
      indicator: undefined, // 指标编号
      ladders: [{
        ladderLevel: undefined, // 阶梯级别
        startPoint: undefined, // 阶梯起点
        endPoint: undefined, // 阶梯终点
        ladderValue: undefined, // 阶梯值
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
        ladderValue: undefined, // 阶梯值
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

  // 数据型区间将区间的第二个值  生成下一个对应的开始值
  blurValue = (index) => {
    const data = cloneDeep(this.props.form.getFieldsValue(''));
    //   eslint-disable-next-line
    data.ladderRule.ruleDetail.ladders.map((val, ind) => {
      if (index == ind) {
        const clIndex = index + 1;
        const values = `ladderRule.ruleDetail.ladders[${clIndex}].startPoint`;
        this.props.form.setFieldsValue({
          [values]: val.endPoint,
        });
      }
    });
  }

  blurValueIndex = (index, twoindex) => {
    const data = cloneDeep(this.props.form.getFieldsValue(''));
    // eslint-disable-next-line
    data.ladderRule.ruleDetail.ladders.map((val, ind) => {
      if (index == ind) {
        //   eslint-disable-next-line
        val.nextNode.ladders.map((item, itemIndex) => {
          if (twoindex == itemIndex) {
            const clIndex = twoindex + 1;
            const values = `ladderRule.ruleDetail.ladders[${ind}].nextNode.ladders[${clIndex}].startPoint`;
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
      data, jsonStep3, accessData, orderDataDrived, accessDataAll,
    } = this.state;
    const {
      type,
    } = this.props;
    const {
      getFieldDecorator, getFieldValue,
    } = this.props.form;
    return (
      <Form layout="inline" className="impact-amount-rule">
        <FormItem label="考核名称" labelCol={{ style: { width: 100 } }}>
          {getFieldDecorator('assessName', {
            rules: [{
              required: true, message: '请输入',
            }],
            initialValue: jsonStep3?.assessName,
          })(<Input style={{ width: 160 }} maxLength={15} disabled={type == 'detail'} />)}
        </FormItem>
        <br />
        <FormItem label="指标权重" labelCol={{ style: { width: 100 } }}>
          {getFieldDecorator('assessWeight', {
            rules: [{
              required: true, message: '请选择',
            }],
            initialValue: jsonStep3?.assessWeight,
          })(<InputNumber style={{ width: 160, margin: 0 }} disabled={type == 'detail'} min={0} />)}<span style={{ marginLeft: 10 }}>%</span>
        </FormItem>
        <br />
        <FormItem label="模型类别" labelCol={{ style: { width: 100 } }}>
          {getFieldDecorator('assessType', {
            rules: [{
              required: true, message: '请选择',
            }],
            initialValue: jsonStep3?.assessType?.toString(),
          })(
            <Select showSearch optionFilterProp="children" disabled={type == 'detail'} style={{ width: 160 }} onChange={this.valueTypeCode}>
              {Object.keys(assessType).map((key) => (
                <Option key={key} value={key}>{assessType[key]}</Option>
              ))}
            </Select>,
          )}
        </FormItem>
        {getFieldValue('assessType') == 1 && (
          <>
            <FormItem labelCol={{ style: { width: 200 } }} label="指标特征:">
              {getFieldDecorator('targetRule.indicatorSpecial', {
                rules: [{
                  required: true, message: '请输入',
                }],
                initialValue: data?.targetRule?.indicatorSpecial?.toString(),
              })(
                <Select showSearch optionFilterProp="children" disabled={type == 'detail'} style={{ width: 160 }}>
                  {Object.keys(indicatorSpecial).map((key) => (
                    <Option key={key} value={key}>{indicatorSpecial[key]}</Option>
                  ))}
                </Select>,
              )}
            </FormItem>
            <table className="table-all" style={{ marginLeft: 30, marginTop: 20 }}>
              <thead className="table-con">
                <tr>
                  <th>参数</th>
                  <th>底线值</th>
                  <th>目标值</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    <FormItem>
                      {
                        getFieldDecorator('targetRule.indicator', {
                          rules: [{
                            required: true, message: '请输入',
                          }],
                          initialValue: data?.targetRule?.indicator?.toString(),
                        })(
                          <Select style={{ width: 150 }} placeholder="请选择" disabled={type === 'detail'} showSearch optionFilterProp="children">
                            {accessDataAll.map((key) => (<Option key={key.indicatorNo} value={key.indicatorNo}>{key.indicatorName}</Option>))}
                          </Select>,
                        )
                      }
                    </FormItem>
                  </td>
                  <td>
                    <FormItem>
                      {
                        getFieldDecorator('targetRule.baseVal', {
                          rules: [{
                            required: true, message: '请输入',
                          }],
                          initialValue: data?.targetRule?.baseVal,
                        })(
                          <InputNumber disabled={type === 'detail'} style={{ width: 120, margin: 0 }} min={0.00} precision={2} />,
                        )
                      }
                    </FormItem>
                  </td>
                  <td>
                    <FormItem>
                      {
                        getFieldDecorator('targetRule.targetVal', {
                          rules: [{
                            required: true, message: '请输入',
                          }],
                          initialValue: data?.targetRule?.targetVal,
                        })(
                          <InputNumber disabled={type === 'detail'} style={{ width: 120, margin: 0 }} min={0.00} precision={2} />,
                        )
                      }
                    </FormItem>
                  </td>
                </tr>
              </tbody>
            </table>
          </>
        )}
        {
          getFieldValue('assessType') == 2 && (
            <>
              <FormItem labelCol={{ style: { width: 200 } }} label="模型维度:">
                {getFieldDecorator('ladderRule.indicatorDimension', {
                  rules: [{
                    required: true, message: '请输入',
                  }],
                  initialValue: data?.ladderRule?.indicatorDimension?.toString() || '1',
                })(
                  <Radio.Group disabled={type === 'detail'} onChange={this.Indicator}>
                    {Object.keys(indicatorDimension).map((key) => (
                      <Radio key={key} value={key}>{indicatorDimension[key]}</Radio>
                    ))}
                  </Radio.Group>,
                )}
              </FormItem>
              {
                getFieldValue('ladderRule.indicatorDimension') == '1' ? (
                  <FormItem labelCol={{ style: { width: 200 } }} label="数据类型:">
                    {getFieldDecorator('ladderRule.indicatorValueType', {
                      rules: [{
                        required: true, message: '请输入',
                      }],
                      initialValue: data?.ladderRule?.indicatorValueType?.toString(),
                    })(
                      <Select showSearch optionFilterProp="children" disabled={type === 'detail'} style={{ width: 160 }} onChange={(e) => this.indicaTorContent(e)}>
                        {Object.keys(indicatorValueType).map((key) => (
                          <Option key={key} value={key}>{indicatorValueType[key]}</Option>
                        ))}
                      </Select>,
                    )}
                  </FormItem>
                ) : (
                  <FormItem labelCol={{ style: { width: 200 } }} label="数据类型:">
                    {getFieldDecorator('ladderRule.indicatorValueType', {
                      rules: [{
                        required: true, message: '请输入',
                      }],
                      initialValue: data?.ladderRule?.indicatorValueType?.toString(),
                    })(
                      <Select showSearch optionFilterProp="children" disabled={type === 'detail'} style={{ width: 160 }} onChange={(e) => this.indicaTorContent(e)}>
                        {Object.keys(indicatorValue).map((key) => (
                          <Option key={key} value={key}>{indicatorValue[key]}</Option>
                        ))}
                      </Select>,
                    )}
                  </FormItem>
                )
              }
            </>
          )
        }
        <div>
          {
            getFieldValue('ladderRule.indicatorValueType') == '2' && (
              <table className="table-all" style={{ marginLeft: 30, marginTop: 20 }}>
                <thead className="table-con">
                  <tr>
                    <th>参数1</th>
                    <th>区间</th>
                    <th>考核系数</th>
                  </tr>
                </thead>
                <tbody>
                  {data.ladderRule.ruleDetail.ladders.map((val, ind) => (
                    <tr key={ind}>
                      {ind == 0 && (
                        <td rowSpan={parseFloat(ind)}>
                          <FormItem>
                            {
                              getFieldDecorator('ladderRule.ruleDetail.indicator', {
                                rules: [{
                                  required: true, message: '请输入',
                                }],
                                initialValue: data?.ladderRule?.ruleDetail?.indicator?.toString(),
                              })(
                                <Select style={{ width: 200 }} placeholder="请选择" disabled={type === 'detail'} showSearch optionFilterProp="children">
                                  {accessData.map((key) => (<Option key={key.indicatorNo} value={key.indicatorNo}>{key.indicatorName}</Option>))}
                                </Select>,
                              )
                            }
                          </FormItem>
                        </td>
                      )}

                      <td>
                        <FormItem>
                          {
                            getFieldDecorator(`ladderRule.ruleDetail.ladders[${ind}].startPoint`, {
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
                              getFieldDecorator(`ladderRule.ruleDetail.ladders[${ind}].ladderValue`, {
                                rules: [{
                                  required: true, message: '请输入', pattern: /^\d+(\.\d{0,2})?$/,
                                }],
                                initialValue: data?.ladderRule?.ruleDetail?.ladders[ind]?.ladderValue,
                              })(
                                <Input disabled={type === 'detail'} style={{ width: 120, margin: 0 }} placeholder="请输入" />,
                              )
                            }
                          </FormItem>
                          <span className="leftfoxid">%</span>
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
            getFieldValue('ladderRule.indicatorValueType') == '1' && (
              <table border="1" className="table-all" style={{ marginLeft: 30, marginTop: 20 }} cellSpacing="0">
                <thead className="table-con">
                  <tr>
                    <th width="280">参数1</th>
                    <th width="280">区间（≤X{'<'}）</th>
                    <th width="120">考核系数</th>
                    <th width="120">操作</th>
                  </tr>
                </thead>
                <tbody>
                  {
                    data.ladderRule.ruleDetail.ladders.map((val, idx) => (
                      <tr key={idx}>
                        {idx === 0 && (
                          <td rowSpan={data.ladderRule.ruleDetail.ladders.length}>
                            <FormItem>
                              {getFieldDecorator('ladderRule.ruleDetail.indicator', {
                                rules: [{
                                  required: true, message: '请选择',
                                }],
                                initialValue: data?.ladderRule?.ruleDetail?.indicator,
                              })(
                                <Select style={{ width: 200 }} placeholder="请选择" disabled={type === 'detail'} showSearch optionFilterProp="children">
                                  {accessData.map((key) => (<Option key={key.indicatorNo} value={key.indicatorNo}>{key.indicatorName}</Option>))}
                                </Select>,
                              )}
                            </FormItem>
                          </td>
                        )}
                        <td>
                          <div className="treedata">
                            <FormItem>
                              {getFieldDecorator(`ladderRule.ruleDetail.ladders[${idx}].startPoint`, {
                                rules: [{
                                  required: true, message: '请输入',
                                }],
                                initialValue: data?.ladderRule?.ruleDetail?.ladders[idx]?.startPoint,
                              })(
                                <InputNumber disabled={type == 'detail' ? true : idx != 0} style={{ width: 120, margin: 0 }} min={0.000} precision={4} />,
                              )}
                            </FormItem>
                            <span className="treedataspan">~</span>
                            <FormItem>
                              {getFieldDecorator(`ladderRule.ruleDetail.ladders[${idx}].endPoint`, {
                                rules: [{
                                  required: true, message: '请输入',
                                }, {
                                  validator: (rule, value, callback) => {
                                    if (idx >= 0 && value <= Number(getFieldValue(`ladderRule.ruleDetail.ladders[${idx}].startPoint`))) {
                                      callback('右区间须大于左区间');
                                    }
                                    callback();
                                  },
                                }],
                                initialValue: data?.ladderRule?.ruleDetail?.ladders[idx]?.endPoint,
                              })(
                                <InputNumber onBlur={() => this.blurValue(idx)} disabled={type === 'detail'} style={{ width: 120, margin: 0 }} min={0.0000} precision={4} />,
                              )}
                            </FormItem>
                          </div>
                        </td>
                        <td>
                          <div className="flexbigin">
                            <FormItem>
                              {getFieldDecorator(`ladderRule.ruleDetail.ladders[${idx}].ladderValue`, {
                                rules: [{
                                  required: true, message: '请输入', pattern: /^\d+(\.\d{0,2})?$/,
                                }],
                                initialValue: data?.ladderRule?.ruleDetail?.ladders[idx]?.ladderValue,
                              })(
                                <Input disabled={type === 'detail'} style={{ width: 120, margin: 0 }} placeholder="请输入" />,
                              )}
                            </FormItem>
                            <span className="leftfoxid">%</span>
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
          {getFieldValue('ladderRule.indicatorValueType') == '4' && (
            <table border="1" className="table-all" style={{ marginLeft: 30, marginTop: 20 }} cellSpacing="0">
              <thead className="table-con">
                <tr>
                  <th width="280">参数1</th>
                  <th width="280">区间1（≤X{'<'}）</th>
                  <th width="280">参数2</th>
                  <th width="280">区间2</th>
                  <th width="120">考核系数</th>
                  <th width="120">操作</th>
                </tr>
              </thead>
              <tbody>
                {data.ladderRule.ruleDetail.ladders.map((item, index) => (
                  <tr key={index}>
                    {index === 0 && (
                      <td rowSpan={data.ladderRule.ruleDetail.ladders.length}>
                        <FormItem>
                          {getFieldDecorator('ladderRule.ruleDetail.indicator', {
                            rules: [{
                              required: true, message: '请选择',
                            }],
                            initialValue: data?.ladderRule.ruleDetail?.indicator?.toString(),
                          })(
                            <Select style={{ width: 200 }} placeholder="请选择" disabled={type === 'detail'} showSearch optionFilterProp="children">
                              {accessData.map((key) => (<Option key={key.indicatorNo} value={key.indicatorNo}>{key.indicatorName}</Option>))}
                            </Select>,
                          )}
                        </FormItem>
                      </td>
                    )}
                    <td>
                      <div className="treedata">
                        <FormItem>
                          {getFieldDecorator(`ladderRule.ruleDetail.ladders[${index}].startPoint`, {
                            rules: [{
                              required: true, message: '请输入',
                            }],
                            initialValue: data?.ladderRule?.ruleDetail?.ladders[index]?.startPoint,
                          })(
                            <InputNumber disabled={type == 'detail' ? true : index != 0} style={{ width: 120, margin: 0 }} min={0.0000} precision={4} />,
                          )}
                        </FormItem>
                        <span className="treedataspan">~</span>
                        <FormItem>
                          {getFieldDecorator(`ladderRule.ruleDetail.ladders[${index}].endPoint`, {
                            rules: [{
                              required: true, message: '请输入',
                            }, {
                              validator: (rule, value, callback) => {
                                if (index >= 0 && value <= Number(getFieldValue(`ladderRule.ruleDetail.ladders[${index}].startPoint`))) {
                                  callback('右区间须大于左区间');
                                }
                                callback();
                              },
                            }],
                            initialValue: data?.ladderRule?.ruleDetail?.ladders[index]?.endPoint,
                          })(
                            <InputNumber onBlur={() => this.blurValue(index)} disabled={type === 'detail'} style={{ width: 120, margin: 0 }} min={0.0000} precision={4} />,
                          )}
                        </FormItem>
                      </div>

                    </td>
                    <td>
                      <FormItem>
                        {getFieldDecorator(`ladderRule.ruleDetail.ladders[${index}].nextNode.indicator`, {
                          rules: [{
                            required: true, message: '请输入',
                          }],
                          initialValue: data?.ladderRule?.ruleDetail?.ladders[index]?.nextNode?.indicator?.toString(),
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
                              {getFieldDecorator(`ladderRule.ruleDetail.ladders[${index}].nextNode.ladders[${idx}].startPoint`, {
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
                                {getFieldDecorator(`ladderRule.ruleDetail.ladders[${index}].nextNode.ladders[${idx}].ladderValue`, {
                                  rules: [{
                                    required: true, message: '请输入', pattern: /^\d+(\.\d{0,2})?$/,
                                  }],
                                  initialValue: data?.ladderRule?.ruleDetail?.ladders[index]?.nextNode?.ladders[idx]?.ladderValue,
                                })(
                                  <Input disabled={type === 'detail'} style={{ width: 120, margin: 0 }} />,
                                )}
                              </FormItem>
                              <span className="leftfoxid">%</span>
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
            getFieldValue('ladderRule.indicatorValueType') == '3' && (
              <table border="1" className="table-all" style={{ marginLeft: 30, marginTop: 20 }} cellSpacing="0">
                <thead className="table-con">
                  <tr>
                    <th width="280">参数1</th>
                    <th width="280">区间1（≤X{'<'}）</th>
                    <th width="280">参数2</th>
                    <th width="280">区间2（≤X{'<'}）</th>
                    <th width="120">考核系数</th>
                    <th width="120">操作</th>
                  </tr>
                </thead>
                <tbody>
                  {data.ladderRule.ruleDetail.ladders.map((item, index) => (

                    <tr key={index}>
                      {index === 0 && (
                        <td rowSpan={data.ladderRule.ruleDetail.ladders.length}>
                          <FormItem>
                            {getFieldDecorator('ladderRule.ruleDetail.indicator', {
                              rules: [{
                                required: true, message: '请选择',
                              }],
                              initialValue: data?.ladderRule?.ruleDetail?.indicator?.toString(),
                            })(
                              <Select style={{ width: 200 }} placeholder="请选择" disabled={type === 'detail'} showSearch optionFilterProp="children">
                                {accessData.map((key) => (<Option key={key.indicatorNo} value={key.indicatorNo}>{key.indicatorName}</Option>))}
                              </Select>,
                            )}
                          </FormItem>
                        </td>
                      )}
                      <td>
                        <div className="treedata">
                          <FormItem>
                            {getFieldDecorator(`ladderRule.ruleDetail.ladders[${index}].startPoint`, {
                              rules: [{
                                required: true, message: '请输入',
                              }],
                              initialValue: data?.ladderRule?.ruleDetail?.ladders[index]?.startPoint,
                            })(
                              <InputNumber disabled={type == 'detail' ? true : index != 0} style={{ width: 120, margin: 0 }} min={0.0000} precision={4} />,
                            )}
                          </FormItem>
                          <span className="treedataspan">~</span>
                          <FormItem>
                            {getFieldDecorator(`ladderRule.ruleDetail.ladders[${index}].endPoint`, {
                              rules: [{
                                required: true, message: '请输入',
                              }, {
                                validator: (rule, value, callback) => {
                                  if (index >= 0 && value <= Number(getFieldValue(`ladderRule.ruleDetail.ladders[${index}].startPoint`))) {
                                    callback('右区间须大于左区间');
                                  }
                                  callback();
                                },
                              }],
                              initialValue: data?.ladderRule?.ruleDetail?.ladders[index]?.endPoint,
                            })(
                              <InputNumber onBlur={() => this.blurValue(index)} disabled={type === 'detail'} style={{ width: 120, margin: 0 }} min={0.0000} precision={4} />,
                            )}
                          </FormItem>
                        </div>
                      </td>
                      <td>
                        <FormItem>
                          {getFieldDecorator(`ladderRule.ruleDetail.ladders[${index}].nextNode.indicator`, {
                            rules: [{
                              required: true, message: '请输入',
                            }],
                            initialValue: data?.ladderRule?.ruleDetail?.ladders[index]?.nextNode?.indicator?.toString(),
                          })(
                            <Select style={{ width: 200 }} placeholder="请选择" disabled={type === 'detail'} showSearch optionFilterProp="children">
                              {accessData.map((key) => (<Option key={key.indicatorNo} value={key.indicatorNo}>{key.indicatorName}</Option>))}
                            </Select>,
                          )}
                        </FormItem>
                      </td>
                      <td>
                        {
                          item.nextNode.ladders.map((banValue, banIndex) => (
                            <div className="treedata">
                              <FormItem>
                                {getFieldDecorator(`ladderRule.ruleDetail.ladders[${index}].nextNode.ladders[${banIndex}].startPoint`, {
                                  rules: [{
                                    required: true, message: '请输入',
                                  }],
                                  initialValue: data?.ladderRule?.ruleDetail?.ladders[index]?.nextNode?.ladders[banIndex]?.startPoint,
                                })(
                                  <InputNumber disabled={type == 'detail' ? true : banIndex != 0} style={{ width: 120, margin: 0 }} min={0.000} precision={4} />,
                                )}
                              </FormItem>
                              <span className="treedataspan">~</span>
                              <FormItem>
                                {getFieldDecorator(`ladderRule.ruleDetail.ladders[${index}].nextNode.ladders[${banIndex}].endPoint`, {
                                  rules: [{
                                    required: true, message: '请输入',
                                  }, {
                                    validator: (rule, value, callback) => {
                                      if (banIndex >= 0 && value <= Number(getFieldValue(`ladderRule.ruleDetail.ladders[${index}].nextNode.ladders[${banIndex}].startPoint`))) {
                                        callback('右区间须大于左区间');
                                      }
                                      callback();
                                    },
                                  }],
                                  initialValue: data?.ladderRule?.ruleDetail?.ladders[index]?.nextNode?.ladders[banIndex]?.endPoint,
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
                                {getFieldDecorator(`ladderRule.ruleDetail.ladders[${index}].nextNode.ladders[${banIndex}].ladderValue`, {
                                  rules: [{
                                    required: true, message: '请输入', pattern: /^\d+(\.\d{0,2})?$/,
                                  }],
                                  initialValue: data?.ladderRule?.ruleDetail?.ladders[index]?.nextNode?.ladders[banIndex]?.ladderValue,
                                })(
                                  <Input disabled={type === 'detail'} style={{ width: 120, margin: 0 }} placeholder="请输入" />,
                                )}
                              </FormItem>
                              <span className="leftfoxid">%</span>
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
