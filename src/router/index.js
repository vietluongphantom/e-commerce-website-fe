import { createRouter, createWebHistory } from 'vue-router';
import login from './login.js';
import register from './register.js';
import user from './user.js';

const routes = [...login, ...register, ...user];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
