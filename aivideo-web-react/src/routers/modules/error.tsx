import React from "react";
import lazyLoad from "@/routers/utils/lazyLoad";
import { RouteObject } from "@/routers/interface";

// 数据大屏模块
const aiCenterRouter: Array<RouteObject> = [
	{
		path: "/403",
		element: lazyLoad(React.lazy(() => import("@/views/error/403"))),
		meta: {
			title: "无权限",
			key: "403"
		}
	},
	{
		path: "/404",
		element: lazyLoad(React.lazy(() => import("@/views/error/404"))),
		meta: {
			title: "找不到资源",
			key: "404"
		}
	},
	{
		path: "/500",
		element: lazyLoad(React.lazy(() => import("@/views/error/500"))),
		meta: {
			title: "服务器崩溃",
			key: "500"
		}
	}
];

export default aiCenterRouter;
