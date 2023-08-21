// import logo from './logo.svg';
import './App.css';
import { Link } from "react-router-dom"

function App() {

  return (
    <div>
      <h1>App</h1>
      <ul>
        <li><Link to="/about">About</Link></li>
        <li><Link to="/inbox">Inbox</Link></li>
      </ul>
      {this.props.children}
      鹅黄色啊啊让她哈
    </div>
  )

}

export default App;
