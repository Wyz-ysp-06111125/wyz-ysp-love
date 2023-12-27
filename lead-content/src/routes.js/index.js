// Router.js
import React from 'react';
import { BrowserRouter as Router, Route,Routes } from 'react-router-dom';
import ABC from '../containers/abc';
import One from '../containers/one';
import List from '../containers/list';
function Routers() {
  return (
    <Router>
        <Routes>
          <Route path="/" exact element={<ABC />}/>
          <Route path="/about" element={<One />}  />
          <Route path="/list" element={<List />}  />
        </Routes>
    </Router>
  );
}

export default Routers;