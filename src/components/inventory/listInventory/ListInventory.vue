<template>
  <div class="inventory bg-[#EFEFEF] p-9">
    <h1 class="text-[25px] font-bold mb-6">Kiểm kê hàng tồn kho</h1>
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
      <div class="flex">
        <button @click="handleExcel" class="flex justify-center w-[140px] h-[40px] items-center text-[16px] bg-[#27932c] text-[#fff] p-4 rounded-md mr-3">
          <span class="mr-2">xuất excel</span>
          <!-- <AddIcon class="w-[20px] h-[20px]"></AddIcon> -->
        </button>
        <Modal></Modal>
      </div>
    </div>

    <div>
      <a-table
        :columns="columns"
        :data-source="inventoryData.dataSource"
        :pagination="{
          total: inventoryData.totalElements,
          current: inventoryData.currentPage,
          pageSize: inventoryData.pageSize
        }"
        @change="handleTableChange"
        @search="debouncedFetchBrand"
      >
        <template #bodyCell="{ column, record }">
          <span v-if="column.key === 'actions'" class="flex">
            <a href="#" @click.prevent="editInventory(record.id)" class="mr-4">
              <EditIcon class="w-[15px] h-[15px]"></EditIcon>
            </a>
            <a-divider type="vertical" />
            <a href="#" @click.prevent="deleteInventory(record.id)">
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
import Modal from '@/components/modal/ModalAddInventory.vue';
import { useInventoryStore } from '@/stores/inventoryStore';
import router from '@/router/index.js';
import debounce from 'lodash/debounce';
import apiServices from '@/domain/apiServices';

const columns = [
  { title: 'STT', dataIndex: 'stt', key: 'stt' },
  // { title: 'Tên kho', dataIndex: 'warehouse', key: 'name' },
  { title: 'Tên sản phẩm', dataIndex: 'name' },
  { title: 'Mã sản phẩm', dataIndex: 'sku_code' },
  { title: 'Số lượng', dataIndex: 'quantity'},
];

const inventoryStore = useInventoryStore();
const searchName = ref('');
const searchId = ref('');

const exportData = reactive({
  dataSource: [],
  totalElements: 0,
  currentPage: 1,
  pageSize: 10
});
const inventoryData = computed(() => ({
  dataSource: inventoryStore.inventories,
  totalElements: inventoryStore.totalElements,
  currentPage: inventoryStore.currentPage,
  pageSize: inventoryStore.pageSize
}));

const searchQuery = ref('');

const handleTableChange = (pagination) => {
  inventoryStore.updatePagination({
    currentPage: pagination.current
  });
};

//
const handleAction = () => {
  exportData.currentPage = 1;
   inventoryStore.fetchInventories(exportData.currentPage, searchName.value, searchId.value);
};

const handleSearch = () => {
  exportData.currentPage = 1;
   inventoryStore.fetchInventories(exportData.currentPage, searchName.value, searchId.value);
};
//
const deleteInventory = (id) => {
  inventoryStore.deleteInventory(id);
};

const editInventory = (id) => {
  inventoryStore.detailInventory(id);
};

const handleAddNew = () => {
  router.push({ name: 'menu-11' });
};


const handleExcel = async () => {
  try {
    // Gọi API để lấy file Excel
    const response = await apiServices.handleExcelInventory();

    // Kiểm tra xem response có dữ liệu hay không
    if (response && response.data) {
      const blob = new Blob([response.data], {
        type: response.headers['content-type'] || 'application/vnd.ms-excel',
      });

      // Tạo URL từ Blob
      const url = window.URL.createObjectURL(blob);

      // Tạo thẻ <a> ẩn để tải file
      const a = document.createElement('a');
      a.href = url;
      a.download = 'inventory.xlsx'; // Tên file khi tải xuống
      document.body.appendChild(a);
      a.click();

      // Dọn dẹp tài nguyên
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    }
  } catch (error) {
    console.error('Lỗi khi tải file Excel:', error);
  }
};


onMounted(async () => {
//  console.log("vào được đây chưa",response.data.data.content )
  await inventoryStore.fetchInventories();
});
</script>

<style scoped lang="scss">
.inventory {
  box-shadow: rgba(100, 100, 111, 0.2) 0px 7px 29px 0px;
  border-radius: 10px;
  overflow: hidden;
}
</style>
