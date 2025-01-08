<template>
  <div class="container mx-auto p-4">
    <h1 class="text-2xl font-bold mb-4">Thống kê</h1>

    <!-- Inputs for API 1: Monthly Revenue -->
    <div class="mb-4">
  <label class="block mb-2">Doanh thu hàng tháng của năm</label>
  <input 
    v-model="monthlyRevenueYear" 
    type="number" 
    class="border p-2 w-1/7"
    @input="throttledFetchMonthlyRevenue"
  />
</div>


    <!-- Inputs for API 2: Daily Revenue -->
    <div class="mb-4">
      <label class="block mb-2">Doanh thu hàng ngày của tháng</label>
      <div class="flex space-x-2">
        <input 
          v-model="dailyRevenueMonth" 
          type="number" 
          min="1" 
          max="12" 
          placeholder="Month"
          class="border p-2 w-1/9"
          @input="throttledFetchDailyRevenue"
        />
        <input 
          v-model="dailyRevenueYear" 
          type="number" 
          placeholder="Year"
          class="border p-2 w-1/9"
          @input="throttledFetchDailyRevenue"
        />
      </div>
    </div>

    <!-- Inputs for API 3: Date Range Revenue -->
    <div class="mb-4">
  <label class="block mb-2">Chọn một khoảng thời gian *</label>
  <div class="flex space-x-2">
    <input 
      v-model="startDate" 
      type="datetime-local" 
      class="border p-2 w-1/4"
      @input="fetchDateRangeRevenue"
    />
    <input 
      v-model="endDate" 
      type="datetime-local" 
      class="border p-2 w-1/4"
      @input="fetchDateRangeRevenue"
    />
  </div>
  <p v-if="dateRangeError" class="text-red-500 mt-2">{{ dateRangeError }}</p>
</div>


    <!-- Charts Container -->
    <div class="grid grid-cols-2 gap-4">
      <!-- Monthly Revenue Chart -->
      <div>
        <h2 class="text-xl font-semibold mb-2">Doanh thu hàng tháng</h2>
        <canvas ref="monthlyRevenueChart"></canvas>
      </div>

      <!-- Daily Revenue Chart -->
      <div>
        <h2 class="text-xl font-semibold mb-2">Doanh thu hàng ngày</h2>
        <canvas ref="dailyRevenueChart"></canvas>
      </div>

      <!-- Date Range Revenue Chart -->
      <div>
        <h2 class="text-xl font-semibold mb-2">Doanh thu trong khoảng thời gian *</h2>
        <canvas ref="dateRangeRevenueChart"></canvas>
      </div>

      <!-- Order Statistics -->
      <div>
        <h2 class="text-xl font-semibold mb-2">Trạng thái đơn hàng</h2>
        <canvas ref="orderStatisticsChart"></canvas>
      </div>

      <!-- Brand Product Count -->
      <div>
        <h2 class="text-xl font-semibold mb-2">Loại sản phẩm theo thương hiệu</h2>
        <canvas ref="brandProductChart"></canvas>
      </div>

      <!-- Category Product Count -->
      <div>
        <h2 class="text-xl font-semibold mb-2">Loại sản phẩm theo danh mục</h2>
        <canvas ref="categoryProductChart"></canvas>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import Chart from 'chart.js/auto'
import throttle from 'lodash/throttle'

// Refs for input
const monthlyRevenueYear = ref(new Date().getFullYear())
const dailyRevenueMonth = ref(1)
const dailyRevenueYear = ref(new Date().getFullYear())
const startDate = ref('')
const endDate = ref('')

// Chart references
const monthlyRevenueChart = ref(null)
const dailyRevenueChart = ref(null)
const dateRangeRevenueChart = ref(null)
const orderStatisticsChart = ref(null)
const brandProductChart = ref(null)
const categoryProductChart = ref(null)

// Helper to fetch and render charts
const fetchAndRenderChart = async (url, params, chartRef, chartOptions) => {
  try {
    const response = await axios.get(url, { params })
    if (chartRef.value.chart) chartRef.value.chart.destroy()
    chartRef.value.chart = new Chart(chartRef.value, {
      type: chartOptions.type,
      data: chartOptions.getData(response.data),
      options: chartOptions.options || {}
    })
  } catch (error) {
    console.error(`Error fetching data from ${url}:`, error)
  }
}

// Fetch monthly revenue
const fetchMonthlyRevenue = () => {
  fetchAndRenderChart(
    '/api/statistics/revenue/monthly',
    { year: monthlyRevenueYear.value },
    monthlyRevenueChart,
    {
      type: 'bar',
      getData: (data) => ({
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        datasets: [{
          label: 'Monthly Revenue',
          data: Array(12).fill(0).map((_, idx) => data.find(item => item.month === idx + 1)?.revenue || 0),
          backgroundColor: 'rgba(75, 192, 192, 0.6)'
        }]
      })
    }
  )
}

// Fetch daily revenue
const fetchDailyRevenue = () => {
  if (!dailyRevenueYear.value || !dailyRevenueMonth.value) return
  fetchAndRenderChart(
    '/api/statistics/revenue/daily',
    { 
      month: String(dailyRevenueMonth.value).padStart(2, '0'), 
      year: dailyRevenueYear.value 
    },
    dailyRevenueChart,
    {
      type: 'bar',
      getData: (data) => ({
        labels: Array.from({ length: 31 }, (_, i) => i + 1),
        datasets: [{
          label: 'Daily Revenue',
          data: Array(31).fill(0).map((_, idx) => data.find(item => new Date(item.date).getDate() === idx + 1)?.revenue || 0),
          backgroundColor: 'rgba(255, 99, 132, 0.6)'
        }]
      })
    }
  )
}

