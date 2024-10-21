import welcome from "@/assets/images/welcome.png";
import "./index.less";

enum MenType {
	CATALOGUE = 0, // 目录
	PAGE = 1, //页面
	BUTTON = 2 //按钮
}

interface MenuOption {
	id: string; // id
	title: string; //标题
	icon: string; //图标
	path?: string; // 路径
	type: MenType; //类型
	pid?: string; //上层id
	order: number; //排序
	status: boolean; //启用禁用
	isLink: boolean; //外链
}

const menu: MenuOption[] = [
	{
		id: "1",
		title: "首页",
		icon: "AppstoreOutlined",
		path: "/home",
		type: 1,
		pid: "",
		order: 1,
		status: true,
		isLink: false
	},
	{
		id: "2",
		title: "设备中心",
		icon: "AppstoreOutlined",
		path: "",
		type: 0,
		pid: "",
		order: 1,
		status: true,
		isLink: false
	},
	{
		id: "7",
		title: "告警列表",
		icon: "AppstoreOutlined",
		path: "/alarm/alarmList",
		type: 1,
		pid: "6",
		order: 1,
		status: true,
		isLink: false
	},
	{
		id: "3",
		title: "设备列表",
		icon: "AppstoreOutlined",
		path: "/device/deviceList",
		type: 1,
		pid: "2",
		order: 1,
		status: true,
		isLink: false
	},
	{
		id: "4",
		title: "分屏展示",
		icon: "AppstoreOutlined",
		path: "/device/deviceScreen",
		type: 1,
		pid: "2",
		order: 1,
		status: true,
		isLink: false
	},
	{
		id: "5",
		title: "设备位置",
		icon: "AppstoreOutlined",
		path: "/device/deviceLocation",
		type: 1,
		pid: "2",
		order: 1,
		status: true,
		isLink: false
	},
	{
		id: "6",
		title: "告警中心",
		icon: "AppstoreOutlined",
		path: "",
		type: 0,
		pid: "",
		order: 1,
		status: true,
		isLink: false
	},
];

function getData(arr: any) {
	// 利用两层filter实现
	let data = arr.filter((item: any) => {
		item.children = arr.filter((e: any) => {
			return item.id === e.pid;
		});
		return !item.pid;
	});
	return data;
}
const Home = () => {
	getData(menu);
	return (
		<div className="home">
			<img src={welcome} alt="welcome" />
		</div>
	);
};

export default Home;
