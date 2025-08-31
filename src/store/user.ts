import type { ILoginParams, IUserInfo } from '@/api/auth'
import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { getUserInfo, login, logout } from '@/api/auth'
import { clearUserInfo, encryptPassword, getToken, getUserData, setToken } from '@/utils/auth'

/**
 * 用户状态管理
 */
export const useUserStore = defineStore(
  'user',
  () => {
    // 登录token
    const token = ref<string>(getToken() || '')
    // 用户信息
    const userInfo = ref<IUserInfo | null>(getUserData())
    // 用户角色
    const roles = ref<string[]>([])
    // 用户权限
    const permissions = ref<string[]>([])
    // 登录状态
    const isLoading = ref(false)
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
      setToken(newToken)
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
     * 获取用户信息
     */
    const getUserInfoData = async () => {
      try {
        const response = await getUserInfo()
        const { user, roles: userRoles, permissions: userPermissions } = response

        // 设置用户信息
        setUserInfo(user)

        // 设置角色和权限
        if (userRoles && userRoles.length > 0) {
          setRoles(userRoles)
          setPermissions(userPermissions || ['*:*:*'])
        }
        else {
          setRoles(['ROLE_DEFAULT'])
          setPermissions(['*:*:*'])
        }

        return { success: true, data: response }
      }
      catch (error: any) {
        console.error('获取用户信息失败:', error)
        return {
          success: false,
          message: error.message || '获取用户信息失败',
        }
      }
    }

    /**
     * 用户登录
     */
    const loginUser = async (loginParams: ILoginParams) => {
      try {
        isLoading.value = true

        // 加密密码
        const encryptedParams = {
          ...loginParams,
          password: encryptPassword(loginParams.password),
        }

        // 调用登录接口
        const response = await login(encryptedParams)
        if (response?.accessToken) {
          setTokenValue(response.accessToken)
        }

        // 获取完整的用户信息
        await getUserInfoData()

        return { success: true, message: '登录成功' }
      }
      catch (error: any) {
        console.error('登录失败:', error)
        return {
          success: false,
          message: error.message || '登录失败，请检查网络连接',
        }
      }
      finally {
        isLoading.value = false
      }
    }

    /**
     * 清除用户store状态
     */
    const clearUserStore = () => {
      token.value = ''
      userInfo.value = null
      roles.value = []
      permissions.value = []

      // 清理本地存储
      clearUserInfo()
    }

    /**
     * 用户退出登录
     */
    const logoutUser = async () => {
      try {
        // 调用退出接口
        await logout()
      }
      catch (error) {
        console.error('退出登录接口调用失败:', error)
      }
      finally {
        // 无论接口是否成功，都清理本地数据
        clearUserStore()
      }
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
      isLoading,

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
      loginUser,
      getUserInfoData,
      clearUserStore,
      logoutUser,
      hasPermission,
      hasRole,
    }
  },
  {
    persist: {
      key: 'user-store',
      storage: {
        getItem: uni.getStorageSync,
        setItem: uni.setStorageSync,
      },
      // 只持久化必要的状态
      paths: ['token'],
    },
  },
)
