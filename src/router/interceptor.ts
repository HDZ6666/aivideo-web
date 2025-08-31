import type { App } from 'vue'
import { useUserStore } from '@/store'
import { getLastPage } from '@/utils'
// import { isLoggedIn } from '@/utils/auth'

// 登录页面路径
const loginRoute = import.meta.env.VITE_LOGIN_URL

// 白名单 - 不需要登录的页面
const whiteList = [
  '/pages/login/index',
]

function isLogined() {
  const userStore = useUserStore()
  return userStore.isLoggedIn
}

/**
 * 检查页面是否需要登录验证
 */
function checkPageAuth(path: string): boolean {
  // 检查是否在白名单中
  if (whiteList.includes(path)) {
    return true
  }

  // 检查登录状态
  if (isLogined()) {
    return true
  }

  return false
}

// 白名单登录拦截器 - （只有白名单中的页面不需要登录，其余页面都需要登录）
const navigateToInterceptor = {
  // 注意，这里的url是 '/' 开头的，如 '/pages/index/index'，跟 'pages.json' 里面的 path 不同
  // 增加对相对路径的处理，BY 网友 @ideal
  invoke({ url }: { url: string }) {
    console.log('路由拦截', url) // /pages/route-interceptor/index?name=feige&age=30
    let path = url.split('?')[0]

    // 处理相对路径
    if (!path.startsWith('/')) {
      const currentPath = getLastPage().route
      const normalizedCurrentPath = currentPath.startsWith('/') ? currentPath : `/${currentPath}`
      const baseDir = normalizedCurrentPath.substring(0, normalizedCurrentPath.lastIndexOf('/'))
      path = `${baseDir}/${path}`
    }

    // 使用统一的认证检查函数
    if (checkPageAuth(path)) {
      return true
    }

    // 未登录，跳转到登录页
    const redirectRoute = `${loginRoute}?redirect=${encodeURIComponent(url)}`
    uni.navigateTo({ url: redirectRoute })
    return false
  },
}

/**
 * 页面级认证检查 - 处理直接URL访问和页面刷新
 */
function pageAuthCheck() {
  const pages = getCurrentPages()
  if (pages.length === 0)
    return

  const currentRoute = `/${pages[pages.length - 1].route}`

  if (!checkPageAuth(currentRoute)) {
    console.log('用户未登录，重定向到登录页:', currentRoute)
    uni.reLaunch({
      url: `${loginRoute}?redirect=${encodeURIComponent(currentRoute)}`,
    })
  }
}

/**
 * 路由拦截器插件 - 包含导航拦截和页面级认证
 */
export const routeInterceptor = {
  install(app?: App) {
    // 安装导航拦截器
    uni.addInterceptor('navigateTo', navigateToInterceptor)
    uni.addInterceptor('reLaunch', navigateToInterceptor)
    uni.addInterceptor('redirectTo', navigateToInterceptor)
    uni.addInterceptor('switchTab', navigateToInterceptor)

    // 如果传入了 app 实例，则安装全局认证混入
    if (app) {
      app.mixin({
        onLoad: pageAuthCheck,
      })
    }
  },
}
