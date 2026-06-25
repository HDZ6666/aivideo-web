import { memo } from 'react';

import CardModal from './card-form';
import { CardModalForm } from './type';

export type UserEditProps = {
  show: boolean;
  formValue: CardModalForm;
  close: VoidFunction;
  getTableData: VoidFunction;
};

function CardEdit({ show, formValue, close, getTableData }: UserEditProps) {
  const onSubmit = (values: CardModalForm) => {
    console.log(values);
    close();
    getTableData();
  };

  const onCancel = () => {
    close();
  };

  return (
    <CardModal
      show={show}
      title="修改统计"
      formValue={formValue}
      onSubmit={onSubmit}
      onCancel={onCancel}
    />
  );
}

export default memo(CardEdit);
