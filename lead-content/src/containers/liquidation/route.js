import React from 'react';
import { Route } from 'react-router';

import Merchant from './merchant';
import Rule from './rule';
import Audit from './rule/audit';
import MerchantManage from './merchantManage';
import Cashier from './cashier';
import RuleDetail from './rule/step';

export default (
  <Route path="liquidation">
    <Route path="merchant">
      <Route path="index" component={Merchant} />
    </Route>
    <Route path="rule">
      <Route path="index" component={Rule} />
    </Route>
    <Route path="rule">
      <Route path="audit" component={Audit} exact />
    </Route>
    <Route path="rule">
      <Route path=":type(/:id)" component={RuleDetail} />
    </Route>
    <Route path="merchantManage">
      <Route path="index" component={MerchantManage} />
    </Route>
    <Route path="cashier">
      <Route path="index" component={Cashier} />
    </Route>
  </Route>
);

/*
  分润主题及结算商户维护表   /financial-center/liquidation/merchant/index
  分润规则配置   /financial-center/liquidation/rule/index
  清结算商户管理   /financial-center/liquidation/merchantManage/index
  提现记录   /financial-center/liquidation/cashier/index
*/
