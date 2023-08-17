import React from "react";
class Home extends React.Component {
    constructor(prop) {
        super(prop)
        this.state = {
            data: "第一个页面的内容"
        }
    }
    render() {
        return (
            <div>{this.state.data}</div>
        )
    }
}
export default Home