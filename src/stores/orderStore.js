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
      // this.fetchOrders(this.currentPage);
    },


    async fetchOrders(page = 1, size = 10, id = null) {
      try {
        const response = await apiServices.getAllOrder(page - 1, size, id);
        console.log('Response orders:', response);

        if (response?.data?.data) {
          this.orders = response.data.data.content;
          this.totalElements = response.data.data.totalElements;
          this.totalPages = response.data.data.totalPages;
          this.currentPage = page;
        } else {
          this.orders = [];
          this.totalElements = 0;
          this.totalPages = 0;
        }
      } catch (error) {
        console.error('Error fetching orders:', error);
        this.orders = [];
        this.totalElements = 0;
        this.totalPages = 0;
      }
    },

    async fetchOrdersUser(page = 1, size = 10, id = null) {
      try {
        const response = await apiServices.getAllOrderUser(page - 1, size, id);
        console.log('Response orders:', response);

        if (response?.data?.data) {
          this.orders = response.data.data.content;
          this.totalElements = response.data.data.totalElements;
          this.totalPages = response.data.data.totalPages;
          this.currentPage = page;
        } else {
          this.orders = [];
          this.totalElements = 0;
          this.totalPages = 0;
        }
      } catch (error) {
        console.error('Error fetching orders:', error);
        this.orders = [];
        this.totalElements = 0;
        this.totalPages = 0;
      }
    },

    async deleteOrder(id) {
      const result = await Swal.fire({
        title: 'Bạn chắc chắn muốn xóa nhà cung cấp này?',
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
      // Xác định các trạng thái có thể chuyển đổi dựa trên trạng thái hiện tại
      const statusOptions = {
        COMPLETED: ['COMPLETED'], // Không thể chuyển đổi
        CANCELLED: ['CANCELLED'], // Không thể chuyển đổi
        PENDING: ['PENDING', 'CONFIRMED', 'CANCELLED'],
        CONFIRMED: ['CONFIRMED', 'PACKED', 'CANCELLED'],
        PACKED: ['PACKED', 'SHIPPED', 'CANCELLED'],
        SHIPPED: ['SHIPPED', 'RETURNED', 'COMPLETED'],
        RETURNED: ['RETURNED'] // Không thể chuyển đổi
      };

      const availableStatuses = statusOptions[status] || [];

      const { value: formValues } = await Swal.fire({
        title: 'Thay đổi trạng thái đơn hàng',
        html:
          `<select id="swal-input2" class="swal2-input">` +
          availableStatuses
            .map(
              (option) =>
                `<option value="${option}" ${status === option ? 'selected' : ''}>${option.charAt(0) + option.slice(1).toLowerCase()}</option>`
            )
            .join('') +
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

    async fetchOrdersAdmin(page = 1, size = 10, id = null) {
      try {
        const response = await apiServices.getAllOrderAdmin(page - 1, size, id);
        console.log('Response orders:', response);

        if (response?.data?.data) {
          this.orders = response.data.data.content;
          this.totalElements = response.data.data.totalElements;
          this.totalPages = response.data.data.totalPages;
          this.currentPage = page;
        } else {
          this.orders = [];
          this.totalElements = 0;
          this.totalPages = 0;
        }
      } catch (error) {
        console.error('Error fetching orders:', error);
        this.orders = [];
        this.totalElements = 0;
        this.totalPages = 0;
      }
    },

    async fetchOrdersByStatus(status, page = 1, size = 10, id = null) {
      try {
        // Gọi API từ apiServices.getListStatusOrder với các tham số cần thiết
        const response = await apiServices.getListStatusOrder(status, page, size, id);
        console.log('Orders by status and id:', response);

        // Cập nhật state với dữ liệu phân trang từ API
        this.orders = response?.data?.data?.content || []; // Lưu danh sách đơn hàng
        this.totalElements = response?.data?.data?.totalElements || 0; // Tổng số phần tử
        this.totalPages = response?.data?.data?.totalPages || 0; // Tổng số trang
        this.currentPage = page; // Trang hiện tại
        this.pageSize = size; // Kích thước mỗi trang
      } catch (error) {
        console.error('Error fetching orders by status and id:', error);
        throw error;
      }
    },

    async getListStatusOrderBySeller(status, page = 1, size = 10, id = null) {
      try {
        // Gọi API từ apiServices.getListStatusOrder với các tham số cần thiết
        const response = await apiServices.getListStatusOrderBySeller(status, page, size, id);
        console.log('Orders by status and id:', response);

        // Cập nhật state với dữ liệu phân trang từ API
        this.orders = response?.data?.data?.content || []; // Lưu danh sách đơn hàng
        this.totalElements = response?.data?.data?.totalElements || 0; // Tổng số phần tử
        this.totalPages = response?.data?.data?.totalPages || 0; // Tổng số trang
        this.currentPage = page; // Trang hiện tại
        this.pageSize = size; // Kích thước mỗi trang
      } catch (error) {
        console.error('Error fetching orders by status and id:', error);
        throw error;
      }
    },

    async getListStatusOrderByAdmin(status, page = 1, size = 10, id = null) {
      try {
        // Gọi API từ apiServices.getListStatusOrder với các tham số cần thiết
        const response = await apiServices.getListStatusOrderByAdmin(status, page, size, id);
        console.log('Orders by status and id:', response);

        // Cập nhật state với dữ liệu phân trang từ API
        this.orders = response?.data?.data?.content || []; // Lưu danh sách đơn hàng
        this.totalElements = response?.data?.data?.totalElements || 0; // Tổng số phần tử
        this.totalPages = response?.data?.data?.totalPages || 0; // Tổng số trang
        this.currentPage = page; // Trang hiện tại
        this.pageSize = size; // Kích thước mỗi trang
      } catch (error) {
        console.error('Error fetching orders by status and id:', error);
        throw error;
      }
    }
  }
});
