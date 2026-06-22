import { useMutation, useQueryClient } from '@tanstack/react-query';
import { message } from 'antd';
import { memo } from 'react';

import categroyService, { CategoryAddReq } from '@/api/services/categroyService';
import { useAiPremissionRoute } from '@/store/userStore';

import CategoryModal, { CategoryFormItem } from './categroy-modal';

export type CategoryAddProps = {
  showAdd: boolean;
  closeAdd: VoidFunction;
};

function CategoryAdd({ showAdd, closeAdd }: CategoryAddProps) {
  const getAiPremissionRoute = useAiPremissionRoute();
  const queryClient = useQueryClient();
  const { isLoading: AddLoading, mutate: AddCategory } = useMutation(categroyService.CategoryAdd, {
    onSuccess: () => {
      message.success('新增算法成功');
      queryClient.refetchQueries(['alarmCategory']);
      getAiPremissionRoute();
      closeAdd();
    },
  });

  const onSubmit = (values: CategoryFormItem) => {
    const categroy: CategoryAddReq = {
      alarmTypeName: values.name,
      alarmCode: values.code,
      isUse: 0,
    };
    AddCategory(categroy);
  };

  const onCancel = () => {
    closeAdd();
  };

  const props = {
    loading: AddLoading,
    title: '新增算法',
    show: showAdd,
    formValue: {
      name: '',
      code: '',
      status: false,
    },
    onSubmit,
    onCancel,
    showStatus: false,
  };

  return <CategoryModal {...props} />;
}

export default memo(CategoryAdd);
