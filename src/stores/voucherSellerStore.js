import { defineStore } from 'pinia';
import apiServices from '@/domain/apiServices';
import Swal from 'sweetalert2';
import _ from 'lodash';
import router from '@/router/index.js';

export const useVoucherStore = defineStore('vouchers', {
  state: () => ({
    vouchers: [],
    detail: {
      coupon_code: '',
      discount_type: 'FIXEDAMOUNT',
      discount_value: 0,
      expired_at: null,
      is_active: false,
      is_public: false,
      maximum_discount_value: 0,
      name: '',
      start_at: null,
      quantity: 0,
      minimum_quantity_needed: 0,
      type_repeat: 'DAILY'
    },
    totalElements: 0,
    currentPage: 1,
    pageSize: 10
  }),
  actions: {
    updatePagination({ currentPage }) {
      this.currentPage = currentPage;
      this.fetchVouchers(this.currentPage);
    },

    async fetchVouchers(page = 1, searchQuery = '') {
      Swal.fire({
        title: 'Loading...',
        text: 'Vui lòng chờ...',
        icon: 'info',
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        }
      });
      const response = await apiServices.getAllVoucher(page, this.pageSize, searchQuery);
      Swal.close();
      const data = response.data.data.content;

      this.vouchers = _.map(data, (item, index) => ({
        ...item,
        stt: (page - 1) * this.pageSize + index + 1
      }));

      this.totalElements = response.data.data.totalElements;
    },

    async createVoucher(voucher) {
      Swal.fire({
        title: 'Loading...',
        text: 'Vui lòng chờ...',
        icon: 'info',
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        }
      });

      const response = await apiServices.createVoucher(voucher);
      Swal.close();

      if (response.data.code === 200) {
        Swal.fire({
          position: 'top-end',
          icon: 'success',
          title: 'Thêm mới thành công',
          showConfirmButton: false,
          timer: 1500
        });
        location.reload();
      }
    },

    async detailVoucher(id) {
      const response = await apiServices.getVoucherById(id);
      this.detail = response.data.data;
      console.log(this.detail);
      router.push({ name: 'voucher-detail', params: { id } });
    },

    async editVoucher(id) {
      const response = await apiServices.getVoucherById(id);
      this.detail = response.data.data;
      // console.log(this.detail);
      router.push({ name: 'voucher-update', params: { id } });
    },

    async updateVoucher(id, newVoucher) {
      const response = await apiServices.updateVoucher(id, newVoucher);
      // console.log(response.data.code);
      if (response.data.code === 200) {
        await this.detailVoucher(id);
        router.push({ name: 'voucher-detail', params: { id } });
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

    async deleteVoucher(id) {
      const result = await Swal.fire({
        title: 'Bạn chắc chắn muốn xóa mã này?',
        text: 'Bạn sẽ không thể hoàn tác thao tác này!',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Xác nhận!'
      });

      if (result.isConfirmed) {
        await apiServices.deleteVoucher(id);
        this.currentPage = 1;
        await this.fetchVouchers();
        await Swal.fire({
          title: 'Deleted!',
          text: 'Kho hàng đã được xóa thành công',
          icon: 'success'
        });
      }
    }
  }
});
