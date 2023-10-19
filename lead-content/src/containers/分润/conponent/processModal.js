/* eslint-disable react/jsx-no-target-blank */
/* eslint-disable no-script-url */
/* eslint-disable max-len */
/* eslint-disable eqeqeq */
import React from 'react';
import {
  Form, Modal, Spin, Button,
} from 'antd';
import { request } from '@cfe/caopc-center-common';

@Form.create()
export default class ModalProcess extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      fetchflag: true,
      errorData: undefined,
      successData: undefined,
    };
  }

  componentDidMount() {
    this.loadData();
    // const { selectedRowKeys, data } = this.props;
    // request({
    //     url: "/pay-boss/clearRule/batch/change/driverTagRate",
    //     method: "post",
    //     data: {
    //         driverTagRate: data,
    //         groupIdList: selectedRowKeys
    //     }
    // }).then((res) => {
    //     console.log(res)
    //     debugger
    //     if (res) {
    //         this.setState({
    //             fetchflag: false
    //         })
    //         request({
    //             url: "/pay-boss/clearRule/export",
    //             method: "post",
    //             data: {
    //                 groupIdList: res
    //             }
    //         }).then((data) => {
    //             debugger
    //             const { origin } = location
    //             window.open(origin + data)
    //         })

    //     } else {
    //         alert("123123")
    //     }
    // })
  }

  loadData = async () => {
    const { selectedRowKeys, data } = this.props;
    await request({
      url: '/pay-boss/clearRule/batch/change/driverTagRate',
      method: 'post',
      data: {
        driverTagRate: data,
        groupIdList: selectedRowKeys,
      },
    }).then((res) => {
      request({
        url: '/pay-boss/clearRule/export',
        method: 'post',
        data: {
          specialGroupIdMap: res,
        },
      }).then((data) => {
        this.setState({
          fetchflag: false,
          successData: '分润调控导出成功',
        });
        // eslint-disable-next-line
        const { origin } = location;
        window.open(origin + data);
      });
    }).catch((res) => {
      const data = JSON.parse(res?.message);
      this.setState({
        fetchflag: false,
        errorData: data?.message,
      });
    });
  }

  footer() {
    const data = [
      <Button type="primary" onClick={this.props.onCancel}>关闭</Button>,
    ];
    return data;
  }

  render() {
    const { selectedRowKeys, data } = this.props;
    const { fetchflag, errorData, successData } = this.state;
    return (
      <Modal
        visible
        title="分润调控"
        onCancel={this.props.onCancel}
        maskClosable={false}
        footer={this.footer()}
        width={500}
      >
        <h3 style={{ marginLeft: 20 }}>
          共&nbsp;&nbsp; <span style={{ color: 'red' }}>{selectedRowKeys?.length}</span>&nbsp;&nbsp;条分润规则
        </h3>
        <h3 style={{ marginLeft: 20 }}>
          分润调控系数为 &nbsp;&nbsp; <span style={{ color: 'red' }}>{data}</span>
        </h3>
        {fetchflag
          ? (
            <div style={{ marginLeft: 20 }}>
              <p>调控中,请耐心等待</p>
              <Spin style={{ marginLeft: 200 }} size="large" />
            </div>
          )
          : null}

        {
          errorData && (
            <h3 style={{ marginLeft: 20 }}>
              错误导出:  <span style={{ color: 'red' }}>{errorData}</span>
            </h3>
          )
        }

        {
          successData && (
            <div>
              <span style={{ marginLeft: 200, color: 'red' }}>{successData}</span>
            </div>
          )
        }

      </Modal>
    );
  }
}
