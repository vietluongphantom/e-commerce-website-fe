<template>
  <div class="container mx-auto p-4">
    <!-- Dashboard Section -->
    <div class="grid grid-cols-4 gap-6">
      <div class="db__item bg-[#F0F4F8] p-5 rounded-lg">
        <div class="flex justify-between items-center">
          <span class="text-[18px] font-medium">Sản phẩm</span>
          <div class="p-2 bg-[#E0DCFE] rounded-md">
            <ShopIcon class="w-[20px] h-[20px]"></ShopIcon>
          </div>
        </div>
        <p class="mt-3 text-[28px] font-bold">{{sellerStore.sellerInfo.product_quantity}}</p>
        <button @click="onClickProduct" class="mt-2 text-[15px] text-[#7A7A7A]">Chi tiết</button>
      </div>

      <div class="db__item bg-[#F0F4F8] p-5 rounded-lg">
        <div class="flex justify-between items-center">
          <span class="text-[18px] font-medium">Khuyến mại</span>
          <div class="p-2 bg-[#E0DCFE] rounded-md">
            <ListIcon class="w-[20px] h-[20px]"></ListIcon>
          </div>
        </div>
        <p class="mt-3 text-[28px] font-bold">{{sellerStore.sellerInfo.voucher_quantity}}</p>
        <button @click="onClickVoucher" class="mt-2 text-[15px] text-[#7A7A7A]">Chi tiết</button>
      </div>

      <div class="db__item bg-[#F0F4F8] p-5 rounded-lg">
        <div class="flex justify-between items-center">
          <span class="text-[18px] font-medium">Đơn hàng</span>
          <div class="p-2 bg-[#E0DCFE] rounded-md">
            <ReceiptIcon class="w-[20px] h-[20px]"></ReceiptIcon>
          </div>
        </div>
        <p class="mt-3 text-[28px] font-bold">{{sellerStore.sellerInfo.order_quantity}}</p>
        <button @click="onClickOrder" class="mt-2 text-[15px] text-[#7A7A7A]">Chi tiết</button>
      </div>

      <div class="db__item bg-[#F0F4F8] p-5 rounded-lg">
        <div class="flex justify-between items-center">
          <span class="text-[18px] font-medium">Nhà kho</span>
          <div class="p-2 bg-[#E0DCFE] rounded-md">
            <CopyrightIcon class="w-[20px] h-[20px]"></CopyrightIcon>
          </div>
        </div>
        <p class="mt-3 text-[28px] font-bold">{{sellerStore.sellerInfo.warehouse_quantity}}</p>
        <button @click="onClickWarehouse" class="mt-2 text-[15px] text-[#7A7A7A]">Chi tiết</button>
      </div>
    </div>
    <br>
    <!-- Year Input for API 1 -->
    <div class="mb-4">
      <label class="block mb-2 font-bold">Chọn năm để hiển thị doanh thu</label>
      <input v-model="year" type="number" class="border p-2 rounded" />
      <button @click="fetchMonthlyRevenue" class="ml-2 bg-blue-500 text-white px-4 py-2 rounded">
        Xác nhận
      </button>
    </div>

    <!-- Date Range for API 2 & 3 -->
    <div>
    <p class="font-bold mb-2">Chọn khoảng thời gian *:</p>
    <div class="mb-4 flex gap-4">
      <div>
        <label class="block mb-2">Bắt đầu:</label>
        <input v-model="startDate" type="date" class="border p-2 rounded" />
      </div>
      <div>
        <label class="block mb-2">Kết thúc:</label>
        <input v-model="endDate" type="date" class="border p-2 rounded" />
      </div>
      <button @click="fetchDateRangeData" class="mt-6 bg-blue-500 text-white px-4 py-2 rounded">
        Xác nhận
      </button>
      <!-- Error message for invalid date range -->
      <p v-if="dateError" class="mt-2 text-red-500">Ngày bắt đầu phải nhỏ hơn ngày kết thúc.</p>
    </div>
  </div>

    <!-- Charts -->
    <div class="grid grid-cols-2 gap-4">
      <!-- Monthly Revenue Chart -->
      <div class="border p-4 rounded">
        <h2 class="text-lg font-bold mb-4">Doanh thu hàng tháng</h2>
        <LineChart :data="monthlyRevenueData" :options="monthlyChartOptions" />
      </div>

      <!-- Daily Revenue Chart -->
      <div class="border p-4 rounded">
        <h2 class="text-lg font-bold mb-4">Doanh thu trong khoảng thời gian *</h2>
        <LineChart :data="dailyRevenueData" :options="dailyChartOptions" />
      </div>

      <!-- Revenue vs Profit Chart -->
      <div class="border p-4 rounded">
        <h2 class="text-lg font-bold mb-4">Tổng doanh thu và lợi nhuận trong khoảng thời gian *</h2>
        <BarChart :data="revenueProfitData" :options="revenueProfitOptions" />
      </div>

      <!-- Order Status Chart -->
      <div class="border p-4 rounded">
        <h2 class="text-lg font-bold mb-4">Trạng thái đơn hàng</h2>
        <PieChart :data="orderStatusData" :options="pieChartOptions" />
      </div>

      <!-- Address Distribution Chart -->
      <div class="border p-4 rounded">
        <h2 class="text-lg font-bold mb-4">Thống kê địa chỉ</h2>
        <PieChart :data="addressDistributionData" :options="pieChartOptions" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ShopIcon, ListIcon, ReceiptIcon, CopyrightIcon } from '@/assets/icons/icon.js';
