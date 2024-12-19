<template>
  <div>
    <pie-chart :chart-data="orderData"></pie-chart>
  </div>
</template>

<script>
import PieChart from './PieChart.vue';
import axios from 'axios';

export default {
  components: {
    PieChart,
  },
  data() {
    return {
      orderData: {},
        shopId: 1 // Giả sử shopId = 1
    };
  },
  mounted() {
    this.fetchOrderData();
  },
  methods: {
    async fetchOrderData() {
      try {
        const response = await axios.get(`http://localhost:3000/api/orders/address-detail/count?shopId=${this.shopId}`);
        this.orderData = response.data;
      } catch (error) {
        console.error('Lỗi khi lấy dữ liệu:', error);
      }
    },
  },
};
</script>