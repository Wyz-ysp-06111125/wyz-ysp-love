import React from 'react';
import { Route, IndexRoute } from 'react-router';
import model from './model';
import entry from './entry';

export default (
  <Route path="policy-configuration">
    <Route path="index">
      <IndexRoute component={entry} />
    </Route>

    <Route path=":type(/:id)">
      <IndexRoute component={model} />
    </Route>
  </Route>
);
