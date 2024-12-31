import { Layout, Typography } from 'antd';
import { m } from 'framer-motion';
import { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';

import pageLoading from '@/assets/images/page_loading.gif';
import MotionContainer from '@/components/animate/motion-container';
import { varBounce } from '@/components/animate/variants/bounce';
import {
  useUserActions,
  useUserAiPermission,
  useUserToken,
  useAiPremissionRoute,
} from '@/store/userStore';
import { getUrlParams } from '@/utils/url';

const { VITE_APP_HOMEPAGE: HOMEPAGE } = import.meta.env;

export default function PageRedirect() {
  const { accessToken } = useUserToken();
  const aiPermission = useUserAiPermission();
  const navigatge = useNavigate();
  const { token, RedirectUrl } = getUrlParams(window.location.href);
  const URL = RedirectUrl ? decodeURIComponent(RedirectUrl) : HOMEPAGE;
  const { setUserToken } = useUserActions();
  const getAiPremissionRoute = useAiPremissionRoute();

  useEffect(() => {
    const getPermisson = () => {
      if (!token) {
        navigatge('/login', { replace: true });
        return;
      }
      setUserToken({ accessToken: token });
      getAiPremissionRoute();
      if (aiPermission) {
        navigatge(URL, { replace: true });
      }
    };
    getPermisson();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [aiPermission]);

  return (
    <Layout className="relative flex !min-h-screen !w-full !flex-row">
      <Helmet>
        <title> 重定向</title>
      </Helmet>
      <div className="m-auto flex !h-screen w-full max-w-[480px] flex-col justify-center px-[16px] lg:px-[64px]">
        <div className="m-auto max-w-[400px]">
          <MotionContainer className="flex flex-col items-center justify-center px-2">
            <m.div variants={varBounce().in}>
              <Typography.Title level={3} className="text-center">
                页面加载中
              </Typography.Title>
            </m.div>

            <m.div variants={varBounce().in}>
              <Typography.Paragraph type="secondary" className="text-center">
                {`页面地址:${URL},正在努力加载中，请稍后....`}
              </Typography.Paragraph>
            </m.div>

            <m.div variants={varBounce().in}>
              <img src={pageLoading} alt="" width="400" height="400" />
            </m.div>
          </MotionContainer>
        </div>
      </div>
    </Layout>
  );
}
