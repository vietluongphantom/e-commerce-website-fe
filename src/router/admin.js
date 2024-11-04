const admin = [
  {
    path: '/admin',
    component: () => import('../layouts/LayoutAdmin/LayoutAdmin.vue'),
    children: [
      {
        path: 'home',
        name: 'admin-menu-1'
      },

      {
        path: 'list-seller',
        name: 'admin-menu-4'
      },

      {
        path: 'detail-seller/:id',
        name: 'detail-seller'
      },

      {
        path: 'add-seller',
        name: 'admin-menu-5'
      },

      {
        path: 'list-user',
        name: 'admin-menu-6'
      },

      {
        path: 'detail-user/:id',
        name: 'detail-user'
      },

      {
        path: 'add-user',
        name: 'menu-7'
      },

      {
        path: 'category',
        name: 'admin-menu-2',
        component: () => import('../components/category/ListCategory/ListCategory.vue')
      },

      {
        path: 'brand',
        name: 'admin-menu-3',
        component: () => import('../components/brand/ListBrand/ListBrand.vue')
      }
    ]
  }
];
  
  export default admin;
  