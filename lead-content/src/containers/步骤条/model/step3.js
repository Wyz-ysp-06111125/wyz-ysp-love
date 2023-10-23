/* eslint-disable react/no-access-state-in-setstate */
/* eslint-disable no-script-url */
/* eslint-disable max-len */
/* eslint-disable eqeqeq */
import React from 'react';
import {
  message, Tabs, Divider,
} from 'antd';
import Rule from './components/rule-kaohe';
import './index.less';

const { TabPane } = Tabs;

export default class Model extends React.Component {
  constructor(props) {
    super(props);
    this.tabIndex = 0;
    let panes = [];
    const ruleDetailList = [];
    const step3Json = JSON.parse(window.sessionStorage.getItem('step3Json') || '[]');
    const jsonOne = JSON.parse(window.sessionStorage.getItem('step1Json') || '[]');
    if (step3Json?.splitAssessRuleList?.length || step3Json?.length) {
      if (step3Json?.length) {
        step3Json.forEach((item, index) => {
          panes.push({ title: `考核指标${index + 1}`, key: `${index + 1}` });

          ruleDetailList.push(item);
          this.tabIndex += 1;
        });
      } else {
        step3Json.splitAssessRuleList.forEach((item, index) => {
          panes.push({ title: `考核指标${index + 1}`, key: `${index + 1}` });
          ruleDetailList.push(item);
          this.tabIndex += 1;
        });
      }
    } else {
      panes = [];
    }
    this.state = {
      ruleDetailList,
      panes,
      jsonOne,
      activeKey: panes?.[0]?.key,
    };
  }

  onChange = (activeKey) => {
    this.setState({ activeKey });
  };

  onEdit = (targetKey, action) => {
    this[action](targetKey);
  };

  add = (e, detail = undefined) => {
    const { panes } = this.state;
    if (panes.length >= 10) {
      message.error('考核指标上限10个');
      return;
    }
    this.tabIndex += 1;
    const activeKey = `${this.tabIndex}`;
    panes.push({ title: `考核指标${panes.length + 1}`, key: activeKey, ruleDetail: detail });
    this.setState({ panes, activeKey });
  };

  remove = (targetKey) => {
    const { ruleDetailList } = this.state;
    // eslint-disable-next-line react/no-access-state-in-setstate
    const index = this.state.panes.findIndex((pane) => targetKey == pane.key);
    ruleDetailList.splice(index, 1);
    const panes = this.state.panes.filter((pane) => pane.key !== targetKey).map((e, index) => ({ title: `考核指标${index + 1}`, key: e.key, ruleDetail: e.ruleDetail }));
    this.setState({ ruleDetailList, panes, activeKey: panes[0]?.key?.toString() });
  };

  render() {
    const {
      panes, activeKey, ruleDetailList, jsonOne,
    } = this.state;
    const { type } = this.props;
    return (
      <div>
        <Divider orientation="left">考核指标</Divider>
        <Tabs
          style={{ width: '80%', margin: '0 auto' }}
          onChange={this.onChange}
          activeKey={activeKey}
          type={type == 'detail' ? 'card' : 'editable-card'}
          onEdit={this.onEdit}
        >
          {panes.map((pane, index) => (
            <TabPane tab={pane.title} key={pane.key} closable forceRender>
              <Rule pane={pane} tag="考核指标" ref={`pane${index}`} jsonOne={jsonOne} type={type} ruleDetail={ruleDetailList[index] || pane.ruleDetail} onCopy={(e, detail) => this.add(e, detail)} />
            </TabPane>
          ))}
        </Tabs>
      </div>
    );
  }
}
