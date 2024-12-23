<template>
  <div class="grid grid-cols-4 gap-6">
    <div class="db__item bg-[#F0F4F8] p-5 rounded-lg">
      <div class="flex justify-between items-center">
        <span class="text-[18px] font-medium">Sản phẩm</span>
        <div class="p-2 bg-[#E0DCFE] rounded-md">
          <ShopIcon class="w-[20px] h-[20px]"></ShopIcon>
        </div>
      </div>
      <p class="mt-3 text-[28px] font-bold">{{ sellerStore.sellerInfo.product_quantity }}</p>
      <button @click="onClickProduct" class="mt-2 text-[15px] text-[#7A7A7A]">Chi tiết</button>
    </div>

    <div class="db__item bg-[#F0F4F8] p-5 rounded-lg">
      <div class="flex justify-between items-center">
        <span class="text-[18px] font-medium">Khuyến mại</span>
        <div class="p-2 bg-[#E0DCFE] rounded-md">
          <ListIcon class="w-[20px] h-[20px]"></ListIcon>
        </div>
      </div>
      <p class="mt-3 text-[28px] font-bold">{{ sellerStore.sellerInfo.voucher_quantity }}</p>
      <button @click="onClickVoucher" class="mt-2 text-[15px] text-[#7A7A7A]">Chi tiết</button>
    </div>

    <div class="db__item bg-[#F0F4F8] p-5 rounded-lg">
      <div class="flex justify-between items-center">
        <span class="text-[18px] font-medium">Đơn hàng</span>
        <div class="p-2 bg-[#E0DCFE] rounded-md">
          <ReceiptIcon class="w-[20px] h-[20px]"></ReceiptIcon>
        </div>
      </div>
      <p class="mt-3 text-[28px] font-bold">{{ sellerStore.sellerInfo.order_quantity }}</p>
      <button @click="onClickOrder" class="mt-2 text-[15px] text-[#7A7A7A]">Chi tiết</button>
    </div>

    <div class="db__item bg-[#F0F4F8] p-5 rounded-lg">
      <div class="flex justify-between items-center">
        <span class="text-[18px] font-medium">Nhà kho</span>
        <div class="p-2 bg-[#E0DCFE] rounded-md">
          <CopyrightIcon class="w-[20px] h-[20px]"></CopyrightIcon>
        </div>
      </div>
      <p class="mt-3 text-[28px] font-bold">{{ sellerStore.sellerInfo.warehouse_quantity }}</p>
      <button @click="onClickWarehouse" class="mt-2 text-[15px] text-[#7A7A7A]">Chi tiết</button>
    </div>
  </div>

  <div class="container mx-auto p-4">
    <!-- Date Selection Controls -->
    <div class="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
      <!-- Year Selection -->
      <div class="p-4 border rounded">
        <h3 class="mb-2 font-bold">Chọn năm cho doanh thu theo tháng</h3>
        <input 
          type="number" 
          v-model="selectedYear" 
          class="border p-2 rounded w-full"
          @change="fetchMonthlyRevenue"
        />
      </div>

      <!-- Date Range Selection -->
      <div class="p-4 border rounded">
        <h3 class="mb-2 font-bold">Chọn khoảng thời gian</h3>
        <div class="grid grid-cols-2 gap-2">
          <input 
            type="date" 
            v-model="startDate" 
            class="border p-2 rounded"
          />
          <input 
            type="date" 
            v-model="endDate" 
            class="border p-2 rounded"
          />
        </div>
        <button 
          @click="fetchDateRangeData" 
          class="mt-2 bg-blue-500 text-white px-4 py-2 rounded w-full"
        >
          Cập nhật
        </button>
      </div>
    </div>

    <!-- Charts Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <!-- Monthly Revenue Line Chart -->
      <div class="border rounded p-4">
        <h3 class="text-lg font-bold mb-4">Doanh thu theo tháng</h3>
        <canvas ref="monthlyRevenueChart"></canvas>
      </div>

      <!-- Daily Revenue Line Chart -->
      <div class="border rounded p-4">
        <h3 class="text-lg font-bold mb-4">Doanh thu theo ngày</h3>
        <canvas ref="dailyRevenueChart"></canvas>
      </div>

      <!-- Revenue vs Profit Bar Chart -->
      <div class="border rounded p-4">
        <h3 class="text-lg font-bold mb-4">Doanh thu và Lợi nhuận</h3>
        <canvas ref="revenueProfitChart"></canvas>
      </div>

      <!-- Order Status Pie Chart -->
      <div class="border rounded p-4">
        <h3 class="text-lg font-bold mb-4">Trạng thái đơn hàng</h3>
        <canvas ref="orderStatusChart"></canvas>
      </div>

      <!-- Address Distribution Pie Chart -->
      <div class="border rounded p-4">
        <h3 class="text-lg font-bold mb-4">Phân bố địa chỉ</h3>
        <canvas ref="addressChart"></canvas>
      </div>
    </div>
  </div>
