// src/stores/warehouseStore.js

import { defineStore } from 'pinia';
import apiServices from '@/domain/apiServices';
import Swal from 'sweetalert2';
import _ from 'lodash';
import router from '@/router/index.js';

export const useOrderStore = defineStore('order', {
  state: () => ({
    orders: [],
    detail: {
      status: '',
      method: '',
      product_id:'',
      supplier: '',
      location: '',
      quantity: '',
      sku_code: ''
    },
    totalElements: 0,
    currentPage: 1,
    pageSize: 10
  }),
  actions: {
    updatePagination({ currentPage }) {
      this.currentPage = currentPage;
      this.fetchOrders(this.currentPage);
    },

    async fetchOrders(page = 1, searchQuery = '', skuCode = '') {
        try {
            const response = await apiServices.getAllOrder(page, this.pageSize, searchQuery, skuCode);
            console.log("respon absc", response)
             this.orders = response.data.data;

            // const promises = _.map(content, async (item) => {
            //     const [userId, shopResponse] = await Promise.all([
            //       apiServices.getItemCart(item.productItemId),
            //       apiServices.getShopById(item.shopId)
            //     ]);
      
            //     return {
            //       ...item,
            //       productDetails: productResponse.data.data,
            //       shopDetails: shopResponse.data.data
            //     };
            // });
      
              // Chờ tất cả các promises hoàn thành
            //   this.cartItems = await Promise.all(promises);
            //   Swal.close();
            //   this.totalElements = response.data.data.totalElements;
        } catch (error) {
            console.error('Error fetching cart items:', error);
        }
    },
    async fetchOrdersUser(page = 1, searchQuery = '', skuCode = '') {
        try {
            const response = await apiServices.getAllOrderUser(page, this.pageSize, searchQuery, skuCode);
            console.log("respon absc", response)
             this.orders = response.data.data;

            // const promises = _.map(content, async (item) => {
            //     const [userId, shopResponse] = await Promise.all([
            //       apiServices.getItemCart(item.productItemId),
            //       apiServices.getShopById(item.shopId)
            //     ]);
      
            //     return {
            //       ...item,
            //       productDetails: productResponse.data.data,
            //       shopDetails: shopResponse.data.data
            //     };
            // });
      
              // Chờ tất cả các promises hoàn thành
            //   this.cartItems = await Promise.all(promises);
            //   Swal.close();
            //   this.totalElements = response.data.data.totalElements;
        } catch (error) {
            console.error('Error fetching cart items:', error);
        }
    },


    async detailOrder(id) {
      const response = await apiServices.getDetailOrder(id);
      this.detail = response.data.data;
      // router.push({ name: 'warehouse-edit' });
      router.push({ name: 'inventory-edit', params: { id } });
    },

    async deleteOrder(id) {
      const result = await Swal.fire({
        title: 'Bạn chắc chắn muốn xóa kho hàng này?',
        text: 'Bạn sẽ không thể hoàn tác thao tác này!',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Xác nhận!'
      });

      if (result.isConfirmed) {
        await apiServices.deleteOrder(id);
        this.currentPage = 1;
        await this.fetchOrders();
        await Swal.fire({
          title: 'Deleted!',
          text: 'Kho hàng đã được xóa thành công',
          icon: 'success'
        });
      }
    }
  }
});
