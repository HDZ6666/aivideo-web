import { useQuery } from '@tanstack/react-query';
import { Button, Card, Col, Form, Input, Row, Table, Modal, Alert } from 'antd';
import { ColumnsType } from 'antd/es/table';
import { TableRowSelection } from 'antd/es/table/interface';
import { useState } from 'react';

import userService, { GetPushUserListItem } from '@/api/services/userService';

export type UserModalProps = {
  show: boolean;
  setShow: (show: boolean) => void;
  userList: UserType[];
  setUserList: (userList: UserType[]) => void;
};

export interface UserType {
  id: number;
  name: string;
}

export default function UserModal({ show, userList, setShow, setUserList }: UserModalProps) {
  const [searchForm] = Form.useForm();
  const [queryParams, setQueryParams] = useState({
    page: 1,
    count: 10,
    username: undefined,
  });
  const [selectedRows, setSelectedRows] = useState<UserType[]>([]);
  const selectedRowKeys = selectedRows.map((item) => item.id);

  const columns: ColumnsType<GetPushUserListItem> = [
    { title: '序号', dataIndex: 'id', width: 100 },
    { title: '名称', dataIndex: 'username', width: 300 },
    { title: '手机', dataIndex: 'mobile', width: 300 },
  ];

  const rowSelection: TableRowSelection<GetPushUserListItem> = {
    selectedRowKeys,
    onSelect: (record, selected, _selectedRows) => {
      if (selected) {
        // 选中
        const selectObj = {
          id: record.id,
          name: record.username || '',
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
            name: item.username || '',
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
    queryKey: ['getPushUser', queryParams],
    queryFn: () => userService.getPushUser(queryParams),
  });
  const onSearchFormReset = () => {
    searchForm.resetFields();
    setQueryParams((prev) => ({
      ...prev,
      page: 1,
      username: undefined,
    }));
  };

  const onSearchFormSubmit = () => {
    const date = searchForm.getFieldsValue();
    setQueryParams((prev) => {
      return { ...prev, ...date, page: 1 };
    });
  };

  const pageChange = (page: number, pageSize: number) => {
    setQueryParams({ ...queryParams, page, count: pageSize });
  };

  const handleConfirm = () => {
    setUserList(selectedRows);
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
        count: 10,
        username: undefined,
      });
      setSelectedRows([]);
    } else {
      setSelectedRows([...userList]);
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
              <Form.Item<GetPushUserListItem> label="设备名称" name="username" className="">
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
            defaultPageSize: queryParams.count,
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
