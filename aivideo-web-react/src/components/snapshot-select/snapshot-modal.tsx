import { useMutation, useQuery } from '@tanstack/react-query';
import { Card, Table, Modal, message, Image, Popconfirm, Button } from 'antd';
import { ColumnsType } from 'antd/es/table';
import { TableRowSelection } from 'antd/es/table/interface';
import { useState } from 'react';

import aiService, { SnapshotItem } from '@/api/services/aiService';

import { baseApiUrl } from '#/enum';

export type SnapshotModalProps = {
  select?: boolean;
  show: boolean;
  setShow: (show: boolean) => void;
  setSnapShot?: (url: string) => void;
};

export default function SnapshotModal({
  select = true,
  show,
  setShow,
  setSnapShot,
}: SnapshotModalProps) {
  const [queryParams, setQueryParams] = useState({
    page: 1,
    pageSize: 10,
  });
  const [selectedRows, setSelectedRows] = useState<SnapshotItem[]>([]);

  const columns: ColumnsType<SnapshotItem> = [
    { title: 'ID', dataIndex: 'id', width: 100 },
    {
      title: '快照',
      dataIndex: 'imgLink',
      width: 120,
      render: (_text, record) => (
        <Image
          src={`${baseApiUrl}${record.imgLink}`}
          width={100}
          height={100}
          style={{ objectFit: 'cover' }}
        />
      ),
    },
    {
      title: '地址',
      dataIndex: 'imgLink',
      render: (_text, record) => record.imgLink,
    },
    { title: '创建时间', dataIndex: 'createdAt', width: 150 },
  ];

  const operation: ColumnsType<SnapshotItem> = [
    {
      title: '操作',
      key: 'operation',
      align: 'center',
      width: 100,
      render: (_, record) => (
        <Popconfirm
          title="确定要删除该快照吗"
          okText="确认"
          cancelText="取消"
          placement="left"
          onConfirm={() => handleDeleteRule(record.id)}
        >
          <Button type="link" danger loading={deleteLoading}>
            删除
          </Button>
        </Popconfirm>
      ),
    },
  ];

  const rowSelection: TableRowSelection<SnapshotItem> = {
    onChange: (_, selectedRows) => {
      setSelectedRows(selectedRows);
    },
  };

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['getSnapshotList', queryParams],
    queryFn: () => aiService.getSnapshotList(queryParams),
  });

  const { mutate: deleteSnapshot, isLoading: deleteLoading } = useMutation(
    aiService.snapshotDelete,
    {
      onSuccess: () => {
        refetch();
        message.success('操作成功');
      },
      onError: () => {
        message.success('操作失败');
      },
    },
  );

  const pageChange = (page: number, pageSize: number) => {
    setQueryParams({ ...queryParams, page, pageSize });
  };

  const handleConfirm = () => {
    if (select) {
      if (selectedRows?.length === 0) {
        message.error('请选择图片');
        return;
      }
      setSnapShot && setSnapShot(selectedRows[0].imgLink);
    }
    setShow(false);
  };

  const handleDeleteRule = (id: number) => {
    deleteSnapshot({ id });
  };

  const close = () => {
    setShow(false);
  };

  const onOpenChange = (open: boolean) => {
    if (!open) {
      setQueryParams({
        page: 1,
        pageSize: 10,
      });
      setSelectedRows([]);
    }
  };

  return (
    <Modal
      title="历史快照"
      open={show}
      onCancel={close}
      onOk={handleConfirm}
      width={900}
      afterOpenChange={onOpenChange}
      destroyOnClose
    >
      <Card>
        <Table
          loading={isLoading}
          rowKey="id"
          size="small"
          scroll={{ x: '100%', y: 300 }}
          pagination={{
            defaultPageSize: queryParams.pageSize,
            current: queryParams.page,
            total: data?.total || 0,
            onChange: pageChange,
            pageSizeOptions: [10, 20, 50, 100],
          }}
          columns={select ? columns : [...columns, ...operation]}
          dataSource={data?.list}
          rowSelection={select ? { ...rowSelection, type: 'radio' } : undefined}
        />
      </Card>
    </Modal>
  );
}
