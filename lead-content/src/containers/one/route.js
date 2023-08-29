import React, { Component } from 'react';
import { Route } from 'react-router-dom';
import Entry from './index';

export default class FrontEnd extends Component {
  render() {
    const {
      match: { path },
    } = this.props;
    return (
    //   <Switch>
        <Route exact path={`${path}/index/:labId?`} component={Entry} />
    //   </Switch>
    );
  }
}
