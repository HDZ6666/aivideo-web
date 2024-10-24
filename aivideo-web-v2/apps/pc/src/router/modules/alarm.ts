
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
        name: 'AlarmRules',
        component: () => import('@/pages/alarm/rules/index.vue'),
        meta: { title: { zh_CN: '内置规则', en_US: 'Alarm Center' } },
      },
      {
        path: 'index1',
        name: 'AlarmIndex',
        component: () => import('@/pages/user/index.vue'),
        meta: { title: { zh_CN: '告警中心', en_US: 'Alarm Center' } },
      },
      {
        path: 'index1',
        name: 'AlarmIndex',
        component: () => import('@/pages/user/index.vue'),
        meta: { title: { zh_CN: '告警中心', en_US: 'Alarm Center' } },
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
