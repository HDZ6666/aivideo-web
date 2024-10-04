import React from "react";
import lazyLoad from "@/routers/utils/lazyLoad";
import { RouteObject } from "@/routers/interface";
import { LayoutIndex } from "@/routers/constant";

// 数据大屏模块
const aiCenterRouter: Array<RouteObject> = [
	{
		element: <LayoutIndex />,
		children: [
			{
				path: "/aiCenter/fence",
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

export default aiCenterRouter;
