<template>
  <div class="order bg-[#EFEFEF] p-9">
    <h1 class="text-[25px] font-bold mb-6">Danh sách đơn hàng</h1>
    <div class="mb-8 flex justify-between">
      <div class="mb-8 flex">


        <div class="flex items-center">
          <input class="category__input w-[200px] h-[35px] rounded-lg mr-2 p-3" type="number" placeholder="Mã..." @focus="handleFocus"
            v-model="searchId" @keyup.enter="handleSearch" />
        </div>

        <div class="flex items-center mr-[50px]">
          <a-select v-model:value="selectedStatus" class="w-[200px]" placeholder="Chọn trạng thái"
            @change="handleSearch">
            <a-select-option value="">Tất cả</a-select-option>
            <a-select-option v-for="status in statusOptions" :key="status" :value="status">
              {{ status }}
            </a-select-option>
          </a-select>
        </div>


        <button @click="handleSearch"
          class="button text-[15px] ml-[80px] text-[#fff] bg-[#69C3A3] p-2 font-medium rounded-lg px-4">Tìm
          kiếm</button>
      </div>
    </div>

    <div>
      <a-table :columns="columns" :data-source="orderData.dataSource" :pagination="{
          total: orderData.totalElements,
          current: orderData.currentPage,
          pageSize: orderData.pageSize
        }" @change="handleTableChange">
        <template #bodyCell="{ column, record }">
          <span v-if="column.key === 'actions'" class="flex">
            <a href="#" @click.prevent="editOrder(record.id, record.status)" class="mr-4">
              <EditIcon class="w-[15px] h-[15px]"></EditIcon>
            </a>
            <a href="#" @click.prevent="watchOrder(record.id)" class="mr-4">
              <EyeIcon class="w-[15px] h-[15px]" />
            </a>
            <a-divider type="vertical" />
            <a href="#" @click.prevent="deleteOrder(record.id)">
              <TrashIcon class="w-[15px] h-[15px]"></TrashIcon>
            </a>
          </span>
          <span v-else>
            {{ record[column.dataIndex] }}
          </span>
        </template>
      </a-table>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, reactive, ref } from 'vue';
import { SearchIcon, AddIcon, EditIcon, TrashIcon, EyeIcon } from '@/assets/icons/icon.js';
import { format, parseISO } from 'date-fns';
import { useOrderStore } from '@/stores/orderStore';
import router from '@/router/index.js';

const columns = [
  { title: 'Mã đơn hàng', dataIndex: 'id', key: 'stt' },
  { title: 'Người nhận', dataIndex: 'buyer', key: 'name' },
  { title: 'Điện thoại', dataIndex: 'receiver_phone' },
  { title: 'Trạng thái', dataIndex: 'status' },
  // { title: 'Sản phẩm', dataIndex: 'quantity'},
  { title: 'Ngày tạo', dataIndex: 'created_at'},
  { title: 'Sửa lần cuối', dataIndex: 'modified_at'},
  { title: 'Hành động', key: 'actions' }
];

const orderStore = useOrderStore();
const searchName = ref('');
const searchId = ref('');
const selectedStatus = ref('');
const statusOptions = [
  'COMPLETED',
  'PENDING',
  'CANCELLED',
  'CONFIRMED',
  'PACKED',
  'SHIPPED',
  'RETURNED',
];

const exportData = reactive({
  dataSource: [],
  totalElements: 0,
  currentPage: 1,
  pageSize: 10
});



// const orderData = computed(() => {
//   const status = selectedStatus.value || '';

//   if (status === '') {
//     // Xử lý phân trang ở frontend khi không có status
//     const start = (orderStore.currentPage - 1) * orderStore.pageSize;
//     const end = start + orderStore.pageSize;

//     return {
//       dataSource: orderStore.orders.slice(start, end),
//       totalElements: orderStore.orders.length,
//       currentPage: orderStore.currentPage,
//       pageSize: orderStore.pageSize
//     };
//   }

