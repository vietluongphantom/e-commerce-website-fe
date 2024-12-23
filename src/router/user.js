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
        path: 'search',
        name: 'Search user',
        component: () => import('../pages/Home/User/HomeShop.vue')
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
      },
      {
        path: 'view-order-detail/:id',
        name: 'user-view-order-detail',
        component: () => import('../components/order/viewOrder/viewOrderByUser.vue')
      },
      {
        path: 'home-shop',
        name: 'home shop',
        component: () => import('../pages/Home/User/HomeShop.vue')
      }
    ]
  }
];

export default home;