</template>

<script>
import { Chart, registerables } from 'chart.js';
import axios from 'axios';
// import DashBoardOld from "./DashBoard_old.vue";
import { ShopIcon, ListIcon, ReceiptIcon, CopyrightIcon } from '@/assets/icons/icon.js';
import { computed, onMounted, ref, watch  } from 'vue';
import {useSellersStore} from '@/stores/accountSellerStore';
import router from '@/router/index.js';

Chart.register(...registerables);

export default {
  name: 'StatisticsCharts',
  setup() {
    const sellerStore = useSellersStore();

    const onClickOrder = () => {
      router.push({ name: 'menu-8' });
    };

    const onClickProduct = () => {
      router.push({ name: 'menu-4' });
    };

    const onClickVoucher = () => {
      router.push({ name: 'menu-6' });
    };

    const onClickWarehouse = () => {
      router.push({ name: 'menu-10' });
    };

    onMounted(async () => {
      sellerStore.getBasicInfo();
    });

    return {
      sellerStore,
      onClickOrder,
      onClickProduct,
      onClickVoucher,
      onClickWarehouse,
    };
  },
  data() {
    return {
      selectedYear: new Date().getFullYear(),
      startDate: '',
      endDate: '',
      charts: {
        monthlyRevenue: null,
        dailyRevenue: null,
        revenueProfit: null,
        orderStatus: null,
        address: null
      }
    }
  },
  mounted() {
    this.initializeCharts();
    this.setDefaultDates();
    this.fetchAllData();
  },
  methods: {
    setDefaultDates() {
      const now = new Date();
      const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
      const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);
      
      this.startDate = this.formatDateForInput(firstDay);
      this.endDate = this.formatDateForInput(lastDay);
    },
    formatDateForInput(date) {
      return date.toISOString().split('T')[0];
    },
    initializeCharts() {
      // Monthly Revenue Line Chart
      this.charts.monthlyRevenue = new Chart(this.$refs.monthlyRevenueChart, {
        type: 'line',
        data: {
          labels: Array.from({length: 12}, (_, i) => `Tháng ${i + 1}`),
          datasets: [{
            label: 'Doanh thu',
            data: Array(12).fill(0),
            borderColor: 'rgb(75, 192, 192)',
            tension: 0.1
          }]
        },
        options: {
          responsive: true,
          scales: {
            y: {
              beginAtZero: true,
              ticks: {
                callback: value => this.formatCurrency(value)
              }
            }
          }
        }
      });

      // Daily Revenue Line Chart
      this.charts.dailyRevenue = new Chart(this.$refs.dailyRevenueChart, {
        type: 'line',
        data: {
          labels: [],
          datasets: [{
            label: 'Doanh thu',
            data: [],
            borderColor: 'rgb(153, 102, 255)',
            tension: 0.1
          }]
        },
        options: {
          responsive: true,
          scales: {
            y: {
              beginAtZero: true,
              ticks: {
                callback: value => this.formatCurrency(value)
              }
            }
          }
        }
      });

      // Revenue vs Profit Bar Chart
      this.charts.revenueProfit = new Chart(this.$refs.revenueProfitChart, {
        type: 'bar',
        data: {
          labels: ['Doanh thu', 'Lợi nhuận'],
          datasets: [{
            data: [0, 0],
            backgroundColor: [
              'rgba(255, 99, 132, 0.5)',
              'rgba(75, 192, 192, 0.5)'
            ],
            borderColor: [
              'rgb(255, 99, 132)',
              'rgb(75, 192, 192)'
            ],
            borderWidth: 1
          }]
        },
        options: {
          responsive: true,
          scales: {
            y: {
              beginAtZero: true,
              ticks: {
                callback: value => this.formatCurrency(value)
              }
            }
          }
        }
      });

      // Order Status Pie Chart
      this.charts.orderStatus = new Chart(this.$refs.orderStatusChart, {
        type: 'pie',
        data: {
          labels: ['Đã hủy', 'Hoàn thành', 'Đang chờ'],
          datasets: [{
            data: [0, 0, 0],
            backgroundColor: [
              'rgba(255, 99, 132, 0.5)',
              'rgba(75, 192, 192, 0.5)',
              'rgba(255, 206, 86, 0.5)'
            ]
          }]
        },
        options: {
          responsive: true
        }
      });

      // Address Distribution Pie Chart
      this.charts.address = new Chart(this.$refs.addressChart, {
        type: 'pie',
        data: {
          labels: [],
          datasets: [{
            data: [],
            backgroundColor: [
              'rgba(255, 99, 132, 0.5)',
              'rgba(75, 192, 192, 0.5)',
              'rgba(255, 206, 86, 0.5)',
              'rgba(153, 102, 255, 0.5)'
            ]
          }]
        },
        options: {
          responsive: true
        }
      });
    },
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
        
        const monthlyData = Array(12).fill(0);
        response.data.forEach(item => {
          monthlyData[item.month - 1] = item.revenue;
        });

        this.charts.monthlyRevenue.data.datasets[0].data = monthlyData;
        this.charts.monthlyRevenue.update();
      } catch (error) {
        console.error('Error fetching monthly revenue:', error);
      }
    },
    async fetchDateRangeData() {
      try {
        const token = localStorage.getItem("token");
        const headers = { Authorization: `Bearer ${token}` };
        
        // Daily Revenue
        const revenueResponse = await axios.get(
          `http://localhost:3000/api/orders/revenueByShop?startDate=${this.startDate}&endDate=${this.endDate}`,
          { headers }
        );
        
        const dailyData = revenueResponse.data.map(item => ({
          date: new Date(item.date).toLocaleDateString('vi-VN'),
          revenue: item.revenue
        }));

        this.charts.dailyRevenue.data.labels = dailyData.map(item => item.date);
        this.charts.dailyRevenue.data.datasets[0].data = dailyData.map(item => item.revenue);
        this.charts.dailyRevenue.update();

        // Profit Data
        const profitResponse = await axios.get(
          `http://localhost:3000/api/statistics/profitByShop?startDate=${this.startDate}&endDate=${this.endDate}`,
          { headers }
        );

        this.charts.revenueProfit.data.datasets[0].data = [
          profitResponse.data.totalRevenue,
          profitResponse.data.totalProfit
        ];
        this.charts.revenueProfit.update();
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

        this.charts.orderStatus.data.datasets[0].data = [
          response.data.cancelledOrders,
          response.data.completedOrders,
          response.data.pendingOrders
        ];
        this.charts.orderStatus.update();
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

        this.charts.address.data.labels = Object.keys(response.data);
        this.charts.address.data.datasets[0].data = Object.values(response.data);
        this.charts.address.update();
      } catch (error) {
        console.error('Error fetching address stats:', error);
      }
    },
    formatCurrency(value) {
      return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
        maximumFractionDigits: 0
      }).format(value);
    },
  }
}
</script>
<style scoped lang="scss">
.db {
  border-left: 3px solid ;
  &__item {
    box-shadow:
      rgba(50, 50, 93, 0.25) 0px 13px 27px -5px,
      rgba(0, 0, 0, 0.3) 0px 8px 16px -8px;
  }
}
</style>
