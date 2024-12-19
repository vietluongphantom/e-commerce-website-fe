<template>
  <div class="listProduct bg-[var(--color-five)] p-8">
    <h2 class="text-[25px] font-bold mb-6">Danh sách sản phẩm</h2>

    <div class="mb-8 flex justify-between">
      <div class="flex items-center">
        <input
          class="category__input w-[250px] h-[35px] rounded-lg mr-2 p-3"
          placeholder="Tên sản phẩm..."
          @focus="handleFocus"
          v-model="searchQuery"
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
        row-key="id"
        @change="handleTableChange"
        :data-source="productData.dataSource"
        :pagination="{
          total: productData.totalElements,
          current: productData.currentPage,
          pageSize: productData.pageSize
        }"
      >
        <template #bodyCell="{ column, record }">
          <span v-if="column.key === 'actions'" class="flex">
            <a href="#" @click.prevent="watchItem(record.id)" class="mr-4">
              <EyeIcon class="w-[15px] h-[15px]" />
            </a>
            <a-divider type="vertical" />
            <a href="#" @click.prevent="editItem(record.id)" class="mr-4">
              <EditIcon class="w-[15px] h-[15px]" />
            </a>
            <a-divider type="vertical" />
            <a href="#" @click.prevent="deleteItem(record.id)">
              <TrashIcon class="w-[15px] h-[15px]" />
            </a>
          </span>

          <span v-else-if="column.key === 'created_at' || column.key === 'modified_at'">
            {{ record[column.dataIndex] ? format(new Date(record[column.dataIndex]), 'dd/MM/yyyy') : 'N/A' }}
          </span>

          <span v-else-if="column.key === 'images'">
            <img :src="record[column.dataIndex][0]" alt="Product Image" class="w-[40px] h-[40px] object-cover" />
          </span>

          <span v-else-if="column.key === 'category_names'">
            <div class="flex flex-wrap">
              <a-tag v-for="(category, index) in record[column.dataIndex]" :key="index" color="blue" style="margin-right: 5px">
                {{ category }}
              </a-tag>
            </div>
          </span>

          <span v-else-if="column.key === 'name'">
            <a href="#" @click.prevent="navigateToDetail(record.id)">
              {{ record[column.dataIndex] }}
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
import { ref, computed, onMounted , reactive} from 'vue';
import { format } from 'date-fns';
import { SearchIcon, AddIcon, EditIcon, TrashIcon, EyeIcon } from '@/assets/icons/icon.js';
import router from '@/router/index.js';

const columns = [
  { title: 'STT', dataIndex: 'stt', key: 'stt' },
  {
    title: 'Tên sản phẩm',
    dataIndex: 'name',
    key: 'name'
  },
  {
    title: 'Hình ảnh',
    dataIndex: 'images',
    key: 'images'
  },
  {
    title: 'Nhãn hiệu',
    dataIndex: 'brand_name',
    key: 'brand_name'
  },
  {
    title: 'Danh mục',
    dataIndex: 'category_names',
    key: 'category_names'
  },
  {
    title: 'Ngày tạo',
    dataIndex: 'created_at',
    key: 'created_at'
  },
  {
    title: 'Sửa lần cuối',
    dataIndex: 'modified_at',
    key: 'modified_at'
  },
  {
    title: 'Hành động',
    key: 'actions'
  }
];

import { useProductStore } from '@/stores/productSellerStore';
import { useRoute } from 'vue-router';

const productStore = useProductStore();
const searchQuery = ref('');
const route = useRoute();
// const currentPage = ref(Number(route.query.page) || 1);

const productData = computed(() => ({
  dataSource: productStore.products,
  totalElements: productStore.totalElements,
  currentPage:productStore.currentPage,
  pageSize: productStore.pageSize
}));

const handleTableChange =  async (pagination) => {
  await productStore.updatePagination({
    currentPage: pagination.current
  });
  console.log("hú", productStore.products)
};

const handleAction = () => {
  productStore.fetchProducts(1, searchQuery.value);
}

const handleAddNew = () => {
  router.push({name: 'menu-5'});
}

const editItem = (id) => {
  router.push({ name: 'product-edit', params: { id } });
};

const watchItem = (id) => {
  router.push({ name: 'product-detail', params: { id } });
};

const deleteItem = (id) => {
    productStore.deleteProduct(id);
};

const navigateToDetail = (id) => {
  router.push({ name: 'product-item', params: { id } });
}

onMounted(async () => {
  productStore.fetchProducts();
});
</script>

<style scoped lang="scss">
@import './style.scss';
</style>
