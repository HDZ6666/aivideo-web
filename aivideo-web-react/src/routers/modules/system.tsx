import React from "react";
import lazyLoad from "@/routers/utils/lazyLoad";
import { RouteObject } from "@/routers/interface";
import { LayoutIndex } from "@/routers/constant";
// 首页模块
const systemRouter: Array<RouteObject> = [
	{
		element: <LayoutIndex />,
		children: [
			{
				path: "/sys/user",
				element: lazyLoad(React.lazy(() => import("@/views/system/user/index"))),
				meta: {
					requiresAuth: true,
					title: "用户",
					key: "user"
				}
			}
		]
	}
];

export default systemRouter;
