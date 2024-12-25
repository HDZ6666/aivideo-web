import { useMutation, useQuery } from '@tanstack/react-query';
import { Button, Card, Space, Table, Popconfirm, message, Modal } from 'antd';
import { ColumnsType } from 'antd/es/table';
import { TableRowSelection } from 'antd/es/table/interface';
import { useState } from 'react';
import { styled } from 'styled-components';

import aiService, { DeviceItem, RuleItem } from '@/api/services/aiService';

import AddRulePage from './add-rule';
import { notificateTypeOptions } from './base-set';
import EditDeviceRulePage from './edit-device-rule';
import EditRulePage from './edit-rule';

export interface ExpandColumns extends DeviceItem {
  ruleId: number;
}

export type RuleListProps = {
  alarmTypeId: string;
  title: string;
};

export default function RuleList({ alarmTypeId, title }: RuleListProps) {
  // const [searchForm] = Form.useForm();
  const [actionType, setActionType] = useState('list');
  const [currentRuleID, setCurrentRuleID] = useState<number>(0);
  const [queryParams, setQueryParams] = useState({
    page: 1,
    pageSize: 10,
    query: undefined,
    alarmTypeId, // 模型ID
  });

  const [selectedRows, setSelectedRows] = useState<RuleItem[]>([]);
  const selectedRowKeys = selectedRows.map((item) => item.id);

  const columns: ColumnsType<RuleItem> = [
    {
      title: '序号',
      dataIndex: 'id',
      width: 50,
      render: (_value, _record, index) => index + 1 + (queryParams.page - 1) * queryParams.pageSize,
    },
    {
      title: '设备名称',
      dataIndex: 'device',
      render: (_text, record) => record?.device?.length && record.device[0].name,
    },
    {
      title: '设备ID',
      dataIndex: 'device',
      render: (_text, record) => record?.device?.length && record.device[0].channelId,
    },
    {
      title: '通知方式',
      dataIndex: 'notificateType',
      width: 100,
      render: (_text, record) => {
        if (record?.notificateType?.length) {
          return record.notificateType
            .map((item) => notificateTypeOptions.find((i) => i.value === item)?.label)
            .join(',');
        }
        return '无';
      },
    },
    {
      title: '通知人员',
      dataIndex: 'notificatePeople',
      width: 100,
      render: (_text, record) => {
        if (record?.notificatePeople?.length) {
          return record.notificatePeople.map((item) => item.name).join(' , ');
        }
        return '无';
      },
    },
    {
      title: '操作',
      key: 'operation',
      align: 'center',
      width: 100,
      render: (_, record) => (
        <div className="flex justify-center w-full text-gray">
          <Button type="link" onClick={() => handleEditRule(record)}>
            编辑
          </Button>
          <Popconfirm
            title="确定要删除该设备吗"
            okText="确认"
            cancelText="取消"
            placement="left"
            onConfirm={() => handleDeleteRule(record.id)}
          >
            <Button type="link" danger loading={batchDeleteLoading || deleteLoading}>
              删除
            </Button>
          </Popconfirm>
        </div>
      ),
    },
  ];

  const rowSelection: TableRowSelection<RuleItem> = {
    selectedRowKeys,
    onSelect: (record, selected) => {
      if (selected) {
        // 选中
        setSelectedRows([...selectedRows, record]);
      } else {
        // 取消选中
        setSelectedRows(selectedRows.filter((item) => item.id !== record.id));
      }
    },
    onSelectAll: (selected, _selectedRows, changeRows) => {
      if (selected) {
        // 选中
        setSelectedRows([...selectedRows, ...changeRows]);
      } else {
        // 取消选中
        const list = selectedRows.filter(
          (item) => !changeRows.some((changeRow) => changeRow.id === item.id),
        );
        setSelectedRows(list);
      }
    },
  };

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['getRuleListByAlarmType', queryParams],
    queryFn: () => aiService.getRuleListByAlarmType(queryParams),
    onSuccess: (data) => {
      setSelectedRows([]);
      console.log(data);
    },
  });

  const { isLoading: deleteLoading, mutate: deleteRule } = useMutation(
    aiService.deteleRuleByAlarmType,
    {
      onSuccess: () => {
        message.success('删除规则成功');
        // 更新查询接口数据
        refetch();
      },
    },
  );

  const { isLoading: batchDeleteLoading, mutate: batchDeleteRule } = useMutation(
    aiService.batchdeteleRule,
    {
      onSuccess: () => {
        message.success('批量删除规则成功');
        // 更新查询接口数据
        refetch();
      },
    },
  );

  // const onSearchFormReset = () => {
  //   searchForm.resetFields();
  // };

  // const onSearchFormSubmit = () => {
  //   setQueryParams((prev) => {
  //     const date = searchForm.getFieldsValue();
  //     return { ...prev, ...date };
  //   });
  // };

  const pageChange = (page: number, pageSize: number) => {
    setQueryParams({ ...queryParams, page, pageSize });
  };

  const handleCreatRule = () => {
    setActionType('add');
  };

  const handleEditRule = (record: RuleItem) => {
    setActionType('edit');
    setCurrentRuleID(record.id);
  };

  const handleBetchEditRule = () => {
    if (selectedRowKeys.length < 2) {
      message.warning('请至少选择2条要编辑的规则');
      return;
    }
    const instance = Modal.confirm({
      title: '批量设置',
      content: (
        <>
          <p>
            是否批量设置<span className="font-bold text-error">{selectedRowKeys.length}</span>
            条规则？
          </p>
          <p className="font-bold text-error">已选中的规则会被覆盖为新的规则。</p>
        </>
      ),
      maskClosable: true,
      onOk: () => {
        setActionType('editDevice');
        instance.destroy();
      },
    });
  };

  const handleDeleteRule = (ruleId: number) => {
    deleteRule({ ruleId });
  };

  const handleBetchDelete = () => {
    if (selectedRowKeys.length < 2) {
      message.warning('请至少选择2条要删除的规则');
      return;
    }
    const instance = Modal.confirm({
      title: '批量删除',
      content: (
        <>
          <p>
            是否批量删除<span className="font-bold text-error">{selectedRowKeys.length}</span>
            条规则？
          </p>
          <p className="font-bold text-error">删除后不可恢复!</p>
        </>
      ),
      maskClosable: true,
      onOk: () => {
        batchDeleteRule(selectedRowKeys);
        instance.destroy();
      },
    });
  };

  return (
    <Space direction="vertical" size="large" className="w-full">
      {actionType === 'list' && (
        <>
          {/* <Card>
            <Form form={searchForm}>
              <Row gutter={[16, 16]}>
                <Col span={12} lg={8}>
                  <Form.Item<GetRuleListByAlarmTypeReq>
                    label="设备名称"
                    name="query"
                    className="!mb-0"
                  >
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
          </Card> */}
          <Card
            title={title}
            loading={isLoading}
            extra={
              <Space>
                <Button type="primary" className="ml-4" onClick={handleCreatRule}>
                  新增规则
                </Button>
                <Button
                  className="ml-4"
                  style={{ color: 'red', borderColor: 'red' }}
                  onClick={handleBetchEditRule}
                >
                  批量配置
                </Button>
                <Button type="primary" danger className="ml-4" onClick={handleBetchDelete}>
                  批量删除
                </Button>
              </Space>
            }
          >
            <StyledTable>
              <Table
                loading={deleteLoading || batchDeleteLoading}
                rowKey="id"
                size="small"
                scroll={{ x: 'max-content' }}
                pagination={{
                  defaultPageSize: queryParams.pageSize,
                  current: queryParams.page,
                  total: data?.total || 0,
                  onChange: pageChange,
                  pageSizeOptions: [10, 20, 40, 100],
                }}
                columns={columns}
                dataSource={data?.list}
                rowSelection={{ ...rowSelection }}
              />
            </StyledTable>
          </Card>
        </>
      )}
      {actionType === 'add' && (
        <AddRulePage alarmTypeId={alarmTypeId} setActionType={setActionType} />
      )}

      {actionType === 'edit' && (
        <EditRulePage
          alarmTypeId={alarmTypeId}
          setActionType={setActionType}
          ruleId={currentRuleID}
        />
      )}
      {actionType === 'editDevice' && (
        <EditDeviceRulePage
          selectedRows={selectedRows}
          alarmTypeId={alarmTypeId}
          setActionType={setActionType}
        />
      )}
    </Space>
  );
}

const StyledTable = styled.div`
  background: #fff;
  height: 100%;

  .ant-table-wrapper tr.ant-table-expanded-row > td {
    background: #fff;
  }

  .ant-table-wrapper tr.ant-table-expanded-row:hover > td {
    background: none;
  }

  /* .ant-table-wrapper
    .ant-table.ant-table-small
    .ant-table-tbody
    .ant-table-wrapper:only-child
    .ant-table {
    margin-inline: 0px;
  } */
`;
