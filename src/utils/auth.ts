import type { IUserInfo } from '@/api/auth'
import md5 from 'js-md5'

// ==================== 常量定义 ====================

const TOKEN_KEY = 'aivideo-token'
const USER_KEY = 'aivideo-user'

// ==================== Token 管理 ====================

/**
 * 获取登录token
 */
export function getToken(): string | null {
  return uni.getStorageSync(TOKEN_KEY) || null
}

/**
 * 设置登录token
 * @param token 登录token
 */
export function setToken(token: string): void {
  uni.setStorageSync(TOKEN_KEY, token)
}

/**
 * 移除登录token
 */
export function removeToken(): void {
  uni.removeStorageSync(TOKEN_KEY)
}

// ==================== 用户信息管理 ====================

/**
 * 获取用户信息
 */
export function getUserData(): IUserInfo | null {
  try {
    const userData = uni.getStorageSync(USER_KEY)
    return userData ? JSON.parse(userData) : null
  }
  catch (error) {
    console.error('获取用户信息失败:', error)
    return null
  }
}

/**
 * 设置用户信息
 * @param user 用户信息
 */
export function setUserData(user: IUserInfo): void {
  try {
    uni.setStorageSync(USER_KEY, JSON.stringify(user))
  }
  catch (error) {
    console.error('保存用户信息失败:', error)
  }
}

/**
 * 移除用户信息
 */
export function removeUserData(): void {
  uni.removeStorageSync(USER_KEY)
}

// ==================== 综合管理 ====================

/**
 * 清理所有用户相关信息
 */
export function clearUserInfo(): void {
  removeToken()
  removeUserData()
}

/**
 * 检查是否已登录
 */
export function isLoggedIn(): boolean {
  const token = getToken()
  return !!token
}

/**
 * 密码MD5加密
 * @param password 原始密码
 */
export function encryptPassword(password: string): string {
  // 使用MD5加密密码
  return md5(password)
}

/**
 * 获取用户权限
 */
export function getUserPermissions(): string[] {
  const user = getUserData()
  return user?.permissions || []
}

/**
 * 获取用户角色
 */
export function getUserRoles(): string[] {
  const user = getUserData()
  return user?.roles || []
}

/**
 * 检查用户是否有指定权限
 * @param permission 权限标识
 */
export function hasPermission(permission: string): boolean {
  const permissions = getUserPermissions()
  return permissions.includes('*:*:*') || permissions.includes(permission)
}

/**
 * 检查用户是否有指定角色
 * @param role 角色标识
 */
export function hasRole(role: string): boolean {
  const roles = getUserRoles()
  return roles.includes(role)
}
