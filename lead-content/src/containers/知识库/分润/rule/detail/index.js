import React, { Component } from 'react';
import { Form, Button, message } from 'antd';
import { Auth, request } from '@cfe/caopc-center-common';
import moment from 'moment';
import CModal from '@/components/cModal';
import { range } from 'lodash';
import { urls } from '../config';

import FirstStep from './firstStep';
import SecondStep from './secondStep';

const baseTemplete = {
  clearRate: undefined, merchantNo: undefined, settlePeriod: undefined, settleUserType: undefined,
};

const specialTemplete = {
  feeCodes: [],
  merchantSplitDetails: [],
};

export default class AdvancedModal extends Component {
  constructor(props) {
    super(props);
    this.getKey = this.keyGenerator();// 唯一键生成器
    this.state = {
      showModal: false,
      step: 1,
      detail: this.initData(),
      prefixTitle: '分润规则',
    };

    this.fetch = {};

    if (props.type === 'modify') {
      this.fetch = urls.modify;
    } else if (props.type === 'add' || props.type === 'copy') {
      this.fetch = urls.add;
    }
  }


  componentDidMount() {

  }


  getCustomRender() {
    return (form) => {
      const {
        cityList, bizLineList, carNatureList, merchantTypeList,
        clearMerchantTypeList, specialFeeList, umpFeeDetailsList, feeCodesList, type,
      } = this.props;
      const { step, detail } = this.state;
      const disabled = type === 'look';
      return (
        <Form className="search-form liquidation" layout="inline">
          {
            step === 1
            && (
              <FirstStep
                templete={{
                  baseTemplete,
                  specialTemplete,
                }}
                baseRuleFormat={(data, templete) => {
                  this.baseRuleFormat(data, templete);
                }}
                type={type}
                getKey={this.getKey}
                disabled={disabled}
                detail={detail}
                form={form}
                cityList={cityList}
                bizLineList={bizLineList}
                carNatureList={carNatureList}
                merchantTypeList={merchantTypeList}
                clearMerchantTypeList={clearMerchantTypeList}
                specialFeeList={specialFeeList}
              />
            )
          }
          {
            step === 2
            && (
              <SecondStep
                form={form}
                type={type}
                disabled={disabled}
                detail={detail}
                specialFeeList={specialFeeList}
                umpFeeDetailsList={umpFeeDetailsList}
                feeCodesList={feeCodesList}
              />
            )
          }
        </Form>
      );
    };
  }


  keyGenerator() {
    let key = 0;
    return () => {
      key += 1;
      return key;
    };
  }

  initData() {
    const data = this.props.record ? JSON.parse(JSON.stringify(this.props.record))
      : {
        agencyIdList: undefined,
        bizLine: undefined,
        carBelongType: undefined,
        cityCode: undefined,
        activateTime: undefined,
        ruleName: undefined,
        ruleDetail: {
          baseRule: [], // 默认规则
          specialRules: [], // 特殊规则
          feeCodes: [], // 代收费用
          specialFeeCodes: [], // 特殊费用
          umpFeeCodes: [], // 优惠金额
        },
      };
    this.baseRuleFormat(data.ruleDetail.baseRule, baseTemplete);
    this.specialRulesFormat(data.ruleDetail.specialRules, baseTemplete);
    return data;
  }

  baseRuleFormat(data, templete) {
    if (!data) {
      data = [];
    }
    data.forEach((item) => {
      item.key = this.getKey();
    });

    if (data.length < 3) {
      for (let i = 0, len = 3 - data.length; i < len; i += 1) {
        data.push({
          ...templete,
          key: this.getKey(),
        });
      }
    }
  }

  specialRulesFormat(data, templete) {
    if (!data) {
      return;
    }
    data.forEach((item) => {
      item.key = this.getKey();
      item.merchantSplitDetails = item.merchantSplitDetails || [];
      item.merchantSplitDetails.forEach((childItem) => {
        childItem.key = this.getKey();
      });
      if (item.merchantSplitDetails.length < 3) {
        for (let i = 0, len = 3 - item.merchantSplitDetails.length; i < len; i += 1) {
          item.merchantSplitDetails.push({
            ...templete,
            key: this.getKey(),
          });
        }
      }
    });
  }

  handleOnOver(data) {
    const { loadData } = this.props;
    if (data && loadData) {
      loadData();
    }
    this.setState({
      showModal: false,
    });
  }

  handleOnClick() {
    return () => {
      this.setState({
        showModal: true,
        step: 1,
        detail: this.initData(),
      });
    };
  }

  handleCancel() {
    return (form, e) => {
      console.log(form, e);
      this.handleOnOver();
    };
  }

