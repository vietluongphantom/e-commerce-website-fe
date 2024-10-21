const login = [
    {
      path: '/login/user',
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
    }
  ];
  
  export default login;
  