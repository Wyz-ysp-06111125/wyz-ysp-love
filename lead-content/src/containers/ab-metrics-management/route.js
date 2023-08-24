import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
import Entry from './entry';
import curd from './curd';

export default class FrontEnd extends Component {
  render() {
    const {
      match: { path },
    } = this.props;
    return (
      <Switch>
        <Route path={`${path}/index`} component={Entry} />
        <Route path={`${path}/:type/:id?`} component={curd} />
      </Switch>
    );
  }
}
