import { defineStore } from 'pinia';
import apiServices from '@/domain/apiServices';
import _ from 'lodash';
import Swal from 'sweetalert2';
import { productStore } from '@/stores/products';

export const useShopStore = defineStore('shop', {
  state: () => ({
    shopInfo:null,
    shopList: [],
  }),

  actions: {
    async fetchShopList() {
        try {
            this.shopList = await apiServices.getShopList();
            //   return {
            //     ...response
            //   };
          } catch (error) {
            console.error('Error fetching shop chat:', error);
          }
      },
      async getInfoShop(id) {
        try {
          const response = await apiServices.getInfoShopByUserId(id);
            this.shopInfo = response.data.data
          } catch (error) {
            console.error('Error fetching shop chat:', error);
          }
      },
  },  

  }
);
