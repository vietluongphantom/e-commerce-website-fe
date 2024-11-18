// src/stores/warehouseStore.js

import { defineStore } from 'pinia';
import apiServices from '@/domain/apiServices';
import Swal from 'sweetalert2';
import _ from 'lodash';
import router from '@/router/index.js';
export const useInventoryStore = defineStore('inventory', {
  state: () => ({
    inventories: [],
    detail: {
      name: '',
      warehouse: '',
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
      this.fetchInventories(this.currentPage);
    },

    async fetchInventories(page = 1, searchQuery = '', skuCode = '') {
      const response = await apiServices.getAllInventory(page, this.pageSize, searchQuery, skuCode);
      // const reversedData = _.reverse(_.clone(response.data.data.content));
      console.log("vào được đây chưa",response.data.data.content )
      const reversedData = response.data.data.content;

      this.inventories = _.map(reversedData, (item, index) => ({
        ...item,
        stt: (page - 1) * this.pageSize + index + 1
      }));
      this.totalElements = response.data.data.totalElements;
    },

    async detailInventory(id) {
      const response = await apiServices.getDetailInventory(id);
      this.detail = response.data.data;
      // router.push({ name: 'warehouse-edit' });
      router.push({ name: 'inventory-edit', params: { id } });
    },

    async addInventory(newInventory) {
      await apiServices.addInventory(newInventory);
      this.currentPage = 1;
      await this.fetchInventories();
      router.push({ name: 'menu-12' });
      Swal.fire({
        position: 'top-end',
        icon: 'success',
        title: 'Nhập kho thành công',
        showConfirmButton: false,
        timer: 1500
      });
    },

    // async updateInventory(id, newInventory) {
    //   const response = await apiServices.updateInventory(id, newInventory);
    //   // console.log(response.data.code);
    //   if (response.data.code === 200) {
    //     this.currentPage = 1;
    //     await this.fetchInventories();
    //     router.push({ name: 'menu-10' });
    //     Swal.fire({
    //       position: 'top-end',
    //       icon: 'success',
    //       title: 'Cập nhật thành công!',
    //       showConfirmButton: false,
    //       timer: 1500
    //     });
    //   } else {
    //     Swal.fire({
    //       icon: 'error',
    //       title: 'Oops...',
    //       text: 'Bạn thử lại sau nhé!',
    //       footer: '<a href="#">Lỗi phản hồi từ máy chủ?</a>'
    //     });
    //   }
    // },

    async deleteInventory(id) {
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
        await apiServices.deleteInventory(id);
        this.currentPage = 1;
        await this.fetchInventories();
        await Swal.fire({
          title: 'Deleted!',
          text: 'Kho hàng đã được xóa thành công',
          icon: 'success'
        });
      }
    }
  }
});
