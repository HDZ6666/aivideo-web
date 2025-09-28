import { useMutation, useQueryClient } from '@tanstack/react-query';
import { message } from 'antd';
import { memo } from 'react';

import categroyService, { CategoryItem } from '@/api/services/categroyService';
import { useAiPremissionRoute } from '@/store/userStore';

import CategoryModal, { CategoryFormItem } from './categroy-modal';

export type CategoryEditFormValue = Pick<
  CategoryItem,
  'id' | 'alarmTypeName' | 'alarmCode' | 'isUse' | 'fileId'
>;

export type CategoryEditProps = {
  showEdit: boolean;
  formValue: CategoryEditFormValue;
  closeEdit: VoidFunction;
};

function CategoryEdit({ showEdit, formValue, closeEdit }: CategoryEditProps) {
  const getAiPremissionRoute = useAiPremissionRoute();
  const queryClient = useQueryClient();
  const { isLoading: EditLoading, mutate: EditCategory } = useMutation(
    categroyService.CategoryEdit,
    {
      onSuccess: () => {
        message.success('修改算法成功');
        queryClient.refetchQueries(['alarmCategory']);
        getAiPremissionRoute();
        closeEdit();
      },
    },
  );
  const onSubmit = (values: CategoryFormItem) => {
    if (values.status && !formValue.fileId) {
      message.error('请先绑定源文件再启用算法');
      return;
    }
    const categroy = {
      id: formValue.id,
      alarmTypeName: values.name,
      alarmCode: values.code,
      isUse: values.status ? 1 : 0,
    };
    EditCategory(categroy);
  };

  const onCancel = () => {
    closeEdit();
  };

  const props = {
    loading: EditLoading,
    title: '修改算法',
    show: showEdit,
    formValue: {
      name: formValue.alarmTypeName,
      code: formValue.alarmCode,
      status: formValue.isUse === 1,
    },
    onSubmit,
    onCancel,
  };

  return <CategoryModal {...props} />;
}

export default memo(CategoryEdit);
