// Router.js
import React from 'react';
import { BrowserRouter as Router, Route,Routes } from 'react-router-dom';
import ABC from '../containers/abc';
import One from '../containers/one';
function Routers() {
  return (
    <Router>
        <Routes>
            <Route path="/" exact element={<ABC />}/>
            <Route path="/about" element={<One />}  />
        </Routes>
    </Router>
  );
}

export default Routers;