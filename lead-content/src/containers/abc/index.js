import React from "react";
import {Button} from 'antd'
class ABC extends React.Component{
    render(){
        return(
            <div>
                <Button type="primary" onClick={()=>{window.open('/about')}}>内容展示</Button>
                <Button type="primary" onClick={()=>{window.open('/list')}}>列表内容展示</Button>

            </div>
        )
    }
}
export default ABC