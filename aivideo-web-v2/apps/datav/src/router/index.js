import { createRouter, createWebHistory, createWebHashHistory } from 'vue-router'
import store from '../store/index'
const routes = [
  {
    path: '/',
    name: 'Index',
    component: () => import('@/views/index.vue'),
    redirect: '/monitor',
    children: [
      {
        path: '/monitor',
        name: 'monitor',
        component: () => import('@/views/monitor.vue'),
        meta:{
          anonymous:true
        }
      }
    ]
  }, {
    path: '/login',
    name: 'login',
    component: () => import('@/views/login.vue'),
    meta:{
      anonymous:true
    }
  }
]

const router = createRouter({
  history: createWebHashHistory(), //createWebHistory(process.env.BASE_URL),
  routes
})


router.beforeEach((to, from, next) => {
  if (to.matched.length == 0) return next({ path: '/404' });
  //2020.06.03增加路由切换时加载提示
  store.dispatch("onLoading", true);
  if ((to.hasOwnProperty('meta') && to.meta.anonymous) || store.getters.isLogin() || to.path == '/login') {
    return next();
  }

  next({ path: '/login', query: { redirect: Math.random() } });
})
router.afterEach((to, from) => {
  store.dispatch("onLoading", false);
})
router.onError((error) => {
  // const targetPath = router.currentRoute.value.matched;
  try {
    console.log(error.message);
    if (process.env.NODE_ENV == 'development') {
      alert(error.message)
    }
    localStorage.setItem("route_error", error.message)
  } catch (e) {

  }
  window.location.href = '/'
});
export default router
