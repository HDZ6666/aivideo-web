import { Menu } from "@/typings/global";
// * 请求响应参数(不包含data)
export interface Result {
	code: number;
	msg: string;
}

// * 请求响应参数(包含data)
export interface ResultData<T = any> extends Result {
	data?: T;
}

// * 分页响应参数
export interface ResPage<T> {
	datalist: T[];
	pageNum: number;
	pageSize: number;
	total: number;
}

// * 分页请求参数
export interface ReqPage {
	pageNum: number;
	pageSize: number;
}

// * 登录
export namespace Login {
	export interface ReqLoginForm {
		username: string;
		password: string;
	}
	export interface ResLogin {
		token: string;
		userInfo: any;
		roles: string[];
		permission: string[];
	}
	export interface ResAuthButtons {
		[propName: string]: any;
	}
}

// * 用户管理
export namespace User {
	export interface ReqGetUserParams extends ReqPage {
		username: string;
		gender: number;
		idCard: string;
		email: string;
		address: string;
		createTime: string[];
		status: number;
	}
	export interface ResUserList {
		id: string;
		username: string;
		gender: string;
		age: number;
		idCard: string;
		email: string;
		address: string;
		createTime: string;
		status: number;
	}
}

export namespace MenuApi {
	export interface ReqMenuApi {
		mode: String;
	}
	export interface ResMenuApi {
		menu: Menu.MenuOptions[];
		count: number;
	}
}

export namespace LocationApi {
	// export interface ReqMenuApi {
	// 	mode: String;
	// }
	export interface ResLocationApi {
		children: ResLocationApi[];
		group_name: string;
		id: number;
		level: number;
		parent_id: number;
		platform_id: number;
		sort: number;
		state: number;
	}
}