import { ref, onMounted } from 'vue';
import { useSellersStore } from '@/stores/accountSellerStore';
import router from '@/router/index.js';
import axios from 'axios';
import { Line as LineChart, Bar as BarChart, Pie as PieChart } from 'vue-chartjs';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Title, Tooltip, Legend);

const sellerStore = useSellersStore();
const year = ref(new Date().getFullYear());
const startDate = ref('');
const endDate = ref('');
const token = localStorage.getItem("token");
const headers = { Authorization: `Bearer ${token}` };
const dateError = ref(false); 

// Chart data refs
const monthlyRevenueData = ref({ labels: [], datasets: [] });
const dailyRevenueData = ref({ labels: [], datasets: [] });
const revenueProfitData = ref({ labels: [], datasets: [] });
const orderStatusData = ref({ labels: [], datasets: [] });
const addressDistributionData = ref({ labels: [], datasets: [] });

// Chart options
const monthlyChartOptions = { responsive: true, plugins: { title: { display: true, text: '' } } };
const dailyChartOptions = { responsive: true, plugins: { title: { display: true, text: '' } } };
const revenueProfitOptions = { responsive: true, plugins: { title: { display: true, text: '' } } };
const pieChartOptions = { responsive: true };

// Fetch functions
const fetchMonthlyRevenue = async () => {
  try {
    const response = await axios.get(`http://localhost:3000/api/statistics/revenue/monthlyByShop?year=${year.value}`, { headers });
    const monthlyData = Array(12).fill(0);
    response.data.forEach(item => {
      monthlyData[item.month - 1] = item.revenue;
    });

    monthlyRevenueData.value = {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
      datasets: [{
        label: 'Revenue',
        data: monthlyData,
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1
      }]
    };
  } catch (error) {
    console.error('Error fetching monthly revenue:', error);
  }
};

//   const fetchDateRangeData = async () => {
//     try {
//       const dailyResponse = await axios.get(`http://localhost:3000/api/orders/revenueByShop?startDate=${startDate.value}T00:00:00&endDate=${endDate.value}T23:59:59`, { headers });
//       const start = new Date(startDate.value);
//       const end = new Date(endDate.value);
//       const dateArray = [];
//       const revenueData = {};

//       for (let date = new Date(start); date <= end; date.setDate(date.getDate() + 1)) {
//         dateArray.push(new Date(date).toISOString().split('T')[0]);
//         revenueData[date.toISOString().split('T')[0]] = 0;
//       }

//       dailyResponse.data.forEach(item => {
//         const date = new Date(item.date).toISOString().split('T')[0];
//         revenueData[date] = item.revenue;
//       });

//       dailyRevenueData.value = {
//         labels: dateArray,
//         datasets: [{
//           label: 'Daily Revenue',
//           data: Object.values(revenueData),
//           borderColor: 'rgb(53, 162, 235)',
//           tension: 0.1
//         }]
//       };

//       const profitResponse = await axios.get(`http://localhost:3000/api/statistics/profitByShop?startDate=${startDate.value}T00:00:00&endDate=${endDate.value}T23:59:59`, { headers });
//       revenueProfitData.value = {
//         labels: ['Revenue & Profit'],
//         datasets: [
//           {
//             label: 'Revenue',
//             data: [profitResponse.data.totalRevenue],
//             backgroundColor: 'rgba(53, 162, 235, 0.5)'
//           },
//           {
//             label: 'Profit',
//             data: [profitResponse.data.totalProfit],
//             backgroundColor: 'rgba(75, 192, 192, 0.5)'
//           }
//         ]
//       };
//     } catch (error) {
//       console.error('Error fetching date range data:', error);
//     }
//   };

