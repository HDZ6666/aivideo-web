/**
 * 认证模拟数据工具
 * 为用户登录、获取用户信息等认证相关功能提供模拟数据
 */

import type { ILoginParams, ILoginResponse, IRoleInfo, IUserInfo, IUserInfoResponse } from '@/api/auth'

// ==================== 模拟用户数据 ====================

/**
 * 模拟角色信息
 */
const mockRoles: IRoleInfo[] = [
  {
    admin: true,
    createBy: 'system',
    createTime: '2024-01-01 00:00:00',
    dataScope: '1',
    delFlag: '0',
    deptCheckStrictly: true,
    deptIds: null,
    flag: false,
    id: 1,
    menuCheckStrictly: true,
    menuIds: null,
    permissions: ['*:*:*'],
    remark: '超级管理员',
    roleKey: 'admin',
    roleName: '超级管理员',
    roleSort: 1,
    status: '0',
    updateBy: null,
    updateTime: null,
  },
  {
    admin: false,
    createBy: 'admin',
    createTime: '2024-01-01 00:00:00',
    dataScope: '2',
    delFlag: '0',
    deptCheckStrictly: false,
    deptIds: null,
    flag: false,
    id: 2,
    menuCheckStrictly: false,
    menuIds: null,
    permissions: ['device:view', 'device:manage', 'alarm:view'],
    remark: '设备管理员',
    roleKey: 'device_admin',
    roleName: '设备管理员',
    roleSort: 2,
    status: '0',
    updateBy: null,
    updateTime: null,
  },
  {
    admin: false,
    createBy: 'admin',
    createTime: '2024-01-01 00:00:00',
    dataScope: '3',
    delFlag: '0',
    deptCheckStrictly: false,
    deptIds: null,
    flag: false,
    id: 3,
    menuCheckStrictly: false,
    menuIds: null,
    permissions: ['device:view', 'alarm:view'],
    remark: '普通用户',
    roleKey: 'user',
    roleName: '普通用户',
    roleSort: 3,
    status: '0',
    updateBy: null,
    updateTime: null,
  },
]

/**
 * 模拟用户数据
 */
const mockUsers: Array<IUserInfo & { password: string }> = [
  {
    id: 1,
    username: 'admin',
    password: 'admin123',
    accessToken: null,
    accountNonExpired: true,
    accountNonLocked: true,
    authorities: ['ROLE_ADMIN'],
    credentialsNonExpired: true,
    enabled: true,
    role: mockRoles[0], // 超级管理员角色
  },
  {
    id: 2,
    username: 'device_admin',
    password: 'device123',
    accessToken: null,
    accountNonExpired: true,
    accountNonLocked: true,
    authorities: ['ROLE_DEVICE_ADMIN'],
    credentialsNonExpired: true,
    enabled: true,
    role: mockRoles[1], // 设备管理员角色
  },
  {
    id: 3,
    username: 'user',
    password: 'user123',
    accessToken: null,
    accountNonExpired: true,
    accountNonLocked: true,
    authorities: ['ROLE_USER'],
    credentialsNonExpired: true,
    enabled: true,
    role: mockRoles[2], // 普通用户角色
  },
  {
    id: 4,
    username: 'test',
    password: '123456',
    accessToken: null,
    accountNonExpired: true,
    accountNonLocked: true,
    authorities: ['ROLE_USER'],
    credentialsNonExpired: true,
    enabled: true,
    role: mockRoles[2], // 普通用户角色
  },
]

// ==================== 模拟登录接口 ====================

/**
 * 生成模拟的访问令牌
 */
function generateMockToken(userId: number): string {
  const timestamp = Date.now()
  const randomStr = Math.random().toString(36).substring(2, 15)
  return `mock_token_${userId}_${timestamp}_${randomStr}`
}

/**
 * 模拟用户登录
 * @param params 登录参数
 */
export function mockLogin(params: ILoginParams): Promise<ILoginResponse> {
  return new Promise((resolve, reject) => {
    // 模拟网络延迟
    setTimeout(() => {
      const { username, password } = params

      // 查找用户
      const user = mockUsers.find(u => u.username === username)

      if (!user) {
        reject(new Error('用户名不存在'))
        return
      }

      if (user.password !== password) {
        reject(new Error('密码错误'))
        return
      }

      if (!user.enabled) {
        reject(new Error('账户已被禁用'))
        return
      }

      if (!user.accountNonLocked) {
        reject(new Error('账户已被锁定'))
        return
      }

      // 生成访问令牌
      const accessToken = generateMockToken(user.id)

      // 构造登录响应
      const loginResponse: ILoginResponse = {
        accessToken,
        accountNonExpired: user.accountNonExpired!,
        accountNonLocked: user.accountNonLocked!,
        authorities: user.authorities,
        credentialsNonExpired: user.credentialsNonExpired!,
        enabled: user.enabled!,
        id: user.id,
        password: null, // 不返回密码
        role: user.role,
        username: user.username,
      }

      resolve(loginResponse)
    }, 500 + Math.random() * 500) // 500-1000ms 随机延迟
  })
}

