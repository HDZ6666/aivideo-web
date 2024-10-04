import "./index.less";
import { Tree, Col, Row, Space, message } from "antd";
import type { TreeDataNode, TreeProps } from "antd";
import {
	DownOutlined,
	BorderOutlined,
	AppstoreOutlined,
	TableOutlined,
	FullscreenOutlined,
	FullscreenExitOutlined
} from "@ant-design/icons";
import { useState, useEffect, useRef } from "react";
import screenfull from "screenfull";
import LivePlayer from "@/components/LivePlayer";
import { getDeviceScreenList } from "@/api/modules/device";
// import { useState } from "react";

interface TreeData extends TreeDataNode {
	videoUrl?: string;
	children?: TreeData[];
}

const treeData: TreeData[] = [
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
						key: "0-0-0-0-0",
						videoUrl: "http://192.168.1.110:80/rtp/31010500002000000002_34020000001320000001.live.flv"
					},
					{
						title: "村口-牌坊-枪机#2",
						key: "0-0-0-0-1",
						videoUrl: "ws://183.239.58.24:20001/rtp/44010200491330000001_44010200491330000001.live.flv"
					},
					{
						title: "村口-牌坊-枪机#3",
						key: "0-0-0-0-2",
						videoUrl: ""
					},
					{
						title: "村口-牌坊-枪机#4",
						key: "0-0-0-0-3",
						videoUrl: "ws://192.168.1.110:80/rtp/31010500002000000002_34020000001320000001.live.flv"
					}
				]
			},
			{
				title: "周界防护",
				key: "0-0-0-1",
				children: [
					{
						title: "村口-牌坊-球机#1",
						key: "0-0-0-1-0",
						videoUrl: "ws://192.168.1.110:80/rtp/31010500002000000002_34020000001320000001.live.flv"
					},
					{
						title: "村口-牌坊-球机#2",
						key: "0-0-0-1-1",
						videoUrl: "ws://192.168.1.110:80/rtp/31010500002000000002_34020000001320000001.live.flv"
					},
					{
						title: "村口-牌坊-球机#3",
						key: "0-0-0-1-2",
						videoUrl: "ws://192.168.1.110:80/rtp/31010500002000000002_34020000001320000001.live.flv"
					},
					{
						title: "村口-牌坊-球机#4",
						key: "0-0-0-1-3",
						videoUrl: "ws://192.168.1.110:80/rtp/31010500002000000002_34020000001320000001.live.flv"
					}
				]
			},
			{
				title: "路口抓拍",
				key: "0-0-0-2",
				children: [
					{
						title: "村口-路口抓拍-球机#1",
						key: "0-0-0-2-0",
						videoUrl: "ws://192.168.1.110:80/rtp/31010500002000000002_34020000001320000001.live.flv"
					},
					{
						title: "村口-路口抓拍-球机#2",
						key: "0-0-0-2-1",
						videoUrl: "ws://192.168.1.110:80/rtp/31010500002000000002_34020000001320000001.live.flv"
					},
					{
						title: "村口-路口抓拍-球机#3",
						key: "0-0-0-2-2",
						videoUrl: "ws://192.168.1.110:80/rtp/31010500002000000002_34020000001320000001.live.flv"
					},
					{
						title: "村口-路口抓拍-球机#4",
						key: "0-0-0-2-3",
						videoUrl: "ws://192.168.1.110:80/rtp/31010500002000000002_34020000001320000001.live.flv"
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

const DeviceScreen = () => {
	const videoBox = useRef(null);
	const [deviceList, setDeviceList] = useState<any>([]); // 设备列表
	const [fullScreen, setFullScreen] = useState<boolean>(screenfull.isFullscreen);
	// const [activeVideo, setActiveVideo] = useState(0);
	const [videoList, setVideoList] = useState<any>([{ videoUrl: "" }]); //视频数组
	const [checkedDevices, setCheckedDevices] = useState<any>([]); // 选中的设备
	const [spiltNum, setSpiltNum] = useState(1); // 分屏数量

	const onCheck: TreeProps["onCheck"] = (checkedKeys, info) => {
		const _checkedDevices = info.checkedNodes.filter(item => !(item.children && item.children.length > 0)); // 去掉父元素
		const playlist = _checkedDevices.filter((item: any, index: any) => index < spiltNum); // 拿到当前播放列表
		const _videoList = new Array(spiltNum).fill({ videoUrl: "" }).map((item: any, index: any) => {
			return index < playlist.length ? playlist[index] : item;
		});
		setVideoList(_videoList);
		setCheckedDevices(_checkedDevices);
	};

	// const loopPlay = () => {
	// 	const playlist = checkedDevices.filter((item: any, index: any) => index < spiltNum); // 拿到当前播放列表
	// 	// setTimeout(() => {

	// 	// }, 1000);
	// };

	// const handlePlayerClick = (index: number) => {
	// 	// const player = videoList[index]; // 拿到当前播放实例
	// 	setActiveVideo(index);
	// };

	const createCol = () => {
		return videoList.map((item: any, key: number) => {
			return (
				<Col span={24 / Math.sqrt(videoList.length)} key={key}>
					<LivePlayer videoUrl={item.videoUrl} fullScreen={fullScreen}></LivePlayer>
					{/* <div className={activeVideo === key ? "video-border" : ""} onClick={() => handlePlayerClick(key)}>
						<LivePlayer videoUrl={item.videoUrl} fullScreen={fullScreen}></LivePlayer>
					</div> */}
				</Col>
			);
		});
	};

	const handleFullScreen = () => {
		if (!screenfull.isEnabled) message.warning("当前您的浏览器不支持全屏 ❌");
		videoBox.current && screenfull.toggle(videoBox.current);
	};

	const handleSplitNum = (num: number) => {
		const _num = Math.pow(num, 2);
		const playlist = checkedDevices.filter((item: any, index: any) => index < _num); // 拿到当前播放列表
		const _videoList = new Array(_num).fill({ videoUrl: "" }).map((item, index) => {
			return index < playlist.length ? playlist[index] : item;
		});
		setVideoList(_videoList);
		setSpiltNum(_num);
	};

	const screenfullHandler = () => {
		setFullScreen(screenfull.isFullscreen);
	};

	const getDeviceList = async () => {
		let { data } = await getDeviceScreenList();
		data = treeData;
		setDeviceList(data);
	};

	useEffect(() => {
		getDeviceList();
		screenfull.on("change", screenfullHandler);
		return () => {
			screenfull.off("change", screenfullHandler);
		};
	}, []);

	return (
		<div className="device-screen-container">
			<div className="device-left-container">
				<div className="device-left-header">
					<div className="device-left-title">设备列表</div>
				</div>
				<div className="device-left-body">
					<Tree
						checkable
						showLine
						switcherIcon={<DownOutlined />}
						defaultExpandedKeys={["0-0-0"]}
						onCheck={onCheck}
						treeData={deviceList}
					/>
				</div>
			</div>
			<div className="device-right-container" ref={videoBox}>
				<div className="control-container">
					<Space>
						{fullScreen ? (
							<FullscreenExitOutlined className="splitIcon" onClick={handleFullScreen} />
						) : (
							<FullscreenOutlined className="splitIcon" onClick={handleFullScreen} />
						)}
						<BorderOutlined className="splitIcon" onClick={() => handleSplitNum(1)} />
						<AppstoreOutlined className="splitIcon" onClick={() => handleSplitNum(2)} />
						<TableOutlined className="splitIcon" onClick={() => handleSplitNum(3)} />
					</Space>
				</div>
				<div className="player-container">
					<Row style={{ height: fullScreen ? "100%" : "" }} gutter={[16, 16]}>
						{createCol()}
					</Row>
				</div>
			</div>
		</div>
	);
};

export default DeviceScreen;
