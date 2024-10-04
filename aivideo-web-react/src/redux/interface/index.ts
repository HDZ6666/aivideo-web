import type { SizeType } from "antd/lib/config-provider/SizeContext";
// import type { Login } from "@/api/interface/index";
import { Menu } from "@/typings/global";

/* themeConfigProp */
export interface ThemeConfigProp {
	primary: string;
	isDark: boolean;
	weakOrGray: string;
}

/* GlobalState */
export interface GlobalState {
	assemblySize: SizeType;
	language: string;
	themeConfig: ThemeConfigProp;
}

/* MenuState */
export interface MenuState {
	isCollapse: boolean;
	menuList: Menu.MenuOptions[];
}

/* TabsState */
export interface TabsState {
	tabsActive: string;
	tabsList: any;
}

/* BreadcrumbState */
export interface BreadcrumbState {
	breadcrumbList: {
		[propName: string]: any;
	};
}

/* AuthState */

export interface UserInfo {
	userName: string;
	avatar: string;
}

export interface UserState {
	token: string;
	userInfo: UserInfo | null;
	roles?: string[];
	permission?: string[];
}
export interface AuthState {
	authMenu: Menu.MenuOptions[];
	authButton: string[];
	authRouter: string[];
}

/* Decice */
enum StatusEnum {
	Enable = 1, // 在线
	Disable = 2 // 离线
}

enum TypeEnum {
	BoxCamera = 1, // 枪机
	DomeCamera = 2, // 球机
	FullviewCamera = 3, // 全景
	OtherCamera = 4 // 其他
}

export interface deviceItem {
	key: string; //唯一id
	name: string; //设备名称
	type: TypeEnum; //设备类型
	status: StatusEnum; //状态
	location: string; //设备位置
	desc: string; // 设备描述
	facturer: string; //厂商
	refesh: boolean; // 抽图状态
	lastSnapshot: string; //最新快照
	cutPhoto: string; //切图照片
}

export interface locationItem {
	key: string; //唯一id
	title: string; //位置名称
	children: locationItem[]; //子位置
}

export interface DeviceState {
	locationList: deviceItem[] | any[];
	deviceList: locationItem[] | any[];
	selectLocation: any;
}
