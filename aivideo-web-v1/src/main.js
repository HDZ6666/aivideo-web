import store from '@/store/index';
import { handleTree, parseTime, resetForm } from "@/utils/index";
import dataV from "@jiaminghi/data-view";
import axios from "axios";
import ElementUI, { Message, Notification } from "element-ui";
import "element-ui/lib/theme-chalk/index.css";
import VCharts from "v-charts";
import Vue from "vue";
import VueCookies from "vue-cookies";
import App from "./App.vue";
import router from "./router/index.js";

import Fingerprint2 from "fingerprintjs2";
import VueClipboard from "vue-clipboard2";
import VueClipboards from "vue-clipboards";
import Contextmenu from "vue-contextmenujs";
import userService from "./components/service/UserService";
import plugins from './plugins'
Vue.config.productionTip = false;
Vue._watchers = Vue.prototype._watchers = [];

// 生成唯一ID
Fingerprint2.get(function(components) {
  const values = components.map(function(component, index) {
    if (index === 0) {
      //把微信浏览器里UA的wifi或4G等网络替换成空,不然切换网络会ID不一样
      return component.value.replace(/\bNetType\/\w+\b/, "");
    }
    return component.value;
  });
  //console.log(values)  //使用的浏览器信息npm
  // 生成最终id
  let port = window.location.port;
  const fingerPrint = Fingerprint2.x64hash128(values.join(port), 31);
  Vue.prototype.$browserId = fingerPrint;
  console.log("浏览器 ID: " + fingerPrint);
});

Vue.use(VueClipboard);
Vue.use(ElementUI);
Vue.use(VueCookies);
Vue.use(VueClipboards);
Vue.prototype.$notify = Notification;
Vue.use(Contextmenu);
Vue.use(VCharts);
Vue.use(dataV);
Vue.use(plugins)
Vue.prototype.handleTree = handleTree
Vue.prototype.parseTime = parseTime
Vue.prototype.resetForm = resetForm
axios.defaults.baseURL =
  process.env.NODE_ENV === "development"
    ? process.env.BASE_API
    : window.baseUrl
    ? window.baseUrl
    : "";
axios.defaults.withCredentials = true;
// api 返回401自动回登陆页面
axios.interceptors.response.use(
  response => {
    // 对响应数据做点什么
    let token = response.headers["access-token"];
    if (token) {
      userService.setToken(token);
    }
    return response;
  },
  error => {
    if (axios.isCancel(error)) {
      return Promise.reject(error);
    }
    // Message.error(error.message || "请求错误");
    console.log(error);
    // 对响应错误做点什么
    if (error.response.status === 401 || error.response.status === 400) {
      console.log("登录失效");
      router.push("/login");
    }
    return Promise.reject(error);
  }
);
axios.interceptors.request.use(
  config => {
    if (userService.getToken() != null && config.url !== "/api/user/login") {
      config.headers["access-token"] = `${userService.getToken()}`;
    }
    // console.log(config);
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

router.beforeEach((to, from, next) => {
  if (to.path === "/login") {
    next();
    return;
  }
  // debugger
  // store.dispatch('GetInfo').then(() => {
  //   console.log(store.dispatch('GetInfo'))
  //   store.dispatch('GenerateRoutes').then(accessRoutes => {
  //     // 根据roles权限生成可访问的路由表
  //     router.addRoutes(accessRoutes) // 动态添加可访问路由表
  //     next({ ...to, replace: true }) // hack方法 确保addRoutes已完成
  //   })
  // }).catch(err => {
  //     // store.dispatch('LogOut').then(() => {
  //     //   Message.error(err)
  //     //   next({ path: '/' })
  //     // })
  //   })
  // debugger
  if (store.getters.roles.length === 0) {
    // 判断当前用户是否已拉取完user_info信息
    store.dispatch('GetInfo').then(() => {
      store.dispatch('GenerateRoutes').then(accessRoutes => {
        // 根据roles权限生成可访问的路由表
        router.addRoutes(accessRoutes) // 动态添加可访问路由表
        console.log(router)
        // debugger
        const side = ['用户管理','角色管理','菜单管理','日志管理'];
        const sideList = []; // 用户管理权限管理右侧菜单栏数据
        accessRoutes&&accessRoutes.map((item)=>{
          if(item.meta&&item.meta.title=="系统管理"){
            item.children&&item.children.map((childrenItem)=>{
              if(childrenItem.meta&&side.find((i)=>i==childrenItem.meta.title)){
                sideList.push({
                  name:childrenItem.meta.title,
                  url:`${item.path}/${childrenItem.path}`
                })
              }
            })
          }
        })
        // debugger
        store.commit('SET_SIDELIST', sideList);
        console.log(router.getRoutes())

        next({ ...to, replace: true }) // hack方法 确保addRoutes已完成
      })
    }).catch(err => {
        // store.dispatch('LogOut').then(() => {
        //   Message.error(err)
        //   next({ path: '/' })
        // })
      })
  }
  if (userService.getToken() == null) {

    if (to.path === "/videoCockpitV1" && to.query && to.query.token) {
      axios({
        method: "post",
        url: "/api/user/oneClickLogin",
        data: {
          authorization: decodeURIComponent(to.query.token)
        }
      })
        .then(function(res) {
          if (res.data.code === 0) {
            userService.setToken(res.data.data.accessToken);
            userService.setUser(res.data.data);
            //登录成功后
            next();
          } else {
            Message.error("登录失败");
            next("/login");
          }
        })
        .catch(function(error) {
          Message.error(error.response.data.msg);
          next("/login");
        });
    } else {
      next("/login");
    }
  } else {
    next();
  }
});

window.addEventListener("unauthorized", function(_) {
  console.log("receive unauthorized");
  router.push("/login");
},false)

Vue.prototype.$axios = axios;
Vue.prototype.$cookies.config(60 * 30);

new Vue({
  store,
  router: router,
  render: h => h(App)
}).$mount("#app");
