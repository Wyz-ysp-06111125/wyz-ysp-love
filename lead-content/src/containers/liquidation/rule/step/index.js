/* eslint-disable max-len */
/* eslint-disable camelcase */
/* eslint-disable eqeqeq */
/* eslint-disable react/no-access-state-in-setstate */
import React, { Component } from 'react';
import { Steps, Button, message } from 'antd';
import request from '@cfe/venom-request';
import moment from 'moment';
import { g_event_emitter } from '@/ruleUtils/eventEmitter';
import AuthButton from '@/components/auth-button';
import { urls } from '../config';
import Step1 from './step1';
import Step2 from './step2';
import Step3 from './step3';
import Step4 from './step4';
import './index.less';

const { Step } = Steps;
const steps = [
  {
    title: '业务因素',
    content: 'First-content',
  },
  {
    title: '基础分润规则',
    content: 'Second-content',
  },
  {
    title: '特殊费用分润规则',
    content: 'Last-content',
  },
  {
    title: '分润费用项',
    content: 'Last-content',
  },
];
export default class AdvancedModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      driverTage: [],
      current: -1,
      cityList: [], // 城市
      serviceTypeList: [], // 服务等级
      bizLineList: [], // 业务线
      carNatureList: [], // 车辆所属性质
      merchantTypeList: [], // 主体
      clearMerchantTypeList: [], // 主体类型
      specialFeeList: [], // 特殊分润费用
      feeCodesList: [], // 代收费用
      umpFeeDetailsList: [], // 优惠金额列表
      detail: {},
    };
    document.title = '分润规则配置';
  }

  componentDidMount() {
    this.loadClearMerchantTypeList();
    this.loadCityList();
    this.loadBizLineList();
    this.loadSpecialFeeList();
    this.loadFeeCodesList();
    this.loadUmpFeeDetailsList();
    this.loadCarNatureList();
    this.loadMerchantTypeList();
    this.loadServerTypeList();
    request({
      url: '/pay-platform/common/dict/list/clearRuleDriverTag',
      method: 'get',
    }).then((data) => {
      const valData = [];
      data?.map((val, index) => {
        if (val?.key == '8053') {
          valData[0] = data[index];
        }
        if (val?.key == '8054') {
          valData[1] = data[index];
        }
        if (val?.key == '8052') {
          valData[2] = data[index];
        }
        if (val?.key == '8046') {
          valData[3] = data[index];
        }
        if (val?.key == '8047') {
          valData[4] = data[index];
        }
        if (val?.key == '8058') {
          valData[5] = data[index];
        }
        if (val?.key == '8051') {
          valData[6] = data[index];
        }
        if (val?.key == '8050') {
          valData[7] = data[index];
        }
        if (val?.key == '8049') {
          valData[8] = data[index];
        }
        if (val?.key != '8049' && val?.key != '8050' && val?.key != '8051' && val?.key != '8054' && val?.key != '8058' && val?.key != '8047' && val?.key != '8052' && val?.key != '8046' && val?.key != '8053') {
          valData.push(data[index]);
        }
        return valData;
      });
      this.setState({
        driverTage: valData,
      });
    });
    const { id } = this.props.params;
    if (id) {
      request({
        url: '/pay-boss/clearRule/detail',
        data: {
          groupId: id,
        },
      }).then((data) => {
        if (data.ruleType == 1) {
          data.range = [moment(data.effectiveTime), moment(data.ineffectiveTime)];
        }
        this.setState({ detail: data });
        window.sessionStorage.setItem('Step1', JSON.stringify(data));
        window.sessionStorage.setItem('Step2', JSON.stringify({
          splitModel: data.splitModel,
          ladderBaseRules: data.ruleDetail.ladderBaseRules?.map((item) => ({
            end: moment(item.ladderModel.end, 'HH:mm'),
            mileageSplitDetails: item.mileageSplitDetails?.map((e) => ({
              end: e.ladderModel.end,
              merchantSplitDetails: this.init(e.merchantSplitDetails),
              driverClearFactors: this.init(e.driverClearFactors),
              driverTagRates: e.driverTagRates ? e.driverTagRates : [],
            })),
          })),
          baseRule: this.init(data.ruleDetail.baseRule),
          baseDriverClearFactors: this.init(data.ruleDetail.baseDriverClearFactors),
        }));
        window.sessionStorage.setItem('Step3', JSON.stringify({
          specialRules: data.ruleDetail.specialRules?.map((e, i) => ({
            key: i,
            ...e,
            merchantSplitDetails: this.init(e.merchantSplitDetails),
          })),
        }));
        window.sessionStorage.setItem('Step4', JSON.stringify({
          feeCodes: data.ruleDetail.feeCodes || [],
          umpFeeCodes: data.ruleDetail.umpFeeCodes || [],
        }));
        this.setState({
          current: 0,
        });
      });
    } else {
      this.setState({
        current: 0,
      });
    }
  }

  init = (list) => {
    if (list?.length) {
      for (let index = list.length; index < 2; index++) {
        list.push({});
      }
      return list;
    }
    return undefined;
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

  loadCarNatureList() {
    request({
      ...urls.queryCarNatureList,
      data: {},
    }).then((data) => {
      this.setState({
        carNatureList: data || [],
      });
    });
  }

  loadUmpFeeDetailsList() {
    request({
      ...urls.queryUmpFeeDetailsList,
      data: {},
    }).then((data) => {
      this.setState({
        umpFeeDetailsList: data || [],
      });
    });
  }

  loadFeeCodesList() {
    request({
      ...urls.queryFeeCodesList,
      data: {},
    }).then((data) => {
      this.setState({
        feeCodesList: data || [],
      });
    });
  }

  loadSpecialFeeList() {
    request({
      ...urls.querySpecialFeeList,
      data: {},
    }).then((data) => {
      this.setState({
        specialFeeList: data || [],
      });
    });
  }

  loadServerTypeList() {
    request({
      url: '/center-settlement/basic/queryDictCarTypes',
    }).then((data) => {
      this.setState({
        serviceTypeList: [{ key: '0', value: '全部' }].concat(data || []),
      });
    });
  }

  loadClearMerchantTypeList() {
    request({
      ...urls.queryClearMerchantTypeList,
      data: {},
    }).then((data) => {
      this.setState({
        clearMerchantTypeList: data || [],
      });
    });
  }

  loadCityList() {
    request({
      ...urls.queryCityList,
      data: {},
    }).then((data) => {
      this.setState({
        cityList: data || [],
      });
    });
  }

  loadBizLineList() {
    request({
      ...urls.queryBizLineList,
      data: {},
    }).then((data) => {
      this.setState({
        bizLineList: (data || []).filter((item) => (item.key.toString() !== '0')),
      });
    });
  }

  checkPercent = (list) => {
    let percent = 0;
    list.forEach((item) => {
      percent += Number(item.clearRate || 0);
    });
    return percent == 100;
  }

  driverRate = (clearRate, value, sonVal) => {
    const abc = Number(parseFloat(clearRate || 0) + parseFloat(value || 0) + parseFloat(sonVal || 0));
    if (abc > 100 || abc < 0) {
      return false;
    }
    return true;
  }

  next = () => {
    const { type } = this.props.params;
    const current = this.state.current + 1;
    this.refs[`Step${current}`].validateFieldsAndScroll((err, values) => {
      if (!err) {
        if (current == 1 && type != 'detail') {
          if (moment(values.activateTime) < moment().endOf('day')) {
            message.error('生效时间不能小于等于当天');
            return;
          }
          if (values.ruleType == 1) {
            if (moment(values.range[0]) < moment(values.activateTime).startOf('day')) {
              message.error('用车时间段起始时间不能小于等于生效时间');
              return;
            }
          }
        }
        if (current == 2) {
          values.ladderBaseRules?.forEach((dataValue) => {
            dataValue?.mileageSplitDetails.forEach((sonVal) => {
              sonVal.merchantSplitDetails.forEach((lastVal) => {
                if (lastVal.settleUserType == '4') {
                  if (values.driverSwitch == '1') {
                    sonVal?.driverTagRates?.forEach((sonValItem) => {
                      sonVal?.driverClearFactors?.forEach((Avalue) => {
                        if (!this.driverRate(sonValItem.rate, lastVal.clearRate, Avalue.value)) {
                          message.config({
                            duration: 3, // 显示时间为 3000 毫秒，即 3 秒钟
                          });
                          message.error('司机主体 的分润比例之和  必须 ≤ 100%');
                          throw new Error('司机主体 的分润比例之和  必须 ≤ 100%');
                        }
                      });
                    });
                  } else {
                    sonVal?.driverTagRates?.forEach((sonValItem) => {
                      if (!this.driverRate(lastVal.clearRate, sonValItem.rate)) {
                        message.config({
                          duration: 3, // 显示时间为 3000 毫秒，即 3 秒钟
                        });
                        message.error('司机主体 的分润比例之和  必须 ≤ 100%');
                        // return
                        throw new Error('司机主体 的分润比例之和  必须 ≤ 100%');
                      }
                    });
                  }
                }
              });
            });
          });

          if (values.splitModel == 0) {
            if (!this.checkPercent(values.baseRule)) {
              message.error('分润规则的分润比例之和必须为100%');
              return;
            }
          }
          if (values.splitModel == 1) {
            values.ladderBaseRules.forEach((item, index) => {
              item.mileageSplitDetails?.forEach((e, i) => {
                if (!this.checkPercent(e.merchantSplitDetails)) {
                  message.error(`时间阶梯${index + 1}-里程阶梯${i + 1}分润规则的分润比例之和必须为100%`);
                  throw new Error(`时间阶梯${index + 1}-里程阶梯${i + 1}分润规则的分润比例之和必须为100%`);
                }
              });
            });
          }
        }
        if (current == 3) {
          values.specialRules?.forEach((item, index) => {
            if (!this.checkPercent(item.merchantSplitDetails)) {
              g_event_emitter.emit('formValid', index);
              message.error('分润规则的分润比例之和必须为100%');
              throw new Error('分润规则的分润比例之和必须为100%');
            }
          });
        }
        window.sessionStorage.setItem(`Step${current}`, JSON.stringify(values));
        this.setState({ current });
      } else if (current == 3) {
        const a = Object.keys(err.specialRules);
        g_event_emitter.emit('formValid', a[0]);
      }
    });
  }

  prev = () => {
    if (this.state.current == 3) {
      this.refs.Step4.validateFieldsAndScroll((err, values) => {
        if (!err) {
          window.sessionStorage.setItem('Step4', JSON.stringify(values));
        }
      });
    }
    const current = this.state.current - 1;
    this.setState({ current });
  }

  formatRule = (list) => {
    if (!list?.length) {
      return undefined;
    }
    for (let i = 0; i < list.length; i++) {
      if (list[i] == null || list[i] == '' || JSON.stringify(list[i]) == '{}' || (!list[i]?.clearRate && !list[i]?.settlePeriod)) {
        list.splice(i, 1);
        i -= 1;
      }
    }
    return list;
  }

  onSubmit = () => {
    const current = this.state.current + 1;
    this.refs[`Step${current}`].validateFieldsAndScroll((err, values) => {
      if (!err) {
        const step1 = JSON.parse(window.sessionStorage.getItem('Step1') || '{}');
        const step2 = JSON.parse(window.sessionStorage.getItem('Step2') || '{}');
        const step3 = JSON.parse(window.sessionStorage.getItem('Step3') || '{}');
        step2.baseRule = this.formatRule(step2.baseRule);

        let ladderBaseRules;
        if (step2.ladderBaseRules?.length) {
          ladderBaseRules = [];
          step2.ladderBaseRules?.forEach((item, index) => {
            ladderBaseRules.push({
              ladderModel: {
                level: index + 1, start: index == 0 ? '00:00:00' : moment(step2.ladderBaseRules[index - 1].end).format('HH:mm:00'), end: step2.ladderBaseRules.length == index + 1 ? '23:59:59' : moment(item.end).format('HH:mm:00'), isLastLadder: index == step2.ladderBaseRules.length - 1,
              },

              mileageSplitDetails: item.mileageSplitDetails?.map((e, i) => ({
                ladderModel: {
                  level: i + 1, start: i == 0 ? 0 : item.mileageSplitDetails[i - 1].end, end: e.end, isLastLadder: i == item.mileageSplitDetails.length - 1,
                },
                driverTagRates: e.driverTagRates ? e.driverTagRates : undefined,
                merchantSplitDetails: this.formatRule(e.merchantSplitDetails),
                driverClearFactors: e.driverClearFactors?.length ? e.driverClearFactors.map((facItem, facIndex) => ({
                  level: facIndex + 1,
                  start: facIndex === 0 ? facItem.start : e.driverClearFactors[facIndex - 1].end,
                  end: facItem.end,
                  value: facItem.value,
                  isLastLadder: facIndex === e.driverClearFactors.length - 1,
                })) : undefined,
              })),
            });
          });
        }
        let baseDriverClearFactors;
        if (step2.baseDriverClearFactors?.length) {
          baseDriverClearFactors = step2.baseDriverClearFactors.map((item, index) => ({
            level: index + 1,
            start: index === 0 ? item.start : step2.baseDriverClearFactors[index - 1].end,
            end: item.end,
            value: item.value,
            isLastLadder: index === step2.baseDriverClearFactors.length - 1,
          }));
        }

        step3.specialRules?.forEach((item) => {
          delete item.key;
          item.merchantSplitDetails = this.formatRule(item.merchantSplitDetails);
        });
        const companyNoList = [];
        step1?.companyNoList.forEach((val) => {
          companyNoList.push(val.key);
        });
        const data = {
          ruleName: step1.ruleName,
          ruleType: step1.ruleType,
          ruleTag: step1.ruleTag,
          cityCode: step1.cityCode,
          holidayFlag: step1?.holidayFlag?.includes(1) || step1?.holidayFlag?.includes('1') ? 1 : 0,
          bizLine: step1.bizLine,
          needInit: step1.needInit,
          // eslint-disable-next-line
          // companyNoList: Array.isArray(step1?.companyNoList) ? step1?.companyNoList : step1?.companyNoList == '0000' ? [step1?.companyNoList] : step1?.companyNoList,

          companyNoList,
          serviceType: step1.serviceType,
          carBelongType: step1.carBelongType,
          agencyIdList: step1.agencyIdList,
          activateTime: moment(step1.activateTime).format('YYYY-MM-DD 00:00:00'),
          effectiveTime: step1.ruleType == 1 ? moment(step1.range[0]).format('YYYY-MM-DD 00:00:00') : undefined,
          ineffectiveTime: step1.ruleType == 1 ? moment(step1.range[1]).format('YYYY-MM-DD 23:59:59') : undefined,
          splitModel: step2.splitModel,
          ruleDetail: {
            baseRule: step2.baseRule,
            ladderBaseRules,
            baseDriverClearFactors,
            specialRules: step3.specialRules,
            feeCodes: values.feeCodes,
            specialFeeCodes: values.specialFeeCodes,
            umpFeeCodes: values.umpFeeCodes,
          },
        };
        if (moment(step1.activateTime) < moment().endOf('day')) {
          message.error('生效时间不能小于等于当天');
          return false;
        }

        // 当有代收费用时，需要默认规则中又包含类型和主体都为司机的项
        if (data.ruleDetail.feeCodes?.length) {
          if (data.ruleDetail?.baseRule?.findIndex((item) => item.settleUserType == 4) == -1) {
            message.warn('有代收费用时，默认配置主体类型和主体必须有同时为司机的选项！');
            return;
          }
          if (data.ruleDetail?.ladderBaseRules?.length) {
            data.ruleDetail?.ladderBaseRules.forEach((item) => {
              if (item.merchantSplitDetails?.findIndex((e) => e.settleUserType == 4) == -1) {
                message.warn('有代收费用时，默认配置主体类型和主体必须有同时为司机的选项！');
                throw new Error('有代收费用时，默认配置主体类型和主体必须有同时为司机的选项！');
              }
            });
          }
        }

        const { type, id } = this.props.params;
        if (type == 'add' || type == 'copy') {
          request({
            url: '/pay-boss/clearRule/insert',
            method: 'post',
            data,
            loading: true,
            timeout: 60000,
          }).then(() => {
            message.success('操作成功', () => {
              window.close();
            });
          });
        }
        if (type == 'edit') {
          const { detail } = this.state;
          request({
            url: '/pay-boss/clearRule/update',
            method: 'post',
            data: {
              ...detail,
              ...data,
              groupId: id,
              range: undefined,
            },
            loading: true,
            timeout: 60000,
          }).then(() => {
            message.success('操作成功', () => {
              window.close();
            });
          });
        }
      }
    });
  }

  onSubmitDraft = () => {
    const current = this.state.current + 1;
    this.refs[`Step${current}`].validateFieldsAndScroll((err, values) => {
      if (!err) {
        const step1 = JSON.parse(window.sessionStorage.getItem('Step1') || '{}');
        const step2 = JSON.parse(window.sessionStorage.getItem('Step2') || '{}');
        const step3 = JSON.parse(window.sessionStorage.getItem('Step3') || '{}');
        step2.baseRule = this.formatRule(step2.baseRule);

        let ladderBaseRules;
        if (step2.ladderBaseRules?.length) {
          ladderBaseRules = [];
          step2.ladderBaseRules?.forEach((item, index) => {
            ladderBaseRules.push({
              ladderModel: {
                level: index + 1, start: index == 0 ? '00:00:00' : moment(step2.ladderBaseRules[index - 1].end).format('HH:mm:00'), end: step2.ladderBaseRules.length == index + 1 ? '23:59:59' : moment(item.end).format('HH:mm:00'), isLastLadder: index == step2.ladderBaseRules.length - 1,
              },

              mileageSplitDetails: item.mileageSplitDetails?.map((e, i) => ({
                ladderModel: {
                  level: i + 1, start: i == 0 ? 0 : item.mileageSplitDetails[i - 1].end, end: e.end, isLastLadder: i == item.mileageSplitDetails.length - 1,
                },
                driverTagRates: e.driverTagRates ? e.driverTagRates : undefined,
                merchantSplitDetails: this.formatRule(e.merchantSplitDetails),
                driverClearFactors: e.driverClearFactors?.length ? e.driverClearFactors.map((facItem, facIndex) => ({
                  level: facIndex + 1,
                  start: facIndex === 0 ? facItem.start : e.driverClearFactors[facIndex - 1].end,
                  end: facItem.end,
                  value: facItem.value,
                  isLastLadder: facIndex === e.driverClearFactors.length - 1,
                })) : undefined,
              })),
            });
          });
        }
        let baseDriverClearFactors;
        if (step2.baseDriverClearFactors?.length) {
          baseDriverClearFactors = step2.baseDriverClearFactors.map((item, index) => ({
            level: index + 1,
            start: index === 0 ? item.start : step2.baseDriverClearFactors[index - 1].end,
            end: item.end,
            value: item.value,
            isLastLadder: index === step2.baseDriverClearFactors.length - 1,
          }));
        }

        step3.specialRules?.forEach((item) => {
          delete item.key;
          item.merchantSplitDetails = this.formatRule(item.merchantSplitDetails);
        });
        const companyNoList = [];
        step1?.companyNoList.forEach((val) => {
          companyNoList.push(val.key);
        });
        const data = {
          ruleName: step1.ruleName,
          ruleType: step1.ruleType,
          ruleTag: step1.ruleTag,
          cityCode: step1.cityCode,
          bizLine: step1.bizLine,
          needInit: step1.needInit,
          holidayFlag: step1?.holidayFlag?.includes(1) || step1?.holidayFlag?.includes('1') ? 1 : 0,

          // eslint-disable-next-line
          // companyNoList: Array.isArray(step1?.companyNoList) ? step1?.companyNoList : step1?.companyNoList == '0000' ? [step1?.companyNoList] : step1?.companyNoList,

          companyNoList,
          serviceType: step1.serviceType,
          carBelongType: step1.carBelongType,
          agencyIdList: step1.agencyIdList,
          activateTime: moment(step1.activateTime).format('YYYY-MM-DD 00:00:00'),
          effectiveTime: step1.ruleType == 1 ? moment(step1.range[0]).format('YYYY-MM-DD 00:00:00') : undefined,
          ineffectiveTime: step1.ruleType == 1 ? moment(step1.range[1]).format('YYYY-MM-DD 23:59:59') : undefined,
          splitModel: step2.splitModel,
          ruleDetail: {
            baseRule: step2.baseRule,
            ladderBaseRules,
            baseDriverClearFactors,
            specialRules: step3.specialRules,
            feeCodes: values.feeCodes,
            specialFeeCodes: values.specialFeeCodes,
            umpFeeCodes: values.umpFeeCodes,
          },
        };
        if (moment(step1.activateTime) < moment().endOf('day')) {
          message.error('生效时间不能小于等于当天');
          return false;
        }

        // 当有代收费用时，需要默认规则中又包含类型和主体都为司机的项
        if (data.ruleDetail.feeCodes?.length) {
          if (data.ruleDetail?.baseRule?.findIndex((item) => item.settleUserType == 4) == -1) {
            message.warn('有代收费用时，默认配置主体类型和主体必须有同时为司机的选项！');
            return;
          }
          if (data.ruleDetail?.ladderBaseRules?.length) {
            data.ruleDetail?.ladderBaseRules.forEach((item) => {
              if (item.merchantSplitDetails?.findIndex((e) => e.settleUserType == 4) == -1) {
                message.warn('有代收费用时，默认配置主体类型和主体必须有同时为司机的选项！');
                throw new Error('有代收费用时，默认配置主体类型和主体必须有同时为司机的选项！');
              }
            });
          }
        }

        const { type, id } = this.props.params;
        if (type == 'add' || type == 'copy') {
          request({
            url: '/pay-boss/clearRule/draft/insert',
            method: 'post',
            data,
            timeout: 60000,
            loading: true,
          }).then(() => {
            message.success('操作成功', () => {
              window.close();
            });
          });
        }
        if (type == 'edit') {
          const { detail } = this.state;
          request({
            url: '/pay-boss/clearRule/draft/update',
            method: 'post',
            data: {
              ...detail,
              ...data,
              groupId: id,
              range: undefined,
            },
            timeout: 60000,
            loading: true,
          }).then(() => {
            message.success('操作成功', () => {
              window.close();
            });
          });
        }
      }
    });
  }

  render() {
    const {
      current, cityList, bizLineList, carNatureList, merchantTypeList, serviceTypeList,
      clearMerchantTypeList, specialFeeList, feeCodesList, umpFeeDetailsList,
    } = this.state;
    // const { query } = this.props.location;

    const { type } = this.props.params;
    return (
      <div style={{ padding: 20 }}>
        <Steps style={{ width: 1000, margin: '0 auto 40px' }} current={current}>
          {steps.map((item) => (
            <Step key={item.title} title={item.title} />
          ))}
        </Steps>
        <div>
          {current == 0 && (
            <Step1 ref="Step1"
              carNatureList={carNatureList}
              cityList={cityList}
              bizLineList={bizLineList}
              serviceTypeList={serviceTypeList}
              disabled={type == 'detail'}
              type={type}
            />
          )}
          {current == 1 && (
            <Step2 ref="Step2"
              merchantTypeList={merchantTypeList}
              clearMerchantTypeList={clearMerchantTypeList}
              disabled={type == 'detail'}
              driverTage={this.state.driverTage}
            />
          )}
          {current == 2 && (
            <Step3 ref="Step3"
              merchantTypeList={merchantTypeList}
              clearMerchantTypeList={clearMerchantTypeList}
              specialFeeList={specialFeeList}
              disabled={type == 'detail'}

            />
          )}
          {current == 3 && (
            <Step4 ref="Step4"
              umpFeeDetailsList={umpFeeDetailsList}
              specialFeeList={specialFeeList}
              feeCodesList={feeCodesList}
              disabled={type == 'detail'}
            />
          )}
        </div>
        <div style={{ textAlign: 'center', marginTop: 20 }}>
          {current > 0 && (
            <Button style={{ marginRight: 8 }} onClick={() => this.prev()}>
              上一步
            </Button>
          )}

          <>
            {(current === steps.length - 1 && type != 'detail') && (
              <Button type="primary" onClick={() => this.onSubmit()}>
                提交
              </Button>
            )}
            {(current === steps.length - 1 && type != 'detail') && (
              <AuthButton
                path="pay-boss/clearRule/draft/insert"
                type="primary"
                style={{ marginLeft: 8 }}
                onClick={() => this.onSubmitDraft()}
              >
                保存草稿
              </AuthButton>

            )}
          </>
          {current < steps.length - 1 && (
            <Button type="primary" onClick={() => this.next()}>
              下一步
            </Button>
          )}
        </div>
      </div>
    );
  }
}
