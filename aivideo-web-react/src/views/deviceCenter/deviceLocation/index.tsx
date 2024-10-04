import { useEffect, useState } from "react";
import { Space, Button, Table, Col, Form, Input, Row, Select, Tag, Modal } from "antd";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import "./index.less";
import EditModal from "./components/editModal";
import { getDeviceLocation } from "@/api/modules/device";
// import { LocationApi } from "@/api/interface/index";
import { tranformMenList } from "@/utils/util";

enum StatusEnum {
	Enable = 1,
	Disable = 0
}
interface DataType {
	key?: string | number;
	name?: string;
	status?: StatusEnum;
	desc?: string;
	children?: DataType[];
	parentid?: string | number;
	isTop?: boolean;
}

// const tableData: DataType[] = [
// 	{
// 		key: "1-1",
// 		name: "村口",
// 		status: 1,
// 		desc: "村口",
// 		isTop: true,
// 		parentid: "",
// 		children: [
// 			{
// 				key: "1-1-1",
// 				name: "村口普通监控",
// 				status: 2,
// 				desc: "普通监控",
// 				parentid: "1-1",
// 				isTop: false
// 			},
// 			{
// 				key: "1-1-2",
// 				name: "村口周界防护",
// 				status: 1,
// 				desc: "周界防护",
// 				parentid: "1-1",
// 				isTop: false
// 			},
// 			{
// 				key: "1-1-3",
// 				name: "村口人脸识别",
// 				status: 2,
// 				desc: "人脸识别",
// 				parentid: "1-1",
// 				isTop: false
// 			}
// 		]
// 	},
// 	{
// 		key: "1-2",
// 		name: "村尾",
// 		status: 1,
// 		desc: "村尾",
// 		isTop: true,
// 		parentid: "",
// 		children: [
// 			{
// 				key: "1-2-1",
// 				name: "村尾普通监控",
// 				status: 2,
// 				desc: "普通监控",
// 				parentid: "1-2",
// 				isTop: false
// 			},
// 			{
// 				key: "1-2-2",
// 				name: "村尾周界防护",
// 				status: 1,
// 				desc: "周界防护",
// 				parentid: "1-2",
// 				isTop: false
// 			},
// 			{
// 				key: "1-2-3",
// 				name: "村尾人脸识别",
// 				status: 2,
// 				desc: "人脸识别",
// 				parentid: "1-2",
// 				isTop: false
// 			}
// 		]
// 	},
// 	{
// 		key: "1-3",
// 		name: "吉利大街",
// 		status: 1,
// 		desc: "吉利大街",
// 		isTop: true,
// 		parentid: "",
// 		children: [
// 			{
// 				key: "1-3-1",
// 				name: "吉利大街普通监控",
// 				status: 2,
// 				desc: "普通监控",
// 				parentid: "1-3",
// 				isTop: false
// 			},
// 			{
// 				key: "1-3-2",
// 				name: "吉利大街周界防护",
// 				status: 1,
// 				desc: "周界防护",
// 				parentid: "1-3",
// 				isTop: false
// 			},
// 			{
// 				key: "1-3-3",
// 				name: "吉利大街人脸识别",
// 				status: 2,
// 				desc: "人脸识别",
// 				parentid: "1-3",
// 				isTop: false
// 			}
// 		]
// 	}
// ];

const { Option } = Select;
const { confirm } = Modal;
const DeviceLocation = () => {
	const [form] = Form.useForm();
	const [searchParams, setSearchParmas] = useState({
		name: "",
		status: ""
	});
	const [locationList, setLocationList] = useState<any>([]);
	const [showModal, setShowModal] = useState(false);
	const [selectInfo, setSelectInfo] = useState<DataType>({});
	const [modalType, setModalType] = useState<string>("add");

	const getTableList = async () => {
		const _searchParams: any = { ...searchParams };
		// Object.keys(_searchParams).forEach((item: any) => {
		// 	if (!_searchParams[item]) delete _searchParams[item];
		// });
		let { data } = await getDeviceLocation({ query: _searchParams.name, state: _searchParams.status });
		const tabList = tranformMenList(data!);
		// data = tableData;
		setLocationList(tabList);
	};

	// const tranformMenList = (list: LocationApi.ResLocationApi[]) => {
	// 	return list.map(item => {
	// 		const obj: DataType = {
	// 			key: item.id,
	// 			title: item.group_name,
	// 			status: item.state,
	// 			children: tranformMenList(item.children),
	// 			parentid: item.parent_id
	// 		};
	// 		if (!obj?.children?.length) delete obj.children;
	// 		return obj;
	// 	});
	// };

	const onFinish = (form: any) => {
		setSearchParmas({
			...searchParams,
			...form
		});
	};

	const resetSearchParams = () => {
		form.resetFields();
		setSearchParmas({
			name: "",
			status: ""
		});
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
				resetSearchParams();
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
		resetSearchParams();
	};

	const columns: ColumnsType<DataType> = [
		{
			title: "分类名称",
			dataIndex: "title",
			key: "title"
		},
		{
			title: "状态",
			dataIndex: "status",
			key: "status",
			render: text => (
				<Tag color={text === StatusEnum.Enable ? "green" : "error"}>{text === StatusEnum.Enable ? "启用" : "禁用"}</Tag>
			)
		},
		{
			title: "描述",
			dataIndex: "desc",
			width: "30%",
			key: "desc"
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

	useEffect(() => {
		getTableList();
	}, [searchParams]);

	return (
		<div className="device-location-container">
			<div className="search-container">
				<Form form={form} name="advanced_search" className="ant-advanced-search-form" onFinish={onFinish}>
					<Row gutter={24}>
						<Col span={8}>
							<Form.Item name="name" label="分类名称">
								<Input placeholder="请输入名称" />
							</Form.Item>
						</Col>
						<Col span={8}>
							<Form.Item name="status" label="状态">
								<Select>
									<Option value="1">启用</Option>
									<Option value="0">禁用</Option>
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
				<Table columns={columns} dataSource={locationList} pagination={{ showSizeChanger: true }} />
			</div>
			<EditModal
				list={locationList}
				info={selectInfo}
				isShow={showModal}
				modalType={modalType}
				setShow={setShowModal}
				updateTable={updateTable}
			/>
		</div>
	);
};

export default DeviceLocation;
