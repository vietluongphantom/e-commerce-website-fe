const home = [
  {
    path: '/user',
    component: () => import('../layouts/DefaultLayout.vue'),
    children: [
      {
        path: 'home',
        name: 'Home user',
        component: () => import('../pages/Home/User/HomeUserView.vue')
      },
      {
        path: 'list-cart',
        name: 'list-cart',
        component: () => import('../components/managerCart/listCart/ListCart.vue')
      },
      {
        path: 'product-detail-view/:id',
        name: 'product-detail-user',
        component: () => import('../components/listProduct/productDetail/ProductDetail.vue')
      },

      {
        path: 'view-profile-user',
        name: 'view-profile-user',
        component: () => import('../components/profileUser/ProfileUser.vue')
      },
      {
        path: 'list-order',
        name: 'list-order',
        component: () => import('../components/order/listOrderUser/ListOrderUer.vue')
      }
    ]
  }
];

export default home;
