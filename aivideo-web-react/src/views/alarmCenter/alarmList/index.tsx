import { useEffect, useState } from "react";
import { Space, Card, Button, Col, Form, Input, Row, Select, Pagination, Tag, DatePicker } from "antd";
import { EditOutlined, EllipsisOutlined } from "@ant-design/icons";
import "./index.less";
import DetailModal from "./components/detailModal";
import { getApiAlarmList } from "@/api/modules/device";
const { Option } = Select;

enum alarmType {
	person = "人脸检测",
	boat = "船只检测",
	face = "面容检测",
	garbage = "垃圾检测",
	helmet = "头发检测",
	mask = "情绪检测",
	motorcycle = "电动车检测"
}

// interface ImgObj {
// 	id?: any;
// }

type alarmTypeS = keyof typeof alarmType;
const { RangePicker } = DatePicker;

const AlarmList = () => {
	const [form] = Form.useForm();
	const [pagination, setPagination] = useState({ page: 1, pageSize: 4 });
	const [searchParams, setSearchParmas] = useState({
		deviceName: undefined,
		alarmType: undefined,
		status: undefined,
		date: undefined
	});
	const [total, setTotal] = useState<number>(0);
	const [alarmList, setAlarmList] = useState<any>([]);
	const [showModal, setShowModal] = useState(false);
	const [selectInfo, setSelectInfo] = useState({});
	// const [loading, setLoading] = useState(false);
	// const [imageObj] = useState<any>({});

	const getAlarmList = async () => {
		const _searchParams: any = { ...searchParams, ...pagination };
		Object.keys(_searchParams).forEach((item: any) => {
			if (!_searchParams[item]) delete _searchParams[item];
		});
		if (_searchParams?.date?.length) {
			_searchParams.startTime = _searchParams.date[0].format("YYYY-MM-DD 00:00:00");
			_searchParams.endTime = _searchParams.date[1].format("YYYY-MM-DD 23:59:59");
			delete _searchParams["date"];
		}
		// setLoading(true);
		try {
			let { data } = await getApiAlarmList(_searchParams);
			// data = createData();
			// data.list?.forEach((item: any) => {
			// 	if (!Object.prototype.hasOwnProperty.call(imageObj, item.id)) {
			// 		imageObj[item.id] = item;
			// 		const img = new Image();
			// 		img.src = item.alarmImg;
			// 		img.onload = function () {
			// 			item.imgload = img;
			// 		};
			// 	}
			// });
			setAlarmList(data.list);
			setTotal(data.total);
		} finally {
			// setLoading(false);
		}
	};

	const onFinish = (form: any) => {
		setSearchParmas({
			...searchParams,
			...form
		});
		setPagination({ page: 1, pageSize: 4 });
	};

	const resetSearchParams = () => {
		form.resetFields();
		setSearchParmas({
			deviceName: undefined,
			alarmType: undefined,
			status: undefined,
			date: undefined
		});
		setPagination({ page: 1, pageSize: 4 });
	};

	const updateList = () => {
		resetSearchParams();
	};

	const pageChange = (page: number, pageSize: number) => {
		setPagination({ page, pageSize });
	};

	// useEffect(() => {
	// 	setPagination({ page: 1, pageSize: 4 });
	// }, [searchParams]);

	useEffect(() => {
		getAlarmList();
	}, [pagination]);

	return (
		<div className="alarm-list-container">
			<div className="search-container">
				<Form form={form} name="advanced_search" className="ant-advanced-search-form" onFinish={onFinish}>
					<Row gutter={[16, 0]}>
						<Col span={6}>
							<Form.Item name="deviceName" label="设备名称">
								<Input placeholder="请输入设备名称" allowClear />
							</Form.Item>
						</Col>
						<Col span={6}>
							<Form.Item name="alarmType" label="告警类型">
								<Select allowClear>
									{Object.keys(alarmType).map(item => {
										return (
											<Option value={item} key={item}>
												{alarmType[item as alarmTypeS]}
											</Option>
										);
									})}
									{/* <Option value="1">电子围栏</Option>
									<Option value="2">人脸识别</Option> */}
								</Select>
							</Form.Item>
						</Col>
						<Col span={6}>
							<Form.Item name="date" label="日期">
								<RangePicker format="YYYY-MM-DD" allowClear />
							</Form.Item>
						</Col>
						<Col span={6}>
							<Form.Item name="status" label="状态">
								<Select allowClear>
									<Option value="1">启用</Option>
									<Option value="2">禁用</Option>
								</Select>
							</Form.Item>
						</Col>
						<Col span={6}>
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
					<Button type="primary" htmlType="submit">
						新增
					</Button>
					<Button
						onClick={() => {
							form.resetFields();
						}}
					>
						重置
					</Button>
				</Space>
			</div>
			<div className="content-container">
				{alarmList.length > 0 && (
					<Row gutter={[16, 16]}>
						{alarmList.map((item: any) => {
							return (
								<Col span={6} key={item.id}>
									<Card
										className="alarm-item-container"
										onClick={() => {
											setSelectInfo(item);
											setShowModal(true);
										}}
										hoverable
										cover={<img alt="example" src={item.alarmImg} style={{ height: "200px" }} />}
									>
										<div className="alarm-item-content">
											<div className="title">{item.deviceName || "信息大厦测试-华为枪机"}</div>
											<div className="title">{item.id || "无ID"}</div>
											<div className="time">{item.createTime}</div>
											<Space>
												<Tag color="processing" key="type">
													{alarmType[item.alarmTypeName as alarmTypeS] || item.alarmTypeName}
												</Tag>
												<Tag color={item.status === 0 ? "#f50" : item.status === 1 ? "#2db7f5" : "#fa8c16"} key="status">
													{item.status === 0 ? "未处理" : item.status === 1 ? "已处理" : "误报"}
												</Tag>
											</Space>
										</div>
										<div className="alarm-item-footer">{item.status === 0 ? <EditOutlined /> : <EllipsisOutlined />}</div>
									</Card>
								</Col>
							);
						})}
						<Col span={24} style={{ textAlign: "right" }}>
							<Pagination
								hideOnSinglePage
								defaultCurrent={1}
								current={pagination.page}
								pageSize={pagination.pageSize}
								total={total}
								onChange={pageChange}
							/>
						</Col>
					</Row>
				)}
			</div>
			<DetailModal info={selectInfo} isShow={showModal} setShow={setShowModal} updateList={updateList} />
		</div>
	);
};

export default AlarmList;
