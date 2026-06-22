import apiClient from '../videoApiClient';

import { UserInfo, UserToken } from '#/entity';

export interface SignInReq {
  username: string;
  password: string;
}

export interface SignUpReq extends SignInReq {
  email: string;
}
export type SignInRes = UserToken & UserInfo;

export interface GetPushUserReq {
  username?: string;
  page: number;
  count: number;
}

export interface GetPushUserRes {
  total?: number;
  list: GetPushUserListItem[];
}
export interface GetPushUserListItem {
  username: string;
  mobile: string;
  pushKey: string;
  id: number;
}

export enum UserApi {
  SignIn = '/api/user/login',
  getPushUser = '/api/user/users',
}

const signin = (params: SignInReq) => apiClient.get<SignInRes>({ url: UserApi.SignIn, params });

const getPushUser = (params: GetPushUserReq) =>
  apiClient.get<GetPushUserRes>({ url: UserApi.getPushUser, params });

export default {
  signin,
  getPushUser,
};
