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
        component: () => import('../components/warehouse/listWarehouse/ListWarehouse.vue')
      },

      {
        path: 'warehouse-detail',
        name: 'menu-11',
        component: () => import('../components/warehouse/warehouseDetail/WarehouseDetail.vue')
      },

      {
        path: 'warehouse-edit/:id',
        name: 'warehouse-edit',
        component: () => import('../components/warehouse/editWarehouse/EditWarehouse.vue')
      },

      {
        path: 'list-product',
        name: 'menu-4',
        component: () => import('../components/productSeller/tableProduct/TableProduct.vue'),
        props: (route) => ({ page: route.query.page || 1 })
      },

      {
        path: 'product-detail/:id',
        name: 'product-detail',
        component: () => import('../components/productSeller/productDetail/ProductDetail.vue'),
        props: (route) => ({ page: route.query.id })
      },

      {
        path: 'profile',
        name: 'view-profile',
        component: () => import('../components/inforSeller/read/ReadView.vue')
      },

      {
        path: 'personal',
        name: 'view-personal',
        component: () => import('../components/inforSeller/personal/EditProfile.vue')
      },

      {
        path: 'shopinfo',
        name: 'view-shopInfo',
        component: () => import('../components/inforSeller/shop/InfoShop.vue')
      },

      {
        path: 'export-supply',
        name: 'menu-15',
        component: () => import('../components/supply/listExport/ListExport.vue')
      },

      {
        path: 'create-product',
        name: 'menu-5',
        component: () => import('../components/productSeller/createProduct/CreateProduct.vue')
      },
      {
        path: 'export-supply',
        name: 'menu-16',
        component: () => import('../components/supply/listImport/ListImport.vue')
      },

      {
        path: 'test-scroll',
        name: 'test-scroll',
        component: () => import('../components/productSeller/test/testProduct.vue')
      },
      {
        path: 'product-item/:id',
        name: 'product-item',
        component: () => import('../pages/productItem/productItem.vue'),
        props: (route) => ({ page: route.query.id })
      },
      {
        path: 'product-edit/:id',
        name: 'product-edit',
        component: () => import('../components/productSeller/editProduct/EditProduct.vue'),
        props: (route) => ({ page: route.query.id })
      },

      {
        path: 'list-voucher',
        name: 'menu-6',
        component: () => import('../components/voucher/voucherSeller/ListVoucher.vue')
      },

      {
        path: 'create-voucher',
        name: 'menu-7',
        component: () => import('../components/voucher/voucherSeller/addVoucher/AddVoucher.vue')
      },

      {
        path: 'voucher-detail/:id',
        name: 'voucher-detail',
        component: () => import('../components/voucher/voucherSeller/detailVoucher/DetailVoucher.vue'),
        props: (route) => ({ id: route.params.id })
      },

      {
        path: 'voucher-update/:id',
        name: 'voucher-update',
        component: () => import('../components/voucher/voucherSeller/updateVoucher/UpdateVoucher.vue'),
        props: (route) => ({ id: route.params.id })
      },
      {
        path: 'list-inventory',
        name: 'menu-12',
        component: () => import('../components/inventory/listInventory/ListInventory.vue')
      },
      {
        path: 'list-order',
        name: 'menu-8',
        component: () => import('../components/order/listOrder/ListOrder.vue')
      },
      //  {
      //   path: 'order-edit/:id',
      //   name: 'order-edit',
      //   component: () => import('../components/order/editOrder/editOrder.vue'),
      //   props: (route) => ({ page: route.query.id })
      // },
      {
        path: 'view-order-detail/:id',
        name: 'view-order-detail',
        component: () => import('../components/order/viewOrder/viewOrder.vue')
      }
    ]
  }
];

export default seller;
