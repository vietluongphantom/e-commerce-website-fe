import { createRouter, createWebHistory } from 'vue-router';
import admin from './admin.js';
import login from './login.js';
import register from './register.js';
import forgotPassword from './forgotPassword.js';
import user from './user.js';
import seller from './seller.js';
import slider from './slider.js';
import verification from './verification.js';

const routes = [...admin, ...login, ...register, ...forgotPassword, ...user, ...slider, ...verification, ...seller];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
