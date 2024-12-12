import type { App } from 'vue';

import modal from './modal';

export default function installPlugins(app: App) {
  // 模态框对象
  app.config.globalProperties.$modal = modal;
}
