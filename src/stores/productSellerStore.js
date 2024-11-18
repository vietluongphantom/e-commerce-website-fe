import { defineStore } from 'pinia';
import apiServices from '@/domain/apiServices';
import Swal from 'sweetalert2';
import router from '@/router/index.js';
import _ from 'lodash';

export const useProductStore = defineStore('products', {
  state: () => ({
    product: [],
    products: [],
    totalElements: 0,
    currentPage: 1,
    pageSize: 10,
    productForm: {
      name: '',
      description: '',
      status: '1',
      brandId: '',
      categoryIds: [],
      images: [],
      images_text: []
    }
  }),

  actions: {
    updatePagination({ currentPage }) {
      this.currentPage = currentPage;
      this.fetchProducts(this.currentPage);
    },

    async fetchProducts(page = 1, searchQuery = '') {
      Swal.fire({
        title: 'Loading...',
        text: 'Vui lòng chờ...',
        icon: 'info',
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        }
      });
      const response = await apiServices.getListProductS(page, this.pageSize, searchQuery);
      console.log(" response.data.data.productResponses",  response.data.data.productResponses)
      Swal.close();
      const content = response.data.data.productResponses;
      
      this.products = _.map(content, (product, index) => ({
        ...product,
        stt: (page - 1) * this.pageSize + index + 1
      }));

      console.log("inproduct", this.products);

      this.totalElements = response.data.data.totalPages * this.pageSize;
      console.log("totalElements", this.totalElements)
    },

    createFormData() {
      const formData = new FormData();
      formData.append('name', this.productForm.name);
      formData.append('description', this.productForm.description);
      formData.append('status', this.productForm.status);
      formData.append('brandId', this.productForm.brandId);

      // formData.append('categoryIds', JSON.stringify(this.productForm.categoryIds));
      this.productForm.categoryIds.forEach((id) => {
        formData.append('categoryIds', id);
      });

      this.productForm.images.forEach((image) => {
        formData.append('images', image); // Lấy tên tệp từ đối tượng File
      });

      // this.productForm.images_text.forEach((images_text) => {
      //   formData.append('imagesText', images_text); 
      //   console.log("mmmmmmmmmmmmmmaaaaaaa",formData.images) // Lấy tên tệp từ đối tượng File
      // });

      for (let [key, value] of formData.entries()) {
        console.log(`${key}: ${value}`);
      }
      return formData;
    },

    async addProduct(product) {
      // Swal.fire({
      //   title: 'Đang thêm sản phẩm...',
      //   text: 'Vui lòng chờ...',
      //   icon: 'info',
      //   allowOutsideClick: false,
      //   didOpen: () => {
      //     Swal.showLoading();
      //   }
      // });

      this.productForm = { ...product };
      const formData = this.createFormData();
      console.log(this.productForm,);
      console.log("day la formdata",formData )
      const response = await apiServices.createProduct(formData);
      console.log("quay tròn quay tròn")
      // Swal.close();

      if (response.data.code === 200) {
        router.push({ name: 'menu-4', query: { page: 1 } });
        Swal.fire({
          position: 'top-end',
          icon: 'success',
          title: 'Thêm mới sản phẩm thành công',
          showConfirmButton: false,
          timer: 1500
        });
      }
    },

    async fetchProduct(id) {
      console.log('load product by id', id);
      const response = await apiServices.getProduct(id);
      this.product = response.data.data;
      console.log('call api product nhé', this.product);
    },

    async updateProduct(product, id) {
      this.productForm = { ...product };
      console.log('this.productForm.name', this.productForm);
      console.log('this.productForm.name product', product);
      const formData = this.createFormData();
      console.log('idddddđ', formData);
      const response = await apiServices.updateProduct(formData, id);
      if (response.data.code === 200) {
        router.push({ name: 'menu-4', query: { page: 1 } });
        Swal.fire({
          position: 'top-end',
          icon: 'success',
          title: 'cập nhật sản phẩm thành công',
          showConfirmButton: false,
          timer: 1500
        });
      }
    },

    async deleteProduct(id) {
      const result = await Swal.fire({
        title: 'Bạn chắc chắn muốn xóa sản phẩm này?',
        text: 'Bạn sẽ không thể hoàn tác thao tác này!',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Xác nhận!'
      });

      if (result.isConfirmed) {
        await apiServices.deleteProduct(id);
        this.currentPage = 1;
        await this.fetchProducts();
        await Swal.fire({
          title: 'Deleted!',
          text: 'Sản phẩm đã được xóa thành công',
          icon: 'success'
        });
      }
    }
  }
});
