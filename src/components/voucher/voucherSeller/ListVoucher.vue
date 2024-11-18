<template>
  <div class="voucher bg-[#EFEFEF] p-9 rounded-lg">
    <h1 class="text-[25px] font-bold mb-6">Danh sách mã giảm giá</h1>

    <div class="mb-8 flex justify-between">
      <div class="flex items-center">
        <input
          class="category__input w-[250px] h-[35px] rounded-lg mr-2 p-3"
          placeholder="Nhập từ khóa..."
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
        :data-source="voucherData.dataSource"
        :pagination="{
          total: voucherData.totalElements,
          current: voucherData.currentPage,
          pageSize: voucherData.pageSize
        }"
        @change="handleTableChange"
      >
        <template #bodyCell="{ column, record }">
          <span v-if="column.key === 'action'" class="flex">
            <a href="#" @click.prevent="detailVoucher(record.id)" class="mr-4">
              <EyeIcon class="w-[15px] h-[15px]"></EyeIcon>
            </a>
            <a-divider type="vertical" />
            <a href="#" @click.prevent="editVoucher(record.id)" class="mr-4">
              <EditIcon class="w-[15px] h-[15px]"></EditIcon>
            </a>
            <a-divider type="vertical" />
            <a href="#" @click.prevent="deleteVoucher(record.id)">
              <TrashIcon class="w-[15px] h-[15px]"></TrashIcon>
            </a>
          </span>
          <span v-else-if="column.key === 'expired_at' || column.key === 'start_at'">
            {{ record[column.dataIndex] ? format(parseISO(record[column.dataIndex]), 'dd/MM/yyyy') : 'N/A' }}
          </span>

          <template v-else-if="column.key === 'is_active' || column.key === 'is_public'">
            <a-switch
              :checked="record[column.dataIndex]"
              @change="(checked) => toggleActive(record, checked)"
              :checkedChildren="''"
              :unCheckedChildren="''"
              :style="{ margin: '0 auto', display: 'block' }"
            />
          </template>

          <span v-else-if="column.key === 'name' || column.key === 'coupon_code'">
            <a-tooltip :title="record[column.dataIndex]">
              <span>
                {{ record[column.dataIndex].length > 20 ? record[column.dataIndex].substring(0, 10) + '...' : record[column.dataIndex] }}
              </span>
            </a-tooltip>
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
import { format, parseISO } from 'date-fns';
import { useVoucherStore } from '@/stores/voucherSellerStore';
import { SearchIcon, AddIcon, EditIcon, TrashIcon, EyeIcon } from '@/assets/icons/icon.js';
import router from '@/router/index.js';

const voucherStore = useVoucherStore();
const searchQuery = ref('');

const voucherData = computed(() => ({
  dataSource: voucherStore.vouchers,
  totalElements: voucherStore.totalElements,
  currentPage: voucherStore.currentPage,
  pageSize: voucherStore.pageSize
}));

const columns = [
  {
    title: 'STT',
    dataIndex: 'stt',
    key: 'index'
  },
  {
    title: 'Tên mã giảm giá',
    dataIndex: 'name',
    key: 'name'
  },
  {
    title: 'Mã coupon',
    dataIndex: 'coupon_code',
    key: 'coupon_code'
  },
  {
    title: 'Loại giảm giá',
    dataIndex: 'discount_type',
    key: 'discount_type'
  },
  {
    title: 'Giá trị giảm giá',
    dataIndex: 'discount_value',
    key: 'discount_value',
    slots: { customRender: 'discount_value' }
  },
  {
    title: 'Ngày bắt đầu',
    dataIndex: 'start_at',
    key: 'start_at'
  },
  {
    title: 'Ngày hết hạn',
    dataIndex: 'expired_at',
    key: 'expired_at'
  },
  {
    title: 'Trạng thái',
    dataIndex: 'is_active',
    key: 'is_active'
  },
  {
    title: 'Công khai',
    dataIndex: 'is_public',
    key: 'is_public'
  },
  {
    title: 'Hành động',
    key: 'action'
  }
];

const handleTableChange = (pagination) => {
  voucherStore.updatePagination({
    currentPage: pagination.current
  });
};

const handleAddNew = () => {
  router.push({ name: 'menu-7' });
};

const detailVoucher = (id) => {
  voucherStore.detailVoucher(id);
};

const editVoucher = (id) => {
  voucherStore.editVoucher(id);
};

const deleteVoucher = (id) => {
  voucherStore.deleteVoucher(id);
};

const handleAction = () => {
  voucherStore.fetchVouchers(1, searchQuery.value);
}

onMounted(async () => {
  voucherStore.fetchVouchers(1, );
});
</script>

<style scoped lang="scss">
.voucher {
  box-shadow: rgba(100, 100, 111, 0.2) 0px 7px 29px 0px;
}
</style>
