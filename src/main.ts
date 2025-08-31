import { createSSRApp } from 'vue'
import App from './App.vue'
import { routeInterceptor } from './router/interceptor'

import store from './store'
import '@/style/index.scss'
import 'virtual:uno.css'

export function createApp() {
  const app = createSSRApp(App)
  app.use(store)
  // 使用扩展的路由拦截器 - 包含导航拦截和认证混入
  app.use(routeInterceptor)

  return {
    app,
  }
}
