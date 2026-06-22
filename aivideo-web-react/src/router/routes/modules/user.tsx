import { Suspense, lazy } from 'react';
import { Navigate, Outlet } from 'react-router-dom';

import { SvgIcon } from '@/components/icon';
import { CircleLoading } from '@/components/loading';

import { AppRouteObject } from '#/router';

const AccountPage = lazy(() => import('@/pages/management/user/account'));

const management: AppRouteObject = {
  order: 11,
  path: 'user',
  element: (
    <Suspense fallback={<CircleLoading />}>
      <Outlet />
    </Suspense>
  ),
  meta: {
    label: 'sys.menu.user.index',
    icon: <SvgIcon icon="ic-management" className="ant-menu-item-icon" size="24" />,
    key: '/user',
    hideMenu: true,
  },
  children: [
    {
      index: true,
      element: <Navigate to="account" replace />,
    },
    {
      path: 'account',
      element: <AccountPage />,
      meta: { label: 'sys.menu.user.account', key: '/user/account' },
    },
  ],
};

export default management;
