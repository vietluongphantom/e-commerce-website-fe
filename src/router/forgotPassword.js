const forgotPassword = [
  {
    path: '/forgot-password/:role',
    name: 'forgot-password',
    component: () => import('../pages/forgotPassword/ForgotPasswordView.vue')
  }
];

export default forgotPassword;
