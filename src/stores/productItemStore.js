import { defineStore } from 'pinia';
import apiServices from '@/domain/apiServices';
import Swal from 'sweetalert2';
import router from '@/router/index.js';
import _ from 'lodash';
import { useToast } from 'vue-toastification';

export const useProductItemStore = defineStore('productItems', {
  state: () => ({
    productItem: [],
    productItems: [],
    totalElements: 0,
    currentPage: 1,
    pageSize: 10,
    productItemForm: {
      price: null,
      sku_code: '',
      import_price: null,
      product_id: null,
      attribute_value_id: []
    }
  }),

  actions: {
    updatePagination({ currentPage }) {
      this.currentPage = currentPage;
      this.fetchProductItems(this.currentPage);
    },

    async fetchProductItems(id, page = 1) {
      const response = await apiServices.getListProductItem(id, page, this.pageSize);
      const content = response.data.data.content;

      this.productItems = _.map(content, (productItem, index) => ({
        ...productItem,
        stt: (page - 1) * this.pageSize + index + 1
      }));
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
      const toast = useToast();
      this.productItemForm = { ...productItem };
        const response = await apiServices.createProductItem(this.productItemForm);
        if (response.data.code === 200) {
          await this.fetchProductItems(response.data.data.product_id);
          toast.success("Thêm mới mã sản phẩm thành công", {
            timeout: 5000
          });
        } else {
          toast.error(response?.data?.message || 'Đã xảy ra lỗi', {
            timeout: 5000
          });
        }
    },

    async fetchProductItem(id) {
      const response = await apiServices.getProductItem(id);
      this.productItem = response.data.data;
    },

    async updateProductItem(productItem, id) {
      const toast = useToast();
      this.productItemForm = { ...productItem };
      const response = await apiServices.updateProductItem(this.productItemForm);
      if (response.data.code === 200) {
        await this.fetchProductItems(response.data.data.product_id);
        toast.success("Cập nhật mã sản phẩm thành công", {
          timeout: 5000
        });
      } else {
        toast.error(response?.data?.message || 'Đã xảy ra lỗi', {
          timeout: 5000
        });
      }
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

    async getListProductItemByProductId(id) {
      const response = await apiServices.getListProductItemByProductId(id);
      this.productItems = response.data.data;
    }
  }
});
