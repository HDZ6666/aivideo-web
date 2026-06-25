import React from 'react';
import CardAdd from './card-add';
import CardEdit from './card-edit';
import { CardModalForm } from './type';

export type CardFormContainerProps = {
  isEdit: boolean;
  show: boolean;
  formValue: CardModalForm;
  close: () => void;
  getTableData: () => void;
};

const CardFormContainer: React.FC<CardFormContainerProps> = ({
  isEdit,
  show,
  formValue,
  close,
  getTableData,
}) => {
  if (isEdit) {
    return <CardEdit show={show} formValue={formValue} close={close} getTableData={getTableData} />;
  } else {
    return <CardAdd show={show} formValue={formValue} close={close} getTableData={getTableData} />;
  }
};

export default CardFormContainer;
