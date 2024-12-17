<template>
    <div>
      <h3>Doanh thu theo ngày</h3>
      <canvas ref="dailyChart"></canvas>
    </div>
  </template>
  
  <script>
  import { Line } from 'vue-chartjs';
  import {
    Chart as ChartJS,
    Title,
    Tooltip,
    Legend,
    LineElement,
    CategoryScale,
    LinearScale,
  } from 'chart.js';
  
  ChartJS.register(Title, Tooltip, Legend, LineElement, CategoryScale, LinearScale);
  
  export default {
    name: 'DailyRevenueChart',
    components: { Line },
    data() {
      return {
        chartData: null,
        chartInstance: null,
      };
    },
    async mounted() {
      const response = await fetch('http://localhost:3000/api/statistics/revenue/daily');
      const data = await response.json();
      const dates = data.map(item => new Date(item.date).toLocaleDateString());
      const revenues = data.map(item => item.revenue);
  
      const chartData = {
        labels: dates,
        datasets: [
          {
            label: 'Doanh thu',
            data: revenues,
            borderColor: 'blue',
            fill: false,
          },
        ],
      };
  
      this.renderChart(chartData);
    },
    methods: {
      renderChart(data) {
        const ctx = this.$refs.dailyChart.getContext('2d');
        if (this.chartInstance) this.chartInstance.destroy();
        this.chartInstance = new Chart(ctx, {
          type: 'line',
          data,
        });
      },
    },
  };
  </script>
  