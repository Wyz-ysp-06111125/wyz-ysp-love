/* eslint-disable max-len */
/* eslint-disable eqeqeq */
/* eslint-disable react/no-access-state-in-setstate */
import React, { Component } from 'react';
import {
  Form, Input, DatePicker, Divider, Card, Checkbox, Select, message, Spin,
} from 'antd';
import request from '@cfe/venom-request';
import moment from 'moment';
import { SelectMax } from '@cfe/venom';
// import { cloneDeep } from 'lodash';
import debounce from 'lodash/debounce';
import { RULE_TYPE, urls, RULE_TAG } from '../config';

const FormItem = Form.Item;
const { Option } = Select;
@Form.create()
export default class Step extends Component {
  constructor(props) {
    super(props);
    this.state = {
      detail: {},
      leaseholdersList: [],
      serviceTypeList: [],
      data: [{ id: '0000', name: '全部' }],
      fetching: false,
      companyNoList: undefined,
    };
    this.lastFetchId = 0;
    this.fetchCompany = debounce(this.fetchCompany, 400);
  }

  componentDidMount() {
    const {
      type,
    } = this.props;
    if (type == 'add') {
      this.fetchCompany();
    }
    if (window.sessionStorage.getItem('Step1')) {
      const detail = JSON.parse(window.sessionStorage.getItem('Step1'));
      this.fetchCompanyAll(detail?.companyNameMap ? detail?.companyNameMap : detail?.companyNoList);
      this.setState({
        detail,
      });
      this.loadLeaseholdersList(detail.cityCode);
      this.loadServiceTypeList(detail.cityCode);
    }
  }

  onChangeCity = (value) => {
    const { form } = this.props;
    form.setFieldsValue({
      agencyIdList: undefined,
      serviceType: undefined,
    });
    this.loadLeaseholdersList(value);
    this.loadServiceTypeList(value);
  }