//   // Trả về dữ liệu có sẵn phân trang từ API khi có status
//   return {
//     dataSource: orderStore.orders,
//     totalElements: orderStore.totalElements,
//     currentPage: orderStore.currentPage,
//     pageSize: orderStore.pageSize
//   };
// });
const orderData = computed(() => ({
  dataSource: orderStore.orders,
  totalElements: orderStore.totalElements,
  currentPage: orderStore.currentPage,
  pageSize: orderStore.pageSize
}));


const searchQuery = ref('');



// const handleTableChange = async (pagination) => {
//   const status = selectedStatus.value || '';
//   const id = searchId.value || null;

//   try {
//     if (status === '') {
//       // Nếu đang ở chế độ tìm theo id, không cần gọi API lại
//       orderStore.currentPage = pagination.current;
//     } else {
//       await orderStore.getListStatusOrderBySeller(
//         status,
//         pagination.current,
//         pagination.pageSize,
//         id
//       );
//     }
//   } catch (error) {
//     console.error('Error changing page:', error);
//   }
// };
const handleTableChange = (pagination) => {
  exportData.currentPage = pagination.current; // Cập nhật số trang hiện tại
  exportData.pageSize = pagination.pageSize;  // Cập nhật số lượng mỗi trang

  const status = selectedStatus.value || '';

  if (status === '') {
    // Nếu là "Tất cả", gọi fetchOrdersUser
    orderStore.fetchOrders(exportData.currentPage, exportData.pageSize);
  } else {
    // Nếu có trạng thái, gọi fetchOrdersByStatus
    orderStore.getListStatusOrderBySeller(status, exportData.currentPage, exportData.pageSize);
  }
};


//
const handleAction = () => {
  exportData.currentPage = 1;
   ordertoryStore.fetchOrders(exportData.currentPage, searchName.value, searchId.value);
};

// const handleSearch = async () => {
//   const status = selectedStatus.value || '';
//   const id = searchId.value || null;

//   try {
//     if (id !== null) {
//       // Tìm theo ID
//       await orderStore.fetchOrders(id);
//       orderStore.currentPage = 1; // Reset về trang 1
//       return;
//     }

//     if (status === '') {
//       // Lấy tất cả đơn hàng và xử lý phân trang ở frontend
//       await orderStore.fetchOrders();
//       orderStore.currentPage = 1; // Reset về trang 1
//     } else {
//       // Lấy theo status với phân trang từ API
//       await orderStore.getListStatusOrderBySeller(status, 1, exportData.pageSize);
//     }
//   } catch (error) {
//     console.error('Error searching orders:', error);
//   }
// };

const handleSearch = async () => {
  exportData.currentPage = 1;
  const status = selectedStatus.value || '';
  const id = searchId.value || null;

  if (status === '') {
    await orderStore.fetchOrders(exportData.currentPage, exportData.pageSize, id);
  } else {
    await orderStore.getListStatusOrderBySeller(status, exportData.currentPage, exportData.pageSize, id);
  }
};


const watchOrder = (id) => {
  console.log('Navigating to order:', id);
  router.push({ name: 'view-order-detail', params: { id } });

};

const editOrder = (id, status) => {
  orderStore.editOrder(id, status);
};


const handleAddNew = () => {
  router.push({ name: 'menu-11' });
};

onMounted(async () => {
  await orderStore.fetchOrders(exportData.currentPage, exportData.pageSize);

  console.log("vào được đây chưa fettch ra được đây chưa",orderStore.orders )
  await orderStore.getListStatusOrderBySeller('', exportData.currentPage, exportData.pageSize);
});
</script>
<style scoped lang="scss">
.order {
  box-shadow: rgba(100, 100, 111, 0.2) 0px 7px 29px 0px;
  border-radius: 10px;
  overflow: hidden;
}
</style>
