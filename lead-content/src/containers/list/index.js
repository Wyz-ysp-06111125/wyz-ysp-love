import { Button, Card, Form, Input, message } from "antd";
import React from "react";

class List extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      data: "134",
      aa: undefined,
      number: [],
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
    debugger
    if (values.data && values.number) {
      const data = values.data
      const array = []
      const number = values.number
      const aa = data / number
      this.setState({
        aa,
        number: array.length = number
      })
    } else {
      message.error("请填写内容")
    }

  };


  render() {
    const { aa, number } = this.state
    console.log(aa)
    console.log(number)
    // const { getFieldDecorator } = this.props.form;
    return (
      <div>
        <Card title="卡片内容" style={{ margin: 15 }}>
          <Form onFinish={this.onFinish}>

            {/* <Form layout="inline"> */}
            <Form.Item
              label="Name" name="data" rules={[{ required: true, message: "请填写名字！" }]}>
              <Input style={{ width: 180 }} />
            </Form.Item>
            <Form.Item
              label="Email" name="number" rules={[{ required: true, message: "请填写邮箱！" }]}>
              <Input style={{ width: 180 }} />
            </Form.Item>

            <Form.Item labelCol={{
              span: 6,
            }}
              wrapperCol={{
                span: 18,
              }}>
              <Button type="primary" htmlType="submit">
                Submit
              </Button>
            </Form.Item>
          </Form>
          {/* </Form> */}
        </Card>
      </div>
    )
  }
}
export default List;