import { Button, Form, Select, Table } from "antd";
import React, { useEffect, useState } from "react";
import sub from "../../config";
const columns = [
    {
        title: "序号",
        dataIndex: "key"
    },
    {
        title: '一级菜单',
        dataIndex: 'city',
    },
    {
        title: '二级菜单',
        dataIndex: 'code',
    },
    {
        title: '内容',
        dataIndex: 'content',
    }, {
        title: "介绍",
        dataIndex: "twocontent"
    }, {
        title: "操作",
        dataIndex: "a",
        render: (text) => (
            <div>
                {/* eslint-disable-next-line  */}
                <a href="javascript:;" rel="noreferrer noopener" style={{ marginRight: 10 }} >编辑</a>
                {/* eslint-disable-next-line  */}
                <a href="javascript:;" rel="noreferrer noopener">查看</a>
            </div>
        )
    }]
function ListData() {
    const [form] = Form.useForm();
    const [twoSelect, setTwoSelect] = useState([])
    const [select] = useState(sub)
    const [data, setData] = useState([])
    // const [visiable] = useState('')
    useEffect(() => {
        const alldata = []
        sub.forEach((val, index) => {
            val.children.forEach((item, itemIndex) => {
                alldata.push({
                    city: val.city,
                    code: item.code,
                    key: `${val.index}${itemIndex}`,
                    content: val.content,
                    twocontent: item.content
                })
            })
        })
        setData(alldata)
    }, [])
    // console.log(alldata)
    // debugger
    const configData = (valData, dataValue, one) => {
        console.log(valData)
        debugger
        if (dataValue === 'one') {
            const all = []
            valData.forEach((val, index) => {
                val.children.forEach((item, itemIndex) => {
                    all.push({
                        city: val.city,
                        code: item.code,
                        key: `${val.index}${itemIndex}`,
                        content: val.content,
                        twocontent: item.content
                    })
                })
            })
            return all
        } else if (dataValue === 'two') {
            const all = []
            // eslint-disable-next-line
            select.map((val) => {
                if (String(val.index) === String(one)) {
                    // eslint-disable-next-line
                    val.children.map((item, itemIndex) => {
                        if (String(item.key) === String(valData)) {
                            all.push({
                                city: val.city,
                                code: item.code,
                                key: `${val.index}${itemIndex}`,
                                content: val.content,
                                twocontent: item.content
                            })
                        }
                    })
                }
            })
            return all
        }

    }
    const onFinish = (values) => {
        if (values.two && values.one) {
            const dataSelect = configData(values.two, 'two', values.one)
            setData(dataSelect)
        } else if (values.one) {
            const selectDa = select.filter((val, index) => {
                return String(val.index) === String(values.one)
            })
            const dataSelect = configData(selectDa, 'one')
            setData(dataSelect)
        } else {
            const alldata = []
            select.forEach((val, index) => {
                val.children.forEach((item, itemIndex) => {
                    alldata.push({
                        city: val.city,
                        code: item.code,
                        key: `${val.index}${itemIndex}`,
                        content: val.content,
                        twocontent: item.content
                    })
                })
            })
            setData(alldata)
        }
    };
    const onReast = () => {
        form.resetFields()
    }
    const onTwoSelect = (e) => {
        form.setFieldValue(['two'])
        // eslint-disable-next-line
        const aaa = select.map((val, index) => {
            if (String(val.index) === String(e)) {
                return val.children.map((item) => <Select.Option value={item.key} key={item.key}>{item.code}</Select.Option>)
            }
        })
        setTwoSelect(aaa)
    }
    const onQcreat = () => {

    }
    useEffect(() => {

        (() => {
            console.log(1);

            setTimeout(() => {
                console.log(2);
            }, 0);

            new Promise((resolve, reject) => {
                resolve()
                console.log(3);
            }).then(() => {
                console.log(4);
            });

            console.log(5);
        })();


        function parseUrl(url) {
            let urlObj = new URL(url);
            const search = urlObj.search.substring(1)
            const array = search.split('&')
            const newArray = array.map((val, index) => {
                return val.split('=')
            })
            let result = newArray.reduce((accumulator, current) => {
                if (!accumulator[current[0]]) {
                    accumulator[current[0]] = [];
                }
                accumulator[current[0]].push(current[1]);
                return accumulator;
            }, {});
            return {
                protocol: urlObj.protocol,
                hostname: urlObj.hostname,
                pathname: urlObj.pathname,
                search: urlObj.search,
                searchParams: result,
                hash: urlObj.hash,
            };
        }

        // console.log('afed', obj2str('key1=1&key2=2&key1=3&test=4'))

        let url1 = "http://www.xxx.com?key1=1&key2=2&key1=3&test=4#haha";
        console.log("1", parseUrl(url1));

        let url2 = "http://www.xxx.com?";
        console.log("2", parseUrl(url2));

        let url3 = "http://www.xxx.com#haha";
        console.log("3", parseUrl(url3));

        let url4 = "file:///user/xxx/index.html";
        console.log("4", parseUrl(url4));
    })
    return (
        <div>
            <div>
                <Form onFinish={onFinish} form={form} layout='inline'>
                    <Form.Item label="一级名称" name="one">
                        <Select allowClear showSearch optionFilterProp="children" style={{ width: 180 }} placeholder='请选择' onChange={(e) => { onTwoSelect(e) }}>
                            {
                                select.map((val, index) => <Select.Option key={val.index} value={val.index}>{val.city}</Select.Option>)
                            }
                        </Select>
                    </Form.Item>
                    <Form.Item label="二级名称" name="two">
                        <Select allowClear showSearch optionFilterProp="children" style={{ width: 180 }} placeholder='请选择'>
                            {/* {
                                sub.map((val, index) => <Select.Option key={val.index} value={val.index}>{val.city}</Select.Option>)
                            } */}
                            {twoSelect}
                        </Select>
                    </Form.Item>
                    <Form.Item
                    >
                        <Button type="primary" htmlType="submit" style={{ marginRight: 10 }}>
                            查询
                        </Button>
                        <Button htmlType="reset" onClick={() => { onReast() }}>重置</Button>
                    </Form.Item>
                </Form>

                <Button style={{ marginTop: 20 }} type='primary' onClick={() => { onQcreat() }} >新增菜单</Button>
                <Table style={{ marginTop: 30 }} columns={columns} dataSource={data} />

            </div>

        </div>
    )
}
export default ListData