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
    async getOrder(id) {
      try {
        const response = await apiServices.getOrder(id);
        // Lưu toàn bộ object response.data.data
        this.orders = response.data.data;
        return response.data.data;
      } catch (error) {
        console.error('Lỗi tìm nạp đơn hàng:', error);
        throw error;
      }
    }
  }
});

