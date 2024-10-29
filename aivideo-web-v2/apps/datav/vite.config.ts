import vue from '@vitejs/plugin-vue';
import copy from 'rollup-plugin-copy';
import path from 'node:path';
import { ConfigEnv, loadEnv, UserConfig } from 'vite';

const CWD = process.cwd();

// https://vitejs.dev/config/
export default ({ mode }: ConfigEnv): UserConfig => {
  const { VITE_BASE_URL } = loadEnv(mode, CWD);
  return {
    plugins: [vue(), copy({
      targets: [
        {src: 'node_modules/@liveqing/liveplayer-v3/dist/component/liveplayer-lib.min.js', dest: 'public/static/js'},
      ]
    })],
    base: VITE_BASE_URL,
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    build:{
      outDir: path.resolve(__dirname, '../../../dist/datav'),
    },
    server: {
      port: 3003
    }
  }
};
