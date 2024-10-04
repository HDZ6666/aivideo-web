import { useEffect } from "react";
import { Form, Modal, Select, Input } from "antd";
import { updateDeviceGroup } from "@/api/modules/device";

interface MenuModalProps {
	list: any;
	info: any;
	modalType: String;
	isShow: boolean;
	setShow: (s: boolean) => void;
	updateTable: () => void;
}

const EditModal = (porps: MenuModalProps) => {
	const { list, info, modalType, isShow, setShow, updateTable } = porps;
	const { Option } = Select;
	const { TextArea } = Input;
	const [form] = Form.useForm();

	useEffect(() => {
		if (isShow && modalType === "edit") {
			const formObj = { ...info };
			form.setFieldsValue(formObj);
		}
	}, [modalType, isShow]);

	const handleOk = async () => {
		const params = form.getFieldsValue();
		const _params = {
			id: info.key,
			groupName: params.title,
			parentId: params.parentid,
			state: params.status
		};
		console.log(_params);
		const { code } = await updateDeviceGroup(_params);
		if (code === 0) {
			updateTable();
			setShow(false);
			form.resetFields();
		}
	};
	const handleCancel = () => {
		setShow(false);
		form.resetFields();
	};
	// console.log(info, modalType);

	return (
		<Modal width={500} title="位置编辑" open={isShow} onOk={handleOk} onCancel={handleCancel} forceRender>
			<Form form={form} name="control-hooks" labelCol={{ span: 5 }}>
				<Form.Item name="title" label="位置名称" rules={[{ required: true }]}>
					<Input placeholder="请输入位置名称" />
				</Form.Item>
				<Form.Item name="status" label="状态" rules={[{ required: true }]}>
					<Select placeholder="请选择状态" allowClear>
						<Option value={1}>启用</Option>
						<Option value={0}>禁用</Option>
					</Select>
				</Form.Item>
				{/* <Form.Item label="是否顶层" name="isTop" valuePropName="checked">
					<Switch />
				</Form.Item> */}
				<Form.Item name="parentid" label="父节点">
					<Select placeholder="请选择父节点" allowClear>
						<Option key={0} value={0}>
							顶层节点
						</Option>
						{list.map((item: any) => {
							return (
								<Option key={item.key} value={item.key}>
									{item.title}
								</Option>
							);
						})}
					</Select>
					{/* {({ getFieldValue }) => {
						return (
							<Form.Item noStyle name="parentid">
								<Select placeholder="请选择父节点" allowClear disabled={getFieldValue("isTop")}>
									{list.map((item: any) => {
										return (
											<Option key={item.key} value={item.key}>
												{item.name}
											</Option>
										);
									})}
								</Select>
							</Form.Item>
						);
					}} */}
				</Form.Item>
				<Form.Item name="desc" label="描述">
					<TextArea placeholder="请输入描述" />
				</Form.Item>
			</Form>
		</Modal>
	);
};

export default EditModal;
