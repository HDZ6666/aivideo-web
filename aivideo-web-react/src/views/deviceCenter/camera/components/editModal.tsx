// import { useState } from "react";
import SearchMap from "@/components/SearchMap";
import { Form, Drawer, Select, Input, Row, Col, TreeSelect, Flex, Space, Button } from "antd";
import type { DrawerStyles } from "antd/es/drawer/DrawerPanel";
import { useEffect } from "react";
// import { useEffect } from "react";

// interface deviceItem {
// 	key: string; //唯一id
// 	name: string; //设备名称
// 	type: number; //设备类型
// 	status: number; //状态
// 	location: string; //设备位置
// 	desc: string; // 设备描述
// 	facturer: string; //厂商
// 	refesh: boolean; // 抽图状态
// 	lastSnapshot: string; //最新快照
// 	cutPhoto: string; //切图照片
// }

interface MenuModalProps {
	treeData: any;
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

const EditModal = ({ treeData, info, modalType, isShow, setShow, updateTable }: MenuModalProps) => {
	const { Option } = Select;
	const [form] = Form.useForm();

	const handleOk = () => {
		console.log();
		updateTable();
		setShow(false);
		form.resetFields();
	};
	const handleCancel = () => {
		setShow(false);
		form.resetFields();
	};

	const onChange = (value: any) => {
		console.log(value);
	};

	useEffect(() => {
		if (isShow && modalType === "edit") {
			const formObj = modalType === "add" ? {} : { ...info };
			form.setFieldsValue(formObj);
		}
	}, [isShow]);

	const getLocation = (location: any) => {
		const { lat, lng } = location;
		const _form = { ...form.getFieldsValue() };
		_form.longitude = lng;
		_form.latitude = lat;
		form.setFieldsValue(_form);
	};

	return (
		<Drawer
			width="100%"
			styles={drawerStyles}
			title="新增设备"
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
			<Form form={form} name="control-hooks" layout="inline" labelCol={{ span: 4 }}>
				<Row gutter={[16, 0]}>
					<Col span={12}>
						<Row gutter={[0, 20]}>
							<Col span={24}>
								<Form.Item name="deciceNo" label="摄像头编号" rules={[{ required: true }]}>
									<Input placeholder="请输入摄像头编号" />
								</Form.Item>
							</Col>
							<Col span={24}>
								<Form.Item name="locationKey" label="所属位置" rules={[{ required: true }]}>
									<TreeSelect
										treeDefaultExpandAll
										onChange={onChange}
										fieldNames={{ label: "title", value: "key", children: "children" }}
										treeData={treeData}
										placeholder="请选择位置"
									/>
								</Form.Item>
							</Col>
							<Col span={24}>
								<Form.Item name="name" label="像头名称" rules={[{ required: true }]}>
									<Input placeholder="请输入摄像头名称" />
								</Form.Item>
							</Col>
							<Col span={24}>
								<Form.Item name="type" label="摄像头类型" rules={[{ required: true }]}>
									<Select placeholder="请选择摄像头类型" allowClear>
										<Option value={1}>枪机</Option>
										<Option value={2}>球机</Option>
									</Select>
								</Form.Item>
							</Col>
							<Col span={24}>
								<Form.Item name="playTime" label="回放时间" rules={[{ required: true }]}>
									<Select placeholder="请选择回放时间" allowClear>
										<Option value={1}>1分钟</Option>
										<Option value={2}>2分钟</Option>
										<Option value={3}>3分钟</Option>
										<Option value={4}>4分钟</Option>
										<Option value={5}>5分钟</Option>
									</Select>
								</Form.Item>
							</Col>
							<Col span={24}>
								<Form.Item name="address" label="安装地址" rules={[{ required: true }]}>
									<Input placeholder="请输入安装地址" />
								</Form.Item>
							</Col>
							<Col span={24}>
								<Form.Item name="coordinateSystem" label="坐标系" initialValue={1}>
									<Select placeholder="请选择坐标系">
										<Option value={1}>WGS84</Option>
										<Option value={2}>大地坐标</Option>
									</Select>
								</Form.Item>
							</Col>
							<Col span={24}>
								<Form.Item label="坐标">
									<Row gutter={[16, 0]}>
										<Col span={12}>
											<Form.Item name="longitude" noStyle>
												<Input placeholder="请输入经度" />
											</Form.Item>
										</Col>
										<Col span={12}>
											<Form.Item name="latitude" noStyle>
												<Input placeholder="请输入纬度" />
											</Form.Item>
										</Col>
									</Row>
								</Form.Item>
							</Col>
							<Col span={24}>
								<SearchMap getLocation={getLocation} isShow={isShow}></SearchMap>
							</Col>
						</Row>
					</Col>
					<Col span={12}>
						<Row gutter={[0, 20]}>
							<Col span={24}>
								<Form.Item name="facturer" label="设备厂商" rules={[{ required: true }]}>
									<Select placeholder="请选择设备厂商" allowClear>
										<Option value={1}>宇视</Option>
										<Option value={2}>大华</Option>
										<Option value={2}>海康</Option>
									</Select>
								</Form.Item>
							</Col>
							<Col span={24}>
								<Form.Item name="accessModee" label="视频接入方式" rules={[{ required: true }]}>
									<Select placeholder="请选择视频接入方式" allowClear>
										<Option value={1}>GB28181</Option>
									</Select>
								</Form.Item>
							</Col>
							<Col span={24}>
								<Form.Item name="national_num" label="国标号" rules={[{ required: true }]}>
									<Input placeholder="请输入国标号" />
								</Form.Item>
							</Col>
							<Col span={24}>
								<Form.Item name="channel" label="通道编码" rules={[{ required: true }]}>
									<Input placeholder="请输入通道编码" />
								</Form.Item>
							</Col>
							<Col span={24}>
								<Form.Item name="spiID" label="SPI ID" rules={[{ required: true }]}>
									<Input placeholder="请输入SPI ID" />
								</Form.Item>
							</Col>
						</Row>
					</Col>
				</Row>
			</Form>
		</Drawer>
	);
};

export default EditModal;
