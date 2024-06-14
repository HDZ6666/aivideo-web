import Vue from "vue";
import VueRouter from "vue-router";
import Layout from "../layout/index.vue";

// import console from "../components/console.vue";
// import deviceList from "../components/DeviceList.vue";
// import channelList from "../components/channelList.vue";
// import gbRecordDetail from "../components/GBRecordDetail.vue";
// import pushVideoList from "../components/PushVideoList.vue";
// import streamProxyList from "../components/StreamProxyList.vue";
// import map from "../components/map.vue";
import login from "../components/Login.vue";
// import parentPlatformList from "../components/ParentPlatformList.vue";
// import cloudRecord from "../components/CloudRecord.vue";
// import cloudRecordDetail from "../components/CloudRecordDetail.vue";
// import mediaServerManger from "../components/MediaServerManger.vue";
// import web from "../components/setting/Web.vue";
// import sip from "../components/setting/Sip.vue";
// import media from "../components/setting/Media.vue";
// import live from "../components/live.vue";
// import deviceTree from "../components/common/DeviceTree.vue";
// import userManager from "../components/UserManager.vue";
// import alarmList from "../components/alarmList.vue";
// import fence from "../components/fence.vue";

// import wasmPlayer from "../components/common/jessibuca.vue";
// import rtcPlayer from "../components/dialog/rtcPlayer.vue";
// import videoCockpit from "../components/videoCockpit.vue";
// import deviceGroup from "../components/DeviceGroup.vue";

const originalPush = VueRouter.prototype.push;
VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err);
};

Vue.use(VueRouter);

export default new VueRouter({
  mode: "hash",
  routes: [
    {
      path: "/",
      name: "home",
      component: Layout,
      redirect: "/console",
      children: [
        {
          path: "/console",
          component: () => import("../components/console.vue") // console
        },
        {
          path: "/live",
          component: () => import("../components/live.vue") // live
        },
        {
          path: "/deviceList",
          component: () => import("../components/DeviceList.vue") // deviceList
        },
        {
          path: "/pushVideoList",
          component: () => import("../components/PushVideoList.vue") // pushVideoList
        },
        {
          path: "/streamProxyList",
          component: () => import("../components/StreamProxyList.vue") // streamProxyList
        },
        {
          path: "/channelList/:deviceId/:parentChannelId/",
          name: "channelList",
          component: () => import("../components/channelList.vue") // channelList
        },
        {
          path: "/gbRecordDetail/:deviceId/:channelId/",
          name: "gbRecordDetail",
          component: () => import("../components/GBRecordDetail.vue") // gbRecordDetail
        },
        {
          path: "/parentPlatformList/:count/:page",
          name: "parentPlatformList",
          component: () => import("../components/ParentPlatformList.vue") // parentPlatformList
        },
        {
          path: "/map/:deviceId/:parentChannelId/:count/:page",
          name: "map",
          component: () => import("../components/map.vue") // map
        },
        {
          path: "/cloudRecord",
          name: "cloudRecord",
          component: () => import("../components/CloudRecord.vue") // cloudRecord
        },
        {
          path: "/cloudRecordDetail/:app/:stream",
          name: "cloudRecordDetail",
          component: () => import("../components/CloudRecordDetail.vue") // cloudRecordDetail
        },
        {
          path: "/cloudRecordDetail/:mediaServerId/:app/:stream",
          name: "cloudRecordDetail",
          component: () => import("../components/CloudRecordDetail.vue") // cloudRecordDetail
        },
        {
          path: "/mediaServerManger",
          name: "mediaServerManger",
          component: () => import("../components/MediaServerManger.vue") // mediaServerManger
        },
        {
          path: "/setting/web",
          name: "web",
          component: () => import("../components/setting/Web.vue") // web
        },
        {
          path: "/setting/sip",
          name: "sip",
          component: () => import("../components/setting/Sip.vue") // sip
        },
        {
          path: "/setting/media",
          name: "media",
          component: () => import("../components/setting/Media.vue") // media
        },
        {
          path: "/map",
          name: "map",
          component: () => import("../components/map.vue") // map
        },
        {
          path: "/userManager",
          name: "userManager",
          component: () => import("../components/UserManager.vue") // userManager
        },
        {
          path: "/roleManager",
          name: "roleManager",
          component: () => import("../components/RoleManager.vue") // roleManager
        },
        {
          path: "/alarmList",
          name: "alarmList",
          component: () => import("../components/alarmList.vue") // alarmList
        },
        {
          path: "/fence",
          name: "fence",
          component: () => import("../components/fence.vue") // fence
        },
        {
          path: "/deviceGroup",
          name: "deviceGroup",
          component: () => import("../components/DeviceGroup.vue") // deviceGroup
        }
      ]
    },
    {
      path: "/login",
      name: "登录",
      component: login
    },
    {
      path: "/test",
      name: "deviceTree",
      component: () => import("../components/common/DeviceTree.vue") // deviceTree
    },
    {
      path: "/play/wasm/:url",
      name: "wasmPlayer",
      component: () => import("../components/common/jessibuca.vue") // wasmPlayer
    },
    {
      path: "/play/rtc/:url",
      name: "rtcPlayer",
      component: () => import("../components/dialog/rtcPlayer.vue") // rtcPlayer
    },

    {
      path: "/videoCockpit",
      name: "驾驶舱",
      component: () => import("../components/videoCockpit.vue") // videoCockpit
    }
  ]
});
