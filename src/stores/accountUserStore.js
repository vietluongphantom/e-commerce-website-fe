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
      const content = response.data.data;

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
            const userIndex = this.users.findIndex((user) => user.id === id);
            if (userIndex !== -1) {
              this.users[userIndex] = {
                ...this.users[userIndex],
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
