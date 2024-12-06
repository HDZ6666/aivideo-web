import { useEffect, useState } from 'react';

import PermissionModal from './permission-modal';

import { Permission } from '#/entity';
import type { FormInstance } from 'antd';

export type PermissionAddProps = {
  show: boolean;
  formValue: Permission;
  close: VoidFunction;
  getTableData: VoidFunction;
};

export default function PermissionAdd({
  show,
  formValue,
  close,
  getTableData,
}: PermissionAddProps) {
  const [addformValue, setAddformValue] = useState<Permission>({ ...formValue });
  const onOk = (form: FormInstance) => {
    form.validateFields().then((values) => {
      console.log('新增完成', values);
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
      setAddformValue({ ...formValue, name: '56' });
    }
  }, [show, formValue]);

  return (
    <PermissionModal
      show={show}
      title="新增权限"
      formValue={addformValue}
      onOk={onOk}
      onCancel={onCancel}
    />
  );
}
