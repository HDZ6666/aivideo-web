import { Suspense, lazy } from 'react';
import { Navigate, Outlet } from 'react-router-dom';

import { SvgIcon } from '@/components/icon';
import { CircleLoading } from '@/components/loading';

import { AppRouteObject } from '#/router';

const AlarmPage = lazy(() => import('@/pages/ai/alarm'));
const CategoryPage = lazy(() => import('@/pages/ai/category'));
// const CategoryFile = lazy(() => import('@/pages/ai/category/category-file'));

export const AiRoutes: AppRouteObject = {
  order: 2,
  path: 'ai',
  element: (
    <Suspense fallback={<CircleLoading />}>
      <Outlet />
    </Suspense>
  ),
  meta: {
    label: 'sys.menu.ai.index',
    icon: <SvgIcon icon="ic-management" className="ant-menu-item-icon" size="24" />,
    key: '/ai',
  },
  children: [],
};

export const aiAlarmRoutes = [
  {
    index: true,
    element: <Navigate to="alarm" replace />,
  },
  {
    path: 'alarm',
    element: <AlarmPage />,
    meta: { label: 'sys.menu.ai.alarm', key: '/ai/alarm' },
  },
  {
    path: 'category',
    element: <CategoryPage />,
    meta: { label: '算法库', key: '/ai/category' },
  },
  // {
  //   path: 'categoryFile/:id',
  //   element: <CategoryFile />,
  //   meta: { label: '算法文件', key: '/ai/categoryFile/:id', hideMenu: true, hideTab: true },
  // },
];
