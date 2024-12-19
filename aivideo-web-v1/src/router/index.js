import Vue from "vue";
import VueRouter from "vue-router";
import Layout from "../layout/index.vue";

const originalPush = VueRouter.prototype.push;
VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch((err) => err);
};
// 公共路由
export const constantRoutes = [
  {
    path: "/login",
    name: "登录",
    component: () => import("../components/Login.vue"),
  },
  {
    path: "/",
    name: "home",
    component: Layout,
    redirect: "/live",
    children:[{
      path: "/patrol",
      name: "patrol",
      component: () => import("../components/patrol.vue"), // 巡逻
      children: [
        {
          path: "",
          name: "patrolManager",
          component: () => import("../components/patrolManager.vue"), // 巡逻任务
        },
        {
          path: "/patrolReport",
          name: "patrolReport",
          component: () => import("../components/patrolReport.vue"), // 巡逻报告
        },
      ],
    }]
  },
  {
    path: "/videoCockpitV1",
    name: "驾驶舱",
    component: () => import("../components/videoCockpit.vue"), // 大屏v1
  },
  {
    path: "/channelList/:deviceId/:parentChannelId/",
    name: "channelList",
    component: () => import("../components/channelList.vue") // channelList
  },
  {
    path: "/gbRecordDetail/:deviceId/:channelId/",
    name: "gbRecordDetail",
    component: () => import("../components/GBRecordDetail.vue"), // gbRecordDetail
  },
  {
    path: "/parentPlatformList/:count/:page",
    name: "parentPlatformList",
    component: () => import("../components/ParentPlatformList.vue"), // parentPlatformList
  },
  {
    path: "/map/:deviceId/:parentChannelId/:count/:page",
    name: "map",
    component: () => import("../components/map.vue"), // map
  },
  {
    path: "/cloudRecordDetail/:app/:stream",
    name: "cloudRecordDetail",
    component: () => import("../components/CloudRecordDetail.vue"), // cloudRecordDetail
  },
  {
    path: "/cloudRecordDetail/:mediaServerId/:app/:stream",
    name: "cloudRecordDetail",
    component: () => import("../components/CloudRecordDetail.vue"), // cloudRecordDetail
  },
  {
    path: "/play/wasm/:url",
    name: "wasmPlayer",
    component: () => import("../components/common/jessibuca.vue"), // wasmPlayer
  },
  {
    path: "/play/rtc/:url",
    name: "rtcPlayer",
    component: () => import("../components/dialog/rtcPlayer.vue"), // rtcPlayer
  },
];
// 动态路由
export const dynamicRoutes = [
  {
    path: "/",
    name: "home",
    component: Layout,
    redirect: "/live",
    children: [
      {
        path: "/console",
        component: () => import("../components/console.vue"), // console
      },
      {
        path: "/live",
        component: () => import("../components/live.vue"), // live
        permissions: ["*:*:*"],
      },
      {
        path: "/deviceList",
        component: () => import("../components/DeviceList.vue"), // deviceList
      },
      {
        path: "/pushVideoList",
        component: () => import("../components/PushVideoList.vue"), // pushVideoList
      },
      {
        path: "/streamProxyList",
        component: () => import("../components/StreamProxyList.vue"), // streamProxyList
      },

      {
        path: "/cloudRecord",
        name: "cloudRecord",
        component: () => import("../components/CloudRecord.vue"), // cloudRecord
      },

      {
        path: "/mediaServerManger",
        name: "mediaServerManger",
        component: () => import("../components/MediaServerManger.vue"), // mediaServerManger
      },
      {
        path: "/setting/web",
        name: "web",
        component: () => import("../components/setting/Web.vue"), // web
      },
      {
        path: "/setting/sip",
        name: "sip",
        component: () => import("../components/setting/Sip.vue"), // sip
      },
      {
        path: "/setting/media",
        name: "media",
        component: () => import("../components/setting/Media.vue"), // media
      },
      {
        path: "/map",
        name: "map",
        component: () => import("../components/map.vue"), // map
      },
      {
        path: "/userManager",
        name: "userManager",
        component: () => import("../components/UserManager.vue"), // userManager
      },
      {
        path: "/roleManager",
        name: "roleManager",
        component: () => import("../components/roleManager1.vue"), // roleManager
      },
      {
        path: "/menuManager",
        name: "menuManager",
        component: () => import("../components/menuManager.vue"), // roleManager
      },
      {
        path: "/logManager",
        name: "logManager",
        component: () => import("../components/logManager.vue"), // roleManager
      },
      {
        path: "/alarmList",
        name: "alarmList",
        component: () => import("../components/alarmList.vue"), // 告警列表
      },
      {
        path: "/fence",
        name: "fence",
        component: () => import("../components/fence.vue"), // 算法配置
      },
      {
        path: "/aiView",
        name: "aiView",
        component: () => import("../components/aiView.vue"), // ai视界
      },
      {
        path: "/deviceGroup",
        name: "deviceGroup",
        component: () => import("../components/DeviceGroup.vue"), // 分组
      },
      {
        path: "/deviceInspection",
        name: "deviceInspection",
        component: () => import("../components/DeviceInspection.vue"), // 巡检
      },
      {
        path: "/patrol",
        name: "patrol",
        component: () => import("../components/patrol.vue"), // 巡逻
        children: [
          {
            path: "",
            name: "patrolManager",
            component: () => import("../components/patrolManager.vue"), // 巡逻任务
          },
          {
            path: "/patrolReport",
            name: "patrolReport",
            component: () => import("../components/patrolReport.vue"), // 巡逻报告
          },
        ],
      },
      {
        path: "/v2/alarm",
        name: "alarmV2",
        component: () => import("../components/v2/alarmV2.vue"), // alarmV2
      },
      {
        path: "/v2/datav",
        name: "datavV2",
        component: () => import("../components/v2/datavV2.vue"), // datavV2
      },
    ],
  },
  {
    path: "/login",
    name: "登录",
    component: () => import("../components/Login.vue"),
  },
  {
    path: "/test",
    name: "deviceTree",
    component: () => import("../components/common/DeviceTree.vue"), // deviceTree
  },

  {
    path: "/videoCockpitV1",
    name: "驾驶舱",
    component: () => import("../components/videoCockpit.vue"), // 大屏v1
  },
  {
    path: "/videoCockpitV2",
    name: "驾驶舱",
    component: () => import("../components/dataV.vue"), // 大屏v2
  },
];
Vue.use(VueRouter);
export default new VueRouter({
  mode: "hash",
  routes: [...constantRoutes],
});
