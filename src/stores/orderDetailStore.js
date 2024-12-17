import { defineStore } from 'pinia';
import apiServices from '@/domain/apiServices';
import Swal from 'sweetalert2';
import _ from 'lodash';
import router from '@/router/index.js';

// export const useOrderStore = defineStore('orderDetail', {
//   state: () => ({
//     orders: [],
//     status: '',
//     method: '',
//     orderItems: [],
//     total_price: '',
//   }),

//   actions: {
//     async getOrder(id) {
//       try {
//         const response = await apiServices.getOrder(id);
//         this.detail = response.data.data;
//         console.log('response kien', response);
//         router.push({ name: 'view-order-detail', params: { id } });
//       } catch (error) {
//         console.error('Error fetching cart items:', error);
//       }
//     }
//   }
// });

export const useOrderStore = defineStore('orderDetail', {
  state: () => ({
    orders: null // Để null để dễ kiểm tra
  }),
  actions: {
    // async getOrder(id) {
    //   try {
    //     const response = await apiServices.getOrder(id);
    //     // Lưu toàn bộ object response.data.data
    //     this.orders = response.data.data;
    //     return response.data.data;
    //   } catch (error) {
    //     console.error('Lỗi tìm nạp đơn hàng:', error);
    //     throw error;
    //   }
    // }
    async getOrder(id) {
      try {
        const response = await apiServices.getOrder(id);
        const orderData = response.data.data;

        // Kiểm tra nếu order có các mục (orderItems)
        if (orderData.orderItems && Array.isArray(orderData.orderItems)) {
          const promises = _.map(orderData.orderItems, async (item) => {
            const productResponse = await apiServices.getItemCart(item.productItemId); // Lấy chi tiết sản phẩm

            return {
              ...item,
              productDetails: productResponse.data.data // Thêm chi tiết sản phẩm
            };
          });

          // Chờ tất cả các promises hoàn thành
          orderData.orderItems = await Promise.all(promises);
        }

        // Lưu toàn bộ object vào orders
        this.orders = orderData;

        return orderData;
      } catch (error) {
        console.error('Lỗi tìm nạp đơn hàng:', error);
        throw error;
      }
    },
    async getOrderAdmin(id) {
      try {
        const response = await apiServices.getOrder(id);
        const orderData = response.data.data;

        // Kiểm tra nếu order có các mục (orderItems)
        if (orderData.orderItems && Array.isArray(orderData.orderItems)) {
          const promises = _.map(orderData.orderItems, async (item) => {
            const productResponse = await apiServices.getItemCart(item.productItemId); // Lấy chi tiết sản phẩm

            return {
              ...item,
              productDetails: productResponse.data.data // Thêm chi tiết sản phẩm
            };
          });

          // Chờ tất cả các promises hoàn thành
          orderData.orderItems = await Promise.all(promises);
        }

        // Lưu toàn bộ object vào orders
        this.orders = orderData;

        return orderData;
      } catch (error) {
        console.error('Lỗi tìm nạp đơn hàng:', error);
        throw error;
      }
    }
  }
});

