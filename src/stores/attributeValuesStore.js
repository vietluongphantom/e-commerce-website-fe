import { defineStore } from 'pinia';
import apiServices from '@/domain/apiServices';
import Swal from 'sweetalert2';
import router from '@/router/index.js';
import _ from 'lodash';





export const useAttributeValuesStore = defineStore('attributeValues', {
    state: () => ({
      attributeValue:[],
      attributeValues: [],
      attributeValuesForm: {
        attribute_id: '',
        value: ''
      }
    }),
  
    actions: {
      async fetchAttributeValues(id) {
        console.log("gọi vào fetch values");
        const response = await apiServices.getListAttributeValues(id);
        this.attributeValues = response.data.data;
      },
  
      createFormData() {
        const formData = new FormData();
        formData.append('name', this.attributeValuesForm.value);
        formData.append('attribute_id', this.attributeValuesForm.attribute_id);
        return formData;
      },
  
      async addAttributeValues(attributeValue,id) {
        this.attributeValuesForm = { ...attributeValue };
        const response = await apiServices.createAttributeValues(attributeValue, id);
        if (response.data.code === 200) {
          Swal.fire({
            position: 'top-end',
            icon: 'success',
            title: 'Thêm giá trị mới thành công',
            showConfirmButton: false,
            timer: 1500
          });
        }
      },
  
      async updateAttributeValues(attributeValue,id) {
        this.attributeValue = { ...attributeValue };
        const formData = this.createFormData();
        const response = await apiServices.updateAttributeValues(formData,id);
        if (response.data.code === 200) {
          Swal.fire({
            position: 'top-end',
            icon: 'success',
            title: 'cập nhật giá trị thành công',
            showConfirmButton: false,
            timer: 1500
          });
        }
      },
  
      async deleteAttributeValues(id) {
        const result = await Swal.fire({
          title: 'Bạn chắc chắn muốn xóa giá trị này?',
          text: 'Bạn sẽ không thể hoàn tác thao tác này!',
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Xác nhận!'
        });
  
        if (result.isConfirmed) {
          await apiServices.deleteAttributeValues(id);
          this.currentPage = 1;
          await this.fetchAttributeValues(id);
          await Swal.fire({
            title: 'Deleted!',
            text: 'Giá trị đã được xóa thành công',
            icon: 'success'
          });
        }
      },
    }
  });
  