import { useEffect, useState } from 'react';

import PermissionModal from './permission-modal';

import { Permission } from '#/entity';
import type { FormInstance } from 'antd';

export type PermissionEditProps = {
  show: boolean;
  formValue: Permission;
  close: VoidFunction;
  getTableData: VoidFunction;
};

export default function PermissionEdit({
  show,
  formValue,
  close,
  getTableData,
}: PermissionEditProps) {
  const [editformValue, setEditformValue] = useState<Permission>({ ...formValue });
  const onOk = (form: FormInstance) => {
    form.validateFields().then((values) => {
      console.log('修改完成', values);
      getTableData();
    });
  };

  const onCancel = (form: FormInstance) => {
    console.log('取消完成');
    form.resetFields();
    close();
  };

  useEffect(() => {
    if (show) {
      console.log(formValue);
      setEditformValue({ ...formValue, name: '88' });
    }
  }, [formValue, show]);

  return (
    <PermissionModal
      show={show}
      title="修改权限"
      formValue={editformValue}
      onOk={onOk}
      onCancel={onCancel}
    />
  );
}
