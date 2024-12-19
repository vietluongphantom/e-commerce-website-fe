<template>
  <div>
    <h1>Thông Tin Địa Chỉ Giao Hàng</h1>
    <button @click="fetchAddressDetails">Lấy thông tin địa chỉ</button>
    <div v-if="loadingAddress">Đang tải thông tin địa chỉ...</div>
    <div v-if="errorAddress" style="color: red;">Lỗi: {{ errorAddress }}</div>
    <div v-if="addressDetails">
      <h3>Dữ liệu địa chỉ từ server:</h3>
      <pre>{{ addressDetails }}</pre>
    </div>

    <h1>Doanh thu theo cửa hàng</h1>
    <button @click="fetchRevenueByShop">Lấy thông tin doanh thu</button>
    <div v-if="loadingRevenue">Đang tải thông tin doanh thu...</div>
    <div v-if="errorRevenue" style="color: red;">Lỗi: {{ errorRevenue }}</div>
    <div v-if="revenueData">
      <h3>Dữ liệu doanh thu từ server:</h3>
      <pre>{{ revenueData }}</pre>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      // State for address data
      addressDetails: null,
      loadingAddress: false,
      errorAddress: null,

      // State for revenue data
      revenueData: null,
      loadingRevenue: false,
      errorRevenue: null,
    };
  },
  methods: {
    // Fetch address details
    async fetchAddressDetails() {
      this.loadingAddress = true;
      this.errorAddress = null;

      try {
        const token = localStorage.getItem('token'); // Lấy token từ localStorage
        const response = await axios.get(
          'http://localhost:3000/api/orders/address-detail',
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        this.addressDetails = response.data;
      } catch (error) {
        this.errorAddress = error.response?.data?.message || 'Không thể kết nối với server';
      } finally {
        this.loadingAddress = false;
      }
    },

    // Fetch revenue data
    async fetchRevenueByShop() {
      this.loadingRevenue = true;
      this.errorRevenue = null;

      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(
          'http://localhost:3000/api/orders/revenueByShop?startDate=2024-01-17T00:00:00&endDate=2024-01-30T23:59:59',
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        this.revenueData = response.data;
      } catch (error) {
        this.errorRevenue = error.response?.data?.message || 'Không thể kết nối với server';
      } finally {
        this.loadingRevenue = false;
      }
    },
  },
};
</script>

<style scoped>
h1 {
  text-align: center;
  margin-bottom: 10px;
}
button {
  display: block;
  margin: 10px auto;
  padding: 10px 20px;
  cursor: pointer;
}
pre {
  white-space: pre-wrap;
  word-wrap: break-word;
  background: #f0f0f0;
  padding: 10px;
  border: 1px solid #ccc;
  margin: 10px auto;
  max-width: 600px;
}
</style>
