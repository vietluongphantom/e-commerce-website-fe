


<template>
  <div class="seller bg-[#EFEFEF] p-9">
    <h1 class="text-[25px] font-bold mb-6">Danh sách người bán</h1>

    <div v-if="sellersStore.loading" class="text-center">
      Đang tải dữ liệu...
    </div>

    <div v-else-if="sellersStore.error" class="text-red-500">
      {{ sellersStore.error }}
    </div>

    <template v-else>
      <div class="mb-8 flex justify-between">
        <!-- Phần search và nút thêm mới -->
      </div>

      <a-table :columns="columns" :data-source="sellerData" :pagination="{
          total: sellerData.length,
          current: sellersStore.currentPage,
          pageSize: sellersStore.pageSize
        }" @change="handleTableChange">
        <template #bodyCell="{ column, record }">
          <span v-if="column.key === 'actions'" class="flex">
            <a @click.prevent="viewSellerDetails(record.id)">
              <EyeIcon class="w-[15px] h-[15px] mr-3"></EyeIcon>
            </a>
            <a-divider type="vertical" />
            <a @click.prevent="editSeller(record.id, record.status)" class="mr-4">
              <EditIcon class="w-[15px] h-[15px]"></EditIcon>
            </a>
            <a-divider type="vertical" />
            <!-- <a @click.prevent="deleteSeller(record.id)">
              <TrashIcon class="w-[15px] h-[15px]"></TrashIcon>
            </a> -->
          </span>
          <span v-else-if="column.key === 'createdAt' || column.key === 'updatedAt'">
            {{ format(record[column.dataIndex], 'dd/MM/yyyy HH:mm:ss') }}
          </span>

          <span v-else-if="column.key === 'status'">
            {{ record[column.dataIndex] === true ? 'Đang hoạt động' : 'Không hoạt động' }}
          </span>
          
          <span v-else>
            {{ record[column.dataIndex] }}
          </span>
        </template>
      </a-table>
    </template>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue';
import { SearchIcon, AddIcon, EditIcon, TrashIcon, EyeIcon } from '@/assets/icons/icon.js';
import { useSellersStore } from '@/stores/accountSellerStore';
import { format } from 'date-fns';
import { useOrderStore } from '@/stores/orderStore';
import { useInfoStore } from '@/stores/infoStore';
import { useRouter } from 'vue-router';

const router = useRouter();
const infoStore = useInfoStore();
const orderStore = useOrderStore();
const sellersStore = useSellersStore();

const columns = [
  { title: 'STT', dataIndex: 'stt', key: 'stt' },
  { title: 'Họ và tên', dataIndex: 'full_name', key: 'full_name' },
  { title: 'Email', dataIndex: 'email', key: 'email' },
  // { title: 'Status', dataIndex: 'status', key: 'status' },
  {
    title: 'Status',
    dataIndex: 'status',
    key: 'status',
    render: (status) => {
      console.log('Status type:', typeof status);
      console.log('Status value:', status);

      if (status === true) {
        return 'Đang hoạt động';
      } else if (status === false) {
        return 'Không hoạt động';
      } else {
        return 'Không xác định';
      }
    }
  },
  { title: 'Ngày tạo', dataIndex: 'createdAt', key: 'createdAt' },
  { title: 'Sửa đổi lần cuối', dataIndex: 'updatedAt', key: 'updatedAt' },
  { title: 'Thao tác', key: 'actions' }
];

const sellerData = computed(() => sellersStore.sellers);

const handleTableChange = (pagination) => {
  sellersStore.updatePagination({
    currentPage: pagination.current
  });
};



const editSeller = (id, status) => {
     sellersStore.editStatusUser(id, status);
      // orderStore.editOrder(id, status);
};

const viewSellerDetails = (id) => {
  console.log('Navigating to sellers:', id);
  router.push({ name: 'admin-menu-17', params: { id } });

};

// onMounted(async () => {
//   sellersStore.fetchSellers();
//   console.log("vào được đây chưa fettch ra được đây chưa" )
// });

onMounted(async () => {
   await sellersStore.fetchSellers();
  console.log("vào được đây chưa fettch ra được đây chưa" )
});
</script>