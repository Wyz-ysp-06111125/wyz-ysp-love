import React, { Component } from 'react';
import './index.less';

class Empty extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
  }

  render() {
    return (
      <div className='home-container'>
        <span>Empty</span>
      </div>
    );
  }
}

export default Empty;
