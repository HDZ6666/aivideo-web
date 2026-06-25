import { Suspense, lazy } from 'react';
import { Navigate, Outlet } from 'react-router-dom';

import { SvgIcon } from '@/components/icon';
import { CircleLoading } from '@/components/loading';

import { AppRouteObject } from '#/router';

const DataPage = lazy(() => import('@/pages/statistics/data'));
const CardPage = lazy(() => import('@/pages/statistics/card'));
// const CategoryFile = lazy(() => import('@/pages/ai/category/category-file'));

const StatisticsRoutes: AppRouteObject = {
  order: 3,
  path: 'statistics',
  element: (
    <Suspense fallback={<CircleLoading />}>
      <Outlet />
    </Suspense>
  ),
  meta: {
    label: '数据中心',
    icon: <SvgIcon icon="ic-management" className="ant-menu-item-icon" size="24" />,
    key: '/statistics',
  },
  children: [
    {
      index: true,
      element: <Navigate to="data" replace />,
    },
    {
      path: 'data',
      element: <DataPage />,
      meta: { label: '数据列表', key: '/statistics/data' },
    },
    {
      path: 'card',
      element: <CardPage />,
      meta: { label: '统计卡片', key: '/statistics/card' },
    },
  ],
};

export default StatisticsRoutes;
