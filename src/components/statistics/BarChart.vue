<template>
    <div>
      <canvas id="ordersChart"></canvas>
    </div>
  </template>
  
  <script>
  import { Chart } from 'chart.js';
  
  export default {
    name: "BarChart",
    props: {
      ordersData: {
        type: Object,
        required: true,
      },
    },
    mounted() {
      this.drawChart();
    },
    methods: {
      drawChart() {
        const ctx = document.getElementById('ordersChart').getContext('2d');
  
        new Chart(ctx, {
          type: 'bar',
          data: {
            labels: ['Cancelled Orders', 'Completed Orders', 'Pending Orders'],
            datasets: [
              {
                label: 'Order Counts',
                data: [
                  this.ordersData.cancelledOrders,
                  this.ordersData.completedOrders,
                  this.ordersData.pendingOrders,
                ],
                backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
              },
            ],
          },
          options: {
            responsive: true,
            plugins: {
              legend: {
                display: true,
              },
            },
          },
        });
      },
    },
  };
  </script>
  
  <style>
  canvas {
    max-width: 600px;
    margin: 0 auto;
  }
  </style>
  