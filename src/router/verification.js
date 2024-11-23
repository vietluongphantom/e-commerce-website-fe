const verification = [
  {
    path: '/verification/:role/:email',
    name: 'verification',
    component: () => import('../pages/OTP/VerifyView.vue')
  }
];

export default verification;