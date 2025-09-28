import { memo } from 'react';

import UserModal, { NoticeUser } from './user-modal';

export type UserAddProps = {
  show: boolean;
  formValue: NoticeUser;
  close: VoidFunction;
  getTableData: VoidFunction;
};

function UserAdd({ show, formValue, close, getTableData }: UserAddProps) {
  const onSubmit = (values: NoticeUser) => {
    console.log(values);
    close();
    getTableData();
  };

  const onCancel = () => {
    close();
  };

  return (
    <UserModal
      show={show}
      title="新增用户"
      formValue={formValue}
      onSubmit={onSubmit}
      onCancel={onCancel}
    />
  );
}

export default memo(UserAdd);
