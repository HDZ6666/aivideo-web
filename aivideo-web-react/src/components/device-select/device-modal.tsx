import { useQuery } from '@tanstack/react-query';
import { Button, Card, Col, Form, Input, Row, Table, Modal, Alert } from 'antd';
import { ColumnsType } from 'antd/es/table';
import { TableRowSelection } from 'antd/es/table/interface';
import { useState } from 'react';
import { useParams } from 'react-router-dom';

import aiService, { DeviceItem, DeviceListByAlarmTyeReq } from '@/api/services/aiService';

export type DeviceModalProps = {
  show: boolean;
  setShow: (show: boolean) => void;
  deviceList: DeviceType[];
  setDeviceList: (deviceList: DeviceType[]) => void;
};

export interface DeviceType {
  deviceId?: string;
  channelId?: string;
  id: number;
  name: string;
}

export default function DeviceModal({
  show,
  deviceList,
  setShow,
  setDeviceList,
}: DeviceModalProps) {
  const params = useParams();
  const [searchForm] = Form.useForm();
  const [queryParams, setQueryParams] = useState({
    page: 1,
    pageSize: 10,
    query: undefined,
    isBing: 0,
    alarmTypeId: params?.alarmTypeId || undefined, // 模型ID
  });
  const [selectedRows, setSelectedRows] = useState<DeviceType[]>([]);
  const selectedRowKeys = selectedRows.map((item) => item.id);

  const columns: ColumnsType<DeviceItem> = [
    { title: 'ID', dataIndex: 'id', width: 100 },
    { title: '设备名称', dataIndex: 'name', width: 300 },
    { title: '设备ID', dataIndex: 'deviceId', width: 300 },
    { title: '通道ID', dataIndex: 'channelId', width: 300 },
  ];

  const rowSelection: TableRowSelection<DeviceItem> = {
    selectedRowKeys,
    onSelect: (record, selected) => {
      if (selected) {
        // 选中
        const selectObj = {
          id: record.id,
          name: record.name,
          deviceId: record.deviceId,
          channelId: record.channelId,
        };
        setSelectedRows([...selectedRows, selectObj]);
      } else {
        // 取消选中
        setSelectedRows(selectedRows.filter((item) => item.id !== record.id));
      }
    },
    onSelectAll: (selected, _selectedRows, changeRows) => {
      if (selected) {
        // 选中
        const selectList = changeRows.map((item) => {
          return {
            id: item.id,
            name: item.name,
            deviceId: item.deviceId,
            channelId: item.channelId,
          };
        });
        setSelectedRows([...selectedRows, ...selectList]);
      } else {
        // 取消选中
        const list = selectedRows.filter(
          (item) => !changeRows.some((changeRow) => changeRow.id === item.id),
        );
        setSelectedRows(list);
      }
    },
  };

  const { data, isLoading } = useQuery({
    queryKey: ['getDeviceListByAlarmTye', queryParams],
    queryFn: () => aiService.getDeviceListByAlarmTye(queryParams),
  });
  const onSearchFormReset = () => {
    searchForm.resetFields();
  };

  const onSearchFormSubmit = () => {
    const date = searchForm.getFieldsValue();
    setQueryParams((prev) => {
      return { ...prev, ...date, page: 1 };
    });
  };

  const pageChange = (page: number, pageSize: number) => {
    setQueryParams({ ...queryParams, page, pageSize });
  };

  const handleConfirm = () => {
    setDeviceList(selectedRows);
    setShow(false);
  };

  const close = () => {
    setShow(false);
  };

  const onClaer = () => {
    setSelectedRows([]);
  };

  const onOpenChange = (open: boolean) => {
    if (!open) {
      setQueryParams({
        page: 1,
        pageSize: 10,
        query: undefined,
        isBing: 0,
        alarmTypeId: params?.alarmTypeId || undefined,
      });
      setSelectedRows([]);
    } else {
      setSelectedRows([...deviceList]);
    }
  };

  return (
    <Modal
      title="设备列表"
      open={show}
      onCancel={close}
      onOk={handleConfirm}
      width={900}
      afterOpenChange={onOpenChange}
      destroyOnClose
    >
      <Card>
        <Form form={searchForm}>
          <Row gutter={[16, 16]}>
            <Col span={12} lg={8}>
              <Form.Item<DeviceListByAlarmTyeReq> label="设备名称" name="query" className="">
                <Input placeholder="请输入设备名称" allowClear />
              </Form.Item>
            </Col>
            <Col span={12} lg={6}>
              <div className="flex">
                <Button onClick={onSearchFormReset}>重置</Button>
                <Button type="primary" className="ml-4" onClick={onSearchFormSubmit}>
                  搜索
                </Button>
              </div>
            </Col>
          </Row>
        </Form>
        <Alert
          message={`已选中${selectedRowKeys.length}项`}
          showIcon
          action={
            <Button size="small" danger onClick={onClaer}>
              全部清空
            </Button>
          }
        />
        <Table
          loading={isLoading}
          rowKey="id"
          size="small"
          scroll={{ x: 'max-content', y: 300 }}
          pagination={{
            defaultPageSize: queryParams.pageSize,
            current: queryParams.page,
            total: data?.total || 0,
            onChange: pageChange,
            pageSizeOptions: [10, 20, 50, 100],
          }}
          columns={columns}
          dataSource={data?.list}
          rowSelection={{ ...rowSelection }}
        />
      </Card>
    </Modal>
  );
}
