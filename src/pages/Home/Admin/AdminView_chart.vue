<template>
  <div>
    <!-- Dashboard Title -->
    <h1>Thống kê</h1>

    <!-- Order Summary -->
    <section>
      <h2>Trạng thái đơn hàng</h2>
      <div v-if="loadingOrders">Loading...</div>
      <div v-else>
        <!-- <canvas id="orderSummaryChart" style="max-height: 500px;"></canvas> -->
        <p><strong>Cancelled Orders:</strong> {{ orders.cancelledOrders }}</p>
        <p><strong>Completed Orders:</strong> {{ orders.completedOrders }}</p>
        <p><strong>Pending Orders:</strong> {{ orders.pendingOrders }}</p>
      </div>
    </section>

    <hr />

    <!-- Monthly Revenue -->
    <section>
      <h2>Doanh thu theo từng tháng</h2>
      <div>
        <label for="year">Nhập năm:</label>
        <input
          type="number"
          id="year"
          v-model.number="selectedYear"
          min="2000"
          @change="fetchMonthlyRevenue"
        />
      </div>
      <canvas id="monthlyRevenueChart" style="max-height: 500px;"></canvas>
    </section>

    <hr />

    <!-- Daily Revenue -->
    <section>
      <h2>Doanh thu hàng ngày</h2>
      <div>
        <label for="month">Tháng:</label>
        <input
          type="number"
          id="month"
          v-model.number="dayMonth"
          min="1"
          max="12"
          @change="fetchDailyRevenue"
        />
        <label for="year">Năm:</label>
        <input
          type="number"
          id="year"
          v-model.number="dayYear"
          min="2000"
          @change="fetchDailyRevenue"
        />
      </div>
      <canvas id="dailyRevenueChart" style="max-height: 500px;"></canvas>
    </section>

    <hr />

    <!-- Brand Product Count -->
    <section>
      <h2>Số lượng sản phẩm theo thương hiệu</h2>
      <canvas id="brandProductCountChart" style="max-height: 500px;"></canvas>
    </section>

    <hr />

    <!-- Revenue Report -->
    <section class="revenue-dashboard">
      <h2>Doanh thu hằng ngày</h2>
      <form @submit.prevent="fetchRevenue">
        <label for="startDate">Start Date:</label>
        <input type="date" id="startDate" v-model="startDate" required />

        <label for="endDate">End Date:</label>
        <input type="date" id="endDate" v-model="endDate" required />

        <button type="submit">Lấy dữ liệu</button>
      </form>

      <div v-if="chartData.datasets.length">
        <BarChart :chart-data="chartData" :chart-options="chartOptions" />
      </div>

      <p v-else>No data available. Please query the report.</p>
    </section>
  </div>
</template>

<script>
import axios from "axios";
import { defineAsyncComponent } from "vue";
import Chart from "chart.js/auto";

// Dynamically import BarChart component
const BarChart = defineAsyncComponent(() => import("./BarChart.vue"));

