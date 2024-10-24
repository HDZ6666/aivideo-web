
import Layout from '@/layouts/index.vue';

export default [
  {
    path: '/alarm',
    name: 'alarm',
    component: Layout,
    redirect: '/alarm/index',
    meta: { title: { zh_CN: '告警中心', en_US: 'Alarm Center' }, icon: 'alarm' },
    children: [
      {
        path: 'index',
        name: 'AlarmIndex',
        component: () => import('@/pages/alarm/index.vue'),
        meta: { title: { zh_CN: '告警中心', en_US: 'Alarm Center' } },
      },
    ],
  }
];
