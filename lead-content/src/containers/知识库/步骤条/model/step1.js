/* eslint-disable jsx-a11y/control-has-associated-label */
/* eslint-disable react/no-access-state-in-setstate */
/* eslint-disable no-script-url */
/* eslint-disable max-len */
/* eslint-disable eqeqeq */
import React from 'react';
import moment from 'moment';
import {
  Button, Form, Select, Divider, DatePicker, Input, message,
} from 'antd';
import { request } from '@cfe/caopc-center-common';
import { SelectMax } from '@cfe/venom';
import { cloneDeep } from 'lodash';
import './index.less';

const FormItem = Form.Item;
const { Option } = Select;

const { MonthPicker } = DatePicker;

const DEFAULT_LEASE_DATA_ITEM = { dataAll: [] };

@Form.create()
export default class Model extends React.Component {
  constructor(props) {
    super(props);
    const step1Json = JSON.parse(window.sessionStorage.getItem('step1Json') || '{}');
    const leaseData = [{ ...DEFAULT_LEASE_DATA_ITEM }];
    if (step1Json?.policyExtList && step1Json?.policyExtList.length > 1) {
      for (let index = 1; index < step1Json?.policyExtList.length; index++) {
        leaseData.push({ ...DEFAULT_LEASE_DATA_ITEM });
      }
    }
    this.state = {
      carBelongType: [],
      // 加盟商指标
      leaseAllianceFlag: [],
      leaseData,
      data: {
        policyName: undefined,
        statisticMonth: undefined,
        carBelongType: undefined,
        policyExtList: step1Json?.policyExtList || [{
          cityCode: undefined,
          leaseAllianceFlag: undefined,
          leaseCompanyNoList: undefined,
        }],
      },
      cityList: [],
      step1Json,
    };
  }

  componentDidMount() {
    const data = JSON.parse(window.sessionStorage.getItem('step1Json') || '{}');
    data?.policyExtList?.forEach((val, index) => {
      this.onFlag(val.leaseAllianceFlag, val.cityCode, index);
    });
    // 加盟商指标
    request({
      url: '/cp-driver-boss/common/queryBaseConfig',
      method: 'get',
      data: {
        code: 'allianceFlagCode',
      },
    }).then((data) => {
      this.setState({
        leaseAllianceFlag: data,
      });
    });
    request({
      url: '/pay-boss/basic/queryPermissionCity',
      method: 'post',
    }).then((res) => {
      const data = res.filter((val) => val.value !== '全国');
      const alldata = data.filter((val) => val.value !== '全国00');
      this.setState({
        cityList: alldata,
      });
    });
    request({
      url: '/pay-boss/leaseSalary/base/findTypeList',
      method: 'post',
      data: {
        indexNo: 'carBelongType',
        pageSize: 99999,
        pageNum: 1,
      },
    }).then((res) => {
      this.setState({
        carBelongType: res.list,
      });
    });
  }

  addSilderItem = () => {
    const data = cloneDeep(this.props.form.getFieldsValue());
    const { leaseData } = this.state;

    if (data?.policyExtList[49]) {
      message.warning('最大支持新增50个城市');
      return;
    }

    leaseData.push({
      dataAll: [],
    });
    data.policyExtList.push({
      cityCode: undefined,
      leaseAllianceFlag: undefined,
      leaseCompanyNoList: undefined,
    });
    this.setState({
      data,
      leaseData,
    });
  }

  removeSilderItem = (index) => {
    const data = cloneDeep(this.props.form.getFieldsValue());
    data.policyExtList.splice(index, 1);
    const { leaseData } = this.state;
    leaseData.splice(index, 1);
    this.setState({
      data,
      leaseData,
    }, () => {
      this.props.form.setFieldsValue({
        policyExtList: data.policyExtList,
      });
    });
  }

  onChangeCity = (index) => {
    const { leaseData } = this.state;
    const leaseAllianceFlag = `policyExtList[${index}].leaseAllianceFlag`;
    const leaseCompanyNoList = `policyExtList[${index}].leaseCompanyNoList`;
    this.props.form.setFieldsValue({
      [leaseAllianceFlag]: undefined,
      [leaseCompanyNoList]: undefined,
    });

    leaseData.forEach((val, itemIndex) => {
      if (index == itemIndex) {
        val.dataAll = [];
      }
    });
    this.setState({
      leaseData,
    });
  }

  queryleaseComponent = (data, index) => {
    const { leaseData } = this.state;
    leaseData[index].dataAll = data;
    this.setState({
      leaseData: [...leaseData],
    });
  }

  onFlag = (e, cityCode, index) => {
    if (cityCode) {
      request({
        url: '/pay-boss/basic/queryAuthLeaseCompany',
        data: {
          companyType: 5,
          cityCode,
          allianceTag: e,
        },
      }).then((data) => {
        this.queryleaseComponent(data, index);
      });
    }
  }

  onLianceFlag = (e, cityCode, index) => {
    const leaseCompanyNoList = `policyExtList[${index}].leaseCompanyNoList`;
    this.props.form.setFieldsValue({
      [leaseCompanyNoList]: undefined,
    });
    if (cityCode) {
      request({
        url: '/pay-boss/basic/queryAuthLeaseCompany',
        data: {
          companyType: 5,
          cityCode,
          allianceTag: e,
        },
      }).then((data) => {
        this.queryleaseComponent(data, index);
      });
    }
  }

  listdata = (index) => {
    const { leaseData } = this.state;
    const data = [];
    // eslint-disable-next-line
    leaseData[index]?.dataAll?.map((item) => {
      data.push(item.key);
    });
    const list = `policyExtList[${index}].leaseCompanyNoList`;
    this.props.form.setFieldsValue({
      [list]: data,
    });
  }

