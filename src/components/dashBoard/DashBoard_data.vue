// StatisticsView.vue
<template>
  <div class="container mx-auto p-4">
    <!-- Year Input for API 1 -->
    <div class="mb-4">
      <label class="block mb-2">Chọn năm:</label>
      <input 
        v-model="selectedYear" 
        type="number" 
        class="border p-2 rounded"
        @change="fetchMonthlyRevenue"
      />
    </div>

    <!-- Date Range for API 2 & 3 -->
    <div class="mb-4">
      <label class="block mb-2">Chọn khoảng thời gian:</label>
      <input 
        v-model="startDate" 
        type="datetime-local" 
        class="border p-2 rounded mr-2"
      />
      <input 
        v-model="endDate" 
        type="datetime-local" 
        class="border p-2 rounded"
      />
      <button 
        @click="fetchDateRangeData" 
        class="ml-2 bg-blue-500 text-white px-4 py-2 rounded"
      >
        Xem kết quả
      </button>
    </div>

    <!-- Results Display -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <!-- Monthly Revenue Chart -->
      <div class="border p-4 rounded">
        <h2 class="text-xl mb-4">Doanh thu theo tháng</h2>
        <table class="w-full">
          <thead>
            <tr>
              <th>Tháng</th>
              <th>Doanh thu</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(revenue, index) in monthlyRevenue" :key="index">
              <td>{{ index + 1 }}</td>
              <td>{{ formatCurrency(revenue) }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Daily Revenue in Date Range -->
      <div class="border p-4 rounded">
        <h2 class="text-xl mb-4">Doanh thu theo ngày</h2>
        <div v-if="dailyRevenue.length" class="max-h-60 overflow-y-auto">
          <table class="w-full">
            <thead>
              <tr>
                <th>Ngày</th>
                <th>Doanh thu</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in dailyRevenue" :key="item.date">
                <td>{{ formatDate(item.date) }}</td>
                <td>{{ formatCurrency(item.revenue) }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Revenue and Profit -->
      <div class="border p-4 rounded">
        <h2 class="text-xl mb-4">Doanh thu và lợi nhuận</h2>
        <p>Tổng doanh thu: {{ formatCurrency(profitData.totalRevenue) }}</p>
        <p>Tổng lợi nhuận: {{ formatCurrency(profitData.totalProfit) }}</p>
      </div>

      <!-- Order Statistics -->
      <div class="border p-4 rounded">
        <h2 class="text-xl mb-4">Thống kê đơn hàng</h2>
        <p>Đơn đã hủy: {{ orderStats.cancelledOrders }}</p>
        <p>Đơn hoàn thành: {{ orderStats.completedOrders }}</p>
        <p>Đơn đang chờ: {{ orderStats.pendingOrders }}</p>
      </div>

      <!-- Address Statistics -->
      <div class="border p-4 rounded">
        <h2 class="text-xl mb-4">Thống kê theo địa chỉ</h2>
        <table class="w-full">
          <thead>
            <tr>
              <th>Địa chỉ</th>
              <th>Số lượng</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(count, address) in addressStats" :key="address">
              <td>{{ address }}</td>
              <td>{{ count }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'StatisticsView',
  data() {
    return {
      selectedYear: new Date().getFullYear(),
      startDate: '',
      endDate: '',
      monthlyRevenue: Array(12).fill(0),
      dailyRevenue: [],
      profitData: {
        totalRevenue: 0,
        totalProfit: 0
      },
      orderStats: {
        cancelledOrders: 0,
        completedOrders: 0,
        pendingOrders: 0
      },
      addressStats: {}
    }
  },
  created() {
    // Set default date range to current month
    const now = new Date();
    const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    
    this.startDate = this.formatDateForInput(firstDay);
    this.endDate = this.formatDateForInput(lastDay);

    this.fetchAllData();
  },
  methods: {
    async fetchAllData() {
      await this.fetchMonthlyRevenue();
      await this.fetchDateRangeData();
      await this.fetchOrderStats();
      await this.fetchAddressStats();
    },
    async fetchMonthlyRevenue() {
      try {
        const token = localStorage.getItem("token");
        const headers = { Authorization: `Bearer ${token}` };
        
        const response = await axios.get(
          `http://localhost:3000/api/statistics/revenue/monthlyByShop?year=${this.selectedYear}`,
          { headers }
        );
        
        // Reset array to zeros
        this.monthlyRevenue = Array(12).fill(0);
        
        // Fill in actual values
        response.data.forEach(item => {
          this.monthlyRevenue[item.month - 1] = item.revenue;
        });
      } catch (error) {
        console.error('Error fetching monthly revenue:', error);
      }
    },
    async fetchDateRangeData() {
      try {
        const token = localStorage.getItem("token");
        const headers = { Authorization: `Bearer ${token}` };
        
        // Fetch daily revenue
        const revenueResponse = await axios.get(
          `http://localhost:3000/api/orders/revenueByShop?startDate=${this.startDate}&endDate=${this.endDate}`,
          { headers }
        );
        
        // Create array with all dates in range
        const start = new Date(this.startDate);
        const end = new Date(this.endDate);
        const dates = [];
        
        for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
          dates.push({
            date: d.getTime(),
            revenue: 0
          });
        }
        
        // Fill in actual values
        revenueResponse.data.forEach(item => {
          const index = dates.findIndex(d => d.date === item.date);
          if (index !== -1) {
            dates[index].revenue = item.revenue;
          }
        });
        
        this.dailyRevenue = dates;
        
        // Fetch profit data
        const profitResponse = await axios.get(
          `http://localhost:3000/api/statistics/profitByShop?startDate=${this.startDate}&endDate=${this.endDate}`,
          { headers }
        );
        
        this.profitData = profitResponse.data;
      } catch (error) {
        console.error('Error fetching date range data:', error);
      }
    },
    async fetchOrderStats() {
      try {
        const token = localStorage.getItem("token");
        const headers = { Authorization: `Bearer ${token}` };
        
        const response = await axios.get(
          'http://localhost:3000/api/statistics/ordersByShop',
          { headers }
        );
        
        this.orderStats = response.data;
      } catch (error) {
        console.error('Error fetching order stats:', error);
      }
    },
    async fetchAddressStats() {
      try {
        const token = localStorage.getItem("token");
        const headers = { Authorization: `Bearer ${token}` };
        
        const response = await axios.get(
          'http://localhost:3000/api/orders/address-detail',
          { headers }
        );
        
        this.addressStats = response.data;
      } catch (error) {
        console.error('Error fetching address stats:', error);
      }
    },
    formatCurrency(value) {
      return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND'
      }).format(value);
    },
    formatDate(timestamp) {
      return new Date(timestamp).toLocaleDateString('vi-VN');
    },
    formatDateForInput(date) {
      return date.toISOString().slice(0, 16);
    }
  }
}
</script>