const login = [
  {
    path: '/login/user/',
    name: 'login-user',
    component: () => import('../pages/login/LoginViewUser.vue')
  },
  {
    path: '/login/seller',
    name: 'LoginSeller',
    component: () => import('../pages/login/LoginViewSeller.vue')
  },
  {
    path: '/login/admin',
    name: 'HomeAdmin',
    component: () => import('../pages/login/loginAdmin/LoginViewAdmin.vue')
  },
  // {
  //   path: '/login/forgotPassword/:role',
  //   component: () => import('../pages/forgotPassword/ForgotPasswordView.vue')
  // }
];
  
  export default login;
  