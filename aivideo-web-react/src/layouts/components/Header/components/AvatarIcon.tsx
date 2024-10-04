import { useRef } from "react";
import { Avatar, Modal, Dropdown, message } from "antd";
import type { MenuProps } from "antd";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { HOME_URL } from "@/config/config";
import { useDispatch, useSelector, RootState } from "@/redux";
import { resetAuthState } from "@/redux/modules/auth";
import { resetUserState } from "@/redux/modules/user";
import PasswordModal from "./PasswordModal";
import InfoModal from "./InfoModal";
import avatar from "@/assets/images/avatar.png";

const AvatarIcon = () => {
	const { userInfo } = useSelector((state: RootState) => state.user);
	const dispatch = useDispatch();
	const navigate = useNavigate();

	interface ModalProps {
		showModal: (params: { name: number }) => void;
	}
	const passRef = useRef<ModalProps>(null);
	const infoRef = useRef<ModalProps>(null);

	// 退出登录
	const logout = () => {
		Modal.confirm({
			title: "温馨提示 🧡",
			icon: <ExclamationCircleOutlined />,
			content: "是否确认退出登录？",
			okText: "确认",
			cancelText: "取消",
			onOk: () => {
				dispatch(resetUserState());
				dispatch(resetAuthState());
				message.success("退出登录成功！");
				navigate("/login");
			}
		});
	};

	const onClick: MenuProps["onClick"] = ({ key }) => {
		switch (key) {
			case "1":
				navigate(HOME_URL);
				break;
			case "2":
				infoRef.current!.showModal({ name: 11 });
				break;
			case "3":
				passRef.current!.showModal({ name: 11 });
				break;
			case "4":
				logout();
				break;
			default:
		}
	};

	const items: MenuProps["items"] = [
		{
			key: "1",
			label: <span className="dropdown-item">首页</span>
		},
		{
			key: "2",
			label: <span className="dropdown-item">个人信息</span>
		},
		// {
		// 	key: "3",
		// 	label: <span className="dropdown-item">修改密码</span>
		// },
		{
			type: "divider"
		},
		{
			key: "4",
			label: <span className="dropdown-item">退出登录</span>
		}
	];

	return (
		<>
			<span className="username">{userInfo?.userName || "test"}</span>
			<Dropdown menu={{ items, onClick }} placement="bottom" arrow trigger={["click"]}>
				<Avatar size="large" src={userInfo?.avatar || avatar} />
			</Dropdown>
			<InfoModal innerRef={infoRef}></InfoModal>
			<PasswordModal innerRef={passRef}></PasswordModal>
		</>
	);
};

export default AvatarIcon;
