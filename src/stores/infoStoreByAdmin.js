import { defineStore } from 'pinia';
import apiServices from '@/domain/apiServices';
import Swal from 'sweetalert2';

export const useInfoStoreByAdmin = defineStore('infoByAdmin', {
  state: () => ({
    sellerInfo: {
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
    async fetchSellerInfoByAdmin(id) {
      try {
        const response = await apiServices.getInfoSellerByAdmin(id);
        this.sellerInfo = response.data.data;
      } catch (error) {
        console.error('Lỗi khi lấy thông tin người bán:', error);
        Swal.fire({
          icon: 'error',
          title: 'Lỗi',
          text: 'Không thể tải thông tin người bán. Vui lòng thử lại sau.'
        });
      }
    },

    async fetchShopInfoByAdmin(id) {
      try {
        const response = await apiServices.getInfoShopByAdmin(id);
        this.shopInfo = response.data.data;
      } catch (error) {
        console.error('Lỗi khi lấy thông tin cửa hàng:', error);
        Swal.fire({
          icon: 'error',
          title: 'Lỗi',
          text: 'Không thể tải thông tin cửa hàng. Vui lòng thử lại sau.'
        });
      }
    }
  }
});
