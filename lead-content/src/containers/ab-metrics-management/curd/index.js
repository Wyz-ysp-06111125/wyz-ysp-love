/* eslint-disable no-case-declarations */
/* eslint-disable no-nested-ternary */
/* eslint-disable no-console */
/* eslint-disable no-unused-vars */
/* eslint-disable max-len */
/* eslint-disable react/jsx-no-bind */
/* eslint-disable eqeqeq */
import React from 'react';
import {
  Button,
  Form,
  Input,
  Radio,
  Icon,
  Select,
  Collapse,
  message,
} from 'antd';

import { cloneDeep } from 'lodash';
import './index.less';
import { request } from '@cfe/caopc-center-common';
import { ABCD } from '../config';

const { Panel } = Collapse;
const FormItem = Form.Item;
const Option = Select;
const { TextArea } = Input;

const formItemLayout = {
  labelCol: {
    xs: { span: 2 },
    sm: { span: 3 },
  },
};
class curd extends React.Component {
  constructor(prop) {
    super(prop);
    this.state = {
      // 关联表名称
      listData: [],
      // 表字段
      tableCols: [],
      // 业务类型
      bizTypeList: [],
      dataIndex: [],
      // detail: undefined,
      data: {
        metricsName: undefined,
        relatedTable: undefined,
        metricsConfigType: undefined,
        bizTypeDTOS: [],
        metricsConfigContent: [
          {
            basicMetricName: undefined, // 指标集A
            basicMetricDesc: undefined, // 指标集A-描述
            basicMetricType: undefined,
            calcExpression: undefined,
            valueType: undefined,
            basicMetricCalcs: [
              {
                colName: undefined,
                calcType: undefined,
              },
            ],
          },
        ],
      },
    };
    document.title = 'AB指标管理';
  }

  componentDidMount() {
    const { type, id } = this.props.match.params;
    if (type == 'add') {
      this.onCollSpse();
    }
    request({
      url: '/reportMetrics/relatedTables',
      method: 'get',
    }).then((res) => {
      this.setState({
        listData: res.listData,
      });
    });
    request({
      url: '/lab/config/bizType',
      method: 'get',
      code: 200,
      messageRedefine: 'message',
    }).then((res) => {
      this.setState({
        bizTypeList: res,
      });
    });
    if (type !== 'add') {
      request({
        url: '/reportMetrics/list',
        method: 'get',
      }).then((res) => {
        const content = [];
        //   eslint-disable-next-line
        res?.list?.map((val, index) => {
          if (val.id == id) {
            content.push(res?.list[index]);
          }
        });
        if (content.length == 1) {
          const dataDetail = content[0];
          this.onlistBookContent(dataDetail.relatedTable);
          const detail = {};
          detail.metricsName = dataDetail.metricsName;
          detail.relatedTable = dataDetail.relatedTable;
          detail.metricsConfigType = dataDetail.metricsConfigType;
          detail.bizTypeDTOS = dataDetail.bizTypeDTOS;
          if (dataDetail.metricsConfigType == 'basic') {
            detail.metricsConfigContent = JSON.parse(
              dataDetail?.metricsConfigContent
            );
          } else {
            detail.marke = dataDetail?.metricsConfigContent;
          }
          this.setState(
            {
              // detail,
              data: detail,
            },
            () => {
              if (dataDetail.metricsConfigType == 'basic') {
                this.onCollSpse();
              }
            }
          );
        }
      });
    }
  }

  add = () => {
    const keyIndex = this.state.dataIndex;
    const data = cloneDeep(this.props.form.getFieldsValue(''));
    if (!data.metricsConfigContent) {
      data.metricsConfigContent = [];
    }
    data.metricsConfigContent.push({
      basicMetricName: undefined, // 指标集A
      basicMetricDesc: undefined, // 指标集A-描述
      basicMetricType: undefined,
      valueType: undefined,
      basicMetricCalcs: [
        {
          colName: undefined,
          calcType: undefined,
        },
      ],
    });
    this.setState(
      {
        data,
      },
      () => {
        this.onPanel([...keyIndex, data.metricsConfigContent.length - 1]);
      }
    );
  };

  onCopy = (index) => {
    const keyIndex = this.state.dataIndex;
    const data = cloneDeep(this.props.form.getFieldsValue(''));
    // console.log(data);
    data.metricsConfigContent.push(data.metricsConfigContent[index]);
    // console.log(data);
    this.setState(
      {
        data,
      },
      () => {
        this.props.form.setFieldsValue({
          metricsConfigContent: data.metricsConfigContent,
        });
        this.onPanel([...keyIndex, data?.metricsConfigContent?.length - 1]);
      }
    );
  };

