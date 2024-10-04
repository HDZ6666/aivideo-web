import { Tree } from "antd";
import { DownOutlined } from "@ant-design/icons";
import type { DataNode } from "antd/es/tree";

type IProps = {
	onSelect: (selectedKeys: any, info: any) => void;
};

const DeviceLocation = (props: IProps) => {
	const { onSelect } = props;
	// const onSelect: TreeProps["onSelect"] = (selectedKeys, info) => {
	// 	console.log("selected", selectedKeys, info);
	// };

	const treeData: DataNode[] = [
		{
			title: "村口",
			key: "0-0-0",
			children: [
				{
					title: "普通监控",
					key: "0-0-0-0",
					children: [
						{
							title: "村口-牌坊-枪机#1",
							key: "0-0-0-0-0"
						},
						{
							title: "村口-牌坊-枪机#2",
							key: "0-0-0-0-1"
						},
						{
							title: "村口-牌坊-枪机#3",
							key: "0-0-0-0-2"
						},
						{
							title: "村口-牌坊-枪机#4",
							key: "0-0-0-0-3"
						}
					]
				},
				{
					title: "周界防护",
					key: "0-0-0-1",
					children: [
						{
							title: "村口-牌坊-球机#1",
							key: "0-0-0-1-0"
						},
						{
							title: "村口-牌坊-球机#2",
							key: "0-0-0-1-1"
						},
						{
							title: "村口-牌坊-球机#3",
							key: "0-0-0-1-2"
						},
						{
							title: "村口-牌坊-球机#4",
							key: "0-0-0-1-3"
						}
					]
				},
				{
					title: "路口抓拍",
					key: "0-0-0-2",
					children: [
						{
							title: "村口-路口抓拍-球机#1",
							key: "0-0-0-2-0"
						},
						{
							title: "村口-路口抓拍-球机#2",
							key: "0-0-0-2-1"
						},
						{
							title: "村口-路口抓拍-球机#3",
							key: "0-0-0-2-2"
						},
						{
							title: "村口-路口抓拍-球机#4",
							key: "0-0-0-2-3"
						}
					]
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

	return (
		<>
			<div className="device-left-header">
				<div className="device-left-title">设备列表</div>
			</div>
			<div className="device-left-body">
				<Tree showLine switcherIcon={<DownOutlined />} defaultExpandedKeys={["0-0-0"]} onSelect={onSelect} treeData={treeData} />
			</div>
		</>
	);
};

export default DeviceLocation;
