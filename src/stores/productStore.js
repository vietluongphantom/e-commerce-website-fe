
import { defineStore } from 'pinia';
import apiServices from '@/domain/apiServices';
import Swal from 'sweetalert2';
import _ from 'lodash';
import router from '@/router/index.js';

export const useProductStore = defineStore('product', {
  state: () => ({
    products: [],
    detail: {
      name: '',
      country: '',
      province: '',
      district: '',
      commune: '',
      address_detail: ''
    }
  }),
  actions: {
    async fetchProducts(sort='') {
      const response = await apiServices.getAllProduct(sort);
      console.log("await reponse.fetchProducts(props.option);", sort)
      const reversedData = _.reverse(_.clone(response.data.data));

      this.products = _.map(reversedData, (item, index) => ({
        ...item,
        stt: index + 1
      }));
    },

    async detailProduct(id) {
      const response = await apiServices.getDetailProduct(id);
      this.detail = response.data.data;
      // router.push({ name: 'warehouse-edit' });
      router.push({ name: 'product-edit', params: { id } });
    },
  }
});