  handleOk() {
    return (form, e) => {
      console.log(form, e);
      const { children } = this.props;
      const { detail } = this.state;
      form.validateFields((err, fieldValues) => {
        if (!err) {
          if (this.validateSecondData(fieldValues)) {
            const submitData = JSON.parse(JSON.stringify(detail));
            submitData.ruleDetail.baseRule = submitData.ruleDetail.baseRule.filter((item) => {
              delete item.key;
              return !Object.keys(item).some((key) => (item[key] === undefined || item[key] === null || item[key] === '')) && !!Object.keys(item).length;
            });
            submitData.ruleDetail.specialRules.forEach((item) => {
              delete item.key;
              item.merchantSplitDetails = item.merchantSplitDetails.filter((merchantItem) => {
                delete merchantItem.key;
                return !Object.keys(merchantItem).some((key) => (merchantItem[key] === undefined || merchantItem[key] === null || merchantItem[key] === ''))
                  && !!Object.keys(merchantItem).length;
              });
            });

            // 当有代收费用时，需要默认规则中又包含类型和主体都为司机的项
            if (submitData.ruleDetail.feeCodes && submitData.ruleDetail.feeCodes.length) {
              if (!submitData.ruleDetail.baseRule.find((item) => item.settleUserType === 4 || item.settleUserType === '4'/*  && item.merchantNo === 4 */)) {
                message.warn('有代收费用时，默认配置主体类型和主体必须有同时为司机的选项！');
                return;
              }
            }

            console.log(submitData, this.state.detail);

            request({
              ...this.fetch,
              data: submitData,
            }).then((data) => {
              message.success(`${children}成功！`);
              this.handleOnOver(data || true);
            });
          }
        }
      });
    };
  }

  handleNext(flag) {
    return (form, e) => {
      console.log(form, e);
      const { type } = this.props;
      if (type === 'look') {
        this.setState({
          step: this.state.step + flag,
          prefixTitle: flag < 0 ? '分润规则' : '分润费用',
        });
        return;
      }

      if (flag > 0) {
        form.validateFields((err, fieldValues) => {
          if (!err) {
            if (this.validateFirstData(fieldValues)) {
              this.setState({
                step: this.state.step + flag,
                prefixTitle: '分润费用',
              });
            }
          }
        });
      } else {
        form.validateFields((err, fieldValues) => {
          if (this.validateSecondData(fieldValues)) {
            this.setState({
              step: this.state.step + flag,
              prefixTitle: '分润规则',
            });
          }
        });
      }
    };
  }

