import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Menu } from "antd";
import { Menu as Menu_s } from "@/typings/global";
import { findAllBreadcrumb, getOpenKeys, searchRoute } from "@/utils/util";
// import { setMenuList as reduxSetMenuList } from "@/redux/modules/menu";
import { setBreadcrumbList } from "@/redux/modules/breadcrumb";
// import { setAuthRouter } from "@/redux/modules/auth";
// import { getMenuList } from "@/api/modules/login";
import { RootState, useDispatch, useSelector } from "@/redux";
// import { routerArray } from "@/routers";
// import { asyncRouteObject } from "@/routers/interface/index";
import type { MenuProps } from "antd";
import * as Icons from "@ant-design/icons";
import Logo from "./components/Logo";
import "./index.less";

const LayoutMenu = () => {
	const dispatch = useDispatch();
	const { isCollapse } = useSelector((state: RootState) => state.menu);
	const { authMenu } = useSelector((state: RootState) => state.auth);
	const { pathname } = useLocation();
	const [selectedKeys, setSelectedKeys] = useState<string[]>([pathname]);
	const [openKeys, setOpenKeys] = useState<string[]>([]);

	// 刷新页面菜单保持高亮
	useEffect(() => {
		setSelectedKeys([pathname]);
		isCollapse ? null : setOpenKeys(getOpenKeys(pathname));
	}, [pathname, isCollapse]);

	// 设置当前展开的 subMenu
	const onOpenChange = (openKeys: string[]) => {
		console.log(openKeys);
		if (openKeys.length === 0 || openKeys.length === 1) return setOpenKeys(openKeys);
		const latestOpenKey = openKeys[openKeys.length - 1];
		if (latestOpenKey.includes(openKeys[0])) return setOpenKeys(openKeys);
		setOpenKeys([latestOpenKey]);
	};

	// 定义 menu 类型
	type MenuItem = Required<MenuProps>["items"][number];
	const getItem = (
		label: React.ReactNode,
		key?: React.Key | null,
		icon?: React.ReactNode,
		children?: MenuItem[],
		type?: "group"
	): MenuItem => {
		return {
			key,
			icon,
			children,
			label,
			type
		} as MenuItem;
	};

	// 动态渲染 Icon 图标
	const customIcons: { [key: string]: any } = Icons;
	const addIcon = (name: string) => {
		return React.createElement(customIcons[name]);
	};

	// 处理后台返回菜单 key 值为 antd 菜单需要的 key 值
	const deepLoopFloat = (menuList: Menu_s.MenuOptions[], newArr: MenuItem[] = []) => {
		menuList.forEach((item: Menu_s.MenuOptions) => {
			// 下面判断代码解释 *** !item?.children?.length   ==>   (!item.children || item.children.length === 0)
			if (!item?.children?.length) return newArr.push(getItem(item.title, item.path ? item.path : item.id, addIcon(item.icon!)));
			newArr.push(getItem(item.title, item.path ? item.path : item.id, addIcon(item.icon!), deepLoopFloat(item.children)));
		});
		return newArr;
	};

	// 获取菜单列表并处理成 antd menu 需要的格式
	const [menuList, setMenuList] = useState<MenuItem[]>([]);
	// const [loading, setLoading] = useState(false);
	const getMenuData = () => {
		const menu = deepLoopFloat(authMenu);
		console.log(menu);
		setMenuList(menu);
		dispatch(setBreadcrumbList(findAllBreadcrumb(authMenu)));
		// setLoading(true);
		// try {
		// 	const { data } = await getMenuList();
		// 	if (!data) return;
		// 	// 获取一维数组权限列表
		// 	setMenuList(deepLoopFloat(data));
		// 	// 存储处理过后的所有面包屑导航栏到 redux 中
		// 	// console.log(findAllBreadcrumb(data));
		// 	dispatch(setBreadcrumbList(findAllBreadcrumb(data)));
		// 	// 把路由菜单处理成一维数组，存储到 redux 中，做菜单权限判断
		// 	const dynamicRouter = handleRouter(data);
		// 	dispatch(setAuthRouter(dynamicRouter));
		// 	dispatch(reduxSetMenuList(data));
		// } finally {
		// 	setLoading(false);
		// }
	};

	// const deepLoopFloat2 = (authRoute: string[], routes: asyncRouteObject[], newArr: MenuItem[] = []) => {
	// 	routes.forEach(item => {
	// 		const meta = item.meta;
	// 		if (!item?.children?.length) {
	// 			// 没children就判断权限
	// 			return authRoute.includes(item.path) && newArr.push(getItem(meta.title, item.path, addIcon(meta.icon!)));
	// 		}
	// 		const children = deepLoopFloat2(authRoute, item.children);
	// 		if (children.length > 0) {
	// 			return newArr.push(getItem(meta.title, item.path, addIcon(meta.icon!), children));
	// 		}
	// 	});
	// 	return newArr;
	// };

	useEffect(() => {
		getMenuData();
	}, []);

	// 点击当前菜单跳转页面
	const navigate = useNavigate();
	const clickMenu: MenuProps["onClick"] = ({ key }: { key: string }) => {
		const route = searchRoute(key, authMenu);
		if (route.isLink) window.open(route.isLink, "_blank");
		navigate(key);
	};

	return (
		<div className="menu">
			{/* <Spin spinning={loading} tip="Loading..."> */}
			<Logo isCollapse={isCollapse}></Logo>
			<Menu
				theme="dark"
				mode="inline"
				triggerSubMenuAction="click"
				openKeys={openKeys}
				selectedKeys={selectedKeys}
				items={menuList}
				onClick={clickMenu}
				onOpenChange={onOpenChange}
			></Menu>
			{/* </Spin> */}
		</div>
	);
};

export default LayoutMenu;
