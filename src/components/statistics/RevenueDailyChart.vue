<template>
    <div>
      <canvas ref="dailyChart"></canvas>
    </div>
  </template>
  
  <script>
  import { Chart, LineElement, CategoryScale, LinearScale } from 'chart.js';
  Chart.register(LineElement, CategoryScale, LinearScale);
  
  export default {
    data() {
      return {
        chart: null,
        dailyData: []
      };
    },
    async created() {
      await this.fetchData();
      this.renderChart();
    },
    methods: {
      async fetchData() {
        const response = await fetch('/api/statistics/revenue/daily');
        this.dailyData = await response.json();
      },
      renderChart() {
        const dates = this.dailyData.map(item => new Date(item.date).toLocaleDateString());
        const revenues = this.dailyData.map(item => item.revenue);
  
        const ctx = this.$refs.dailyChart.getContext('2d');
        this.chart = new Chart(ctx, {
          type: 'line',
          data: {
            labels: dates,
            datasets: [
              {
                label: 'Daily Revenue',
                data: revenues,
                borderColor: '#42A5F5',
                backgroundColor: 'rgba(66, 165, 245, 0.2)',
                fill: true,
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
  