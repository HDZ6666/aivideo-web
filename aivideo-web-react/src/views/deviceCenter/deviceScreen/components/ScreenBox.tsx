import { Col, Row, Space, message } from "antd";
import { BorderOutlined, AppstoreOutlined, TableOutlined, FullscreenOutlined, FullscreenExitOutlined } from "@ant-design/icons";
import { useState, useEffect, useRef } from "react";
import screenfull from "screenfull";
import LivePlayer from "@/components/LivePlayer";

const ScreenBox = () => {
	const videoBox = useRef(null);
	const [fullScreen, setFullScreen] = useState<boolean>(screenfull.isFullscreen);
	// const playerDom = useRef(null);
	const [activeVideo, setActiveVideo] = useState(0);
	const [videoList, setVideoList] = useState([{ videoUrl: "" }]); //视频数组

	// const handlePlay = (evt: any) => {
	// 	console.log(evt);
	// };

	const createCol = () => {
		return videoList.map((item, key) => {
			return (
				<Col span={24 / Math.sqrt(videoList.length)} key={key}>
					<div className={activeVideo === key ? "video-box video-border" : "video-box"} onClick={() => setActiveVideo(key)}>
						<LivePlayer videoUrl={item.videoUrl} fullScreen={fullScreen}></LivePlayer>
					</div>
					{/* </div> */}
					{/* <live-player
						ref={playerDom}
						video-url="ws://192.168.1.110:80/rtp/31010500002000000002_34020000001320000001.live.flv"
						live="true"
						stretch="true"
						hasaudio="false"
						fluent="true"
						autoplay="true"
						play={handlePlay}
					/> */}
					{/* <div className="video-container">
						<div className="video-inner">
							<div className={activeVideo === key ? "video-box video-border" : "video-box"} onClick={() => setActiveVideo(key)}>
								<div className="video-palyer-container">
								</div>
							</div>
						</div>
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
		const _videoList = new Array(Math.pow(num, 2)).fill({ videoUrl: "" });
		setVideoList(_videoList);
	};

	useEffect(() => {
		screenfull.on("change", () => {
			setFullScreen(screenfull.isFullscreen);
			return () =>
				screenfull.off("change", () => {
					console.log("取消");
				});
		});
	}, []);

	return (
		<>
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
			<div className="player-container" ref={videoBox}>
				<Row style={{ height: fullScreen ? "100%" : "" }} gutter={[16, 16]}>
					{createCol()}
				</Row>
			</div>
		</>
	);
};

export default ScreenBox;