/**
 * 模拟获取用户信息
 * @param token 访问令牌
 */
export function mockGetUserInfo(token?: string): Promise<IUserInfoResponse> {
  return new Promise((resolve, reject) => {
    // 模拟网络延迟
    setTimeout(() => {
      if (!token) {
        reject(new Error('访问令牌不能为空'))
        return
      }

      // 从令牌中解析用户ID（这里简化处理）
      const tokenParts = token.split('_')
      if (tokenParts.length < 4 || tokenParts[0] !== 'mock' || tokenParts[1] !== 'token') {
        reject(new Error('无效的访问令牌'))
        return
      }

      const userId = Number.parseInt(tokenParts[2])
      const user = mockUsers.find(u => u.id === userId)

      if (!user) {
        reject(new Error('用户不存在'))
        return
      }

      if (!user.enabled) {
        reject(new Error('账户已被禁用'))
        return
      }

      // 构造用户信息响应
      const userInfoResponse: IUserInfoResponse = {
        permissions: user.role?.permissions || [],
        roles: [user.role?.roleKey || 'user'],
        user: {
          id: user.id,
          username: user.username,
          accessToken: token,
          accountNonExpired: user.accountNonExpired,
          accountNonLocked: user.accountNonLocked,
          authorities: user.authorities,
          credentialsNonExpired: user.credentialsNonExpired,
          enabled: user.enabled,
          password: undefined, // 不返回密码
          role: user.role,
        },
      }

      resolve(userInfoResponse)
    }, 200 + Math.random() * 300) // 200-500ms 随机延迟
  })
}

/**
 * 模拟用户退出登录
 * @param token 访问令牌
 */
export function mockLogout(token?: string): Promise<{ code: number, message: string }> {
  return new Promise((resolve, reject) => {
    // 模拟网络延迟
    setTimeout(() => {
      if (!token) {
        reject(new Error('访问令牌不能为空'))
        return
      }

      // 这里可以添加令牌失效逻辑，但在模拟环境中我们简化处理
      resolve({
        code: 200,
        message: '退出登录成功',
      })
    }, 100 + Math.random() * 200) // 100-300ms 随机延迟
  })
}

// ==================== 辅助函数 ====================

/**
 * 获取所有模拟用户（用于测试，不包含密码）
 */
export function getMockUsers(): Array<Omit<IUserInfo, 'password'>> {
  return mockUsers.map(user => ({
    id: user.id,
    username: user.username,
    accessToken: user.accessToken,
    accountNonExpired: user.accountNonExpired,
    accountNonLocked: user.accountNonLocked,
    authorities: user.authorities,
    credentialsNonExpired: user.credentialsNonExpired,
    enabled: user.enabled,
    role: user.role,
  }))
}

/**
 * 获取所有模拟角色（用于测试）
 */
export function getMockRoles(): IRoleInfo[] {
  return [...mockRoles]
}

/**
 * 验证令牌是否有效
 * @param token 访问令牌
 */
export function validateMockToken(token: string): boolean {
  if (!token)
    return false

  const tokenParts = token.split('_')
  if (tokenParts.length < 4 || tokenParts[0] !== 'mock' || tokenParts[1] !== 'token') {
    return false
  }

  const userId = Number.parseInt(tokenParts[2])
  const user = mockUsers.find(u => u.id === userId)

  return !!(user && user.enabled && user.accountNonLocked)
}

/**
 * 根据用户名获取用户信息（不包含密码）
 * @param username 用户名
 */
export function getMockUserByUsername(username: string): Omit<IUserInfo, 'password'> | null {
  const user = mockUsers.find(u => u.username === username)
  if (!user)
    return null

  return {
    id: user.id,
    username: user.username,
    accessToken: user.accessToken,
    accountNonExpired: user.accountNonExpired,
    accountNonLocked: user.accountNonLocked,
    authorities: user.authorities,
    credentialsNonExpired: user.credentialsNonExpired,
    enabled: user.enabled,
    role: user.role,
  }
}

/**
 * 可用的测试账号信息
 */
export const TEST_ACCOUNTS = [
  {
    username: 'admin',
    password: 'admin123',
    role: '超级管理员',
    description: '拥有所有权限的管理员账号',
  },
  {
    username: 'device_admin',
    password: 'device123',
    role: '设备管理员',
    description: '可以管理设备和查看告警的账号',
  },
  {
    username: 'user',
    password: 'user123',
    role: '普通用户',
    description: '只能查看设备和告警的普通用户',
  },
  {
    username: 'test',
    password: '123456',
    role: '普通用户',
    description: '测试用的普通用户账号',
  },
] as const
