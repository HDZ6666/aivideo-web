import { isEmpty } from 'ramda';
import { Suspense, lazy, useMemo } from 'react';
import { Navigate, Outlet } from 'react-router-dom';

import { Iconify } from '@/components/icon';
import { CircleLoading } from '@/components/loading';
import RuleList from '@/pages/ai/setting';
import { AiRoutes, aiAlarmRoutes } from '@/router/routes/ai-routes';
import { useUserAiPermission, useUserPermission } from '@/store/userStore';
import ProTag from '@/theme/antd/components/tag';
import { flattenTrees } from '@/utils/tree';

import { getMenuModules } from '../utils';

import { Permission } from '#/entity';
import { BasicStatus, PermissionType } from '#/enum';
import { AppRouteObject } from '#/router';

// 使用 import.meta.glob 获取所有路由组件
const entryPath = '/src/pages';
const pages = import.meta.glob('/src/pages/**/*.tsx');
export const pagesSelect = Object.entries(pages).map(([path]) => {
  const pagePath = path.replace(entryPath, '');
  return {
    label: pagePath,
    value: pagePath,
  };
});

// 构建绝对路径的函数
function resolveComponent(path: string) {
  return pages[`${entryPath}${path}`];
}

/**
 * 动态获取权限路由
 */
export function usePermissionRoutes2() {
  const permissions = useUserPermission();

  return useMemo(() => {
    const flattenedPermissions = flattenTrees(permissions!); // 获取一维数组的权限
    const permissionRoutes = transformPermissionToMenuRoutes(
      permissions || [],
      flattenedPermissions,
    );
    return [...permissionRoutes];
  }, [permissions]);
}

export function usePermissionRoutes() {
  const permissions = useUserPermission();
  const aiRoutes = useAiRoutes();
  return useMemo(() => {
    if (!permissions) {
      return [...getMenuModules(), ...aiRoutes];
    }
    const flattenedPermissions = flattenTrees(permissions!); // 获取一维数组的权限
    const permissionRoutes = transformPermissionToMenuRoutes(
      permissions || [],
      flattenedPermissions,
    );
    return [...permissionRoutes];
  }, [aiRoutes, permissions]);
}

export function useAiRoutes() {
  const aipermissions = useUserAiPermission();

  return useMemo(() => {
    if (!aipermissions || isEmpty(aipermissions)) {
      AiRoutes.children = [...aiAlarmRoutes];
      return [AiRoutes];
    }
    const aiPermissionRoutes: AppRouteObject[] = aipermissions
      .filter((item) => item.status)
      .map((item) => ({
        path: item.alarmCode,
        element: (
          <RuleList
            key={item.alarmTypeId}
            alarmTypeId={`${item.alarmTypeId}`}
            title={item.alarmTypeName}
          />
        ),
        meta: { label: item.alarmTypeName, key: `/ai/setting/${item.alarmCode}` },
      }));
    const aiSettingRoutes = {
      path: 'setting',
      meta: { label: 'sys.menu.ai.setting', key: '/ai/setting' },
      children: [
        {
          index: true,
          element: <Navigate to={aipermissions[0].alarmCode} replace />,
        },
        ...aiPermissionRoutes,
      ],
    };
    AiRoutes.children = [...aiAlarmRoutes, aiSettingRoutes];
    return [AiRoutes];
  }, [aipermissions]);
}

/**
 * transform Permission[] to  AppRouteObject[]
 * @param permissions
 * @param parent
 */
function transformPermissionToMenuRoutes(
  permissions: Permission[],
  flattenedPermissions: Permission[],
) {
  return permissions.map((permission) => {
    const {
      route,
      type,
      label,
      icon,
      order,
      hide,
      hideTab,
      status,
      frameSrc,
      newFeature,
      component,
      parentId,
      children = [],
    } = permission;

    const appRoute: AppRouteObject = {
      path: route,
      meta: {
        label,
        key: getCompleteRoute(permission, flattenedPermissions),
        hideMenu: !!hide,
        hideTab,
        disabled: status === BasicStatus.DISABLE,
      },
    };

    if (order) appRoute.order = order;
    if (icon) appRoute.meta!.icon = icon;
    if (frameSrc) appRoute.meta!.frameSrc = frameSrc;
    if (newFeature)
      appRoute.meta!.suffix = (
        <ProTag color="cyan" icon={<Iconify icon="solar:bell-bing-bold-duotone" size={14} />}>
          NEW
        </ProTag>
      );

    if (type === PermissionType.CATALOGUE) {
      appRoute.meta!.hideTab = true;
      if (!parentId) {
        appRoute.element = (
          <Suspense fallback={<CircleLoading />}>
            <Outlet />
          </Suspense>
        );
      }
      appRoute.children = transformPermissionToMenuRoutes(children, flattenedPermissions);
      if (!isEmpty(children)) {
        appRoute.children.unshift({
          index: true,
          element: <Navigate to={children[0].route} replace />,
        });
      }
    } else if (type === PermissionType.MENU) {
      const Element = lazy(resolveComponent(component!) as any);
      if (frameSrc) {
        appRoute.element = <Element src={frameSrc} />;
      } else {
        appRoute.element = <Element />;
      }
    }

    return appRoute;
  });
}

/**
 * 拼接完整路由
 * @param {Permission} permission - current permission
 * @param {Permission[]} flattenedPermissions - flattened permission array
 * @param {string} route - parent permission route
 * @returns {string} - The complete route after splicing
 */
function getCompleteRoute(permission: Permission, flattenedPermissions: Permission[], route = '') {
  const currentRoute = route ? `/${permission.route}${route}` : `/${permission.route}`;

  if (permission.parentId) {
    const parentPermission = flattenedPermissions.find((p) => p.id === permission.parentId)!;
    return getCompleteRoute(parentPermission, flattenedPermissions, currentRoute);
  }

  return currentRoute;
}
