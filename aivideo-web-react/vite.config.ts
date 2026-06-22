import path from 'path';

import react from '@vitejs/plugin-react';
import { defineConfig, loadEnv, ConfigEnv } from 'vite';
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons';
import tsconfigPaths from 'vite-tsconfig-paths';

// https://vitejs.dev/config/
export default (ConfigEnv: ConfigEnv) => {
  const { VITE_APP_VIDEO_API, VITE_APP_VIDEO_API_TARGET } = loadEnv(ConfigEnv.mode, process.cwd());
  return defineConfig({
    base: '/react',
    esbuild: {
      // drop: ['console', 'debugger'],
    },
    css: {
      // 开css sourcemap方便找css
      devSourcemap: true,
    },
    plugins: [
      react(),
      // 同步tsconfig.json的path设置alias
      tsconfigPaths(),
      createSvgIconsPlugin({
        // 指定需要缓存的图标文件夹
        iconDirs: [path.resolve(process.cwd(), 'src/assets/icons')],
        // 指定symbolId格式
        symbolId: 'icon-[dir]-[name]',
      }),
    ],
    server: {
      // 自动打开浏览器
      open: true,
      host: true,
      port: 3006,
      proxy: {
        [VITE_APP_VIDEO_API]: {
          target: VITE_APP_VIDEO_API_TARGET,
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/debug/, ''),
        },
        // '/minmo': {
        //   target: 'http://192.168.0.152:3080',
        //   changeOrigin: true,
        //   rewrite: (path) => path.replace(/^\/minmo/, ''),
        // },
      },
    },
    build: {
      target: 'esnext',
      minify: 'terser',
      terserOptions: {
        compress: {
          // 生产环境移除console
          drop_console: false, //  AURA-X: Modified to debug production issue
          drop_debugger: false, // AURA-X: Modified to debug production issue
        },
      },
      sourcemap: false,
      outDir: path.resolve(__dirname, '../dist/react'),
    },
  });
};
