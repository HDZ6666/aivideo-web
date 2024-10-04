// * Menu
declare namespace Menu {
	interface MenuOptions {
		id: string; // id
		title: string; //标题
		icon: string; //图标
		path?: string; // 路径
		type: MenType; //类型
		pid?: string; //上层id
		order: number; //排序
		status: boolean; //启用禁用
		isLink: boolean; //外链
		children?: MenuOptions[];
	}
	// interface MenuOptions {
	// 	path: string;
	// 	title: string;
	// 	icon?: string;
	// 	isLink?: string;
	// 	close?: boolean;
	// 	children?: MenuOptions[];
	// }
}

enum StatusEnum {
	Enable = 1,
	Disable = 2
}
export interface DataType {
	key?: string | number;
	title?: string;
	status?: StatusEnum;
	desc?: string;
	children?: DataType[];
	parentid?: string | number;
	isTop?: boolean;
}
// * Vite
declare type Recordable<T = any> = Record<string, T>;

declare interface ViteEnv {
	VITE_API_URL: string;
	VITE_PORT: number;
	VITE_OPEN: boolean;
	VITE_GLOB_APP_TITLE: string;
	VITE_DROP_CONSOLE: boolean;
	VITE_PROXY_URL: string;
	VITE_BUILD_GZIP: boolean;
	VITE_REPORT: boolean;
	VITE_HMR: boolean | any;
}

// * Dropdown MenuInfo
declare interface MenuInfo {
	key: string;
	keyPath: string[];
	/** @deprecated This will not support in future. You should avoid to use this */
	item: React.ReactInstance;
	domEvent: React.MouseEvent<HTMLElement> | React.KeyboardEvent<HTMLElement>;
}

declare module "zrender" {
	class Element {
		constructor(opts?: any);
		shape: any;
		style: any;
		type: string;
		setShape(opts: any): void;
		setStyle(opts: any): void;
	}
	class Group extends Element {
		id: number;
		add(child: Element): void;
		remove(child: Element): void;
		children(): Element[];
		childOfName(name: string): Element[];
	}
	class Displayable extends Element {}
	class Circle extends Displayable {}
	class Line extends Displayable {}
	class Image extends Displayable {}
	class Text extends Displayable {}
	class Polygon extends Displayable {}

	type EventHandler = (event: MouseEvent) => void;

	interface ZRender {
		add: (el: Element) => void;
		remove: (el: Element) => void;
		on: (eventName: string, eventHandler: EventHandler, context: object) => void;
		off: (eventName: string, eventHandler: EventHandler) => void;
	}

	interface initOpts {
		renderer?: string;
		devicePixelRatio?: number;
		width?: string | number;
		height?: string | number;
	}

	function init(dom: HTMLElement, opts?: initOpts): ZRender;
}