export default {
  components: {
    BarChart,
  },
  data() {
    return {
      // Order summary state
      orders: {
        cancelledOrders: 0,
        completedOrders: 0,
        pendingOrders: 0,
      },
      loadingOrders: true,

      // Monthly revenue state
      monthlyRevenue: Array.from({ length: 12 }, (_, index) => ({
        month: index + 1,
        revenue: 0,
      })),
      selectedYear: 2024,

      // Daily revenue state
      dailyRevenue: [],
      dayMonth: 1,
      dayYear: 2024,

      // Brand Product Count state
      brands: [],

      // Revenue report state
      startDate: "",
      endDate: "",
      chartData: {
        labels: [],
        datasets: [],
      },
      chartOptions: {
        responsive: true,
        plugins: {
          legend: { display: true },
          title: { display: true, text: "Revenue Over Time" },
        },
      },
    };
  },
  async created() {
    await this.fetchOrderSummary();
    this.fetchMonthlyRevenue();
    this.fetchDailyRevenue();
    this.fetchBrands();
  },
  methods: {
    // Fetch methods for API data
    async fetchOrderSummary() {
      try {
        const response = await axios.get("http://localhost:3000/api/statistics/orders");
        this.orders = {
          cancelledOrders: response.data.cancelledOrders || 0,
          completedOrders: response.data.completedOrders || 0,
          pendingOrders: response.data.pendingOrders || 0,
        };
        this.renderOrderSummaryChart();
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        this.loadingOrders = false;
      }
    },

    async fetchMonthlyRevenue() {
      try {
        const response = await axios.get(
          `http://localhost:3000/api/statistics/revenue/monthly?year=${this.selectedYear}`
        );
        this.monthlyRevenue = Array.from({ length: 12 }, (_, index) => ({
          month: index + 1,
          revenue: 0,
        }));
        response.data.forEach((item) => {
          const index = item.month - 1;
          if (index >= 0 && index < 12) {
            this.monthlyRevenue[index].revenue = item.revenue;
          }
        });
        this.renderMonthlyRevenueChart();
      } catch (error) {
        console.error("Failed to fetch monthly revenue:", error);
      }
    },

    async fetchDailyRevenue() {
      try {
        const response = await axios.get(
          `http://localhost:3000/api/statistics/revenue/daily?month=${this.dayMonth}&year=${this.dayYear}`
        );
        this.dailyRevenue = response.data;
        this.renderDailyRevenueChart();
      } catch (error) {
        console.error("Failed to fetch daily revenue:", error);
      }
    },

    async fetchBrands() {
      try {
        const response = await axios.get("http://localhost:3000/api/brands/product-count");
        this.brands = response.data;
        this.renderBrandProductCountChart();
      } catch (error) {
        console.error("Error fetching brand data:", error);
      }
    },

    async fetchRevenue() {
      if (!this.startDate || !this.endDate) {
        alert("Please enter both start and end dates.");
        return;
      }

      const formattedStartDate = new Date(this.startDate).toISOString();
      const formattedEndDate = new Date(this.endDate).toISOString();

      try {
        const response = await axios.get("http://localhost:3000/api/orders/revenue", {
          params: {
            startDate: formattedStartDate,
            endDate: formattedEndDate,
          },
        });
        this.updateChartData(response.data);
      } catch (error) {
        console.error("Error fetching revenue data:", error);
        alert("Failed to fetch data. Please try again later.");
      }
    },

    updateChartData(data) {
      const start = new Date(this.startDate);
      const end = new Date(this.endDate);
      const range = [];
      for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
        range.push(new Date(d).toISOString().split("T")[0]);
      }

      const revenueMap = new Map(
        data.map((record) => [new Date(record.date).toISOString().split("T")[0], record.revenue])
      );

      const filledData = range.map((date) => ({
        date,
        revenue: revenueMap.get(date) || 0,
      }));

      this.chartData.labels = filledData.map((record) =>
        new Date(record.date).toLocaleDateString()
      );
      this.chartData.datasets = [
        {
          label: "Revenue (VND)",
          data: filledData.map((record) => record.revenue),
          backgroundColor: "rgba(75, 192, 192, 0.6)",
          borderColor: "rgba(75, 192, 192, 1)",
          borderWidth: 1,
        },
      ];
    },

    // Chart rendering methods
    renderOrderSummaryChart() {
      const ctx = document.getElementById("orderSummaryChart");
      new Chart(ctx, {
        type: "bar",
        data: {
          labels: ["Cancelled", "Completed", "Pending"],
          datasets: [
            {
              label: "Orders",
              data: [
                this.orders.cancelledOrders,
                this.orders.completedOrders,
                this.orders.pendingOrders,
              ],
              backgroundColor: ["#f87171", "#4ade80", "#60a5fa"],
            },
          ],
        },
      });
    },

    renderMonthlyRevenueChart() {
      const ctx = document.getElementById("monthlyRevenueChart");
      new Chart(ctx, {
        type: "bar",
        data: {
          labels: this.monthlyRevenue.map((item) => `Tháng ${item.month}`),
          datasets: [
            {
              label: "Doanh thu (VNĐ)",
              data: this.monthlyRevenue.map((item) => item.revenue),
              backgroundColor: "#4ade80",
            },
          ],
        },
      });
    },

    renderDailyRevenueChart() {
      const ctx = document.getElementById("dailyRevenueChart");
      new Chart(ctx, {
        type: "bar",
        data: {
          labels: this.dailyRevenue.map((item) => this.formatDate(item.date)),
          datasets: [
            {
              label: "Doanh thu (VNĐ)",
              data: this.dailyRevenue.map((item) => item.revenue),
              backgroundColor: "#60a5fa",
            },
          ],
        },
      });
    },

    renderBrandProductCountChart() {
      const ctx = document.getElementById("brandProductCountChart");
      new Chart(ctx, {
        type: "bar",
        data: {
          labels: this.brands.map((brand) => brand.brandName),
          datasets: [
            {
              label: "Product Count",
              data: this.brands.map((brand) => brand.productCount),
              backgroundColor: "#4ade80",
            },
          ],
        },
      });
    },

    formatDate(timestamp) {
      const date = new Date(timestamp);
      return date.toLocaleDateString();
    },
  },
};
</script>

<style scoped>
h1 {
  font-size: 24px;
  margin-bottom: 20px;
}

h2 {
  font-size: 20px;
  margin-bottom: 10px;
}

section {
  margin-bottom: 40px;
}

canvas {
  height: 500px !important;
  width: 100%;
}

.revenue-dashboard form {
  margin-bottom: 20px;
}

.revenue-dashboard label {
  margin-right: 10px;
}

.revenue-dashboard input {
  margin-right: 20px;
}

.revenue-dashboard button {
  padding: 10px 20px;
}
</style>
