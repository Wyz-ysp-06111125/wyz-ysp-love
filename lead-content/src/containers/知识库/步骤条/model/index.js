/* eslint-disable no-nested-ternary */
/* eslint-disable no-case-declarations */
/* eslint-disable react/no-access-state-in-setstate */
/* eslint-disable no-script-url */
/* eslint-disable max-len */
/* eslint-disable eqeqeq */
import React from 'react';
import request from '@cfe/venom-request';
import {
  Steps, Button, message, Form,
} from 'antd';
import { urls } from '../config';
import Step1 from './step1';
import Step2 from './step2';
import Step3 from './step3';
import Step4 from './step4';
import Step5 from './step5';
import './index.less';

const { Step } = Steps;

const steps = [{
  title: '基本信息',
}, {
  title: '流水基数',
}, {
  title: '考核系数',
}, {
  title: '奖励项',
}, {
  title: '负激励',
}];

@Form.create()

export default class Model extends React.Component {
  constructor(props) {
    super(props);
    const { type, id } = props.params;
    this.state = {
      current: type == 'add' ? 0 : -1,
      rankRule: [],
      isOld: false,
    };
    document.title = '政策内容';
    window.sessionStorage.clear();
    if (type != 'add') {
      request({
        url: '/pay-boss/leaseSalary/policy/findSingle',
        data: {
          policyNo: id,
        },
      }).then((data) => {
        window.sessionStorage.setItem('step1Json', JSON.stringify({
          policyName: data.policyName,
          statisticMonth: data.statisticMonth,
          carBelongType: data.carBelongType,
          policyExtList: data.policyExtList,
        }));
        window.sessionStorage.setItem('step2Json', JSON.stringify({
          ...data.splitBaseRule,
        }));
        window.sessionStorage.setItem('step3Json', JSON.stringify({
          splitAssessRuleList: data.splitAssessRuleList,
        }));
        window.sessionStorage.setItem('step4Json', JSON.stringify({
          rewardRuleList: data.rewardRuleList,
        }));
        window.sessionStorage.setItem('step5Json', JSON.stringify({
          punitiveRuleList: data.punitiveRuleList,
        }));
        this.setState({
          current: 0,
        });
      });
    }
  }

