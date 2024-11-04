import { defineStore } from 'pinia';
import apiServices from '@/domain/apiServices';
import _ from 'lodash';
import router from '@/router/index.js';

import axios from 'axios';

export const useSellersStore = defineStore('sellersStore', {
  state: () => ({
    sellerInfo:[],
    sellers: [],
    totalElements: 0,
    currentPage: 1,
    pageSize: 10,
    sellerDetails: {
      phone: null,
      gender: null,
      fullName: '',
      email: ''
    }
  }),

  actions: {
    updatePagination({ currentPage }) {
      this.currentPage = currentPage;
      this.fetchSellers(this.currentPage);
    },

    async fetchSellers(page = 1) {
      const response = await apiServices.getListSeller(page, this.pageSize);
      const content = response.data.data.content;

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
      const content = response.data.data
      this.sellerInfo = content;
    },
  }
});
