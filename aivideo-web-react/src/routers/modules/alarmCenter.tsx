import React from "react";
import lazyLoad from "@/routers/utils/lazyLoad";
import { RouteObject } from "@/routers/interface";
import { LayoutIndex } from "@/routers/constant";
// 数据大屏模块
const alarmCenterRouter: Array<RouteObject> = [
	{
		element: <LayoutIndex />,
		children: [
			{
				path: "/alarmCenter/alarmList",
				element: lazyLoad(React.lazy(() => import("@/views/alarmCenter/alarmList/index"))),
				meta: {
					requiresAuth: true,
					title: "全部告警",
					key: "alarmList"
				}
			}
		]
	}
];

export default alarmCenterRouter;
