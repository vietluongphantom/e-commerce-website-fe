// src/stores/useInfoStore.js
import { defineStore } from 'pinia';
import apiServices from '@/domain/apiServices';
import Swal from 'sweetalert2';

export const useInfoStore = defineStore('info', {
  state: () => ({
    userInfo: {
      tax: '',
      cccd: '',
      email: '',
      full_name: '',
      phone: '',
      gender: null,
      country: null,
      province: null,
      district: null,
      commune: null,
      address_detail: null
    },
    shopInfo: {
      name: '',
      mail: '',
      phone: null,
      country: null,
      province: null,
      district: null,
      commune: null,
      address_detail: null
    }
  }),
  actions: {
    async fetchUserInfo() {
      const response = await apiServices.getSeller();
      this.userInfo = response.data.data;
      console.log(this.userInfo.gender);
    },

    async updateUserInfo(newUserInfo) {
      const response = await apiServices.updateUserInfo(newUserInfo);
      this.userInfo = response.data.data;
      // console.log('Sau update');
      // console.log(this.userInfo.gender)
      if (response.data.code === 200) {
        Swal.fire({
          position: 'top-end',
          icon: 'success',
          title: 'Lưu thành công',
          showConfirmButton: false,
          timer: 1500
        });
      }
    },

    async fetchShopInfo() {
      const response = await apiServices.getShop();
      this.shopInfo = response.data.data;
    },
    async updateShopInfo(newShopInfo) {
      const response = await apiServices.updateShopInfo(newShopInfo);
      this.shopInfo = response.data.data;
      // console.log(this.shopInfo);
      if (response.data.code === 200) {
        Swal.fire({
          position: 'top-end',
          icon: 'success',
          title: 'Lưu thành công',
          showConfirmButton: false,
          timer: 1500
        });
      }
    }
  }
});
