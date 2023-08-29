/* eslint-disable max-len */
import React from 'react';
import {
  Form, Modal, Radio, Message,
} from 'antd';
import request from '@cfe/venom-request';
import './index.less';

const FormItem = Form.Item;
class Modalroll extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      ResData: [],
    };
  }

  componentDidMount() {
    const { data } = this.props;
    request({
      url: '/pay-boss/clearRule/findAllRealDisableList',
      method: 'post',
      data: {
        groupId: data?.groupId,
        cityCode: data?.cityCode,
        bizLine: data?.bizLine,
        serviceType: data?.serviceType,
        ruleType: data?.ruleType,
        carBelongType: data?.carBelongType,
        agencyIdList: data?.agencyIdList,
        companyNoList: data?.companyNoList,
        effectiveTime: data?.effectiveTime,
        ineffectiveTime: data?.ineffectiveTime,
        activateTime: data?.activateTime,
        inactivateTime: data?.inactivateTime,
      },
    }).then((res) => {
      this.setState({
        ResData: res,
      });
    });
  }

  beforeRequest = (values) => {
    const { data } = this.props;
    values = data;
    return values;
  }

  // footer() {
  //   return <Button key="back" onClick={this.props.onBack}>取消</Button>;
  // }
  onSumber = () => {
    const {
      form, onBack, data,
    } = this.props;
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        const url = '/pay-boss/clearRule/rollbackNow';
        request({
          url,
          method: 'get',
          data: {
            effectiveGroupId: data.groupId,
            disableGroupId: values.groupId,
          },
        }).then((res) => {
          Message.success('操作成功');
          onBack && onBack(res);
        });
      }
    });
  }

  render() {
    const { onBack } = this.props;
    const { ResData } = this.state;
    const { getFieldDecorator } = this.props.form;

    return (
      <Modal
        visible
        title="回滚列表"
        onCancel={onBack}
        onOk={this.onSumber}
        className="rollbackmodal"
        width={800}
      >
        <Form>
          <FormItem label="请选择回滚替换的分润规则">
            {getFieldDecorator('groupId', {
              rules: [{
                required: true, message: '请选择',
              }],
            })(
              <Radio.Group style={{ width: 360 }}>
                {ResData?.map((val) => (
                  <Radio
                    value={val?.groupId}
                    key={val?.groupId}
                  >
                    {val?.ruleName}+({val?.activateTime} ~ {val?.inactivateTime})
                  </Radio>
                ))}
              </Radio.Group>,
            )}
          </FormItem>
        </Form>

      </Modal>
    );
  }
}

const Rollback = Form.create()(Modalroll);

export default Rollback;
