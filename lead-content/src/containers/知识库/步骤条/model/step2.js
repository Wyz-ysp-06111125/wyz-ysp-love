/* eslint-disable react/no-access-state-in-setstate */
/* eslint-disable no-script-url */
/* eslint-disable max-len */
/* eslint-disable eqeqeq */
import React from 'react';
import {
  Divider, Form, Checkbox, Input, Select, Radio, Button, InputNumber, message,
} from 'antd';

import { cloneDeep } from 'lodash';
import { request } from '@cfe/caopc-center-common';
import {
  statisticType, statisticObject, indicatorDimension, indicatorValueType, indicatorValue,
} from '../config';
import './index.less';

const FormItem = Form.Item;
const { Option } = Select;
class Model extends React.Component {
  constructor(props) {
    super(props);
    this.tabIndex = 0;
    const step2Json = JSON.parse(window.sessionStorage.getItem('step2Json') || '[]');
    const step1Json = JSON.parse(window.sessionStorage.getItem('step1Json') || '[]');
    this.alldata(step2Json);
    this.state = {
      // 根据统计对象查询的内容下拉
      JsonOne: step1Json,
      carDrivedAll: [],
      // 个别得内容展示
      carDrived: [],
      // 布尔型内容展示
      orderDataDrived: [],
      // 根据indicatorClassify   等于一  来显示的下拉
      access: [],
      data: {
        accessModelList: step2Json?.accessModelList || [{
          index: 1,
          accessIndicator: undefined,
          accessValue: undefined,
        }],

        defaultModel: {
          defaultIndicator: undefined,
          defaultValue: undefined,
          defaultSplitRatio: undefined,
        },
        statisticModel: {
          indicatorDimension: undefined,
          indicatorValueType: undefined,
          statisticType: undefined,
          statisticObject: undefined,
          ruleDetail: step2Json?.statisticModel?.ruleDetail || {
            indicator: undefined, //  指标编号
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
                  ladderValue: undefined, //  阶梯值
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

          },
        },

      },
      step2Json,
    };
  }

  alldata = (step2Json) => {
    if (step2Json?.accessModelList?.length && step2Json?.defaultModel) {
      step2Json.salaryType = [1, 2];
    } else if (step2Json?.defaultModel) {
      step2Json.salaryType = [2];
    } else if (step2Json?.accessModelList?.length) {
      step2Json.salaryType = [1];
    }
    if (step2Json?.statisticModel?.indicatorValueType == '2') {
      // eslint-disable-next-line
      step2Json?.statisticModel?.ruleDetail?.ladders?.map((val, index) => {
        // values.statisticModel.ruleDetail.ladders[index].endPoint = val.startPoint;
        const flot = step2Json?.statisticModel?.ruleDetail?.ladders[index]?.startPoint;
        if (flot == true || flot == 'true') {
          step2Json.statisticModel.ruleDetail.ladders[index].startPoint = '1';
        } else {
          step2Json.statisticModel.ruleDetail.ladders[index].startPoint = '0';
        }
      });
    }
    if (step2Json?.statisticModel?.indicatorValueType == '4') {
      // eslint-disable-next-line
      step2Json?.statisticModel?.ruleDetail?.ladders?.map((val, index) => {
        // values.statisticModel.ruleDetail.ladders[index].endPoint = val.startPoint;
        // eslint-disable-next-line
        val?.nextNode?.ladders?.map((item, itemdx) => {
          step2Json.statisticModel.ruleDetail.ladders[index].nextNode.ladders[itemdx].endPoint = item.startPoint;
          const flot = step2Json?.statisticModel?.ruleDetail?.ladders[index]?.nextNode?.ladders[itemdx]?.startPoint;
          if (flot == true || flot == 'true') {
            step2Json.statisticModel.ruleDetail.ladders[index].nextNode.ladders[itemdx].startPoint = '1';
          } else {
            step2Json.statisticModel.ruleDetail.ladders[index].nextNode.ladders[itemdx].startPoint = '0';
          }
        });
      });
    }
  }

