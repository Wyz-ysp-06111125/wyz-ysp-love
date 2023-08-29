/* eslint-disable no-script-url */
/* eslint-disable max-len */
/* eslint-disable eqeqeq */
import React from 'react';
import moment from 'moment';
import {
  Button, Select, Tooltip, Modal, message, Spin,
} from 'antd';
import {
  request, Log, SelectMax,
} from '@cfe/caopc-center-common';
import { Auth, PageTemplate } from '@cfe/venom';
import debounce from 'lodash/debounce';
import AuthButton from '@/components/auth-button';
import { urls, RULE_TYPE, RULE_TAG } from './config';
import Rollback from './component/rollback';
import ModalRule from '../modal';
import Status from './status';
import '../index.less';

const { Option } = Select;

export default class List extends React.Component {
  constructor(props) {
    document.title = '分润规则配置';
    super(props);
    this.state = {
      data: [],
      backData: undefined,
      visiable: false,
      divideVisiable: false,
      fetching: false,
      cityList: [], // 城市
      leaseholdersList: [], // 租赁商
      bizLineList: [], // 业务线
      statusList: [], // 状态
      carNatureList: [], // 车辆所属性质
      serviceTypeList: [],
      // selectedRows: [],
      selectedRowKeys: [],
      Keys: [],
    };
    document.addEventListener('visibilitychange', () => {
      this.onSearch();
    });
    this.lastFetchId = 0;
    this.fetchCompany = debounce(this.fetchCompany, 400);
    this.columns = [
      {
        title: '分组编号',
        dataIndex: 'groupId',
        width: 90,
      },
      {
        title: '分润规则名称',
        dataIndex: 'ruleName',
        // width: 180,
      },
      {
        title: '规则类别',
        dataIndex: 'ruleType',
        // width: 120,
        render: (text) => RULE_TYPE[text],
      },
      {
        title: '标签',
        dataIndex: 'ruleTag',
        // width: 120,
        render: (text) => RULE_TAG[text],
      },
      {
        title: '业务因素',
        dataIndex: 'no-ywys',
        children: [
          {
            title: '城市',
            dataIndex: 'cityCode',
            width: 80,
            render: (text) => (this.state.cityList.find((item) => item.key.toString() === text.toString()) || {}).value,
          },
          {
            title: '业务线',
            dataIndex: 'bizLine',
            width: 80,
            render: (text) => (this.state.bizLineList.find((item) => item.key.toString() === text.toString()) || {}).value,
          },
          {
            title: '车辆所属性质',
            dataIndex: 'carBelongType',
            width: 120,
            render: (text) => (this.state.carNatureList.find((item) => item.key.toString() === text.toString()) || {}).value,
          },
          {
            title: '听单等级',
            dataIndex: 'serviceType',
            width: 120,
            render: (text) => (this.state.serviceTypeList.find((item) => item.key.toString() === text?.toString()) || {}).value,
            // render: (text, record) => record?.agencyNameList?.map((e) => e)?.join(','),
            // render: text => (this.state.leaseholdersList.find(item =>
            //   item.key.toString() === text.toString()) || {}).value
          },
          {
            title: '渠道',
            dataIndex: 'companyNameList',
            width: 200,
            render: (text, record) => {
              if (record?.companyNameMap) {
                const data = Object.entries(record?.companyNameMap).map(([key, value]) => ({ key, value }));
                return (
                  <Tooltip title={data?.map((e) => e.value)?.join(',')}>
                    {data?.slice(0, 3)?.map((e) => e.value)?.join(',')}
                    {data?.length > 3 ? '...' : null}
                  </Tooltip>
                );
              }
            },
          },
          {
            title: '租赁商',
            dataIndex: 'agencyName',
            // width: 200,
            render: (text, record) => (
              <Tooltip title={record?.agencyNameList?.map((e) => e)?.join(',')}>
                {record?.agencyNameList?.slice(0, 3)?.map((e) => e)?.join(',')}
                {record?.agencyNameList?.length > 3 ? '...' : null}
              </Tooltip>
            ),
            // render: text => (this.state.leaseholdersList.find(item =>
            //   item.key.toString() === text.toString()) || {}).value
          },
        ],
      },
      {
        title: '状态',
        dataIndex: 'status',
        // width: 80,
        render: (text) => (this.state.statusList.find((item) => item.key.toString() === text.toString()) || {}).value,
      },
      // {
      //   title: '创建时间',
      //   dataIndex: 'createTime',
      //   width: 160,
      // },
      {
        title: '更新时间',
        dataIndex: 'updateTime',
        // width: 160,
      },
      {
        title: '生效时间',
        dataIndex: 'activateTime',
        // width: 160,
      },
      {
        title: '失效时间',
        dataIndex: 'inactivateTime',
        width: 160,
      }, {
        title: '创建人/最后操作人',
        dataIndex: 'createOperator',
        width: 160,
        render: (text, record) => (
          <span>{text}/{record.lastOperator}</span>
        ),
      },
      {
        title: '操作',
        dataIndex: 'action',
        // width: 150,
        render: (text, record) => ([
          <a
            style={{ marginRight: 5 }}
            key={1}
            href={`/financial-center/liquidation/rule/detail/${record.groupId}`}
            target="_blank"
            rel="noreferrer"
          >查看</a>,
          <a
            style={{ marginRight: 5 }}
            key={6}
            href={`/financial-center/liquidation/rule/copy/${record.groupId}?status=${record.status}`}
            target="_blank"
            rel="noreferrer"
          >复制</a>,

          ((record.status == 1 && record.activateTime.slice(-8) == '00:00:00') && (
            <AuthButton
              type="link"
              style={{ marginRight: 5, padding: 0 }}
              // noAuthType="disabled"
              path="pay-boss/clearRule/effectiveNow"
              onClick={() => { this.onTakeeffect(record); }}
            >
              立即生效
            </AuthButton>

          )),
          ((record.status == 0) && (
            <AuthButton
              type="link"
              style={{ marginRight: 5, padding: 0 }}
              // noAuthType="disabled"
              path="pay-boss/clearRule/update"
              onClick={() => { this.onSubmitForReview(record); }}
            >
              提交审核
            </AuthButton>

          )),
          (record.status == 100 || record.needShowSpecialRule == true && (
            <AuthButton
              type="link"
              style={{ marginRight: 5, padding: 0 }}
              // noAuthType="disabled"
              // type="primary"
              path="pay-boss/clearRule/ineffectiveNow"
              onClick={() => { this.onAudit(record); }}
            >
              立即失效
            </AuthButton>

          )),
          (record.status == 100 && (

            <AuthButton
              type="link"
              style={{ marginRight: 5, padding: 0 }}
              path="pay-boss/clearRule/findAllRealDisableList"
              onClick={() => { this.onRollback(record); }}
            >
              回滚替换
            </AuthButton>
          )),
          (record.status == 3 || record.status == 0) ? (
            <a
              style={{ marginRight: 5 }}
              key={2}
              href={`/financial-center/liquidation/rule/edit/${record.groupId}?status=${record.status}`}
              target="_blank"
              rel="noreferrer"
            >修改</a>
          ) : null,
          (record.status == 3 || record.status == 0) ? (
            <Auth
              style={{ marginRight: 5 }}
              type="link"
              url={urls.invalid.url}
              onClick={() => this.onValid(record)}
            >作废</Auth>
          ) : null,
          (
            record.needShowSpecialRule != true && (
              ((record.status.toString() === '1' && record.cityCode != '0000') || (record.status.toString() === '100' && record.cityCode != '0000'))
                ? (
                  <Status
                    key={3}
                    status={record.status}
                    title="停用"
                    record={record}
                    loadData={this.onSearch}
                    fetch={urls.changeStatus}
                  />
                )
                : null

            )

          ),
          <Log
            key={5}
            title="日志"
            url={urls.log.url}
            query={{
              model: 6,
              type: 9,
              sourceId: record.groupId,
            }}
            text="日志"
            width={600}
            columns={[
              {
                title: '操作时间',
                dataIndex: 'createTime',
              },
              {
                title: '操作人',
                dataIndex: 'operator',
              },
              {
                title: '操作类型',
                dataIndex: 'operateType',
              },
              {
                title: '操作内容',
                dataIndex: 'content',
              },
            ]}
          />,
        ]),
      },
    ];
  }

