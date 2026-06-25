import { memo } from 'react';

import CardModal from './card-form';
import { CardModalForm } from './type';

export type UserAddProps = {
  show: boolean;
  formValue: CardModalForm;
  close: VoidFunction;
  getTableData: VoidFunction;
};

function CardAdd({ show, formValue, close, getTableData }: UserAddProps) {
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
      title="新增统计"
      formValue={formValue}
      onSubmit={onSubmit}
      onCancel={onCancel}
    />
  );
}

export default memo(CardAdd);
