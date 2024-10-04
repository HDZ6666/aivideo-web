import { Dropdown } from "antd";
import { setAssemblySize } from "@/redux/modules/global";
import type { MenuProps } from "antd";
import { RootState, useDispatch, useSelector } from "@/redux";
import type { SizeType } from "antd/lib/config-provider/SizeContext";

const AssemblySize = () => {
	const dispatch = useDispatch();
	const { assemblySize } = useSelector((state: RootState) => state.global);

	// 切换组件大小
	const onClick: MenuProps["onClick"] = ({ key }) => {
		dispatch(setAssemblySize(key as SizeType));
	};

	const items: MenuProps["items"] = [
		{
			key: "middle",
			disabled: assemblySize == "middle",
			label: <span>默认</span>
		},
		{
			disabled: assemblySize == "large",
			key: "large",
			label: <span>大型</span>
		},
		{
			disabled: assemblySize == "small",
			key: "small",
			label: <span>小型</span>
		}
	];

	return (
		<Dropdown menu={{ items, onClick }} placement="bottom" trigger={["click"]} arrow={true}>
			<i className="icon-style iconfont icon-contentright"></i>
		</Dropdown>
	);
};

export default AssemblySize;