  validateReward = (step, type) => {
    let { current } = this.state;
    let pass = true;
    const stepJson = [];
    Object.keys(this.refs[`${step}`].refs).forEach((key) => {
      this.refs[`${step}`].refs[`${key}`].validateFieldsAndScroll((err, values) => {
        if (!err) {
          if (step == 'step3') {
            if (values.assessType == '2') {
              // eslint-disable-next-line
              values?.ladderRule?.ruleDetail?.ladders?.map((val, idx) => {
                values.ladderRule.ruleDetail.ladders[idx].ladderLevel = parseFloat(idx + 1);
                if (values.ladderRule.indicatorValueType == '3' || values.ladderRule.indicatorValueType == '4') {
                  // eslint-disable-next-line
                  val.nextNode.ladders.map((item, itemidex) => {
                    values.ladderRule.ruleDetail.ladders[idx].nextNode.ladders[itemidex].ladderLevel = parseFloat(itemidex + 1);
                  });
                }
              });
              if (values.ladderRule.indicatorValueType == '2') {
                // eslint-disable-next-line
                values.ladderRule.ruleDetail.ladders.map((val, index) => {
                  if (values.ladderRule.ruleDetail.ladders[index].startPoint == '1') {
                    values.ladderRule.ruleDetail.ladders[index].endPoint = '1';
                    values.ladderRule.ruleDetail.ladders[index].startPoint = '1';
                  } else {
                    values.ladderRule.ruleDetail.ladders[index].endPoint = '0';
                    values.ladderRule.ruleDetail.ladders[index].startPoint = '0';
                  }
                });
              }
              if (values.ladderRule.indicatorValueType == '4') {
                // eslint-disable-next-line
                values.ladderRule.ruleDetail.ladders.map((val, index) => {
                  // eslint-disable-next-line
                  val.nextNode.ladders.map((item, itemdx) => {
                    // values.ladderRule.ruleDetail.ladders[index].nextNode.ladders[itemdx].endPoint = item.startPoint;
                    if (values.ladderRule.ruleDetail.ladders[index].nextNode.ladders[itemdx].startPoint == '1') {
                      values.ladderRule.ruleDetail.ladders[index].nextNode.ladders[itemdx].startPoint = '1';
                      values.ladderRule.ruleDetail.ladders[index].nextNode.ladders[itemdx].endPoint = '1';
                    } else {
                      values.ladderRule.ruleDetail.ladders[index].nextNode.ladders[itemdx].startPoint = '0';
                      values.ladderRule.ruleDetail.ladders[index].nextNode.ladders[itemdx].endPoint = '0';
                    }
                  });
                });
              }
            } else if (Number(values?.targetRule?.targetVal) <= Number(values?.targetRule?.baseVal)) {
              pass = false;
              message.warning('目标值必须大于底线值');
              return;
            }
          } else {
            // eslint-disable-next-line
            values?.ruleDetail?.ladders?.map((val, idx) => {
              values.ruleDetail.ladders[idx].ladderLevel = parseFloat(idx + 1);
              if (values.indicatorValueType == '3' || values.indicatorValueType == '4') {
                // eslint-disable-next-line
                val.nextNode.ladders.map((item, itemidex) => {
                  values.ruleDetail.ladders[idx].nextNode.ladders[itemidex].ladderLevel = parseFloat(itemidex + 1);
                });
              }
            });
            if (values.indicatorValueType == '2') {
              // eslint-disable-next-line
              values.ruleDetail.ladders.map((val, index) => {
                values.ruleDetail.ladders[index].endPoint = val.startPoint;
                if (values.ruleDetail.ladders[index].startPoint == '1') {
                  values.ruleDetail.ladders[index].startPoint = '1';
                  values.ruleDetail.ladders[index].endPoint = '1';
                } else {
                  values.ruleDetail.ladders[index].startPoint = '0';
                  values.ruleDetail.ladders[index].endPoint = '0';
                }
              });
            }
            if (values.indicatorValueType == '4') {
              // eslint-disable-next-line
              values.ruleDetail.ladders.map((val, index) => {
                // eslint-disable-next-line
                val.nextNode.ladders.map((item, itemdx) => {
                  values.ruleDetail.ladders[index].nextNode.ladders[itemdx].endPoint = item.startPoint;
                  if (values.ruleDetail.ladders[index].nextNode.ladders[itemdx].startPoint == '1') {
                    values.ruleDetail.ladders[index].nextNode.ladders[itemdx].endPoint = '1';
                    values.ruleDetail.ladders[index].nextNode.ladders[itemdx].startPoint = '1';
                  } else {
                    values.ruleDetail.ladders[index].nextNode.ladders[itemdx].endPoint = '0';
                    values.ruleDetail.ladders[index].nextNode.ladders[itemdx].startPoint = '0';
                  }
                });
              });
            }
          }
          stepJson.push(values);
        } else {
          pass = false;
          const { title, key: activeKey } = this.refs[`${step}`].refs[`${key}`].props.pane;
          this.refs[`${step}`].onChange(activeKey);
          message.error(`${title}配置有误，请检查`);
          throw new Error(`${title}配置有误，请检查`);
        }
      });
    });
    if (pass) {
      window.sessionStorage.setItem(`${step}Json`, JSON.stringify(stepJson));
      if (type == 'save') {
        this.doSave();
      } else {
        current += 1;
        this.setState({ current });
      }
    }
  }

  doSave = () => {
    const { type, id } = this.props.params;
    const step1Json = JSON.parse(window.sessionStorage.getItem('step1Json') || '{}');
    const step2Json = JSON.parse(window.sessionStorage.getItem('step2Json') || '[]');
    const step3Json = JSON.parse(window.sessionStorage.getItem('step3Json') || '[]');
    const step4Json = JSON.parse(window.sessionStorage.getItem('step4Json') || '[]');
    const step5Json = JSON.parse(window.sessionStorage.getItem('step5Json') || '[]');
    // eslint-disable-next-line
    step3Json.map((val, idx) => step3Json[idx].index = parseFloat(idx + 1));
    // eslint-disable-next-line
    step4Json.map((val, idx) => step4Json[idx].index = parseFloat(idx + 1));
    // eslint-disable-next-line
    step5Json.map((val, idx) => step5Json[idx].index = parseFloat(idx + 1));
    const jsonData = {
      ...step1Json,
      splitBaseRule: step2Json,
      splitAssessRuleList: step3Json,
      rewardRuleList: step4Json,
      punitiveRuleList: step5Json,
    };
    let action = urls.commit;
    if (type == 'edit') {
      action = urls.edit;
      jsonData.policyNo = id;
    }
    request({
      ...action,
      data: jsonData,
    }).then(() => {
      message.success('操作成功');
      setTimeout(() => {
        window.close();
      }, 1000);
    });
  }

