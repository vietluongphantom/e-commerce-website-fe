const verification = [
  {
    path: '/verification/:role/:email',
    name: 'verification',
    component: () => import('../pages/OTP/VerifyView.vue')
  },
  {
    path: '/verification-forgot-password/:email/:role',
    name: 'verification-forgot-password',
    component: () => import('../pages/OTP/VerifyForgotPassword.vue')
  },
];

export default verification;