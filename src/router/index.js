import { createWebHashHistory, createRouter } from 'vue-router'
/* Layout */
import Layout from '@/layout'
import ParentView from '@/components/ParentView'

/**
 * Note: 路由配置项
 *
 * hidden: true                     // 当设置 true 的时候该路由不会再侧边栏出现 如401，login等页面，或者如一些编辑页面/edit/1
 * alwaysShow: true                 // 当你一个路由下面的 children 声明的路由大于1个时，自动会变成嵌套的模式--如组件页面
 *                                  // 只有一个时，会将那个子路由当做根路由显示在侧边栏--如引导页面
 *                                  // 若你想不管路由下面的 children 声明的个数都显示你的根路由
 *                                  // 你可以设置 alwaysShow: true，这样它就会忽略之前定义的规则，一直显示根路由
 * redirect: noRedirect             // 当设置 noRedirect 的时候该路由在面包屑导航中不可被点击
 * name:'router-name'               // 设定路由的名字，一定要填写不然使用<keep-alive>时会出现各种问题
 * query: '{"id": 1, "name": "ry"}' // 访问路由的默认传递参数
 * roles: ['admin', 'common']       // 访问路由的角色权限
 * permissions: ['a:a:a', 'b:b:b']  // 访问路由的菜单权限
 * meta : {
    noCache: true                   // 如果设置为true，则不会被 <keep-alive> 缓存(默认 false)
    title: 'title'                  // 设置该路由在侧边栏和面包屑中展示的名字
    icon: 'svg-name'                // 设置该路由的图标，对应路径src/assets/icons/svg
    breadcrumb: false               // 如果设置为false，则不会在breadcrumb面包屑中显示
    activeMenu: '/system/user'      // 当路由设置了该属性，则会高亮相对应的侧边栏。
  }
 */

// 公共路由
export const constantRoutes = [
  {
    path: '/redirect',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '/redirect/:path(.*)',
        component: () => import('@/views/redirect/index.vue')
      }
    ]
  },
  {
    path: '/login',
    component: () => import('@/views/login'),
    hidden: true
  },
  {
    path: '/register',
    component: () => import('@/views/register'),
    hidden: true
  },
  {
    path: "/:pathMatch(.*)*",
    component: () => import('@/views/error/404'),
    hidden: true
  },
  {
    path: '/401',
    component: () => import('@/views/error/401'),
    hidden: true
  },
  {
    path: '',
    component: Layout,
    redirect: '/index',
    children: [
      {
        path: '/index',
        component: () => import('@/views/index'),
        name: 'Index',
        meta: { title: '首页', icon: 'dashboard', affix: true }
      }
    ]
  },
  {
    path: '/viid',
    component: Layout,
    redirect: 'noredirect',
    name: 'Viid',
    meta: { title: '视图库', icon: 'monitor', alwaysShow: true },
    children: [
      // 二级路由：数据采集
      {
        path: 'dataCollection',
        component: ParentView,
        redirect: 'noredirect',
        name: 'DataCollection',
        meta: { title: '数据采集', icon: 'dashboard' },
        children: [
          {
            path: 'face',
            component: () => import('@/views/viid/dataCollection/face/index.vue'),
            name: 'Face',
            meta: { title: '人脸采集', icon: 'user' }
          },
          {
            path: 'person',
            component: () => import('@/views/viid/dataCollection/person/index.vue'),
            name: 'Person',
            meta: { title: '人员采集', icon: 'peoples' }
          },
          {
            path: 'vehicle',
            component: () => import('@/views/viid/dataCollection/vehicle/index.vue'),
            name: 'Vehicle',
            meta: { title: '车辆采集', icon: 'guide' }
          },
          {
            path: 'nonMotorVehicle',
            component: () => import('@/views/viid/dataCollection/nonMotorVehicle/index.vue'),
            name: 'NonMotorVehicle',
            meta: { title: '非机动车采集', icon: 'shopping' }
          }
        ]
      },
      // 二级路由：AI搜索
      {
        path: 'aiSearch',
        component: ParentView,
        redirect: 'noredirect',
        name: 'AiSearch',
        meta: { title: 'AI搜索', icon: 'search' },
        children: [
          {
            path: 'imageSearch',
            component: () => import('@/views/viid/aiSearch/imageSearch/index.vue'),
            name: 'ImageSearch',
            meta: { title: '图片搜索', icon: 'example' }
          },
          {
            path: 'textSearch',
            component: () => import('@/views/viid/aiSearch/textSearch/index.vue'),
            name: 'TextSearch',
            meta: { title: '文本搜索', icon: 'edit' }
          }
        ]
      },
      // 二级路由：轨迹追踪
      {
        path: 'trackTrace',
        component: ParentView,
        redirect: 'noredirect',
        name: 'TrackTrace',
        meta: { title: '轨迹追踪', icon: 'location' },
        children: [
          {
            path: 'faceTrace',
            component: () => import('@/views/viid/trackTrace/faceTrace/index.vue'),
            name: 'FaceTrace',
            meta: { title: '人脸轨迹', icon: 'user' }
          },
          {
            path: 'vehicleTrace',
            component: () => import('@/views/viid/trackTrace/vehicleTrace/index.vue'),
            name: 'VehicleTrace',
            meta: { title: '车辆轨迹', icon: 'truck' }
          }
        ]
      }
    ]
  },
  {
    path: '/user',
    component: Layout,
    hidden: true,
    redirect: 'noredirect',
    children: [
      {
        path: 'profile/:activeTab?',
        component: () => import('@/views/system/user/profile/index'),
        name: 'Profile',
        meta: { title: '个人中心', icon: 'user' }
      }
    ]
  },
  // 数据可视化大屏 v1
  {
    path: '/datav',
    component: () => import('@/views/datav/v1/index.vue'),
    hidden: true,
    name: 'DatavV1',
    meta: { title: '监控驾驶舱', icon: 'monitor' }
  }, 
  // 数据可视化大屏 v2
  {
    path: '/datav2',
    component: () => import('@/views/datav/v2/index.vue'),
    hidden: true,
    name: 'DatavV2',
    meta: { title: '监控驾驶舱2', icon: 'monitor' }
  },
  // 地图大屏
  {
    path: '/mapscreen',
    component: () => import('@/views/datav/mapscreen/index.vue'),
    name: 'DatavMapscreen',
    meta: { title: '地图大屏', anonymous: true }
  }
]

