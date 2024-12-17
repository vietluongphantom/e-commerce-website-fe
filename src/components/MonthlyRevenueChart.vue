<template>
    <div>
      <h3>Doanh thu theo tháng</h3>
      <canvas ref="monthlyChart"></canvas>
    </div>
  </template>
  
  <script>
  import { Bar } from 'vue-chartjs';
  import {
    Chart as ChartJS,
    Title,
    Tooltip,
    Legend,
    BarElement,
    CategoryScale,
    LinearScale,
  } from 'chart.js';
  
  ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale);
  
  export default {
    name: 'MonthlyRevenueChart',
    data() {
      return {
        chartInstance: null,
      };
    },
    async mounted() {
      const response = await fetch('http://localhost:3000/api/statistics/revenue/monthly');
      const data = await response.json();
      const months = data.map(item => `Tháng ${item.month}`);
      const revenues = data.map(item => item.revenue);
  
      const chartData = {
        labels: months,
        datasets: [
          {
            label: 'Doanh thu',
            data: revenues,
            backgroundColor: 'green',
          },
        ],
      };
  
      this.renderChart(chartData);
    },
    methods: {
      renderChart(data) {
        const ctx = this.$refs.monthlyChart.getContext('2d');
        if (this.chartInstance) this.chartInstance.destroy();
        this.chartInstance = new Chart(ctx, {
          type: 'bar',
          data,
        });
      },
    },
  };
  </script>
  