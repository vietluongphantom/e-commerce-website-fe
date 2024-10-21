import { createRouter, createWebHistory } from 'vue-router';
import login from './login.js';
import register from './register.js';
import user from './user.js';
import admin from './admin.js';


const routes = [...admin,...login, ...register, ...user];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
