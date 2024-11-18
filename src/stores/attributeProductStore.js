import { defineStore } from 'pinia';
import apiServices from '@/domain/apiServices';
import Swal from 'sweetalert2';
import router from '@/router/index.js';
import _ from 'lodash';





export const useAttributeProductStore = defineStore('attributes', {
  state: () => ({
    attribute:[],
    attributes: [],
    attributesForm: {
        product_id: '',
        name: '1'
    }
  }),

  actions: {
    async fetchAttributeProduct(id) {
      const response = await apiServices.getListAttributeProduct(id);
      console.log("có vô không thì bảo",response.data.data)
      this.attributes = response.data.data;
    },

    createFormData() {
      const formData = new FormData();
      formData.append('name', this.attributesForm.name);
      formData.append('product_id', this.attributesForm.product_id);

      return formData;
    },

    async addAttributeProduct(attribute,id) {
      this.attributesForm = { ...attribute };
      console.log('ceateAttribute id', id)
      const response = await apiServices.createAttributeProduct(attribute, id);
      if (response.data.code === 200) {
        Swal.fire({
          position: 'top-end',
          icon: 'success',
          title: 'Thêm thuộc tính mới thành công',
          showConfirmButton: false,
          timer: 1500
        });
      }
    },

    // async fetchAttributeProduct(id) {
    //   const response = await apiServices.getAttributeProduct(id);
    //   this.product = response.data.data;
    // },

    async updateAttributeProduct(attribute,id) {
      this.AttributeProduct = { ...attribute };
      const formData = this.createFormData();
      const response = await apiServices.updateAttributeProduct(formData,id);
      if (response.data.code === 200) {
        Swal.fire({
          position: 'top-end',
          icon: 'success',
          title: 'cập nhật thuộc tính thành công',
          showConfirmButton: false,
          timer: 1500
        });
      }
    },

    async deleteAttributeProduct(id) {
      const result = await Swal.fire({
        title: 'Bạn chắc chắn muốn xóa thuộc tính này?',
        text: 'Bạn sẽ không thể hoàn tác thao tác này!',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Xác nhận!'
      });

      if (result.isConfirmed) {
        await apiServices.deleteAttributeProduct(id);
        this.currentPage = 1;
        await this.fetchAttributeProduct(id);
        await Swal.fire({
          title: 'Deleted!',
          text: 'Thuộc tính đã được xóa thành công',
          icon: 'success'
        });
      }
    },
  }
});
