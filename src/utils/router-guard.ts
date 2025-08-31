import { useUserStore } from '@/store/user'

// ==================== 路由守卫配置 ====================

/**
 * 不需要登录的页面路径
 */
const WHITE_LIST = [
  '/pages/login/index',
  '/pages/home/index', // 首页暂时不需要登录
]

/**
 * 需要登录的页面路径模式
 */
const AUTH_REQUIRED_PATTERNS = [
  '/pages/device/',
  '/pages/user/',
  '/pages/settings/',
]

/**
 * 检查路径是否在白名单中
 */
function isInWhiteList(path: string): boolean {
  return WHITE_LIST.includes(path)
}

/**
 * 检查路径是否需要登录
 */
function isAuthRequired(path: string): boolean {
  return AUTH_REQUIRED_PATTERNS.some(pattern => path.startsWith(pattern))
}

/**
 * 路由守卫 - 检查登录状态
 */
export function checkAuth(url: string): boolean {
  const userStore = useUserStore()

  // 如果在白名单中，直接通过
  if (isInWhiteList(url)) {
    return true
  }

  // 如果需要登录但未登录，跳转到登录页
  if (isAuthRequired(url) && !userStore.isLoggedIn) {
    uni.reLaunch({
      url: '/pages/login/index',
    })
    return false
  }

  return true
}

/**
 * 页面跳转前的守卫
 */
export function beforeNavigate(options: any) {
  const { url } = options

  if (!checkAuth(url)) {
    return false
  }

  return true
}

/**
 * 初始化路由守卫
 */
export function initRouterGuard() {
  // 拦截 uni.navigateTo
  const originalNavigateTo = uni.navigateTo
  uni.navigateTo = function (options: any) {
    if (beforeNavigate(options)) {
      return originalNavigateTo.call(this, options)
    }
  }

  // 拦截 uni.redirectTo
  const originalRedirectTo = uni.redirectTo
  uni.redirectTo = function (options: any) {
    if (beforeNavigate(options)) {
      return originalRedirectTo.call(this, options)
    }
  }

  // 拦截 uni.switchTab
  const originalSwitchTab = uni.switchTab
  uni.switchTab = function (options: any) {
    if (beforeNavigate(options)) {
      return originalSwitchTab.call(this, options)
    }
  }

  console.log('路由守卫初始化完成')
}
