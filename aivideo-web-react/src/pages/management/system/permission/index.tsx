import { Button, Card, Popconfirm } from 'antd';
import Table, { ColumnsType } from 'antd/es/table';
import { isNil } from 'ramda';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { IconButton, Iconify, SvgIcon } from '@/components/icon';
import { useUserPermission } from '@/store/userStore';
import ProTag from '@/theme/antd/components/tag';

import PermissionAdd from './permission-add';
import PermissionEdit from './permission-edit';

import { Permission } from '#/entity';
import { BasicStatus, PermissionType } from '#/enum';

export type PermissionModalProps = {
  show: boolean;
  formValue: Permission;
  close: VoidFunction;
};

const defaultPermissionValue: Permission = {
  id: '',
  parentId: '',
  name: '',
  label: '',
  route: '',
  component: '',
  icon: '',
  hide: false,
  status: BasicStatus.ENABLE,
  type: PermissionType.CATALOGUE,
};
export default function PermissionPage() {
  const permissions = useUserPermission();
  const { t } = useTranslation();
  const [permissionAdd, setPermissionAdd] = useState<PermissionModalProps>({
    show: false,
    formValue: defaultPermissionValue,
    close: () => {
      setPermissionAdd((prev) => ({ ...prev, show: false }));
    },
  });
  const [permissionEdit, setPermissionEdit] = useState<PermissionModalProps>({
    show: false,
    formValue: defaultPermissionValue,
    close: () => {
      setPermissionEdit((prev) => ({ ...prev, show: false }));
    },
  });

  const getTableData = () => {
    console.log('更新数据');
  };

  const columns: ColumnsType<Permission> = [
    {
      title: 'Name',
      dataIndex: 'name',
      width: 300,
      render: (_, record) => <div>{t(record.label)}</div>,
    },
    {
      title: 'Type',
      dataIndex: 'type',
      width: 60,
      render: (_, record) => <ProTag color="processing">{PermissionType[record.type]}</ProTag>,
    },
    {
      title: 'Icon',
      dataIndex: 'icon',
      width: 60,
      render: (icon: string) => {
        if (isNil(icon)) return '';
        if (icon.startsWith('ic')) {
          return <SvgIcon icon={icon} size={18} className="ant-menu-item-icon" />;
        }
        return <Iconify icon={icon} size={18} className="ant-menu-item-icon" />;
      },
    },
    {
      title: 'Component',
      dataIndex: 'component',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      align: 'center',
      width: 120,
      render: (status: BasicStatus) => (
        <ProTag color={status === BasicStatus.DISABLE ? 'error' : 'success'}>
          {status === BasicStatus.DISABLE ? 'Disable' : 'Enable'}
        </ProTag>
      ),
    },
    { title: 'Order', dataIndex: 'order', width: 60 },
    {
      title: 'Action',
      key: 'operation',
      align: 'center',
      width: 100,
      render: (_, record) => (
        <div className="flex w-full justify-end text-gray">
          {record?.type === PermissionType.CATALOGUE && (
            <IconButton onClick={() => onCreate(record.id)}>
              <Iconify icon="gridicons:add-outline" size={18} />
            </IconButton>
          )}
          <IconButton onClick={() => onEdit(record)}>
            <Iconify icon="solar:pen-bold-duotone" size={18} />
          </IconButton>
          <Popconfirm title="Delete the Permission" okText="Yes" cancelText="No" placement="left">
            <IconButton>
              <Iconify icon="mingcute:delete-2-fill" size={18} className="text-error" />
            </IconButton>
          </Popconfirm>
        </div>
      ),
    },
  ];

  const onCreate = (parentId?: string) => {
    setPermissionAdd((prev) => ({
      ...prev,
      show: true,
      formValue: { ...defaultPermissionValue, parentId: parentId ?? '' },
    }));
  };

  const onEdit = (formValue: Permission) => {
    setPermissionEdit((prev) => ({ ...prev, show: true, formValue: { ...formValue } }));
  };

  return (
    <Card
      title="Permission List"
      extra={
        <Button type="primary" onClick={() => onCreate()}>
          新增权限
        </Button>
      }
    >
      <Table
        rowKey="id"
        size="small"
        scroll={{ x: 'max-content' }}
        pagination={false}
        columns={columns}
        dataSource={permissions}
      />
      <PermissionAdd {...permissionAdd} getTableData={getTableData} />
      <PermissionEdit {...permissionEdit} getTableData={getTableData} />
    </Card>
  );
}
