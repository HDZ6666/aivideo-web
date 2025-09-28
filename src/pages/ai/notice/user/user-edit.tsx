import { memo } from 'react';

import UserModal, { NoticeUser } from './user-modal';

export type UserEditProps = {
  show: boolean;
  formValue: NoticeUser;
  close: VoidFunction;
  getTableData: VoidFunction;
};

function UserEdit({ show, formValue, close, getTableData }: UserEditProps) {
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
      title="修改用户"
      formValue={formValue}
      onSubmit={onSubmit}
      onCancel={onCancel}
    />
  );
}

export default memo(UserEdit);
