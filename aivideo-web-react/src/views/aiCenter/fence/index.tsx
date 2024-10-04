import { useState } from "react";
import { Space, Button, Table, Col, Form, Input, Row, Select, Tag, Modal } from "antd";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import "./index.less";
import EditModal from "../components/editModal";

const { Option } = Select;
const { confirm } = Modal;
interface UserType {
	name: string;
	userid: string;
}

interface DataType {
	key?: number;
	deviceName?: string;
	status?: number;
	noticeType?: string;
	noticePeople?: UserType[];
	deviceLocation?: string;
	last_alarm_time?: string;
	pae?: string;
}

const createData = () => {
	return new Array(10).fill(1).map((item, index) => {
		return {
			key: index,
			deviceName: `村口-牌坊-机枪#${index}`,
			status: index % 2,
			noticeType: "微信",
			noticePeople: [
				{
					name: "张总",
					userid: `user-${index + 1001}`
				},
				{
					name: "李总",
					userid: `user-${index + 1002}`
				},
				{
					name: "布总",
					userid: `user-${index + 1003}`
				}
			],
			deviceLocation: "村口-牌坊",
			last_alarm_time: "2024-02-25 14:28:42",
			pae: "自研PAE"
		};
	});
};
const Fence = () => {
	const columns: ColumnsType<DataType> = [
		{
			title: "设备名称",
			dataIndex: "deviceName",
			key: "deviceName"
		},
		{
			title: "状态",
			dataIndex: "status",
			key: "status",
			render: text => <Tag color={+text === 0 ? "green" : "error"}>{+text === 0 ? "启用" : "禁用"}</Tag>
		},
		{
			title: "通知方式",
			dataIndex: "noticeType",
			key: "noticeType"
		},
		{
			title: "通知人员",
			dataIndex: "noticePeople",
			render: text => text.map((item: UserType, index: number) => <Tag key={index}>{item.name}</Tag>)
		},
		{
			title: "设备地址",
			dataIndex: "deviceLocation",
			key: "deviceLocation"
		},
		{
			title: "最近警告时间",
			dataIndex: "last_alarm_time",
			key: "last_alarm_time"
		},
		{
			title: "接入引擎",
			dataIndex: "pae",
			key: "pae"
		},
		{
			title: "操作",
			key: "action",
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
				</Space>
			)
		}
	];

	const data = createData();

	const [showModal, setShowModal] = useState(false);
	const [selectInfo, setSelectInfo] = useState({});
	const [modalType, setModalType] = useState<string>("add");

	const onEdit = (item: any) => {
		setModalType("edit");
		setSelectInfo(item);
		setShowModal(true);
	};

	const onDelete = (item: any) => {
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

	const onAdd = () => {
		setModalType("add");
		setShowModal(true);
	};

	const updateTable = () => {
		console.log("更新表格");
	};

	const [form] = Form.useForm();

	const onFinish = (values: any) => {
		console.log("Received values of form: ", values);
	};

	return (
		<div className="device-location-container">
			<div className="search-container">
				<Form form={form} name="advanced_search" className="ant-advanced-search-form" onFinish={onFinish}>
					<Row gutter={24}>
						<Col span={8}>
							<Form.Item name="type" label="分类名称">
								<Input placeholder="请输入名称" />
							</Form.Item>
						</Col>
						<Col span={8}>
							<Form.Item name="status" label="状态">
								<Select defaultValue="2">
									<Option value="1">启用</Option>
									<Option value="2">禁用</Option>
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
					<Button type="primary" htmlType="submit" onClick={onAdd}>
						新增
					</Button>
				</Space>
			</div>
			<div className="content-container">
				<Table columns={columns} dataSource={data} pagination={{ showSizeChanger: true }} />
			</div>
			<EditModal info={selectInfo} isShow={showModal} modalType={modalType} setShow={setShowModal} updateTable={updateTable} />
		</div>
	);
};

export default Fence;
