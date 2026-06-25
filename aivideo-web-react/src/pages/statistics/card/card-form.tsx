import { DatePicker, Form, Input, Modal, Radio, Select } from 'antd';

import DeviceSelect from '@/components/device-select';
import { useUserAiPermission } from '@/store/userStore';

import { CardModalForm } from './type';

export type CardFormProps = {
  show: boolean;
  formValue: CardModalForm;
  title: string;
  onSubmit: (value: CardModalForm) => void;
  onCancel: () => void;
};

export default function CardForm({ title, formValue, onSubmit, onCancel }: CardFormProps) {
  const [form] = Form.useForm();
  form.setFieldsValue({ ...formValue });
  const categoryList = useUserAiPermission();

  const handleSubmit = () => {
    form.validateFields().then((values: CardModalForm) => {
      onSubmit(values);
    });
  };

  const handleCancel = () => {
    onCancel();
  };

  return (
    <Modal title={title} open onOk={handleSubmit} onCancel={handleCancel} destroyOnClose>
      <Form form={form} labelCol={{ span: 4 }} wrapperCol={{ span: 18 }} layout="horizontal">
        <Form.Item<CardModalForm>
          label="分组名称"
          name="title"
          required
          rules={[{ required: true, message: '请输入分组名称' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item<CardModalForm>
          label="算法"
          name="alarmTypeId"
          required
          rules={[{ required: true, message: '请选择算法' }]}
        >
          <Select allowClear>
            {categoryList?.map((item) => {
              return (
                <Select.Option value={item.alarmTypeName} key={item.alarmCode}>
                  {item.alarmTypeName}
                </Select.Option>
              );
            })}
          </Select>
        </Form.Item>
        <Form.Item<CardModalForm>
          name="countType"
          label="统计类型"
          required
          rules={[{ required: true, message: '请选择统计类型' }]}
        >
          <Radio.Group>
            <Radio value={0}> 区域统计 </Radio>
            <Radio value={1}> 进出统计 </Radio>
          </Radio.Group>
        </Form.Item>
        <Form.Item<CardModalForm>
          label="设备"
          name="device"
          required
          rules={[{ required: true, message: '请选择设备' }]}
        >
          <DeviceSelect />
        </Form.Item>
        <Form.Item<CardModalForm>
          name="timeType"
          label="时间类型"
          required
          rules={[{ required: true, message: '请选择统计时间类型' }]}
        >
          <Radio.Group>
            <Radio value={0}> 实时当天 </Radio>
            <Radio value={1}> 历史时段 </Radio>
          </Radio.Group>
        </Form.Item>
        <Form.Item<CardModalForm> name="date" label="统计时间段">
          <DatePicker.RangePicker format="YYYY-MM-DD" allowClear />
        </Form.Item>
      </Form>
    </Modal>
  );
}
