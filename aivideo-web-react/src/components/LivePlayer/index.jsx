import "./index.less";
import { useEffect, useRef, useState } from "react";
import { Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";

const LivePlayer = props => {
	const { videoUrl, fullScreen, live = true } = props;
	const playerDom = useRef(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(false);

	const playHandler = () => {
		setLoading(false);
	};

	const errorHandler = () => {
		setLoading(false);
		setError(true);
	};
	useEffect(() => {
		let player;
		console.log(live);
		if (playerDom && playerDom.current) {
			player = playerDom.current;
			setLoading(true); //默认加载
			setError(false);
			if (videoUrl === "") {
				setLoading(false); //没有url直接结束loading
			}
			player.addEventListener("play", playHandler);
			player.addEventListener("error", errorHandler);
		}
		return () => {
			player.removeEventListener("play", playHandler);
			player.removeEventListener("error", errorHandler);
		};
	}, [videoUrl]);
	return (
		<div className="video-box">
			{loading ? (
				<div className="spin-container">
					<Spin indicator={<LoadingOutlined style={{ fontSize: 50 }} />} />
					<span style={{ color: "#fff" }}>视频加载中...</span>
				</div>
			) : (
				""
			)}
			{error ? (
				<div className="spin-container">
					<span style={{ color: "#fff" }}>视频播放失败...</span>
				</div>
			) : (
				""
			)}
			<live-player
				ref={playerDom}
				video-url={videoUrl}
				live={live}
				stretch="true"
				hasaudio="false"
				fluent="true"
				autoplay="true"
				hide-big-play-button="true"
				alt="无画面"
				aspect={fullScreen ? "fullscreen" : ""}
			></live-player>
		</div>
	);
};

export default LivePlayer;
