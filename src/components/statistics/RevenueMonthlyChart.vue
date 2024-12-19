<template>
    <div>
      <canvas ref="monthlyChart"></canvas>
    </div>
  </template>
  
  <script>
  import { Chart, BarElement, CategoryScale, LinearScale } from 'chart.js';
  Chart.register(BarElement, CategoryScale, LinearScale);
  import getRevenueMonthly from '@/domain/apiServices.js';
  export default {
    data() {
      return {
        chart: null,
        monthlyData: []
      };
    },
    async created() {
      await this.fetchData();
      this.renderChart();
    },
    methods: {
      async fetchData() {
        const response = await fetch(getRevenueMonthly());
        this.monthlyData = await response.json();
      },
      renderChart() {
        const months = this.monthlyData.map(item => `Tháng ${item.month}`);
        const revenues = this.monthlyData.map(item => item.revenue);
  
        const ctx = this.$refs.monthlyChart.getContext('2d');
        this.chart = new Chart(ctx, {
          type: 'bar',
          data: {
            labels: months,
            datasets: [
              {
                label: 'Monthly Revenue',
                data: revenues,
                backgroundColor: '#66BB6A',
              }
            ]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
          }
        });
      }
    }
  };
  </script>
  
  <style scoped>
  canvas {
    height: 400px;
  }
  </style>
  