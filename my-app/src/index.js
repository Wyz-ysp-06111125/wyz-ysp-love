import React from 'react';
import ReactDOM from 'react-dom/client';

import { BrowserRouter, Route, Routes } from "react-router-dom"
import App from './App';
import reportWebVitals from './reportWebVitals';
import About from './containers/about';
import Home from './containers/home';
import './index.css';
const root = ReactDOM.createRoot(document.getElementById('root'));
// root.render(
//  
//     <App />
//   </React.StrictMode>
// );
root.render((
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" component={App}>
          <Route path="about" component={About} />
          <Route path="inbox" component={Home}>
            {/* <Route path="messages/:id" component={Message} /> */}
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
))
reportWebVitals();
