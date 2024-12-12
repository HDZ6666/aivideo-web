import { Suspense, lazy } from 'react';
import { Navigate, Outlet } from 'react-router-dom';

import { SvgIcon } from '@/components/icon';
import { CircleLoading } from '@/components/loading';

import { AppRouteObject } from '#/router';

const OrganizationPage = lazy(() => import('@/pages/management/system/organization'));
const PermissioPage = lazy(() => import('@/pages/management/system/permission'));
const RolePage = lazy(() => import('@/pages/management/system/role'));
const UserPage = lazy(() => import('@/pages/management/system/user'));

const management: AppRouteObject = {
  order: 10,
  path: 'management',
  element: (
    <Suspense fallback={<CircleLoading />}>
      <Outlet />
    </Suspense>
  ),
  meta: {
    label: 'sys.menu.management',
    icon: <SvgIcon icon="ic-management" className="ant-menu-item-icon" size="24" />,
    key: '/management',
    hideMenu: true,
    hideTab: true,
  },
  children: [
    {
      index: true,
      element: <Navigate to="organization" replace />,
    },
    {
      path: 'organization',
      element: <OrganizationPage />,
      meta: { label: 'sys.menu.system.organization', key: '/management/organization' },
    },
    {
      path: 'role',
      element: <RolePage />,
      meta: { label: 'sys.menu.system.role', key: '/management/role' },
    },
    {
      path: 'user',
      element: <UserPage />,
      meta: { label: 'sys.menu.system.user', key: '/management/user' },
    },
    {
      path: 'permission',
      element: <PermissioPage />,
      meta: { label: 'sys.menu.system.permission', key: '/management/permission' },
    },
  ],
};

export default management;
