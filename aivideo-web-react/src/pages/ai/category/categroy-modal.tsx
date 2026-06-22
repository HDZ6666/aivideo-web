import { Button, Form, Input, Modal, Space, Switch } from 'antd';
import { useEffect } from 'react';
import styled from 'styled-components';

export type CategoryFormItem = {
  name: string;
  code: string;
  status: boolean;
};

export type CategoryModalProps = {
  formValue: CategoryFormItem;
  title: string;
  show: boolean;
  loading: boolean;
  showStatus?: boolean;
  onSubmit: (value: CategoryFormItem) => void;
  onCancel: () => void;
};

function CategoryModal({
  loading = false,
  title,
  show,
  showStatus = true,
  formValue,
  onSubmit,
  onCancel,
}: CategoryModalProps) {
  const [form] = Form.useForm();

  const handleSubmit = () => {
    form.validateFields().then((values: CategoryFormItem) => {
      onSubmit(values);
    });
  };

  const handleCancel = () => {
    onCancel();
  };

  useEffect(() => {
    if (show) {
      console.log(formValue);
      form.setFieldsValue({ ...formValue });
    }
  }, [show, formValue, form]);
  return (
    <Modal
      title={title}
      open={show}
      destroyOnClose
      onCancel={handleCancel}
      forceRender
      footer={
        <Space>
          <Button type="primary" onClick={handleSubmit} loading={loading}>
            提交
          </Button>
          <Button onClick={handleCancel}>取消</Button>
        </Space>
      }
    >
      <Form
        form={form}
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        // initialValues={formValue}
        preserve={false}
        layout="horizontal"
      >
        <Form.Item<CategoryFormItem>
          label="算法名称"
          name="name"
          required
          rules={[{ required: true, message: '请输入算法名称' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item<CategoryFormItem>
          label="唯一识别码"
          name="code"
          required
          rules={[{ required: true, message: '请输入唯一识别码' }]}
        >
          <Input />
        </Form.Item>
        {showStatus && (
          <StyledMultiTabs>
            <Form.Item<CategoryFormItem> label="状态" name="status">
              <Switch checkedChildren="启用" unCheckedChildren="禁用" />
            </Form.Item>
          </StyledMultiTabs>
        )}
      </Form>
    </Modal>
  );
}

export default CategoryModal;

const StyledMultiTabs = styled.div`
  .ant-switch.ant-switch-checked {
    background: #1677ff;
  }
  .ant-switch {
    background-color: #ff0000;
  }
  .ant-switch:hover:not(.ant-switch-disabled) {
    background: rgba(255, 0, 0, 0.45);
  }
  .ant-switch.ant-switch-checked:hover:not(.ant-switch-disabled) {
    background: rgba(22, 119, 255, 0.45);
  }
`;