  validateFirstData(fieldValues) {
    const { detail } = this.state;
    const baseRule = [];
    const specialRulesTokens = {};
    const specialRules = [];

    console.log(fieldValues);
    fieldValues.activateTime = fieldValues.activateTime?.format('YYYY-MM-DD 00:00:00');
    delete fieldValues.range;

    if (moment(fieldValues.activateTime) && moment(fieldValues.activateTime) < moment().endOf('day')) {
      message.error('生效时间不能小于等于当天');
      return false;
    }

    Object.keys(fieldValues).forEach((key) => {
      if (key.indexOf('baseRule_item_') > -1) {
        baseRule.push(fieldValues[key]);
      }
      if (key.indexOf('specialRules_item_child_') > -1) {
        const index = key.split('specialRules_item_child_')[1].split('_');
        if (specialRulesTokens[index[0]]) {
          specialRulesTokens[index[0]].merchantSplitDetails.push(fieldValues[key]);
          if (!specialRulesTokens[index[0]].feeCodes) {
            specialRulesTokens[index[0]].feeCodes = fieldValues[`specialRules_item_fee_${index[0]}`];
          }
        } else {
          specialRulesTokens[index[0]] = {
            feeCodes: fieldValues[`specialRules_item_fee_${index[0]}`],
            merchantSplitDetails: [
              fieldValues[key],
            ],
            key: index[0],
          };
        }
      }
    });

    // 校验基础规则分润比例
    let baseRuleSum = 0;
    for (let j = 0, jlen = baseRule.length; j < jlen; j += 1) {
      baseRuleSum += parseFloat(baseRule[j].clearRate || 0) * 100;
    }

    if (baseRuleSum !== parseFloat(100) * 100) {
      message.warn('基础分润规则的分润比例之和必须为100%');
      return false;
    }


    // 初始化特殊费用
    detail.ruleDetail.specialFeeCodes = [];


    // 校验特殊规则分润比例
    for (let i = 0, keys = Object.keys(specialRulesTokens), ilen = keys.length; i < ilen; i += 1) {
      let sum = 0;
      const { merchantSplitDetails } = specialRulesTokens[keys[i]];
      for (let k = 0, klen = merchantSplitDetails.length; k < klen; k += 1) {
        sum += parseFloat(merchantSplitDetails[k].clearRate || 0) * 100;
      }
      if (sum !== parseFloat(100) * 100) {
        message.warn('特殊分润规则的分润比例之和必须为100%');
        return false;
      }
      merchantSplitDetails.sort((a, b) => a.key - b.key);
      specialRules.push(specialRulesTokens[keys[i]]);
      detail.ruleDetail.specialFeeCodes = [
        ...detail.ruleDetail.specialFeeCodes,
        ...specialRulesTokens[keys[i]].feeCodes,
      ];
    }

    detail.ruleDetail.specialFeeCodes = Array.from(new Set(detail.ruleDetail.specialFeeCodes));

    baseRule.sort((a, b) => a.key - b.key);
    specialRules.sort((a, b) => a.key - b.key);

    detail.ruleDetail.baseRule = baseRule;
    detail.ruleDetail.specialRules = specialRules;

    // 判断默认规则和特殊规则中主体类型和主体一致的，结算周期是否一致，不一致不通过校验
    // todo
    if (baseRule.find((baseItem) => {
      if (!baseItem.settleUserType) {
        return false;
      }
      return specialRules.find((specialItem) => specialItem.merchantSplitDetails.find((specialItemChild) => {
        if (specialItemChild.settleUserType) {
          return false;
        }
        if (specialItemChild.settleUserType === baseItem.settleUserType
          && specialItemChild.merchantNo === baseItem.merchantNo
          && specialItemChild.settlePeriod === baseItem.settlePeriod) {
          message.warn('特殊规则中不能存在主体类型，主体，结算周期与默认规则都相同的！');
          return true;
        }
        return false;
      }));
    })) {
      return false;
    }

    // 将编辑信息映射到detail中保存
    Object.keys(detail).forEach((key) => {
      if (key !== 'ruleDetail') {
        if (key === 'activateTime') {
          detail.activateTime = fieldValues.activateTime;
        } else {
          detail[key] = fieldValues[key] === undefined
            ? (detail[key] || undefined) : fieldValues[key];
        }
      }
    });

    console.log('validateData:', detail);
    return true;
  }

  validateSecondData(fieldValues) {
    const { detail } = this.state;
    // 映射第二步信息到detail
    Object.keys(fieldValues).forEach((key) => {
      detail.ruleDetail[key] = fieldValues[key] || [];
    });
    return true;
  }

  renderFooter() {
    const { step } = this.state;
    const { type } = this.props;
    const footer = [
      <Button
        key="no"
        type="ghost"
        size="large"
        onClick={this.handleCancel()}
      >取消</Button>,
    ];
    if (step === 1) {
      footer.push(<Button
        key="next"
        type="ghost"
        size="large"
        onClick={this.handleNext(1)}
      >下一步</Button>);
    }
    if (step === 2) {
      footer.push(<Button
        key="pre"
        type="ghost"
        size="large"
        onClick={this.handleNext(-1)}
      >上一步</Button>);
      if (type !== 'look') {
        footer.push(<Button
          key="ok"
          type="primary"
          size="large"
          onClick={this.handleOk()}
        >保存</Button>);
      }
    }
    return footer;
  }

  render() {
    const {
      title, loadData, children, authType, type,
    } = this.props;
    const { showModal, step, prefixTitle } = this.state;

    return (
      <span>
        {
          type === 'look'
            ? (
              <a
                onClick={this.handleOnClick()}
                style={{ marginRight: 8 }}
              >{children || title}</a>
            )
            : (
              <Auth
                url={this.fetch.url}
                authType={authType || 'link'}
                onClick={this.handleOnClick()}
                type="primary"
              >{children || title}</Auth>
            )
        }

        {
          showModal
            ? (
              <CModal
                visible
                width={step === 1 ? 1250 : 628}
                wrapForm={(form) => {
                  this.form = form;
                }}
                onOver={(data) => {
                  this.handleOnOver(data);
                }}
                fetch={{
                  ...fetch,
                  body: (form, callback) => {
                    form.validateFields((err, fieldValues) => {
                      if (!err) {
                        callback(fieldValues);
                      }
                    });
                  },
                }}
                loadData={loadData}
                title={`${title}-${prefixTitle}`}
                okText="保存"
                cancelText="取消"
                customRender={this.getCustomRender()}
                footer={this.renderFooter()}
                maskClosable={false}
              />
            ) : null
        }

      </span>
    );
  }
}
