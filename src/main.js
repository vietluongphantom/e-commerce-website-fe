import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';
import Antd from 'ant-design-vue';
// import Toast from 'vue-toastification';


import 'ant-design-vue/dist/reset.css';
import '@/assets/styles/global.css';
import '@/assets/styles/tailwind.css';
import router from './router';
import Toast from "vue-toastification";
import "vue-toastification/dist/index.css";
import { POSITION } from 'vue-toastification';

// import SweetAlert from './utils/sweetalert';

const app = createApp(App);
const pinia = createPinia();

// app.use(SweetAlert);
app.use(Antd);
app.use(router);
app.use(pinia);
app.use(Toast, {
    position: POSITION.TOP_RIGHT,
  });
app.mount('#app');