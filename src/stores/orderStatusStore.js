// src/stores/warehouseStore.js

import { defineStore } from 'pinia';
import apiServices from '@/domain/apiServices';
import Swal from 'sweetalert2';
import _ from 'lodash';
import router from '@/router/index.js';

export const useOrderStatusStore = defineStore('order', {
  state: () => ({
    orders: [],
    detail: {
      status: '',
      method: '',
      product_id: '',
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
        console.log('respon absc', response);
        this.orders = response.data.data;

      } catch (error) {
        console.error('Error fetching cart items:', error);
      }
    },
    async fetchOrdersUser(page = 1, searchQuery = '', skuCode = '') {
      try {
        const response = await apiServices.getAllOrderUser(page, this.pageSize, searchQuery, skuCode);
        console.log('respon absc', response);
        this.orders = response.data.data;

      
      } catch (error) {
        console.error('Error fetching cart items:', error);
      }
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
    },
 
    async editOrder(id, status) {
      const { value: formValues } = await Swal.fire({
        title: 'Thay đổi trạng thái đơn hàng',
        html:
          `<select id="swal-input2" class="swal2-input">` +
          `<option value="COMPLETED" ${status === 'COMPLETED' ? 'selected' : ''}>Completed</option>` +
          `<option value="PENDING" ${status === 'PENDING' ? 'selected' : ''}>Pending</option>` +
          `<option value="CANCELLED" ${status === 'CANCELLED' ? 'selected' : ''}>Cancelled</option>` +
          `<option value="CONFIRMED" ${status === 'CONFIRMED' ? 'selected' : ''}>Confirmed</option>` +
          `<option value="PACKED" ${status === 'PACKED' ? 'selected' : ''}>Packed</option>` +
          `<option value="SHIPPED" ${status === 'SHIPPED' ? 'selected' : ''}>Shipped</option>` +
          `<option value="DELIVERED" ${status === 'DELIVERED' ? 'selected' : ''}>Delivered</option>` +
          `<option value="RETURNED" ${status === 'RETURNED' ? 'selected' : ''}>Returned</option>` +
          `</select>`,
        focusConfirm: false,
        showCancelButton: true,
        confirmButtonText: 'Xác nhận',
        cancelButtonText: 'Hủy',
        preConfirm: () => {
          return document.getElementById('swal-input2').value;
        }
      });

 
      if (formValues) {
        try {
          // Gọi API để cập nhật trạng thái
          await apiServices.editOrder(id, formValues);

          // Cập nhật trạng thái ngay lập tức trong state local
          const orderIndex = this.orders.findIndex((order) => order.id === id);
          if (orderIndex !== -1) {
            // Tạo bản sao của order và cập nhật trạng thái
            this.orders[orderIndex] = {
              ...this.orders[orderIndex],
              status: formValues
            };
          }

          await Swal.fire({
            title: 'Saved!',
            text: 'Status has been saved.',
            icon: 'success'
          });
        } catch (error) {
          await Swal.fire({
            title: 'Error!',
            text: 'Failed to update status.',
            icon: 'error'
          });
        }
      }
    },

    // Thêm action mới vào useOrderStore
async editOrderByUser(id, status) {
  // Kiểm tra nếu đơn hàng đã hoàn thành
if (status === 'COMPLETED' || status === 'CANCELLED' || status === 'SHIPPED'  || status === 'PACKED' || status === 'RETURNED') {
    await Swal.fire({
      title: 'Không thể hủy đơn hàng',
      text: 'Đơn hàng đã hoàn thành không thể hủy',
      icon: 'error',
      confirmButtonText: 'Đóng'
    });
    return;
  }

  // Hiển thị dialog xác nhận hủy đơn hàng
  const { isConfirmed } = await Swal.fire({
    title: 'Xác nhận hủy đơn hàng',
    text: 'Bạn có chắc chắn muốn hủy đơn hàng này?',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    cancelButtonColor: '#3085d6',
    confirmButtonText: 'Xác nhận hủy',
    cancelButtonText: 'Đóng'
  });

  if (isConfirmed) {
    try {
      // Gọi API để cập nhật trạng thái
      await apiServices.editOrder(id, 'CANCELLED');

      // Cập nhật trạng thái ngay lập tức trong state local
      const orderIndex = this.orders.findIndex((order) => order.id === id);
      if (orderIndex !== -1) {
        this.orders[orderIndex] = {
          ...this.orders[orderIndex],
          status: 'CANCELLED'
        };
      }

      // Thông báo thành công
      await Swal.fire({
        title: 'Thành công!',
        text: 'Đã hủy đơn hàng thành công',
        icon: 'success'
      });
    } catch (error) {
      console.error('Error cancelling order:', error);
      await Swal.fire({
        title: 'Lỗi!',
        text: 'Không thể hủy đơn hàng. Vui lòng thử lại sau.',
        icon: 'error'
      });
    }
  }
},

    async fetchOrdersAdmin(page = 1, searchQuery = '', skuCode = '') {
      try {
        const response = await apiServices.getAllOrderAdmin(page, this.pageSize, searchQuery, skuCode);
        console.log('respon admin', response);
        this.orders = response.data.data;
      } catch (error) {
        console.error('Error fetching cart items:', error);
      }
    }
  }
});
