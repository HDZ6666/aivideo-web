import { useQuery } from '@tanstack/react-query';
import { Button, Card, Col, Form, Input, Popconfirm, Row, Space } from 'antd';
import Table, { ColumnsType } from 'antd/es/table';
import { useState } from 'react';

import aiService from '@/api/services/aiService';
import { IconButton, Iconify } from '@/components/icon';
import ProTag from '@/theme/antd/components/tag';

export interface NoticeUser {
  name: string;
  phone: string;
  email?: string;
  wx?: string;
}

const USERS: NoticeUser[] = [
  {
    name: 'HDZ',
    phone: '13078432483',
    email: '',
    wx: '',
  },
  {
    name: 'HDZ2',
    phone: '111111111',
    email: '',
    wx: '',
  },
];

export default function NoticeUserPage() {
  const [searchForm] = Form.useForm();
  const [queryParams, setQueryParams] = useState({
    page: 1,
    pageSize: 10,
    name: undefined,
  });

  const { data, isLoading } = useQuery({
    queryKey: ['alarmList', queryParams],
    queryFn: () => aiService.getAlarmList(queryParams),
    onSuccess: () => {
      console.log('请求成功');
    },
  });

  const columns: ColumnsType<NoticeUser> = [
    {
      title: '姓名',
      dataIndex: 'name',
    },
    {
      title: '电话',
      dataIndex: 'phone',
      align: 'center',
      render: (phone: string) => <ProTag color="cyan">{phone}</ProTag>,
    },
    {
      title: '邮箱',
      dataIndex: 'email',
      align: 'center',
    },
    {
      title: '微信',
      dataIndex: 'wx',
      align: 'center',
    },
    {
      title: '操作',
      key: 'operation',
      align: 'center',
      width: 100,
      render: () => (
        <div className="flex justify-center w-full text-gray">
          <Popconfirm title="确认删除该用户?" okText="确认" cancelText="取消" placement="left">
            <IconButton>
              <Iconify icon="mingcute:delete-2-fill" size={18} className="text-error" />
            </IconButton>
          </Popconfirm>
        </div>
      ),
    },
  ];

  const onSearchFormSubmit = () => {
    const date = searchForm.getFieldsValue();
    setQueryParams((prev) => {
      return { ...prev, ...date, page: 1 };
    });
  };

  const onSearchFormReset = () => {
    searchForm.resetFields();
  };

  const pageChange = (page: number, pageSize: number) => {
    setQueryParams({ ...queryParams, page, pageSize });
  };

  return (
    <Space direction="vertical" size="large" className="w-full">
      <Card>
        <Form form={searchForm}>
          <Row gutter={[16, 16]}>
            <Col span={24} lg={8}>
              <Form.Item<NoticeUser> label="设备名称" name="name" className="!mb-0">
                <Input placeholder="请输入设备名称" allowClear />
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
      <Card loading={isLoading} title="统计数据列表">
        <Table
          rowKey="name"
          size="small"
          scroll={{ x: 'max-content' }}
          columns={columns}
          dataSource={USERS}
          pagination={{
            defaultPageSize: queryParams.pageSize,
            current: queryParams.page,
            total: data?.total || 0,
            onChange: pageChange,
            pageSizeOptions: [10, 20, 50, 100],
          }}
        />
      </Card>
    </Space>
  );
}