  loadServiceTypeList = (cityCode) => {
    request({
      ...urls.queryServiceTypeList,
      data: {
        cityCode,
      },
    }).then((data) => {
      this.setState({
        serviceTypeList: (data || []).map((e) => ({ key: e.key, value: e.value })),
      });
    });
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
        leaseholdersList: (data || []).map((e) => ({ key: e.key, value: `${e.value}(${e.key})` })),
      });
    });
  }

  onCheck = (e) => {
    const { checked } = e.target;
    if (checked) {
      const { leaseholdersList } = this.state;
      this.props.form.setFieldsValue({
        agencyIdList: leaseholdersList?.map((e) => e.key),
      });
    } else {
      this.props.form.setFieldsValue({
        agencyIdList: [],
      });
    }
  }

  handleChange = (data) => {
    const allData = this.props.form.getFieldsValue();
    data?.forEach((element) => {
      if (element?.key?.includes('0000')) {
        allData.companyNoList = [{ key: '0000', label: '全部' }];
        const companyNoList = [{ key: '0000', label: '全部' }];
        this.setState({
          detail: allData,
          companyNoList,
        }, () => {
          this.props.form.resetFields();
        });
      }
    });
    const maxOptions = 50; // 最大选项数量
    if (data?.length > maxOptions) {
      message.warning('渠道只能选择五十项');
      const selectedOptions = data.slice(0, maxOptions);
      allData.companyNoList = selectedOptions;
      const companyNoList = selectedOptions;
      this.setState({
        detail: allData,
        companyNoList,
      }, () => {
        this.props.form.resetFields();
      });
    }
    this.setState({
      fetching: false,
    });
  };

  fetchCompanyAll = (value) => {
    if (value) {
      const data = Array.isArray(value)
        ? value?.map((val) => ({ id: val.key, name: val.label }))
        : Object.entries(value)?.map(([id, name]) => ({ id, name }));
      const list = Array.isArray(value) ? value : Object.entries(value).map(([key, label]) => ({ key, label }));
      this.setState({
        data,
        companyNoList: list,
      });
    }
  };

  fetchCompany = (value) => {
    this.lastFetchId += 1;
    const fetchId = this.lastFetchId;
    this.setState({ data: [], fetching: true });
    request({
      url: '/center-biztrip/companyTool/queryCompanyListByConditions',
      data: {
        name: value,
      },
    }).then((res) => {
      if (fetchId !== this.lastFetchId) {
        return;
      }
      this.setState({
        data: [{ id: '0000', name: '全部' }, ...res],
        fetching: false,
      });
    });
  };

  render() {
    const {
      detail, leaseholdersList, serviceTypeList, fetching, data, companyNoList,
    } = this.state;
    const { getFieldDecorator, getFieldValue } = this.props.form;
    const {
      cityList, bizLineList, carNatureList, disabled,
    } = this.props;
    return (
      <Card>
        <Form layout="inline">
          <FormItem label="规则类别" labelCol={{ style: { width: 200 } }}>
            {getFieldDecorator('ruleType', {
              initialValue: detail?.ruleType?.toString() ?? '0',
              rules: [
                { required: true, message: '请输入' },
              ],
            })(<SelectMax style={{ width: 200 }}
              options={Object.keys(RULE_TYPE).map((key) => ({ key, value: RULE_TYPE[key] }))}
              disabled={disabled}
            />)}
          </FormItem>
          {/* 标签 */}
          <FormItem label="标签" labelCol={{ style: { width: 200 } }}>
            {getFieldDecorator('ruleTag', {
              initialValue: detail?.ruleTag || 0,
              rules: [
                { required: true, message: '请输入' },
              ],
            })(<SelectMax style={{ width: 179 }}
              options={Object.keys(RULE_TAG).map((key) => ({ key: parseInt(key, 10), value: RULE_TAG[key] }))}
              disabled={disabled}
            />)}
          </FormItem>
          {getFieldValue('ruleType') == 1 ? (
            <>
              <FormItem label="用车时间段" labelCol={{ style: { width: 200 } }}>
                {getFieldDecorator('range', {
                  initialValue: detail?.range?.length ? [moment(detail.range[0]), moment(detail.range[1])] : undefined,
                  rules: [
                    { required: true, message: '请选择' },
                  ],
                })(<DatePicker.RangePicker
                  disabledDate={(current) => current && (current < moment().endOf('day') || current > moment('2035-12-31 23:59:59'))}
                  format="YYYY-MM-DD"
                  disabled={disabled}
                />)}
              </FormItem>
              <FormItem labelCol={{ style: { width: 200 } }}>
                {getFieldDecorator('holidayFlag', {
                  // eslint-disable-next-line
                  initialValue: detail?.holidayFlag ? Array.isArray(detail?.holidayFlag) ? detail?.holidayFlag : [detail?.holidayFlag] : undefined,
                })(
                  <Checkbox.Group>
                    <Checkbox disabled={disabled} key={1} value={1}>节假日、周末</Checkbox>
                  </Checkbox.Group>,
                )}
              </FormItem>
            </>
          ) : null}
          <br />
          <FormItem label="分润规则名称" labelCol={{ style: { width: 200 } }}>
            {getFieldDecorator('ruleName', {
              initialValue: detail?.ruleName,
              rules: [
                { required: true, message: '请输入' },
              ],
            })(<Input style={{ width: 200 }} maxLength={30} disabled={disabled} />)}
          </FormItem>
          <FormItem label="生效时间" labelCol={{ style: { width: 200 } }}>
            {getFieldDecorator('activateTime', {
              initialValue: detail?.activateTime && moment(detail.activateTime),
              rules: [
                { required: true, message: '请选择' },
              ],
            })(<DatePicker
              disabledDate={(current) => current && current < moment().endOf('day')}
              format="YYYY-MM-DD"
              disabled={disabled}
            />)}
          </FormItem>
          {getFieldValue('ruleType') == 1 ? (
            <FormItem label="失效时间" labelCol={{ style: { width: 200 } }}>
              {getFieldValue('range')?.length ? getFieldValue('range')[1].format('YYYY-MM-DD 23:59:59') : null}
            </FormItem>
          ) : null}
          <Divider orientation="left">业务因素</Divider>
          <FormItem label="城市" labelCol={{ style: { width: 200 } }}>
            {getFieldDecorator('cityCode', {
              initialValue: detail?.cityCode,
              rules: [
                { required: true, message: '请选择' },
              ],
            })(<SelectMax style={{ width: 200 }}
              options={cityList}
              onChange={this.onChangeCity}
              disabled={disabled}
            />)}
          </FormItem>
          <FormItem label="租赁商" labelCol={{ style: { width: 200 } }}>
            {getFieldDecorator('agencyIdList', {
              initialValue: detail?.agencyIdList,
              rules: [
                { required: true, message: '请选择' },
              ],
            })(<SelectMax
              style={{ minWidth: 200 }}
              mode="multiple"
              allowClear
              options={leaseholdersList}
              disabled={disabled}
            />)}
          </FormItem>
          {getFieldValue('cityCode') && getFieldValue('cityCode') !== '0000'
            && (
              <Checkbox
                disabled={disabled}
                style={{ marginTop: 8 }}
                key={getFieldValue('cityCode')}
                onChange={this.onCheck}
              >全选</Checkbox>
            )}
          <br />
          <FormItem label="业务线" labelCol={{ style: { width: 200 } }}>
            {getFieldDecorator('bizLine', {
              initialValue: detail?.bizLine?.toString(),
              rules: [
                { required: true, message: '请选择' },
              ],
            })(<SelectMax style={{ width: 200 }}
              options={bizLineList}
              disabled={disabled}
            />)}
          </FormItem>
          <FormItem label="渠道" labelCol={{ style: { width: 200 } }}>
            {getFieldDecorator('companyNoList', {
              initialValue: companyNoList || [{ key: '0000', label: '全部' }],
              rules: [
                { required: true, message: '请选择' },
              ],
            })(<Select
              style={{ minWidth: 200 }}
              mode="multiple"
              allowClear
              placeholder="请选择"
              showSearch
              filterOption={false}
              labelInValue
              disabled={disabled}
              optionFilterProp="children"
              notFoundContent={fetching ? <Spin size="small" /> : null}
              onSearch={this.fetchCompany}
              onChange={(e) => { this.handleChange(e); }}
            >
              {data.map((d) => (
                <Option key={d.id} title={d.name}>{d.name}</Option>
              ))}
            </Select>)}
          </FormItem>
          <br />
          <FormItem label="车辆所属性质" labelCol={{ style: { width: 200 } }}>
            {getFieldDecorator('carBelongType', {
              initialValue: detail?.carBelongType?.toString(),
              rules: [
                { required: true, message: '请选择' },
              ],
            })(<SelectMax style={{ width: 200 }}
              options={carNatureList}
              disabled={disabled}
            />)}
          </FormItem>
          <FormItem label="听单等级" labelCol={{ style: { width: 200 } }}>
            {getFieldDecorator('serviceType', {
              initialValue: detail?.serviceType?.toString(),
              rules: [
                { required: true, message: '请选择' },
              ],
            })(<SelectMax style={{ width: 200 }}
              options={serviceTypeList}
              disabled={disabled}
            />)}
          </FormItem>
        </Form>
      </Card>
    );
  }
}
