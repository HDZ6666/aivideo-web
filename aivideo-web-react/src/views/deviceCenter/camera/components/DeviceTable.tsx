import { useState } from "react";
import { Space, Button, Col, Form, Input, Row, Select, Tag, Modal, Image } from "antd";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import EditModal from "./editModal";
import channelsnap from "@/assets/images/channelsnap.jpg";
import imageError from "@/assets/images/imageError.png";
import MyTable from "@/components/MyTable";

enum StatusEnum {
	Enable = 1,
	Disable = 2
}

enum TypeEnum {
	BoxCamera = 1, // 枪机
	DomeCamera = 2, // 球机
	FullviewCamera = 3, // 全景
	OtherCamera = 4 // 其他
}

interface DataType {
	key: string;
	name: string;
	type: TypeEnum;
	status: StatusEnum;
	location: string;
	desc: string;
	facturer: string;
	refesh: boolean;
	lastSnapshot: string;
	cutPhoto: string;
}

const getDeviceType = (type: TypeEnum) => {
	switch (type) {
		case TypeEnum.BoxCamera:
			return "枪机";
		case TypeEnum.DomeCamera:
			return "球机";
		case TypeEnum.FullviewCamera:
			return "全景";
		case TypeEnum.OtherCamera:
			return "其他";
		default:
			return "其他";
	}
};

const createTableData = () => {
	let list = [];
	for (let i = 0; i < 50; i++) {
		const treeNode: DataType = {
			key: `${i}`,
			name: `村口-牌坊-枪机#${i + 1}`,
			type: Math.floor(Math.random() * 3 + 1), // 1-4
			status: Math.round(Math.random() + 1), // 1-2
			location: "村口-普通监控",
			desc: "主要监控村口牌坊的进出口",
			facturer: i % 2 === 0 ? "大华" : "海康",
			refesh: i % 2 === 0,
			lastSnapshot: i % 2 === 0 ? channelsnap : "",
			cutPhoto: i % 2 === 1 ? channelsnap : ""
		};
		list.push(treeNode);
	}
	return list;
};
const data: DataType[] = createTableData();

const { Option } = Select;
const { confirm } = Modal;

const DeviceLocation = () => {
	const columns: ColumnsType<DataType> = [
		{
			title: "设备名称",
			dataIndex: "name",
			width: 150,
			key: "name"
		},
		{
			title: "状态",
			dataIndex: "status",
			key: "status",
			width: 100,
			render: text => (
				<Tag color={text === StatusEnum.Enable ? "green" : "error"}>{text === StatusEnum.Enable ? "在线" : "离线"}</Tag>
			)
		},
		{
			title: "位置",
			dataIndex: "location",
			key: "location",
			width: 200
		},
		{
			title: "厂商",
			dataIndex: "facturer",
			key: "facturer",
			width: 50
		},
		{
			title: "类型",
			dataIndex: "type",
			key: "type",
			width: 50,
			render: text => getDeviceType(text)
		},
		{
			title: "抽图状态",
			dataIndex: "status",
			key: "status",
			width: 100,
			render: text => (text ? "停止抽图" : "正在抽图")
		},
		{
			title: "最近快照",
			dataIndex: "lastSnapshot",
			key: "lastSnapshot",
			width: 100,
			render: text => <Image width={50} height={30} src={text} fallback={imageError} />
		},
		{
			title: "切图照片",
			dataIndex: "cutPhoto",
			key: "cutPhoto",
			width: 100,
			render: text => <Image width={50} height={30} src={text} fallback={imageError} />
		},
		{
			title: "操作",
			key: "action",
			fixed: "right",
			width: 150,
			render: (_, record) => (
				<Space size="middle">
					<a
						onClick={() => {
							onEdit(record);
						}}
					>
						编辑
					</a>
					<a
						onClick={() => {
							onDelete(record);
						}}
					>
						删除
					</a>
					<a
						onClick={() => {
							onEdit(record);
						}}
					>
						画面
					</a>
				</Space>
			)
		}
	];

	const [form] = Form.useForm();
	const [showModal, setShowModal] = useState(false);
	const [selectInfo, setSelectInfo] = useState<DataType | any>({});
	const [modalType, setModalType] = useState<string>("add");

	const onFinish = (values: any) => {
		console.log("Received values of form: ", values);
	};

	const onAdd = () => {
		setModalType("add");
		setShowModal(true);
	};

	const onEdit = (item: DataType) => {
		setModalType("edit");
		setSelectInfo(item);
		setShowModal(true);
	};

	const onDelete = (item: DataType) => {
		setSelectInfo(item);
		confirm({
			title: `确认删除类别【${item.name}】?`,
			icon: <ExclamationCircleOutlined />,
			content: `删除类别【${item.name}】后无法，子类别也会一并删除`,
			okText: "确定",
			okType: "danger",
			cancelText: "再想想",
			onOk() {
				console.log("");
			},
			onCancel() {
				console.log("");
			}
		});
	};

	const updateTable = () => {
		console.log("更新表格");
	};

	const rowSelection = {
		onChange: (selectedRowKeys: React.Key[], selectedRows: DataType[]) => {
			console.log(`selectedRowKeys: ${selectedRowKeys}`, "selectedRows: ", selectedRows);
		}
	};

	return (
		<>
			<div className="search-container">
				<Form form={form} name="advanced_search" className="ant-advanced-search-form" onFinish={onFinish}>
					<Row gutter={24}>
						<Col span={8}>
							<Form.Item name="type" label="设备名称">
								<Input placeholder="请输入名称" />
							</Form.Item>
						</Col>
						<Col span={8}>
							<Form.Item name="status" label="状态">
								<Select allowClear>
									<Option value="1">在线</Option>
									<Option value="2">离线</Option>
								</Select>
							</Form.Item>
						</Col>
						<Col span={8}>
							<Space>
								<Button type="primary" htmlType="submit">
									搜索
								</Button>
								<Button
									onClick={() => {
										form.resetFields();
									}}
								>
									重置
								</Button>
							</Space>
						</Col>
					</Row>
				</Form>
			</div>
			<div className="control-container">
				<Space>
					<Button type="primary" onClick={onAdd}>
						批量配置
					</Button>
					<Button type="primary" onClick={onAdd}>
						新增设备
					</Button>
					<Button type="primary" onClick={onAdd}>
						导入设备
					</Button>
					<Button danger type="primary" onClick={onAdd}>
						批量删除
					</Button>
				</Space>
			</div>
			<div className="content-container">
				<MyTable
					rowSelection={{
						...rowSelection
					}}
					columns={columns}
					dataSource={data}
					scroll={{ x: "100%" }}
				></MyTable>
			</div>
			<EditModal
				treeData={[]}
				info={selectInfo}
				isShow={showModal}
				modalType={modalType}
				setShow={setShowModal}
				updateTable={updateTable}
			/>
		</>
	);
};

export default DeviceLocation;