//   const fetchOrderStatus = async () => {
//     try {
//       const response = await axios.get('http://localhost:3000/api/statistics/ordersByShop', { headers });
//       orderStatusData.value = {
//         labels: Object.keys(response.data),
//         datasets: [{
//           data: Object.values(response.data),
//           backgroundColor: [
//             'rgba(255, 99, 132, 0.5)',
//             'rgba(54, 162, 235, 0.5)',
//             'rgba(255, 206, 86, 0.5)',
//             'rgba(75, 192, 192, 0.5)',
//             'rgba(153, 102, 255, 0.5)',
//             'rgba(255, 159, 64, 0.5)'
//           ]
//         }]
//       };
//     } catch (error) {
//       console.error('Error fetching order status:', error);
//     }
//   };
const fetchDateRangeData = async () => {
// Reset error message
dateError.value = false;

// Validate date range
if (startDate.value && endDate.value && new Date(startDate.value) > new Date(endDate.value)) {
  dateError.value = true;
  return;  // Stop execution if the date range is invalid
}

try {
  const dailyResponse = await axios.get(`http://localhost:3000/api/orders/revenueByShop?startDate=${startDate.value}T00:00:00&endDate=${endDate.value}T23:59:59`, { headers });
  const start = new Date(startDate.value);
  const end = new Date(endDate.value);
  const dateArray = [];
  const revenueData = {};

  for (let date = new Date(start); date <= end; date.setDate(date.getDate() + 1)) {
    dateArray.push(new Date(date).toISOString().split('T')[0]);
    revenueData[date.toISOString().split('T')[0]] = 0;
  }

  dailyResponse.data.forEach(item => {
    const date = new Date(item.date).toISOString().split('T')[0];
    revenueData[date] = item.revenue;
  });

  dailyRevenueData.value = {
    labels: dateArray,
    datasets: [{
      label: 'Daily Revenue',
      data: Object.values(revenueData),
      borderColor: 'rgb(53, 162, 235)',
      tension: 0.1
    }]
  };

  const profitResponse = await axios.get(`http://localhost:3000/api/statistics/profitByShop?startDate=${startDate.value}T00:00:00&endDate=${endDate.value}T23:59:59`, { headers });
  revenueProfitData.value = {
    labels: ['Revenue & Profit'],
    datasets: [
      {
        label: 'Revenue',
        data: [profitResponse.data.totalRevenue],
        backgroundColor: 'rgba(53, 162, 235, 0.5)'
      },
      {
        label: 'Profit',
        data: [profitResponse.data.totalProfit],
        backgroundColor: 'rgba(75, 192, 192, 0.5)'
      }
    ]
  };
} catch (error) {
  console.error('Error fetching date range data:', error);
}
};
const fetchOrderStatus = async () => {
try {
  const response = await axios.get('http://localhost:3000/api/statistics/ordersByShop', { headers });
  
  // Mapping the English keys to Vietnamese labels
  const labelMapping = {
    cancelledOrders: 'Đã hủy',
    packedOrders: 'Đóng gói',
    completedOrders: 'Hoàn thành',
    shippedOrders: 'Vận chuyển',
    pendingOrders: 'Chờ xác nhận',
    confirmedOrders: 'Xác nhận'
  };

  orderStatusData.value = {
    labels: Object.keys(response.data).map(key => labelMapping[key]),  // Use Vietnamese labels
    datasets: [{
      data: Object.values(response.data),
      backgroundColor: [
        'rgba(255, 99, 132, 0.5)',
        'rgba(54, 162, 235, 0.5)',
        'rgba(255, 206, 86, 0.5)',
        'rgba(75, 192, 192, 0.5)',
        'rgba(153, 102, 255, 0.5)',
        'rgba(255, 159, 64, 0.5)'
      ]
    }]
  };
} catch (error) {
  console.error('Error fetching order status:', error);
}
};


const fetchAddressDistribution = async () => {
  try {
    const response = await axios.get('http://localhost:3000/api/orders/address-detail', { headers });
    addressDistributionData.value = {
      labels: Object.keys(response.data),
      datasets: [{
        data: Object.values(response.data),
        backgroundColor: [
          'rgba(255, 99, 132, 0.5)',
          'rgba(54, 162, 235, 0.5)',
          'rgba(255, 206, 86, 0.5)'
        ]
      }]
    };
  } catch (error) {
    console.error('Error fetching address distribution:', error);
  }
};

onMounted(() => {
  fetchOrderStatus();
  fetchAddressDistribution();
  sellerStore.getBasicInfo();
});

// Navigation functions
const onClickOrder = () => {
  router.push({ name: 'menu-8' });
};

const onClickProduct = () => {
  router.push({ name: 'menu-4' });
};

const onClickVoucher = () => {
  router.push({ name: 'menu-6' });
};

const onClickWarehouse = () => {
  router.push({ name: 'menu-10' });
};

</script>

<style scoped lang="scss">
.db {
  border-left: 3px solid;
  &__item {
    box-shadow:
      rgba(50, 50, 93, 0.25) 0px 13px 27px -5px,
      rgba(0, 0, 0, 0.3) 0px 8px 16px -8px;
  }
}
</style>
