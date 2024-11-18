<template>
  <div class="order bg-[#EFEFEF] p-9">
    <h1 class="text-[25px] font-bold mb-6">Danh sách đơn hàng</h1>
    <div class="mb-8 flex justify-between">
    <div class="mb-8 flex">
      <div class="flex items-center mr-[50px]">
        <input
          class="category__input w-[200px] h-[35px] rounded-lg mr-2 p-3"
          placeholder="Tên..."
          @focus="handleFocus"
          v-model="searchName"
          @keyup.enter="handleAction"
        />
        <!-- <SearchIcon @click="handleAction" class="w-[20px] h-[20px]"></SearchIcon> -->
      </div>

      <div class="flex items-center">
        <input
          class="category__input w-[200px] h-[35px] rounded-lg mr-2 p-3"
          placeholder="Mã..."
          @focus="handleFocus"
          v-model="searchId"
          @keyup.enter="handleAction"
        />
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
            <a href="#" @click.prevent="editOrder(record.id)" class="mr-4">
              <EditIcon class="w-[15px] h-[15px]"></EditIcon>
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
import { SearchIcon, AddIcon, EditIcon, TrashIcon } from '@/assets/icons/icon.js';
import { format, parseISO } from 'date-fns';
import { useOrderStore } from '@/stores/orderStore';
import router from '@/router/index.js';

const columns = [
  { title: 'Mã đơn hàng', dataIndex: 'id', key: 'stt' },
  { title: 'Người nhận', dataIndex: 'buyer', key: 'name' },
  { title: 'Điện thoại', dataIndex: 'receiver_phone' },
  { title: 'Trạng thái', dataIndex: 'status' },
//   { title: 'Sản phẩm', dataIndex: 'quantity'},
  { title: 'Ngày tạo', dataIndex: 'created_at'},
  { title: 'Sửa lần cuối', dataIndex: 'modified_at'},
//   { title: 'Actions', key: 'actions' }
];

const orderStore = useOrderStore();
const searchName = ref('');
const searchId = ref('');

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
    orderStore.updatePagination({
    currentPage: pagination.current
  });
};

//
const handleAction = () => {
  exportData.currentPage = 1;
   ordertoryStore.fetchOrders(exportData.currentPage, searchName.value, searchId.value);
};

const handleSearch = () => {
  exportData.currentPage = 1;
   orderStore.fetchOrders(exportData.currentPage, searchName.value, searchId.value);
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

onMounted(async () => {
  await orderStore.fetchOrdersUser();
  console.log("fetchOrdersUser", orderStore.orders)
});
</script>
<style scoped lang="scss">
.order {
  box-shadow: rgba(100, 100, 111, 0.2) 0px 7px 29px 0px;
  border-radius: 10px;
  overflow: hidden;
}
</style>
