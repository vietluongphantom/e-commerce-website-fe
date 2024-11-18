import { defineStore } from 'pinia';
import apiServices from '@/domain/apiServices';
import _ from 'lodash';
import router from '@/router/index.js';
import Swal from 'sweetalert2';

import axios from 'axios';

export const useUsersStore = defineStore('usersStore', {
  state: () => ({
    users: [],
    totalElements: 0,
    currentPage: 1,
    pageSize: 10,
    userDetails: {
      phone: null,
      gender: null,
      full_name: '',
      email: ''
    }
  }),

  actions: {
    updatePagination({ currentPage }) {
      this.currentPage = currentPage;
      this.fetchUsers(this.currentPage);
    },

    async fetchUsers(page = 1) {
      const response = await apiServices.getListUser(page, this.pageSize);
      const content = response.data.data.content;

      this.users = _.map(content, (user, index) => ({
        ...user,
        stt: (page - 1) * this.pageSize + index + 1
      }));

      this.totalElements = response.data.data.totalElements;
    },

    async getUserById(id) {
      const response = await apiServices.getDetailUser(id);
      const { phone, gender, full_name, email } = response.data.data;
      this.userDetails = {
        phone,
        gender,
        full_name,
        email
      };
      router.push({ name: 'detail-user', params: { id } });
    },

    async addUser(newUser) {
      try {
        console.log(newUser);
        const response = await apiServices.addUser(newUser);
        if (response.data.code === 200) {
          Swal.fire({
            position: 'top-end',
            icon: 'success',
            title: 'Thêm thành công',
            showConfirmButton: false,
            timer: 1500
          });
        }
        router.push({name: 'admin-menu-6'});
      } catch (error) {
        console.error('Lỗi khi thêm người bán:', error);
      }
    },

    async updateUser(id, updatedUser) {
      try {
        await axios.put(`http://localhost:3000/api/v1/admin/users/${id}`, updatedUser);
        await this.fetchUsers(this.currentPage);
      } catch (error) {
        console.error('Lỗi khi cập nhật người bán:', error);
      }
    },

    async deleteUser(id) {
      try {
        await axios.delete(`http://localhost:3000/api/v1/admin/Users/${id}`);
        await this.fetchUsers(this.currentPage);
      } catch (error) {
        console.error('Lỗi khi xóa người bán:', error);
      }
    }
  }
});
