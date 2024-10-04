import { useRef, useState } from "react";
import { Form, Drawer, Space, Select, Input, Button, Tabs, Radio, Checkbox, InputNumber, Slider, Flex, Row, Col } from "antd";
import type { DrawerStyles } from "antd/es/drawer/DrawerPanel";
import PolyBrush2D from "@/components/PolyBrush2D";
import TimeLine from "@/components/TimeLine";
import "./index.less";
// import { sendAlarmMsg } from "@/api/modules/device";

interface MenuModalProps {
	info: any;
	modalType: String;
	isShow: boolean;
	setShow: (s: boolean) => void;
	updateTable: () => void;
}

const drawerStyles: DrawerStyles = {
	content: {
		width: "100%"
	}
};

const EditModal = ({ info, modalType, isShow, setShow, updateTable }: MenuModalProps) => {
	const [form] = Form.useForm();
	// const [configuration, setConfiguration] = useState<String>("");
	const dom = useRef(null);
	const timeline = useRef(null);
	const [confidence, setConfidence] = useState<number>(0);

	const handleOk = () => {
		updateTable();
		setShow(false);
		form.resetFields();
	};

	const handleRefresh = () => {};
	const handleAnalyze = () => {
		setShow(false);
		form.resetFields();
	};

	const handleOnBeforeDraw = () => {
		console.log(info, modalType);
		return true;
	};
	const handleComplete = (group: any) => {
		console.log(group.shape.points);
	};

	const handleRest = () => {
		if (dom && dom.current) {
			const current: any = dom.current;
			current.undo();
		}
	};

	const options = [
		{ label: "微信", value: "0" },
		{ label: "短信", value: "1" }
	];

	// const sendMsg = async () => {
	// 	const sendObj = {
	// 		templateId: "bf49b3c9-7075-46ea-9c48-47ff0922cade",
	// 		mobiles: "13078432483",
	// 		param: "张今宁,茶水间通道口,越界,2024年4月25日11点41分"
	// 	};
	// 	// const paramList = ["张今宁", "茶水间通道口", "越界", "2024年4月25日11点41分"];
	// 	// const phoneLis = ["13078432483"];
	// 	const res = await sendAlarmMsg(sendObj);
	// 	console.log(res);
	// };

	const configuration: Array<any> = [
		{
			label: "区域设置",
			key: 1,
			children: (
				<div className="region-container">
					<Row gutter={[0, 24]}>
						<Col span={24}>
							<Space>
								<Form.Item name="area" initialValue="0" rules={[{ required: true }]} noStyle>
									<Select
										style={{ width: 120 }}
										options={[
											{ value: "0", label: "全区域" },
											{ value: "1", label: "自定义区域" }
										]}
									/>
								</Form.Item>
								<Button onClick={handleRefresh}>刷新抽图</Button>
								<Button onClick={handleAnalyze}>分析图片</Button>
								<Button onClick={handleRest}>重置</Button>
							</Space>
						</Col>
						<Col span={24}>
							<div className="img-region">
								<PolyBrush2D
									width={640}
									height={360}
									color={"#ff4d4f"}
									errorColor={"#ff4d4f"}
									type="polygon"
									logging={true}
									onComplete={handleComplete}
									onBeforeDraw={handleOnBeforeDraw}
									ref={dom}
								></PolyBrush2D>
							</div>
						</Col>
					</Row>
				</div>
			)
		},
		{
			label: "基础配置",
			key: 2,
			children: (
				<div className="base-container">
					<Form.Item name="engine" label="接入引擎" rules={[{ required: true }]}>
						<Radio.Group>
							<Radio value="0">产品自带AI</Radio>
							<Radio value="1">云化AI</Radio>
						</Radio.Group>
					</Form.Item>
					<Form.Item name="device" label="选择设备" rules={[{ required: true }]}>
						<Row gutter={16}>
							<Col span={16}>
								<div className="box-wrapper">
									<span className="box-item">设备A</span>
									<span className="box-item">设备B</span>
									<span className="box-item">设备C</span>
								</div>
							</Col>
							<Col span={6}>
								<Button type="primary">请选择人员</Button>
							</Col>
						</Row>
					</Form.Item>
					<Form.Item label="通知方式">
						<Form.Item name="notificateType" noStyle>
							<Checkbox.Group options={options} />
						</Form.Item>
						{/* <Button onClick={sendMsg}>测试短信通知</Button> */}
					</Form.Item>
					<Form.Item name="notificatePeople" label="通知人员" rules={[{ required: true }]}>
						<Row gutter={16}>
							<Col span={16}>
								<div className="box-wrapper">
									<span className="box-item">李总</span>
									<span className="box-item">李总</span>
									<span className="box-item">李总</span>
								</div>
							</Col>
							<Col span={6}>
								<Button type="primary">请选择人员</Button>
							</Col>
						</Row>
					</Form.Item>
					<Form.Item name="monitoringTime" label="检测时间" rules={[{ required: true }]}>
						<TimeLine ref={timeline}></TimeLine>
					</Form.Item>
					<Form.Item name="spiltTime" initialValue={3} label="间隔时间" rules={[{ required: true }]}>
						<InputNumber min={1} precision={0} max={60} suffix="分钟" controls={false} />
					</Form.Item>
					<Form.Item name="alarmTime" initialValue={3} label="未告警提醒" rules={[{ required: true }]}>
						<InputNumber min={1} precision={0} max={60} suffix="小时" controls={false} />
					</Form.Item>
					<Form.Item name="confidence" label="置信度" rules={[{ required: true }]}>
						<Flex gap="middle" align="center">
							<Slider style={{ width: 500 }} value={confidence} onChange={value => setConfidence(value)} />
							<span>{confidence}%</span>
						</Flex>
					</Form.Item>
				</div>
			)
		},
		{
			label: "报警提示",
			key: 3,
			children: (
				<div className="base-container">
					<Form.Item name="name" label="音频选择" rules={[{ required: true }]}>
						<Space>
							<Input placeholder="请输入音频" />
							<Button>选择音频</Button>
						</Space>
					</Form.Item>
					<Form.Item name="status" label="广播设备" rules={[{ required: true }]}>
						<Row gutter={16}>
							<Col span={16}>
								<div className="box-wrapper">
									<span className="box-item">设备A</span>
								</div>
							</Col>
							<Col span={6}>
								<Button type="primary">请选择人员</Button>
							</Col>
						</Row>
					</Form.Item>
					<Form.Item label="报警器" name="isTop" valuePropName="checked">
						<Row gutter={16}>
							<Col span={16}>
								<div className="box-wrapper">
									<span className="box-item">设备A</span>
								</div>
							</Col>
							<Col span={6}>
								<Button type="primary">请选择人员</Button>
							</Col>
						</Row>
					</Form.Item>
				</div>
			)
		}
	];

	const handleCancel = () => {
		setShow(false);
	};

	return (
		<Drawer
			width="100%"
			styles={drawerStyles}
			title="配置详情"
			mask={false}
			footer={
				<Flex justify="center">
					<Space>
						<Button onClick={handleCancel}>取消</Button>
						<Button type="primary" onClick={handleOk}>
							保存
						</Button>
					</Space>
				</Flex>
			}
			open={isShow}
			getContainer={false}
		>
			<Form form={form} name="control-hooks" labelCol={{ span: 3 }} labelAlign="left">
				<Tabs defaultActiveKey="1" items={configuration} type="card" size="large" />
			</Form>
		</Drawer>
	);
};

export default EditModal;
