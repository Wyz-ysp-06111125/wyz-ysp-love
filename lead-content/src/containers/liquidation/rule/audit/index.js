/* eslint-disable max-len */
/* eslint-disable eqeqeq */
import React from 'react';
import { Select, Tooltip, Spin } from 'antd';
import {
  PageTemplate, request, Log, SelectMax,
} from '@cfe/caopc-center-common';
import debounce from 'lodash/debounce';
import { urls, RULE_TYPE, RULE_TAG } from '../config';
import ModalAudit from './modal-audit';

const { Option } = Select;

export default class List extends React.Component {
  constructor(props) {
    document.title = '分润规则审核';
    super(props);
    this.state = {
      data: [],
      fetching: false,
      serviceTypeList: [],
      cityList: [], // 城市
      leaseholdersList: [], // 租赁商
      bizLineList: [], // 业务线
      carNatureList: [], // 车辆所属性质
      status: 0,
      checkedRecord: {},
    };

    this.lastFetchId = 0;
    this.fetchCompany = debounce(this.fetchCompany, 400);
    this.columns = [
      {
        title: '分润规则名称',
        dataIndex: 'ruleName',
        width: 120,
      },
      {
        title: '规则类别',
        dataIndex: 'ruleType',
        width: 120,
        render: (text) => RULE_TYPE[text],
      },
      {
        title: '标签',
        dataIndex: 'ruleTag',
        width: 120,
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
            render: (text) => (this.state.serviceTypeList.find((item) => item.key.toString() === text.toString()) || {}).value,
            // render: (text, record) => record?.agencyNameList?.map((e) => e)?.join(','),
            // render: text => (this.state.leaseholdersList.find(item =>
            //   item.key.toString() === text.toString()) || {}).value
          },
          {
            title: '渠道',
            dataIndex: 'companyNameList',
            width: 200,
            render: (text, record) => {
              if (record.companyNameMap) {
                const data = Object.entries(record.companyNameMap).map(([key, value]) => ({ key, value }));
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
            width: 200,
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
      // {
      //   title: '创建时间',
      //   dataIndex: 'createTime',
      //   width: 160,
      // },
      {
        title: '更新时间',
        dataIndex: 'updateTime',
        width: 160,
      },
      {
        title: '生效时间',
        dataIndex: 'activateTime',
        width: 160,
      },
      {
        title: '失效时间',
        dataIndex: 'inactivateTime',
        width: 160,
      },
      {
        title: '操作',
        dataIndex: 'action',
        width: 100,
        render: (text, record) => ([
          <a
            style={{ marginRight: 5 }}
            key={1}
            href={`/financial-center/liquidation/rule/detail/${record.groupId}`}
            target="_blank"
            rel="noreferrer"
          >查看</a>,
          <a style={{ marginRight: 8 }} onClick={() => { this.setState({ status: 1, checkedRecord: record }); }}>处理</a>,
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
    this.loadCarNatureList();
  }

  getConfig() {
    return {
      ...urls.auditPage,
      beforeRequest: (values) => {
        if (values.date && values.date.length) {
          values.updateTimeStart = `${values.date[0].format('YYYY-MM-DD')} 00:00:00`;
          values.updateTimeEnd = `${values.date[1].format('YYYY-MM-DD')} 23:59:59`;
        }
        if (values.companyNoList) {
          values.companyNo = values.companyNoList?.key;
        }
        delete values.companyNoList;
        delete values.date;
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

  renderFilter() {
    const {
      cityList, leaseholdersList, bizLineList, serviceTypeList, data, fetching,
    } = this.state;
    return [
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
        options: cityList,
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
        options: leaseholdersList,
      },
      {
        component: 'Select',
        key: 'bizLine',
        label: '业务线',
        options: bizLineList,
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
        key: 'ruleType',
        label: '规则类别',
        options: Object.keys(RULE_TYPE)?.map((key) => ({ key, value: RULE_TYPE[key] })),
      },
      {
        component: 'Select',
        key: 'ruleTag',
        label: '标签',
        options: Object.keys(RULE_TAG)?.map((key) => ({ key, value: RULE_TAG[key] })),
      },
      {
        component: 'RangePicker',
        key: 'date',
        label: '更新时间',
      },
    ];
  }

  render() {
    const { checkedRecord, status } = this.state;
    return (
      <div style={{ padding: 20 }} className="liquidation">
        <PageTemplate
          rowKey="id"
          config={this.getConfig()}
          filter={this.renderFilter()}
          columns={this.columns}
          connect={({ onSearch, form }) => { this.onSearch = onSearch; this.form = form; }}
        />
        {(status === 1) && (
          <ModalAudit
            data={checkedRecord}
            status={status}
            onSubmit={() => { this.onSearch(1); this.setState({ status: 0 }); }}
            onCancel={() => { this.setState({ status: 0 }); }}
          />
        )}
      </div>
    );
  }
}
