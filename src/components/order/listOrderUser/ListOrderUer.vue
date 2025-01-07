<template>
  <div class="order bg-[#EFEFEF] p-9">
    <h1 class="text-[25px] font-bold mb-6">Danh sách đơn hàng</h1>
    <div class="mb-8 flex justify-between">
      <div class="mb-8 flex">
        <div class="flex items-center">
          <input
            class="category__input w-[200px] h-[35px] rounded-lg mr-2 p-3"
            placeholder="Mã..."
            @focus="handleFocus"
            v-model="searchId"
            @keyup.enter="handleSearch"
          />
        </div>

        <div class="flex items-center mr-[50px]">
          <a-select v-model:value="selectedStatus" class="w-[200px]" placeholder="Chọn trạng thái" @change="handleSearch">
            <a-select-option value="">Tất cả</a-select-option>
            <a-select-option v-for="status in statusOptions" :key="status" :value="status">
              {{ status }}
            </a-select-option>
          </a-select>
        </div>

        <button @click="handleSearch" class="button text-[15px] ml-[80px] text-[#fff] bg-[#69C3A3] p-2 font-medium rounded-lg px-4">Tìm kiếm</button>
      </div>
    </div>

    <div>
      <a-table
        :columns="columns"
        :data-source="orderData.dataSource"
        :pagination="{
          total: orderData.totalElements,
          current: orderData.currentPage,
          pageSize: orderData.pageSize
        }"
        @change="handleTableChange"
      >
        <template #bodyCell="{ column, record }">
          <span v-if="column.key === 'actions'" class="flex">
            <a href="#" @click.prevent="watchOrder(record.id)" class="mr-4">
              <EyeIcon class="w-[15px] h-[15px]" />
            </a>
            <!-- <a href="#" @click.prevent="editOrder(record.id)" class="mr-4">
              <EditIcon class="w-[15px] h-[15px]"></EditIcon>
            </a>
            <a-divider type="vertical" />
            <a href="#" @click.prevent="deleteOrder(record.id)" >
              <TrashIcon class="w-[15px] h-[15px]"></TrashIcon>
            </a> -->
          </span>
          <!-- <span v-else-if="column.key === 'orderDetail'" @click="goToOrderDetail(record.id)"
            class="cursor-pointer text-blue-500">
            View Details
          </span> -->
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
import { useToast } from 'vue-toastification';

const columns = [
  { title: 'Mã đơn hàng', dataIndex: 'id', key: 'stt' },
  { title: 'Người nhận', dataIndex: 'buyer', key: 'name' },
  { title: 'Điện thoại', dataIndex: 'receiver_phone' },
  { title: 'Trạng thái', dataIndex: 'status' },
  //   { title: 'Sản phẩm', dataIndex: 'quantity'},
  { title: 'Ngày tạo', dataIndex: 'created_at' },
  { title: 'Sửa lần cuối', dataIndex: 'modified_at' },
  { title: 'Hành động', key: 'actions' }
];

const orderStore = useOrderStore();
const searchName = ref('');
const searchId = ref('');
const toast = useToast();
const selectedStatus = ref('');
const statusOptions = ['COMPLETED', 'PENDING', 'CANCELLED', 'CONFIRMED', 'PACKED', 'SHIPPED', 'RETURNED'];

const exportData = reactive({
  dataSource: [],
  totalElements: 0,
  currentPage: 1,
  pageSize: 10
});
const orderData = computed(() => ({
  dataSource: orderStore.orders,
  totalElements: orderStore.totalElements,
  currentPage: orderStore.currentPage,
  pageSize: orderStore.pageSize
}));

const searchQuery = ref('');

const handleTableChange = (pagination) => {
  exportData.currentPage = pagination.current; // Cập nhật số trang hiện tại
  exportData.pageSize = pagination.pageSize; // Cập nhật số lượng mỗi trang

  const status = selectedStatus.value || '';

  if (status === '') {
    // Nếu là "Tất cả", gọi fetchOrdersUser
    orderStore.fetchOrdersUser(exportData.currentPage, exportData.pageSize);
  } else {
    // Nếu có trạng thái, gọi fetchOrdersByStatus
    orderStore.fetchOrdersByStatus(status, exportData.currentPage, exportData.pageSize);
  }
};

//
const handleAction = () => {
  exportData.currentPage = 1;
  ordertoryStore.fetchOrders(exportData.currentPage, searchName.value, searchId.value);
};

const handleSearch = async () => {
  exportData.currentPage = 1;
  const status = selectedStatus.value || '';
  const id = searchId.value || null;

  if (status === '') {
    await orderStore.fetchOrdersUser(exportData.currentPage, exportData.pageSize, id);
  } else {
    await orderStore.fetchOrdersByStatus(status, exportData.currentPage, exportData.pageSize, id);
  }
};
//
const deleteOrder = (id) => {
  OrderStore.deleteOrder(id);
};

const editOrder = (id) => {
  orderStore.detailOrder(id);
};

const handleAddNew = () => {
  router.push({ name: 'menu-11' });
};
const goToOrderDetail = (id) => {
  router.push({ name: 'view-order-detail', params: { id } });
};
const watchOrder = (id) => {
  router.push({ name: 'user-view-order-detail', params: { id } });
};

onMounted(async () => {
  const urlParams = new URLSearchParams(window.location.search);
  const responseCode = urlParams.get('vnp_ResponseCode');
  console.log('test payment');
  // Kiểm tra responseCode
  if (responseCode === '00') {
    toast.success('Đặt hàng thành công!', {
      timeout: 5000
    });
  } else if (responseCode) {
    toast.error('Đặt hàng thất bại!', {
      timeout: 5000
    });
  }
  await orderStore.fetchOrdersUser(exportData.currentPage, exportData.pageSize);
  // await orderStore.fetchOrdersByStatus('', exportData.currentPage, exportData.pageSize);
  // Lấy query params từ URL
});
</script>
<style scoped lang="scss">
.order {
  box-shadow: rgba(100, 100, 111, 0.2) 0px 7px 29px 0px;
  border-radius: 10px;
  overflow: hidden;
}
</style>
