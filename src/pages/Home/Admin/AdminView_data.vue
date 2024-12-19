<template>
  <div class="revenue-dashboard">
    <h1>Revenue Dashboard</h1>
    
    <!-- API 1: Doanh thu theo tháng -->
    <div class="api-section">
      <h2>Doanh Thu Theo Tháng</h2>
      <div class="input-group">
        <label>Năm:</label>
        <input 
          type="number" 
          v-model="monthlyRevenueYear" 
          placeholder="Nhập năm"
        />
        <button @click="fetchMonthlyRevenue">Tra cứu</button>
      </div>
      <table v-if="monthlyRevenueData.length">
        <thead>
          <tr>
            <th>Tháng</th>
            <th>Doanh Thu</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in monthlyRevenueData" :key="item.month">
            <td>{{ item.month }}</td>
            <td>{{ formatCurrency(item.revenue) }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- API 2: Doanh thu ngày theo tháng -->
    <div class="api-section">
      <h2>Doanh Thu Ngày Theo Tháng</h2>
      <div class="input-group">
        <label>Tháng:</label>
        <input 
          type="number" 
          v-model="dailyRevenueMonth" 
          placeholder="Nhập tháng"
        />
        <label>Năm:</label>
        <input 
          type="number" 
          v-model="dailyRevenueYear" 
          placeholder="Nhập năm"
        />
        <button @click="fetchDailyRevenue">Tra cứu</button>
      </div>
      <table v-if="dailyRevenueData.length">
        <thead>
          <tr>
            <th>Ngày</th>
            <th>Doanh Thu</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in dailyRevenueData" :key="item.date">
            <td>{{ formatDate(item.date) }}</td>
            <td>{{ formatCurrency(item.revenue) }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- API 3: Doanh thu khoảng thời gian -->
    <div class="api-section">
      <h2>Doanh Thu Theo Khoảng Thời Gian</h2>
      <div class="input-group">
        <label>Ngày bắt đầu:</label>
        <input 
          type="datetime-local" 
          v-model="startDate"
        />
        <label>Ngày kết thúc:</label>
        <input 
          type="datetime-local" 
          v-model="endDate"
        />
        <button @click="fetchRevenueByDateRange">Tra cứu</button>
      </div>
      <table v-if="revenueByDateRangeData.length">
        <thead>
          <tr>
            <th>Ngày</th>
            <th>Doanh Thu</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in revenueByDateRangeData" :key="item.date">
            <td>{{ formatDate(item.date) }}</td>
            <td>{{ formatCurrency(item.revenue) }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- API 4: Kiểm tra đơn hàng -->
    <div class="api-section">
      <h2>Thống Kê Đơn Hàng</h2>
      <table>
        <thead>
          <tr>
            <th>Trạng Thái</th>
            <th>Số Lượng</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Đơn Đã Hủy</td>
            <td>{{ orderStatistics.cancelledOrders }}</td>
          </tr>
          <tr>
            <td>Đơn Hoàn Thành</td>
            <td>{{ orderStatistics.completedOrders }}</td>
          </tr>
          <tr>
            <td>Đơn Đang Chờ</td>
            <td>{{ orderStatistics.pendingOrders }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- API 5: Thống kê sản phẩm theo thương hiệu -->
    <div class="api-section">
      <h2>Số Lượng Sản Phẩm Theo Thương Hiệu</h2>
      <table>
        <thead>
          <tr>
            <th>Thương Hiệu</th>
            <th>Số Lượng Sản Phẩm</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="brand in brandProducts" :key="brand.brandName">
            <td>{{ brand.brandName }}</td>
            <td>{{ brand.productCount }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- API 6: Thống kê sản phẩm theo danh mục -->
    <div class="api-section">
      <h2>Số Lượng Sản Phẩm Theo Danh Mục</h2>
      <table>
        <thead>
          <tr>
            <th>Danh Mục</th>
            <th>Số Lượng Sản Phẩm</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="category in categoryProducts" :key="category.categoryName">
            <td>{{ category.categoryName }}</td>
            <td>{{ category.productCount }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

// State variables cho từng API
const monthlyRevenueYear = ref(new Date().getFullYear())
const monthlyRevenueData = ref([])

const dailyRevenueMonth = ref(new Date().getMonth() + 1)
const dailyRevenueYear = ref(new Date().getFullYear())
const dailyRevenueData = ref([])

const startDate = ref('')
const endDate = ref('')
const revenueByDateRangeData = ref([])

const orderStatistics = ref({
  cancelledOrders: 0,
  completedOrders: 0,
  pendingOrders: 0
})

const brandProducts = ref([])
const categoryProducts = ref([])

// Hàm format tiền tệ
const formatCurrency = (value) => {
  return new Intl.NumberFormat('vi-VN', { 
    style: 'currency', 
    currency: 'VND' 
  }).format(value)
}

// Hàm format ngày
const formatDate = (timestamp) => {
  return new Date(parseInt(timestamp)).toLocaleDateString('vi-VN')
}

// API 1: Doanh thu theo tháng
const fetchMonthlyRevenue = async () => {
  try {
    const response = await axios.get(`/api/statistics/revenue/monthly?year=${monthlyRevenueYear.value}`)
    
    // Tạo mảng 12 tháng với giá trị 0
    const fullYearData = Array.from({length: 12}, (_, i) => ({
      month: i + 1,
      revenue: 0
    }))

    // Gán giá trị từ API
    response.data.forEach(item => {
      const monthIndex = fullYearData.findIndex(m => m.month === item.month)
      if (monthIndex !== -1) {
        fullYearData[monthIndex].revenue = item.revenue
      }
    })

    monthlyRevenueData.value = fullYearData
  } catch (error) {
    console.error('Lỗi khi lấy doanh thu theo tháng:', error)
  }
}

// API 2: Doanh thu ngày theo tháng
const fetchDailyRevenue = async () => {
  try {
    const response = await axios.get(`/api/statistics/revenue/daily?month=${dailyRevenueMonth.value.toString().padStart(2, '0')}&year=${dailyRevenueYear.value}`)
    
    // Tìm số ngày trong tháng
    const daysInMonth = new Date(dailyRevenueYear.value, dailyRevenueMonth.value, 0).getDate()
    
    // Tạo mảng đầy đủ các ngày với giá trị 0
    const fullMonthData = Array.from({length: daysInMonth}, (_, i) => ({
      date: new Date(dailyRevenueYear.value, dailyRevenueMonth.value - 1, i + 1).getTime(),
      revenue: 0
    }))

    // Gán giá trị từ API
    response.data.forEach(item => {
      const dateIndex = fullMonthData.findIndex(d => d.date === item.date)
      if (dateIndex !== -1) {
        fullMonthData[dateIndex].revenue = item.revenue
      }
    })

    dailyRevenueData.value = fullMonthData
  } catch (error) {
    console.error('Lỗi khi lấy doanh thu theo ngày:', error)
  }
}

// API 3: Doanh thu khoảng thời gian
const fetchRevenueByDateRange = async () => {
  try {
    const response = await axios.get(`/api/orders/revenue`, {
      params: {
        startDate: startDate.value + ':00',
        endDate: endDate.value + ':00'
      }
    })

    // Tạo mảng đầy đủ các ngày với giá trị 0
    const start = new Date(startDate.value)
    const end = new Date(endDate.value)
    const fullDateRangeData = []
    
    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
      fullDateRangeData.push({
        date: d.getTime(),
        revenue: 0
      })
    }

    // Gán giá trị từ API
    response.data.forEach(item => {
      const dateIndex = fullDateRangeData.findIndex(d => d.date === item.date)
      if (dateIndex !== -1) {
        fullDateRangeData[dateIndex].revenue = item.revenue
      }
    })

    revenueByDateRangeData.value = fullDateRangeData
  } catch (error) {
    console.error('Lỗi khi lấy doanh thu theo khoảng thời gian:', error)
  }
}

// API 4: Thống kê đơn hàng
const fetchOrderStatistics = async () => {
  try {
    const response = await axios.get('/api/statistics/orders')
    orderStatistics.value = response.data
  } catch (error) {
    console.error('Lỗi khi lấy thống kê đơn hàng:', error)
  }
}

// API 5: Sản phẩm theo thương hiệu
const fetchBrandProducts = async () => {
  try {
    const response = await axios.get('/api/brands/product-count')
    brandProducts.value = response.data
  } catch (error) {
    console.error('Lỗi khi lấy sản phẩm theo thương hiệu:', error)
  }
}

// API 6: Sản phẩm theo danh mục
const fetchCategoryProducts = async () => {
  try {
    const response = await axios.get('/api/products/category/product-count')
    categoryProducts.value = response.data
  } catch (error) {
    console.error('Lỗi khi lấy sản phẩm theo danh mục:', error)
  }
}

// Gọi các API ngay khi component mount
onMounted(() => {
  fetchMonthlyRevenue()
  fetchDailyRevenue()
  fetchOrderStatistics()
  fetchBrandProducts()
  fetchCategoryProducts()
})
</script>

<style scoped>
.revenue-dashboard {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.api-section {
  margin-bottom: 30px;
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 8px;
}

table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 15px;
}

table th, table td {
  border: 1px solid #ddd;
  padding: 10px;
  text-align: left;
}

.input-group {
  display: flex;
  gap: 10px;
  align-items: center;
  margin-bottom: 15px;
}

input {
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

button {
  padding: 8px 15px;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

button:hover {
  background-color: #45a049;
}
</style>