  componentDidMount() {
    this.fetchCompany();
    this.loadLeaseholdersList();
    this.loadCityList();
    this.loadBizLineList();
    this.loadServerTypeList();
    this.loadStatusList();
    this.loadCarNatureList();
  }

  // 立即失效
  onAudit = (record) => {
    Modal.confirm({
      title: '确认',
      content: `点击确定后，规则-${record.ruleName}-   至少将于10分钟后失效，请确认！！`,
      onOk: async () => {
        await request({
          ...urls.auditContenr,
          data: {
            groupId: record.groupId,
          },
        });
        message.success('操作成功');
        this.onSearch(1);
      },
    });
  }

  // 立即生效
  onTakeeffect = (record) => {
    Modal.confirm({
      title: '确认',
      content: `点击确定后，规则-${record.ruleName}-将立刻生效，请确认！！`,
      onOk: async () => {
        await request({
          ...urls.takeeffect,

          data: {
            groupId: record.groupId,
          },
        });
        message.success('操作成功');
        this.onSearch(1);
      },
    });
  }

  // 提交审核
  onSubmitForReview = (record) => {
    let data;
    request({
      url: '/pay-boss/clearRule/detail',
      data: {
        groupId: record.groupId,
      },
    }).then((res) => {
      res.ruleName = res?.ruleName?.split('_')[1];
      data = res;
    });
    // if (data) {
    Modal.confirm({
      title: '确认',
      content: `点击确定后，规则-${record.ruleName}-将提交审核，请确认！！`,
      onOk: async () => {
        await request({
          ...urls.onSubmitForReview,
          data: {
            ...data,
            groupId: record.groupId,
          },
          timeout: 60000,
        });
        message.success('操作成功');
        this.onSearch(1);
      },
    });
    // }
  }

