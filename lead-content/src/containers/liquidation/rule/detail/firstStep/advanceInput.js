/* eslint-disable react/jsx-no-target-blank */
/* eslint-disable no-script-url */
/* eslint-disable max-len */
/* eslint-disable eqeqeq */
import React from 'react';
import {
  Form, InputNumber, Select, message,
} from 'antd';
import { request } from '@cfe/caopc-center-common';
import { urls } from '../../config';

const FormItem = Form.Item;
const { Option } = Select;

export default class AdvanceInput extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      value: props.value || {},
      merchantTypeList: props.merchantTypeList || [],
    };
  }

  componentDidMount() {
    const { value } = this.props;
    if (value && value.settleUserType) {
      this.loadMerchantTypeList(value.settleUserType);
    }
  }

  componentWillReceiveProps(nextProps) {
    if ('value' in nextProps && nextProps.value !== this.props.value) {
      this.setState({
        value: {
          ...(nextProps.value
            || { inputStart: undefined, inputEnd: undefined, outputValue: undefined }
          ),
        },
      });
    }
  }

  loadMerchantTypeList(merchantType) {
    request({
      ...urls.queryMerchantTypeList,
      data: {
        merchantType,
      },
    }).then((data) => {
      this.setState({
        merchantTypeList: data || [],
      });
    });
  }

  triggerChange(changedValue) {
    const { onChange } = this.props;
    if (onChange) {
      onChange({ ...this.state.value, ...changedValue });
    }
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

  onRate = (e) => {
    const {
      data, valueIndex, i, driverSwitch, index,
    } = this.props;
    // eslint-disable-next-line
    data?.forEach((dataValue, dataIndex) => {
      if (valueIndex == dataIndex) {
        dataValue?.mileageSplitDetails?.forEach((sonVal, sonIndex) => {
          if (i == sonIndex) {
            sonVal?.merchantSplitDetails?.forEach((lastVal, lastIndex) => {
              if (index == lastIndex) {
                if (lastVal?.settleUserType == '4') {
                  if (driverSwitch == '1') {
                    sonVal?.driverTagRates?.forEach((sonValItem) => {
                      sonVal?.driverClearFactors?.forEach((Avalue) => {
                        this.driverRate(sonValItem.rate, e.target.value, Avalue.value);
                      });
                    });
                  } else {
                    sonVal?.driverTagRates?.forEach((sonValItem) => {
                      this.driverRate(sonValItem.rate, e.target.value);
                    });
                  }
                }
              }
            });
          }
        });
      }
    });
  }

  handleOnchange(key) {
    // eslint-disable-next-line
    return (e) => {
      // eslint-disable-next-line
      if (!('value' in this.props)) {
        if (key === 'settleUserType') {
          this.setState({
            value: {
              // eslint-disable-next-line
              ...this.state.value,
              merchantNo: undefined,
              clearRate: undefined,
            },
          });
        }

        this.setState({
          value: {
            // eslint-disable-next-line
            ...this.state.value,
            [key]: e,
          },
        });
      }
      if (key === 'settleUserType') {
        this.loadMerchantTypeList(e);
        this.triggerChange({ [key]: e, merchantNo: undefined, clearRate: undefined });
      } else {
        this.triggerChange({ [key]: e });
      }
    };
  }

  render() {
    const { value } = this.state;
    const { disabled, clearMerchantTypeList, index } = this.props;
    const { merchantTypeList } = this.state;
    return (
      <div>
        <FormItem label={`主体${index + 1}类型`} className="liquidation-formItem-advanceInput">
          <Select
            className="input-sm"
            allowClear
            placeholder="请选择"
            showSearch
            optionFilterProp="children"
            value={value.settleUserType ? value.settleUserType.toString() : undefined}
            onChange={this.handleOnchange('settleUserType')}
            disabled={disabled}
          >
            {clearMerchantTypeList.map((item) => (
              <Option
                key={item.key}
                value={item.key}
              >{item.value}</Option>
            ))}
          </Select>
        </FormItem>&nbsp;&nbsp;&nbsp;&nbsp;
        <FormItem label={`分润主体${index + 1}`} className="liquidation-formItem-advanceInput">
          <Select
            className="input-sm"
            allowClear
            placeholder="请选择"
            showSearch
            optionFilterProp="children"
            // : merchantTypeList?.length == 1 ? merchantTypeList[0]?.key?.toString()
            value={value.merchantNo ? value.merchantNo.toString() : undefined}
            onChange={this.handleOnchange('merchantNo')}
            disabled={disabled}
          >
            {merchantTypeList.map((item) => (
              <Option
                key={item.key}
                value={item.key}
              >{item.value}</Option>
            ))}
          </Select>
        </FormItem>&nbsp;&nbsp;&nbsp;&nbsp;
        <FormItem label="分润比例" className="liquidation-formItem-advanceInput">
          <InputNumber
            className="input-sm"
            min={0.01}
            max={100}
            precision={2}
            value={value.clearRate}
            onChange={this.handleOnchange('clearRate')}
            onBlur={(e) => { this.onRate(e); }}
            disabled={disabled}
          />&nbsp;%
        </FormItem>&nbsp;&nbsp;&nbsp;&nbsp;
        <FormItem label="结算周期" className="liquidation-formItem-advanceInput">
          <InputNumber
            className="input-sm"
            min={0}
            precision={0}
            max={100}
            value={value.settlePeriod}
            onChange={this.handleOnchange('settlePeriod')}
            disabled={disabled}
          />&nbsp;日
        </FormItem>
      </div>
    );
  }
}
