import { useEffect } from "react";
import { Outlet } from "react-router-dom";
import { Layout } from "antd";
// import { getMenuList } from "@/api/modules/login";
// import { setAuthMenu, setAuthRouter, setAuthButton } from "@/redux/modules/auth";
import { updateCollapse } from "@/redux/modules/menu";
// import { getAuthorButtons } from "@/api/modules/login";
import { RootState, useDispatch, useSelector } from "@/redux";
import LayoutMenu from "./components/Menu";
import LayoutHeader from "./components/Header";
import LayoutTabs from "./components/Tabs";
// import { MenType } from "@/enums/menuEnum";
// import LayoutFooter from "./components/Footer";
import "./index.less";

const LayoutIndex = () => {
	const dispatch = useDispatch();
	// const auth = useSelector((state: RootState) => state.auth);
	const { isCollapse } = useSelector((state: RootState) => state.menu);
	// const { permission } = useSelector((state: RootState) => state.user);

	const { Sider, Content } = Layout;

	// 获取按钮权限列表
	// const getAuthButtonsList = async () => {
	// 	const { data } = await getAuthorButtons();
	// 	dispatch(setAuthButtons(data!));
	// };

	// 监听窗口大小变化
	const listeningWindow = () => {
		window.onresize = () => {
			return (() => {
				let screenWidth = document.body.clientWidth;
				if (!isCollapse && screenWidth < 1200) dispatch(updateCollapse(true));
				if (!isCollapse && screenWidth > 1200) dispatch(updateCollapse(false));
			})();
		};
	};

	// const getPermissionData = async () => {
	// 	// 获取全部菜单,通过权限判断筛选
	// 	const { data } = await getMenuList();
	// 	const menu = data?.menu || [];
	// 	const [authRoute, authMenu, authButton] = filterPermission(menu);
	// 	console.log(authRoute, authMenu, authButton);
	// 	dispatch(setAuthMenu(authMenu));
	// 	dispatch(setAuthRouter(authRoute));
	// 	dispatch(setAuthButton(authButton));
	// };

	// const filterPermission = (menu: Menu.MenuOptions[]) => {
	// 	let authRoute: string[] = [],
	// 		authMenu: Menu.MenuOptions[] = [],
	// 		authButton: string[] = [];
	// 	if (permission.length > 0) {
	// 		const auth = menu.filter(item => permission.indexof(item.id));
	// 		authRoute = auth.filter(item => item.type === MenType.PAGE).map(item => item.id);
	// 		authButton = auth.filter(item => item.type === MenType.BUTTON).map(item => item.id);
	// 		authMenu = auth.filter(item => {
	// 			item.children = auth.filter(item_s => item.id === item_s.pid);
	// 			return !item.pid;
	// 		});
	// 	}
	// 	// 根据用户权限列表筛选出对应的菜单、路由、按钮
	// 	return [authRoute, authMenu, authButton];
	// };

	useEffect(() => {
		// console.log(auth);
		listeningWindow();
		// getPermissionData();
		// getAuthButtonsList();
	}, []);

	return (
		<Layout className="container">
			<Sider trigger={null} collapsed={isCollapse} width={220} theme="dark">
				<LayoutMenu></LayoutMenu>
			</Sider>
			<Layout>
				<LayoutHeader></LayoutHeader>
				<LayoutTabs></LayoutTabs>
				<Content>
					<Outlet></Outlet>
				</Content>
				{/* <LayoutFooter></LayoutFooter> */}
			</Layout>
		</Layout>
	);
};

export default LayoutIndex;