  render() {
    const { getFieldDecorator, getFieldValue } = this.props.form;
    const {
      step1Json, data, cityList, carBelongType, leaseAllianceFlag, leaseData,
    } = this.state;
    const {
      type,
    } = this.props;
    return (
      <div className="inline-top-content">
        <Divider orientation="left">政策基础信息</Divider>
        <Form layout="inline">
          <FormItem labelCol={{ style: { width: 200 } }} label="政策名称:">
            {getFieldDecorator('policyName', {
              rules: [{
                required: true, message: '请输入',
              }],
              initialValue: step1Json?.policyName,
            })(<Input disabled={type == 'detail' || type == 'edit'} placeholder="请输入" maxLength={60} style={{ width: 200 }} />)}
          </FormItem>
          <div>
            <FormItem labelCol={{ style: { width: 200 } }} label="执行月份:">
              {getFieldDecorator('statisticMonth', {
                rules: [{
                  required: true, message: '请输入',
                }],
                initialValue: step1Json.statisticMonth ? moment(step1Json.statisticMonth) : null,
              })(<MonthPicker
                placeholder="请选择时间"
                format="YYYY-MM"
                style={{ width: 200 }}
                disabled={type == 'detail' || type == 'edit'}
                disabledDate={(current) => current && current < moment().startOf('month')}
              />)}
            </FormItem>
            <FormItem labelCol={{ style: { width: 170 } }} label="车辆归属类别:">
              {getFieldDecorator('carBelongType', {
                rules: [{
                  required: true, message: '请输入',
                }],
                initialValue: step1Json?.carBelongType,
              })(
                <Select style={{ width: 160 }} placeholder="请选择" disabled={type === 'detail' || type == 'edit'} showSearch optionFilterProp="children">
                  {carBelongType.map((key) => (<Option key={key.indexEnum} value={key.indexEnum}>{key.indexEnumName}</Option>))}
                </Select>,
              )}
            </FormItem>
          </div>
          <Divider orientation="left">政策关联加盟商</Divider>
          {
            data.policyExtList.map((val, index) => (
              <>
                <div>
                  <FormItem labelCol={{ style: { width: 200 } }} label="城市:">
                    {getFieldDecorator(`policyExtList[${index}].cityCode`, {
                      rules: [{
                        required: true, message: '请输入',
                      }],
                      initialValue: data?.policyExtList[index]?.cityCode,
                    })(
                      <Select style={{ width: 160 }} onChange={() => this.onChangeCity(index)} placeholder="请选择" disabled={type == 'detail'} showSearch optionFilterProp="children">
                        {cityList.map((key) => (<Option key={key.key} value={key.key}>{key.value}</Option>))}
                      </Select>,
                    )}
                  </FormItem>
                  <FormItem labelCol={{ style: { width: 210 } }} label="加盟商标识:">
                    {getFieldDecorator(`policyExtList[${index}].leaseAllianceFlag`, {
                      rules: [{
                        required: true, message: '请输入',
                      }],
                      initialValue: data?.policyExtList[index]?.leaseAllianceFlag && data.policyExtList[index]?.leaseAllianceFlag,
                    })(
                      <Select style={{ width: 160 }} placeholder="请选择" onChange={(e) => this.onLianceFlag(e, getFieldValue(`policyExtList[${index}].cityCode`), index)} disabled={type == 'detail'} showSearch optionFilterProp="children">
                        {leaseAllianceFlag.map((key) => (<Option key={key.baseCode} value={key.baseCode}>{key.name}</Option>))}
                      </Select>,
                    )}
                  </FormItem>
                </div>
                <div>
                  <FormItem labelCol={{ style: { width: 200 } }} label="加盟商:">
                    {getFieldDecorator(`policyExtList[${index}].leaseCompanyNoList`, {
                      rules: [{
                        required: true, message: '请输入',
                      }],
                      initialValue: data?.policyExtList[index]?.leaseCompanyNoList?.map((val) => val.toString()),
                    })(
                      <SelectMax
                        style={{ width: 545 }}
                        mode="multiple"
                        placeholder="请选择"
                        options={leaseData[index]?.dataAll?.map((e) => ({ key: e.key, value: `${e.value}(${e.key})` }))}
                        disabled={type == 'detail'}
                      />,
                      // <Select allowClear style={{ width: 280 }} placeholder="请选择" disabled={type == 'detail'} showSearch mode="tags" optionFilterProp="children">
                      //   {leaseData[index]?.dataAll?.map((key) => (<Option key={key.key} value={key.key}>{key.value}</Option>))}
                      // </Select>,
                    )}
                    {type !== 'detail' && <a style={{ left: 15, position: 'relative' }} onClick={() => { this.listdata(index); }}>全选</a>}
                  </FormItem>
                  {index === 0 ? (
                    <Button shape="circle"
                      icon="plus"
                      style={{
                        position: 'relative',
                        left: 100,
                        top: 3,
                      }}
                      onClick={() => this.addSilderItem()}
                      disabled={type === 'detail'}
                    />
                  ) : (
                    <Button
                      shape="circle"
                      icon="minus"
                      style={{
                        position: 'relative',
                        left: 100,
                        top: 3,
                      }}
                      onClick={() => this.removeSilderItem(index)}
                      disabled={type === 'detail'}
                    />
                  )}
                  <hr />
                </div>
              </>
            ))
          }
        </Form>
      </div>
    );
  }
}
