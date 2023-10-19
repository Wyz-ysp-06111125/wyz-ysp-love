/* eslint-disable react/jsx-no-target-blank */
/* eslint-disable no-script-url */
/* eslint-disable max-len */
/* eslint-disable eqeqeq */
import React from 'react';
import {
  Form, Modal, Select, Message, InputNumber,
} from 'antd';
import { request } from '@cfe/caopc-center-common';
// import { SelectDouble } from '@cfe/venom';
import './modal.less';

const FormItem = Form.Item;
const { Option } = Select;
const formItemLayout = {
  labelCol: {
    xs: { span: 16 },
    sm: { span: 7 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 17 },
  },
};

@Form.create()
export default class ModalRule extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      firmData: [],
      setLeaseList: [],
      cityList: [],
      // cityCart: [],
      // companyList: [],
      // companyName: '',
      // dataAll: undefined,
    };
  }

  componentDidMount() {
    const { data, type } = this.props;
    if (type === 'edit') {
      this.onChangeCity(data.cityCode);
    }
    request({
      url: '/pay-boss/basic/queryPermissionCity',
      method: 'post',
    }).then((res) => {
      this.setState({
        cityList: res.filter((val) => val.value !== '全国'),
      });
    });
    request({
      url: '/pay-platform/common/dict/list/leaseDeductChannelAccount',
      method: 'get',
    }).then((data) => {
      this.setState({
        firmData: data,
      });
    });
  }

  submit = () => {
    const {
      form, type, onOk,
    } = this.props;
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        // values.cityCode = values.cityCode.cityCode;
        values.requestFromOuter = false;
        let url = '/pay-boss/leaseDeduction/agency/create';
        if (type === 'edit') {
          delete values.cityCode;
          // values.id = data.id;
          url = '/pay-boss/leaseDeduction/agency/modify';
        }
        request({
          url,
          method: 'post',
          data: values,
        }).then((res) => {
          Message.success('操作成功');
          onOk && onOk(res);
        });
      }
    });
  }

  onChangeCity = (cityCode) => {
    if (cityCode) {
      request({
        url: '/center-settlement/basic/queryAuthLeaseCompany',
        data: { companyType: 5, cityCode },
      }).then((data) => {
        this.setState({
          setLeaseList: data,
        });
      });
    }
  }

  // handleClick = (value) => () => {
  //   this.setState({
  //     companyName: value,
  //   });
  // }

  render() {
    const { getFieldDecorator } = this.props.form;
    const {
      setLeaseList, firmData, cityList,
    } = this.state;
    const { data, type } = this.props;
    // 获得所有的城市 二级联动效果
    // const param = {
    //   width: 120,
    //   firstConfig: {
    //     url: {
    //       method: 'get',
    //       url: '/center-config/city/provinceH5',
    //     },
    //     optionMap: { key: 'code', value: 'name' },
    //   },
    //   secondConfig: {
    //     url: {
    //       method: 'get',
    //       url: '/center-config/city/queryCityByProvinceCodeH5',
    //     },
    //     queryKey: 'provinceCode',
    //     optionMap: { key: 'telCode', value: 'name' },
    //     afterRequest: (val) => {
    //       val = val.filter((e) => e.name !== '县');
    //       // this.setState({ cityList: val });
    //       return val;
    //     },
    //   },

    //   format: {
    //     first: 'provinceCode',
    //     second: 'cityCode',
    //   },
    //   onChange: (val) => {
    //     const { cityCode } = val;

    //     if (cityCode) {
    //       this.onChangeCity(cityCode);
    //     }
    //   },
    // };

    return (
      <Modal
        visible
        title={type === 'edit' ? '编辑代扣加盟商' : '添加代扣加盟商'}
        onCancel={this.props.onCancel}
        onOk={this.submit}
        maskClosable={false}
        width={700}
      >
        <Form className="all-input">
          {/* //城市 */}

          <FormItem label="城市" {...formItemLayout}>
            {getFieldDecorator('cityCode', {
              rules: [{
                required: true, message: '请选择',
              }],
              initialValue: data.cityCode,
            })(
              <Select onChange={(e) => { this.onChangeCity(e); }} style={{ width: 200 }} placeholder="请选择" disabled={type === 'edit'} showSearch optionFilterProp="children">
                {cityList.map((key) => (<Option key={key.key} value={key.key}>{key.value}</Option>))}
              </Select>,
            )}
          </FormItem>
          <br />
          <FormItem label="加盟商" {...formItemLayout}>
            {getFieldDecorator('agencyNo', {
              rules: [{
                required: true,
                message: '请选择',
              }],
              initialValue: data.agencyNo,
            })(
              <Select style={{ width: 200 }} placeholder="请选择" disabled={type === 'edit'} showSearch optionFilterProp="children">
                {setLeaseList.map((key) => (<Option key={key.key} value={key.key}>{key.value}</Option>))}
              </Select>,
            )}
          </FormItem>

          <br />
          <FormItem label="结算周期" {...formItemLayout}>
            {getFieldDecorator('settlePeriod', {
              rules: [{
                required: true, message: '请输入整数', pattern: /^[0-9]*[0-9][0-9]*$/,
              }],
              initialValue: data.settlePeriod,
            })(<InputNumber className="input-md" max={99} />)}
            <span style={{ marginLeft: 20 }}>天</span>
          </FormItem>
          <br />

          <FormItem label="签约主体" {...formItemLayout}>
            {getFieldDecorator('partnerNo', {
              rules: [{
                required: true,
                message: '请选择',
              }],
              initialValue: data.partnerNo || undefined,
            })(
              <Select style={{ width: 200 }} disabled={type === 'edit'}>
                {firmData.map((key) => (<Option key={key} value={key.key}>{key.value}</Option>))}
              </Select>,
            )}
          </FormItem>

        </Form>

      </Modal>
    );
  }
}
