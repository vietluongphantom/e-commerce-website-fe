
import { defineStore } from 'pinia';
import apiServices from '@/domain/apiServices';
import Swal from 'sweetalert2';
import _ from 'lodash';
import router from '@/router/index.js';

export const useBrand = defineStore('brand', {
  state: () => ({
    brand: [],
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
      this.fetchBrand(this.currentPage);
    },

    async fetchBrand(page = 1, searchQuery = '') {
      const response = await apiServices.getAllBrand(page, this.pageSize, searchQuery);
      // console.log("page:",page, this.pageSize, searchQuery)
      // const reversedData = _.reverse(_.clone(response.data.data.content));
      const reversedData = response.data.data.content;

      this.brand = _.map(reversedData, (item, index) => ({
        ...item,
        stt: (page - 1) * this.pageSize + index + 1
      }));
      this.totalElements = response.data.data.totalElements;
    },

    async detailBrand(id) {
      const response = await apiServices.getDetailBrand(id);
      this.detail = response.data.data;
      // router.push({ name: 'warehouse-edit' });
      router.push({ name: 'brand-edit', params: { id } });
    },

    async addBrand(newValue){
      try {
        await apiServices.addBrand(newValue);
        this.fetchBrand(this.current);
        // reverse.value = true;
        await Swal.fire({
          title: 'Thành công!',
          text: 'Nhãn hiệu của bạn đã được thêm.',
          icon: 'success'
        });
        // reverse.value = false;
      } catch (error) {
        console.error('Error deleting brand:', error);
        await Swal.fire({
          title: 'Error!',
          text: 'Bạn thử lại sau nhé',
          icon: 'error'
        });
      }
    },
    

    async updateBrand(id, newBrand) {
      const response = await apiServices.updateBrand(id, newBrand);
      // console.log(response.data.code);
      if (response.data.code === 200) {
        this.currentPage = 1;
        await this.fetchBrand();
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

    async deleteBrand(id) {
      const result = await Swal.fire({
        title: 'Bạn chắc chắn muốn xóa nhãn hiệu này?',
        text: 'Bạn sẽ không thể hoàn tác thao tác này!',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Xác nhận!'
      });

      if (result.isConfirmed) {
        await apiServices.deleteBrand(id);
        this.currentPage = 1;
        await this.fetchBrand();
        await Swal.fire({
          title: 'Deleted!',
          text: 'Nhãn hiệu đã được xóa thành công',
          icon: 'success'
        });
      }
    },


    async editBrand(id, status, name) {
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
        await apiServices.editBrand(id, categoryName, selectedStatus);
        this.fetchBrand(this.current);
        await Swal.fire({
          title: 'Saved!',
          text: 'Your category has been saved.',
          icon: 'success'
        });
      }
    },
  }

});
