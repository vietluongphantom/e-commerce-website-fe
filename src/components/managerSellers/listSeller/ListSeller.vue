<template>
  <div class="seller bg-[#EFEFEF] p-9">
    <h1 class="text-[25px] font-bold mb-6">Danh sách người bán</h1>

    <div class="mb-8 flex justify-between">
      <div class="flex items-center">
        <input
          class="category__input w-[250px] h-[35px] rounded-lg mr-2 p-3"
          placeholder="Tên người bán..."
          @focus="handleFocus"
          v-model="searchQuery"
          @blur="hideList()"
          @keyup.enter="handleAction"
        />
        <SearchIcon @click="handleAction" class="w-[20px] h-[20px]"></SearchIcon>
      </div>

      <div>
        <button @click="handleAddNew" class="flex w-[140px] h-[40px] items-center text-[16px] bg-[#0397D6] text-[#fff] p-4 rounded-md mr-3">
          <span class="mr-2">Thêm mới</span>
          <AddIcon class="w-[20px] h-[20px]"></AddIcon>
        </button>
      </div>
    </div>

    <div>
      <a-table
        :columns="columns"
        :data-source="sellerData.dataSource"
        :pagination="{
          total: sellerData.totalElements,
          current: sellerData.currentPage,
          pageSize: sellerData.pageSize
        }"
        @change="handleTableChange"
      >
        <template #bodyCell="{ column, record }">
          <span v-if="column.key === 'actions'" class="flex">
            <a href="#" @click.prevent="viewSellerDetails(record.id)">
              <EyeIcon class="w-[15px] h-[15px] mr-3"></EyeIcon>
            </a>
            <a-divider type="vertical" />
            <a href="#" @click.prevent="editSeller(record.id)" class="mr-4">
              <EditIcon class="w-[15px] h-[15px]"></EditIcon>
            </a>
            <a-divider type="vertical" />
            <a href="#" @click.prevent="deleteSeller(record.id)">
              <TrashIcon class="w-[15px] h-[15px]"></TrashIcon>
            </a>
          </span>
          <span v-else-if="column.key === 'createdAt' || column.key === 'updatedAt'">
            {{ format(record[column.dataIndex], 'dd/MM/yyyy HH:mm:ss') }}
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
import { computed, onMounted } from 'vue';
import { SearchIcon, AddIcon, EditIcon, TrashIcon, EyeIcon } from '@/assets/icons/icon.js';
import { useSellersStore } from '@/stores/accountSellerStore';
import { format } from 'date-fns';
// import router from '@/router/index.js';

const sellersStore = useSellersStore();

const columns = [
  { title: 'STT', dataIndex: 'stt', key: 'stt' },
  { title: 'Họ và tên', dataIndex: 'fullName', key: 'fullName' },
  { title: 'Email', dataIndex: 'email', key: 'email' },
  { title: 'Ngày tạo', dataIndex: 'createdAt', key: 'createdAt' },
  { title: 'Sửa đổi lần cuối', dataIndex: 'updatedAt', key: 'updatedAt' },
  { title: 'Thao tác', key: 'actions' }
];

const sellerData = computed(() => ({
  dataSource: sellersStore.sellers,
  totalElements: sellersStore.totalElements,
  currentPage: sellersStore.currentPage,
  pageSize: sellersStore.pageSize
}));

const handleTableChange = (pagination) => {
  sellersStore.updatePagination({
    currentPage: pagination.current
  });
};

const viewSellerDetails = (id) => {
  sellersStore.getSellerById(id);
};

// const deleteWarehouse = (id) => {
//   warehouseStore.deleteWarehouse(id);
// };

// const editWarehouse = (id) => {
//   warehouseStore.detailWarehouse(id);
// };

// const handleAddNew = () => {
//   router.push({ name: 'menu-11' });
// };

onMounted(async () => {
  sellersStore.fetchSellers();
});
</script>

<style scoped lang="scss">
.seller {
  box-shadow: rgba(100, 100, 111, 0.2) 0px 7px 29px 0px;
  border-radius: 10px;
  overflow: hidden;
}
</style>
