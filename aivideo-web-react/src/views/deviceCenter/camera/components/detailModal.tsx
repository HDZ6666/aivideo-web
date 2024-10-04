// import { useState } from "react";
import { Modal, Row, Col, Button, Space, Spin } from "antd";
import { useEffect, useState } from "react";
import LivePlayer from "@/components/LivePlayer";
import { getDeviceVideoStream } from "@/api/modules/device";

interface MenuModalProps {
	info: any;
	isShow: boolean;
	setShow: (s: boolean) => void;
}

const DetailModal = ({ info, isShow, setShow }: MenuModalProps) => {
	const { national_num, channel } = info;
	const [mode, setMode] = useState("live");
	const [liveUrl, setLiveUrl] = useState("");
	const [recordUrl, setRecordUrl] = useState("");
	const [loading, setLoading] = useState(false);

	// const url1 = "ws://192.168.1.105:80/rtp/31010500002000000002_31010500001320000001.live.flv";
	// const url = `ws://192.168.1.105:80/rtp/${national_num}_${channel}.live.flv`;

	const rest = () => {
		setMode("live");
		setLiveUrl("");
		setRecordUrl("");
	};

	const getVideoUrl = async () => {
		// setLiveUrl(url);
		try {
			setLoading(true);
			const params = {
				serial: national_num,
				code: channel
			};
			const { data } = await getDeviceVideoStream(params);
			const { WS_FLV } = data;
			setLiveUrl(WS_FLV);
		} finally {
			setLoading(false);
		}
		setRecordUrl("https://vjs.zencdn.net/v/oceans.mp4");
	};

	useEffect(() => {
		isShow ? getVideoUrl() : rest();
	}, [isShow]);

	return (
		<Modal
			width="700px"
			title="查看画面"
			open={isShow}
			destroyOnClose={true}
			getContainer={false}
			onCancel={() => setShow(false)}
			footer={null}
		>
			<Spin spinning={loading}>
				<div className="detail-content">
					<Row gutter={[0, 8]}>
						<Col span={24}>
							<Space>
								<Button
									type="primary"
									onClick={() => {
										setMode("live");
									}}
								>
									实时画面
								</Button>
								<Button
									type="primary"
									onClick={() => {
										setMode("record");
									}}
								>
									查看录像
								</Button>
								{/* <Button type="primary" onClick={handleOk}>
										规则配置
									</Button> */}
							</Space>
						</Col>
						<Col span={24}>
							<LivePlayer videoUrl={mode === "live" ? liveUrl : recordUrl} fullScreen={false} live={mode === "live"}></LivePlayer>
						</Col>
					</Row>
				</div>
			</Spin>
		</Modal>
	);
};

export default DetailModal;
