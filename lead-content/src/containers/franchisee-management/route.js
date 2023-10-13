import React from 'react';
import { Route, IndexRoute } from 'react-router';
import there from './add/list';
import entry from './entry';

export default (
  <Route path="franchisee-management">
    <Route path="index">
      <IndexRoute component={entry} />
    </Route>

    <Route path="detail/:id">
      <IndexRoute component={there} />
    </Route>
  </Route>
);
