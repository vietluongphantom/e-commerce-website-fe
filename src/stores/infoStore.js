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
    },

    // async fetchSellerInfoByAdmin(id) {
    //   const response = await apiServices.getInfoSellerByAdmin(id);
    //   this.userInfo = response.data.data;
    //   console.log('API Response:', response.data.data);
    //   console.log(this.userInfo.gender);
    // },

    //     async fetchSellerInfoByAdmin(id) {
    //   const response = await apiServices.getInfoSellerByAdmin(id);
    //   if (response?.data?.data) {
    //     this.userInfo = { ...this.userInfo, ...response.data.data }; // Gộp dữ liệu mới và giữ lại các giá trị cũ
    //     console.log(this.userInfo.gender);
    //   } else {
    //     console.error('API không trả dữ liệu hợp lệ');
    //   }
    // },

    // async fetchShopInfoByAdmin(id) {
    //   const response = await apiServices.getShop(id);
    //   this.shopInfo = response.data.data;
    // }

    async fetchSellerInfoByAdmin(id) {
      try {
        const response = await apiServices.getInfoSellerByAdmin(id);
        if (response?.data?.data) {
          this.userInfo = { ...this.userInfo, ...response.data.data }; // Gộp dữ liệu mới vào userInfo
          console.log('API Response:', response.data.data);
          console.log(this.userInfo.gender);
        
        } else {
          console.error('API không trả dữ liệu hợp lệ');
          Swal.fire({
            icon: 'error',
            title: 'Lỗi',
            text: 'Không thể lấy thông tin người bán. Vui lòng thử lại sau!'
          });
        }
      } catch (error) {
        console.error('Lỗi khi gọi API:', error);
        Swal.fire({
          icon: 'error',
          title: 'Lỗi',
          text: 'Không thể kết nối đến server. Vui lòng kiểm tra lại!'
        });
      }
    },
    async fetchShopInfoByAdmin(id) {
      try {
        const response = await apiServices.getShop(id);
        if (response?.data?.data) {
          this.shopInfo = { ...this.shopInfo, ...response.data.data }; // Gộp dữ liệu mới vào shopInfo
        } else {
          console.error('API không trả dữ liệu hợp lệ');
          Swal.fire({
            icon: 'error',
            title: 'Lỗi',
            text: 'Không thể lấy thông tin shop. Vui lòng thử lại sau!'
          });
        }
      } catch (error) {
        console.error('Lỗi khi gọi API:', error);
        Swal.fire({
          icon: 'error',
          title: 'Lỗi',
          text: 'Không thể kết nối đến server. Vui lòng kiểm tra lại!'
        });
      }
    }
  }
});
