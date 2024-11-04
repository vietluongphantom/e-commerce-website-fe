
import { defineStore } from 'pinia';
import apiServices from '@/domain/apiServices';
import Swal from 'sweetalert2';
import _ from 'lodash';
import router from '@/router/index.js';

export const useCategory = defineStore('category', {
  state: () => ({
    category: [],
    detail: {
      name: '',
      created_at: '',
      modified_at: ''
    },
    totalElements: 0,
    currentPage: 1,
    pageSize: 10
  }),
  actions: {
    updatePagination({ currentPage }) {
      this.currentPage = currentPage;
      console.log("change currentPage")
      this.fetchCategory(this.currentPage);
    },

    async fetchCategory(page = 1, searchQuery = '') {
      const response = await apiServices.getAllCategory(page, this.pageSize, searchQuery);
      // console.log("page:",page, this.pageSize, searchQuery)
      // const reversedData = _.reverse(_.clone(response.data.data.content));
      const reversedData = response.data.data.content;

      this.category = _.map(reversedData, (item, index) => ({
        ...item,
        stt: (page - 1) * this.pageSize + index + 1
      }));
      this.totalElements = response.data.data.totalElements;
    },

    async detailCategory(id) {
      const response = await apiServices.getDetailCategory(id);
      this.detail = response.data.data;
      // router.push({ name: 'warehouse-edit' });
      router.push({ name: 'category-edit', params: { id } });
    },

    async addCategory(newValue){
      try {
        await apiServices.addCategory(newValue);
        this.fetchCategory(this.current);
        // reverse.value = true;
        await Swal.fire({
          title: 'Thành công!',
          text: 'Danh mục của bạn đã được thêm.',
          icon: 'success'
        });
        // reverse.value = false;
      } catch (error) {
        console.error('Error deleting category:', error);
        await Swal.fire({
          title: 'Error!',
          text: 'Bạn thử lại sau nhé',
          icon: 'error'
        });
      }
    },

    async updateCategory(id, newCategory) {
      const response = await apiServices.updateCategory(id, newCategory);
      // console.log(response.data.code);
      if (response.data.code === 200) {
        this.currentPage = 1;
        await this.fetchCategory();
        router.push({ name: 'menu-10' });
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

    async deleteCategory(id) {
      const result = await Swal.fire({
        title: 'Bạn chắc chắn muốn xóa danh mục này?',
        text: 'Bạn sẽ không thể hoàn tác thao tác này!',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Xác nhận!'
      });

      if (result.isConfirmed) {
        await apiServices.deleteCategory(id);
        this.currentPage = 1;
        await this.fetchCategory();
        await Swal.fire({
          title: 'Deleted!',
          text: 'Danh mục đã được xóa thành công',
          icon: 'success'
        });
      }
    },


    async editCategory(id, status, name) {
      const { value: formValues } = await Swal.fire({
        title: 'Thay đổi thông tin danh mục',
        html:
          '<input id="swal-input1" class="swal2-input" placeholder="Tên danh mục mới" value="' +
          name +
          '">' +
          `<select id="swal-input2" class="swal2-input">` +
          `<option value="true" ${status === true ? 'selected' : ''}>Active</option>` +
          `<option value="false" ${status === false ? 'selected' : ''}>Inactive</option>` +
          `</select>`,
        focusConfirm: false,
        showCancelButton: true,
        confirmButtonText: 'Xác nhận',
        cancelButtonText: 'Hủy',
        preConfirm: () => {
          return [document.getElementById('swal-input1').value, document.getElementById('swal-input2').value];
        }
      });
    
      if (formValues) {
        const [categoryName, selectedStatus] = formValues;
        await apiServices.editCategory(id, categoryName, selectedStatus);
        this.fetchCategory(this.current);
        await Swal.fire({
          title: 'Saved!',
          text: 'Your category has been saved.',
          icon: 'success'
        });
      }
    },
  }

});
