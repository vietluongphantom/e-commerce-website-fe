<template>
  <div class="brand bg-[#EFEFEF] p-9">
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
        :data-source="brandData.dataSource"
        :pagination="{
          total: brandData.totalElements,
          current: brandData.currentPage,
          pageSize: brandData.pageSize
        }"
        @change="handleTableChange"
      >
        <template #bodyCell="{ column, record }">
          <!-- Hiển thị ảnh trong cột 'icon' -->
          <template v-if="column.key === 'icon'">
            <div class="flex justify-center items-center">
              <img :src="record.icon" alt="Product Image" class="w-[60px] h-[60px] object-cover rounded-md p-1" />
            </div>
          </template>

          <!-- Hiển thị thao tác -->
           <template v-else-if="column.key === 'action'">
            <span class="flex">
              <a href="#" @click.prevent="editBrand(record.id, record.status, record.name)" class="mr-4">
                <EditIcon class="w-[15px] h-[15px]"></EditIcon>
              </a>
              <a-divider type="vertical" />
              <a href="#" @click.prevent="deleteBrand(record.id)">
                <TrashIcon class="w-[15px] h-[15px]"></TrashIcon>
              </a>
            </span>
          </template>

          <!-- Hiển thị trạng thái -->
          <template v-else-if="column.key === 'status'">
            <span v-if="record.status">
              <CheckIcon class="w-[20px] h-[20px]" />
            </span>
            <span v-else>
              <CloseIcon class="w-[20px] h-[20px]" />
            </span>
          </template>

          <!-- Hiển thị ngày tháng -->
          <template v-else-if="column.key === 'createdAt' || column.key === 'modifiedAt'">
            {{ record[column.dataIndex] ? format(parseISO(record[column.dataIndex]), 'dd/MM/yyyy HH:mm') : 'N/A' }}
          </template>

          <!-- Hiển thị giá trị mặc định -->
          <template v-else>
            {{ record[column.dataIndex] }}
          </template>
        </template>
      </a-table>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, ref, watch } from 'vue';
import { SearchIcon, AddIcon, EditIcon, TrashIcon, CheckIcon, CloseIcon, RefreshIcon } from '@/assets/icons/icon.js';
import { format, parseISO } from 'date-fns';
import { reactive } from 'vue';
import Swal from 'sweetalert2';
import { useBrand } from '@/stores/brandStore';
import { useImageStore } from '@/stores/imageStore';
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
    title: 'Tên nhãn hiệu',
    dataIndex: 'name',
    key: 'name'
  },
  ,
  {
    title: 'ảnh',
    dataIndex: 'icon',
    key: 'icon',
    width: '20%',
  },
  ,
  {
    title: 'mô tả',
    dataIndex: 'description',
    key: 'description'
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

const brandStore = useBrand();

const brandData = computed(() => ({
  dataSource: brandStore.brand,
  totalElements: brandStore.totalElements,
  currentPage: brandStore.currentPage,
  pageSize: brandStore.pageSize
}));

const searchQuery = ref('');

const handleTableChange = (pagination) => {
  brandStore.updatePagination({
    currentPage: pagination.current
  });
};

const handleAction = () => {
  brandStore.fetchBrand(1, searchQuery.value);
  brandStore.currentPage = 1;
};

const deleteBrand = (id) => {
  brandStore.deleteBrand(id);
};

const editBrand = (id, status, name) => {
  brandStore.editBrand(id, status, name);
};

const refreshData = () => {
  searchQuery.value = '';
  // refresh.value = !refresh.value;
  brandStore.currentPage = 1;
  brandStore.fetchBrand(1);
};

const imageStore = useImageStore();

const handleAddNew = async () => {
  const { value: formValues, isConfirmed } = await Swal.fire({
    title: 'Thêm nhãn hiệu mới',
    html: `
      <div style="text-align: left; font-size: 14px; margin-bottom: 15px;">
        <label for="brandName" style="display: block; font-weight: bold; margin-bottom: 5px;">Tên nhãn hiệu:</label>
        <input id="brandName" placeholder="Nhập tên nhãn hiệu..." 
          style="width: 100%; resize: none; font-size: 14px; padding: 10px; border-radius: 5px; border: 1px solid #ddd;" />
      </div>
      <div style="text-align: left; font-size: 14px; margin-bottom: 15px;">
        <label for="brandDescription" style="display: block; font-weight: bold; margin-bottom: 5px;">Mô tả nhãn hiệu:</label>
        <textarea id="brandDescription" placeholder="Nhập mô tả cho nhãn hiệu..." 
          style="width: 100%; height: 70px; resize: none; font-size: 14px; padding: 10px; border-radius: 5px; border: 1px solid #ddd;"></textarea>
      </div>
      <div style="text-align: left; font-size: 14px;">
        <label for="brandImage" style="display: block; font-weight: bold; margin-bottom: 5px;">Chọn hình ảnh:</label>
        <input type="file" id="brandImage" class="swal2-file" accept="image/*" 
          style="width: 100%; padding: 5px; font-size: 14px; border-radius: 5px; border: 1px solid #ddd;" />
      </div>
    `,
    focusConfirm: false,
    showCancelButton: true,
    preConfirm: async () => {
      const name = document.getElementById('brandName').value.trim();
      const description = document.getElementById('brandDescription').value.trim();
      const file = document.getElementById('brandImage').files[0];
      if (!name) {
        Swal.showValidationMessage('Vui lòng nhập tên nhãn hiệu');
        return null;
      }
      if (!description) {
        Swal.showValidationMessage('Vui lòng nhập mô tả');
        return null;
      }
      if (!file) {
        Swal.showValidationMessage('Vui lòng chọn hình ảnh');
        return null;
      }
      return { name, description, file };
    }
  });

  if (isConfirmed && formValues) {
    const { name, description, file } = formValues;

    // Kiểm tra nếu tên đã tồn tại
    const isDuplicate = brandStore.brand.some((brand) => brand.name.toLowerCase() === name.toLowerCase());
    if (isDuplicate) {
      Swal.fire({
        icon: 'error',
        title: 'Tên nhãn hiệu đã tồn tại',
        text: `Nhãn hiệu "${name}" đã tồn tại trong hệ thống. Vui lòng nhập tên khác.`
      });
      return;
    }

    // Upload hình ảnh và thêm nhãn hiệu
    await imageStore.upLoadImage([file]);
    brandStore.addBrand(name, description, imageStore.image);
    Swal.fire({
      icon: 'success',
      title: 'Thành công',
      text: `Nhãn hiệu "${name}" đã được thêm thành công!`
    });
  }
};

onMounted(async () => {
  brandStore.fetchBrand();
});
</script>

<style scoped lang="scss">
.brand {
  box-shadow: rgba(100, 100, 111, 0.2) 0px 7px 29px 0px;
  border-radius: 10px;
  overflow: hidden;
}
</style>
