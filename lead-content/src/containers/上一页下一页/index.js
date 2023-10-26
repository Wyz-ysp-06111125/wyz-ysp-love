import { PageTemplate, request } from '@cfe/caopc-center-common';
import { DatePicker, message, Table, Button } from 'antd';
import { GET } from '@/actions/request';
import moment from 'moment';
import React from 'react';

const STATEMONEY = {
    1: '租金扣款',
    2: '欠款调整',
};
class FreezingDetail extends React.Component {
    constructor(prop) {
        super(prop);
        this.state = {
            bizLines: [],
            time: [moment().subtract(15, 'day'), moment()],
            pagination: {
                current: 1,
                pageSize: 10,
                hasMore: false
            },
            paymentChannels: [],
            loading: false
        };
        this.fetchPaymentChannels = this.fetchPaymentChannels.bind(this);
        this.handleBizLineChange = this.handleBizLineChange.bind(this);
        this.handleSearch = this.handleSearch.bind(this);
        this.handleReset = this.handleReset.bind(this);
        this.prev = this.prev.bind(this);
        this.next = this.next.bind(this);
        this.columns = [{
            title: '交易类型',
            dataIndex: 'bizTypeName',
            // render: (text) => STATEMONEY[text],
        },
        {
            title: '冻结金额（元）',
            dataIndex: 'totalFreezeAmount',
            // render: (text) => text && parseFloat(text / 100).toFixed(2),
        }, {
            title: '关联单号',
            dataIndex: 'orderNo',

        }, {
            title: '交易时间',
            dataIndex: 'freezeTime',
        }]
    }
    componentDidMount() {
        this.fetchPaymentChannels()
    }
    handleBizLineChange(time) {
        this.setState({ time });
    }
    handleReset() {
        this.setState({ time: undefined });
    }
    fetchPaymentChannels() {
        const { id } = this.props
        this.setState({ loading: true });
        const { time, pagination: { current, pageSize }, pagination } = this.state;
        // const res = await GET()
        // let success = false
        request({
            url: '/pay-boss/driver-account/queryAccountFrozenList',
            method: "get",
            data: {
                userNo: id,
                accountType: 6,
                userType: 2,
                pageNum: current,
                startDate: time && time[0] ? moment(time[0]).format('YYYY-MM-DD') : undefined,
                endDate: time && time[1] ? moment(time[1]).format('YYYY-MM-DD') : undefined,
                pageSize
            }
        }
        ).then((res) => {
            this.setState({ loading: false });
            if (res?.list) {
                if (res.list.length < pageSize) {
                    pagination.hasMore = false;
                } else {
                    pagination.hasMore = true;
                }
                this.setState({ paymentChannels: res.list, pagination });
            }

        })

    }
    beforeRequestMoney = (values) => {
        const { id } = this.props;
        values.startDate = values.range && values.range[0] ? moment(values.range[0]).format('YYYY-MM-DD') : undefined;
        values.endDate = values.range && values.range[1] ? moment(values.range[1]).format('YYYY-MM-DD') : undefined;
        values.userNo = id;
        values.accountType = 6
        values.userType = 2
        delete values.range;
        return values;
    }

    getConfigs = () => ({
        url: '/pay-boss/driver-account/queryAccountFrozenList',
        method: 'get',
        searchOnLoad: true,
        searchOnVisible: true,
        beforeRequest: this.beforeRequestMoney,
    })

    handleSearch() {
        const { pagination } = this.state;
        pagination.current = 1;
        this.setState({ pagination }, this.fetchPaymentChannels);
    }
    prev() {
        const { pagination } = this.state;
        pagination.current -= 1;
        this.setState({ pagination }, this.fetchPaymentChannels);
    }

    next() {
        const { pagination } = this.state;
        pagination.current += 1;
        this.setState({ pagination }, this.fetchPaymentChannels);
    }
    render() {
        const { paymentChannels, time, loading, pagination: { hasMore, current } } = this.state
        return (
            <div style={{ margin: 20 }}>
                {/* <PageTemplate
                    config={this.getConfigs()}
                    // 导出功能按钮地址
                    connect={({ onSearch, form }) => { this.onSearch = onSearch; this.form = form; }}
                    columns={[{
                        title: '交易类型',
                        dataIndex: 'bizTypeName',
                        // render: (text) => STATEMONEY[text],
                    },
                    {
                        title: '冻结金额（元）',
                        dataIndex: 'totalFreezeAmount',
                        // render: (text) => text && parseFloat(text / 100).toFixed(2),
                    }, {
                        title: '关联单号',
                        dataIndex: 'orderNo',

                    }, {
                        title: '交易时间',
                        dataIndex: 'freezeTime',
                    }]}
                    filter={[{
                        component: 'RangePicker',
                        key: 'range',
                        label: '交易时间',
                        fieldOptions: {
                            initialValue: [moment().subtract(31, 'day'), moment()],
                            rules: [{
                                required: true, message: '请选择时间',
                            }],
                        },
                    },
                    ]}
                /> */}
                <div style={{ display: 'inline-block', marginRight: 10 }}>
                    <span>交易时间:</span>
                    <DatePicker.RangePicker
                        style={{ width: 260, marginLeft: 5 }}
                        placeholder="请选择"
                        onChange={this.handleBizLineChange}
                        value={time}

                    />

                </div>
                <div style={{ display: 'inline-block' }}>
                    <Button
                        style={{ marginRight: 5 }}
                        type="primary"
                        onClick={this.handleSearch}
                    >
                        查询
                    </Button>
                    <Button type="primary" onClick={this.handleReset}>重置</Button>
                </div>
                <Table
                    style={{ marginTop: 20 }}
                    columns={this.columns}
                    dataSource={paymentChannels}
                    loading={loading}
                    pagination={false}>

                </Table>
                <div style={{ margin: '20px 20px 0 0', float: 'right' }}>
                    {
                        (() => {
                            if (current > 1) {
                                if (hasMore) {
                                    return [
                                        <Button style={{ marginRight: 8 }} onClick={this.prev}>上一页</Button>,
                                        <Button onClick={this.next}>下一页</Button>
                                    ];
                                }

                                return <Button onClick={this.prev}>上一页</Button>;
                            } else if (hasMore) {
                                return <Button onClick={this.next}>下一页</Button>;
                            }
                            return null;
                        })()
                    }
                </div>
            </div>
        );
    }
}
export default FreezingDetail;
