import { defineStore } from 'pinia';
import apiServices from '@/domain/apiServices';
// import Swal from 'sweetalert2';
// import router from '@/router/index.js';

export const useProductDetailStore = defineStore('product', {
  state: () => ({
    product: {},
    price: 0,
    quantity: 0,
    total_quantity: 0,
    itemId: null
  }),

  actions: {
    async fetchProducts(id) {
      const response = await apiServices.getProductById(id);
      if (response && response.data && response.data.data) {
        this.product = response.data.data;
        this.price = this.product.min_price || 0;
        this.quantity = this.product.quantity;
        this.total_quantity = this.product.quantity;
      }
    },

    async fetchProductItem(id, query) {
      const response = await apiServices.getQuantityByAttribute(id, query);
      console.log('API Response:', response);
      const productItem = response.data?.data?.product_item;
      if (Array.isArray(productItem) && productItem.length > 0) {
        const item = productItem[0];

        console.log(item);
        this.price = item.price;
        console.log(this.price);
        this.quantity = item.quantity;
        this.itemId = item.id;
      }
    },

    setQuantity() {
      this.quantity = this.total_quantity;
    }
  }
});
