// react-query
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'; // 请求库react-query
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'; // 请求库调试工具
// react
import { Suspense } from 'react';
import ReactDOM from 'react-dom/client';
// react helmet
import { HelmetProvider } from 'react-helmet-async'; // 动态修改html head标签
// eslint-disable-next-line import/no-unresolved
import 'virtual:svg-icons-register';

import App from '@/App';

// i18n
import './locales/i18n';
// tailwind css
import './theme/index.css';

const charAt = `                                                                                       
HHHHHHHHH     HHHHHHHHHDDDDDDDDDDDDD       ZZZZZZZZZZZZZZZZZZZ
H:::::::H     H:::::::HD::::::::::::DDD    Z:::::::::::::::::Z
H:::::::H     H:::::::HD:::::::::::::::DD  Z:::::::::::::::::Z
HH::::::H     H::::::HHDDD:::::DDDDD:::::D Z:::ZZZZZZZZ:::::Z 
  H:::::H     H:::::H    D:::::D    D:::::DZZZZZ     Z:::::Z  
  H:::::H     H:::::H    D:::::D     D:::::D       Z:::::Z    
  H::::::HHHHH::::::H    D:::::D     D:::::D      Z:::::Z     
  H:::::::::::::::::H    D:::::D     D:::::D     Z:::::Z      
  H:::::::::::::::::H    D:::::D     D:::::D    Z:::::Z       
  H::::::HHHHH::::::H    D:::::D     D:::::D   Z:::::Z        
  H:::::H     H:::::H    D:::::D     D:::::D  Z:::::Z         
  H:::::H     H:::::H    D:::::D    D:::::DZZZ:::::Z     ZZZZZ
HH::::::H     H::::::HHDDD:::::DDDDD:::::D Z::::::ZZZZZZZZ:::Z
H:::::::H     H:::::::HD:::::::::::::::DD  Z:::::::::::::::::Z
H:::::::H     H:::::::HD::::::::::::DDD    Z:::::::::::::::::Z
HHHHHHHHH     HHHHHHHHHDDDDDDDDDDDDD       ZZZZZZZZZZZZZZZZZZZ                                                                              
  `;
console.info(`%c${charAt}`, 'color: #5BE49B');

// 创建一个 client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 3, // 失败重试次数
      cacheTime: 10 * 1000, // 缓存有效期 5min
      staleTime: 3 * 1000, // 数据变得 "陈旧"（stale）的时间 10s
      refetchOnWindowFocus: false, // 禁止窗口聚焦时重新获取数据
      refetchOnReconnect: false, // 禁止重新连接时重新获取数据
      refetchOnMount: false, // 禁止组件挂载时重新获取数据
    },
  },
});

// const getPermisson = async () => {
//   const aiPerssion = await aiService.getAlarmCategory({ page: 1, pageSize: 100 });
//   userStore
//     .getState()
//     .actions.setUserAiPermission(aiPerssion.list.map((item) => ({ ...item, status: true })));
// };

// // 如果URL携带token
// const token = getUrlParamByName(window.location.href, 'token');
// if (token) {
//   userStore.getState().actions.setUserToken({ accessToken: token });
//   getPermisson();
// }

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);

root.render(
  <HelmetProvider>
    <QueryClientProvider client={queryClient}>
      <ReactQueryDevtools initialIsOpen={false} />
      <Suspense>
        <App />
      </Suspense>
    </QueryClientProvider>
  </HelmetProvider>,
);

// console.log(window.parent.localStorage.getItem('wvp-token'));
// if (window.parent.localStorage.getItem('wvp-token')) {

// }

// window.onmessage = (e) => {
//   if (e.origin !== 'http://127.0.0.1') {
//     return;
//   }
//   if (e.data?.token) {
//     // console.log(userStore)
//     setItem(StorageEnum.Token, e.data.token);
//     // window.location.reload();
//   }
// };

// 🥵 start service worker mock in development msetUserToken
// worker.start({ onUnhandledRequest: 'bypass' });
