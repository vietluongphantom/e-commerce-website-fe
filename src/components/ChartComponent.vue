<template>
    <div>
      <line-chart :chart-data="dailyRevenueData" />
      <bar-chart :chart-data="monthlyRevenueData" />
      <doughnut-chart :chart-data="ordersData" />
    </div>
  </template>
  
  <script>
  import { Line, Bar, Doughnut } from 'vue-chartjs'
  import { Chart as ChartJS, Title, Tooltip, Legend, LineElement, BarElement, ArcElement, CategoryScale, LinearScale } from 'chart.js'
  
  
  ChartJS.register(Title, Tooltip, Legend, LineElement, BarElement, ArcElement, CategoryScale, LinearScale)
  
  export default {
    components: {
      'line-chart': Line,
      'bar-chart': Bar,
      'doughnut-chart': Doughnut
    },
    data () {
      return {
        dailyRevenueData: {
          labels: [],
          datasets: [
            {
              label: 'Revenue',
              backgroundColor: '#f87979',
              data: []
            }
          ]
        },
        monthlyRevenueData: {
          labels: [],
          datasets: [
            {
              label: 'Revenue',
              backgroundColor: '#7b00ff',
              data: []
            }
          ]
        },
        ordersData: {
          labels: ['Cancelled', 'Completed', 'Total'],
          datasets: [
            {
              label: 'Orders',
              backgroundColor: ['#ff6384', '#36a2eb', '#cc65fe'],
              data: []
            }
          ]
        }
      }
    },
    mounted () {
      this.fetchData()
    },
    methods: {
      fetchData () {
        // Dữ liệu revenue theo ngày
        fetch('/api/statistics/revenue/daily')
          .then(response => response.json())
          .then(data => {
            this.dailyRevenueData.labels = data.map(item => new Date(item.date).toLocaleDateString())
            this.dailyRevenueData.datasets[0].data = data.map(item => item.revenue)
          })
  
        // Dữ liệu revenue theo tháng
        fetch('/api/statistics/revenue/monthly')
          .then(response => response.json())
          .then(data => {
            this.monthlyRevenueData.labels = data.map(item => `Tháng ${item.month}`)
            this.monthlyRevenueData.datasets[0].data = data.map(item => item.revenue)
          })
  
        // Dữ liệu orders
        fetch('/api/statistics/orders')
          .then(response => response.json())
          .then(data => {
            this.ordersData.datasets[0].data = [data.cancelledOrders, data.completedOrders, data.totalOrders]
          })
      }
    }
  }
  </script>
  
  <style scoped>
  /* CSS tuỳ chỉnh cho biểu đồ */
  </style>
  
