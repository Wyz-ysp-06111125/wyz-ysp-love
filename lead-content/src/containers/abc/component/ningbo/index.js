import { Button, Form, Input } from "antd";
import React, { useState } from "react";
import {
    PlusOutlined, MinusOutlined
} from '@ant-design/icons';
import './index.less'
function Ningbo() {
    const [data, setData] = useState(
        [{
            name: undefined,
            phone: undefined,
            city: undefined,
            time: undefined
        }]
    )
    const onFinish = (values) => {
        console.log(values)
    }

    const add = () => {
        const alldata = [...data]
        alldata.push({
            name: undefined,
            phone: undefined,
            city: undefined,
            time: undefined
        })
        setData(alldata)
    }
    const remove = (index) => {
        const alldata = [...data]
        alldata.splice(index, 1)
        setData(alldata)
    }
    return (
        <div className="ningbo">
            <h2>
                动态表格内容
            </h2>
            <Form onFinish={onFinish} >
                <table className="table-all">
                    <thead className="table-con">
                        <tr>
                            <th>姓名</th>
                            <th>手机号</th>
                            <th>城市</th>
                            <th>时间</th>
                            <th>操作</th>
                        </tr>
                    </thead>
                    <tbody>

                        {
                            data?.map((val, index) => (
                                <tr>
                                    <td>
                                        <Form.Item name={['data', 'name']}>
                                            <Input style={{ width: 180 }} />
                                        </Form.Item>
                                    </td>
                                    <td>
                                        <Form.Item name={['data', 'phone']}>
                                            <Input style={{ width: 180 }} />
                                        </Form.Item>
                                    </td>
                                    <td>
                                        <Form.Item name={['data', 'city']}>
                                            <Input style={{ width: 180 }} />
                                        </Form.Item>
                                    </td>
                                    <td>
                                        <Form.Item name={['data', 'time']}>
                                            <Input style={{ width: 180 }} />
                                        </Form.Item>
                                    </td>
                                    <td>
                                        <PlusOutlined style={{ marginRight: 5, border: '1px red solid' }} onClick={() => { add() }}></PlusOutlined>
                                        <MinusOutlined style={{ marginRight: 5, border: '1px red solid' }} onClick={() => { remove(index) }}></MinusOutlined>
                                    </td>
                                </tr>
                            ))
                        }
                    </tbody>
                </table>
                <div>

                    <Button type="primary" htmlType="submit">提交</Button>
                </div>
            </Form>
            <p style={{ color: "red" }}>
                动态页面中得内容  利用hooks编译而成 动态表格添加或者删除得时候我们要去获取到data
                使用扩展运算符[...data] 获取 否则js当中用变量接收是只获取了长度
            </p>
        </div>
    )

}
export default Ningbo