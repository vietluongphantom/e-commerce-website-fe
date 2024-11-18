<template>
  <div class="flex justify-center">
    <div class="voucher flex flex-col items-center bg-[#ffff] w-[70%] pt-8 rounded-lg overflow-hidden">
      <h2 class="text-[25px] font-semibold mb-8">Thêm mới mã giảm giá</h2>
      <a-form :form="form" @submit.prevent="handleSubmit" >
        <div class="flex">
          <div class="mr-[60px] w-[50%]">
            <a-form-item label="Tên mã giảm" name="name" rules="[ { required: true, message: 'Vui lòng nhập tên!' } ]">
              <a-input v-model:value="form.name" />
            </a-form-item>

            <a-form-item label="Mã giảm giá" name="coupon_code" rules="[ { required: true, message: 'Vui lòng nhập mã giảm giá!' } ]">
              <a-input v-model:value="form.coupon_code" />
            </a-form-item>

            <a-form-item label="Loại giảm giá" name="discount_type" rules="[ { required: true, message: 'Vui lòng chọn loại giảm giá!' } ]">
              <a-select v-model:value="form.discount_type">
                <a-select-option value="FIXEDAMOUNT">Số tiền cố định</a-select-option>
                <a-select-option value="PERCENTAGE">Phần trăm</a-select-option>
              </a-select>
            </a-form-item>

            <a-form-item label="Loại lặp lại" name="type_repeat" rules="[ { required: true, message: 'Vui lòng chọn loại lặp lại!' } ]">
              <a-select v-model:value="form.type_repeat">
                <a-select-option value="DAILY">Hàng ngày</a-select-option>
                <a-select-option value="WEEKLY">Hàng tuần</a-select-option>
                <a-select-option value="MONTHLY">Hàng tháng</a-select-option>
              </a-select>
            </a-form-item>

            <a-form-item label="Ngày bắt đầu" name="start_at" rules="[ { required: true, message: 'Vui lòng chọn ngày bắt đầu!' } ]">
              <a-date-picker v-model:value="form.start_at" format="YYYY-MM-DD HH:mm:ss" show-time @change="handleDateChange" />
            </a-form-item>

            <a-form-item label="Ngày hết hạn" name="expired_at" rules="[ { required: true, message: 'Vui lòng chọn ngày hết hạn!' } ]">
              <a-date-picker v-model:value="form.expired_at" format="YYYY-MM-DD HH:mm:ss" show-time />
            </a-form-item>
          </div>

          <div class="w-[50%]">
            <a-form-item
              class="mr-10"
              label="Trạng thái kích hoạt"
              name="is_active"
              rules="[ { required: true, message: 'Vui lòng chọn trạng thái!' } ]"
            >
              <a-switch v-model:checked="form.is_active" />
            </a-form-item>

            <a-form-item label="Công khai" name="is_public" rules="[ { required: true, message: 'Vui lòng chọn công khai!' } ]">
              <a-switch v-model:checked="form.is_public" />
            </a-form-item>

            <a-form-item label="Giá trị giảm giá" name="discount_value" rules="[ { required: true, message: 'Vui lòng nhập giá trị giảm giá!' } ]">
              <a-input-number  class="w-full" min="0" v-model:value="form.discount_value" />
            </a-form-item>

            <a-form-item
              label="Giá trị giảm giá tối đa"
              name="maximum_discount_value"
              rules="[ { required: true, message: 'Vui lòng nhập giá trị giảm giá tối đa!' } ]"
            >
              <a-input-number class="w-full"  min="0" v-model:value="form.maximum_discount_value" />
            </a-form-item>

            <a-form-item label="Số lượng" name="quantity" rules="[ { required: true, message: 'Vui lòng nhập số lượng!' } ]">
              <a-input-number class="w-full"  min="0" v-model:value="form.quantity" />
            </a-form-item>

            <a-form-item
              label="Số lượng tối thiểu cần thiết"
              name="minimum_quantity_needed"
              rules="[ { required: true, message: 'Vui lòng nhập số lượng tối thiểu!' } ]"
            >
              <a-input-number  class="w-full" min="0" v-model:value="form.minimum_quantity_needed" />
            </a-form-item>
          </div>
        </div>

        <a-form-item class="flex justify-center">
          <a-button type="primary" html-type="submit" class="button w-[200px] mt-5 font-medium bg-[#63B899] rounded-lg text-[17px] h-[40px]"
            >Tạo mới</a-button
          >
        </a-form-item>
      </a-form>
    </div>
  </div>
</template>

<script setup>
import { reactive } from 'vue';
import { useVoucherStore } from '@/stores/voucherSellerStore';
import { format } from 'date-fns';


const voucherStore = useVoucherStore();

const form = reactive({
  coupon_code: '',
  discount_type: 'FIXEDAMOUNT',
  discount_value: 0,
  expired_at: null,
  is_active: false,
  is_public: false,
  maximum_discount_value: 0,
  name: '',
  start_at: null,
  quantity: 0,
  minimum_quantity_needed: 0,
  type_repeat: 'DAILY'
});

function formatDate(date) {
  return date ? format(new Date(date), 'yyyy-MM-dd HH:mm:ss') : null;
}

const handleSubmit = () => {
  form.expired_at = formatDate(form.expired_at);
  form.start_at = formatDate(form.start_at);
  console.log(form.expired_at);
  console.log(form.start_at);
  voucherStore.createVoucher(form);
};
</script>

<style scoped lang="scss">


.button {
  &:hover {
    background-color: #fff;
    color: #63b899;
    box-shadow:
      0 0 10px #63b899,
      0 0 20px #63b899;
  }
}

.voucher {
  box-shadow: rgba(100, 100, 111, 0.2) 0px 7px 29px 0px;
}
</style>
