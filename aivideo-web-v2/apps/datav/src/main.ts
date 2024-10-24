import { createApp } from 'vue'
import TDesign from 'tdesign-vue-next'
import App from './App.vue'
import router from './router'
import store from './store'
import http from './api/http'
import base from './assets/script/common'
import './style.css'
import 'tdesign-vue-next/es/style/index.css';

import * as echarts from 'echarts';
import 'echarts-gl'

const app = createApp(App);
app.config.globalProperties.$base = base;
app.config.globalProperties.$http = http;
app.config.globalProperties.$echart = echarts;
app.use(store)
    .use(router)
    .use(TDesign)
    .mount('#app');