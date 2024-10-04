// export interface MetaProps {
// 	keepAlive?: boolean;
// 	requiresAuth?: boolean;
// 	title: string;
// 	key?: string;
// 	index?: number;
// 	tabs?: boolean;
// 	icon?: string;
// }

export interface MetaProps {
	keepAlive?: boolean;
	requiresAuth?: boolean;
	title: string;
	key?: string;
}

interface BaseRouteObject {
	caseSensitive?: boolean;
	element?: React.ReactNode;
	path: string;
	isLink?: string;
}

export interface RouteObject {
	caseSensitive?: boolean;
	children?: RouteObject[];
	element?: React.ReactNode;
	path?: string;
	meta?: MetaProps;
	isLink?: string;
}

// export interface RouteObject extends BaseRouteObject {
// 	meta?: MetaProps;
// 	children?: RouteObject[];
// }

export interface asyncRouteObject extends BaseRouteObject {
	meta: MetaProps;
	children?: asyncRouteObject[];
}
