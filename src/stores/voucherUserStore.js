import { defineStore } from 'pinia';
import apiServices from '@/domain/apiServices';
import Swal from 'sweetalert2';
import _ from 'lodash';
import router from '@/router/index.js';

export const useUserVoucherStore = defineStore('vouchers', {
  state: () => ({
    vouchers: [],
    detail: {
      name: '',
      country: '',
      province: '',
      district: '',
      commune: '',
      address_detail: ''
    },
    totalElements: 10,
    currentPage: 1,
    pageSize: 10
  }),
  actions: {
    async fetchVouchers(id) {
      console.log(' Có đi vào đây')
      const response = await apiServices.getUserVoucher(id);
      this.vouchers = response.data.data;
      console.log(this.vouchers);
    }
  }
});
