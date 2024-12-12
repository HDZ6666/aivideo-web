import vue from '@vitejs/plugin-vue';
import path from 'node:path';
import { ConfigEnv, loadEnv, UserConfig } from 'vite';


const CWD = process.cwd();

// https://vitejs.dev/config/
export default ({ mode }: ConfigEnv): UserConfig => {
  const { VITE_BASE_URL } = loadEnv(mode, CWD);
  return {
    plugins: [vue()],
    build:{
      outDir: path.resolve(__dirname, '../../../dist/mobile'),
    },
    base: VITE_BASE_URL,
    server: {
      port: 3002
    }
  }
};
