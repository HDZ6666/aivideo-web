import "./index.less";
// import DeviceLocation from "./components/DeviceLocation";
// import DeviceTable from "./components/DeviceTable";
import { useEffect, useState } from "react";
import { Tree, Space, Button, Col, Form, Input, Row, Select, Tag, Modal, Image, message } from "antd";
import type { ColumnsType } from "antd/es/table";
import { DownOutlined, ExclamationCircleOutlined } from "@ant-design/icons";
import { getDeviceLocation, getDeviceList2 } from "@/api/modules/device";
import MyTable from "@/components/MyTable";
import EditModal from "./components/editModal";
import channelsnap from "@/assets/images/channelsnap.jpg";
import imageError from "@/assets/images/imageError.png";
import DetailModal from "./components/detailModal";
import { tranformMenList } from "@/utils/util";

const treeData = [
	{
		title: "移动信息大厦",
		key: "0-0-0",
		children: [
			{
				title: "演示",
				key: "0-0-0-0"
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
	key: string; //ID
	deciceNo: number; //设备编号
	location: string; // 所属位置
	locationKey: string; // 所属位置ID
	name: string; //设备名称
	type: TypeEnum; //设备类型 枪机、球机、全景
	status: StatusEnum; //设备状态 在线/离线
	desc: string; //描述
	facturer: string; //厂商 宇视、大华、海康
	refesh: boolean; // 抽图状态 正在抽图 、停止抽图
	lastSnapshot: string; // 最新快照
	cutPhoto: string; //切图照片
	accessModee: number; //连接方式 国标
	national_num: number; //国标号
	channel: number; // 通道号
	spiID: number; // spiID
	playTime: number; //回放时间
	address: string; //安装地址
	coordinateSystem: number; //坐标系
	longitude: number; //经度
	latitude: number; //纬度
	in_line: boolean;
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

const createTableData = (list: any) => {
	return list?.map((item: any, i: number) => {
		return {
			key: `${i}`,
			deciceNo: i,
			location: "村口-普通监控",
			locationKey: "0-0-0-1",
			name: `信息大厦18楼-${i === 0 ? "宇视枪机" : "华为枪机"}#${i === 0 ? i + 1 : i}`,
			device_name: item.device_name,
			type: Math.floor(Math.random() * 3 + 1), // 1-4
			status: Math.round(Math.random() + 1), // 1-2
			desc: "主要监控村口牌坊的进出口",
			facturer: i === 0 ? "宇视" : "华为",
			refesh: i % 2 === 0,
			lastSnapshot: i % 2 === 0 ? channelsnap : "",
			cutPhoto: i % 2 === 1 ? channelsnap : "",
			accessModee: 1, //连接方式 国标
			national_num: item.national_num, //国标号
			channel: item.channel, // 通道号
			in_line: item.in_line,
			spiID: 11100 + i, // spiID
			playTime: 1, //回放时间
			address: "佛山顺德移动信息大夏", //安装地址
			coordinateSystem: 1, //坐标系
			longitude: 31.096246345482598, //经度
			latitude: 121.27679031781052 //纬度
		};
	});
};

const { Option } = Select;
const { confirm } = Modal;

const Device = () => {
	const [locationList, setLocationList] = useState<any>([]);
	const [locationSelect, setLocationSelect] = useState<any>([]);
	const [searchParams, setSearchParmas] = useState({
		locationKey: "",
		name: "",
		status: "",
		page: 1,
		pageSize: 10
	});
	const [total, setTotal] = useState<number>(0);
	// const [selectLocation, setSelectLocation] = useState<any>({});
	const [deviceList, setDeviceList] = useState<any>([]);
	const [deviceSelect, setDeviceSelect] = useState<any>([]);
	const [form] = Form.useForm();
	const [showModal, setShowModal] = useState(false);
	const [showDetailModal, setShowDetailModal] = useState(false);
	const [selectInfo, setSelectInfo] = useState<any>({});
	const [modalType, setModalType] = useState<string>("add");

	const columns: ColumnsType<DataType> = [
		{
			title: "设备名称",
			dataIndex: "name",
			width: 150,
			key: "name"
		},
		{
			title: "状态",
			dataIndex: "in_line",
			key: "in_line",
			width: 100,
			render: text => <Tag color={text ? "green" : "error"}>{text ? "在线" : "离线"}</Tag>
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
					{record?.in_line && (
						<a
							onClick={() => {
								setSelectInfo(record);
								setShowDetailModal(true);
							}}
						>
							画面
						</a>
					)}
				</Space>
			)
		}
	];

	const getLocationList = async () => {
		let { data } = await getDeviceLocation({});
		const tabList = tranformMenList(data!);
		// data = tableData;
		setLocationList(tabList);
	};

	const getTableList = async () => {
		const _searchParams: any = { ...searchParams };
		Object.keys(_searchParams).forEach((item: any) => {
			if (!_searchParams[item]) delete _searchParams[item];
		});
		let { data } = await getDeviceList2(_searchParams);
		const { list, total } = data;
		data = createTableData(list);
		setDeviceList(data);
		setTotal(total);
	};

	const onSelect = (selectedKeys: any) => {
		setLocationSelect(selectedKeys);
		setSearchParmas({
			...searchParams,
			locationKey: selectedKeys[0]
		});
	};

	const onFinish = (form: any) => {
		setSearchParmas({
			...searchParams,
			...form
		});
	};

	const onAdd = () => {
		setModalType("add");
		setSelectInfo({});
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
			title: `确认删除设备【${item.name}】?`,
			icon: <ExclamationCircleOutlined />,
			content: `删除设备【${item.name}】后无法恢复`,
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

	const resetSearchParams = () => {
		form.resetFields();
		setLocationSelect([]);
		setSearchParmas({
			locationKey: "",
			name: "",
			status: "",
			page: 1,
			pageSize: 10
		});
		setTotal(0);
	};

	const updateTable = () => {
		console.log("更新表格");
		resetSearchParams();
	};

	const onBatchDelete = () => {
		if (deviceSelect.length === 0) {
			return message.error("请至少选择一条记录");
		}
		confirm({
			title: `确认批量删除设备吗?`,
			icon: <ExclamationCircleOutlined />,
			content: `删除后无法恢复`,
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
	const onImportDevice = () => {
		message.info("模块开发中，敬请期待");
	};
	const onSetDevice = () => {
		message.info("模块开发中，敬请期待");
	};

	const rowSelection = {
		onChange: (selectedRowKeys: React.Key[], selectedRows: DataType[]) => {
			setDeviceSelect(selectedRows);
			console.log(`selectedRowKeys: ${selectedRowKeys}`, "selectedRows: ", selectedRows);
		}
	};

	const tableChange = (pagination: any) => {
		setSearchParmas({
			...searchParams,
			page: pagination.current
		});
	};

	useEffect(() => {
		getLocationList();
	}, []);

	useEffect(() => {
		getTableList();
	}, [searchParams]);

	return (
		<div className="device-list-container">
			<div className="device-left-container">
				<div className="device-left-header">
					<div className="device-left-title">设备位置</div>
				</div>
				<div className="device-left-body">
					<Tree
						selectedKeys={locationSelect}
						showLine
						switcherIcon={<DownOutlined />}
						onSelect={onSelect}
						treeData={locationList}
					/>
				</div>
			</div>
			<div className="device-right-container">
				<div className="search-container">
					<Form form={form} name="advanced_search" className="ant-advanced-search-form" onFinish={onFinish}>
						<Row gutter={24}>
							<Col span={8}>
								<Form.Item name="name" label="设备名称">
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
						<Button type="primary" onClick={onSetDevice}>
							批量配置
						</Button>
						<Button type="primary" onClick={onAdd}>
							新增设备
						</Button>
						<Button type="primary" onClick={onImportDevice}>
							导入设备
						</Button>
						<Button danger type="primary" onClick={onBatchDelete}>
							批量删除
						</Button>
					</Space>
				</div>
				<div className="content-container">
					<MyTable
						pagination={{
							pageSize: searchParams.pageSize,
							total: total
						}}
						rowSelection={{
							...rowSelection
						}}
						columns={columns}
						dataSource={deviceList}
						onChange={tableChange}
						scroll={{ x: "100%" }}
					></MyTable>
				</div>
				<EditModal
					treeData={treeData}
					info={selectInfo}
					isShow={showModal}
					modalType={modalType}
					setShow={setShowModal}
					updateTable={updateTable}
				/>
				<DetailModal info={selectInfo} isShow={showDetailModal} setShow={setShowDetailModal} />
			</div>
		</div>
	);
};

export default Device;
