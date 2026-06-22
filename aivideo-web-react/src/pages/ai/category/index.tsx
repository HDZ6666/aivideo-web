import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Button, Card, Col, Form, Input, message, Popconfirm, Row, Space, Switch } from 'antd';
import Table, { ColumnsType } from 'antd/es/table';
import { useState } from 'react';
import styled from 'styled-components';

import categroyService, { CategoryItem, CategoryListReq } from '@/api/services/categroyService';
import { useAiPremissionRoute } from '@/store/userStore';
import ProTag from '@/theme/antd/components/tag';

import CategoryFileModal, { CategoryFileModalProps } from './category-file-modal';
import CategoryAdd, { CategoryAddProps } from './categroy-add';
import CategoryEdit, { CategoryEditProps } from './categroy-edit';

export default function CaregoryPage() {
  const getAiPremissionRoute = useAiPremissionRoute();
  const queryClient = useQueryClient();
  const [searchForm] = Form.useForm();
  const [queryParams, setQueryParams] = useState({
    page: 1,
    pageSize: 10,
    alarmTypeName: undefined,
  });

  const [categoryModalAdd, setCategoryModalAdd] = useState<CategoryAddProps>({
    showAdd: false,
    closeAdd: () => {
      setCategoryModalAdd((prev) => ({ ...prev, showAdd: false }));
    },
  });
  const [categoryModalEdit, setCategoryModalEdit] = useState<CategoryEditProps>({
    showEdit: false,
    formValue: {
      id: 0,
      alarmTypeName: '',
      alarmCode: '',
      isUse: 0,
      fileId: 0,
    },
    closeEdit: () => {
      setCategoryModalEdit((prev) => ({ ...prev, showEdit: false }));
    },
  });

  const [categoryFileModal, setCategoryFileModal] = useState<CategoryFileModalProps>({
    show: false,
    onCancel: () => {
      setCategoryFileModal((prev) => ({ ...prev, show: false }));
    },
  });

  const { data, isLoading, isFetching } = useQuery({
    queryKey: ['alarmCategory', queryParams],
    queryFn: () => categroyService.CategoryList(queryParams),
  });

  const { isLoading: deleteLoading, mutate: deleteCategory } = useMutation(
    categroyService.CategoryDelete,
    {
      onSuccess: () => {
        message.success('删除规则成功');
        queryClient.refetchQueries(['alarmCategory']);
        getAiPremissionRoute();
      },
    },
  );

  const { isLoading: changeStatusLoading, mutate: changeCategoryStatus } = useMutation(
    categroyService.CategoryChangeStatus,
    {
      onSuccess: () => {
        message.success('更改状态成功');
        queryClient.refetchQueries(['alarmCategory']);
        getAiPremissionRoute();
      },
    },
  );

  const onSearchFormSubmit = () => {
    const date = searchForm.getFieldsValue();
    setQueryParams((prev) => {
      return { ...prev, ...date, page: 1 };
    });
  };

  const onSearchFormReset = () => {
    searchForm.resetFields();
    setQueryParams((prev) => ({
      page: 1,
      pageSize: prev.pageSize,
      alarmTypeName: undefined,
    }));
  };

  const pageChange = (page: number, pageSize: number) => {
    setQueryParams({ ...queryParams, page, pageSize });
  };

  const handleAddCategory = () => {
    setCategoryModalAdd((prev) => ({ ...prev, showAdd: true }));
  };

  const handleEditCategory = (record: CategoryItem) => {
    const { id, alarmTypeName, alarmCode, isUse, fileId } = record;
    setCategoryModalEdit((prev) => ({
      ...prev,
      showEdit: true,
      formValue: {
        id,
        alarmTypeName,
        alarmCode,
        isUse,
        fileId,
      },
    }));
  };

  const handleDeleteCategory = (id: number) => {
    deleteCategory({ id });
  };

  const handleCategoryStatusChange = (checked: boolean, record: CategoryItem) => {
    if (!record.fileId) {
      message.error('请先绑定源文件再启用算法');
      return;
    }
    const caregory = {
      id: record.id,
      isUse: checked ? 1 : 0,
    };
    changeCategoryStatus(caregory);
  };

  const handleSourceFile = (categoryItem: CategoryItem) => {
    if (!categoryItem.id) {
      message.error('算法ID不存在');
      return;
    }
    setCategoryFileModal((prev) => ({ ...prev, categoryItem, show: true }));
  };

  const columns: ColumnsType<CategoryItem> = [
    {
      title: '序号',
      dataIndex: 'id',
      width: 50,
      render: (_value, _record, index) => index + 1 + (queryParams.page - 1) * queryParams.pageSize,
    },
    {
      title: '算法名称',
      dataIndex: 'alarmTypeName',
    },
    {
      title: '唯一识别码',
      dataIndex: 'alarmCode',
      align: 'center',
      render: (text: string) => <ProTag color="cyan">{text}</ProTag>,
    },
    {
      title: '状态',
      dataIndex: 'status',
      align: 'center',
      render: (_, record) => (
        <Switch
          loading={changeStatusLoading || isFetching}
          checkedChildren="启用"
          unCheckedChildren="禁用"
          value={record.isUse === 1}
          onChange={(checked) => {
            handleCategoryStatusChange(checked, record);
          }}
        />
      ),
    },
    {
      title: '已绑定源文件',
      dataIndex: 'fileName',
      width: 200,
      align: 'center',
      render: (text: string) => (
        <ProTag color={text ? 'green' : 'orange'}>{text || '未绑定'}</ProTag>
      ),
    },
    {
      title: '更新时间',
      dataIndex: 'updateTime',
      align: 'center',
    },
    {
      title: '操作',
      key: 'operation',
      align: 'center',
      width: 100,
      render: (_, record) => (
        <div className="flex w-full justify-center text-gray">
          <Button type="link" onClick={() => handleSourceFile(record)}>
            源文件管理
          </Button>
          <Button type="link" onClick={() => handleEditCategory(record)}>
            编辑
          </Button>
          <Popconfirm
            title="确定要删除该算法吗"
            okText="确认"
            cancelText="取消"
            placement="left"
            onConfirm={() => handleDeleteCategory(record.id)}
          >
            <Button type="link" danger loading={deleteLoading}>
              删除
            </Button>
          </Popconfirm>
        </div>
      ),
    },
  ];

  return (
    <Space direction="vertical" size="large" className="w-full">
      <Card>
        <Form form={searchForm}>
          <Row gutter={[16, 16]}>
            <Col span={24} lg={8}>
              <Form.Item<CategoryListReq> label="算法名称" name="alarmTypeName" className="!mb-0">
                <Input placeholder="请输入算法名称" allowClear />
              </Form.Item>
            </Col>
            <Col span={24} lg={8}>
              <div className="flex">
                <Button onClick={onSearchFormReset}>重置</Button>
                <Button type="primary" className="ml-4" onClick={onSearchFormSubmit}>
                  搜索
                </Button>
              </div>
            </Col>
          </Row>
        </Form>
      </Card>
      <Card
        loading={isLoading}
        title="算法列表"
        extra={
          <Space>
            <Button type="primary" onClick={handleAddCategory}>
              新增算法
            </Button>
          </Space>
        }
      >
        <StyledMultiTabs>
          <Table
            rowKey="id"
            size="small"
            scroll={{ x: 'max-content' }}
            columns={columns}
            dataSource={data?.list || []}
            pagination={{
              defaultPageSize: queryParams.pageSize,
              current: queryParams.page,
              total: data?.total || 0,
              onChange: pageChange,
              pageSizeOptions: [10, 20, 50, 100],
            }}
          />
        </StyledMultiTabs>
      </Card>
      <CategoryAdd {...categoryModalAdd} />
      <CategoryEdit {...categoryModalEdit} />
      <CategoryFileModal {...categoryFileModal} />
    </Space>
  );
}

const StyledMultiTabs = styled.div`
  .ant-table-cell {
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
  }
`;
