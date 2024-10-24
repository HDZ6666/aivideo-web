
import Layout from '@/layouts/index.vue';

export default [
  {
    path: '/alarm',
    name: 'alarm',
    component: Layout,
    redirect: '/alarm/rules/index',
    meta: { title: { zh_CN: '告警中心', en_US: 'Alarm Center' }, icon: 'alarm' },
    children: [
      {
        path: 'rules/index',
        name: 'Rules/Index',
        component: () => import('@/pages/alarm/rules/index.vue'),
        meta: { title: { zh_CN: '内置规则', en_US: 'Alarm Center' } },
      },
      {
        path: 'notifierTargets/index',
        name: 'NotifierTargetsIndex',
        component: () => import('@/pages/alarm/notifierTargets/index.vue'),
        meta: { title: { zh_CN: '通知目标', en_US: 'Alarm Center' } },
      },
      {
        path: 'notifications/index',
        name: 'NotificationsIndex',
        component: () => import('@/pages/alarm/notifications/index.vue'),
        meta: { title: { zh_CN: '通知', en_US: 'Alarm Center' } },
      },
      {
        path: 'index1',
        name: 'AlarmIndex',
        component: () => import('@/pages/user/index.vue'),
        meta: { title: { zh_CN: '告警中心', en_US: 'Alarm Center' } },
      },
    ],
  },
];
