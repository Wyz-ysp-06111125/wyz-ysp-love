import React, { Component } from 'react';
import { Form } from 'antd';
import { Auth } from '@cfe/caopc-center-common';
import CModal from '@/components/cModal';

const FormItem = Form.Item;

export default class AdvancedModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showModal: false,
    };
  }


  getCustomRender() {
    // const { title } = this.props;
    return (
      <Form className="search-form" layout="inline">
        <div>
          <FormItem>
            <span style={{ lineHeight: 1.5, display: 'inline-block' }}>确定要停用该条规则吗？</span>
          </FormItem>
        </div>
      </Form>
    );
  }


  handleOnOver() {
    this.setState({
      showModal: false,
    });
  }

  handleOnClick() {
    return () => {
      this.setState({
        showModal: true,
      });
    };
  }

  render() {
    const {
      title, loadData, record, fetch,
    } = this.props;
    const { showModal } = this.state;
    return (
      <span>
        <Auth
          url={fetch.url}
          authType="link"
          onClick={this.handleOnClick()}
        >{title}</Auth>
        {
          showModal
            ? (
              <CModal
                visible
                onOver={(data) => {
                  this.handleOnOver(data);
                }}
                fetch={{
                  ...fetch,
                  body: {
                    groupId: record.groupId,
                  },
                }}
                loadData={loadData}
                title={title}
                okText="确认"
                cancelText="取消"
              >{this.getCustomRender()}</CModal>
            ) : null
        }

      </span>
    );
  }
}
