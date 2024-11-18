<template>
  <div class="warehouse bg-[#EFEFEF] p-9">
    <h1 class="text-[25px] font-bold mb-6">Danh mục kho hàng</h1>

    <div class="mb-8 flex justify-between">
      <div class="flex items-center">
        <input
          class="category__input w-[250px] h-[35px] rounded-lg mr-2 p-3"
          placeholder="Tên kho hàng..."
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
        :data-source="warehouseData.dataSource"
        :pagination="{
          total: warehouseData.totalElements,
          current: warehouseData.currentPage,
          pageSize: warehouseData.pageSize
        }"
        @change="handleTableChange"
      >
        <template #bodyCell="{ column, record }">
          <span v-if="column.key === 'actions'" class="flex">
            <a href="#" @click.prevent="editWarehouse(record.id)" class="mr-4">
              <EditIcon class="w-[15px] h-[15px]"></EditIcon>
            </a>
            <a-divider type="vertical" />
            <a href="#" @click.prevent="deleteWarehouse(record.id)">
              <TrashIcon class="w-[15px] h-[15px]"></TrashIcon>
            </a>
          </span>
          <span v-else-if="column.key === 'created_at' || column.key === 'modified_at'">
            <!-- {{ format(record[column.dataIndex], 'dd/MM/yyyy HH:mm:ss') }} -->
            {{ record[column.dataIndex] ? format(parseISO(record[column.dataIndex]), 'dd/MM/yyyy HH:mm') : 'N/A' }}
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
import { computed, onMounted, ref } from 'vue';
import { SearchIcon, AddIcon, EditIcon, TrashIcon } from '@/assets/icons/icon.js';
import { format, parseISO } from 'date-fns';
import { useWarehouseStore } from '@/stores/warehouseStore';
import router from '@/router/index.js';

const columns = [
  { title: 'STT', dataIndex: 'stt', key: 'stt' },
  { title: 'Name', dataIndex: 'name', key: 'name' },
  { title: 'Created At', dataIndex: 'created_at', key: 'created_at' },
  { title: 'Modified At', dataIndex: 'modified_at', key: 'modified_at' },
  { title: 'Actions', key: 'actions' }
];

const warehouseStore = useWarehouseStore();

const warehouseData = computed(() => ({
  dataSource: warehouseStore.warehouses,
  totalElements: warehouseStore.totalElements,
  currentPage: warehouseStore.currentPage,
  pageSize: warehouseStore.pageSize
}));

const searchQuery = ref('');

const handleTableChange = (pagination) => {
  warehouseStore.updatePagination({
    currentPage: pagination.current
  });
};

const handleAction = () => {
  warehouseStore.fetchWarehouses(1, searchQuery.value);
}


const deleteWarehouse = (id) => {
  warehouseStore.deleteWarehouse(id);
};

const editWarehouse = (id) => {
  warehouseStore.detailWarehouse(id);
};

const handleAddNew = () => {
  router.push({ name: 'menu-11' });
};

onMounted(async () => {
  warehouseStore.fetchWarehouses();
});
</script>

<style scoped lang="scss">
.warehouse {
  box-shadow: rgba(100, 100, 111, 0.2) 0px 7px 29px 0px;
  border-radius: 10px;
  overflow: hidden;
}
</style>
