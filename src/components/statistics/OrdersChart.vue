<!-- components/StatisticsChart.vue -->
<template>
    <div>
      <PieChart v-if="chartData" :chart-data="chartData" />
    </div>
  </template>
  
  <script>
  import { defineComponent, ref, onMounted } from "vue";
  import { Pie } from "vue-chartjs";
  import {
    Chart as ChartJS,
    Title,
    Tooltip,
    Legend,
    ArcElement,
  } from "chart.js";
  import { fetchStatistics } from "@/src/router/fetchStatistics.js";
  
  // Register các thành phần Chart.js
  ChartJS.register(Title, Tooltip, Legend, ArcElement);
  
  export default defineComponent({
    name: "StatisticsChart",
    components: {
      PieChart: Pie,
    },
    setup() {
      const chartData = ref(null);
  
      const initializeChart = async () => {
        const data = await fetchStatistics();
  
        chartData.value = {
          labels: ["Cancelled Orders", "Completed Orders"],
          datasets: [
            {
              label: "Orders",
              data: [data.cancelledOrders, data.completedOrders],
              backgroundColor: ["#FF6384", "#36A2EB"],
            },
          ],
        };
      };
  
      onMounted(initializeChart);
  
      return {
        chartData,
      };
    },
  });
  </script>
  
  <style scoped>
  /* CSS nếu cần */
  </style>
  