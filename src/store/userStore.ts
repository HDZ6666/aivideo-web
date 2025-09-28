import { useMutation } from '@tanstack/react-query';
import { App } from 'antd';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { create } from 'zustand';

import { AlarmCategoryItem } from '@/api/services/aiService';
import categroyService from '@/api/services/categroyService';
import userService, { SignInReq } from '@/api/services/userService';
import { getItem, removeItem, setItem } from '@/utils/storage';

import { UserInfo, UserToken } from '#/entity';
import { StorageEnum } from '#/enum';

const { VITE_APP_HOMEPAGE: HOMEPAGE } = import.meta.env;

type UserStore = {
  userInfo: Partial<UserInfo>;
  userToken: UserToken;
  userAiPermission: AlarmCategoryItem[] | null;
  // 使用 actions 命名空间来存放所有的 action
  actions: {
    setUserInfo: (userInfo: UserInfo) => void;
    setUserToken: (token: UserToken) => void;
    setUserAiPermission: (userAiPermission: AlarmCategoryItem[]) => void;
    clearUserInfoAndToken: () => void;
  };
};

const useUserStore = create<UserStore>((set) => ({
  userInfo: getItem<UserInfo>(StorageEnum.User) || {},
  userToken: getItem<UserToken>(StorageEnum.Token) || {},
  userAiPermission: getItem<AlarmCategoryItem[]>(StorageEnum.AiPermission),
  actions: {
    setUserInfo: (userInfo) => {
      set({ userInfo });
      setItem(StorageEnum.User, userInfo);
    },
    setUserToken: (userToken) => {
      set({ userToken });
      setItem(StorageEnum.Token, userToken);
    },
    setUserAiPermission: (userAiPermission) => {
      set({ userAiPermission });
      setItem(StorageEnum.AiPermission, userAiPermission);
    },
    clearUserInfoAndToken() {
      set({ userInfo: {}, userToken: {}, userAiPermission: null });
      removeItem(StorageEnum.User);
      removeItem(StorageEnum.Token);
      removeItem(StorageEnum.AiPermission);
    },
  },
}));

export const useUserInfo = () => useUserStore((state) => state.userInfo);
export const useUserToken = () => useUserStore((state) => state.userToken);
export const useUserPermission = () => useUserStore((state) => state.userInfo.permissions);
export const useUserAiPermission = () => useUserStore((state) => state.userAiPermission);
export const useUserActions = () => useUserStore((state) => state.actions);

export const useSignIn = () => {
  const { t } = useTranslation();
  const navigatge = useNavigate();
  const { message, notification } = App.useApp();
  const { setUserToken, setUserInfo } = useUserActions();
  const getAiPremissionRoute = useAiPremissionRoute();

  const signInMutation = useMutation({
    mutationFn: userService.signin,
  });

  const signIn = async (data: SignInReq) => {
    try {
      const res = await signInMutation.mutateAsync(data);
      const { username: name, accessToken, id } = res;
      setUserToken({ accessToken });
      setUserInfo({ username: name, id });
      await getAiPremissionRoute();
      navigatge(HOMEPAGE, { replace: true });
      notification.success({
        message: t('sys.login.loginSuccessTitle'),
        description: `${t('sys.login.loginSuccessDesc')}: ${name}`,
        duration: 3,
      });
    } catch (err) {
      message.warning({
        content: err.message,
        duration: 3,
      });
    }
  };

  return signIn;
};

export const useAiPremissionRoute = () => {
  const { setUserAiPermission } = useUserActions();
  const queryParams = {
    page: 1,
    pageSize: 1000,
  };

  const getAiPremissionRouteMutation = useMutation({
    mutationFn: categroyService.CategoryList,
  });

  const getAiPremissionRoute = async () => {
    const aiPerssion = await getAiPremissionRouteMutation.mutateAsync(queryParams);
    const list = aiPerssion.list.map((item) => ({ ...item, status: item.isUse === 1 }));
    setUserAiPermission(list);
  };

  return getAiPremissionRoute;
};

export default useUserStore;
