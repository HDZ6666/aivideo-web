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
    path: '/visual-library',
    component: Layout,
    redirect: '/visual-library/dashboard',
    name: 'VisualLibrary',
    meta: { title: '视图库中台', icon: 'database', alwaysShow: true },
    children: [
      {
        path: 'dashboard',
        component: () => import('@/views/visual-library/dashboard/index.vue'),
        name: 'VisualLibraryDashboard',
        meta: { title: '运行概览', icon: 'dashboard' }
      },
      {
        path: 'setting',
        component: ParentView,
        redirect: 'noredirect',
        name: 'VisualLibrarySetting',
        meta: { title: '平台配置', icon: 'setting' },
        children: [
          {
            path: 'instance',
            component: () => import('@/views/visual-library/setting/index.vue'),
            name: 'VisualLibrarySettingInstance',
            meta: { title: '当前节点', icon: 'user', settingKey: 'instance' }
          },
          {
            path: 'storage',
            component: () => import('@/views/visual-library/setting/index.vue'),
            name: 'VisualLibrarySettingStorage',
            meta: { title: '存储配置', icon: 'example', settingKey: 'storage' }
          },
          {
            path: 'customizer',
            component: () => import('@/views/visual-library/setting/index.vue'),
            name: 'VisualLibrarySettingCustomizer',
            meta: { title: '行为配置', icon: 'tool', settingKey: 'customizer' }
          }
        ]
      },
      {
        path: 'resource',
        component: ParentView,
        redirect: 'noredirect',
        name: 'VisualLibraryResource',
        meta: { title: '资源管理', icon: 'tree' },
        children: [
          {
            path: 'instance',
            component: () => import('@/views/visual-library/entity/index.vue'),
            name: 'VisualLibraryResourceInstance',
            meta: { title: '视图库', icon: 'monitor', configKey: 'resourceInstance' }
          },
          {
            path: 'device',
            component: () => import('@/views/visual-library/entity/index.vue'),
            name: 'VisualLibraryResourceDevice',
            meta: { title: '设备', icon: 'camera', configKey: 'resourceDevice' }
          },
          {
            path: 'tollgate',
            component: () => import('@/views/visual-library/entity/index.vue'),
            name: 'VisualLibraryResourceTollgate',
            meta: { title: '卡口', icon: 'guide', configKey: 'resourceTollgate' }
          },
          {
            path: 'lane',
            component: () => import('@/views/visual-library/entity/index.vue'),
            name: 'VisualLibraryResourceLane',
            meta: { title: '车道', icon: 'row', configKey: 'resourceLane' }
          },
          {
            path: 'unit',
            component: () => import('@/views/visual-library/entity/index.vue'),
            name: 'VisualLibraryResourceUnit',
            meta: { title: '组织机构', icon: 'peoples', configKey: 'resourceUnit' }
          }
        ]
      },
      {
        path: 'subscribe',
        component: ParentView,
        redirect: 'noredirect',
        name: 'VisualLibrarySubscribe',
        meta: { title: '订阅管理', icon: 'link' },
        children: [
          {
            path: 'down',
            component: () => import('@/views/visual-library/entity/index.vue'),
            name: 'VisualLibrarySubscribeDown',
            meta: { title: '下级订阅', icon: 'download', configKey: 'subscribeDown' }
          },
          {
            path: 'notification-down',
            component: () => import('@/views/visual-library/entity/index.vue'),
            name: 'VisualLibrarySubscribeNotificationDown',
            meta: { title: '下级订阅通知', icon: 'message', configKey: 'subscribeDownNotification' }
          },
          {
            path: 'up',
            component: () => import('@/views/visual-library/entity/index.vue'),
            name: 'VisualLibrarySubscribeUp',
            meta: { title: '上级订阅', icon: 'upload', configKey: 'subscribeUp' }
          },
          {
            path: 'notification-up',
            component: () => import('@/views/visual-library/entity/index.vue'),
            name: 'VisualLibrarySubscribeNotificationUp',
            meta: { title: '上级订阅通知', icon: 'message', configKey: 'subscribeUpNotification' }
          }
        ]
      },
      {
        path: 'disposition',
        component: ParentView,
        redirect: 'noredirect',
        name: 'VisualLibraryDisposition',
        meta: { title: '布控管理', icon: 'eye-open' },
        children: [
          {
            path: 'down',
            component: () => import('@/views/visual-library/entity/index.vue'),
            name: 'VisualLibraryDispositionDown',
            meta: { title: '下级布控', icon: 'download', configKey: 'dispositionDown' }
          },
          {
            path: 'notification-down',
            component: () => import('@/views/visual-library/entity/index.vue'),
            name: 'VisualLibraryDispositionNotificationDown',
            meta: { title: '下级布控预警', icon: 'message', configKey: 'dispositionDownNotification' }
          }
        ]
      },
      {
        path: 'data',
        component: ParentView,
        redirect: 'noredirect',
        name: 'VisualLibraryData',
        meta: { title: '采集数据', icon: 'chart' },
        children: [
          {
            path: 'face',
            component: () => import('@/views/visual-library/entity/index.vue'),
            name: 'VisualLibraryDataFace',
            meta: { title: '人脸', icon: 'user', configKey: 'dataFace' }
          },
          {
            path: 'person',
            component: () => import('@/views/visual-library/entity/index.vue'),
            name: 'VisualLibraryDataPerson',
            meta: { title: '人员', icon: 'peoples', configKey: 'dataPerson' }
          },
          {
            path: 'motorvehicle',
            component: () => import('@/views/visual-library/entity/index.vue'),
            name: 'VisualLibraryDataMotorVehicle',
            meta: { title: '车辆', icon: 'truck', configKey: 'dataMotorVehicle' }
          },
          {
            path: 'nonmotorvehicle',
            component: () => import('@/views/visual-library/entity/index.vue'),
            name: 'VisualLibraryDataNonMotorVehicle',
            meta: { title: '非机动车', icon: 'shopping', configKey: 'dataNonMotorVehicle' }
          },
          {
            path: 'scene',
            component: () => import('@/views/visual-library/entity/index.vue'),
            name: 'VisualLibraryDataScene',
            meta: { title: '物品', icon: 'box', configKey: 'dataScene' }
          },
          {
            path: 'thing',
            component: () => import('@/views/visual-library/entity/index.vue'),
            name: 'VisualLibraryDataThing',
            meta: { title: '场景', icon: 'location', configKey: 'dataThing' }
          },
          {
            path: 'image',
            component: () => import('@/views/visual-library/entity/index.vue'),
            name: 'VisualLibraryDataImage',
            meta: { title: '图像', icon: 'image', configKey: 'dataImage' }
          },
          {
            path: 'videoslice',
            component: () => import('@/views/visual-library/entity/index.vue'),
            name: 'VisualLibraryDataVideoSlice',
            meta: { title: '视频片段', icon: 'video', configKey: 'dataVideoSlice' }
          }
        ]
      },
      {
        path: 'manual',
        component: ParentView,
        redirect: 'noredirect',
        name: 'VisualLibraryManual',
        meta: { title: '人工采集', icon: 'edit' },
        children: [
          {
            path: 'face',
            component: () => import('@/views/visual-library/entity/index.vue'),
            name: 'VisualLibraryManualFace',
            meta: { title: '人脸', icon: 'user', configKey: 'manualFace' }
          },
          {
            path: 'person',
            component: () => import('@/views/visual-library/entity/index.vue'),
            name: 'VisualLibraryManualPerson',
            meta: { title: '人员', icon: 'peoples', configKey: 'manualPerson' }
          },
          {
            path: 'motorvehicle',
            component: () => import('@/views/visual-library/entity/index.vue'),
            name: 'VisualLibraryManualMotorVehicle',
            meta: { title: '车辆', icon: 'truck', configKey: 'manualMotorVehicle' }
          },
          {
            path: 'nonmotorvehicle',
            component: () => import('@/views/visual-library/entity/index.vue'),
            name: 'VisualLibraryManualNonMotorVehicle',
            meta: { title: '非机动车', icon: 'shopping', configKey: 'manualNonMotorVehicle' }
          },
          {
            path: 'image',
            component: () => import('@/views/visual-library/entity/index.vue'),
            name: 'VisualLibraryManualImage',
            meta: { title: '图像', icon: 'image', configKey: 'manualImage' }
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
  {
    path: '/video',
    component: Layout,
    redirect: '/video/live',
    name: 'Video',
    meta: { title: '视频业务', icon: 'monitor' },
    children: [
      {
        path: 'live',
        component: () => import('@/views/video/live/index.vue'),
        name: 'VideoLive',
        meta: { title: '实时视频', icon: 'monitor' }
      },
      {
        path: 'live2',
        component: () => import('@/views/video/live2/index.vue'),
        name: 'VideoLive2',
        meta: { title: '实时视频演示', icon: 'monitor' }
      },
      {
        path: 'device-list',
        component: () => import('@/views/video/device-list/index.vue'),
        name: 'VideoDeviceList',
        meta: { title: '国标列表', icon: 'list' }
      },
      {
        path: 'device-group',
        component: () => import('@/views/video/device-group/index.vue'),
        name: 'VideoDeviceGroup',
        meta: { title: '设备分组', icon: 'tree' }
      },
      {
        path: 'channel-list',
        component: () => import('@/views/video/channel-list/index.vue'),
        name: 'VideoChannelList',
        meta: { title: '通道列表', icon: 'list' }
      },
      {
        path: 'cloud-record',
        component: () => import('@/views/video/cloud-record/index.vue'),
        name: 'VideoCloudRecord',
        meta: { title: '云端录像', icon: 'video' }
      },
      {
        path: 'cloud-record-detail',
        component: () => import('@/views/video/cloud-record-detail/index.vue'),
        name: 'VideoCloudRecordDetail',
        hidden: true,
        meta: { title: '云端录像详情', activeMenu: '/video/cloud-record' }
      },
      {
        path: 'gb-record-detail',
        component: () => import('@/views/video/gb-record-detail/index.vue'),
        name: 'VideoGbRecordDetail',
        hidden: true,
        meta: { title: '国标录像', activeMenu: '/video/device-list' }
      },
      {
        path: 'push-video-list',
        component: () => import('@/views/video/push-video-list/index.vue'),
        name: 'VideoPushVideoList',
        meta: { title: '推流列表', icon: 'upload' }
      },
      {
        path: 'stream-proxy-list',
        component: () => import('@/views/video/stream-proxy-list/index.vue'),
        name: 'VideoStreamProxyList',
        meta: { title: '拉流代理', icon: 'link' }
      },
      {
        path: 'media-server-manager',
        component: () => import('@/views/video/media-server-manager/index.vue'),
        name: 'VideoMediaServerManager',
        meta: { title: '媒体节点', icon: 'server' }
      },
      {
        path: 'console',
        component: () => import('@/views/video/console/index.vue'),
        name: 'VideoConsole',
        meta: { title: '控制台', icon: 'monitor' }
      },
      {
        path: 'parent-platform-list',
        component: () => import('@/views/video/parent-platform-list/index.vue'),
        name: 'VideoParentPlatformList',
        meta: { title: '上级平台', icon: 'tree' }
      },
      {
        path: 'map',
        component: () => import('@/views/video/map/index.vue'),
        name: 'VideoMap',
        meta: { title: '电子地图', icon: 'location' }
      },
      {
        path: 'patrol-manager',
        component: () => import('@/views/video/patrol-manager/index.vue'),
        name: 'VideoPatrolManager',
        meta: { title: '巡检管理', icon: 'time' }
      },
      {
        path: 'patrol-report',
        component: () => import('@/views/video/patrol-report/index.vue'),
        name: 'VideoPatrolReport',
        meta: { title: '巡检报告', icon: 'documentation' }
      },
      {
        path: 'device-inspection',
        component: () => import('@/views/video/device-inspection/index.vue'),
        name: 'VideoDeviceInspection',
        meta: { title: '设备巡检', icon: 'view' }
      },
      {
        path: 'alarm-list',
        component: () => import('@/views/video/alarm-list/index.vue'),
        name: 'VideoAlarmList',
        meta: { title: '告警列表', icon: 'message' }
      }
    ]
  },
  {
    path: '/ai',
    component: Layout,
    redirect: '/ai/detect-center',
    name: 'Ai',
    meta: { title: 'AI业务', icon: 'eye-open' },
    children: [
      {
        path: 'detect-center',
        component: () => import('@/views/ai/detect-center/index.vue'),
        name: 'AiDetectCenter',
        meta: { title: 'AI检测中台', icon: 'monitor' }
      },
      {
        path: 'setting',
        component: () => import('@/views/ai/setting/index.vue'),
        name: 'AiSetting',
        meta: { title: '算法配置', icon: 'tool' }
      },
      {
        path: 'category',
        component: () => import('@/views/ai/category/index.vue'),
        name: 'AiCategory',
        meta: { title: '算法库', icon: 'list' }
      },
      {
        path: 'view',
        component: () => import('@/views/ai/alarm/index.vue'),
        name: 'AiView',
        meta: { title: 'AI视界', icon: 'eye-open' }
      },
      {
        path: 'image-search',
        component: () => import('@/views/ai/image-search/index.vue'),
        name: 'AiImageSearch',
        meta: { title: 'AI图片搜索', icon: 'search' }
      },
      {
        path: 'face-track',
        component: () => import('@/views/ai/face-track/index.vue'),
        name: 'AiFaceTrack',
        meta: { title: '人脸轨迹', icon: 'guide' }
      },
      {
        path: 'face-track-map',
        component: () => import('@/views/ai/face-track-map/index.vue'),
        name: 'AiFaceTrackMap',
        meta: { title: '平面轨迹', icon: 'map' }
      },
      {
        path: 'plan-map',
        component: () => import('@/views/ai/plan-map/index.vue'),
        name: 'AiPlanMap',
        meta: { title: '平面图标注', icon: 'location' }
      },
      {
        path: 'plan-map/:id',
        component: () => import('@/views/ai/plan-map/Detail.vue'),
        name: 'AiPlanMapDetail',
        hidden: true,
        meta: { title: '平面图详情', activeMenu: '/ai/plan-map' }
      },
      {
        path: 'whitelist',
        component: () => import('@/views/ai/whitelist/index.vue'),
        name: 'AiWhitelist',
        meta: { title: '白名单配置', icon: 'peoples' }
      },
      {
        path: 'whitelist/:id',
        component: () => import('@/views/ai/whitelist/Detail.vue'),
        name: 'AiWhitelistDetail',
        hidden: true,
        meta: { title: '白名单详情', activeMenu: '/ai/whitelist' }
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
