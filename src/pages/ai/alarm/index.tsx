import { useMutation, useQuery } from '@tanstack/react-query';
import {
  Button,
  Card,
  Col,
  Form,
  Input,
  Row,
  Select,
  Space,
  DatePicker,
  Pagination,
  Tag,
  Empty,
  Checkbox,
  message as Message,
  Modal,
  message,
} from 'antd';
import { useState } from 'react';
import { styled } from 'styled-components';

import aiService, { AlarmListReq } from '@/api/services/aiService';
import ProTag from '@/theme/antd/components/tag';

import AlarmDetailModal, { AlarmDetailModalProps } from './alarm-detail';

import type { CheckboxProps } from 'antd';

export default function AlarmPage() {
  const [searchForm] = Form.useForm();
  const [queryParams, setQueryParams] = useState({
    page: 1,
    pageSize: 8,
    status: undefined,
    deviceName: undefined,
    alarm_type_name: undefined,
    startTime: undefined,
    endTime: undefined,
  });
  const [alarmDetail, setAlarmDetail] = useState<AlarmDetailModalProps>({
    show: false,
    alarmItem: undefined,
    close: () => {
      setAlarmDetail((prev) => ({ ...prev, show: false, alarmItem: undefined }));
      refetch();
    },
  });

  const [checkedList, setCheckedList] = useState<number[]>([]);
  const [showCheckBox, setShowCheckBox] = useState(false);
  const [showBacthModal, setShowBacthModal] = useState(false);

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['alarmList', queryParams],
    queryFn: () => aiService.getAlarmList(queryParams),
    onSuccess: (_data) => {
      setCheckedList([]);
    },
  });

  const { data: categoryListRes, isLoading: categoryListLoading } = useQuery({
    queryKey: ['alarmCategory'],
    queryFn: () => aiService.getAlarmCategory({ page: 1, pageSize: 100 }),
  });

  const { mutate } = useMutation(aiService.BatchUpdateAlarmStatus, {
    onSuccess: () => {
      message.success('操作成功');
      // 直接修改缓存的数据状态，减少重复请求
      refetch();
      setShowBacthModal(false);
      setCheckedList([]);
    },
    onError: () => {
      message.success('操作失败');
    },
  });

  const statusList = data?.list.filter((item) => item.status === 0) || [];

  const checkAll = statusList.length !== 0 && checkedList.length === statusList.length;
  const indeterminate = checkedList.length > 0 && !checkAll;

  const onSearchFormReset = () => {
    searchForm.resetFields();
  };

  const onSearchFormSubmit = () => {
    setQueryParams((prev) => {
      const { date, ...other } = searchForm.getFieldsValue();
      prev.startTime = date ? date[0].format('YYYY-MM-DD') : undefined;
      prev.endTime = date ? date[1].format('YYYY-MM-DD') : undefined;
      return { ...prev, ...other };
    });
  };

  const pageChange = (page: number, pageSize: number) => {
    setQueryParams({ ...queryParams, page, pageSize });
  };

  const onCheckListChange = (list: number[]) => {
    setCheckedList(list);
  };

  const handleCheckAll: CheckboxProps['onChange'] = (e) => {
    const { checked } = e.target;
    const list = data?.list.filter((item) => item.status === 0).map((item) => item.id) || [];
    setCheckedList(checked ? list : []);
  };

  const handleAlarm = (status: number) => {
    mutate({ alarmIds: checkedList, status });
  };

  const batchHandle = () => {
    if (checkedList.length === 0) {
      Message.error('请至少选择一个告警事件');
      return;
    }
    setShowBacthModal(true);
  };

  return (
    <Space direction="vertical" size="large" className="w-full">
      <Card>
        <Form form={searchForm}>
          <Row gutter={[16, 16]}>
            <Col span={24} lg={6}>
              <Form.Item<AlarmListReq> label="设备名称" name="deviceName" className="!mb-0">
                <Input placeholder="请输入设备名称" allowClear />
              </Form.Item>
            </Col>
            <Col span={24} lg={4}>
              <Form.Item<AlarmListReq> label="状态" name="status" className="!mb-0">
                <Select allowClear>
                  <Select.Option value="0">
                    <ProTag color="error">未处理</ProTag>
                  </Select.Option>
                  <Select.Option value="1">
                    <ProTag color="success">已处理</ProTag>
                  </Select.Option>
                  <Select.Option value="2">
                    <ProTag color="warning">误报</ProTag>
                  </Select.Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={24} lg={4}>
              <Form.Item<AlarmListReq> label="告警类型" name="alarm_type_name" className="!mb-0">
                <Select allowClear disabled={categoryListLoading}>
                  {categoryListRes?.list.map((item) => {
                    return (
                      <Select.Option value={item.alarmTypeName} key={item.alarmCode}>
                        {item.alarmTypeName}
                      </Select.Option>
                    );
                  })}
                </Select>
              </Form.Item>
            </Col>
            <Col span={24} lg={6}>
              <Form.Item name="date" label="日期">
                <DatePicker.RangePicker format="YYYY-MM-DD" allowClear />
              </Form.Item>
            </Col>
            <Col span={24} lg={4}>
              <div className="flex justify-end">
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
        title="告警列表"
        loading={isLoading}
        extra={
          <Space>
            {showCheckBox ? (
              <>
                <Checkbox
                  onChange={handleCheckAll}
                  disabled={statusList.length === 0}
                  checked={checkAll}
                  indeterminate={indeterminate}
                >
                  全选
                </Checkbox>
                <Button type="default" onClick={batchHandle} disabled={checkedList.length === 0}>
                  批量处理
                </Button>
                <Button type="primary" onClick={() => setShowCheckBox(false)}>
                  取消
                </Button>
              </>
            ) : (
              <Button type="primary" onClick={() => setShowCheckBox(true)}>
                编辑
              </Button>
            )}
          </Space>
        }
      >
        {data?.list && data.list.length > 0 ? (
          <Checkbox.Group onChange={onCheckListChange} value={checkedList}>
            <Row gutter={[16, 16]} className="mb-4 min-h-96">
              {data?.list.map((alarmItem) => {
                return (
                  <Col lg={6} md={12} span={24} key={alarmItem.id}>
                    <StyledCardContent>
                      {showCheckBox && alarmItem.status === 0 && (
                        <div className="absolute left-1 top-1 z-10">
                          <Checkbox value={alarmItem.id} />
                        </div>
                      )}
                      <Card
                        className="w-full"
                        hoverable
                        cover={
                          <img
                            alt="example"
                            src={alarmItem.alarmImg}
                            style={{ height: '200px', background: '#000' }}
                          />
                        }
                        onClick={() => {
                          setAlarmDetail((prev) => ({ ...prev, show: true, alarmItem }));
                        }}
                      >
                        <div className="p-2">
                          <div className="mb-1 truncate font-bold ">
                            {alarmItem.deviceName || '测试-华为枪机测试-华为枪机'}
                          </div>
                          <p className="mb-1 text-sm">{`告警ID:${alarmItem.id}`}</p>
                          <p className="mb-1 text-sm text-gray-500">{alarmItem.createTime}</p>
                          <div>
                            <Tag color="blue">{alarmItem.modelname}</Tag>
                            <ProTag color={['error', 'success', 'warning'][alarmItem.status]}>
                              {['未处理', '已处理', '误报'][alarmItem.status]}
                            </ProTag>
                          </div>
                        </div>
                      </Card>
                    </StyledCardContent>
                  </Col>
                );
              })}

              <Col span={24}>
                <Pagination
                  defaultPageSize={queryParams.pageSize}
                  current={queryParams.page}
                  total={data?.total}
                  onChange={pageChange}
                  pageSizeOptions={[8, 20, 40, 100]}
                />
              </Col>
            </Row>
          </Checkbox.Group>
        ) : (
          <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
        )}
      </Card>

      <AlarmDetailModal {...alarmDetail} />
      <Modal
        title="批量处理"
        footer={(_, { CancelBtn }) => (
          <>
            <CancelBtn />
            <Button type="primary" danger onClick={() => handleAlarm(2)}>
              误报
            </Button>
            <Button type="primary" onClick={() => handleAlarm(1)}>
              处理
            </Button>
          </>
        )}
        open={showBacthModal}
        onCancel={() => setShowBacthModal(false)}
      >
        <p>
          是否批量处理<span className="font-bold text-error">{checkedList.length}</span>
          条告警事件？
        </p>
        <p>告警ID为：{checkedList.join(', ')}</p>
      </Modal>
    </Space>
  );
}

const StyledCardContent = styled.div`
  position: relative;
  .ant-card {
    .ant-card-body {
      padding: 0px;
    }
  }
`;
