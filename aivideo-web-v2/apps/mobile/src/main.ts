import TDesign from 'tdesign-mobile-vue';
import 'tdesign-mobile-vue/es/style/index.css';
import { createApp } from 'vue';
import App from './App.vue';
import './style.css';


const app = createApp(App);
app.use(TDesign);
app.mount('#app');
