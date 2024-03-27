import { Form, Input, Modal, Select, message } from "antd";
import React, { useState } from "react";
function Create(porps){
    const [form] = Form.useForm();
    const [menu,setMenu] = useState("")
    const[alldata,setAlldata] =useState(porps.data)
    const onChangeData=()=>{
       const data =  form.getFieldValue("menu")
        setMenu(data)
    }
   const onOk =()=>{
    onFinish(form.getFieldsValue())
   }
   const onFinish=(values) => {
    setAlldata( alldata.push({
        city:values.city,
        content:values.content,
        icon:Number(values.icon),
        children:[{}]
    }))
    if(values.city && values.content && values.icon){
        onSetData()
    }else{
        message.error("请完善内容")
    }
    
   }
   const onSetData=()=>{
    window.sessionStorage.setItem('data', JSON.stringify(alldata));
    window.sessionStorage.setItem('type', 'add');
    debugger
    
    porps.onClose()
   }
    return(
        <Modal title="新增" open = {porps.visiable} onOk={onOk} onCancel = {porps.onClose}>
            <Form   form={form} layout='inline'>
                <Form.Item label="新增菜单" name="menu" style={{marginTop:20}}>
                    <Select allowClear showSearch optionFilterProp="children" style={{width:180}} onChange={()=>{onChangeData()}} placeholder="请选择">
                        <Select.Option value = "1">一级菜单</Select.Option>
                        <Select.Option value = "2">二级菜单</Select.Option>
                    </Select>
                </Form.Item>
            {
              menu === "1" &&(
                   <>
                   <Form.Item label="菜单名称" name="city" style={{marginTop:20}}>
                        <Input placeholder="请输入菜单名称"></Input>
                    </Form.Item>
                   <Form.Item label="内容" name="content" style={{marginTop:20}}>
                        <Input placeholder="请输入内容"></Input>
                    </Form.Item>
                   <Form.Item label="内容" name="icon" style={{marginTop:20}}>
                        <Select  allowClear showSearch optionFilterProp="children" style={{width:180}} placeholder="请选择">
                         <Select.Option value={"LaptopOutlined"}>LaptopOutlined</Select.Option>
                         <Select.Option value={"NotificationOutlined"}>NotificationOutlined</Select.Option>
                         <Select.Option value={"UserOutlined"}>UserOutlined</Select.Option>
                        </Select>
                    </Form.Item>

                    </>
                )
            }

                   
                    </Form>
        </Modal>
    )
}
export default Create