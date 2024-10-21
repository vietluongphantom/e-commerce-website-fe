import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';
import Antd from 'ant-design-vue';

import 'ant-design-vue/dist/reset.css';
import '@/assets/styles/global.css';
import '@/assets/styles/tailwind.css';
// import router from './router';
// import SweetAlert from './utils/sweetalert';

const app = createApp(App);
const pinia = createPinia();

// app.use(SweetAlert);
app.use(Antd);
// app.use(router);
app.use(pinia);
app.mount('#app');