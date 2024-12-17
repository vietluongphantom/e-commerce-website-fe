<!-- <template>
    <div>
      <h2>Biểu đồ thống kê</h2>
      <BarChart v-if="revenueData.length" :chart-data="chartData" :chart-options="chartOptions" />
      <p v-else>Đang tải dữ liệu...</p>
    </div>
  </template>
  
  <script>
  import { defineComponent } from "vue";
  import { Bar } from "vue-chartjs";
  import {
    Chart as ChartJS,
    Title,
    Tooltip,
    Legend,
    BarElement,
    CategoryScale,
    LinearScale,
  } from "chart.js";
  import axios from "axios";
  
  ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale);
  
  export default defineComponent({
    name: "StatisticsChart",
    components: {
      BarChart: Bar,
    },
    data() {
      return {
        revenueData: [],
        chartData: null,
        chartOptions: {
          responsive: true,
          maintainAspectRatio: false,
        },
      };
    },
    methods: {
      async fetchStatistics() {
        try {
          // Lấy dữ liệu từ API
          const [dailyRevenue, monthlyRevenue, orderStats] = await Promise.all([
            axios.get("/api/statistics/revenue/daily"),
            axios.get("/api/statistics/revenue/monthly"),
            axios.get("/api/statistics/orders"),
          ]);
  
          const dailyData = dailyRevenue.data.map(item => ({
            date: item.date,
            revenue: item.revenue,
          }));
  
          const monthlyData = monthlyRevenue.data.map(item => ({
            month: item.month,
            revenue: item.revenue,
          }));
  
          const { totalOrders, completedOrders, cancelledOrders } = orderStats.data;
  
          this.revenueData = {
            dailyRevenue,
            monthlyRevenue,
            orderStats: { totalOrders, completedOrders, cancelledOrders },
          };
  
          this.prepareChartData(dailyData);
        } catch (error) {
          console.error("Error fetching statistics", error);
        }
      },
  
      prepareChartData(dailyData) {
        this.chartData = {
          labels: dailyData.map(data => data.date),
          datasets: [
            {
              label: "Doanh thu hàng ngày",
              backgroundColor: "rgba(75, 192, 192, 0.5)",
              borderColor: "rgba(75, 192, 192, 1)",
              data: dailyData.map(data => data.revenue),
            },
          ],
        };
      },
    },
    mounted() {
      this.fetchStatistics();
    },
  });
  </script>
  
  <style scoped>
  div {
    height: 400px;
    position: relative;
  }
  </style> -->
  




<!-- <template>
    <div>
      <h2>Tổng Doanh Thu</h2>
      <LineChart :chart-data="chartData" />
    </div>
  </template>
  
  <script>
  import { Line } from "vue-chartjs";
  import { Chart as ChartJS, Title, Tooltip, Legend, LineElement, CategoryScale, LinearScale } from "chart.js";
  
  ChartJS.register(Title, Tooltip, Legend, LineElement, CategoryScale, LinearScale);
  
  export default {
    components: { LineChart: Line },
    data() {
      return {
        chartData: {
          labels: [],
          datasets: [
            {
              label: "Doanh thu theo ngày",
              data: [],
              borderColor: "rgb(75, 192, 192)",
              backgroundColor: "rgba(75, 192, 192, 0.2)",
            },
          ],
        },
      };
    },
    mounted() {
      this.fetchRevenue();
    },
    methods: {
      async fetchRevenue() {
        const response = await fetch("/api/statistics/revenue/daily");
        const data = await response.json();
        const labels = data.map((item) => item.date);
        const values = data.map((item) => item.revenue);
  
        this.chartData.labels = labels;
        this.chartData.datasets[0].data = values;
      },
    },
  };
  </script>
   -->