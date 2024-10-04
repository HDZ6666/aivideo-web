import React from "react";
import lazyLoad from "@/routers/utils/lazyLoad";
import { RouteObject } from "@/routers/interface";
import { BlankLayoutIndex } from "@/routers/constant";
// 首页模块
const iframeRouter: Array<RouteObject> = [
	{
		element: <BlankLayoutIndex />,
		children: [
			{
				path: "/iframe/alarmList",
				element: lazyLoad(React.lazy(() => import("@/views/alarmCenter/alarmList/index"))),
				meta: {
					requiresAuth: true,
					title: "全部告警",
					key: "alarmList"
				}
			},
			{
				path: "/iframe/fence",
				element: lazyLoad(React.lazy(() => import("@/views/aiCenter/fence/index"))),
				meta: {
					requiresAuth: true,
					title: "电子围栏",
					key: "fence"
				}
			}
		]
	}
];

export default iframeRouter;
