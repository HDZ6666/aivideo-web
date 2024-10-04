// import { useState } from "react";
import { Modal, Row, Col, Button, Space, Descriptions, Tag, Image, Spin } from "antd";
import { useEffect, useState } from "react";
import { getAlarmDetailByID, updateAlarmStatus, getDeviceVideoStream } from "@/api/modules/device";
import LivePlayer from "@/components/LivePlayer";

interface MenuModalProps {
	info: any;
	isShow: boolean;
	setShow: (s: boolean) => void;
	updateList: () => void;
}

const DetailModal = ({ info, isShow, setShow, updateList }: MenuModalProps) => {
	const [detailData, setDetailData] = useState<any>({});
	const [selectImage, setSelectImage] = useState("");
	const [selectImageList, setSelectImageList] = useState<any>([]);
	const [mode, setMode] = useState("picture");
	const [liveUrl, setLiveUrl] = useState("");
	const [spinning, setSpinning] = useState(false);
	// const handleOk = () => {
	// 	updateList();
	// 	setShow(false);
	// };

	const handleAlarm = async (type: number) => {
		setSpinning(true);
		const params = {
			alarmId: info.alarmId,
			status: type
		};
		await updateAlarmStatus(params);
		updateList();
		setShow(false);
		setSpinning(false);
		// try {
		// 	await updateAlarmStatus(params);
		// 	updateList();
		// 	setShow(false);
		// } finally {
		// 	updateList();
		// 	setShow(false);
		// }
	};

	const handleChangeMode = (mode: string) => {
		if (mode === "live") {
			getVideoUrl();
		}
		setMode(mode);
	};

	const getVideoUrl = async () => {
		const detail = detailData.detail;
		if (detail && detail.national_num && detail.channel) {
			const params = {
				serial: detail.national_num,
				code: detail.channel
			};
			const { data } = await getDeviceVideoStream(params);
			const { WS_FLV } = data;
			setLiveUrl(WS_FLV);
		}
	};

	const handleImageChange = (index: number) => {
		setSelectImage(selectImageList[index]);
	};

	const getDetail = async () => {
		setSpinning(true);
		let { data } = await getAlarmDetailByID({ alarm_id: info.alarmId });
		data.noticePeople = ["小吴", "小黄", "小曾"];
		setSelectImage(data.alarm_img);
		setSelectImageList([data.alarm_img]);
		setDetailData(data);
		setSpinning(false);
	};

	const rest = () => {
		setDetailData({});
		setSelectImage("");
		setMode("picture");
	};

	useEffect(() => {
		isShow && getDetail();
		!isShow && rest();
	}, [isShow]);

	return (
		<Modal
			width="900px"
			title="事件详情"
			open={isShow}
			destroyOnClose={true}
			getContainer={false}
			onCancel={() => setShow(false)}
			footer={
				info.status === 0
					? [
							<Button key="back" onClick={() => handleAlarm(2)}>
								误报
							</Button>,
							<Button type="primary" onClick={() => handleAlarm(1)}>
								快速处理
							</Button>
					  ]
					: [<Button disabled>{info.status === 1 ? "已处理" : "误报"}</Button>]
			}
		>
			<Spin spinning={spinning}>
				<div className="detail-content">
					<Row gutter={[16, 0]}>
						<Col span={14}>
							<Row gutter={[0, 8]}>
								<Col span={24}>
									<Space>
										<Button
											type="primary"
											onClick={() => {
												handleChangeMode("picture");
											}}
										>
											查看图片
										</Button>
										<Button
											type="primary"
											onClick={() => {
												handleChangeMode("live");
											}}
										>
											实时画面
										</Button>
										{/* <Button
											type="primary"
											onClick={() => {
												handleChangeMode("record");
											}}
										>
											查看录像
										</Button> */}
										{/* <Button type="primary" onClick={handleOk}>
											规则配置
										</Button> */}
									</Space>
								</Col>
								{mode === "picture" && (
									<Col span={24}>
										<Image
											width="100%"
											height="280px"
											style={{ objectFit: "contain", backgroundColor: "#000" }}
											src={selectImage}
										/>
										<Row gutter={[2, 0]}>
											{selectImageList.map((item: any, index: number) => {
												return (
													<Col span={6} key={index}>
														<img
															className="imgpreview-item"
															src={item}
															alt=""
															onClick={() => {
																handleImageChange(index);
															}}
														/>
														{/* <Image
															width="100%"
															height="60px"
															src={item}
															preview={false}
															onClick={() => {
																handleImageChange(index);
															}}
														/> */}
													</Col>
												);
											})}
										</Row>
									</Col>
								)}
								{(mode === "live" || mode === "record") && (
									<Col span={24}>
										<LivePlayer
											videoUrl={mode === "live" ? liveUrl : detailData.recordVideo}
											fullScreen={false}
											live={mode === "live"}
										></LivePlayer>
									</Col>
								)}
							</Row>
						</Col>
						<Col span={10}>
							<Descriptions title="告警信息" column={1}>
								<Descriptions.Item label="检测类型">{detailData.alarm_type_name}</Descriptions.Item>
								<Descriptions.Item label="告警时间">{detailData.alarm_time}</Descriptions.Item>
								<Descriptions.Item label="置信度">{detailData.degree || "70%"}</Descriptions.Item>
								<Descriptions.Item label="设备名称">{detailData.camera_name || "信息大厦_华为摄像头#1"}</Descriptions.Item>
								<Descriptions.Item label="通知方式">{detailData.noticeType || "微信"}</Descriptions.Item>
								<Descriptions.Item label="通知人">
									<Space className="info-detail-notice">
										{detailData?.noticePeople?.map((item: any) => {
											return <Tag>{item}</Tag>;
										})}
									</Space>
								</Descriptions.Item>
								<Descriptions.Item label="处理人">{detailData?.finshPeople?.name}</Descriptions.Item>
							</Descriptions>
						</Col>
					</Row>
				</div>
			</Spin>
		</Modal>
	);
};

export default DetailModal;