  componentDidMount() {
    const step2Json = JSON.parse(window.sessionStorage.getItem('step2Json') || '[]');
    const step1Json = JSON.parse(window.sessionStorage.getItem('step1Json') || '[]');
    // 统计对象的接口请求
    step2Json?.statisticModel?.statisticObject && this.stateObject(step2Json?.statisticModel?.statisticObject, step2Json?.statisticModel?.indicatorValueType);

    request({
      url: '/pay-boss/leaseSalary/base/findIndicatorList',
      method: 'post',
      data: {
        pageSize: 99999,
        pageNum: 1,
        needCustomIndicator: true,
        indicatorClassify: 1,
        carBelongType: step1Json.carBelongType,
      },
    }).then((data) => {
      const arrayData = [];
      // eslint-disable-next-line array-callback-return
      data?.list?.map((val, index) => {
        if (val.valueType == 1) {
          arrayData.push(data?.list[index]);
        }
      });

      this.setState({
        access: arrayData,
      });
    });
  }

  onEdit = (targetKey, action) => {
    this[action](targetKey);
  };

  addItem = () => {
    const data = cloneDeep(this.props.form.getFieldsValue(''));

    if (data?.statisticModel?.ruleDetail?.ladders[9]) {
      message.warning('最大10级阶梯');
      return;
    }
    let Point;
    // eslint-disable-next-line
    data.statisticModel.ruleDetail.ladders.map((val, ind) => {
      if (data?.statisticModel?.ruleDetail?.ladders.length - 1 == ind) {
        Point = val.endPoint;
      }
    });
    data.statisticModel.ruleDetail.ladders.push({
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
    if (data?.statisticModel?.ruleDetail?.ladders[9]) {
      message.warning('最大10级阶梯');
      return;
    }
    let Point;
    // eslint-disable-next-line
    data.statisticModel.ruleDetail.ladders.map((val, ind) => {
      if (data.statisticModel.ruleDetail.ladders.length - 1 == ind) {
        Point = val.endPoint;
      }
    });

    data.statisticModel.ruleDetail.ladders.push({
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
    if (data?.statisticModel?.ruleDetail?.ladders[9]) {
      message.warning('最大10级阶梯');
      return;
    }
    let Point;
    // eslint-disable-next-line
    data.statisticModel.ruleDetail.ladders.map((val, ind) => {
      if (data.statisticModel.ruleDetail.ladders.length - 1 == ind) {
        Point = val.endPoint;
      }
    });
    data.statisticModel.ruleDetail.ladders.push({
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
    if (data?.statisticModel?.ruleDetail?.ladders[index]?.nextNode?.ladders[9]) {
      message.warning('最大10级阶梯');
      return;
    }
    let Point;
    // eslint-disable-next-line
    data.statisticModel.ruleDetail.ladders.map((val, ind) => {
      if (index == ind) {
        // eslint-disable-next-line
        val.nextNode.ladders.map((item, itemIndex) => {
          if (data?.statisticModel?.ruleDetail?.ladders[ind]?.nextNode?.ladders?.length - 1 == itemIndex) {
            Point = item.endPoint;
          }
        });
      }
    });
    data.statisticModel.ruleDetail.ladders[index].nextNode.ladders.push({
      ladderLevel: undefined, // 阶梯级别
      startPoint: Point, // 阶梯起点
      endPoint: undefined, // 阶梯终点
      ladderValue: undefined, // 阶梯值
    });

    this.setState({ data });
  }

  removeItem = (idx) => {
    const data = cloneDeep(this.props.form.getFieldsValue());
    if (data.statisticModel.ruleDetail.ladders[idx - 1] && data.statisticModel.ruleDetail.ladders[idx + 1]) {
      data.statisticModel.ruleDetail.ladders[idx + 1].startPoint = data.statisticModel.ruleDetail.ladders[idx - 1].endPoint;
    }
    data.statisticModel.ruleDetail.ladders.splice(idx, 1);
    this.setState({
      data,
    }, () => {
      this.props.form.setFieldsValue({
        'statisticModel.ruleDetail.ladders': data.statisticModel.ruleDetail.ladders,
      });
    });
  }

  removeItemWalker = (idx) => {
    const data = cloneDeep(this.props.form.getFieldsValue());

    if (data.statisticModel.ruleDetail.ladders[idx - 1] && data.statisticModel.ruleDetail.ladders[idx + 1]) {
      data.statisticModel.ruleDetail.ladders[idx + 1].startPoint = data.statisticModel.ruleDetail.ladders[idx - 1].endPoint;
    }
    data.statisticModel.ruleDetail.ladders.splice(idx, 1);

    this.setState({
      data,
    }, () => {
      this.props.form.setFieldsValue({
        'statisticModel.ruleDetail.ladders': data.statisticModel.ruleDetail.ladders,
      });
    });
  };

  removeItemOne = (index) => {
    const data = cloneDeep(this.props.form.getFieldsValue());
    if (data.statisticModel.ruleDetail.ladders[index - 1] && data.statisticModel.ruleDetail.ladders[index + 1]) {
      data.statisticModel.ruleDetail.ladders[index + 1].startPoint = data.statisticModel.ruleDetail.ladders[index - 1].endPoint;
    }
    data.statisticModel.ruleDetail.ladders.splice(index, 1);
    this.setState({
      data,
    }, () => {
      this.props.form.setFieldsValue({
        'statisticModel.ruleDetail.ladders': data.statisticModel.ruleDetail.ladders,
      });
    });
  };

  removeTimeItem = (index, banIndex) => {
    const data = cloneDeep(this.props.form.getFieldsValue());
    if (data.statisticModel.ruleDetail.ladders[index].nextNode.ladders[banIndex - 1] && data.statisticModel.ruleDetail.ladders[index].nextNode.ladders[banIndex + 1]) {
      data.statisticModel.ruleDetail.ladders[index].nextNode.ladders[banIndex + 1].startPoint = data.statisticModel.ruleDetail.ladders[index].nextNode.ladders[banIndex - 1].endPoint;
    }
    data.statisticModel.ruleDetail.ladders[index].nextNode.ladders.splice(banIndex, 1);
    this.setState({
      data,
    }, () => {
      this.props.form.setFieldsValue({
        'statisticModel.ruleDetail.ladders': data.statisticModel.ruleDetail.ladders,
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
    const type = 'statisticModel.ruleDetail.indicator';
    const dataAllContent = this.props.form.getFieldsValue('');
    this.props.form.setFieldsValue({
      [type]: undefined,
    });
    dataAllContent.statisticModel?.ruleDetail?.ladders?.forEach((val, index) => {
      const ladderLevel = `statisticModel.ruleDetail.ladders[${index}].ladderLevel`;
      // const startPoint = `statisticModel.ruleDetail.ladders[${index}].startPoint`;
      // const endPoint = `statisticModel.ruleDetail.ladders[${index}].endPoint`;
      const ladderValue = `statisticModel.ruleDetail.ladders[${index}].ladderValue`;
      const indicator = `statisticModel.ruleDetail.ladders[${index}].nextNode.indicator`;
      this.props.form.setFieldsValue({
        [ladderLevel]: undefined,
        // [startPoint]: undefined,
        // [endPoint]: undefined,
        [ladderValue]: undefined,
        [indicator]: undefined,
      });
      val?.nextNode?.ladders?.forEach((key, keyIndex) => {
        const ladderLevel = `statisticModel.ruleDetail.ladders[${index}].nextNode.ladders[${keyIndex}].ladderLevel`;
        // const startPoint = `statisticModel.ruleDetail.ladders[${index}].nextNode.ladders[${keyIndex}].startPoint`;
        // const endPoint = `statisticModel.ruleDetail.ladders[${index}].nextNode.ladders[${keyIndex}].endPoint`;
        const ladderValue = `statisticModel.ruleDetail.ladders[${index}].nextNode.ladders[${keyIndex}].ladderValue`;
        this.props.form.setFieldsValue({
          [ladderLevel]: undefined,
          // [startPoint]: undefined,
          // [endPoint]: undefined,
          [ladderValue]: undefined,
        });
      });
    });
    data.statisticModel.ruleDetail = {
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
    this.queryDataType(value, carDrivedAll);
  };

  // 清空内容的方式

  Indicator = () => {
    this.props.form.setFieldsValue({
      'statisticModel.indicatorValueType': '',
    });
  }

  // 根据对象
  stateObject = (value, indicatorValueType) => {
    const { JsonOne } = this.state;
    request({
      url: '/pay-boss/leaseSalary/base/findIndicatorList',
      method: 'post',
      data: {
        indicatorClassify: value,
        needCustomIndicator: false,
        statusList: [1],
        carBelongType: JsonOne?.carBelongType,
      },
    }).then((data) => {
      this.setState({
        carDrivedAll: data.list,
      }, () => {
        const value = this.props.form.getFieldValue('statisticModel.indicatorValueType');
        if (indicatorValueType) {
          this.queryDataType(indicatorValueType, data.list);
        }
        if (value) {
          this.queryDataType(value, data.list);
        }
      });
    });
  }

  blurValue = (index) => {
    const data = cloneDeep(this.props.form.getFieldsValue(''));
    // eslint-disable-next-line
    data.statisticModel.ruleDetail.ladders.map((val, ind) => {
      if (index == ind) {
        const clIndex = index + 1;
        const values = `statisticModel.ruleDetail.ladders[${clIndex}].startPoint`;
        this.props.form.setFieldsValue({
          [values]: val.endPoint,
        });
      }
    });
  }

  blurValueIndex = (index, twoindex) => {
    const data = cloneDeep(this.props.form.getFieldsValue(''));
    // eslint-disable-next-line
    data.statisticModel.ruleDetail.ladders.map((val, ind) => {
      if (index == ind) {
        // eslint-disable-next-line
        val.nextNode.ladders.map((item, itemIndex) => {
          if (twoindex == itemIndex) {
            const clIndex = twoindex + 1;
            const values = `statisticModel.ruleDetail.ladders[${ind}].nextNode.ladders[${clIndex}].startPoint`;
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
      step2Json, data, carDrived, access, orderDataDrived,
    } = this.state;
    const { getFieldDecorator, getFieldValue } = this.props.form;
    const { type } = this.props;
    return (
      <div>
        <Form layout="inline">
          <Divider orientation="left">前置设置:</Divider>
          <div className="tip-order-top">
            <FormItem labelCol={{ style: { width: 120 } }} label=" " colon={false}>
              {getFieldDecorator('salaryType', {
                rules: [{
                  type: 'array',
                }],
                initialValue: step2Json?.salaryType?.map((val) => val),
              })(<Checkbox.Group disabled={type == 'detail'}>
                <div style={{ marginBottom: 10 }}>
                  <Checkbox key={1} value={1}>流水分润门槛</Checkbox>
                  {(getFieldValue('salaryType') || []).includes(1) && (
                    <table className="table-all">
                      <thead className="table-con">
                        <tr>
                          <th>参数</th>
                          <th>底线值</th>
                        </tr>
                      </thead>
                      <tbody>
                        {

                          data.accessModelList.map((val, index) => (
                            <tr key={index}>
                              <td>
                                <FormItem>
                                  {getFieldDecorator(`accessModelList[${index}].accessIndicator`, {
                                    rules: [{
                                      required: true, message: '请选择',
                                    }],
                                    initialValue: data?.accessModelList[index]?.accessIndicator?.toString(),
                                  })(
                                    <Select style={{ width: 150 }} placeholder="请选择" disabled={type === 'detail'} showSearch optionFilterProp="children">
                                      {access.map((key) => (<Option key={key.indicatorNo} value={key.indicatorNo}>{key.indicatorName}</Option>))}
                                    </Select>,
                                  )}
                                </FormItem>
                              </td>
                              <td>
                                <FormItem>
                                  {getFieldDecorator(`accessModelList[${index}].accessValue`, {
                                    rules: [{
                                      required: true, message: '请选择',
                                    }],
                                    initialValue: data?.accessModelList[index]?.accessValue,
                                  })(
                                    <InputNumber disabled={type == 'detail'} style={{ width: 120 }} min={0.00} precision={2} max={9999999.99} />,
                                  )}
                                </FormItem>
                              </td>
                            </tr>
                          ))
                        }

                      </tbody>
                    </table>
                  )}
                </div>
                <div style={{ marginBottom: 10 }}>
                  <Checkbox key={2} value={2}>流水分润兜底</Checkbox>
                  {(getFieldValue('salaryType') || []).includes(2) && (
                    <table className="table-all">
                      <thead className="table-con">
                        <tr>
                          <th>参数</th>
                          <th>目标值</th>
                          <th>兜底分润比例</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td>
                            <FormItem>
                              {getFieldDecorator('defaultModel.defaultIndicator', {
                                rules: [{
                                  required: true, message: '请选择',
                                }],
                                initialValue: step2Json?.defaultModel?.defaultIndicator?.toString(),
                              })(
                                <Select style={{ width: 150 }} placeholder="请选择" disabled={type === 'detail'} showSearch optionFilterProp="children">
                                  {access.map((key) => (<Option key={key.indicatorNo} value={key.indicatorNo}>{key.indicatorName}</Option>))}
                                </Select>,
                              )}
                            </FormItem>
                          </td>
                          <td>
                            <FormItem>
                              {getFieldDecorator('defaultModel.defaultValue', {
                                rules: [{
                                  required: true, message: '请选择',
                                }],
                                initialValue: step2Json?.defaultModel?.defaultValue,
                              })(
                                <InputNumber disabled={type == 'detail'} style={{ width: 120 }} min={0.00} precision={2} max={9999999.99} />,
                              )}
                            </FormItem>
                          </td>
                          <td>
                            <FormItem>
                              {getFieldDecorator('defaultModel.defaultSplitRatio', {
                                rules: [{
                                  required: true, message: '请选择',
                                }],
                                initialValue: step2Json?.defaultModel?.defaultSplitRatio,
                              })(
                                <InputNumber disabled={type == 'detail'} style={{ width: 120, margin: 0 }} min={0.00} precision={2} />,
                              )}
                              <span>%</span>
                            </FormItem>

                          </td>
                        </tr>
                      </tbody>
                    </table>
                  )}
                </div>
              </Checkbox.Group>)}
            </FormItem>

          </div>
          <Divider orientation="left">流水基数统计:</Divider>
          <FormItem labelCol={{ style: { width: 200 } }} label="流水统计方式:">
            {getFieldDecorator('statisticModel.statisticType', {
              rules: [{
                required: (getFieldValue('salaryType') || []).includes(2), message: '请输入',
              }],
              initialValue: step2Json?.statisticModel?.statisticType?.toString(),
            })(
              <Select showSearch optionFilterProp="children" style={{ width: 160 }} disabled={type == 'detail'}>
                {Object.keys(statisticType).map((key) => (
                  <Option key={key} value={key}>{statisticType[key]}</Option>
                ))}
              </Select>,
            )}
          </FormItem>
          {
            getFieldValue('statisticModel.statisticType') == '2' && (
              <>
                <div>
                  <FormItem labelCol={{ style: { width: 200 } }} label="统计对象:">
                    {getFieldDecorator('statisticModel.statisticObject', {
                      rules: [{
                        required: true, message: '请输入',
                      }],
                      initialValue: step2Json?.statisticModel?.statisticObject?.toString(),
                    })(
                      <Select showSearch optionFilterProp="children" style={{ width: 160 }} disabled={type == 'detail'} onChange={(e) => this.stateObject(e)}>
                        {Object.keys(statisticObject).map((key) => (
                          <Option key={key} value={key}>{statisticObject[key]}</Option>
                        ))}
                      </Select>,
                    )}
                  </FormItem>
                </div>
                <div>
                  <FormItem labelCol={{ style: { width: 200 } }} label="模型维度:">
                    {getFieldDecorator('statisticModel.indicatorDimension', {
                      rules: [{
                        required: true, message: '请输入',
                      }],
                      initialValue: step2Json?.statisticModel?.indicatorDimension?.toString() || '1',
                    })(
                      <Radio.Group disabled={type == 'detail'} onChange={this.Indicator}>
                        {Object.keys(indicatorDimension).map((key) => (
                          <Radio key={key} value={key}>{indicatorDimension[key]}</Radio>
                        ))}
                      </Radio.Group>,
                    )}
                  </FormItem>
                  {
                    getFieldValue('statisticModel.indicatorDimension') == 1 ? (
                      <FormItem labelCol={{ style: { width: 200 } }} label="数据类型:">
                        {getFieldDecorator('statisticModel.indicatorValueType', {
                          rules: [{
                            required: true, message: '请输入',
                          }],
                          initialValue: step2Json?.statisticModel?.indicatorValueType?.toString(),
                        })(
                          <Select showSearch optionFilterProp="children" disabled={type == 'detail'} style={{ width: 160 }} onChange={(e) => this.contextData(e)}>
                            {Object.keys(indicatorValueType).map((key) => (
                              <Option key={key} value={key}>{indicatorValueType[key]}</Option>
                            ))}
                          </Select>,
                        )}
                      </FormItem>
                    ) : (
                      <FormItem labelCol={{ style: { width: 200 } }} label="数据类型:">
                        {getFieldDecorator('statisticModel.indicatorValueType', {
                          rules: [{
                            required: true, message: '请输入',
                          }],
                          initialValue: step2Json?.statisticModel?.indicatorValueType?.toString(),
                        })(
                          <Select showSearch optionFilterProp="children" disabled={type == 'detail'} style={{ width: 160 }} onChange={(e) => this.contextData(e)}>
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
                    getFieldValue('statisticModel.indicatorValueType') == '2' && (
                      <table className="table-all" style={{ marginLeft: 119, marginTop: 20 }}>
                        <thead className="table-con">
                          <tr>
                            <th>参数1</th>
                            <th>区间</th>
                            <th>流水系数</th>
                          </tr>
                        </thead>
                        <tbody>
                          {data.statisticModel.ruleDetail.ladders.map((val, ind) => (
                            <tr key={ind}>
                              {ind == 0 && (
                                <td rowSpan={parseFloat(ind)}>
                                  <FormItem>
                                    {
                                      getFieldDecorator('statisticModel.ruleDetail.indicator', {
                                        rules: [{
                                          required: true, message: '请输入',
                                        }],
                                        initialValue: data?.statisticModel?.ruleDetail?.indicator?.toString(),
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
                                    getFieldDecorator(`statisticModel.ruleDetail.ladders[${ind}].startPoint`, {
                                      rules: [{
                                        required: true, message: '请输入',
                                      }],
                                      // initialValue: (data?.statisticModel?.ruleDetail?.ladders[ind]?.startPoint == "true" || data?.statisticModel?.ruleDetail?.ladders[ind]?.startPoint == true) ? true : false
                                      initialValue: ind == '1' ? '0' : '1',
                                    })(
                                      <Select style={{ width: 150 }} placeholder="请选择" disabled showSearch optionFilterProp="children">
                                        <Option key="true" value="1">是</Option>
                                        <Option key="false" value="0">否</Option>
                                      </Select>,
                                    )
                                  }
                                </FormItem>
                              </td>
                              <td>
                                <div className="flexbigin">
                                  <FormItem>
                                    {
                                      getFieldDecorator(`statisticModel.ruleDetail.ladders[${ind}].ladderValue`, {
                                        rules: [{
                                          required: true, message: '请输入', pattern: /^\d+(\.\d{0,2})?$/,
                                        }],
                                        initialValue: data?.statisticModel?.ruleDetail?.ladders[ind]?.ladderValue,
                                      })(
                                        <Input disabled={type == 'detail'} style={{ width: 120, margin: 0 }} placeholder="请输入" />,
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
                    getFieldValue('statisticModel.indicatorValueType') == '1' && (
                      <table border="1" className="table-all" style={{ marginLeft: 119, marginTop: 20 }} cellSpacing="0">
                        <thead className="table-con">
                          <tr>
                            <th width="280">参数1</th>
                            <th width="280">区间（≤X{'<'}）</th>
                            <th width="120">流水系数</th>
                            <th width="120">操作</th>
                          </tr>
                        </thead>
                        <tbody>
                          {
                            data.statisticModel.ruleDetail.ladders.map((val, idx) => (
                              <tr key={idx}>
                                {idx === 0 && (
                                  <td rowSpan={data.statisticModel.ruleDetail.ladders.length}>
                                    <FormItem>
                                      {getFieldDecorator('statisticModel.ruleDetail.indicator', {
                                        rules: [{
                                          required: true, message: '请选择',
                                        }],
                                        initialValue: data?.statisticModel?.ruleDetail?.indicator?.toString(),
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
                                      {getFieldDecorator(`statisticModel.ruleDetail.ladders[${idx}].startPoint`, {
                                        rules: [{
                                          required: true, message: '请输入',
                                        }],
                                        initialValue: data?.statisticModel?.ruleDetail?.ladders[idx]?.startPoint,
                                      })(
                                        <InputNumber disabled={type == 'detail' ? true : idx != 0} style={{ width: 120, margin: 0 }} min={0.0000} precision={4} />,
                                      )}
                                    </FormItem>
                                    <span className="treedataspan">~</span>
                                    <FormItem>
                                      {getFieldDecorator(`statisticModel.ruleDetail.ladders[${idx}].endPoint`, {
                                        rules: [{
                                          required: true, message: '请输入',

                                        }, {
                                          validator: (rule, value, callback) => {
                                            if (idx >= 0 && value <= Number(getFieldValue(`statisticModel.ruleDetail.ladders[${idx}].startPoint`))) {
                                              callback('右区间须大于左区间');
                                            }
                                            callback();
                                          },
                                        },
                                        ],
                                        initialValue: data?.statisticModel?.ruleDetail?.ladders[idx]?.endPoint,
                                      })(
                                        <InputNumber onBlur={() => this.blurValue(idx)} disabled={type == 'detail'} style={{ width: 120, margin: 0 }} min={0.000} precision={4} />,
                                      )}
                                    </FormItem>
                                  </div>
                                </td>
                                <td>
                                  <div className="flexbigin">
                                    <FormItem>
                                      {getFieldDecorator(`statisticModel.ruleDetail.ladders[${idx}].ladderValue`, {
                                        rules: [{
                                          required: true, message: '请输入', pattern: /^\d+(\.\d{0,2})?$/,
                                        }],
                                        initialValue: data?.statisticModel?.ruleDetail?.ladders[idx]?.ladderValue,
                                      })(
                                        <Input disabled={type == 'detail'} style={{ width: 120, margin: 0 }} placeholder="请输入" />,
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
                  {getFieldValue('statisticModel.indicatorValueType') == '4' && (
                    <table border="1" className="table-all" style={{ marginLeft: 119, marginTop: 20 }} cellSpacing="0">
                      <thead className="table-con">
                        <tr>
                          <th width="280">参数1</th>
                          <th width="280">区间1（≤X{'<'}）</th>
                          <th width="280">参数2</th>
                          <th width="280">区间2</th>
                          <th width="120">流水系数</th>
                          <th width="120">操作</th>
                        </tr>
                      </thead>
                      <tbody>
                        {data.statisticModel.ruleDetail.ladders.map((item, index) => (
                          <tr key={index}>
                            {index === 0 && (
                              <td rowSpan={data.statisticModel.ruleDetail.ladders.length}>
                                <FormItem>
                                  {getFieldDecorator('statisticModel.ruleDetail.indicator', {
                                    rules: [{
                                      required: true, message: '请选择',
                                    }],
                                    initialValue: data?.statisticModel?.ruleDetail?.indicator?.toString(),
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
                                  {getFieldDecorator(`statisticModel.ruleDetail.ladders[${index}].startPoint`, {
                                    rules: [{
                                      required: true, message: '请输入',
                                    }],
                                    initialValue: data.statisticModel.ruleDetail.ladders[index].startPoint,
                                  })(
                                    <InputNumber disabled={type == 'detail' ? true : index != 0} style={{ width: 120, margin: 0 }} min={0.0000} precision={4} />,
                                  )}
                                </FormItem>
                                <span className="treedataspan">~</span>
                                <FormItem>
                                  {getFieldDecorator(`statisticModel.ruleDetail.ladders[${index}].endPoint`, {
                                    rules: [{
                                      required: true, message: '请输入',
                                    }, {
                                      validator: (rule, value, callback) => {
                                        if (index >= 0 && value <= Number(getFieldValue(`statisticModel.ruleDetail.ladders[${index}].startPoint`))) {
                                          callback('右区间须大于左区间');
                                        }
                                        callback();
                                      },
                                    }],
                                    initialValue: data.statisticModel.ruleDetail.ladders[index].endPoint,
                                  })(
                                    <InputNumber onBlur={() => this.blurValue(index)} disabled={type == 'detail'} style={{ width: 120, margin: 0 }} min={0.0000} precision={4} />,
                                  )}
                                </FormItem>
                              </div>

                            </td>
                            <td>
                              <FormItem>
                                {getFieldDecorator(`statisticModel.ruleDetail.ladders[${index}].nextNode.indicator`, {
                                  rules: [{
                                    required: true, message: '请输入',
                                  }],
                                  initialValue: data?.statisticModel?.ruleDetail?.ladders[index]?.nextNode?.indicator?.toString(),
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
                                      {getFieldDecorator(`statisticModel.ruleDetail.ladders[${index}].nextNode.ladders[${idx}].startPoint`, {
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
                                        {getFieldDecorator(`statisticModel.ruleDetail.ladders[${index}].nextNode.ladders[${idx}].ladderValue`, {
                                          rules: [{
                                            required: true, message: '请输入', pattern: /^\d+(\.\d{0,2})?$/,
                                          }],
                                          initialValue: data?.statisticModel.ruleDetail?.ladders[index]?.nextNode?.ladders[idx]?.ladderValue,
                                        })(
                                          <Input disabled={type == 'detail'} style={{ width: 120, margin: 0 }} />,
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
                    getFieldValue('statisticModel.indicatorValueType') == '3' && (
                      <table border="1" className="table-all" style={{ marginLeft: 119, marginTop: 20 }} cellSpacing="0">
                        <thead className="table-con">
                          <tr>
                            <th width="280">参数1</th>
                            <th width="280">区间1（≤X{'<'}）</th>
                            <th width="280">参数2</th>
                            <th width="280">区间2（≤X{'<'}）</th>
                            <th width="120">流水系数</th>
                            <th width="120">操作</th>
                          </tr>
                        </thead>
                        <tbody>
                          {data.statisticModel.ruleDetail.ladders.map((item, index) => (

                            <tr key={index}>
                              {index === 0 && (
                                <td rowSpan={data.statisticModel.ruleDetail.ladders.length}>
                                  <FormItem>
                                    {getFieldDecorator('statisticModel.ruleDetail.indicator', {
                                      rules: [{
                                        required: true, message: '请选择',
                                      }],
                                      initialValue: data?.statisticModel?.ruleDetail?.indicator?.toString(),
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
                                    {getFieldDecorator(`statisticModel.ruleDetail.ladders[${index}].startPoint`, {
                                      rules: [{
                                        required: true, message: '请输入',
                                      }],
                                      initialValue: data?.statisticModel?.ruleDetail?.ladders[index]?.startPoint,
                                    })(
                                      <InputNumber disabled={type == 'detail' ? true : index != 0} style={{ width: 120, margin: 0 }} min={0.0000} precision={4} />,
                                    )}
                                  </FormItem>
                                  <span className="treedataspan">~</span>
                                  <FormItem>
                                    {getFieldDecorator(`statisticModel.ruleDetail.ladders[${index}].endPoint`, {
                                      rules: [{
                                        required: true, message: '请输入',
                                      }, {
                                        validator: (rule, value, callback) => {
                                          if (index >= 0 && value <= Number(getFieldValue(`statisticModel.ruleDetail.ladders[${index}].startPoint`))) {
                                            callback('右区间须大于左区间');
                                          }
                                          callback();
                                        },
                                      }],
                                      initialValue: data.statisticModel.ruleDetail.ladders[index].endPoint,
                                    })(
                                      <InputNumber onBlur={() => this.blurValue(index)} disabled={type == 'detail'} style={{ width: 120, margin: 0 }} min={0.0000} precision={4} />,
                                    )}
                                  </FormItem>
                                </div>

                              </td>
                              <td>
                                <FormItem>
                                  {getFieldDecorator(`statisticModel.ruleDetail.ladders[${index}].nextNode.indicator`, {
                                    rules: [{
                                      required: true, message: '请输入',
                                    }],
                                    initialValue: data?.statisticModel?.ruleDetail?.ladders[index]?.nextNode?.indicator?.toString(),
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
                                        {getFieldDecorator(`statisticModel.ruleDetail.ladders[${index}].nextNode.ladders[${banIndex}].startPoint`, {
                                          rules: [{
                                            required: true, message: '请输入',
                                          }],
                                          initialValue: data?.statisticModel?.ruleDetail?.ladders[index]?.nextNode?.ladders[banIndex]?.startPoint,
                                        })(
                                          <InputNumber disabled={type == 'detail' ? true : banIndex != 0} style={{ width: 120, margin: 0 }} min={0.0000} precision={4} />,
                                        )}
                                      </FormItem>
                                      <span className="treedataspan">~</span>
                                      <FormItem>
                                        {getFieldDecorator(`statisticModel.ruleDetail.ladders[${index}].nextNode.ladders[${banIndex}].endPoint`, {
                                          rules: [{
                                            required: true, message: '请输入',
                                          }, {
                                            validator: (rule, value, callback) => {
                                              if (banIndex >= 0 && value <= Number(getFieldValue(`statisticModel.ruleDetail.ladders[${index}].nextNode.ladders[${banIndex}].startPoint`))) {
                                                callback('右区间须大于左区间');
                                              }
                                              callback();
                                            },
                                          }],
                                          initialValue: data.statisticModel.ruleDetail.ladders[index].nextNode.ladders[banIndex].endPoint,
                                        })(
                                          <InputNumber onBlur={() => this.blurValueIndex(index, banIndex)} disabled={type == 'detail'} style={{ width: 120, margin: 0 }} min={0.0000} precision={4} />,
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
                                        {getFieldDecorator(`statisticModel.ruleDetail.ladders[${index}].nextNode.ladders[${banIndex}].ladderValue`, {
                                          rules: [{
                                            required: true, message: '请输入', pattern: /^\d+(\.\d{0,2})?$/,
                                          }],
                                          initialValue: data.statisticModel.ruleDetail.ladders[index].nextNode.ladders[banIndex].ladderValue,
                                        })(
                                          <Input disabled={type == 'detail'} style={{ width: 120, margin: 0 }} placeholder="请输入" />,
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

              </>
            )
          }

        </Form>
      </div>
    );
  }
}
export default Form.create()(Model);
