import { defineStore } from 'pinia';
import apiServices from '@/domain/apiServices';


export const productStore = defineStore('products', {
  state: () => ({
    products: [],
    totalElements: 0,
    currentPage: 1,
    pageSize: 10,
    itemCount: 0
  }),

  actions: {

    updatePagination({ currentPage }) {
      this.currentPage = currentPage;
      this.fetchProducts(this.currentPage);
    },

    async fetchProducts(keyword='',sort='',fromPrice='', toPrice='',brandId='', selectedCategories='', selectStar='', page = 1 ) {
      try {
        const response = await apiServices.getAllProduct(keyword,sort, fromPrice,toPrice,brandId,selectedCategories, selectStar, page);
        this.products = response.data.data.productResponses;
        console.log(this.products);
      } catch (err) {
        this.error = 'Faliled';
        console.log(err);
      } finally {
        this.isLoading = false; // Đặt lại trạng thái loading
      }
    },
    async fetchCart() {
      const response = await apiServices.quantityCart();
      this.itemCount = response.data.data;
      }
  }
});