  // 立即回滚
  onRollback = (record) => {
    this.setState({
      visiable: true,
      backData: record,
    });
  }

  onValid = (record) => {
    Modal.confirm({
      title: '确认',
      content: '是否确认作废该记录？',
      onOk: async () => {
        await request({
          ...urls.invalid,
          data: {
            groupId: record.groupId,
          },
        });
        message.success('操作成功');
        this.onSearch(1);
      },
    });
  }

  getConfig() {
    return {
      url: urls.queryPageList,
      searchOnLoad: true,
      // pageSize: 20,
      searchOnVisible: true,
      beforeRequest: (values) => {
        this.setState({
          selectedRowKeys: [],
          Keys: [],
        });
        if (values.date && values.date.length) {
          values.createTimeStart = `${values.date[0].format('YYYY-MM-DD')} 00:00:00`;
          values.createTimeEnd = `${values.date[1].format('YYYY-MM-DD')} 23:59:59`;
        }
        if (values.updateTime && values.updateTime.length) {
          values.updateTimeStart = `${values.updateTime[0].format('YYYY-MM-DD')} 00:00:00`;
          values.updateTimeEnd = `${values.updateTime[1].format('YYYY-MM-DD')} 23:59:59`;
        }
        if (values.companyNoList) {
          values.companyNo = values.companyNoList?.key;
        }
        delete values.companyNoList;
        delete values.date;
        delete values.updateTime;
        return values;
      },
      exportProps: {
        url: urls.export,
      },

      beforeExport: (values) => {
        if (values.date && values.date.length) {
          values.createTimeStart = `${values.date[0].format('YYYY-MM-DD')} 00:00:00`;
          values.createTimeEnd = `${values.date[1].format('YYYY-MM-DD')} 23:59:59`;
        }
        if (values.updateTime && values.updateTime.length) {
          values.updateTimeStart = `${values.updateTime[0].format('YYYY-MM-DD')} 00:00:00`;
          values.updateTimeEnd = `${values.updateTime[1].format('YYYY-MM-DD')} 23:59:59`;
        }
        if (values.companyNoList) {
          values.companyNo = values.companyNoList?.key;
        }
        delete values.companyNoList;
        delete values.date;
        delete values.updateTime;
        return values;
      },
    };
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

  loadServerTypeList() {
    request({
      url: '/pay-boss/basic/queryCarServiceType',
      method: 'get',
      data: {
        cityCode: '0000',
      },
    }).then((data) => {
      this.setState({
        serviceTypeList: data,
      });
    });
  }

  loadStatusList() {
    request({
      ...urls.queryStatusList,
      data: {},
    }).then((data) => {
      this.setState({
        statusList: data || [],
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

  loadLeaseholdersList(cityCode) {
    request({
      ...urls.queryLeaseholdersList,
      data: {
        cityCode,
      },
    }).then((data) => {
      this.setState({
        leaseholdersList: data || [],
      });
    });
  }

  handleOnchange(key) {
    return (value) => {
      if (key === 'cityCode') {
        this.form.setFieldsValue({
          agencyId: undefined,
        });
        this.loadLeaseholdersList(value);
      }
    };
  }

  renderFilter() {
    const {
      cityList, leaseholdersList, bizLineList, statusList, serviceTypeList, data, fetching,
    } = this.state;
    return [{
      component: 'Input',
      key: 'ruleNo',
      label: '规则编号',
    },
    {
      component: 'Input',
      key: 'groupId',
      label: '分组编号',
    },
    {
      component: 'Input',
      key: 'ruleName',
      label: '分润规则名称',
    },
    {
      component: <Select
        className="input-md"
        allowClear
        placeholder="请选择"
        showSearch
        optionFilterProp="children"
        onChange={this.handleOnchange('cityCode')}
      >
        {cityList.map((item) => (
          <Option
            key={item.key}
            value={item.key}
          >{item.value}</Option>
        ))}
      </Select>,
      key: 'cityCode',
      label: '城市',
      selectOptions: cityList,
    },
    {
      component: <Select
        className="input-md"
        allowClear
        placeholder="请选择"
        showSearch
        optionFilterProp="children"
      >
        {leaseholdersList.map((item) => (
          <Option
            key={item.key}
            value={item.key}
          >{item.value}</Option>
        ))}
      </Select>,
      key: 'agencyId',
      label: '租赁商',
      selectOptions: leaseholdersList,
    },
    {
      component: 'Select',
      key: 'bizLine',
      label: '业务线',
      selectOptions: bizLineList,
    },
    {
      component: <SelectMax
        style={{ width: 200 }}
        options={serviceTypeList}
        placeholder="请选择"
        showSearch
        optionFilterProp="children"
      />,
      key: 'serviceType',
      label: '听单等级',
    },
    {
      component: <Select
        allowClear
        showSearch
        labelInValue
        placeholder="请选择"
        notFoundContent={fetching ? <Spin size="small" /> : null}
        filterOption={false}
        onSearch={this.fetchCompany}
        onChange={this.handleChange}
        style={{ width: 200 }}
      >
        {data.map((d) => (
          <Option key={d.id} title={d.name}>{d.name}</Option>
        ))}
      </Select>,
      key: 'companyNoList',
      label: '渠道',
    },
    {
      component: 'Select',
      key: 'status',
      label: '状态',
      selectOptions: statusList,
    },
    {
      component: 'Select',
      key: 'ruleType',
      label: '规则类别',
      selectOptions: Object.keys(RULE_TYPE)?.map((key) => ({ key, value: RULE_TYPE[key] })),
    },
    {
      component: 'Select',
      key: 'ruleTag',
      label: '标签',
      selectOptions: Object.keys(RULE_TAG)?.map((key) => ({ key, value: RULE_TAG[key] })),
    },
    // {
    //   component: 'RangePicker',
    //   key: 'date',
    //   label: '创建时间',
    // },
    {
      component: 'RangePicker',
      key: 'updateTime',
      label: '更新时间',
    },
      // {
      //   component: "Input",
      //   key: "creat",
      //   label: "创建人/最后操作人"
      // },
    ];
  }

  renderToolbar() {
    return [
      <Button type="primary" style={{ marginRight: 20 }} onClick={() => window.open('/financial-center/liquidation/rule/add')}>新增</Button>,
      <AuthButton
        type="primary"
        style={{ marginRight: 5, padding: '5 10' }}
        path="pay-boss/clearRule/batch/change/driverTagRate"
        onClick={() => this.divideRan()}
      >
        分润调控
      </AuthButton>,
    ];
  }

  divideRan = () => {
    this.setState({
      divideVisiable: true,
    });
  }

  renderEleAfterSearchBtn() {
    return null;
  }

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
        // for fetch callback order
        return;
      }
      this.setState({
        data: [{ id: '0000', name: '全部' }, ...res],
        fetching: false,
      });
    });
  };

  handleChange = () => {
    this.setState({
      fetching: false,
    });
  };

  onBack = () => {
    this.setState({
      visiable: false,
    });
    this.onSearch(1);
  }

  // 复选内容
  onChangeRowSelection = (selectedRowKeys, selectedRows) => {
    const Keys = [];
    selectedRows?.forEach((val) => {
      Keys.push(val.groupId);
    });
    this.setState({
      selectedRowKeys,
      Keys,
    });
  }

  onOk = () => {
    this.setState({
      divideVisiable: false,
    });

    this.onSearch(1);
    this.setState({
      selectedRowKeys: [],
      // selectedRows: [],
    });
  }

  onCancel = () => {
    this.setState({
      divideVisiable: false,
    });
  }

  render() {
    const {
      visiable, backData, selectedRowKeys, divideVisiable, Keys,
    } = this.state;
    const rowSelection = {
      // 是否显示左边显示的多选框
      fixed: true,
      // 触发的事件    第一个是每一行的id  后端需要传参，第二个是获取到整行的内容
      selectedRowKeys,
      onChange: (selectedRowKeys, selectedRows) => {
        // console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
        // 绑定一个事件  就是你触发完函数  可以存储在state里面拿出来用
        this.onChangeRowSelection(selectedRowKeys, selectedRows);
      },
      // 用来禁止那些不可选的选项  参数获取的是整行的数据
      getCheckboxProps: (record) => ({
        // 有禁止的选项
        disabled: record.status !== 100,
      }),
    };
    return (
      <div style={{ padding: 20 }} className="liquidation">
        <PageTemplate
          rowClassName={(record) => ((record.status == 100 && moment(record.inactivateTime).diff(moment(), 'days') < 7) ? 'overdue' : '')}
          needExport
          rowKey="id"
          {...this.getConfig()}
          filter={this.renderFilter()}
          eleAfterSearchBtn={this.renderEleAfterSearchBtn()}
          toolbar={this.renderToolbar()}
          tableProps={{
            rowSelection,
          }}
          columns={this.columns}
          connect={({ onSearch, form }) => { this.onSearch = onSearch; this.form = form; }}
        />
        {visiable && <Rollback onBack={this.onBack} data={backData} />}
        {divideVisiable && <ModalRule selectedRowKeys={Keys} onOk={this.onOk} onCancel={this.onCancel} />}
      </div>
    );
  }
}
