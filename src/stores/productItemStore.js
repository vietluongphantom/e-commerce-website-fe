import { defineStore } from 'pinia';
import apiServices from '@/domain/apiServices';
import Swal from 'sweetalert2';
import router from '@/router/index.js';
import _ from 'lodash';


export const useProductItemStore = defineStore('productItems', {
  state: () => ({
    productItem:[],
    productItems: [],
    totalElements: 0,
    currentPage: 1,
    pageSize: 10,
    productItemForm: {
      price: null,
      sku_code: '',
      import_price: null,
      product_id: null,
      attribute_value_id:[]
    }
  }),

  actions: {
    updatePagination({ currentPage }) {
      this.currentPage = currentPage;
      this.fetchProductItems(this.currentPage);
    },

    async fetchProductItems(id,page = 1) {
      const response = await apiServices.getListProductItem(id,page, this.pageSize);
      const content = response.data.data.content;
      console.log("response.data.data.productResponses", content)

      this.productItems = _.map(content, (productItem, index) => ({
        ...productItem,
        stt: (page - 1) * this.pageSize + index + 1
      }));

      console.log("this.productItems",this.productItems)
      this.totalElements = response.data.data.totalPages * this.pageSize;
    },

    createFormData() {
      const formData = new FormData();
      formData.append('price', this.productItemForm.price);
      formData.append('sku_code', this.productItemForm.sku_code);
      formData.append('import_price', this.productItemForm.import_price);
      formData.append('product_id', this.productItemForm.product_id);
      return formData;
    },

    // async addProductItem(productItem) {
    //   this.productItemForm = {...productItem };
    //   const response = await apiServices.createProductItem(this.productItemForm);
    //   router.push({ name: 'product-item' });
    //   if (response.data.code === 200) {
    //     Swal.fire({
    //       position: 'top-end',
    //       icon: 'success',
    //       title: 'Thêm mới mã sản phẩm thành công',
    //       showConfirmButton: false,
    //       timer: 1500
    //     });
    //   }
    // },

    async addProductItem(productItem) {
      this.productItemForm = { ...productItem };
    
      try {
        const response = await apiServices.createProductItem(this.productItemForm);
    
        if (response.data.code === 200) {
          Swal.fire({
            position: 'top-end',
            icon: 'success',
            title: 'Thêm mới mã sản phẩm thành công',
            showConfirmButton: false,
            timer: 1500
          });
          router.push({ name: 'product-item' });
        } else {
          Swal.fire({
            position: 'top-end',
            icon: 'error',
            title: `Lỗi: ${response.data.message || 'Không xác định'}`,
            showConfirmButton: false,
            timer: 3000
          });
        }
      } catch (error) {
        console.error('Error adding product item:', error);
        Swal.fire({
          position: 'top-end',
          icon: 'error',
          title: 'Đã có lỗi xảy ra khi thêm sản phẩm!',
          text: error.response?.data?.message || 'Vui lòng kiểm tra lại mã sản phẩm và thuộc tính',
          showConfirmButton: true,
          timer: 3000
        });
      }
    },

    async fetchProductItem(id) {
      const response = await apiServices.getProductItem(id);
      this.productItem = response.data.data;
    },

    async updateProductItem(productItem,id) {
      this.productItemForm = { ...productItem };
      console.log("productItemForm",this.productItemForm)
      const formData = this.createFormData();
      const response = await apiServices.updateProductItem(this.productItemForm);
      router.push({ name: 'product-item' });
      if (response.data.code === 200) {
        Swal.fire({
          position: 'top-end',
          icon: 'success',
          title: 'cập nhật mã sản phẩm thành công',
          showConfirmButton: false,
          timer: 1500
        });
      }
      window.location.reload();
    },

    async deleteProductItem(id, productId) {
      const result = await Swal.fire({
        title: 'Bạn chắc chắn muốn xóa mã sản phẩm này?',
        text: 'Bạn sẽ không thể hoàn tác thao tác này!',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Xác nhận!'
      });

      if (result.isConfirmed) {
        await apiServices.deleteProductItem(id);
        this.currentPage = 1;
        await this.fetchProductItems(productId);
        await Swal.fire({
          title: 'Deleted!',
          text: 'Mã sản phẩm đã được xóa thành công',
          icon: 'success'
        });
      }
    },

    async getListProductItemByProductId(id){
      const response = await apiServices.getListProductItemByProductId(id);
      console.log("prodcgetListProductItemByProductId", response.data.data);
      this.productItems = response.data.data;
    }
  }
});
