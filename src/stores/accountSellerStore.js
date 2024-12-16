import { defineStore } from 'pinia';
import apiServices from '@/domain/apiServices';
import Swal from 'sweetalert2';
import _ from 'lodash';
import router from '@/router/index.js';

import axios from 'axios';

export const useSellersStore = defineStore('sellersStore', {
  state: () => ({
    sellerInfo: [],
    sellers: [],
    totalElements: 0,
    currentPage: 1,
    pageSize: 10,
    sellerDetails: {
      phone: null,
      gender: null,
      fullName: '',
      email: ''

      // sellers: [], // Danh sách người bán từ API
      // totalElements: 0, // Tổng số phần tử (nếu cần tính pagination)
      // currentPage: 1, // Trang hiện tại
      // pageSize: 10, // Số phần tử trên mỗi trang
      // sellerDetails: {
      //   id: null,
      //   phone: null,
      //   gender: null,
      //   email: null,
      //   fullName: '', // Tên đầy đủ
      //   roles: [] // Vai trò
      //
    }
  }),

  actions: {
    updatePagination({ currentPage }) {
      this.currentPage = currentPage;
      this.fetchSellers(this.currentPage);
    },

    async fetchSellers(page = 1) {
      const response = await apiServices.getListSeller(page, this.pageSize);
      console.log('Full API response:', response);
      const content = response.data.data;

      this.sellers = _.map(content, (seller, index) => ({
        ...seller,
        stt: (page - 1) * this.pageSize + index + 1
      }));

      this.totalElements = response.data.data.totalElements;
    },

    async getSellerById(id) {
      const response = await apiServices.getDetailSeller(id);
      const { phone, gender, fullName, email } = response.data.data;
      this.sellerDetails = {
        phone,
        gender,
        fullName,
        email
      };
      console.log(this.sellerDetails);
      router.push({ name: 'detail-seller', params: { id } });
    },

    async addSeller(newSeller) {
      try {
        await axios.post('http://localhost:3000/api/v1/admin/sellers', newSeller);
        await this.fetchSellers(this.currentPage);
      } catch (error) {
        console.error('Lỗi khi thêm người bán:', error);
      }
    },

    async updateSeller(id, updatedSeller) {
      try {
        await axios.put(`http://localhost:3000/api/v1/admin/sellers/${id}`, updatedSeller);
        await this.fetchSellers(this.currentPage);
      } catch (error) {
        console.error('Lỗi khi cập nhật người bán:', error);
      }
    },

    async deleteSeller(id) {
      try {
        await axios.delete(`http://localhost:3000/api/v1/admin/sellers/${id}`);
        await this.fetchSellers(this.currentPage);
      } catch (error) {
        console.error('Lỗi khi xóa người bán:', error);
      }
    },
    async getBasicInfo() {
      const response = await apiServices.getBasicInfo();
      const content = response.data.data;
      this.sellerInfo = content;
    },

    async editStatusUser(id, status) {
      try {
        const normalizedStatus = status ? 'ACTIVE' : 'INACTIVE';

        const { value: newStatus } = await Swal.fire({
          title: 'Thay đổi trạng thái tài khoản',
          html:
            `<select id="swal-input2" class="swal2-input">` +
            `<option value="ACTIVE" ${normalizedStatus === 'ACTIVE' ? 'selected' : ''}>Active</option>` +
            `<option value="INACTIVE" ${normalizedStatus === 'INACTIVE' ? 'selected' : ''}>Inactive</option>` +
            `</select>`,
          focusConfirm: false,
          showCancelButton: true,
          confirmButtonText: 'Xác nhận',
          cancelButtonText: 'Hủy',
          preConfirm: () => {
            return document.getElementById('swal-input2').value;
          }
        });

        if (newStatus) {
          try {
            // Gọi API
            await apiServices.editStatusUser({
              userId: id,
              status: newStatus === 'ACTIVE'
            });

            // Cập nhật state
            const sellerIndex = this.sellers.findIndex((seller) => seller.id === id);
            if (sellerIndex !== -1) {
              this.sellers[sellerIndex] = {
                ...this.sellers[sellerIndex],
                status: newStatus === 'ACTIVE'
              };
            }

            await Swal.fire({
              title: 'Thành công!',
              text: 'Trạng thái đã được cập nhật.',
              icon: 'success'
            });
          } catch (apiError) {
            console.error('API Error:', apiError);
            await Swal.fire({
              title: 'Lỗi!',
              text: 'Không thể cập nhật trạng thái.',
              icon: 'error'
            });
          }
        }
      } catch (error) {
        console.error('Unexpected Error:', error);
      }
    }
  }
});
