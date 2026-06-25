import { useQuery } from '@tanstack/react-query';
import { Button, Card, Col, Form, Input, Row, Space } from 'antd';
import { useState } from 'react';

import aiService from '@/api/services/aiService';

import ConnectionsTab from './connections-tab';
import CardFormContainer from './card-form-container';
import { CardModalForm } from './type';

export default function NoticeUserPage() {
  const [searchForm] = Form.useForm();
  const [queryParams, setQueryParams] = useState({
    page: 1,
    pageSize: 10,
    name: undefined,
  });

  const [cardForm, setCardForm] = useState({
    show: false,
    isEdit: false,
    formValue: {} as CardModalForm,
    close: () => {
      setCardForm((prev) => ({ ...prev, show: false }));
    },
    getTableData: () => {},
  });

  const { isLoading } = useQuery({
    queryKey: ['alarmList', queryParams],
    queryFn: () => aiService.getAlarmList(queryParams),
    onSuccess: () => {
      console.log('请求成功');
    },
  });

  const onSearchFormSubmit = () => {
    const date = searchForm.getFieldsValue();
    setQueryParams((prev) => {
      return { ...prev, ...date, page: 1 };
    });
  };

  const onSearchFormReset = () => {
    searchForm.resetFields();
  };

  const onCreate = () => {
    setCardForm((prev) => ({ ...prev, show: true, isEdit: false, formValue: {} as CardModalForm }));
  };

  return (
    <Space direction="vertical" size="large" className="w-full">
      <Card>
        <Form form={searchForm}>
          <Row gutter={[16, 16]}>
            <Col span={24} lg={8}>
              <Form.Item label="设备名称" name="name" className="!mb-0">
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
      <Card
        loading={isLoading}
        title="统计卡片列表"
        extra={
          <Button type="primary" onClick={onCreate}>
            新增统计
          </Button>
        }
      >
        <ConnectionsTab />
      </Card>
      <CardFormContainer
        isEdit={cardForm.isEdit}
        show={cardForm.show}
        formValue={cardForm.formValue}
        close={cardForm.close}
        getTableData={cardForm.getTableData}
      />
    </Space>
  );
}
