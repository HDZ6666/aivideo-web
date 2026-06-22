import type { IUserInfo } from '@/api/auth'
import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

/**
 * 用户状态管理
 */
export const useUserStore = defineStore(
  'user',
  () => {
    // 登录token
    const token = ref<string>('')
    // 用户信息
    const userInfo = ref<IUserInfo | null>()
    // 用户角色
    const roles = ref<string[]>([])
    // 用户权限
    const permissions = ref<string[]>([])
    // 是否已登录
    const isLoggedIn = computed(() =>
      !!token.value,
    )
    // 用户名
    const userName = computed(() => userInfo.value?.username || '')
    // 用户ID
    const userId = computed(() => userInfo.value?.id || '')
    // 用户头像
    const avatar = computed(() => '/static/images/default-avatar.png')

    /**
     * 设置token
     */
    const setTokenValue = (newToken: string) => {
      token.value = newToken
      // 移除手动存储调用，Pinia persist 会自动处理持久化
    }

    /**
     * 设置用户信息
     */
    const setUserInfo = (user: IUserInfo) => {
      userInfo.value = user
    }

    /**
     * 设置用户角色
     */
    const setRoles = (newRoles: string[]) => {
      roles.value = newRoles
    }

    /**
     * 设置用户权限
     */
    const setPermissions = (newPermissions: string[]) => {
      permissions.value = newPermissions
    }

    /**
     * 清除用户store状态
     */
    const clearUserStore = () => {
      token.value = ''
      userInfo.value = null
      roles.value = []
      permissions.value = []
    }

    /**
     * 检查用户权限
     */
    const hasPermission = (permission: string): boolean => {
      return permissions.value.includes('*:*:*') || permissions.value.includes(permission)
    }

    /**
     * 检查用户角色
     */
    const hasRole = (role: string): boolean => {
      return roles.value.includes(role)
    }

    return {
      // 状态
      token,
      userInfo,
      roles,
      permissions,

      // 计算属性
      isLoggedIn,
      userName,
      userId,
      avatar,

      // 方法
      setTokenValue,
      setUserInfo,
      setRoles,
      setPermissions,
      clearUserStore,
      hasPermission,
      hasRole,
    }
  },
  {
    persist: true,
    // persist: {
    //   key: 'user-store',
    //   storage: {
    //     getItem: uni.getStorageSync,
    //     setItem: uni.setStorageSync,
    //   },
    //   // 只持久化必要的状态
    //   paths: ['token'],
    // },
  },
)
