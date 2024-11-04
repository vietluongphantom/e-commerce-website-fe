<template>
  <div class="category bg-[#EFEFEF] p-9">
    <h1 class="text-[25px] font-bold mb-6">Danh mục nhãn hiệu</h1>

    <div class="mb-8 flex justify-between">
      <div class="flex items-center">
        <input
          class="category__input w-[250px] h-[35px] rounded-lg mr-2 p-3"
          placeholder="Tên nhãn hiệu..."
          @focus="handleFocus"
          v-model="searchQuery"
          @blur="hideList()"
          @keyup.enter="handleAction"
        />
        <SearchIcon @click="handleAction" class="w-[20px] h-[20px]"></SearchIcon>
      </div>

      <div class="flex items-center">
        <button @click="handleAddNew" class="flex w-[140px] h-[40px] items-center text-[16px] bg-[#0397D6] text-[#fff] p-4 rounded-md mr-3">
          <span class="mr-2">Thêm mới</span>
          <AddIcon class="w-[20px] h-[20px]"></AddIcon>
        </button>
        <button @click="refreshData" class="flex w-[120px] h-[40px] items-center text-[16px] bg-[#0397D6] text-[#fff] p-4 rounded-md">
          <span class="mr-2">Reresh</span>
          <RefreshIcon class="w-[20px] h-[20px]"></RefreshIcon>
        </button>
      </div>
    </div>

    <div>
      <a-table
        :columns="columns"
        :data-source="categoryData.dataSource"
        :pagination="{
          total: categoryData.totalElements,
          current: categoryData.currentPage,
          pageSize: categoryData.pageSize
        }"
        @change="handleTableChange"
      >
        <template #bodyCell="{ column, record }">
          <span v-if="column.key === 'action'" class="flex">
            <a href="#" @click.prevent="editCategory(record.id, record.status, record.name)" class="mr-4">
              <EditIcon class="w-[15px] h-[15px]"></EditIcon>
            </a>
            <a-divider type="vertical" />
            <a href="#" @click.prevent="deleteCategory(record.id)">
              <TrashIcon class="w-[15px] h-[15px]"></TrashIcon>
            </a>
          </span>

        <span v-else-if="column.key === 'status'">
          <span v-if="record.status">
            <CheckIcon class="w-[20px] h-[20px]" />
          </span>
          <span v-else>
            <CloseIcon class="w-[20px] h-[20px]" />
          </span>
        </span>


          <span v-else-if="column.key === 'createdAt' || column.key === 'modifiedAt'">
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
import { computed, onMounted, ref, watch  } from 'vue';
import { SearchIcon, AddIcon, EditIcon, TrashIcon, CheckIcon, CloseIcon, RefreshIcon } from '@/assets/icons/icon.js';
import { format, parseISO } from 'date-fns';
import { reactive } from 'vue';
import Swal from 'sweetalert2';
import { useCategory } from '@/stores/CategoryStore';
import router from '@/router/index.js';
import apiServices from '@/domain/apiServices';


const inputValue = ref('');

const columns = [
  {
    title: 'STT',
    dataIndex: 'stt',
    key: 'stt'
  },
  {
    title: 'Tên danh mục',
    dataIndex: 'name',
    key: 'name'
  },
  {
    title: 'Trạng thái',
    dataIndex: 'status',
    key: 'status'
  },
  {
    title: 'Ngày tạo',
    dataIndex: 'createdAt',
    key: 'createdAt'
  },
  {
    title: 'Chỉnh sửa lần cuối',
    dataIndex: 'modifiedAt',
    key: 'modifiedAt'
  },
  {
    title: 'Thao tác',
    key: 'action'
  }
];

const categoryStore = useCategory();

const categoryData = computed(() => ({
  dataSource: categoryStore.category,
  totalElements: categoryStore.totalElements,
  currentPage: categoryStore.currentPage,
  pageSize: categoryStore.pageSize
}));



const searchQuery = ref('');

const handleTableChange = (pagination) => {
  categoryStore.updatePagination({
    currentPage: pagination.current
  });
};

const handleAction = () => {
    categoryStore.fetchCategory(1, searchQuery.value);
    categoryStore.currentPage = 1;
}


const deleteCategory = (id) => {
  categoryStore.deleteCategory(id);
};

const editCategory = (id, status, name) => {
  categoryStore.editCategory(id, status, name);
};



const refreshData = () => {
    searchQuery.value = '';
//   refresh.value = !refresh.value;
    categoryStore.currentPage = 1;
    categoryStore.fetchCategory(1);
};

const handleAddNew = async () => {
  const { value: text, isConfirmed  } = await Swal.fire({
    input: 'textarea',
    inputLabel: 'Nhập tên danh mục mới',
    inputPlaceholder: 'Danh mục a...',
    inputAttributes: {
      'aria-label': 'Danh mục a...'
    },
    showCancelButton: true
  });
  
    if (isConfirmed && text) {
    inputValue.value = text;
    categoryStore.addCategory(inputValue.value);
  }
};


onMounted(async () => {
  categoryStore.fetchCategory();
});
</script>

<style scoped lang="scss">
.category {
  box-shadow: rgba(100, 100, 111, 0.2) 0px 7px 29px 0px;
  border-radius: 10px;
  overflow: hidden;
}

</style>
