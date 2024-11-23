// src/stores/warehouseStore.js

import { defineStore } from 'pinia';
import apiServices from '@/domain/apiServices';
import Swal from 'sweetalert2';
import _ from 'lodash';
import router from '@/router/index.js';

export const useWarehouseStore = defineStore('warehouse', {
  state: () => ({
    warehouses: [],
    detail: {
      name: '',
      country: '',
      province: '',
      district: '',
      commune: '',
      address_detail: ''
    },
    totalElements: 0,
    currentPage: 1,
    pageSize: 10
  }),
  actions: {
    updatePagination({ currentPage }) {
      this.currentPage = currentPage;
      this.fetchWarehouses(this.currentPage);
    },

    async fetchWarehouses(page = 1, searchQuery = '') {
      Swal.fire({
        title: 'Loading...',
        text: 'Vui lòng chờ...',
        icon: 'info',
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        }
      });
      const response = await apiServices.getAllWarehouse(page, this.pageSize, searchQuery);
      // const reversedData = _.reverse(_.clone(response.data.data.content));
      Swal.close();
      const reversedData = response.data.data.content;

      this.warehouses = _.map(reversedData, (item, index) => ({
        ...item,
        stt: (page - 1) * this.pageSize + index + 1
      }));
      this.totalElements = response.data.data.totalElements;
    },

    async detailWarehouse(id) {
      const response = await apiServices.getDetailWarehouse(id);
      this.detail = response.data.data;
      // router.push({ name: 'warehouse-edit' });
      router.push({ name: 'warehouse-edit', params: { id } });
    },

    async addWarehouse(newWarehouse) {
      await apiServices.addWarehouse(newWarehouse);
      this.currentPage = 1;
      await this.fetchWarehouses();
      router.push({ name: 'menu-10' });
      Swal.fire({
        position: 'top-end',
        icon: 'success',
        title: 'Thêm kho thành công',
        showConfirmButton: false,
        timer: 1500
      });
    },

    async updateWarehouse(id, newWarehouse) {
      const response = await apiServices.updateWarehouse(id, newWarehouse);
      // console.log(response.data.code);
      if (response.data.code === 200) {
        this.currentPage = 1;
        await this.fetchWarehouses();
        router.push({ name: 'menu-10' });
        Swal.fire({
          position: 'top-end',
          icon: 'success',
          title: 'Cập nhật thành công!',
          showConfirmButton: false,
          timer: 1500
        });
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Bạn thử lại sau nhé!',
          footer: '<a href="#">Lỗi phản hồi từ máy chủ?</a>'
        });
      }
    },

    async deleteWarehouse(id) {
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
        await apiServices.deleteWarehouse(id);
        this.currentPage = 1;
        await this.fetchWarehouses();
        await Swal.fire({
          title: 'Deleted!',
          text: 'Kho hàng đã được xóa thành công',
          icon: 'success'
        });
      }
    }
  }
});
