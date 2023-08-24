// /* eslint-disable react/jsx-no-target-blank */
// /* eslint-disable no-script-url */
// /* eslint-disable max-len */
// /* eslint-disable eqeqeq */
// /* eslint-disable */
import React from 'react';
import { PageTemplate } from '@cfe/venom';
import { request } from '@cfe/caopc-center-common';
import { Button, Tooltip } from 'antd';
import RecordHistory from '@/components/History';
// import ModalRule from "../component/ModalData";
import { URLS } from '../config';
import './index.less';

class Entry extends React.Component {
  constructor(prop) {
    super(prop);
    this.state = {
      bizTypeList: [],
    };
    document.title = 'AB指标管理';
  }

  templateConfig = () => ({
    url: {
      url: '/reportMetrics/list',
      method: 'get',
    },
    searchOnLoad: true,
  });

  filterConfig = () => [
    {
      component: 'Input',
      key: 'metricsName',
      label: '指标集名称',
    },
    {
      component: 'Select',
      key: 'bizType',
      label: '业务类型',
      selectOptions: this.state.bizTypeList?.map((item) => ({
        key: item?.value,
        value: item?.desc,
      })),
    },
    {
      component: 'Input',
      key: 'createOperator',
      label: '创建人',
    },
  ];

  toolbar = () => {
    return [
      <div className='toolbar-position'>
        <Button
          type='primary'
          style={{ marginRight: 15 }}
          onClick={() => {
            window.open('/abtest-config-center/ab-metrics-management/add');
          }}
        >
          新建指标集
        </Button>
      </div>,
    ];
  };

  componentDidMount() {
    request({
      url: '/lab/config/bizType',
      method: 'get',
      code: 200,
      messageRedefine: 'message',
    }).then((res) => {
      this.setState({
        bizTypeList: res,
      });
    });
  }

  render() {
    const columnsData = [
      {
        title: '指标集ID',
        dataIndex: 'id',
      },
      {
        title: '指标集名称',
        dataIndex: 'metricsName',
      },
      {
        title: '适用业务类型',
        dataIndex: 'bizTypeDTOS',
        render: (text) => {
          if (text) {
            // const data = Object.entries(record?.bizTypeDTOS).map(([desc, value]) => ({ desc, value }));
            return (
              <Tooltip title={text?.map((e) => e.desc)?.join(',')}>
                {text
                  ?.slice(0, 3)
                  ?.map((e) => e.desc)
                  ?.join(',')}
                {text?.length > 3 ? '...' : null}
              </Tooltip>
            );
          }
        },
      },
      {
        title: '关联表名',
        dataIndex: 'relatedTable',
      },
      {
        title: '创建人',
        dataIndex: 'createOperator',
      },
      {
        title: '更新时间',
        dataIndex: 'updateTime',
        // render: (text) => (
        //     text?.map((val, index) => (
        //         <span >{val.roleName}{index + 1 !== index && ","}</span>
        //     ))
        // )
      },
      {
        title: '操作',
        dataIndex: 'action',
        render: (text, record) => {
          return (
            <>
              {/* <a href="javascript:;"
                            rel="noreferrer noopener"
                            onClick={this.Withdrawals(record)}
                            style={{ marginRight: 10 }}
                        >编辑关联角色</a> */}
              <a
                // eslint-disable-next-line no-script-url
                href='javascript:;'
                rel='noreferrer noopener'
                onClick={() => {
                  window.open(
                    `/abtest-config-center/ab-metrics-management/edit/${record.id}`
                  );
                }}
                style={{ marginRight: 10 }}
              >
                编辑
              </a>
              <a
                // eslint-disable-next-line no-script-url
                href='javascript:;'
                rel='noreferrer noopener'
                onClick={() => {
                  window.open(
                    `/abtest-config-center/ab-metrics-management/copy/${record.id}`
                  );
                }}
                style={{ marginRight: 10 }}
              >
                复制
              </a>
              <RecordHistory
                title='操作记录'
                url={URLS.log}
                query={{ workType: 5, sourceId: record.id, modelType: 4 }}
              >
                日志
              </RecordHistory>
            </>
          );
        },
      },
    ];

    return (
      <div className='templateContent'>
        <PageTemplate
          searchOnVisible
          {...this.templateConfig()}
          filter={this.filterConfig()}
          columns={columnsData}
          toolbar={this.toolbar()}
          connect={({ onSearch, form }) => {
            this.onSearch = onSearch;
            this.form = form;
          }}
        />
      </div>
    );
  }
}
export default Entry;