  next(action) {
    let { current } = this.state;
    let pass = true;
    switch (current) {
      case 0:
        // step1得内容  传参
        this.refs.step1.validateFieldsAndScroll((err, values) => {
          if (!err) {
            values.statisticMonth = values.statisticMonth.format('YYYY-MM');
            // eslint-disable-next-line
            values.policyExtList.map((val, idx) => {
              values.policyExtList[idx].index = parseFloat(idx + 1);
            });
            window.sessionStorage.setItem('step1Json', JSON.stringify(values));
            current += 1;
            this.setState({ current });
          }
        });
        // current += 1;
        // this.setState({ current });
        break;
      case 1:
        // step2得内容
        this.refs.step2.validateFieldsAndScroll((err, values) => {
          if (!err) {
            // 每个数组都有所对应的index
            delete values.salaryType;
            // eslint-disable-next-line
            values?.accessModelList?.map((val, idx) => {
              values.accessModelList[idx].index = parseFloat(idx + 1);
            });
            // eslint-disable-next-line
            values?.statisticModel?.ruleDetail?.ladders?.map((val, idx) => {
              values.statisticModel.ruleDetail.ladders[idx].ladderLevel = parseFloat(idx + 1);
              if (values.statisticModel.indicatorValueType == '3' || values.statisticModel.indicatorValueType == '4') {
                // eslint-disable-next-line
                val.nextNode.ladders.map((item, itemidex) => {
                  values.statisticModel.ruleDetail.ladders[idx].nextNode.ladders[itemidex].ladderLevel = parseFloat(itemidex + 1);
                });
              }
            });
            // 判断数值型加布尔型 和 布尔型
            if (values.statisticModel.indicatorValueType == '2') {
              // eslint-disable-next-line
              values.statisticModel.ruleDetail.ladders.map((val, index) => {
                if (values.statisticModel.ruleDetail.ladders[index].startPoint == '1') {
                  values.statisticModel.ruleDetail.ladders[index].startPoint = '1';
                  values.statisticModel.ruleDetail.ladders[index].endPoint = '1';
                } else {
                  values.statisticModel.ruleDetail.ladders[index].startPoint = '0';
                  values.statisticModel.ruleDetail.ladders[index].endPoint = '0';
                }
              });
            }
            if (values.statisticModel.indicatorValueType == '4') {
              // eslint-disable-next-line
              values.statisticModel.ruleDetail.ladders.map((val, index) => {
                // eslint-disable-next-line
                val.nextNode.ladders.map((item, itemdx) => {
                  if (values.statisticModel.ruleDetail.ladders[index].nextNode.ladders[itemdx].startPoint == '1') {
                    values.statisticModel.ruleDetail.ladders[index].nextNode.ladders[itemdx].startPoint = '1';
                    values.statisticModel.ruleDetail.ladders[index].nextNode.ladders[itemdx].endPoint = '1';
                  } else {
                    values.statisticModel.ruleDetail.ladders[index].nextNode.ladders[itemdx].startPoint = '0';
                    values.statisticModel.ruleDetail.ladders[index].nextNode.ladders[itemdx].endPoint = '0';
                  }
                });
              });
            }
            window.sessionStorage.setItem('step2Json', JSON.stringify(values));

            current += 1;
            this.setState({ current });
          }
        });
        break;
      case 2:
        this.validateReward('step3', action);
        break;
      case 3:
        this.validateReward('step4', action);
        break;
      case 4:
        const step5Json = [];
        Object.keys(this.refs.step5.refs).forEach((key) => {
          this.refs.step5.refs[`${key}`].validateFieldsAndScroll((err, values) => {
            if (!err) {
              // eslint-disable-next-line
              values?.ruleDetail?.ladders?.map((val, idx) => {
                values.ruleDetail.ladders[idx].ladderLevel = parseFloat(idx + 1);
                if (values.indicatorValueType == '3' || values.indicatorValueType == '4') {
                  // eslint-disable-next-line
                  val.nextNode.ladders.map((item, itemidex) => {
                    values.ruleDetail.ladders[idx].nextNode.ladders[itemidex].ladderLevel = parseFloat(itemidex + 1);
                  });
                }
              });
              if (values.indicatorValueType == '2') {
                // eslint-disable-next-line
                values.ruleDetail.ladders.map((val, index) => {
                  // values.ruleDetail.ladders[index].endPoint = val.startPoint;
                  if (values.ruleDetail.ladders[index].startPoint == '1') {
                    values.ruleDetail.ladders[index].endPoint = '1';
                    values.ruleDetail.ladders[index].startPoint = '1';
                  } else {
                    values.ruleDetail.ladders[index].endPoint = '0';
                    values.ruleDetail.ladders[index].startPoint = '0';
                  }
                });
              }
              if (values.indicatorValueType == '4') {
                // eslint-disable-next-line
                values.ruleDetail.ladders.map((val, index) => {
                  // eslint-disable-next-line
                  val.nextNode.ladders.map((item, itemdx) => {
                    if (values.ruleDetail.ladders[index].nextNode.ladders[itemdx].startPoint == '1') {
                      values.ruleDetail.ladders[index].nextNode.ladders[itemdx].endPoint = '1';
                      values.ruleDetail.ladders[index].nextNode.ladders[itemdx].startPoint = '1';
                    } else {
                      values.ruleDetail.ladders[index].nextNode.ladders[itemdx].endPoint = '0';
                      values.ruleDetail.ladders[index].nextNode.ladders[itemdx].startPoint = '0';
                    }
                  });
                });
              }
              step5Json.push(values);
            } else {
              pass = false;
              const { title, key: activeKey } = this.refs.step5.refs[`${key}`].props.pane;
              this.refs.step5.onChange(activeKey);
              message.error(`${title}配置有误，请检查`);
              throw new Error(`${title}配置有误，请检查`);
            }
          });
        });

        if (pass) {
          window.sessionStorage.setItem('step5Json', JSON.stringify(step5Json));

          this.doSave();
        }
        break;
      default:
        break;
    }
  }

