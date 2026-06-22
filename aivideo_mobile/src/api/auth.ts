import { http } from '@/http/alova'

// ==================== 数据类型定义 ====================

/**
 * 登录请求参数
 */
export interface ILoginParams {
  username: string
  password: string
}

/**
 * 登录响应数据
 */
export interface ILoginResponse {
  accessToken: string
  accountNonExpired: boolean
  accountNonLocked: boolean
  authorities: any
  credentialsNonExpired: boolean
  enabled: boolean
  id: number
  password: any
  role: any
  username: string
}

/**
 * 角色信息
 */
export interface IRoleInfo {
  admin: boolean
  createBy: any
  createTime: any
  dataScope: any
  delFlag: any
  deptCheckStrictly: boolean
  deptIds: any
  flag: boolean
  id: number
  menuCheckStrictly: boolean
  menuIds: any
  permissions: any
  remark: any
  roleKey: any
  roleName: any
  roleSort: any
  status: any
  updateBy: any
  updateTime: any
}

/**
 * 用户信息
 */
export interface IUserInfo {
  id: number
  username: string
  accessToken?: any
  accountNonExpired?: boolean
  accountNonLocked?: boolean
  authorities?: any
  credentialsNonExpired?: boolean
  enabled?: boolean
  password?: string
  role?: IRoleInfo
}

/**
 * 获取用户信息响应
 */
export interface IUserInfoResponse {
  permissions: (string | null)[]
  roles: string[]
  user: IUserInfo
}

// ==================== API接口定义 ====================

/**
 * 用户登录
 * @param params 登录参数
 */
export function login(params: ILoginParams) {
  return http.Get<ILoginResponse>('/api/user/login', {
    params,
    meta: {
      ignoreAuth: true,
    },
  })
}

/**
 * 获取用户信息
 */
export function getUserInfo() {
  return http.Get<IUserInfoResponse>('/api/user/getInfo')
}

/**
 * 用户退出登录
 */
export function logout() {
  return http.Get<{ code: number, message: string }>('/api/user/logout')
}
