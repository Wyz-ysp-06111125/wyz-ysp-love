import { Button, Form, Input, message } from "antd";
import React from "react";

class List extends React.Component{
    constructor(props){
        super(props)
        this.state={
            data:"134",
            aa:undefined,
            number:[],
        }
    }
    // queryData=()=>{
    //     // const {} = this.props.form
    //     const [form] = Form.useForm();
    //     // if(getFieldValue("username")|| getFieldValue("number")){
    //         const data =form.getFieldValue("username")
    //         const number =form.getFieldValue("number")
    //         console.log(data)
    //         console.log(number)
    //     // }else{
    //         // message.error("请填写")
    //     // }

    // }
     onFinish = (values) => {
        console.log('Received values from form:', values);
        if(values.data && values.number){
            const data = values.data
            const array = []
            const number = values.number
            const aa = data/number
            this.setState({
                aa,
                number:array.length=number
            })
        }else{
            message.error("请填写内容")
        }

      };
    
      
    render(){
        const {aa ,number} =this.state
        console.log(aa)
        console.log(number)
        // const { getFieldDecorator } = this.props.form;
        return(
            <div>
                {/* <Form>
                    <Form.Item label="内容">
                    {getFieldDecorator('data', {
              rules: [{
                required: true, message: '请选择',
              }],
            })(
                <Input></Input>
            )}
                    </Form.Item>
                    <Form.Item label="计算">
                    {getFieldDecorator('number', {
              rules: [{
                required: true, message: '请选择',
              }],
            })(
                <Input></Input>
            )}
                    </Form.Item>
                     <Form.Item
      label="Username"
      name="username"
      rules={[
        {
          required: true,
          message: 'Please input your username!',
        },
      ]}
    >
      <Input />
    </Form.Item>
                    <Button onClick={()=>{this.queryData()}}>查看</Button>
                </Form> */}

<Form onFinish={this.onFinish}>
            <Form.Item label="Name" name="data">
              <Input />
            </Form.Item>
      
            <Form.Item label="Email" name="number">
              <Input />
            </Form.Item>
      
            <Form.Item>
              <Button type="primary" htmlType="submit">
                Submit
              </Button>
            </Form.Item>
          </Form>
            </div>
        )
    }
}
export default List;