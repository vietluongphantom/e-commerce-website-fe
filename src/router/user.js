const home = [
    {
      path: '/user',
      component: () => import('../layouts/DefaultLayout.vue'),
      children: [
        {
          path: 'home',
          name: 'Home user',
          component: () => import('../pages/Home/User/HomeUserView.vue')
        }
      ]
    }
  ];
  
  export default home;
  