  prev() {
    let { current } = this.state;
    switch (current) {
      case 2:
        const step3Json = [];
        Object.keys(this.refs.step3.refs).forEach((key) => {
          step3Json.push(this.refs.step3.refs[`${key}`].getFieldsValue());
        });
        window.sessionStorage.setItem('step3Json', JSON.stringify(step3Json));
        break;
      case 3:
        const step4Json = [];
        Object.keys(this.refs.step4.refs).forEach((key) => {
          step4Json.push(this.refs.step4.refs[`${key}`].getFieldsValue());
        });
        window.sessionStorage.setItem('step4Json', JSON.stringify(step4Json));
        break;
      case 4:
        const step5Json = [];
        Object.keys(this.refs.step5.refs).forEach((key) => {
          step5Json.push(this.refs.step5.refs[`${key}`].getFieldsValue());
        });
        window.sessionStorage.setItem('step5Json', JSON.stringify(step5Json));
        break;
      default:
        break;
    }
    current -= 1;
    this.setState({ current });
  }

  render() {
    const {
      current, rankRule, isOld,
    } = this.state;
    const { type } = this.props.params;
    return (
      <div className="policy-configuration">
        <Steps current={current} style={{ width: 800, margin: '20px auto' }}>
          {steps.map((item) => (
            <Step key={item.title} title={item.title} />
          ))}
        </Steps>
        <div className={`${type == 'detail' ? 'detail' : ''} steps-content`}>
          {current == 0 && <Step1 ref="step1" type={type} rankRule={rankRule} isOld={isOld} />}
          {current == 1 && <Step2 ref="step2" type={type} />}
          {current == 2 && <Step3 ref="step3" type={type} />}
          {current == 3 && <Step4 ref="step4" type={type} />}
          {current == 4 && <Step5 ref="step5" type={type} />}
        </div>
        <div className="steps-action">
          {current > 0 && (
            <Button style={{ marginLeft: 8 }} onClick={() => this.prev()}>
              上一步
            </Button>
          )}
          {/* {(type !== 'detail' && type != 'edit') && (
            <Button type="primary" onClick={() => this.next('save')}>
              保存
            </Button>
          )} */}
          {current === steps.length - 1 && type !== 'detail' && (
            <Button type="primary" onClick={() => this.next('submit')}>
              提交
            </Button>
          )}
          {current < steps.length - 1 && (
            <Button type="primary" onClick={() => this.next()}>
              下一步
            </Button>
          )}
          <Button onClick={() => window.close()}>关闭</Button>
        </div>
      </div>
    );
  }
}
