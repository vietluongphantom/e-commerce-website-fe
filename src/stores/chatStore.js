import { defineStore } from 'pinia';
import apiServices from '@/domain/apiServices';
import _ from 'lodash';
import Swal from 'sweetalert2';
import { productStore } from '@/stores/products';

export const useChatStore = defineStore('chat', {
  state: () => ({
    AllMessage:[],
    detail: {
      recipientId: '',
      content: ''
    }
  }),

  actions: {
    async createNewMessage(message, id) {
      try {
        this.shopList = await apiServices.createNewMessage(message, id);
      } catch (error) {
        console.error('Error fetching shop message:', error);
      }
    },

    async fetchAllMessage(id) {
        try {
            const response = await apiServices.fetchAllMessage(id);
            this.AllMessage = response.data
        } catch (error) {
          console.error('Error fetching shop message:', error);
        }
    },
  }
});
