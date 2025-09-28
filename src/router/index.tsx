import { lazy } from 'react';
import { Navigate, RouteObject, RouterProvider, createHashRouter } from 'react-router-dom';

import DashboardLayout from '@/layouts/dashboard';
import AuthGuard from '@/router/components/auth-guard';
import { usePermissionRoutes } from '@/router/hooks';
import { ErrorRoutes } from '@/router/routes/error-routes';
// import { menuRoutes } from '@/router/routes/menu-routes'; // 本地路由

import { AppRouteObject } from '#/router';

const { VITE_APP_HOMEPAGE: HOMEPAGE } = import.meta.env;
const LoginRoute: AppRouteObject = {
  path: '/login',
  Component: lazy(() => import('@/pages/sys/login/Login')),
};
const PAGE_NOT_FOUND_ROUTE: AppRouteObject = {
  path: '*',
  element: <Navigate to="/404" replace />,
};

const PAGE_REDIRECT_ROUTE: AppRouteObject = {
  path: '/redirect',
  Component: lazy(() => import('@/pages/sys/redirect/PageRedirect')),
};

export default function Router() {
  const permissionRoutes = usePermissionRoutes(); // 动态路由
  const asyncRoutes: AppRouteObject = {
    path: '/',
    element: (
      <AuthGuard>
        <DashboardLayout />
      </AuthGuard>
    ),
    children: [{ index: true, element: <Navigate to={HOMEPAGE} replace /> }, ...permissionRoutes],
  };

  const routes = [LoginRoute, asyncRoutes, ErrorRoutes, PAGE_NOT_FOUND_ROUTE, PAGE_REDIRECT_ROUTE];

  const router = createHashRouter(routes as unknown as RouteObject[]);

  return <RouterProvider router={router} />;
}
