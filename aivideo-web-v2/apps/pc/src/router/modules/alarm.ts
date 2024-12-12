
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
        meta: { title: { zh_CN: '内置规则', en_US: 'rules' } },
      },
      {
        path: 'notifierTargets/index',
        name: 'NotifierTargetsIndex',
        component: () => import('@/pages/alarm/notifierTargets/index.vue'),
        meta: { title: { zh_CN: '通知目标', en_US: 'notifierTargets' } },
      },
      {
        path: 'notifications/index',
        name: 'NotificationsIndex',
        component: () => import('@/pages/alarm/notifications/index.vue'),
        meta: { title: { zh_CN: '通知', en_US: 'notifications' } },
      },
      {
        path: 'events/index',
        name: 'EventsIndex',
        component: () => import('@/pages/alarm/events/index.vue'),
        meta: { title: { zh_CN: '事件', en_US: 'events' } },
      },
      {
        path: 'eventTypes/index',
        name: 'EventTypesIndex',
        component: () => import('@/pages/alarm/eventTypes/index.vue'),
        meta: { title: { zh_CN: '事件类型', en_US: 'eventTypes' } },
      },
      {
        path: 'datapoints/index',
        name: 'DatapointsIndex',
        component: () => import('@/pages/alarm/datapoints/index.vue'),
        meta: { title: { zh_CN: '数据点', en_US: 'datapoints' } },
      },
    ],
  },
];
