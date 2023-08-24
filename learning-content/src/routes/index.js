// Router.js
import React from 'react';
import { BrowserRouter as Router, Route,Routes } from 'react-router-dom';
import Home from '../home';
import Empty from '../empty';
function Routers() {
  return (
    <Router>
      <div>
        {/* <nav>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/about">About</Link></li>
          </ul>
        </nav> */}
        <Routes>
            <Route path="/" exact element={<Home />}/>
            <Route path="/about" element={<Empty />}  />

        </Routes>
        
      </div>
    </Router>
  );
}

export default Routers;