// Fetch date range revenue
// Thêm biến lưu lỗi
const dateRangeError = ref('')

// Cập nhật hàm fetchDateRangeRevenue
const fetchDateRangeRevenue = () => {
  // Reset thông báo lỗi
  dateRangeError.value = ''

  // Kiểm tra nếu một trong hai giá trị rỗng
  if (!startDate.value || !endDate.value) return

  // Chuyển đổi startDate và endDate thành đối tượng Date
  const start = new Date(startDate.value)
  const end = new Date(endDate.value)

  // Kiểm tra tính hợp lệ của khoảng thời gian
  if (start >= end) {
    dateRangeError.value = 'Ngày bắt đầu phải nhỏ hơn ngày kết thúc.'
    return
  }

  // Nếu hợp lệ, gọi API và vẽ biểu đồ
  // fetchAndRenderChart(
  //   '/api/orders/revenue',
  //   { startDate: startDate.value, endDate: endDate.value },
  //   dateRangeRevenueChart,
  //   {
  //     type: 'bar',
  //     getData: (data) => ({
  //       labels: data.map(item => new Date(item.date).toLocaleDateString()),
  //       datasets: [{
  //         label: 'Revenue by Date',
  //         data: data.map(item => item.revenue),
  //         backgroundColor: 'rgba(54, 162, 235, 0.6)'
  //       }]
  //     })
  //   }
  // )

  fetchAndRenderChart(
  '/api/orders/revenue',
  { startDate: startDate.value, endDate: endDate.value },
  dateRangeRevenueChart,
  {
    type: 'line', // Thay đổi loại biểu đồ
    getData: (data) => {
      // Tạo mảng các ngày từ startDate đến endDate
      const start = new Date(startDate.value);
      const end = new Date(endDate.value);
      const dateLabels = [];
      for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
        dateLabels.push(new Date(d).toLocaleDateString());
      }

      // Tạo đối tượng để tra cứu doanh thu theo ngày
      const revenueLookup = data.reduce((acc, item) => {
        acc[new Date(item.date).toLocaleDateString()] = item.revenue;
        return acc;
      }, {});

      // Tạo dữ liệu đầy đủ, gán 0 cho các ngày không có giá trị
      const revenueData = dateLabels.map(label => revenueLookup[label] || 0);

      return {
        labels: dateLabels,
        datasets: [{
          label: 'Revenue by Date',
          data: revenueData,
          backgroundColor: 'rgba(54, 162, 235, 0.6)',
          borderColor: 'rgba(54, 162, 235, 1)',
          fill: false, // Không tô màu dưới đường
        }]
      };
    }
  }
);

}


// Fetch order statistics
const fetchOrderStatistics = async () => {
  try {
    const response = await axios.get('/api/statistics/orders')
    const { cancelledOrders, completedOrders, pendingOrders, packedOrders, shippedOrders, confirmedOrders } = response.data

  new Chart(orderStatisticsChart.value, {
  type: 'pie',
  data: {
    labels: ['Đã huỷ', 'Hoàn thành', 'Chờ xác nhận', 'Đóng gói', 'Vận chuyển', 'Xác nhận'],
    datasets: [{
      data: [cancelledOrders, completedOrders, pendingOrders, packedOrders, shippedOrders, confirmedOrders],
      backgroundColor: [
        'rgba(255, 99, 132, 0.6)', // Cancelled
        'rgba(75, 192, 192, 0.6)', // Completed
        'rgba(255, 205, 86, 0.6)', // Pending
        'rgba(54, 162, 235, 0.6)', // Packed
        'rgba(153, 102, 255, 0.6)', // Shipped
        'rgba(255, 159, 64, 0.6)'  // Confirmed
      ]
    }]
  }
})
  } catch (error) {
    console.error('Error fetching order statistics:', error)
  }
}

// Fetch brand product count
const fetchBrandProductCount = async () => {
  try {
    const response = await axios.get('/api/brands/product-count')
    const brandNames = response.data.map(item => item.brandName)
    const productCounts = response.data.map(item => item.productCount)

    new Chart(brandProductChart.value, {
      type: 'bar',
      data: {
        labels: brandNames,
        datasets: [{
          label: 'Product Count by Brand',
          data: productCounts,
          backgroundColor: 'rgba(153, 102, 255, 0.6)'
        }]
      }
    })
  } catch (error) {
    console.error('Error fetching brand product count:', error)
  }
}

// Fetch category product count
const fetchCategoryProductCount = async () => {
  try {
    const response = await axios.get('/api/products/category/product-count')
    const categoryNames = response.data.map(item => item.categoryName)
    const productCounts = response.data.map(item => item.productCount)

    new Chart(categoryProductChart.value, {
      type: 'bar',
      data: {
        labels: categoryNames,
        datasets: [{
          label: 'Product Count by Category',
          data: productCounts,
          backgroundColor: 'rgba(255, 159, 64, 0.6)'
        }]
      }
    })
  } catch (error) {
    console.error('Error fetching category product count:', error)
  }
}

// Throttle API calls
const throttledFetchMonthlyRevenue = throttle(fetchMonthlyRevenue, 500)
const throttledFetchDailyRevenue = throttle(fetchDailyRevenue, 500)

// Fetch all data when component mounts
onMounted(() => {
  fetchMonthlyRevenue()
  fetchDailyRevenue()
  fetchDateRangeRevenue()
  fetchOrderStatistics()
  fetchBrandProductCount()
  fetchCategoryProductCount()
})
</script>

<style scoped>
.container {
  max-width: 1200px;
  margin: 0 auto;
}
</style>
