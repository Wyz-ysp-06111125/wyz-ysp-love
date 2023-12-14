
import { LaptopOutlined, NotificationOutlined, UserOutlined } from '@ant-design/icons';
import List from '../list';
import ListData from './component/content';
import HanDan from './component/hebei/handan';
import Ningbo from './component/ningbo';
const sub = [
    {
        city: "权限",
        index: 111,
        key: 1,
        content: "是指的添加的内容分为权限配置",
        icon: UserOutlined,
        children: [{
            key: 'caidan',
            index: 1,
            code: "菜单",
            content: '菜单是由自己添加而成',
            data: <ListData></ListData>
        }],
    },
    {
        city: "浙江",
        index: 1,
        key: 2,
        content: "浙江省属于中国的南方地区",
        icon: LaptopOutlined,
        children: [{
            index: 1,
            key: 'hangzhou',
            code: "杭州",
            content: "上有天堂，下有苏杭",
            data: <List></List>,
        }, {
            index: 2,
            key: '宁波',
            code: "宁波",
            content: "风华美貌，宁波之乡",
            data: <Ningbo></Ningbo>
        }],
    },

    {
        city: "河北",
        index: 2,
        key: 3,
        content: "河北省属于中国的北方地区",
        icon: LaptopOutlined,
        children: [{
            index: 1,
            key: 'handan',
            content: "自古美人，出邯郸",
            code: "邯郸",
            data: <HanDan></HanDan>
        }]
    },
    {
        city: "河南",
        index: 3,
        key: 4,
        content: "河南省属于中国的华中地区",
        icon: NotificationOutlined,
        children: [{
            index: 1,
            key: 'anyang',
            content: "安阳之乡，容貌风光",
            code: "安阳",
            data: null
        }]
    },

]
export default sub