import React, { useState } from 'react';
import { Breadcrumb, Layout, Menu, theme } from 'antd';
import sub from './config'
import './index.less'
const { Header, Content, Sider } = Layout;
const childData = sub.map((val, index) => {
    return {
        key: val.index,
        label: val.city,
        icon: React.createElement(val.icon),
        children: val?.children?.map((item, itemindex) => {
            return {
                key: `${val.index}${item.index}`,
                label: item.code
            }
        })
    }
})

const App = () => {
    const [key, setKey] = useState(['1111', '111'])
    const [data] = useState(childData)
    const {
        token: { colorBgContainer },
    } = theme.useToken();

    const onMenu = (item) => {
        setKey(item.keyPath)
    }
  
    return (
        <div className='main-layout' id='myElement'>
            <Layout>
                <Header
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                    }}
                >
                    <div className="deme">
                        <span className="demo-logo">任意键</span>
                      
                    </div>
                    {/* <Menu theme="dark" mode="horizontal" defaultSelectedKeys={['2']} items={items1} /> */}
                </Header>
                <Layout>
                    <Sider
                        width={200}
                        style={{
                            background: colorBgContainer,
                        }}
                    >
                        <Menu
                            mode="inline"
                            defaultSelectedKeys={['1111']}
                            defaultOpenKeys={['111']}
                            onClick={(item) => { onMenu(item) }}
                            style={{
                                height: '100%',
                                borderRight: 0,
                            }}
                            items={data}
                        />
                    </Sider>
                    <Layout
                        style={{
                            padding: '0 24px 24px',
                        }}
                    >
                        <Breadcrumb
                            style={{
                                margin: '16px 0',
                            }}
                        >
                            <Breadcrumb.Item>任意键</Breadcrumb.Item>
                            <Breadcrumb.Item>{sub.map((val) => String(val.index) === key[1] && val.city)}</Breadcrumb.Item>
                            <Breadcrumb.Item>{sub.map((val) => String(val.index) === key[1] ? val.children.map((item) => String(`${val.index}${item.index}`) === key[0] && item.code) : null)}</Breadcrumb.Item>

                        </Breadcrumb>
                        <Content
                            style={{
                                padding: 24,
                                margin: 0,
                                minHeight: 280,
                                background: colorBgContainer,
                            }}
                        >
                            {sub.map((val) => String(val.index) === key[1] ? val.children.map((item) => String(`${val.index}${item.index}`) === key[0] && item.data) : null)}
                        </Content>
                    </Layout>
                </Layout>
            </Layout>
        </div >
    );
};
export default App;