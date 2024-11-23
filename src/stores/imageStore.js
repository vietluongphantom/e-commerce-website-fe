import { defineStore } from 'pinia';
import apiServices from '@/domain/apiServices';
import Swal from 'sweetalert2';
import router from '@/router/index.js';
import _ from 'lodash';


export const useImageStore = defineStore('image', {
  state: () => ({
    image:[],
  }),

  actions: {
    // async fetchAttributeProduct(id) {
    //   const response = await apiServices.getListAttributeProduct(id);
    //   console.log("có vô không thì bảo",response.data.data)
    //   this.attributes = response.data.data;
    // },

    createFormData(img) {
      const formData = new FormData();
      formData.append('files', img);

      return formData;
    },

    async upLoadImage(image) {
      const formData = this.createFormData(image[0]);
      console.log("day là fd",image)
      for (let [key, value] of formData.entries()) {
        console.log(`${key}: ${value}`);
      }
      Swal.fire({
        title: 'Đang load ảnh...',
        text: 'Vui lòng chờ...',
        icon: 'info',
        allowOutsideClick: false, 
        didOpen: () => {
          Swal.showLoading();
        }
      });
      const response = await apiServices.upLoadImage(formData);
      this.image = response.data.data 
      Swal.close();
      // Swal.close();
    //   if (response.data.code === 200) {
    //     Swal.fire({
    //       position: 'top-end',
    //       icon: 'success',
    //       title: 'Thêm thuộc tính mới thành công',
    //       showConfirmButton: false,
    //       timer: 1500
    //     });
    //   }
    }
  }
});
