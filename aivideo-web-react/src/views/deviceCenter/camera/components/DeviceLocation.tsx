import { Tree } from "antd";
import { DownOutlined } from "@ant-design/icons";
import type { TreeProps } from "antd/es/tree";
import { getDeviceLocation } from "@/api/modules/device";
import { useEffect, useState } from "react";
import { useDispatch } from "@/redux";
import { setSelectLocation } from "@/redux/modules/device";

const treeData = [
	{
		title: "村口",
		key: "0-0-0",
		children: [
			{
				title: "普通监控",
				key: "0-0-0-0"
			},
			{
				title: "周界防护",
				key: "0-0-0-1"
			},
			{
				title: "路口抓拍",
				key: "0-0-0-2"
			}
		]
	},
	{
		title: "村尾",
		key: "0-0-1",
		children: [
			{
				title: "普通监控",
				key: "0-0-1-0"
			},
			{
				title: "周界防护",
				key: "0-0-1-1"
			}
		]
	},
	{
		title: "吉利大街1",
		key: "0-0-2",
		children: [
			{
				title: "周界防护",
				key: "0-0-2-0"
			},
			{
				title: "三包",
				key: "0-0-2-1"
			}
		]
	},
	{
		title: "吉利大街2",
		key: "0-0-3",
		children: [
			{
				title: "罗湖幼儿园门口人脸球01",
				key: "0-0-3-0"
			},
			{
				title: "罗湖幼儿园门口人脸球02",
				key: "0-0-3-1"
			}
		]
	}
];

const DeviceLocation = () => {
	const [locationList, setLocationList] = useState<any>([]);
	const dispatch = useDispatch();

	const getLocationList = async () => {
		await getDeviceLocation({ page: 1 });
		// data = treeData;
		setLocationList(treeData);
	};

	const onSelect: TreeProps["onSelect"] = (selectedKeys, info) => {
		console.log("selected", selectedKeys, info);
		const { key, title } = info.selectedNodes[0];
		dispatch(
			setSelectLocation({
				key,
				title
			})
		);
	};

	useEffect(() => {
		getLocationList();
	}, []);

	return (
		<>
			<div className="device-left-header">
				<div className="device-left-title">设备位置</div>
			</div>
			<div className="device-left-body">
				<Tree showLine switcherIcon={<DownOutlined />} onSelect={onSelect} treeData={locationList} />
			</div>
		</>
	);
};

export default DeviceLocation;
