import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  Card,
  Table,
  message,
  Popconfirm,
  Button,
  Space,
  Form,
  Row,
  Col,
  Input,
  Tooltip,
  Modal,
} from 'antd';
import { ColumnsType } from 'antd/es/table';
import { TableRowSelection } from 'antd/es/table/interface';
import { useState } from 'react';

import { CategoryItem } from '@/api/services/categroyService';
import uploadFileService, { FileListReq, FileListItem } from '@/api/services/upload';
import { convertFileSizeUnit } from '@/components/upload-minio/fileUtil';
import UploadModal from '@/components/upload-minio/UploadModal';
import ProTag from '@/theme/antd/components/tag';

export type CategoryFileModalProps = {
  categoryItem?: CategoryItem;
  show: boolean;
  onCancel: () => void;
};

export default function CategoryFileModal({
  categoryItem,
  show,
  onCancel,
}: CategoryFileModalProps) {
  const queryClient = useQueryClient();
  const [searchForm] = Form.useForm();
  const [queryParams, setQueryParams] = useState({
    page: 1,
    pageSize: 10,
    fileName: undefined,
  });

  const [open, setOpen] = useState(false);

  const [selectedRows, setSelectedRows] = useState<FileListItem[]>([]);

  const { data, refetch } = useQuery({
    queryKey: ['getFileListByCategory', { ...queryParams, alarmTypeId: categoryItem?.id }],
    queryFn: () =>
      uploadFileService.fileList({ ...queryParams, alarmTypeId: categoryItem?.id || -1 }),
    enabled: show,
    staleTime: 0,
    onSuccess: (data) => {
      const rows = data.list.filter((item) => item.isUse === 1);
      setSelectedRows(rows);
    },
  });

  const { mutate: deleteFile, isLoading: deleteLoading } = useMutation(
    uploadFileService.deleteFile,
    {
      onSuccess: () => {
        refetch();
        message.success('操作成功');
      },
    },
  );

  const { mutate: bingAlarmCategory } = useMutation(uploadFileService.bingAlarmCategory, {
    onSuccess: () => {
      refetch();
      queryClient.refetchQueries(['alarmCategory']);
      message.success('绑定成功');
    },
  });

  const columns: ColumnsType<FileListItem> = [
    { title: 'ID', dataIndex: 'id', width: 80 },
    {
      title: '文件名称',
      dataIndex: 'fileName',
      width: 120,
    },
    {
      title: '文件大小',
      dataIndex: 'totalSize',
      width: 120,
      render: (_text) => {
        return convertFileSizeUnit(_text);
      },
    },
    {
      title: '下载地址',
      dataIndex: 'fileUrl',
      width: 200,
      ellipsis: {
        showTitle: false,
      },
      render: (text) => (
        <Tooltip placement="topLeft" title={text}>
          {text}
        </Tooltip>
      ),
    },
    {
      title: '状态',
      dataIndex: 'uploadComplete',
      width: 80,
      render: (text: string) => (
        <ProTag color={text ? 'green' : 'red'}>{text ? '上传完成' : '上传中'}</ProTag>
      ),
    },
    {
      title: '操作',
      key: 'operation',
      align: 'center',
      width: 100,
      render: (_, record) => (
        <Popconfirm
          title="确定要删除该源文件吗"
          okText="确认"
          cancelText="取消"
          placement="left"
          onConfirm={() => handleDeleteRule(record.id)}
        >
          <Button type="link" danger disabled={record.isUse === 1} loading={deleteLoading}>
            删除
          </Button>
        </Popconfirm>
      ),
    },
  ];

  const rowSelection: TableRowSelection<FileListItem> = {
    type: 'radio',
    selectedRowKeys: selectedRows?.map((item) => item.id),
    getCheckboxProps: (record: FileListItem) => ({
      disabled: record.uploadComplete !== 1,
    }),
    onChange: (_, rows) => {
      setSelectedRows(rows);
    },
  };

  const pageChange = (page: number, pageSize: number) => {
    setQueryParams({ ...queryParams, page, pageSize });
  };

  const handleDeleteRule = (id: number) => {
    deleteFile({ id });
  };

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
      fileName: undefined,
    }));
  };

  const handleBindCategory = () => {
    if (!selectedRows?.length) {
      message.error('请选择需要绑定的文件');
      return;
    }
    if (selectedRows[0].uploadComplete !== 1) {
      message.error('文件未上传完成');
      return;
    }
    bingAlarmCategory({
      alarmTypeId: categoryItem?.id || -1,
      fileId: selectedRows[0].id,
    });
  };

  return (
    <Modal
      title={`算法名称：【${categoryItem?.alarmTypeName}】`}
      open={show}
      destroyOnClose
      onCancel={onCancel}
      width={900}
      footer={
        <Space>
          <Button type="primary" danger onClick={handleBindCategory}>
            绑定算法
          </Button>
          <Button onClick={onCancel}>取消</Button>
        </Space>
      }
    >
      <Space direction="vertical" size="large" className="w-full">
        <Card>
          <Form form={searchForm}>
            <Row gutter={[16, 16]}>
              <Col span={24} md={8} lg={8}>
                <Form.Item<FileListReq> label="文件名称" name="fileName" className="!mb-0">
                  <Input placeholder="请输入文件名称" allowClear />
                </Form.Item>
              </Col>
              <Col span={24} md={8} lg={8}>
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
          title="源文件列表"
          extra={
            <Space>
              <Button type="primary" onClick={() => setOpen(true)}>
                上传源文件
              </Button>
            </Space>
          }
        >
          <Table
            rowKey="id"
            size="small"
            scroll={{ x: '100%', y: 200 }}
            pagination={{
              defaultPageSize: queryParams.pageSize,
              current: queryParams.page,
              total: data?.total || 0,
              onChange: pageChange,
              pageSizeOptions: [10, 20, 50, 100],
            }}
            columns={columns}
            dataSource={data?.list}
            rowSelection={rowSelection}
          />
        </Card>
        <UploadModal
          open={open}
          onCancel={() => setOpen(false)}
          alarmTypeId={categoryItem?.id || -1}
        />
      </Space>
    </Modal>
  );
}
