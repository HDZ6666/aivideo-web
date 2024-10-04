import { Drawer, Divider, Switch, message } from "antd";
import { useState } from "react";
import { RootState, useDispatch, useSelector } from "@/redux";
import { FireOutlined } from "@ant-design/icons";
import { setWeakOrGray } from "@/redux/modules/global";

const Theme = () => {
	const dispatch = useDispatch();
	const { weakOrGray } = useSelector((state: RootState) => state.global.themeConfig);
	const [visible, setVisible] = useState<boolean>(false);

	const onChange = (checked: boolean, theme: string) => {
		if (checked) return dispatch(setWeakOrGray(theme));
		dispatch(setWeakOrGray(""));
	};

	return (
		<>
			<i
				className="icon-style iconfont icon-zhuti"
				onClick={() => {
					setVisible(true);
				}}
			></i>
			<Drawer
				title="布局设置"
				closable={false}
				onClose={() => {
					setVisible(false);
				}}
				open={visible}
				width={320}
			>
				<Divider className="divider">
					<FireOutlined />
					全局主题
				</Divider>
				<div className="theme-item">
					<span>暗黑模式（未完成）</span>
					<Switch
						checkedChildren={<>🌞</>}
						unCheckedChildren={<>🌜</>}
						onChange={() => {
							message.success("欢迎提交 pull request ✨");
						}}
					/>
				</div>
				<div className="theme-item">
					<span>灰色模式</span>
					<Switch
						checked={weakOrGray === "gray"}
						onChange={e => {
							onChange(e, "gray");
						}}
					/>
				</div>
				<div className="theme-item">
					<span>色弱模式</span>
					<Switch
						checked={weakOrGray === "weak"}
						onChange={e => {
							onChange(e, "weak");
						}}
					/>
				</div>
			</Drawer>
		</>
	);
};

export default Theme;
