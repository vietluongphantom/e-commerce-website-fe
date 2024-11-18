import { defineStore } from 'pinia';
import apiServices from '@/domain/apiServices';
import _ from 'lodash';
import Swal from 'sweetalert2';
import { productStore } from '@/stores/products';

export const useCartStore = defineStore('cart', {
  state: () => ({
    cartItems: [],
    totalElements: 0,
    currentPage: 1,
    pageSize: 10,
    totalPrice: 0
  }),

  actions: {
    updatePagination({ currentPage }) {
      this.currentPage = currentPage;
      this.fetchCartItems(this.currentPage);
    },

    async fetchCartItems(page = 1) {
      Swal.fire({
        title: 'Loading...',
        text: 'Vui lòng chờ...',
        icon: 'info',
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        }
      });
      try {
        const response = await apiServices.getAllCart(page);
        const content = response.data.data.content;
        console.log(content);

        const promises = _.map(content, async (item) => {
          console.log(item);
          const [productResponse, shopResponse] = await Promise.all([
            apiServices.getItemCart(item.productItemId),
            apiServices.getShopById(item.shopId)
          ]);

          return {
            ...item,
            productDetails: productResponse.data.data,
            shopDetails: shopResponse.data.data
          };
        });

        // Chờ tất cả các promises hoàn thành
        this.cartItems = await Promise.all(promises);
        Swal.close();
        this.totalElements = response.data.data.totalElements;
      } catch (error) {
        console.error('Error fetching cart items:', error);
      }
    },

    async updateCartItem(id, quantity) {
      await apiServices.updateCartItem(id, quantity);
    },

    async deleteCart(id) {
      const result = await Swal.fire({
        title: 'Bạn chắc chắn muốn xóa sản phảm này?',
        text: 'Bạn sẽ không thể hoàn tác thao tác này!',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Xác nhận!'
      });

      if (result.isConfirmed) {
        const response = await apiServices.deleteCartItem(id);
        if (response.data.code === 200) {
          this.currentPage = 1;
          const store = productStore();
          store.fetchCart();
          await this.fetchCartItems();
          await Swal.fire({
            title: 'Deleted!',
            text: 'Xóa thành công',
            icon: 'success'
          });
        }
      }
    },

    getters: {
      cartTotalPrice(state) {
        return state.cartItems.reduce((total, item) => {
          return total + item.quantity * item.productDetails.price;
        }, 0);
      }
    }
  }
});
