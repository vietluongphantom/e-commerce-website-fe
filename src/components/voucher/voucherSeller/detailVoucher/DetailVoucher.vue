<template>
  <div class="flex justify-center">
    <div class="voucher flex flex-col items-center bg-[#ffff] w-[60%] p-8 rounded-lg overflow-hidden">
      <h2 class="text-[25px] font-semibold mb-8">Chi tiết mã giảm giá</h2>
      <a-form :form="form" class="coupon-form">
        <div class="flex">
          <div class="mr-[60px]">
            <a-form-item label="Tên mã giảm" name="name">
              <a-input class="truncate" :value="voucher.name" readonly />
            </a-form-item>

            <a-form-item label="Mã giảm giá" name="coupon_code">
              <a-input :value="voucher.coupon_code" readonly />
            </a-form-item>

            <a-form-item label="Loại giảm giá" name="discount_type">
              <a-select :value="voucher.discount_type" disabled>
                <a-select-option value="FIXEDAMOUNT">Số tiền cố định</a-select-option>
                <a-select-option value="PERCENTAGE">Phần trăm</a-select-option>
              </a-select>
            </a-form-item>

            <a-form-item label="Loại lặp lại" name="type_repeat">
              <a-select :value="voucher.type_repeat" disabled>
                <a-select-option value="DAILY">Hàng ngày</a-select-option>
                <a-select-option value="WEEKLY">Hàng tuần</a-select-option>
                <a-select-option value="MONTHLY">Hàng tháng</a-select-option>
              </a-select>
            </a-form-item>

            <a-form-item label="Ngày bắt đầu" name="start_at">
              <a-input :value="formatDate(voucher.start_at)" readonly />
            </a-form-item>

            <a-form-item label="Ngày hết hạn" name="expired_at">
              <a-input :value="formatDate(voucher.expired_at)" readonly />
            </a-form-item>
          </div>

          <div>
            <a-form-item label="Trạng thái kích hoạt" name="is_active">
              <a-switch :checked="voucher.is_active" disabled />
            </a-form-item>

            <a-form-item label="Công khai" name="is_public">
              <a-switch :checked="voucher.is_public" disabled />
            </a-form-item>

            <a-form-item label="Giá trị giảm giá" name="discount_value">
              <a-input-number :value="voucher.discount_value" disabled />
            </a-form-item>

            <a-form-item label="Giá trị giảm giá tối đa" name="maximum_discount_value">
              <a-input-number :value="voucher.maximum_discount_value" disabled />
            </a-form-item>

            <a-form-item label="Số lượng" name="quantity">
              <a-input-number :value="voucher.quantity" disabled />
            </a-form-item>

            <a-form-item label="Số lượng tối thiểu cần thiết" name="minimum_quantity_needed">
              <a-input-number :value="voucher.minimum_quantity_needed" disabled />
            </a-form-item>
          </div>
        </div>
      </a-form>
      <button @click="handleBack" class="button text-[16px] font-medium p-2 pl-4 pr-4 mt-5 rounded-lg bg-[#63B899] text-[#fff]">Quay lại</button>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue';
import { useVoucherStore } from '@/stores/voucherSellerStore';
import { format } from 'date-fns';
import { useRoute } from 'vue-router';
import router from '@/router/index.js';

const route = useRoute();
const id = route.params.id;

const voucherStore = useVoucherStore();

// Giả sử voucherStore.detail là đối tượng voucher
const voucher = computed(() => voucherStore.detail);

function formatDate(date) {
  return date ? format(new Date(date), 'yyyy-MM-dd HH:mm:ss') : null;
}

const handleBack= () => {
  router.push({name: 'menu-6'});
}

onMounted(() => {
  voucherStore.detailVoucher(id);
});
</script>

<style scoped lang="scss">
.voucher {
  box-shadow: rgba(100, 100, 111, 0.2) 0px 7px 29px 0px;
}

.button {
  
  &:hover {
    background-color: #fff;
    color: #63b899;
    box-shadow:
      0 0 10px #63b899,
      0 0 20px #63b899;
  }
}
</style>