// 动态路由，基于用户权限动态去加载
export const dynamicRoutes = [
  {
    path: '/system/user-auth',
    component: Layout,
    hidden: true,
    permissions: ['system:user:edit'],
    children: [
      {
        path: 'role/:userId(\\d+)',
        component: () => import('@/views/system/user/authRole'),
        name: 'AuthRole',
        meta: { title: '分配角色', activeMenu: '/system/user' }
      }
    ]
  },
  {
    path: '/system/role-auth',
    component: Layout,
    hidden: true,
    permissions: ['system:role:edit'],
    children: [
      {
        path: 'user/:roleId(\\d+)',
        component: () => import('@/views/system/role/authUser'),
        name: 'AuthUser',
        meta: { title: '分配用户', activeMenu: '/system/role' }
      }
    ]
  },
  {
    path: '/system/dict-data',
    component: Layout,
    hidden: true,
    permissions: ['system:dict:list'],
    children: [
      {
        path: 'index/:dictId(\\d+)',
        component: () => import('@/views/system/dict/data'),
        name: 'Data',
        meta: { title: '字典数据', activeMenu: '/system/dict' }
      }
    ]
  },
  {
    path: '/monitor/job-log',
    component: Layout,
    hidden: true,
    permissions: ['monitor:job:list'],
    children: [
      {
        path: 'index/:jobId(\\d+)',
        component: () => import('@/views/monitor/job/log'),
        name: 'JobLog',
        meta: { title: '调度日志', activeMenu: '/monitor/job' }
      }
    ]
  },
  {
    path: '/tool/gen-edit',
    component: Layout,
    hidden: true,
    permissions: ['tool:gen:edit'],
    children: [
      {
        path: 'index/:tableId(\\d+)',
        component: () => import('@/views/tool/gen/editTable'),
        name: 'GenEdit',
        meta: { title: '修改生成配置', activeMenu: '/tool/gen' }
      }
    ]
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes: constantRoutes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    }
    return { top: 0 }
  },
})

export default router
