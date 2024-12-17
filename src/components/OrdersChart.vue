<template>
    <div>
      <PieChart v-if="chartData" :chart-data="chartData" />
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue';
  import { Pie } from 'vue-chartjs';
  import {
    Chart as ChartJS,
    Title,
    Tooltip,
    Legend,
    ArcElement,
  } from 'chart.js';
  import apiServices from '@/domain/apiServices';
  
  // Register the necessary Chart.js components
  ChartJS.register(Title, Tooltip, Legend, ArcElement);
  
  const chartData = ref(null);
  
  onMounted(async () => {
    try {
      const response = await apiServices.getOrders();
      const { cancelledOrders, completedOrders, pendingOrders } = response.data;
  
      // Prepare data for Chart.js
      chartData.value = {
        labels: ['Cancelled Orders', 'Completed Orders', 'PendingOrders'],
        datasets: [
          {
            label: 'Order Statistics',
            backgroundColor: ['#FF0000', '#00FF00', '#FF2900'],
            data: [cancelledOrders, completedOrders, pendingOrders],
          },
        ],
      };
    } catch (error) {
      console.error('Error fetching order data', error);
    }
  });
  </script>
  
  <style scoped>
  div {
    max-width: 400px;
    margin: 0 auto;
  }
  </style>
  