import { Form, Input, Modal } from 'antd';

export interface NoticeUser {
  name: string;
  phone: string;
  email?: string;
  wx?: string;
}

export type UserModalProps = {
  formValue: NoticeUser;
  title: string;
  show: boolean;
  onSubmit: (value: NoticeUser) => void;
  onCancel: () => void;
};

export default function UserModal({ title, show, formValue, onSubmit, onCancel }: UserModalProps) {
  const [form] = Form.useForm();
  form.setFieldsValue({ ...formValue });

  const handleSubmit = () => {
    form.validateFields().then((values: NoticeUser) => {
      onSubmit(values);
    });
  };

  const handleCancel = () => {
    onCancel();
  };

  return (
    <Modal title={title} open={show} onOk={handleSubmit} onCancel={handleCancel} destroyOnClose>
      <Form form={form} labelCol={{ span: 4 }} wrapperCol={{ span: 18 }} layout="horizontal">
        <Form.Item<NoticeUser>
          label="姓名"
          name="name"
          required
          rules={[{ required: true, message: '请输入用户名' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item<NoticeUser>
          label="电话"
          name="phone"
          required
          rules={[{ required: true, message: '请输入电话' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item<NoticeUser> label="邮箱" name="email">
          <Input />
        </Form.Item>

        <Form.Item<NoticeUser> label="微信" name="wx">
          <Input />
        </Form.Item>
      </Form>
    </Modal>
  );
}