  addSon = (index) => {
    const data = cloneDeep(this.props.form.getFieldsValue(''));
    data.metricsConfigContent[index].basicMetricCalcs.push({
      colName: undefined,
      calcType: undefined,
    });
    this.setState({
      data,
    });
  };

  remove = (index) => {
    const keyIndex = this?.state?.dataIndex?.filter(
      (item) => item !== index - 1
    );
    const data = cloneDeep(this.props.form.getFieldsValue(''));
    data.metricsConfigContent.splice(index, 1);
    this.setState(
      {
        data,
      },
      () => {
        this.props.form.setFieldsValue({
          metricsConfigContent: data.metricsConfigContent,
        });
        data.metricsConfigContent.length !== 1 &&
          index !== 1 &&
          this.onPanel([...keyIndex]);
      }
    );
  };

  submit = () => {
    const { form } = this.props;
    const { id, type } = this.props.match.params;
    const { bizTypeList } = this.state;
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        const bizType = [];
        bizTypeList.forEach((val) => {
          values.bizTypeDTOS.forEach((item) => {
            if (val.value == item) {
              bizType.push({
                desc: val.desc,
                value: val.value,
              });
            }
          });
        });
        if (values.metricsConfigType == 'basic') {
          values.metricsConfigContent = JSON.stringify(
            values.metricsConfigContent
          );
        } else {
          values.metricsConfigContent = values.marke;
          delete values.marke;
        }
        values.bizTypeDTOS = bizType;

        // metricsConfigType
        let url = '/reportMetrics/create';
        if (type == 'edit') {
          url = '/reportMetrics/edit';
          values.id = id;
        }
        request({
          url,
          method: 'post',
          data: values,
        }).then((res) => {
          message.success('操作成功');
          setTimeout(() => {
            window.close();
          }, 1000);
        });
      }
    });
  };

  onPanel = (e) => {
    this.setState({
      dataIndex: e,
    });
  };

  onCollSpse = () => {
    const { data } = this.state;
    const dataIndex = data?.metricsConfigContent?.map((val, index) => index);
    this.setState({
      dataIndex,
    });
  };

  onlistBookContent = (e) => {
    request({
      url: '/reportMetrics/tableCols',
      method: 'get',
      data: {
        tableName: e,
      },
    }).then((res) => {
      this.setState({
        tableCols: res.listData,
      });
    });
  };

  onlistBook = (e) => {
    const data = cloneDeep(this.props.form.getFieldsValue(''));
    data.metricsConfigContent.forEach((val) => {
      val.basicMetricCalcs.forEach((item) => {
        item.colName = undefined;
      });
    });
    this.props.form.setFieldsValue({
      metricsConfigContent: data.metricsConfigContent,
    });
    this.setState({
      tableCols: [],
    });
    request({
      url: '/reportMetrics/tableCols',
      method: 'get',
      data: {
        tableName: e,
      },
    }).then((res) => {
      this.setState({
        tableCols: res.listData,
      });
    });
  };

  onChangeMetrics = (e, index) => {
    const { data } = this.state;
    if (e.target.value == 'single') {
      data.metricsConfigContent[index].basicMetricCalcs = [
        {
          colName: undefined,
          calcType: undefined,
        },
      ];
    } else {
      data.metricsConfigContent[index].basicMetricCalcs = [
        {
          colName: undefined,
          calcType: undefined,
        },
        {
          colName: undefined,
          calcType: undefined,
        },
      ];
    }

    this.setState({
      data,
    });
  };

  onType = (e) => {
    if (e.target.value == 'basic') {
      if (
        this.props.match.params.type == 'copy' ||
        this.props.match.params.type == 'edit' ||
        this.props.match.params.type == 'add'
      ) {
        const data = cloneDeep(this.props.form.getFieldsValue(''));
        console.log(data);
        data.metricsConfigContent = [
          {
            basicMetricName: undefined, // 指标集A
            basicMetricDesc: undefined, // 指标集A-描述
            basicMetricType: undefined,
            calcExpression: undefined,
            valueType: undefined,
            basicMetricCalcs: [
              {
                colName: undefined,
                calcType: undefined,
              },
            ],
          },
        ];
        this.setState(
          {
            data,
          },
          () => {
            this.onCollSpse();
          }
        );
      }
      // eslint-disable-next-line no-debugger
      this.onCollSpse();
    }
  };

  removeSon = (index, ind) => {
    const data = cloneDeep(this.props.form.getFieldsValue(''));
    data.metricsConfigContent[index].basicMetricCalcs.splice(ind, 1);
    this.setState(
      {
        data,
      },
      () => {
        this.props.form.setFieldsValue({
          metricsConfigContent: data?.metricsConfigContent,
        });
      }
    );
  };

  render() {
    const {
      data,
      dataIndex,
      listData,
      tableCols,
      bizTypeList,
      // detail
    } = this.state;
    const { type } = this.props.match.params;
    const { getFieldDecorator, getFieldValue } = this.props.form;

    return (
      <div className='management-top'>
        <Form>
          <FormItem label='指标集名称' {...formItemLayout}>
            {getFieldDecorator('metricsName', {
              rules: [
                {
                  required: true,
                  message: '请选择',
                },
              ],
              initialValue: data?.metricsName,
            })(
              <Input
                style={{ width: 320 }}
                placeholder='请输入'
                disabled={type == 'detail'}
              />
            )}
          </FormItem>
          <FormItem label='适用业务类型' {...formItemLayout}>
            {getFieldDecorator('bizTypeDTOS', {
              rules: [
                {
                  required: true,
                  message: '请选择',
                },
              ],
              initialValue: data?.bizTypeDTOS?.map((val) => val.value || val),
            })(
              <Select
                showSearch
                allowClear
                className='input-mmd'
                optionFilterProp='children'
                placeholder='请选择'
                disabled={type == 'detail'}
                mode='multiple'
                style={{ width: 320 }}
              >
                {bizTypeList.map((val) => (
                  <Option value={val.value} key={val.value}>
                    {val.desc}
                  </Option>
                ))}
              </Select>
            )}
          </FormItem>
          <FormItem label='关联表名称' {...formItemLayout}>
            {getFieldDecorator('relatedTable', {
              rules: [
                {
                  required: true,
                  message: '请选择',
                },
              ],
              initialValue: data?.relatedTable,
            })(
              <Select
                showSearch
                allowClear
                className='input-mmd'
                optionFilterProp='children'
                placeholder='请选择'
                disabled={type == 'detail'}
                style={{ width: 320 }}
                onChange={(e) => {
                  this.onlistBook(e);
                }}
              >
                {listData?.map((val) => (
                  <Option value={val} key={val}>
                    {val}
                  </Option>
                ))}
              </Select>
            )}
          </FormItem>
          <FormItem label='指标录入方式' {...formItemLayout}>
            {getFieldDecorator('metricsConfigType', {
              rules: [
                {
                  required: true,
                  message: '请选择',
                },
              ],
              initialValue: data?.metricsConfigType || 'basic',
            })(
              <Radio.Group
                onChange={(e) => this.onType(e)}
                style={{ width: 260 }}
                disabled={type == 'detail'}
              >
                <Radio key={1} value='basic'>
                  手动配置
                </Radio>
                <Radio key={2} value='script'>
                  代码录入
                </Radio>
              </Radio.Group>
            )}
          </FormItem>

          {getFieldValue('metricsConfigType') == 'basic' && (
            <div className='mode-manget-top'>
              <Collapse activeKey={dataIndex} onChange={(e) => this.onPanel(e)}>
                {data.metricsConfigContent?.map((value, index) => (
                  <Panel
                    key={index}
                    header={
                      <div className='data-top'>
                        <span style={{ marginLeft: 40 }}>
                          {getFieldValue(
                            `metricsConfigContent[${index}].basicMetricName`
                          )}
                        </span>
                        {type !== 'detail' && (
                          <div style={{ float: 'right' }}>
                            <Icon
                              style={{ marginRight: 10, fontSize: 21 }}
                              type='snippets'
                              onClick={() => {
                                this.onCopy(index);
                              }}
                              className='custom-icon-class'
                            />
                            <Icon
                              style={{ marginRight: 10, fontSize: 21 }}
                              onClick={() => {
                                this.remove(index);
                              }}
                              type='delete'
                              className='custom-icon-class'
                            />
                          </div>
                        )}
                      </div>
                    }
                  >
                    <div className='data-son-left-top'>
                      <div style={{ marginTop: 20 }}>
                        <FormItem label='指标名称' {...formItemLayout}>
                          {getFieldDecorator(
                            `metricsConfigContent[${index}].basicMetricName`,
                            {
                              rules: [
                                {
                                  required: true,
                                  message: '请输入',
                                },
                              ],
                              initialValue: data?.marke
                                ? undefined
                                : data?.metricsConfigContent[index]
                                    ?.basicMetricName,
                            }
                          )(
                            <Input
                              disabled={type == 'detail'}
                              style={{ width: 320 }}
                              placeholder='单行输入'
                            />
                          )}
                        </FormItem>
                        <FormItem label='指标描述' {...formItemLayout}>
                          {getFieldDecorator(
                            `metricsConfigContent[${index}].basicMetricDesc`,
                            {
                              rules: [
                                {
                                  required: true,
                                  message: '请输入',
                                },
                              ],
                              initialValue: data?.marke
                                ? undefined
                                : data?.metricsConfigContent[index]
                                    ?.basicMetricDesc,
                            }
                          )(
                            <TextArea
                              disabled={type == 'detail'}
                              style={{ width: 320 }}
                              placeholder='多行输入'
                            />
                          )}
                        </FormItem>
                      </div>
                      <FormItem label='指标类型' {...formItemLayout}>
                        {getFieldDecorator(
                          `metricsConfigContent[${index}].basicMetricType`,
                          {
                            rules: [
                              {
                                required: true,
                                message: '请输入',
                              },
                            ],
                            initialValue: data?.marke
                              ? 'single'
                              : data?.metricsConfigContent[index]
                                  ?.basicMetricType || 'single',
                          }
                        )(
                          <Radio.Group
                            style={{ width: 260 }}
                            disabled={type == 'detail'}
                            onChange={(e) => {
                              this.onChangeMetrics(e, index);
                            }}
                          >
                            <Radio key={1} value='single'>
                              单一指标
                            </Radio>
                            <Radio key={2} value='group'>
                              组合指标
                            </Radio>
                          </Radio.Group>
                        )}
                      </FormItem>
                      {getFieldValue(
                        `metricsConfigContent[${index}].basicMetricType`
                      ) == 'single' ? (
                        <div>
                          {value?.basicMetricCalcs?.map((val, ind) => (
                            <>
                              <FormItem label='计算口径' {...formItemLayout}>
                                {getFieldDecorator(
                                  `metricsConfigContent[${index}].basicMetricCalcs[${ind}].colName`,
                                  {
                                    rules: [
                                      {
                                        required: true,
                                        message: '请输入',
                                      },
                                    ],
                                    initialValue: data?.marke
                                      ? undefined
                                      : data?.metricsConfigContent[index]
                                          ?.basicMetricCalcs[ind]?.colName,
                                  }
                                )(
                                  <Select
                                    showSearch
                                    allowClear
                                    className='input-md'
                                    optionFilterProp='children'
                                    placeholder='请选择'
                                    disabled={type == 'detail'}
                                    style={{ width: 320 }}
                                  >
                                    {tableCols?.map((val) => (
                                      <Option value={val} key={val}>
                                        {val}
                                      </Option>
                                    ))}
                                  </Select>
                                )}
                                {getFieldDecorator(
                                  `metricsConfigContent[${index}].basicMetricCalcs[${ind}].calcType`,
                                  {
                                    rules: [
                                      {
                                        required: true,
                                        message: '请输入',
                                      },
                                    ],
                                    initialValue: data?.marke
                                      ? undefined
                                      : data?.metricsConfigContent[index]
                                          ?.basicMetricCalcs[ind].calcType,
                                  }
                                )(
                                  <Select
                                    showSearch
                                    allowClear
                                    className='input-md'
                                    optionFilterProp='children'
                                    placeholder='请选择'
                                    disabled={type == 'detail'}
                                    style={{ width: 180 }}
                                  >
                                    <Option value='sum'>求和</Option>
                                    <Option value='avg'>均值</Option>
                                  </Select>
                                )}
                                <span> 计算方式：求和，均值</span>
                              </FormItem>
                            </>
                          ))}
                        </div>
                      ) : (
                        <div>
                          {value.basicMetricCalcs.map((val, ind) => (
                            <>
                              <FormItem label='计算口径' {...formItemLayout}>
                                <span className='basicMetricCalcs-ABCd'>
                                  {ABCD[ind]}
                                </span>
                                {getFieldDecorator(
                                  `metricsConfigContent[${index}].basicMetricCalcs[${ind}].colName`,
                                  {
                                    rules: [
                                      {
                                        required: true,
                                        message: '请输入',
                                      },
                                    ],
                                    initialValue: data?.marke
                                      ? undefined
                                      : data?.metricsConfigContent[index]
                                          ?.basicMetricCalcs[ind]?.colName,
                                  }
                                )(
                                  <Select
                                    showSearch
                                    allowClear
                                    className='input-md'
                                    optionFilterProp='children'
                                    placeholder='请选择'
                                    disabled={type == 'detail'}
                                    style={{ width: 320 }}
                                  >
                                    {tableCols?.map((val) => (
                                      <Option value={val} key={val}>
                                        {val}
                                      </Option>
                                    ))}
                                  </Select>
                                )}
                                {getFieldDecorator(
                                  `metricsConfigContent[${index}].basicMetricCalcs[${ind}].calcType`,
                                  {
                                    rules: [
                                      {
                                        required: true,
                                        message: '请输入',
                                      },
                                    ],
                                    initialValue: data?.marke
                                      ? undefined
                                      : data?.metricsConfigContent[index]
                                          ?.basicMetricCalcs[ind]?.calcType,
                                  }
                                )(
                                  <Select
                                    showSearch
                                    allowClear
                                    className='input-md'
                                    optionFilterProp='children'
                                    placeholder='请选择'
                                    disabled={type == 'detail'}
                                    style={{ width: 180 }}
                                  >
                                    <Option value='sum'>求和</Option>
                                    <Option value='avg'>均值</Option>
                                  </Select>
                                )}
                                {value.basicMetricCalcs.length > 1 ? (
                                  <Button
                                    shape='circle'
                                    icon='minus'
                                    style={{
                                      top: 3,
                                    }}
                                    onClick={() => this.removeSon(index, ind)}
                                  />
                                ) : (
                                  <></>
                                )}
                                {/* {ind > 0 && (
                                  <Button
                                    type='dashed'
                                    shape='circle'
                                    icon='minus'
                                    onClick={() => this.removeSon(index, ind)}
                                  />
                                )} */}
                                <span> 计算方式：求和，均值</span>
                              </FormItem>
                            </>
                          ))}
                          {type !== 'detail' && (
                            <div
                              className='add-metrics-son'
                              onClick={() => this.addSon(index)}
                            >
                              添加基础数据
                            </div>
                          )}
                        </div>
                      )}

                      {getFieldValue(
                        `metricsConfigContent[${index}].basicMetricType`
                      ) == 'group' && (
                        <FormItem label='计算关系' {...formItemLayout}>
                          {getFieldDecorator(
                            `metricsConfigContent[${index}].calcExpression`,
                            {
                              rules: [
                                {
                                  required: true,
                                  message: '请输入',
                                },
                              ],
                              initialValue: data?.marke
                                ? undefined
                                : data?.metricsConfigContent[index]
                                    ?.calcExpression,
                            }
                          )(
                            <Input
                              disabled={type == 'detail'}
                              style={{ width: 320 }}
                              placeholder='请输入各基础数据关系，实例：A/B'
                            />
                          )}
                        </FormItem>
                      )}

                      <FormItem label='数值类型' {...formItemLayout}>
                        {getFieldDecorator(
                          `metricsConfigContent[${index}].valueType`,
                          {
                            rules: [
                              {
                                required: true,
                                message: '请输入',
                              },
                            ],
                            initialValue: data?.marke
                              ? undefined
                              : data?.metricsConfigContent[index]?.valueType,
                          }
                        )(
                          <Radio.Group
                            disabled={type == 'detail'}
                            style={{ width: 500 }}
                          >
                            <Radio key={1} value='decimal'>
                              数字（保留两位小数）
                            </Radio>
                            <Radio key={2} value='percentage'>
                              百分比（保留两位小数）
                            </Radio>
                          </Radio.Group>
                        )}
                      </FormItem>
                    </div>
                  </Panel>
                ))}
              </Collapse>
              {type !== 'detail' && (
                <div
                  onClick={() => {
                    this.add();
                  }}
                  className='button-class'
                >
                  <Icon
                    style={{ marginRight: 10, fontSize: 18 }}
                    type='plus'
                    className='custom-icon-class'
                  />
                  添加指标
                </div>
              )}
            </div>
          )}
          {getFieldValue('metricsConfigType') == 'script' && (
            <>
              <FormItem label='指标计算脚本' {...formItemLayout}>
                {getFieldDecorator('marke', {
                  rules: [
                    {
                      message: '请输入',
                      required: true,
                    },
                  ],
                  initialValue: data?.marke,
                })(
                  <TextArea
                    disabled={type == 'detail'}
                    placeholder='请输入内容'
                    style={{ width: 320 }}
                  />
                )}
              </FormItem>
            </>
          )}
        </Form>
        <div className='steps-action'>
          <Button onClick={() => window.close()}>关闭</Button>
          {type !== 'detail' && (
            <Button
              type='primary'
              onClick={() => {
                this.submit();
              }}
            >
              保存
            </Button>
          )}
        </div>
      </div>
    );
  }
}
export default  Form.create()(curd);
