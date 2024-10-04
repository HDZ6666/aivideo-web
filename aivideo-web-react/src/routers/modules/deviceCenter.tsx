import React from "react";
import lazyLoad from "@/routers/utils/lazyLoad";
import { RouteObject } from "@/routers/interface";
import { LayoutIndex } from "@/routers/constant";

// 数据大屏模块
const deviceRouter: Array<RouteObject> = [
	{
		element: <LayoutIndex />,
		children: [
			{
				path: "/deviceCenter/camera",
				element: lazyLoad(React.lazy(() => import("@/views/deviceCenter/camera/index"))),
				meta: {
					requiresAuth: true,
					title: "摄像头",
					key: "camera"
				}
			},
			{
				path: "/deviceCenter/deviceScreen",
				element: lazyLoad(React.lazy(() => import("@/views/deviceCenter/deviceScreen/index"))),
				meta: {
					requiresAuth: true,
					title: "分屏展示",
					key: "deviceScreen"
				}
			},
			{
				path: "/deviceCenter/deviceLocation",
				element: lazyLoad(React.lazy(() => import("@/views/deviceCenter/deviceLocation/index"))),
				meta: {
					requiresAuth: true,
					title: "设备位置",
					key: "deviceLocation"
				}
			}
		]
	}
];

export default deviceRouter;
