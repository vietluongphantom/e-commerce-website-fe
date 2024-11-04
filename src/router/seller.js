const seller = [
  {
    path: '/seller',
    component: () => import('../layouts/LayoutSeller/LayoutSeller.vue'),
    children: [
      {
        path: 'home',
        name: 'menu-1',
        component: () => import('../components/dashBoard/DashBoard.vue')
      },

      {
        path: 'list-warehouse',
        name: 'menu-10',
       
      },

      {
        path: 'warehouse-detail',
        name: 'menu-11',
       
      },

      {
        path: 'warehouse-edit/:id',
        name: 'warehouse-edit',
       
      },

      {
        path: 'list-product',
        name: 'menu-4',
      
      },

      {
        path: 'product-detail/:id',
        name: 'product-detail',
    
      },

      {
        path: 'profile',
        name: 'view-profile',
    
      },

      {
        path: 'personal',
        name: 'view-personal',
      
      },

      {
        path: 'shopinfo',
        name: 'view-shopInfo',
       
      },

      {
        path: 'export-supply',
        name: 'menu-15',
     
      },

      {
        path: 'create-product',
        name: 'menu-5',
       
      },
      {
        path: 'export-supply',
        name: 'menu-16',
     
      },

      {
        path: 'test-scroll',
        name: 'test-scroll',
       
      },
      {
        path: 'product-item/:id',
        name: 'product-item',
      
      },
      {
        path: 'product-edit/:id',
        name: 'product-edit',
      
      },

      {
        path: 'list-voucher',
        name: 'menu-6',
      
      },

      {
        path: 'create-voucher',
        name: 'menu-7',
      
      },

      {
        path: 'voucher-detail/:id',
        name: 'voucher-detail',
        
      },

      {
        path: 'voucher-update/:id',
        name: 'voucher-update',
       
      },
      {
        path: 'list-inventory',
        name: 'menu-12',
       
      },
      {
        path: 'list-order',
        name: 'menu-8',
       
      },
    ]
  }
];

export default seller;
